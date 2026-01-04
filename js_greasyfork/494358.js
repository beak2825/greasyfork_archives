// ==UserScript==
// @name         去你的热搜 - 移除H5版微博的热搜显示，更改为搜索历史
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  移除H5版微博的热搜显示，更改为搜索历史
// @author       SomiaWhiteRing
// @match        https://m.weibo.cn/*
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/494358/%E5%8E%BB%E4%BD%A0%E7%9A%84%E7%83%AD%E6%90%9C%20-%20%E7%A7%BB%E9%99%A4H5%E7%89%88%E5%BE%AE%E5%8D%9A%E7%9A%84%E7%83%AD%E6%90%9C%E6%98%BE%E7%A4%BA%EF%BC%8C%E6%9B%B4%E6%94%B9%E4%B8%BA%E6%90%9C%E7%B4%A2%E5%8E%86%E5%8F%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/494358/%E5%8E%BB%E4%BD%A0%E7%9A%84%E7%83%AD%E6%90%9C%20-%20%E7%A7%BB%E9%99%A4H5%E7%89%88%E5%BE%AE%E5%8D%9A%E7%9A%84%E7%83%AD%E6%90%9C%E6%98%BE%E7%A4%BA%EF%BC%8C%E6%9B%B4%E6%94%B9%E4%B8%BA%E6%90%9C%E7%B4%A2%E5%8E%86%E5%8F%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式到页面的 <head>
    function addStyles() {
        if (!document.getElementById('custom-hisCard-styles')) {
            const style = document.createElement('style');
            style.id = 'custom-hisCard-styles';
            style.textContent = `
                .his-card-list {
                    margin-top: 2px;
                }
                .his-card {
                    padding: 12px;
                    background-color: #FFF;
                    border-bottom: 1px solid #e0e0e0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: pointer;
                }
                .his-card:hover {
                    background-color: #f8f8f8;
                }
                .his-card::first-child {
                    margin-top: 2px;
                }
                .delete-btn {
                    cursor: pointer;
                    margin-left: 10px;
                }
                .delete-btn svg {
                    fill: #BBBBBB;
                }
            `;
            document.head.appendChild(style);
        }
    }

    // 在脚本初始化时调用添加样式的函数
    addStyles();

    // 根据特定父类名更改特定子类名元素的文本内容
    function changeTextByParentAndChild(parentClass, childClass, newText) {
        let parents = document.getElementsByClassName(parentClass);
        for (let parent of parents) {
            let childElements = parent.getElementsByClassName(childClass);
            for (let childElement of childElements) {
                childElement.textContent = newText;
            }
        }
    }

    // 根据特定父类名更改输入元素的占位符
    function changePlaceholderByParent(parentClass, newPlaceholder) {
        let parents = document.getElementsByClassName(parentClass);
        for (let parent of parents) {
            let inputElements = parent.getElementsByTagName('input');
            for (let inputElement of inputElements) {
                if (inputElement.getAttribute('type') === 'search') {
                    inputElement.setAttribute('placeholder', newPlaceholder);
                }
            }
        }
    }

    // 移除具有特定类名的元素
    function removeElementsByClass(className) {
        let elements = document.getElementsByClassName(className);
        while (elements.length > 0) {
            elements[0].parentNode.removeChild(elements[0]);
        }
    }

    // 监听输入框的回车事件
    function handleInputEnter(event) {
        if (event.key === 'Enter') {
            const inputText = event.target.value.trim();
            if (inputText) {
                addToSearchHistory(inputText);
            }
        }
    }

    // 将输入的内容存储到 localStorage 的 searchHistory 中
    function addToSearchHistory(newItem) {
        let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
        const newItemIndex = searchHistory.findIndex(item => item.toLowerCase() === newItem.toLowerCase());
        if (newItemIndex !== -1) {
            searchHistory.splice(newItemIndex, 1);
        }
        searchHistory.unshift(newItem);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }

    // 在输入框上添加事件监听器
    function addInputEventListener() {
        let inputElements = document.querySelectorAll('.nt-search input[type="search"]');
        inputElements.forEach(function(inputElement) {
            // 只有当输入框还没有事件监听器时，才添加新的事件监听器
            if (!inputElement.dataset.hasEventListener) {
                inputElement.addEventListener('keypress', handleInputEnter);
                inputElement.addEventListener('input', function(event) {
                    renderSearchHistoryToCardList(event.target.value);  // 根据输入过滤
                });
                inputElement.dataset.hasEventListener = 'true';  // 添加一个标记来表示已经添加了事件监听器
            }
        });
    }

    // 渲染 searchHistory 到 card-list
    function renderSearchHistoryToCardList(filterText = '') {
        console.log("test")
        const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
        const cardList = document.querySelector('.card-list');

        if (cardList) {
            // 添加专属样式
            cardList.classList.add('his-card-list');
            // 创建一个文档片段，用于减少直接对DOM的操作次数
            const fragment = document.createDocumentFragment();

            searchHistory.forEach(function(searchItem, index) {
              if (searchItem.toLowerCase().includes(filterText.toLowerCase())) {
                const cardElement = document.createElement('div');
                cardElement.classList.add('his-card');
                cardElement.textContent = searchItem;

                // 添加删除按钮
                const deleteBtn = document.createElement('span');
                deleteBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/></svg>`;
                deleteBtn.classList.add('delete-btn');
                deleteBtn.onclick = function(event) {
                    event.stopPropagation(); // 阻止事件冒泡
                    searchHistory.splice(index, 1);
                    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
                    renderSearchHistoryToCardList();
                };
                cardElement.appendChild(deleteBtn);

                // 点击卡片填充到搜索框
                cardElement.onclick = function() {
                    const input = document.querySelector('.nt-search input[type="search"]');
                    if (input) {
                        input.value = searchItem;
                        input.focus();
                    }
                };

                fragment.appendChild(cardElement);
              }
            });

            // 一次性更新 DOM，将所有新卡片添加到 card-list
            cardList.innerHTML = ''; // 清空现有内容
            cardList.appendChild(fragment);
        }
    }


    // 创建一个MutationObserver来监视DOM中的变化
    let observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // 检查添加的节点中是否包含具有指定父类和子类名的元素
            let addedNodes = mutation.addedNodes;
            for (let node of addedNodes) {
                if (node.getElementsByClassName) {
                    let parents = node.getElementsByClassName('nav-search');
                    for (let parent of parents) {
                        changeTextByParentAndChild('nav-search', 'm-text-cut', '微博搜索');
                    }

                    changePlaceholderByParent('nt-search', '微博搜索');

                    if (document.querySelector('.nt-search') && document.getElementsByClassName('card16').length === 2 && document.getElementsByClassName('card28').length === 0 && document.getElementsByClassName('card42').length === 0) {
                        removeElementsByClass('card16');
                        // observer.disconnect();  // 断开观察，防止循环调用
                        renderSearchHistoryToCardList(); // 渲染 searchHistory 到 card-list
                        // observer.observe(document.body, {
                        //     childList: true,
                        //     subtree: true
                        // }); // 重新开始观察
                    }
                }
            }
            addInputEventListener(); // 每次DOM变化都重新添加事件监听器
        });
    });

    // 开始观察文档的变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
