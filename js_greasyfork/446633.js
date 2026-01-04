// ==UserScript==
// @name     境外势力操纵豆瓣
// @namespace http://www.dounban.com/
// @description 境外手机号用户不实名验证也能大放厥词
// @license  GNU GPLv3
// @match    https://*.douban.com/*
// @version  1.1
// @grant    unsafeWindow
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/446633/%E5%A2%83%E5%A4%96%E5%8A%BF%E5%8A%9B%E6%93%8D%E7%BA%B5%E8%B1%86%E7%93%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/446633/%E5%A2%83%E5%A4%96%E5%8A%BF%E5%8A%9B%E6%93%8D%E7%BA%B5%E8%B1%86%E7%93%A3.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
  unsafeWindow._USER_ABNORMAL = false;
  unsafeWindow.$('input, textarea').not('.nav-search input').removeAttr('disabled').removeAttr('readonly').unbind();
  unsafeWindow.$('.cls_abnormal, .show_abnormal', document).unbind();
}, false);
