// ==UserScript==
// @name         Youtube Recommendation Bar Remover
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Removes the recommendation/suggestion bar.
// @author       John Park
// @match        https://*.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422303/Youtube%20Recommendation%20Bar%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/422303/Youtube%20Recommendation%20Bar%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener("load", function () {
        var divElement = document.querySelector("#secondary-inner")
        divElement.remove();

    }, false)
})();