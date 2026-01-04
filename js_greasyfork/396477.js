// ==UserScript==
// @name         Hide Feedly header bar
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://feedly.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/396477/Hide%20Feedly%20header%20bar.user.js
// @updateURL https://update.greasyfork.org/scripts/396477/Hide%20Feedly%20header%20bar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`#topHeaderBarFX { display: none !important; }`);
})();
