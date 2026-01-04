// ==UserScript==
// @name         Etherscan Points Assistant
// @name:zh-CN   Etherscan 积分助手 (含神秘礼盒)
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  A reimagined auto-claimer for Etherscan points with Mystery Box support, featuring a beautiful, iOS 18-inspired interface with light and dark modes. Fixed display bugs. It just works.
// @description:zh-CN 在 etherscan.io/points 页面自动签到并开启神秘礼盒。以 Apple iOS 18 设计语言重构，拥有精美的琉光玻璃界面与自动深色模式，为你带来无感、愉悦的积分获取体验。新增：自动领礼盒并更新积分。修复：模板字符串显示bug及重复积分问题。
// @author       Mantancoin（AIGC）
// @match        https://etherscan.io/points
// @grant        GM_addStyle
// @grant        GM_log
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547327/Etherscan%20Points%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/547327/Etherscan%20Points%20Assistant.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 我们相信，伟大的体验始于伟大的设计。保留原色板，支持深浅模式。
    // We believe a great experience starts with great design. Keeping original palette with light/dark modes.
    GM_addStyle(`
        :root {
            /* 浅色模式调色板 - 清新、空灵的感觉。 */
            /* Light Mode Palette - a clean, airy feel. */
            --bg-color-light: rgba(247, 247, 247, 0.8);
            --primary-text-light: #1d1d1f;
            --secondary-text-light: rgba(60, 60, 67, 0.7);
            --border-color-light: rgba(0, 0, 0, 0.1);
            --shadow-color-light: rgba(0, 0, 0, 0.12);
            --apple-blue-light: #007AFF;
            --apple-green-light: #34C759;
            --apple-red-light: #FF3B30;

            /* 深色模式调色板 - 专注且电影感。 */
            /* Dark Mode Palette - focused and cinematic. */
            --bg-color-dark: rgba(28, 28, 30, 0.75);
            --primary-text-dark: #f5f5f7;
            --secondary-text-dark: rgba(235, 235, 245, 0.65);
            --border-color-dark: rgba(255, 255, 255, 0.15);
            --shadow-color-dark: rgba(0, 0, 0, 0.25);
            --apple-blue-dark: #0A84FF;
            --apple-green-dark: #30D158;
            --apple-red-dark: #FF453A;
        }

        #etherscan-panel {
            position: fixed;
            top: 24px;
            right: 24px;
            width: 290px;
            padding: 20px;
            border-radius: 20px; /* 更柔和、更吸引人的曲线。 */
            /* Softer, more inviting curves. */
            font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            z-index: 10000;
            transition: opacity 0.4s cubic-bezier(0.19, 1, 0.22, 1), transform 0.4s cubic-bezier(0.19, 1, 0.22, 1);
            transform: translateX(0);
            backdrop-filter: blur(20px) saturate(180%); /* 我们新材质的魔力。 */
            /* The magic of our new material. */
            background-color: var(--bg-color-light);
            border: 1px solid var(--border-color-light);
            box-shadow: 0 10px 30px var(--shadow-color-light);
            color: var(--primary-text-light);
        }

        /* 无缝适应系统外观。 */
        /* Seamlessly adapt to your system's appearance. */
        @media (prefers-color-scheme: dark) {
            #etherscan-panel {
                background-color: var(--bg-color-dark);
                border-color: var(--border-color-dark);
                box-shadow: 0 10px 35px var(--shadow-color-dark);
                color: var(--primary-text-dark);
            }
        }

        #etherscan-panel.hidden {
            opacity: 0;
            transform: translateX(30px);
            pointer-events: none;
        }

        #etherscan-panel h3 {
            margin: 0 0 16px 0;
            padding-bottom: 12px;
            border-bottom: 1px solid var(--border-color-light);
            font-size: 17px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px; /* 完美间距，由设计决定。 */
            /* Perfect spacing, by design. */
            color: var(--apple-blue-light);
        }

        @media (prefers-color-scheme: dark) {
            #etherscan-panel h3 {
                border-bottom-color: var(--border-color-dark);
                color: var(--apple-blue-dark);
            }
        }

        /* 一个感觉像在家一样的图标。 */
        /* An icon that feels right at home. */
        #etherscan-panel h3::before {
            content: '💎';
            font-size: 20px;
        }

        #etherscan-panel p {
            margin: 10px 0;
            line-height: 1.5;
            font-size: 15px;
            color: var(--secondary-text-light);
        }

        #etherscan-panel p strong {
            font-weight: 500;
            color: var(--primary-text-light);
        }

        @media (prefers-color-scheme: dark) {
            #etherscan-panel p {
                 color: var(--secondary-text-dark);
            }
            #etherscan-panel p strong {
                color: var(--primary-text-dark);
            }
        }

        #etherscan-panel .success { color: var(--apple-green-light) !important; }
        #etherscan-panel .error { color: var(--apple-red-light) !important; }

         @media (prefers-color-scheme: dark) {
            #etherscan-panel .success { color: var(--apple-green-dark) !important; }
            #etherscan-panel .error { color: var(--apple-red-dark) !important; }
        }


        #etherscan-panel-close {
            position: absolute;
            top: 12px;
            right: 15px;
            cursor: pointer;
            font-size: 18px;
            font-weight: 500;
            width: 24px;
            height: 24px;
            line-height: 24px;
            text-align: center;
            border-radius: 50%;
            color: var(--secondary-text-light);
            background-color: rgba(0, 0, 0, 0.05);
            transition: background-color 0.2s ease, color 0.2s ease;
        }

        #etherscan-panel-close:hover {
            background-color: rgba(0, 0, 0, 0.1);
            color: var(--primary-text-light);
        }

        @media (prefers-color-scheme: dark) {
            #etherscan-panel-close {
                color: var(--secondary-text-dark);
                background-color: rgba(255, 255, 255, 0.1);
            }
            #etherscan-panel-close:hover {
                background-color: rgba(255, 255, 255, 0.2);
                color: var(--primary-text-dark);
            }
        }
    `);

    // --- UI 创建：这不是一个面板，而是一个窥视进程的窗口。 ---
    // --- UI Creation: It's not a panel, it's a window into the process. ---
    // 保留原UI创建逻辑，结构简单，因为简单是终极的复杂。
    // Keeping original UI creation logic. The structure is simple, because simplicity is the ultimate sophistication.
    function createPanel() {
        const panel = document.createElement('div');
        panel.id = 'etherscan-panel';
        panel.innerHTML = `
            <span id="etherscan-panel-close">&times;</span>
            <h3>Etherscan Assistant</h3>
            <div id="etherscan-panel-content">
                <p>正在与 Etherscan 同步...</p>
            </div>
        `;
        document.body.appendChild(panel);
        document.getElementById('etherscan-panel-close').addEventListener('click', () => {
            panel.classList.add('hidden');
        });
        return panel;
    }

    // --- 数据解析：从数字中找到清晰度。 ---
    // --- Data Parsing: Finding clarity in the numbers. ---
    // 该函数的核心逻辑非常出色，我们予以保留。
    // (The core logic of this function is excellent, we are keeping it.)
    function getPoints(element) {
        if (!element) return 0;
        const text = element.innerText || '';
        const numberString = text.replace(/💎|,/g, '').trim();
        return parseInt(numberString, 10) || 0;
    }

    // --- 核心引擎：美丽体验背后的强大技术。 ---
    // --- Core Engine: The robust technology behind the beautiful experience. ---
    // 核心功能和稳定性是基石，我们保留原逻辑，并新增礼盒点击。修复：使用反引号确保模板解析；合并积分显示，避免重复。
    // (Core functionality and stability are the foundation, which we have preserved untouched.)
    // 新增：检测并点击神秘礼盒按钮，如果可用。先礼盒后签到，确保最大化积分。
    // Addition: Detect and click Mystery Box button if available. Box first, then check-in for max points.
    // 修复：当已签到+无礼盒时，只显示单一积分和状态消息。
    // Fix: When already checked in + no box, display single points and status only.
    function runAutoClaimer() {
        let pointsElement = document.getElementById('spanTotalPoints');
        const checkinButton = document.getElementById('btncheckin');
        const claimTextSpan = document.getElementById('ContentPlaceHolder1_spanBtncheckin');
        const mysteryBoxBtn = document.getElementById('mystery-box-btn'); // 新增：获取礼盒按钮
        const panelContent = document.getElementById('etherscan-panel-content');

        // 检查关键组件是否存在
        if (!pointsElement || !checkinButton || !claimTextSpan) {
            panelContent.innerHTML = '<p>检测不到关键组件，助手无法启动。</p><p class="error">请检查页面是否为最新版本。</p>';
            return;
        }

        const pointsContainer = pointsElement.parentElement;
        if (!pointsContainer) {
            panelContent.innerHTML = '<p class="error">错误：无法定位积分模块，监视器启动失败。</p>';
            GM_log('Script Error: Could not find the parent element of #spanTotalPoints.');
            return;
        }

        const initialPoints = getPoints(pointsElement);
        // 初始显示：单一积分 + 检查状态（使用反引号模板）
        // Initial display: Single points + status check (using backticks for template)
        panelContent.innerHTML = `<p>当前积分: <strong>${initialPoints.toLocaleString()}</strong></p><p>正在检查签到和礼盒状态...</p>`;

        // 检查签到状态
        if (claimTextSpan.style.display === 'none') {
            panelContent.innerHTML += '<p>今日已完成签到。</p>'; // 追加状态
        } else {
            panelContent.innerHTML += '<p>检测到可签到。</p>';
        }

        // 新增：处理神秘礼盒
        // Addition: Handle Mystery Box
        let hasClaimedBox = false; // 标记是否已处理礼盒
        if (mysteryBoxBtn && mysteryBoxBtn.style.display !== 'none' && !mysteryBoxBtn.disabled) {
            try {
                GM_log('检测到神秘礼盒，正在自动开启...');
                panelContent.innerHTML += '<p>✨ 检测到神秘礼盒，正在自动开启...</p>';
                mysteryBoxBtn.click(); // 模拟点击，触发submitMysteryBox('15', '')
                hasClaimedBox = true;
            } catch (error) {
                GM_log('Error clicking Mystery Box: ' + error);
                panelContent.innerHTML += '<p class="error">礼盒点击失败，请手动尝试。</p>';
            }
        } else {
            GM_log('No Mystery Box available or already claimed.');
            panelContent.innerHTML += '<p>无可用神秘礼盒。</p>'; // 追加状态
        }

        // 如果可签到，继续原签到逻辑
        // If check-in available, proceed with original check-in logic
        if (claimTextSpan.style.display !== 'none') {
            GM_log('Setting up observer...');
            const observer = new MutationObserver((mutationsList, obs) => {
                GM_log('DOM change detected! Checking for new points...');

                pointsElement = document.getElementById('spanTotalPoints');
                const newPoints = getPoints(pointsElement);
                GM_log(`Initial points: ${initialPoints}, New points detected: ${newPoints}`);

                if (newPoints > initialPoints) {
                    GM_log('Points increased. Updating panel.');
                    const growth = newPoints - initialPoints;
                    let sourceMsg = '签到成功';
                    if (hasClaimedBox) {
                        sourceMsg = '签到与礼盒成功（总获取）'; // 统一显示总增长，提示含礼盒
                    }
                    // 更新整个面板为最新状态，避免重复（使用反引号）
                    // Update entire panel to latest, avoid duplicates (backticks)
                    panelContent.innerHTML = `
                        <p style="font-weight: 500; color: var(--primary-text-light);">✅ <strong>${sourceMsg}</strong></p>
                        <p>初始积分: ${initialPoints.toLocaleString()}</p>
                        <p>当前积分: <strong>${newPoints.toLocaleString()}</strong></p>
                        <p>本次总获取: <strong class="success">+${growth.toLocaleString()}</strong> ${hasClaimedBox ? '(可能含礼盒积分)' : ''}</p>
                    `;
                    // 深色模式需要动态颜色更新。
                    // Dark mode requires dynamic color update.
                    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                        panelContent.querySelector('p[style]').style.color = 'var(--primary-text-dark)';
                    }
                    obs.disconnect(); // 任务完成。就这么简单。
                    // Task complete. It's that simple.
                }
            });

            observer.observe(pointsContainer, {
                childList: true,
                subtree: true
            });
            GM_log('Observer started. Watching the points container.');

            panelContent.innerHTML += '<p>正在自动处理签到...</p>';
            GM_log('Clicking the check-in button.');
            try {
                checkinButton.click();
            } catch (error) {
                GM_log('Error clicking check-in: ' + error);
                panelContent.innerHTML += '<p class="error">签到点击失败，请手动尝试。</p>';
            }
        } else {
            // 已签到，无需签到observer。但如果有礼盒，检查变化
            // Already checked in, no observer needed. But if box, check for changes
            if (hasClaimedBox) {
                // 用setTimeout检查礼盒结果，并更新为单一显示
                // Use setTimeout to check box result, update to single display
                setTimeout(() => {
                    pointsElement = document.getElementById('spanTotalPoints');
                    const newPoints = getPoints(pointsElement);
                    if (newPoints > initialPoints) {
                        const growth = newPoints - initialPoints;
                        // 更新面板为最新积分，避免重复
                        // Update panel to latest points, avoid duplicates
                        panelContent.innerHTML = `
                            <p style="font-weight: 500; color: var(--primary-text-light);">✅ <strong>礼盒开启成功</strong></p>
                            <p>初始积分: ${initialPoints.toLocaleString()}</p>
                            <p>当前积分: <strong>${newPoints.toLocaleString()}</strong></p>
                            <p>礼盒获取: <strong class="success">+${growth.toLocaleString()}</strong></p>
                        `;
                        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                            panelContent.querySelector('p[style]').style.color = 'var(--primary-text-dark)';
                        }
                    } else {
                        // 无变化，追加状态消息，不重复积分
                        // No change, append status only, no duplicate points
                        panelContent.innerHTML += '<p>一切正常，无积分变化。</p>';
                    }
                }, 2000); // 等待2秒检查礼盒结果
            } else {
                // 已签到 + 无礼盒：只追加状态，不重复积分
                // Already checked in + no box: Append status only, no duplicate points
                panelContent.innerHTML += '<p>一切正常，今日任务已完成。</p>';
            }
        }
    }

    // --- 初始化：一切从这里开始。安静、高效。 ---
    // --- Initialization: It all starts here. Quietly, efficiently. ---
    // 启动逻辑保持不变，确保在最佳时机无缝启动。新增礼盒不影响原流程。
    // (The startup logic remains unchanged to ensure a seamless start at the optimal moment.)
    const panel = createPanel();
    const readyCheckInterval = setInterval(() => {
        if (document.getElementById('spanTotalPoints') && document.getElementById('btncheckin')) {
            clearInterval(readyCheckInterval);
            runAutoClaimer();
        }
    }, 500);

    setTimeout(() => {
        clearInterval(readyCheckInterval);
    }, 30000); // 慷慨的超时，以防万一。增加到30秒以覆盖礼盒延迟。
    // A generous timeout, just in case. Increased to 30s for box delay.

})();