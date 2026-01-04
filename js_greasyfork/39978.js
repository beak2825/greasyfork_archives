// ==UserScript==
// @name         Add NAV favicon
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://ait-nav2018.aitanaoncloud.com/aitana/SignIn?ReturnUrl=%2Faitana%2F
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39978/Add%20NAV%20favicon.user.js
// @updateURL https://update.greasyfork.org/scripts/39978/Add%20NAV%20favicon.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var linkTag = document.createElement ("link");
    linkTag.rel = "shortcut icon";
    linkTag.href = "https://raw.githubusercontent.com/Dellos7/nav-favicon/master/favicon.ico";
    linkTag.type = "image/x-icon";
    var head = document.getElementsByTagName("head")[0];
    head.appendChild (linkTag);
})();