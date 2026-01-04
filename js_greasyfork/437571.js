// ==UserScript==
// @name         Dmarket navination - AFK script
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  The script is a tool for you to afk in dmarket navination page!
// @author       cphDavid
// @match        https://dmarket.com/navination
// @icon         https://www.google.com/s2/favicons?domain=dmarket.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/437571/Dmarket%20navination%20-%20AFK%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/437571/Dmarket%20navination%20-%20AFK%20script.meta.js
// ==/UserScript==

(function() {
    'use strict';



    setInterval(function(){
        const btn = document.querySelector('footer.c-drops-backpack-footer > button')
        if(btn != null && btn.getAttribute('disabled') == null){
            btn.click();
            console.log( `[${new Date()}]\nDetected and claimed drops `)
        }
        const cross = document.querySelector(`img[src="https://cdn-front-static.dmarket.com/prod/v1-192-1/assets/img/icons/icon-close-white.svg"]`)
        if(cross != null){
            cross.click()
        }
        const drophint = document.querySelector('div.c-streamWatcher__scrollBlock drop-indicator .c-dropIndicator__title')
        if(drophint == null || (drophint.innerText != 'You’re getting NFT drops on the stream!' && drophint.innerText != 'Watch streams to get NFT drops')){
            if(document.querySelector(`i.o-icon[inlinesvg="icon-arrow-down.svg"]`) != null)
                document.querySelector(`i.o-icon[inlinesvg="icon-arrow-down.svg"]`).click()

            let nftDropStream = false;
            for(let j = 0; j < document.querySelectorAll('.c-dropIndicator__title').length; j ++){
                const i = document.querySelectorAll('.c-dropIndicator__title')[j]
                if(i.innerText == 'You’re getting NFT drops on the stream!' || i.innerText == 'Watch streams to get NFT drops'){
                    i.click()
                    nftDropStream = true
                    console.log( `[${new Date()}]\nDetected you are now on stream. You are entering a stream that drops NFT items`)
                    break;
                }
            }
            if(!nftDropStream){
                console.log(`[${new Date()}]\nThere is no streams that drops NFT items`);
            }
        }
    }, 1000)

    // Your code here...
})();