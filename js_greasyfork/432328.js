// ==UserScript==
// @name         tmall auto refresh
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  auto refresh tmall keep account login
// @author       Tony Liu
// @match        https://www.tmall.com/
// @icon         https://www.tonyblog.cn/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432328/tmall%20auto%20refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/432328/tmall%20auto%20refresh.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setInterval(function(){location.reload()},1000*60*10)
})();