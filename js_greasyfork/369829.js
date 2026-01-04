// ==UserScript==
// @name         Force HTML5 Weibo articles
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://weibo.com/ttarticle/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/369829/Force%20HTML5%20Weibo%20articles.user.js
// @updateURL https://update.greasyfork.org/scripts/369829/Force%20HTML5%20Weibo%20articles.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var url = window.location.toString();
    window.location = url.replace('https://weibo.com/ttarticle/p/show?', 'https://media.weibo.cn/article?');
})();