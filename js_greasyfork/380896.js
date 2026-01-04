// ==UserScript==
// @name         淘金客新IM的测试环境跳转
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://t.itaojintest.cn/customer/action/user/index
// @match        http://t2.itaojintest.cn/customer/action/user/index
// @match        http://t.itaojintest.cn/customer/action/workbench/index
// @match        http://im.itaojintest.cn/
// @match
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380896/%E6%B7%98%E9%87%91%E5%AE%A2%E6%96%B0IM%E7%9A%84%E6%B5%8B%E8%AF%95%E7%8E%AF%E5%A2%83%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/380896/%E6%B7%98%E9%87%91%E5%AE%A2%E6%96%B0IM%E7%9A%84%E6%B5%8B%E8%AF%95%E7%8E%AF%E5%A2%83%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var li = $("li:first-child .js-new-im-btn");
    li.attr('data-url', 'http://im.itaojintest.cn/raw/auth?imauthtoken=');

    $('a[data-nav="cw_olim"]').attr('data-newurl', 'http://im.itaojintest.cn/raw/auth?imauthtoken=');
    $('.help-btn>.list a:first-child').attr('href', 'http://t.itaojintest.cn/customer/action/workbench/index?imTpl=oldTpl');

    // Your code here...
})();