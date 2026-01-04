// ==UserScript==
// @name         Crunchyroll Watchlist Hider
// @version      2.2
// @description  Hides watched animes so it is easier to spot new episodes
// @match        https://www.crunchyroll.com/*
// @icon         https://www.google.com/s2/favicons?domain=crunchyroll.com
// @grant        none
// @namespace    https://greasyfork.org/users/206408
// @downloadURL https://update.greasyfork.org/scripts/437960/Crunchyroll%20Watchlist%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/437960/Crunchyroll%20Watchlist%20Hider.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function l(...args){
        console.log('[Watchlist]', ...args)
    }

    function filter(){
        let cards = document.querySelectorAll(".watchlist-card--YfKgo")
        l(cards)
        for(let card of cards){
            let text = card.querySelector(".watchlist-card-subtitle--IROsU").textContent
            if(text.includes("Watch Again")){
                card.style.filter = 'brightness(0.15)'
            }
          }
      }


    //Observe changes to the DOM
    const observer = new MutationObserver((mutationsList, observer) => {
        if(window.location.href === 'https://www.crunchyroll.com/watchlist'){
            l(mutationsList)

            for (const mutation of mutationsList) {
                if (mutation.addedNodes.length > 0) {
                    l('Nodes added')
                    filter();
                    break; // Stop after the first relevant mutation to avoid redundant filtering
                }
            }
        }
    })

    observer.observe(document, {subtree:true, childList:true, attributes:false})
})();