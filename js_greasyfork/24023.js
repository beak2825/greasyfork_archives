// ==UserScript==
// @name         Remove Grayscale Filter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  set body css filter = none
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24023/Remove%20Grayscale%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/24023/Remove%20Grayscale%20Filter.meta.js
// ==/UserScript==

(function() {
    document.body.style.filter = "none";
})();