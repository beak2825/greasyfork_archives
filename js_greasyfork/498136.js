// ==UserScript==
// @name         LinuxDo论坛-文章过滤脚本
// @namespace    http://tampermonkey.net/
// @version      2024-06-13
// @description  该脚本会过滤LinuxDo论坛中的文章
// @author       lqzlike
// @match        https://linux.do/*
// @match        https://linux.do
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linux.do
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498136/LinuxDo%E8%AE%BA%E5%9D%9B-%E6%96%87%E7%AB%A0%E8%BF%87%E6%BB%A4%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/498136/LinuxDo%E8%AE%BA%E5%9D%9B-%E6%96%87%E7%AB%A0%E8%BF%87%E6%BB%A4%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 设置需要排除的信息
    const excludeInfo = {
        // 白名单用户
        userWhiteList: ["neo","system"],
        // 黑名单用户
        userBlackList: ["示例用户名ABC"],
        // 带有指定关键字的文章标题将被排除
        articleTitle: [""],
        // ↑大于此长度的文章标题就算关键字匹配成功也不会被排除↑
        articleTitleMaxLength: 30
    }

    const startServer = () => {
        // 获取并处理所有文章
        const articleList = document.getElementsByClassName("topic-list-item");
        Array.from(articleList).forEach(articleData => {
            execFilter(articleData);
        });
        // 处理动态分页
        const topicListBodyElements = document.getElementsByClassName("topic-list-body");
        if(topicListBodyElements.length === 1){
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1 && node.className.split(' ').includes('topic-list-item')) {
                            execFilter(node);
                        }
                    });
                });
            });
            observer.observe(topicListBodyElements[0], {
                childList: true,
                subtree: false
            });
        }
    }
    startServer();
    // 监听从文章详情返回到首页操作
    const mainOutletElement = document.getElementById("main-outlet");
    if(mainOutletElement !== null){
        const backObserver = new MutationObserver(() => {
            const listAreaElement = document.getElementById("list-area");
            if(listAreaElement !== null){
                startServer();
            }
        });
        backObserver.observe(document.getElementById("main-outlet"), {
            childList: true,
            subtree: false
        });
    }


    // 执行过滤
    function execFilter(articleData){
        let articleTitleElement = articleData.querySelector('.main-link :first-child');
        if(articleTitleElement == undefined){
            return;
        }
        // 不处理带有"置顶,书签,锁"图标的文章
        if(articleHasKeyIcon(articleTitleElement)){
            return;
        }
        const articleTitle = articleTitleElement.querySelector('a span').innerText.trim();
        console.log(articleTitle);
        const articleCreateBy = articleData.querySelector('.posters :first-child').getAttribute('data-user-card');
        // 不处理白名单用户
        if(excludeInfo.userWhiteList.includes(articleCreateBy)){
            return;
        }
        // 排除黑名单用户与带有关键字的文章
        if(excludeInfo.userBlackList.includes(articleCreateBy) || filterByKeyword(articleTitle)){
            alert('屏蔽帖子:' + articleTitle);
            articleData.style.display ="none";
        }
    }

    // 通过关键字筛选
    function filterByKeyword(commentData){
        if(commentData.length > excludeInfo.articleTitleMaxLength){
            return false;
        }
        return excludeInfo.articleTitle.some(function (keyword){
            if(keyword === ""){
                return;
            }
            return commentData.includes(keyword);
        });
    }

    // 文章是否带有关键图标
    function articleHasKeyIcon(articleTitleElement){
        const articleIconElement = articleTitleElement.querySelector('div use');
        if(articleIconElement !== null){
            const articleIconText = articleIconElement.getAttribute('href');
            if('#thumbtack #bookmark #lock'.split(' ').includes(articleIconText)){
                return true;
            }
        }
        return false;
    }

})();