// ==UserScript==
// @name         OpenHealth UX+
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Improve the UX of openhealth.com.tw
// @author       pan93412
// @match        http://www.openhealth.com.tw/*
// @icon         https://www.google.com/s2/favicons?domain=openhealth.com.tw
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/440900/OpenHealth%20UX%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/440900/OpenHealth%20UX%2B.meta.js
// ==/UserScript==

/* jshint esversion: 11 */

const FAST_SAVE = true;

/** @deprecated */
async function loadScript(url) {
    return fetch(url)
        .then((r) => r.text())
        .then((r) => {
            const script = document.createElement("script");
            script.innerHTML = r;
            document.head.appendChild(script);
        });
}

function chooseOption(optionId) {
    document.querySelector(`#seq_${optionId}`)?.click();
}

function saveOption() {
    document.querySelector('#ctl00_ContentPlaceHolderMain_btnSend')?.click();
}

function newCommandBox() {
    const commandBox = document.createElement("input");
    commandBox.type = "input";
    commandBox.placeholder = "指令區";
    commandBox.tabIndex = 1;

    commandBox.addEventListener("keydown", (e) => {
        const key = Number(e.key);
        if (Number.isInteger(key)) {
            e.preventDefault();
            chooseOption(key);
            if (FAST_SAVE) saveOption();
        } else if (e.key == "s") {
            e.preventDefault();
            saveOption();
        }
    });

    return commandBox;
}

function setTabIndex(elements) {
    elements?.forEach((e) => {
        e.tabIndex = 0;
    });
}

(async function() {
    'use strict';
    unsafeWindow.confirm = () => true; // Do not pop up the useless confirm box.
    console.info(`Question URL: ${location.href}`);

    const setTabIndexSubmission = new Promise((resolve) => {
        setTabIndex(document.querySelectorAll(`#items input[type=text]`));
        resolve();
    });

    const constructCommandBoxSubmission = new Promise((resolve) => {
        const commandBox = newCommandBox();
        document.querySelector(".finish_box").appendChild(commandBox);
        commandBox.focus();
    });

    await Promise.all([
        setTabIndexSubmission,
        constructCommandBoxSubmission
    ]);
})();