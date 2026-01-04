// ==UserScript==
// @name         AMEX Code Helper (通知设置保存优化)
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  自动提交AMEX offer code和WOC code，防止会话超时，支持批量测试，自动识别链接有效性，并记录结果 (已优化同步逻辑和通知设置保存)
// @author       Your Name & Gemini
// @match        https://www.americanexpress.com/*
// @match        https://global.americanexpress.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534274/AMEX%20Code%20Helper%20%28%E9%80%9A%E7%9F%A5%E8%AE%BE%E7%BD%AE%E4%BF%9D%E5%AD%98%E4%BC%98%E5%8C%96%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534274/AMEX%20Code%20Helper%20%28%E9%80%9A%E7%9F%A5%E8%AE%BE%E7%BD%AE%E4%BF%9D%E5%AD%98%E4%BC%98%E5%8C%96%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 调试模式开关 (可通过设置面板控制)
    let AMEX_DEBUG = GM_getValue('AMEX_DEBUG', false);

    // --- 样式设置 ---
    GM_addStyle(`
        /* --- 基本样式 --- */
        .amex-helper {
            position: fixed;
            top: 10px;
            right: 10px;
            background: #fff;
            border: 2px solid #006fcf;
            border-radius: 5px;
            padding: 10px;
            z-index: 9999;
            width: 350px;
            box-shadow: 0 0 10px rgba(0,0,0,0.3);
            max-height: 90vh;
            overflow-y: auto;
            font-family: sans-serif; /* 使用更通用的字体 */
        }
        .amex-helper input, .amex-helper textarea {
            width: 100%;
            padding: 8px; /* 增加内边距 */
            margin: 5px 0;
            border: 1px solid #ccc;
            border-radius: 4px; /* 添加圆角 */
            box-sizing: border-box; /* 避免宽度超出 */
        }
        .amex-helper textarea {
            height: 80px;
            font-family: monospace;
        }
        .amex-helper button {
            background: #006fcf;
            color: white;
            border: none;
            padding: 8px 12px; /* 调整按钮大小 */
            margin: 5px 2px;
            border-radius: 4px; /* 统一圆角 */
            cursor: pointer;
            transition: background-color 0.2s; /* 添加悬停效果 */
        }
        .amex-helper button:hover {
            background: #004f93;
        }
        .amex-helper h3 {
            margin: 5px 0 10px 0; /* 调整标题边距 */
            color: #006fcf;
            font-size: 1.1em; /* 稍微增大标题 */
        }
        .amex-helper .status {
            font-size: 0.9em; /* 调整状态文字大小 */
            color: #555; /* 调整颜色 */
            margin-top: 10px;
            padding: 5px;
            background-color: #f0f0f0; /* 添加背景色 */
            border-radius: 3px;
        }
        .amex-helper .section {
            border-top: 1px solid #eee;
            margin-top: 10px;
            padding-top: 10px;
        }

        /* --- Tabs --- */
        .amex-helper .tabs {
            display: flex;
            border-bottom: 1px solid #ddd;
            margin-bottom: 10px;
        }
        .amex-helper .tab {
            padding: 8px 12px; /* 调整Tab大小 */
            cursor: pointer;
            border: 1px solid transparent;
            border-bottom: none; /* 初始无下边框 */
            margin-bottom: -1px; /* 与下边框重叠 */
            color: #006fcf; /* Tab文字颜色 */
        }
        .amex-helper .tab:hover {
            background-color: #f0f8ff; /* 悬停背景色 */
        }
        .amex-helper .tab.active {
            border: 1px solid #ddd;
            border-bottom-color: white;
            border-radius: 4px 4px 0 0; /* 圆角 */
            background: white; /* 激活背景色 */
            font-weight: bold; /* 激活加粗 */
            color: #333; /* 激活文字颜色 */
        }
        .amex-helper .tab-content {
            display: none;
        }
        .amex-helper .tab-content.active {
            display: block;
        }

        /* --- 结果表格 --- */
        .amex-helper .attempts {
            max-height: 300px; /* 增加最大高度 */
            overflow-y: auto;
            margin-top: 10px;
            border: 1px solid #ddd; /* 添加边框 */
            border-radius: 4px;
        }
        .amex-helper .results-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
        }
        .amex-helper .results-table th, .amex-helper .results-table td {
            border: 1px solid #eee; /* 调整表格线颜色 */
            padding: 6px 8px; /* 调整单元格内边距 */
            text-align: left;
            vertical-align: middle; /* 垂直居中 */
        }
        .amex-helper .results-table th {
            background: #f8f8f8; /* 表头背景色 */
            font-weight: bold; /* 表头加粗 */
            position: sticky; /* 表头吸顶 */
            top: 0;
            z-index: 1;
        }
        .amex-helper .results-table tbody tr:nth-child(even) {
            background-color: #f9f9f9; /* 斑马纹 */
        }
        .amex-helper .results-table tbody tr:hover {
            background-color: #f0f8ff; /* 行悬停效果 */
        }
        .amex-helper .success { color: #28a745; font-weight: bold; }
        .amex-helper .fail { color: #dc3545; font-weight: bold; }
        .amex-helper .pending { color: #ffc107; font-weight: bold; }
        .amex-helper .verified { background-color: #e6ffe6; }
        .amex-helper .rejected { background-color: #ffe6e6; }

        /* --- 模态窗口 --- */
        .amex-helper-overlay { /* 添加遮罩层 */
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            z-index: 9998;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .amex-helper .modal {
            position: relative; /* 改为相对定位，由遮罩层控制居中 */
            transform: none;
            top: auto; left: auto;
            z-index: 10000;
            background-color: white; /* 背景移到这里 */
            border-radius: 8px; /* 增加圆角 */
            padding: 20px; /* 增加内边距 */
            width: auto; /* 宽度自适应 */
            min-width: 300px;
            max-width: 90vw; /* 最大宽度 */
            box-shadow: 0 5px 15px rgba(0,0,0,0.3); /* 调整阴影 */
            max-height: 80vh; /* 最大高度 */
            overflow-y: auto; /* 内容过多时滚动 */
        }
        .amex-helper .modal-content {
            /* 移除背景色等，已移到 .modal */
            padding: 0; /* 移除内边距 */
            width: 100%;
            box-shadow: none; /* 移除阴影 */
        }
        .amex-helper .modal-title {
            margin-top: 0;
            margin-bottom: 15px; /* 增加下边距 */
            color: #006fcf;
            font-size: 1.2em; /* 增大标题 */
            border-bottom: 1px solid #eee; /* 添加下划线 */
            padding-bottom: 10px;
        }
        .amex-helper .modal button {
            margin: 5px; /* 调整按钮间距 */
        }

        /* --- 设置 --- */
        .amex-helper .settings-row {
            margin: 15px 0; /* 增加行间距 */
        }
        .amex-helper .settings-label {
            display: block;
            margin-bottom: 5px; /* 调整标签下边距 */
            font-weight: bold;
            color: #333;
        }
        .amex-helper .settings-help {
            font-size: 0.85em;
            color: #666;
            margin-top: 5px;
        }

        /* --- 统计 & 批量信息 --- */
        .amex-helper .stats, .amex-helper .batch-info, .amex-helper .combo-info {
            font-size: 12px;
            margin: 8px 0;
            padding: 8px;
            background: #f5f5f5;
            border: 1px solid #e0e0e0; /* 添加边框 */
            border-radius: 4px;
        }
        .amex-helper .batch-info { color: #666; }
        .amex-helper .combo-info { background: #e9f5ff; border-color: #cce7ff; } /* 调整颜色 */

        /* --- 按钮类型 --- */
        .amex-helper .btn-test { background-color: #006fcf; }
        .amex-helper .btn-control { background-color: #28a745; }
        .amex-helper .btn-export { background-color: #6f42c1; }
        .amex-helper .btn-danger { background-color: #dc3545; }
        .amex-helper .btn-warning { background-color: #ffc107; color: black; } /* 添加警告按钮 */
        .amex-helper .verify-btn {
            padding: 3px 6px; /* 调整验证按钮大小 */
            font-size: 11px;
            background-color: #17a2b8; /* 调整颜色 */
            margin-left: 5px;
        }
        .amex-helper .verify-btn:hover { background-color: #138496; }
        .amex-helper .close-btn {
            position: absolute;
            top: 8px;
            right: 10px;
            background: none;
            border: none;
            font-size: 24px; /* 增大关闭按钮 */
            color: #aaa; /* 调整颜色 */
            cursor: pointer;
            padding: 0;
            margin: 0;
            line-height: 1;
        }
        .amex-helper .close-btn:hover { color: #333; }

        /* --- 悬浮按钮 --- */
        .amex-float-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: #006fcf;
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 20px; /* 调整字体大小 */
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3); /* 调整阴影 */
            cursor: pointer;
            z-index: 10000;
            border: none;
            transition: background-color 0.2s, transform 0.2s; /* 添加动画 */
        }
        .amex-float-btn:hover {
            background: #004f93;
            transform: scale(1.1); /* 悬停放大 */
        }

        /* --- 移动端适配 --- */
        @media (max-width: 768px) {
            .amex-helper {
                width: 95%; /* 调整宽度 */
                max-width: none; /* 移除最大宽度 */
                left: 2.5%;
                right: 2.5%;
                top: 5px; /* 调整位置 */
                bottom: 5px; /* 允许占满高度 */
                max-height: calc(100vh - 10px); /* 调整最大高度 */
            }
            .amex-helper button {
                padding: 10px 12px; /* 增大移动端按钮 */
            }
            .amex-helper .tab {
                padding: 10px 8px; /* 调整Tab大小 */
                font-size: 0.9em; /* 缩小Tab字体 */
            }
            .amex-helper .results-table th, .amex-helper .results-table td {
                padding: 5px; /* 缩小单元格内边距 */
                font-size: 11px; /* 缩小表格字体 */
            }
            .amex-helper .modal {
                width: 90%; /* 模态框宽度 */
            }
            .amex-float-btn {
                 bottom: 15px;
                 right: 15px;
                 width: 45px;
                 height: 45px;
                 font-size: 18px;
            }
        }

        /* --- 页面结果通知 --- */
        .amex-page-notification {
            position: fixed;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10005; /* 比助手面板高 */
            padding: 12px 25px; /* 调整内边距 */
            border-radius: 6px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.25);
            font-size: 14px;
            font-weight: bold;
            color: white;
            text-align: center;
            max-width: 90%;
            opacity: 0; /* 初始透明 */
            transition: opacity 0.5s, transform 0.5s; /* 添加动画 */
            pointer-events: none; /* 不阻挡下方点击 */
        }
        .amex-page-notification.show {
            opacity: 1;
            transform: translate(-50%, 10px); /* 向下移动一点 */
        }
        .amex-page-notification.success { background-color: #28a745; }
        .amex-page-notification.error { background-color: #dc3545; }
        .amex-page-notification.warning { background-color: #ffc107; color: black; }

        /* --- iOS 优化链接按钮 --- */
        .ios-link-button {
            display: block;
            background-color: #007bff; /* 调整颜色 */
            color: white;
            font-weight: bold;
            text-align: center;
            padding: 15px;
            margin: 15px 0;
            border-radius: 10px;
            text-decoration: none;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: background-color 0.2s;
        }
        .ios-link-button:hover { background-color: #0056b3; }

        /* --- 跨标签页通知 (占位符，方案2使用) --- */
        .amex-notification-container { /* ... */ }
        .amex-notification { /* ... */ }
        @keyframes slideIn { /* ... */ }

        /* --- 调试信息表格 --- */
        .debug-storage-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            font-size: 11px;
        }
        .debug-storage-table th, .debug-storage-table td {
            border: 1px solid #ddd;
            padding: 4px;
            text-align: left;
        }
        .debug-storage-table th { background-color: #f0f0f0; }
    `);

    // --- 全局变量和状态 ---
    let attempts = GM_getValue('attempts', []);
    const lastOfferCode = GM_getValue('lastOfferCode', '');
    const lastWOCCode = GM_getValue('lastWOCCode', '');
    const lastBatchCodes = GM_getValue('lastBatchCodes', '');
    const serverUrl = GM_getValue('serverUrl', '');
    const scriptDomains = GM_getValue('scriptDomains', 'americanexpress.com');
    let stats = GM_getValue('stats', { totalTested: 0, verified: 0, rejected: 0 });
    let refreshTimerId = null;
    let batchTesting = false;
    let batchQueue = [];
    let batchResults = [];
    let offerCodes = [];
    let wocCodes = [];
    let skipExisting = GM_getValue('skipExisting', true);
    let isPanelVisible = true;
    // 通知设置对象
    let notificationSettings = GM_getValue('notificationSettings', {
        enableSound: true,
        enableMobilePopup: true,
        enableDesktop: true,
        enableEmail: false
    });


    // --- 核心功能函数 ---

    // 清理URL中的特殊字符
    function cleanUrl(url) {
        if (!url) return '';
        return url.replace(/[\u200B-\u200D\uFEFF\u00A0]/g, '')
                  .replace(/%E2%80%8[A-F0-9]/g, '')
                  .replace(/[^\x20-\x7E]/g, '').trim();
    }

    // 更新链接结果 (自动检测时调用)
    function autoUpdateLinkResult(wocCode, linkType, isValid, reason, fullUrl) {
        if (AMEX_DEBUG) console.log(`[DEBUG] autoUpdateLinkResult called: woc=${wocCode}, type=${linkType}, valid=${isValid}, url=${fullUrl}`);

        let updated = false;
        // 优先精确匹配未完成的记录
        let matchingAttempt = attempts.find(a =>
            !a.verified && !a.rejected &&
            a.wocCode === wocCode &&
            (a.testedType === linkType || !a.testedType || a.testedType === '未知')
        );

        // 如果精确匹配不到，尝试更宽松的匹配 (woc码包含，链接类型包含)
        if (!matchingAttempt && wocCode) {
            matchingAttempt = attempts.find(a =>
                !a.verified && !a.rejected &&
                a.wocCode && (a.wocCode.includes(wocCode) || wocCode.includes(a.wocCode)) &&
                (a.testedType === linkType || !a.testedType || a.testedType === '未知' || (linkType && a.testedType && linkType.includes(a.testedType)))
            );
            if (AMEX_DEBUG && matchingAttempt) console.log(`[DEBUG] Found loose match (WOC includes):`, matchingAttempt);
        }

        // 如果还是没有，尝试通过URL匹配 (如果URL存在)
        if (!matchingAttempt && fullUrl) {
             matchingAttempt = attempts.find(a =>
                !a.verified && !a.rejected &&
                a.testedUrl && cleanUrl(a.testedUrl) === cleanUrl(fullUrl)
            );
             if (AMEX_DEBUG && matchingAttempt) console.log(`[DEBUG] Found URL match:`, matchingAttempt);
        }

        // 如果还是没有，尝试匹配最近一个未完成且类型匹配的记录
        if (!matchingAttempt) {
             matchingAttempt = attempts.find(a =>
                !a.verified && !a.rejected &&
                (a.testedType === linkType || !a.testedType || a.testedType === '未知')
            );
             if (AMEX_DEBUG && matchingAttempt) console.log(`[DEBUG] Found latest pending match by type:`, matchingAttempt);
        }


        if (matchingAttempt) {
            if (AMEX_DEBUG) console.log(`[DEBUG] Updating attempt:`, matchingAttempt);
            // 避免重复更新统计数据
            const needsStatUpdate = !matchingAttempt.verified && !matchingAttempt.rejected;

            matchingAttempt.status = isValid ? 'success' : 'error';
            matchingAttempt.verified = isValid;
            matchingAttempt.rejected = !isValid;
            // 只有当本地记录没有类型时才更新类型，防止覆盖手动测试的类型
            if (!matchingAttempt.testedType || matchingAttempt.testedType === '未知') {
                 matchingAttempt.testedType = linkType;
            }
            matchingAttempt.verificationReason = reason;
            matchingAttempt.verifiedAt = Date.now();
            matchingAttempt.testedUrl = fullUrl; // 记录测试过的URL

            if (needsStatUpdate) {
                stats.totalTested++;
                if (isValid) {
                    stats.verified++;
                } else {
                    stats.rejected++;
                }
            }

            GM_setValue('attempts', attempts);
            GM_setValue('stats', stats);
            updateAttemptsList();
            updateStats();
            updateStatus(`自动检测到 ${wocCode || '未知WOC'} 的 ${linkType} 结果: ${isValid ? '有效' : '无效'}`);
            updated = true;
        } else {
             if (AMEX_DEBUG) console.log(`[DEBUG] No matching attempt found for woc=${wocCode}, type=${linkType}`);
        }

        return updated;
    }

    // 检测当前页面结果
    function checkCurrentPageForResults() {
        const currentUrl = cleanUrl(window.location.href);
        if (AMEX_DEBUG) console.log('[DEBUG] Checking current page:', currentUrl);

        // 简单判断是否可能是结果页 (包含 apply 或 card-application)
        if (!currentUrl.includes('apply') && !currentUrl.includes('card-application')) {
             if (AMEX_DEBUG) console.log('[DEBUG] Not an application page, skipping check.');
            return;
        }

        // **修改点：增加延迟时间**
        setTimeout(() => {
            if (AMEX_DEBUG) console.log('[DEBUG] Running page check after delay.');
            const pageContent = document.body.innerText || '';
            // const pageHtml = document.body.innerHTML || ''; // 通常innerText足够
            let pageType = 'unknown';
            let isValid = false;
            let reason = '';

            // --- 结果判断逻辑 (与原版一致) ---
            if (pageContent.includes('Upgrade Now') || pageContent.includes('upgrade now') || pageContent.includes('upgrade your Card')) {
                pageType = '升级链接';
                isValid = true;
                reason = '找到升级选项';
            } else if (pageContent.includes('You may add up to 99 total Employee Cards') || pageContent.includes('Employee Cards') || pageContent.match(/add.*Employee Cards/i) || pageContent.includes('Additional Card')) {
                pageType = '副卡链接';
                isValid = true;
                reason = '找到副卡选项';
            } else if (pageContent.includes('temporarily down') || pageContent.includes('service is temporarily unavailable')) {
                pageType = 'IP被限制/服务不可用';
                isValid = false;
                reason = '页面提示服务暂时不可用或IP受限';
            } else if (currentUrl.includes('/error') || pageContent.includes('Page Not Found') || pageContent.includes('Error') || pageContent.includes('unable to process your request')) {
                pageType = '错误页面';
                isValid = false;
                reason = '页面显示错误或无法处理请求';
            } else {
                pageType = '无效链接';
                isValid = false;
                reason = '未找到明确的有效或错误内容';
            }
            // --- 结束结果判断 ---

            if (AMEX_DEBUG) console.log(`[DEBUG] Page check result: type=${pageType}, valid=${isValid}, reason=${reason}`);

            // 显示页面顶部通知
            showPageResultNotification(pageType, isValid, reason);

            // 提取WOC码
            const wocMatches = currentUrl.match(/(?:[-\/])([A-Z][A-Z0-9]{4,20})(?:\?|$|\s|\/|&|#)/i) ||
                               currentUrl.match(/WOC[A-Z0-9]+/i) ||
                               // 尝试从页面内容提取 (如果URL没有)
                               pageContent.match(/WOC=([A-Z0-9]+)/i) ||
                               currentUrl.match(/[A-Z0-9]{5,15}/i); // 最后的通用匹配

            let detectedWocCode = '';
            if (wocMatches && wocMatches[1]) {
                detectedWocCode = wocMatches[1];
            } else if (wocMatches && wocMatches[0]) {
                 // 检查是否是完整匹配，避免提取到非WOC码
                 if(/^[A-Z][A-Z0-9]{4,}$/i.test(wocMatches[0]) || wocMatches[0].startsWith('WOC')) {
                    detectedWocCode = wocMatches[0];
                 }
            }
            if (AMEX_DEBUG) console.log(`[DEBUG] Detected WOC: ${detectedWocCode}`);


            // 判断链接类型
            let linkType = '未知链接';
            if (currentUrl.includes('upgrade')) {
                linkType = '升级链接';
            } else if (currentUrl.includes('supps') || currentUrl.includes('supplementary')) {
                linkType = '副卡链接';
            } else if (isValid) { // 如果页面有效但URL没特征，根据内容判断
                if (pageType === '升级链接') linkType = '升级链接';
                if (pageType === '副卡链接') linkType = '副卡链接';
            }
            if (AMEX_DEBUG) console.log(`[DEBUG] Detected Link Type: ${linkType}`);

            // 尝试更新本地记录
            const updatedLocally = autoUpdateLinkResult(detectedWocCode, linkType, isValid, reason, currentUrl);

            // 存储到localStorage供其他标签页同步
            storeTestResult(detectedWocCode, linkType, isValid, reason, currentUrl);

            // 如果找到有效链接，尝试发送邮件
            if (isValid) {
                tryToSendEmailNotification(detectedWocCode, linkType, reason, currentUrl);
            }

        }, 3000); // **修改点：增加到3秒延迟**
    }

    // 显示页面顶部通知
    function showPageResultNotification(pageType, isValid, reason) {
        // 移除旧通知
        const oldNotification = document.getElementById('amex-page-notification');
        if (oldNotification) {
            oldNotification.remove();
        }

        const notification = document.createElement('div');
        notification.id = 'amex-page-notification';
        notification.className = 'amex-page-notification';

        let notificationClass = isValid ? 'success' : (pageType.includes('IP') ? 'warning' : 'error');
        notification.classList.add(notificationClass);

        const icon = isValid ? '✅' : (notificationClass === 'warning' ? '⚠️' : '❌');
        notification.innerHTML = `${icon} ${pageType}: ${reason}`;

        document.body.appendChild(notification);

        // 触发显示动画
        setTimeout(() => notification.classList.add('show'), 50);

        // 触发综合通知 (声音、桌面等)
        const notificationTitle = isValid ? `发现有效的AMEX ${pageType}` :
                                (notificationClass === 'warning' ? 'AMEX 警告' : 'AMEX链接无效');
        triggerNotifications(notificationTitle, `${pageType}: ${reason}`, isValid);

        // 自动消失
        setTimeout(() => {
            if(notification.parentNode) {
                 notification.classList.remove('show');
                 // 等待动画完成再移除
                 setTimeout(() => {
                     if(notification.parentNode) notification.remove();
                 }, 500);
            }
        }, 6000); // 显示6秒
    }

    // 存储测试结果到localStorage
    function storeTestResult(wocCode, linkType, isValid, reason, url) {
        try {
            let testResults = JSON.parse(localStorage.getItem('amex_test_results') || '[]');
            const newResult = {
                wocCode: wocCode || '', // 确保有值
                linkType: linkType || '未知链接',
                isValid,
                reason,
                timestamp: Date.now(),
                url: cleanUrl(url) || ''
            };

            // 检查是否已存在几乎相同的结果 (防止短时间重复添加)
            const exists = testResults.some(r =>
                r.wocCode === newResult.wocCode &&
                r.linkType === newResult.linkType &&
                r.isValid === newResult.isValid &&
                Math.abs(r.timestamp - newResult.timestamp) < 2000 // 2秒内相同结果
            );

            if (!exists) {
                testResults.push(newResult);
                // 最多保存50条结果
                if (testResults.length > 50) {
                    testResults = testResults.slice(-50);
                }
                localStorage.setItem('amex_test_results', JSON.stringify(testResults));
                 if (AMEX_DEBUG) console.log('[DEBUG] Stored result to localStorage:', newResult);
            } else {
                 if (AMEX_DEBUG) console.log('[DEBUG] Duplicate result detected, not storing again:', newResult);
            }
        } catch (e) {
            console.error('存储测试结果到localStorage失败', e);
            updateStatus('错误: 存储localStorage失败');
        }
    }

    // 从其他窗口同步测试结果
    function syncTestResultsFromOtherWindows() {
        try {
            const testResults = JSON.parse(localStorage.getItem('amex_test_results') || '[]');
            if (testResults.length === 0) return;

            if (AMEX_DEBUG) console.log(`[DEBUG] Syncing from localStorage, found ${testResults.length} results.`);

            let updatedCount = 0;
            let processedTimestamps = new Set(); // 跟踪已处理的时间戳，避免重复处理

            // 反向遍历，优先处理最新的结果
            for (let i = testResults.length - 1; i >= 0; i--) {
                const result = testResults[i];

                // 检查是否已处理过这个结果
                const resultKey = `${result.timestamp}-${result.wocCode}-${result.linkType}`;
                if (processedTimestamps.has(resultKey)) {
                    continue; // 跳过已处理
                }

                if (AMEX_DEBUG) console.log('[DEBUG] Processing result from storage:', result);

                // **修改点：改进匹配逻辑**
                // 1. 尝试精确匹配 (WOC + Type) 未完成的
                let matchingAttempt = attempts.find(a =>
                    !a.verified && !a.rejected &&
                    a.wocCode === result.wocCode &&
                    (a.testedType === result.linkType || !a.testedType || a.testedType === '未知链接')
                );

                // 2. 如果没有，尝试宽松匹配 (WOC包含 + Type包含) 未完成的
                if (!matchingAttempt && result.wocCode) {
                    matchingAttempt = attempts.find(a =>
                        !a.verified && !a.rejected &&
                        a.wocCode && (a.wocCode.includes(result.wocCode) || result.wocCode.includes(a.wocCode)) &&
                        (a.testedType === result.linkType || !a.testedType || a.testedType === '未知链接' || (result.linkType && a.testedType && result.linkType.includes(a.testedType)))
                    );
                     if (AMEX_DEBUG && matchingAttempt) console.log(`[DEBUG] Sync: Found loose match (WOC includes):`, matchingAttempt);
                }

                 // 3. 如果没有，尝试URL匹配 未完成的
                if (!matchingAttempt && result.url) {
                     matchingAttempt = attempts.find(a =>
                        !a.verified && !a.rejected &&
                        a.testedUrl && cleanUrl(a.testedUrl) === cleanUrl(result.url)
                    );
                     if (AMEX_DEBUG && matchingAttempt) console.log(`[DEBUG] Sync: Found URL match:`, matchingAttempt);
                }

                // 4. 如果还没有，尝试匹配最近一个未完成且类型匹配的
                if (!matchingAttempt) {
                     matchingAttempt = attempts.find(a =>
                        !a.verified && !a.rejected &&
                        (a.testedType === result.linkType || !a.testedType || a.testedType === '未知链接')
                    );
                     if (AMEX_DEBUG && matchingAttempt) console.log(`[DEBUG] Sync: Found latest pending match by type:`, matchingAttempt);
                }


                if (matchingAttempt) {
                     if (AMEX_DEBUG) console.log('[DEBUG] Sync: Found matching attempt, updating:', matchingAttempt);
                    // 避免重复更新统计
                    const needsStatUpdate = !matchingAttempt.verified && !matchingAttempt.rejected;

                    matchingAttempt.status = result.isValid ? 'success' : 'error';
                    matchingAttempt.verified = result.isValid;
                    matchingAttempt.rejected = !result.isValid;
                     // 只有当本地记录没有类型时才更新类型
                    if (!matchingAttempt.testedType || matchingAttempt.testedType === '未知链接') {
                         matchingAttempt.testedType = result.linkType;
                    }
                    matchingAttempt.verificationReason = result.reason;
                    matchingAttempt.verifiedAt = result.timestamp;
                    matchingAttempt.testedUrl = result.url; // 更新URL

                    if (needsStatUpdate) {
                        stats.totalTested++;
                        if (result.isValid) {
                            stats.verified++;
                        } else {
                            stats.rejected++;
                        }
                    }
                    updatedCount++;
                    processedTimestamps.add(resultKey); // 标记为已处理
                } else {
                     if (AMEX_DEBUG) console.log(`[DEBUG] Sync: No matching attempt found for result:`, result);
                }
            }

            if (updatedCount > 0) {
                GM_setValue('attempts', attempts);
                GM_setValue('stats', stats);
                updateAttemptsList();
                updateStats();
                updateStatus(`从其他窗口同步了 ${updatedCount} 个结果`);
                 if (AMEX_DEBUG) console.log(`[DEBUG] Sync finished, updated ${updatedCount} attempts.`);

                // **优化：只移除被成功匹配处理的结果**
                const remainingResults = testResults.filter(result => {
                     const resultKey = `${result.timestamp}-${result.wocCode}-${result.linkType}`;
                     return !processedTimestamps.has(resultKey);
                });
                localStorage.setItem('amex_test_results', JSON.stringify(remainingResults));
                 if (AMEX_DEBUG) console.log(`[DEBUG] Cleaned localStorage, remaining: ${remainingResults.length}`);

            } else {
                 if (AMEX_DEBUG) console.log('[DEBUG] Sync finished, no attempts updated.');
                 // 如果长时间没有更新，可以考虑清理旧的localStorage记录
                 if(testResults.length > 20) { // 例如，超过20条且没匹配到
                     const recentResults = testResults.slice(-20); // 只保留最近20条
                     localStorage.setItem('amex_test_results', JSON.stringify(recentResults));
                      if (AMEX_DEBUG) console.log('[DEBUG] Cleaned old localStorage results as no match found.');
                 }
            }

        } catch (e) {
            console.error('同步其他窗口测试结果失败', e);
            updateStatus('错误: 同步localStorage结果失败');
        }
    }

    // 清理localStorage中的测试结果 (现在主要由sync函数处理，保留此函数用于手动清理)
    function clearLocalStorageResults() {
        localStorage.removeItem('amex_test_results');
        updateStatus('已手动清除LocalStorage中的同步缓存');
    }

    // **修改点：缩短同步间隔**
    setInterval(syncTestResultsFromOtherWindows, 2000); // 每2秒同步一次

    // --- UI 和交互函数 ---

    // 创建悬浮按钮
    function createFloatButton() {
        if (document.getElementById('amex-float-btn')) return;
        const floatBtn = document.createElement('button');
        floatBtn.id = 'amex-float-btn';
        floatBtn.className = 'amex-float-btn';
        floatBtn.innerHTML = 'A';
        floatBtn.title = '打开AMEX助手';
        floatBtn.addEventListener('click', showPanel);
        document.body.appendChild(floatBtn);
    }

    // 显示面板
    function showPanel() {
        const floatBtn = document.getElementById('amex-float-btn');
        if (floatBtn) floatBtn.remove();
        const panel = document.getElementById('amex-helper-panel');
        if (panel) {
            panel.style.display = 'block';
        } else {
            createPanel(); // 如果面板不存在则创建
        }
        isPanelVisible = true;
    }

    // 隐藏面板
    function hidePanel() {
        const panel = document.getElementById('amex-helper-panel');
        if (panel) panel.style.display = 'none';
        isPanelVisible = false;
        createFloatButton(); // 显示悬浮按钮
    }

    // 解析批量输入 (与原版一致)
    function parseCodesInput(input) {
        const lines = input.split('\n');
        const offerCodes = new Set();
        const wocCodes = new Set();

        lines.forEach(line => {
            line = line.trim();
            if (!line) return;

            const cleanLine = line.replace(/\s+/g, ' ').trim();
            const compositePattern = /^(\d{5}-\d+-\d+)-([A-Z][A-Z0-9]+)/;
            const compositeMatch = line.match(compositePattern);
            if (compositeMatch) {
                offerCodes.add(compositeMatch[1]);
                wocCodes.add(compositeMatch[2]);
                return;
            }

            const isOfferCodePattern = /^\d{5}-\d+-\d+$/;
            const isWOCCodePattern = /^([A-Z][A-Z0-9]+)$/;

            if (line.includes(',')) {
                const [offerPart, wocPart] = line.split(',').map(s => s.trim());
                if (offerPart) offerCodes.add(offerPart);
                if (wocPart) wocCodes.add(wocPart);
                return;
            }

            if (line.includes('\t') || /\s{2,}/.test(line)) {
                const parts = line.split(/\s+/).filter(p => p.trim());
                parts.forEach(part => {
                    part = part.trim();
                    if (!part) return;
                    if (isOfferCodePattern.test(part)) {
                        offerCodes.add(part);
                    } else if (part.length > 4 && (part.startsWith('WOC') || isWOCCodePattern.test(part))) { // WOC长度放宽到5
                        wocCodes.add(part);
                    }
                });
                return;
            }

            if (isOfferCodePattern.test(line)) {
                offerCodes.add(line);
            } else if (line.length > 4 && (line.startsWith('WOC') || isWOCCodePattern.test(line))) {
                wocCodes.add(line);
            } else if (/^\d/.test(line) && line.includes('-')) { // 稍微放宽Offer Code判断
                offerCodes.add(line);
            } else if (/^[A-Z]/.test(line) && line.length > 4) { // 字母开头且长度足够，认为是WOC
                wocCodes.add(line);
            }
        });

        return {
            offerCodes: Array.from(offerCodes),
            wocCodes: Array.from(wocCodes)
        };
    }

    // 更新批量组合预览
    function updateCombinations() {
        const batchInput = document.getElementById('batchCodes').value.trim();
        const infoElement = document.getElementById('comboInfo');
        if (!infoElement) return; // 确保元素存在

        if (!batchInput) {
            infoElement.innerHTML = `组合预览: <b>0</b> 种组合`;
            offerCodes = []; // 清空全局变量
            wocCodes = [];   // 清空全局变量
            return;
        }

        const parsedCodes = parseCodesInput(batchInput);
        offerCodes = parsedCodes.offerCodes; // 更新全局变量
        wocCodes = parsedCodes.wocCodes;   // 更新全局变量

        let html = `<div>识别到 <b>${offerCodes.length}</b> Offer Code, <b>${wocCodes.length}</b> WOC Code</div>`;
        let totalCombos = 0;

        if (offerCodes.length === 0 && wocCodes.length > 0) {
            totalCombos = wocCodes.length;
            html += `<div>将使用空 Offer Code 进行测试</div>`;
        } else if (wocCodes.length === 0 && offerCodes.length > 0) {
            totalCombos = offerCodes.length;
            html += `<div>将使用空 WOC Code 进行测试</div>`;
        } else {
            totalCombos = offerCodes.length * wocCodes.length;
        }

        if (totalCombos === 0 && (offerCodes.length > 0 || wocCodes.length > 0)) {
             // 处理只有一个列表有代码的情况
             totalCombos = Math.max(offerCodes.length, wocCodes.length);
             if(offerCodes.length === 0) html += `<div>将使用空 Offer Code 进行测试</div>`;
             if(wocCodes.length === 0) html += `<div>将使用空 WOC Code 进行测试</div>`;
        }


        let skippedCombos = 0;
        if (skipExisting && totalCombos > 0) {
            const currentOfferCodes = offerCodes.length > 0 ? offerCodes : [''];
            const currentWocCodes = wocCodes.length > 0 ? wocCodes : [''];
            currentOfferCodes.forEach(offerCode => {
                currentWocCodes.forEach(wocCode => {
                    if (combinationExists(offerCode, wocCode)) {
                        skippedCombos++;
                    }
                });
            });
        }

        const newCombos = totalCombos - skippedCombos;
        html += `<div>总组合: <b>${totalCombos}</b>`;
        if (skipExisting && skippedCombos > 0) {
            html += ` (跳过 ${skippedCombos} 个已测试, 新增 ${newCombos} 个)`;
        } else if (!skipExisting && skippedCombos > 0) {
             html += ` (重新测试 ${skippedCombos} 个已存在)`;
        }
        html += `</div>`;

        if (offerCodes.length > 0) {
            html += `<div style="font-size:10px;margin-top:3px;">Offer Codes: ${offerCodes.slice(0, 5).join(', ')}${offerCodes.length > 5 ? '...' : ''}</div>`;
        }
        if (wocCodes.length > 0) {
            html += `<div style="font-size:10px;margin-top:3px;">WOC Codes: ${wocCodes.slice(0, 5).join(', ')}${wocCodes.length > 5 ? '...' : ''}</div>`;
        }

        infoElement.innerHTML = html;
    }

    // 检查组合是否存在 (与原版一致)
    function combinationExists(offerCode, wocCode) {
        return attempts.some(attempt =>
            attempt.offerCode === offerCode &&
            attempt.wocCode === wocCode
        );
    }

    // 添加批量工具 (与原版一致)
    function addBatchTools() {
        const batchTab = document.getElementById('batch-tab');
        if (!batchTab || document.getElementById('cleanFormatBtn')) return; // 防止重复添加

        const toolsDiv = document.createElement('div');
        toolsDiv.className = 'batch-tools section';
        toolsDiv.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 5px;">批量工具</div>
            <button id="cleanFormatBtn" class="btn-control" style="font-size: 11px; padding: 3px 8px;">清理格式</button>
            <button id="extractOffersBtn" class="btn-control" style="font-size: 11px; padding: 3px 8px;">提取Offer Codes</button>
            <button id="extractWOCsBtn" class="btn-control" style="font-size: 11px; padding: 3px 8px;">提取WOC Codes</button>
            <button id="extractFromLinkBtn" class="btn-control" style="font-size: 11px; padding: 3px 8px;">从链接提取</button>
        `;

        const comboInfo = document.getElementById('comboInfo');
        if (comboInfo && comboInfo.parentNode) {
            comboInfo.parentNode.insertBefore(toolsDiv, comboInfo.nextSibling);
        } else {
            batchTab.appendChild(toolsDiv);
        }

        document.getElementById('cleanFormatBtn').addEventListener('click', cleanInputFormat);
        document.getElementById('extractOffersBtn').addEventListener('click', () => extractCodes('offer'));
        document.getElementById('extractWOCsBtn').addEventListener('click', () => extractCodes('woc'));
        document.getElementById('extractFromLinkBtn').addEventListener('click', extractFromLinks);
    }

    // 从链接提取代码 (与原版一致)
    function extractFromLinks() {
        const batchInput = document.getElementById('batchCodes');
        const input = batchInput.value.trim();
        if (!input) {
            updateStatus('请先输入包含链接的文本');
            return;
        }

        const extractedOffers = new Set();
        const extractedWOCs = new Set();
        const lines = input.split('\n');

        lines.forEach(line => {
            line = cleanUrl(line); // 清理每一行
            // 1. 升级链接
            const upgradePattern = /upgrade\/.*?\/(\d{5}-\d+-\d+)[-\/]([A-Z0-9]+)/i;
            let match = line.match(upgradePattern);
            if (match) {
                if (match[1]) extractedOffers.add(match[1]);
                if (match[2]) extractedWOCs.add(match[2]);
            }
            // 2. 副卡链接
            const suppPattern = /stand-alone-supps\/(\d{5}-\d+-\d+)[-\/]([A-Z0-9]+)/i;
            match = line.match(suppPattern);
            if (match) {
                if (match[1]) extractedOffers.add(match[1]);
                if (match[2]) extractedWOCs.add(match[2]);
            }
            // 3. 通用WOC提取
            const wocInUrlPattern = /[-=\/]([A-Z][A-Z0-9]{4,})(?:[?&]|$|\s|"|'|#)/i; // 改进正则
            const wocMatches = line.matchAll(wocInUrlPattern);
            for (const wocMatch of wocMatches) {
                 if (wocMatch[1] && (wocMatch[1].startsWith('WOC') || /^[A-Z]{2,}/.test(wocMatch[1]))) { // 确保是字母开头
                    extractedWOCs.add(wocMatch[1]);
                 }
            }
             // 4. 尝试提取URL参数中的Offer Code
            const offerParamMatch = line.match(/[?&]offerid=(\d{5}-\d+-\d+)/i);
             if(offerParamMatch && offerParamMatch[1]) {
                 extractedOffers.add(offerParamMatch[1]);
             }
        });

        const offerCodesArray = Array.from(extractedOffers);
        const wocCodesArray = Array.from(extractedWOCs);
        let output = '';

        if (offerCodesArray.length > 0 && wocCodesArray.length > 0) {
            offerCodesArray.forEach(offer => {
                wocCodesArray.forEach(woc => {
                    output += `${offer},${woc}\n`;
                });
            });
        } else if (offerCodesArray.length > 0) {
            offerCodesArray.forEach(code => output += `${code}\n`);
        } else if (wocCodesArray.length > 0) {
            wocCodesArray.forEach(code => output += `${code}\n`);
        }

        batchInput.value = output;
        updateStatus(`已从链接中提取: ${offerCodesArray.length} Offer Code, ${wocCodesArray.length} WOC Code`);
        updateCombinations();
    }

    // 清理输入格式 (与原版一致)
    function cleanInputFormat() {
        const batchInput = document.getElementById('batchCodes');
        const input = batchInput.value.trim();
        if (!input) return;

        const parsedCodes = parseCodesInput(input);
        const offerCodes = parsedCodes.offerCodes;
        const wocCodes = parsedCodes.wocCodes;
        let output = '';

        if (offerCodes.length > 0 && wocCodes.length > 0) {
            offerCodes.forEach(offerCode => {
                wocCodes.forEach(wocCode => {
                    output += `${offerCode},${wocCode}\n`;
                });
            });
        } else if (offerCodes.length > 0) {
            offerCodes.forEach(offerCode => output += `${offerCode}\n`);
        } else if (wocCodes.length > 0) {
            wocCodes.forEach(wocCode => output += `${wocCode}\n`);
        }

        batchInput.value = output;
        updateStatus('格式已清理，识别了 ' + offerCodes.length + ' 个Offer Code和 ' + wocCodes.length + ' 个WOC Code');
        updateCombinations();
    }

    // 提取特定类型代码 (与原版一致)
    function extractCodes(type) {
        const batchInput = document.getElementById('batchCodes');
        const input = batchInput.value.trim();
        if (!input) return;

        const parsedCodes = parseCodesInput(input);
        let output = '';
        if (type === 'offer') {
            parsedCodes.offerCodes.forEach(code => output += code + '\n');
            updateStatus('已提取 ' + parsedCodes.offerCodes.length + ' 个Offer Code');
        } else {
            parsedCodes.wocCodes.forEach(code => output += code + '\n');
            updateStatus('已提取 ' + parsedCodes.wocCodes.length + ' 个WOC Code');
        }
        batchInput.value = output;
        updateCombinations();
    }

    // 保存设置 (合并通知设置保存逻辑)
    function saveSettings() {
        // 读取所有设置项的值
        const serverUrlVal = document.getElementById('serverUrl').value.trim();
        const scriptDomainsVal = document.getElementById('scriptDomains').value.trim();
        const forceDesktopModeVal = document.getElementById('forceDesktopMode').checked;
        const emailNotificationVal = document.getElementById('emailNotification').value.trim();
        const smtpServerVal = document.getElementById('smtpServer').value.trim();
        const smtpUserVal = document.getElementById('smtpUser').value.trim();
        const smtpPasswordVal = document.getElementById('smtpPassword').value.trim();
        const smtpPortVal = document.getElementById('smtpPort').value.trim();
        const smtpSslVal = document.getElementById('smtpSsl').checked;
        const debugModeVal = document.getElementById('enableDebug').checked;

        // 读取通知设置项的值
        const enableSoundVal = document.getElementById('enableSound').checked;
        const enableMobilePopupVal = document.getElementById('enableMobilePopup').checked;
        const enableDesktopVal = document.getElementById('enableDesktopNotif').checked;
        const enableEmailVal = document.getElementById('enableEmailNotif').checked;

        // 保存常规设置
        GM_setValue('serverUrl', serverUrlVal);
        GM_setValue('scriptDomains', scriptDomainsVal);
        GM_setValue('forceDesktopMode', forceDesktopModeVal);
        GM_setValue('emailNotification', emailNotificationVal);
        GM_setValue('smtpServer', smtpServerVal);
        GM_setValue('smtpUser', smtpUserVal);
        GM_setValue('smtpPassword', smtpPasswordVal); // 安全提示：明文存储密码不安全
        GM_setValue('smtpPort', smtpPortVal);
        GM_setValue('smtpSsl', smtpSslVal);
        GM_setValue('AMEX_DEBUG', debugModeVal);
        AMEX_DEBUG = debugModeVal; // 更新当前会话状态

        // 更新并保存通知设置对象
        notificationSettings.enableSound = enableSoundVal;
        notificationSettings.enableMobilePopup = enableMobilePopupVal;
        notificationSettings.enableDesktop = enableDesktopVal;
        notificationSettings.enableEmail = enableEmailVal;
        GM_setValue('notificationSettings', notificationSettings); // **直接保存对象**

        updateStatus('设置已保存');
        if (AMEX_DEBUG) console.log('[DEBUG] Settings saved:', GM_listValues());
    }

    // 生成脚本设置 (与原版一致，但使用更健壮的模态框关闭)
    function generateScriptSettings() {
        const domains = document.getElementById('scriptDomains').value.trim();
        if (!domains) {
            updateStatus('请先输入域名');
            return;
        }
        const domainList = domains.split(',').map(d => d.trim()).filter(d => d);
        if (domainList.length === 0) {
            updateStatus('没有有效的域名');
            return;
        }

        const matchRules = domainList.map(domain => `// @match        *://*.${domain}/*`).join('\n');
        const scriptHeader =
`// ==UserScript==
// @name         AMEX Code Helper (通知设置保存优化)
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  自动提交AMEX offer code和WOC code，防止会话超时，支持批量测试，自动识别链接有效性，并记录结果 (已优化同步逻辑和通知设置保存)
// @author       Your Name & Gemini
${matchRules}
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// ==/UserScript==`;

        // 创建模态窗口
        const overlay = document.createElement('div');
        overlay.className = 'amex-helper-overlay'; // 使用遮罩层
        overlay.id = 'settings-modal-overlay';

        const modal = document.createElement('div');
        modal.className = 'amex-helper modal'; // 使用标准模态框样式
        modal.innerHTML = `
            <div class="modal-content">
                <button class="close-btn" id="closeSettingsModalBtn" title="关闭">&times;</button>
                <h3 class="modal-title">脚本设置已生成</h3>
                <p>请将以下设置复制到Tampermonkey脚本的头部，替换旧的设置：</p>
                <div style="background-color:#f5f5f5;padding:10px;border-radius:5px;margin:10px 0;max-height:300px;overflow-y:auto;border: 1px solid #ddd;">
                    <pre style="margin:0;white-space:pre-wrap;word-break:break-all;font-family:monospace;font-size:12px;">${scriptHeader}</pre>
                </div>
                <div style="text-align:center;margin-top:15px;">
                    <button id="copySettingsBtn" class="btn-control">复制设置</button>
                </div>
            </div>
        `;
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // 添加复制功能
        document.getElementById('copySettingsBtn').addEventListener('click', () => {
            navigator.clipboard.writeText(scriptHeader).then(() => {
                const copyBtn = document.getElementById('copySettingsBtn');
                copyBtn.textContent = '✓ 已复制';
                copyBtn.style.backgroundColor = '#218838';
                setTimeout(() => {
                    copyBtn.textContent = '复制设置';
                    copyBtn.style.backgroundColor = '#28a745';
                }, 1500);
            }).catch(err => {
                updateStatus('复制失败: ' + err);
                // Fallback for older browsers
                try {
                    const tempTextarea = document.createElement('textarea');
                    tempTextarea.value = scriptHeader;
                    document.body.appendChild(tempTextarea);
                    tempTextarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(tempTextarea);
                     const copyBtn = document.getElementById('copySettingsBtn');
                     copyBtn.textContent = '✓ 已复制 (Fallback)';
                     copyBtn.style.backgroundColor = '#218838';
                     setTimeout(() => {
                         copyBtn.textContent = '复制设置';
                         copyBtn.style.backgroundColor = '#28a745';
                     }, 1500);
                } catch(fallbackErr) {
                     console.error("Fallback copy failed:", fallbackErr);
                     updateStatus('复制失败');
                }
            });
        });

        // 添加关闭功能
        const closeBtn = document.getElementById('closeSettingsModalBtn');
        const closeOverlay = () => {
             if(overlay.parentNode) overlay.remove();
        };
        closeBtn.addEventListener('click', closeOverlay);
        overlay.addEventListener('click', (e) => { // 点击遮罩关闭
            if (e.target === overlay) {
                closeOverlay();
            }
        });

        GM_setValue('scriptDomains', domains); // 保存设置
        updateStatus('已生成脚本设置');
    }

    // 更新统计数据显示
    function updateStats() {
        const totalEl = document.getElementById('totalTested');
        const verifiedEl = document.getElementById('verified');
        const rejectedEl = document.getElementById('rejected');
        if (totalEl) totalEl.textContent = stats.totalTested;
        if (verifiedEl) verifiedEl.textContent = stats.verified;
        if (rejectedEl) rejectedEl.textContent = stats.rejected;
    }

    // 导出到服务器 (与原版一致)
    function exportToServer() {
        const currentServerUrl = GM_getValue('serverUrl', ''); // 获取当前设置的URL
        if (!currentServerUrl) {
            updateStatus('错误: 请在设置中设定服务器URL');
            return;
        }
        if (attempts.length === 0) {
            updateStatus('没有可导出的尝试记录');
            return;
        }
        updateStatus('正在导出到服务器...');
        const dataToSend = { attempts: attempts, stats: stats, timestamp: Date.now() };
        GM_xmlhttpRequest({
            method: 'POST',
            url: currentServerUrl,
            data: JSON.stringify(dataToSend),
            headers: { 'Content-Type': 'application/json' },
            onload: function(response) {
                if (response.status >= 200 && response.status < 300) {
                    updateStatus('数据已成功导出到服务器');
                } else {
                    updateStatus(`导出失败: ${response.status} ${response.statusText}`);
                    console.error("导出失败:", response);
                }
            },
            onerror: function(error) {
                updateStatus('导出失败: 网络错误');
                 console.error("导出网络错误:", error);
            },
            ontimeout: function() {
                updateStatus('导出失败: 请求超时');
            }
        });
    }

    // 更新尝试记录列表显示
    function updateAttemptsList() {
        const listBody = document.getElementById('attemptsList');
        if (!listBody) return;

        listBody.innerHTML = ''; // 清空列表

        // 只显示最近 N 条记录，或根据需要添加分页
        const displayAttempts = attempts; //.slice(0, 50); // 例如只显示最近50条

        displayAttempts.forEach((attempt, index) => {
            const row = document.createElement('tr');
            if (attempt.verified) row.classList.add('verified');
            if (attempt.rejected) row.classList.add('rejected');

            // Helper to create cell
            const createCell = (text, className = '') => {
                const cell = document.createElement('td');
                cell.textContent = text || '-';
                if (className) cell.className = className;
                return cell;
            };

            row.appendChild(createCell(attempt.offerCode));
            row.appendChild(createCell(attempt.wocCode));
            row.appendChild(createCell(new Date(attempt.timestamp).toLocaleString()));
            row.appendChild(createCell(attempt.testedType || '未知'));

            // Status Cell
            let statusText = '⏳ 待测试';
            let statusClass = 'pending';
            if (attempt.verified) {
                statusText = '✅ 已验证'; statusClass = 'success';
            } else if (attempt.rejected) {
                statusText = '❌ 已否决'; statusClass = 'fail';
            } else if (attempt.status === 'success') {
                 // 如果通过页面检测成功，但未手动验证
                 statusText = '✔️ 检测成功'; statusClass = 'success';
            } else if (attempt.status === 'error') {
                 // 如果通过页面检测失败，但未手动验证
                 statusText = '✖️ 检测失败'; statusClass = 'fail';
            }
            row.appendChild(createCell(statusText, statusClass));

            // Action Cell
            const actionCell = document.createElement('td');
            if (!attempt.verified && !attempt.rejected) {
                const verifyBtn = document.createElement('button');
                verifyBtn.textContent = '验证';
                verifyBtn.className = 'verify-btn';
                // 使用 data-* 属性传递索引，避免闭包问题
                verifyBtn.dataset.index = attempts.indexOf(attempt); // 获取在完整attempts数组中的索引
                verifyBtn.addEventListener('click', (e) => {
                    const attemptIndex = parseInt(e.target.dataset.index, 10);
                    if (!isNaN(attemptIndex)) {
                        showVerificationModal(attemptIndex);
                    }
                });
                actionCell.appendChild(verifyBtn);
            }
             // 添加查看原因按钮
             if (attempt.verificationReason) {
                 const reasonBtn = document.createElement('button');
                 reasonBtn.textContent = '原因';
                 reasonBtn.className = 'verify-btn'; // 复用样式
                 reasonBtn.style.backgroundColor = '#6c757d'; // 灰色
                 reasonBtn.dataset.reason = attempt.verificationReason;
                 reasonBtn.dataset.url = attempt.testedUrl || '';
                 reasonBtn.addEventListener('click', (e) => {
                     alert(`验证原因: ${e.target.dataset.reason}\n测试URL: ${e.target.dataset.url || 'N/A'}`);
                 });
                 actionCell.appendChild(reasonBtn);
             }

            row.appendChild(actionCell);
            listBody.appendChild(row);
        });
    }

    // 显示验证模态窗口 (使用遮罩层)
    function showVerificationModal(attemptIndex) {
        const attempt = attempts[attemptIndex];
        if (!attempt) return;

        closeVerificationModal(); // 关闭可能存在的旧模态框

        const overlay = document.createElement('div');
        overlay.className = 'amex-helper-overlay';
        overlay.id = 'verification-modal-overlay';

        const modal = document.createElement('div');
        modal.className = 'amex-helper modal';
        modal.innerHTML = `
            <div class="modal-content">
                 <button class="close-btn" id="verifyCancelBtn" title="取消">&times;</button>
                <h3 class="modal-title">手动验证代码组合</h3>
                <p>Offer Code: <strong>${attempt.offerCode || '-'}</strong></p>
                <p>WOC Code: <strong>${attempt.wocCode || '-'}</strong></p>
                <p>链接类型: <strong>${attempt.testedType || '未知'}</strong></p>
                 <p>测试时间: <strong>${new Date(attempt.timestamp).toLocaleString()}</strong></p>
                <p>请根据您打开链接后的实际情况确认：</p>
                <div style="text-align: center; margin-top: 20px;">
                    <button id="verifyYesBtn" class="btn-control">有效 (✅)</button>
                    <button id="verifyNoBtn" class="btn-danger">无效 (❌)</button>
                </div>
            </div>
        `;
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // 添加事件监听器
        document.getElementById('verifyYesBtn').addEventListener('click', () => {
            markAttemptVerified(attemptIndex, true);
            closeVerificationModal();
        });
        document.getElementById('verifyNoBtn').addEventListener('click', () => {
            markAttemptVerified(attemptIndex, false);
            closeVerificationModal();
        });
        document.getElementById('verifyCancelBtn').addEventListener('click', closeVerificationModal);
        overlay.addEventListener('click', (e) => { // 点击遮罩关闭
            if (e.target === overlay) {
                closeVerificationModal();
            }
        });
    }

    // 关闭验证模态窗口
    function closeVerificationModal() {
        const overlay = document.getElementById('verification-modal-overlay');
        if (overlay) overlay.remove();
    }

    // 标记尝试为已验证/已否决
    function markAttemptVerified(index, isValid) {
        if (index < 0 || index >= attempts.length) return;

        const attempt = attempts[index];
        // 只有在未验证/未否决时才更新统计
        const needsStatUpdate = !attempt.verified && !attempt.rejected;

        if (needsStatUpdate) {
            stats.totalTested++;
        }

        if (isValid) {
            attempt.verified = true;
            attempt.rejected = false;
            attempt.status = 'success'; // 标记为成功
            if (needsStatUpdate) stats.verified++;
            updateStatus(`已标记 ${attempt.offerCode || ''} + ${attempt.wocCode || ''} 为有效`);
        } else {
            attempt.rejected = true;
            attempt.verified = false;
            attempt.status = 'error'; // 标记为失败
            if (needsStatUpdate) stats.rejected++;
            updateStatus(`已标记 ${attempt.offerCode || ''} + ${attempt.wocCode || ''} 为无效`);
        }
        // 记录手动验证时间
        attempt.verifiedAt = Date.now();
        // 清除可能存在的自动验证原因
        attempt.verificationReason = isValid ? '手动验证有效' : '手动验证无效';


        GM_setValue('attempts', attempts);
        GM_setValue('stats', stats);
        updateAttemptsList();
        updateStats();
    }

    // 应用代码（单个测试）
    function applyCode(linkType = 'both') {
        const offerCodeInput = document.getElementById('offerCode');
        const wocCodeInput = document.getElementById('wocCode');
        let offerCode = offerCodeInput.value.trim();
        let wocCode = wocCodeInput.value.trim();

        if (!offerCode && lastOfferCode) offerCode = lastOfferCode;
        if (!wocCode && lastWOCCode) wocCode = lastWOCCode;

        if (!offerCode && !wocCode) {
            updateStatus('错误: 请至少输入一个代码');
            return;
        }

        offerCodeInput.value = offerCode; // 更新输入框显示
        wocCodeInput.value = wocCode;

        GM_setValue('lastOfferCode', offerCode); // 保存以便下次使用
        GM_setValue('lastWOCCode', wocCode);

        visitLinks(offerCode, wocCode, linkType); // 生成链接并访问
    }

    // 访问链接并记录尝试
    function visitLinks(offerCode, wocCode, linkType = 'both') {
        // 修正：确保offerCode和wocCode至少有一个有值
        if (!offerCode && !wocCode) {
             console.warn("visitLinks called with empty codes, skipping.");
             return;
        }

        // 记录尝试 (确保不重复记录完全相同的待处理项)
        const existingPending = attempts.find(a =>
            a.offerCode === offerCode &&
            a.wocCode === wocCode &&
            a.status === 'pending' &&
            (a.testedType === linkType || !a.testedType) // 考虑类型
        );

        if (!existingPending) {
            const attempt = {
                offerCode: offerCode || '', // 确保有值
                wocCode: wocCode || '',   // 确保有值
                timestamp: Date.now(),
                status: 'pending',
                testedType: getLinkTypeLabel(linkType), // 记录测试类型
                verified: false,
                rejected: false,
                testedUrl: '' // 初始化测试URL
            };
            attempts.unshift(attempt); // 添加到开头
            GM_setValue('attempts', attempts);
            updateAttemptsList(); // 更新列表显示
        } else {
             if (AMEX_DEBUG) console.log("[DEBUG] Skipping duplicate pending attempt:", offerCode, wocCode, linkType);
        }


        // 构建链接 (使用更标准的URL构建)
        const baseUrl = 'https://www.americanexpress.com/us/credit-cards/card-application/apply';
        const upgradePath = `upgrade/business-platinum-charge-card/${offerCode || '63453-9-1'}-${wocCode || ''}`;
        const supplementaryPath = `stand-alone-supps/${offerCode || '64399-9-1'}-${wocCode || ''}`;

        const upgradeLink = `${baseUrl}/${upgradePath}`;
        const supplementaryLink = `${baseUrl}/${supplementaryPath}`;

        let linksToOpen = [];

        if (linkType === 'both' || linkType === 'upgrade') {
            updateStatus(`准备测试升级链接: ${offerCode || '默认'} + ${wocCode}`);
             // 查找或创建对应的记录来存储URL
             let attemptRecord = findOrCreateAttempt(offerCode, wocCode, '升级链接');
             attemptRecord.testedUrl = upgradeLink; // 记录将要测试的URL
             linksToOpen.push({ url: upgradeLink, type: '升级链接' });
        }

        if (linkType === 'both' || linkType === 'supplementary') {
            updateStatus(`准备测试副卡链接: ${offerCode || '默认'} + ${wocCode}`);
             let attemptRecord = findOrCreateAttempt(offerCode, wocCode, '副卡链接');
             attemptRecord.testedUrl = supplementaryLink;
             linksToOpen.push({ url: supplementaryLink, type: '副卡链接' });
        }

        // 保存更新后的attempts (包含URL)
        GM_setValue('attempts', attempts);
        updateAttemptsList();

        // 依次打开链接
        linksToOpen.forEach(linkInfo => {
             testLink(linkInfo.url, offerCode, wocCode, linkInfo.type);
        });

        return { upgradeLink, supplementaryLink, linkType };
    }

     // 查找或创建尝试记录
     function findOrCreateAttempt(offerCode, wocCode, linkType) {
         let attempt = attempts.find(a =>
             a.offerCode === offerCode &&
             a.wocCode === wocCode &&
             (a.testedType === linkType || !a.testedType || a.testedType === '未知链接') && // 匹配类型
             a.status === 'pending' // 仅查找待处理的
         );

         if (!attempt) {
             // 如果是测试 'both'，并且已经有一个 '升级链接' 的 pending 记录，
             // 我们需要为 '副卡链接' 创建一个新的记录
             if (linkType === '副卡链接') {
                 const upgradePendingExists = attempts.some(a =>
                     a.offerCode === offerCode &&
                     a.wocCode === wocCode &&
                     a.testedType === '升级链接' &&
                     a.status === 'pending'
                 );
                 if (upgradePendingExists) {
                     attempt = null; // 强制创建新记录
                 } else {
                      // 否则，尝试查找任何一个未完成的记录
                      attempt = attempts.find(a =>
                          a.offerCode === offerCode &&
                          a.wocCode === wocCode &&
                          !a.verified && !a.rejected
                      );
                 }
             } else {
                  // 尝试查找任何一个未完成的记录
                  attempt = attempts.find(a =>
                      a.offerCode === offerCode &&
                      a.wocCode === wocCode &&
                      !a.verified && !a.rejected
                  );
             }


             // 如果还是找不到，或者需要强制创建
             if (!attempt) {
                 attempt = {
                     offerCode: offerCode || '',
                     wocCode: wocCode || '',
                     timestamp: Date.now(),
                     status: 'pending',
                     testedType: linkType, // 设置明确的类型
                     verified: false,
                     rejected: false,
                     testedUrl: ''
                 };
                 attempts.unshift(attempt);
                 // 不需要立即保存，会在visitLinks结束时一起保存
             } else {
                  // 如果找到了一个已完成的记录，则创建一个新的pending记录
                  if(attempt.verified || attempt.rejected) {
                       attempt = {
                           offerCode: offerCode || '',
                           wocCode: wocCode || '',
                           timestamp: Date.now(),
                           status: 'pending',
                           testedType: linkType,
                           verified: false,
                           rejected: false,
                           testedUrl: ''
                       };
                       attempts.unshift(attempt);
                  } else {
                       // 更新现有未完成记录的类型
                       if (!attempt.testedType || attempt.testedType === '未知链接') {
                           attempt.testedType = linkType;
                       }
                  }
             }
         }
         return attempt;
     }


    // 测试链接 (与原版一致，使用 cleanUrl)
    function testLink(url, offerCode, wocCode, type) {
        const forceDesktopMode = GM_getValue('forceDesktopMode', false);
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        const isMac = /Mac/.test(navigator.userAgent);
        const cleanedUrl = cleanUrl(url); // 清理URL

        if ((isIOS || isMac) && !forceDesktopMode) {
            // iOS/Mac 优化模式：不实际请求，直接显示链接
            // 查找对应的记录并标记为待处理 (如果需要)
            let attempt = findOrCreateAttempt(offerCode, wocCode, type);
            attempt.status = 'pending'; // 确保是pending状态
            attempt.testedUrl = cleanedUrl;
            GM_setValue('attempts', attempts); // 保存更新
            updateAttemptsList();
            setTimeout(() => showClickableLink(cleanedUrl, offerCode, wocCode, type), 100);
            return;
        }

        // 其他设备或强制桌面模式：使用 HEAD 请求预检
        GM_xmlhttpRequest({
            method: 'HEAD',
            url: cleanedUrl + (cleanedUrl.includes('?') ? '&' : '?') + '_t=' + Date.now(), // 加时间戳防缓存
            timeout: 10000,
            onload: function(response) {
                // 2xx 或 3xx 都认为链接本身可访问
                const statusOk = response.status >= 200 && response.status < 400;
                // 查找对应的记录并更新状态（但不标记为 verified/rejected）
                let attempt = findOrCreateAttempt(offerCode, wocCode, type);
                attempt.status = statusOk ? 'success' : 'error'; // 只更新检测状态
                attempt.testedUrl = cleanedUrl;
                attempt.verificationReason = statusOk ? 'HEAD请求成功' : `HEAD请求失败 (${response.status})`;
                GM_setValue('attempts', attempts);
                updateAttemptsList();
                updateStatus(`${type} HEAD预检${statusOk ? '成功' : '失败'}: ${offerCode || ''} + ${wocCode || ''}`);

                // 只有HEAD成功才打开链接
                if (statusOk) {
                    window.open(cleanedUrl, '_blank');
                }
                 // 批量测试时，无论成功失败都继续下一个
                 if (batchTesting) {
                     const selectedLinkType = document.querySelector('input[name="linkType"]:checked').value;
                     const isLastOfType = (selectedLinkType === 'both' && type === '副卡链接') || (selectedLinkType !== 'both');
                     if (isLastOfType) {
                         // **修改点：使用动态间隔**
                         const interval = calculateBatchInterval();
                         if (AMEX_DEBUG) console.log(`[DEBUG] Batch interval: ${interval}ms`);
                         setTimeout(processNextBatch, interval);
                     }
                 }
            },
            onerror: function(error) {
                let attempt = findOrCreateAttempt(offerCode, wocCode, type);
                attempt.status = 'error';
                attempt.testedUrl = cleanedUrl;
                attempt.verificationReason = 'HEAD请求网络错误';
                GM_setValue('attempts', attempts);
                updateAttemptsList();
                updateStatus(`${type} HEAD预检失败(网络错误): ${offerCode || ''} + ${wocCode || ''}`);
                console.error("HEAD request error:", error);
                 // 批量测试时继续
                 if (batchTesting) {
                     const selectedLinkType = document.querySelector('input[name="linkType"]:checked').value;
                     const isLastOfType = (selectedLinkType === 'both' && type === '副卡链接') || (selectedLinkType !== 'both');
                      if (isLastOfType) {
                         const interval = calculateBatchInterval();
                          if (AMEX_DEBUG) console.log(`[DEBUG] Batch interval (onerror): ${interval}ms`);
                         setTimeout(processNextBatch, interval);
                     }
                 }
            },
            ontimeout: function() {
                let attempt = findOrCreateAttempt(offerCode, wocCode, type);
                attempt.status = 'error';
                attempt.testedUrl = cleanedUrl;
                attempt.verificationReason = 'HEAD请求超时';
                GM_setValue('attempts', attempts);
                updateAttemptsList();
                updateStatus(`${type} HEAD预检失败(超时): ${offerCode || ''} + ${wocCode || ''}`);
                 // 批量测试时继续
                 if (batchTesting) {
                     const selectedLinkType = document.querySelector('input[name="linkType"]:checked').value;
                     const isLastOfType = (selectedLinkType === 'both' && type === '副卡链接') || (selectedLinkType !== 'both');
                      if (isLastOfType) {
                         const interval = calculateBatchInterval();
                          if (AMEX_DEBUG) console.log(`[DEBUG] Batch interval (ontimeout): ${interval}ms`);
                         setTimeout(processNextBatch, interval);
                     }
                 }
            }
        });
    }

    // 显示可点击链接 (iOS优化) (使用遮罩层和标准模态框)
    function showClickableLink(url, offerCode, wocCode, type) {
        closeVerificationModal(); // 关闭可能存在的其他模态框

        const overlay = document.createElement('div');
        overlay.className = 'amex-helper-overlay';
        overlay.id = 'ios-link-overlay';

        const modal = document.createElement('div');
        modal.className = 'amex-helper modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="close-btn" id="closeIOSLinkBtn" title="关闭">&times;</button>
                <h3 class="modal-title">链接准备就绪 (iOS/Mac优化)</h3>
                <p>请点击下面的按钮或复制链接在新标签页中打开:</p>
                <p><strong>${type}</strong><br>
                   Offer: ${offerCode || '-'}<br>
                   WOC: ${wocCode || '-'}</p>
                <a href="${url}" target="_blank" rel="noopener noreferrer" class="ios-link-button">点击打开链接</a>
                <div style="margin: 10px 0; padding: 10px; background-color: #f5f5f5; border-radius: 5px; word-break: break-all; font-size: 12px; border: 1px solid #ddd;">${url}</div>
                <button id="copyIOSLinkBtn" class="btn-control" style="width:100%; margin-top: 10px;">复制链接</button>
                <p style="font-size: 11px; color: #666; margin-top: 15px;">提示: 您需要手动打开此链接进行测试。</p>
            </div>
        `;
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // 添加复制功能
        document.getElementById('copyIOSLinkBtn').addEventListener('click', () => {
            navigator.clipboard.writeText(url).then(() => {
                const copyBtn = document.getElementById('copyIOSLinkBtn');
                copyBtn.textContent = '✓ 复制成功';
                copyBtn.style.backgroundColor = '#218838';
                setTimeout(() => {
                    copyBtn.textContent = '复制链接';
                    copyBtn.style.backgroundColor = '#28a745';
                }, 1500);
            }).catch(err => updateStatus('复制失败: ' + err));
        });

        // 添加关闭功能
        const closeBtn = document.getElementById('closeIOSLinkBtn');
        const closeOverlay = () => {
             if(overlay.parentNode) overlay.remove();
             // 批量测试时继续下一个
             if (batchTesting) {
                 const selectedLinkType = document.querySelector('input[name="linkType"]:checked').value;
                 const isLastOfType = (selectedLinkType === 'both' && type === '副卡链接') || (selectedLinkType !== 'both');
                 if (isLastOfType) {
                     const interval = calculateBatchInterval();
                      if (AMEX_DEBUG) console.log(`[DEBUG] Batch interval (iOS closed): ${interval}ms`);
                     setTimeout(processNextBatch, interval); // 关闭后处理下一个
                 }
             }
        };
        closeBtn.addEventListener('click', closeOverlay);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeOverlay();
        });

        updateStatus(`已显示可点击链接 (iOS优化): ${type}`);
    }

    // 更新链接状态 (此函数不再直接更新 verified/rejected)
    function updateLinkStatus(offerCode, wocCode, success, type) {
        // 查找对应的尝试记录
        let attempt = findOrCreateAttempt(offerCode, wocCode, type);
        attempt.status = success ? 'success' : 'error'; // 更新检测状态
        attempt.verificationReason = success ? 'HEAD请求成功' : `HEAD请求失败 (${type.includes('超时') ? '超时' : type.includes('网络错误') ? '网络错误' : '状态码错误'})`;
        GM_setValue('attempts', attempts);
        updateAttemptsList();
        updateStatus(`${type} HEAD预检${success ? '成功' : '失败'}: ${offerCode || ''} + ${wocCode || ''}`);

        // 批量测试逻辑移到 testLink 的回调中处理
    }

    // 开始批量测试
    function startBatchTest() {
        const batchInput = document.getElementById('batchCodes').value.trim();
        if (!batchInput) {
            updateStatus('请输入批量测试代码');
            return;
        }
        GM_setValue('lastBatchCodes', batchInput); // 保存输入

        const selectedLinkType = document.querySelector('input[name="linkType"]:checked').value;
        skipExisting = document.getElementById('skipExistingCheck').checked; // 获取当前设置
        GM_setValue('skipExisting', skipExisting); // 保存设置

        // 重新解析以确保使用最新的代码列表
        updateCombinations(); // 这会更新全局的 offerCodes 和 wocCodes

        if (offerCodes.length === 0 && wocCodes.length === 0) {
            updateStatus('没有有效的代码可供测试');
            return;
        }

        // 确保至少有一个offer code或woc code
        const currentOfferCodes = offerCodes.length > 0 ? offerCodes : [''];
        const currentWocCodes = wocCodes.length > 0 ? wocCodes : [''];

        batchQueue = [];
        let skippedCount = 0;
        let totalCombos = 0;

        currentOfferCodes.forEach(offerCode => {
            currentWocCodes.forEach(wocCode => {
                 // 跳过完全为空的组合
                 if (!offerCode && !wocCode) return;

                 totalCombos++;
                if (skipExisting && combinationExists(offerCode, wocCode)) {
                    skippedCount++;
                } else {
                    batchQueue.push({ offerCode, wocCode, linkType: selectedLinkType });
                }
            });
        });


        if (batchQueue.length === 0) {
            updateStatus(skippedCount > 0 ? '所有组合都已测试过' : '没有生成有效的测试组合');
            return;
        }

        batchTesting = true;
        batchResults = []; // 清空上次结果
        const initialQueueLength = batchQueue.length;
        updateStatus(`开始批量测试 ${initialQueueLength} 组代码组合 (类型: ${getLinkTypeLabel(selectedLinkType)})${skippedCount > 0 ? `，跳过 ${skippedCount} 个` : ''}`);

        document.getElementById('batchInfo').textContent = `排队中: ${initialQueueLength} / 已完成: 0 / 跳过: ${skippedCount} / 总计: ${totalCombos}`;

        // 切换到结果标签页
        const resultsTabButton = document.querySelector('.amex-helper .tab[data-tab="results"]');
        if (resultsTabButton) resultsTabButton.click();

        processNextBatch(); // 开始处理第一个
    }

    // **修改点：批量处理间隔计算**
    function calculateBatchInterval() {
         const baseInterval = 800; // 基础间隔ms
         const queueLengthMultiplier = 50; // 每增加一个队列项增加的毫秒数
         const maxLengthThreshold = 30; // 超过这个长度，间隔增加更快
         const maxInterval = 4000; // 最大间隔ms

         let interval = baseInterval + batchQueue.length * queueLengthMultiplier;

         if (batchQueue.length > maxLengthThreshold) {
             interval += (batchQueue.length - maxLengthThreshold) * 100; // 超过阈值后加速增加
         }

         return Math.min(interval, maxInterval); // 不超过最大间隔
    }


    // 处理下一个批量队列项
    function processNextBatch() {
        if (!batchTesting || batchQueue.length === 0) {
            if (batchTesting) {
                updateStatus(`批量测试完成`);
                batchTesting = false;
                document.getElementById('batchInfo').textContent = '批量测试已完成';
            }
            return;
        }

        const nextItem = batchQueue.shift();
        const { offerCode, wocCode, linkType } = nextItem;

        // 更新批量信息显示
        const totalCombos = (offerCodes.length > 0 ? offerCodes.length : 1) * (wocCodes.length > 0 ? wocCodes.length : 1);
        const completedCount = totalCombos - batchQueue.length - (skipExisting ? (totalCombos - batchQueue.length) : 0) -1; // 估算完成数
        const skippedCount = skipExisting ? totalCombos - batchQueue.length - completedCount -1 : 0; // 估算跳过数
        document.getElementById('batchInfo').textContent = `排队中: ${batchQueue.length} / 已完成: ${completedCount} / 跳过: ${skippedCount} / 总计: ${totalCombos}`;

        // 访问链接 (visitLinks内部会处理HEAD请求和可能的window.open)
        // testLink 的回调函数会负责调用下一个 processNextBatch
        visitLinks(offerCode, wocCode, linkType);

        // **注意：** 下一个 processNextBatch 的调用已移至 testLink 的回调函数中，以确保在前一个链接处理（包括超时或错误）完成后再进行下一个。
    }

    // 停止批量测试
    function stopBatchTest() {
        if (batchTesting) {
            batchTesting = false;
            batchQueue = []; // 清空队列
            updateStatus('批量测试已手动停止');
            document.getElementById('batchInfo').textContent = '批量测试已停止';
        }
    }

    // 清除结果
    function clearResults() {
        if (confirm('确定要清除所有本地存储的测试结果和统计数据吗？此操作不可恢复。')) {
            const oldAttempts = [...attempts]; // 深拷贝备份
            const oldStats = {...stats};     // 深拷贝备份

            attempts = [];
            stats = { totalTested: 0, verified: 0, rejected: 0 }; // 重置统计

            GM_setValue('attempts', attempts);
            GM_setValue('stats', stats);
            clearLocalStorageResults(); // 同时清除localStorage缓存

            updateAttemptsList();
            updateStats();
            updateStatus('已清除所有测试结果和统计数据');

            showRestoreOptionWithStats(oldAttempts, oldStats); // 显示恢复选项
        }
    }

    // 切换自动刷新 (与原版一致)
    function toggleAutoRefresh() {
        const button = document.getElementById('toggleRefreshBtn');
        if (!button) return;

        if (refreshTimerId) {
            clearTimeout(refreshTimerId); // 使用 clearTimeout
            refreshTimerId = null;
            button.textContent = '启动自动刷新';
            button.classList.remove('btn-danger');
            button.classList.add('btn-control');
            updateStatus('自动刷新已停止');
             GM_setValue('autoRefreshEnabled', false); // 保存状态
        } else {
            button.textContent = '停止自动刷新';
            button.classList.remove('btn-control');
            button.classList.add('btn-danger');
            updateStatus('自动刷新已启动');
            refreshPage(); // 立即调用一次以设置定时器
             GM_setValue('autoRefreshEnabled', true); // 保存状态
        }
    }

    // 刷新页面 (与原版一致)
    function refreshPage() {
        if (refreshTimerId) clearTimeout(refreshTimerId); // 清除旧的

        const minTime = 3 * 60 * 1000;
        const maxTime = 4 * 60 * 1000;
        const randomTime = Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;

        updateStatus(`页面将在 ${Math.round(randomTime / 1000 / 60)} 分钟后自动刷新`);

        refreshTimerId = setTimeout(() => {
            updateStatus('正在刷新页面...');
            location.reload();
        }, randomTime);
    }

    // 导出尝试记录为CSV (与原版一致)
    function exportAttempts() {
        if (attempts.length === 0) {
            updateStatus('没有可导出的尝试记录');
            return;
        }
        let csv = 'Offer Code,WOC Code,Timestamp,Date,Status,测试类型,已验证,已否决,验证原因,测试URL\n'; // 添加列
        attempts.forEach(attempt => {
            const date = new Date(attempt.timestamp).toLocaleString();
            let status = '待测试';
            if(attempt.verified) status = '已验证';
            else if(attempt.rejected) status = '已否决';
            else if(attempt.status === 'success') status = '检测成功';
            else if(attempt.status === 'error') status = '检测失败';

            const reason = (attempt.verificationReason || '').replace(/"/g, '""'); // 处理引号
            const url = (attempt.testedUrl || '').replace(/"/g, '""');

            csv += `"${attempt.offerCode || ''}","${attempt.wocCode || ''}","${attempt.timestamp}","${date}","${status}","${attempt.testedType || ''}","${attempt.verified ? '是' : '否'}","${attempt.rejected ? '是' : '否'}","${reason}","${url}"\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const filename = `amex-attempts-${new Date().toISOString().slice(0, 10)}.csv`;
        const url = URL.createObjectURL(blob);
        try {
             GM_download(url, filename);
             updateStatus('尝试记录已导出');
        } catch (e) {
             console.error("导出失败:", e);
             updateStatus('导出失败，请检查浏览器下载设置或权限');
             // 提供备选下载方式
             const link = document.createElement('a');
             link.href = url;
             link.download = filename;
             link.style.display = 'none';
             document.body.appendChild(link);
             link.click();
             document.body.removeChild(link);
             updateStatus('尝试通过备选方式下载...');
        }
        URL.revokeObjectURL(url); // 释放内存
    }

    // 获取链接类型标签 (与原版一致)
    function getLinkTypeLabel(linkType) {
        switch (linkType) {
            case 'upgrade': return '仅升级';
            case 'supplementary': return '仅副卡';
            case 'both': default: return '全部';
        }
    }

    // 更新状态消息
    function updateStatus(message) {
        const statusEl = document.getElementById('status');
        if (statusEl) {
            statusEl.textContent = `状态: ${message}`;
        }
        // 同时输出到控制台（如果调试模式开启）
        if (AMEX_DEBUG) {
            console.log('[AMEX Helper Status]', message);
        }
    }

    // --- 初始化和事件绑定 ---

    // 页面加载完成后创建面板
    window.addEventListener('load', () => {
        // 延迟创建，确保页面元素加载完成
        setTimeout(createPanel, 1500);
        // 页面加载时也尝试同步一次
        setTimeout(syncTestResultsFromOtherWindows, 2500);
    });

    // 菜单命令 (与原版一致)
    GM_registerMenuCommand('显示/隐藏AMEX助手', function() {
        if (isPanelVisible) hidePanel();
        else showPanel();
    });

    // 创建控制面板 (主函数)
    function createPanel() {
        if (document.getElementById('amex-helper-panel')) return; // 防止重复创建

        const panel = document.createElement('div');
        panel.className = 'amex-helper';
        panel.id = 'amex-helper-panel';

        // 读取保存的通知设置来初始化复选框状态
        const currentNotificationSettings = GM_getValue('notificationSettings', {
            enableSound: true, enableMobilePopup: true, enableDesktop: true, enableEmail: false
        });
        // 更新全局变量
        notificationSettings = currentNotificationSettings;


        panel.innerHTML = `
            <button class="close-btn" id="closeBtn" title="隐藏面板">&times;</button>
            <h3>AMEX Code Helper</h3>
            <div class="tabs">
                <div class="tab active" data-tab="single">单个测试</div>
                <div class="tab" data-tab="batch">批量测试</div>
                <div class="tab" data-tab="results">测试结果</div>
                <div class="tab" data-tab="settings">设置</div>
            </div>

            <div id="single-tab" class="tab-content active">
                <input type="text" id="offerCode" placeholder="Offer Code (可选)" value="${lastOfferCode}">
                <input type="text" id="wocCode" placeholder="WOC Code (必填)" value="${lastWOCCode}">
                <div class="section">
                    <button id="applyUpgradeBtn" class="btn-test">测试升级</button>
                    <button id="applySupplementaryBtn" class="btn-test">测试副卡</button>
                    <button id="applyAllBtn" class="btn-test">测试全部</button>
                </div>
                <div class="section">
                    <button id="toggleRefreshBtn" class="btn-control">启动自动刷新</button>
                    <button id="clearCacheBtn" class="btn-danger">清除缓存</button>
                </div>
                <div class="stats">
                    总测试: <span id="totalTested">${stats.totalTested}</span> |
                    已验证: <span id="verified">${stats.verified}</span> |
                    已否决: <span id="rejected">${stats.rejected}</span>
                </div>
            </div>

            <div id="batch-tab" class="tab-content">
                <textarea id="batchCodes" placeholder="批量输入格式: OFFERCODE,WOCCODE (每行一组) 或仅 WOCCODE (每行一个) 或 链接列表&#10;系统将自动组合或提取代码">${lastBatchCodes}</textarea>
                <div class="combo-info" id="comboInfo">组合预览: 0 种组合</div>
                <div style="margin: 5px 0;">
                    <label><input type="checkbox" id="skipExistingCheck" ${skipExisting ? 'checked' : ''}> 跳过已测试的组合</label>
                </div>
                <div class="link-type-selector" style="margin: 5px 0;">
                    <span>测试链接类型: </span>
                    <label><input type="radio" name="linkType" value="both" checked> 全部</label>
                    <label><input type="radio" name="linkType" value="upgrade"> 仅升级</label>
                    <label><input type="radio" name="linkType" value="supplementary"> 仅副卡</label>
                </div>
                <div class="section">
                    <button id="startBatchBtn" class="btn-test">开始批量测试</button>
                    <button id="stopBatchBtn" class="btn-warning">停止测试</button>
                </div>
                <div class="batch-info" id="batchInfo"></div>
                </div>

            <div id="results-tab" class="tab-content">
                <div class="section" style="display: flex; flex-wrap: wrap; gap: 5px;">
                    <button id="syncResultsBtn" class="btn-control">手动同步结果</button> <button id="exportBtn" class="btn-export">导出CSV</button>
                    <button id="exportServerBtn" class="btn-export">导出到服务器</button>
                    <button id="clearResultsBtn" class="btn-danger">清除全部结果</button>
                </div>
                <div class="attempts">
                    <table class="results-table" id="resultsTable">
                        <thead>
                            <tr>
                                <th>Offer</th>
                                <th>WOC</th>
                                <th>时间</th>
                                <th>类型</th>
                                <th>状态</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody id="attemptsList">
                            </tbody>
                    </table>
                </div>
            </div>

            <div id="settings-tab" class="tab-content">
                <div class="settings-row">
                    <label class="settings-label">服务器URL (用于导出和邮件)</label>
                    <input type="text" id="serverUrl" placeholder="https://your-server.com/api/amex" value="${serverUrl}">
                </div>
                <div class="settings-row">
                    <label class="settings-label">脚本作用域域名</label>
                    <input type="text" id="scriptDomains" placeholder="americanexpress.com,amex.com" value="${scriptDomains}">
                    <button id="generateScriptBtn" class="btn-export" style="margin-left: 5px; padding: 5px 10px; font-size: 11px;">生成脚本设置</button>
                    <p class="settings-help">多个域名用逗号分隔。修改后需在Tampermonkey中更新脚本头部的 @match 规则。</p>
                </div>
                <div class="settings-row">
                    <label class="settings-label">设备类型检测</label>
                    <label><input type="checkbox" id="forceDesktopMode" ${GM_getValue('forceDesktopMode', false) ? 'checked' : ''}> 强制使用桌面模式打开链接</label>
                    <p class="settings-help">勾选后，在Mac/iOS上也会尝试自动打开链接，而不是显示按钮。</p>
                </div>
                 <div class="settings-row section">
                     <label class="settings-label">调试选项</label>
                     <div>
                         <label><input type="checkbox" id="enableDebug" ${AMEX_DEBUG ? 'checked' : ''}> 启用调试模式 (控制台输出详细信息)</label>
                         <button id="checkLocalStorageBtn" class="btn-control" style="margin-left:10px; padding: 5px 10px; font-size: 11px;">检查LocalStorage缓存</button>
                     </div>
                 </div>
                <div class="settings-row section">
                    <label class="settings-label">邮件通知设置 (需服务器支持)</label>
                    <input type="email" id="emailNotification" placeholder="接收通知的邮箱" value="${GM_getValue('emailNotification', '')}">
                    <div class="smtp-settings" style="margin-top:10px; padding: 10px; border: 1px solid #eee; border-radius: 4px;">
                        <label class="settings-label" style="font-size: 0.9em;">SMTP服务配置 (可选, 优先使用)</label>
                        <input type="text" id="smtpServer" placeholder="SMTP服务器地址" value="${GM_getValue('smtpServer', '')}">
                        <input type="text" id="smtpUser" placeholder="邮箱用户名" value="${GM_getValue('smtpUser', '')}">
                        <input type="password" id="smtpPassword" placeholder="邮箱密码或授权码" value="${GM_getValue('smtpPassword', '')}">
                        <div style="display:flex; gap:10px; margin-top:5px; align-items: center;">
                            <input type="number" id="smtpPort" placeholder="端口" value="${GM_getValue('smtpPort', '587')}" style="width:80px;">
                            <label><input type="checkbox" id="smtpSsl" ${GM_getValue('smtpSsl', true) ? 'checked' : ''}> 使用SSL/TLS</label>
                            <button id="testEmailBtn" class="btn-control" style="padding: 5px 10px; font-size: 11px;">测试邮件</button>
                        </div>
                    </div>
                    <p class="settings-help">找到有效链接时发送通知。需配合服务器URL或填写SMTP配置。</p>
                </div>
                 <div class="settings-row section">
                    <label class="settings-label">通知方式</label>
                    <div class="notification-controls" style="margin:10px 0;padding:10px;background:#f8f8f8;border-radius:5px;border:1px solid #ddd;">
                        <div><label><input type="checkbox" id="enableSound" ${currentNotificationSettings.enableSound ? 'checked' : ''}> 声音通知</label></div>
                        <div><label><input type="checkbox" id="enableMobilePopup" ${currentNotificationSettings.enableMobilePopup ? 'checked' : ''}> 移动端页内弹窗</label></div>
                        <div><label><input type="checkbox" id="enableDesktopNotif" ${currentNotificationSettings.enableDesktop ? 'checked' : ''}> 桌面通知 (电脑)</label></div>
                        <div><label><input type="checkbox" id="enableEmailNotif" ${currentNotificationSettings.enableEmail ? 'checked' : ''}> 邮件通知 (需配置邮箱)</label></div>
                        <div class="notification-test-btns" style="display:flex;gap:5px;margin-top:10px;">
                            <button id="testNotifBtn" class="btn-control" style="padding:3px 8px;font-size:11px;">测试通知</button>
                            <button id="requestPermissionBtn" class="btn-control" style="padding:3px 8px;font-size:11px;">请求桌面通知权限</button>
                        </div>
                    </div>
                </div>
                <div class="section">
                    <button id="saveSettingsBtn" class="btn-test">保存全部设置</button>
                </div>
            </div>

            <div id="status" class="status">状态: 初始化中...</div>
        `;

        document.body.appendChild(panel);

        // --- 动态内容和事件绑定 ---
        updateAttemptsList();
        updateStats();
        updateCombinations(); // 初始化批量预览
        addBatchTools(); // 添加批量工具按钮

        // 标签切换
        panel.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', function() {
                panel.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                panel.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                panel.querySelector(`#${this.dataset.tab}-tab`).classList.add('active');
            });
        });

        // 按钮事件绑定
        panel.querySelector('#closeBtn').addEventListener('click', hidePanel);
        panel.querySelector('#applyUpgradeBtn').addEventListener('click', () => applyCode('upgrade'));
        panel.querySelector('#applySupplementaryBtn').addEventListener('click', () => applyCode('supplementary'));
        panel.querySelector('#applyAllBtn').addEventListener('click', () => applyCode('both'));
        panel.querySelector('#toggleRefreshBtn').addEventListener('click', toggleAutoRefresh);
        panel.querySelector('#clearCacheBtn').addEventListener('click', clearAllCache);
        panel.querySelector('#exportBtn').addEventListener('click', exportAttempts);
        panel.querySelector('#exportServerBtn').addEventListener('click', exportToServer);
        panel.querySelector('#startBatchBtn').addEventListener('click', startBatchTest);
        panel.querySelector('#stopBatchBtn').addEventListener('click', stopBatchTest);
        panel.querySelector('#clearResultsBtn').addEventListener('click', clearResults);
        panel.querySelector('#saveSettingsBtn').addEventListener('click', saveSettings); // 主保存按钮
        panel.querySelector('#generateScriptBtn').addEventListener('click', generateScriptSettings);
        panel.querySelector('#testEmailBtn').addEventListener('click', testEmailNotification);
        panel.querySelector('#syncResultsBtn').addEventListener('click', () => { // **新增**
            updateStatus('正在手动同步结果...');
            syncTestResultsFromOtherWindows();
        });

        // 批量输入和选项更改时更新预览
        panel.querySelector('#batchCodes').addEventListener('input', updateCombinations);
        panel.querySelector('#skipExistingCheck').addEventListener('change', function() {
            skipExisting = this.checked;
            GM_setValue('skipExisting', skipExisting); // 保存设置
            updateCombinations();
        });
         panel.querySelectorAll('input[name="linkType"]').forEach(radio => {
             radio.addEventListener('change', updateCombinations); // 类型改变也更新预览
         });

        // **新增调试事件绑定**
        panel.querySelector('#enableDebug').addEventListener('change', function() {
            AMEX_DEBUG = this.checked;
            GM_setValue('AMEX_DEBUG', AMEX_DEBUG);
            updateStatus('调试模式: ' + (AMEX_DEBUG ? '已启用' : '已禁用'));
            console.log('[AMEX Helper] Debug mode:', AMEX_DEBUG ? 'Enabled' : 'Disabled');
        });
        panel.querySelector('#checkLocalStorageBtn').addEventListener('click', showLocalStorageModal);

         // 通知设置事件绑定
         panel.querySelector('#testNotifBtn').addEventListener('click', () => {
             triggerNotifications('AMEX通知测试', '这是一条测试通知消息', true);
             updateStatus('已发送测试通知');
         });
         panel.querySelector('#requestPermissionBtn').addEventListener('click', () => {
             if ("Notification" in window) {
                 Notification.requestPermission().then(permission => {
                     updateStatus(`桌面通知权限: ${permission}`);
                 });
             } else {
                 updateStatus('此浏览器不支持桌面通知');
             }
         });
         // **修改：通知复选框改变时也调用 saveSettings**
         panel.querySelectorAll('.notification-controls input[type="checkbox"]').forEach(checkbox => {
             checkbox.addEventListener('change', saveSettings); // 每次更改都保存所有设置
         });


        // 默认启动自动刷新 (如果之前是启动状态)
        if (GM_getValue('autoRefreshEnabled', false)) { // 读取保存的状态
             // 延迟启动，避免影响页面加载
             setTimeout(() => {
                  if (!refreshTimerId) { // 检查是否已启动
                      toggleAutoRefresh();
                  }
             }, 2000);
        } else {
             // 更新按钮状态为“启动”
             const btn = panel.querySelector('#toggleRefreshBtn');
             if(btn) {
                  btn.textContent = '启动自动刷新';
                  btn.classList.remove('btn-danger');
                  btn.classList.add('btn-control');
             }
        }

        // 检测当前页面结果
        checkCurrentPageForResults();

        updateStatus('就绪'); // 初始化完成
    }

    // **新增：显示LocalStorage内容的模态框**
    function showLocalStorageModal() {
        closeVerificationModal(); // 关闭其他模态框

        const overlay = document.createElement('div');
        overlay.className = 'amex-helper-overlay';
        overlay.id = 'storage-modal-overlay';

        const modal = document.createElement('div');
        modal.className = 'amex-helper modal';
        modal.style.width = '600px'; // 稍宽一点
        modal.style.maxWidth = '95vw';

        const testResults = JSON.parse(localStorage.getItem('amex_test_results') || '[]');
        if (AMEX_DEBUG) console.table(testResults); // 在控制台也输出表格

        let resultsHTML = '<p>LocalStorage 中没有缓存的测试结果。</p>';
        if (testResults.length > 0) {
            resultsHTML = `
                <table class="debug-storage-table">
                    <thead>
                        <tr>
                            <th>时间戳</th>
                            <th>WOC码</th>
                            <th>链接类型</th>
                            <th>结果</th>
                            <th>原因</th>
                            <th>URL</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            // 只显示最近 N 条
            testResults.slice(-50).reverse().forEach(r => {
                resultsHTML += `
                    <tr>
                        <td>${new Date(r.timestamp).toLocaleString()}</td>
                        <td>${r.wocCode || '-'}</td>
                        <td>${r.linkType || '-'}</td>
                        <td>${r.isValid ? '✅ 有效' : '❌ 无效'}</td>
                        <td>${r.reason || '-'}</td>
                        <td style="word-break: break-all;">${r.url || '-'}</td>
                    </tr>`;
            });
            resultsHTML += '</tbody></table>';
        }

        modal.innerHTML = `
            <div class="modal-content">
                <button class="close-btn" id="closeStorageModalBtn" title="关闭">&times;</button>
                <h3 class="modal-title">LocalStorage 同步缓存 (${testResults.length}项)</h3>
                <div style="max-height: 400px; overflow-y: auto;">
                    ${resultsHTML}
                </div>
                <div style="text-align: center; margin-top: 15px;">
                     <button id="clearStorageBtn" class="btn-danger">清除LocalStorage缓存</button>
                </div>
            </div>
        `;
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // 关闭按钮
        const closeBtn = document.getElementById('closeStorageModalBtn');
        const closeOverlay = () => {
             if(overlay.parentNode) overlay.remove();
        };
        closeBtn.addEventListener('click', closeOverlay);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeOverlay();
        });
         // 清除按钮
         document.getElementById('clearStorageBtn').addEventListener('click', () => {
              if(confirm('确定要清除LocalStorage中的同步缓存吗？这不会影响已保存的测试结果列表。')) {
                   clearLocalStorageResults();
                   closeOverlay(); // 关闭模态框
              }
         });

        updateStatus(`LocalStorage缓存已在弹窗和控制台显示: ${testResults.length} 项`);
    }


    // 清除所有缓存数据 (修正版，确保恢复时也恢复统计)
    function clearAllCache() {
        if(confirm('确定要清除所有本地存储的测试结果和统计数据吗？此操作不可恢复。')) {
            const oldAttempts = [...attempts]; // 深拷贝备份
            const oldStats = {...stats};     // 深拷贝备份

            attempts = [];
            stats = { totalTested: 0, verified: 0, rejected: 0 }; // 重置统计

            GM_setValue('attempts', attempts);
            GM_setValue('stats', stats);
            clearLocalStorageResults(); // 同时清除localStorage缓存

            updateAttemptsList();
            updateStats();
            updateStatus('已清除所有测试结果和统计数据');

            showRestoreOptionWithStats(oldAttempts, oldStats); // 显示恢复选项
        }
    }

    // 显示恢复选项 (修正版，确保恢复统计)
    function showRestoreOptionWithStats(oldData, oldStatsData) { // 参数名修改避免冲突
        const restoreBar = document.createElement('div');
        // ... (样式设置不变) ...
        restoreBar.style.position = 'fixed';
        restoreBar.style.bottom = '10px';
        restoreBar.style.left = '50%';
        restoreBar.style.transform = 'translateX(-50%)';
        restoreBar.style.backgroundColor = '#ffc107';
        restoreBar.style.color = 'black';
        restoreBar.style.padding = '10px 15px';
        restoreBar.style.borderRadius = '5px';
        restoreBar.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
        restoreBar.style.zIndex = '10000';
        restoreBar.id = 'amex-restore-bar';

        restoreBar.innerHTML = `
            数据已清除！
            <button id="restoreDataBtn" style="background:#28a745;color:white;border:none;padding:3px 8px;border-radius:3px;margin:0 10px;cursor:pointer;">恢复数据</button>
            <button id="dismissRestoreBtn" style="background:#6c757d;color:white;border:none;padding:3px 8px;border-radius:3px;cursor:pointer;">忽略</button>
        `;
        document.body.appendChild(restoreBar);

        document.getElementById('restoreDataBtn').addEventListener('click', () => {
            attempts = oldData;
            stats = oldStatsData; // **修正：恢复传入的统计数据**
            GM_setValue('attempts', attempts);
            GM_setValue('stats', stats);
            updateAttemptsList();
            updateStats();
            updateStatus('数据已恢复');
            if(restoreBar.parentNode) restoreBar.remove();
        });

        document.getElementById('dismissRestoreBtn').addEventListener('click', () => {
             if(restoreBar.parentNode) restoreBar.remove();
        });

        setTimeout(() => {
             if(document.getElementById('amex-restore-bar')) {
                 document.getElementById('amex-restore-bar').remove();
             }
        }, 30000);
    }

    // --- 邮件和通知相关 (与原版类似，略作调整) ---
    function testEmailNotification() {
        const email = document.getElementById('emailNotification').value.trim();
        if (!email) {
            updateStatus('请先在设置中输入接收通知的邮箱地址');
            return;
        }
        const testInfo = { offerCode: 'TEST-OFFER', wocCode: 'TESTWOC', linkType: '测试链接', url: 'https://www.americanexpress.com/test', reason: '测试邮件通知功能' };
        sendEmailNotification(testInfo.offerCode, testInfo.wocCode, testInfo.linkType, testInfo.reason, testInfo.url, true);
        updateStatus('正在尝试发送测试邮件...');
    }

    function tryToSendEmailNotification(wocCode, linkType, reason, url) {
         // 检查邮件通知是否启用
         if (!notificationSettings.enableEmail) return;

        const email = GM_getValue('emailNotification', '');
        if (!email) return; // 邮箱为空时不发送

        let offerCode = '';
        const offerMatch = url.match(/\/(\d{5}-\d+-\d+)-/);
        if (offerMatch && offerMatch[1]) offerCode = offerMatch[1];

        sendEmailNotification(offerCode, wocCode, linkType, reason, url);
    }

    function sendEmailNotification(offerCode, wocCode, linkType, reason, url, isTest = false) {
        const email = GM_getValue('emailNotification', '');
        if (!email) return;

        const currentServerUrl = GM_getValue('serverUrl', ''); // 使用当前设置
        const smtpServer = GM_getValue('smtpServer', '');
        const smtpUser = GM_getValue('smtpUser', '');
        const smtpPassword = GM_getValue('smtpPassword', '');
        const smtpPort = GM_getValue('smtpPort', '587');
        const smtpSsl = GM_getValue('smtpSsl', true);

        // 如果配置了SMTP，优先使用SMTP；否则尝试通过服务器URL发送
        const useSmtp = smtpServer && smtpUser && smtpPassword;
        const endpoint = useSmtp ? `${currentServerUrl || 'https://default-server.com'}/send-smtp-email` : `${currentServerUrl}/send-email`; // 假设服务器有不同端点

        if (!currentServerUrl && !useSmtp) {
             updateStatus('未设置服务器URL且未配置SMTP，无法发送邮件');
             return;
        }


        const emailData = {
            to: email,
            subject: isTest ? '测试通知 - AMEX有效链接' : `发现有效的AMEX ${linkType}`,
            body: `... (邮件内容与原版一致) ...`, // 省略重复内容
            isTest: isTest,
            smtpConfig: useSmtp ? { server: smtpServer, user: smtpUser, password: smtpPassword, port: smtpPort, ssl: smtpSsl } : null
        };
         emailData.body = `
                <h3>发现有效的AMEX ${linkType}</h3>
                <p><strong>Offer Code:</strong> ${offerCode || '未提取'}</p>
                <p><strong>WOC Code:</strong> ${wocCode || '未提取'}</p>
                <p><strong>链接类型:</strong> ${linkType}</p>
                <p><strong>识别原因:</strong> ${reason}</p>
                <p><strong>链接URL:</strong> <a href="${url}" target="_blank">${url}</a></p>
                <hr>
                <p>此邮件由AMEX Code Helper (${new Date().toLocaleString()}) 自动发送。</p>
            `;


        GM_xmlhttpRequest({
            method: 'POST',
            url: endpoint,
            data: JSON.stringify(emailData),
            headers: { 'Content-Type': 'application/json' },
            onload: function(response) {
                if (response.status >= 200 && response.status < 300) {
                    updateStatus(isTest ? '测试邮件已发送成功' : `有效链接通知邮件已发送至 ${email}`);
                } else {
                    updateStatus(`邮件发送失败: ${response.statusText}`);
                    console.error('邮件发送失败:', response.responseText);
                }
            },
            onerror: function(error) {
                updateStatus('邮件发送失败: 网络错误');
                console.error('邮件发送错误:', error);
            },
             ontimeout: function() {
                 updateStatus('邮件发送失败: 请求超时');
             }
        });
    }

    // --- 通知功能 (声音、桌面、移动端弹窗) ---
    const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    function playNotificationSound(type = 'success') {
        if (!notificationSettings.enableSound) return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const audioContext = new AudioContext();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime); // 减小音量

            if (type === 'success') {
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
                oscillator.frequency.linearRampToValueAtTime(900, audioContext.currentTime + 0.15);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
            } else if (type === 'error') {
                oscillator.type = 'square';
                oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
                oscillator.frequency.linearRampToValueAtTime(150, audioContext.currentTime + 0.25);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
            } else { // warning or default
                oscillator.type = 'triangle';
                oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            }

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) { console.error('播放通知音效失败:', e); }
    }

    function showDesktopNotification(title, message, isValid) {
        if (!notificationSettings.enableDesktop || isMobileDevice || !("Notification" in window)) return;

        const createNotification = () => {
            const notification = new Notification(title, {
                body: message,
                icon: isValid ? 'https://www.google.com/s2/favicons?domain=americanexpress.com&sz=64' : 'https://www.google.com/s2/favicons?domain=americanexpress.com&sz=64', // 使用Google获取favicon
                requireInteraction: false,
                tag: 'amex-helper-notification' // 使用标签避免重复通知
            });
            notification.onclick = () => { window.focus(); notification.close(); };
            setTimeout(() => notification.close(), 6000); // 6秒后关闭
        };

        if (Notification.permission === "granted") {
            createNotification();
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") createNotification();
            });
        }
    }

    function showMobilePopup(message, isValid, duration = 5000) {
         if (!notificationSettings.enableMobilePopup || !isMobileDevice) return;

         // 移除旧弹窗
         const existingAlert = document.querySelector('.amex-mobile-alert');
         if (existingAlert) existingAlert.remove();

         const alert = document.createElement('div');
         // ... (样式设置与原版一致，确保 .amex-mobile-alert 样式存在) ...
         alert.className = 'amex-mobile-alert'; // 确保应用了CSS
         alert.style.position = 'fixed';
         alert.style.bottom = '-100px'; // Start off-screen
         alert.style.left = '50%';
         alert.style.transform = 'translateX(-50%)';
         alert.style.width = '90%';
         alert.style.maxWidth = '320px';
         alert.style.padding = '15px';
         alert.style.backgroundColor = isValid ? 'rgba(40, 167, 69, 0.95)' : 'rgba(220, 53, 69, 0.95)';
         alert.style.color = 'white';
         alert.style.borderRadius = '8px';
         alert.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
         alert.style.zIndex = '10010';
         alert.style.textAlign = 'center';
         alert.style.fontSize = '14px'; // 调整字体大小
         alert.style.fontWeight = 'bold';
         alert.style.transition = 'bottom 0.5s ease-out, opacity 0.5s ease-out'; // 添加动画
         alert.style.opacity = '0';

         const icon = isValid ? '✅' : '❌';
         alert.innerHTML = `${icon} ${message}`;
         document.body.appendChild(alert);

         // Slide in animation
         setTimeout(() => {
             alert.style.bottom = '20px';
             alert.style.opacity = '1';
         }, 50);


         alert.addEventListener('click', () => { if (alert.parentNode) alert.remove(); });

         setTimeout(() => {
             if (alert.parentNode) {
                 alert.style.opacity = '0';
                 alert.style.bottom = '-100px'; // Slide out
                 setTimeout(() => { if (alert.parentNode) alert.remove(); }, 500);
             }
         }, duration);
    }

    // 触发综合通知
    function triggerNotifications(title, message, isValid) {
        playNotificationSound(isValid ? 'success' : 'error');
        showDesktopNotification(title, message, isValid);
        if (isMobileDevice) showMobilePopup(message, isValid);
         // 尝试邮件通知 (如果启用且配置)
         // 注意：这里不直接调用 tryToSendEmailNotification，因为它需要更多上下文
         // 邮件通知应该在 checkCurrentPageForResults 中触发
    }

})(); // End of UserScript
