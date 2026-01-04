// ==UserScript==
// @name         Messenger Heart Reaction
// @namespace    fbmsnheartreact
// @version      0.1
// @description  React with a heart emoji instead of heart eyes on Messenger/Facebook
// @author       n1cKz_
// @match        *://www.messenger.com/*
// @match        *://www.facebook.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393347/Messenger%20Heart%20Reaction.user.js
// @updateURL https://update.greasyfork.org/scripts/393347/Messenger%20Heart%20Reaction.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var oldOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function() { arguments[1] = arguments[1].replace('%F0%9F%98%8D', '%E2%9D%A4'); oldOpen.apply(this, arguments); }
})();