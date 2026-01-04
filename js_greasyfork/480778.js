// ==UserScript==
// @name         Fireload Folder Downloader
// @namespace    http://yu.net/
// @version      1.0
// @description  bulk downloader
// @author       Yu
// @match        https://www.fireload.com/folder/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fireload.com
// @grant        unsafeWindow
// @grant        GM_openInTab
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480778/Fireload%20Folder%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/480778/Fireload%20Folder%20Downloader.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const downloadAllFile = async (files) => {
        for(const file of files) {
            const link = file.querySelector("a").href

            const resp = await unsafeWindow.fetch(link)
            const html = await resp.text()
            const stringJsonDownload = html.match(/{"dlink": (.*)}/)[0]
            const dataDownload = JSON.parse(stringJsonDownload)
            await GM_openInTab(dataDownload.dlink)

            await new Promise(res => setTimeout(res, 2000))
        }
    }

    const files = document.querySelectorAll("#fileData tbody tr")
    const button = document.createElement("button")
    button.classList.add("btn", "btn-primary")
    button.style.position = "fixed"
    button.style.bottom = "10px"
    button.style.right = "10px"
    button.style.zIndex = 999
    button.innerText = `Download ${files.length} File`

    button.onclick = () => downloadAllFile(files)

    document.body.append(button)
})();