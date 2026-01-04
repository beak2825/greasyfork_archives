// ==UserScript==
// @name         Attack Reload V2
// @namespace    http://tampermonkey.net/
// @version      1.02
// @description  Refresh attack screen
// @author       olesien
// @match        https://www.torn.com/loader.php?sid=attack&user2ID=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451247/Attack%20Reload%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/451247/Attack%20Reload%20V2.meta.js
// ==/UserScript==

(function () {
    "use strict";

    //Not loading
    let allowHit = false;
    let mugType = "mug";

    //Load type from localstorage. This is normally set in another script. Default is mug
    const typeFromLocal = localStorage.getItem("torn-attack-type");
    if (typeFromLocal) {
        if (typeFromLocal == "1") {
            //Leave
            mugType = "leave";
        } else if (typeFromLocal == "2") {
            //Mug
            mugType = "mug";
        } else if (typeFromLocal == "3") {
            //Hosp
            mugType = "hospitalize";
        }
    }
    let attackSlot = 3;

    //Load slot from localstorage. Default is melee
    const slotFromLocal = localStorage.getItem("torn-attack-slot");
    if (slotFromLocal) {
        attackSlot = Number(slotFromLocal);
    }

    const observer = new MutationObserver((_, observer) => {
        let wrapper = document.querySelector(".playersModelWrap___dkqHO");
        if (wrapper) {
            observer.disconnect();
            doIt()
        }
    });

    observer.observe(document, { subtree: true, childList: true });

    function doIt() {
        console.log("Adding");
        const urlParams = new URLSearchParams(window.location.search);
        let userId = urlParams.get("user2ID");
        const buttonContainerEl = document.querySelector(
            ".player___wiE8R .result___VUCXY"
        );
        const buttonEl = document.createElement("button");
        //button styling
        buttonEl.innerText = "Refresh";
        buttonEl.style.backgroundColor = "#262626";
        buttonEl.style.borderRadius = "10px";
        buttonEl.style.color = "white";
        buttonEl.style.paddingRight = "30px";
        buttonEl.style.paddingLeft = "30px";
        buttonEl.style.paddingTop = "5px";
        buttonEl.style.paddingBottom = "5px";
        allowHit = true;
        buttonEl.addEventListener("click", () => loadData(userId, buttonEl));
        //buttonEl.addEventListener("click", () => checkAttackableV2(userId, buttonEl));
        if (buttonContainerEl) {
            console.log(buttonContainerEl);
            buttonContainerEl.insertBefore(buttonEl, buttonContainerEl.firstChild);
        } else {
            let backup = document.querySelector(".statusBarWrap___zVAGE .result___VUCXY");
            if (backup) {
                backup.insertBefore(buttonEl, backup.firstChild);
            } else {
               console.error("Backup failed");
            }
        }
        
    }

    function loadData(userId, buttonEl) {
        if (!allowHit) return;
        if (!userId) {
            return alert("No user id?");
        }
        buttonEl.innerText = "Reloading...";
        //Get request to see if user is hittable
        fetch(
            `https://www.torn.com/loader.php?sid=attackData&mode=json&user2ID=${userId}`,
            {
                headers: {
                    accept: "/",
                    "accept-language": "sv,en;q=0.9,en-GB;q=0.8,en-US;q=0.7",
                    "sec-ch-ua-mobile": "?1",
                    "sec-ch-ua-platform": `"Android"`,
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-requested-with": "XMLHttpRequest",
                },
                referrer: `https://www.torn.com/loader.php?sid=attack&user2ID=${userId}`,
                referrerPolicy: "strict-origin-when-cross-origin",
                body: null,
                method: "GET",
                mode: "cors",
                credentials: "include",
            }
        )
            .then((response) => response.json())
            .then((data) => checkAttackable(data, userId, buttonEl))
            .catch((error) => {
            allowHit = true;
            console.error(error);
            buttonEl.innerText = "Restart reload";
        });
    }

    function checkAttackable(data, userId, buttonEl) {
        console.log("data", data);
        allowHit = true;
        // Find all submit buttons that are disabled and have the class 'torn-btn'
        const disabledSubmitButtons = document.querySelectorAll('button[type="submit"].torn-btn.disabled');

        let startFightButtonDisabled = false;
        // Check if at least one matching button is found
        if (disabledSubmitButtons.length > 0) {
            startFightButtonDisabled = true;
        }

        if ("startErrorTitle" in data || startFightButtonDisabled) {
            //Not attackable
            buttonEl.innerText = "Refresh again";
        } else {
            if (
                "attackStatus" in data.DB &&
                data.DB.attackStatus == "notStarted"
            ) {
                //Normal
                //Attackable
                //buttonEl.innerText = "wee attackable"
                const parentElement = buttonEl.parentElement;
                parentElement.removeChild(buttonEl);

                const buttonEl2 = document.createElement("button");
                buttonEl2.innerText = "Start Fight";
                buttonEl2.style.backgroundColor = "#262626";
                buttonEl2.style.borderRadius = "10px";
                buttonEl2.style.color = "white";
                buttonEl2.style.paddingRight = "30px";
                buttonEl2.style.paddingLeft = "30px";
                buttonEl2.style.paddingTop = "5px";
                buttonEl2.style.paddingBottom = "5px";
                buttonEl2.addEventListener("click", () =>
                                           startFight(userId, buttonEl2)
                                          );
                parentElement.insertBefore(buttonEl2, parentElement.firstChild);
            } else {
                const parentElement = buttonEl.parentElement;
                parentElement.removeChild(buttonEl);

                const text = document.createElement("p");
                text.innerText = "Battle has already started!";
                parentElement.insertBefore(text, parentElement.firstChild);
            }
        }
    }

    function startFight(userId, buttonEl) {
        if (!allowHit) return;
        allowHit = false;
        console.log("start FIGHTTT");
        buttonEl.innerText = "Starting...";
        //Send request to start fight if user is hittable
        fetch("https://www.torn.com/loader.php?sid=attackData&mode=json", {
            headers: {
                accept: "/",
                "accept-language": "sv,en;q=0.9,en-GB;q=0.8,en-US;q=0.7",
                "content-type":
                "multipart/form-data; boundary=----WebKitFormBoundary9Tiw3628hDAvs0r9",
                "sec-ch-ua-mobile": "?1",
                "sec-ch-ua-platform": `"Android"`,
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest",
            },
            referrer: `https://www.torn.com/loader.php?sid=attack&user2ID=${userId}`,
            referrerPolicy: "strict-origin-when-cross-origin",
            body: `------WebKitFormBoundary9Tiw3628hDAvs0r9\r\nContent-Disposition: form-data; name="step"\r\n\r\nstartFight\r\n------WebKitFormBoundary9Tiw3628hDAvs0r9\r\nContent-Disposition: form-data; name="user2ID"\r\n\r\n${userId}\r\n------WebKitFormBoundary9Tiw3628hDAvs0r9--\r\n`,
            method: "POST",
            mode: "cors",
            credentials: "include",
        })
            .then((response) => response.json())
            .then((data) => {
            allowHit = true;
            if (data) {
                if (
                    "currentAttackStatus" in data &&
                    data.currentAttackStatus == "process"
                ) {
                    //Normal
                    startedFight(data, userId, buttonEl);
                } else {
                    //Handle it?
                    console.log("failed-data", data);
                    buttonEl.innerText = `Fail: ${data.DB.error}`;
                }
            }
        })
            .catch((error) => {
            allowHit = true;
            console.error(error);
            buttonEl.innerText = "Restart fight";
        });
    }

    function startedFight(data, userId, buttonEl) {
        console.log(data);
        if (
            data &&
            "currentAttackStatus" in data &&
            data.currentAttackStatus == "process"
        ) {
            //Fight started
            allowHit = true;
            const parentElement = buttonEl.parentElement;
            parentElement.removeChild(buttonEl);

            const buttonEl2 = document.createElement("button");
            //button styling
            buttonEl2.innerText = "Hit (melee)";
            //buttonEl.style.width = "100%";
            buttonEl2.style.backgroundColor = "#262626";
            buttonEl2.style.borderRadius = "10px";
            buttonEl2.style.color = "white";
            buttonEl2.style.padding = "20px";

            // const urlParams = new URLSearchParams(window.location.search);
            // let userId = urlParams.get("userId");
            // let ttitemId = urlParams.get("tt_itemid");
            // console.log("ITEM ID : -------------" + ttitemId);
            buttonEl2.addEventListener("click", () =>
                                       doAttack(userId, buttonEl2)
                                      );
            parentElement.insertBefore(buttonEl2, parentElement.firstChild);
        } else {
            buttonEl.innerText = "Attack start attempt failed. try again";
        }
    }

    function doAttack(userId, buttonEl) {
        //dO ATTACK
        console.log("trying to hit");
        if (!allowHit) return;
        buttonEl.innerText = "Hitting...";
        allowHit = false;
        //Do a hit
        fetch("https://www.torn.com/loader.php?sid=attackData&mode=json", {
            headers: {
                accept: "*/*",
                "accept-language": "sv,en;q=0.9,en-GB;q=0.8,en-US;q=0.7",
                "content-type":
                "multipart/form-data; boundary=----WebKitFormBoundaryq2BO0xBeo8QrC3cm",
                "sec-ch-ua-mobile": "?1",
                "sec-ch-ua-platform": '"Android"',
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest",
            },
            referrer: `https://www.torn.com/loader.php?sid=attack&user2ID=${userId}`,
            referrerPolicy: "strict-origin-when-cross-origin",
            body: `------WebKitFormBoundaryq2BO0xBeo8QrC3cm\r\nContent-Disposition: form-data; name=\"step\"\r\n\r\nattack\r\n------WebKitFormBoundaryq2BO0xBeo8QrC3cm\r\nContent-Disposition: form-data; name=\"user2ID\"\r\n\r\n${userId}\r\n------WebKitFormBoundaryq2BO0xBeo8QrC3cm\r\nContent-Disposition: form-data; name=\"user1EquipedItemID\"\r\n\r\n${attackSlot}\r\n------WebKitFormBoundaryq2BO0xBeo8QrC3cm--\r\n`,
            method: "POST",
            mode: "cors",
            credentials: "include",
        })
            .then((response) => response.json())
            .then((data) => {
            const DB = data?.db;

            if (data && "DB" in data && "currentFightHistory" in data.DB) {
                const currentFightHistory = data.DB.currentFightHistory;
                const lastHit = currentFightHistory[0];
                const attackerId = data?.DB?.attackerUser?.userID;
                if (
                    lastHit.result == "won" &&
                    lastHit.attackerID == attackerId
                ) {
                    //We won
                    const parentElement = buttonEl.parentElement;
                    parentElement.removeChild(buttonEl);

                    const buttonEl2 = document.createElement("button");
                    //button styling
                    buttonEl2.innerText = mugType;
                    //buttonEl.style.width = "100%";
                    buttonEl2.style.backgroundColor = "#262626";
                    buttonEl2.style.borderRadius = "10px";
                    buttonEl2.style.color = "darkgreen";
                    buttonEl2.style.paddingRight = "30px";
                    buttonEl2.style.paddingLeft = "30px";
                    buttonEl2.style.paddingTop = "5px";
                    buttonEl2.style.paddingBottom = "5px";

                    buttonEl2.addEventListener("click", () =>
                                               finish(userId, buttonEl2)
                                              );
                    parentElement.insertBefore(
                        buttonEl2,
                        parentElement.firstChild
                    );
                } else if (lastHit.result == "won") {
                    // We lost or someone beat us to it
                    buttonEl.innerHTML =
                        "specialOutcome" in lastHit
                        ? lastHit.specialOutcome
                    : `<b>${lastHit.text}</b>`;
                } else if (
                    lastHit.result == "lost" &&
                    lastHit.defenderId == attackerId
                ) {
                    // We lost or someone beat us to it
                    buttonEl.innerText = "You lost lmao";
                } else {
                    //Go on as always..
                    allowHit = true;
                    buttonEl.innerText = `Hit ${
                    data.DB?.defenderUser.life +
                        " / " +
                        data.DB?.defenderUser.maxlife
                }`;
                }
            } else {
                //No reply..
                allowHit = true;
                buttonEl.innerText = "Retry";
            }
        })
            .catch((error) => {
            console.error(error);
            allowHit = true;
            buttonEl.innerText = "Retry hit";
        });
    }

    function finish(userId, buttonEl) {
        const parentElement = buttonEl.parentElement;
        parentElement.removeChild(buttonEl);
        buttonEl.innerText = "Finishing...";
        //If user is dead, finish them up with leaving/mugging/hosping
        fetch("https://www.torn.com/loader.php?sid=attackData&mode=json", {
            headers: {
                accept: "*/*",
                "accept-language": "sv,en;q=0.9,en-GB;q=0.8,en-US;q=0.7",
                "content-type":
                "multipart/form-data; boundary=----WebKitFormBoundaryEwJsXB5e5kyAA4Ys",
                "sec-ch-ua-mobile": "?1",
                "sec-ch-ua-platform": '"Android"',
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest",
            },
            referrer: `https://www.torn.com/loader.php?sid=attack&user2ID=${userId}`,
            referrerPolicy: "strict-origin-when-cross-origin",
            body: `------WebKitFormBoundaryEwJsXB5e5kyAA4Ys\r\nContent-Disposition: form-data; name=\"step\"\r\n\r\nfinish\r\n------WebKitFormBoundaryEwJsXB5e5kyAA4Ys\r\nContent-Disposition: form-data; name=\"fightResult\"\r\n\r\n${mugType}\r\n------WebKitFormBoundaryEwJsXB5e5kyAA4Ys--\r\n`,
            method: "POST",
            mode: "cors",
            credentials: "include",
        })
            .then((response) => response.json())
            .then((data) => {
            const buttonEl2 = document.createElement("p");
            if (data && "info" in data) {
                const info = data.info;
                buttonEl2.innerText = info.info;
                buttonEl2.style.color = "darkgreen";
            } else {
                buttonEl2.innerText = "Finish Failed :/";
                buttonEl2.style.color = "red";
            }
            parentElement.insertBefore(buttonEl2, parentElement.firstChild);
        })
            .catch((error) => {
            console.error(error);
        });
    }
})();