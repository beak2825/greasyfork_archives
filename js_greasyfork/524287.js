// ==UserScript==
// @name         闲鱼数据采集助手
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  闲鱼店铺数据采集和图片下载工具，仅供学习研究使用，禁止商业用途
// @author       Your name
// @match        https://www.goofish.com/personal*
// @match        https://www.goofish.com/item*
// @match        https://www.goofish.com/search*
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @connect      *
// @run-at       document-end
// @license      GPL-3.0
// @copyright    2024, Your name
// @downloadURL https://update.greasyfork.org/scripts/524287/%E9%97%B2%E9%B1%BC%E6%95%B0%E6%8D%AE%E9%87%87%E9%9B%86%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/524287/%E9%97%B2%E9%B1%BC%E6%95%B0%E6%8D%AE%E9%87%87%E9%9B%86%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 转换数据为CSV格式
    function convertToCSV(data) {
        // 统一使用相同的headers，不再区分店铺数据和搜索数据
        const headers = ['商品标题', '商品链接', '想要', '价格'];
        const excelBOM = '\uFEFF';

        function escapeCSVField(field) {
            if (field == null) return '';
            field = field.toString();
            return field.replace(/,/g, '，');  // 将英文逗号替换为中文逗号，避免分隔问题
        }

        // 处理数据行
        const rows = data.map(item => {
            const title = item.title.trim();
            const link = item.link.trim();
            const quantity = item.quantity.trim();
            const price = item.price.trim(); // 不添加¥符号

            return [
                escapeCSVField(title),
                escapeCSVField(link),
                escapeCSVField(quantity),
                escapeCSVField(price)
            ].join(',');
        });

        return excelBOM + headers.join(',') + '\n' + rows.join('\n');
    }

    // 处理图片下载
    function processImages(images) {
        const title = document.querySelector('.desc--GaIUKUQY')?.innerText?.slice(0, 50)?.replace(/[\\/:*?"<>|]/g, '_') || '闲鱼商品';

        const uniqueImages = [...new Set(images.map(img => {
            let imgUrl = img.src;
            // 处理URL格式
            imgUrl = imgUrl.replace(/^\/\//, 'https://')  // 添加协议
                         .replace(/_\d+x\d+Q\d+\.jpg_\.webp$/, '') // 移除尺寸和webp后缀
                         .replace(/\?.*$/, ''); // 移除URL参数

            console.log('处理后的URL:', imgUrl);
            return imgUrl;
        }))];

        console.log('\n=== 准备下载的图片 ===');
        console.log('总数:', uniqueImages.length);

        let successCount = 0;
        let failureCount = 0;
        const totalImages = uniqueImages.length;

        updateStatus(`准备下载 ${totalImages} 张图片...`);

        uniqueImages.forEach((imgUrl, index) => {
            setTimeout(() => {
                // 使用GM_xmlhttpRequest获取图片内容
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: imgUrl,
                    responseType: 'arraybuffer',
                    onload: function(response) {
                        // 创建一个新的ArrayBuffer，添加随机数据来改变MD5
                        const originalBuffer = response.response;
                        const randomBytes = new Uint8Array(32);
                        window.crypto.getRandomValues(randomBytes);

                        // 合并原始数据和随机数据
                        const newBuffer = new ArrayBuffer(originalBuffer.byteLength + randomBytes.length);
                        const newView = new Uint8Array(newBuffer);
                        newView.set(new Uint8Array(originalBuffer));
                        newView.set(randomBytes, originalBuffer.byteLength);

                        // 转换为Blob
                        const blob = new Blob([newBuffer], { type: 'image/jpeg' });
                        const objectUrl = URL.createObjectURL(blob);

                        const fileName = `${title}_${index + 1}.jpg`;

                        GM_download({
                            url: objectUrl,
                            name: fileName,
                            saveAs: false,
                            onload: () => {
                                URL.revokeObjectURL(objectUrl);
                                console.log(`图片${index + 1}下载成功`);
                                successCount++;
                                updateStatus(`正在下载: ${successCount + failureCount}/${totalImages}`);

                                if (successCount + failureCount === totalImages) {
                                    setTimeout(() => {
                                        updateStatus(`下载完成: 成功${successCount}张，失败${failureCount}张`, 3000);
                                    }, 1000);
                                }
                            },
                            onerror: (error) => {
                                URL.revokeObjectURL(objectUrl);
                                console.error('下载失败，尝试备用链接:', error);

                                // 尝试备用链接
                                const backupUrl = `${imgUrl}_790x10000Q90.jpg`;
                                GM_xmlhttpRequest({
                                    method: 'GET',
                                    url: backupUrl,
                                    responseType: 'arraybuffer',
                                    onload: function(backupResponse) {
                                        const backupBuffer = backupResponse.response;
                                        const newRandomBytes = new Uint8Array(32);
                                        window.crypto.getRandomValues(newRandomBytes);

                                        const newBackupBuffer = new ArrayBuffer(backupBuffer.byteLength + newRandomBytes.length);
                                        const newBackupView = new Uint8Array(newBackupBuffer);
                                        newBackupView.set(new Uint8Array(backupBuffer));
                                        newBackupView.set(newRandomBytes, backupBuffer.byteLength);

                                        const backupBlob = new Blob([newBackupBuffer], { type: 'image/jpeg' });
                                        const backupObjectUrl = URL.createObjectURL(backupBlob);

                                        GM_download({
                                            url: backupObjectUrl,
                                            name: fileName,
                                            saveAs: false,
                                            onload: () => {
                                                URL.revokeObjectURL(backupObjectUrl);
                                                console.log(`图片${index + 1}下载成功（备用链接）`);
                                                successCount++;
                                                updateStatus(`正在下载: ${successCount + failureCount}/${totalImages}`);

                                                if (successCount + failureCount === totalImages) {
                                                    setTimeout(() => {
                                                        updateStatus(`下载完成: 成功${successCount}张，失败${failureCount}张`, 3000);
                                                    }, 1000);
                                                }
                                            },
                                            onerror: (backupError) => {
                                                URL.revokeObjectURL(backupObjectUrl);
                                                console.error('备用下载也失败:', backupError);
                                                failureCount++;
                                                updateStatus(`正在下载: ${successCount + failureCount}/${totalImages} (${failureCount}张失败)`);

                                                if (successCount + failureCount === totalImages) {
                                                    setTimeout(() => {
                                                        updateStatus(`下载完成: 成功${successCount}张，失败${failureCount}张`, 3000);
                                                    }, 1000);
                                                }
                                            }
                                        });
                                    },
                                    onerror: function(backupError) {
                                        console.error('备用链接获取失败:', backupError);
                                        failureCount++;
                                        updateStatus(`正在下载: ${successCount + failureCount}/${totalImages} (${failureCount}张失败)`);
                                    }
                                });
                            }
                        });
                    },
                    onerror: function(error) {
                        console.error('获取图片失败:', error);
                        failureCount++;
                        updateStatus(`正在下载: ${successCount + failureCount}/${totalImages} (${failureCount}张失败)`);
                    }
                });
            }, index * 2000);
        });
    }

    // 更新状态显示函数
    function updateStatus(message, duration = 0) {
        if (!statusDiv) return;
        console.log('状态更新:', message);

        if (message.includes('完成') || message.includes('成功')) {
            statusDiv.className = 'data-collector-status success';
        } else if (message.includes('失败') || message.includes('错误')) {
            statusDiv.className = 'data-collector-status error';
        } else {
            statusDiv.className = 'data-collector-status';
        }

        statusDiv.textContent = message;
        if (message) {
            statusDiv.classList.add('show');
        } else {
            statusDiv.classList.remove('show');
        }

        if (duration > 0) {
            setTimeout(() => {
                statusDiv.classList.remove('show');
                setTimeout(() => {
                    statusDiv.textContent = '';
                }, 300);
            }, duration);
        }
    }

    // 下载图片函数
    async function downloadImages() {
        console.log('=== 开始下载图片 ===');

        const selectors = [
            '.item-main-window-list--od7DK4Fm img.fadeInImg--DnykYtf4',
            '.item-main-window-list img',
            '.detail-gallery img'
        ];

        let images = [];
        for (const selector of selectors) {
            images = Array.from(document.querySelectorAll(selector));
            if (images.length > 0) break;
        }

        if (images.length === 0) {
            setTimeout(() => {
                for (const selector of selectors) {
                    const retryImages = Array.from(document.querySelectorAll(selector));
                    if (retryImages.length > 0) {
                        processImages(retryImages);
                        return;
                    }
                }
                updateStatus('未找到商品图片，请确保页面完全加载', 3000);
            }, 2000);
            return;
        }

        processImages(images);
    }

    // 下载数据
    function downloadData() {
        const data = filteredData.length > 0 ? filteredData : GM_getValue('collectedData', []);
        if (data && data.length > 0) {
            const currentDate = new Date().toISOString().slice(0, 10);
            const csvContent = convertToCSV(data);
            const searchQuery = new URLSearchParams(window.location.search).get('q') || '搜索结果';

            GM_download({
                url: URL.createObjectURL(new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })),
                name: `闲鱼_${searchQuery}_${currentDate}.csv`,
                saveAs: true,
                onload: () => updateStatus('数据已下载', 3000),
                onerror: (error) => {
                    console.error('Download failed:', error);
                    updateStatus('下载失败，请重试', 3000);
                }
            });
        } else {
            updateStatus('没有可下载的数据', 3000);
        }
    }

    // 添加搜索页面数据采集功能
    let currentPage = 1;
    let maxPages = 10;
    let filteredData = [];

    // 采集搜索页面数据
    async function collectSearchPageData() {
        console.log('开始采集搜索页数据...');

        // 等待页面加载完成
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 滚动到页面底部以加载所有内容
        await scrollToBottom();

        // 更新选择器以匹配闲鱼搜索页面的实际结构
        const items = document.querySelectorAll('.feeds-item-wrap--rGdH_KoF');
        console.log('找到商品数量:', items.length);

        for (const item of items) {
            try {
                // 获取想要数
                const wantCountElement = item.querySelector('[title*="人想要"]');
                const wantCount = wantCountElement ? parseInt(wantCountElement.getAttribute('title').match(/\d+/)[0]) : 0;

                console.log('商品想要数:', wantCount);

                // 筛选想要数大于100的商品
                if (wantCount > 100) {
                    const titleElement = item.querySelector('.row1-wrap-title--qIlOySTh');
                    // 直接从item元素获取href，因为item本身就是a标签
                    const link = item.href || '';
                    const priceElement = item.querySelector('.price-wrap--YzmU5cUl') || 
                                       item.parentElement.querySelector('.price-wrap--YzmU5cUl');
                    let priceText = '';
                    if (priceElement) {
                        // 获取整数部分 - 使用精确的类名
                        const numberElement = priceElement.querySelector('.number--QKhlvXWM');
                        // 获取小数部分 - 使用精确的类名
                        const decimalElement = priceElement.querySelector('.decimal--lSAcITCN');
                        
                        // 正确拼接整数和小数部分
                        if (numberElement) {
                            const integerPart = numberElement.textContent || '0';
                            const decimalPart = decimalElement ? decimalElement.textContent : '';
                            
                            // 直接拼接整数和小数部分
                            priceText = integerPart + decimalPart;
                        }
                    }

                    // 如果没有找到分开的价格元素，尝试获取完整价格
                    if (!priceText) {
                        priceText = priceElement?.textContent?.trim() || '';
                    }

                    // 提取价格数字，保留小数点
                    const price = priceText.replace(/[^\d.]/g, '');

                    console.log('价格处理:', {
                        整数部分: priceElement?.querySelector('.number--QKhlvXWM')?.textContent,
                        小数部分: priceElement?.querySelector('.decimal--lSAcITCN')?.textContent,
                        拼接结果: priceText,
                        最终价格: price
                    });

                    console.log('商品链接:', link); // 添加日志

                    filteredData.push({
                        title: titleElement?.getAttribute('title')?.trim() || '',
                        link: link,
                        quantity: wantCount + '人想要',
                        price: price  // 不添加¥符号
                    });

                    console.log('采集到符合条件的商品:', {
                        title: titleElement?.getAttribute('title')?.trim() || '',
                        link: link,
                        quantity: wantCount + '人想要',
                        price: price  // 不添加¥符号
                    });
                }
            } catch (error) {
                console.error('处理商品时出错:', error);
            }
        }

        updateStatus(`当前第${currentPage}页，已采集${filteredData.length}条数据`);

        // 检查是否需要进入下一页
        if (currentPage < maxPages) {
            // 更新翻页按钮选择器
            const nextPageBtn = document.querySelector('.search-pagination-arrow-container--lt2kCP6J:not([disabled]) .search-pagination-arrow-right--CKU78u4z');
            if (nextPageBtn) {
                currentPage++;
                console.log('准备进入下一页...');

                // 点击下一页按钮的父元素（button）
                nextPageBtn.closest('button').click();

                // 等待页面加载完成
                await new Promise(resolve => setTimeout(resolve, 3000));

                // 递归采集下一页
                await collectSearchPageData();
            } else {
                console.log('没有下一页了');
                finishCollection();
            }
        } else {
            console.log('已达到最大页数');
            finishCollection();
        }
    }

    // 添加滚动到底部的函数
    async function scrollToBottom() {
        return new Promise(resolve => {
            let lastHeight = document.documentElement.scrollHeight;
            let scrollAttempts = 0;
            const maxScrollAttempts = 10; // 最大滚动尝试次数

            function scroll() {
                window.scrollTo(0, document.documentElement.scrollHeight);
                scrollAttempts++;

                setTimeout(() => {
                    const newHeight = document.documentElement.scrollHeight;
                    if (newHeight === lastHeight || scrollAttempts >= maxScrollAttempts) {
                        // 如果高度不再变化或达到最大尝试次数，则完成滚动
                        window.scrollTo(0, 0); // 滚回顶部
                        resolve();
                    } else {
                        lastHeight = newHeight;
                        scroll();
                    }
                }, 1000); // 每次滚动后等待1秒
            }

            scroll();
        });
    }

    // 完成采集
    function finishCollection() {
        console.log('采集完成，总共采集到符合条件的数据:', filteredData.length);
        if (filteredData.length > 0) {
            // 保存数据
            GM_setValue('collectedData', filteredData);
            // 下载数据
            downloadData();
        }
        updateStatus(`采集完成！共获取 ${filteredData.length} 条数据`, 3000);
    }

    // 初始化搜索页面UI
    function initSearchUI() {
        const container = document.createElement('div');
        container.className = 'data-collector-container';

        // 添加页数输入框
        const pageInput = document.createElement('input');
        pageInput.type = 'number';
        pageInput.min = '1';
        pageInput.max = '100';
        pageInput.value = '10';
        pageInput.className = 'page-input';
        pageInput.title = '设置采集页数（1-100）';
        container.appendChild(pageInput);

        const startButton = document.createElement('button');
        startButton.innerHTML = '采集<br>数据';
        startButton.className = 'data-collector-btn';
        startButton.title = '采集想要数大于100的商品数据';
        startButton.addEventListener('click', () => {
            filteredData = [];
            currentPage = 1;
            maxPages = parseInt(pageInput.value) || 10; // 使用输入的页数
            collectSearchPageData();
        });
        container.appendChild(startButton);

        document.body.appendChild(container);
    }

    // 添加店铺页面数据采集功能
    async function collectShopData() {
        console.log('开始采集店铺数据...');
        updateStatus('正在采集店铺数据...');
        
        // 等待页面加载完成
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // 滚动到页面底部以加载所有内容
        await scrollToBottom();
        
        // 获取店铺名称和ID
        const shopName = document.querySelector('.nick--sPBUifWP')?.textContent || '未知店铺';
        const shopId = new URLSearchParams(window.location.search).get('userId') || '';
        
        console.log('店铺名称:', shopName);
        console.log('店铺ID:', shopId);
        
        // 使用新的选择器查找商品
        const shopItems = document.querySelectorAll('.personal--b5L38iZ7 a[href*="/item"]');
        console.log('找到商品数量:', shopItems.length);
        
        // 如果没有找到商品，尝试其他选择器
        if (shopItems.length === 0) {
            console.log('尝试备用选择器...');
            const alternativeItems = document.querySelectorAll('.personalWrap--ttkwgqKI a[href*="/item"]');
            if (alternativeItems.length > 0) {
                console.log('使用备用选择器找到商品:', alternativeItems.length);
                processShopItems(alternativeItems);
                return;
            }
        }
        
        processShopItems(shopItems);
    }

    // 添加处理商品的函数
    function processShopItems(items) {
        let shopData = [];
        
        for (const item of items) {
            try {
                // 获取商品标题
                const title = item.getAttribute('title')?.trim() || item.textContent?.trim() || '';
                
                // 获取商品链接
                const link = item.href || '';
                
                // 获取价格 - 在父元素中查找
                const priceElement = item.querySelector('.price-wrap--YzmU5cUl') || 
                                   item.parentElement.querySelector('.price-wrap--YzmU5cUl');
                let priceText = '';
                if (priceElement) {
                    // 获取整数部分 - 使用精确的类名
                    const numberElement = priceElement.querySelector('.number--QKhlvXWM');
                    // 获取小数部分 - 使用精确的类名
                    const decimalElement = priceElement.querySelector('.decimal--lSAcITCN');
                    
                    // 正确拼接整数和小数部分
                    if (numberElement) {
                        const integerPart = numberElement.textContent || '0';
                        const decimalPart = decimalElement ? decimalElement.textContent : '';
                        
                        // 直接拼接整数和小数部分
                        priceText = integerPart + decimalPart;
                    }
                }
                
                // 如果没有找到分开的价格元素，尝试获取完整价格
                if (!priceText) {
                    priceText = priceElement?.textContent?.trim() || '';
                }
                
                // 提取价格数字，保留小数点
                const price = priceText.replace(/[^\d.]/g, '');
                
                console.log('价格处理:', {
                    整数部分: priceElement?.querySelector('.number--QKhlvXWM')?.textContent,
                    小数部分: priceElement?.querySelector('.decimal--lSAcITCN')?.textContent,
                    拼接结果: priceText,
                    最终价格: price
                });
                
                // 获取想要数 - 在父元素中查找
                const wantElement = item.querySelector('.text--MaM9Cmdn') || 
                                  item.parentElement.querySelector('.text--MaM9Cmdn');
                let wantCount = '0';
                if (wantElement) {
                    const match = wantElement.textContent?.match(/(\d+)人想要/) || 
                                wantElement.getAttribute('title')?.match(/(\d+)人想要/);
                    if (match) {
                        wantCount = match[1]; // 只保留数字部分
                    }
                }
                
                // 调试输出
                console.log('正在处理商品:', {
                    title: title,
                    link: link,
                    price: price,
                    wantCount: wantCount
                });
                
                // 只有当有标题和链接时才添加数据
                if (title && link) {
                    shopData.push({
                        title: title,
                        link: link,
                        quantity: wantCount,
                        price: price  // 完整价格，如 "14.98"
                    });
                    
                    console.log('成功采集商品:', {
                        title: title,
                        link: link,
                        quantity: wantCount,
                        price: price
                    });
                }
            } catch (error) {
                console.error('处理店铺商品时出错:', error);
            }
        }
        
        console.log('店铺数据采集完成，共采集到商品:', shopData.length);
        
        if (shopData.length > 0) {
            // 保存数据
            GM_setValue('shopData', shopData);
            // 下载数据
            downloadShopData(shopData);
        } else {
            updateStatus('未找到商品数据，请检查页面结构', 3000);
            // 输出调试信息
            console.log('页面结构:', {
                'a[href*="/item"]数量': document.querySelectorAll('a[href*="/item"]').length,
                '可能的商品容器': document.querySelectorAll('[class*="item-"]').length,
                'DOM结构': document.querySelector('.personal--b5L38iZ7')?.innerHTML
            });
        }
        
        updateStatus(`店铺采集完成！共获取 ${shopData.length} 件商品`, 3000);
    }

    // 下载店铺数据
    function downloadShopData(data) {
        if (data && data.length > 0) {
            const currentDate = new Date().toISOString().slice(0, 10);
            const csvContent = convertToCSV(data);
            
            GM_download({
                url: URL.createObjectURL(new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })),
                name: `闲鱼_店铺_${currentDate}.csv`,
                saveAs: true,
                onload: () => updateStatus('店铺数据已下载', 3000),
                onerror: (error) => {
                    console.error('下载失败:', error);
                    updateStatus('下载失败，请重试', 3000);
                }
            });
        } else {
            updateStatus('没有可下载的店铺数据', 3000);
        }
    }

    // 初始化店铺页面UI
    function initShopUI() {
        const container = document.createElement('div');
        container.className = 'data-collector-container';
        
        const collectButton = document.createElement('button');
        collectButton.innerHTML = '采集<br>店铺';
        collectButton.className = 'data-collector-btn';
        collectButton.title = '采集店铺所有商品数据';
        collectButton.addEventListener('click', collectShopData);
        container.appendChild(collectButton);
        
        document.body.appendChild(container);
    }

    // 初始化
    let statusDiv;
    let collectedData = [];

    function initUI() {
        console.log('初始化UI...');

        // 检查是否已存在面板
        if (document.querySelector('.data-collector-container')) {
            console.log('面板已存在，跳过初始化');
            return;
        }

        // 添加样式
        GM_addStyle(`
            .data-collector-container {
                position: fixed;
                bottom: 100px;
                right: 20px;
                background: transparent;
                padding: 0;
                z-index: 999999999;
                font-family: Arial, sans-serif;
                transition: all 0.3s ease;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 10px;
            }

            .page-input {
                width: 56px;
                height: 30px;
                padding: 5px;
                border: 2px solid #ff6f3d;
                border-radius: 15px;
                text-align: center;
                font-size: 14px;
                color: #ff6f3d;
                background: white;
                outline: none;
                transition: all 0.3s ease;
            }

            .page-input:focus {
                box-shadow: 0 0 5px rgba(255,111,61,0.5);
            }

            .page-input::-webkit-inner-spin-button,
            .page-input::-webkit-outer-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }

            .data-collector-btn, .image-download-btn {
                width: 56px;
                height: 56px;
                padding: 0;
                background: #ff6f3d;
                color: white;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                font-weight: bold;
                font-size: 14px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                transition: all 0.3s ease;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                line-height: 1.2;
                white-space: pre;
            }

            .data-collector-status {
                position: fixed;
                left: 50%;
                bottom: 20%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 12px 24px;
                border-radius: 8px;
                font-size: 14px;
                white-space: nowrap;
                opacity: 0;
                transition: all 0.3s ease;
                pointer-events: none;
                text-align: center;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 1000000;
            }

            .data-collector-status.show {
                opacity: 1;
                transform: translate(-50%, -10px);
            }
        `);

        statusDiv = document.createElement('div');
        statusDiv.className = 'data-collector-status';
        document.body.appendChild(statusDiv);

        // 根据页面类型初始化不同的UI
        if (window.location.href.includes('/search')) {
            initSearchUI();
        } else if (window.location.href.includes('/item')) {
            const container = document.createElement('div');
            container.className = 'data-collector-container';

            const downloadButton = document.createElement('button');
            downloadButton.innerHTML = '下载<br>图片';
            downloadButton.className = 'image-download-btn';
            downloadButton.title = '下载商品图片';
            downloadButton.addEventListener('click', downloadImages);
            container.appendChild(downloadButton);

            document.body.appendChild(container);
        } else if (window.location.href.includes('/personal')) {
            // 初始化店铺页面UI
            initShopUI();
        }

        console.log('UI初始化完成');
    }

    // 初始化
    window.addEventListener('load', () => {
        console.log('页面加载完成，开始初始化');
        setTimeout(initUI, 1000);
    });

    // 如果页面已经加载完成，立即初始化
    if (document.readyState === 'complete') {
        console.log('页面已经加载完成，立即初始化');
        setTimeout(initUI, 1000);
    }

    // 定期检查面板是否存在
    setInterval(() => {
        const panel = document.querySelector('.data-collector-container');
        if (!panel) {
            console.log('面板不存在，重新初始化');
            initUI();
        }
    }, 2000);

})(); 