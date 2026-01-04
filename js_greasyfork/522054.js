// ==UserScript==
// @name         豆瓣图书 Z-Library 搜索
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  在豆瓣图书页面添加Z-Library搜索链接
// @author       You
// @match        https://book.douban.com/subject/*
// @match        http://book.douban.com/subject/*
// @include      https://book.douban.com/subject/*
// @include      http://book.douban.com/subject/*
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      *
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522054/%E8%B1%86%E7%93%A3%E5%9B%BE%E4%B9%A6%20Z-Library%20%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/522054/%E8%B1%86%E7%93%A3%E5%9B%BE%E4%B9%A6%20Z-Library%20%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Z-Library 可能的域名列表
    const ZLIB_DOMAINS = [
        'zh.z-lib.rest',
        'zh.zlibrary-global.se',
        'zh.z-lib.su',
        'zh.openzlib.link',
        'z-lib.su',
        'zh.z-lib.today',
        // 可以继续添加其他可能的域名
    ];

    // 存储全局元素引用
    let elements = {};

    // 检查并获取可用的域名
    async function getWorkingDomain() {
        // 获取缓存的域名并验证其可用性
        const cachedDomain = GM_getValue('workingDomain');
        const testTitle = "Harry Potter"; // 使用热门书籍作为测试搜索词

        if (cachedDomain) {
            try {
                const response = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: `https://${cachedDomain}/s/${encodeURIComponent(testTitle)}`,
                        timeout: 5000,
                        onload: resolve,
                        onerror: reject,
                        ontimeout: reject,
                        followRedirect: true
                    });
                });

                if (response.status === 200) {
                    // 检查是否有搜索结果
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');
                    const bookItems = doc.querySelectorAll('.book-item');
                    
                    if (bookItems.length > 0) {
                        console.log('缓存的域名可用:', cachedDomain);
                        return cachedDomain;
                    }
                }
            } catch (error) {
                console.log('缓存的域名不可用:', cachedDomain, error);
            }
        }

        // 测试所有可能的域名
        for (let domain of ZLIB_DOMAINS) {
            try {
                console.log('测试域名:', domain);
                const response = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: `https://${domain}/s/${encodeURIComponent(testTitle)}`,
                        timeout: 5000,
                        onload: resolve,
                        onerror: reject,
                        ontimeout: reject,
                        followRedirect: true
                    });
                });

                if (response.status === 200) {
                    // 检查是否有搜索结果
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');
                    const bookItems = doc.querySelectorAll('.book-item');
                    
                    if (bookItems.length > 0) {
                        const finalDomain = new URL(response.finalUrl).hostname;
                        console.log('找到可用域名:', finalDomain);
                        GM_setValue('workingDomain', finalDomain);
                        return finalDomain;
                    }
                }
            } catch (error) {
                console.log(`域名 ${domain} 不可用:`, error);
                continue;
            }
        }

        throw new Error('没有找到可用的Z-Library域名');
    }

    // 获取选中的格式
    function getSelectedFormats() {
        return Array.from(elements.searchDiv.querySelectorAll('.format-option input:checked')).map(input => input.value);
    }

    // 更新选中状态显示函数
    function updateHeaderText() {
        if (!elements.header) return;
        const selectedFormats = getSelectedFormats();
        elements.header.textContent = selectedFormats.length ? selectedFormats.join(', ') : '选择格式';
    }

    // 修改搜索按钮点击事件
    async function handleSearch(query) {
        try {
            const domain = await getWorkingDomain();
            const formats = getSelectedFormats();
            const formatParams = formats.map(format => `extensions%5B%5D=${format}`).join('&');
            const url = `https://${domain}/s/${encodeURIComponent(query)}?e=1&${formatParams}`;
            window.open(url, '_blank');
        } catch (error) {
            console.error('搜索时出错:', error);
            alert('抱歉，暂时无法访问Z-Library，请稍后再试。');
        }
    }

    // 检查搜索结果数量的函数
    async function checkSearchResults(query, formats, buttonId) {
        try {
            const button = document.getElementById(buttonId);
            if (!button) {
                console.error(`找不到按钮元素: ${buttonId}`);
                return;
            }

            const domain = await getWorkingDomain();
            const formatParams = formats.map(format => `extensions%5B%5D=${format}`).join('&');
            const url = `https://${domain}/s/${encodeURIComponent(query)}?e=1&${formatParams}`;

            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    try {
                        // 再次检查按钮是否存在
                        const button = document.getElementById(buttonId);
                        if (!button) {
                            console.error(`按钮元素在处理响应时不存在: ${buttonId}`);
                            // 尝试重新获取按钮
                            setTimeout(() => {
                                const reloadedButton = document.getElementById(buttonId);
                                if (reloadedButton) {
                                    updateButtonStatus(reloadedButton, response);
                                }
                            }, 100);
                            return;
                        }

                        updateButtonStatus(button, response);
                    } catch (error) {
                        console.error('处理搜索结果时出错:', error);
                    }
                },
                onerror: function(error) {
                    console.error('请求失败:', error);
                    updateButtonError(buttonId);
                }
            });
        } catch (error) {
            console.error('检查搜索结果时出错:', error);
        }
    }

    // 抽取按钮状态更新逻辑
    function updateButtonStatus(button, response) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(response.responseText, 'text/html');
        const bookItems = doc.querySelectorAll('.book-item');

        if (bookItems.length === 0) {
            button.style.backgroundColor = '#999';
            button.style.borderColor = '#888';
            button.style.cursor = 'not-allowed';
            button.title = '未找到相关资源';
        } else {
            button.style.backgroundColor = '#41ac52';
            button.style.borderColor = '#3c9f4c';
            button.style.cursor = 'pointer';
            button.title = `找到 ${bookItems.length} 个资源`;
        }
    }

    function updateButtonError(buttonId) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.style.backgroundColor = '#999';
            button.style.borderColor = '#888';
            button.style.cursor = 'not-allowed';
            button.title = '请求失败，请稍后重试';
        }
    }

    async function initializeScript() {
        try {
            console.log('豆瓣图书 Z-Library 搜索脚本开始运行');

            if (location.host !== "book.douban.com") {
                console.log('不在豆瓣图书页面，脚本退出');
                return;
            }

            // 获取必要元素
            const wrapper = document.querySelector('#wrapper');
            const aside = document.querySelector('.aside');

            if (!wrapper || !aside) {
                console.error('找不到必要的页面元素，页面结构可能已改变');
                return;
            }

            // 删除广告组件
            const adDiv = document.getElementById('dale_book_subject_top_right');
            if (adDiv) {
                adDiv.remove();
                console.log('成功移除广告组件');
            }

            // 创建 MutationObserver 实例来监控广告组件
            const adObserver = new MutationObserver((mutations) => {
                const newAdDiv = document.getElementById('dale_book_subject_top_right');
                if (newAdDiv) {
                    newAdDiv.remove();
                    console.log('成功移除动态加载的广告组件');
                }
            });

            // 观察整个文档以捕获动态加载的广告
            adObserver.observe(document.body, {
                childList: true,
                subtree: true
            });

            // 获取ISBN和书名
            const isbnElement = Array.from(document.querySelectorAll('#info span.pl')).find(el => el.textContent.includes('ISBN'));
            const isbn = isbnElement ? isbnElement.nextSibling.textContent.trim() : '';
            const title = document.querySelector('#wrapper > h1 > span').textContent.split(' ')[0];

            // 创建独立的容器
            const zlibContainer = document.createElement('div');
            zlibContainer.id = 'zlib-search-container';
            zlibContainer.style.cssText = 'margin: 0 0 20px 0; padding: 10px; background: #fff; border: 1px solid #eee; border-radius: 4px;';

            elements.searchDiv = document.createElement('div');
            elements.searchDiv.style.cssText = 'margin: 0; padding: 0;';
            elements.searchDiv.innerHTML = `
                <h2 style="margin-bottom:10px; color: #494949; font-size: 15px;">在 Z-Library 搜索</h2>
                <div style="display:flex; flex-direction: column; gap:10px;">
                    <div style="display:flex; gap:10px; align-items: center;">
                        <div class="format-select-container">
                            <div class="format-select-header">选择格式</div>
                            <div class="format-select-options">
                                <div class="format-option"><input type="checkbox" value="EPUB" checked> EPUB</div>
                                <div class="format-option"><input type="checkbox" value="PDF" checked> PDF</div>
                                <div class="format-option"><input type="checkbox" value="MOBI"> MOBI</div>
                                <div class="format-option"><input type="checkbox" value="AZW"> AZW</div>
                                <div class="format-option"><input type="checkbox" value="AZW3"> AZW3</div>
                                <div class="format-option"><input type="checkbox" value="TXT"> TXT</div>
                                <div class="format-option"><input type="checkbox" value="DOC"> DOC</div>
                                <div class="format-option"><input type="checkbox" value="DOCX"> DOCX</div>
                            </div>
                        </div>
                        <a href="javascript:void(0);" id="apply_format"
                           style="display:inline-block; padding:5px 15px; background:#41ac52; color:white; text-decoration:none; border-radius:3px; font-size: 13px; border: 1px solid #3c9f4c; transition: all 0.2s ease;">
                           应用选择
                        </a>
                    </div>
                    <div style="display:flex; gap:10px;">
                        <a href="javascript:void(0);" id="isbn_search"
                           style="display:inline-block; padding:5px 15px; background:#41ac52; color:white; text-decoration:none; border-radius:3px; font-size: 13px; border: 1px solid #3c9f4c; transition: all 0.2s ease;">
                           用ISBN搜索
                        </a>
                        <a href="javascript:void(0);" id="title_search"
                           style="display:inline-block; padding:5px 15px; background:#41ac52; color:white; text-decoration:none; border-radius:3px; font-size: 13px; border: 1px solid #3c9f4c; transition: all 0.2s ease;">
                           用书名搜索
                        </a>
                    </div>
                </div>
            `;
            zlibContainer.appendChild(elements.searchDiv);

            // 添加样式
            const style = document.createElement('style');
            style.textContent = `
                .format-select-container {
                    position: relative;
                    width: 120px;
                }
                .format-select-header {
                    padding: 4px 24px 4px 8px;
                    border: 1px solid #ccc;
                    border-radius: 3px;
                    background: white;
                    cursor: pointer;
                    position: relative;
                }
                .format-select-header:after {
                    content: '';
                    position: absolute;
                    right: 8px;
                    top: 50%;
                    transform: translateY(-50%);
                    border-left: 5px solid transparent;
                    border-right: 5px solid transparent;
                    border-top: 5px solid #666;
                }
                .format-select-options {
                    display: none;
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: white;
                    border: 1px solid #ccc;
                    border-top: none;
                    border-radius: 0 0 3px 3px;
                    max-height: 200px;
                    overflow-y: auto;
                    z-index: 1000;
                }
                .format-select-options.show {
                    display: block;
                }
                .format-option {
                    padding: 4px 8px;
                    cursor: pointer;
                }
                .format-option:hover {
                    background: #f5f5f5;
                }
                .format-option.selected {
                    background: #e8f0fe;
                }
                .format-option input {
                    margin-right: 5px;
                }
            `;
            document.head.appendChild(style);

            // 插入到侧边栏的顶部
            aside.insertBefore(zlibContainer, aside.firstChild);

            // 创建 MutationObserver 实例
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(() => {
                    // 如果容器被移除，重新插入
                    if (!document.getElementById('zlib-search-container')) {
                        console.log('Z-Library 搜索容器被移除，正在重新插入...');
                        const currentAside = document.querySelector('.aside');
                        if (currentAside) {
                            currentAside.insertBefore(zlibContainer, currentAside.firstChild);

                            // 重新初始化按钮状态
                            const initialFormats = ['EPUB', 'PDF'];
                            checkSearchResults(isbn, initialFormats, 'isbn_search');
                            checkSearchResults(title, initialFormats, 'title_search');
                        }
                    }
                });
            });

            // 观察侧边栏的变化
            observer.observe(aside, {
                childList: true,
                subtree: true
            });

            // 获取其他元素引用
            Object.assign(elements, {
                isbnSearchBtn: document.getElementById('isbn_search'),
                titleSearchBtn: document.getElementById('title_search'),
                applyFormatBtn: document.getElementById('apply_format'),
                header: elements.searchDiv.querySelector('.format-select-header'),
                options: elements.searchDiv.querySelector('.format-select-options'),
                optionItems: elements.searchDiv.querySelectorAll('.format-option')
            });

            // 确保元素存在后再添加事件监听器
            if (elements.isbnSearchBtn && elements.titleSearchBtn) {
                // 添加事件监听器
                elements.isbnSearchBtn.addEventListener('click', function() {
                    if (this.style.cursor !== 'not-allowed') {
                        handleSearch(isbn);
                    }
                });

                elements.titleSearchBtn.addEventListener('click', function() {
                    if (this.style.cursor !== 'not-allowed') {
                        handleSearch(title);
                    }
                });

                // 初始检查
                updateHeaderText();
                const initialFormats = ['EPUB', 'PDF'];

                // 确保DOM完全加载后再检查搜索结果
                requestAnimationFrame(() => {
                    checkSearchResults(isbn, initialFormats, 'isbn_search');
                    checkSearchResults(title, initialFormats, 'title_search');
                });
            }

            // 下拉框交互
            if (elements.header && elements.options) {
                document.addEventListener('click', function(e) {
                    if (!e.target.closest('.format-select-container')) {
                        elements.options.classList.remove('show');
                    }
                });

                elements.header.addEventListener('click', function(e) {
                    elements.options.classList.toggle('show');
                    e.stopPropagation();
                });
            }

            // 选项点击事件
            if (elements.optionItems) {
                elements.optionItems.forEach(option => {
                    const checkbox = option.querySelector('input');
                    option.addEventListener('click', function(e) {
                        if (e.target !== checkbox) {
                            checkbox.checked = !checkbox.checked;
                        }
                        updateHeaderText();
                        option.classList.toggle('selected', checkbox.checked);
                    });
                });
            }

            // 应用按钮点击事件
            if (elements.applyFormatBtn) {
                elements.applyFormatBtn.addEventListener('click', function() {
                    const formats = getSelectedFormats();
                    checkSearchResults(isbn, formats, 'isbn_search');
                    checkSearchResults(title, formats, 'title_search');
                });
            }

            // 添加悬停效果
            const links = elements.searchDiv.getElementsByTagName('a');
            for (let link of links) {
                link.addEventListener('mouseover', function() {
                    if (this.style.cursor !== 'not-allowed') {
                        this.style.backgroundColor = '#3c9f4c';
                    }
                });
                link.addEventListener('mouseout', function() {
                    if (this.style.cursor !== 'not-allowed') {
                        this.style.backgroundColor = '#41ac52';
                    }
                });
            }

            // 禁用按钮直到找到可用域名
            elements.isbnSearchBtn.style.cursor = 'not-allowed';
            elements.titleSearchBtn.style.cursor = 'not-allowed';

            const domain = await getWorkingDomain();

            // 启用按钮
            elements.isbnSearchBtn.style.cursor = 'pointer';
            elements.titleSearchBtn.style.cursor = 'pointer';

        } catch (error) {
            console.error('豆瓣图书 Z-Library 搜索脚本运行出错:', error);
        }
    }

    // 确保在页面完全加载后再运行脚本
    if (document.readyState === 'complete') {
        initializeScript();
    } else {
        window.addEventListener('load', initializeScript);
    }
})();
