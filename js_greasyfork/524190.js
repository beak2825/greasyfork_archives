// ==UserScript==
// @name        Sharepoint Keyboard Shortcuts
// @namespace   Violentmonkey Scripts
// @match       *://*.sharepoint.com/*/stream.aspx*
// @grant       none
// @version     1.0
// @author      CyrilSLi
// @description More sensible keyboard shortcuts for SharePoint Stream video player
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/524190/Sharepoint%20Keyboard%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/524190/Sharepoint%20Keyboard%20Shortcuts.meta.js
// ==/UserScript==
function keydown(ev){
    const player = document.getElementsByClassName("oneplayer-root")[0];
    if (player.contains(ev.target) && ev.target !== player){
        ev.stopImmediatePropagation();
        const keys = {
            "ArrowLeft": document.querySelector('[aria-description*="Alt + J"]'),
            " ": document.querySelector('[aria-description*="Alt + K"]'),
            "ArrowRight": document.querySelector('[aria-description*="Alt + L"]'),

            "j": document.querySelector('[aria-description*="Alt + J"]'),
            "k": document.querySelector('[aria-description*="Alt + K"]'),
            "l": document.querySelector('[aria-description*="Alt + L"]'),

            "f": document.querySelector('[aria-description*="Alt + Enter"]'),
            "m": document.querySelector('[aria-description*="Alt + M"]'),
            "c": document.querySelector('[aria-description*="Alt + C"]'),
        }
        for (const key in keys){
            if (ev.key === key){
                keys[key].click();
            }
        }
    }
}
window.addEventListener("keydown", keydown, true);