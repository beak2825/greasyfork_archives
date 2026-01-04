// ==UserScript==
// @name         Remove Centered Styling
// @namespace    gaiaupgrade
// @version      0.2
// @description  Remove Gaia's centered stylesheet
// @locale       EN
// @author       Knight Yoshi
// @match        http://www.gaiaonline.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36380/Remove%20Centered%20Styling.user.js
// @updateURL https://update.greasyfork.org/scripts/36380/Remove%20Centered%20Styling.meta.js
// ==/UserScript==

(function() {
    var centerStyle = document.querySelector('link[href$="core2_centered.css"]');
    if(centerStyle !== null) {
        centerStyle.remove();
    }
})();