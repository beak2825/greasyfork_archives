// ==UserScript==
// @name         去除CSDN代码登录后复制及全文关注后查看的限制
// @namespace    https://github.com/zhzhch335/myTampermonkey
// @version      1.7
// @description  解决未登录时CSDN不能复制代码的问题
// @author       zhzhch335
// @match        http*://blog.csdn.net/*/article/details/*
// @match        http*://*.blog.csdn.net/article/details/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441883/%E5%8E%BB%E9%99%A4CSDN%E4%BB%A3%E7%A0%81%E7%99%BB%E5%BD%95%E5%90%8E%E5%A4%8D%E5%88%B6%E5%8F%8A%E5%85%A8%E6%96%87%E5%85%B3%E6%B3%A8%E5%90%8E%E6%9F%A5%E7%9C%8B%E7%9A%84%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/441883/%E5%8E%BB%E9%99%A4CSDN%E4%BB%A3%E7%A0%81%E7%99%BB%E5%BD%95%E5%90%8E%E5%A4%8D%E5%88%B6%E5%8F%8A%E5%85%A8%E6%96%87%E5%85%B3%E6%B3%A8%E5%90%8E%E6%9F%A5%E7%9C%8B%E7%9A%84%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
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
