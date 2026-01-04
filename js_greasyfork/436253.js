// ==UserScript==
// @name         测绘师播放插件加定时刷新
// @namespace    http://rsedu.ch.mnr.gov.cn
// @version      0.1.1
// @description  never stop play!
// @author       原作者：lzwbit，修改：ben
// @match        http://rsedu.ch.mnr.gov.cn//index/play*
// @match        http://rsedu.ch.mnr.gov.cn//index/onlineCourseUser/play*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436253/%E6%B5%8B%E7%BB%98%E5%B8%88%E6%92%AD%E6%94%BE%E6%8F%92%E4%BB%B6%E5%8A%A0%E5%AE%9A%E6%97%B6%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/436253/%E6%B5%8B%E7%BB%98%E5%B8%88%E6%92%AD%E6%94%BE%E6%8F%92%E4%BB%B6%E5%8A%A0%E5%AE%9A%E6%97%B6%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let time=600000;
    setTimeout(() => {
        location.reload()
    },time);

    // Your code here...
    window.onfocus = function(){console.log('on focus')};
    window.onblur = function(){console.log('on blur')};

})();