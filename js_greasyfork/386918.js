// ==UserScript==
// @name         测绘师继续教育网站视频播放插件
// @namespace    http://rsedu.ch.mnr.gov.cn
// @version      0.1.1
// @description  never stop play!
// @author       原作者：Xavierskip，修改：lzwbit
// @match        http://rsedu.ch.mnr.gov.cn//index/play*
// @match        http://rsedu.ch.mnr.gov.cn//index/onlineCourseUser/play*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386918/%E6%B5%8B%E7%BB%98%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91%E7%AB%99%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/386918/%E6%B5%8B%E7%BB%98%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91%E7%AB%99%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.onfocus = function(){console.log('on focus')};
    window.onblur = function(){console.log('on blur')};
})();