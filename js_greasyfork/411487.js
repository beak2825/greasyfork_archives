// ==UserScript==
// @name         CyberCode Online Tools (Deprecated)
// @namespace    -
// @version      0.1.2-prototype-core-seperated-parameters
// @description  Some auto and enhance tools in CyberCode Online.
// @author       LianSheng
// @match        https://cybercodeonline.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411487/CyberCode%20Online%20Tools%20%28Deprecated%29.user.js
// @updateURL https://update.greasyfork.org/scripts/411487/CyberCode%20Online%20Tools%20%28Deprecated%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    //////////////////////////////////////// 
    const CONFIG = {
        targetLevel: 70,
        loggingLevel: 1,
        repairCycle: 20,
        run: true
    }
    ////////////////////////////////////////

    let calcTargetLevel = CONFIG.targetLevel;
    if (CONFIG.targetLevel % 10 === 0) {
        calcTargetLevel--;
    }


    let refreshChecker;

    let logType = {
        important: true,
        info: true,
        verbose: false,
        danger: true,
        error: true
    };

    // 0: none, 1: info, 2: debug.
    let loggingLevel = CONFIG.loggingLevel;

    let lastPosition = {
        code: -1,
        type: "INIT"
    };

    // common date: store all major variables.
    let commonData = {};

    let lastTakeAll = 0; // timeout id

    let lastRepair = 0; // timestamp
    let lastRepairCount = 0;
    const repairCycle = CONFIG.repairCycle;

    // left bottom bar version status;
    let changeStatus = {
        originVer: "",
        changed: false
    };

    commonData.run = {};
    commonData.run.allowClick = CONFIG.run;

    /**
     * Do `element.click()` if allow click now.
     * @param  {[Node]} element
     * @param  {[boolean]} [force=false]
     */
    commonData.run.click = (element, force=false) => {
        if(force) {
            element.click();
        } else {
            if (commonData.run.allowClick) {
                element.click();
            }
        }        
    }

    // type: 0 string, 1 object
    function log(data, type = 0, more = "") {
        if (loggingLevel == 1) {
            let prefix = "[CCOT INFO]"

            if (type == 0) {
                console.log(`%c${prefix} %c${data}`, "color: lightblue", "color: default");
            }
        } else if (loggingLevel == 2) {
            if (type == 0) {
                let prefix = "[CCOT INFO]"
                console.log(`%c${prefix} %c${data}`, "color: green", "color: default");
            } else {
                let prefix = "[CCOT DEBUG]"
                let additionalMessage = "";
                if (more != "") additionalMessage = `(${more})`;
                console.log(`%c${prefix} %c${additionalMessage}\n`, "color: orange", "color: default", data);
            }
        }
    }

    // check now scene.
    function checkScenario(container) {
        let all = container.innerText.replace(/\n/g, "");
        let newPosition;

        if (all.includes("---- Nearby Enemies ----")) {
            newPosition = {
                code: 0,
                type: "Nearby Enemies"
            };
        } else if (all.includes("---- You ----")) {
            newPosition = {
                code: 1,
                type: "Enemy Battle"
            };
        } else if (all.includes("---- Enemy drops ----")) {
            newPosition = {
                code: 2,
                type: "Enemy Drops"
            };
        } else if (all.includes("[Central Hub]") && all.includes("SHANGRI_LA_CITY_CENTER")) {
            newPosition = {
                code: 3,
                type: "SHANGRI_LA_CITY_CENTER"
            };
        } else if (all.includes("exportclassWeaponSmithextendsNPC")) {
            newPosition = {
                code: 4,
                type: "WeaponSmith"
            };
        } else if (all.includes("currentLocation=Location.HYPER_TRAIN_CENTRAL_STATION")) {
            newPosition = {
                code: 5,
                type: "MAIN_STATION"
            };
        } else if (all.includes("---- Travel ----") && !all.includes("---- Market ----")) {
            newPosition = {
                code: 6,
                type: "SUB_STATION"
            };
        } else {
            newPosition = {
                code: 999,
                type: "Unknown"
            };
        }

        if (newPosition.code == lastPosition.code) {
            if ([1, 3, 4].includes(lastPosition.code)) {
                log(`Scenario Transfer: ${lastPosition.type} (${lastPosition.code}) -> ${newPosition.type} (${newPosition.code})`);
                lastPosition = newPosition;
                changeLeftBottomBarStatus();

                return newPosition;
            } else {
                newPosition = {
                    code: 999,
                    type: "Unknown"
                };
                return newPosition;
            }
        } else {
            log(`Scenario Transfer: ${lastPosition.type} (${lastPosition.code}) -> ${newPosition.type} (${newPosition.code})`);
            lastPosition = newPosition;
            changeLeftBottomBarStatus();

            return newPosition;
        }
    }

    // change left bottom status string.
    function changeLeftBottomBarStatus() {
        let target = document.querySelector("div[class*=BottomBar_container] p:first-child");
        let status;

        if (!changeStatus.changed) {
            changeStatus.changed = true;
            changeStatus.originVer = target.innerText;
        }

        if (commonData.run.allowClick) {
            status = "Running";
        } else {
            status = "Ready";
        }

        let progressEquals = Math.min(Math.floor((lastRepairCount / repairCycle) * 10), repairCycle, 9);
        let progressDash = Math.max(9 - progressEquals, 0);
        progressEquals = "<span>=</span>".repeat(progressEquals);
        progressDash = "-".repeat(progressDash);
        let progress = `CCOT: [${progressEquals}<span>></span>${progressDash}] (${lastRepairCount}/${repairCycle})`;

        let nowPlace = `${lastPosition.type} (#${lastPosition.code})`;

        let newStatus = `${changeStatus.originVer} | ${status} | ${progress} | ${nowPlace}`;
        target.innerHTML = newStatus;
    }

    // main function
    function main(mr) {
        let mainContainer = commonData.mainContainer;
        let click = commonData.run.click;

        let records = Object.values(mr);
        let filterTips;

        if (mr != "INIT") {
            filterTips = records.filter(each => {
                let modified = [...each.addedNodes].concat([...each.removedNodes])[0];

                try {
                    return modified.className.match("CodeToolTip_toolTip") != null
                } catch (e) {
                    return false;
                }
            });

            //             log(`Refresh Checker Report:
            // There are total ${records.length} node(s) was changed. Includes:
            // - Tips : x${filterTips.length}
            // - Other: x${records.length - filterTips.length}`);
            // log(records, 1, "Mutation Records");
        } else {
            filterTips = [];
        }

        // Exclude tips only.
        if (records.length > filterTips.length) {
            // {code: xxx, type: "xxxxx"}
            let nowScenario = checkScenario(mainContainer);
            let p = [...mainContainer.querySelectorAll("p")];
            let p2 = [...mainContainer.querySelectorAll("p[class*=clickable]")];

            if (nowScenario.code == 0) {
                log(lastRepairCount, 1);
                lastRepairCount++;
                clearTimeout(lastTakeAll);

                if (lastRepairCount >= repairCycle) {
                    let action = p.filter(each => each.innerText == "backToCityCenter")[0];
                    click(action);
                } else {
                    let target = calcTargetLevel;
                    let action = p2.filter(each => each.innerText.includes(`_lv${target}`));

                    if (action.length > 0) {
                        click(action[0]);
                    } else {
                        // Make sure to continue to trigger event of MutationObserver.
                        log("Target level not found, back to city center. (Extremely rare.)");
                        let action = p.filter(each => each.innerText == "backToCityCenter")[0];
                        click(action);
                    }
                }
            } else if (nowScenario.code == 1) {
                let action = p2.filter(each => each.innerText == "primaryAttack")[0];
                click(action);
            } else if (nowScenario.code == 2) {
                // only take specific loot.
                let exclude = ["trash", "highQuality", "energyCell", "antiMatterCharge"];
                let include = ["highQualityUpgrade"];

                let loots = [...mainContainer.querySelectorAll("div[style*='cursor: pointer;'] p[style*='color: rgb(135, 189, 217);']")];
                let skipExclude = loots.filter(each => {
                    for (let i = 0; i < exclude.length; i++) {
                        if (each.innerText.includes(exclude[i])) return false;
                    }

                    return true;
                });
                let onlyInclude = loots.filter(each => {
                    for (let i = 0; i < include.length; i++) {
                        if (each.innerText.includes(include[i])) return true;
                    }

                    return false;
                });

                let wannaTake = skipExclude.concat(onlyInclude);
                wannaTake = [...new Set(wannaTake)];

                if (wannaTake.length > 0) {
                    wannaTake.map(each => click(each));
                } else {
                    let action = p2.filter(each => each.innerText == "close")[0];
                    click(action);
                }

                lastTakeAll = setTimeout(() => {
                    log("Reach inventory max, cannot take more drop. Closed.");
                    let action = p2.filter(each => each.innerText == "close")[0];
                    click(action);
                }, 5000);
            } else if (nowScenario.code == 3) {
                if (lastPosition.code == -1 || Date.now() - lastRepair >= 60000 || lastRepairCount >= repairCycle) {
                    let action = p.filter(each => each.innerText == "weaponSmith")[0];
                    click(action);
                    lastRepair = Date.now();
                } else {
                    let action = p2.filter(each => each.innerText == "goToHyperTrainCentralStation")[0];
                    click(action);
                }
            } else if (nowScenario.code == 4) {
                if (Date.now() - lastRepair >= 60000 || lastRepairCount >= repairCycle) {
                    // repair
                    lastRepairCount = 0;
                    let action = p2.filter(each => each.innerText == "repairAllEquipped");
                    if (action.length > 0) {
                        log("Weapon Smith: repaired all equipments.")
                        click(action[0]);
                    } else {
                        log("Weapon Smith: nothing to repair.")
                    }

                } else {
                    // back
                    setTimeout(() => {
                        let action = [...document.querySelectorAll("span[style*='color']")].filter(each => each.innerText == "Surrounding.ts")[0];
                        click(action);
                    }, 1500);
                }
            } else if (nowScenario.code == 5) {
                let target = Math.floor(calcTargetLevel / 10);
                let action = p2.filter(each => each.innerText.includes("goTo"))[target];
                click(action);
            } else if (nowScenario.code == 6) {
                let target = Math.floor((calcTargetLevel % 10 - 1) / 3);
                console.log(target);
                let action = p2.filter(each => each.innerText.includes("goTo"))[target];
                click(action);
            }
        }
    }



    let id = setInterval(() => {
        let click = commonData.run.click;
        if (!refreshChecker && document.querySelector("div[style='flex-direction: row; flex: 1 1 0%;'] > div[style='flex: 1 1 0%;']")) {
            clearInterval(id);

            // Add Leftbar 'SET' button.
            let setHTML = `<div style="box-sizing: border-box; cursor: pointer; width: 100%; height: 50px; justify-content: center; align-items: center; position: relative; user-select: none;">SET</div>`;
            document.querySelector("div[class^='NavBar_navBar'] > div > div").insertAdjacentHTML("beforeend", setHTML);
            log(`Leftbar 'SET' button added.`);

            // Main Container
            commonData.mainContainer = document.querySelector("div[style='flex-direction: row; flex: 1 1 0%;'] > div[style='flex: 1 1 0%;']");

            // Left Sidebar
            commonData.left = {};
            commonData.left._buttonStat = document.querySelector("div[class^='NavBar_navBar'] > div > div > div:nth-child(1)");
            commonData.left._buttonBranch = document.querySelector("div[class^='NavBar_navBar'] > div > div > div:nth-child(2)");
            commonData.left._buttonMail = document.querySelector("div[class^='NavBar_navBar'] > div > div > div:nth-child(3)");
            commonData.left._buttonDiscord = document.querySelector("div[class^='NavBar_navBar'] > div > div > div:nth-child(4)");

            commonData.left.buttonSetting = document.querySelector("div[class^='NavBar_navBar'] > div > div > div:nth-child(5)");
            commonData.left.container = document.querySelector("div[class^='NavBar_navBar'] > div:nth-child(2)");

            // click event
            commonData.left.buttonSetting.onclick = () => {
                // using discord's container
                click(commonData.left._buttonDiscord, true);
                log(commonData.left, 1);
                // commonData.left._buttonDiscord.firstElementChild.style.display = "none";

                let title = commonData.left.container.querySelector(":nth-child(1)");
                let body = commonData.left.container.querySelector(":nth-child(2)");
                let foot = commonData.left.container.querySelector(":nth-child(3)");

                title.innerText = "Setting";
                body.innerHTML = "";
                foot.innerHTML = "";
            }

            main("INIT");

            refreshChecker = new MutationObserver(mr => {
                try {
                    main(mr);
                } catch (e) {
                    log(e.message);
                }
            });
            refreshChecker.observe(commonData.mainContainer, {
                "childList": true,
                "subtree": true
            });

            log(`Refresh checker binded.`);
        }
    }, 100);
})();