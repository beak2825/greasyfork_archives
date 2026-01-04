// ==UserScript==
// @name         TwitchWithoutCasino
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  An extension that removes all casino broadcasts from the page https://www.twitch.tv/directory/all
// @author       You
// @match        https://www.twitch.tv/directory/all/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480917/TwitchWithoutCasino.user.js
// @updateURL https://update.greasyfork.org/scripts/480917/TwitchWithoutCasino.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function test(){
        if (window.location.href.indexOf('category') != -1) {
            return
        }
        let categoryNames = ['Casino Slot Machine', 'Virtual Casino', 'The Casino: Roulette, Video Poker, Slot Machines, Craps, Baccarat', 'Casino Jackpot']
        let slot_card = document.querySelectorAll('div[style*="order"]')
        for( let i = 1; i < slot_card.length; i++){
            let category = slot_card[i].querySelector('a[data-a-target="preview-card-game-link"]')
            if (category){
                category = category.innerHTML
                if (categoryNames.includes(category)){
                    let parent = slot_card[i].parentNode
                    parent.removeChild(slot_card[i])
                    console.log('Casino Removed!')
                }
            }
            else {
                let parent = slot_card[i].parentNode
                parent.removeChild(slot_card[i])
                console.log('Casino Removed!')
            }
        }
    }
    setInterval(test, 5000)
})();