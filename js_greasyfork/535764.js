// ==UserScript==
// @name         工作室买买买！
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  跨页面收集商品信息，支持批量导出和清空
// @author       MADAO_Mu
// @match        https://item.taobao.com/*
// @match        https://detail.tmall.com/*
// @match        https://item.jd.com/*
// @grant        GM_setClipboard
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/535764/%E5%B7%A5%E4%BD%9C%E5%AE%A4%E4%B9%B0%E4%B9%B0%E4%B9%B0%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/535764/%E5%B7%A5%E4%BD%9C%E5%AE%A4%E4%B9%B0%E4%B9%B0%E4%B9%B0%EF%BC%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 页面内通知
    function showPageNotification(title, message, type = 'success') {
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.zIndex = '9999';
        notification.style.padding = '15px 20px';
        notification.style.borderRadius = '5px';
        notification.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        notification.style.fontSize = '14px';
        notification.style.transition = 'all 0.3s ease';
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        notification.style.cursor = 'default';
        if (type === 'success') {
            notification.style.backgroundColor = '#4CAF50';
            notification.style.color = 'white';
        } else if (type === 'error') {
            notification.style.backgroundColor = '#F44336';
            notification.style.color = 'white';
        } else if (type === 'info') {
            notification.style.backgroundColor = '#2196F3';
            notification.style.color = 'white';
        }
        const titleElement = document.createElement('div');
        titleElement.style.fontWeight = 'bold';
        titleElement.style.marginBottom = '5px';
        titleElement.textContent = title;
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        notification.appendChild(titleElement);
        notification.appendChild(messageElement);
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
        notification.addEventListener('click', () => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
    }

    // 精简URL
    function getCleanUrl(url) {
        try {
            const parsedUrl = new URL(url);
            const hostname = parsedUrl.hostname;

            // 京东商品页面
            const isJDItemPage = hostname.includes('jd.com') &&
                /\/(\d+)\.html$/.test(parsedUrl.pathname);

            if (isJDItemPage) {
                const match = parsedUrl.pathname.match(/\/(\d+)\.html$/);
                const productId = match ? match[1] : null;
                if (productId) {
                    return `https://item.jd.com/${productId}.html`;
                }
            }

            // 淘宝天猫商品页面
            const isTaobaoItemPage = (
                (hostname.includes('taobao.com') || hostname.includes('tmall.com')) &&
                (parsedUrl.pathname.includes('item.htm') || parsedUrl.pathname.includes('item/'))
            );

            if (isTaobaoItemPage) {
                const productId = parsedUrl.searchParams.get('id');
                const skuId = parsedUrl.searchParams.get('skuId');

                if (productId) {
                    let cleanUrl = hostname.includes('tmall.com')
                        ? `https://detail.tmall.com/item.htm?id=${productId}`
                        : `https://item.taobao.com/item.htm?id=${productId}`;
                    
                    if (skuId) {
                        cleanUrl += `&skuId=${skuId}`;
                    }
                    
                    return cleanUrl;
                }
            }
        } catch (error) {
            console.error("URL解析错误:", error);
        }
        return url;
    }

    // 提取商品信息
    function extractProductInfo() {
        const productInfo = {
            title: '',
            price: '',
            specs: {},
            url: getCleanUrl(window.location.href)
        };

        // 提取商品标题
        const jdTitleElement = document.querySelector('.sku-name-title') || document.querySelector('.sku-name');
        const tbTitleElement = document.querySelector('.mainTitle--ocKo1xwj') || 
                              document.querySelector('[class*="mainTitle"]');

        if (jdTitleElement) {
            // 移除所有图片元素，只获取文本
            const titleText = Array.from(jdTitleElement.childNodes)
                .filter(node => node.nodeType === Node.TEXT_NODE)
                .map(node => node.textContent.trim())
                .join(' ')
                .replace(/\s+/g, ' ');
            productInfo.title = titleText;
        } else if (tbTitleElement) {
            const titleText = Array.from(tbTitleElement.childNodes)
                .filter(node => node.nodeType === Node.TEXT_NODE)
                .map(node => node.textContent.trim())
                .join(' ')
                .replace(/\s+/g, ' ');
            productInfo.title = titleText || tbTitleElement.getAttribute('title') || '';
        }

        // 提取价格（使用原价）
        const jdPriceSelectors = [
            '#J_DailyPrice .price',  // 日常价格
            '.p-price .price'         // 主价格
        ];

        for (const selector of jdPriceSelectors) {
            const priceElement = document.querySelector(selector);
            if (priceElement) {
                const priceText = priceElement.textContent.trim();
                const cleanPrice = priceText.replace(/[^\d.]/g, '');
                productInfo.price = cleanPrice;
                break;
            }
        }

        // 淘宝/天猫价格
        if (!productInfo.price) {
            console.log('🔍 开始查找淘宝/天猫价格...');
            
            // 优先尝试获取优惠前价格（原价）
            // 先尝试查找 displayPrice 容器
            let priceWrapContainer = document.querySelector('[class*="displayPrice--"] [class*="priceWrap--"]');
            
            // 如果没找到，直接查找 normalPrice 或 priceWrap 容器
            if (!priceWrapContainer) {
                priceWrapContainer = document.querySelector('[class*="normalPrice--"] [class*="priceWrap--"]') ||
                                   document.querySelector('[class*="priceWrap--"]');
            }
            
            console.log('📦 priceWrapContainer:', priceWrapContainer);
            
            if (priceWrapContainer) {
                // 在subPrice中查找价格（通常是原价）
                const subPriceContainer = priceWrapContainer.querySelector('[class*="subPrice--"]');
                console.log('📦 subPriceContainer:', subPriceContainer);
                
                if (subPriceContainer) {
                    // 获取所有text元素
                    const textElements = subPriceContainer.querySelectorAll('[class*="text--"]');
                    console.log('📝 找到的text元素数量:', textElements.length);
                    
                    // 遍历所有text元素，找到价格数字（不包含¥符号的数字）
                    for (let i = 0; i < textElements.length; i++) {
                        const element = textElements[i];
                        const text = element.textContent.trim();
                        console.log(`📝 text元素[${i}]:`, text, '| 包含¥:', text.includes('¥'));
                        
                        // 检查是否为纯数字（可能包含小数点）
                        if (!text.includes('¥') && /^\d+(\.\d+)?$/.test(text)) {
                            productInfo.price = text;
                            console.log('✅ 找到原价:', productInfo.price);
                            break;
                        }
                    }
                }
            }
            
            // 如果没找到原价，再尝试获取normalPrice
            if (!productInfo.price) {
                console.log('🔄 尝试查找normalPrice...');
                const normalPriceContainer = document.querySelector('[class*="normalPrice--"]');
                console.log('📦 normalPriceContainer:', normalPriceContainer);
                if (normalPriceContainer) {
                    const priceText = normalPriceContainer.querySelector('[class*="text--"]');
                    if (priceText) {
                        productInfo.price = priceText.textContent.trim().replace(/[^\d.]/g, '');
                        console.log('✅ 从normalPrice找到价格:', productInfo.price);
                    }
                }
            }
            
            // 如果还是没找到价格，尝试其他价格
            if (!productInfo.price) {
                console.log('🔄 尝试通用价格查找...');
                const priceElements = document.querySelectorAll('[class*="text"]');
                console.log('📝 找到的通用text元素数量:', priceElements.length);
                if (priceElements.length > 0) {
                    const targetIndex = priceElements.length === 1 ? 0 : 1;
                    const targetElement = priceElements[targetIndex];
                    console.log('📝 选择的元素索引:', targetIndex, '| 内容:', targetElement.textContent.trim());
                    productInfo.price = targetElement.textContent.trim().replace(/[^\d.]/g, '');
                    console.log('✅ 从通用查找找到价格:', productInfo.price);
                }
            }
            
            console.log('🏁 最终识别的价格:', productInfo.price);
        }

        // 提取规格
        // 京东规格
        const specContainer = document.querySelector('#choose-attrs');
        if (specContainer) {
            const specTypes = specContainer.querySelectorAll('.li.p-choose');
            specTypes.forEach(specType => {
                const labelElement = specType.querySelector('.dt');
                const selectedItem = specType.querySelector('.item.selected');
                if (labelElement && selectedItem) {
                    const label = labelElement.textContent.trim().replace(/选择|：|\s/g, '');
                    const value = selectedItem.getAttribute('data-value') ||
                        selectedItem.textContent.trim();
                    productInfo.specs[label] = value;
                }
            });
        }

        // 淘宝/天猫规格 - 支持多种前缀
        if (Object.keys(productInfo.specs).length === 0) {
            console.log('🔍 开始查找淘宝/天猫规格...');
            
            // 通用选择器，匹配多种可能的前缀
            const skuItems = document.querySelectorAll('[class*="skuItem--"]');
            console.log('📦 找到的skuItem数量:', skuItems.length);
            
            skuItems.forEach((item, index) => {
                console.log(`📦 处理skuItem[${index}]:`, item);
                
                // 查找标签元素
                const labelElement = item.querySelector('[class*="ItemLabel--"] span') || 
                                   item.querySelector('[class*="labelText--"]');
                console.log(`📝 labelElement[${index}]:`, labelElement?.textContent);
                
                // 查找选中的规格值元素
                const selectedElement = item.querySelector('[class*="isSelected--"] span[title]') ||
                                      item.querySelector('[class*="valueItem--"][class*="isSelected--"] span[title]') ||
                                      item.querySelector('[class*="isSelected--"] [class*="valueItemText--"]') || 
                                      item.querySelector('[class*="valueItem--"][class*="isSelected--"] [class*="valueItemText--"]');
                console.log(`📝 selectedElement[${index}]:`, selectedElement?.textContent);
                
                if (labelElement && selectedElement) {
                    const label = labelElement.textContent.trim();
                    const value = selectedElement.getAttribute('title') || selectedElement.textContent.trim();
                    console.log(`✅ 找到规格 - ${label}: ${value}`);
                    productInfo.specs[label] = value;
                }
            });
            
            console.log('🏁 最终识别的规格:', productInfo.specs);
        }

        return productInfo;
    }

    // 保存商品到本地
    function saveProduct(info) {
        let list = GM_getValue('productList', []);
        // 避免重复（用链接去重）
        if (list.some(item => item.url === info.url)) {
            showPageNotification('已存在', '该商品已保存过', 'info');
            return;
        }
        list.push(info);
        GM_setValue('productList', list);
        showPageNotification('保存成功', '商品已加入批量导出列表');
    }

    // 导出所有已保存商品
    function exportAllProducts() {
        let list = GM_getValue('productList', []);
        if (!list.length) {
            showPageNotification('无数据', '没有可导出的商品', 'info');
            return;
        }
        const headers = ['序号', '商品名称', '规格', '价格', '数量', '总价', '链接'];
        const rows = [headers];
        list.forEach((item, idx) => {
            const specsText = Object.entries(item.specs || {})
                .map(([label, value]) => `${label}:${value}`)
                .join('/');
            const price = parseFloat(item.price) || 0;
            const quantity = item.quantity || 1;
            const sum = price * quantity;
            rows.push([
                idx + 1,
                item.title,
                specsText,
                item.price,
                quantity,
                sum.toFixed(2),
                item.url
            ]);
        });
    
        // 动态加载 SheetJS 并导出 Excel
        function doExport() {
            /* global XLSX */
            const ws = XLSX.utils.aoa_to_sheet(rows);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "商品列表");
            const wbout = XLSX.write(wb, {bookType: 'xlsx', type: 'array'});
            const blob = new Blob([wbout], {type: "application/octet-stream"});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `商品列表_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
            showPageNotification('导出成功', `已导出${list.length}条商品`);
        }
    
        if (typeof XLSX === 'undefined') {
            // 没有加载过SheetJS，动态加载
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
            script.onload = doExport;
            document.body.appendChild(script);
        } else {
            doExport();
        }
    }

    // 清空已保存商品
    function clearAllProducts() {
        GM_setValue('productList', []);
        showPageNotification('已清空', '商品列表已清空', 'success');
    }

    // 显示商品列表
    function showProductList() {
        // 先移除已有的浮窗
        const old = document.getElementById('tm-goods-list-panel');
        if (old) old.remove();

        let list = GM_getValue('productList', []);
        // 兼容老数据
        list.forEach(item => {
            if (typeof item.quantity !== 'number' || isNaN(item.quantity)) item.quantity = 1;
        });

        const panel = document.createElement('div');
        panel.id = 'tm-goods-list-panel';
        panel.style.position = 'fixed';
        panel.style.top = '80px';
        panel.style.left = '50%';
        panel.style.transform = 'translateX(-50%)';
        panel.style.zIndex = '100000';
        panel.style.background = '#fff';
        panel.style.border = '1px solid #ddd';
        panel.style.borderRadius = '8px';
        panel.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
        panel.style.padding = '20px';
        panel.style.minWidth = '700px';
        panel.style.maxHeight = '70vh';
        panel.style.overflowY = 'auto';

        // 关闭按钮
        const closeBtn = document.createElement('span');
        closeBtn.textContent = '×';
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '10px';
        closeBtn.style.right = '20px';
        closeBtn.style.fontSize = '22px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.onclick = () => panel.remove();
        panel.appendChild(closeBtn);

        // 标题
        const title = document.createElement('div');
        title.textContent = `已保存商品（${list.length}）`;
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '12px';
        panel.appendChild(title);

        // 表格
        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.innerHTML = `
            <tr style="background:#f5f5f5;">
                <th style="padding:6px;border:1px solid #eee;min-width:30px;">序号</th>
                <th style="padding:6px;border:1px solid #eee;min-width:250px;">商品名称</th>
                <th style="padding:6px;border:1px solid #eee;min-width:150px;">规格</th>
                <th style="padding:6px;border:1px solid #eee;min-width:80px;">价格</th>
                <th style="padding:6px;border:1px solid #eee;min-width:30px;">数量</th>
                <th style="padding:6px;border:1px solid #eee;min-width:80px;">总价</th>
                <th style="padding:6px;border:1px solid #eee;min-width:50px;">链接</th>
                <th style="padding:6px;border:1px solid #eee;min-width:50px;">操作</th>
            </tr>
        `;
        let totalSum = 0;
        list.forEach((item, idx) => {
            const specsText = Object.entries(item.specs || {})
                .map(([label, value]) => `${label}:${value}`)
                .join('/');
            const price = parseFloat(item.price) || 0;
            const quantity = item.quantity || 1;
            const sum = price * quantity;
            totalSum += sum;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="padding:6px;border:1px solid #eee;">${idx + 1}</td>
                <td style="padding:6px;border:1px solid #eee;">${item.title}</td>
                <td style="padding:6px;border:1px solid #eee;">${specsText}</td>
                <td style="padding:6px;border:1px solid #eee;">${item.price}</td>
                <td style="padding:6px;border:1px solid #eee;">
                    <input type="number" min="1" value="${quantity}" data-idx="${idx}" style="width:60px;">
                </td>
                <td style="padding:6px;border:1px solid #eee;" data-sum="sum">${sum.toFixed(2)}</td>
                <td style="padding:6px;border:1px solid #eee;word-break:break-all;">
                    <a href="${item.url}" target="_blank" style="color:#2196F3;">链接</a>
                </td>
                <td style="padding:6px;border:1px solid #eee;">
                    <button data-idx="${idx}" data-action="copy" style="color:#fff;background:#2196F3;border:none;border-radius:3px;padding:2px 8px;cursor:pointer;margin-right:5px;">复制</button>
                    <button data-idx="${idx}" data-action="delete" style="color:#fff;background:#F44336;border:none;border-radius:3px;padding:2px 8px;cursor:pointer;">删除</button>
                </td>
            `;
            table.appendChild(tr);
        });
        panel.appendChild(table);

        // 总价显示
        const totalDiv = document.createElement('div');
        totalDiv.id = 'tm-goods-total-sum';
        totalDiv.style.marginTop = '16px';
        totalDiv.style.fontWeight = 'bold';
        totalDiv.style.fontSize = '16px';
        totalDiv.textContent = `总价合计：${totalSum.toFixed(2)}`;
        panel.appendChild(totalDiv);

        // 事件处理
        panel.addEventListener('input', function(e) {
            if (e.target.tagName === 'INPUT' && e.target.type === 'number' && e.target.dataset.idx) {
                let idx = Number(e.target.dataset.idx);
                let val = parseInt(e.target.value, 10);
                if (isNaN(val) || val < 1) val = 1;
                e.target.value = val;
                list[idx].quantity = val;
                GM_setValue('productList', list);

                // 更新总价
                const price = parseFloat(list[idx].price) || 0;
                const sum = price * val;
                // 更新当前行的总价
                e.target.parentElement.parentElement.querySelector('[data-sum="sum"]').textContent = sum.toFixed(2);

                // 重新计算总价合计
                let total = 0;
                list.forEach(item => {
                    total += (parseFloat(item.price) || 0) * (item.quantity || 1);
                });
                totalDiv.textContent = `总价合计：${total.toFixed(2)}`;
            }
        });

        panel.addEventListener('click', function(e) {
            if (e.target.tagName === 'BUTTON' && e.target.dataset.idx) {
                let idx = Number(e.target.dataset.idx);
                if (e.target.dataset.action === 'delete') {
                    list.splice(idx, 1);
                    GM_setValue('productList', list);
                    showPageNotification('已删除', '商品已从列表移除', 'success');
                    panel.remove();
                    showProductList();
                } else if (e.target.dataset.action === 'copy') {
                    const item = list[idx];
                    const specsText = Object.entries(item.specs || {})
                        .map(([label, value]) => `${label}:${value}`)
                        .join('/');
                    const text = `${item.title}\t${specsText}\t${item.price}\t${item.url}`;
                    GM_setClipboard(text);
                    showPageNotification('复制成功', '商品信息已复制到剪贴板', 'success');
                }
            }
        });

        document.body.appendChild(panel);
    }

    // 添加按钮
    function addButtons() {
        if (document.getElementById('tm-goods-copy-btn')) return;
        
        // 复制商品按钮
        const copyBtn = document.createElement('button');
        copyBtn.id = 'tm-goods-copy-current-btn';
        copyBtn.textContent = '复制商品';
        copyBtn.style.position = 'fixed';
        copyBtn.style.top = '80px';
        copyBtn.style.right = '30px';
        copyBtn.style.zIndex = '99999';
        copyBtn.style.background = '#2196F3';
        copyBtn.style.color = '#fff';
        copyBtn.style.border = 'none';
        copyBtn.style.borderRadius = '4px';
        copyBtn.style.padding = '10px 18px';
        copyBtn.style.fontSize = '16px';
        copyBtn.style.cursor = 'pointer';
        copyBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
        copyBtn.addEventListener('click', function() {
            const info = extractProductInfo();
            if (!info.title || !info.url) {
                showPageNotification('复制失败', '未能正确获取商品信息', 'error');
                return;
            }
            const specsText = Object.entries(info.specs || {})
                .map(([label, value]) => `${label}:${value}`)
                .join('/');
            const text = `${info.title}\t${specsText}\t${info.price}\t${info.url}`;
            GM_setClipboard(text);
            showPageNotification('复制成功', '商品信息已复制到剪贴板', 'success');
        });
        document.body.appendChild(copyBtn);

        // 保存按钮
        const saveBtn = document.createElement('button');
        saveBtn.id = 'tm-goods-copy-btn';
        saveBtn.textContent = '保存商品';
        saveBtn.style.position = 'fixed';
        saveBtn.style.top = '130px';
        saveBtn.style.right = '30px';
        saveBtn.style.zIndex = '99999';
        saveBtn.style.background = '#ff6b81';
        saveBtn.style.color = '#fff';
        saveBtn.style.border = 'none';
        saveBtn.style.borderRadius = '4px';
        saveBtn.style.padding = '10px 18px';
        saveBtn.style.fontSize = '16px';
        saveBtn.style.cursor = 'pointer';
        saveBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
        saveBtn.addEventListener('click', function() {
            const info = extractProductInfo();
            if (!info.title || !info.url) {
                showPageNotification('保存失败', '未能正确获取商品信息', 'error');
                return;
            }
            saveProduct(info);
        });
        document.body.appendChild(saveBtn);

        // 查看列表按钮
        const listBtn = document.createElement('button');
        listBtn.id = 'tm-goods-list-btn';
        listBtn.textContent = '查看列表';
        listBtn.style.position = 'fixed';
        listBtn.style.top = '180px';
        listBtn.style.right = '30px';
        listBtn.style.zIndex = '99999';
        listBtn.style.background = '#2196F3';
        listBtn.style.color = '#fff';
        listBtn.style.border = 'none';
        listBtn.style.borderRadius = '4px';
        listBtn.style.padding = '10px 18px';
        listBtn.style.fontSize = '16px';
        listBtn.style.cursor = 'pointer';
        listBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
        listBtn.addEventListener('click', showProductList);
        document.body.appendChild(listBtn);

        // 批量导出按钮
        const exportBtn = document.createElement('button');
        exportBtn.id = 'tm-goods-export-btn';
        exportBtn.textContent = '批量导出';
        exportBtn.style.position = 'fixed';
        exportBtn.style.top = '230px';
        exportBtn.style.right = '30px';
        exportBtn.style.zIndex = '99999';
        exportBtn.style.background = '#4CAF50';
        exportBtn.style.color = '#fff';
        exportBtn.style.border = 'none';
        exportBtn.style.borderRadius = '4px';
        exportBtn.style.padding = '10px 18px';
        exportBtn.style.fontSize = '16px';
        exportBtn.style.cursor = 'pointer';
        exportBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
        exportBtn.addEventListener('click', exportAllProducts);
        document.body.appendChild(exportBtn);

        // 清空按钮
        const clearBtn = document.createElement('button');
        clearBtn.id = 'tm-goods-clear-btn';
        clearBtn.textContent = '清空列表';
        clearBtn.style.position = 'fixed';
        clearBtn.style.top = '280px';
        clearBtn.style.right = '30px';
        clearBtn.style.zIndex = '99999';
        clearBtn.style.background = '#888';
        clearBtn.style.color = '#fff';
        clearBtn.style.border = 'none';
        clearBtn.style.borderRadius = '4px';
        clearBtn.style.padding = '10px 18px';
        clearBtn.style.fontSize = '16px';
        clearBtn.style.cursor = 'pointer';
        clearBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
        clearBtn.addEventListener('click', function() {
            if (confirm('确定要清空所有已保存的商品吗？')) {
                clearAllProducts();
            }
        });
        document.body.appendChild(clearBtn);
    }

    // 页面加载后添加按钮
    setTimeout(addButtons, 1000);
})();