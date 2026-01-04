// ==UserScript==
// @name         Hide Flashscore ads
// @namespace    http://grupijeta.com/
// @version      1.2
// @description  Remove advertisements from FlashScore.com.
// @author       life Group
// @match        https://www.flashscore.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/382053/Hide%20Flashscore%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/382053/Hide%20Flashscore%20ads.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle ( `
    .seoAdWrapper, .container__bannerZone, .adsenvelope, .sticky-wrapper {
        display: none !important;
    }
    .container__fsbody {
        max-width: 100% !important;
    }
    #fsbody{
        width: 100% !important;
    }
` );

})();