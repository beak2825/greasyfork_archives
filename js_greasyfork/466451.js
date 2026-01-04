// ==UserScript==
// @name         Delete_Chat_Icon_by_el9in
// @namespace    Delete_Chat_Icon_by_el9in
// @version      0.1
// @description  Delete Chat Icon - Lolz
// @author       el9in
// @match        https://zelenka.guru/*
// @match        https://lolz.guru/*
// @match        https://lzt.market/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        unsafeWindow
// @license      el9in
// @downloadURL https://update.greasyfork.org/scripts/466451/Delete_Chat_Icon_by_el9in.user.js
// @updateURL https://update.greasyfork.org/scripts/466451/Delete_Chat_Icon_by_el9in.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var chatButton = document.querySelector('.chat2-button');
    if (chatButton) chatButton.remove();
})();