// ==UserScript==
// @name         子比插入头像和封面按钮
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  在用户资料页面插入被删除的"修改头像"和"修改封面"按钮
// @match        https://www.march7th.asia/user/data
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545022/%E5%AD%90%E6%AF%94%E6%8F%92%E5%85%A5%E5%A4%B4%E5%83%8F%E5%92%8C%E5%B0%81%E9%9D%A2%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/545022/%E5%AD%90%E6%AF%94%E6%8F%92%E5%85%A5%E5%A4%B4%E5%83%8F%E5%92%8C%E5%B0%81%E9%9D%A2%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置常量
    const CONFIG = {
        avatarButton: {
            className: 'avatar-set-link avatar-button but c-blue p2-10 em09 ml6 hollow shrink0',
            text: '修改头像',
            modal: {
                height: '410',
                url: 'https://www.march7th.asia/wp-admin/admin-ajax.php?action=user_avatar_set_modal'
            }
        },
        coverButton: {
            className: 'avatar-set-link cover-button but c-blue p2-10 em09 ml6 hollow shrink0',
            text: '修改封面',
            modal: {
                height: '330',
                url: 'https://www.march7th.asia/wp-admin/admin-ajax.php?action=user_cover_set_modal'
            }
        },
        observerConfig: {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        }
    };

    // 创建按钮元素
    function createButton(config) {
        const button = document.createElement('a');
        button.href = 'javascript:void(0);';
        button.className = config.className;
        button.textContent = config.text;
        button.setAttribute('mobile-bottom', 'true');
        button.setAttribute('data-height', config.modal.height);
        button.setAttribute('data-remote', config.modal.url);
        button.setAttribute('data-toggle', 'RefreshModal');
        return button;
    }

    // 插入头像按钮
    function insertAvatarButton() {
        const avatarContainers = document.querySelectorAll('div.flex.ac:has(b.em12)');

        avatarContainers.forEach(container => {
            // 检查是否已存在按钮
            if (!container.querySelector('.avatar-button')) {
                try {
                    const button = createButton(CONFIG.avatarButton);
                    container.appendChild(button);
                } catch (error) {
                    console.error('插入头像按钮失败:', error);
                }
            }
        });
    }

    // 插入封面按钮
    function insertCoverButton() {
        const locationItems = document.querySelectorAll('li:has(i.fa-map-marker)');

        locationItems.forEach(item => {
            // 检查是否已存在按钮
            if (!item.nextElementSibling || !item.nextElementSibling.querySelector('.cover-button')) {
                try {
                    const listItem = document.createElement('li');
                    const button = createButton(CONFIG.coverButton);

                    // 添加图标
                    const icon = document.createElement('i');
                    icon.className = 'fa fa-camera mr6';
                    icon.setAttribute('aria-hidden', 'true');

                    button.prepend(icon);
                    listItem.appendChild(button);

                    // 插入到DOM中
                    item.parentNode.insertBefore(listItem, item.nextSibling);
                } catch (error) {
                    console.error('插入封面按钮失败:', error);
                }
            }
        });
    }

    // 主插入函数
    function insertButtons() {
        insertAvatarButton();
        insertCoverButton();
    }

    // 初始化
    function init() {
        // 立即执行一次
        insertButtons();

        // 设置观察器
        const observer = new MutationObserver(function(mutations) {
            let needsUpdate = false;

            mutations.forEach(mutation => {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    needsUpdate = true;
                }
            });

            if (needsUpdate) {
                insertButtons();
            }
        });

        observer.observe(document.body, CONFIG.observerConfig);

        // 添加卸载观察器的逻辑
        window.addEventListener('unload', () => {
            observer.disconnect();
        });
    }

    // 等待DOM完全加载后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();