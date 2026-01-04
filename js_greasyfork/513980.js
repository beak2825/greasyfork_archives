// ==UserScript==
// @name         Connected Papers
// @namespace    http://tampermonkey.net/
// @version      2024-10-25
// @description  Connected Papers无限试用
// @author       You
// @match        https://www.connectedpapers.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=connectedpapers.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/513980/Connected%20Papers.user.js
// @updateURL https://update.greasyfork.org/scripts/513980/Connected%20Papers.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function() {
        localStorage.removeItem('graph_visit_timestamps');
    }, 1000);
})();