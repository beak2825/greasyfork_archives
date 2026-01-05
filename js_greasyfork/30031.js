// ==UserScript==
// @name       TF1 Ads Bypasser
// @namespace  http://tampermonkey.net/
// @version    1.1
// @description Bypass ads on TF1
// @include    /https?:\/\/*www.tf1.fr\/*/
// @copyright  2017+, Brock Bold
// @grant      GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/30031/TF1%20Ads%20Bypasser.user.js
// @updateURL https://update.greasyfork.org/scripts/30031/TF1%20Ads%20Bypasser.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_registerMenuCommand("Bypass ad", function() {
        open(document.querySelector('.iframe_player').getAttribute("data-src"));
    });
})();