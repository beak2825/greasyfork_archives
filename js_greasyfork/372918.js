// ==UserScript==
// @name         Fuck button for GitHub 🅴
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Turn GitHub "Fork" button into "Fuck" button, just for fun.
// @author       Me
// @match        https://github.com/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372918/Fuck%20button%20for%20GitHub%20%F0%9F%85%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/372918/Fuck%20button%20for%20GitHub%20%F0%9F%85%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementsByClassName("btn btn-sm btn-with-count")[3].innerHTML = '<svg class="octicon octicon-repo-forked v-align-text-bottom" viewBox="0 0 10 16" version="1.1" width="10" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 1a1.993 1.993 0 0 0-1 3.72V6L5 8 3 6V4.72A1.993 1.993 0 0 0 2 1a1.993 1.993 0 0 0-1 3.72V6.5l3 3v1.78A1.993 1.993 0 0 0 5 15a1.993 1.993 0 0 0 1-3.72V9.5l3-3V4.72A1.993 1.993 0 0 0 8 1zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3 10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3-10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"></path></svg> Fuck';
})();