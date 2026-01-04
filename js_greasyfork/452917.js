// ==UserScript==
// @name         CSDN代码框展开+免关注阅读全文
// @namespace    CSDN代码框展开
// @version      0.30
// @description  安静地展开CSDN代码框及正文内容，没有任何多余功能
// @author       Wu Xin
// @match        *://*.csdn.net/*
// @icon         https://g.csdnimg.cn/static/logo/favicon32.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452917/CSDN%E4%BB%A3%E7%A0%81%E6%A1%86%E5%B1%95%E5%BC%80%2B%E5%85%8D%E5%85%B3%E6%B3%A8%E9%98%85%E8%AF%BB%E5%85%A8%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/452917/CSDN%E4%BB%A3%E7%A0%81%E6%A1%86%E5%B1%95%E5%BC%80%2B%E5%85%8D%E5%85%B3%E6%B3%A8%E9%98%85%E8%AF%BB%E5%85%A8%E6%96%87.meta.js
// ==/UserScript==

(function() {
    // 展开代码框
    var code_expand_buttons = document.querySelectorAll(".look-more-preCode");
    code_expand_buttons.forEach(
        function(button) {
            button.click();
        }
    )
    // 免关注阅读全文，
    // ref: https://greasyfork.org/zh-CN/scripts/449561-csdn%E5%85%8D%E5%85%B3%E6%B3%A8%E9%98%85%E8%AF%BB%E5%85%A8%E6%96%87
    document.querySelector('.hide-article-box').style.display = 'none'
    document.querySelector('#article_content').style.height = 'auto'
})();