// ==UserScript==
// @name         pornpen shortcuts
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license      MIT
// @description  pornpen shortcuts.
// @author       You
// @match        https://pornpen.ai/feed
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pornpen.ai
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465338/pornpen%20shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/465338/pornpen%20shortcuts.meta.js
// ==/UserScript==

const liveButton = document.querySelector('#root > div > div > div > button.bg-orange-600.text-white')
if (liveButton){
    document.addEventListener('keydown', manageKey)
}

function manageKey(keyboardEvent){
    if(keyboardEvent.ctrlKey || keyboardEvent.altKey || keyboardEvent.shiftKey) return
    const target = keyboardEvent.target
    if(target.matches('input') || target.matches('textarea') || target.matches('[contenteditable="true"]')) return
    if(keyboardEvent.code == 'Space'){
        keyboardEvent.preventDefault()
        liveButton.click()
    }
}
