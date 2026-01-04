// ==UserScript==
// @name         Jump to HearthStone Official Cards Page
// @description  With right click menu, jump to playhearthstone.com/cards
// @version      0.1.2
// @author       fal_rnd
// @include      *
// @grant        GM_openInTab
// @run-at       context-menu
// @supportURL   https://twitter.com/fal_rnd
// @namespace    https://greasyfork.org/users/205015
// @downloadURL https://update.greasyfork.org/scripts/388418/Jump%20to%20HearthStone%20Official%20Cards%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/388418/Jump%20to%20HearthStone%20Official%20Cards%20Page.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
    'use strict';

    if(document.getSelection()==''){
        GM_openInTab(
            "https://playhearthstone.com/cards",
            {
                active: true
            }
        );
    }else{
        GM_openInTab(
            "https://playhearthstone.com/cards?set=wild&textFilter="+document.getSelection(),
            {
                active: true,
                insert: true,
                setParent: true,
            }
        );
    }
})();