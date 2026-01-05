// ==UserScript==
// @name         BaaN: Baidu as a Network Utility
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  百度的实用主义方法论.
// @author       tianyuf
// @contributor  kinosang
// @include      *www.baidu.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19730/BaaN%3A%20Baidu%20as%20a%20Network%20Utility.user.js
// @updateURL https://update.greasyfork.org/scripts/19730/BaaN%3A%20Baidu%20as%20a%20Network%20Utility.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var elements = document.getElementsByTagName('html');
    elements[0].innerHTML = '<style>body { display: none; } html { margin: 30px; } html::after { font-family: "BlinkMacSystemFont", "Segoe UI", sans-serif; content: "Network Status: You have successfully connected to the Internet. ";}</style>';
})();
