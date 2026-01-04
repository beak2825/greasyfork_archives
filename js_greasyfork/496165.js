// ==UserScript==
// @name 修改浏览器UA平台为桌面端
// @namespace http://tampermonkey.net/
// @version 0.2
// @description 作用是修改浏览器UA平台为桌面端
// @author xk
// @match https:///
// @grant none
// @include *
// @run-at document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496165/%E4%BF%AE%E6%94%B9%E6%B5%8F%E8%A7%88%E5%99%A8UA%E5%B9%B3%E5%8F%B0%E4%B8%BA%E6%A1%8C%E9%9D%A2%E7%AB%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/496165/%E4%BF%AE%E6%94%B9%E6%B5%8F%E8%A7%88%E5%99%A8UA%E5%B9%B3%E5%8F%B0%E4%B8%BA%E6%A1%8C%E9%9D%A2%E7%AB%AF.meta.js
// ==/UserScript==
 
(function() {
'use strict';
Object.defineProperty(navigator,'platform',{get:function(){return 'Windows';}});
Object.defineProperty(navigator,'userAgent',{get:function(){return 'User-Agent, Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_0) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.56 Safari/535.11';}});
// Your code here...
})();