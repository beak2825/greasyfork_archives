// ==UserScript==
// @name         S1头像替换
// @namespace    https://bbs.saraba1st.com
// @version      1.4
// @description  在 S1 论坛头像右上角显示按钮，点击后替换为 Dicebear 图像。
// @author       hexie
// @match        https://*.saraba1st.com/2b/*
// @match        https://stage1st.com/2b/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=saraba1st.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503359/S1%E5%A4%B4%E5%83%8F%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/503359/S1%E5%A4%B4%E5%83%8F%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Dicebear API 配置
    const DICEBEAR_API_URL = 'https://api.dicebear.com/9.x/thumbs/svg';

    /**
     * 从用户链接中提取 uid。
     */
    function extractUidFromHref(href) {
        if (!href) return null;
        const match = href.match(/uid-(\d+)\.html/);
        return match ? match[1] : null;
    }

    /**
     * 替换指定 uid 的头像。
     */
    function replaceAvatar(uid) {
        if (!uid) return;
        const seed = uid;
        const newSrc = `${DICEBEAR_API_URL}?seed=${seed}`;

        document.querySelectorAll(`img[data-uid="${uid}"]`).forEach((imgElement) => {
            if (!imgElement.hasAttribute('data-original-src')) {
                imgElement.setAttribute('data-original-src', imgElement.dataset.original || imgElement.src);
            }
            imgElement.src = newSrc;
        });

        GM_setValue(uid, newSrc);
        // console.log(`[S1 Avatar Replacer] Replaced avatar for UID: ${uid}`);
    }

    /**
     * 恢复指定 uid 的头像为原始头像。
     */
    function resetAvatar(uid) {
        if (!uid) return;
        GM_deleteValue(uid);

        document.querySelectorAll(`img[data-uid="${uid}"]`).forEach((imgElement) => {
            const originalSrc = imgElement.getAttribute('data-original-src');
            if (originalSrc) {
                imgElement.src = originalSrc;
            }
        });
        // console.log(`[S1 Avatar Replacer] Reset avatar for UID: ${uid}`);
    }

    /**
     * 为头像元素添加替换按钮。
     */
    function addReplaceButton(avatarContainer, imgElement, uid) {
        const button = document.createElement('button');
        button.textContent = '㔢';
        button.title = '替换为 Dicebear 头像';

        // --- 按钮样式 ---
        button.style.position = 'absolute';
        button.style.top = '2px';
        button.style.right = '2px';
        button.style.zIndex = '1001';
        button.style.cursor = 'pointer';
        button.style.background = 'rgba(0, 123, 255, 0.8)';
        button.style.color = '#ffffff';
        button.style.border = '1px solid rgba(255, 255, 255, 0.5)';
        button.style.borderRadius = '50%';
        button.style.width = '18px';
        button.style.height = '18px';
        button.style.fontSize = '10px';
        button.style.lineHeight = '16px';
        button.style.textAlign = 'center';
        button.style.padding = '0';
        button.style.display = 'none';
        button.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.3)';
        button.style.transition = 'background-color 0.2s ease, opacity 0.2s ease';
        button.style.opacity = '0.8';

        // --- 按钮交互 ---
        avatarContainer.style.position = 'relative';

        avatarContainer.addEventListener('mouseover', () => {
            button.style.display = 'block';
        });

        avatarContainer.addEventListener('mouseout', () => {
            button.style.display = 'none';
        });

        button.addEventListener('mouseover', () => {
            button.style.background = 'rgba(0, 100, 210, 0.9)';
            button.style.opacity = '1';
        });
        button.addEventListener('mouseout', () => {
             button.style.background = 'rgba(0, 123, 255, 0.8)';
             button.style.opacity = '0.8';
        });

        button.onclick = function(event) {
            event.preventDefault();
            event.stopPropagation();
            replaceAvatar(uid);
        };

        avatarContainer.appendChild(button);
    }

    /**
     * 初始化页面上的所有头像。
     */
    function initializeAvatars() {
        document.querySelectorAll('div.avatar, div.icn.avt').forEach(function(avatarContainer) {
            const imgElement = avatarContainer.querySelector('img');
            const linkElement = avatarContainer.querySelector('a[href*="uid-"]');

            if (!imgElement) return;

            const uid = linkElement ? extractUidFromHref(linkElement.href) : null;

            if (uid) {
                imgElement.setAttribute('data-uid', uid);

                if (!imgElement.hasAttribute('data-original-src')) {
                    const originalSrc = imgElement.dataset.original || imgElement.src;
                    imgElement.setAttribute('data-original-src', originalSrc);
                }

                const savedSrc = GM_getValue(uid);
                if (savedSrc) {
                    imgElement.src = savedSrc;
                } else {
                    imgElement.src = imgElement.getAttribute('data-original-src');
                }

                addReplaceButton(avatarContainer, imgElement, uid);

            } else {
                 if (!imgElement.hasAttribute('data-original-src')) {
                    const originalSrc = imgElement.dataset.original || imgElement.src;
                    imgElement.setAttribute('data-original-src', originalSrc);
                    imgElement.src = originalSrc;
                 }
            }
        });
    }

    // --- Greasemonkey 菜单命令 ---

    // 清除所有保存的头像数据并恢复原始头像
    GM_registerMenuCommand("清除所有S1替换头像数据", function() {
        let clearedCount = 0;
        document.querySelectorAll('img[data-uid]').forEach(function(imgElement) {
            const uid = imgElement.getAttribute('data-uid');
            if (uid && GM_getValue(uid)) {
                resetAvatar(uid);
                clearedCount++;
            } else if (uid) {
                 const originalSrc = imgElement.getAttribute('data-original-src');
                 if (originalSrc && imgElement.src !== originalSrc) {
                    imgElement.src = originalSrc;
                 }
            }
        });

        if (clearedCount > 0) {
            alert(`已清除 ${clearedCount} 个用户的替换头像数据并恢复原始头像。`);
        } else {
            alert("没有找到已保存的替换头像数据。");
        }
    });

    // --- 初始化脚本 ---
    initializeAvatars();

    // 使用 MutationObserver 监听 DOM 变化，处理动态加载的头像
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.matches('div.avatar, div.icn.avt') || node.querySelector('div.avatar, div.icn.avt')) {
                             // 简单的重新扫描整个文档，确保处理新加载的头像
                             // 对于大型或频繁更新的页面，可以优化为只处理新添加的节点
                             initializeAvatars();
                             return;
                        }
                    }
                });
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();
