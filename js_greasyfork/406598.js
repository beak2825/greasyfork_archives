// ==UserScript==
// @name         怎么都是热搜
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://weibo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406598/%E6%80%8E%E4%B9%88%E9%83%BD%E6%98%AF%E7%83%AD%E6%90%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/406598/%E6%80%8E%E4%B9%88%E9%83%BD%E6%98%AF%E7%83%AD%E6%90%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    window.location.replace("https://s.weibo.com/top/summary")
})();