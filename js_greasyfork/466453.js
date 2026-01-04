// ==UserScript==
// @name         Delete_Chat_by_el9in
// @namespace    Delete_Chat_by_el9in
// @version      0.3
// @description  Delete Chat - Lolz
// @author       el9in
// @match        https://zelenka.guru/*
// @match        https://lolz.guru/*
// @match        https://lzt.market/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        unsafeWindow
// @license      el9in
// @downloadURL https://update.greasyfork.org/scripts/466453/Delete_Chat_by_el9in.user.js
// @updateURL https://update.greasyfork.org/scripts/466453/Delete_Chat_by_el9in.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const element = document.querySelector('.navLink.NoPopupGadget.ConversationsPopupLink');
    if (element) element.remove();
})();