// ==UserScript==
// @name         畅想之星target移除
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  移除a标签target属性
// @author       Xinconan
// @match        https://cxstar.com/Book/Detail*
// @match        https://www.cxstar.com/Book/Detail*
// @match        http://*/vpn/54/https/www.cxstar.com/Book/Detail*
// @match        ://*/interlibSSO/goto/*/++9bwrs-q9bnl/Book/Detail*
// @match        http://*/https/1SjapK2a5Jd34Hhj85iHrbruR9MLivjGk2oCb/Book/Detail*
// @match        http://gfgfab3e1aaa3118d4124s6x6pxvnf95o56pnf.fhhh.ntszzy.org:8070/Book/Detail*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cxstar.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494450/%E7%95%85%E6%83%B3%E4%B9%8B%E6%98%9Ftarget%E7%A7%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/494450/%E7%95%85%E6%83%B3%E4%B9%8B%E6%98%9Ftarget%E7%A7%BB%E9%99%A4.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var aTags = document.querySelectorAll('a'); // 选择所有的 <a> 标签

  aTags.forEach(function(a) {
      a.removeAttribute('target'); // 删除 target 属性
  });
})();