// ==UserScript==
// @name         大学生活质量指北网站搜索增强 (最终修复版)
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  为大学生活质量指北网站添强搜索功能，调整UI位置并优化提示，支持多结果选择和流畅跳转反馈，核心搜索逻辑优化，移除SweetAlert2依赖，采用原生DOM实现提示。
// @author       Endotch
// @match        https://colleges.chat/*
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/540757/%E5%A4%A7%E5%AD%A6%E7%94%9F%E6%B4%BB%E8%B4%A8%E9%87%8F%E6%8C%87%E5%8C%97%E7%BD%91%E7%AB%99%E6%90%9C%E7%B4%A2%E5%A2%9E%E5%BC%BA%20%28%E6%9C%80%E7%BB%88%E4%BF%AE%E5%A4%8D%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540757/%E5%A4%A7%E5%AD%A6%E7%94%9F%E6%B4%BB%E8%B4%A8%E9%87%8F%E6%8C%87%E5%8C%97%E7%BD%91%E7%AB%99%E6%90%9C%E7%B4%A2%E5%A2%9E%E5%BC%BA%20%28%E6%9C%80%E7%BB%88%E4%BF%AE%E5%A4%8D%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('油猴脚本: 脚本开始执行...');

    // In-memory storage for all university data
    let allUniversitiesData = []; // [{ name: "清华大学", category: "问卷数据", element: DOMElement, href: "..." }, ...]

    // --- Helper function to create DOM elements ---
    function createElement(tag, attrs = {}, children) {
        const element = document.createElement(tag);
        for (const key in attrs) {
            element.setAttribute(key, attrs[key]);
        }

        const childrenArray = Array.isArray(children) ? children : (children !== undefined && children !== null ? [children] : []);

        childrenArray.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else if (child instanceof Node) {
                element.appendChild(child);
            } else {
                console.warn('油猴脚本: createElement 发现非字符串或非DOM节点的子元素:', child);
            }
        });
        return element;
    }

    // --- Custom Loading Spinner/Toast Message ---
    let loadingToast = null;

    function showLoadingToast(message) {
        if (loadingToast) {
            hideLoadingToast(); // Hide existing one if any
        }
        loadingToast = createElement('div', {
            id: 'gm-loading-toast',
            style: `
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                padding: 10px 20px;
                background-color: rgba(0, 0, 0, 0.7);
                color: white;
                border-radius: 5px;
                font-size: 14px;
                z-index: 10000;
                display: flex;
                align-items: center;
                gap: 10px;
                opacity: 0;
                transition: opacity 0.3s ease-in-out;
            `
        }, [
            createElement('div', {
                style: `
                    border: 3px solid #f3f3f3;
                    border-top: 3px solid #3498db;
                    border-radius: 50%;
                    width: 16px;
                    height: 16px;
                    animation: spin 1s linear infinite;
                `
            }),
            document.createTextNode(message)
        ]);

        // Add CSS for spinner animation if not already present
        if (!document.getElementById('gm-spin-style')) {
            const style = createElement('style', { id: 'gm-spin-style' }, `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `);
            document.head.appendChild(style);
        }

        document.body.appendChild(loadingToast);
        // Fade in
        setTimeout(() => loadingToast.style.opacity = '1', 10);
    }

    function hideLoadingToast() {
        if (loadingToast) {
            loadingToast.style.opacity = '0';
            loadingToast.addEventListener('transitionend', () => {
                if (loadingToast && loadingToast.parentNode) {
                    loadingToast.parentNode.removeChild(loadingToast);
                }
                loadingToast = null;
            }, { once: true });
        }
    }

    // --- Custom Modal for Search Results ---
    let searchResultsModal = null;

    function showCustomModal(title, contentElement) { // contentElement is now a DOM node
        if (searchResultsModal) {
            searchResultsModal.parentNode.removeChild(searchResultsModal); // Remove previous modal if open
        }

        const modalOverlay = createElement('div', {
            id: 'gm-modal-overlay',
            style: `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10001;
            `
        });

        const modalContent = createElement('div', {
            id: 'gm-modal-content',
            style: `
                background-color: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                width: 90%;
                max-width: 500px;
                max-height: 80%;
                display: flex;
                flex-direction: column;
                position: relative;
                font-family: 'Inter', sans-serif;
            `
        });

        const modalHeader = createElement('div', {
            style: `
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #eee;
                padding-bottom: 10px;
                margin-bottom: 10px;
            `
        }, [
            createElement('h3', { style: 'margin: 0; font-size: 18px;' }, title),
            createElement('button', {
                style: `
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #555;
                    padding: 0 5px;
                `
            }, '×') // Close button
        ]);

        const modalBody = createElement('div', {
            style: `flex-grow: 1; overflow-y: auto;`
        });
        modalBody.appendChild(contentElement); // Append the DOM node directly

        modalHeader.querySelector('button').addEventListener('click', () => {
            hideCustomModal();
        });

        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalBody);
        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);
        searchResultsModal = modalOverlay; // Store reference to the modal
    }

    function hideCustomModal() {
        if (searchResultsModal && searchResultsModal.parentNode) {
            searchResultsModal.parentNode.removeChild(searchResultsModal);
            searchResultsModal = null;
        }
    }

    // Function to show various types of alerts/feedback using custom DOM elements
    function showAlert(title, text, type = 'info', contentForModal = null) { // Renamed htmlContent to contentForModal for clarity
        hideLoadingToast(); // Always hide toast when showing a different alert

        if (type === 'info') { // For "搜索中", "即将跳转"
            showLoadingToast(text);
        } else if (type === 'warning' || type === 'error') { // For user input issues or errors
            alert(`${title}\n\n${text}`); // Use native alert for blocking error feedback
        } else if (type === 'success' && contentForModal) { // For displaying search results (contentForModal is a DOM node here)
            showCustomModal(title, contentForModal);
        } else if (type === 'success' && !contentForModal) { // For a simple success message (not used for results now)
            console.log(`油猴脚本: ${title} - ${text}`);
            // Optionally, could show a short toast here if desired for non-modal success feedback
        }
    }

    // Function to traverse the DOM and preload all university data
    function preloadUniversities() {
        if (allUniversitiesData.length > 0) {
            console.log('油猴脚本: 大学数据已预加载，跳过。');
            return;
        }

        console.log('油猴脚本: 开始预加载大学数据...');
        const mainNavList = document.querySelector('ul.md-nav__list');
        if (!mainNavList) {
            console.warn('油猴脚本: 预加载失败 - 无法找到主导航列表元素 (ul.md-nav__list)。');
            return;
        }

        const topLevelCategoryLIs = mainNavList.querySelectorAll(':scope > li.md-nav__item');

        topLevelCategoryLIs.forEach(li => {
            const categoryLabelOrLink = li.querySelector('label.md-nav__link, a.md-nav__link');
            if (categoryLabelOrLink) {
                const categoryName = categoryLabelOrLink.textContent.trim();
                // We are interested in "问卷数据" and "已归档数据"
                if (categoryName.includes('问卷数据') || categoryName.includes('已归档数据')) {
                    const innerNavElement = li.querySelector('nav.md-nav');
                    if (innerNavElement) {
                        // Gather all links directly under this main category (provinces or direct universities)
                        // Use a more specific selector to avoid non-nav links like headers if they exist in nav
                        const allInnerLinks = innerNavElement.querySelectorAll('a.md-nav__link');

                        allInnerLinks.forEach(itemLink => {
                            // Ensure the link has an href and is not just an empty placeholder
                            if (itemLink.href && itemLink.textContent.trim() !== '') {
                                allUniversitiesData.push({
                                    name: itemLink.textContent.trim(),
                                    category: categoryName,
                                    element: itemLink, // Keep element for reference if needed
                                    href: itemLink.href // Store the URL for direct navigation
                                });
                            }
                        });
                    }
                }
            }
        });

        // Filter out duplicates and clean up names
        const uniquePreloadResults = [];
        const seenKeys = new Set(); // Use a key (name + category + href) for robust uniqueness
        allUniversitiesData.forEach(item => {
            const key = item.name + item.category + item.href;
            if (!seenKeys.has(key)) {
                uniquePreloadResults.push(item);
                seenKeys.add(key);
            }
        });
        allUniversitiesData = uniquePreloadResults; // Update global array with unique results

        console.log(`油猴脚本: 预加载完成。共找到 ${allUniversitiesData.length} 个独特的大学数据。`);
        // console.log('预加载数据示例:', allUniversitiesData.slice(0, 5)); // For debugging
    }

    // Function to display search results in a custom modal
    function displaySearchResults(results, universityName) {
        if (results.length === 0) {
            showAlert('未找到', `未能找到与 "${universityName}" 相关的任何信息。请尝试更精确的名称或检查拼写。`, 'error');
            return;
        }

        const resultsContainer = createElement('div', { style: 'max-height: 300px; overflow-y: auto; text-align: left;' }); // Create a container DOM element
        results.forEach((result, index) => {
            const listItem = createElement('div', {
                style: `
                    padding: 8px 0;
                    border-bottom: 1px solid #eee;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                `
            });
            const textSpan = createElement('span', {}, `${result.name} (${result.category})`);
            const goButton = createElement('button', {
                style: `
                    padding: 6px 10px;
                    background-color: #28a745;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 13px;
                    margin-left: 10px;
                    flex-shrink: 0;
                `
            }, '前往');

            // Add event listener to the goButton directly before appending
            goButton.addEventListener('click', () => {
                console.log(`油猴脚本: 点击“前往”按钮，目标: ${result.name}, URL: ${result.href}`); // Add this log
                hideCustomModal(); // Close the results modal

                // Show a non-blocking "即将跳转" loading message
                showAlert('即将跳转', `正在前往 ${result.name} 的页面...`, 'info');

                // Give the toast a moment to render before navigating
                setTimeout(() => {
                    window.location.href = result.href; // Perform the actual navigation
                }, 300); // Small delay to show the toast
            });

            listItem.appendChild(textSpan);
            listItem.appendChild(goButton);
            resultsContainer.appendChild(listItem); // Append list item to the container DOM element
        });

        // Pass the container DOM element to showAlert, not its innerHTML
        showAlert('搜索结果', '请选择您要前往的大学：', 'success', resultsContainer);
    }

    async function performSearch() {
        console.log('油猴脚本: 搜索按钮被点击...');
        const universityName = document.getElementById('university-search-input').value.trim();
        const category = document.getElementById('info-category-select').value;

        if (!universityName) {
            showAlert('提示', '请输入大学名称！', 'warning');
            console.log('油猴脚本: 大学名称为空。');
            return;
        }

        // Show a non-blocking "搜索中" toast
        showAlert('搜索中', `正在搜索 "${universityName}" 的 "${category}" 信息...`, 'info');
        console.log(`油猴脚本: 开始在预加载数据中搜索 "${universityName}" 在 "${category}" 类别下...`);

        const searchUniNameLower = universityName.toLowerCase();
        let matchedResults = [];

        // Filter from the preloaded data
        matchedResults = allUniversitiesData.filter(uni => {
            const matchesName = uni.name.toLowerCase().includes(searchUniNameLower);
            const matchesCategory = (category === '所有类别' || uni.category.includes(category));
            return matchesName && matchesCategory;
        });

        // Display all found results to the user
        displaySearchResults(matchedResults, universityName);
        console.log(`油猴脚本: 搜索完成。找到 ${matchedResults.length} 个匹配结果。`);
    }

    // Function to add the search UI
    function addSearchUI() {
        if (document.getElementById('custom-search-container')) {
            console.log('油猴脚本: 搜索UI已存在，跳过注入。');
            return;
        }

        console.log('油猴脚本: 尝试添加搜索UI... 将在DOM加载完毕后预加载数据。');
        // Preload data only once when UI is first added
        preloadUniversities();

        const searchContainer = createElement('div', {
            id: 'custom-search-container',
            style: `
                position: fixed;
                top: 15px;
                right: 15px;
                padding: 10px;
                background-color: #f0f0f0;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                display: flex;
                flex-direction: row;
                gap: 8px;
                align-items: center;
                z-index: 9999;
                max-width: 400px;
                font-family: 'Inter', sans-serif;
            `
        });

        const searchInput = createElement('input', {
            type: 'text',
            id: 'university-search-input',
            placeholder: '输入大学名称',
            style: `
                padding: 8px;
                border: 1px solid #ccc;
                border-radius: 4px;
                flex-grow: 1;
                font-size: 14px;
                width: 150px;
            `
        });

        const categorySelect = createElement('select', {
            id: 'info-category-select',
            style: `
                padding: 8px;
                border: 1px solid #ccc;
                border-radius: 4px;
                font-size: 14px;
            `
        }, [
            createElement('option', { value: '所有类别' }, '所有类别'),
            createElement('option', { value: '问卷数据' }, '问卷数据'),
            createElement('option', { value: '已归档数据' }, '已归档数据')
        ]);

        const searchButton = createElement('button', {
            id: 'perform-search-button',
            style: `
                padding: 8px 12px;
                background-color: #007bff;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                transition: background-color 0.2s, transform 0.1s;
            `
        }, '搜索');

        searchButton.onmouseover = function() { this.style.backgroundColor = '#0056b3'; };
        searchButton.onmouseout = function() { this.style.backgroundColor = '#007bff'; };
        searchButton.onmousedown = function() { this.style.transform = 'scale(0.98)'; };
        searchButton.onmouseup = function() { this.style.transform = 'scale(1)'; };


        searchContainer.appendChild(searchInput);
        searchContainer.appendChild(categorySelect);
        searchContainer.appendChild(searchButton);

        document.body.appendChild(searchContainer);
        console.log('油猴脚本: UI注入成功，插入点: body 的右上角 (固定位置)。');

        searchButton.addEventListener('click', performSearch);
        console.log('油猴脚本: 搜索按钮事件监听器已添加。');
    }

    // Use MutationObserver to ensure script runs after DOM is ready
    const observer = new MutationObserver((mutations, obs) => {
        const anyMajorElement = document.querySelector('.page') || document.querySelector('ul.md-nav__list') || document.querySelector('.page-header');
        if (anyMajorElement) {
            console.log('油猴脚本: MutationObserver 检测到主UI元素存在，尝试添加UI。');
            addSearchUI(); // This will also trigger preloadUniversities()
            obs.disconnect(); // Stop observing once UI is added
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Fallback if the observer doesn't trigger quickly enough (e.g., for very static pages)
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        console.log('油猴脚本: DOM已加载完成或可交互，直接尝试添加UI。');
        addSearchUI(); // This will also trigger preloadUniversities()
    }

})();