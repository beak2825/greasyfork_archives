 
// ==UserScript==
// @name         去除CSDN内容不能复制限制
// @version      0.4
// @description  去除CSDN代码登录后复制及全文关注后查看的限制脚本 基础上 进一步扩展
// @author       demain_lee
// @match        http*://blog.csdn.net/*/article/details/*
// @match        http*://*.blog.csdn.net/article/details/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        none
// @namespace https://greasyfork.org/users/942588
// @downloadURL https://update.greasyfork.org/scripts/448842/%E5%8E%BB%E9%99%A4CSDN%E5%86%85%E5%AE%B9%E4%B8%8D%E8%83%BD%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/448842/%E5%8E%BB%E9%99%A4CSDN%E5%86%85%E5%AE%B9%E4%B8%8D%E8%83%BD%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    // Your code here...

    // 将所有ID为content_views 区域变为可选
    var cv = document.getElementById("content_views");
    cv.style="user-select:text !important";
    cv.style="-webkit-user-select:text !important";

    // 将所有代码区域变为可选
    document.querySelectorAll("code").forEach(function (item) {
        item.style = item.style + ";user-select: text !important;";
        return item;
    })
    // 将所有登录复制按钮变成全选
    document.querySelectorAll(".hljs-button").forEach(function (item) {
        item.dataset.title = "复制全部";
        return item;
    })
    try {
        // 重写登录复制方法
        window.hljs.signin = e => {
            var preNode = e.path.filter(item => item.tagName == "PRE")[0];
            // 选中一段文字
            let selection = window.getSelection();
            let range = document.createRange();
            range.selectNode(preNode);
            selection.removeAllRanges();
            selection.addRange(range);
            // 执行复制命令
            document.execCommand('copy', false, null);
            e.target.dataset.title = "复制成功";
            setTimeout(() => {
                e.target.dataset.title = "复制全部";
            }, 1000);
        }
        // 重写另一个登录方法（需要去除行号和版权声明）
        window.mdcp.signin = e => {
            // 避免拖动选择代码时直接触发了复制全部
            if (!e.target.className.includes("hljs-button")) return;
            var preNode = e.path.filter(item => item.tagName == "CODE")[0];
            // 选中一段文字
            let selection = window.getSelection();
            let range = document.createRange();
            range.selectNode(preNode);
            selection.removeAllRanges();
            selection.addRange(range);
            // 执行复制命令
            document.execCommand('copy', false, null);
            e.target.dataset.title = "复制成功";
            setTimeout(() => {
                e.target.dataset.title = "复制全部";
            }, 1000);
        }
    }
    catch { }
    // 解除关注才能查看全文的限制
    $('#article_content').removeAttr("style");
    $('.hide-article-box').remove();
})();