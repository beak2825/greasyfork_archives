// ==UserScript==
// @name         free-copy-on-segmentfault
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  free copy on segmentfault.com
// @author       Alexy
// @match        https://segmentfault.com/*
// @icon         https://www.google.com/s2/favicons?domain=segmentfault.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419255/free-copy-on-segmentfault.user.js
// @updateURL https://update.greasyfork.org/scripts/419255/free-copy-on-segmentfault.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelectorAll("article.article").forEach(function(t) {
                t.addEventListener("copy", function(t) {
                    event.stopPropagation();
                }, true);
	});

})();