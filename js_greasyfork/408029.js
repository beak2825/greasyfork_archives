// ==UserScript==
// @name         京东手机端链接转网页链接
// @namespace    http://item.m.jd.com/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://item.m.jd.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408029/%E4%BA%AC%E4%B8%9C%E6%89%8B%E6%9C%BA%E7%AB%AF%E9%93%BE%E6%8E%A5%E8%BD%AC%E7%BD%91%E9%A1%B5%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/408029/%E4%BA%AC%E4%B8%9C%E6%89%8B%E6%9C%BA%E7%AB%AF%E9%93%BE%E6%8E%A5%E8%BD%AC%E7%BD%91%E9%A1%B5%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    location.href = location.href.replace(/\.m|product\/|\?.*/g,'')
    // Your code here...
})();