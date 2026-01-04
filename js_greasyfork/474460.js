// ==UserScript==
// @name         Crypto-Bros Highlighter
// @namespace    hardy.crypto.highlighter
// @version      0.1
// @description  Highlights Crypto, JFK and ROD alliance members
// @author       Father [2131687]
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @run-at       document-start
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/474460/Crypto-Bros%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/474460/Crypto-Bros%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const settings = {"hostile": true};
    const factionsToAvoid = [];
    const usersToAvoid = [];
    const CRYBABIES = [19, 89, 230, 478, 946, 1117, 1117, 2736, 5431, 7049, 7197, 7818, 8124, 8151, 8205, 8317, 8400, 8537, 8836, 8867, 8938, 9036, 9041, 9305, 9517, 9689, 10566, 10610, 10850, 10856, 12912, 13343, 13665, 13842, 14052, 15151, 16053, 16312, 16503, 16628, 18090, 18569, 18714, 19060, 21368, 22295, 22680, 26043, 26154, 30009, 31397, 34247, 36274, 37595, 37803, 38761, 40200, 40420, 40449, 41218, 41218, 41419, 41702, 41775, 41853, 42263, 42681, 42872, 44404, 44445, 44758, 44865, 45465, 46666, 46708, 48140, 48277, 48628, 48673, 49164];
    const JFK = [355, 3241, 6924, 7652, 7986, 8076, 8422, 8715, 9100, 9356, 9405, 9674, 9953, 10174, 10741, 11428, 11796, 14365, 14821, 16335, 16424, 20465, 21234, 21665, 23952, 25001, 25874, 26312, 27902, 31764, 32781, 35776, 36134];
    const ROD = [525, 937, 2013, 6780, 6834, 6974, 7227, 7935, 7990, 8285, 8811, 9280, 9357, 11376, 11782, 12894, 12905, 13307, 13377, 13872, 14686, 15154, 15644, 16247, 16296, 16634, 17587, 17991, 18597, 20747, 21716, 23193, 23492, 27312, 27554, 28205, 28349, 33458, 33783, 35840, 36140, 37093, 37185, 37498, 38887, 39531, 39960, 40624, 40905, 40951, 40959, 41164, 41234, 41297, 41593, 42505, 43325, 43836, 44467, 44562, 45595, 46089, 46127, 46442, 47100, 48002, 48112, 48680, 48832, 48989, 49169, 49184, 49346, 49763];
    [JFK, ROD, CRYBABIES].forEach(alliance => {
        for (const faction of alliance) {
            factionsToAvoid.push(faction.toString());
        }
    });
    let waitObj = {};
    waitForElement(`#profile-mini-root`, 1000, 999999999, "xgadvjvjdvjvsejfvv").then((element) => {
        const check = document.querySelector('div[class*="profile-mini-_userProfileWrapper__"]');
        if (check) {
            miniProfile(check);
        }
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                mutation.addedNodes.forEach((addedNode) => {
                    miniProfile(addedNode);
                });
            }
        });
        const observerConfig = {
            childList: true,
            subtree: true
        };
        observer.observe(element, observerConfig);
    }).catch(error => {
        console.log(error);
    });
    function waitForElement(selector, duration, maxTries, identifier) {
        return new Promise(function(resolve, reject) {
            const value = Math.floor(Math.random() * 1000000000);
            waitObj[identifier] = value;
            let attempts = 0;
            const intervalId = setInterval(() => {
                if (attempts > maxTries){
                    clearInterval(intervalId);
                    reject(`Selector Listener Expired: ${selector}, Reason: Dead bcoz u didnt cum on time!!!!`);
                } else if (waitObj[identifier] !== value) {
                    clearInterval(intervalId);
                    reject(`Selector Listener Expired: ${selector}, Reason: Dead coz u didnt luv me enough and got another SeLecTor!!!!`);
                }
                const element = document.querySelector(selector);
                if (element) {
                    clearInterval(intervalId);
                    resolve(element);
                }
                attempts += 1;
            }, duration);
        });
    }
    function hospitalHandler() {
        waitForElement(`.user-info-list-wrap a[href*="profiles.php?XID="]`, 700, 15, "vdghafhctrwcxZBNxdsvvwdvyvkdwlhqdns").then((element) => {
            const liList = document.querySelector("ul.user-info-list-wrap").children;
            for (const li of liList) {
                let factionID;
                try {
                    factionID = li.querySelector(`a[href*="factions.php?step=profile&ID="]`).href.split("&ID=")[1];
                } catch (error) {
                    factionID = "0";
                }
                const userID = li.querySelector(`a[href*="profiles.php?XID="`).href.split("profiles.php?XID=")[1];
                if (usersToAvoid.indexOf(userID) !== -1) {
                    li.classList.add("hardy-hostile-user-color");
                } else if (factionsToAvoid.indexOf(factionID) !== -1) {
                    li.classList.add("hardy-hostile-faction-color");
                }
            }
        }).catch(error => {
            console.log(error);
        });
    }
    const page = window.location.href;
    if (page.includes("torn.com/profiles.php?XID=")) {
        waitForElement(`.basic-information ul.info-table`, 500, 10, "fyvghscgfgfwgefcyrfyugiasbdb").then((element) => {
            const userID = element.querySelector(`li`).innerText.replace(/s/g, "").split("[")[1].split("]")[0];
            let factionID;
            try {
                const factionLink = element.querySelector(`a[href*="factions.php?step=profile&ID="]`).href;
                factionID = factionLink.split("&ID=")[1].split("&")[0];
            } catch(error) {
                factionID = "0";
            }
            if (usersToAvoid.indexOf(userID) !== -1) {
                document.querySelector("#profileroot").classList.add("hardy-hostile-user-color");
            } else if (factionsToAvoid.indexOf(factionID) !== -1) {
                document.querySelector(".profile-container").classList.add("hardy-hostile-faction-color");
            }
        }).catch(error => {
            console.log(error);
        });
    } else if (page.includes("hospitalview.php")) {
        window.onhashchange = hospitalHandler;
        hospitalHandler();
    } else if (page.includes("factions.php?step=profile&")) {
        waitForElement(`.members-list ul.table-body a[href*="factions.php?step=profile&ID="]`, 700, 15, "dcvgasvcfgejgdkqwldbavdgcqgedhldbjdkkabksabdk").then((element) => {
            const factionID = element.href.split("&ID=")[1].split("&")[0];
            const ul = document.querySelector(".members-list ul.table-body");
            if (factionsToAvoid.indexOf(factionID) !== -1) {
                ul.classList.add("hardy-hostile-faction-color");
            } else {
                const liList = ul.children;
                for (const li of liList) {
                    const userID = li.querySelector(`a[href*="profiles.php?XID="`).href.split("profiles.php?XID=")[1];
                    if (usersToAvoid.indexOf(userID) !== -1) {
                        li.classList.add("hardy-hostile-user-color");
                    }
                }
            }
        }).catch(error => {
            console.log(error);
        });
    }
    function miniProfile(element) {
        if (element.className && element.className.includes('profile-mini-_userProfileWrapper__')) {
            let factionID;
            try {
                factionID = element.querySelector(`a[href*="factions.php?step=profile&ID="]`).href.split("&ID=")[1];
            } catch (error) {
                factionID = "0";
            }
            const userID = element.querySelector(`a[href*="profiles.php?XID="`).href.split("profiles.php?XID=")[1];
            if (usersToAvoid.indexOf(userID) !== -1) {
                element.classList.add("hardy-hostile-user-color");
            } else if (factionsToAvoid.indexOf(factionID) !== -1) {
                element.classList.add("hardy-hostile-faction-color");
            }
        }
    }
    if (settings.hostile) {
        GM_addStyle(`.hardy-hostile-user-color, .hardy-hostile-user-color .profile-container {background-color: #d9adad!important;} .hardy-hostile-faction-color, .hardy-hostile-faction-color .profile-container {background-color: #d9adad!important;}`);
    }
})();