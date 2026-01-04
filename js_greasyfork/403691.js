// ==UserScript==
// @name         Dark Whatsapp
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       gudigno
// @match        https://web.whatsapp.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403691/Dark%20Whatsapp.user.js
// @updateURL https://update.greasyfork.org/scripts/403691/Dark%20Whatsapp.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function()
    {
        document.getElementsByTagName('body')[0].className = "dark";
    }

    // Your code here...
})();