// ==UserScript==
// @name            Coriolis - Save export to file
// @name:de         Coriolis - Export in Datei speichern
// @namespace       https://greasyfork.org/users/928242
// @version         1.0.2
// @description  	Add a button on coriolis backup / detailed-export, to save the output as file.
// @description:de	Füge einen Button zu "Coriolis Backup / Detailed-Export" hinzu, um die Ausgabe als Datei zu speichern.
// @author       	Kamikaze (https://github.com/Kamiikaze)
// @supportURL      https://github.com/Kamiikaze/Tampermonkey/issues
// @match           https://coriolis.io/*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=coriolis.io
// @grant           none
// @license      	MIT
// @downloadURL https://update.greasyfork.org/scripts/528781/Coriolis%20-%20Save%20export%20to%20file.user.js
// @updateURL https://update.greasyfork.org/scripts/528781/Coriolis%20-%20Save%20export%20to%20file.meta.js
// ==/UserScript==


const settingsElSelector = "#coriolis .r.menu .menu-header";
const menuElSelector = "#coriolis .menu-list ul";
const menuEntryBackupElSelector = "li:nth-child(1) > a";
const menuEntryExportElSelector = "li:nth-child(2) > a";
const modalElSelector = ".modal";


(async () => {

    const settingsElement = await waitForElm(settingsElSelector)
    settingsElement.addEventListener('click', async () => {

        const menuElement = await waitForElm(menuElSelector)

        const menuEntryBackup = await waitForElm(menuEntryBackupElSelector, menuElement)
        menuEntryBackup.addEventListener('click', () => {
            createDLBtn('backup')
        })

        const menuEntryExport = await waitForElm(menuEntryExportElSelector, menuElement)
        menuEntryExport.addEventListener('click', () => {
            createDLBtn('detailed-export')
        })
    })

})();


async function createDLBtn(type) {
    const modal = await waitForElm(modalElSelector)

    const btn = document.createElement("button")
    btn.className = "r cap"
    btn.innerText = "download"
    btn.addEventListener('click', async () => {
        const data = await getJsonData()
        download(data, type)
    })

    modal.append(btn)
}

async function getJsonData() {
    const modal = await waitForElm(modalElSelector)
    const textfield = await waitForElm("textarea", modal)

    return JSON.parse(textfield.value)
}

function download(content, type) {
    const a = document.createElement("a");
    const file = new Blob([JSON.stringify(content, null, 2)], {type: 'text/plain'})

    const timestamp = new Date().toISOString()

    a.href = URL.createObjectURL(file)
    a.download = `${timestamp}_coriolis_${type}.json`
    a.click()
}

function waitForElm(selector, parent = document) {
    return new Promise((resolve) => {
        if (parent.querySelector(selector)) {
            console.debug("Element found", selector)
            return resolve(parent.querySelector(selector));
        }

        const observer = new MutationObserver(() => {
            if (parent.querySelector(selector)) {
                console.debug("Element found", selector)
                resolve(parent.querySelector(selector))
                observer.disconnect()
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}
