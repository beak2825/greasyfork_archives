// ==UserScript==
// @name         Veneficium Chatbox Dark Theme
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Dark theme for Veneficium chatbox
// @author       You
// @match        http://www.veneficium.org/chatbox/index.forum*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390309/Veneficium%20Chatbox%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/390309/Veneficium%20Chatbox%20Dark%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $("body").append($("<style>.chatbox > *, .chatbox-username, img{filter:invert(100);}</style>"));
})();