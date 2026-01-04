// ==UserScript==
// @name         MediaFire Save File
// @namespace    http://yu.net/
// @version      1.5
// @description  Save File to Mediafire
// @author       Yu
// @match        https://www.mediafire.com/file/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mediafire.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480175/MediaFire%20Save%20File.user.js
// @updateURL https://update.greasyfork.org/scripts/480175/MediaFire%20Save%20File.meta.js
// ==/UserScript==

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))

async function listenResponse() {
    const status = document.querySelector("#status #status-message");
    if(status && status.innerText.match(/Saved (.*?) to your account!/)) {
        alert(status.innerText)
        return
    }

    await wait(1000)
    listenResponse()
}

(function() {
    'use strict';

    const saveButton = document.getElementById("saveButton");
    if(saveButton) {
        saveButton.click()
        listenResponse()
    }
})();