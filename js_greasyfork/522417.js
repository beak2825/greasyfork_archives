// ==UserScript==
// @name         Add rgb-text Class to XenForo HTML
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adds the rgb-text class to the XenForo HTML element
// @author       YourName
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522417/Add%20rgb-text%20Class%20to%20XenForo%20HTML.user.js
// @updateURL https://update.greasyfork.org/scripts/522417/Add%20rgb-text%20Class%20to%20XenForo%20HTML.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add the rgb-text class to the XenForo HTML element
    const xenForoElement = document.getElementById('XenForo');
    if (xenForoElement && !xenForoElement.classList.contains('rgb-text')) {
        xenForoElement.classList.add('rgb-text');
    }
})();
