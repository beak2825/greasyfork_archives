// ==UserScript==
// @name         mp.weixin 可复制
// @namespace    https://github.com/ywzhaiqi
// @version      0.1
// @description  付费文章可复制
// @author       ywzhaiqi
// @match        https://mp.weixin.qq.com/s?__biz=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443092/mpweixin%20%E5%8F%AF%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/443092/mpweixin%20%E5%8F%AF%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // $('[style*="user-select: none"]').css('user-select', null)
  $('.rich_media_content').css('user-select', null)
})();