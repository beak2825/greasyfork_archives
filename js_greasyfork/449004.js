// ==UserScript==
// @name         Better scrolling performance
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license      MIT
// @description  For me the new FPL site is absolutely Garbo when scrolling. Found it seemed to be due to dynamic styling on button for price and next game. Removed that and its beans now. Theres probably a better way but meh
// @author       You
// @match        https://fantasy.premierleague.com/transfers
// @match        https://fantasy.premierleague.com/my-team
// @icon         https://www.google.com/s2/favicons?sz=64&domain=premierleague.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449004/Better%20scrolling%20performance.user.js
// @updateURL https://update.greasyfork.org/scripts/449004/Better%20scrolling%20performance.meta.js
// ==/UserScript==

setInterval(function() {
    //when element is found, clear the interval.
    document.querySelectorAll("div[data-testid=pitch] div[class*=PitchElementData__ElementValue-]").forEach(e => e.className='PitchElementData__ElementValue');
}, 250);

