// ==UserScript==
// @name         MyBlocker
// @version      0.0.7
// @description  My personal element blocker
// @author       dinosw
// @license      Creative Commons; http://creativecommons.org/licenses/by/4.0/
// @homepageURL  https://greasyfork.org/en/scripts/38117
// @include      *
// @grant        GM_addStyle
// @run-at       document-start
// @namespace    https://greasyfork.org/en/users/29386
// @downloadURL https://update.greasyfork.org/scripts/38117/MyBlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/38117/MyBlocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* ########## 9anime ##########
    Removes the "Please don't block ads"-elements. */
    //if( window.location.href.indexOf("9anime.") > -1 ){
        GM_addStyle('div.abmsg{ display: none !important; }');
    //}
    
})();