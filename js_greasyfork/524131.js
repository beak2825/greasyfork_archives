// ==UserScript==
// @name         MissKon去跳转
// @namespace    http://tampermonkey.net/
// @version      1.2.6
// @description  适用于 MissKon 网站的脚本，修复了自动跳转的问题
// @author       You
// @match        https://misskon.com/*
// @match        https://xiutaku.com/*
// @match        https://buondua.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=misskon.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524131/MissKon%E5%8E%BB%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/524131/MissKon%E5%8E%BB%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==


(function () {
    'use strict';




    // Buondua
    let currentUrl = window.location.href;
    // 使用正则表达式检查 URL 是否以 https://buondua.com/ 开头
    if (/^https:\/\/buondua\.com\//.test(currentUrl)) {

        // 使用正则表达式匹配类似 "i03c0c5768ab26bd5ff3b17c180ec8b29" 这样的类名
        const regex = /[a-f0-9]{32}/;

        // 删除搜索框的广告
        const searchBox = document.querySelector('.search-box');
        // 获取所有子元素
        const childElements = Array.from(searchBox.children);
        // 从后往前遍历，避免删除元素时索引问题
        for (let i = childElements.length - 1; i >= 0; i--) {
            const child = childElements[i];
            // 保留 class 为 'search-form' 的元素，删除其他元素
            if (child.className !== 'search-form') {
                console.log(child.className);
                child.remove();
            }
        }


        //  删除主页内容，搜索内容  中间和底部的广告
        const mainBodyDiv = document.querySelector('.main-body.container.view-list');
        if (mainBodyDiv) {
            const childElements = Array.from(mainBodyDiv.children);
            for (let i = childElements.length - 1; i >= 0; i--) {
                const child = childElements[i];
                if (child.className.length <= 0 || regex.test(child.className)) {
                    child.remove()
                }

            }
        }

        // 删除内容详情中的广告
        const articleFulltext = document.querySelector('.article-fulltext');
        if (articleFulltext) {
            const childElements = Array.from(articleFulltext.children);
            for (let i = childElements.length - 1; i >= 0; i--) {
                const child = childElements[i];
                console.log(child.tagName)
                if (child.tagName === 'BR' || child.tagName === 'DIV') {
                    child.remove()
                }

            }
        }

        // 删除内容详情底部的广告
        const articleContent = document.querySelector('.article.content');
        if (articleContent) {
            const childElements = Array.from(articleContent.children);
            for (let i = childElements.length - 1; i >= 0; i--) {
                const child = childElements[i];
                if (child.className.length <= 0 || regex.test(child.className)) {
                    console.log(child.className)
                    child.remove()
                }

            }
        }

        // 删除内容推荐上的广告
        const viewItem = document.querySelector('.main-body.container.view-item');
        if (viewItem) {
            const childElements = Array.from(viewItem.children);
            for (let i = childElements.length - 1; i >= 0; i--) {
                const child = childElements[i];
                if (child.className.length <= 0 || regex.test(child.className)) {
                    console.log(child.className)
                    child.remove()
                }

            }
        }

        // 删除推荐内容中的广告
        const bottomArticles = document.querySelector('.bottom-articles');
        if (bottomArticles) {
            const childElements = Array.from(bottomArticles.children);
            for (let i = childElements.length - 1; i >= 0; i--) {
                const child = childElements[i];
                console.log(child.tagName)
                if (child.className.length <= 0) {
                    child.remove()
                }

            }
        }

        // 删除集合底部的广告
        const collection = document.querySelector('.main-body.container.view-collection');
        if (collection) {
            const childElements = Array.from(collection.children);
            for (let i = childElements.length - 1; i >= 0; i--) {
                const child = childElements[i];
                if (child.className.length <= 0 || regex.test(child.className)) {
                    child.remove()
                }

            }
        }
    }

    // Xiutaku
    // 使用正则表达式检查 URL 是否以 https://xiutaku.com/ 开头
    if (/^https:\/\/xiutaku\.com\//.test(currentUrl)) {

        // 删除广告
        // 找到所有 class 为 mod-ads-auto-title 的 div
        const adTitleDivs = document.querySelectorAll('.mod-ads-auto-title');

        adTitleDivs.forEach(adTitleDiv => {
            // 判断该 div 的文本内容是否为 "Sponsored ads"
            if (adTitleDiv.textContent.trim() === 'Sponsored ads') {
                // 获取父级 div 并删除它
                const parentDiv = adTitleDiv.parentElement;
                if (parentDiv) {
                    parentDiv.remove();
                }
            }
        });


        // 删除首页内容中间的广告
        const regex = /[a-f0-9]{32}/;
        const items = document.querySelector('.main-body.container.view-items');
        if (items) {
            const childElements = Array.from(items.children);
            for (let i = childElements.length - 1; i >= 0; i--) {
                const child = childElements[i];
                if (child.className.length <= 0) {
                    child.remove()
                }

            }
        }

        // 删除内容详情中的广告
        const articleFulltext = document.querySelector('.article-fulltext');
        if (articleFulltext) {
            const childElements = Array.from(articleFulltext.children);
            for (let i = childElements.length - 1; i >= 0; i--) {
                const child = childElements[i];
                console.log(child.tagName)
                if (child.tagName === 'BR' || child.tagName === 'DIV') {
                    child.remove()
                }

            }
        }

        // 删除内容推荐上的广告
        const viewItem = document.querySelector('.main-body.container.view-item');
        if (viewItem) {
            const childElements = Array.from(viewItem.children);
            for (let i = childElements.length - 1; i >= 0; i--) {
                const child = childElements[i];
                if (child.className.length <= 0 || regex.test(child.className)) {
                    console.log(child.className)
                    child.remove()
                }

            }
        }

        // 删除内容详情底部的广告
        const articleContent = document.querySelector('.article.content');
        if (articleContent) {
            const childElements = Array.from(articleContent.children);
            for (let i = childElements.length - 1; i >= 0; i--) {
                const child = childElements[i];
                if (child.className.length <= 0 || regex.test(child.className)) {
                    console.log(child.className)
                    child.remove()
                }

            }
        }

        // 删除推荐内容中的广告
        const bottomArticles = document.querySelector('.bottom-articles');
        if (bottomArticles) {
            const childElements = Array.from(bottomArticles.children);
            for (let i = childElements.length - 1; i >= 0; i--) {
                const child = childElements[i];
                console.log(child.tagName)
                if (child.className.length <= 0) {
                    child.remove()
                }

            }
        }

    }

    // MissKOn
    // 使用正则表达式检查 URL 是否以 https://misskon.com/ 开头
    if (/^https:\/\/misskon\.com\//.test(currentUrl)) {
        // 去除跳转
        window.open = function () { };
        //删除图片页广告
        // 查找目标 div
        const imgPageDiv = document.querySelector('.e3lan.e3lan-in-post1');
        if (imgPageDiv) {
            imgPageDiv.remove();
        }

        // 删除头部广告(所有页面通用)
        const headerDiv = document.querySelector('.e3lan.e3lan-top');
        if (headerDiv) {
            headerDiv.remove();
        }

        // 删除中间广告
        // 查找所有 class 为 'item-list' 且 align 为 'center' 的 div
        const itemListDivs = document.querySelectorAll('div.item-list[align="center"]');

        // 遍历每个 div，检查其结构
        itemListDivs.forEach(div => {
            // 检查 div 中是否包含 class 为 'post-thumbnail' 的 div 和 'post-box-title' 的 h2 元素
            const postThumbnail = div.querySelector('.post-thumbnail');
            const postTitle = div.querySelector('.post-box-title');

            // 如果 div 中没有这两个元素，说明它的结构与 div1 不同，删除该 div
            if (!postThumbnail || !postTitle) {
                div.remove();
            }
        });

        // 删除手机浏览器中图片显示页的广告
        // 查找所有 class 为 "e3lan e3lan-post" 的 div
        const e3lanDivs = document.querySelectorAll('.e3lan.e3lan-post');

        // 遍历所有匹配的 div，并删除它们
        e3lanDivs.forEach(div => {
            div.remove(); // 删除当前元素
        });

        console.log('已删除所有 .e3lan.e3lan-post 元素');

        // 删除搜索页的广告
        // 获取所有 div 元素
        const divs = document.querySelectorAll('div');

        // 使用正则表达式来匹配包含 "text-html-widget-" 和数字的 id
        const regex = /^text-html-widget-\d+$/;

        // 遍历所有 div 元素
        divs.forEach(div => {
            // 如果 div 的 id 符合正则表达式，则删除该 div
            if (regex.test(div.id)) {
                div.remove(); // 删除该 div
                console.log(`已删除符合正则表达式的 div: ${div.id}`);
            }
        });


        // 删除底部广告一
        // 使用 querySelectorAll 获取所有 id 包含 "ads300_250-widget-" 的 div
        const bottomDivs = document.querySelectorAll('div[id^="ads300_250-widget-"]');

        // 遍历所有 div 元素，使用正则匹配 id 中的1位数字
        bottomDivs.forEach(div => {
            const idMatch = div.id.match(/^ads300_250-widget-(\d{1})$/);
            if (idMatch) {
                // 如果 id 符合正则模式（即以 ads300_250-widget- 后跟1位数字），删除该 div
                div.remove();
            }
        });


        // 删除底部广告二
        // 使用 querySelectorAll 获取所有 id 包含 "text-html-widget-" 的 div
        const allDivs = document.querySelectorAll('div[id^="text-html-widget-"]');

        // 遍历所有 div 元素，使用正则匹配 id 中的两位数字
        allDivs.forEach(div => {
            const idMatch = div.id.match(/^text-html-widget-(\d{2})$/);
            if (idMatch) {
                // 如果 id 符合正则模式（即以 text-html-widget- 后跟两位数字），删除该 div
                div.remove();
            }
        });
    }

})();