// ==UserScript==
// @name         妖火网屏蔽标题关键词
// @namespace    流失的梦
// @version      1.1
// @description  Remove topics in Yaohuo that contains keywords: salary and love.
// @author       流失的梦
// @match        https://yaohuo.me/*
// @match        https://www.yaohuo.me/*
// @grant        none
// @require https://cdn.bootcss.com/jquery/3.5.1/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466397/%E5%A6%96%E7%81%AB%E7%BD%91%E5%B1%8F%E8%94%BD%E6%A0%87%E9%A2%98%E5%85%B3%E9%94%AE%E8%AF%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/466397/%E5%A6%96%E7%81%AB%E7%BD%91%E5%B1%8F%E8%94%BD%E6%A0%87%E9%A2%98%E5%85%B3%E9%94%AE%E8%AF%8D.meta.js
// ==/UserScript==

(function() {
    // 定义匹配关键字的正则表达式
    const regex = /工资|爱情/;

    // 获取所有话题链接
    const links = $('.listdata .topic-link');

    // 遍历每个链接，判断是否匹配关键字并执行移除
    links.each((index, link) => {
      if (regex.test($(link).text())) {
        $(link).parent('.listdata').remove();
     }
    });


})();