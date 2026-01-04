// ==UserScript==
// @name         Pickpocket Cyclists
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Hilight cyclists and hide police officers
// @author       Baskerville
// @match        https://www.torn.com/loader.php?sid=crimes
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478015/Pickpocket%20Cyclists.user.js
// @updateURL https://update.greasyfork.org/scripts/478015/Pickpocket%20Cyclists.meta.js
// ==/UserScript==

const bell = new Audio('https://mhece.com/media/bicycle-bell.mp3')

function picker(){
    const l = document.querySelectorAll('div.crime-option')
    for(const div of l){
        let b = div.querySelector('.titleAndProps___DdeVu').textContent
        if (b.includes('Cyclist')){
            const green = '#ccffcc'
            if(div.style.backgroundColor != green){
                div.style.backgroundColor = green
                bell.play()
            }
        }
        else if (b.includes('Police')){
            div.style.display = 'none'
        }
    }
}

// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true }
const observer = new MutationObserver(picker)
observer.observe(document.body, config)