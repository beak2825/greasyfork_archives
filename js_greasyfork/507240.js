// ==UserScript==
// @name         哔哩哔哩-B站-Bilibili搜索结果过滤
// @version      0.2
// @description  手动过滤搜索结果(兼容Bilibili旧播放页)
// @author       rteta、gpt4o、deepseek2.5、gemini1.5pro-002
// @match        https://search.bilibili.com/*
// @license MIT
// @namespace https://greasyfork.org/users/1217761
// @downloadURL https://update.greasyfork.org/scripts/507240/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9-B%E7%AB%99-Bilibili%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/507240/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9-B%E7%AB%99-Bilibili%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // Create a container for the input and controls
    const controlContainer = document.createElement('div');
    controlContainer.style.position = 'fixed';
    controlContainer.style.left = '10px';
    controlContainer.style.bottom = '10px';
    controlContainer.style.zIndex = '9999';
    controlContainer.style.backgroundColor = '#fff';
    controlContainer.style.padding = '10px';
    controlContainer.style.border = '1px solid #ccc';
    controlContainer.style.borderRadius = '5px';
    controlContainer.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
    controlContainer.style.display = 'flex';  // Use Flexbox
    controlContainer.style.flexDirection = 'column';  // Stack elements vertically
    controlContainer.style.transition = 'left 0.3s ease-in-out';  // Add transition effect
    document.body.appendChild(controlContainer);

    // Create keyword input
    const inputBox = document.createElement('textarea');
    inputBox.placeholder = '多个关键词请用英文逗号隔开';
    inputBox.style.width = '180px';
    inputBox.style.height = '100px';
    inputBox.style.marginBottom = '5px';  // Add some spacing
    controlContainer.appendChild(inputBox);

    // Create a select element for filtering mode
    const filterModeSelect = document.createElement('select');
    filterModeSelect.style.width = '100%'; // Occupy full container width
    filterModeSelect.style.marginBottom = '5px'; // Add spacing

    const showAllOption = document.createElement('option');
    showAllOption.value = 'all';
    showAllOption.text = '显示所有内容';
    filterModeSelect.appendChild(showAllOption);

    const showMatchingOption = document.createElement('option');
    showMatchingOption.value = 'matching';
    showMatchingOption.text = '只显示含有关键词的内容';
    filterModeSelect.appendChild(showMatchingOption);

    const hideMatchingOption = document.createElement('option');
    hideMatchingOption.value = 'hide';
    hideMatchingOption.text = '不显示含有关键词的内容';
    filterModeSelect.appendChild(hideMatchingOption);

    controlContainer.appendChild(filterModeSelect);

    // Function to hide the container
    function hideContainer() {
        controlContainer.style.left = '-190px';  // Hide the container to the left side
    }

    // Function to show the container
    function showContainer() {
        controlContainer.style.left = '10px';  // Show the container from the left side
    }

    // Event listener to detect clicks outside the container
    document.addEventListener('click', function(event) {
        if (!controlContainer.contains(event.target)) {
            hideContainer();
        } else {
            showContainer();
        }
    });

    // Initially show the container
    showContainer();


    let keywords = [];

    function filterListItems() {
        const filterMode = filterModeSelect.value;
        const selectors = ['ul.video-list.clearfix > li', 'div.video-list.row > div'];

        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(item => {
                const itemText = item.textContent.trim();
                const matches = keywords.some(keyword => itemText.includes(keyword));

                if (filterMode === 'all') {
                    item.style.display = '';
                } else if (filterMode === 'matching') {
                    item.style.display = matches ? '' : 'none';
                } else if (filterMode === 'hide') {
                    item.style.display = matches ? 'none' : '';
                }
            });
        });
    }

    inputBox.addEventListener('input', () => {
        keywords = inputBox.value.trim() ? inputBox.value.split(',').map(keyword => keyword.trim()) : [];
        filterListItems();
    });

    filterModeSelect.addEventListener('change', filterListItems); // Filter on selection change

    // Observe changes in the DOM
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length || mutation.removedNodes.length) {
                filterListItems();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();