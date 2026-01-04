// ==UserScript==
// @name         Enhanced Fight Helper
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Combines attack checking/reloading with easy fight button positioning
// @author       Upsilon[3212478], olesien, seintz [2460991], Finaly [2060206], Anxiety [2149726]
// @match        https://www.torn.com/loader.php?sid=attack*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @license      GNU GPLv3
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/538237/Enhanced%20Fight%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/538237/Enhanced%20Fight%20Helper.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // Configuration for easy-fight part
    const outcome = "mug"; // leave, mug, or hosp
    const defaultWeapon = "secondary"; // primary, secondary, melee
    const useTemp = false; // true or false

    // Configuration for Initiate Fight Reload
    const enableInitiateFightReload = true; // true or false

    let allowHit = false;
    let isDone = false;

    // Storage for easy-fight
    var objForStorage = {};
    const buttonSelector = 'div[class^="dialogButtons"]';
    const playerArea = 'div[class^="playerArea"]';
    const customButtonClass = 'custom-fight-btn';
    const storage = {
        selectedOutcome: outcome,
        button: 0,
    };

    storage.selectedIndex = { leave: 0, mug: 1, hosp: 2 }[
        storage.selectedOutcome
    ];

    /* ------------------------- */
    /* Initiate Fight Reload Part */
    /* ------------------------- */

    function doIt(root) {
        const dialogButtons = document.querySelector('div[class^="dialogButtons"]');

        if (dialogButtons && dialogButtons.children.length > 0) {
            return;
        } else if (!dialogButtons) {
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        let userId = urlParams.get("user2ID");
        const buttonEl = document.createElement("button");

        let container;
        if (useTemp) {
            container = document.querySelector('#weapon_temp');
        } else {
            switch(defaultWeapon) {
                case "secondary":
                    container = document.querySelector('#weapon_second');
                    break;
                case "melee":
                    container = document.querySelector('#weapon_melee');
                    break;
                default:
                    container = document.querySelector('#weapon_main');
            }
        }

        if (!container) {
            console.error("Container not found for weapon type:", defaultWeapon);
            return;
        }

        buttonEl.innerText = "Check attackable";
        buttonEl.className = customButtonClass;
        buttonEl.style.backgroundColor = "#262626";
        buttonEl.style.color = "white";
        buttonEl.style.paddingRight = "30px";
        buttonEl.style.paddingLeft = "30px";
        buttonEl.style.paddingTop = "5px";
        buttonEl.style.paddingBottom = "5px";
        buttonEl.addEventListener("click", () => startFight(userId, buttonEl));
        container.appendChild(buttonEl);

        positionCustomButton(buttonEl, defaultWeapon);
    }

    function startFight(userId, buttonEl) {
        buttonEl.innerText = "Initiating...";
        fetch("https://www.torn.com/loader.php?sid=attackData&mode=json", {
            headers: {
                accept: "/",
                "content-type":
                "multipart/form-data; boundary=----WebKitFormBoundary9Tiw3628hDAvs0r9",
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
            if (data) {
                if ("currentAttackStatus" in data && data.currentAttackStatus == "process") {
                    addReloadButton(data, userId, buttonEl);
                } else {
                    buttonEl.innerText = "Retry";
                }
            }
        })
            .catch((error) => {
            console.error(error);
            buttonEl.innerText = "Retry (error)";
        });
    }

    function addReloadButton(data, userId, buttonEl) {
    const parentElement = buttonEl.parentElement;
    parentElement.removeChild(buttonEl);
    const buttonEl2 = document.createElement("button");

    buttonEl2.innerText = "Reload Page";
    buttonEl2.className = customButtonClass;
    buttonEl2.style.backgroundColor = "#262626";
    buttonEl2.style.borderRadius = "10px";
    buttonEl2.style.color = "green";
    buttonEl2.style.padding = "20px";

        buttonEl2.addEventListener("click", () => {
            parentElement.removeChild(buttonEl2);
            location.reload();
        });

        parentElement.insertBefore(buttonEl2, parentElement.firstChild);
        positionCustomButton(buttonEl2, 'primary');
    }

    /* ----------------- */
    /* Easy Fight Part */
    /* ----------------- */

    const config = { attributes: true, childList: true, subtree: true };
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (document.querySelectorAll(buttonSelector).length > 0) moveButton();
        }
    });

    const checkForElement = () => {
        if (document.querySelectorAll(playerArea).length > 0) {
            clearInterval(cd);
            const wrapper = document.querySelector(playerArea);
            observer.observe(wrapper, config);
        }
    };
    let cd = setInterval(checkForElement, 200);

    function waitForKeyElements(element, callbackFunc) {
        objForStorage[element] = setInterval(function () {
            let node = document.querySelector(element);
            if (node) {
                clearInterval(objForStorage[element]);
                callbackFunc(node);
            }
        }, 200);
    }

    function moveButton() {
        const optionsDialogBox = document.querySelector(buttonSelector);
        if (!optionsDialogBox) return;

        const optionsBox = optionsDialogBox.children;

        for (const option of optionsBox) {
            if (option.classList.contains("btn-move")) continue;
            const text = option.innerText.toLowerCase();
            const index = [...option.parentNode.children].indexOf(option)

            if (text.includes("fight")) {
                option.classList.add("btn-move");
                calculateStyle(defaultWeapon, useTemp);
            } else if (storage.selectedIndex == index) {
                option.classList.add("btn-move");
                calculateStyle(defaultWeapon);
                if (!storage.index) {
                    observer.disconnect();
                    storage.index = 69;
                }
            }
        }
    }

    // Nouvelle fonction pour positionner nos boutons personnalisés
    function positionCustomButton(button, weaponType) {
        const size = window.innerWidth;
        const mobileSize = 600;
        const tabletSize = 1000;

        if (size <= mobileSize) {
            button.style.padding = '0';
            button.style.left = '0';
            button.style.top = '0';
            button.style.height = '86px';
            button.style.width = '74px';
        } else {

            let myTop = "18px";
            let myLeft = "17px";

            if (size <= tabletSize && size > mobileSize) {
                myLeft = "16px";
            }

            button.style.left = myLeft;
            button.style.top = myTop;
            button.style.height = '60px';
            button.style.width = '120px';
        }
        button.style.position = 'absolute';
        button.style.zIndex = '1000';
        button.style.margin = '0';
    }

    function restyleCSS(topMobile, topTablet, topDesktop) {
        const size = window.innerWidth;
        const mobileSize = 600;
        const tabletSize = 1000;
        const leftMobile = "-100px";
        const leftTablet = "-140px";
        const leftDesktop = "-151px";
        let myTop = "";
        let myLeft = "";

        if (size <= mobileSize) {
            myTop = topMobile;
            myLeft = leftMobile;
        } else if (size <= tabletSize) {
            myTop = topTablet;
            myLeft = leftTablet;
        } else {
            myTop = topDesktop;
            myLeft = leftDesktop;
        }

        GM_addStyle(`
            div[class^="dialogButtons"] > button[class$="btn-move"],
            button.${customButtonClass} {
                position: absolute;
                left: ${myLeft};
                top: ${myTop};
                height: 60px;
                width: 120px;
                z-index: 1000;
            }
            .playerWindow___aDeDI {
                overflow: visible !important;
            }
            .modelWrap___j3kfA {
                visibility: hidden;
            }`
                   );
    }

    function calculateStyle(defaultWeapon, useTemp = false) {
        let topMobile = "";
        let topTablet = "";
        let topDesktop = "";

        if (useTemp) {
            topMobile = `279px`;
            topTablet = `314px`;
            topDesktop = `314px`;
        } else {
            switch (defaultWeapon) {
                case "primary":
                    topMobile = `10px`;
                    topTablet = `10px`;
                    topDesktop = `10px`;
                    break;
                case "secondary":
                    topMobile = `98px`;
                    topTablet = `112px`;
                    topDesktop = `110px`;
                    break;
                case "melee":
                    topMobile = `188px`;
                    topTablet = `213px`;
                    topDesktop = `213px`;
                    break;
            }
        }
        restyleCSS(topMobile, topTablet, topDesktop);
    }

    /* ----------------- */
    /* Initialization */
    /* ----------------- */

    // Initialize initiate-fight-reload observer
    if (enableInitiateFightReload) {
        const initObserver = new MutationObserver((_, observer) => {
            const root = document.querySelector('#weapon_main');
            if (root) {
                observer.disconnect();
                doIt(root);
            }
        });
        initObserver.observe(document, { subtree: true, childList: true });
    }

    // Initialize easy-fight
    waitForKeyElements(buttonSelector, moveButton);
    window.addEventListener("resize", moveButton);
})();