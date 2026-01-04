// ==UserScript==
// @name         Pixel Cat's End Aspect Hider
// @namespace    http://tampermonkey.net/
// @version      2025-05-25
// @description  this script will hide aspect runes when using the "Symbols on Cats Page" setting
// @author       venvenven #26480
// @match        https://www.pixelcatsend.com/village/cats*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixelcatsend.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537244/Pixel%20Cat%27s%20End%20Aspect%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/537244/Pixel%20Cat%27s%20End%20Aspect%20Hider.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelectorAll(".runes-block>.popup-container>button").forEach((div) => {
        if(div.outerHTML.includes("aspect")){
            div.remove()
        }
    })
})();