// ==UserScript==
// @name         统计Steam交易历史页面的撤回报价
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  统计Steam交易历史页面的各种交易状态,并且截图到本地
// @author       Venfiw
// @match        https://steamcommunity.com/id/*/tradehistory/*
// @match        https://steamcommunity.com/profiles/*/tradehistory/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @connect      cdnjs.cloudflare.com
// @connect      unpkg.com
// @connect      cdn.jsdelivr.net
// @downloadURL https://update.greasyfork.org/scripts/542896/%E7%BB%9F%E8%AE%A1Steam%E4%BA%A4%E6%98%93%E5%8E%86%E5%8F%B2%E9%A1%B5%E9%9D%A2%E7%9A%84%E6%92%A4%E5%9B%9E%E6%8A%A5%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/542896/%E7%BB%9F%E8%AE%A1Steam%E4%BA%A4%E6%98%93%E5%8E%86%E5%8F%B2%E9%A1%B5%E9%9D%A2%E7%9A%84%E6%92%A4%E5%9B%9E%E6%8A%A5%E4%BB%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 全局变量存储统计数据
    let totalTradeHistoryRows = 0;
    let totalUnsettled = 0;
    let totalReverted = 0;
    let totalReverted2 = 0;
    let revertedContents = [];
    let revertedDetails = []; // 新增：存储撤销交易的详细信息
    let lastPageParams = '';

    // 使用GM_xmlhttpRequest动态加载html2canvas库（更可靠版本）
    function loadHtml2Canvas() {
        return new Promise((resolve, reject) => {
            if (window.html2canvas && typeof window.html2canvas === 'function') {
                console.log('html2canvas已存在，直接使用');
                resolve(window.html2canvas);
                return;
            }
            
            const cdnSources = [
                'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
                'https://unpkg.com/html2canvas@1.4.1/dist/html2canvas.min.js',
                'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js'
            ];
            
            let currentIndex = 0;
            
            function tryLoadFromCDN() {
                if (currentIndex >= cdnSources.length) {
                    reject(new Error('所有CDN源都加载失败'));
                    return;
                }
                
                console.log(`尝试从CDN ${currentIndex + 1}加载html2canvas...`);
                
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: cdnSources[currentIndex],
                    timeout: 30000,
                    onload: function(response) {
                        try {
                            console.log(`CDN ${currentIndex + 1}请求成功，代码长度: ${response.responseText.length}`);
                            
                            // 检查响应内容是否包含html2canvas
                            if (!response.responseText.includes('html2canvas')) {
                                throw new Error('响应内容不包含html2canvas代码');
                            }
                            
                            console.log('开始执行html2canvas代码...');
                            
                            // 使用eval在全局作用域执行
                            (function() {
                                eval(response.responseText);
                            }).call(window);
                            
                            // 立即检查是否加载成功
                            console.log('执行完成，检查window.html2canvas:', typeof window.html2canvas);
                            
                            if (window.html2canvas && typeof window.html2canvas === 'function') {
                                console.log(`html2canvas从CDN ${currentIndex + 1}加载成功`);
                                
                                // 进行功能测试
                                setTimeout(() => {
                                    try {
                                        const testDiv = document.createElement('div');
                                        testDiv.style.cssText = 'width:1px;height:1px;position:absolute;left:-9999px;background:red;';
                                        document.body.appendChild(testDiv);
                                        
                                        window.html2canvas(testDiv, { 
                                            width: 1, 
                                            height: 1,
                                            logging: false,
                                            useCORS: true
                                        }).then((canvas) => {
                                            document.body.removeChild(testDiv);
                                            console.log('html2canvas功能验证成功，canvas尺寸:', canvas.width, 'x', canvas.height);
                                            resolve(window.html2canvas);
                                        }).catch((testError) => {
                                            document.body.removeChild(testDiv);
                                            console.warn('html2canvas功能测试失败:', testError);
                                            throw new Error('html2canvas功能测试失败: ' + testError.message);
                                        });
                                    } catch (testError) {
                                        console.warn(`CDN ${currentIndex + 1}功能测试异常:`, testError);
                                        throw testError;
                                    }
                                }, 500); // 减少等待时间到500ms
                                
                            } else {
                                throw new Error('html2canvas未正确加载到window对象，当前类型: ' + typeof window.html2canvas);
                            }
                            
                        } catch (error) {
                            console.warn(`CDN ${currentIndex + 1}执行失败:`, error);
                            currentIndex++;
                            setTimeout(tryLoadFromCDN, 1000); // 增加重试延迟
                        }
                    },
                    onerror: function(error) {
                        console.warn(`CDN ${currentIndex + 1}请求失败:`, error);
                        currentIndex++;
                        setTimeout(tryLoadFromCDN, 1000);
                    },
                    ontimeout: function() {
                        console.warn(`CDN ${currentIndex + 1}请求超时`);
                        currentIndex++;
                        setTimeout(tryLoadFromCDN, 1000);
                    }
                });
            }
            
            tryLoadFromCDN();
        });
    }

    // 截图单个交易记录行（改进版）
    // 获取当前用户ID
    function getCurrentUserID() {
        const url = window.location.href;
        
        // 匹配 steamcommunity.com/id/*/tradehistory/* 格式
        const idMatch = url.match(/steamcommunity\.com\/id\/([^\/]+)\/tradehistory/);
        if (idMatch) {
            return idMatch[1];
        }
        
        // 匹配 steamcommunity.com/profiles/*/tradehistory/* 格式
        const profileMatch = url.match(/steamcommunity\.com\/profiles\/([^\/]+)\/tradehistory/);
        if (profileMatch) {
            return profileMatch[1];
        }
        
        return '未知用户';
    }

    // 截图交易历史行
    async function captureTradeHistoryRow(rowElement, detail) {
        if (!rowElement) {
            console.error('未找到要截图的元素');
            return false;
        }
    
        try {
            // 等待html2canvas加载
            await loadHtml2Canvas();
            
            // 使用html2canvas截图
            const canvas = await html2canvas(rowElement, {
                backgroundColor: '#1b2838',
                scale: 2,
                logging: false,
                useCORS: true,
                allowTaint: true
            });
            
            // 转换为图片并下载
            const dataUrl = canvas.toDataURL('image/png');
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const itemName = detail.物品名称 ? detail.物品名称.replace(/[<>:"/\\|?*]/g, '_') : '未知物品';
            const userID = detail.我的ID || getCurrentUserID(); // 获取用户ID
            const fileName = `${userID}_Steam交易_${itemName}_${timestamp}.png`; // 在文件名前加上用户ID
            
            // 使用GM_download下载（如果可用）
            if (typeof GM_download !== 'undefined') {
                GM_download(dataUrl, fileName, dataUrl);
            } else {
                // 降级到传统下载方法
                const link = document.createElement('a');
                link.download = fileName;
                link.href = dataUrl;
                link.click();
            }
            
            console.log(`截图已保存: ${fileName}`);
            return true;
        } catch (error) {
            console.error('截图失败:', error);
            
            // 最后的备用方案：复制内容到剪贴板
            const textContent = `
    交易详情:
    物品名称: ${detail.物品名称}
    交易时间: ${detail.交易时间}
    撤回时间: ${detail.撤回时间}
    对方SteamID64: ${detail.对方SteamID64}

    原始HTML:
    ${rowElement.outerHTML}
    `;
            
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(textContent);
                console.log('截图失败，内容已复制到剪贴板');
            } else {
                console.log('截图失败，请手动复制以下内容:', textContent);
            }
            return false;
        }
    }

    // 从localStorage加载数据
    function loadData() {
        const savedData = localStorage.getItem('steamTradeStats');
        if (savedData) {
            const data = JSON.parse(savedData);
            totalTradeHistoryRows = data.totalTradeHistoryRows || 0;
            totalUnsettled = data.totalUnsettled || 0;
            totalReverted = data.totalReverted || 0;
            totalReverted2 = data.totalReverted2 || 0;
            revertedContents = data.revertedContents || [];
            revertedDetails = data.revertedDetails || [];
            lastPageParams = data.lastPageParams || '';
        }
    }

    // 保存数据到localStorage
    function saveData() {
        const data = {
            totalTradeHistoryRows,
            totalUnsettled,
            totalReverted,
            totalReverted2,
            revertedContents,
            revertedDetails,
            lastPageParams
        };
        localStorage.setItem('steamTradeStats', JSON.stringify(data));
    }

    // 更新详情显示
    function updateDetailsDisplay() {
        const detailsContainer = document.getElementById('details-container');
        const copyBtn = document.getElementById('copy-details-btn');
        
        if (detailsContainer && revertedDetails.length > 0) {
            detailsContainer.style.display = 'block';
            detailsContainer.innerHTML = `
                <div style="max-height: 200px; overflow-y: auto; background: #0e1419; padding: 10px; border-radius: 3px; margin-top: 10px;">
                    <div style="font-weight: bold; margin-bottom: 5px;">撤销交易详情 (${revertedDetails.length}条):</div>
                    ${revertedDetails.map((detail, index) => `
                        <div style="margin-bottom: 8px; padding: 5px; background: #1a252f; border-radius: 2px; font-size: 12px;">
                            <div><strong>序号:</strong> ${index + 1}</div>
                            <div><strong>我的ID:</strong> ${detail.我的ID}</div>
                            <div><strong>物品:</strong> ${detail.物品名称}</div>
                            <div><strong>交易时间:</strong> ${detail.交易时间}</div>
                            <div><strong>撤回时间:</strong> ${detail.撤回时间}</div>
                            <div><strong>对方ID:</strong> ${detail.对方SteamID64}</div>
                        </div>
                    `).join('')}
                </div>
            `;
            if (copyBtn) copyBtn.style.display = 'block';
        } else {
            if (detailsContainer) detailsContainer.style.display = 'none';
            if (copyBtn) copyBtn.style.display = 'none';
        }
    }

    // 创建显示面板
    function createDisplayPanel() {
        const panel = document.createElement('div');
        panel.id = 'trade-stats-panel';
        panel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: #1b2838;
            color: #c7d5e0;
            padding: 15px;
            border-radius: 5px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            z-index: 10000;
            min-width: 250px;
            max-width: 400px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        `;

        panel.innerHTML = `
            <div style="margin-bottom: 10px; font-weight: bold; color: #66c0f4;">交易统计</div>
            <div>总交易记录: <span id="total-rows">0</span></div>
            <div>未完成交易: <span id="total-unsettled">0</span></div>
            <div>物品撤销: <span id="total-reverted">0</span></div>
            <div>物品退回: <span id="total-reverted2">0</span></div>
            <button id="check-trade-btn" style="
                margin-top: 10px;
                padding: 8px 16px;
                background: #4c6b22;
                color: white;
                border: none;
                border-radius: 3px;
                cursor: pointer;
                width: 100%;
            ">检查交易</button>
            <button id="clear-stats-btn" style="
                margin-top: 5px;
                padding: 8px 16px;
                background: #8B0000;
                color: white;
                border: none;
                border-radius: 3px;
                cursor: pointer;
                width: 100%;
            ">清空统计</button>
            <button id="capture-screenshots-btn" style="
                margin-top: 5px;
                padding: 8px 16px;
                background: #ff6b35;
                color: white;
                border: none;
                border-radius: 3px;
                cursor: pointer;
                width: 100%;
            ">批量截图保存</button>
            <div id="details-container" style="display: none;"></div>
            <button id="copy-details-btn" style="
                margin-top: 5px;
                padding: 8px 16px;
                background: #2a475e;
                color: white;
                border: none;
                border-radius: 3px;
                cursor: pointer;
                width: 100%;
                display: none;
            ">复制详情日志</button>
        `;

        document.body.appendChild(panel);
        return panel;
    }

    // 更新显示面板
    function updateDisplay() {
        // 添加安全检查，确保元素存在
        const totalRowsElement = document.getElementById('total-rows');
        const totalUnsettledElement = document.getElementById('total-unsettled');
        const totalRevertedElement = document.getElementById('total-reverted');
        const totalReverted2Element = document.getElementById('total-reverted2');
        
        if (totalRowsElement) totalRowsElement.textContent = totalTradeHistoryRows;
        if (totalUnsettledElement) totalUnsettledElement.textContent = totalUnsettled;
        if (totalRevertedElement) totalRevertedElement.textContent = totalReverted;
        if (totalReverted2Element) totalReverted2Element.textContent = totalReverted2;
        
        // 更新详情显示
        updateDetailsDisplay();
    }

    // 获取当前页面参数
    function getCurrentPageParams() {
        const url = new URL(window.location.href);
        const afterTime = url.searchParams.get('after_time') || '';
        const afterTrade = url.searchParams.get('after_trade') || '';
        return `${afterTime}_${afterTrade}`;
    }

    // 统计当前页面的交易数据（修复重复累加bug）
    function countTradeElements() {
        const currentPageParams = getCurrentPageParams();
        
        // 如果页面参数没有变化，不进行累加，但仍然更新显示
        if (currentPageParams === lastPageParams) {
            console.log('页面未变化，跳过统计');
            updateDisplay();
            return;
        }

        // 统计各种元素
        const tradeHistoryRows = document.querySelectorAll('.tradehistoryrow');
        const unsettledElements = document.querySelectorAll('.inventory_history_unsettled');
        const revertedElements = document.querySelectorAll('.inventory_history_reverted');

        // 累加到总数
        totalTradeHistoryRows += tradeHistoryRows.length;
        totalUnsettled += unsettledElements.length;
        totalReverted += revertedElements.length;

        // 统计物品退回交易（"物品已退回至此前的所有者"）
        const reverted2Elements = document.querySelectorAll('.tradehistory_event_description');
        let reverted2Count = 0;
        reverted2Elements.forEach(element => {
            if (element.textContent.includes('物品已退回至此前的所有者')) {
                reverted2Count++;
            }
        });
        totalReverted2 += reverted2Count;

        // 保存撤销交易的内容
        revertedElements.forEach(element => {
            const contentElement = element.querySelector('.tradehistory_content');
            if (contentElement) {
                revertedContents.push(contentElement.innerHTML);
            }
        });

        // 收集撤销交易的详细信息（修改部分）
        revertedElements.forEach(element => {
            const tradeRow = element.closest('.tradehistoryrow');
            if (tradeRow) {
                // 提取物品名称
                const itemNameElement = tradeRow.querySelector('.history_item_name');
                const itemName = itemNameElement ? itemNameElement.textContent.trim() : '未知物品';
                
                // 提取交易时间
                const tradeDateElement = tradeRow.querySelector('.tradehistory_date');
                const tradeDate = tradeDateElement ? tradeDateElement.textContent.trim() : '未知时间';
                
                // 提取撤回时间（通常在reverted元素中）
                const revertedText = element.textContent || '';
                const revertTime = revertedText.includes('时间') ? revertedText : '未知撤回时间';
                
                // 提取对方SteamID64（从链接中获取）
                const profileLink = tradeRow.querySelector('a[href*="steamcommunity.com/profiles/"]');
                let steamID64 = '未知ID';
                if (profileLink) {
                    const match = profileLink.href.match(/profiles\/(\d+)/);
                    if (match) {
                        steamID64 = match[1];
                    }
                }
                
                const detail = {
                    我的ID: getCurrentUserID(), // 新增：添加当前用户ID
                    物品名称: itemName,
                    交易时间: tradeDate,
                    撤回时间: revertTime,
                    对方SteamID64: steamID64
                };
                
                revertedDetails.push(detail);
            }
        });

        // 更新页面参数记录
        lastPageParams = currentPageParams;

        // 保存数据到localStorage
        saveData();

        console.log(`当前页面统计:`);
        console.log(`- 交易记录: ${tradeHistoryRows.length}`);
        console.log(`- 未完成: ${unsettledElements.length}`);
        console.log(`- 已撤销: ${revertedElements.length}`);
        console.log(`- 物品退回: ${reverted2Count}`);
        console.log(`累计统计:`);
        console.log(`- 总交易记录: ${totalTradeHistoryRows}`);
        console.log(`- 总未完成: ${totalUnsettled}`);
        console.log(`- 总已撤销: ${totalReverted}`);
        console.log(`- 总物品退回: ${totalReverted2}`);
        console.log(`- 撤销内容数量: ${revertedContents.length}`);
        console.log(`- 撤销详情数量: ${revertedDetails.length}`);

        // 更新显示
        updateDisplay();
    }

    // 初始化
    function init() {
        // 加载保存的数据
        loadData();
        
        // 创建显示面板
        const panel = createDisplayPanel();
        
        // 确保面板创建完成后再更新显示
        setTimeout(() => {
            updateDisplay();
        }, 100);
        
        // 绑定按钮事件
        document.getElementById('check-trade-btn').addEventListener('click', countTradeElements);
        
        // 绑定清空按钮事件
        document.getElementById('clear-stats-btn').addEventListener('click', function() {
            // 清空所有统计数据
            totalTradeHistoryRows = 0;
            totalUnsettled = 0;
            totalReverted = 0;
            totalReverted2 = 0;
            revertedContents = [];
            revertedDetails = [];
            lastPageParams = '';
            
            // 清空localStorage
            localStorage.removeItem('steamTradeStats');
            
            // 更新显示
            updateDisplay();
            
            console.log('统计数据已清空');
        });
        
        // 绑定截图按钮事件
        document.getElementById('capture-screenshots-btn').addEventListener('click', async function() {
            const revertedRows = document.querySelectorAll('.tradehistoryrow');
            let captureCount = 0;
            let successCount = 0;
            
            // 创建当前页面的撤销交易详情数组
            const currentPageDetails = [];
            
            // 先收集当前页面的撤销交易详情
            revertedRows.forEach((row, index) => {
                const revertedElement = row.querySelector('.inventory_history_reverted');
                if (revertedElement) {
                    // 提取物品名称
                    const itemNameElement = row.querySelector('.history_item_name');
                    const itemName = itemNameElement ? itemNameElement.textContent.trim() : '未知物品';
                    
                    // 提取交易时间
                    const tradeDateElement = row.querySelector('.tradehistory_date');
                    const tradeDate = tradeDateElement ? tradeDateElement.textContent.trim() : '未知时间';
                    
                    // 提取撤回时间（通常在reverted元素中）
                    const revertedText = revertedElement.textContent || '';
                    const revertTime = revertedText.includes('时间') ? revertedText : '未知撤回时间';
                    
                    // 提取对方SteamID64（从链接中获取）
                    const profileLink = row.querySelector('a[href*="steamcommunity.com/profiles/"]');
                    let steamID64 = '未知ID';
                    if (profileLink) {
                        const match = profileLink.href.match(/profiles\/(\d+)/);
                        if (match) {
                            steamID64 = match[1];
                        }
                    }
                    
                    const detail = {
                        物品名称: itemName,
                        交易时间: tradeDate,
                        撤回时间: revertTime,
                        对方SteamID64: steamID64
                    };
                    
                    currentPageDetails.push(detail);
                }
            });
            
            // 现在使用当前页面的详情进行截图
            for (let i = 0; i < revertedRows.length; i++) {
                const row = revertedRows[i];
                const revertedElement = row.querySelector('.inventory_history_reverted');
                if (revertedElement) {
                    const detail = currentPageDetails[captureCount] || {
                        交易时间: `交易_${i}`,
                        物品名称: '未知物品',
                        撤回时间: '未知撤回时间',
                        对方SteamID64: '未知ID'
                    };
                    
                    // 延迟执行避免浏览器阻塞
                    await new Promise(resolve => {
                        setTimeout(async () => {
                            const success = await captureTradeHistoryRow(row, detail);
                            if (success) successCount++;
                            resolve();
                        }, i * 1000); // 增加延迟到1秒
                    });
                    
                    captureCount++;
                }
            }
            
            console.log(`批量截图完成，共 ${captureCount} 个撤销交易，成功 ${successCount} 个`);
            alert(`批量截图完成！\n总计: ${captureCount} 个撤销交易\n成功: ${successCount} 个\n失败: ${captureCount - successCount} 个`);
        });
        
        // 绑定复制详情按钮事件
        document.getElementById('copy-details-btn').addEventListener('click', function() {
            if (revertedDetails.length === 0) {
                alert('没有撤销交易详情可复制');
                return;
            }
            
            const detailsText = JSON.stringify(revertedDetails, null, 2);
            
            // 使用现代剪贴板API
            if (navigator.clipboard) {
                navigator.clipboard.writeText(detailsText).then(() => {
                    console.log('详情已复制到剪贴板');
                    alert('详情已复制到剪贴板');
                }).catch(err => {
                    console.error('复制失败:', err);
                    // 降级到传统方法
                    fallbackCopyTextToClipboard(detailsText);
                });
            } else {
                // 降级到传统方法
                fallbackCopyTextToClipboard(detailsText);
            }
        });
        
        console.log('Steam Trade History Checker 已加载');
    }

    // 降级复制方法
    function fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                console.log('详情已复制到剪贴板');
                alert('详情已复制到剪贴板');
            } else {
                console.error('复制失败');
                alert('复制失败，请手动复制控制台中的内容');
                console.log('撤销交易详情:', text);
            }
        } catch (err) {
            console.error('复制失败:', err);
            alert('复制失败，请手动复制控制台中的内容');
            console.log('撤销交易详情:', text);
        }
        
        document.body.removeChild(textArea);
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();