// ==UserScript==
// @name         Forward Qustodio to Reddit
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  try to take over the world!
// @author       You
// @match        *://*/*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/396789/Forward%20Qustodio%20to%20Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/396789/Forward%20Qustodio%20to%20Reddit.meta.js
// ==/UserScript==
//alert("test");
(function() {
    'use strict';

    if (typeof blockPageData === 'undefined') { 
        //console.log("test1");
        //alert("undefined");
    } else { 
        window.location.href = 'https://reddit.com/r/all';
        //alert("not undefined");
    } 
})();