// ==UserScript==
// @name         Education Unlock Calculator
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Calculates the total time needed to unlock an education.
// @author       NichtGersti [3380912]
// @license      MIT
// @run-at       document-idle
// @match        https://www.torn.com/page.php?sid=education*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com

// @downloadURL https://update.greasyfork.org/scripts/535122/Education%20Unlock%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/535122/Education%20Unlock%20Calculator.meta.js
// ==/UserScript==

//MINIMAL API KEY
//TODO: extensive testing, especially for no course joined

(async function() { //window.addEventListener("load", async () => {
    'use strict';
    let root = document.querySelector("#education-root");

    let prefix = "education-unlock-time-calculator";
    let icon = `<i class="fm-extension-icon"></i>`;
    let mainText = `The userscript "Education Unlock Time Calculator" is running.`;
    let settings = {
        "api-key": localStorage.getItem("education-unlock-time-calculator-api-key") ?? '###PDA-APIKEY###', //Minimal access or above!
    };

    let settingsConfig = [
        {
            id: "api-key",
            label: "API Key (Minimal Access):",
            type: "password",
            value: settings["api-key"],
            validate: (input) => (input.length == 16),
        },
    ];

    injectBanner(root, prefix, icon, mainText, settingsConfig, settings, saveSettingsCallback);


    const userApiRes = await (fetchTornApi(settings["api-key"],"user/?selections=education,perks"));
    const userEducations = userApiRes.education;
    const userPerks = {
        meritPerk: (Number.parseInt(userApiRes.merit_perks.filter(perk => perk.match(/\+ \d+% education length reduction/))[0]?.match(/\d+/)[0]) / 100) || 0,
        stockPerk: userApiRes.stock_perks.includes("+ 10% course time reduction (WSU)") ? 0.1 : 0,
        jobPerk: userApiRes.job_perks.includes("+ 10% course time reduction") ? 0.1 : 0,
    };
    const timeReduction = 1 - objectSum(userPerks);

    const tornEducationsApiRes = await (fetchTornApi(settings["api-key"],"torn/?selections=education"));
   
    const tornEducations = tornEducationsApiRes.education.map((category) => {
        return {
            id: category.id,
            courses: category.courses.map(course => {
                const unlockDuration = category.courses
                .filter(filterCourse =>
                        course.prerequisites.courses.includes(filterCourse.id)
                        && !userEducations.complete.includes(filterCourse.id)
                        && !(userEducations.current
                             && (userEducations.current.id == filterCourse.id))
                       )
                .reduce((acc, filteredCourse) => acc + filteredCourse.duration, 0);
                return {
                    id: course.id,
                    duration: course.duration,
                    prerequisites: course.prerequisites.courses,
                    unlockDuration: unlockDuration,
                };
            }),
        };
    });

    navigation.addEventListener('navigate', inject);
    inject();

    function fetchTornApi(key, selections) {
        return fetch(`https://api.torn.com/v2/${selections}&key=${key}`).then( response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Something went wrong');
        })
            .then( result => {
            if (result.error) {
                switch (result.error.code){
                    case 2:
                        localStorage.setItem("nichtgersti-flying-oc-alert-api", null);
                        console.error("Incorrect Api Key:", result);
                        throw new Error("Incorrect Api Key:");
                    case 9:
                        console.warn("The API is temporarily disabled, please try again later");
                        throw new Error("The API is temporarily disabled, please try again later");
                    default:
                        console.error("Error:", result.error.error);
                        throw new Error(result.error.error);
                        return;
                }
            }
            return result;
        })
    }

    function inject() {
        setTimeout(() => {
            try {
                const href = document.location.href;
                const categoryId = href.match(/category=\d+/)[0].match(/\d+/)[0];
                const courseId = href.match(/course=\d+/)[0].match(/\d+/)[0];
                let unlockDuration = tornEducations.filter((category => category.id == categoryId))[0].courses.filter(course => course.id == courseId)[0].unlockDuration;
                let perkUnlockDuration = unlockDuration * timeReduction;
                if (unlockDuration <= 0) return;
                Array.from(document.querySelectorAll("#education-root .categories___AfufT .mainContent___FB5pl .label___H8zzk"))
                    .filter(node => node.textContent == "Parameters:")[0]
                    .nextSibling
                    .insertAdjacentHTML("beforeend", `
                    <li class="listItem___JP33F">
                        Time left on prerequisites:
                        ${timeReduction < 1 ? '<span class="originParam___j4nxB">' + secondsToString(unlockDuration) + '</span>' : ""}
                        ${secondsToString(perkUnlockDuration)}
                    </li>
                `);
            } catch {};
        }, 100)
    }

    function saveSettingsCallback() {
        localStorage.setItem("education-unlock-time-calculator-api-key", settings["api-key"]);
    }

    function secondsToString(totalSeconds) {
        let days = Math.floor(totalSeconds / 86400);
        let hours = Math.floor(totalSeconds / 3600) % 24;
        let minutes = Math.floor(totalSeconds / 60) % 60;
        let seconds = totalSeconds % 60;

        let timerString = "";
        if (totalSeconds > 86400) timerString += `${days}d `;
        if (totalSeconds > 3600) timerString += `${hours}h `;
        if (totalSeconds > 60) timerString += `${minutes}m`;
        return timerString;
    }

    function sum(array) {
        return array.reduce((a,b) => a+b, 0);
    }

    function objectSum(obj) {
        return sum(Object.values(obj));
    }

    function injectBanner(root, prefix, icon, mainText, settingsConfig, settings, saveSettingsCallback) {
        let wrapper = root.querySelector(".wrapper");
        if (!wrapper) {
            const template = document.createElement('template');
            template.innerHTML = `
                <div aria-live="polite">
                    <div class="wrapper" role="alert" aria-live="polite">
                    </div>
                    <hr class="page-head-delimiter m-top10 m-bottom10">
                </div>
            `;
            wrapper = template.content.firstElementChild.firstElementChild;
            root.firstChild.append(template.content.firstElementChild);
        }

        function singleSettingHTML(config) {
            return `
                <label for="${config.id}">${config.label}</label>
                <input type="${config.type}" id="${config.id}" name="${config.id}" value="${config.value}">
                <br>
                <br>
            `;
        }

        wrapper.insertAdjacentHTML("afterBegin", `
            <div class="info-msg-cont border-round m-top10 blue">
                <div class="info-msg border-round messageWrap___phpSP">
                    ${icon}
                    <div class="delimiter">
                        <div class="msg right-round messageContent___LhCmx">
                            <div style="display:flex;justify-content: space-between;align-items: center;">
                                <span style="display:inline-block;vertical-align:middle">
                                    ${mainText}
                                </span>
                                <div id="${prefix}-settings-button" style="display:inline-block;float:right">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="default___XXAGt" filter="" fill="#fff" stroke="transparent" stroke-width="0" width="28" height="28" viewBox="-6 -4 28 28"><path data-name="Path 7-4" d="M16,5.67a8.47,8.47,0,0,0-.66-1.59,2.57,2.57,0,0,1-2.58-.84A2.48,2.48,0,0,1,12.11.66,8.47,8.47,0,0,0,10.52,0,2.83,2.83,0,0,1,6.71,1.23,2.81,2.81,0,0,1,5.48,0,8.47,8.47,0,0,0,3.89.66a2.48,2.48,0,0,1-.65,2.58,2.57,2.57,0,0,1-2.58.84A8.47,8.47,0,0,0,0,5.67,2.75,2.75,0,0,1,1.54,8,3,3,0,0,1,0,10.52a8.47,8.47,0,0,0,.66,1.59,2.59,2.59,0,0,1,3.23,1.74,2.52,2.52,0,0,1,0,1.49A7.85,7.85,0,0,0,5.48,16a2.83,2.83,0,0,1,5,0,8.47,8.47,0,0,0,1.59-.66,2.48,2.48,0,0,1,.65-2.58,2.57,2.57,0,0,1,2.58-.84A7.85,7.85,0,0,0,16,10.33,2.75,2.75,0,0,1,14.46,8,2.75,2.75,0,0,1,16,5.67ZM8,11.48A3.48,3.48,0,1,1,11.48,8,3.48,3.48,0,0,1,8,11.48Z"></path></svg>
                                </div>
                            </div>
                            <div id="${prefix}-settings" hidden>
                                <hr style="margin-top:10px;margin-bottom:10px">
                                <div style="display:flex;justify-content: space-between;align-items: center;">
                                    <div style="display:inline-block;vertical-align:middle">
                                        ${settingsConfig.reduce((total, config) => total + singleSettingHTML(config), "")}
                                    </div>
                                    <div id="${prefix}-save-settings-button" class="btn torn-btn btn-action-tab btn-dark-bg" style="display:inline-block;float:right">
                                        Save
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `);

        const settingsButton = document.querySelector(`#${prefix}-settings-button`);
        settingsButton.addEventListener("click", () => {
            const settingsNode = document.querySelector(`#${prefix}-settings`);
            settingsNode.hidden = !settingsNode.hidden;
        });
        const saveSettingsButton = document.querySelector(`#${prefix}-save-settings-button`);
        saveSettingsButton.addEventListener("click", () => {
            settingsConfig.forEach(setting => {
                const input = document.querySelector("#" + setting.id)
                if (!setting.validate || setting.validate(input.value)) Object.defineProperty(settings, setting.id, {value: input.value, writable: true, enumerable: true})
                else input.value = settings[setting.id] || ""
            });
            saveSettingsCallback();
        });
    }

//});
})();