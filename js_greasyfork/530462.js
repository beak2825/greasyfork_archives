// ==UserScript==
// @name         Download VS Code Extension VSIX Packages
// @name:zh-CN   下载 VS Code 扩展插件 VSIX 包
// @name:zh-TW   下載 VS Code 擴充插件 VSIX 包
// @name:fr      Télécharger packages VSIX d'extension VS Code
// @name:fr-CA   Télécharger packages VSIX d'extension VS Code
// @namespace    https://tomchen.org/
// @version      1.0.0
// @description  Download .vsix packages of current and old versions of any extension on VS Code Marketplace
// @description:zh-CN 在 VS Code 官方市场上下载任何扩展插件的当前版本和旧版本的 .vsix 包文件
// @description:zh-TW 在 VS Code 官方市場上下載任何擴充插件外掛程式的當前版本和舊版本的 .vsix 包檔案
// @description:fr Télécharger les packages .vsix des versions actuelles et anciennes d'une extension sur la Marketplace VS Code
// @description:fr-CA Télécharger les packages .vsix des versions actuelles et anciennes d'une extension sur la Marketplace VS Code
// @author       Tom Chen (tomchen.org)
// @license      MIT
// @compatible   chrome
// @compatible   firefox
// @compatible   edge
// @compatible   opera
// @compatible   brave
// @icon         https://www.google.com/s2/favicons?sz=64&domain=code.visualstudio.com
// @match        https://marketplace.visualstudio.com/items*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/530462/Download%20VS%20Code%20Extension%20VSIX%20Packages.user.js
// @updateURL https://update.greasyfork.org/scripts/530462/Download%20VS%20Code%20Extension%20VSIX%20Packages.meta.js
// ==/UserScript==

(function() {

    function getPublisherAndExtensionName(url) {
        const params = new URL(url).searchParams
        const itemName = params.get("itemName")
        if (!itemName) {
            return null
        }
        const obj = itemName.split(".")
        return {
            publisher: obj[0],
            extensionName: obj[1]
        }
    }

    const obj = getPublisherAndExtensionName(window.location.href)
    if (!obj) {
        return
    }
    const { publisher, extensionName } = obj

    function getUrl(publisher, extensionName, version) {
        return `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/${publisher}/vsextensions/${extensionName}/${version}/vspackage/`
    }

    const currentVersionLinkclassName = "version-current-vspackage-link"
    let isCurrentVersionLinkAdded = false
    function findCurrentVersionAndAddLink() {
        const versionTd = document.querySelector("table.ux-table-metadata td[aria-labelledby='Version'], table.ux-table-metadata td[aria-labelledby='version']")
        if (versionTd && !versionTd.querySelector(`.${currentVersionLinkclassName}`)) {
            const currentVersion = versionTd.textContent.trim()
            const a = document.createElement("a")
            a.href = getUrl(publisher, extensionName, currentVersion)
            a.textContent = currentVersion
            a.className = currentVersionLinkclassName
            a.title= "Download .vsix package"
            versionTd.removeChild(versionTd.firstChild)
            versionTd.appendChild(a)
        }
    }

    const historyVersionLinkclassName = "version-history-vspackage-link"
    let isHistoryLinksAdded = false
    function findTableAndAddLinks() {
        const table = document.querySelector(".version-history-table")
        if (table && !table.querySelector(`.${historyVersionLinkclassName}`)) {
            const trs = table.querySelectorAll("tbody tr.version-history-container-row")
            trs.forEach(tr => {
                const td = tr.querySelector("td.version-history-container-column")
                const version = td.textContent.trim()
                const a = document.createElement("a")
                a.href = getUrl(publisher, extensionName, version)
                a.textContent = "download"
                a.className = historyVersionLinkclassName
                a.title= "Download .vsix package"
                const text1 = document.createTextNode(' (')
                const text2 = document.createTextNode(')')
                td.appendChild(text1)
                td.appendChild(a)
                td.appendChild(text2)
            })
        }
    }

    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === "childList") {
                findTableAndAddLinks()
                findCurrentVersionAndAddLink()
                // can't disconnect observer because switching tab will erase added links
            }
        }
    });

    observer.observe(document, { childList: true, subtree: true })

})()