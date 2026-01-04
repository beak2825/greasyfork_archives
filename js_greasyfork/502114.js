// ==UserScript==
// @name         在微信读书中搜索选中文字
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  选中文字时显示微信读书搜索按钮，并跳转微信读书搜素页面自动搜索
// @match        *://*/*
// @grant        GM_setClipboard
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502114/%E5%9C%A8%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E4%B8%AD%E6%90%9C%E7%B4%A2%E9%80%89%E4%B8%AD%E6%96%87%E5%AD%97.user.js
// @updateURL https://update.greasyfork.org/scripts/502114/%E5%9C%A8%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E4%B8%AD%E6%90%9C%E7%B4%A2%E9%80%89%E4%B8%AD%E6%96%87%E5%AD%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let button = document.createElement('button');
    button.textContent = '微';
    button.style.position = 'absolute';
    button.style.display = 'none';
    button.style.zIndex = 1000;
    button.style.padding = '2px 5px';
    button.style.border = 'none';
    button.style.borderRadius = '3px';
    button.style.backgroundColor = 'rgba(128, 128, 128, 0.5)';
    button.style.color = 'white';
    button.style.fontSize = '12px';
    document.body.appendChild(button);

    document.addEventListener('mouseup', function(event) {
        let selectedText = window.getSelection().toString().trim();
        if (selectedText.length > 0) {
            button.style.top = (event.pageY - 30) + 'px';
            button.style.left = (event.pageX + 10) + 'px';
            button.style.display = 'block';
        } else {
            button.style.display = 'none';
        }
    });

    button.addEventListener('click', function() {
        let selectedText = window.getSelection().toString().trim();
        if (selectedText.length > 0) {
            GM_setClipboard(selectedText);
            GM_setValue('searchText', selectedText);
            GM_openInTab('https://weread.qq.com/#search', { active: true });
        }
        button.style.display = 'none';
    });

    document.addEventListener('mousedown', function(event) {
        if (event.target !== button) {
            button.style.display = 'none';
        }
    });

    if (window.location.href.startsWith('https://weread.qq.com/#search')) {
        const searchText = GM_getValue('searchText', '');
        if (searchText) {
            const observer = new MutationObserver(() => {
                const searchInput = document.querySelector('.search_input_text');
                if (searchInput) {
                    searchInput.value = searchText;
                    const inputEvent = new Event('input', { bubbles: true });
                    searchInput.dispatchEvent(inputEvent);

                    setTimeout(() => {
                        const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true });
                        searchInput.dispatchEvent(enterEvent);

                        const keyupEvent = new KeyboardEvent('keyup', { key: 'Enter', keyCode: 13, bubbles: true });
                        searchInput.dispatchEvent(keyupEvent);
                    }, 500);

                    observer.disconnect();
                }
            });

            observer.observe(document, { childList: true, subtree: true });
        }
    }
})();
