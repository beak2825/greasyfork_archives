// ==UserScript==
// @name         Hiding Minesweeper
// @namespace    https://minesweeper.cn/
// @version      1.2
// @description  优雅扫雷
// @author       977
// @match        https://minesweeper.cn/
// @icon         https://minesweeper.cn/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523362/Hiding%20Minesweeper.user.js
// @updateURL https://update.greasyfork.org/scripts/523362/Hiding%20Minesweeper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 默认值
    const defaultOpacity = 0.3;
    const defaultBgImage = '';
    const defaultTitle = 'Tampermonkey - Minesweeper';

    // 获取存储的值，如果不存在则使用默认值
    let tableOpacity = GM_getValue('tableOpacity', defaultOpacity);
    let backgroundImage = GM_getValue('backgroundImage', defaultBgImage);
    let pageTitle = GM_getValue('pageTitle', defaultTitle);

    function hideElements() {
        const centerEl = document.querySelector('center');
        if (!centerEl) return;

        const allElements = centerEl.querySelectorAll('*');
        allElements.forEach(el => {
            // 只保留与 table 直接相关的并且保留嵌套在这些元素中的东西
            if (
                el.tagName.toLowerCase() !== 'table' &&
                el.tagName.toLowerCase() !== 'thead' &&
                el.tagName.toLowerCase() !== 'tbody' &&
                el.tagName.toLowerCase() !== 'tfoot' &&
                el.tagName.toLowerCase() !== 'tr' &&
                el.tagName.toLowerCase() !== 'td' &&
                el.tagName.toLowerCase() !== 'th' &&
                el.tagName.toLowerCase() !== 'caption' &&
                !el.closest('table')
            ) {
                el.hidden = true;
            }
            if (el.tagName.toLowerCase() === 'table') {
                el.style.opacity = tableOpacity;
            }
        });
    }

    function addBackgroundImage() {
        const bodyEl = document.querySelector('body');
        bodyEl.style.backgroundImage = `url("${backgroundImage}")`;
        bodyEl.style.backgroundSize = 'cover';
        bodyEl.style.backgroundRepeat = 'no-repeat';
        bodyEl.style.backgroundPosition = 'center';
    }

    function changePageTitle() {
        document.title = pageTitle;
    }

    function editPage() {
        hideElements();
        addBackgroundImage();
        changePageTitle();
    }

    editPage();

    const observer = new MutationObserver(() => {
        editPage();
    });

    const centerEl = document.querySelector('center');
    if (centerEl) {
        observer.observe(centerEl, {
            childList: true,
            subtree: true
        });
    }

    GM_registerMenuCommand('设置游戏区域透明度', () => {
        const newOpacity = prompt('请输入表格透明度 (0 到 1):', tableOpacity);
        if (newOpacity !== null && !isNaN(newOpacity)) {
            tableOpacity = parseFloat(newOpacity);
            GM_setValue('tableOpacity', tableOpacity);
            alert(`游戏区域透明度已设置为 ${tableOpacity}`);
            location.reload();
        }
    });

    GM_registerMenuCommand('设置背景图片地址', () => {
        const newBgImage = prompt('请输入背景图片的地址:', backgroundImage);
        if (newBgImage !== null) {
            backgroundImage = newBgImage;
            GM_setValue('backgroundImage', backgroundImage);
            alert(`背景图片地址已设置为 ${backgroundImage}`);
            location.reload();
        }
    });

    GM_registerMenuCommand('设置网页标题', () => {
        const newTitle = prompt('请输入网页标题:', pageTitle);
        if (newTitle !== null) {
            pageTitle = newTitle;
            GM_setValue('pageTitle', pageTitle);
            alert(`网页标题已被设置为 ${pageTitle}`);
            location.reload();
        }
    })
})();
