// ==UserScript==
// @name         图片样式屏蔽器
// @version      1.5
// @description  隐藏所有图片元素，可以用来看网页小说和视频，脚本菜单启用/禁用脚本，也可以通过A键加B键触发
// @author       ChatGPT
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/487681/%E5%9B%BE%E7%89%87%E6%A0%B7%E5%BC%8F%E5%B1%8F%E8%94%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/487681/%E5%9B%BE%E7%89%87%E6%A0%B7%E5%BC%8F%E5%B1%8F%E8%94%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const currentHostname = window.location.hostname;
    const styleId = 'image-style-blocker';
    let isStyleBlocked = GM_getValue(`use_image_style_blocker_${currentHostname}`, false);

    // 检查并应用图片样式屏蔽器
    checkAndApplyImageStyleBlocker();

    let aKeyPressed = false;
    let bKeyPressed = false;

    // 监听快捷键事件
    document.addEventListener('keydown', function(e) {
        if (e.key === 'a') {
            aKeyPressed = true;
        }
        if (e.key === 'b') {
            bKeyPressed = true;
        }
        if (aKeyPressed && bKeyPressed) {
            e.preventDefault(); // 阻止默认行为
            toggleImageStyleBlocker();
            aKeyPressed = false; // 重置状态
            bKeyPressed = false; // 重置状态
        }
    });

    document.addEventListener('keyup', function(e) {
        if (e.key === 'a') {
            aKeyPressed = false;
        }
        if (e.key === 'b') {
            bKeyPressed = false;
        }
    });

    // 动态创建或更新菜单项
    function updateMenu() {
        GM_unregisterMenuCommand("启用图片样式屏蔽器");
        GM_unregisterMenuCommand("禁用图片样式屏蔽器");

        if (isStyleBlocked) {
            GM_registerMenuCommand("禁用图片样式屏蔽器", () => {
                GM_setValue(`use_image_style_blocker_${currentHostname}`, false);
                isStyleBlocked = false;
                removeImageStyleBlocker();
                updateMenu(); // 更新菜单项
            });
        } else {
            GM_registerMenuCommand("启用图片样式屏蔽器", () => {
                GM_setValue(`use_image_style_blocker_${currentHostname}`, true);
                isStyleBlocked = true;
                applyImageStyleBlocker();
                updateMenu(); // 更新菜单项
            });
        }
    }

    function checkAndApplyImageStyleBlocker() {
        isStyleBlocked = GM_getValue(`use_image_style_blocker_${currentHostname}`, false);
        updateMenu(); // 更新菜单项
        if (isStyleBlocked) {
            applyImageStyleBlocker();
        } else {
            removeImageStyleBlocker();
        }
    }

    function applyImageStyleBlocker() {
        let style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `img,[style*='height:'][style*='width:'] {display: none !important;visibility: hidden; opacity: 0; z-index: -999; width: 0; height: 0; pointer-events: none; position: absolute; left: -9999px; top: -9999px;}`;
        document.head.appendChild(style);
    }

    function removeImageStyleBlocker() {
        let style = document.getElementById(styleId);
        if (style) {
            style.remove();
        }
    }

    function toggleImageStyleBlocker() {
        isStyleBlocked = !isStyleBlocked;
        GM_setValue(`use_image_style_blocker_${currentHostname}`, isStyleBlocked);
        if (isStyleBlocked) {
            applyImageStyleBlocker();
        } else {
            removeImageStyleBlocker();
        }
        updateMenu(); // 更新菜单项
    }
})();
