// ==UserScript==
// @name         Confluence Floating TOC
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  在 Confluence 文章页面上浮动展示文章目录，并支持展开和折叠功能，自动适应暗色/亮色模式
// @author       mkdir700
// @match        https://*.atlassian.net/wiki/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500070/Confluence%20Floating%20TOC.user.js
// @updateURL https://update.greasyfork.org/scripts/500070/Confluence%20Floating%20TOC.meta.js
// ==/UserScript==


// 递归处理已有的 TOC，重新生成新的 TOC
function genertateTOCFromExistingToc(toc) {
    if (toc.textContent === '') {
        return;
    }
    let currUl = document.createElement('ul');
    currUl.id = 'floating-toc-ul';
    for (let i = 0; i < toc.children.length; i++) {
        // li > span > a
        var a = toc.children[i].querySelector('span > a');
        var headerTextElement = toc.children[i].querySelector('span > a > span > span');
        if (!headerTextElement) {
            continue;
        }

        var headerText = headerTextElement.textContent;

        // 创建目录项
        var tocItem = document.createElement('li');

        // 创建链接
        var tocLink = document.createElement('a');
        tocLink.textContent = headerText;

        // 使用标题的 id 作为 URL 片段
        // 标题中的空格需要替换为 -，并且转为小写
        tocLink.href = a.href;
        tocItem.appendChild(tocLink);

        // 如果有子目录，递归处理
        var childUl = toc.children[i].querySelector('ul');
        if (childUl) {
            var newUl = genertateTOCFromExistingToc(childUl);
            if (newUl) {
                tocItem.appendChild(newUl);
            }
        }
        currUl.appendChild(tocItem);
    }

    return currUl;
}


function getExistingToc() {
    return document.querySelector('[data-testid="list-style-toc-level-container"]');
}

function generateTOCFormPage() {
    // 创建目录列表
    var tocList = document.createElement('ul');
    tocList.id = 'floating-toc-ul';
    // 获取所有标题
    var headers = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headers.forEach(function (header) {
        // 过滤掉 id 为空的标题
        if (header.textContent === '') {
            return;
        }
        // 检查是否有属性 data-item-title
        if (header.hasAttribute('data-item-title')) {
            return;
        }
        // 检查属性 data-testid 是否等于 title-text
        if (header.getAttribute('data-testid') === 'title-text') {
            return;
        }
        if (header.id === 'floating-toc-title') {
            return;
        }
        // class 为 'cc-te0214' 的标题不需要显示在目录中
        if (header.className === 'cc-te0214') {
            return;
        }
        // 排除特定的 h2 标签
        if (header.tagName === 'H2' && header.closest('[data-vc="end-of-page-recommendation-component"]')) {
            return;
        }
        // 排除 "快速入门" 标题
        if (header.closest('[data-test-id="onboarding-quickstart-experience"]')) {
            return;
        }

        if (header.closest('[data-test-id="flag-visibility-wrapper"]')) {
            return;
        }

        if (header.tagName === 'H2' && header.closest('[class="atlaskit-portal-container"]')) {
            return;
        }

        // 创建目录项
        var tocItem = document.createElement('li');
        tocItem.style.marginLeft = (parseInt(header.tagName[1]) - 1) * 10 + 'px'; // 根据标题级别缩进

        // 创建链接
        var tocLink = document.createElement('a');
        tocLink.textContent = header.textContent;

        // 使用标题作为 URL 片段
        tocLink.href = '#' + header.textContent.replace(/\s/g, '-');
        tocItem.appendChild(tocLink);

        // 将目录项添加到目录列表中
        tocList.appendChild(tocItem);
    });

    return tocList;
}

function buildToggleButton() {
    // 检查当前颜色模式
    const isDarkMode = document.documentElement.getAttribute('data-color-mode') === 'dark' || 
                       (document.documentElement.getAttribute('data-color-mode') === 'light' && 
                        document.documentElement.getAttribute('data-theme') && 
                        document.documentElement.getAttribute('data-theme').includes('light:dark'));
    
    var toggleButton = document.createElement('div');
    toggleButton.id = 'floating-toc-toggle';
    toggleButton.innerHTML = '&#9654;'; // 右箭头 Unicode 字符
    toggleButton.style.position = 'fixed';
    toggleButton.style.top = '200px';
    toggleButton.style.right = '0';
    toggleButton.style.backgroundColor = isDarkMode ? '#4688ec' : '#007bff';
    toggleButton.style.color = '#fff';
    toggleButton.style.width = '20px';
    toggleButton.style.height = '40px';
    toggleButton.style.display = 'flex';
    toggleButton.style.justifyContent = 'center';
    toggleButton.style.alignItems = 'center';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.userSelect = 'none';
    toggleButton.style.borderRadius = '5px 0 0 5px';
    toggleButton.style.zIndex = '1000';
    toggleButton.style.transition = 'all 0.3s ease-in-out';
    toggleButton.style.fontSize = '14px';

    var isCollapsed = false;
    toggleButton.addEventListener('click', function () {
        var tocContainer = document.getElementById('floating-toc-container');
        if (isCollapsed) {
            tocContainer.style.right = '0';
            toggleButton.innerHTML = '&#9654;'; // 右箭头
            toggleButton.style.right = '220px'; // 调整按钮位置
        } else {
            tocContainer.style.right = '-220px'; // 完全隐藏目录
            toggleButton.innerHTML = '&#9664;'; // 左箭头
            toggleButton.style.right = '-10px';
        }
        isCollapsed = !isCollapsed;
    });

    toggleButton.addEventListener('mouseenter', function() {
        if (isCollapsed) {
            toggleButton.style.right = '0';
        }
    });

    toggleButton.addEventListener('mouseleave', function() {
        if (isCollapsed) {
            toggleButton.style.right = '-10px';
        }
    });

    return toggleButton;
}


function buildToc() {
    // 检查当前颜色模式
    const isDarkMode = document.documentElement.getAttribute('data-color-mode') === 'dark' || 
                       (document.documentElement.getAttribute('data-color-mode') === 'light' && 
                        document.documentElement.getAttribute('data-theme') && 
                        document.documentElement.getAttribute('data-theme').includes('light:dark'));
    
    var tocContainer = document.createElement('div');
    tocContainer.id = 'floating-toc-container';
    tocContainer.style.width = '220px'; // 增加宽度以包含padding
    tocContainer.style.backgroundColor = isDarkMode ? '#2c2c2e' : '#fff';
    tocContainer.style.border = isDarkMode ? '1px solid #444' : '1px solid #ccc';
    tocContainer.style.padding = '10px';
    tocContainer.style.boxSizing = 'border-box'; // 确保padding包含在宽度内
    tocContainer.style.boxShadow = isDarkMode ? '0 0 10px rgba(0,0,0,0.3)' : '0 0 10px rgba(0,0,0,0.1)';
    tocContainer.style.position = 'fixed';
    tocContainer.style.top = '200px';
    tocContainer.style.right = '0';
    tocContainer.style.maxHeight = 'calc(100vh - 300px)';
    tocContainer.style.overflowY = 'auto';
    tocContainer.style.transition = 'right 0.3s ease-in-out';
    tocContainer.style.zIndex = '999';
    tocContainer.style.scrollbarWidth = 'none';
    tocContainer.style.msOverflowStyle = 'none';

    var style = document.createElement('style');
    style.textContent = `
        #floating-toc-container::-webkit-scrollbar {
            display: none;
        }
    `;
    document.head.appendChild(style);

    var tocTitle = document.createElement('div');
    tocTitle.textContent = '目录';
    tocTitle.style.marginTop = '0';
    tocTitle.style.marginBottom = '10px';
    tocTitle.style.textAlign = 'center';
    tocTitle.style.fontSize = '16px';
    tocTitle.style.fontWeight = 'bold';
    tocTitle.style.color = isDarkMode ? '#bfc1c4' : '#000';
    tocContainer.appendChild(tocTitle);

    return tocContainer;
}

function generateTOC() {
    // var existingTOC = getExistingToc();
    // var toc;

    // if (existingTOC) {
        // toc = genertateTOCFromExistingToc(existingTOC);
    // } else {
        // toc = generateTOCFormPage();
    // }
    var toc = generateTOCFormPage();

    if (!toc || toc.children.length === 0) {
        var emptyMessage = document.createElement('div');
        emptyMessage.id = 'floating-toc-empty-message';
        emptyMessage.textContent = '当前页面没有可用的目录内容';
        emptyMessage.style.color = '#666';
        emptyMessage.style.fontStyle = 'italic';
        emptyMessage.style.textAlign = 'center';
        emptyMessage.style.padding = '20px 0';
        return emptyMessage;
    }

    toc.style.listStyle = 'none';
    toc.style.padding = '0';
    toc.style.margin = '0';

    // 检查当前颜色模式
    const isDarkMode = document.documentElement.getAttribute('data-color-mode') === 'dark' || 
                       (document.documentElement.getAttribute('data-color-mode') === 'light' && 
                        document.documentElement.getAttribute('data-theme') && 
                        document.documentElement.getAttribute('data-theme').includes('light:dark'));

    // 优化目录列表样式
    var listItems = toc.querySelectorAll('li');
    listItems.forEach(function(item, index) {
        item.style.marginBottom = '5px';
        var link = item.querySelector('a');
        if (link) {
            link.style.textDecoration = 'none';
            link.style.color = isDarkMode ? '#a9abaf' : '#333';
            link.style.display = 'block';
            link.style.padding = '3px 5px';
            link.style.borderRadius = '3px';
            link.style.transition = 'background-color 0.2s';
            link.style.whiteSpace = 'nowrap';
            link.style.overflow = 'hidden';
            link.style.textOverflow = 'ellipsis';
            link.style.maxWidth = '180px';  // 减小最大宽度

            // 设置标题完整内容为title属性
            link.title = link.textContent;

            // 截断长标题
            if (link.textContent.length > 25) {
                link.textContent = link.textContent.substring(0, 22) + '...';
            }

            // 根据颜色模式设置悬停效果
            const hoverBgColor = isDarkMode ? '#3a3a3c' : '#f0f0f0';
            link.addEventListener('mouseover', function() {
                this.style.backgroundColor = hoverBgColor;
            });
            link.addEventListener('mouseout', function() {
                this.style.backgroundColor = 'transparent';
            });

            // 优化缩进
            var level = parseInt(item.style.marginLeft) / 10;
            item.style.paddingLeft = (level * 15) + 'px';  // 使用 padding 代替 margin
            item.style.marginLeft = '0';  // 移除左边距

            // 为第三级及以下的标题添加折叠功能
            if (level > 2) {
                item.style.display = 'none';
                var parentLi = item.parentElement.closest('li');
                if (parentLi && !parentLi.classList.contains('has-submenu')) {
                    parentLi.classList.add('has-submenu');
                    var toggleBtn = document.createElement('span');
                    toggleBtn.textContent = '▶';
                    toggleBtn.style.cursor = 'pointer';
                    toggleBtn.style.marginRight = '5px';
                    toggleBtn.style.fontSize = '10px';  // 减小箭头大小
                    toggleBtn.style.color = isDarkMode ? '#a9abaf' : '#333'; // 根据颜色模式设置颜色
                    parentLi.insertBefore(toggleBtn, parentLi.firstChild);

                    toggleBtn.addEventListener('click', function(e) {
                        e.stopPropagation();  // 防止点击事件冒泡
                        var subItems = this.parentElement.querySelectorAll('li');
                        subItems.forEach(function(subItem) {
                            subItem.style.display = subItem.style.display === 'none' ? 'block' : 'none';
                        });
                        this.textContent = this.textContent === '▶' ? '▼' : '▶';
                    });
                }
            }
        }
    });

    // 添加平滑滚动
    toc.style.scrollBehavior = 'smooth';

    return toc;
}

function updateMaxHeight(tocContainer) {
    const viewportHeight = window.innerHeight;
    const topOffset = parseFloat(tocContainer.style.top);
    tocContainer.style.maxHeight = (viewportHeight - topOffset - 20) + 'px'; // 20px 为一些额外的间距
}

// 检测 Confluence 页面的颜色模式并相应地调整插件样式
function detectColorModeAndApplyStyles() {
    // 检查 HTML 元素的 data-color-mode 属性
    const isDarkMode = document.documentElement.getAttribute('data-color-mode') === 'dark' || 
                       (document.documentElement.getAttribute('data-color-mode') === 'light' && 
                        document.documentElement.getAttribute('data-theme') && 
                        document.documentElement.getAttribute('data-theme').includes('light:dark'));
    
    // 获取插件元素
    const tocContainer = document.getElementById('floating-toc-container');
    const toggleButton = document.getElementById('floating-toc-toggle');
    const backToTopButton = document.getElementById('back-to-top-button');
    
    if (isDarkMode) {
        // 暗色模式样式
        if (tocContainer) {
            tocContainer.style.backgroundColor = '#2c2c2e'; // 深色背景
            tocContainer.style.border = '1px solid #444';
            tocContainer.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
            
            // 修改目录标题和链接颜色
            const tocTitle = tocContainer.querySelector('div');
            if (tocTitle) {
                tocTitle.style.color = '#bfc1c4'; // 使用 --ds-text 变量值
            }
            
            // 修改所有链接颜色
            const links = tocContainer.querySelectorAll('a');
            links.forEach(link => {
                link.style.color = '#a9abaf'; // 使用 --ds-text-subtle 变量值
                
                // 修改鼠标悬停效果
                link.addEventListener('mouseover', function() {
                    this.style.backgroundColor = '#3a3a3c';
                });
                link.addEventListener('mouseout', function() {
                    this.style.backgroundColor = 'transparent';
                });
            });
        }
        
        if (toggleButton) {
            toggleButton.style.backgroundColor = '#4688ec'; // 使用 --ds-icon-accent-blue 变量值
        }
        
        if (backToTopButton) {
            backToTopButton.style.backgroundColor = '#4688ec'; // 使用 --ds-icon-accent-blue 变量值
        }
    } else {
        // 亮色模式样式（恢复默认）
        if (tocContainer) {
            tocContainer.style.backgroundColor = '#fff';
            tocContainer.style.border = '1px solid #ccc';
            tocContainer.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
            
            // 恢复目录标题颜色
            const tocTitle = tocContainer.querySelector('div');
            if (tocTitle) {
                tocTitle.style.color = '#000';
            }
            
            // 恢复所有链接颜色
            const links = tocContainer.querySelectorAll('a');
            links.forEach(link => {
                link.style.color = '#333';
                
                // 恢复鼠标悬停效果
                link.addEventListener('mouseover', function() {
                    this.style.backgroundColor = '#f0f0f0';
                });
                link.addEventListener('mouseout', function() {
                    this.style.backgroundColor = 'transparent';
                });
            });
        }
        
        if (toggleButton) {
            toggleButton.style.backgroundColor = '#007bff';
        }
        
        if (backToTopButton) {
            backToTopButton.style.backgroundColor = '#007bff';
        }
    }
}

function buildBackToTopButton() {
    // 检查当前颜色模式
    const isDarkMode = document.documentElement.getAttribute('data-color-mode') === 'dark' || 
                       (document.documentElement.getAttribute('data-color-mode') === 'light' && 
                        document.documentElement.getAttribute('data-theme') && 
                        document.documentElement.getAttribute('data-theme').includes('light:dark'));
    
    var backToTopButton = document.createElement('div');
    backToTopButton.id = 'back-to-top-button';
    backToTopButton.innerHTML = '&#9650;'; // 上箭头 Unicode 字符
    backToTopButton.style.position = 'fixed';
    backToTopButton.style.bottom = '30px';
    backToTopButton.style.right = '220px'; // 调整位置，使其位于目录左侧
    backToTopButton.style.backgroundColor = isDarkMode ? '#4688ec' : '#007bff';
    backToTopButton.style.color = '#fff';
    backToTopButton.style.width = '40px';
    backToTopButton.style.height = '40px';
    backToTopButton.style.borderRadius = '50%';
    backToTopButton.style.display = 'flex';
    backToTopButton.style.justifyContent = 'center';
    backToTopButton.style.alignItems = 'center';
    backToTopButton.style.cursor = 'pointer';
    backToTopButton.style.fontSize = '20px';
    backToTopButton.style.boxShadow = isDarkMode ? '0 2px 5px rgba(0,0,0,0.3)' : '0 2px 5px rgba(0,0,0,0.2)';
    backToTopButton.style.transition = 'opacity 0.3s';
    backToTopButton.style.opacity = '0';
    backToTopButton.style.zIndex = '1000';

    backToTopButton.addEventListener('click', function() {
        window.scrollTo({top: 0, behavior: 'smooth'});
    });

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 100) {
            backToTopButton.style.opacity = '1';
        } else {
            backToTopButton.style.opacity = '0';
        }
    });

    return backToTopButton;
}


(function () {
    'use strict';

    var tocContainer = buildToc();
    document.body.appendChild(tocContainer);

    var toggleButton = buildToggleButton();
    document.body.appendChild(toggleButton);

    // 初始化按钮位置
    toggleButton.style.right = '220px';

    var backToTopButton = buildBackToTopButton();
    document.body.appendChild(backToTopButton);

    function updateTOC() {
        var existingContent = document.getElementById('floating-toc-ul') || document.getElementById('floating-toc-empty-message');
        if (existingContent) {
            existingContent.remove();
        }

        var newContent = generateTOC();
        tocContainer.appendChild(newContent);
    }

    // 使用防抖函数来限制更新频率
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 防抖处理的更新函数
    const debouncedUpdateTOC = debounce(updateTOC, 300);

    // 初始化目录
    updateTOC();

    // 监听 URL 变化
    var lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(updateTOC, 1000); // 延迟 1 秒更新目录，确保页面内容已加载
        }
    }).observe(document, {subtree: true, childList: true});

    // 监听页面内容变化，包括编辑状态下的变化
    var contentObserver = new MutationObserver(function(mutations) {
        let shouldUpdate = false;
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                // 检查是否有新的标题元素被添加或删除
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1 && /^H[1-6]$/i.test(node.tagName)) {
                        shouldUpdate = true;
                    }
                });
                mutation.removedNodes.forEach(function(node) {
                    if (node.nodeType === 1 && /^H[1-6]$/i.test(node.tagName)) {
                        shouldUpdate = true;
                    }
                });
            } else if (mutation.type === 'characterData') {
                // 检查文本内容的变化
                let node = mutation.target.parentNode;
                while (node && node !== document.body) {
                    if (/^H[1-6]$/i.test(node.tagName)) {
                        shouldUpdate = true;
                        break;
                    }
                    node = node.parentNode;
                }
            }
        });

        if (shouldUpdate) {
            debouncedUpdateTOC();
        }
    });

    contentObserver.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });

    // 检测颜色模式并应用样式
    detectColorModeAndApplyStyles();

    // 监听颜色模式变化
    const colorModeObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && 
                (mutation.attributeName === 'data-color-mode' || mutation.attributeName === 'data-theme')) {
                detectColorModeAndApplyStyles();
            }
        });
    });

    colorModeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-color-mode', 'data-theme']
    });

    // ... 其他现有代码 ...
})();
