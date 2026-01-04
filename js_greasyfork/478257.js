// ==UserScript==
// @name         Quick Attack
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Filter out unavailable attack targets
// @author       Baskerville
// @match        https://www.torn.com/page.php?sid=UserList*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478257/Quick%20Attack.user.js
// @updateURL https://update.greasyfork.org/scripts/478257/Quick%20Attack.meta.js
// ==/UserScript==

const unavailable = ['Traveling','Hospital','Federal','Jail']

const attack = 'https://www.torn.com/loader.php?sid=attack&user2ID='

function myfilter(){
    const ul = document.querySelectorAll('ul.user-info-list-wrap > li')
    for(const li of ul){
        const status = li.querySelectorAll('ul#iconTray > li')
        for(const s of status){
            if (unavailable.some(u=> s.title.includes(u))){
                li.style.display = 'none'
            }
        }
    }
}

// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true }
const observer = new MutationObserver(myfilter)
observer.observe(document.body, config)