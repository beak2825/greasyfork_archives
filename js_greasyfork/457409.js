// ==UserScript==
// @name         LCR Email Address Copy
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Copies the recipient list to the clipboard
// @author       Joseph Hickman
// @match        https://lcr.churchofjesuschrist.org/messaging*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=churchofjesuschrist.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457409/LCR%20Email%20Address%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/457409/LCR%20Email%20Address%20Copy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const hwl = document.getElementsByClassName("hide-while-loading")[0];
    const btn = document.createElement("button");
    const btn2 = document.createElement("button");

    async function copyContent(text) {
        try {
            await navigator.clipboard.writeText(text);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    }

    function normalizeName(name) {
        return name.replace(/(.+),\s+(.+)/, "$2 $1")
    }

    btn.innerHTML = "Copy all email addresses";
    btn.onclick = () => {
        var emailElements = Array.from(document.getElementsByClassName("tile-name"));
        var recipients = emailElements.map(element => normalizeName(element.innerText) + " <" + element.title + ">");
        copyContent(recipients.join(", "));
    }
    btn2.innerHTML = "Copy non-gmail addresses";
    btn2.onclick = () => {
        var emailElements = Array.from(document.getElementsByClassName("tile-name"));
        var recipients = emailElements.filter(element => !element.title.includes("gmail.com")).map(element => normalizeName(element.innerText) + " <" + element.title + ">");
        copyContent(recipients.join(", "));
    }

    hwl.parentNode.insertBefore(btn, hwl);
    hwl.parentNode.insertBefore(btn2, hwl);
})();