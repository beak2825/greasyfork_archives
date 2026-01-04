// ==UserScript==
// @name         妖火黑名单增强版
// @namespace    https://www.yaohuo.me/
// @version      1.0.1
// @description  适用于妖火论坛全局屏蔽黑名单中用户（通过ID匹配）
// @author       SiXi
// @match        https://www.yaohuo.me/*
// @match        https://yaohuo.me/*
// @icon         https://www.yaohuo.me/css/favicon.ico
// @license      Apache 2
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526739/%E5%A6%96%E7%81%AB%E9%BB%91%E5%90%8D%E5%8D%95%E5%A2%9E%E5%BC%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/526739/%E5%A6%96%E7%81%AB%E9%BB%91%E5%90%8D%E5%8D%95%E5%A2%9E%E5%BC%BA%E7%89%88.meta.js
// ==/UserScript==

// 免责声明：依据妖火论坛版规，不能将站长及管理员加入黑名单，请遵守论坛规章制度。

(function() {
    'use strict';

    // 在中括号[]中输入要屏蔽的用户ID（纯数字,多个ID之间用英文逗号分隔）
    const blockUserIds = [];

    // 提取用户ID
    function extractUserId(url) {
        const match = url.match(/[?&](?:touserid|mainuserid)=(\d+)/);
        return match ? match[1] : null;
    }

    // 处理帖子列表（首页、版块列表、帖子详情页）
    async function handlePostList() {
        const lists = document.querySelectorAll('.list, .listdata.line1, .listdata.line2');

        for (const list of lists) {
            const links = list.querySelectorAll('a[href^="/bbs-"]');

            for (const link of links) {
                const postId = link.href.match(/\/bbs-(\d+)\.html/)?.[1];
                if (!postId) continue;

                try {
                    const response = await fetch(`https://www.yaohuo.me/bbs/Book_View_admin.aspx?id=${postId}`);//使用“管理”功能查询帖子作者ID
                    const text = await response.text();
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(text, 'text/html');

                    const authorLink = doc.querySelector('a[href*="touserid"]');
                    if (authorLink) {
                        const authorId = extractUserId(authorLink.href);
                        console.log('解析到帖子ID:', postId, '作者ID:', authorId);

                        if (authorId && blockUserIds.includes(Number(authorId))) {
                            console.log('发现此帖作者在黑名单中');

                            // 处理不同类型的帖子列表
                            if (list.className === 'list') {
                                // 首页和帖子详情页的推荐帖子列表
                                const nextBr = link.nextElementSibling;
                                if (nextBr && nextBr.tagName === 'BR') {
                                    link.style.display = 'none';
                                    nextBr.style.display = 'none';
                                    const textNode = link.previousSibling;
                                    if (textNode && textNode.nodeType === Node.TEXT_NODE) {
                                        textNode.textContent = '';
                                    }
                                    console.log('已隐藏推荐列表帖子:', link.textContent);
                                }
                            } else {
                                // 板块帖子列表
                                const listItem = link.closest('.listdata');
                                if (listItem) {
                                    listItem.style.display = 'none';
                                    console.log('已隐藏板块帖子:', link.textContent);
                                }
                            }
                        }
                    }
                } catch (error) {
                    console.error('获取帖子信息失败:', error);
                }
            }
        }
    }

    // 处理评论区
    function handleComments() {
        const comments = document.querySelectorAll('.forum-post');

        comments.forEach(comment => {
            const userIdLink = comment.querySelector('.user-id a');
            if (userIdLink) {
                const userId = userIdLink.textContent.replace(/[()]/g, '');
                console.log('找到评论，层主ID:', userId);

                if (userId && blockUserIds.includes(Number(userId))) {
                    comment.style.display = 'none';
                    console.log('已隐藏评论');
                }
            }
        });
    }

    function main() {
        handlePostList();
        handleComments();
    }

    main();
})();