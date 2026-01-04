// ==UserScript==
// @name         Copy Portal Token
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Copy Portal Token auto
// @author       Jack Ding
// @match        https://portal.amberainsider.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amberainsider.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454493/Copy%20Portal%20Token.user.js
// @updateURL https://update.greasyfork.org/scripts/454493/Copy%20Portal%20Token.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const token = localStorage.getItem("token")
    navigator.clipboard.writeText(token)

})();