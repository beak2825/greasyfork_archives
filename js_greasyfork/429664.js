// ==UserScript==
// @name         No ads (zombs.io)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Removes ads for zombs.io
// @author       Mr. Scripter
// @match        *://zombs.io/*
// @icon         https://www.zombs.io/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429664/No%20ads%20%28zombsio%29.user.js
// @updateURL https://update.greasyfork.org/scripts/429664/No%20ads%20%28zombsio%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
     // Remove ad code
document.querySelectorAll('.ad-unit').forEach(function(a) {
  a.remove();
});

})();