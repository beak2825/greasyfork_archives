// ==UserScript==
// @name         知乎黑名单
// @namespace    http://tampermonkey.net/
// @version      4.26
// @description  根据用户名屏蔽评论、文章和答案，支持搜索结果页、推荐页和问题详情页；根据关键词屏蔽问题，支持推荐页、搜索结果页
// @author       AI
// @match        *://www.zhihu.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/531048/%E7%9F%A5%E4%B9%8E%E9%BB%91%E5%90%8D%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/531048/%E7%9F%A5%E4%B9%8E%E9%BB%91%E5%90%8D%E5%8D%95.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const BLOCK_FLAG = 'data-zh-block'; // 标记已屏蔽的容器
    let observer; // DOM 变化观察者
    let pendingProcess = false; // 标记 processDOM 是否已调度

    // 缓存节点作者名称，避免重复 DOM 查询
    const authorCache = new WeakMap();

    // 缓存屏蔽用户列表和关键词列表
    let blockedSet = new Set(GM_getValue("blockedUsers", []).map(name => name.trim().toLowerCase()));
    let blockedKeywords = new Set(GM_getValue("blockedKeywords", []).map(keyword => keyword.trim().toLowerCase()));

    // 规范化用户名或关键词，处理 Unicode 字符
    const normalizeName = (name) => name.trim().normalize('NFKC').toLowerCase();

    // 更新屏蔽用户列表
    const blockUser = (name) => {
        name = normalizeName(name);
        if (name === '') return;
        blockedSet.add(name);
        GM_setValue("blockedUsers", Array.from(blockedSet));
        scheduleProcessDOM();
    };

    // 更新屏蔽关键词列表
    const blockKeyword = (keyword) => {
        keyword = normalizeName(keyword);
        if (keyword === '') return;
        blockedKeywords.add(keyword);
        GM_setValue("blockedKeywords", Array.from(blockedKeywords));
        scheduleProcessDOM();
    };

    // 统一获取作者名的函数，覆盖所有场景
    async function getAuthorName(element, retryCount = 0) {
        if (authorCache.has(element)) {
            return authorCache.get(element);
        }
        let authorName = '';

        // 优先级 1：从 data-zop 属性获取（场景 2、4）
        const zopData = element.getAttribute('data-zop');
        if (zopData) {
            try {
                const zop = JSON.parse(zopData.replace(/'/g, '"'));
                if (zop.authorName) {
                    authorName = normalizeName(zop.authorName);
                }
            } catch (e) {
            }
        }

        // 优先级 2：从 img.Avatar 的 alt 属性获取（场景 1、5、6）
        if (!authorName) {
            const avatarImage = element.querySelector('img.Avatar');
            if (avatarImage) {
                authorName = normalizeName(avatarImage.getAttribute('alt') || '');
            }
        }

        // 优先级 3：从 AuthorInfo 的 UserLink 获取（场景 2、4）
        if (!authorName) {
            const authorNameLink = element.querySelector('.AuthorInfo .AuthorInfo-name .UserLink-link, .AuthorInfo a[href*="/people/"]');
            if (authorNameLink) {
                authorName = normalizeName(authorNameLink.textContent);
            }
        }

        // 优先级 4：从富文本的 b[data-first-child] 获取（场景 1、3）
        if (!authorName) {
            const richTextSpan = element.querySelector('.RichContent-inner .RichText.ztext.CopyrightRichText-richText, .RichText.ztext.CopyrightRichText-richText');
            if (richTextSpan) {
                const authorTag = richTextSpan.querySelector('b[data-first-child]');
                if (authorTag) {
                    authorName = normalizeName(authorTag.textContent);
                }
            }
        }

        // 优先级 5：从折叠内容的富文本检查（场景 2、4）
        if (!authorName) {
            const richContentCollapsed = element.querySelector('.RichContent.is-collapsed');
            if (richContentCollapsed) {
                const richTextSpan = richContentCollapsed.querySelector('.RichContent-inner .RichText.ztext.CopyrightRichText-richText');
                if (richTextSpan) {
                    const textContent = richTextSpan.textContent.trim();
                    for (const blockedName of blockedSet) {
                        if (textContent.startsWith(`${blockedName}： `)) {
                            authorName = blockedName;
                            break;
                        }
                    }
                }
            }
        }

        // Retry if empty and retryCount < 2
        if (!authorName && retryCount < 2) {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(getAuthorName(element, retryCount + 1));
                }, 100); // Wait 100ms before retry
            });
        }

        authorCache.set(element, authorName);
        return authorName;
    }

    // 检查是否为屏蔽用户
    const isBlockedAuthor = async (element) => {
        const authorName = await getAuthorName(element);
        return blockedSet.has(authorName);
    };

    // 检查推荐页问题是否包含屏蔽关键词
    function hasBlockedKeyword(node) {
        const title = node.querySelector('h2.ContentItem-title a');
        if (title) {
            const titleText = normalizeName(title.textContent);
            return Array.from(blockedKeywords).find(keyword => keyword && titleText.includes(keyword));
        }
        return false;
    }

    // 场景处理函数
    // 场景 1：搜索结果页，隐藏黑名单用户的专栏文章
    async function handleSearchResultPostCard(node) {
        if (node.hasAttribute(BLOCK_FLAG)) {
            return;
        }
        const listItem = node.querySelector('.List-item');
        if (listItem && await isBlockedAuthor(listItem)) {
            node.style.display = 'none';
            node.setAttribute(BLOCK_FLAG, 'true');
        }
    }

    // 场景 2：推荐页，隐藏黑名单用户的回答、展开后的回答（打开状态）、用户信息（打开状态）、评论区（打开状态）
    async function handleRecommendationAnswer(node) {
        if (node.hasAttribute(BLOCK_FLAG)) {
            return;
        }
        if (await isBlockedAuthor(node)) {
            const richContentCollapsed = node.querySelector('.RichContent.is-collapsed');
            if (richContentCollapsed && !richContentCollapsed.hasAttribute(BLOCK_FLAG)) {
                richContentCollapsed.style.display = 'none';
                richContentCollapsed.setAttribute(BLOCK_FLAG, 'true');
            }
            const richContent = node.querySelector('.RichContent:not(.is-collapsed)');
            if (richContent && !richContent.hasAttribute(BLOCK_FLAG)) {
                richContent.style.display = 'none';
                richContent.setAttribute(BLOCK_FLAG, 'true');
            }
            const meta = node.querySelector('.ContentItem-meta');
            if (meta && !meta.hasAttribute(BLOCK_FLAG)) {
                meta.style.display = 'none';
                meta.setAttribute(BLOCK_FLAG, 'true');
            }
            const overflowDiv = node.querySelector('div[style="overflow: unset;"]');
            const commentsContainer = node.querySelector('.Comments-container');
            const hasCommentContent = commentsContainer?.querySelector('.CommentContent, .CommentItem');
            const commentSection = overflowDiv || (hasCommentContent ? commentsContainer : null);
            if (commentSection && !commentSection.hasAttribute(BLOCK_FLAG)) {
                commentSection.style.display = 'none';
                commentSection.setAttribute(BLOCK_FLAG, 'true');
            }
        }
    }

    // 场景 3：搜索结果页，隐藏黑名单用户的回答，评论区（打开状态）
    async function handleSearchResultAnswerCard(node) {
        if (node.hasAttribute(BLOCK_FLAG)) {
            return;
        }
        const richContentDiv = node.querySelector('.RichContent');
        if (richContentDiv && await isBlockedAuthor(richContentDiv)) {
            richContentDiv.style.display = 'none';
            richContentDiv.setAttribute(BLOCK_FLAG, 'true');
            const commentSection = node.querySelector('div[style="overflow: unset;"]') ||
                (node.querySelector('.Comments-container')?.querySelector('.CommentContent, .CommentItem') ? node.querySelector('.Comments-container') : null);
            if (commentSection && !commentSection.hasAttribute(BLOCK_FLAG)) {
                commentSection.style.display = 'none';
                commentSection.setAttribute(BLOCK_FLAG, 'true');
            }
        }
    }

    // 场景 4：问题页答案卡片，隐藏整个卡片
    async function handleQuestionPageAnswerCard(node) {
        if (node.hasAttribute(BLOCK_FLAG)) {
            return;
        }
        const contentItem = node.querySelector('.ContentItem.AnswerItem[data-za-detail-view-path-module="AnswerItem"]');
        if (contentItem && await isBlockedAuthor(contentItem)) {
            node.style.display = 'none';
            node.setAttribute(BLOCK_FLAG, 'true');
        }
    }

    // 场景 5：问题详情页，隐藏黑名单用户的回答
    async function handleAnswerContainer(node) {
        if (node.hasAttribute(BLOCK_FLAG)) {
            return;
        }
        if (node.closest('div.Card.SearchResult-Card[data-za-detail-view-path-module="AnswerItem"]')) {
            return;
        }
        if (await isBlockedAuthor(node)) {
            node.style.display = 'none';
            node.setAttribute(BLOCK_FLAG, 'true');
        }
    }

    // 场景 6：评论容器，处理主评论和回复
    async function handleCommentContainer(node) {
        if (node.hasAttribute(BLOCK_FLAG)) {
            return;
        }
        const children = Array.from(node.children);
        const hasReplies = children.some(child => child.getAttribute('data-id')) ||
            node.querySelector('button[class*="Button--secondary"]');

        if (hasReplies) {
            const mainComment = children.find(child => !child.getAttribute('data-id'));
            if (mainComment && !mainComment.hasAttribute(BLOCK_FLAG) && await isBlockedAuthor(mainComment)) {
                mainComment.style.display = 'none';
                mainComment.setAttribute(BLOCK_FLAG, 'true');
            }
            const outerReplyNodes = node.children;
            for (const reply of outerReplyNodes) {
                if (reply.hasAttribute('data-id') && !reply.hasAttribute(BLOCK_FLAG) && await isBlockedAuthor(reply)) {
                    reply.style.display = 'none';
                    reply.setAttribute(BLOCK_FLAG, 'true');
                }
            }
        } else {
            if (await isBlockedAuthor(node)) {
                node.style.display = 'none';
                node.setAttribute(BLOCK_FLAG, 'true');
            }
        }
    }

    // 关键词屏蔽场景 1：推荐页卡片
    function handleRecommendationCardKeyword(node) {
        if (node.hasAttribute(BLOCK_FLAG)) {
            return;
        }
        if (hasBlockedKeyword(node)) {
            node.style.display = 'none';
            node.setAttribute(BLOCK_FLAG, 'true');
        }
    }

    // 关键词屏蔽场景 2：搜索结果文章卡片
    function handleSearchResultPostCardKeyword(node) {
        if (node.hasAttribute(BLOCK_FLAG)) {
            return;
        }
        if (hasBlockedKeyword(node)) {
            node.style.display = 'none';
            node.setAttribute(BLOCK_FLAG, 'true');
        }
    }

    // 处理单个节点
    async function processNode(node) {
        if (node.matches('div.Card.TopstoryItem.TopstoryItem-isRecommend')) {
            handleRecommendationCardKeyword(node);
        } else if (node.matches('div.Card.SearchResult-Card[data-za-detail-view-path-module="PostItem"]')) {
            handleSearchResultPostCardKeyword(node);
        }

        if (node.matches('div.Card.SearchResult-Card[data-za-detail-view-path-module="PostItem"]')) {
            await handleSearchResultPostCard(node);
        } else if (node.matches('div.ContentItem')) {
            await handleRecommendationAnswer(node);
        } else if (node.matches('div.Card.SearchResult-Card[data-za-detail-view-path-module="AnswerItem"]')) {
            await handleSearchResultAnswerCard(node);
        } else if (node.matches('div.Card.AnswerCard')) {
            await handleQuestionPageAnswerCard(node);
        } else if (node.matches('.List-item')) {
            await handleAnswerContainer(node);
        } else if (node.matches('div[data-id]')) {
            await handleCommentContainer(node);
        }
    }

    // 处理 DOM 节点集合
    const processDOM = async (nodes = document.querySelectorAll(
        '.List-item:not(.css-0), div[data-id]:not(.css-0), div.Card.SearchResult-Card[data-za-detail-view-path-module="PostItem"]:not(.css-0), div.Card.SearchResult-Card[data-za-detail-view-path-module="AnswerItem"]:not(.css-0), div.Card.AnswerCard:not(.css-0), div.ContentItem:not(.css-0), div.Card.TopstoryItem.TopstoryItem-isRecommend:not(.css-0)'
    )) => {
        for (const node of nodes) {
            await processNode(node);
        }
        const unprocessedContentItems = document.querySelectorAll(`div.ContentItem:not([${BLOCK_FLAG}]):not(.css-0)`);
        for (const node of unprocessedContentItems) {
            await processNode(node);
        }
    };

    // 调度 DOM 处理
    const scheduleProcessDOM = (nodes) => {
        if (!pendingProcess) {
            pendingProcess = true;
            requestAnimationFrame(async () => {
                await processDOM(nodes);
                pendingProcess = false;
            });
        }
    };

    // 右键菜单：添加屏蔽用户选项
    const createUserContextMenu = (e) => {
        const link = e.target.closest('a[href*="/people/"][target="_blank"], a[href*="/org/"][target="_blank"]');
        if (!link) return;
        e.preventDefault();
        document.querySelectorAll('.zh-block-menu').forEach(m => m.remove());
        const menu = document.createElement('div');
        menu.className = 'zh-block-menu';
        const menuWidth = 150;
        const menuHeight = 40;
        const x = Math.min(e.clientX + 5, window.innerWidth - menuWidth);
        const y = Math.min(e.clientY + 5, window.innerHeight - menuHeight);
        menu.style.cssText = `
            position: fixed;
            top: ${y}px;
            left: ${x}px;
            background: #fff;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            padding: 8px 16px;
            z-index: 9999999999;
            cursor: pointer;
            box-shadow: 0 3px 6px rgba(0,0,0,0.16);
            font: 14px/1.5 -apple-system, BlinkMacSystemFont, sans-serif;
            transition: background 0.2s ease;
        `;
        menu.innerHTML = `屏蔽该用户`;
        menu.addEventListener('mouseover', () => {
            menu.style.background = '#ffcccc';
        });
        menu.addEventListener('mouseout', () => {
            menu.style.background = '#fff';
        });
        menu.addEventListener('click', (ev) => {
            ev.stopPropagation();
            blockUser(link.textContent.trim());
            menu.remove();
        });
        document.body.appendChild(menu);
    };

    // 右键菜单：添加屏蔽关键词选项
    const createKeywordContextMenu = (e) => {
        const title = e.target.closest('h2.ContentItem-title a');
        if (!title) return;
        e.preventDefault();
        document.querySelectorAll('.zh-block-menu').forEach(m => m.remove());
        const menu = document.createElement('div');
        menu.className = 'zh-block-menu';
        const menuWidth = 150;
        const menuHeight = 40;
        const x = Math.min(e.clientX + 5, window.innerWidth - menuWidth);
        const y = Math.min(e.clientY + 5, window.innerHeight - menuHeight);
        menu.style.cssText = `
            position: fixed;
            top: ${y}px;
            left: ${x}px;
            background: #fff;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            padding: 8px 16px;
            z-index: 9999999999;
            cursor: pointer;
            box-shadow: 0 3px 6px rgba(0,0,0,0.16);
            font: 14px/1.5 -apple-system, BlinkMacSystemFont, sans-serif;
            transition: background 0.2s ease;
        `;
        menu.innerHTML = `选择屏蔽关键词`;
        menu.addEventListener('mouseover', () => {
            menu.style.background = '#ffcccc';
        });
        menu.addEventListener('mouseout', () => {
            menu.style.background = '#fff';
        });
        menu.addEventListener('click', (ev) => {
            ev.stopPropagation();
            menu.remove();
            const keyword = prompt('请输入要屏蔽的关键词：');
            if (keyword && keyword.trim()) {
                blockKeyword(keyword.trim());
            }
        });
        document.body.appendChild(menu);
    };

    // 初始化脚本
    const init = async () => {
        await processDOM();
        observeAnswerItems();

        // 全局事件：关闭右键菜单
        const handleGlobalEvent = () => {
            const menu = document.querySelector('.zh-block-menu');
            if (menu) menu.remove();
        };
        document.addEventListener('click', handleGlobalEvent);
        document.addEventListener('scroll', handleGlobalEvent);

        // 监控 DOM 变化
        observer = new MutationObserver((mutations) => {
            const nodesToProcess = new Set();
            mutations.forEach(mut => {
                if (mut.addedNodes.length) {
                    mut.addedNodes.forEach(node => {
                        if (node.nodeType !== 1 || node.matches('.css-0')) return;
                        if (
                            node.matches('.List-item, div[data-id], div.Card.SearchResult-Card[data-za-detail-view-path-module="PostItem"], div.Card.SearchResult-Card[data-za-detail-view-path-module="AnswerItem"], div.Card.AnswerCard, div.ContentItem, div.Card.TopstoryItem.TopstoryItem-isRecommend') ||
                            node.querySelector('.List-item, div[data-id], div.Card.SearchResult-Card[data-za-detail-view-path-module="PostItem"], div.Card.SearchResult-Card[data-za-detail-view-path-module="AnswerItem"], div.Card.AnswerCard, div.ContentItem, div.Card.TopstoryItem.TopstoryItem-isRecommend')
                        ) {
                            nodesToProcess.add(node);
                            node.querySelectorAll('.List-item, div[data-id], div.Card.SearchResult-Card[data-za-detail-view-path-module="PostItem"], div.Card.SearchResult-Card[data-za-detail-view-path-module="AnswerItem"], div.Card.AnswerCard, div.ContentItem, div.Card.TopstoryItem.TopstoryItem-isRecommend')
                                .forEach(n => nodesToProcess.add(n));
                        }
                    });
                }
            });
            if (nodesToProcess.size) {
                scheduleProcessDOM(nodesToProcess);
                observeAnswerItems();
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false
        });

        // 单独处理 ContentItem 的评论加载
        function observeAnswerItems() {
            document.querySelectorAll('.ContentItem.AnswerItem').forEach(item => {
                const commentMount = item.querySelector('div.Comments-container');
                if (commentMount && !commentMount.__observed) {
                    commentMount.__observed = true;
                    const mo = new MutationObserver(mutations => {
                        mutations.forEach(m => {
                            m.addedNodes.forEach(node => {
                                if (node.nodeType !== 1) return;
                                if (node.matches('.Comments-container') || node.querySelector('.Comments-container')) {
                                    processDOM(node);
                                }
                            });
                        });
                    });
                    mo.observe(commentMount, {childList: true});
                }
            });
        }

        // 优化滚动事件
        let isScrolling;
        window.addEventListener('scroll', () => {
            clearTimeout(isScrolling);
            isScrolling = setTimeout(() => {
                processDOM();
            }, 200);
        }, false);
    };

    // 绑定事件
    document.addEventListener('contextmenu', (e) => {
        document.querySelectorAll('.zh-block-menu').forEach(m => m.remove());
        if (e.target.closest('h2.ContentItem-title a')) {
            createKeywordContextMenu(e);
        } else {
            createUserContextMenu(e);
        }
    }, true);
    window.addEventListener('pageshow', () => processDOM());
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();