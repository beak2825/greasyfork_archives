// ==UserScript==
// @name         生财有术官网页面优化
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  优化生财有术官网页面显示
// @author       骄阳
// @match        https://scys.com/*
// @match        https://scys.com/home*
// @match        https://scys.com/search?query=*
// @match        https://scys.com/opportunity*
// @match        https://scys.com/group/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495875/%E7%94%9F%E8%B4%A2%E6%9C%89%E6%9C%AF%E5%AE%98%E7%BD%91%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/495875/%E7%94%9F%E8%B4%A2%E6%9C%89%E6%9C%AF%E5%AE%98%E7%BD%91%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义修改标签属性的函数
    function modifyStyles() {

        // 修改class="contentArticle"的max-width属性为800px
        var contentArticles = document.querySelectorAll('.contentArticle');
        contentArticles.forEach(function(contentArticle) {
            contentArticle.style.maxWidth = '800px';
        });

        // 修改https://scys.com/group/页面的main标签宽度
        if (window.location.href.indexOf('https://scys.com/group/') !== -1) {
            // 修改main > div.content标签的宽度
            var mainContentElement = document.querySelector('main > div.content');
            if (mainContentElement) {
                mainContentElement.style.maxWidth = '1400px';
                mainContentElement.style.width = '100%';
                mainContentElement.style.margin = '0 auto';
            }

            var mainElement = document.querySelector('main');
            if (mainElement) {
                mainElement.style.maxWidth = '1400px';
                mainElement.style.width = '100%';
                // 修改margin的right增加10px
                mainElement.style.margin = '0 10px';
            }

            // 修改main上级div标签的宽度
            var containerDiv = document.querySelector('#app > div.content-mt > div > div > div > div.container');
            if (containerDiv) {
                containerDiv.style.maxWidth = '1500px';
                containerDiv.style.width = '100%';
                containerDiv.style.margin = '0 auto';
            }

            // 修改container上级div标签的宽度
            var communityPageDiv = document.querySelector('#app > div.content-mt > div > div > div.communityPage');
            if (communityPageDiv) {
                communityPageDiv.style.maxWidth = '1500px';
                communityPageDiv.style.width = '100%';
                communityPageDiv.style.margin = '0 auto';
            }

            // 修改communityPage上级div标签的宽度
            var contentDiv = document.querySelector('#app > div.content-mt > div > div.content');
            if (contentDiv) {
                contentDiv.style.maxWidth = '1500px';
                contentDiv.style.width = '100%';
                contentDiv.style.margin = '0 auto';
            }
            // 修改content上级div标签的宽度
            var mainContainerDiv = document.querySelector('#app > div.content-mt > div.container');
            if (mainContainerDiv) {
                mainContainerDiv.style.maxWidth = '1500px';
                mainContainerDiv.style.width = '100%';
                mainContainerDiv.style.margin = '30px auto';
            }

            // 修改main > div.content下面div.postItem的div.content和div.contentStream的宽度
            var postItemContentDivs = document.querySelectorAll('main > div.content div.postItem div.content');
            postItemContentDivs.forEach(function(postItemContentDiv) {
                postItemContentDiv.style.maxWidth = '1400px';
                postItemContentDiv.style.width = '100%';
                postItemContentDiv.style.margin = '0 auto';
            });

            var postItemContentStreamDivs = document.querySelectorAll('main > div.content div.postItem div.contentStream');
            postItemContentStreamDivs.forEach(function(postItemContentStreamDiv) {
                postItemContentStreamDiv.style.maxWidth = '1400px';
                postItemContentStreamDiv.style.width = '100%';
                postItemContentStreamDiv.style.margin = '0 auto';
            });
        }

    }

    // 使用MutationObserver监听class属性的变化
    function observeClassChanges(page_element) {
        var observer = new MutationObserver(function(mutations) {
            console.log("233")
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    // 确保mutation.target与预期的选择器匹配
                    console.log("23311")
                    var isTargetItem = mutation.target.matches && mutation.target.matches(page_element);
                    console.log("233234")
                    console.log(isTargetItem)
                    if (isTargetItem) {

                        // 使用setTimeout增加延迟执行
                        setTimeout(function() {
                            console.log("modifyStyles");
                            modifyStyles();
                            addDoubleClickListener();
                            addHoverListener();
                            // 此处可以添加更多的样式修改操作
                        }, 1000); // 数字0表示延迟到当前执行栈清空之后执行
                        console.log("modifyStyles end")
                    }
                }
            });
        });

        // 配置MutationObserver观察的节点和属性
        var config = {
            attributes: true, // 观察属性变动
            childList: false, // 不观察子节点的增减
            subtree: true      // 观察整个文档树
        };

        // 开始观察整个文档树中的所有节点
        observer.observe(document, config);
    }

    // 为特定的元素添加双击事件监听器
    function addDoubleClickListener(dates_element,prev_element,title_element) {
        // 获取所有满足条件的span元素
        var dates = document.querySelectorAll(dates_element);

        // 为每个span元素添加双击事件监听器
        dates.forEach(function(span) {
            // 检查是否已经添加了监听器
        if (!span.hasAttribute('data-dblclick-listener-added')) {
            span.addEventListener('dblclick', function() {
                // 获取span的父级元素中的contentArticle的div
                var contentArticleDiv = span.closest(prev_element).querySelector(title_element);

                // 检查是否存在对应的contentArticle的div
                if (contentArticleDiv) {
                    // 复制contentArticle的div内容
                    var contentToCopy = contentArticleDiv.innerText || contentArticleDiv.textContent;

                    // 使用浏览器的execCommand方法将内容复制到剪贴板
                    if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
                        var textarea = document.createElement('textarea');
                        textarea.textContent = contentToCopy.replaceAll("&ZeroWidthSpace;","").replaceAll("​","").trim();
                        textarea.style.position = 'fixed';  // Prevent scrolling
                        document.body.appendChild(textarea);
                        textarea.select();

                        try {
                            var successful = document.execCommand('copy');
                            var msg = successful ? 'successful' : 'unsuccessful';
                            console.log('Copying text command was ' + msg);
                        } catch (err) {
                            console.error('Unable to copy: ', err);
                        }

                        document.body.removeChild(textarea);
                    }
                }
            });
            span.setAttribute('data-dblclick-listener-added', 'true');
        }});
    }

    // 为特定的元素添加鼠标悬停事件
    function addHoverListener(dates_element) {
        // 获取所有满足条件的span元素
        var dates = document.querySelectorAll(dates_element);

        // 为每个span元素设置CSS伪类:hover样式
        dates.forEach(function(span) {
            // 检查是否已经添加了悬停监听器
        if (!span.hasAttribute('data-hover-listener-added')) {
            span.addEventListener('mouseenter', function() {
                span.style.cursor = 'pointer'; // 设置鼠标悬停时鼠标样式为小手
            });
            span.addEventListener('mouseleave', function() {
                span.style.cursor = 'auto'; // 鼠标离开时恢复默认鼠标样式
            });

            // 添加title提示
            span.title = '双击复制标题';

            span.setAttribute('data-hover-listener-added', 'true');
        }});
    }

    // 创建悬浮按钮的函数
    function createFloatingButtons() {
        // 创建“优化页面”按钮
        var optimizeButton = document.createElement('button');
        optimizeButton.innerText = '优化页面';
        optimizeButton.style.cssText = 'position: fixed; top: 50%; left: 20px; z-index: 1000;background-color:#3d76fb;height:40px;font-size:16px;';
        optimizeButton.addEventListener('click', modifyStyles);

        // 创建“隐藏按钮”按钮
        var hideButton = document.createElement('button');
        hideButton.innerText = '隐藏按钮';
        hideButton.style.cssText = 'position: fixed; top: 55%; left: 20px; z-index: 1000;;background-color:#3d76fb;height:40px;font-size:16px;';
        hideButton.addEventListener('click', function() {
            optimizeButton.remove();
            hideButton.remove();
        });

        // 将按钮添加到页面中
        document.body.appendChild(optimizeButton);
        document.body.appendChild(hideButton);
    }

    // 页面加载完成后执行
    window.addEventListener('load', function() {
        //createFloatingButtons();
        setTimeout(function() {
            console.log("modifyStyles");
            modifyStyles();
            if (window.location.href.indexOf('https://scys.com/opportunity') !== -1 ){
                dates_element = 'div.content > div > div.streamline > div > div.date > span'
                prev_element = 'div.streamline'
                title_element = 'div.contentArticle > div'
                addDoubleClickListener(dates_element,prev_element,title_element);
                addHoverListener(dates_element);
            }else if(window.location.href.indexOf('https://scys.com/') !== -1){
                dates_element = 'div.content > div > div > div.top > div.left > div.pubDate'
                addDoubleClickListener(dates_element);
                addHoverListener(dates_element);
            }else if(window.location.href.indexOf('https://scys.com/search?query=') !== -1){
                dates_element = 'div.content > div > div.picCommon > div.post-item-top > div > span.date'
                addDoubleClickListener(dates_element);
                addHoverListener(dates_element);
            }
            // 此处可以添加更多的样式修改操作
        }, 1000); // 数字0表示延迟到当前执行栈清空之后执行
        if (window.location.href.indexOf('https://scys.com/opportunity') !== -1 ){
            page_element = 'div.bottom-pagination > div > div.item'
            observeClassChanges(page_element); // 添加点击事件监听器
        }else if(window.location.href.indexOf('https://scys.com/') !== -1){
            page_element = 'div.bottom-pagination > div > div.mainBox > div.item'
            observeClassChanges(page_element); // 添加点击事件监听器
        }else if(window.location.href.indexOf('https://scys.com/') !== -1){
            page_element = 'div.content > div > div.picCommon > div.post-item-top > div > span.date'
            observeClassChanges(page_element); // 添加点击事件监听器
        }
    });

    function updateEventListeners() {
        console.log("22222222222222222222222")
        if (window.location.href.indexOf('https://scys.com/') !== -1 || window.location.href.indexOf('https://scys.com/opportunity') !== -1 ){
                if (window.location.href.indexOf('https://scys.com/opportunity') !== -1 ){
                    let dates_element = 'div.content > div > div.streamline > div > div.date > span'
                    let prev_element = 'div.streamline'
                    let title_element = 'div.contentArticle > div'
                    let enhanceBtn = document.querySelector(dates_element);
                    if(enhanceBtn){
                        modifyStyles();
                        addDoubleClickListener(dates_element,prev_element,title_element);
                        addHoverListener(dates_element);
                    }
                }else if(window.location.href.indexOf('https://scys.com/') !== -1){
                    console.log("1111111")
                    let dates_element = 'div.content > div > div > div.top > div.left > div.pubDate'
                    let prev_element = 'div.postItem'
                    let title_element = 'div.titleStream'
                    let enhanceBtn = document.querySelector(dates_element);
                    console.log("enhanceBtn")
                    console.log(enhanceBtn)
                    if(enhanceBtn){
                        modifyStyles();
                        addDoubleClickListener(dates_element,prev_element,title_element);
                        addHoverListener(dates_element);
                    }
                }else if(window.location.href.indexOf('https://scys.com/search?query=') !== -1){
                    console.log("1111111")
                    let dates_element = 'div.content > div > div.picCommon > div.post-item-top > div > span.date'
                    let prev_element = 'div.contentArticleStream'
                    let title_element = 'div.titleStream'
                    let enhanceBtn = document.querySelector(dates_element);
                    console.log("enhanceBtn")
                    console.log(enhanceBtn)
                    if(enhanceBtn){
                        modifyStyles();
                        addDoubleClickListener(dates_element,prev_element,title_element);
                        addHoverListener(dates_element);
                    }
                }
                console.log("3333333333333333")
                //clearInterval(intervalId); // 停止定时器
        }
    }


    // 设置定时器周期性地更新事件监听器
    setInterval(updateEventListeners, 2000); // 这里1000表示1000毫秒，即1秒
})();
