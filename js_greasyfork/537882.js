// ==UserScript==
// @name         硅基流动API密钥批量复制器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  批量复制硅基流动平台的所有API密钥到剪切板
// @author       wyek1n
// @match        https://cloud.siliconflow.cn/account/ak*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537882/%E7%A1%85%E5%9F%BA%E6%B5%81%E5%8A%A8API%E5%AF%86%E9%92%A5%E6%89%B9%E9%87%8F%E5%A4%8D%E5%88%B6%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/537882/%E7%A1%85%E5%9F%BA%E6%B5%81%E5%8A%A8API%E5%AF%86%E9%92%A5%E6%89%B9%E9%87%8F%E5%A4%8D%E5%88%B6%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 延时函数
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 复制到剪切板
    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            // 备用方法
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return true;
        }
    }

    // 切换API显示模式（显示完整API或星号保护）
    async function toggleAPIVisibility() {
        try {
            // 查找眼睛图标按钮
            const eyeIcon = document.querySelector('svg path[d*="M942.2 486.2C847.4 286.5"]');
            let toggleButton = null;
            
            if (eyeIcon) {
                // 从path元素向上查找可点击的父元素
                toggleButton = eyeIcon.closest('button, span, div[role="button"], [onclick]');
                if (!toggleButton) {
                    // 尝试查找包含SVG的父元素
                    toggleButton = eyeIcon.closest('svg').parentElement;
                }
            }
            
            // 备用选择器
            if (!toggleButton) {
                toggleButton = document.querySelector('table thead th:first-child svg');
                if (toggleButton) {
                    toggleButton = toggleButton.closest('button, span, div[role="button"], [onclick]') || toggleButton.parentElement;
                }
            }
            
            if (toggleButton) {
                console.log('🔄 切换API显示模式...');
                toggleButton.click();
                await sleep(800); // 等待切换完成
                return true;
            } else {
                console.log('⚠️ 未找到显示模式切换按钮');
                return false;
            }
        } catch (error) {
            console.error('❌ 切换显示模式失败:', error);
            return false;
        }
    }

    // 全局标记，记录是否已经切换过显示模式
    let hasToggledVisibility = false;

    // 确保API完整显示（不带星号）
    async function ensureFullAPIDisplay(forceCheck = false) {
        // 如果已经切换过且不是强制检查，则跳过
        if (hasToggledVisibility && !forceCheck) {
            return;
        }
        
        // 检查当前页面是否有星号保护的API
        const hasProtectedAPI = document.body.textContent.includes('sk-') && document.body.textContent.includes('*');
        
        if (hasProtectedAPI || forceCheck) {
            console.log('🔍 检测到星号保护的API，尝试切换显示模式...');
            const success = await toggleAPIVisibility();
            if (success) {
                hasToggledVisibility = true; // 标记已切换
                await sleep(500); // 额外等待确保页面更新
                console.log('✅ 已切换为完整显示模式，后续页面将自动保持此状态');
            }
        }
    }

    // 获取当前页面的所有API密钥
    async function getCurrentPageAPIs(skipDisplayCheck = false) {
        // 确保API完整显示（批量操作时跳过重复检查）
        if (!skipDisplayCheck) {
            await ensureFullAPIDisplay();
        }
        
        const apis = [];
        
        // 方法1: 通过类名查找（更稳定）
        const apiElements = document.querySelectorAll('.sf-apikey-copable span');
        apiElements.forEach(element => {
            const apiText = element.textContent.trim();
            if (apiText && apiText.startsWith('sk-') && !apiText.includes('*')) {
                apis.push(apiText);
            }
        });

        // 方法2: 如果方法1没找到，使用备用选择器
        if (apis.length === 0) {
            const tableRows = document.querySelectorAll('table tbody tr');
            tableRows.forEach(row => {
                const apiCell = row.querySelector('td.sf-apikey-copable span, td[class*="apikey"] span');
                if (apiCell) {
                    const apiText = apiCell.textContent.trim();
                    if (apiText && apiText.startsWith('sk-') && !apiText.includes('*')) {
                        apis.push(apiText);
                    }
                }
            });
        }

        // 方法3: 如果仍然没有找到完整API，再次尝试切换显示模式
        if (apis.length === 0) {
            console.log('🔄 未找到完整API，重试切换显示模式...');
            await toggleAPIVisibility();
            await sleep(1000);
            
            // 重新扫描
            const allElements = document.querySelectorAll('span, td, div');
            allElements.forEach(element => {
                const text = element.textContent.trim();
                if (text && text.startsWith('sk-') && text.length > 40 && !text.includes('*')) {
                    if (!apis.includes(text)) {
                        apis.push(text);
                    }
                }
            });
        }

        console.log(`📋 当前页找到 ${apis.length} 个完整API密钥`);
        return apis;
    }

    // 检查是否有下一页
    function hasNextPage() {
        // 查找下一页按钮
        const nextButton = document.querySelector('.ant-pagination-next:not(.ant-pagination-disabled)');
        return nextButton !== null;
    }

    // 点击下一页
    async function goToNextPage() {
        const nextButton = document.querySelector('.ant-pagination-next:not(.ant-pagination-disabled)');
        if (nextButton) {
            nextButton.click();
            // 等待页面加载
            await sleep(2000);
            return true;
        }
        return false;
    }

    // 获取总页数
    function getTotalPages() {
        const paginationItems = document.querySelectorAll('.ant-pagination-item');
        let maxPage = 1;
        paginationItems.forEach(item => {
            const pageNum = parseInt(item.textContent);
            if (!isNaN(pageNum) && pageNum > maxPage) {
                maxPage = pageNum;
            }
        });
        return maxPage;
    }

    // 跳转到第一页
    async function goToFirstPage() {
        const firstPageButton = document.querySelector('.ant-pagination-item[title="1"]');
        if (firstPageButton && !firstPageButton.classList.contains('ant-pagination-item-active')) {
            firstPageButton.click();
            await sleep(2000);
        }
    }

    // 收集所有页面的API密钥
    async function collectAllAPIs() {
        const allAPIs = [];
        let currentPage = 1;
        const totalPages = getTotalPages();
        
        console.log(`📄 检测到总共 ${totalPages} 页`);
        
        // 重置切换标记，确保批量操作时重新检查
        hasToggledVisibility = false;
        
        // 确保从第一页开始
        await goToFirstPage();
        
        do {
            console.log(`🔍 正在扫描第 ${currentPage} 页...`);
            
            // 等待页面完全加载
            await sleep(1000);
            
            // 获取当前页的API（第一页检查显示模式，后续页面跳过检查）
            const skipDisplayCheck = currentPage > 1;
            const currentPageAPIs = await getCurrentPageAPIs(skipDisplayCheck);
            console.log(`📋 第 ${currentPage} 页找到 ${currentPageAPIs.length} 个API`);
            
            // 添加到总列表（去重）
            currentPageAPIs.forEach(api => {
                if (!allAPIs.includes(api)) {
                    allAPIs.push(api);
                }
            });
            
            // 检查是否有下一页
            if (currentPage < totalPages && hasNextPage()) {
                const success = await goToNextPage();
                if (success) {
                    currentPage++;
                } else {
                    break;
                }
            } else {
                break;
            }
            
        } while (currentPage <= totalPages);
        
        return allAPIs;
    }

    // 格式化API列表
    function formatAPIList(apis) {
        let result = `硅基流动API密钥列表 (共${apis.length}个)\n`;
        result += '=' + '='.repeat(50) + '\n\n';
        
        apis.forEach((api) => {
            result += `${api}\n`;
        });
        
        result += '\n' + '=' + '='.repeat(50);
        result += `\n复制时间: ${new Date().toLocaleString()}`;
        
        return result;
    }

    // 创建控制面板
    function createControlPanel() {
        // 检查是否已存在控制面板
        if (document.getElementById('api-copier-panel')) {
            return;
        }

        const panel = document.createElement('div');
        panel.id = 'api-copier-panel';
        panel.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 10000;
            background: #fff;
            border: 2px solid #52c41a;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-family: Arial, sans-serif;
            min-width: 280px;
        `;

        panel.innerHTML = `
            <div style="margin-bottom: 15px; font-weight: bold; color: #52c41a; font-size: 16px;">
                📋 API密钥批量复制器
            </div>
            <div style="margin-bottom: 10px;">
                <button id="copy-current-page" 
                        style="width: 100%; padding: 8px; background: #52c41a; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; margin-bottom: 8px;">
                    📄 复制当前页API
                </button>
            </div>
            <div style="margin-bottom: 10px;">
                <button id="copy-all-pages" 
                        style="width: 100%; padding: 10px; background: #1890ff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 500;">
                    🌐 复制所有页面API
                </button>
            </div>
            <div style="margin-bottom: 10px;">
                <button id="close-copier-panel" 
                        style="width: 100%; padding: 8px; background: #f5f5f5; color: #666; border: 1px solid #d9d9d9; border-radius: 4px; cursor: pointer; font-size: 12px;">
                    关闭面板
                </button>
            </div>
            <div id="copy-status" style="font-size: 12px; color: #666; text-align: center;">
                准备就绪
            </div>
        `;

        document.body.appendChild(panel);

        // 添加事件监听器
        document.getElementById('copy-current-page').addEventListener('click', async function() {
            const statusDiv = document.getElementById('copy-status');
            statusDiv.textContent = '正在复制...';
            statusDiv.style.color = '#1890ff';
            
            try {
                const apis = await getCurrentPageAPIs();
                if (apis.length === 0) {
                    statusDiv.textContent = '当前页未找到API密钥';
                    statusDiv.style.color = '#ff4d4f';
                    return;
                }
                
                const formattedText = formatAPIList(apis);
                await copyToClipboard(formattedText);
                
                statusDiv.textContent = `✅ 已复制 ${apis.length} 个API`;
                statusDiv.style.color = '#52c41a';
                
                console.log('📋 当前页API已复制到剪切板');
                
            } catch (error) {
                statusDiv.textContent = '❌ 复制失败';
                statusDiv.style.color = '#ff4d4f';
                console.error('复制失败:', error);
            }
        });

        document.getElementById('copy-all-pages').addEventListener('click', async function() {
            const statusDiv = document.getElementById('copy-status');
            const button = this;
            
            // 确认操作
            const totalPages = getTotalPages();
            if (!confirm(`确定要复制所有 ${totalPages} 页的API密钥吗？\n这可能需要一些时间...`)) {
                return;
            }
            
            // 禁用按钮
            button.disabled = true;
            button.textContent = '复制中...';
            button.style.background = '#ccc';
            
            try {
                statusDiv.textContent = '正在扫描所有页面...';
                statusDiv.style.color = '#1890ff';
                
                const allAPIs = await collectAllAPIs();
                
                if (allAPIs.length === 0) {
                    statusDiv.textContent = '未找到任何API密钥';
                    statusDiv.style.color = '#ff4d4f';
                    return;
                }
                
                const formattedText = formatAPIList(allAPIs);
                await copyToClipboard(formattedText);
                
                statusDiv.textContent = `✅ 已复制 ${allAPIs.length} 个API`;
                statusDiv.style.color = '#52c41a';
                
                console.log(`🎉 所有API已复制到剪切板，共 ${allAPIs.length} 个`);
                alert(`🎉 复制完成！\n共找到 ${allAPIs.length} 个API密钥\n已复制到剪切板`);
                
            } catch (error) {
                statusDiv.textContent = '❌ 复制失败';
                statusDiv.style.color = '#ff4d4f';
                console.error('复制失败:', error);
                alert('❌ 复制失败，请检查控制台日志');
            } finally {
                // 恢复按钮状态
                button.disabled = false;
                button.textContent = '🌐 复制所有页面API';
                button.style.background = '#1890ff';
            }
        });

        document.getElementById('close-copier-panel').addEventListener('click', function() {
            panel.remove();
        });
    }

    // 页面加载完成后初始化
    function init() {
        // 等待页面完全加载
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        // 延时创建控制面板，确保页面元素都已加载
        setTimeout(() => {
            createControlPanel();
            console.log('📋 硅基流动API密钥批量复制器已启动！');
        }, 2000);
    }

    // 启动脚本
    init();

})(); 