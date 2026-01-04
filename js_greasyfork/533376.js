// ==UserScript==
// @name         网页访问加税模拟器
// @name:en      Web Page Tariff Simulator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  模拟对网页访问加征关税，讽刺贸易战
// @description:en  Simulate web page access tariffs to satirize trade wars
// @author       xjy666a
// @icon         https://img.picui.cn/free/2025/04/20/68047b6599955.png
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533376/%E7%BD%91%E9%A1%B5%E8%AE%BF%E9%97%AE%E5%8A%A0%E7%A8%8E%E6%A8%A1%E6%8B%9F%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/533376/%E7%BD%91%E9%A1%B5%E8%AE%BF%E9%97%AE%E5%8A%A0%E7%A8%8E%E6%A8%A1%E6%8B%9F%E5%99%A8.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2025 xjy666a

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function() {
    'use strict';

    // 用户配置
    let taxRate = GM_getValue('taxRate', 125); // 默认税率为125%
    let isEnabled = GM_getValue('isEnabled', true); // 默认启用
    let customExemptDomains = GM_getValue('customExemptDomains', []); // 用户自定义免税域名
    let highScore = GM_getValue('trumpGameHighScore', 0); // 打朗普游戏最高分
    // 用于跟踪独立游戏实例
    let standaloneGameActive = false;
    // 清关失败统计
    let clearanceFailCount = GM_getValue('clearanceFailCount', 0);
    // 清关失败概率 (默认5%)
    let clearanceFailRate = GM_getValue('clearanceFailRate', 5);
    // 关税减免申请状态
    let exemptionApplicationStatus = GM_getValue('exemptionApplicationStatus', 'none'); // none, pending, approved, rejected
    let exemptionApplicationProgress = GM_getValue('exemptionApplicationProgress', 0);

    // 预设免税网站列表
    const defaultExemptDomains = [
        // 手机网站
        'apple.com', 'mi.com', 'oneplus.com', 'samsung.com', 'huawei.com',
        'vivo.com', 'oppo.com', 'motorola.com', 'gsmarena.com', 'phonearena.com',
        // 半导体网站
        'intel.com', 'amd.com', 'nvidia.com', 'qualcomm.com', 'arm.com',
        'tsmc.com', 'micron.com', 'broadcom.com', 'analog.com', 'ti.com',
        'nxp.com', 'infineon.com', 'st.com', 'rohm.com', 'renesas.com',
        'skhynix.com', 'asml.com', 'semi.org', 'semiconductors.org'
    ];

    // 清关失败原因列表
    const clearanceFailReasons = [
        "海关系统维护中，请稍后再试",
        "IP地址与爱国证明不匹配",
        "关税标准变更，请重新申报",
        "关税支付系统超时",
        "未检测到有效的数字主权凭证",
        "WEB朗普发布新政策，需重新评估",
        "清关系统检测到非法字节",
        "数据包超重，需缴纳额外关税",
        "关税征收点拥堵，请排队等待",
        "您的浏览器关税特征被列入重点核查名单"
    ];

    // 合并默认和自定义免税域名
    let exemptDomains = [...defaultExemptDomains, ...customExemptDomains];

    // 判断当前网站是否免税
    function isExemptWebsite() {
        const currentHost = window.location.hostname.toLowerCase();

        // 检查是否为直接匹配的免税网站
        if (exemptDomains.some(domain => currentHost.includes(domain))) {
            return true;
        }

        // 检查是否为免税网站的中国域名版本（.cn）
        // 例如：apple.cn, apple.com.cn, mi.cn, mi.com.cn 等
        for (const domain of exemptDomains) {
            const baseDomain = domain.replace('.com', '').replace('.org', '');
            if (currentHost.includes(`${baseDomain}.cn`) ||
                currentHost.includes(`${baseDomain}.com.cn`)) {
                return true;
            }
        }

        return false;
    }

    // 显示清关失败界面
    function showClearanceFailure(originalContent, originalLoadTime, taxedLoadTime, finalScore) {
        // 增加清关失败计数
        clearanceFailCount++;
        GM_setValue('clearanceFailCount', clearanceFailCount);

        // 选择一个随机失败原因
        const failReason = clearanceFailReasons[Math.floor(Math.random() * clearanceFailReasons.length)];

        // 创建失败通知
        const failureDiv = document.createElement('div');
        failureDiv.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,0.8);display:flex;flex-direction:column;justify-content:center;align-items:center;z-index:9999;';

        failureDiv.innerHTML = `
            <div style="background-color:white;border-radius:15px;padding:30px;max-width:90%;width:600px;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,0.5);">
                <h2 style="color:#cc0000;margin:0 0 20px 0;font-size:28px;">⚠️ 清关失败 ⚠️</h2>
                <img src="https://img.picui.cn/free/2025/04/20/6804c691c2c7d.png" style="width:100px;height:100px;border-radius:50%;border:3px solid #cc0000;margin:10px 0 20px;box-shadow:0 5px 15px rgba(0,0,0,0.3);">
                <div style="background-color:#ffeeee;border-left:5px solid #cc0000;padding:15px;margin:15px 0;text-align:left;font-size:18px;color:#333;">
                    <strong>失败原因:</strong> ${failReason}
                </div>
                <p style="font-size:16px;color:#666;margin:15px 0;">
                    这是您的第 <span style="font-weight:bold;color:#cc0000;">${clearanceFailCount}</span> 次清关失败
                </p>
                <p style="font-size:14px;color:#666;margin:5px 0;">
                    当前清关失败概率: <span style="font-weight:bold;">${clearanceFailRate}%</span>
                </p>
                <div style="margin:30px 0 15px;">
                    <button id="retryClearanceBtn" style="background:#cc0000;color:white;border:none;border-radius:5px;padding:12px 25px;margin-right:15px;cursor:pointer;font-weight:bold;font-size:16px;">重新清关</button>
                    <button id="skipClearanceBtn" style="background:#333;color:white;border:none;border-radius:5px;padding:12px 25px;cursor:pointer;font-size:16px;margin-right:15px;">跳过清关</button>
                    <button id="applyExemptionBtn" style="background:#ff9900;color:white;border:none;border-radius:5px;padding:12px 25px;cursor:pointer;font-size:16px;">申请减免</button>
                </div>
                <p style="font-size:14px;color:#999;margin:20px 0 0;">WEBump提示："清关失败是因为被中国黑客入侵了系统！"</p>
            </div>
        `;

        document.body.appendChild(failureDiv);

        // 添加重试按钮事件
        document.getElementById('retryClearanceBtn').addEventListener('click', function() {
            failureDiv.remove();
            startTaxProcess(originalContent, originalLoadTime);
        });

        // 添加跳过按钮事件
        document.getElementById('skipClearanceBtn').addEventListener('click', function() {
            failureDiv.remove();
            completeTaxProcess(originalContent, originalLoadTime, taxedLoadTime, finalScore);
        });

        // 添加申请减免按钮事件
        document.getElementById('applyExemptionBtn').addEventListener('click', function() {
            failureDiv.remove();
            launchExemptionApplication();
        });
    }

    // 启动加税流程
    function startTaxProcess(originalContent, originalLoadTime) {
        // 计算税后加载时间
        const taxedLoadTime = originalLoadTime * (1 + taxRate / 100);
        const additionalWaitTime = taxedLoadTime - originalLoadTime;

        // 清除页面内容并显示加税提示
        document.body.innerHTML = '';
        const taxDiv = document.createElement('div');
        taxDiv.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background-color:white;display:flex;flex-direction:column;justify-content:center;align-items:center;font-size:24px;z-index:9999;';

        taxDiv.innerHTML = `
            <div style="text-align:center;max-width:80%;">
                <h1 style="color:red;">⚠️ 网页访问加征关税通知 ⚠️</h1>
                <p>根据最新贸易战政策，您访问此网站需加征 <span style="color:red;font-weight:bold;">${taxRate}%</span> 的关税</p>
                <p>原始加载时间：${(originalLoadTime/1000).toFixed(2)}秒</p>
                <p>税后加载时间：${(taxedLoadTime/1000).toFixed(2)}秒</p>
                <p>正在模拟贸易战带来的额外等待...</p>
                <div id="taxProgressBar" style="width:80%;height:20px;background:#eee;margin:20px auto;border-radius:10px;overflow:hidden;">
                    <div id="taxProgressFill" style="width:0%;height:100%;background:red;transition:width linear;"></div>
                </div>
                <p id="taxCountdown"></p>
                <p style="font-size:16px;color:#333;margin:5px 0 15px;">等待期间，您可以参与"打朗普"小游戏！</p>
                <button id="applyExemptionTaxBtn" style="background:#ff9900;color:white;border:none;border-radius:5px;padding:10px 20px;cursor:pointer;font-size:14px;margin-top:10px;">申请关税减免</button>
            </div>
        `;

        document.body.appendChild(taxDiv);

        // 添加打朗普小游戏
        addGameStyles();
        const gameContainer = createTrumpGame();

        // 将游戏容器添加到页面
        const contentDiv = taxDiv.querySelector('div');
        contentDiv.appendChild(gameContainer);

        // 创建并添加朗普元素
        const trump = createTrump(gameContainer);
        gameContainer.appendChild(trump);

        // 添加申请减免按钮事件
        document.getElementById('applyExemptionTaxBtn').addEventListener('click', function() {
            launchExemptionApplication();
        });

        // 添加进度条动画
        const progressFill = document.getElementById('taxProgressFill');
        const countdownEl = document.getElementById('taxCountdown');
        progressFill.style.transition = `width ${additionalWaitTime}ms linear`;

        // 启动倒计时
        const updateInterval = 100; // 每100毫秒更新一次
        let remainingTime = additionalWaitTime;

        const countdownInterval = setInterval(() => {
            remainingTime -= updateInterval;
            const percentage = 100 - (remainingTime / additionalWaitTime * 100);
            progressFill.style.width = `${percentage}%`;
            countdownEl.textContent = `剩余等待时间：${(remainingTime/1000).toFixed(1)}秒`;

            if (remainingTime <= 0) {
                clearInterval(countdownInterval);
            }
        }, updateInterval);

        // 等待额外的时间后恢复页面
        setTimeout(function() {
            // 获取最终得分
            const finalScore = document.getElementById('trumpGameScore') ?
                parseInt(document.getElementById('trumpGameScore').textContent.replace('关税得分: ', '')) : 0;

            // 随机决定是否清关失败 (使用自定义概率)
            if (Math.random() < (clearanceFailRate / 100)) {
                showClearanceFailure(originalContent, originalLoadTime, taxedLoadTime, finalScore);
            } else {
                completeTaxProcess(originalContent, originalLoadTime, taxedLoadTime, finalScore);
            }
        }, additionalWaitTime);
    }

    // 完成加税流程，恢复页面
    function completeTaxProcess(originalContent, originalLoadTime, taxedLoadTime, finalScore) {
        document.documentElement.innerHTML = originalContent;

        // 添加已完成税收的标记
        const taxPaidMark = document.createElement('div');
        taxPaidMark.style.cssText = 'position:fixed;top:10px;right:10px;background:rgba(0,0,0,0.8);color:white;padding:10px 15px;border-radius:5px;font-size:14px;z-index:9999;box-shadow:0 2px 10px rgba(0,0,0,0.3);';

        taxPaidMark.innerHTML = `
            <div style="border-bottom:1px solid rgba(255,255,255,0.3);padding-bottom:5px;margin-bottom:5px;font-weight:bold;color:#ff5555;">
                ⚠️ 网页访问已征收 ${taxRate}% 关税
            </div>
            <div style="display:flex;justify-content:space-between;margin:3px 0;">
                <span>原始加载时间:</span>
                <span>${(originalLoadTime/1000).toFixed(2)}秒</span>
            </div>
            <div style="display:flex;justify-content:space-between;margin:3px 0;">
                <span>关税后时间:</span>
                <span>${(taxedLoadTime/1000).toFixed(2)}秒</span>
            </div>
            ${finalScore > 0 ? `
            <div style="display:flex;justify-content:space-between;margin:3px 0;border-top:1px solid rgba(255,255,255,0.3);padding-top:5px;margin-top:5px;">
                <span>打朗普得分:</span>
                <span>${finalScore} 点</span>
            </div>
            ` : ''}
            ${clearanceFailCount > 0 ? `
            <div style="display:flex;justify-content:space-between;margin:3px 0;border-top:1px solid rgba(255,255,255,0.3);padding-top:5px;margin-top:5px;color:#ffaa55;">
                <span>历史清关失败:</span>
                <span>${clearanceFailCount} 次</span>
            </div>
            ` : ''}
            <div style="margin-top:5px;font-size:12px;text-align:center;color:#aaa;">
                点击关闭此提示
            </div>
        `;

        document.body.appendChild(taxPaidMark);

        // 添加MWGA标语
        const mwgaBanner = document.createElement('div');
        mwgaBanner.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:rgba(255,0,0,0.9);color:white;padding:10px 25px;border-radius:5px;font-size:18px;z-index:9999;box-shadow:0 2px 15px rgba(0,0,0,0.4);text-align:center;font-weight:bold;cursor:pointer;';

        mwgaBanner.innerHTML = `
            <div style="font-size:28px;letter-spacing:5px;margin-bottom:5px;">M W G A</div>
            <div style="font-size:16px;">Make Web Great Again!</div>
        `;

        document.body.appendChild(mwgaBanner);

        // 点击移除标记
        taxPaidMark.addEventListener('click', function() {
            taxPaidMark.remove();
        });

        mwgaBanner.addEventListener('click', function() {
            mwgaBanner.remove();
        });

        // 10秒后自动消失
        setTimeout(() => {
            if (taxPaidMark.parentNode) {
                taxPaidMark.style.transition = 'opacity 1s';
                taxPaidMark.style.opacity = '0';
                setTimeout(() => taxPaidMark.remove(), 1000);
            }

            if (mwgaBanner.parentNode) {
                mwgaBanner.style.transition = 'opacity 1s, transform 1s';
                mwgaBanner.style.opacity = '0';
                mwgaBanner.style.transform = 'translateX(-50%) translateY(20px)';
                setTimeout(() => mwgaBanner.remove(), 1000);
            }
        }, 10000);
    }

    // 独立启动打朗普游戏
    function launchStandaloneGame() {
        // 如果游戏已经在运行，则不要重复启动
        if (standaloneGameActive) {
            alert('打朗普游戏已经在运行中！');
            return;
        }

        standaloneGameActive = true;

        // 添加样式
        addGameStyles();

        // 创建游戏容器
        const gameOverlay = document.createElement('div');
        gameOverlay.id = 'trumpGameOverlay';
        gameOverlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,0.8);display:flex;flex-direction:column;justify-content:center;align-items:center;z-index:9999;';

        // 创建游戏布局
        const gameLayout = document.createElement('div');
        gameLayout.style.cssText = 'background-color:white;border-radius:15px;padding:20px;box-shadow:0 5px 25px rgba(0,0,0,0.5);position:relative;max-width:90%;width:500px;';

        // 标题和说明
        const gameHeader = document.createElement('div');
        gameHeader.style.cssText = 'text-align:center;margin-bottom:20px;';
        gameHeader.innerHTML = `
            <h2 style="color:#cc0000;margin:0 0 10px 0;font-size:28px;">🎮 打朗普小游戏</h2>
            <p style="margin:0;color:#666;font-size:16px;">让Web再次伟大！点击WEB朗普获得关税点数！</p>
        `;

        // 关闭按钮
        const closeButton = document.createElement('button');
        closeButton.textContent = '✖ 关闭游戏';
        closeButton.style.cssText = 'position:absolute;top:20px;right:20px;background:#cc0000;color:white;border:none;border-radius:5px;padding:8px 15px;cursor:pointer;font-weight:bold;';
        closeButton.addEventListener('click', function() {
            endStandaloneGame(true);
        });

        // 游戏容器
        const gameContainer = createTrumpGame();
        gameContainer.style.width = '350px';
        gameContainer.style.height = '400px';
        gameContainer.style.margin = '0 auto';

        // 创建朗普元素
        const trump = createTrump(gameContainer);
        gameContainer.appendChild(trump);

        // 组装界面
        gameLayout.appendChild(closeButton);
        gameLayout.appendChild(gameHeader);
        gameLayout.appendChild(gameContainer);
        gameOverlay.appendChild(gameLayout);
        document.body.appendChild(gameOverlay);

        // 添加键盘事件监听器
        document.addEventListener('keydown', handleKeyPress);

        // 重置游戏计时器
        const gameTimer = document.createElement('div');
        gameTimer.id = 'trumpGameTimer';
        gameTimer.style.cssText = 'position:absolute;bottom:15px;left:0;width:100%;text-align:center;font-size:16px;color:#333;';
        gameTimer.textContent = '游戏时间: 60秒';
        gameLayout.appendChild(gameTimer);

        // 添加声明
        const disclaimer = document.createElement('div');
        disclaimer.style.cssText = 'position:absolute;bottom:-40px;left:0;width:100%;text-align:center;font-size:14px;color:rgba(255,255,255,0.7);';
        disclaimer.textContent = '本游戏仅为讽刺，MWGA = Make Web Great Again!';
        gameLayout.appendChild(disclaimer);

        // 30秒游戏时间倒计时
        let timeLeft = 60;
        const countdownTimer = setInterval(() => {
            timeLeft--;
            if (document.getElementById('trumpGameTimer')) {
                document.getElementById('trumpGameTimer').textContent = `游戏时间: ${timeLeft}秒`;
            }

            if (timeLeft <= 0) {
                clearInterval(countdownTimer);
                endStandaloneGame(false);
            }
        }, 1000);

        // 保存游戏计时器以便后续清除
        gameOverlay.countdownTimer = countdownTimer;
    }

    // 键盘事件处理
    function handleKeyPress(e) {
        // ESC键关闭游戏
        if (e.key === 'Escape') {
            endStandaloneGame(true);
        }
    }

    // 结束独立游戏
    function endStandaloneGame(userCancelled) {
        const gameOverlay = document.getElementById('trumpGameOverlay');
        if (!gameOverlay) return;

        // 清除计时器
        if (gameOverlay.countdownTimer) {
            clearInterval(gameOverlay.countdownTimer);
        }

        // 移除键盘事件监听器
        document.removeEventListener('keydown', handleKeyPress);

        // 获取分数
        let finalScore = 0;
        const scoreEl = document.getElementById('trumpGameScore');
        if (scoreEl) {
            finalScore = parseInt(scoreEl.textContent.replace('关税得分: ', ''));
        }

        // 渐隐效果
        gameOverlay.style.transition = 'opacity 0.5s';
        gameOverlay.style.opacity = '0';

        setTimeout(() => {
            gameOverlay.remove();
            standaloneGameActive = false;

            // 如果不是用户取消，显示结果
            if (!userCancelled) {
                showGameResults(finalScore);
            }
        }, 500);
    }

    // 显示游戏结果
    function showGameResults(score) {
        const resultDiv = document.createElement('div');
        resultDiv.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);background:white;border:3px solid #cc0000;border-radius:10px;padding:20px;box-shadow:0 5px 25px rgba(0,0,0,0.5);z-index:9999;text-align:center;min-width:300px;';

        // 提示文字根据分数多少
        let message = '';
        if (score >= 50) {
            message = '你是击朗派高手！WEB朗普表示：VERY UNFAIR!';
        } else if (score >= 30) {
            message = '你很擅长击朗！Make Web Great Again!';
        } else if (score >= 15) {
            message = '不错的尝试，但WEB朗普会回来的!';
        } else {
            message = 'WEB朗普发推文：FAKE POINTS!';
        }

        resultDiv.innerHTML = `
            <h2 style="color:#cc0000;margin:0 0 15px 0;">游戏结束！</h2>
            <p style="font-size:24px;font-weight:bold;margin:10px 0;">你的得分: ${score} 点</p>
            <p style="font-size:16px;margin:15px 0;">${message}</p>
            <div style="margin-top:25px;">
                <button id="playAgainBtn" style="background:#cc0000;color:white;border:none;border-radius:5px;padding:8px 20px;margin-right:10px;cursor:pointer;font-weight:bold;">再玩一次</button>
                <button id="closeResultBtn" style="background:#333;color:white;border:none;border-radius:5px;padding:8px 20px;cursor:pointer;">关闭</button>
            </div>
        `;

        document.body.appendChild(resultDiv);

        // 添加按钮事件
        document.getElementById('playAgainBtn').addEventListener('click', function() {
            resultDiv.remove();
            launchStandaloneGame();
        });

        document.getElementById('closeResultBtn').addEventListener('click', function() {
            resultDiv.remove();
        });

        // 30秒后自动关闭
        setTimeout(() => {
            if (document.body.contains(resultDiv)) {
                resultDiv.style.transition = 'opacity 0.5s, transform 0.5s';
                resultDiv.style.opacity = '0';
                resultDiv.style.transform = 'translate(-50%, -60%)';
                setTimeout(() => resultDiv.remove(), 500);
            }
        }, 30000);
    }

    // 添加单独启动游戏的菜单
    GM_registerMenuCommand('🎮 开始打朗普游戏', launchStandaloneGame);

    // 添加清空清关失败次数的菜单
    GM_registerMenuCommand('🔄 重置清关失败计数', function() {
        if (clearanceFailCount > 0) {
            if (confirm(`确定要重置清关失败计数吗？当前失败次数: ${clearanceFailCount}`)) {
                clearanceFailCount = 0;
                GM_setValue('clearanceFailCount', 0);
                alert('已重置清关失败计数');
            }
        } else {
            alert('清关失败计数已经为0');
        }
    });

    // 添加设置清关失败概率的菜单
    GM_registerMenuCommand('⚠️ 设置清关失败概率', function() {
        const newRate = prompt(`请输入清关失败概率（0-100，如：5表示5%）：\n\n当前值: ${clearanceFailRate}%`, clearanceFailRate);
        if (newRate !== null && !isNaN(newRate) && newRate >= 0 && newRate <= 100) {
            clearanceFailRate = parseFloat(newRate);
            GM_setValue('clearanceFailRate', clearanceFailRate);
            alert(`清关失败概率已设置为 ${clearanceFailRate}%`);
        } else if (newRate !== null) {
            alert('请输入0-100之间的有效数字');
        }
    });

    // 注册菜单命令
    GM_registerMenuCommand('✅ 开启/关闭加税功能', function() {
        isEnabled = !isEnabled;
        GM_setValue('isEnabled', isEnabled);
        alert(`加税功能已${isEnabled ? '开启' : '关闭'}，刷新页面生效`);
        location.reload();
    });

    GM_registerMenuCommand('💰 设置网页访问税率', function() {
        const newRate = prompt('请输入网页访问税率（如：125表示125%）：', taxRate);
        if (newRate !== null && !isNaN(newRate) && newRate >= 0) {
            taxRate = parseFloat(newRate);
            GM_setValue('taxRate', taxRate);
            alert(`税率已设置为 ${taxRate}%`);
        }
    });

    GM_registerMenuCommand('🔍 管理自定义免税网站', function() {
        let message = '当前自定义免税网站列表（每行一个域名）：\n';
        message += '例如: example.com\n\n';
        message += '提示：修改后需刷新页面生效\n\n';

        const domainsText = prompt(message, customExemptDomains.join('\n'));

        if (domainsText !== null) {
            // 解析用户输入的域名（按行分割）
            const domains = domainsText
                .split('\n')
                .map(domain => domain.trim())
                .filter(domain => domain.length > 0);

            // 保存设置
            customExemptDomains = domains;
            GM_setValue('customExemptDomains', customExemptDomains);

            // 更新合并的列表
            exemptDomains = [...defaultExemptDomains, ...customExemptDomains];

            if (confirm(`已保存 ${domains.length} 个自定义免税网站，需要刷新页面才能生效。\n\n是否立即刷新页面？`)) {
                location.reload();
            }
        }
    });

    // 添加清空自定义免税网站的菜单
    GM_registerMenuCommand('🗑️ 清空自定义免税网站', function() {
        if (customExemptDomains.length === 0) {
            alert('自定义免税网站列表已经是空的');
            return;
        }

        if (confirm(`确定要清空所有 ${customExemptDomains.length} 个自定义免税网站吗？`)) {
            customExemptDomains = [];
            GM_setValue('customExemptDomains', []);

            // 更新合并的列表
            exemptDomains = [...defaultExemptDomains];

            if (confirm('已清空自定义免税网站列表，需要刷新页面才能生效。\n\n是否立即刷新页面？')) {
                location.reload();
            }
        }
    });

    // 添加删除单个免税网站的菜单
    GM_registerMenuCommand('✂️ 删除单个免税网站', function() {
        if (customExemptDomains.length === 0) {
            alert('自定义免税网站列表为空，没有可删除的网站');
            return;
        }

        // 构建带有编号的域名列表
        let listMessage = '当前自定义免税网站列表：\n\n';
        customExemptDomains.forEach((domain, index) => {
            listMessage += `${index + 1}. ${domain}\n`;
        });
        listMessage += '\n请输入要删除的网站序号(1-' + customExemptDomains.length + ')，或直接输入域名:';

        const userInput = prompt(listMessage);

        if (userInput === null) return; // 用户取消

        let indexToRemove = -1;
        const inputNum = parseInt(userInput);

        // 检查是否输入的是有效序号
        if (!isNaN(inputNum) && inputNum >= 1 && inputNum <= customExemptDomains.length) {
            indexToRemove = inputNum - 1;
        } else {
            // 按域名查找
            indexToRemove = customExemptDomains.findIndex(domain =>
                domain.toLowerCase() === userInput.toLowerCase().trim());
        }

        if (indexToRemove === -1) {
            alert('未找到匹配的免税网站，请检查输入');
            return;
        }

        // 获取要删除的域名并确认
        const domainToRemove = customExemptDomains[indexToRemove];
        if (confirm(`确定要删除免税网站 "${domainToRemove}" 吗？`)) {
            // 删除指定域名
            customExemptDomains.splice(indexToRemove, 1);
            GM_setValue('customExemptDomains', customExemptDomains);

            // 更新合并列表
            exemptDomains = [...defaultExemptDomains, ...customExemptDomains];

            if (confirm(`已删除免税网站 "${domainToRemove}"，需要刷新页面才能生效。\n\n是否立即刷新页面？`)) {
                location.reload();
            }
        }
    });

    // 关税减免申请系统
    function launchExemptionApplication() {
        // 如果已经申请或批准/拒绝，提示用户
        if (exemptionApplicationStatus !== 'none') {
            let message = '您已提交关税减免申请。';
            if (exemptionApplicationStatus === 'pending') {
                message += `\n当前状态: 审核中... (${exemptionApplicationProgress}/5 步)`;
            } else if (exemptionApplicationStatus === 'approved') {
                message += '\n状态: 已批准！恭喜您获得关税豁免！';
            } else if (exemptionApplicationStatus === 'rejected') {
                message += '\n状态: 已拒绝。原因：材料不符合WEB朗普的最新指示。';
            }
            alert(message);
            return;
        }

        // 弹出申请界面
        const overlay = document.createElement('div');
        overlay.id = 'exemptionOverlay';
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,0.8);display:flex;flex-direction:column;justify-content:center;align-items:center;z-index:9999;';

        const formDiv = document.createElement('div');
        formDiv.style.cssText = 'background-color:white;border-radius:15px;padding:30px;max-width:90%;width:700px;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,0.5);max-height:80vh;overflow-y:auto;';

        // 申请流程步骤
        const steps = [
            { title: '第一步：宣誓效忠', content: `
                <p style="margin-bottom:20px;font-size:16px;">请完整抄写以下誓词以证明您对Make Web Great Again事业的忠诚：</p>
                <textarea id="oathText" rows="5" style="width:90%;font-size:14px;border:1px solid #ccc;padding:10px;margin-bottom:15px;" readonly>我自愿申请关税减免，坚决拥护WEB朗普总统的英明领导，支持Make Web Great Again伟大事业，保证不访问任何被列为"数字敌对势力"的网站，如有违反，愿承担一切数字后果，包括但不限于IP永久封禁、浏览器历史记录公开等。</textarea>
                <input type="text" id="oathInput" placeholder="请在此处完整抄写上方誓词" style="width:90%;padding:10px;border:1px solid #ccc;font-size:14px;margin-bottom:10px;">
            ` },
            { title: '第二步：提交爱国证明', content: `
                <p style="margin-bottom:15px;font-size:16px;">请上传您的数字爱国者认证文件（仅接受.mwga格式）：</p>
                <input type="file" id="patriotFile" accept=".mwga" style="display:block;margin:10px auto;border:1px solid #ccc;padding:10px;width:80%;">
                <p style="font-size:12px;color:#999;margin-top:10px;">(提示：.mwga文件可通过购买官方MWGA周边产品获得)</p>
            ` },
            { title: '第三步：回答安全问题', content: `
                <p style="margin-bottom:15px;font-size:16px;">请回答以下由WEB朗普总统亲自设计的安全问题：</p>
                <label style="display:block;margin:10px 0;text-align:left;margin-left:5%;">1. 您认为谁是历史上最伟大的总统？</label>
                <input type="text" id="q1" style="width:90%;padding:10px;border:1px solid #ccc;margin-bottom:15px;">
                <label style="display:block;margin:10px 0;text-align:left;margin-left:5%;">2. "Make Web Great Again"的下一句是什么？</label>
                <input type="text" id="q2" style="width:90%;padding:10px;border:1px solid #ccc;margin-bottom:15px;">
                <label style="display:block;margin:10px 0;text-align:left;margin-left:5%;">3. 请用三个词形容您对关税政策的感受：</label>
                <input type="text" id="q3" style="width:90%;padding:10px;border:1px solid #ccc;margin-bottom:10px;">
            ` },
            { title: '第四步：等待随机审核', content: `
                <p style="margin-bottom:20px;font-size:16px;">您的申请已提交至关税随机审核系统（TRAS）。请保持耐心，审核结果将以弹窗形式通知。</p>
                <div style="width:80%;height:20px;background:#eee;margin:20px auto;border-radius:10px;overflow:hidden;">
                    <div id="reviewProgress" style="width:0%;height:100%;background:linear-gradient(90deg, rgba(204,0,0,1) 0%, rgba(255,102,102,1) 100%);transition:width 5s linear;"></div>
                </div>
                <p style="font-size:14px;color:#666;">审核过程可能需要5-500个工作日，请勿关闭浏览器...</p>
            ` },
            { title: '第五步：最终确认', content: `
                <p style="margin-bottom:20px;font-size:18px;">审核中... 请确认您已知悉以下条款：</p>
                <ul style="text-align:left;margin-left:10%;font-size:14px;line-height:1.6;">
                    <li>关税减免资格随时可能因政策调整而撤销。</li>
                    <li>获得减免后仍需接受随机数字内容审查。</li>
                    <li>WEB朗普总统拥有最终解释权。</li>
                </ul>
                <label style="display:block;margin-top:25px;font-size:16px;">
                    <input type="checkbox" id="finalConfirm"> 我已阅读并同意上述所有条款
                </label>
            ` }
        ];

        let currentStep = 0;

        function renderStep() {
            formDiv.innerHTML = `
                <h2 style="color:#cc0000;margin:0 0 25px 0;font-size:24px;">关税减免申请 (${currentStep + 1}/${steps.length})</h2>
                <h3 style="margin:0 0 20px 0;font-size:20px;">${steps[currentStep].title}</h3>
                <div style="margin-bottom:30px;">${steps[currentStep].content}</div>
                <div id="exemptionFormButtons" style="border-top:1px solid #eee;padding-top:20px;">
                    ${currentStep > 0 ? '<button data-action="prev" style="background:#666;color:white;border:none;border-radius:5px;padding:10px 20px;margin-right:15px;cursor:pointer;font-weight:bold;">上一步</button>' : ''}
                    <button data-action="next" style="background:#cc0000;color:white;border:none;border-radius:5px;padding:10px 20px;margin-right:15px;cursor:pointer;font-weight:bold;">${currentStep === steps.length - 1 ? '提交最终申请' : '下一步'}</button>
                    <button data-action="cancel" style="background:#333;color:white;border:none;border-radius:5px;padding:10px 20px;cursor:pointer;">取消申请</button>
                </div>
                <p style="font-size:12px;color:#999;margin-top:25px;">
                    提示：提交虚假信息可能导致您的数字信用评分降至"FAKE NEWS"级。
                </p>
            `;

            // 使用事件委托处理按钮点击
            const buttonContainer = formDiv.querySelector('#exemptionFormButtons');
            if (buttonContainer) {
                // 移除旧的监听器（如果存在）
                buttonContainer.replaceWith(buttonContainer.cloneNode(true));
                formDiv.querySelector('#exemptionFormButtons').addEventListener('click', (event) => {
                    const target = event.target;
                    if (target.tagName === 'BUTTON') {
                        const action = target.getAttribute('data-action');
                        if (action === 'prev') {
                            currentStep--;
                            renderStep();
                        } else if (action === 'next') {
                            handleNextStep();
                        } else if (action === 'cancel') {
                            overlay.remove();
                        }
                    }
                });
            }

            // 特殊步骤处理
            if (currentStep === 3) {
                // 模拟审核进度条
                setTimeout(() => {
                    const progressBar = document.getElementById('reviewProgress');
                    if (progressBar) progressBar.style.width = '100%';
                }, 100);
            }
        }

        function handleNextStep() {
            // 验证当前步骤
            if (currentStep === 0) {
                const oathText = document.getElementById('oathText').value;
                const oathInput = document.getElementById('oathInput').value;
                if (oathInput.trim() !== oathText.trim()) {
                    alert('誓词抄写不完整或有误，请仔细核对！忠诚度-10！');
                    return;
                }
            } else if (currentStep === 1) {
                const fileInput = document.getElementById('patriotFile');
                if (!fileInput.files || fileInput.files.length === 0) {
                    alert('请上传您的数字爱国者认证文件 (.mwga)！没有？快去买周边！');
                    return;
                } else if (!fileInput.files[0].name.endsWith('.mwga')) {
                     alert('文件格式错误！仅接受.mwga格式！回去好好学习！');
                    return;
                }
            } else if (currentStep === 2) {
                const q1 = document.getElementById('q1').value.toLowerCase();
                const q2 = document.getElementById('q2').value;
                const q3 = document.getElementById('q3').value;
                if (!q1.includes('trump') && !q1.includes('朗普')) {
                     alert('第一题答案错误！再想想谁才是最伟大的总统！');
                    return;
                }
                if (q2.trim() === '') {
                    alert('第二题不能为空！连口号都不知道还想减免？');
                    return;
                }
                 if (q3.trim() === '') {
                    alert('第三题不能为空！快用伟大、公平、胜利来形容！');
                    return;
                }
            } else if (currentStep === 4) {
                 if (!document.getElementById('finalConfirm').checked) {
                    alert('请先勾选同意条款！不同意还想占便宜？');
                    return;
                }
            }

            // 进入下一步或提交
            if (currentStep < steps.length - 1) {
                currentStep++;
                renderStep();
            } else {
                submitApplication();
            }
        }

        function submitApplication() {
            // 标记为审核中
            exemptionApplicationStatus = 'pending';
            exemptionApplicationProgress = 0; // 从0开始
            GM_setValue('exemptionApplicationStatus', 'pending');
            GM_setValue('exemptionApplicationProgress', 0);

            overlay.innerHTML = `
                <div style="background-color:white;border-radius:15px;padding:40px;text-align:center;">
                    <h2 style="color:#cc0000;margin:0 0 20px 0;">申请提交成功！</h2>
                    <p style="font-size:18px;margin-bottom:25px;">您的关税减免申请正在由WEB朗普总统亲自审核...</p>
                    <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExczFkYnh5Z2NqcDU0aHBoOXQ1d212cGJjcnI4aHgza2ZtYjN6eWNxZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oKIPgvPwXi2ZAIS5O/giphy.gif" style="width:150px;margin-bottom:25px;">
                    <p style="font-size:14px;color:#666;">审核过程大约需要1-5个工作日，请耐心等待（或者去买点MWGA股票加速审核）。</p>
                    <button id="closeSubmitBtn" style="background:#333;color:white;border:none;border-radius:5px;padding:10px 20px;margin-top:30px;cursor:pointer;">关闭</button>
                </div>
            `;

            document.getElementById('closeSubmitBtn').addEventListener('click', () => {
                overlay.remove();
            });

            // 模拟漫长的审核过程 (每小时推进一点点)
            simulateReviewProcess();
        }

        // 渲染第一步
        renderStep();
        overlay.appendChild(formDiv);
        document.body.appendChild(overlay);
    }

    // 模拟审核过程 (后台进行)
    function simulateReviewProcess() {
        if (exemptionApplicationStatus !== 'pending') return;

        const reviewInterval = setInterval(() => {
            if (exemptionApplicationStatus !== 'pending') {
                clearInterval(reviewInterval);
                return;
            }

            exemptionApplicationProgress++;
            GM_setValue('exemptionApplicationProgress', exemptionApplicationProgress);

            // 5步完成，随机决定结果 (极低概率批准)
            if (exemptionApplicationProgress >= 5) {
                clearInterval(reviewInterval);
                const isApproved = Math.random() < 0.01; // 1% 批准率

                if (isApproved) {
                    exemptionApplicationStatus = 'approved';
                    GM_setValue('exemptionApplicationStatus', 'approved');
                    alert('🥳 恭喜！您的关税减免申请已批准！享受0关税浏览吧！(有效期至下次政策调整)');
                    // 将当前网站加入临时豁免
                    if (window.location.hostname) {
                       customExemptDomains.push(window.location.hostname);
                       GM_setValue('customExemptDomains', customExemptDomains);
                       exemptDomains = [...defaultExemptDomains, ...customExemptDomains];
                    }
                } else {
                    exemptionApplicationStatus = 'rejected';
                    GM_setValue('exemptionApplicationStatus', 'rejected');
                    alert('😭 抱歉！您的关税减免申请已被拒绝。原因：忠诚度未达标。请购买更多MWGA产品后重试！');
                }
                // 重置进度
                 GM_setValue('exemptionApplicationProgress', 0);
            }
        }, 3600 * 1000); // 每小时执行一次
    }

    // 检查是否有待处理的申请
    simulateReviewProcess();

    // 添加菜单命令
    GM_registerMenuCommand('📝 申请关税减免', launchExemptionApplication);
    GM_registerMenuCommand('🔄 重置关税减免申请', function(){
        if (exemptionApplicationStatus !== 'none') {
            if (confirm('确定要重置关税减免申请状态吗？这将清除您当前的申请进度或结果。')) {
                exemptionApplicationStatus = 'none';
                exemptionApplicationProgress = 0;
                GM_setValue('exemptionApplicationStatus', 'none');
                GM_setValue('exemptionApplicationProgress', 0);
                alert('已重置关税减免申请状态。');
            }
        } else {
            alert('您还没有提交过申请。');
        }
    });

    // 如果功能关闭，仍然注册游戏菜单，但不执行加税逻辑
    if (!isEnabled) return;

    // 防止重复执行
    if (window.taxAlreadyApplied) return;
    window.taxAlreadyApplied = true;

    // 检查是否为免税网站
    if (isExemptWebsite()) {
        // 等网页加载完成后显示免税提示
        window.addEventListener('load', function() {
            const exemptNotice = document.createElement('div');
            exemptNotice.style.cssText = 'position:fixed;top:10px;right:10px;background:rgba(0,100,0,0.8);color:white;padding:10px 15px;border-radius:5px;font-size:14px;z-index:9999;box-shadow:0 2px 10px rgba(0,0,0,0.3);';

            exemptNotice.innerHTML = `
                <div style="font-weight:bold;margin-bottom:5px;">
                    ✅ 此网站享受特殊豁免权
                </div>
                <div style="font-size:12px;">
                    根据最新贸易政策，手机和半导体网站<br>无需缴纳网页访问关税！
                </div>
            `;

            document.body.appendChild(exemptNotice);

            // 点击关闭
            exemptNotice.addEventListener('click', function() {
                exemptNotice.remove();
            });

            // 5秒后自动消失
            setTimeout(() => {
                if (exemptNotice.parentNode) {
                    exemptNotice.style.transition = 'opacity 1s';
                    exemptNotice.style.opacity = '0';
                    setTimeout(() => exemptNotice.remove(), 1000);
                }
            }, 5000);
        });

        // 免税网站提前返回，不执行加税逻辑
        return;
    }

    // 记录页面加载开始时间
    const startTime = performance.now();

    // 打朗普小游戏
    function createTrumpGame() {
        // 游戏容器
        const gameContainer = document.createElement('div');
        gameContainer.id = 'trumpGame';
        gameContainer.style.cssText = 'width:300px;height:350px;margin:30px auto;border:3px solid #cc0000;border-radius:10px;position:relative;overflow:hidden;background-color:#f0f0f0;user-select:none;';

        // 游戏面板
        const gameScore = document.createElement('div');
        gameScore.id = 'trumpGameScore';
        gameScore.style.cssText = 'position:absolute;top:10px;left:10px;font-size:20px;font-weight:bold;color:#cc0000;z-index:100;';
        gameScore.textContent = '关税得分: 0';
        gameContainer.appendChild(gameScore);

        // 游戏最高分
        const gameHighScore = document.createElement('div');
        gameHighScore.id = 'trumpGameHighScore';
        gameHighScore.style.cssText = 'position:absolute;top:10px;right:10px;font-size:14px;color:#333;z-index:100;';
        gameHighScore.textContent = `最高分: ${highScore}`;
        gameContainer.appendChild(gameHighScore);

        // 游戏标题
        const gameTitle = document.createElement('div');
        gameTitle.style.cssText = 'position:absolute;top:40px;left:0;width:100%;text-align:center;font-size:18px;font-weight:bold;color:#333;';
        gameTitle.textContent = '🎮 打朗普小游戏';
        gameContainer.appendChild(gameTitle);

        // 游戏说明
        const gameInstruction = document.createElement('div');
        gameInstruction.style.cssText = 'position:absolute;top:65px;left:0;width:100%;text-align:center;font-size:14px;color:#666;';
        gameInstruction.textContent = '点击WEB朗普获得关税点数！';
        gameContainer.appendChild(gameInstruction);

        return gameContainer;
    }

    // 创建朗普元素
    function createTrump(gameContainer) {
        const trump = document.createElement('div');
        trump.classList.add('trump');
        trump.style.cssText = 'position:absolute;width:80px;height:80px;cursor:pointer;transition:transform 0.1s;z-index:90;';

        // 设置特朗普图片
        trump.innerHTML = `<img src="https://img.picui.cn/free/2025/04/20/6804c691c2c7d.png" style="width:100%;height:100%;border-radius:50%;object-fit:cover;box-shadow:0 3px 10px rgba(0,0,0,0.3);">`;

        // 随机位置
        positionTrump(trump, gameContainer);

        // 点击事件
        let score = 0;
        trump.addEventListener('click', function(e) {
            e.stopPropagation();
            score++;

            // 更新分数
            const scoreEl = document.getElementById('trumpGameScore');
            scoreEl.textContent = `关税得分: ${score}`;

            // 保存最高分
            if (score > highScore) {
                highScore = score;
                GM_setValue('trumpGameHighScore', highScore);
                const highScoreEl = document.getElementById('trumpGameHighScore');
                highScoreEl.textContent = `最高分: ${highScore}`;
            }

            // 点击特效
            const ripple = document.createElement('div');
            ripple.style.cssText = 'position:absolute;width:20px;height:20px;background-color:red;border-radius:50%;pointer-events:none;animation:ripple 0.5s linear;opacity:0.7;z-index:80;';
            ripple.style.left = (e.offsetX - 10) + 'px';
            ripple.style.top = (e.offsetY - 10) + 'px';
            this.appendChild(ripple);

            // 点击缩放动画
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
                ripple.remove();
            }, 100);

            // 点击音效
            const sounds = [
                "Fake News!",
                "Tremendous!",
                "Billions and Billions!",
                "CHINA!",
                "MWGA!",
                "I'm very rich!",
                "The BEST!"
            ];

            const soundBubble = document.createElement('div');
            soundBubble.style.cssText = 'position:absolute;background-color:#fff;border:2px solid #cc0000;border-radius:20px;padding:5px 10px;font-size:14px;font-weight:bold;color:#cc0000;animation:float 2s ease-out;pointer-events:none;white-space:nowrap;z-index:95;';
            soundBubble.textContent = sounds[Math.floor(Math.random() * sounds.length)];
            soundBubble.style.left = (e.offsetX - 20) + 'px';
            soundBubble.style.top = (e.offsetY - 40) + 'px';
            this.appendChild(soundBubble);

            // 2秒后移除气泡
            setTimeout(() => soundBubble.remove(), 2000);

            // 移动到新位置
            positionTrump(this, gameContainer);
        });

        return trump;
    }

    // 随机定位朗普
    function positionTrump(trump, container) {
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        const trumpWidth = 80;
        const trumpHeight = 80;

        // 随机位置，但避开顶部的分数区域
        const maxX = containerWidth - trumpWidth;
        const maxY = containerHeight - trumpHeight;
        const minY = 100; // 避开顶部文字

        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * (maxY - minY)) + minY;

        trump.style.left = randomX + 'px';
        trump.style.top = randomY + 'px';
    }

    // 添加CSS动画
    function addGameStyles() {
        const styles = document.createElement('style');
        styles.innerHTML = `
            @keyframes ripple {
                0% { transform: scale(1); opacity: 0.7; }
                100% { transform: scale(5); opacity: 0; }
            }

            @keyframes float {
                0% { transform: translateY(0); opacity: 1; }
                100% { transform: translateY(-40px); opacity: 0; }
            }

            #trumpGame .trump img:hover {
                transform: scale(1.05);
                box-shadow: 0 5px 15px rgba(204, 0, 0, 0.5);
            }
        `;
        document.head.appendChild(styles);
    }

    // 当页面加载完成时
    window.addEventListener('load', function() {
        // 计算原始加载时间（毫秒）
        const originalLoadTime = performance.now() - startTime;

        // 保存当前页面内容
        const originalContent = document.documentElement.innerHTML;

        // 启动加税流程
        startTaxProcess(originalContent, originalLoadTime);
    });
})();