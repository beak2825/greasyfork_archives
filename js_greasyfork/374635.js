// ==UserScript==
// @name         Remove Youtube Activity Check - Fork
// @description  Removes youtube's new "are you still there" experiment - forked from https://greasyfork.org/scripts/35157
// @include      *://*.youtube.com/*
// @version      2.2
// @grant        none
// @namespace https://greasyfork.org/users/227479
// @downloadURL https://update.greasyfork.org/scripts/374635/Remove%20Youtube%20Activity%20Check%20-%20Fork.user.js
// @updateURL https://update.greasyfork.org/scripts/374635/Remove%20Youtube%20Activity%20Check%20-%20Fork.meta.js
// ==/UserScript==

(function() {
    
    'use strict';
    
    setInterval(function() {
        
        unsafeWindow._lact = Date.now();
        unsafeWindow._fact = Date.now();
        
    }, 1000);

})();
