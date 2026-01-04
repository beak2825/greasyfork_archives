// ==UserScript==
// @name         HHCLUB 魔力抽奖助手-统计版
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  自动抽奖工具，支持完整统计和动效优化
// @author       Assistant
// @match        https://hhanclub.top/lucky.php*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/545940/HHCLUB%20%E9%AD%94%E5%8A%9B%E6%8A%BD%E5%A5%96%E5%8A%A9%E6%89%8B-%E7%BB%9F%E8%AE%A1%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/545940/HHCLUB%20%E9%AD%94%E5%8A%9B%E6%8A%BD%E5%A5%96%E5%8A%A9%E6%89%8B-%E7%BB%9F%E8%AE%A1%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 检查抽奖页面
    if (!document.querySelector('#spain1') || !document.querySelector('#lotteryButton')) return;
    
    // 全局变量
    let isAutoDrawing = false;
    let sessionResults = [];
    let sessionDrawCount = 0;      // 总尝试次数
    let sessionSuccessCount = 0;   // 成功次数
    const COST_PER_DRAW = 2000;
    
    // 本次统计数据
    let sessionStats = { magic: 0, upload: 0, signCard: 0, invite: 0, rainbowId: 0, vip: 0 };
    
    // 数据存储相关
    const getCumulativeStats = () => ({
        totalDraws: GM_getValue('totalDraws', 0),
        totalSuccess: GM_getValue('totalSuccess', 0),
        totalCost: GM_getValue('totalCost', 0),
        totalMagic: GM_getValue('totalMagic', 0),
        totalUpload: GM_getValue('totalUpload', 0),
        totalSignCard: GM_getValue('totalSignCard', 0),
        totalInvite: GM_getValue('totalInvite', 0),
        totalRainbowId: GM_getValue('totalRainbowId', 0),
        totalVip: GM_getValue('totalVip', 0),
        prizeStats: JSON.parse(GM_getValue('prizeStats', '{}'))
    });
    
    const saveCumulativeStats = (stats) => {
        Object.entries(stats).forEach(([key, value]) => {
            GM_setValue(key, typeof value === 'object' ? JSON.stringify(value) : value);
        });
    };
    
    // 解析奖品信息
    const parsePrize = (prizeName) => {
        const patterns = {
            magic: /魔力\s*(\d+)/,
            upload: /上传量\s*(\d+)\s*GB/i,
            signCard: /补签卡\s*(\d+)/,
            invite: /邀请\s*(\d+)/,
            rainbowId: /彩虹\s*ID.*?(\d+)\s*Day/i,
            vip: /VIP.*?(\d+)\s*Day/i
        };
        
        const result = {};
        Object.entries(patterns).forEach(([key, pattern]) => {
            const match = prizeName.match(pattern);
            result[key] = match ? parseInt(match[1]) : 0;
        });
        
        return result;
    };
    
    // 创建悬浮面板
    function createFloatingPanel() {
        const panel = document.createElement('div');
        panel.id = 'lottery-helper-panel';
        panel.innerHTML = `
            <div style="
                position: fixed; top: 20px; left: 20px; width: 280px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 15px; padding: 20px; color: white;
                box-shadow: 0 20px 40px rgba(0,0,0,0.4); z-index: 50000;
                font-family: 'Microsoft YaHei', Arial, sans-serif; user-select: none;
                backdrop-filter: blur(15px);
            ">
                <div style="text-align: center; font-weight: bold; margin-bottom: 20px; font-size: 18px;">
                    🎰 魔力抽奖助手
                </div>
                
                <button id="auto-draw" style="
                    background: linear-gradient(135deg, #FF6B6B, #FF8E53); border: none; color: white;
                    padding: 15px; border-radius: 10px; cursor: pointer; font-size: 16px; font-weight: 600;
                    width: 100%; margin-bottom: 15px; transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
                ">🚀 自动抽奖</button>
                
                <button id="stop-draw" style="
                    background: linear-gradient(135deg, #95A5A6, #7F8C8D); border: none; color: white;
                    padding: 12px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600;
                    width: 100%; margin-bottom: 15px; display: none; transition: all 0.3s ease;
                ">⏹️ 停止抽奖</button>
                
                <!-- 动态进度条 -->
                <div id="progress-section" style="margin-bottom: 15px; display: none;">
                    <div style="background: rgba(255,255,255,0.2); height: 12px; border-radius: 6px; overflow: hidden; position: relative;">
                        <div id="progress-bar" style="
                            height: 100%; width: 0%; border-radius: 6px; position: relative; overflow: hidden;
                            background: linear-gradient(90deg, #4ECDC4, #44A08D);
                            transition: width 0.5s ease;
                        ">
                            <!-- 动态光效 -->
                            <div style="
                                position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
                                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                                animation: progress-shine 2s infinite;
                            "></div>
                        </div>
                    </div>
                    <div id="progress-text" style="font-size: 12px; text-align: center; margin-top: 5px; opacity: 0.9;">
                        准备中...
                    </div>
                </div>
                
                <!-- 本次统计 -->
                <div style="
                    background: rgba(255,255,255,0.1); border-radius: 10px; padding: 15px; margin-bottom: 15px;
                    backdrop-filter: blur(10px);
                ">
                    <div style="font-size: 14px; font-weight: 600; margin-bottom: 12px; color: #FFE082; text-align: center;">
                        📊 本次统计
                    </div>
                    <div style="font-size: 11px; line-height: 1.8;">
                        <div style="display: flex; justify-content: space-between;"><span>状态:</span><span id="current-status">待机中</span></div>
                        <div style="display: flex; justify-content: space-between;"><span>抽取:</span><span><span id="session-success">0</span>/<span id="session-total">0</span></span></div>
                        <div style="display: flex; justify-content: space-between;"><span>消耗:</span><span id="session-cost">0</span></div>
                        <div style="display: flex; justify-content: space-between;"><span>魔力:</span><span id="session-magic" style="color: #4ECDC4;">+0</span></div>
                        <div style="display: flex; justify-content: space-between;"><span>上传量:</span><span id="session-upload" style="color: #4ECDC4;">+0 GB</span></div>
                        <div style="display: flex; justify-content: space-between;"><span>补签卡:</span><span id="session-signcard" style="color: #4ECDC4;">+0</span></div>
                        <div style="display: flex; justify-content: space-between;"><span>邀请:</span><span id="session-invite" style="color: #4ECDC4;">+0</span></div>
                        <div style="display: flex; justify-content: space-between;"><span>彩虹ID:</span><span id="session-rainbow" style="color: #4ECDC4;">+0天</span></div>
                        <div style="display: flex; justify-content: space-between;"><span>VIP:</span><span id="session-vip" style="color: #4ECDC4;">+0天</span></div>
                    </div>
                </div>
                
                <button id="show-stats" style="
                    background: linear-gradient(135deg, #74B9FF, #0984E3); border: none; color: white;
                    padding: 12px 20px; border-radius: 20px; cursor: pointer; font-size: 13px; font-weight: 600;
                    width: 100%; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(116, 185, 255, 0.3);
                ">📈 查看累积统计</button>
                
                <!-- 添加进度条动画样式 -->
                <style>
                    @keyframes progress-shine {
                        0% { left: -100%; }
                        100% { left: 100%; }
                    }
                    @keyframes progress-pulse {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.7; }
                    }
                </style>
            </div>
        `;
        document.body.appendChild(panel);
        addButtonEffects();
    }
    
    // 添加按钮特效
    const addButtonEffects = () => {
        ['auto-draw', 'stop-draw', 'show-stats'].forEach(id => {
            const btn = document.getElementById(id);
            if (!btn) return;
            btn.addEventListener('mouseenter', function() {
                if (!this.disabled) {
                    this.style.transform = 'translateY(-3px) scale(1.02)';
                    this.style.filter = 'brightness(1.1)';
                }
            });
            btn.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.filter = 'brightness(1)';
            });
        });
    };
    
    // 更新状态和统计
    const updateStatus = (status) => {
        const element = document.getElementById('current-status');
        if (element) {
            element.textContent = status;
            element.style.color = status.includes('错误') ? '#FF6B6B' : '#4ECDC4';
        }
    };
    
    // 🔥 修正消耗计算逻辑：只按成功次数计算消耗
    const updateSessionStats = () => {
        const updates = {
            'session-success': sessionSuccessCount,
            'session-total': sessionDrawCount,
            'session-cost': (sessionSuccessCount * COST_PER_DRAW).toLocaleString(), // 👈 修正：按成功次数计算
            'session-magic': '+' + sessionStats.magic.toLocaleString(),
            'session-upload': '+' + sessionStats.upload + ' GB',
            'session-signcard': '+' + sessionStats.signCard,
            'session-invite': '+' + sessionStats.invite,
            'session-rainbow': '+' + sessionStats.rainbowId + '天',
            'session-vip': '+' + sessionStats.vip + '天'
        };
        
        Object.entries(updates).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
                if (id.startsWith('session-') && id !== 'session-success' && id !== 'session-total' && id !== 'session-cost') {
                    element.style.color = value === '+0' || value === '+0 GB' || value === '+0天' ? '#FFE082' : '#4ECDC4';
                }
            }
        });
    };
    
    // 增强进度条效果
    const updateProgress = (current, isInfinite = false) => {
        const progressSection = document.getElementById('progress-section');
        const progressBar = document.getElementById('progress-bar');
        const progressText = document.getElementById('progress-text');
        
        if (!progressSection || !progressBar || !progressText) return;
        
        if (isInfinite) {
            progressSection.style.display = 'block';
            progressBar.style.width = '100%';
            progressBar.style.background = 'linear-gradient(90deg, #FF6B6B, #FF8E53)';
            progressBar.style.animation = 'progress-pulse 1.5s ease-in-out infinite';
            progressText.textContent = `连续抽奖中... 已完成 ${current} 次`;
        } else {
            progressSection.style.display = 'none';
            progressBar.style.animation = 'none';
        }
    };
    
    // 等待抽奖状态
    const waitForNotRunning = (timeout = 10000) => new Promise((resolve) => {
        const startTime = Date.now();
        const checkInterval = setInterval(() => {
            if (!window.running || Date.now() - startTime > timeout) {
                clearInterval(checkInterval);
                if (window.running) window.running = false;
                resolve();
            }
        }, 100);
    });
    
    // 执行单次抽奖
    const performSingleDraw = async () => {
        await waitForNotRunning(8000);
        if (window.running) throw new Error('抽奖状态异常');
        
        window.running = true;
        console.log(`执行第${sessionDrawCount + 1}次抽奖...`);
        
        try {
            const response = await fetch('/plugin/lucky-draw', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'X-Requested-With': 'XMLHttpRequest' },
                body: ''
            });
            
            window.running = false;
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const responseData = await response.json();
            if (responseData.ret !== 0) throw new Error(responseData.msg || '抽奖失败');
            
            const result = {
                prize: responseData.data['prize_text'],
                angle: responseData.data.angle,
                timestamp: new Date().toLocaleString(),
                rawData: responseData.data
            };
            
            sessionResults.push(result);
            sessionDrawCount++;
            sessionSuccessCount++;  // 只有成功时才增加成功计数
            
            const parsed = parsePrize(result.prize);
            Object.keys(sessionStats).forEach(key => sessionStats[key] += parsed[key] || 0);
            
            updateSessionStats();
            console.log(`第${sessionDrawCount}次抽奖成功:`, result.prize);
            return result;
            
        } catch (error) {
            window.running = false;
            sessionDrawCount++;  // 失败也计入总尝试次数
            updateSessionStats(); // 🔥 关键修正：失败时也更新统计，但成功次数不变，所以消耗不变
            throw error;
        }
    };
    
    // 获取称号
    const getTitleByNetGain = (netGain, hasVip) => {
        if (hasVip) return '万里挑一的好运！';
        if (netGain >= 100000) return '全服最好运！';
        if (netGain >= -5000) return '运气不错！';
        if (netGain >= -10000) return '菜鸡！';
        if (netGain >= -30000) return '手气真差！';
        if (netGain >= -70000) return '大冤种！';
        if (netGain >= -100000) return '倒霉鬼！';
        return '憨的一逼！';
    };
    
    // 自动抽奖主函数
    const startAutoDrawing = async () => {
        if (isAutoDrawing) return alert('抽奖正在进行中...');
        
        isAutoDrawing = true;
        sessionResults = [];
        sessionDrawCount = sessionSuccessCount = 0;
        sessionStats = { magic: 0, upload: 0, signCard: 0, invite: 0, rainbowId: 0, vip: 0 };
        
        updateButtonsState(true);
        updateStatus('自动抽奖中...');
        updateSessionStats();
        updateProgress(0, true);
        
        let consecutiveFailures = 0;
        const maxConsecutiveFailures = 5;
        
        try {
            while (isAutoDrawing) {
                updateStatus(`抽奖中... (已成功 ${sessionSuccessCount} 次)`);
                updateProgress(sessionSuccessCount, true);
                
                try {
                    await performSingleDraw();
                    consecutiveFailures = 0;
                    await new Promise(resolve => setTimeout(resolve, 1500));
                } catch (error) {
                    consecutiveFailures++;
                    console.warn(`抽奖失败 (连续${consecutiveFailures}次):`, error);
                    
                    if (consecutiveFailures >= maxConsecutiveFailures) {
                        console.error('连续失败次数过多，暂停10秒');
                        updateStatus('连续失败，暂停中...');
                        await new Promise(resolve => setTimeout(resolve, 10000));
                        consecutiveFailures = 0;
                    } else {
                        await new Promise(resolve => setTimeout(resolve, 3000 * consecutiveFailures));
                    }
                }
            }
        } catch (error) {
            console.error('自动抽奖异常:', error);
        } finally {
            isAutoDrawing = false;
            updateButtonsState(false);
            updateProgress(sessionSuccessCount, true);
            updateStatus(`已停止 - 成功${sessionSuccessCount}次`);
            
            if (sessionSuccessCount > 0) {
                updateCumulativeStats(sessionResults);
                setTimeout(showSessionResults, 1000);
            }
        }
    };
    
    // 更新累积统计
    const updateCumulativeStats = (results) => {
        const stats = getCumulativeStats();
        
        results.forEach(result => {
            stats.totalDraws++;
            stats.totalSuccess++;
            stats.totalCost += COST_PER_DRAW;  // 累积统计按成功次数计算消耗
            
            const prizeName = result.prize;
            stats.prizeStats[prizeName] = (stats.prizeStats[prizeName] || 0) + 1;
            
            const parsed = parsePrize(prizeName);
            stats.totalMagic += parsed.magic;
            stats.totalUpload += parsed.upload;
            stats.totalSignCard += parsed.signCard;
            stats.totalInvite += parsed.invite;
            stats.totalRainbowId += parsed.rainbowId;
            stats.totalVip += parsed.vip;
        });
        
        saveCumulativeStats(stats);
    };
    
    // 显示本次结果
    const showSessionResults = () => {
        if (!sessionResults.length) return;
        
        const sessionPrizeStats = {};
        sessionResults.forEach(result => {
            sessionPrizeStats[result.prize] = (sessionPrizeStats[result.prize] || 0) + 1;
        });
        
        // 🔥 修正净收益计算：按成功次数计算消耗
        const netGain = sessionStats.magic - (sessionSuccessCount * COST_PER_DRAW);
        
        let resultHTML = `
            <div style="max-height: 70vh; overflow-y: auto;">
                <h3 style="margin-top: 0; color: #333; text-align: center;">🎉 本次抽奖结果</h3>
                
                <div style="background: linear-gradient(135deg, #74B9FF 0%, #0984E3 100%); color: white; padding: 15px; border-radius: 10px; margin-bottom: 15px; text-align: center;">
                    <div style="font-size: 16px; font-weight: bold;">本次统计</div>
                    <div style="margin-top: 10px; font-size: 13px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                        <div>尝试次数: ${sessionDrawCount} 次</div>
                        <div>成功次数: ${sessionSuccessCount} 次</div>
                        <div>成功率: ${sessionDrawCount > 0 ? ((sessionSuccessCount/sessionDrawCount)*100).toFixed(1) : 0}%</div>
                        <div>消耗憨豆: ${(sessionSuccessCount * COST_PER_DRAW).toLocaleString()}</div>
                        <div>获得魔力: ${sessionStats.magic.toLocaleString()}</div>
                        <div>上传量: +${sessionStats.upload} GB</div>
                        <div>补签卡: +${sessionStats.signCard}</div>
                        <div>邀请: +${sessionStats.invite}</div>
                        <div>彩虹ID: +${sessionStats.rainbowId}天</div>
                        <div>VIP: +${sessionStats.vip}天</div>
                        <div style="grid-column: 1/-1; color: ${netGain >= 0 ? '#4ECDC4' : '#FF6B6B'}; font-weight: bold; font-size: 14px;">
                            净收益: ${netGain >= 0 ? '+' : ''}${netGain.toLocaleString()}
                        </div>
                    </div>
                </div>
                
                <div>
                    <h4 style="color: #2c3e50; border-bottom: 2px solid #74B9FF; padding-bottom: 8px;">🏆 奖品详情</h4>
        `;
        
        Object.entries(sessionPrizeStats).sort((a, b) => b[1] - a[1]).forEach(([prize, count]) => {
            const percentage = ((count / sessionResults.length) * 100).toFixed(1);
            resultHTML += `
                <div style="margin: 6px 0; padding: 10px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; font-size: 13px;">
                    <span style="font-weight: bold;">${prize}</span>
                    <span style="background: rgba(255,255,255,0.2); padding: 3px 8px; border-radius: 12px; font-size: 12px;">${count} 次 (${percentage}%)</span>
                </div>
            `;
        });
        
        resultHTML += `</div></div>`;
        createModal('本次抽奖结果', resultHTML);
    };
    
    // 显示累积统计 - 增大称号文字
    const showCumulativeStats = () => {
        const stats = getCumulativeStats();
        if (!stats.totalDraws) return alert('暂无累积统计数据');
        
        const netTotalGain = stats.totalMagic - stats.totalCost;
        const hasVip = stats.totalVip > 0;
        const titleText = getTitleByNetGain(netTotalGain, hasVip);
        
        let statsHTML = `
            <div style="max-height: 75vh; overflow-y: auto;">
                <!-- 超大称号显示 -->
                <div style="
                    position: absolute; top: -10px; left: -10px;
                    background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);
                    color: white; padding: 15px 25px; border-radius: 20px 0 20px 0;
                    font-size: 24px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                    box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4); z-index: 10;
                    animation: title-glow 2s ease-in-out infinite alternate;
                ">${titleText}</div>
                
                <style>
                    @keyframes title-glow {
                        from { box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4); }
                        to { box-shadow: 0 12px 35px rgba(255, 107, 107, 0.6); }
                    }
                </style>
                
                <h3 style="margin-top: 35px; color: #333; text-align: center;">📊 累积统计数据</h3>
                
                <div style="background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%); color: white; padding: 15px; border-radius: 10px; margin-bottom: 15px; text-align: center;">
                    <div style="font-size: 16px; font-weight: bold; margin-bottom: 10px;">总体数据</div>
                    <div style="font-size: 12px; display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
                        <div>总抽奖: ${stats.totalDraws.toLocaleString()} 次</div>
                        <div>成功率: ${((stats.totalSuccess / stats.totalDraws) * 100).toFixed(1)}%</div>
                        <div>总消耗: ${stats.totalCost.toLocaleString()}</div>
                        <div>总魔力: ${stats.totalMagic.toLocaleString()}</div>
                        <div>上传量: ${stats.totalUpload} GB</div>
                        <div>补签卡: ${stats.totalSignCard}</div>
                        <div>邀请: ${stats.totalInvite}</div>
                        <div>彩虹ID: ${stats.totalRainbowId}天</div>
                        <div>VIP: ${stats.totalVip}天</div>
                        <div style="grid-column: 1/-1; color: ${netTotalGain >= 0 ? '#4ECDC4' : '#FFE082'}; font-weight: bold; font-size: 15px; margin-top: 5px;">
                            累积净收益: ${netTotalGain >= 0 ? '+' : ''}${netTotalGain.toLocaleString()}
                        </div>
                    </div>
                </div>
                
                <div>
                    <h4 style="color: #2c3e50; border-bottom: 2px solid #FF6B6B; padding-bottom: 8px;">🎁 奖品明细</h4>
                    <div style="max-height: 300px; overflow-y: auto;">
        `;
        
        Object.entries(stats.prizeStats).sort((a, b) => b[1] - a[1]).forEach(([prize, count]) => {
            const percentage = ((count / stats.totalSuccess) * 100).toFixed(1);
            statsHTML += `
                <div style="margin: 5px 0; padding: 8px; background: linear-gradient(135deg, #74B9FF 0%, #0984E3 100%); color: white; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; font-size: 12px;">
                    <span style="font-weight: bold;">${prize}</span>
                    <span style="background: rgba(255,255,255,0.2); padding: 2px 6px; border-radius: 10px; font-size: 11px;">${count} 次 (${percentage}%)</span>
                </div>
            `;
        });
        
        statsHTML += `
                    </div>
                </div>
                <div style="text-align: center; margin-top: 15px;">
                    <button style="background: #e74c3c; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 12px;" onclick="clearCumulativeStats()">清空统计数据</button>
                </div>
            </div>
        `;
        
        createModal('累积统计', statsHTML);
    };
    
    // 创建模态框
    const createModal = (title, content) => {
        document.getElementById('stats-modal')?.remove();
        
        const modal = document.createElement('div');
        modal.id = 'stats-modal';
        modal.innerHTML = `
            <div style="
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.7); z-index: 60000; display: flex;
                align-items: center; justify-content: center; backdrop-filter: blur(8px);
            " onclick="event.stopPropagation(); if(event.target === this) this.remove();">
                <div style="
                    background: white; padding: 25px; border-radius: 15px; max-width: 700px; width: 90%;
                    max-height: 85vh; overflow-y: auto; position: relative;
                    box-shadow: 0 25px 50px rgba(0,0,0,0.4);
                " onclick="event.stopPropagation();">
                    <button style="
                        position: absolute; top: 15px; right: 20px; background: none; border: none;
                        font-size: 24px; cursor: pointer; color: #999; font-weight: bold; z-index: 61000;
                    " onclick="document.getElementById('stats-modal').remove()">×</button>
                    ${content}
                    <div style="text-align: center; margin-top: 20px;">
                        <button style="
                            background: linear-gradient(135deg, #74B9FF 0%, #0984E3 100%); color: white;
                            border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer;
                            font-weight: 600; transition: transform 0.2s ease;
                        " onclick="document.getElementById('stats-modal').remove()" 
                           onmouseover="this.style.transform='translateY(-2px)'" 
                           onmouseout="this.style.transform='translateY(0)'">确定</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    };
    
    // 清空统计
    window.clearCumulativeStats = function() {
        if (!confirm('确定要清空所有累积统计数据吗？此操作不可恢复！')) return;
        
        ['totalDraws', 'totalSuccess', 'totalCost', 'totalMagic', 'totalUpload', 
         'totalSignCard', 'totalInvite', 'totalRainbowId', 'totalVip'].forEach(key => GM_setValue(key, 0));
        GM_setValue('prizeStats', '{}');
        alert('统计数据已清空');
        document.getElementById('stats-modal')?.remove();
    };
    
    // 停止抽奖
    const stopDrawing = () => {
        isAutoDrawing = false;
        updateStatus('正在停止...');
        console.log('用户手动停止抽奖');
    };
    
    // 更新按钮状态
    const updateButtonsState = (drawing) => {
        const autoDrawBtn = document.getElementById('auto-draw');
        const stopDrawBtn = document.getElementById('stop-draw');
        const progressSection = document.getElementById('progress-section');
        
        if (autoDrawBtn) {
            autoDrawBtn.style.display = drawing ? 'none' : 'block';
            autoDrawBtn.disabled = drawing;
        }
        if (stopDrawBtn) stopDrawBtn.style.display = drawing ? 'block' : 'none';
        if (progressSection) progressSection.style.display = drawing ? 'block' : 'none';
    };
    
    // 初始化
    const init = () => {
        setTimeout(() => {
            console.log('魔力抽奖助手正在初始化...');
            createFloatingPanel();
            
            // 绑定事件
            document.getElementById('auto-draw')?.addEventListener('click', startAutoDrawing);
            document.getElementById('stop-draw')?.addEventListener('click', stopDrawing);
            document.getElementById('show-stats')?.addEventListener('click', showCumulativeStats);
            
            // 防止意外刷新
            window.addEventListener('beforeunload', (e) => {
                if (isAutoDrawing) {
                    e.preventDefault();
                    e.returnValue = '抽奖正在进行中，确定要离开吗？';
                    return e.returnValue;
                }
            });
            
            updateStatus('就绪');
            updateSessionStats();
            console.log('魔力抽奖助手已启动');
            
            const stats = getCumulativeStats();
            if (stats.totalDraws > 0) {
                console.log(`累积统计: ${stats.totalDraws}次抽奖, 净收益: ${stats.totalMagic - stats.totalCost}`);
            }
        }, 1500);
    };
    
    // 启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();