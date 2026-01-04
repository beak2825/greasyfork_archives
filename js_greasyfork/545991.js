// ==UserScript==
// @name         Pixiv小说标签屏蔽器
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  右键点击pixiv小说的tag标签进行屏蔽，搜索时不再显示包含该标签的小说
// @author       You
// @match        https://www.pixiv.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixiv.net
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545991/Pixiv%E5%B0%8F%E8%AF%B4%E6%A0%87%E7%AD%BE%E5%B1%8F%E8%94%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/545991/Pixiv%E5%B0%8F%E8%AF%B4%E6%A0%87%E7%AD%BE%E5%B1%8F%E8%94%BD%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 存储屏蔽的标签
    let blockedTags = GM_getValue('blockedTags', []);

    // 保存屏蔽标签
    function saveBlockedTags() {
        GM_setValue('blockedTags', blockedTags);
    }

    // 添加屏蔽标签
    function addBlockedTag(tag) {
        if (!blockedTags.includes(tag)) {
            blockedTags.push(tag);
            saveBlockedTags();
            console.log(`已屏蔽标签: ${tag}`);
            filterNovels(); // 立即过滤
        }
    }

    // 移除屏蔽标签
    function removeBlockedTag(tag) {
        blockedTags = blockedTags.filter(t => t !== tag);
        saveBlockedTags();
        console.log(`已解除屏蔽标签: ${tag}`);
    }

    // 检查是否包含屏蔽标签（包含匹配）
    function hasBlockedTag(tags) {
        // 遍历所有标签，检查是否有任何标签包含被屏蔽的关键词
        return tags.some(tag => {
            // 遍历所有被屏蔽的标签，检查是否有任何一个是当前标签的子字符串
            return blockedTags.some(blockedTag => tag.includes(blockedTag));
        });
    }

    // 过滤小说
    function filterNovels() {
        console.log('[Pixiv标签屏蔽器] 执行过滤，当前屏蔽标签:', blockedTags);
        // 优化选择器，匹配更多可能的小说容器
        // 进一步扩展小说容器选择器，匹配更多可能的类名
        const novelItems = document.querySelectorAll(
            '.novel-card, .novel-item, .gtm-novel-thumbnail, .sc-81a2329c-0, ' +
            '.sc-254256c2-11, .sc-bf8cea3f-2, [class*="novel-item"], [class*="novel-card"]'
        );
        console.log(`[Pixiv标签屏蔽器] 找到 ${novelItems.length} 个小说项`);
        novelItems.forEach(item => {
            // 优化标签选择器，适配更多可能的标签结构
            // 修复语法错误，使用正确的多行字符串连接
            const tagElements = item.querySelectorAll(
                '.tag > span, .tag, .sc-b74cc9f6-11, .sc-b74cc9f6-10 a.sc-b74cc9f6-11, ' +
                '.sc-7c939c96-1, .sc-7c939c96-0 span, .sc-27a487a2-1'
            );

            const tags = Array.from(tagElements).map(tag => {
                const text = tag.textContent.trim().replace(/^[\*]+|[\*]+$/g, '').trim();
                return text;
            }).filter(Boolean); // 过滤空标签

            console.log(`[Pixiv标签屏蔽器] 小说项标签:`, tags);
            const shouldBlock = hasBlockedTag(tags);

            if (shouldBlock) {
                item.style.display = 'none';
                console.log(`[Pixiv标签屏蔽器] 已屏蔽小说项，包含标签:`, tags);
            } else {
                item.style.display = '';
            }
        });
    }

    // 创建右键菜单
    function createContextMenu() {
        // 监听文档的右键点击事件
        document.addEventListener('contextmenu', function (e) {
            // 获取选中的文本
            const selectedText = window.getSelection().toString().trim();
            // 检查是否点击了标签元素
            // 适配多种可能的标签元素选择器
            const tagElement = e.target.closest('.tag > span, .tag, .sc-b74cc9f6-11, .sc-b74cc9f6-10 a.sc-b74cc9f6-11');
            let tag = '';

            // 优化标签获取逻辑
            if (tagElement) {
                tag = tagElement.textContent.trim();
                e.preventDefault();
            } else if (selectedText) {
                tag = selectedText;
                e.preventDefault();
            }

            // 确保有标签内容时创建菜单
            if (tag) {
                console.log('[Pixiv标签屏蔽器] 创建右键菜单，标签内容:', tag); // 调试日志
                // 创建自定义菜单
                const menu = document.createElement('div');
                menu.style.position = 'absolute';
                menu.style.left = `${e.pageX}px`;
                menu.style.top = `${e.pageY}px`;
                menu.style.backgroundColor = 'white';
                menu.style.border = '1px solid #ccc';
                menu.style.borderRadius = '4px';
                menu.style.padding = '8px';
                menu.style.zIndex = '9999';
                menu.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                menu.style.minWidth = '150px'; // 确保菜单有足够宽度

                // 添加选中的tag选项
                const addOption = document.createElement('div');
                addOption.textContent = `添加选中的tag: ${tag}`;
                addOption.style.padding = '4px 8px';
                addOption.style.cursor = 'pointer';
                addOption.addEventListener('mouseover', () => addOption.style.backgroundColor = '#f0f0f0');
                addOption.addEventListener('mouseout', () => addOption.style.backgroundColor = '');
                addOption.addEventListener('click', () => {
                    addBlockedTag(tag);
                    document.body.removeChild(menu);
                });
                menu.appendChild(addOption);

                // 如果标签已被屏蔽，添加解除屏蔽选项
                if (blockedTags.includes(tag)) {
                    const unblockOption = document.createElement('div');
                    unblockOption.textContent = `解除屏蔽标签: ${tag}`;
                    unblockOption.style.padding = '4px 8px';
                    unblockOption.style.cursor = 'pointer';
                    unblockOption.addEventListener('mouseover', () => unblockOption.style.backgroundColor = '#f0f0f0');
                    unblockOption.addEventListener('mouseout', () => unblockOption.style.backgroundColor = '');
                    unblockOption.addEventListener('click', () => {
                        removeBlockedTag(tag);
                        document.body.removeChild(menu);
                    });
                    menu.appendChild(unblockOption);
                }

                // 点击其他地方关闭菜单
                const closeMenu = function (e) {
                    if (!menu.contains(e.target)) {
                        document.body.removeChild(menu);
                        document.removeEventListener('click', closeMenu);
                    }
                };
                document.addEventListener('click', closeMenu);

                document.body.appendChild(menu);
            } else {
                console.log('[Pixiv标签屏蔽器] 未创建菜单，无标签内容或选中文本'); // 调试日志
            }
        });
    }

    // 添加查看屏蔽标签菜单
    GM_registerMenuCommand('查看屏蔽标签', function () {
        alert(`已屏蔽的标签:\n${blockedTags.join('\n')}`);
    });

    // 添加清除屏蔽标签菜单
    GM_registerMenuCommand('清除所有屏蔽标签', function () {
        if (confirm('确定要清除所有屏蔽标签吗？')) {
            blockedTags = [];
            saveBlockedTags();
            filterNovels();
            alert('已清除所有屏蔽标签');
        }
    });

    // 添加添加选中标签菜单
    GM_registerMenuCommand('添加选中标签', function () {
        const selectedText = window.getSelection().toString().trim();
        if (selectedText) {
            addBlockedTag(selectedText);
            alert(`已添加屏蔽标签: ${selectedText}`);
        } else {
            alert('请先选中要屏蔽的标签文本');
        }
    });

    // 页面加载完成后初始化
    window.addEventListener('DOMContentLoaded', function () {
        createContextMenu();
        filterNovels(); // 立即执行一次过滤
    });

    // 页面完全加载后再执行一次过滤，确保所有内容都被处理
    window.addEventListener('load', function () {
        filterNovels();
    });

    // 监听页面变化，用于AJAX加载的内容
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.addedNodes.length > 0) {
                filterNovels();
            }
        });
    });

    // 配置并启动观察者
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();