// ==UserScript==
// @name         Terabox Save  File
// @namespace    http://yu.net/
// @version      1.5
// @description  Yu
// @author       Yu
// @match        https://www.terabox.com/*/sharing/link?surl=*
// @match        https://*.1024tera.*/*/sharing/link?surl=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=terabox.app
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480135/Terabox%20Save%20%20File.user.js
// @updateURL https://update.greasyfork.org/scripts/480135/Terabox%20Save%20%20File.meta.js
// ==/UserScript==

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))

async function checkFileCheckBox() {
    const fileCheckBox = document.querySelector(".file-item-checkbox")
    if(fileCheckBox) {
        fileCheckBox.click()
        return
    }
    await wait(1000)

    checkFileCheckBox()
}

async function clickSaveToBox() {
    const button = document.querySelector(".file-select-save")
    if(button) {
        button.click()
        return
    }
    await wait(1000)
    clickSaveToBox()
}

async function clickConfirm() {
    const button = document.querySelector(".create-confirm.btn")
    if(button) {
        button.click()
        return
    }

    const viewConfirmed = document.querySelector(".open-btn.btn")
    if(viewConfirmed) {
        return
    }

    await wait(1000)
    clickConfirm()

}

(async function() {
    'use strict';

    await checkFileCheckBox()
    await wait(500)
    await clickSaveToBox()
    await wait(500)
    await clickConfirm()
})();