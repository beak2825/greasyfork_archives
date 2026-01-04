// ==UserScript==
// @name         Torn Forums Feed Height Increase
// @namespace    http://tampermonkey.net/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @version      0.1
// @description  Increases forum feed heights for My Threads, Subscribed Threads, Feed, Friends, and Popular Threads.
// @author       Hesper [2924630]
// @match        https://www.torn.com/forums.php
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494693/Torn%20Forums%20Feed%20Height%20Increase.user.js
// @updateURL https://update.greasyfork.org/scripts/494693/Torn%20Forums%20Feed%20Height%20Increase.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle('.d .forums-main-wrap .panel-scrollbar { max-height: 500px !important; }');
})();