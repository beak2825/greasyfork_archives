// ==UserScript==
// @name         Reddit to Redlib button
// @namespace    happyviking
// @version      1.0
// @description  Adds a button to move from Reddit to Redlib
// @author       HappyViking
// @match        *://*.reddit.com/*
// @exclude      *://*.reddit.com/media*
// @icon         https://www.google.com/s2/favicons?domain=www.reddit.com
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485865/Reddit%20to%20Redlib%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/485865/Reddit%20to%20Redlib%20button.meta.js
// ==/UserScript==

function getNewUrl(url) {
    return 'https://farside.link/redlib' + url.split('reddit.com').pop();
}

function main() {
    const navBar = document.querySelector('nav');
    if (!navBar) return
    const firstDivInNavBar = navBar.querySelector("div")
    const newButton = document.createElement("button")
    firstDivInNavBar.prepend(newButton)
    newButton.appendChild(document.createTextNode("  To Redlib  "))
    newButton.onclick = () => {
        const newUrl = getNewUrl(window.location.href)
        location.replace(newUrl);
    }
}

main()  