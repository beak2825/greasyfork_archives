// ==UserScript==
// @name         Google Ad Search Results Remover
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Literally read the title.
// @author       Neo Phoenix
// @match        https://www.google.*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @run-at       document-end
// @license      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439578/Google%20Ad%20Search%20Results%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/439578/Google%20Ad%20Search%20Results%20Remover.meta.js
// ==/UserScript==

(window.onload = function() {
    'use strict';
    document.body.remove(document.getElementById("taw"));
})();