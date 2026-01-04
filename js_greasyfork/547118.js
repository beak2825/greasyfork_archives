// ==UserScript==
// @name         论坛黑名单帖子检测器
// @namespace    http://yaohuo.me/
// @version      1.0
// @description  检测被加入黑名单后隐藏的帖子并显示
// @author       You
// @match        *://*yaohuo.me/bbs/book_list.aspx?gettotal=20*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547118/%E8%AE%BA%E5%9D%9B%E9%BB%91%E5%90%8D%E5%8D%95%E5%B8%96%E5%AD%90%E6%A3%80%E6%B5%8B%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/547118/%E8%AE%BA%E5%9D%9B%E9%BB%91%E5%90%8D%E5%8D%95%E5%B8%96%E5%AD%90%E6%A3%80%E6%B5%8B%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
// GM_deleteValue('detectedHiddenPosts');
    // 添加自定义样式
    GM_addStyle(`
        .hidden-post-item {
            background-color: #fff0f0 !important;
            border-left: 3px solid #ff0000 !important;
            padding-left: 5px !important;
        }
        .hidden-post-alert {
            color: #ff0000;
            font-weight: bold;
        }
        .hidden-post-title {
            font-style: italic;
        }
    `);

    // 存储已检测到的隐藏帖子
    const detectedHiddenPosts = GM_getValue('detectedHiddenPosts', {});
    let currentPagePosts = new Set();
    let isLoadingMore = false;
    let observer;

    // 主函数
    function main() {
        // 监听异步加载
        setupObserver();

        // 处理当前页面内容
        processPage();
    }

    // 设置观察者监听异步加载
    function setupObserver() {
        const targetNode = document.getElementById('KL_show_tip');
        if (!targetNode) return;

        observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'characterData' || mutation.addedNodes.length > 0) {
                    // 延迟处理以确保内容已加载
                    setTimeout(processPage, 500);
                }
            });
        });

        observer.observe(targetNode, {
            characterData: true,
            childList: true,
            subtree: true
        });
    }

    // 处理页面内容
    function processPage() {
        // 获取所有帖子元素
        const postElements = document.querySelectorAll('body > .listdata:not(:has(img[src*="top.gif"])), #KL_show_next_list .listdata');
        if (postElements.length === 0) return;

        // 提取当前页面所有帖子ID
        currentPagePosts.clear();
        const postIds = [];

        postElements.forEach(element => {
            const postLink = element.querySelector('a.topic-link[href*="/bbs-"]');
            if (postLink) {
                const href = postLink.getAttribute('href');
                const match = href.match(/\/bbs-(\d+)\.html/);
                if (match) {
                    const postId = parseInt(match[1], 10);
                    currentPagePosts.add(postId);
                    postIds.push(postId);
                }
            }
        });

        if (postIds.length === 0) return;

        // 找到最小和最大帖子ID
        const minPostId = Math.min(...postIds);
        const maxPostId = Math.max(...postIds);
        console.log(`检测到帖子ID范围: ${minPostId} - ${maxPostId}`);

        // 检查缺失的帖子
        checkMissingPosts(minPostId, maxPostId, postElements[0].parentNode);
    }

    function checkMissingPosts(minPostId, maxPostId, container) {
        for (let postId = minPostId; postId <= maxPostId; postId++) {
            if (currentPagePosts.has(postId)) continue;

            if (detectedHiddenPosts[postId]) {
                displayHiddenPost(postId, detectedHiddenPosts[postId], container);
            } else {
                fetchPostInfo(postId, container);
            }
        }
    }

    function fetchPostInfo(postId, container) {
        const url = `/bbs-${postId}.html`;

        if (detectedHiddenPosts[postId]) {
            displayHiddenPost(postId, detectedHiddenPosts[postId], container);
            return;
        }

        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                if (response.status === 200) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, "text/html");

let titleLabelSpan = doc.querySelector('span.biaotiwenzi');

let titleTextNode = titleLabelSpan ? titleLabelSpan.nextSibling :null;


                    let title = titleTextNode ? titleTextNode.textContent.trim() : "未知标题";

                  let authorElem = doc.querySelector(".louzhunicheng");
                  let author = authorElem ? doc.querySelector(".louzhunicheng a").outerHTML : "未知作者";


                    const deletedCheck = doc.querySelector('body');
                    if (deletedCheck && deletedCheck.textContent.includes('删除') ||
                        deletedCheck.textContent.includes('不存在') ||
                       deletedCheck.textContent.includes('正在审核中') ) {
                        title = "[帖子已被删除]";
                      return;
                    }

                    detectedHiddenPosts[postId] = {
                        title: title,
                        url: url,
                      author: author,
                        timestamp: Date.now()
                    };

                    GM_setValue('detectedHiddenPosts', detectedHiddenPosts);


                    //displayHiddenPost(postId, detectedHiddenPosts[postId], container);
                } else if (response.status === 404) {
                    // 帖子不存在或已被删除
//                     detectedHiddenPosts[postId] = {
//                         title: "[帖子已被删除]",
//                         url: url,
//                         timestamp: Date.now()
//                     };

//                     GM_setValue('detectedHiddenPosts', detectedHiddenPosts);
//                     displayHiddenPost(postId, detectedHiddenPosts[postId], container);
                }
            },
            onerror: function() {
                // 请求失败，可能是帖子不存在或其他错误
                detectedHiddenPosts[postId] = {
                    title: "[无法获取帖子信息]",
                    url: url,
                  author: null,
                    timestamp: Date.now()
                };

                GM_setValue('detectedHiddenPosts', detectedHiddenPosts);
                displayHiddenPost(postId, detectedHiddenPosts[postId], container);
            }
        });
    }

    // 显示隐藏的帖子
    function displayHiddenPost(postId, postInfo, container) {
        // 检查是否已经显示过这个帖子
        const existingDisplay = document.getElementById(`hidden-post-${postId}`);
        if (existingDisplay) return;
        if(postInfo.title == "[帖子已被删除]") return;

        // 创建显示元素
        const displayElement = document.createElement('div');
        displayElement.id = `hidden-post-${postId}`;
        displayElement.className = 'listdata hidden-post-item';

        // 确定行样式（交替行）
        const postCount = document.querySelectorAll('.listdata')[0].classList.contains('line1');
        displayElement.classList.add(postCount ? 'line2' : 'line1');

        // 构建内容
        displayElement.innerHTML = `
            ${postCount + 1}. <span class="hidden-post-alert">[黑名单隐藏]</span>
            <a class="topic-link hidden-post-title" href="${postInfo.url}" target="_blank">${postInfo.title}</a><br>
            ${postInfo.author}/
            <span class="hidden-post-alert">-</span>回/
            <span class="hidden-post-alert">-</span>阅
            <span class="right">检测时间: ${new Date().toLocaleTimeString()}</span>
        `;

        // 插入到容器中适当位置
        // 尝试找到正确的位置插入（按帖子ID顺序）
        const allPosts = container.querySelectorAll('.listdata');
        let inserted = false;

        for (let i = 0; i < allPosts.length; i++) {
            const currentPost = allPosts[i];
            const currentLink = currentPost.querySelector('a.topic-link[href*="/bbs-"]');
            if (currentLink) {
                const currentHref = currentLink.getAttribute('href');
                const currentMatch = currentHref.match(/\/bbs-(\d+)\.html/);
                if (currentMatch) {
                    const currentPostId = parseInt(currentMatch[1], 10);
                    if (currentPostId < postId) continue;

                    // 找到第一个比当前帖子ID大的帖子，插入到它前面
                    container.insertBefore(displayElement, currentPost);
                    inserted = true;
                    break;
                }
            }
        }

        // 如果没有找到合适位置，添加到末尾
        if (!inserted) {
            container.appendChild(displayElement);
        }

        console.log(`检测到隐藏帖子: ${postId} - ${postInfo.title}`);
    }

    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();