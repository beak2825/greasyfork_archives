// ==UserScript==
// @name         X-Mol高级搜索界面按钮调整
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  原网页设计中，搜索按钮的位置处于页面最下端。在实际使用过程中，这一布局使得用户每次想要进行搜索操作时，都需要将视线和操作焦点转移至页面底部，操作流程较为繁琐，使用体验不佳。
// @author       Maifei
// @match        https://www.x-mol.com/paper/search
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x-mol.com
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527286/X-Mol%E9%AB%98%E7%BA%A7%E6%90%9C%E7%B4%A2%E7%95%8C%E9%9D%A2%E6%8C%89%E9%92%AE%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/527286/X-Mol%E9%AB%98%E7%BA%A7%E6%90%9C%E7%B4%A2%E7%95%8C%E9%9D%A2%E6%8C%89%E9%92%AE%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建样式调整函数
    function adjustButtonPosition() {
        // 找到目标按钮的父容器
        const btnContainer = document.querySelector('.magazine-senior-search-item-btn-first');

        if (btnContainer) {
            // 移除原有容器
            btnContainer.remove();

            // 创建新的定位容器
            const newContainer = document.createElement('div');
            newContainer.style.cssText = `
                position: fixed;
                top: 240px;
                left: 20%;
                transform: translateX(-50%);
                z-index: 9999;
            `;

            // 将按钮插入新容器
            newContainer.appendChild(btnContainer);

            // 将新容器添加到页面顶部
            document.body.prepend(newContainer);

            // 调整按钮样式
            const searchBtn = btnContainer.querySelector('.btn-blue-new');
            if (searchBtn) {
                searchBtn.style.cssText = `
                    width: 200px;
                    height: 50px;
                    line-height: 50px;
                    margin: 0;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                `;
            }

            // 新增回车键监听（根据实际页面选择输入框选择器）
            const searchInput = document.querySelector('input[type="text"]'); // 可能需要调整选择器
            if (searchInput) {
                searchInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.keyCode === 13) {
                        xmol.search(); // 调用页面原有搜索方法
                    }
                });
            }
        }
    }

    // 使用MutationObserver确保在DOM加载后执行
    const observer = new MutationObserver(function(mutations, me) {
        if (document.querySelector('.magazine-senior-search-item-btn-first')) {
            adjustButtonPosition();
            me.disconnect(); // 找到元素后停止观察
        }
    });

    // 开始观察整个文档
    observer.observe(document, {
        childList: true,
        subtree: true
    });
})();