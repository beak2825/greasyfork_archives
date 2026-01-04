// ==UserScript==
// @name         ScrollBuddy
// @namespace    https://greasyfork.org/en/users/1451802
// @version      1.0
// @license      MIT
// @description  Minimalist button for scrolling
// @description:de  Minimalistische Schaltfläche zum Scrollen
// @description:es  Botón minimalista para desplazarse
// @description:fr  Bouton minimaliste pour scroller
// @description:it  Pulsante minimalista per lo scorrimento
// @description:ru  Минималистичная кнопка для прокрутки
// @description:zh-CN  简约的滚动按钮
// @description:zh-TW  簡約的捲動按鈕
// @description:ja  ミニマリストスクロールボタン
// @description:ko  미니멀리스트 스크롤 버튼
// @author       NormalRandomPeople (https://github.com/NormalRandomPeople)
// @icon         https://www.svgrepo.com/show/533633/arrows-up-down.svg
// @match        *://*/*
// @grant        GM_addStyle
// @run-at       document-end
// @compatible      chrome
// @compatible      firefox
// @compatible      opera
// @compatible      brave
// @downloadURL https://update.greasyfork.org/scripts/531288/ScrollBuddy.user.js
// @updateURL https://update.greasyfork.org/scripts/531288/ScrollBuddy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window !== window.top) {
        return;
    }

    if (document.querySelector('.scroll-toggle-button')) {
        return;
    }

    let smoothScrolling = localStorage.getItem('smoothScrolling') !== null ? JSON.parse(localStorage.getItem('smoothScrolling')) : true;
    let fixToBottom = localStorage.getItem('fixToBottom') !== null ? JSON.parse(localStorage.getItem('fixToBottom')) : false;
    let fixToTop = localStorage.getItem('fixToTop') !== null ? JSON.parse(localStorage.getItem('fixToTop')) : false;

    const button = document.createElement('button');
    button.className = 'scroll-toggle-button';
    button.textContent = '↓';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.zIndex = '9999999999';
    button.style.padding = '12px';
    button.style.borderRadius = '50%';
    button.style.backgroundColor = '#333';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.fontSize = '30px';
    button.style.cursor = 'pointer';
    button.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
    button.style.outline = 'none';

    function updateButton() {
        if (fixToTop) {
            button.textContent = '↑';
            button.onclick = () => scrollToTop();
        } else if (fixToBottom) {
            button.textContent = '↓';
            button.onclick = () => scrollToBottom();
        } else {
            const isAtBottom = (window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight;
            const isAtTop = window.scrollY === 0;

            if (isAtTop) {
                button.textContent = '↓';
                button.onclick = () => scrollToBottom();
            } else if (isAtBottom) {
                button.textContent = '↑';
                button.onclick = () => scrollToTop();
            }
        }
    }

    function scrollToBottom() {
        window.scrollTo({ top: document.documentElement.scrollHeight - window.innerHeight, behavior: smoothScrolling ? 'smooth' : 'auto' });
    }

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: smoothScrolling ? 'smooth' : 'auto' });
    }

    updateButton();
    window.addEventListener('scroll', updateButton);
    document.body.appendChild(button);

    GM_addStyle(`
        .scroll-toggle-button:hover {
            background-color: #555;
            transform: scale(1.1);
        }

        .scroll-toggle-button:active {
            transform: scale(0.95);
        }

        .custom-context-menu div {
            padding: 8px 15px;
            cursor: pointer;
            transition: background-color 0.2s ease;
            text-align: left;
        }

        .custom-context-menu div:hover {
            background-color: #444;
        }

        .custom-context-menu div:active {
            background-color: #555;
        }

        .custom-context-menu div.selected {
            background-color: #333;
        }
    `);

    function createContextMenu(event) {
        event.preventDefault();

        const existingMenu = document.querySelector('.custom-context-menu');
        if (existingMenu) {
            existingMenu.remove();
        }

        const menu = document.createElement('div');
        menu.className = 'custom-context-menu';
        menu.style.position = 'absolute';
        menu.style.backgroundColor = '#333';
        menu.style.color = 'white';
        menu.style.borderRadius = '5px';
        menu.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
        menu.style.padding = '10px';
        menu.style.fontFamily = 'Arial, sans-serif';
        menu.style.fontSize = '14px';
        menu.style.zIndex = '99999999999';
        const buttonRect = button.getBoundingClientRect();
        let menuLeft = buttonRect.left + window.scrollX - 220;
        let menuTop = buttonRect.top + window.scrollY - 130;
        const screenWidth = window.innerWidth;
        const menuWidth = 150;
        const marginRight = 30;
        if (menuLeft + menuWidth > screenWidth - marginRight) {
            menuLeft = screenWidth - menuWidth - marginRight;
        }

        const screenHeight = window.innerHeight;
        if (menuTop < 0) {
            menuTop = buttonRect.bottom + window.scrollY + 20;
        }

        menu.style.left = `${menuLeft}px`;
        menu.style.top = `${menuTop}px`;

        const smoothScrollingOption = document.createElement('div');
        smoothScrollingOption.textContent = smoothScrolling ? '✓ Enable Smooth Scrolling' : 'Enable Smooth Scrolling';
        smoothScrollingOption.onclick = () => {
            smoothScrolling = !smoothScrolling;
            localStorage.setItem('smoothScrolling', smoothScrolling);
            updateButton();
            menu.remove();
        };

        const fixToBottomOption = document.createElement('div');
        fixToBottomOption.textContent = fixToBottom ? '✓ Fix to Bottom' : 'Fix to Bottom';
        fixToBottomOption.onclick = () => {
            fixToBottom = !fixToBottom;
            if (fixToBottom) {
                fixToTop = false;
            }
            localStorage.setItem('fixToBottom', fixToBottom);
            localStorage.setItem('fixToTop', fixToTop);
            updateButton();
            menu.remove();
        };

        const fixToTopOption = document.createElement('div');
        fixToTopOption.textContent = fixToTop ? '✓ Fix to Top' : 'Fix to Top';
        fixToTopOption.onclick = () => {
            fixToTop = !fixToTop;
            if (fixToTop) {
                fixToBottom = false;
            }
            localStorage.setItem('fixToTop', fixToTop);
            localStorage.setItem('fixToBottom', fixToBottom);
            updateButton();
            menu.remove();
        };

        menu.appendChild(smoothScrollingOption);
        menu.appendChild(fixToBottomOption);
        menu.appendChild(fixToTopOption);
        document.body.appendChild(menu);
        document.addEventListener('click', () => menu.remove(), { once: true });
    }

    button.addEventListener('contextmenu', createContextMenu);
})();