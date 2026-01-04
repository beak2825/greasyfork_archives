// ==UserScript==
// @name         阿里巴巴商品工作台数据导出工具 - 网页版
// @namespace    http://tampermonkey.net/
// @version      2.1
// @license      MIT
// @description  修复最后一页卡住和数字格式采集错误的问题
// @require      https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js
// @author       树洞先生
// @match        https://hz-productposting.alibaba.com/product_operate/product_growth.htm*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539939/%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E5%95%86%E5%93%81%E5%B7%A5%E4%BD%9C%E5%8F%B0%E6%95%B0%E6%8D%AE%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7%20-%20%E7%BD%91%E9%A1%B5%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/539939/%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E5%95%86%E5%93%81%E5%B7%A5%E4%BD%9C%E5%8F%B0%E6%95%B0%E6%8D%AE%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7%20-%20%E7%BD%91%E9%A1%B5%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 全局变量
    let allProducts = []; // 存储所有收集到的商品数据
    let isCollecting = false; // 标记是否正在收集数据
    let currentPage = 1; // 当前页码
    let totalPages = 1; // 总页数

    // 创建主界面
    function createMainInterface() {
        // 创建主按钮，点击后弹出主对话框
        const toolButton = document.createElement('button');
        toolButton.textContent = '📊 商品数据导出';
        toolButton.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 9999;
            padding: 12px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        `;
        
        // 鼠标悬停效果
        toolButton.onmouseover = () => {
            toolButton.style.transform = 'translateY(-2px)';
            toolButton.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
        };
        
        toolButton.onmouseout = () => {
            toolButton.style.transform = 'translateY(0)';
            toolButton.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
        };
        
        toolButton.onclick = showMainDialog; // 点击按钮显示主对话框
        document.body.appendChild(toolButton);
    }

    // 显示主对话框
    function showMainDialog() {
        // 创建对话框容器
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10000;
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            padding: 30px;
            width: 500px;
            max-height: 80vh;
            overflow-y: auto;
        `;

        // 设置对话框内容，包括状态、按钮、调试信息等
        dialog.innerHTML = `
            <div style="text-align: center; margin-bottom: 25px;">
                <h2 style="margin: 0; color: #333; font-size: 24px;">📊 商品数据导出工具</h2>
                <p style="margin: 10px 0 0 0; color: #666;">修复版 - 解决最后一页卡住和数字格式问题</p>
            </div>
            
            <div style="margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span style="color: #333; font-weight: bold;">收集状态:</span>
                    <span id="collection-status" style="color: #666;">待开始</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span style="color: #333; font-weight: bold;">当前页面:</span>
                    <span id="current-page-info" style="color: #666;">-</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span style="color: #333; font-weight: bold;">已收集商品:</span>
                    <span id="collected-count" style="color: #666;">0</span>
                </div>
                <div style="background: #f5f5f5; border-radius: 8px; padding: 4px; margin-bottom: 15px;">
                    <div id="progress-bar" style="background: linear-gradient(90deg, #4CAF50, #45a049); height: 20px; border-radius: 6px; width: 0%; transition: width 0.3s ease;"></div>
                </div>
            </div>

            <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                <button id="start-collection" style="flex: 1; padding: 12px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">🔄 开始收集数据</button>
                <button id="stop-collection" style="flex: 1; padding: 12px; background: #f44336; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;" disabled>⏹️ 停止收集</button>
            </div>

            <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                <button id="export-all" style="flex: 1; padding: 12px; background: #2196F3; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;" disabled>📥 导出所有数据</button>
                <button id="clear-data" style="flex: 1; padding: 12px; background: #FF9800; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">🗑️ 清空数据</button>
            </div>

            <div style="display: flex; gap: 10px;">
                <button id="test-extraction" style="flex: 1; padding: 12px; background: #9C27B0; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">🧪 测试提取</button>
                <button id="close-dialog" style="flex: 1; padding: 12px; background: #666; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">❌ 关闭</button>
            </div>

            <div id="debug-info" style="margin-top: 20px; padding: 15px; background: #f9f9f9; border-radius: 6px; font-family: monospace; font-size: 12px; max-height: 200px; overflow-y: auto; display: none;">
                <strong>调试信息:</strong><br>
                <div id="debug-content"></div>
            </div>
        `;

        // 创建遮罩层，点击遮罩层可关闭对话框
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 9999;
        `;
        
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        // 绑定对话框按钮事件
        bindDialogEvents(overlay);
    }

    // 绑定对话框事件，包括按钮点击等
    function bindDialogEvents(overlay) {
        const startBtn = overlay.querySelector('#start-collection'); // 开始收集按钮
        const stopBtn = overlay.querySelector('#stop-collection');   // 停止收集按钮
        const exportBtn = overlay.querySelector('#export-all');      // 导出数据按钮
        const clearBtn = overlay.querySelector('#clear-data');       // 清空数据按钮
        const testBtn = overlay.querySelector('#test-extraction');   // 测试提取按钮
        const closeBtn = overlay.querySelector('#close-dialog');     // 关闭对话框按钮

        startBtn.onclick = startCollection; // 绑定开始收集事件
        stopBtn.onclick = stopCollection;   // 绑定停止收集事件
        exportBtn.onclick = exportAllData;  // 绑定导出数据事件
        clearBtn.onclick = clearAllData;    // 绑定清空数据事件
        testBtn.onclick = testExtraction;   // 绑定测试提取事件
        closeBtn.onclick = () => overlay.remove(); // 关闭对话框

        // 点击遮罩层关闭对话框
        overlay.onclick = (e) => {
            if (e.target === overlay) overlay.remove();
        };
    }

    // 数字格式处理函数 - 修复数字分割问题
    function parseNumber(text) {
        if (!text) return '';
        
        // 移除所有逗号和空格，保留数字、小数点和百分号
        const cleaned = text.replace(/[,-\s]/g, '');
        
        // 如果包含百分号，保留百分号
        if (cleaned.includes('%')) {
            return cleaned;
        }
        
        // 如果是纯数字，返回清理后的数字
        const number = parseFloat(cleaned);
        if (!isNaN(number)) {
            return number.toString();
        }
        
        // 如果无法解析，返回原始文本
        return text;
    }

    // 基于实际DOM结构提取商品数据 - 修复数字格式问题
    function extractProductsFromCurrentPage() {
        const products = [];
        
        try {
            // 基于实际DOM结构，使用正确的选择器，遍历每一行商品
            const productRows = document.querySelectorAll('div[role="row"].next-row');
            
            console.log(`找到 ${productRows.length} 个商品行`);
            
            productRows.forEach((row, index) => {
                try {
                    const product = {};
                    
                    // 商品图片
                    const imgElement = row.querySelector('[class^="_informationImg_"] img');
                    product.imageUrl = imgElement ? imgElement.src : '';
                    
                    // 商品标题
                    const titleElement = row.querySelector('[class^="_informationText_"]');
                    product.title = titleElement ? titleElement.textContent.trim() : '';
                    
                    // 商品ID
                    const idElement = row.querySelector('[class^="_informationId_"]');
                    product.id = idElement ? idElement.textContent.replace('ID：', '').trim() : '';
                    
                    // 商品标签
                    const tagElements = row.querySelectorAll('[class^="_everyTag_"]');
                    product.tags = Array.from(tagElements).map(tag => tag.textContent.trim()).join(', ');
                    
                    // 访问数据 - 修复数字格式问题
                    const visitElements = row.querySelectorAll('[class^="_visitPut_"]');
                    visitElements.forEach(element => {
                        const fullText = element.textContent.trim();
                        const spanElement = element.querySelector('span');
                        const rawValue = spanElement ? spanElement.textContent.trim() : '';
                        const value = parseNumber(rawValue); // 使用数字格式处理函数
                        
                        // 根据不同的文本内容，提取不同的访问数据
                        if (fullText.includes('近30天搜索曝光数')) {
                            product.searchExposure = value;
                        } else if (fullText.includes('近30天访问人数')) {
                            product.visitors = value;
                        } else if (fullText.includes('近90天[TM+询盘]人数')) {
                            product.inquiries = value;
                        } else if (fullText.includes('近90天[TM+询盘]转化')) {
                            product.inquiryConversion = value;
                        } else if (fullText.includes('近90天支付买家数')) {
                            product.payingBuyers = value;
                        } else if (fullText.includes('近90天访客到支付转化率')) {
                            product.paymentConversion = value;
                        }
                    });
                    
                    // 优化建议
                    const suggestionElements = row.querySelectorAll('[class^="_oneOptimization_"]');
                    if (suggestionElements.length > 0) {
                        // 采集第一个优化建议块的所有文字内容（包含子元素）
                        const parentDiv = suggestionElements[0].closest('div');
                        if (parentDiv) {
                            let suggestionText = parentDiv.innerText.trim();
                            // 过滤无关提示词
                            suggestionText = suggestionText.replace(/去完成|配置服务/g, '');
                            product.suggestions = suggestionText.trim();
                        } else {
                            let suggestionText = Array.from(suggestionElements).map(el => el.textContent.trim()).join('; ');
                            suggestionText = suggestionText.replace(/去完成|配置服务/g, '');
                            product.suggestions = suggestionText.trim();
                        }
                    } else {
                        product.suggestions = '';
                    }
                    
                    // 只添加有ID的商品
                    if (product.id) {
                        product.index = allProducts.length + products.length + 1;
                        product.pageNumber = currentPage;
                        products.push(product);
                    }
                    
                } catch (error) {
                    // 单个商品提取出错时，打印错误但不中断整体流程
                    console.error(`处理第 ${index + 1} 个商品时出错:`, error);
                }
            });
            
        } catch (error) {
            // 整体提取出错时，打印错误
            console.error('提取商品数据时出错:', error);
        }
        
        return products;
    }

    // 测试数据提取，显示调试信息
    function testExtraction() {
        const debugInfo = document.querySelector('#debug-info');
        const debugContent = document.querySelector('#debug-content');
        
        debugInfo.style.display = 'block';
        debugContent.innerHTML = '正在测试数据提取...<br>';
        
        try {
            const products = extractProductsFromCurrentPage();
            
            debugContent.innerHTML += `✅ 成功提取到 ${products.length} 个商品<br>`;
            
            if (products.length > 0) {
                debugContent.innerHTML += '<br><strong>第一个商品示例:</strong><br>';
                const firstProduct = products[0];
                Object.keys(firstProduct).forEach(key => {
                    debugContent.innerHTML += `${key}: ${firstProduct[key]}<br>`;
                });
                
                // 测试数字格式处理
                debugContent.innerHTML += '<br><strong>数字格式测试:</strong><br>';
                debugContent.innerHTML += `原始: "3,897" -> 处理后: "${parseNumber('3,897')}"<br>`;
                debugContent.innerHTML += `原始: "2.5%" -> 处理后: "${parseNumber('2.5%')}"<br>`;
                debugContent.innerHTML += `原始: "1,234,567" -> 处理后: "${parseNumber('1,234,567')}"<br>`;
            } else {
                debugContent.innerHTML += '<br>❌ 未找到商品数据<br>';
            }
            
        } catch (error) {
            debugContent.innerHTML += `❌ 测试失败: ${error.message}<br>`;
            console.error('测试提取时出错:', error);
        }
    }

    // 开始收集数据 - 修复最后一页卡住问题
    async function startCollection() {
        if (isCollecting) return; // 如果已经在收集则不重复执行
        
        isCollecting = true;
        updateUI();
        
        try {
            // 获取总页数
            await getTotalPages();
            
            // 从第一页开始收集
            currentPage = 1;
            
            // 循环遍历每一页，收集数据
            while (currentPage <= totalPages && isCollecting) {
                updateStatus(`正在收集第 ${currentPage} 页数据...`);
                
                // 提取当前页面数据
                const pageProducts = extractProductsFromCurrentPage();
                allProducts.push(...pageProducts);
                
                updateUI();
                
                // 检查是否为最后一页 - 修复卡住问题
                if (currentPage >= totalPages) {
                    updateStatus(`收集完成！共收集 ${allProducts.length} 个商品`);
                    break;
                }
                
                // 如果不是最后一页，翻到下一页
                if (isCollecting) {
                    const success = await goToNextPage();
                    if (!success) {
                        updateStatus('翻页失败，收集停止');
                        break;
                    }
                    currentPage++;
                    
                    // 等待页面加载
                    await sleep(3000); // 增加等待时间确保页面完全加载
                }
            }
            
            if (isCollecting) {
                updateStatus(`收集完成！共收集 ${allProducts.length} 个商品`);
            }
            
        } catch (error) {
            updateStatus(`收集过程中出错: ${error.message}`);
            console.error('收集数据时出错:', error);
        } finally {
            isCollecting = false;
            updateUI();
        }
    }

    // 停止收集
    function stopCollection() {
        isCollecting = false; // 设置标志位，主循环会自动停止
        updateStatus('收集已停止');
        updateUI();
    }

    // 获取总页数 - 改进页数检测
    async function getTotalPages() {
        try {
            // 查找分页信息，使用更精确的方法
            const paginationElements = document.querySelectorAll('.next-pagination-item');
            let maxPage = 1;
            
            paginationElements.forEach(element => {
                const ariaLabel = element.getAttribute('aria-label');
                if (ariaLabel && ariaLabel.includes('共') && ariaLabel.includes('页')) {
                    // 从aria-label中提取总页数，如"第1页，共76页"
                    const match = ariaLabel.match(/共(\d+)页/);
                    if (match) {
                        const pageNum = parseInt(match[1]);
                        if (pageNum > maxPage) {
                            maxPage = pageNum;
                        }
                    }
                }
                
                // 备用方法：从按钮文本中获取页码
                const text = element.textContent.trim();
                const pageNum = parseInt(text);
                if (!isNaN(pageNum) && pageNum > maxPage) {
                    maxPage = pageNum;
                }
            });
            
            totalPages = maxPage;
            console.log(`检测到总页数: ${totalPages}`);
            
        } catch (error) {
            console.error('获取总页数时出错:', error);
            totalPages = 1;
        }
    }

    // 翻到下一页 - 改进翻页逻辑
    async function goToNextPage() {
        try {
            // 查找下一页按钮
            const nextButton = document.querySelector('.next-pagination-item.next-next');
            
            if (nextButton && !nextButton.disabled && !nextButton.classList.contains('next-disabled')) {
                console.log(`点击下一页按钮，从第 ${currentPage} 页到第 ${currentPage + 1} 页`);
                nextButton.click();
                
                // 等待页面开始加载
                await sleep(1000);
                
                // 检查页面是否真的翻页了
                let attempts = 0;
                const maxAttempts = 10;
                
                while (attempts < maxAttempts) {
                    await sleep(500);
                    
                    // 检查当前页码是否已更新
                    const currentPageElement = document.querySelector('.next-pagination-item.next-current');
                    if (currentPageElement) {
                        const displayedPage = parseInt(currentPageElement.textContent.trim());
                        if (displayedPage === currentPage + 1) {
                            console.log(`页面已成功翻到第 ${displayedPage} 页`);
                            return true;
                        }
                    }
                    
                    attempts++;
                }
                
                console.log('翻页超时，可能页面加载缓慢');
                return true; // 即使超时也继续，避免卡住
                
            } else {
                console.log('下一页按钮不可用或已到最后一页');
                return false;
            }
        } catch (error) {
            console.error('翻页时出错:', error);
            return false;
        }
    }

    // 导出所有数据（改为导出为XLSX格式）
    function exportAllData() {
        if (allProducts.length === 0) {
            alert('没有数据可导出');
            return;
        }
        try {
            // 生成表格数据
            const wsData = [
                ['序号', '商品ID', '商品标题',  '商品图片链接', '商品标签',
                 '近30天搜索曝光数', '近30天访问人数', '近90天询盘人数', 
                 '近90天询盘转化率', '近90天支付买家数', '近90天支付转化率', '优化建议']
            ];
            allProducts.forEach(product => {
                wsData.push([
                    product.index || '',
                    product.id || '',
                    product.title || '',
                    product.imageUrl || '',
                    product.tags || '',
                    product.searchExposure || '',
                    product.visitors || '',
                    product.inquiries || '',
                    product.inquiryConversion || '',
                    product.payingBuyers || '',
                    product.paymentConversion || '',
                    product.suggestions || ''
                ]);
            });

            // 创建工作表和工作簿
            const ws = XLSX.utils.aoa_to_sheet(wsData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, '商品数据');

            // 导出为 xlsx 文件
            const filename = `阿里巴巴商品数据_${new Date().toISOString().split('T')[0]}.xlsx`;
            XLSX.writeFile(wb, filename);

            updateStatus(`已导出 ${allProducts.length} 个商品数据`);
        } catch (error) {
            alert(`导出失败: ${error.message}`);
            console.error('导出数据时出错:', error);
        }
    }

    // 清空所有数据
    function clearAllData() {
        if (confirm('确定要清空所有收集的数据吗？')) {
            allProducts = [];
            currentPage = 1;
            updateStatus('数据已清空');
            updateUI();
        }
    }

    // 更新状态显示
    function updateStatus(message) {
        const statusElement = document.querySelector('#collection-status');
        if (statusElement) {
            statusElement.textContent = message;
        }
        console.log(message);
    }

    // 更新UI，包括状态、进度条、按钮状态等
    function updateUI() {
        const statusElement = document.querySelector('#collection-status');
        const pageInfoElement = document.querySelector('#current-page-info');
        const countElement = document.querySelector('#collected-count');
        const progressBar = document.querySelector('#progress-bar');
        const startBtn = document.querySelector('#start-collection');
        const stopBtn = document.querySelector('#stop-collection');
        const exportBtn = document.querySelector('#export-all');
        
        if (pageInfoElement) {
            pageInfoElement.textContent = `${currentPage} / ${totalPages}`;
        }
        
        if (countElement) {
            countElement.textContent = allProducts.length;
        }
        
        if (progressBar && totalPages > 0) {
            const progress = (currentPage / totalPages) * 100;
            progressBar.style.width = `${Math.min(progress, 100)}%`;
        }
        
        if (startBtn) {
            startBtn.disabled = isCollecting;
        }
        
        if (stopBtn) {
            stopBtn.disabled = !isCollecting;
        }
        
        if (exportBtn) {
            exportBtn.disabled = allProducts.length === 0;
        }
    }

    // 工具函数：延时，返回Promise
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 初始化，等待页面加载完成后创建主界面
    function init() {
        // 等待页面加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createMainInterface);
        } else {
            createMainInterface();
        }
    }

    // 启动脚本
    init();

})();

