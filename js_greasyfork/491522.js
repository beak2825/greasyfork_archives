// ==UserScript==
// @name         GetRealWebUrl
// @namespace    http://tampermonkey.net/
// @version      2025-09-15
// @description  获取询价单对应的真实单据地址!
// @author       You
// @match        https://vendor-portal.prodigymarinesolutions.com/*/quote-requests
// @icon         https://www.google.com/s2/favicons?sz=64&domain=prodigymarinesolutions.com
// @run-at       document-start
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491522/GetRealWebUrl.user.js
// @updateURL https://update.greasyfork.org/scripts/491522/GetRealWebUrl.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 变量声明优化：使用let/const替代var，明确作用域
    let grid = null;
    const rfqListData = []; // 只读数组，使用const
    const cachedLinks = {};
    let cachedTenantId = '';
    let refreshButton = null;

    // 存储原始XMLHttpRequest方法，避免重复重写
    const originOpen = XMLHttpRequest.prototype.open;
    const originSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
    const originSend = XMLHttpRequest.prototype.send;

    // 重写open方法
    XMLHttpRequest.prototype.open = function (method, url) {
        this._capturedUrl = url;
        this._capturedHeaders = {};
        return originOpen.apply(this, arguments);
    };

    // 重写setRequestHeader方法
    XMLHttpRequest.prototype.setRequestHeader = function (headerName, headerValue) {
        this._capturedHeaders[headerName.toLowerCase()] = headerValue;
        return originSetRequestHeader.apply(this, arguments);
    };

    // 重写send方法（优化拦截逻辑，减少对其他请求的影响）
    XMLHttpRequest.prototype.send = function (body) {
        const url = this._capturedUrl;
        const isTargetRequest = url?.includes('RequestForQuote/GetRFQ') && body?.includes('rfqNumber');

        if (isTargetRequest) {
            const originalOnReadyStateChange = this.onreadystatechange;
            this.onreadystatechange = function () {
                if (originalOnReadyStateChange) {
                    originalOnReadyStateChange.apply(this, arguments);
                }

                if (this.readyState === 4) {
                    try {
                        // 提取tenant_id
                        cachedTenantId = this._capturedHeaders['tenant_id'] || '';
                        if (cachedTenantId) {
                            console.log('拦截到tenant_id:', cachedTenantId);
                        } else {
                            console.warn('未找到tenant_id，可能影响后续请求');
                        }

                        // 解析响应数据
                        const resData = JSON.parse(this.responseText || this.response);
                        const rfqlist = resData?.dataResponse?.data?.rfq;
                        if (rfqlist && Array.isArray(rfqlist)) {
                            rfqListData.length = 0; // 清空数组再添加，避免重复
                            rfqListData.push(...rfqlist);
                            waitForGrid();
                        }
                    } catch (e) {
                        console.error('处理GetRFQ响应失败:', e);
                    }
                }
            };
        }

        return originSend.apply(this, arguments);
    };

    // 提取Token（优化错误提示）
    function getTokenFromUserCookie() {
        try {
            const userCookie = document.cookie.split('; ')
            .find(cookie => cookie.trim().startsWith('user='));

            if (!userCookie) {
                console.error('未找到"user"Cookie，无法获取Token');
                return '';
            }

            const token = userCookie.split('=')[1]?.trim();
            return token ? `Bearer ${token}` : '';
        } catch (e) {
            console.error('提取Token失败:', e);
            return '';
        }
    }

    // 获取询价单详情（优化按钮状态管理和错误处理）
    function fetchRfqDetails(rfq) {
        if (cachedLinks[rfq.rfqNumber]) {
            prompt(`询价单 ${rfq.rfqNumber} 链接`, cachedLinks[rfq.rfqNumber]);
            return;
        }

        // 查找当前按钮
        const currentButton = document.querySelector(`.rfq-link-btn[data-rfq-number="${rfq.rfqNumber}"]`);
        if (currentButton) {
            currentButton.textContent = "加载中...";
            currentButton.disabled = true;
        }

        // 验证必要参数
        if (!cachedTenantId) {
            alert('未获取到tenant_id，无法请求详情');
            if (currentButton) {
                currentButton.textContent = "获取链接";
                currentButton.disabled = false;
            }
            return;
        }

        const token = getTokenFromUserCookie();
        if (!token) {
            alert('未获取到Token，无法请求详情');
            if (currentButton) {
                currentButton.textContent = "获取链接";
                currentButton.disabled = false;
            }
            return;
        }

        // 发送请求
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://prodigyp2p-api.prodigymarinesolutions.com/api/RequestForQuote/GetRFQForVP', true);

        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', token);
        xhr.setRequestHeader('locale', 'en');
        xhr.setRequestHeader('tenant_id', cachedTenantId);
        xhr.setRequestHeader('time_zone', 'IND');

        const requestBody = JSON.stringify({
            pageNumber: 1,
            pageSize: 25,
            rfqNumber: rfq.rfqNumber,
            SourceTypeName: rfq.sourceTypeName,
            vendorId: rfq.vendorId,
            vendorLocationId: rfq.vendorLocationId
        });

        xhr.onreadystatechange = function() {
            // 恢复按钮状态
            if (currentButton) {
                currentButton.textContent = "获取链接";
                currentButton.disabled = false;
            }

            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    try {
                        const detailData = JSON.parse(xhr.responseText);
                        const realLink = detailData?.dataResponse?.data?.rfqVendors?.[0]?.pdfUrl || '未找到链接信息';
                        cachedLinks[rfq.rfqNumber] = realLink;
                        prompt(`询价单 ${rfq.rfqNumber} 链接`, realLink);
                    } catch (e) {
                        console.error(`解析${rfq.rfqNumber}详情失败:`, e);
                        alert('获取链接失败：解析数据出错');
                    }
                } else {
                    console.error(`获取${rfq.rfqNumber}详情失败，状态码:${xhr.status}`);
                    alert(`获取链接失败：服务器返回 ${xhr.status} 错误`);
                }
            }
        };

        xhr.send(requestBody);
    }

    // 等待表格加载（优化轮询逻辑）
    function waitForGrid() {
        let times = 0;
        const checkInterval = setInterval(() => {
            times++;
            grid = document.querySelector(".ag-center-cols-container") ||
                document.querySelector('[class*="ag-center-cols"]');

            if (grid) {
                clearInterval(checkInterval);
                console.log('表格已加载，生成按钮');
                addManualRefreshButton(); // 表格加载后添加刷新按钮
                generateButtons();


                // 优化MutationObserver配置，减少触发频率
                const observer = new MutationObserver(() => {
                    // 防抖处理：避免频繁触发
                    setTimeout(generateButtons, 300);
                });
                observer.observe(grid.parentElement || grid, {
                    childList: true,
                    subtree: true
                });
            } else if (times > 120) { // 1分钟超时
                clearInterval(checkInterval);
                console.error('表格加载超时');
            }
        }, 500);
    }

    // 生成按钮（优化样式和插入逻辑）
    function generateButtons() {
        if (!grid || rfqListData.length === 0) return;

        // 统一样式定义
        const buttonStyle = `
            margin-right: 8px;
            padding: 3px 8px;
            background: #28a745;
            color: white;
            border: none;
            border-radius: 2px;
            cursor: pointer;
            vertical-align: middle;
        `;

        for (const row of grid.children) {
            // 查找询价单号单元格
            const rfqNumberCell = Array.from(row.children).find(cell =>
                                                                cell.textContent.trim().startsWith('RFQ-')
                                                               );

            if (rfqNumberCell) {
                const rfqNumber = rfqNumberCell.textContent.trim();
                const rfqData = rfqListData.find(item => item.rfqNumber === rfqNumber);

                // 避免重复添加
                if (rfqData && !row.querySelector(`.rfq-link-btn[data-rfq-number="${rfqNumber}"]`)) {
                    const linkBtn = document.createElement('button');
                    linkBtn.className = 'rfq-link-btn';
                    linkBtn.textContent = '获取链接';
                    linkBtn.dataset.rfqNumber = rfqNumber;
                    linkBtn.style.cssText = buttonStyle;

                    linkBtn.addEventListener('click', () => fetchRfqDetails(rfqData));

                    // 插入到第一格最前面
                    const firstCell = row.children[0];
                    if (firstCell) {
                        firstCell.insertBefore(linkBtn, firstCell.firstChild);
                    }
                }
            }
        }
    }

    // 添加手动刷新按钮（修改插入位置为指定选择器下方）
    function addManualRefreshButton() {
        if (refreshButton) return;

        // 创建按钮
        refreshButton = document.createElement('button');
        refreshButton.textContent = "重新获取原始连接";
        refreshButton.style.cssText = `
            padding: 6px 12px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 14px;
        `;

        // 点击事件
        refreshButton.addEventListener('click', () => {
            document.querySelectorAll('.rfq-link-btn').forEach(btn => btn.remove());
            generateButtons();
            alert('按钮刷新完成！');
        });

        // 插入到指定位置下方
        const targetContainer = document.querySelector('body > div > main > div > div:nth-child(2) > div:nth-child(3) > div:nth-child(1)');
        if (targetContainer) {
            targetContainer.appendChild(refreshButton);
        } else {
            // 兼容处理：如果指定位置不存在， fallback 到表格上方
            console.warn('指定位置未找到，使用默认位置');
            if (grid?.parentElement) {
                grid.parentElement.insertBefore(refreshButton, grid);
            } else if (grid) {
                grid.before(refreshButton);
            }
        }
    }
})();