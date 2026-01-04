// ==UserScript==
// @name         Bilibili批量取消关注
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  一键批量取消哔哩哔哩关注(支持并发处理，自动循环处理所有页面，增强循环可靠性，可拖动面板，自动验证处理)
// @author       RrOrange
// @homepage     https://github.com/zhiyu1998/rrorange-tampermonkey-list
// @match        *://space.bilibili.com/*/relation/follow*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530598/Bilibili%E6%89%B9%E9%87%8F%E5%8F%96%E6%B6%88%E5%85%B3%E6%B3%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/530598/Bilibili%E6%89%B9%E9%87%8F%E5%8F%96%E6%B6%88%E5%85%B3%E6%B3%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 创建内嵌到B站界面的按钮
    function createInlineButton() {
        // 等待页面加载完成
        const checkExist = setInterval(function () {
            const titleContainer = document.querySelector('.follow-main-title');

            if (titleContainer && !document.getElementById('unfollow-batch-btn')) {
                clearInterval(checkExist);

                // 创建取消关注按钮
                const unfollowButton = document.createElement('button');
                unfollowButton.id = 'unfollow-batch-btn';
                unfollowButton.className = 'vui_button follow-main-title-batch';
                unfollowButton.textContent = '批量取关';
                unfollowButton.style.marginLeft = '10px';
                unfollowButton.style.backgroundColor = '#FB7299';
                unfollowButton.style.color = 'white';

                // 添加到页面中
                titleContainer.appendChild(unfollowButton);

                // 添加点击事件
                unfollowButton.addEventListener('click', function () {
                    showControlPanel();
                });

                console.log('取关按钮已添加到页面');
            }
        }, 500);
    }

    // 显示控制面板
    function showControlPanel() {
        // 检查是否已经存在面板
        if (document.getElementById('unfollow-panel')) {
            document.getElementById('unfollow-panel').style.display = 'block';
            return;
        }

        // 创建控制面板
        const panel = document.createElement('div');
        panel.id = 'unfollow-panel';
        panel.style.position = 'fixed';
        panel.style.top = '50%';
        panel.style.left = '50%';
        panel.style.transform = 'translate(-50%, -50%)';
        panel.style.backgroundColor = '#fff';
        panel.style.border = '2px solid #FB7299';
        panel.style.borderRadius = '8px';
        panel.style.padding = '20px';
        panel.style.zIndex = '999999';
        panel.style.boxShadow = '0 0 20px rgba(0,0,0,0.3)';
        panel.style.width = '350px';
        panel.style.fontFamily = 'Arial, sans-serif';
        panel.style.maxHeight = '90vh';
        panel.style.overflowY = 'auto';
        panel.style.cursor = 'default'; // 默认光标

        // 创建面板内容
        panel.innerHTML = `
            <div id="panel-header" style="margin: -20px -20px 15px -20px; padding: 10px 20px; cursor: move; background-color: #FB7299; color: white; border-radius: 6px 6px 0 0; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0; font-weight: bold;">批量取消关注</h3>
                <button id="close-panel" style="background: none; border: none; font-size: 18px; cursor: pointer; color: white;">×</button>
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-size: 14px;">每页处理数量:</label>
                <input id="unfollow-count" type="number" min="1" max="500" value="24" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
                <small style="color: #999; font-size: 12px;">建议设为页面显示的关注数(通常为24个)</small>
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-size: 14px;">并发数量:</label>
                <input id="concurrent-count" type="number" min="1" max="10" value="3" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
                <small style="color: #999; font-size: 12px;">同时处理的数量，建议2-3个</small>
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-size: 14px;">操作间隔(毫秒):</label>
                <input id="unfollow-delay" type="number" min="500" max="5000" value="1500" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
                <small style="color: #999; font-size: 12px;">值越大越不容易触发验证</small>
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-size: 14px;">验证处理:</label>
                <input id="phone-number" type="text" placeholder="预设手机号(用于自动填充验证)" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
                <small style="color: #999; font-size: 12px;">遇到验证时自动填入(不会保存)</small>
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-size: 14px;">自动翻页:</label>
                <div style="display: flex; align-items: center;">
                    <input id="auto-paging" type="checkbox" checked style="margin-right: 8px;">
                    <label for="auto-paging">处理完当前页后自动进入下一页</label>
                </div>
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-size: 14px;">页面处理:</label>
                <div style="display: flex; justify-content: space-between; gap: 10px;">
                    <input id="page-start" type="number" min="1" value="1" placeholder="起始页" style="width: 30%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
                    <span style="line-height: 36px;">到</span>
                    <input id="page-end" type="number" min="1" placeholder="结束页(留空表示全部)" style="width: 50%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
                </div>
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-size: 14px;">异常处理:</label>
                <div style="display: flex; align-items: center;">
                    <input id="auto-retry" type="checkbox" checked style="margin-right: 8px;">
                    <label for="auto-retry">遇到错误时自动重试</label>
                </div>
                <div style="display: flex; align-items: center; margin-top: 5px;">
                    <input id="pause-on-verification" type="checkbox" checked style="margin-right: 8px;">
                    <label for="pause-on-verification">遇到验证码时暂停等待处理</label>
                </div>
            </div>
            
            <button id="start-unfollow" style="background-color: #FB7299; color: white; border: none; border-radius: 4px; padding: 10px; cursor: pointer; width: 100%; font-size: 16px; font-weight: bold;">开始取关</button>
            
            <div id="unfollow-status" style="margin-top: 15px; padding: 10px; background-color: #f8f8f8; border-radius: 4px; font-size: 14px; min-height: 60px; max-height: 200px; overflow-y: auto;">
                准备就绪，请设置参数并点击开始
            </div>
        `;

        // 添加到页面
        document.body.appendChild(panel);

        // 实现拖动功能
        makeDraggable(panel);

        // 添加事件监听
        document.getElementById('start-unfollow').addEventListener('click', function () {
            // 获取设置参数
            const maxUnfollows = parseInt(document.getElementById('unfollow-count').value, 10);
            const concurrentCount = parseInt(document.getElementById('concurrent-count').value, 10);
            const delay = parseInt(document.getElementById('unfollow-delay').value, 10);
            const phoneNumber = document.getElementById('phone-number').value;
            const autoPaging = document.getElementById('auto-paging').checked;
            const autoRetry = document.getElementById('auto-retry').checked;
            const pauseOnVerification = document.getElementById('pause-on-verification').checked;
            const pageStart = parseInt(document.getElementById('page-start').value, 10) || 1;
            const pageEndInput = document.getElementById('page-end').value;
            const pageEnd = pageEndInput ? parseInt(pageEndInput, 10) : null;

            const statusElement = document.getElementById('unfollow-status');

            if (isNaN(maxUnfollows) || isNaN(delay) || isNaN(concurrentCount) || isNaN(pageStart) || (pageEndInput && isNaN(pageEnd))) {
                statusElement.innerHTML = '<span style="color: #f56c6c;">⚠️ 请输入有效的数字</span>';
                return;
            }

            // 获取当前页码和总页数
            const currentPage = getCurrentPage();
            const totalPages = getTotalPages();

            if (currentPage !== pageStart) {
                statusElement.innerHTML = `<span style="color: #e6a23c;">⚠️ 当前页面(${currentPage})与起始页(${pageStart})不符，将跳转到起始页</span>`;
                // 跳转到起始页
                navigateToPage(pageStart);
                return;
            }

            // 禁用按钮，防止重复点击
            document.getElementById('start-unfollow').disabled = true;
            document.getElementById('start-unfollow').style.backgroundColor = '#ccc';
            document.getElementById('start-unfollow').textContent = '处理中...';

            // 开始批量处理
            startAutoUnfollow(maxUnfollows, concurrentCount, delay, phoneNumber, autoPaging, autoRetry, pauseOnVerification, pageStart, pageEnd, statusElement);
        });

        // 关闭按钮
        document.getElementById('close-panel').addEventListener('click', function () {
            panel.style.display = 'none';
        });

        console.log('取关控制面板已创建');
    }

    // 使元素可拖动
    function makeDraggable(element) {
        const header = document.getElementById('panel-header');
        if (!header) return;

        let isDragging = false;
        let offsetX, offsetY;

        // 移除初始的居中定位，以便拖动
        function prepareForDragging() {
            // 保存当前位置
            const rect = element.getBoundingClientRect();
            // 移除transform属性，改为使用top和left绝对定位
            element.style.transform = 'none';
            element.style.top = rect.top + 'px';
            element.style.left = rect.left + 'px';
        }

        // 鼠标按下事件
        header.addEventListener('mousedown', function (e) {
            // 如果点击的是关闭按钮，不触发拖动
            if (e.target.id === 'close-panel') return;

            prepareForDragging();
            isDragging = true;

            // 计算鼠标在元素内的偏移量
            const rect = element.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;

            // 添加拖动样式
            header.style.cursor = 'grabbing';
        });

        // 鼠标移动事件
        document.addEventListener('mousemove', function (e) {
            if (!isDragging) return;

            // 计算新位置
            const newLeft = e.clientX - offsetX;
            const newTop = e.clientY - offsetY;

            // 设置新位置
            element.style.left = newLeft + 'px';
            element.style.top = newTop + 'px';
        });

        // 鼠标释放事件
        document.addEventListener('mouseup', function () {
            if (isDragging) {
                isDragging = false;
                header.style.cursor = 'move';
            }
        });

        // 防止拖动时选中文本
        header.addEventListener('selectstart', function (e) {
            e.preventDefault();
        });
    }

    // 获取当前页码
    function getCurrentPage() {
        try {
            const activePageBtn = document.querySelector('.vui_button--active-blue.vui_pagenation--btn-num');
            if (activePageBtn) {
                return parseInt(activePageBtn.textContent, 10);
            }
        } catch (e) {
            console.error('获取当前页码失败:', e);
        }
        return 1; // 默认为第一页
    }

    // 获取总页数
    function getTotalPages() {
        try {
            const pageCountText = document.querySelector('.vui_pagenation-go__count');
            if (pageCountText) {
                const match = pageCountText.textContent.match(/共\s+(\d+)\s+页/);
                if (match && match[1]) {
                    return parseInt(match[1], 10);
                }
            }

            // 尝试获取最后一个页码按钮
            const pageButtons = document.querySelectorAll('.vui_pagenation--btn-num');
            if (pageButtons && pageButtons.length > 0) {
                const lastPageBtn = pageButtons[pageButtons.length - 1];
                return parseInt(lastPageBtn.textContent, 10);
            }
        } catch (e) {
            console.error('获取总页数失败:', e);
        }

        return 999; // 默认一个大数，确保能继续运行
    }

    // 跳转到指定页面
    function navigateToPage(pageNum) {
        try {
            console.log(`尝试跳转到第 ${pageNum} 页`);

            // 尝试找到页码按钮
            const pageButtons = document.querySelectorAll('.vui_pagenation--btn-num');
            for (const btn of pageButtons) {
                if (parseInt(btn.textContent, 10) === pageNum) {
                    console.log(`找到页码按钮 ${pageNum}，点击`);
                    btn.click();
                    return true;
                }
            }

            // 如果找不到按钮，尝试使用输入框跳转
            const pageInput = document.querySelector('.vui_pagenation-go .vui_input__input');
            if (pageInput) {
                console.log(`使用页码输入框跳转到 ${pageNum}`);
                pageInput.value = pageNum;

                // 触发输入事件
                pageInput.dispatchEvent(new Event('input', { bubbles: true }));

                // 模拟回车键
                const event = new KeyboardEvent('keydown', {
                    'key': 'Enter',
                    'code': 'Enter',
                    'keyCode': 13,
                    'which': 13,
                    'bubbles': true
                });
                pageInput.dispatchEvent(event);
                return true;
            }

            // 尝试直接修改URL
            const currentUrl = window.location.href;
            const newUrl = currentUrl.replace(/page=\d+/, `page=${pageNum}`);
            if (currentUrl !== newUrl) {
                console.log(`通过修改URL跳转到 ${pageNum}`, newUrl);
                window.location.href = newUrl;
                return true;
            } else {
                // 添加page参数
                console.log(`通过添加page参数跳转到 ${pageNum}`);
                if (currentUrl.indexOf('?') > -1) {
                    window.location.href = `${currentUrl}&page=${pageNum}`;
                } else {
                    window.location.href = `${currentUrl}?page=${pageNum}`;
                }
                return true;
            }
        } catch (e) {
            console.error('页面跳转失败:', e);
            return false;
        }
    }

    // 点击下一页按钮
    function clickNextPage() {
        try {
            const nextPageBtn = document.querySelector('.vui_pagenation--btn-side:not(.vui_button--disabled):last-child');
            if (nextPageBtn && nextPageBtn.textContent.includes('下一页')) {
                nextPageBtn.click();
                return true;
            }
        } catch (e) {
            console.error('点击下一页失败:', e);
        }
        return false;
    }

    // 自动取关控制状态
    let autoUnfollowState = {
        running: false,
        currentPage: 1,
        endPage: null,
        itemsPerPage: 24,
        concurrentCount: 3,
        delay: 1500,
        phoneNumber: '',
        autoPaging: true,
        autoRetry: true,
        pauseOnVerification: true,
        statusElement: null,
        totalProcessed: 0,
        totalSuccess: 0,
        totalFailed: 0,
        totalRetries: 0,
        pageSuccess: 0,
        pageFailed: 0,
        inProgress: 0,
        paused: false,
        recentUsers: [],
        verifyTimeoutId: null,
        verificationStartTime: null,
        verificationCheckInterval: null,
        confirmButtonClicked: false,
        processedPages: {}, // 记录已处理过的页码
        startFromPage: 1,   // 记录初始起始页，用于循环处理
        fullPagesProcessed: false // 标记是否已完成全部页面处理
    };

    // 检测验证弹窗的MutationObserver
    let verificationObserver = null;

    // 启动自动取关流程
    function startAutoUnfollow(itemsPerPage, concurrentCount, delay, phoneNumber, autoPaging, autoRetry, pauseOnVerification, startPage, endPage, statusElement) {
        // 初始化状态
        autoUnfollowState = {
            running: true,
            currentPage: startPage,
            endPage: endPage,
            itemsPerPage: itemsPerPage,
            concurrentCount: concurrentCount,
            delay: delay,
            phoneNumber: phoneNumber,
            autoPaging: autoPaging,
            autoRetry: autoRetry,
            pauseOnVerification: pauseOnVerification,
            statusElement: statusElement,
            totalProcessed: 0,
            totalSuccess: 0,
            totalFailed: 0,
            totalRetries: 0,
            pageSuccess: 0,
            pageFailed: 0,
            inProgress: 0,
            paused: false,
            recentUsers: [],
            verifyTimeoutId: null,
            verificationStartTime: null,
            verificationCheckInterval: null,
            confirmButtonClicked: false,
            processedPages: {}, // 记录已处理过的页码
            startFromPage: startPage, // 记录初始起始页
            fullPagesProcessed: false // 标记是否已完成全部页面处理
        };

        // 记录初始页已处理
        autoUnfollowState.processedPages[startPage] = true;

        // 显示初始状态
        updateAutoUnfollowStatus();

        // 设置验证监听器
        setupVerificationObserver();

        // 开始处理当前页
        processCurrentPage();
    }

    // 设置验证弹窗监听 - 完全重写以匹配B站验证窗口HTML结构
    function setupVerificationObserver() {
        // 清除旧的观察器
        if (verificationObserver) {
            verificationObserver.disconnect();
        }

        // 创建新的观察器
        verificationObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // 精确匹配B站验证弹窗结构
                    const verifyWrapper = document.querySelector('.base-verify-wrapper');
                    if (verifyWrapper && autoUnfollowState.running && !autoUnfollowState.paused) {
                        // 发现验证弹窗
                        console.log('检测到验证弹窗');

                        // 暂停操作
                        autoUnfollowState.paused = true;

                        // 更新状态
                        if (autoUnfollowState.statusElement) {
                            autoUnfollowState.statusElement.innerHTML += `
                                <br><span style="color: #e6a23c; font-weight: bold;">⚠️ 检测到手机验证弹窗，操作已暂停</span>
                            `;
                        }

                        // 处理验证弹窗
                        handleVerification();
                    }
                }
            }
        });

        // 开始观察整个body，捕获任何可能的验证弹窗
        verificationObserver.observe(document.body, { childList: true, subtree: true });
    }

    // 完全重写的验证处理函数，精确匹配B站验证窗口HTML结构
    function handleVerification() {
        console.log('开始处理验证弹窗');

        // 设置全局超时保护，避免永久卡死
        const globalVerifyTimeout = setTimeout(() => {
            if (autoUnfollowState.paused) {
                console.log('验证弹窗处理超时，强制恢复操作');
                // 尝试强制关闭验证弹窗
                const closeBtn = document.querySelector('.base-verify-close');
                if (closeBtn) {
                    try {
                        closeBtn.click();
                    } catch (e) {
                        console.error('点击关闭按钮失败:', e);
                    }
                }

                // 强制恢复操作
                autoUnfollowState.paused = false;
                autoUnfollowState.statusElement.innerHTML += `
                    <br><span style="color: #e6a23c;">⚠️ 验证处理超时，已强制恢复操作</span>
                `;

                // 确保清理所有状态
                clearAllVerificationState();
                continueProcessing();
            }
        }, 60000); // 一分钟后强制恢复

        // 记录超时ID便于清除
        autoUnfollowState.verifyTimeoutId = globalVerifyTimeout;

        // 记录当前时间，用于后续检测
        autoUnfollowState.verificationStartTime = Date.now();

        // 等待DOM元素完全加载
        setTimeout(() => {
            try {
                // 精确匹配B站验证窗口中的手机输入框
                const phoneInput = document.querySelector('.base-verify-content .bili-phone-verify .phone-input');
                if (phoneInput && autoUnfollowState.phoneNumber) {
                    console.log('找到手机号输入框，自动填充手机号');
                    // 直接设置输入框值
                    phoneInput.value = autoUnfollowState.phoneNumber;
                    // 触发输入事件，确保B站脚本能监听到变化
                    phoneInput.dispatchEvent(new Event('input', { bubbles: true }));

                    autoUnfollowState.statusElement.innerHTML += `
                        <br><span style="color: #409eff;">🔄 已自动填写手机号，准备自动点击确认</span>
                    `;

                    // 等待短暂时间后自动点击确认按钮
                    setTimeout(() => {
                        const confirmBtn = document.querySelector('.base-verify-content .bili-phone-verify .phone-footer .phone-confirm');
                        if (confirmBtn) {
                            console.log('找到确认按钮，自动点击');
                            try {
                                // 直接调用点击方法
                                confirmBtn.click();
                                autoUnfollowState.statusElement.innerHTML += `
                                    <br><span style="color: #409eff;">🔄 已自动点击确认按钮，等待验证完成...</span>
                                `;
                                // 标记确认按钮已点击
                                autoUnfollowState.confirmButtonClicked = true;
                            } catch (e) {
                                console.error('自动点击确认按钮失败:', e);
                                autoUnfollowState.statusElement.innerHTML += `
                                    <br><span style="color: #e6a23c;">⚠️ 自动点击失败，请手动点击确认按钮</span>
                                `;
                            }
                        } else {
                            console.warn('未找到确认按钮，无法自动点击');
                            autoUnfollowState.statusElement.innerHTML += `
                                <br><span style="color: #e6a23c;">⚠️ 未找到确认按钮，请手动点击确认</span>
                            `;
                        }
                    }, 800); // 延迟800毫秒后点击，给输入事件足够的处理时间
                } else {
                    console.warn('未找到手机号输入框或未设置手机号');
                    autoUnfollowState.statusElement.innerHTML += `
                        <br><span style="color: #e6a23c;">⚠️ 无法自动填写手机号，请手动处理验证</span>
                    `;
                }

                // 进行更精确的按钮监听
                setupPreciseVerificationButtonListeners();

                // 启动定期检查机制
                startVerificationChecking();
            } catch (e) {
                console.error('处理验证弹窗失败:', e);
                // 即使出错也设置按钮监听，增加容错性
                setupPreciseVerificationButtonListeners();
            }
        }, 500);
    }

    // 启动验证状态检查
    function startVerificationChecking() {
        // 定期检查验证弹窗状态
        const checkInterval = setInterval(() => {
            if (!autoUnfollowState.running || !autoUnfollowState.paused) {
                // 如果已停止或恢复，清除检查
                clearInterval(checkInterval);
                return;
            }

            // 验证弹窗是否还存在
            const verifyWrapper = document.querySelector('.base-verify-wrapper');

            // 如果验证弹窗已经消失
            if (!verifyWrapper) {
                console.log('验证弹窗已消失，自动恢复操作');
                // 清除间隔检查
                clearInterval(checkInterval);

                // 恢复操作
                resumeAfterVerification('自动检测到弹窗关闭');
                return;
            }

            // 检查是否长时间未操作，可能需要重新绑定事件
            const now = Date.now();
            if (autoUnfollowState.verificationStartTime &&
                (now - autoUnfollowState.verificationStartTime > 10000)) { // 10秒后重试

                console.log('验证弹窗长时间未操作，重新绑定事件');
                // 重新绑定事件
                setupPreciseVerificationButtonListeners();
                // 更新时间戳，避免频繁重绑定
                autoUnfollowState.verificationStartTime = now;

                // 提示用户
                autoUnfollowState.statusElement.innerHTML += `
                    <br><span style="color: #e6a23c;">⚠️ 验证等待较长，请点击"确定"按钮</span>
                `;
            }
        }, 2000);

        // 存储检查间隔ID，以便后续清除
        autoUnfollowState.verificationCheckInterval = checkInterval;
    }

    // 精确的验证按钮监听设置，完全匹配B站HTML结构
    function setupPreciseVerificationButtonListeners() {
        try {
            // 直接使用与B站HTML结构一致的选择器
            const confirmBtn = document.querySelector('.base-verify-content .bili-phone-verify .phone-footer .phone-confirm');
            const cancelBtn = document.querySelector('.base-verify-content .bili-phone-verify .phone-footer .phone-cancel');
            const closeBtn = document.querySelector('.base-verify-header .base-verify-close');

            console.log('确认按钮:', confirmBtn, '取消按钮:', cancelBtn, '关闭按钮:', closeBtn);

            // 为确认按钮添加事件监听
            if (confirmBtn) {
                // 移除可能的旧事件，使用直接事件绑定
                confirmBtn.onclick = function (e) {
                    console.log('确认按钮被点击');
                    e.stopPropagation(); // 阻止事件冒泡
                    onPreciseVerificationConfirm();
                };
            }

            // 为取消按钮添加事件监听
            if (cancelBtn) {
                cancelBtn.onclick = function (e) {
                    console.log('取消按钮被点击');
                    e.stopPropagation(); // 阻止事件冒泡
                    onPreciseVerificationCancel();
                };
            }

            // 为关闭按钮添加事件监听
            if (closeBtn) {
                closeBtn.onclick = function (e) {
                    console.log('关闭按钮被点击');
                    e.stopPropagation(); // 阻止事件冒泡
                    onPreciseVerificationCancel();
                };
            }

            // 添加辅助的全局事件捕获
            document.addEventListener('click', function (e) {
                // 只在验证处理状态下处理
                if (!autoUnfollowState.paused) return;

                // 匹配确认、取消、关闭按钮的点击
                const target = e.target;

                // 精确匹配B站验证窗口按钮
                if (target.classList.contains('phone-confirm') ||
                    target.closest('.phone-confirm')) {
                    console.log('全局捕获到确认按钮点击');
                    onPreciseVerificationConfirm();
                } else if (
                    target.classList.contains('phone-cancel') ||
                    target.classList.contains('base-verify-close') ||
                    target.closest('.phone-cancel') ||
                    target.closest('.base-verify-close')
                ) {
                    console.log('全局捕获到取消/关闭按钮点击');
                    onPreciseVerificationCancel();
                }
            }, true); // 使用捕获阶段以确保先于其他事件处理
        } catch (e) {
            console.error('设置验证按钮监听失败:', e);
        }
    }

    // 精确的验证确认处理
    function onPreciseVerificationConfirm() {
        console.log('执行确认验证处理');

        // 防止重复处理
        if (autoUnfollowState.confirmButtonClicked) {
            console.log('已经点击过确认按钮，跳过处理');
            return;
        }

        // 标记按钮已点击
        autoUnfollowState.confirmButtonClicked = true;

        // 清除可能的全局超时
        if (autoUnfollowState.verifyTimeoutId) {
            clearTimeout(autoUnfollowState.verifyTimeoutId);
        }

        // 显示处理中状态
        autoUnfollowState.statusElement.innerHTML += `
            <br><span style="color: #409eff;">🔄 验证确认中，请稍候...</span>
        `;

        // 设置检查验证结果的定时器
        let checkCount = 0;
        const maxChecks = 15; // 最多检查15次

        const checkConfirmResult = setInterval(() => {
            checkCount++;

            // 检查验证弹窗是否已关闭
            const verifyWrapper = document.querySelector('.base-verify-wrapper');

            if (!verifyWrapper) {
                // 验证弹窗已关闭，说明验证成功
                clearInterval(checkConfirmResult);
                resumeAfterVerification('确认成功');
            } else if (checkCount >= maxChecks) {
                // 超过最大检查次数，验证可能异常
                clearInterval(checkConfirmResult);

                // 尝试强制关闭验证弹窗
                const closeBtn = document.querySelector('.base-verify-close');
                if (closeBtn) {
                    try {
                        closeBtn.click();
                        setTimeout(() => {
                            if (!document.querySelector('.base-verify-wrapper')) {
                                resumeAfterVerification('强制关闭成功');
                            } else {
                                autoUnfollowState.statusElement.innerHTML += `
                                    <br><span style="color: #e6a23c;">⚠️ 验证弹窗无法自动关闭，请手动关闭</span>
                                `;
                            }
                        }, 1000);
                    } catch (e) {
                        console.error('强制关闭失败:', e);
                        autoUnfollowState.statusElement.innerHTML += `
                            <br><span style="color: #e6a23c;">⚠️ 验证处理异常，请手动关闭验证弹窗</span>
                        `;
                    }
                } else {
                    autoUnfollowState.statusElement.innerHTML += `
                        <br><span style="color: #e6a23c;">⚠️ 验证处理超时，请手动关闭验证弹窗</span>
                    `;
                }
            }
        }, 1000); // 每秒检查一次
    }

    // 精确的验证取消处理
    function onPreciseVerificationCancel() {
        console.log('执行取消验证处理');

        // 清除验证相关定时器
        clearAllVerificationTimers();

        // 延迟一点执行，确保取消操作完成
        setTimeout(() => {
            // 检查验证弹窗是否已关闭
            const verifyWrapper = document.querySelector('.base-verify-wrapper');

            if (!verifyWrapper) {
                // 验证弹窗已关闭
                autoUnfollowState.statusElement.innerHTML += `
                    <br><span style="color: #f56c6c;">❌ 验证已取消</span>
                `;

                // 询问用户是否继续
                const shouldContinue = confirm('验证已取消，是否继续执行取关操作？');

                if (shouldContinue) {
                    // 恢复操作
                    autoUnfollowState.paused = false;
                    clearAllVerificationState();
                    continueProcessing();
                } else {
                    // 终止操作
                    autoUnfollowState.running = false;
                    autoUnfollowState.paused = false;

                    autoUnfollowState.statusElement.innerHTML += `
                        <br><span style="color: #f56c6c;">❌ 操作已终止</span>
                    `;

                    clearAllVerificationState();
                    restoreButton();
                }
            } else {
                // 验证弹窗仍然存在，可能是取消按钮点击未生效
                // 尝试再次点击关闭按钮
                const closeBtn = document.querySelector('.base-verify-close');
                if (closeBtn) {
                    closeBtn.click();
                    console.log('尝试再次点击关闭按钮');

                    // 再次检查
                    setTimeout(onPreciseVerificationCancel, 1000);
                } else {
                    // 无法找到关闭按钮，提示用户
                    autoUnfollowState.statusElement.innerHTML += `
                        <br><span style="color: #e6a23c;">⚠️ 无法自动关闭验证弹窗，请手动关闭</span>
                    `;
                }
            }
        }, 800); // 给足够的时间让B站处理取消操作
    }

    // 验证后恢复操作 - 精确版本
    function resumeAfterVerification(reason) {
        console.log(`验证恢复操作: ${reason}`);

        // 恢复操作状态
        autoUnfollowState.paused = false;

        // 清除所有验证相关状态
        clearAllVerificationState();

        // 更新状态显示
        if (autoUnfollowState.statusElement) {
            autoUnfollowState.statusElement.innerHTML += `
                <br><span style="color: #67c23a;">✅ 验证已完成 (${reason})，操作已恢复</span>
            `;
        }

        // 延迟一点执行继续处理，确保B站验证相关的处理已完成
        setTimeout(() => {
            continueProcessing();
        }, 1000);
    }

    // 清除所有验证相关定时器
    function clearAllVerificationTimers() {
        // 清除验证超时保护
        if (autoUnfollowState.verifyTimeoutId) {
            clearTimeout(autoUnfollowState.verifyTimeoutId);
            autoUnfollowState.verifyTimeoutId = null;
        }

        // 清除验证状态检查
        if (autoUnfollowState.verificationCheckInterval) {
            clearInterval(autoUnfollowState.verificationCheckInterval);
            autoUnfollowState.verificationCheckInterval = null;
        }
    }

    // 清除所有验证相关状态
    function clearAllVerificationState() {
        // 清除所有定时器
        clearAllVerificationTimers();

        // 重置各种状态标记
        autoUnfollowState.confirmButtonClicked = false;
        autoUnfollowState.verificationStartTime = null;

        // 断开并重新连接观察器，避免重复触发
        if (verificationObserver) {
            verificationObserver.disconnect();
        }
    }

    // 改进的继续处理函数
    function continueProcessing() {
        console.log('继续执行取关处理');

        // 确保所有验证状态已清除
        clearAllVerificationState();

        // 重新设置验证弹窗监听，确保能捕获后续的验证弹窗
        setTimeout(() => {
            setupVerificationObserver();
        }, 1000);

        // 检查页面状态，确保在正确的页面
        setTimeout(() => {
            try {
                // 获取当前页码
                const currentPageNum = getCurrentPage();
                console.log(`当前页码: ${currentPageNum}, 期望页码: ${autoUnfollowState.currentPage}`);

                if (currentPageNum !== autoUnfollowState.currentPage) {
                    // 页面不匹配，可能是验证过程中页面发生了变化
                    autoUnfollowState.statusElement.innerHTML += `
                        <br><span style="color: #e6a23c;">⚠️ 页面状态不匹配，将跳转到正确页面</span>
                    `;

                    // 跳转到正确页面
                    navigateToPage(autoUnfollowState.currentPage);

                    // 等待页面加载后继续
                    setTimeout(processCurrentPage, 3000);
                } else {
                    // 直接继续处理当前页
                    processCurrentPage();
                }
            } catch (e) {
                console.error('继续处理时出错:', e);
                // 出错时依然尝试继续处理当前页
                processCurrentPage();
            }
        }, 1000);
    }

    // 处理当前页
    async function processCurrentPage() {
        if (!autoUnfollowState.running) {
            restoreButton();
            return;
        }

        // 如果是暂停状态，等待恢复
        if (autoUnfollowState.paused) {
            return;
        }

        // 重置当前页的计数
        autoUnfollowState.pageSuccess = 0;
        autoUnfollowState.pageFailed = 0;
        autoUnfollowState.inProgress = 0;

        // 获取当前页的所有关注按钮
        let retryCount = 0;
        let followButtons = [];

        // 等待页面加载，最多等待5秒
        while (retryCount < 10 && followButtons.length === 0) {
            followButtons = document.querySelectorAll('.follow-btn__trigger.gray');

            if (followButtons.length > 0) break;

            await new Promise(r => setTimeout(r, 500));
            retryCount++;
        }

        if (followButtons.length === 0) {
            autoUnfollowState.statusElement.innerHTML = `
                <span style="color: #f56c6c;">⚠️ 当前页(${autoUnfollowState.currentPage})未找到关注按钮</span><br>
                <span style="color: #67c23a;">✅ 总成功: ${autoUnfollowState.totalSuccess}</span> | 
                <span style="color: #f56c6c;">❌ 总失败: ${autoUnfollowState.totalFailed}</span>
            `;

            // 检查是否需要继续翻页
            checkAndMoveToNextPage();
            return;
        }

        // 确定要处理的数量
        const actualCount = Math.min(autoUnfollowState.itemsPerPage, followButtons.length);

        // 创建要处理的按钮数组
        const buttonsToProcess = Array.from(followButtons).slice(0, actualCount);

        // 使用并发处理
        const batchSize = autoUnfollowState.concurrentCount;

        // 更新状态
        autoUnfollowState.statusElement.innerHTML = `
            <span style="color: #409eff; font-weight: bold;">🔄 处理第 ${autoUnfollowState.currentPage} 页 (共${actualCount}个关注)</span><br>
            <span style="color: #67c23a;">✅ 总成功: ${autoUnfollowState.totalSuccess}</span> | 
            <span style="color: #f56c6c;">❌ 总失败: ${autoUnfollowState.totalFailed}</span>
        `;

        try {
            // 分批处理
            for (let i = 0; i < buttonsToProcess.length; i += batchSize) {
                if (!autoUnfollowState.running || autoUnfollowState.paused) {
                    break;
                }

                // 获取当前批次
                const batch = buttonsToProcess.slice(i, i + batchSize);

                // 并发处理当前批次
                await Promise.all(batch.map(button => unfollowSingleUser(button)));

                // 如果不是最后一批，添加一个间隔
                if (i + batchSize < buttonsToProcess.length) {
                    await new Promise(r => setTimeout(r, 1000));
                }

                // 如果暂停了，停止处理
                if (autoUnfollowState.paused) {
                    break;
                }
            }

            // 当前页处理完成且没有暂停
            if (!autoUnfollowState.paused) {
                autoUnfollowState.statusElement.innerHTML = `
                    <span style="color: #67c23a; font-weight: bold;">✅ 第 ${autoUnfollowState.currentPage} 页处理完成!</span><br>
                    <span style="color: #67c23a;">✅ 本页成功: ${autoUnfollowState.pageSuccess}</span> | 
                    <span style="color: #f56c6c;">❌ 本页失败: ${autoUnfollowState.pageFailed}</span><br>
                    <span style="color: #67c23a;">✅ 总成功: ${autoUnfollowState.totalSuccess}</span> | 
                    <span style="color: #f56c6c;">❌ 总失败: ${autoUnfollowState.totalFailed}</span>
                `;

                // 检查是否需要继续翻页
                checkAndMoveToNextPage();
            }
        } catch (e) {
            console.error('处理当前页失败:', e);
            autoUnfollowState.statusElement.innerHTML += `
                <br><span style="color: #f56c6c;">⚠️ 处理过程中出错: ${e.message}</span>
            `;
            restoreButton();
        }
    }

    // 单个用户取关函数 - 修复了成功/失败判断逻辑
    async function unfollowSingleUser(button) {
        if (!autoUnfollowState.running || autoUnfollowState.paused) {
            return false;
        }

        // 增加处理中计数
        autoUnfollowState.inProgress++;
        updateAutoUnfollowStatus();

        // 获取用户名
        let username = '未知用户';
        try {
            const userCard = button.closest('.relation-card');
            if (userCard) {
                const usernameElement = userCard.querySelector('.relation-card-info__uname');
                if (usernameElement) {
                    username = usernameElement.textContent.trim();
                }
            }

            // 点击关注按钮打开菜单
            button.click();

            // 等待菜单出现
            await new Promise(r => setTimeout(r, 300));

            // 查找取消关注选项
            const menuItems = document.querySelectorAll('.popover-menu-item');
            const unfollowOption = Array.from(menuItems).find(item =>
                item.textContent.includes('取消关注'));

            // 检查是否有验证弹窗
            const verifyContainer = document.querySelector('.base-verify-container');

            if (verifyContainer) {
                // 发现验证弹窗，标记为重试
                autoUnfollowState.totalRetries++;
                autoUnfollowState.recentUsers.push({ name: username, status: 'retry' });
                autoUnfollowState.inProgress--;
                updateAutoUnfollowStatus();
                return false;
            }

            if (unfollowOption) {
                // 点击取消关注
                unfollowOption.click();

                // 等待足够时间让操作完成
                await new Promise(r => setTimeout(r, 500));

                // 关注成功
                autoUnfollowState.pageSuccess++;
                autoUnfollowState.totalSuccess++;
                autoUnfollowState.recentUsers.push({ name: username, status: 'success' });

                // 添加随机延迟，避免被检测
                const randomDelay = autoUnfollowState.delay + Math.random() * 500;
                await new Promise(r => setTimeout(r, randomDelay));
            } else {
                // 点击其他地方关闭菜单
                document.body.click();

                // 如果菜单项为空，可能是B站限制或其他原因
                autoUnfollowState.pageFailed++;
                autoUnfollowState.totalFailed++;
                autoUnfollowState.recentUsers.push({ name: username, status: 'failed' });
            }
        } catch (error) {
            console.error(`处理用户 ${username} 失败:`, error);
            autoUnfollowState.pageFailed++;
            autoUnfollowState.totalFailed++;
            autoUnfollowState.recentUsers.push({ name: username, status: 'failed' });
        } finally {
            // 不管成功还是失败，都减少处理中计数
            autoUnfollowState.inProgress--;
            updateAutoUnfollowStatus();
        }

        // 如果暂停了，直接返回
        if (autoUnfollowState.paused) {
            return false;
        }

        return true;
    }

    // 检查是否需要翻页并执行
    function checkAndMoveToNextPage() {
        if (!autoUnfollowState.running || !autoUnfollowState.autoPaging || autoUnfollowState.paused) {
            // 如果已停止、不自动翻页或已暂停，则恢复按钮状态
            restoreButton();
            return;
        }

        // 获取总页数
        const totalPages = getTotalPages();

        // 检查是否已经达到结束页
        if (autoUnfollowState.endPage && autoUnfollowState.currentPage >= autoUnfollowState.endPage) {
            autoUnfollowState.statusElement.innerHTML += `<br><span style="color: #e6a23c;">🎉 已达到设定的结束页(${autoUnfollowState.endPage})，操作完成！</span>`;
            autoUnfollowState.running = false;
            restoreButton();
            return;
        }

        // 记录当前页已处理
        autoUnfollowState.processedPages[autoUnfollowState.currentPage] = true;

        // 检查是否已经是最后一页
        const isLastPage = autoUnfollowState.currentPage >= totalPages ||
            document.querySelector('.vui_pagenation--btn-side:last-child.vui_button--disabled');

        if (isLastPage) {
            // 检查是否有未处理的页面
            let hasUnprocessedPages = false;
            let nextPageToProcess = -1;

            // 查找需要处理的页码按钮
            const pageButtons = document.querySelectorAll('.vui_pagenation--btn-num');
            for (let i = 0; i < pageButtons.length; i++) {
                const pageNum = parseInt(pageButtons[i].textContent, 10);

                // 跳过已处理的页码
                if (!autoUnfollowState.processedPages[pageNum] &&
                    // 如果设置了结束页，则只处理到结束页
                    (!autoUnfollowState.endPage || pageNum <= autoUnfollowState.endPage)) {
                    hasUnprocessedPages = true;
                    if (nextPageToProcess === -1 || pageNum < nextPageToProcess) {
                        nextPageToProcess = pageNum;
                    }
                }
            }

            // 如果找不到显示的页码按钮中的未处理页面，但总页数大于1，尝试从起始页重新开始
            if (!hasUnprocessedPages && totalPages > 1 && !autoUnfollowState.fullPagesProcessed) {
                // 计算已处理页面数
                const processedCount = Object.keys(autoUnfollowState.processedPages).length;

                // 如果处理的页面数少于总页数，说明还有页面未处理
                if (processedCount < totalPages) {
                    hasUnprocessedPages = true;
                    nextPageToProcess = autoUnfollowState.startFromPage; // 从起始页重新开始
                }
            }

            if (hasUnprocessedPages) {
                autoUnfollowState.statusElement.innerHTML += `
                    <br><span style="color: #e6a23c;">🔄 已到最后一页，发现还有未处理页面，将跳转到第 ${nextPageToProcess} 页继续处理</span>
                `;

                // 延迟2秒后跳转，给页面元素足够时间更新
                setTimeout(() => {
                    if (!autoUnfollowState.running || autoUnfollowState.paused) return;

                    // 更新当前页码
                    autoUnfollowState.currentPage = nextPageToProcess;

                    // 跳转到下一个需要处理的页码
                    navigateToPageAndProcess(nextPageToProcess);
                }, 2000);
            } else {
                // 所有页面都已处理完毕
                autoUnfollowState.fullPagesProcessed = true;
                autoUnfollowState.statusElement.innerHTML += `<br><span style="color: #e6a23c;">🎉 已完成所有页面处理，操作完成！</span>`;
                autoUnfollowState.running = false;
                restoreButton();
            }
            return;
        }

        // 常规翻页逻辑 - 前往下一页
        autoUnfollowState.statusElement.innerHTML += `<br><span style="color: #409eff;">🔄 准备跳转到第 ${autoUnfollowState.currentPage + 1} 页...</span>`;

        // 延迟2秒后跳转下一页，给页面元素足够时间更新
        setTimeout(() => {
            if (!autoUnfollowState.running || autoUnfollowState.paused) return;

            autoUnfollowState.currentPage++;

            // 标记新页面为已处理
            autoUnfollowState.processedPages[autoUnfollowState.currentPage] = true;

            // 使用增强的导航函数
            navigateToPageAndProcess(autoUnfollowState.currentPage);
        }, 2000);
    }

    // 新增：增强的页面导航和处理函数，确保页面加载后处理
    function navigateToPageAndProcess(pageNum) {
        // 使用navigateToPage函数跳转页面
        const success = navigateToPage(pageNum);

        if (success) {
            autoUnfollowState.statusElement.innerHTML += `<br><span style="color: #409eff;">🔄 正在跳转到第 ${pageNum} 页...</span>`;

            // 设置多次检查页面加载状态，确保页面完全加载后再处理
            let checkCount = 0;
            const maxChecks = 10; // 最多检查10次，总共20秒

            function checkPageLoaded() {
                checkCount++;

                // 检查当前页码是否符合预期
                const currentPage = getCurrentPage();
                console.log(`检查页面加载：当前页 ${currentPage}，目标页 ${pageNum}，尝试次数 ${checkCount}`);

                if (currentPage === pageNum) {
                    // 页面已加载到正确页码，等待DOM元素加载完成
                    setTimeout(() => {
                        // 再次检查是否有关注按钮，确保DOM完全加载
                        const followButtons = document.querySelectorAll('.follow-btn__trigger.gray');
                        if (followButtons.length > 0 || checkCount >= 3) {
                            // 找到关注按钮或已经检查了足够次数，开始处理
                            autoUnfollowState.statusElement.innerHTML += `<br><span style="color: #67c23a;">✅ 第 ${pageNum} 页加载完成，开始处理</span>`;
                            processCurrentPage();
                        } else {
                            // 未找到关注按钮，继续等待
                            if (checkCount < maxChecks) {
                                setTimeout(checkPageLoaded, 2000);
                            } else {
                                // 超出最大检查次数
                                autoUnfollowState.statusElement.innerHTML += `<br><span style="color: #e6a23c;">⚠️ 页面加载超时，尝试强制处理</span>`;
                                processCurrentPage();
                            }
                        }
                    }, 1000);
                } else {
                    // 页面还未加载到正确页码
                    if (checkCount < maxChecks) {
                        // 继续等待
                        setTimeout(checkPageLoaded, 2000);
                    } else {
                        // 超出最大检查次数，尝试重新导航
                        autoUnfollowState.statusElement.innerHTML += `<br><span style="color: #e6a23c;">⚠️ 导航到第 ${pageNum} 页失败，尝试重新导航</span>`;

                        // 再次尝试导航
                        navigateToPage(pageNum);
                        setTimeout(() => {
                            const currentPageRetry = getCurrentPage();
                            if (currentPageRetry === pageNum) {
                                autoUnfollowState.statusElement.innerHTML += `<br><span style="color: #67c23a;">✅ 重试导航成功，开始处理</span>`;
                                processCurrentPage();
                            } else {
                                autoUnfollowState.statusElement.innerHTML += `<br><span style="color: #f56c6c;">❌ 导航失败，请手动点击页码 ${pageNum}</span>`;
                                autoUnfollowState.running = false;
                                restoreButton();
                            }
                        }, 3000);
                    }
                }
            }

            // 开始检查页面加载状态
            setTimeout(checkPageLoaded, 2000);
        } else {
            // 导航失败的处理
            autoUnfollowState.statusElement.innerHTML += `<br><span style="color: #f56c6c;">❌ 导航到第 ${pageNum} 页失败，尝试备用方法</span>`;

            // 尝试备用的导航方法
            try {
                // 直接修改URL方式
                let currentUrl = window.location.href;
                const pageParam = `page=${pageNum}`;

                if (currentUrl.includes('page=')) {
                    // 替换已有的page参数
                    currentUrl = currentUrl.replace(/page=\d+/, pageParam);
                } else if (currentUrl.includes('?')) {
                    // 添加page参数到已有参数后
                    currentUrl += `&${pageParam}`;
                } else {
                    // 添加page参数作为第一个参数
                    currentUrl += `?${pageParam}`;
                }

                // 更新URL并重新加载
                window.location.href = currentUrl;

                // 通知用户
                autoUnfollowState.statusElement.innerHTML += `<br><span style="color: #e6a23c;">⚠️ 正在使用页面刷新方式导航，请稍候...</span>`;
            } catch (e) {
                console.error('备用导航方法失败:', e);
                autoUnfollowState.statusElement.innerHTML += `<br><span style="color: #f56c6c;">❌ 所有导航方法失败，请手动点击页码 ${pageNum}</span>`;
                autoUnfollowState.running = false;
                restoreButton();
            }
        }
    }

    // 恢复按钮状态
    function restoreButton() {
        const startButton = document.getElementById('start-unfollow');
        if (startButton) {
            startButton.disabled = false;
            startButton.style.backgroundColor = '#FB7299';
            startButton.textContent = '开始取关';
        }
    }

    // 更新自动取关状态显示
    function updateAutoUnfollowStatus() {
        if (!autoUnfollowState.statusElement) return;

        // 保持最近取关的用户列表不超过5个
        if (autoUnfollowState.recentUsers.length > 5) {
            autoUnfollowState.recentUsers = autoUnfollowState.recentUsers.slice(-5);
        }

        // 构建状态HTML
        let statusHTML = `
            <span style="color: #409eff; font-weight: bold;">🔄 当前页: ${autoUnfollowState.currentPage}</span>
            ${autoUnfollowState.paused ? '<span style="color: #e6a23c; font-weight: bold;"> (已暂停)</span>' : ''}<br>
            <span style="color: #67c23a;">✅ 本页成功: ${autoUnfollowState.pageSuccess}</span> | 
            <span style="color: #f56c6c;">❌ 本页失败: ${autoUnfollowState.pageFailed}</span> | 
            <span style="color: #e6a23c;">⏳ 处理中: ${autoUnfollowState.inProgress}</span><br>
            <span style="color: #67c23a;">✅ 总成功: ${autoUnfollowState.totalSuccess}</span> | 
            <span style="color: #f56c6c;">❌ 总失败: ${autoUnfollowState.totalFailed}</span>
        `;

        // 添加重试信息
        if (autoUnfollowState.totalRetries > 0) {
            statusHTML += ` | <span style="color: #e6a23c;">🔄 重试: ${autoUnfollowState.totalRetries}</span>`;
        }

        // 添加最近取关用户
        if (autoUnfollowState.recentUsers.length > 0) {
            statusHTML += `<br><span style="color: #909399;">最近: </span>`;
            autoUnfollowState.recentUsers.forEach(user => {
                const status = user.status === 'success' ? '✅' : (user.status === 'retry' ? '🔄' : '❌');
                statusHTML += `<small style="margin-right: 5px;">${status} ${user.name}</small>`;
            });
        }

        // 更新状态元素
        autoUnfollowState.statusElement.innerHTML = statusHTML;
    }

    // 在页面加载完成后创建悬浮按钮，防止找不到原生按钮的情况
    function createFloatingButton() {
        if (document.getElementById('floating-unfollow-btn')) {
            return; // 已经存在，不重复创建
        }

        const button = document.createElement('div');
        button.id = 'floating-unfollow-btn';
        button.textContent = '自动批量取关';
        button.style.position = 'fixed';
        button.style.bottom = '100px';
        button.style.right = '20px';
        button.style.backgroundColor = '#FB7299';
        button.style.color = 'white';
        button.style.padding = '10px 15px';
        button.style.borderRadius = '5px';
        button.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        button.style.cursor = 'pointer';
        button.style.zIndex = '999999';
        button.style.fontWeight = 'bold';

        // 鼠标悬停效果
        button.addEventListener('mouseover', function () {
            this.style.backgroundColor = '#fc8bab';
        });

        button.addEventListener('mouseout', function () {
            this.style.backgroundColor = '#FB7299';
        });

        // 点击事件
        button.addEventListener('click', function () {
            showControlPanel();
        });

        document.body.appendChild(button);
    }

    // 启动脚本
    createInlineButton();

    // 3秒后如果内联按钮未创建成功，则创建悬浮按钮作为备份
    setTimeout(function () {
        if (!document.getElementById('unfollow-batch-btn')) {
            createFloatingButton();
        }
    }, 3000);

    // 添加页面状态监听器，改进循环处理所有页面的可靠性
    window.addEventListener('load', function () {
        console.log('页面完全加载，初始化页面状态监听');
        // 监听URL变化，可能表示页面切换
        let lastUrl = location.href;

        // 创建URL监测器
        const urlObserver = new MutationObserver(function () {
            if (location.href !== lastUrl) {
                console.log('URL已变化:', location.href);
                lastUrl = location.href;

                // 检查是否在运行中并且更新了页码
                if (autoUnfollowState.running && !autoUnfollowState.paused) {
                    // 获取当前页码
                    const currentPage = getCurrentPage();
                    console.log('URL变化后的当前页码:', currentPage);

                    // 检查是否与期望的页码一致
                    if (currentPage !== autoUnfollowState.currentPage) {
                        console.log('页码不一致，更新为:', currentPage);
                        autoUnfollowState.currentPage = currentPage;
                    }
                }
            }
        });

        // 观察URL变化
        urlObserver.observe(document, { subtree: true, childList: true });

        // 检测页面DOM变化可能表示页面内容更新
        const contentObserver = new MutationObserver(function (mutations) {
            // 只在脚本运行时处理
            if (!autoUnfollowState.running || autoUnfollowState.paused) return;

            // 检查是否有用户卡片添加
            let hasUserCardChanges = false;
            for (const mutation of mutations) {
                if (mutation.type === 'childList' &&
                    (mutation.target.classList.contains('relation-list') ||
                        mutation.target.classList.contains('follow-list'))) {
                    hasUserCardChanges = true;
                    break;
                }
            }

            // 如果有用户卡片变化，可能是页面加载完成或翻页
            if (hasUserCardChanges) {
                console.log('检测到用户列表更新');

                // 检查当前进行中的操作数
                if (autoUnfollowState.inProgress === 0) {
                    // 如果没有进行中的操作，可能是翻页刚完成，尝试处理
                    const followButtons = document.querySelectorAll('.follow-btn__trigger.gray');
                    console.log('当前页面关注按钮数:', followButtons.length);

                    // 如果有关注按钮且当前没有正在处理
                    if (followButtons.length > 0 &&
                        autoUnfollowState.pageSuccess === 0 &&
                        autoUnfollowState.pageFailed === 0) {

                        console.log('检测到新页面加载完成，自动开始处理');
                        // 确保不会重复处理
                        setTimeout(() => {
                            // 再次检查状态，避免重复调用
                            if (autoUnfollowState.inProgress === 0 &&
                                autoUnfollowState.pageSuccess === 0 &&
                                autoUnfollowState.pageFailed === 0) {
                                processCurrentPage();
                            }
                        }, 1000);
                    }
                }
            }
        });

        // 观察内容变化
        contentObserver.observe(document.body, { childList: true, subtree: true });

        console.log('页面状态监听器已设置');
    });
})();
