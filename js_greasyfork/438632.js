// ==UserScript==
// @name         Auto Claim Twitch drop(CN only)
// @version      0.6
// @description  Auto clicking "claim" near the chat really
// @author       eebssk1
// @match        https://www.twitch.tv/*
// @run-at       document-end
// @license      MPL
// @namespace    CN_only
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/438632/Auto%20Claim%20Twitch%20drop%28CN%20only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/438632/Auto%20Claim%20Twitch%20drop%28CN%20only%29.meta.js
// ==/UserScript==

var dorefresh = true;
var ininventory = false;
var initonce = false;

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function time() {
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date + ' ' + time;
    return dateTime;
}

function close() {
    let button = document.querySelector('button[aria-label="关闭"]');
    if (button != null)
        button.click();
}

function checknoempty(obj) {
    if (obj === undefined || obj === null)
        return false;
    return true;
}

function clickitwrapper(value) {
    clickit(value, 0);
}

function clickit(target, type) {
    if (checknoempty(target)) {
        switch (type) {
            case 0:
                setTimeout(clickit, 400 + getRndInteger(50, 300), target, 1);
                break;
            case 1:
                target.click();
                break;
            default:
                break;
        }
    }
}

function refresh() {
    if (dorefresh)
        location.reload();
}

function main() {
    console.log('Running main at ' + time());
    let done = false;
    let button = document.querySelector('button[aria-label="领取奖励"]');
    let button2 = [];
    let oblist = document.querySelectorAll('div[data-a-target="tw-core-button-label-text"]');
    for (let a of oblist) {
        if (a.innerText === "领取" || a.innerText === "现在领取")
            button2.push(a.parentElement.parentElement);
    }
    if (button != null) {
        button.click();
        console.log('Clicked at ' + time());
        done = true;
    }
    if (button2.length !== 0) {
        console.log("Successfully found " + button2.length + " inventory buttons !");
        button2.forEach(clickitwrapper);
        console.log('Clicked at ' + time());
        done = true;
    }
    if (done) {
        setTimeout(close, 1000);
        if (!ininventory) {
            setTimeout(refresh, 2000);
        }
    }
}

function mainfr() {
    if (document.URL.includes('drops/inventory')) {
        if (!initonce)
            setTimeout(refresh, 1800000 + getRndInteger(500, 1200));
        ininventory = true;
        initonce = true;
        setTimeout(main, 800 + getRndInteger(30, 150));
    }
    if (!ininventory) {
        setTimeout(main, 500 + getRndInteger(10, 70));
    }
}

function norefreshpls() {
    if (dorefresh === true) {
        dorefresh = false;
        alert("Disabled refresh on claim and auto !\nManual refresh to restore .\nClick again does nothing !");
    }
}

const observer = new MutationObserver(mainfr);
observer.observe(document.body, { childList: true, subtree: true });
GM_registerMenuCommand("Disable refresh on claim and auto", norefreshpls);
