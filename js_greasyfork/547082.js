// ==UserScript==
// @name         京东联盟定向计划商品数据导出
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  抓取京东联盟定向计划的商品数据并导出为Excel
// @author       Dustin
// @match        https://union.jd.com/proManager/planDetails*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547082/%E4%BA%AC%E4%B8%9C%E8%81%94%E7%9B%9F%E5%AE%9A%E5%90%91%E8%AE%A1%E5%88%92%E5%95%86%E5%93%81%E6%95%B0%E6%8D%AE%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/547082/%E4%BA%AC%E4%B8%9C%E8%81%94%E7%9B%9F%E5%AE%9A%E5%90%91%E8%AE%A1%E5%88%92%E5%95%86%E5%93%81%E6%95%B0%E6%8D%AE%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('京东联盟商品数据导出脚本');

    // 等待页面加载完成
    function waitForElements() {
        return new Promise((resolve) => {
            const checkElements = () => {
                // 检查商品数据是否已加载
                const links = document.querySelectorAll('a[href*="//item.jd.com/"]');
                console.log(`找到 ${links.length} 个商品链接`);
                
                if (links.length > 0) {
                    resolve(links);
                } else {
                    setTimeout(checkElements, 500);
                }
            };
            checkElements();
        });
    }

    // 提取商品数据
    function extractProductData() {
        const products = [];
        
        try {
            console.log('开始提取商品数据...');
            
            // 基于实际DOM结构：每个商品由 图片链接 + 佣金段落 + 标题段落 + 价格段落 + 标签文本 组成
            // 获取所有段落元素
            const allParagraphs = document.querySelectorAll('p');
            console.log(`总共找到 ${allParagraphs.length} 个段落`);
            
            // 用于跟踪已添加的SKU，避免重复
            const addedSkus = new Set();
            
            // 查找包含商品标题的段落（包含京东商品链接的段落）
            allParagraphs.forEach((titleParagraph, index) => {
                try {
                    // 查找段落中的商品链接
                    const productLink = titleParagraph.querySelector('a[href*="//item.jd.com/"]');
                    if (!productLink) return;
                    
                    const href = productLink.getAttribute('href');
                    const skuMatch = href.match(/\/(\d+)\.html/);
                    if (!skuMatch) return;
                    
                    const skuId = skuMatch[1];
                    // 避免重复添加同一个SKU
                    if (addedSkus.has(skuId)) return;
                    
                    const title = productLink.textContent.trim();
                    // 过滤掉空标题或太短的标题
                    if (!title || title.length < 10) return;
                    
                    // 查找佣金信息（前一个段落）
                    let commission = '';
                    let estimatedIncome = '';
                    let currentPrice = '';
                    let originalPrice = '';
                    
                    // 向前查找佣金段落
                    const commissionParagraph = titleParagraph.previousElementSibling;
                    console.log('佣金段落:', commissionParagraph);
                    if (commissionParagraph && commissionParagraph.tagName === 'P') {
                        const commissionText = commissionParagraph.textContent.trim();
                        console.log('佣金文本:', commissionText);
                        if (commissionText.includes('佣金比例：') && commissionText.includes('预估收益')) {
                            const commissionMatch = commissionText.match(/佣金比例：已为您匹配当前最高佣金比例(\d+)%/);
                            const incomeMatch = commissionText.match(/预估收益￥([\d.]+)/);
                            
                            console.log('佣金匹配:', commissionMatch);
                            console.log('收益匹配:', incomeMatch);
                            
                            if (commissionMatch) commission = commissionMatch[1];
                            if (incomeMatch) estimatedIncome = incomeMatch[1];
                        } else {
                            console.log('佣金文本格式不匹配，实际内容:', commissionText);
                        }
                    } else {
                        console.log('未找到佣金段落或段落类型错误');
                    }
                    
                    // 向后查找价格段落，使用HTML class提取价格
                    const priceParagraph = titleParagraph.nextElementSibling;
                    console.log('价格段落:', priceParagraph);
                    if (priceParagraph && priceParagraph.tagName === 'P') {
                        // 查找class="real-price"的元素作为到手价
                        const currentPriceElement = priceParagraph.querySelector('.real-price');
                        console.log('到手价元素:', currentPriceElement);
                        if (currentPriceElement) {
                            // 提取价格数字，去掉￥符号和“到手价”关键词
                            const priceText = currentPriceElement.textContent.trim().replace('￥', '').replace('到手价', '');
                            currentPrice = priceText;
                            console.log('提取的到手价:', currentPrice);
                        } else {
                            // 如果没找到.real-price class，使用正则表达式作为备用方案
                            const priceText = priceParagraph.textContent.trim();
                            console.log('备用方案：价格文本:', priceText);
                            if (priceText.includes('到手价￥')) {
                                const priceMatch = priceText.match(/到手价￥([\d.]+)/);
                                if (priceMatch) {
                                    currentPrice = priceMatch[1];
                                    console.log('备用方案提取的到手价:', currentPrice);
                                }
                            }
                        }
                        
                        // 查找有text-decoration: line-through样式的元素作为划线价
                        const allSpans = priceParagraph.querySelectorAll('span');
                        console.log('找到span元素个数:', allSpans.length);
                        allSpans.forEach((span, idx) => {
                            const style = window.getComputedStyle(span);
                            console.log(`span${idx}样式:`, style.textDecoration, '内容:', span.textContent);
                            if (style.textDecoration.includes('line-through')) {
                                const lineThroughPrice = span.textContent.trim().replace('￥', '').replace('划线价', '').replace('原价', '');
                                if (lineThroughPrice) {
                                    originalPrice = lineThroughPrice;
                                    console.log('提取的划线价:', originalPrice);
                                }
                            }
                        });
                        
                        // 如果没找到划线价，使用正则表达式作为备用方案
                        if (!originalPrice) {
                            const priceText = priceParagraph.textContent.trim();
                            const originalMatch = priceText.match(/到手价￥[\d.]+￥([\d.]+)/);
                            if (originalMatch) {
                                originalPrice = originalMatch[1];
                                console.log('备用方案提取的划线价:', originalPrice);
                            }
                        }
                    } else {
                        console.log('未找到价格段落或段落类型错误');
                    }
                    
                    // 添加商品数据
                    addedSkus.add(skuId);
                    products.push({
                        '序号': products.length + 1,
                        'SKU ID': skuId,
                        '商品标题': title,
                        '佣金比例': commission ? commission + '%' : '',
                        '预估收益': estimatedIncome ? estimatedIncome : '',
                        '到手价': currentPrice ? currentPrice : '',
                        '划线价': originalPrice ? originalPrice : '',
                        '商品链接': 'https:' + href
                    });
                    
                    console.log(`提取商品 ${products.length}: ${skuId} - ${title.substring(0, 30)}...`);
                    
                } catch (error) {
                    console.error(`处理第${index}个段落时出错:`, error);
                }
            });
            
            console.log(`成功提取 ${products.length} 个商品数据`);
            return products;
            
        } catch (error) {
            console.error('提取商品数据时出错:', error);
            return [];
        }
    }

    // 导出到Excel
    function exportToExcel(data) {
        if (data.length === 0) {
            alert('没有找到商品数据，请确保页面已完全加载');
            return;
        }
        
        console.log('开始导出Excel，数据条数:', data.length);
        
        try {
            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "商品数据");
            
            // 设置列宽
            const colWidths = [
                {wch: 5},   // 序号
                {wch: 15},  // SKU ID
                {wch: 50},  // 商品标题
                {wch: 10},  // 佣金比例
                {wch: 12},  // 预估收益
                {wch: 12},  // 到手价
                {wch: 12},  // 划线价
                {wch: 30}   // 商品链接
            ];
            ws['!cols'] = colWidths;
            
            const planId = new URLSearchParams(window.location.search).get('planId') || 'unknown';
            const fileName = `京东联盟定向计划_${planId}_商品数据_${new Date().toISOString().slice(0, 10)}.xlsx`;
            
            XLSX.writeFile(wb, fileName);
            console.log(`导出完成，共导出 ${data.length} 条商品数据`);
            alert(`导出完成！共导出 ${data.length} 条商品数据\n\n导出的数据包括：\n- SKU ID\n- 商品标题\n- ${data.filter(d => d['佣金比例']).length} 条有佣金数据\n- ${data.filter(d => d['到手价']).length} 条有价格数据\n- ${data.filter(d => d['划线价']).length} 条有划线价数据`);
        } catch (error) {
            console.error('导出Excel时出错:', error);
            alert('导出失败: ' + error.message);
        }
    }

    // 创建导出按钮
    function createExportButton() {
        // 移除已存在的按钮
        const existingButton = document.getElementById('jd-export-button');
        if (existingButton) {
            existingButton.remove();
        }
        
        const button = document.createElement('button');
        button.id = 'jd-export-button';
        button.innerHTML = '📥 导出商品数据';
        button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background: #ff6600;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        `;
        
        button.addEventListener('click', async () => {
            const originalText = button.innerHTML;
            button.innerHTML = '⏳ 正在导出...';
            button.disabled = true;
            
            try {
                console.log('点击导出按钮，开始导出流程');
                await waitForElements();
                const data = extractProductData();
                console.log('数据提取完成，条数:', data.length);
                
                if (data.length > 0) {
                    exportToExcel(data);
                } else {
                    console.log('未找到商品数据，显示调试信息');
                    const allLinks = document.querySelectorAll('a[href*="//item.jd.com/"]');
                    const allParagraphs = document.querySelectorAll('p');
                    alert(`未找到有效商品数据\n\n调试信息：\n- 找到 ${allLinks.length} 个商品链接\n- 找到 ${allParagraphs.length} 个段落\n\n请检查页面是否完全加载`);
                }
            } catch (error) {
                console.error('导出失败:', error);
                alert('导出失败: ' + error.message);
            } finally {
                button.innerHTML = originalText;
                button.disabled = false;
            }
        });
        
        document.body.appendChild(button);
        console.log('导出按钮已创建');
    }

    // 页面加载后创建按钮
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(createExportButton, 1000);
        });
    } else {
        setTimeout(createExportButton, 1000);
    }

    // 监听路由变化
    let lastUrl = location.href;
    const observer = new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            if (url.includes('planDetails')) {
                setTimeout(createExportButton, 2000);
            }
        }
    });
    
    observer.observe(document, {subtree: true, childList: true});

})();