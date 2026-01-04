// ==UserScript==
// @name         Puzsq Hotkeys
// @version      25.2.27.1
// @description  Use A and D to switch puzzles, S to toggle ANSWER RECORD, F to toggle AUTO SKIP.
// @author       Leaving Leaves
// @match        https://puzsq.logicpuzzle.app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=logicpuzzle.app
// @grant        none
// @license      GPL
// @namespace https://greasyfork.org/users/1192854
// @downloadURL https://update.greasyfork.org/scripts/486048/Puzsq%20Hotkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/486048/Puzsq%20Hotkeys.meta.js
// ==/UserScript==

'use strict';

const buttonName = "MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedSuccess MuiButton-sizeMedium MuiButton-containedSizeMedium css-m6iq7a";
let AutoSkip = false;
let reloadTimer;
let AutoNextFlag = false;
let AutoNextTimer;
const AutoNextTime = 5 * 60 * 1000;
function getIframe() {
    let iframe;
    iframe = document.getElementById("iframe1");
    if (iframe !== null) { return iframe; }
    iframe = document.getElementById("iframe2");
    if (iframe !== null) { return iframe; }
    return null;
}
function PrevPuzzle() {
    let button = document.evaluate('//*[text()="Previous Puzzle" or text()="前のパズル"]/following-sibling::*[1]/*[1]/*[1]/*[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (button === null) {
        console.log("No prev puzzle!");
    } else {
        console.log("Switching to prev puzzle...");
        button.firstChild.children[1].click();
    }
    clearTimeout(reloadTimer);
}
function NextPuzzle() {
    let button = document.evaluate('//*[text()="Next Puzzle" or text()="次のパズル"]/following-sibling::*[1]/*[1]/*[1]/*[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (button === null) {
        console.log("No next puzzle!");
    } else {
        console.log("Switching to next puzzle...");
        button.firstChild.children[1].click();
    }
    clearTimeout(reloadTimer);
}
function CheckPuzzle(t = false) {
    let button = document.evaluate('//*[text()="Answer Record" or text()="解答記録"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    let button2 = document.evaluate('//*[text()="Answer Record" or text()="解答記録" or text()="Cancel Answer" or text()="解答取消"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (t) {
        if (button !== null) { button.click(); }
        return;
    }
    if (button2 !== null) { button2.click(); }
}
function ToggleAutoskip() {
    AutoSkip ^= 1;
    if (document.querySelector("#AutoSkip") !== null) {
        document.querySelector("#AutoSkip").innerHTML = (AutoSkip ? "☑ Auto Skip" : "☐ Auto Skip");
    }
    console.log(AutoSkip ? "AutoSkip turned on." : "AutoSkip turned off.");
}
window.addEventListener("keydown", (event) => {
    if (!/puzsq\.logicpuzzle\.app\/puzzle\/\d+$/.test(window.location.href)) { return; }
    if (event.defaultPrevented) { return; }
    switch (event.key) {
        case "A":
        case "a":
            PrevPuzzle();
            break;
        case "D":
        case "d":
            NextPuzzle();
            break;
        case "S":
        case "s":
            CheckPuzzle();
            break;
        case "F":
        case "f":
            ToggleAutoskip();
            break;
        case "Q":
        case "q":
            getIframe().contentWindow.postMessage("assist", "*");
            break;
        case "W":
        case "w":
            getIframe().contentWindow.postMessage("assiststep", "*");
            break;
        case "Z":
        case "z":
            getIframe().contentWindow.postMessage("undo", "*");
            break;
        case "X":
        case "x":
            getIframe().contentWindow.postMessage("redo", "*");
            break;
        default:
            return;
    }
    event.preventDefault();
}, true,);
window.addEventListener("message", (event) => {
    // console.log(event);
    // if (!["https://puzz.link", "https://pzprxs.vercel.app"].includes(event.origin)) { return; }
    if (event.data === "Solved") {
        console.log("Puzzle solved.");
        CheckPuzzle(true);
    }
    if (event.data === "Solved" && AutoNextFlag || event.data === "Not Solved" && AutoSkip) {
        NextPuzzle();
    }
    if (event.data === "Ready to Assist") {
        getIframe().contentWindow.postMessage("assist", "*");
        AutoNextFlag = true;
        clearTimeout(AutoNextTimer);
        AutoNextTimer = setTimeout(() => {
            console.log("AutoNext timeout after " + AutoNextTime + " ms.");
            AutoNextFlag = false;
        }, AutoNextTime);
    }
}, false,);
let lastUrl = '';
setInterval(function () {
    if (getIframe() === null) { return; }
    addAutoskipButton();
    let Url = getIframe().src;
    if (AutoSkip && Url !== lastUrl) {
        clearTimeout(reloadTimer);
        if (!/puzz\.link/.test(Url)) {
            console.log("Skip non-puzz.link puzzle...");
            NextPuzzle();
        } else {
            reloadTimer = setInterval(() => {
                if (getIframe().src === null || !AutoSkip) {
                    clearInterval(reloadTimer);
                    return;
                }
                console.log("Puzz.link Assistant not found. Reload iframe.");
                getIframe().src += '';
            }, 5000);
        }
    }
    lastUrl = (AutoSkip ? Url : "");
}, 1000);

function addAutoskipButton() {
    const AutoskipButton = `<button type="button" id="AutoSkip" style="\
    display: inline-flex;\
    -webkit-box-align: center;\
    align-items: center;\
    -webkit-box-pack: center;\
    justify-content: center;\
    position: relative;\
    box-sizing: border-box;\
    -webkit-tap-highlight-color: transparent;\
    outline: 0px;\
    border: 0px currentcolor;\
    margin: 8px 8px 0px 0px;\
    cursor: pointer;\
    user-select: none;\
    vertical-align: middle;\
    appearance: none;\
    text-decoration: none;\
    font-family: Roboto, Helvetica, Arial, sans-serif;\
    font-weight: 500;\
    font-size: 0.875rem;\
    line-height: 1.75;\
    letter-spacing: 0.02857em;\
    text-transform: uppercase;\
    min-width: 64px;\
    padding: 6px 16px;\
    border-radius: 4px;\
    transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;\
    color: rgb(255, 255, 255);\
    background-color: rgb(140, 72, 176);\
    box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px;\
">${AutoSkip ? "☑" : "☐"} Auto Skip</button>`;
    let button = document.evaluate('//*[text()="Copy Information" or text()="情報をコピー"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (button === null) { return; }
    if (document.getElementById("AutoSkip") !== null) { return; }
    button.insertAdjacentHTML('afterend', AutoskipButton);
    document.querySelector("#AutoSkip").addEventListener("click", ToggleAutoskip, false);
}