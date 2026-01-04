// ==UserScript==
// @name         danbooru tagger
// @namespace    http://tampermonkey.net/danbouru-tagger
// @version      2025-06-30
// @description  danbooru tag copy hleper
// @author       someguy
// @match        https://danbooru.donmai.us/posts/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541166/danbooru%20tagger.user.js
// @updateURL https://update.greasyfork.org/scripts/541166/danbooru%20tagger.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let container = document.querySelector("#tag-list");
    let pre = document.querySelector("#tag-list .tag-list");

     // 创建提示框
    function showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.right = '20px';
        toast.style.background = 'rgba(0,0,0,0.75)';
        toast.style.color = '#fff';
        toast.style.padding = '8px 12px';
        toast.style.borderRadius = '4px';
        toast.style.fontSize = '14px';
        toast.style.zIndex = 9999;
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        document.body.appendChild(toast);
        requestAnimationFrame(() => { toast.style.opacity = '1'; });
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 1500);
    }

    // 复制文本到剪贴板
    function copyToClipboard(text) {
        if (typeof GM_setClipboard !== "undefined") {
            GM_setClipboard(text);
        } else if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
        }
    }

    // 通用提取函数
    function getTagsByCategory(category) {
        let selector;
        if (category === 'artist') {
            selector = '#tag-list .artist-tag-list .search-tag';
        } else if (category === 'character') {
            selector = '#tag-list .character-tag-list .search-tag';
        } else if (category == 'copyright') {
            selector = '#tag-list .copyright-tag-list .search-tag';
        } else if (category == 'general') {
            selector = '#tag-list .general-tag-list .search-tag';
        } else if (category == 'meta') {
            selector = '#tag-list .meta-tag-list .search-tag';
        } else {
            selector = '#tag-list .search-tag';
        }
        const elements = document.querySelectorAll(selector);
        return Array.from(elements).map(el => el.textContent.trim()).join(', ');
    }

    // 创建按钮
    function createButton(text, onClick) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.style.margin = '4px';
        btn.style.marginBottom = '14px';
        btn.style.padding = '4px 8px';
        btn.style.fontSize = '13px';
        btn.style.background = '#3498db';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '4px';
        btn.style.cursor = 'pointer';
        btn.addEventListener('click', onClick);
        return btn;
    }

    // 添加按钮
    container.insertBefore(createButton('📋 复制所有 Tags', () => {
        let cs = ['artist', 'copyright', 'character', 'general', 'meta'];
        let tags = [];
        for (let c of cs) {
            let ts = getTagsByCategory(c);
            tags.push(ts);
        }
        copyToClipboard(Array.from(tags).join(',\n')+',');
        showToast('已复制所有 Tags');
    }), pre);

})();