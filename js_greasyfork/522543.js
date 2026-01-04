// ==UserScript==
// @name         MCPEDL Direct Download
// @namespace    FrostyMCPEDLDirect
// @version      0.1.1
// @license      MIT
// @description  Replace download links with direct ones
// @author       frostice482
// @match        https://mcpedl.com/*
// @icon         https://mcpedl.com/favicon.ico
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/522543/MCPEDL%20Direct%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/522543/MCPEDL%20Direct%20Download.meta.js
// ==/UserScript==

let model

function update() {
    const curModel = __NUXT__.state.slug.model
    if (curModel === model) return
    model = curModel

    const list = document.getElementsByClassName('downloads-list')[0]
    list.replaceChildren()

    for (let { file, name } of model.downloads) {
        const li = list.appendChild(document.createElement('li'))
        const a = li.appendChild(document.createElement('a'))

        const url = new URL(file, location.origin)
        if (url.pathname.startsWith('/leaving')) {
            file = url.searchParams.get('url')
            li.appendChild(document.createElement('div'))
                .appendChild(document.createElement('small'))
                .textContent = 'Redirect to ' + file
        }

        a.target = '_blank'
        a.textContent = name
        a.href = file
    }
}

setInterval(update, 1000)