// ==UserScript==
// @name         知乎优化
// @namespace    https://zhihu.com/
// @version      4.10
// @description  1- 评论弹窗快捷关闭；2- 添加搜索框清空按钮；3- 点击搜索历史或联想词后在当前网页打开搜索结果
// @author       AI
// @match        https://www.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532572/%E7%9F%A5%E4%B9%8E%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/532572/%E7%9F%A5%E4%B9%8E%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /*************** 评论弹窗快捷关闭 ***************/
    function findCommentBoxContainer(closeButton) {
        let currentElement = closeButton.parentElement;
        while (currentElement && currentElement !== document.body) {
            if (
                currentElement.querySelector('span[data-focus-scope-start="true"]') &&
                currentElement.querySelector('span[data-focus-scope-end="true"]')
            ) {
                return currentElement;
            }
            currentElement = currentElement.parentElement;
        }
        return null;
    }

    function findCommentContentArea(commentBox) {
        return commentBox.querySelector('div[tabindex="0"]') || commentBox;
    }

    function setupCloseOnClickOutside() {
        if (window._zhihuCommentCloserBound) return;
        window._zhihuCommentCloserBound = true;

        const handler = (event) => {
            const closeButton = document.querySelector('button[aria-label="关闭"]');
            if (!closeButton) {
                document.removeEventListener('click', handler, true);
                window._zhihuCommentCloserBound = false;
                return;
            }

            const commentBox = findCommentBoxContainer(closeButton);
            if (!commentBox) return;

            const commentContent = findCommentContentArea(commentBox);
            const target = event.target;
            const { clientX, clientY } = event;

            const rect = commentContent.getBoundingClientRect();

            const isLeft = clientX < rect.left;
            const isRight = clientX > rect.right;
            const isWithinY = clientY >= rect.top && clientY <= rect.bottom;

            if (
                commentContent.contains(target) ||
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.closest('a, button')
            ) {
                return;
            }

            if ((isLeft || isRight) && isWithinY) {
                closeButton.click();
            }
        };

        document.addEventListener('click', handler, true);
    }

    const commentObserver = new MutationObserver(() => {
        if (document.querySelector('button[aria-label="关闭"]')) {
            setupCloseOnClickOutside();
        }
    });

    commentObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    /*************** 添加搜索框清空按钮 ***************/
    const clearButtonStyle = document.createElement('style');
    clearButtonStyle.textContent = `
        .SearchBar-input {
            position: relative;
        }
        .SearchBar-clear-icon {
            position: absolute;
            right: 48px;
            top: 50%;
            transform: translateY(-50%);
            width: 18px;
            height: 18px;
            cursor: pointer;
            display: none;
            fill: #999;
        }
        .SearchBar-input:hover .SearchBar-clear-icon.has-value,
        .SearchBar-input input:focus + .SearchBar-searchButton + .SearchBar-clear-icon.has-value {
            display: block;
        }
        .SearchBar-clear-icon:hover {
            fill: #555;
        }
    `;
    document.head.appendChild(clearButtonStyle);

    function setupClearButton() {
        const searchWrapper = document.querySelector('.SearchBar-input');
        const searchInput = searchWrapper?.querySelector('input');
        if (!searchWrapper || !searchInput) {
            return;
        }

        let clearIcon = searchWrapper.querySelector('.SearchBar-clear-icon');
        if (!clearIcon) {
            clearIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            clearIcon.setAttribute('class', 'SearchBar-clear-icon');
            clearIcon.setAttribute('width', '18');
            clearIcon.setAttribute('height', '18');
            clearIcon.setAttribute('viewBox', '0 0 24 24');
            clearIcon.setAttribute('fill', 'currentColor');
            clearIcon.innerHTML = `
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.95 14.24l-1.41 1.41L12 14.12l-3.54 3.53-1.41-1.41L10.59 12 7.05 8.46l1.41-1.41L12 10.59l3.54-3.54 1.41 1.41L13.41 12l3.54 3.54z"/>
            `;
            searchWrapper.appendChild(clearIcon);
        }

        function updateClearIconVisibility() {
            clearIcon.classList.toggle('has-value', searchInput.value.trim() !== '');
        }

        function clearInput(event) {
            event.preventDefault();
            event.stopPropagation();

            const reactPropsKey = Object.keys(searchInput).find(key => key.startsWith('__reactProps') || key.startsWith('__reactEventHandlers'));
            if (reactPropsKey && searchInput[reactPropsKey]?.onChange) {
                searchInput[reactPropsKey].onChange({ target: { value: '' } });
            } else {
                searchInput.value = '';
                const inputEvent = new InputEvent('input', { bubbles: true, data: '' });
                searchInput.dispatchEvent(inputEvent);
                searchInput.dispatchEvent(new Event('change', { bubbles: true }));
            }

            updateClearIconVisibility();
            searchInput.focus();
        }

        if (clearIcon.__clearHandler) {
            clearIcon.removeEventListener('click', clearIcon.__clearHandler);
        }
        clearIcon.addEventListener('click', clearInput);
        clearIcon.__clearHandler = clearInput;

        if (searchInput.__inputHandler) {
            searchInput.removeEventListener('input', searchInput.__inputHandler);
        }
        searchInput.addEventListener('input', updateClearIconVisibility);
        searchInput.__inputHandler = updateClearIconVisibility;

        updateClearIconVisibility();
        searchInput.__clearButtonSetup = true;
    }

    function observeSearchInputForClearButton() {
        document.querySelectorAll('.SearchBar-input input').forEach(input => {
            if (!input.__clearButtonSetup) {
                setupClearButton();
            }
        });
    }

    setupClearButton();

    const clearButtonObserver = new MutationObserver(() => {
        observeSearchInputForClearButton();
    });
    clearButtonObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    /*************** 点击搜索历史或联想词后在当前网页打开搜索结果 ***************/
    function setupSearchRedirect() {
        const historyItems = document.querySelectorAll('.SearchBar-historyItem');
        historyItems.forEach(item => {
            if (!item.__clickHandler) {
                item.addEventListener('click', (event) => {
                    if (event.target.closest('.SearchBar-historyDelete')) {
                        return;
                    }
                    event.preventDefault();
                    event.stopPropagation();

                    const searchTermElement = item.querySelector('.SearchBar-historyItemContent span');
                    if (searchTermElement) {
                        const searchTerm = searchTermElement.textContent.trim();
                        if (searchTerm) {
                            const encodedSearchTerm = encodeURIComponent(searchTerm);
                            const redirectUrl = `https://www.zhihu.com/search?q=${encodedSearchTerm}&search_source=History&utm_content=search_history&type=content`;
                            window.location.href = redirectUrl;
                        }
                    }
                });
                item.__clickHandler = true;
            }
        });

        const suggestItems = document.querySelectorAll('.SearchBar-defaultResult');
        suggestItems.forEach(item => {
            if (!item.__clickHandler) {
                item.addEventListener('click', (event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    const searchTerm = item.textContent.trim();
                    if (searchTerm) {
                        const encodedSearchTerm = encodeURIComponent(searchTerm);
                        const redirectUrl = `https://www.zhihu.com/search?q=${encodedSearchTerm}&search_source=History&utm_content=search_history&type=content`;
                        window.location.href = redirectUrl;
                    }
                });
                item.__clickHandler = true;
            }
        });

        const searchInput = document.querySelector('.SearchBar-input input');
        if (searchInput && !searchInput.__enterHandler) {
            searchInput.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    const activeItem = document.querySelector('.Menu-item.is-active');
                    if (activeItem) {
                        event.preventDefault();
                        event.stopPropagation();

                        let searchTerm = '';
                        const historyItem = activeItem.querySelector('.SearchBar-historyItemContent span');
                        const suggestItem = activeItem.querySelector('.SearchBar-defaultResult');
                        if (historyItem) {
                            searchTerm = historyItem.textContent.trim();
                        } else if (suggestItem) {
                            searchTerm = suggestItem.textContent.trim();
                        }

                        if (searchTerm) {
                            const encodedSearchTerm = encodeURIComponent(searchTerm);
                            const redirectUrl = `https://www.zhihu.com/search?q=${encodedSearchTerm}&search_source=History&utm_content=search_history&type=content`;
                            window.location.href = redirectUrl;
                        }
                    }
                }
            });
            searchInput.__enterHandler = true;
        }
    }

    setupSearchRedirect();

    const searchObserver = new MutationObserver(() => {
        setupSearchRedirect();
    });

    searchObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    if (document.querySelector('button[aria-label="关闭"]')) {
        setupCloseOnClickOutside();
    }
})();