// ==UserScript==
// @name         Skip NewsNow Premium Begging
// @namespace    https://www.newsnow.co.uk/
// @version      2024-12-19
// @description  Bypass NewsNow begging you to give them money when clicking outbound links
// @author       xdpirate
// @match        https://c.newsnow.co.uk/A/*
// @match        https://c.newsnow.com/A/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=newsnow.co.uk
// @run-at       document-end
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/521249/Skip%20NewsNow%20Premium%20Begging.user.js
// @updateURL https://update.greasyfork.org/scripts/521249/Skip%20NewsNow%20Premium%20Begging.meta.js
// ==/UserScript==

let continueButton = document.querySelector(".btn.continue-button");

if(continueButton) {
    continueButton.click();
}
