// ==UserScript==
// @name         	Button to copy the raw file URL | Github
// @name:de			Button zum Kopieren der Raw-Datei URL | Github
// @namespace  		https://greasyfork.org/users/928242
// @version      	2.1
// @description  	Adds a button at the end of each file row to copy the raw file URL
// @description:de  Fügt am Ende jeder Dateizeile eine Schaltfläche zum Kopieren der Raw File URL hinzu
// @author       	Kamikaze (https://github.com/Kamiikaze)
// @supportURL      https://github.com/Kamiikaze/Tampermonkey/issues
// @match        	https://github.com/*
// @icon         	https://www.google.com/s2/favicons?sz=64&domain=github.com
// @run-at       	document-ready
// @license      	MIT
// @downloadURL https://update.greasyfork.org/scripts/453489/Button%20to%20copy%20the%20raw%20file%20URL%20%7C%20Github.user.js
// @updateURL https://update.greasyfork.org/scripts/453489/Button%20to%20copy%20the%20raw%20file%20URL%20%7C%20Github.meta.js
// ==/UserScript==


// Need an Interval to detect path changes on github tree one-pager
// Define the number of seconds
const scanInterval = 2


const waitForFilelist = setInterval(() => {
    let fileListContainer = document.querySelector("div.Box > div.js-details-container.Details div") || document.querySelector("table")
    let fileList = []
    let isTable = false

    if (fileListContainer.tBodies) {
        fileList = fileListContainer.tBodies[0].children
        isTable = true
    } else {
        fileList = fileListContainer.children
    }

    if (fileList < 1) return

    appendButtons(fileList, isTable)

}, scanInterval * 1000)

function appendButtons(fileList, isTable = false) {
    let fileUrl = ""
    let rawFileUrl = ""
    for (let i = 0; i < fileList.length; i++) {
        let file = fileList[i]

        if (file.classList.contains("cp-btn-rdy")) continue;

        file.classList.add("cp-btn-rdy")

        if (!isTable) {
            if (
                file.classList.contains("sr-only") ||
                file.childElementCount !== 4
            ) continue;

            fileUrl = file.querySelector('div:nth-child(2) .js-navigation-open')
                .href
        } else {
            if (i === 0) continue;

            if (
                file.classList.contains("sr-only")
            ) continue;


            fileUrl = file.querySelector("a")
                .href
            file = file.querySelector("td:nth-child(4) > div")
        }

        // Dont add button if its a folder
        if (!fileUrl.includes("/blob/")) continue;

        rawFileUrl = fileUrl.replace('/blob/', '/raw/')
        file.style = "display: flex; justify-content: flex-end;"
        file.append(creatyCopyButton(rawFileUrl))
    }
};

function creatyCopyButton(copyText) {
    const copy2clipboard = `
		<clipboard-copy aria-label="Copy" value="test value" data-view-component="true" class="" tabindex="0" role="button" title="Copy raw file url">
			<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-copy">
			<path fill-rule="evenodd" d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"></path><path fill-rule="evenodd" d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"></path>
			</svg>
		</clipboard-copy>`

    const copyButton = document.createElement('div')
    copyButton.setAttribute('role', 'gridcell')
    copyButton.style = "margin-left: 10px; display: inline;"
    copyButton.innerHTML = copy2clipboard
    copyButton.children[0].value = copyText
    copyButton.children[0].style = "cursor: pointer;"

    return copyButton
}
