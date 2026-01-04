// ==UserScript==
// @name         Click Download
// @namespace    http://tampermonkey.net/
// @version      2024-01-22
// @description  Download Hotkey
// @author       You
// @match        https://rutracker.org/forum/viewtopic.php?t=*
// @match        https://pornolab.net/forum/viewtopic.php?t=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rutracker.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487869/Click%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/487869/Click%20Download.meta.js
// ==/UserScript==
document.addEventListener('keydown', manageKey)

function manageKey(keyboardEvent){
    if(keyboardEvent.ctrlKey || keyboardEvent.altKey || keyboardEvent.shiftKey) return
    const target = keyboardEvent.target
    if(target.matches('input') || target.matches('textarea')) return
    if(keyboardEvent.code == 'KeyD'){
        const button = document.querySelector('a.dl-link[href*="dl.php?t="]')
        if(button){
            button.click()
        }
    }
}