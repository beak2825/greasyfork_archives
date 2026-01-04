// ==UserScript==
// @name         抓点亚马逊和速卖通的搜索数据
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  抓取亚马逊和速卖通商品数据并导出到Excel，支持多页抓取和自定义页面范围
// @author       Meng
// @license      MIT
// @homepage     https://github.com/yourusername/amazon-ali-scraper
// @supportURL   https://github.com/yourusername/amazon-ali-scraper/issues
// @match        https://www.amazon.com/s*
// @match        https://www.aliexpress.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
// @icon         https://www.google.com/s2/favicons?domain=amazon.com
// @downloadURL https://update.greasyfork.org/scripts/537091/%E6%8A%93%E7%82%B9%E4%BA%9A%E9%A9%AC%E9%80%8A%E5%92%8C%E9%80%9F%E5%8D%96%E9%80%9A%E7%9A%84%E6%90%9C%E7%B4%A2%E6%95%B0%E6%8D%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/537091/%E6%8A%93%E7%82%B9%E4%BA%9A%E9%A9%AC%E9%80%8A%E5%92%8C%E9%80%9F%E5%8D%96%E9%80%9A%E7%9A%84%E6%90%9C%E7%B4%A2%E6%95%B0%E6%8D%AE.meta.js
// ==/UserScript==

/*
 * 使用说明：
 * 1. 安装要求：
 *    - 安装Tampermonkey浏览器扩展
 *    - 支持Chrome、Firefox、Edge等主流浏览器
 * 
 * 2. 功能特点：
 *    - 支持亚马逊和速卖通商品数据抓取
 *    - 可自定义抓取页面范围
 *    - 自动导出Excel文件
 *    - 支持多页连续抓取
 * 
 * 3. 使用方法：
 *    - 在亚马逊或速卖通搜索页面运行脚本
 *    - 输入要抓取的起始页码和结束页码
 *    - 点击对应的导出按钮
 *    - 等待抓取完成，自动下载Excel文件
 * 
 * 4. 注意事项：
 *    - 请合理设置抓取间隔，避免对网站造成压力
 *    - 建议每次抓取不超过50页
 *    - 如遇到问题，请查看浏览器控制台日志
 * 
 * 5. 更新日志：
 *    v1.0.0 (2024-03-31)
 *    - 首次发布
 *    - 支持亚马逊和速卖通数据抓取
 *    - 支持自定义页面范围
 *    - 自动导出Excel文件
 */

(function() {
    'use strict';

    // 添加导出按钮
    function addExportButton() {
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
            background-color: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        `;

        // 添加页面范围输入框
        const inputContainer = document.createElement('div');
        inputContainer.style.cssText = `
            display: flex;
            flex-direction: row;
            gap: 5px;
            margin-bottom: 10px;
        `;

        const startPageInput = document.createElement('input');
        startPageInput.type = 'number';
        startPageInput.placeholder = '起始页码';
        startPageInput.min = '1';
        startPageInput.value = '1';
        startPageInput.style.cssText = `
            padding: 5px;
            border: 1px solid #ccc;
            border-radius: 4px;
            width: 100px;
        `;

        const endPageInput = document.createElement('input');
        endPageInput.type = 'number';
        endPageInput.placeholder = '结束页码';
        endPageInput.min = '1';
        endPageInput.style.cssText = `
            padding: 5px;
            border: 1px solid #ccc;
            border-radius: 4px;
            width: 100px;
        `;

        inputContainer.appendChild(startPageInput);
        inputContainer.appendChild(endPageInput);
        buttonContainer.appendChild(inputContainer);

        // 判断当前网站
        const isAmazon = window.location.hostname.includes('amazon');
        const isAliExpress = window.location.hostname.includes('aliexpress');

        if (isAmazon) {
            // Amazon按钮
            const amazonButton = document.createElement('button');
            amazonButton.innerHTML = '导出Amazon商品数据';
            amazonButton.style.cssText = `
                padding: 10px 20px;
                background-color: #FF9900;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
            `;
            amazonButton.onclick = () => {
                const startPage = parseInt(startPageInput.value) || 1;
                const endPage = parseInt(endPageInput.value);
                if (endPage && endPage < startPage) {
                    alert('结束页码不能小于起始页码！');
                    return;
                }
                scrapeAndExport(startPage, endPage);
            };
            buttonContainer.appendChild(amazonButton);
        }

        if (isAliExpress) {
            // AliExpress按钮
            const aliButton = document.createElement('button');
            aliButton.innerHTML = '导出AliExpress商品数据';
            aliButton.style.cssText = `
                padding: 10px 20px;
                background-color: #E62E04;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
            `;
            aliButton.onclick = () => {
                const startPage = parseInt(startPageInput.value) || 1;
                const endPage = parseInt(endPageInput.value);
                if (endPage && endPage < startPage) {
                    alert('结束页码不能小于起始页码！');
                    return;
                }
                scrapeAliExpress(startPage, endPage);
            };
            buttonContainer.appendChild(aliButton);
        }

        document.body.appendChild(buttonContainer);
    }

    // 添加加载提示
    function showLoading(message) {
        let loadingDiv = document.getElementById('amazon-scraper-loading');
        if (!loadingDiv) {
            loadingDiv = document.createElement('div');
            loadingDiv.id = 'amazon-scraper-loading';
            loadingDiv.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 20px;
                border-radius: 8px;
                z-index: 10000;
                text-align: center;
            `;
            document.body.appendChild(loadingDiv);
        }
        loadingDiv.innerHTML = message;
    }

    // 隐藏加载提示
    function hideLoading() {
        const loadingDiv = document.getElementById('amazon-scraper-loading');
        if (loadingDiv) {
            loadingDiv.remove();
        }
    }

    // 获取商品数据
    async function getProductData(startPage = 1, endPage = null) {
        const products = [];
        let currentPage = startPage;
        let hasNextPage = true;

        // 如果当前不在起始页，需要先跳转到起始页
        if (currentPage > 1) {
            showLoading(`正在跳转到第 ${currentPage} 页...`);
            // 构建URL跳转到指定页面
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('page', currentPage);
            window.location.href = currentUrl.toString();
            return products; // 页面会刷新，所以这里直接返回
        }
        
        while (hasNextPage) {
            showLoading(`正在抓取第 ${currentPage} 页数据...`);
            
            const productElements = Array.from(document.querySelectorAll('div[data-asin][data-component-type="s-search-result"]'));
            console.log(`当前页面找到 ${productElements.length} 个商品`);
            
            for (const product of productElements) {
                const asin = product.getAttribute('data-asin');
                if (!asin) continue;

                // 获取标题
                let title = '';
                try {
                    const h2WithAriaLabel = product.querySelector('h2[aria-label]');
                    if (h2WithAriaLabel) {
                        title = h2WithAriaLabel.getAttribute('aria-label');
                    } else {
                        title = product.querySelector('h2 span').textContent.trim();
                    }
                } catch (e) {
                    title = '无标题';
                }

                // 获取价格
                let price = '';
                try {
                    const priceElement = product.querySelector('.a-price .a-offscreen');
                    if (priceElement) {
                        price = priceElement.textContent.trim();
                    } else {
                        const listPriceElement = product.querySelector('.a-text-price .a-offscreen');
                        if (listPriceElement) {
                            price = listPriceElement.textContent.trim();
                        }
                    }
                } catch (e) {
                    price = '无价格';
                }

                products.push({
                    title: title,
                    price: price
                });
            }

            // 检查是否达到结束页
            if (endPage && currentPage >= endPage) {
                console.log(`已达到指定的结束页 ${endPage}，停止抓取`);
                break;
            }

            // 检查是否有下一页
            const nextButton = document.querySelector('a.s-pagination-next:not(.s-pagination-disabled)');
            if (nextButton) {
                console.log('找到下一页按钮，准备翻页');
                nextButton.click();
                await new Promise(resolve => setTimeout(resolve, 3000));
                currentPage++;
            } else {
                console.log('没有找到下一页按钮，停止抓取');
                hasNextPage = false;
            }
        }

        console.log(`总共抓取了 ${products.length} 条数据`);
        return products;
    }

    // 导出到Excel
    function exportToExcel(products, startPage, endPage) {
        // 创建工作簿
        const wb = XLSX.utils.book_new();
        
        // 准备数据
        const data = [
            ['标题', '价格'] // 表头
        ];
        
        // 添加商品数据
        products.forEach(product => {
            data.push([
                product.title,
                product.price
            ]);
        });

        // 创建工作表
        const ws = XLSX.utils.aoa_to_sheet(data);
        
        // 将工作表添加到工作簿
        XLSX.utils.book_append_sheet(wb, ws, '商品信息');

        // 生成Excel文件
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

        // 转换二进制数据为Blob
        const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });

        // 下载文件
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `amazon_products_${startPage}-${endPage || 'end'}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // 辅助函数：字符串转ArrayBuffer
    function s2ab(s) {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) {
            view[i] = s.charCodeAt(i) & 0xFF;
        }
        return buf;
    }

    // 主函数：抓取数据并导出
    async function scrapeAndExport(startPage = 1, endPage = null) {
        try {
            showLoading('开始导出数据...');
            const products = await getProductData(startPage, endPage);
            showLoading(`共抓取 ${products.length} 条数据，正在生成Excel文件...`);
            exportToExcel(products, startPage, endPage);
            hideLoading();
            alert(`数据导出完成！共导出 ${products.length} 条数据`);
        } catch (error) {
            console.error('导出失败:', error);
            alert('导出失败，请查看控制台获取详细信息');
            hideLoading();
        }
    }

    // 获取速卖通商品数据
    async function getAliExpressData(startPage = 1, endPage = null) {
        const products = [];
        let currentPage = startPage;
        let hasNextPage = true;
        
        // 如果当前不在起始页，需要先跳转到起始页
        if (currentPage > 1) {
            showLoading(`正在跳转到第 ${currentPage} 页...`);
            // 这里需要实现跳转到指定页面的逻辑
            // 由于速卖通可能没有直接的页面跳转，我们可能需要多次点击下一页
            for (let i = 1; i < currentPage; i++) {
                const nextButton = findNextButton();
                if (nextButton) {
                    nextButton.click();
                    await new Promise(resolve => setTimeout(resolve, 3000));
                } else {
                    alert(`无法跳转到第 ${currentPage} 页，请确保页面存在！`);
                    return products;
                }
            }
        }
        
        while (hasNextPage) {
            showLoading(`正在抓取第 ${currentPage} 页数据...`);
            
            // 获取当前页面的商品
            const productElements = document.querySelectorAll('div.lj_z');
            console.log(`当前页面找到 ${productElements.length} 个商品`);
            
            for (const product of productElements) {
                // 获取标题
                let title = '';
                try {
                    const titleElement = product.querySelector('h3.lj_jz');
                    if (titleElement) {
                        title = titleElement.textContent.trim();
                    }
                } catch (e) {
                    title = '无标题';
                }

                // 获取价格
                let price = '';
                try {
                    const priceElement = product.querySelector('div.lj_k1');
                    if (priceElement) {
                        price = priceElement.textContent.trim();
                    }
                } catch (e) {
                    price = '无价格';
                }

                products.push({
                    title: title,
                    price: price
                });
            }

            // 检查是否达到结束页
            if (endPage && currentPage >= endPage) {
                console.log(`已达到指定的结束页 ${endPage}，停止抓取`);
                break;
            }

            // 检查是否有下一页
            const nextButton = findNextButton();
            if (nextButton) {
                console.log('找到下一页按钮，准备翻页');
                nextButton.click();
                await new Promise(resolve => setTimeout(resolve, 3000));
                currentPage++;
            } else {
                console.log('没有找到下一页按钮，停止抓取');
                hasNextPage = false;
            }
        }

        console.log(`总共抓取了 ${products.length} 条数据`);
        return products;
    }

    // 查找下一页按钮
    function findNextButton() {
        const nextButtonSelectors = [
            'button.comet-pagination-item-link[aria-label="Next"]',
            'button.comet-pagination-item-link:not([disabled])',
            'button.comet-pagination-item-link',
            'a.comet-pagination-item-link',
            'a[aria-label="Next"]',
            'a[rel="next"]'
        ];

        for (const selector of nextButtonSelectors) {
            const button = document.querySelector(selector);
            if (button && !button.disabled) {
                return button;
            }
        }
        return null;
    }

    // 导出速卖通数据
    async function scrapeAliExpress(startPage = 1, endPage = null) {
        try {
            showLoading('开始导出速卖通数据...');
            const products = await getAliExpressData(startPage, endPage);
            showLoading(`共抓取 ${products.length} 条数据，正在生成Excel文件...`);
            
            // 创建工作簿
            const wb = XLSX.utils.book_new();
            
            // 准备数据
            const data = [
                ['标题', '价格'] // 表头
            ];
            
            // 添加商品数据
            products.forEach(product => {
                data.push([
                    product.title,
                    product.price
                ]);
            });

            // 创建工作表
            const ws = XLSX.utils.aoa_to_sheet(data);
            
            // 将工作表添加到工作簿
            XLSX.utils.book_append_sheet(wb, ws, '速卖通商品信息');

            // 生成Excel文件
            const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

            // 转换二进制数据为Blob
            const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });

            // 下载文件
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `aliexpress_products_${startPage}-${endPage || 'end'}.xlsx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            hideLoading();
            alert(`速卖通数据导出完成！共导出 ${products.length} 条数据`);
        } catch (error) {
            console.error('导出失败:', error);
            alert('导出失败，请查看控制台获取详细信息');
            hideLoading();
        }
    }

    // 页面加载完成后添加导出按钮
    window.addEventListener('load', () => {
        addExportButton();
    });
})(); 