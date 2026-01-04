// ==UserScript==
// @name       Cignal Play Ads Bypasser
// @namespace  http://tampermonkey.net/
// @version    1.3.3
// @description Bypass ads on Cignal Play
// @match    /https?:\/\/*www.cignalplay.com\/*/
// @match    /https?:\/\/*www.cignalplay.com/channel\/*/
// @match    /https?:\/\/*www.cignalplay.com/player\/*/
// @namespace  https://greasyfork.org/en/users/1215420
// @copyright  2023+, Elline Cruz
// @grant      GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/479586/Cignal%20Play%20Ads%20Bypasser.user.js
// @updateURL https://update.greasyfork.org/scripts/479586/Cignal%20Play%20Ads%20Bypasser.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    GM_registerMenuCommand("Bypass ad", function() {
        open(document.querySelector('.iframe_player').getAttribute("data-src"));
    });
})();