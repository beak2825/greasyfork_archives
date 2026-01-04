// ==UserScript==
// @name         微信读书网页版工具箱
// @version      2.2
// @namespace    http://tampermonkey.net/
// @description  修复样式错乱，保持原生风格
// @contributor  Li_MIxdown;hubzy;xvusrmqj;LossJ;JackieZheng;das2m;harmonyLife
// @author       M3
// @match        https://weread.qq.com/web/reader/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.3.1/dist/jquery.min.js
// @icon         https://weread.qq.com/favicon.ico
// @grant        GM_log
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/544711/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E7%BD%91%E9%A1%B5%E7%89%88%E5%B7%A5%E5%85%B7%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/544711/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E7%BD%91%E9%A1%B5%E7%89%88%E5%B7%A5%E5%85%B7%E7%AE%B1.meta.js
// ==/UserScript==

// 样式设置（贴合微信读书原生风格，修复换行和压字）
GM_addStyle(`
    /* 按钮基础样式（模仿原生控制栏） */
    .wr-toolkit-btn {
        position: relative;
        color: #6a6c6c;
        cursor: pointer;
        border: none;
        background: transparent;
        font-size: 14px;
        padding: 0 12px;
        min-width: 78px; /* 增加最小宽度避免换行 */
        height: 34px;
        margin: 0 2px;
        overflow: hidden;
        white-space: nowrap; /* 禁止文字换行 */
    }

    /* 数值显示与加减号容器（优化布局） */
    .wr-toolkit .value-display {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: opacity 0.3s ease;
    }

    .wr-toolkit .plus-minus-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .wr-toolkit .minus-btn, .wr-toolkit .plus-btn {
        width: 50%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(106, 108, 108, 0.1);
        user-select: none;
    }

    /* 悬停效果（贴合原生） */
    .wr-toolkit .adjustable-btn:hover .value-display {opacity: 0;}
    .wr-toolkit .adjustable-btn:hover .plus-minus-container {opacity: 1;}
    .wr-toolkit-btn:hover {
        background-color: rgba(0, 0, 0, 0.05);
        border-radius: 4px;
    }

    /* 状态样式（弱化突出，保持协调） */
    .wr-toolkit .auto-chapter-active {color: #3674ff;}
    .wr-toolkit .scroll-paused {color: #ff4d4f;}

    /* 提示框（优化位置和样式） */
    #copyNotification, #scrollStatus {
        position: fixed;
        padding: 6px 12px;
        border-radius: 4px;
        color: white;
        font-size: 13px;
        z-index: 999999;
        background: rgba(0, 0, 0, 0.7);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }
    #copyNotification {
        top: 20px;
        right: 20px; /* 右上角显示，不遮挡内容 */
        transform: none;
        display: none;
    }
    #scrollStatus {
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    #scrollStatus.visible {opacity: 1;}

    /* 修复控制栏布局 */
    .readerControls {
        display: flex !important;
        align-items: center !important;
        gap: 4px; /* 按钮间距 */
        flex-wrap: nowrap !important; /* 禁止控制栏换行 */
    }
`);

// 主程序
if (typeof $ === 'undefined') {
    alert("jQuery加载失败，脚本无法运行");
} else {
    $(window).on('load', async function () {
        'use strict';

        // 状态管理
        const state = {
            windowTop: 0,
            bottomTimer: null,
            userActionTimer: null,
            isAutoChapter: true,
            isArrowRightTriggered: false,
            scrollLevel: 0,
            autoChapterDelay: 3000, // 统一的延迟时间（毫秒）
            isScrolling: false,
            isPaused: false,
            scrollAnimationId: null,
        };

        // 工具函数：等待目标元素出现
        async function waitForElement(selector, timeout = 15000) {
            const start = Date.now();
            while (Date.now() - start < timeout) {
                const elem = document.querySelector(selector);
                if (elem) return elem;
                await new Promise(resolve => setTimeout(resolve, 300));
            }
            throw new Error(`超时未找到元素: ${selector}`);
        }

        // 工具函数：安全初始化
        function safeInit(initFunc) {
            try {
                initFunc();
                GM_log(`✅ 初始化成功: ${initFunc.name}`);
            } catch (e) {
                GM_log(`❌ 初始化失败: ${initFunc.name}，错误: ${e.message}`);
            }
        }

        // 工具函数：创建控制按钮（优化文字长度）
        function createControlButton(options) {
            const { id, valueText, isAdjustable = false, tooltip = '' } = options;
            return `
                <button id="${id}" class="wr-toolkit-btn ${isAdjustable ? 'adjustable-btn' : ''}" title="${tooltip}">
                    <span class="value-display">${valueText}</span>
                    ${isAdjustable ? `
                        <div class="plus-minus-container">
                            <span class="minus-btn">-</span>
                            <span class="plus-btn">+</span>
                        </div>
                    ` : ''}
                </button>
            `;
        }

        // 初始化状态提示框
        function initStatusIndicator() {
            $("body").append(`
                <div id="scrollStatus" class="wr-toolkit">自动滚动中（空格暂停）</div>
                <div id="copyNotification">复制成功</div>
            `);
        }

        // 代码复制功能
        async function addCopyCodeButtons() {
            try {
                const preElement = await waitForElement("pre", 5000);
                if ($(".copy_code_btn").length === 0) {
                    $("pre").append(`
                        <button class="copy_code_btn" style="
                            position: absolute;
                            right: 5px;
                            top: 5px;
                            color: white;
                            background: rgba(0,0,0,0.5);
                            border: none;
                            width: 28px;
                            height: 28px;
                            border-radius: 4px;
                            cursor: pointer;
                            z-index: 999;
                        ">📋</button>
                    `);
                }
            } catch (e) {
                GM_log("未找到代码块，跳过复制按钮");
            }
        }

        // 页面宽度调整功能
        async function initWidthControl() {
            try {
                const controlsContainer = await waitForElement(".readerControls", 10000);
                const $controls = $(controlsContainer).addClass('wr-toolkit');

                const widthLevels = {1:600,2:700,3:800,4:900,5:1000,6:1100,7:1200,8:1300,9:1400,10:1500};
                let currentLevel = 5;

                // 缩短按钮文字避免换行
                const widthControlBtn = createControlButton({
                    id: 'widthControl',
                    valueText: `宽度-${currentLevel}`,
                    isAdjustable: true,
                    tooltip: `当前宽度: ${widthLevels[currentLevel]}px（±调整）`
                });
                $controls.append(widthControlBtn);

                function applyWidthLevel(level) {
                    const contentArea = document.querySelector(".readerContent .app_content");
                    const topBar = document.querySelector('.readerTopBar');
                    if (contentArea && topBar) {
                        const targetWidth = widthLevels[level];
                        contentArea.style['max-width'] = `${targetWidth}px`;
                        topBar.style['max-width'] = `${targetWidth}px`;
                        window.dispatchEvent(new Event('resize'));
                    }
                }

                $('#widthControl .minus-btn').click((e) => {
                    e.stopPropagation();
                    if (currentLevel > 1) {
                        currentLevel--;
                        $('#widthControl .value-display').text(`宽度-${currentLevel}`);
                        applyWidthLevel(currentLevel);
                    }
                });
                $('#widthControl .plus-btn').click((e) => {
                    e.stopPropagation();
                    if (currentLevel < 10) {
                        currentLevel++;
                        $('#widthControl .value-display').text(`宽度-${currentLevel}`);
                        applyWidthLevel(currentLevel);
                    }
                });
            } catch (e) {
                throw new Error(`宽度控制：${e.message}`);
            }
        }

        // 模拟按下右箭头键
        function pressRightArrow() {
            state.isArrowRightTriggered = true;
            const event = new KeyboardEvent('keydown', {
                key: 'ArrowRight', keyCode: 39, code: 'ArrowRight', bubbles: true, cancelable: true
            });
            document.dispatchEvent(event);
        }

        // 滚动控制功能
        async function initScrollControl() {
            try {
                const controlsContainer = await waitForElement(".readerControls", 10000);
                const $controls = $(controlsContainer).addClass('wr-toolkit');
                const baseSpeed = 0.3;

                // 速度控制按钮（缩短文字）
                const speedControlBtn = createControlButton({
                    id: 'speedControl',
                    valueText: `速度-${state.scrollLevel}`,
                    isAdjustable: true,
                    tooltip: `滚动速度（±调整，快捷键：-减速/=加速）`
                });
                $controls.append(speedControlBtn);

                // 自动/手动翻章按钮
                const chapterModeBtn = createControlButton({
                    id: 'chapterModeBtn',
                    valueText: '自动翻章',
                    tooltip: '切换自动/手动翻章'
                });
                $controls.append(chapterModeBtn);
                $('#chapterModeBtn').addClass('auto-chapter-active');

                // 延迟配置按钮（缩短文字）
                const delayControlBtn = createControlButton({
                    id: 'delayControl',
                    valueText: `延迟-${state.autoChapterDelay / 1000}s`,
                    isAdjustable: true,
                    tooltip: '翻页延迟（1-5秒，作用于页尾停留和新章开始前）'
                });
                $controls.append(delayControlBtn);

                // 显示状态提示
                function showStatus(text, duration = 2000) {
                    const $status = $('#scrollStatus');
                    $status.text(text).addClass('visible');
                    setTimeout(() => $status.removeClass('visible'), duration);
                }

                // 启动滚动
                function startScroll() {
                    if (state.scrollLevel === 0 || state.isPaused || state.isScrolling) return;
                    state.isScrolling = true;
                    $('#speedControl').removeClass('scroll-paused');
                    showStatus('自动滚动中（空格暂停，-减速/=加速）');

                    function scrollAnimation() {
                        if (!state.isScrolling || state.isPaused) return;
                        const distance = state.scrollLevel * baseSpeed;
                        const scrollTop = document.documentElement.scrollTop;
                        const scrollHeight = document.body.scrollHeight;
                        const clientHeight = document.documentElement.clientHeight;

                        if (scrollTop + clientHeight >= scrollHeight - 10) {
                            stopScroll(true);
                            return;
                        }
                        window.scrollBy(0, distance);
                        state.scrollAnimationId = requestAnimationFrame(scrollAnimation);
                    }
                    state.scrollAnimationId = requestAnimationFrame(scrollAnimation);
                }

                // 停止滚动
                function stopScroll(isBottom = false) {
                    if (!state.isScrolling) return;
                    state.isScrolling = false;
                    if (state.scrollAnimationId) {
                        cancelAnimationFrame(state.scrollAnimationId);
                        state.scrollAnimationId = null;
                    }
                    if (isBottom && state.isAutoChapter) {
                        clearTimeout(state.bottomTimer);
                        // 页尾停留时间使用统一延迟
                        state.bottomTimer = setTimeout(pressRightArrow, state.autoChapterDelay);
                        showStatus(`已到达页尾，${state.autoChapterDelay/1000}秒后自动翻章...`, state.autoChapterDelay);
                    }
                }

                // 用户操作后暂停
                function pauseForUserAction() {
                    if (!state.isScrolling) return;
                    stopScroll();
                    showStatus('手动操作中，暂停滚动...');
                    clearTimeout(state.userActionTimer);
                    state.userActionTimer = setTimeout(() => {
                        if (state.scrollLevel > 0 && !state.isPaused) startScroll();
                    }, 2000);
                }

                // 空格键暂停/恢复
                function togglePauseBySpace(e) {
                    if (e.key !== ' ' && e.keyCode !== 32) return;
                    e.preventDefault();
                    state.isPaused = !state.isPaused;
                    if (state.isPaused) {
                        stopScroll();
                        $('#speedControl').addClass('scroll-paused');
                        showStatus('已暂停（空格恢复，-减速/=加速）', 3000);
                    } else if (state.scrollLevel > 0) {
                        startScroll();
                    }
                }

                // 绑定事件
                $('#speedControl .minus-btn').click((e) => {
                    e.stopPropagation();
                    if (state.scrollLevel > 0) {
                        state.scrollLevel--;
                        $('#speedControl .value-display').text(`速度-${state.scrollLevel}`);
                        if (state.scrollLevel === 0) stopScroll();
                        else if (!state.isPaused) startScroll();
                    }
                });
                $('#speedControl .plus-btn').click((e) => {
                    e.stopPropagation();
                    if (state.scrollLevel < 10) {
                        state.scrollLevel++;
                        $('#speedControl .value-display').text(`速度-${state.scrollLevel}`);
                        if (!state.isPaused) startScroll();
                    }
                });

                $('#chapterModeBtn').click(() => {
                    state.isAutoChapter = !state.isAutoChapter;
                    const text = state.isAutoChapter ? '自动翻章' : '手动翻章';
                    $('#chapterModeBtn .value-display').text(text);
                    state.isAutoChapter ? $('#chapterModeBtn').addClass('auto-chapter-active') : $('#chapterModeBtn').removeClass('auto-chapter-active');
                });

                $('#delayControl .minus-btn').click((e) => {
                    e.stopPropagation();
                    if (state.autoChapterDelay > 1000) {
                        state.autoChapterDelay -= 1000;
                        $('#delayControl .value-display').text(`延迟-${state.autoChapterDelay / 1000}s`);
                    }
                });
                $('#delayControl .plus-btn').click((e) => {
                    e.stopPropagation();
                    if (state.autoChapterDelay < 5000) {
                        state.autoChapterDelay += 1000;
                        $('#delayControl .value-display').text(`延迟-${state.autoChapterDelay / 1000}s`);
                    }
                });

                // 快捷键事件（-减速，=加速）
                $(document).on('keydown', function(e) {
                    // 排除输入框、文本区域等可编辑场景
                    if (['INPUT', 'TEXTAREA'].includes(e.target.tagName) || e.target.isContentEditable) {
                        return;
                    }

                    // -键减速（同时支持小键盘的减号）
                    if (e.key === '-' || e.key === 'Subtract') {
                        e.preventDefault();
                        e.stopPropagation();
                        if (state.scrollLevel > 0) {
                            state.scrollLevel--;
                            $('#speedControl .value-display').text(`速度-${state.scrollLevel}`);
                            if (state.scrollLevel === 0) {
                                stopScroll();
                                showStatus('已停止滚动（=键加速）', 2000);
                            } else if (!state.isPaused) {
                                startScroll();
                            }
                        }
                    }

                    // =键加速（同时支持小键盘的加号）
                    if (e.key === '=' || e.key === 'Add') {
                        e.preventDefault();
                        e.stopPropagation();
                        if (state.scrollLevel < 10) {
                            state.scrollLevel++;
                            $('#speedControl .value-display').text(`速度-${state.scrollLevel}`);
                            if (!state.isPaused) {
                                startScroll();
                            }
                        }
                    }
                });

                // 原有其他事件绑定
                $(document)
                    .on('keydown', (e) => {
                        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') pauseForUserAction();
                    })
                    .on('wheel', () => pauseForUserAction())
                    .on('keydown', togglePauseBySpace)
                    .on("click", "button[title='下一章'], .chapterItem", () => {
                        clearTimeout(state.bottomTimer);
                        // 新章节开始前的延迟使用统一设置
                        showStatus(`新章节加载中，${state.autoChapterDelay/1000}秒后开始滚动...`, state.autoChapterDelay);
                        setTimeout(() => {
                            if (state.scrollLevel > 0 && !state.isPaused) startScroll();
                        }, state.autoChapterDelay); // 关键修改：使用统一延迟
                        addCopyCodeButtons();
                    })
                    .on("keydown", (e) => {
                        if (e.key === "ArrowRight") {
                            state.isArrowRightTriggered = true;
                            // 右箭头翻章后延迟使用统一设置
                            showStatus(`新章节加载中，${state.autoChapterDelay/1000}秒后开始滚动...`, state.autoChapterDelay);
                            setTimeout(() => startScroll(), state.autoChapterDelay); // 关键修改：使用统一延迟
                        }
                    });
            } catch (e) {
                throw new Error(`滚动控制：${e.message}`);
            }
        }

        // 控制栏显隐控制（简化功能，保持原生布局）
        async function initControlBarToggle() {
            try {
                const controlsContainer = await waitForElement(".readerControls", 10000);
                const $controls = $(controlsContainer);

                // 保持原生控制栏显隐逻辑，不额外添加按钮占用空间
                $controls.css({
                    'transition': 'opacity 0.3s ease',
                    'opacity': '1'
                });
                // 鼠标离开时轻微淡化，不隐藏（避免误触）
                $controls.mouseleave(() => $controls.css('opacity', '0.7'));
                $controls.mouseenter(() => $controls.css('opacity', '1'));
            } catch (e) {
                throw new Error(`控制栏显隐：${e.message}`);
            }
        }

        // 头部导航栏滚动显隐
        function initHeaderScrollEffect() {
            $(window).scroll(() => {
                const scrollPos = $(this).scrollTop();
                const $topBar = $('.readerTopBar');
                if ($topBar.length) {
                    $topBar.css('opacity', scrollPos >= state.windowTop ? '0' : '1');
                    state.windowTop = scrollPos;
                }
            });
        }

        // 绑定复制事件
        function bindEvents() {
            $(document).on("click", ".copy_code_btn", function() {
                const codeText = $(this).closest('pre')[0].textContent.replace("📋", "").trim();
                GM_setClipboard(codeText);
                $("#copyNotification").fadeIn(200).fadeOut(1000);
            });
        }

        // 初始化所有功能
        async function initAllFeatures() {
            safeInit(initStatusIndicator);
            safeInit(addCopyCodeButtons);
            await safeInit(initWidthControl);
            await safeInit(initScrollControl);
            safeInit(initControlBarToggle);
            safeInit(initHeaderScrollEffect);
            safeInit(bindEvents);
        }

        // 启动
        initAllFeatures();
    });
}
