// ==UserScript==
// @name         Multibye
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Say bye to scammy multi-item listings on eBay
// @author       asameshimae
// @match        https://www.ebay.co.uk/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ebay.co.uk
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470533/Multibye.user.js
// @updateURL https://update.greasyfork.org/scripts/470533/Multibye.meta.js
// ==/UserScript==

(function() {
    let checkInterval = 500 // ms
    let hiddenClass = 'hidden' // class to add to items once hidden
    let parentSelector = 'li.s-item' // selector for the parent element to hide
    let childSelector = 'span.DEFAULT' // selector for the child element to text search
    let textMatch = ' to ' // exact text content of selectors whose parent should be hidden

    let checkAndHide = ()=>{
        document.querySelectorAll(`${parentSelector}:not(.${hiddenClass}) ${childSelector}`).forEach(
            e=>{
                if(e.textContent===textMatch) {
                let target = e.closest(parentSelector);
                target.style.display='none';
                target.classList.add(hiddenClass)
                }
            }
        )
    }

    let i = setInterval(checkAndHide, checkInterval)
})();