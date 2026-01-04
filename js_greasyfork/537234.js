// ==UserScript==
// @name         Bangumi 用户收藏页标签反选
// @namespace    https://bgm.tv/
// @version      1.01
// @description  为右侧标签列表添加反选按钮，点击可隐藏包含该标签的条目。适用于动画/音乐等的想看/看过等条目列表页。
// @author       Kunimisaya
// @match        *://bgm.tv/*/list/*/*
// @match        *://bangumi.tv/*/list/*/*
// @match        *://chii.in/*/list/*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537234/Bangumi%20%E7%94%A8%E6%88%B7%E6%94%B6%E8%97%8F%E9%A1%B5%E6%A0%87%E7%AD%BE%E5%8F%8D%E9%80%89.user.js
// @updateURL https://update.greasyfork.org/scripts/537234/Bangumi%20%E7%94%A8%E6%88%B7%E6%94%B6%E8%97%8F%E9%A1%B5%E6%A0%87%E7%AD%BE%E5%8F%8D%E9%80%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 扩展侧栏宽度
    const sidePanel = document.querySelector('.SimpleSidePanel');
    if (sidePanel) sidePanel.style.width = '240px';

    // 初始化排除标签集合
    let excludedTags = new Set();

    // 获取左侧条目列表项
    function getItemList() {
        return document.querySelectorAll('#browserItemList .item');
    }

    // 获取条目中的标签
    function getTagsFromItem(item) {
        const tagSpan = item.querySelector('.collectInfo .tip');
        if (!tagSpan) return [];
        return tagSpan.textContent.replace('标签: ', '').split(/\s+/).filter(t => t);
    }

    // 更新条目显示状态
    function updateItemVisibility() {
        getItemList().forEach(item => {
            const tags = getTagsFromItem(item);
            const shouldHide = [...excludedTags].some(tag => tags.includes(tag));
            item.style.display = shouldHide ? 'none' : '';
        });
    }

    // 为每个标签添加反选按钮
    function enhanceTags() {
        const tagListItems = document.querySelectorAll('#userTagList li');
        tagListItems.forEach(li => {
            const a = li.querySelector('a');
            if (!a || li.querySelector('.invert-btn')) return;

            const tagText = a.textContent.trim().replace(/^\d+/, '').trim();
            const btn = document.createElement('button');
            btn.textContent = ' 反选 ';
            btn.className = 'invert-btn';
            btn.style.marginLeft = '4px';
            btn.style.fontSize = '10px';
            btn.style.padding = '1px 4px';
            btn.style.cursor = 'pointer';

            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (excludedTags.has(tagText)) {
                    excludedTags.delete(tagText);
                    btn.textContent = ' 反选 ';
                    btn.style.background = '';
                } else {
                    excludedTags.add(tagText);
                    btn.textContent = '取消反选';
                    btn.style.background = '';
                }
                updateItemVisibility();
            });

            a.after(btn);
        });
    }

    // 监听页面 DOM 更新（分页后刷新标签处理）
    const observer = new MutationObserver(() => {
        enhanceTags();
        updateItemVisibility();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // 初始化
    enhanceTags();
})();
