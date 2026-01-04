// ==UserScript==
// @name         Remove Sponsored Section on Roblox
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Remove the sponsored section on Roblox home page
// @author       Mysmic
// @match        https://www.roblox.com/home
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522961/Remove%20Sponsored%20Section%20on%20Roblox.user.js
// @updateURL https://update.greasyfork.org/scripts/522961/Remove%20Sponsored%20Section%20on%20Roblox.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // orignal code for this script 7:07 PM 1/5/2025
    function removeSponsoredDiv() {
        const sponsoredDiv = document.querySelector('a[href*="https://www.roblox.com/discover#/sortName/v2/Sponsored"]');
        if (sponsoredDiv) {
            const parentDiv = sponsoredDiv.closest('.game-sort-carousel-wrapper');
            if (parentDiv) {
                parentDiv.style.display = 'none';
            }
        }
    }

  
    window.addEventListener('load', removeSponsoredDiv);

 
    setInterval(removeSponsoredDiv, 1000);
})();
