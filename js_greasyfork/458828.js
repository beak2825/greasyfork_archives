// ==UserScript==
// @name         bkrs.info without forum
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      0.1
// @description  https://github.com/srghma-chinese2/srghma-chinese2.github.io
// @author       srghma@gmail.com
// @match        https://bkrs.info/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bkrs.info
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/458828/bkrsinfo%20without%20forum.user.js
// @updateURL https://update.greasyfork.org/scripts/458828/bkrsinfo%20without%20forum.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle('#container .thread_list_container, #popular, #nav_forum, #bkrd_div, #news_auto, #avatar_active, .messages_show_forum { display: none; }')
})();