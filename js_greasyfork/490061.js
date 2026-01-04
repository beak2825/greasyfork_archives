// ==UserScript==
// @name         bigger chat
// @description  chat = big
// @namespace    greasyfork.org/users/1275509
// @author       rosefog
// @version      yes
// @license MIT
// @match        https://bonk.io/gameframe-release.html
// @match        https://bonkisback.io/gameframe-release.html
// @downloadURL https://update.greasyfork.org/scripts/490061/bigger%20chat.user.js
// @updateURL https://update.greasyfork.org/scripts/490061/bigger%20chat.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var chatbox = document.getElementById ("ingamechatbox");
      chatbox.style.width = '480';
      chatbox.style.height = '240';
    var chatcontent = document.getElementById ("ingamechatcontent");
      chatcontent.style.fontSize = '16';
})();