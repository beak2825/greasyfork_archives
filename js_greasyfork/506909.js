// ==UserScript==
// @name         抖音小红书快捷主页搜索
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Add a compact Douyin search button that expands on hover
// @author       八千xmx
// @match        *://*/*
// @grant        GM_openInTab
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/506909/%E6%8A%96%E9%9F%B3%E5%B0%8F%E7%BA%A2%E4%B9%A6%E5%BF%AB%E6%8D%B7%E4%B8%BB%E9%A1%B5%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/506909/%E6%8A%96%E9%9F%B3%E5%B0%8F%E7%BA%A2%E4%B9%A6%E5%BF%AB%E6%8D%B7%E4%B8%BB%E9%A1%B5%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the container for the input boxes and buttons
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.bottom = '15px';
    container.style.right = '15px';
    container.style.backgroundColor = '#f0f0f0';
    container.style.border = '1px solid #ccc';
    container.style.borderRadius = '8px';
    container.style.boxShadow = '0 3px 5px rgba(0, 0, 0, 0.1)';
    container.style.width = '20px';
    container.style.height = '20px';
    container.style.padding = '0';
    container.style.zIndex = '9999';
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.fontSize = '13px';
    container.style.transition = 'width 0.3s ease, height 0.3s ease, padding 0.3s ease';
    container.style.overflow = 'hidden';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';

    // Function to create input and button pair
    function createSearchBox(placeholder, buttonLabel, searchUrl) {
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center';
        wrapper.style.marginBottom = '5px';

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = placeholder;
        input.style.flex = '1';
        input.style.padding = '6px';
        input.style.border = '1px solid #ccc';
        input.style.borderRadius = '4px';
        input.style.fontSize = '13px';
        input.style.boxShadow = 'inset 0 1px 2px rgba(0, 0, 0, 0.1)';
        input.style.opacity = '0';
        input.style.transition = 'opacity 0.3s ease';
        input.style.marginRight = '5px';

        const button = document.createElement('button');
        button.textContent = buttonLabel;
        button.style.padding = '0 6px';
        button.style.backgroundColor = '#007bff';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '13px';
        button.style.transition = 'background-color 0.3s ease';

        // Add event listener for pressing Enter key
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                searchAction(input, searchUrl);
            }
        });

        // Add event listener for button click
        button.addEventListener('click', () => {
            searchAction(input, searchUrl);
        });

        wrapper.appendChild(input);
        wrapper.appendChild(button);

        return { wrapper, input };
    }

    // Search action function
    function searchAction(input, urlTemplate) {
        const query = encodeURIComponent(input.value);
        if (query) {
            const url = urlTemplate.replace('搜索内容', query);
            GM_openInTab(url, { active: true });
        }
    }

    // Create Douyin search box
    const douyinSearch = createSearchBox('输入抖音用户名', '抖音', 'https://www.douyin.com/search/搜索内容?type=user');

    // Create Xiaohongshu search box
    const xiaohongshuSearch = createSearchBox('输入小红书关键词', '小红书', 'https://www.xiaohongshu.com/search_result?keyword=搜索内容');

    // Track if the input boxes are focused
    let isInputFocused = false;

    // Add hover effects to the container
    container.addEventListener('mouseenter', () => {
        container.style.width = '200px';
        container.style.height = 'auto';
        container.style.padding = '10px';
        douyinSearch.input.style.opacity = '1';
        xiaohongshuSearch.input.style.opacity = '1';
    });

    container.addEventListener('mouseleave', () => {
        if (!isInputFocused) {
            container.style.width = '20px';
            container.style.height = '20px';
            container.style.padding = '0';
            douyinSearch.input.style.opacity = '0';
            xiaohongshuSearch.input.style.opacity = '0';
        }
    });

    // Handle focus and blur for both inputs
    function handleFocusBlur(input) {
        input.addEventListener('focus', () => {
            isInputFocused = true;
            container.style.width = '200px';
            container.style.height = 'auto';
            container.style.padding = '10px';
            input.style.opacity = '1';
        });

        input.addEventListener('blur', () => {
            isInputFocused = false;
            container.style.width = '20px';
            container.style.height = '20px';
            container.style.padding = '0';
            input.style.opacity = '0';
        });
    }

    handleFocusBlur(douyinSearch.input);
    handleFocusBlur(xiaohongshuSearch.input);

    // Append the search boxes to the container
    container.appendChild(douyinSearch.wrapper);
    container.appendChild(xiaohongshuSearch.wrapper);

    // Append the container to the body
    document.body.appendChild(container);
})();