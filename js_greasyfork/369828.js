// ==UserScript==
// @name         Wanikani: Woah Burns
// @namespace    http://tampermonkey.net/
// @version      1.0.7
// @description  Adds a Kanna Woah emote to your burns count
// @author       Kumirei
// @match        https://www.wanikani.com/*
// @match        https://preview.wanikani.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369828/Wanikani%3A%20Woah%20Burns.user.js
// @updateURL https://update.greasyfork.org/scripts/369828/Wanikani%3A%20Woah%20Burns.meta.js
// ==/UserScript==

(function() {
    // Does the thing!
    document.head.insertAdjacentHTML('beforeend','<style id="WoahBurnsCSS">'+
         '    div.WoahBurns {'+
         '        flex: 1 0 auto;'+
         '    }'+
         '    .WoahBurns img {'+
         '        display: block;'+
         '        height: 40px;'+
         '        position: relative;'+
         '        margin-top: calc(var(--spacing-tight) * -1);'+
         '        margin-bottom: calc(var(--spacing-xtight) * -1);'+
         '    }'+
         '</style>');
    document.documentElement.addEventListener("turbo:load", () => {
        setTimeout(() => {
            const burnedSrsProgress = document.querySelector('li.srs-progress__stage--burned .srs-progress__stage-title');
            if (burnedSrsProgress) {
                console.log('WOAH');
                burnedSrsProgress.insertAdjacentHTML('afterend','<div class="WoahBurns"><img src="https://cdn.discordapp.com/emojis/295269590219489290.png?v=1"></div>');
            }
        }, 0);
    });
})();
