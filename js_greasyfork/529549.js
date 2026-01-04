// ==UserScript==
// @name         Google搜索增强工具箱
// @namespace    https://greasyfork.org/users/0
// @version      1
// @license      MIT
// @description  Google搜索增强：时间过滤/快速语法/网址直达/精确搜索
// @icon         https://www.google.com/favicon.ico
// @author       YourName
// @match        *://www.google.com/search*
// @match        *://www.google.com.hk/search*
// @match        *://www.google.co.jp/search*
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/529549/Google%E6%90%9C%E7%B4%A2%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/529549/Google%E6%90%9C%E7%B4%A2%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7%E7%AE%B1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 调试模式开关
    const DEBUG_MODE = false;
    const log = DEBUG_MODE ? console.log : function() {};

    /* ========== 样式注入 ========== */
    GM_addStyle(`
    #ge-toolbox {
        position: fixed;
        right: 20px;
        bottom: 20px; /* 调整到右下角 */
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.15);
        width: 280px;
        z-index: 2147483647;
        font-family: 'Segoe UI', Arial, sans-serif;
        padding: 15px;
        transition: opacity 0.3s;
        background-image: url('${GM_getValue('backgroundImage', 'https://images.pexels.com/photos/31042830/pexels-photo-31042830.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')}');
        background-size: cover;
        opacity: ${GM_getValue('backgroundOpacity', '1')};
    }
    .ge-section {
        margin: 12px 0;
        padding: 8px 0;
        border-bottom: 1px solid #eee;
    }
    .ge-title {
        color: #1a0dab;
        font-weight: 500;
        font-size: 15px;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        gap: 6px;
    }
    .ge-select {
        width: 100%;
        padding: 6px 8px;
        border: 1px solid #dfe1e5;
        border-radius: 4px;
        background: #fff;
        margin: 4px 0;
        font-size: 13px;
    }
    .ge-btn {
        background: #1a73e8;
        color: #fff;
        border: none;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 13px;
        margin-top: 8px;
    }
    .ge-chip {
        display: inline-block;
        background: #f8f9fa;
        border: 1px solid #dadce0;
        border-radius: 16px;
        padding: 4px 12px;
        margin: 3px;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s;
    }
    .ge-chip:hover {
        background: #e8f0fe;
        border-color: #d2e3fc;
    }
    #ge-quickurl, #ge-keyword {
        width: 100%;
        padding: 6px;
        border: 1px solid #dfe1e5;
        border-radius: 4px;
        margin: 8px 0;
        font-size: 13px;
    }
    #ge-bg-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        background: #f1f3f4;
        border: 1px solid #dadce0;
        border-radius: 4px;
        padding: 4px 8px;
        cursor: pointer;
        font-size: 12px;
    }
    `);

    /* ========== 核心功能 ========== */
    const initToolbox = () => {
        // 确保只注入一次
        if (document.getElementById('ge-toolbox')) return;

        const html = `
            <div class="ge-section">
                <div class="ge-title">⌛ 时间过滤</div>
                <select class="ge-select" id="ge-time">
                    <option value="">全部时间</option>
                    <option value="h_1">过去1小时</option>
                    <option value="d_1">过去24小时</option>
                    <option value="w_1">过去1周</option>
                    <option value="y_1">过去1年</option>
                    <option value="custom">自定义日期</option>
                </select>
            </div>

            <div class="ge-section">
                <div class="ge-title">🔍 搜索语法</div>
                <span class="ge-chip" data-cmd="site:">site:</span>
                <span class="ge-chip" data-cmd="filetype:">filetype:</span>
                <span class="ge-chip" data-cmd="inurl:">inurl:</span>
                <span class="ge-chip" data-cmd="intitle:">intitle:</span>
                <span class="ge-chip" data-cmd="-">排除(-)</span>
                <span class="ge-chip" data-cmd="imagesize:">imagesize:</span>
                <span class="ge-chip" data-cmd="location:">location:</span>
            </div>

            <div class="ge-section">
                <div class="ge-title">🔍 搜索范围</div>
                <select class="ge-select" id="ge-search-range">
                    <option value="">所有结果</option>
                    <option value="exact">精确搜索</option>
                </select>
            </div>

            <div class="ge-section">
                <div class="ge-title">🚀 快速访问</div>
                <input type="text" id="ge-quickurl" placeholder="输入网址 (支持域名)">
                <input type="text" id="ge-keyword" placeholder="输入关键字">
                <button class="ge-btn" id="ge-openurl">立即打开</button>
            </div>

            <button id="ge-bg-btn">背景设置</button>
        `;

        const div = document.createElement('div');
        div.id = 'ge-toolbox';
        div.innerHTML = html;
        document.body.appendChild(div);

        // 事件绑定
        document.getElementById('ge-time').addEventListener('change', handleTimeFilter);
        document.querySelectorAll('.ge-chip').forEach(chip => {
            chip.addEventListener('click', handleSearchSyntax);
        });
        document.getElementById('ge-search-range').addEventListener('change', handleSearchRange);
        document.getElementById('ge-openurl').addEventListener('click', handleQuickUrl);
        document.getElementById('ge-bg-btn').addEventListener('click', handleBgSettings);

        // 为关键字输入框添加回车键监听事件
        const keywordInput = document.getElementById('ge-keyword');
        keywordInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                handleKeywordSearch();
            }
        });

        // 为网址输入框添加回车键监听事件
        const urlInput = document.getElementById('ge-quickurl');
        urlInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                handleQuickUrl();
            }
        });
    };

    /* ========== 功能实现 ========== */
    // 时间过滤器
    const handleTimeFilter = (e) => {
        const tbsMap = {
            'h_1': 'qdr:h',
            'd_1': 'qdr:d',
            'w_1': 'qdr:w',
            'y_1': 'qdr:y',
            'custom': 'cdr:1'
        };

        const value = e.target.value;
        const url = new URL(window.location.href);

        if (value === 'custom') {
            const start = prompt('起始日期 (YYYY-MM-DD):', '');
            const end = prompt('结束日期 (YYYY-MM-DD):', '');
            if (start && end) {
                url.searchParams.set('tbs', `cdr:1,cd_min:${start},cd_max:${end}`);
            }
        } else if (value) {
            url.searchParams.set('tbs', tbsMap[value]);
        } else {
            url.searchParams.delete('tbs');
        }

        window.location.href = url.toString();
    };

    // 搜索语法助手
    const handleSearchSyntax = (e) => {
        const cmd = e.target.dataset.cmd;
        const searchInput = document.querySelector('textarea[name="q"], input[name="q"]');

        if (!searchInput) {
            alert('未找到搜索输入框！');
            return;
        }

        const param = prompt(`请输入 ${cmd} 参数：\n\nsite:example.com\nfiletype:pdf\ninurl:keyword\nintitle:keyword\n-imagesize:800x600\nlocation:city`, '');
        if (param) {
            searchInput.value = ` ${cmd}${param}`;
        }

        searchInput.focus();
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    };

    // 搜索范围助手
    const handleSearchRange = (e) => {
        const value = e.target.value;
        const searchInput = document.querySelector('textarea[name="q"], input[name="q"]');

        if (!searchInput) {
            alert('未找到搜索输入框！');
            return;
        }

        if (value === 'exact') {
            searchInput.value = `"${searchInput.value.trim()}"`;
        }

        searchInput.focus();
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    };

    // 快速网址访问
    const handleQuickUrl = () => {
        const urlInput = document.getElementById('ge-quickurl');
        let url = urlInput.value.trim();

        if (url) {
            // URL格式化
            if (!/^https?:\/\//i.test(url)) {
                url = url.startsWith('//') ? `https:${url}` : `https://${url}`;
            }

            try {
                new URL(url); // 验证URL有效性
                GM_openInTab(url, { active: false });
                urlInput.value = '';
            } catch (e) {
                alert('无效的网址格式！');
            }
        }
    };

    // 关键字搜索
    const handleKeywordSearch = () => {
        const keywordInput = document.getElementById('ge-keyword');
        let keyword = keywordInput.value.trim(); // 获取关键字

        if (keyword) {
            const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(keyword)}`;
            GM_openInTab(searchUrl, { active: false });
            keywordInput.value = '';
        }
    };

    // 背景设置
    const handleBgSettings = () => {
        const opacity = prompt('请输入背景透明度 (0-1):', GM_getValue('backgroundOpacity', '1'));
        const imageUrl = prompt('请输入背景图片URL:', GM_getValue('backgroundImage', 'https://images.pexels.com/photos/31042830/pexels-photo-31042830.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'));

        if (opacity) GM_setValue('backgroundOpacity', opacity);
        if (imageUrl) GM_setValue('backgroundImage', imageUrl);

        const toolbox = document.getElementById('ge-toolbox');
        toolbox.style.opacity = opacity;
        toolbox.style.backgroundImage = `url(${imageUrl})`;
    };

    /* ========== 初始化 ========== */
    const waitForPageLoad = () => {
        // 确保搜索框存在
        if (document.querySelector('input[name="q"], textarea[name="q"]')) {
            initToolbox();
            log('[Google增强工具箱] 初始化成功');
        } else {
            setTimeout(waitForPageLoad, 500);
        }
    };

    // 启动入口
    if (document.readyState === 'complete') {
        waitForPageLoad();
    } else {
        window.addEventListener('load', waitForPageLoad);
    }

})();