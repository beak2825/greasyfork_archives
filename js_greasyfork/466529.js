// ==UserScript==
// @name         WhiskZey
// @namespace    zero.whiskzey.torn
// @version      0.3
// @description  move start fight and outcome button for easy click
// @author       -zero [2669774], seintz [2460991], Whiskey_Jack [1994581]
// @license      GNU GPLv3
// @run-at       document-start
// @match        https://www.torn.com/loader.php?sid=attack*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/466529/WhiskZey.user.js
// @updateURL https://update.greasyfork.org/scripts/466529/WhiskZey.meta.js
// ==/UserScript==

const outcome = "hosp"; // leave, mug, or hosp
const defaultWeapon = "primary"; // primary, secondary, melee
const useTemp = false; // true or false
 
/*
* -------------------------------------------------------------------------
* |    DO NOT MODIFY BELOW     |
* -------------------------------------------------------------------------
*/
 
var objForStorage = {};
const buttonSelector = 'div[class^="dialogButtons"]';
const playerArea = 'div[class^="playerArea"]';
const storage = {
    selectedOutcome: outcome,
    button: 0,
};
 
storage.selectedIndex = { leave: 0, mug: 1, hosp: 2 }[
    storage.selectedOutcome
];
 
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
 
function restyleCSS(topMobile, topTablet, topDesktop) {
    const size = window.innerWidth;
    const mobileSize = 600;
    const tabletSize = 1000;
    const leftMobile = "-100px";
    const leftTablet = "-140px";
    const leftDesktop = "-150px";
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
        div[class^="dialogButtons"] > button[class$="btn-move"] {
            position: absolute;
            left: ${myLeft};
            top: ${myTop};
            height: 60px;
            width: 120px}
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
        topMobile = `192.5px`;
        topTablet = `297.5px`;
        topDesktop = `297.5px`;
    } else {
        switch (defaultWeapon) {
            case "primary":
                topMobile = `10px`;
                topTablet = `10px`;
                topDesktop = `10px`;
                break;
            case "secondary":
                topMobile = `75px`;
                topTablet = `110px`;
                topDesktop = `110px`;
                break;
            case "melee":
                topMobile = `140px`;
                topTablet = `210px`;
                topDesktop = `210px`;
                break;
        }
    }
    restyleCSS(topMobile, topTablet, topDesktop);
}
 
waitForKeyElements(buttonSelector, moveButton);
window.addEventListener("resize", moveButton);