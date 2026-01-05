// ==UserScript==
// @name         Craig's Unlister
// @namespace    http://ejew.in/
// @version      0.1
// @description  Make things that are dead and gone go away.
// @author       EntranceJew
// @match        http*://*.craigslist.org/*
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/29453/Craig%27s%20Unlister.user.js
// @updateURL https://update.greasyfork.org/scripts/29453/Craig%27s%20Unlister.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if( document.getElementById('has_been_removed') ){
        window.close();
    }
})();