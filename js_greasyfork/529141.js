// ==UserScript==
// @name         微信读书（上下滚动模式）沉浸式阅读主题
// @version      1.2.32
// @description  上拉显示头部和侧栏，下拉隐藏，主题切换、侧边栏开关、页面宽度调整、账户信息显示
// @icon         https://i.miji.bid/2025/03/15/560664f99070e139e28703cf92975c73.jpeg
// @author       Grok
// @match        https://weread.qq.com/web/reader/*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @license      MIT
// @namespace    http://github.com/lossj
// @downloadURL https://update.greasyfork.org/scripts/529141/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%EF%BC%88%E4%B8%8A%E4%B8%8B%E6%BB%9A%E5%8A%A8%E6%A8%A1%E5%BC%8F%EF%BC%89%E6%B2%89%E6%B5%B8%E5%BC%8F%E9%98%85%E8%AF%BB%E4%B8%BB%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/529141/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%EF%BC%88%E4%B8%8A%E4%B8%8B%E6%BB%9A%E5%8A%A8%E6%A8%A1%E5%BC%8F%EF%BC%89%E6%B2%89%E6%B5%B8%E5%BC%8F%E9%98%85%E8%AF%BB%E4%B8%BB%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义主题对象
    const themes = {
        '淡灰': { background: '#E4E4E6', fontColor: '#333333' },
        '清绿': { background: '#DDE8DA', fontColor: '#333333' },
        '柔黄': { background: '#E7E6D4', fontColor: '#333333' },
        '暖棕': { background: '#ECE2D9', fontColor: '#333333' },
        '浅蓝': { background: '#DDE6EF', fontColor: '#333333' },
        '墨黑': { background: '#1A1E27', fontColor: '#C8C8C8' }
    };

    // 获取或设置存储值
    let currentTheme = GM_getValue('currentTheme', '清绿');
    let hideSidebarOnScrollDown = GM_getValue('hideSidebarOnScrollDown', false);
    let pageWidth = GM_getValue('pageWidth', 1200);

    // 创建样式元素
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    document.head.appendChild(styleSheet);

    // 函数：动态更新主题样式
    function updateThemeStyles() {
        const customStyle = `
            .readerContent, .app_content, .readerChapterContent {
                font-family: "霞鹜文楷", "PingFang SC", "宋体";
                font-size: 18px !important;
                color: ${themes[currentTheme].fontColor} !important;
                background-color: ${themes[currentTheme].background} !important;
                max-width: ${pageWidth}px !important;
                margin: 0 auto !important;
                padding: 20px !important;
            }

            .readerChapterContent p, .readerChapterContent div, .readerChapterContent span {
                font-family: inherit;
                font-size: inherit !important;
                color: inherit !important;
            }

            body, html {
                background-color: ${themes[currentTheme].background} !important;
            }

            .readerTopBar, .navBar {
                max-width: ${pageWidth}px !important;
                width: 100% !important;
                margin-left: auto !important;
                margin-right: auto !important;
                position: fixed !important;
                top: 4px !important;
                left: 50% !important;
                transform: translateX(-50%) !important;
                transition: transform 0.15s ease-out !important;
                z-index: 1000 !important;
                backdrop-filter: blur(10px) !important;
                -webkit-backdrop-filter: blur(10px) !important;
                background: rgba(255, 255, 255, 0.8) !important;
                box-shadow: 0 1px 10px rgba(0, 0, 0, 0.1) !important;
                border-radius: 12px !important;
            }

            .readerTopBar.hidden {
                transform: translateX(-50%) translateY(-115%) !important;
            }

            @media (min-width: 768px) {
                .readerTopBar, .navBar {
                    max-width: ${pageWidth}px !important;
                    left: 50% !important;
                    transform: translateX(-50%) !important;
                    padding: 5px 10px !important;
                }
            }

            .readerControls {
                position: fixed !important;
                right: 110px !important;
                bottom: 200px !important;
                left: auto !important;
                transition: opacity 0.3s ease !important;
                opacity: 1 !important;
                z-index: 3000 !important;
            }

            .readerCatalog {
                position: fixed !important;
                left: 50% !important;
                top: 50% !important;
                transform: translate(-50%, -50%) !important;
                right: auto !important;
                bottom: auto !important;
                z-index: 3000 !important;
                margin: 0 !important;
                width: 560px !important;
                max-height: 95vh !important;
                transition: opacity 0.3s ease !important;
                opacity: 1 !important;
                background-color: #fff !important;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2) !important;
                border-radius: 8px !important;
            }

            .readerControls.hidden, .readerCatalog.hidden {
                opacity: 0 !important;
            }

            /* 目录和笔记按钮的弹窗样式 */
            .readerNotePanel {
                position: fixed !important;
                left: 50% !important;
                top: 10px !important;
                transform: translateX(-50%) !important;
                z-index: 2000 !important;
                width: 560px !important;
                max-height: 95vh !important;
                background-color: #fff !important;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2) !important;
                border-radius: 8px !important;
                transition: opacity 0.3s ease !important;
                opacity: 1 !important;
            }

            .readerNotePanel.hidden {
                opacity: 0 !important;
            }

            /* 添加的选择工具栏样式 */
            .reader_toolbar_content,
            .reader_toolbar_itemContainer,
            .toolbarItem,
            .toolbarItem_text {
                font-family: "霞鹜文楷", "PingFang SC", "宋体" !important;
                font-size: 14px !important;
                color: #DADADB !important;
            }

            #themeToggleBtn, #sidebarToggleBtn, #widthAdjustBtn, #accountInfoBtn {
                position: fixed !important;
                right: 110px !important;
                width: 48px !important;
                height: 48px !important;
                background-color: #ffffff !important;
                color: #333 !important;
                border: none !important;
                border-radius: 50% !important;
                cursor: pointer !important;
                z-index: 4000 !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                font-size: 20px !important;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3) !important;
                transition: opacity 0.3s ease, background-color 0.3s ease !important;
                opacity: 1 !important;
            }

            /* 深色主题下按钮样式优化 */
            body[theme="墨黑"] #themeToggleBtn,
            body[theme="墨黑"] #sidebarToggleBtn,
            body[theme="墨黑"] #widthAdjustBtn,
            body[theme="墨黑"] #accountInfoBtn {
                background-color: #333333 !important;
                color: #E0E0E0 !important;
                box-shadow: 0 2px 5px rgba(255, 255, 255, 0.2) !important;
            }

            #accountInfoBtn { bottom: calc(834px) !important; }
            #themeToggleBtn { bottom: calc(766px) !important; }
            #sidebarToggleBtn { bottom: calc(698px) !important; }
            #widthAdjustBtn { bottom: calc(630px) !important; }

            #themeToggleBtn.hidden, #sidebarToggleBtn.hidden, #widthAdjustBtn.hidden, #accountInfoBtn.hidden {
                opacity: 0 !important;
            }

            #sidebarToggleBtn.active {
                background-color: #e0e0e0 !important;
            }

            body[theme="墨黑"] #sidebarToggleBtn.active {
                background-color: #555555 !important;
            }

            .themeDot {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                cursor: pointer;
                border: 2px solid #fff;
                box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
                position: relative;
            }

            .themeDot.active {
                border: 2px solid #000;
            }

            body[theme="墨黑"] .themeDot.active {
                border: 2px solid #E0E0E0 !important;
            }

            .themeDot::before {
                content: attr(title);
                position: absolute;
                top: -30px;
                left: 50%;
                transform: translateX(-50%);
                background-color: rgba(0, 0, 0, 0.8);
                color: #fff;
                padding: 3px 6px;
                border-radius: 4px;
                font-size: 12px;
                white-space: nowrap;
                visibility: hidden;
                opacity: 0;
                transition: opacity 0.2s ease;
                z-index: 2001;
            }

            .themeDot:hover::before {
                visibility: visible;
                opacity: 1;
            }

            #themePanel, #widthPanel, #accountPanel {
                position: fixed !important;
                background-color: rgba(255, 255, 255, 0.9) !important;
                padding: 10px !important;
                border-radius: 8px !important;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2) !important;
                z-index: 2000 !important;
                display: none !important;
                flex-direction: column !important;
                gap: 10px !important;
                max-width: 250px !important;
                backdrop-filter: blur(5px) !important;
                transition: opacity 0.3s ease, transform 0.3s ease, scale 0.3s ease !important;
                opacity: 0 !important;
                transform: translateX(20px) !important;
                scale: 0.8 !important;
            }

            body[theme="墨黑"] #themePanel,
            body[theme="墨黑"] #widthPanel,
            body[theme="墨黑"] #accountPanel {
                background-color: rgba(50, 50, 50, 0.9) !important;
                color: #E0E0E0 !important;
            }

            #themePanel.show, #widthPanel.show, #accountPanel.show {
                opacity: 1 !important;
                transform: translateX(0) !important;
                scale: 1 !important;
                display: flex !important;
            }

            .themeRow {
                display: flex;
                flex-direction: row;
                gap: 8px;
                flex-wrap: nowrap;
                justify-content: center;
            }

            #widthSlider {
                -webkit-appearance: none;
                appearance: none;
                width: 150px;
                height: 2px;
                background: linear-gradient(to right, #000 0%, #000 var(--progress, 0%), #D3D3D3 var(--progress, 0%) 100%);
                outline: none;
                border-radius: 1px;
                cursor: pointer;
            }

            body[theme="墨黑"] #widthSlider {
                background: linear-gradient(to right, #E0E0E0 0%, #E0E0E0 var(--progress, 0%), #555555 var(--progress, 0%) 100%) !important;
            }

            #widthSlider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 8px;
                height: 8px;
                background: #333;
                border-radius: 50%;
                cursor: pointer;
            }

            #widthSlider::-moz-range-thumb {
                width: 8px;
                height: 8px;
                background: #333;
                border-radius: 50%;
                cursor: pointer;
            }

            body[theme="墨黑"] #widthSlider::-webkit-slider-thumb,
            body[theme="墨黑"] #widthSlider::-moz-range-thumb {
                background: #E0E0E0 !important;
            }

            #widthLabel {
                font-size: 14px;
                color: #333;
            }

            body[theme="墨黑"] #widthLabel {
                color: #E0E0E0 !important;
            }

            #accountPanel .data-row {
                display: flex;
                justify-content: space-between;
                min-width: 100px;
            }

            #accountPanel .data-label {
                margin-right: 8px;
                color: #1A1A1A !important;
            }

            #accountPanel .data-value {
                font-weight: 500;
                color: #000000 !important;
            }

            body[theme="墨黑"] #accountPanel .data-label,
            body[theme="墨黑"] #accountPanel .data-value {
                color: #E0E0E0 !important;
            }

            @media (max-width: 768px) {
                #themePanel, #widthPanel, #accountPanel {
                    max-width: 200px;
                    padding: 5px;
                }
                #widthSlider {
                    width: 120px;
                }
                .themeDot {
                    width: 18px;
                    height: 18px;
                }
                .readerControls, #themeToggleBtn, #sidebarToggleBtn, #widthAdjustBtn, #accountInfoBtn {
                    right: 50px !important;
                }
                .readerCatalog {
                    width: 400px !important;
                }
            }
        `;
        styleSheet.innerText = customStyle;
        console.log('主题样式已更新，当前主题:', currentTheme);
    }

    // 初始化样式
    updateThemeStyles();

    // 设置主题属性
    document.body.setAttribute('theme', currentTheme);
    console.log('当前主题:', currentTheme);

    // 创建账户信息按钮和面板
    const accountInfoBtn = document.createElement('button');
    accountInfoBtn.id = 'accountInfoBtn';
    accountInfoBtn.innerText = '👤';
    document.body.appendChild(accountInfoBtn);
    console.log('账户信息按钮已创建');

    const accountPanel = document.createElement('div');
    accountPanel.id = 'accountPanel';
    accountPanel.innerHTML = `
        <div class="data-row">
            <span class="data-label">体验卡</span>
            <span class="data-value" id="infinite-card">--</span>
        </div>
        <div class="data-row">
            <span class="data-label">苹果书币</span>
            <span class="data-value" id="ios-coin">--</span>
        </div>
        <div class="data-row">
            <span class="data-label">安卓书币</span>
            <span class="data-value" id="android-coin">--</span>
        </div>
    `;
    document.body.appendChild(accountPanel);

    accountInfoBtn.addEventListener('click', () => {
        const isHidden = accountPanel.style.display === 'none' || accountPanel.style.display === '';
        console.log('账户面板点击，当前隐藏状态:', isHidden);
        if (isHidden) {
            accountPanel.style.display = 'flex';
            setTimeout(() => accountPanel.classList.add('show'), 10);
            const btnRect = accountInfoBtn.getBoundingClientRect();
            accountPanel.style.right = `${document.documentElement.clientWidth - btnRect.left + 10}px`;
            accountPanel.style.top = `${btnRect.top}px`;
            console.log('账户面板定位:', {
                right: accountPanel.style.right,
                top: accountPanel.style.top
            });
        } else {
            accountPanel.classList.remove('show');
            setTimeout(() => accountPanel.style.display = 'none', 300);
        }
    });

    // 创建主题切换按钮和面板
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'themeToggleBtn';
    toggleBtn.innerText = '🎨';
    document.body.appendChild(toggleBtn);
    console.log('主题切换按钮已创建');

    const themePanel = document.createElement('div');
    themePanel.id = 'themePanel';
    document.body.appendChild(themePanel);

    // 所有主题
    const allThemes = ['淡灰','清绿','柔黄','暖棕','浅蓝','墨黑'];

    const themeRow = document.createElement('div');
    themeRow.className = 'themeRow';

    // 单行显示所有主题
    allThemes.forEach(theme => {
        const dot = document.createElement('div');
        dot.className = 'themeDot';
        dot.style.backgroundColor = themes[theme].background;
        dot.setAttribute('title', theme);
        if (theme === currentTheme) dot.classList.add('active');
        dot.addEventListener('click', () => {
            console.log('选择主题:', theme);
            currentTheme = theme; // 更新当前主题
            GM_setValue('currentTheme', theme);
            document.body.setAttribute('theme', theme);
            updateThemeStyles(); // 动态更新样式
            updateActiveDot(); // 更新主题点的选中状态
            themePanel.classList.remove('show');
            setTimeout(() => themePanel.style.display = 'none', 300);
        });
        themeRow.appendChild(dot);
    });

    themePanel.appendChild(themeRow);

    toggleBtn.addEventListener('click', () => {
        const isHidden = themePanel.style.display === 'none' || themePanel.style.display === '';
        console.log('主题面板点击，当前隐藏状态:', isHidden);
        if (isHidden) {
            themePanel.style.display = 'flex';
            setTimeout(() => themePanel.classList.add('show'), 10);
            const btnRect = toggleBtn.getBoundingClientRect();
            themePanel.style.right = `${document.documentElement.clientWidth - btnRect.left + 10}px`;
            themePanel.style.top = `${btnRect.top}px`;
            console.log('主题面板定位:', {
                right: themePanel.style.right,
                top: themePanel.style.top
            });
        } else {
            themePanel.classList.remove('show');
            setTimeout(() => themePanel.style.display = 'none', 300);
        }
    });

    function updateActiveDot() {
        document.querySelectorAll('.themeDot').forEach(dot => {
            dot.classList.remove('active');
            if (dot.style.backgroundColor === themes[currentTheme].background) {
                dot.classList.add('active');
            }
        });
    }

    // 创建侧边栏开关按钮
    const sidebarToggleBtn = document.createElement('button');
    sidebarToggleBtn.id = 'sidebarToggleBtn';
    sidebarToggleBtn.innerText = hideSidebarOnScrollDown ? '🙈' : '👁️';
    if (hideSidebarOnScrollDown) sidebarToggleBtn.classList.add('active');
    document.body.appendChild(sidebarToggleBtn);
    console.log('侧边栏开关按钮已创建');

    sidebarToggleBtn.addEventListener('click', () => {
        hideSidebarOnScrollDown = !hideSidebarOnScrollDown;
        GM_setValue('hideSidebarOnScrollDown', hideSidebarOnScrollDown);
        sidebarToggleBtn.innerText = hideSidebarOnScrollDown ? '🙈' : '👁️';
        sidebarToggleBtn.classList.toggle('active');
        console.log('侧边栏开关状态:', hideSidebarOnScrollDown);
    });

    // 创建页面宽度调整按钮和面板
    const widthAdjustBtn = document.createElement('button');
    widthAdjustBtn.id = 'widthAdjustBtn';
    widthAdjustBtn.innerText = '📏';
    document.body.appendChild(widthAdjustBtn);
    console.log('页面宽度调整按钮已创建');

    const widthPanel = document.createElement('div');
    widthPanel.id = 'widthPanel';
    document.body.appendChild(widthPanel);

    const widthSlider = document.createElement('input');
    widthSlider.type = 'range';
    widthSlider.id = 'widthSlider';
    widthSlider.min = '600';
    widthSlider.max = '1800';
    widthSlider.step = '10';
    widthSlider.value = pageWidth;
    widthPanel.appendChild(widthSlider);

    const widthLabel = document.createElement('span');
    widthLabel.id = 'widthLabel';
    widthLabel.innerText = `${pageWidth}px`;
    widthPanel.appendChild(widthLabel);

    function updateProgress() {
        const slider = document.getElementById('widthSlider');
        const value = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
        slider.style.setProperty('--progress', `${value}%`);
    }

    widthAdjustBtn.addEventListener('click', () => {
        const isHidden = widthPanel.style.display === 'none' || widthPanel.style.display === '';
        console.log('宽度面板点击，当前隐藏状态:', isHidden);
        if (isHidden) {
            widthPanel.style.display = 'flex';
            setTimeout(() => widthPanel.classList.add('show'), 10);
            const btnRect = widthAdjustBtn.getBoundingClientRect();
            widthPanel.style.right = `${document.documentElement.clientWidth - btnRect.left + 10}px`;
            widthPanel.style.top = `${btnRect.top}px`;
            console.log('宽度面板定位:', {
                right: widthPanel.style.right,
                top: widthPanel.style.top
            });
        } else {
            widthPanel.classList.remove('show');
            setTimeout(() => widthPanel.style.display = 'none', 300);
        }
    });

    widthSlider.addEventListener('input', () => {
        pageWidth = parseInt(widthSlider.value);
        GM_setValue('pageWidth', pageWidth);
        widthLabel.innerText = `${pageWidth}px`;
        updateProgress();
        console.log('页面宽度调整为:', pageWidth);
        updateThemeStyles(); // 动态更新样式以应用新宽度
    });

    updateProgress();

    // 获取账户数据
    const fetchAccountData = () => {
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://weread.qq.com/web/pay/balance',
            data: 'zoneid=1&release=1&pf=weread_wx-2001-iap-2001-iphone',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            onload: function(res) {
                try {
                    const data = JSON.parse(res.responseText);
                    const infiniteDays = Math.floor(data.welfare.expiredTime / 86400);
                    document.getElementById('infinite-card').textContent = `${infiniteDays}天`;
                    document.getElementById('ios-coin').textContent = data.giftBalance;
                    document.getElementById('android-coin').textContent = data.peerBalance;
                    console.log('账户数据获取成功:', data);
                } catch(e) {
                    console.error('账户数据解析失败:', e);
                }
            }
        });
    };

    // 初始化并定时更新账户数据
    fetchAccountData();
    setInterval(fetchAccountData, 300000);

// 沉浸式阅读功能
let windowTop = 0;
$(window).scroll(function() {
    let scrollS = $(window).scrollTop();
    let topBar = document.querySelector('.readerTopBar');
    let readerControl = document.querySelector('.readerControls');
    let readerCatalog = document.querySelector('.readerCatalog');
    let readerNotePanel = document.querySelector('.readerNotePanel');
    let accountBtn = document.querySelector('#accountInfoBtn');
    let themeBtn = document.querySelector('#themeToggleBtn');
    let sidebarBtn = document.querySelector('#sidebarToggleBtn');
    let widthBtn = document.querySelector('#widthAdjustBtn');
    let accountPanelElement = document.querySelector('#accountPanel');
    let themePanelElement = document.querySelector('#themePanel');
    let widthPanelElement = document.querySelector('#widthPanel');

    console.log('滚动位置:', scrollS, 'hideSidebarOnScrollDown:', hideSidebarOnScrollDown);

    if (scrollS > windowTop && scrollS > 50 && hideSidebarOnScrollDown) {
        if (topBar) topBar.classList.add('hidden');
        if (readerControl) readerControl.classList.add('hidden');
        if (readerCatalog) readerCatalog.classList.add('hidden');
        if (readerNotePanel) readerNotePanel.classList.add('hidden');
        if (accountBtn) accountBtn.classList.add('hidden');
        if (themeBtn) themeBtn.classList.add('hidden');
        if (sidebarBtn) sidebarBtn.classList.add('hidden');
        if (widthBtn) widthBtn.classList.add('hidden');
        // 隐藏弹窗面板
        if (accountPanelElement) {
            accountPanelElement.classList.remove('show');
            setTimeout(() => accountPanelElement.style.display = 'none', 300);
        }
        if (themePanelElement) {
            themePanelElement.classList.remove('show');
            setTimeout(() => themePanelElement.style.display = 'none', 300);
        }
        if (widthPanelElement) {
            widthPanelElement.classList.remove('show');
            setTimeout(() => widthPanelElement.style.display = 'none', 300);
        }
    } else {
        if (topBar) topBar.classList.remove('hidden');
        if (readerControl) readerControl.classList.remove('hidden');
        if (readerCatalog) readerCatalog.classList.remove('hidden');
        if (readerNotePanel) readerNotePanel.classList.remove('hidden');
        if (accountBtn) accountBtn.classList.remove('hidden');
        if (themeBtn) themeBtn.classList.remove('hidden');
        if (sidebarBtn) sidebarBtn.classList.remove('hidden');
        if (widthBtn) widthBtn.classList.remove('hidden');
    }
    windowTop = scrollS;
});

    // 初始化按钮可见性
    setTimeout(() => {
        document.querySelectorAll('#themeToggleBtn, #sidebarToggleBtn, #widthAdjustBtn, #accountInfoBtn').forEach(btn => {
            btn.classList.remove('hidden');
            console.log('初始化按钮:', btn.id, '可见');
        });
    }, 100);

    updateActiveDot();
})();