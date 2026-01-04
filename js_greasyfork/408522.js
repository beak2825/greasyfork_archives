// ==UserScript==
// @name         remove baidu hot search
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去除百度热搜
// @author       nejidev
// @match        https://www.baidu.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408522/remove%20baidu%20hot%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/408522/remove%20baidu%20hot%20search.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector("#s-hotsearch-wrapper").style.display="none";
    // Your code here...
})();