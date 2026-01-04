// ==UserScript==
// @name         Faviconize Startpage.com
// @namespace    http://tampermonkey.net/
// @version      2024-03-13
// @license MIT
// @description  Replaces Anonymous view with duckduckgo.com icons
// @author       Retro
// @match        *://*.startpage.com/*
// @icon         https://icons.duckduckgo.com/ip3/startpage.com.ico
// @grant        GM_xmlhttpRequest
// @connect      icons.duckduckgo.com
// @downloadURL https://update.greasyfork.org/scripts/489497/Faviconize%20Startpagecom.user.js
// @updateURL https://update.greasyfork.org/scripts/489497/Faviconize%20Startpagecom.meta.js
// ==/UserScript==

/* jshint esversion: 8 */
async function asyncRequest(options) {
    return new Promise((res, rej) => {
        options.onload = res
        options.onabort = rej
        options.onerror = rej
        options.ontimeout = rej
        GM_xmlhttpRequest(options)
    })
}

async function asyncReadAsDataURL(blob) {
    return new Promise((res, rej) => {
        const reader = new FileReader()
        reader.onload = () => res(reader.result)
        reader.onerror = rej
        reader.readAsDataURL(blob)
    })
}

function getElementsFromList(root, list) {
    return list.reduce((r, v) => r.concat(Array.from(root.getElementsByClassName(v))), [])
}

// Replace anonymous view with favicons
async function injectFavicon(container, favicon_url) {
    let res = await asyncRequest({
        method: "GET",
        url: favicon_url,
        anonymous: true,
        responseType: "blob",
    })

    let favicon = document.createElement("img")
    favicon.src = await asyncReadAsDataURL(res.response)
    favicon.loading = "lazy"
    favicon.width = 16
    favicon.height = 16
    favicon.style.marginRight = "0.5em"

    let upper = getElementsFromList(container, ["upper", "w-gl__result-url-container"])[0]
    upper.children[0].remove() // remove anonymous view button
    upper.prepend(favicon) // prepend our favicon :)
}

const FAVICON_URL = "https://icons.duckduckgo.com/ip3/?.ico"
let urls = getElementsFromList(document, ["result", "w-gl__result__main"])

for (const container of urls) {
    let link = container.getElementsByClassName("result-link")[0].href
    let host = new URL(link).host

    injectFavicon(container, FAVICON_URL.replace("?", host))
}