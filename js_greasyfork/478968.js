// ==UserScript==
// @name         Better Torn Chats 2.0
// @namespace    http://tampermonkey.net/
// @version      1.4.26
// @description  Enjoy Torn's new Chat v2.0 with a cleaner Messenger style.
// @author       BOSSx [2718742]
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478968/Better%20Torn%20Chats%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/478968/Better%20Torn%20Chats%2020.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const chatBoxBodyStyles = `
        .chat-box-body___NWs3t {
            background-color: #242526;
        }
    `;

    const chatBoxStyles1 = `
        .chat-box-body__message-box___qRsDd.chat-box-body__message-box--self___HyeWJ.chat-box-body__message-box--group___u7J62.chat-box-body__message-box--self-group___Lsa99 {
            text-align: right;
            background: linear-gradient(to bottom, rgb(0, 38, 238), rgb(0, 178, 255));
            color: #fff;
            border-radius: 10px;
            padding: 10px;
            display: inline-block;
        }
    `;

    const chatBoxStyles2 = `
        .chat-box-body__message-box___qRsDd.chat-box-body__message-box--group___u7J62 {
            background-color: #303030;
            --chat-box-sender-name-text: #fff;
            --chat-text-color: #fff;
            border-radius: 10px;
            padding: 10px;
            display: inline-block;
        }
    `;

    GM_addStyle(chatBoxBodyStyles + chatBoxStyles1 + chatBoxStyles2);
})();