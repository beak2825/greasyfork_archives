// ==UserScript==
// @name         Free Abendblatt
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  read Abendblatt without paywall
// @author       LYNX
// @match        https://www.abendblatt.de/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/398546/Free%20Abendblatt.user.js
// @updateURL https://update.greasyfork.org/scripts/398546/Free%20Abendblatt.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var re = /tinypass/i;
    window.addEventListener('beforescriptexecute', function(e) {
        if(re.test(e.target.text)) {
            e.stopPropagation();
            e.preventDefault();
        }
    }, true);

})();
