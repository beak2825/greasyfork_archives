// ==UserScript==
// @name         CSDN辅助
// @namespace    http://tampermonkey.net/
// @version      0.3.0
// @description  用鼠标选中你要复制的文本内容, 会弹出一个提示条, 点击第一个复制, 如果提示条关闭了说明复制成功
// @author       HUIHONG
// @match        https://blog.csdn.net/**
// @icon         https://g.csdnimg.cn/static/logo/favicon32.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465899/CSDN%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/465899/CSDN%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function () {
    'use strict';


    // 将代码设置为可编辑状态
    for (const code of document.querySelectorAll("code")) {
        code.contentEditable = "true";
    }

    // 当鼠标抬起的时候, 监听是否有元素#articleSearchTip
    document.addEventListener("mouseup", function (e) {
        // 检查是否有这个提示条, 有的话就更新这个提示条
        checkArticleSearchTip();
    });

    // 每隔500毫秒查找一次, 一共查找5次
    function checkArticleSearchTip(i) {
        i = i || 1;
        // 是否有元素#articleSearchTip
        const articleSearchTip = document.querySelector("#articleSearchTip");
        if (articleSearchTip == null) {
            // 是否结束查找
            if (i <= 5) {
                setTimeout(() => checkArticleSearchTip(i + 1), 500);
            }
            return;
        }
        // 添加一个复制选项框
        updateArticleSearchTip(articleSearchTip);
    }

    // 向提示框中添加一个复制项
    function updateArticleSearchTip(tip) {
        // 是否已经将节点插入进去了
        if (tip == null || document.getElementById("newCopyNode")) {
            return;
        }

        // 创建节点
        const copyNode = document.createElement("a");
        copyNode.innerHTML = '<img src="https://csdnimg.cn/release/blogv2/dist/pc/img/newcNoteWhite.png"><span class="article-text">复制</span>';
        copyNode.setAttribute("class", "article-href cnote");
        copyNode.setAttribute("href", "javascript:void(0);");
        copyNode.id = "newCopyNode";

        // 为节点添加点击事件
        copyNode.addEventListener("click", copySelectedContent);

        // 将节点插入到提示条中
        tip.insertBefore(copyNode, tip.children[0]);
    }

    // 复制被选中的内容到剪切板
    function copySelectedContent() {
        // 获取选中内容
        const selection = window.getSelection().toString();
        // 将选中内容写入到剪切板中, 成功就关闭提示框
        navigator && navigator.clipboard.writeText(selection).then(function () {
            // 关闭提示框
            document.querySelector("#articleSearchTip").remove();
            // 清空选中内容
            window.getSelection().empty();
        });
    }

    if (/https:\/\/blog.csdn.net\/[^\/]+\/category_[0-9_]+\.html/.test(window.location.href)) {

        function getScrollTop() {
            let scrollTop = 0
            if (document.documentElement && document.documentElement.scrollTop) {
                scrollTop = document.documentElement.scrollTop
            } else if (document.body) {
                scrollTop = document.body.scrollTop
            }
            return scrollTop
        }

        function getClientHeight() {
            var clientHeight = 0
            if (document.body.clientHeight && document.documentElement.clientHeight) {
                clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight)
            } else {
                clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight)
            }
            return clientHeight
        }

        function getScrollHeight() {
            return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
        }

        function isScrollBottom() {
            return getScrollTop() + getClientHeight() == getScrollHeight();
        }

        function hidden(clsList) {
            for (const cls of clsList) {
                const fixed = document.querySelector(cls);                
                fixed && fixed.setAttribute("style", "display:none;" + fixed.getAttribute("style"));
            }            
        }

        // 隐藏顶部固定栏
        hidden([".column_info_box", ".column_person_box"]);
        // 滚动到底部, 加载下一页数据
        window.hasNextPage = true;        
        window.addEventListener("scroll", (e) => {
            // 是否滚动到底部
            if (isScrollBottom() && window.hasNextPage) {
                // 获取下一页标签                
                const nextPage = window.currentPage + 1;

                // 获取下一页的链接地址, 并请求下一页
                const nextUrl = getAllUrl(nextPage);
                fetch(nextUrl)
                    .then(res => res.text())
                    .then(html => {
                        // 解析html
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(html, 'text/html');
                        // 获取列表目录
                        const columnList = document.querySelector("ul.column_article_list");
                        // 扩展到当前目录
                        for (const column of doc.querySelectorAll("ul.column_article_list > li")) {
                            columnList.appendChild(column);
                        }
                        // 更新当前页
                        window.currentPage = nextPage;
                    })
                    .catch(e => {
                        window.hasNextPage = false;
                        console.log("下一页获取失败: ", e);
                    });
            } 
        });
    }


    // 不需要关注也能加载全文
    $('btn-readmore').hasClass("no-login") || ($("div.article_content").removeAttr("style"), 0 == $(".column-mask").length && $(".hide-article-box").hide(), $('btn-readmore').hasClass("fans_read_more") && ($("#btnAttent").hasClass("attented") || $(".tool-attend").trigger("click")))
})();