// ==UserScript==
// @name         屏蔽网易主页公开课
// @description  网易主页会把公开课伪装成新闻,让人防不胜防,装了这脚本,再也不用看XX出什么金句了.
// @namespace    https://weibo.com/DebugGirl
// @version      2018.9.26
// @author       jsgod
// @match        https://www.163.com/*
// @icon         https://www.163.com/favicon.ico
// @require		 https://cdn.bootcss.com/jquery/3.3.0/jquery.min.js
// @run-at 		 document-end

// @downloadURL https://update.greasyfork.org/scripts/372630/%E5%B1%8F%E8%94%BD%E7%BD%91%E6%98%93%E4%B8%BB%E9%A1%B5%E5%85%AC%E5%BC%80%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/372630/%E5%B1%8F%E8%94%BD%E7%BD%91%E6%98%93%E4%B8%BB%E9%A1%B5%E5%85%AC%E5%BC%80%E8%AF%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    //先删除左右精品课元素
    $(".mod_slide_taiduyc").remove();
    $(".mod_r_gongkaike.mt24").remove();

    //再把伪装在新闻里面的链接删除
    //比如 : 任志强又出金句！未来2年钱如何才能保值增值？
    $("a").each(function (i, item) {
        if (item.href &&
            item.href.indexOf("open.163.com/") >= 0
        ) { $(this).remove(); }
    });
})();

