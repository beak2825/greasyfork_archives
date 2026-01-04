// ==UserScript==
// @name         SpanishDict - Hide ads
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Makes ads less distracting
// @author       Erc2nd
// @match        https://www.spanishdict.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spanishdict.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449945/SpanishDict%20-%20Hide%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/449945/SpanishDict%20-%20Hide%20ads.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.getElementById("adTopLarge-container").style.display = "none !important";
    document.getElementById("adTopLarge-container").style.visibility = "hidden !important";
    document.getElementById("adTopLarge-container").style.opacity = "0";

    document.getElementById("sidebar-container-video").style.display = "none !important";
    document.getElementById("sidebar-container-video").style.visibility = "hidden !important";
    document.getElementById("sidebar-container-video").style.opacity = "0";
})();