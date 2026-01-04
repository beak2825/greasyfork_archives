// ==UserScript==
// @name         阿里巴巴询盘数据采集-所有询盘(不仅仅是近一年的询盘)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  采集阿里巴巴开店至今所有询盘明细数据并导出为Excel
// @author       树洞先生
// @license      MIT
// @match        https://message.alibaba.com/message/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
// @downloadURL https://update.greasyfork.org/scripts/540816/%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E8%AF%A2%E7%9B%98%E6%95%B0%E6%8D%AE%E9%87%87%E9%9B%86-%E6%89%80%E6%9C%89%E8%AF%A2%E7%9B%98%28%E4%B8%8D%E4%BB%85%E4%BB%85%E6%98%AF%E8%BF%91%E4%B8%80%E5%B9%B4%E7%9A%84%E8%AF%A2%E7%9B%98%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540816/%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E8%AF%A2%E7%9B%98%E6%95%B0%E6%8D%AE%E9%87%87%E9%9B%86-%E6%89%80%E6%9C%89%E8%AF%A2%E7%9B%98%28%E4%B8%8D%E4%BB%85%E4%BB%85%E6%98%AF%E8%BF%91%E4%B8%80%E5%B9%B4%E7%9A%84%E8%AF%A2%E7%9B%98%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 字段映射
    const FIELD_WHITELIST = [
        "name", "highQualityLevelTag", "levelTag", "appFrom", "feedbackType",
        "source", "subject", "tradeId", "createTime", "lastestReplyTime",
        "readTime", "productId", "productName", "imageUrl", "url",
        "ownerName", "noteCode", "registerDate", "country", "companyName",
        "companyWebSite", "email", "mobileNumber", "phoneNumber",
        "preferredIndustries", "productViewCount", "validInquiryCount",
        "repliedInquiryCount", "validRfqCount", "loginDays",
        "spamInquiryMarkedBySupplierCount", "addedToBlacklistCount",
        "totalOrderCount", "totalOrderVolume", "tradeSupplierCount"
    ];

    const FIELD_CHINESE_MAP = {
        "name": "客户名", "highQualityLevelTag": "买家等级标签",
        "levelTag": "买家类型标签", "appFrom": "询盘来源终端",
        "feedbackType": "询盘类型", "source": "询盘来源",
        "subject": "询盘标题", "tradeId": "询盘ID",
        "createTime": "创建时间", "lastestReplyTime": "最新回复时间",
        "readTime": "读取时间", "productId": "询盘产品ID",
        "productName": "询盘产品标题", "imageUrl": "询盘产品图片",
        "url": "询盘产品链接", "ownerName": "业务员",
        "noteCode": "备注代码", "registerDate": "注册日期",
        "country": "国家/地区", "companyName": "公司名称",
        "companyWebSite": "公司网站", "email": "邮箱",
        "mobileNumber": "手机号码", "phoneNumber": "电话号码",
        "preferredIndustries": "最常采购行业", "productViewCount": "产品浏览数",
        "validInquiryCount": "有效询价数", "repliedInquiryCount": "回复询价数量",
        "validRfqCount": "有效RFQ数", "loginDays": "登录天数",
        "spamInquiryMarkedBySupplierCount": "垃圾询盘数",
        "addedToBlacklistCount": "被加为黑名单数", "totalOrderCount": "订单总数",
        "totalOrderVolume": "订单总金额", "tradeSupplierCount": "交易供应商数"
    };

    let isCollecting = false;

    // 工具函数
    function extractToken(name) {
        const match = document.cookie.match(new RegExp(name + '=([^;]+)'));
        return match ? match[1] : '';
    }

    function getNested(obj, ...keys) {
        for (let key of keys) {
            if (!obj) return '';
            obj = obj[key];
        }
        return obj || '';
    }

    function formatTimestamp(ts) {
        try {
            ts = parseInt(ts);
            if (ts > 1e12) ts = Math.floor(ts / 1000);
            const date = new Date(ts * 1000);
            return date.toLocaleString('zh-CN', {
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
            }).replace(/\//g, '-');
        } catch {
            return ts;
        }
    }

    function formatDate(ts) {
        try {
            ts = parseInt(ts);
            const date = new Date(ts * 1000);
            return date.toLocaleDateString('zh-CN').replace(/\//g, '-');
        } catch {
            return ts;
        }
    }

    // 显示消息弹窗
    function showMessage(message, type = 'info') {
        const msgDiv = document.createElement('div');
        msgDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 24px 32px;
            border-radius: 8px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.2);
            z-index: 10002;
            max-width: 400px;
            font-size: 14px;
        `;

        const color = type === 'error' ? '#f44336' : type === 'success' ? '#4caf50' : '#2196f3';
        msgDiv.innerHTML = `
            <div style="color: ${color}; font-weight: bold; margin-bottom: 12px;">
                ${type === 'error' ? '❌ 错误' : type === 'success' ? '✅ 成功' : 'ℹ️ 提示'}
            </div>
            <div style="color: #333; line-height: 1.6;">${message}</div>
            <button id="msg-close-btn" style="margin-top: 16px; padding: 8px 24px; background: ${color}; color: white; border: none; border-radius: 4px; cursor: pointer; width: 100%;">确定</button>
        `;

        document.body.appendChild(msgDiv);
        document.getElementById('msg-close-btn').onclick = () => msgDiv.remove();

        setTimeout(() => msgDiv.remove(), 5000);
    }

    // API请求函数
    async function fetchPage(page, tokens) {
        console.log(`正在请求第 ${page} 页数据...`);
        const params = new URLSearchParams({
            ctoken: tokens.ctoken,
            dmtrack_pageid: '6797ac1f0b1a90b01751353557'
        });

        const paramsJson = {
            system: "feedback",
            listType: "all",
            pageSize: 100,
            pagination: { nextPage: page, pageSize: 100 },
            filter: { isShowAtm: false, queryType: "history" },
            order: { order: "desc", orderBy: "latest_contact_time" },
            search: {}
        };

        const body = new URLSearchParams({
            _csrf_token_: tokens.csrf,
            postId: '1751353543558',
            params: JSON.stringify(paramsJson)
        });

        try {
            const response = await fetch(
                `https://message.alibaba.com/message/ajax/feedback/subjectList.htm?${params}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Accept': 'application/json, text/javascript, */*; q=0.01',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: body.toString(),
                    credentials: 'include'
                }
            );

            const data = await response.json();
            return data;
        } catch (e) {
            console.error('请求失败:', e);
            throw e;
        }
    }

    async function fetchAccountIdEncrypt(secTradeId, tokens) {
        if (!secTradeId) return '';
        const params = new URLSearchParams({
            ctoken: tokens.ctoken,
            _tb_token_: tokens.tb
        });

        const body = new URLSearchParams({
            _csrf_token_: tokens.csrf,
            params: JSON.stringify({ secTradeId })
        });

        try {
            const response = await fetch(
                `https://message.alibaba.com/message/ajax/feedback/querySummary.htm?${params}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: body.toString(),
                    credentials: 'include'
                }
            );
            const result = await response.json();
            return result?.data?.contact?.accountIdEncrypt || '';
        } catch (e) {
            return '';
        }
    }

    async function fetchKHTAccessToken(tradeId) {
        if (!tradeId) return '';
        try {
            const response = await fetch(
                `https://message.alibaba.com/message/maDetail.htm?imInquiryId=${tradeId}&hash=`,
                { credentials: 'include' }
            );
            const html = await response.text();
            const match = html.match(/window\.KHTAccessToken\s*=\s*['"]([^'"]+)['"]/);
            return match ? match[1] : '';
        } catch (e) {
            return '';
        }
    }

    async function fetchCustomerInfo(accountIdEncrypt, secTradeId, khtToken, tokens) {
        const params = new URLSearchParams({
            buyerAccountId: accountIdEncrypt,
            secTradeId: secTradeId,
            buyerLoginId: '',
            secReqToken: khtToken,
            clientType: '',
            ctoken: tokens.ctoken,
            _tb_token_: tokens.tb,
            callback: ''
        });

        try {
            const response = await fetch(
                `https://alicrm.alibaba.com/jsonp/customerPluginQueryServiceI/queryCustomerInfo.json?${params}`,
                { credentials: 'include' }
            );
            const text = await response.text();
            const jsonStr = text.replace(/^\w+\((.*)\)$/, '$1');
            const data = JSON.parse(jsonStr);
            return data?.data || {};
        } catch (e) {
            return {};
        }
    }

    async function fetchQuerySummaryFields(secTradeId, tokens) {
        if (!secTradeId) return {};
        const params = new URLSearchParams({
            ctoken: tokens.ctoken,
            _tb_token_: tokens.tb
        });

        const body = new URLSearchParams({
            _csrf_token_: tokens.csrf,
            params: JSON.stringify({ secTradeId })
        });

        try {
            const response = await fetch(
                `https://message.alibaba.com/message/ajax/feedback/querySummary.htm?${params}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: body.toString(),
                    credentials: 'include'
                }
            );
            const result = await response.json();
            const contact = result?.data?.contact || {};
            return {
                name: contact.name || '',
                productId: contact.productId || '',
                productName: contact.productName || '',
                imageUrl: contact.imageUrl || '',
                url: contact.url || ''
            };
        } catch (e) {
            return {};
        }
    }

    // 显示设置弹窗
    async function showSettingsDialog() {
        if (document.getElementById('inquiry-export-dialog')) return;
        if (isCollecting) {
            showMessage('正在采集中,请稍候...', 'info');
            return;
        }

        // 获取tokens
        const tokens = {
            ctoken: extractToken('ctoken'),
            xsrf: extractToken('XSRF-TOKEN'),
            tb: extractToken('_tb_token_'),
            csrf: extractToken('XSRF-TOKEN')
        };

        if (!tokens.ctoken || !tokens.csrf) {
            showMessage('无法获取必要的认证信息,请确保:\n1. 已登录阿里巴巴后台\n2. 在询盘消息页面运行此脚本\n3. 刷新页面后重试', 'error');
            return;
        }

        // 获取总页数
        let totalCount = 0;
        let totalPages = 1;
        let statusText = '正在获取总页数...';

        try {
            const result = await fetchPage(1, tokens);
            totalCount = result?.data?.pagination?.totalCount || 0;
            const pageSize = result?.data?.pagination?.pageSize || 100;
            totalPages = Math.ceil(totalCount / pageSize);
            if (totalPages < 1) totalPages = 1;
            statusText = `共 ${totalCount} 条,约 ${totalPages} 页`;
        } catch (e) {
            statusText = '无法获取总页数';
        }

        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.id = 'inquiry-export-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 10000;
        `;
        overlay.onclick = () => {
            overlay.remove();
            dialog.remove();
        };

        // 创建对话框
        const dialog = document.createElement('div');
        dialog.id = 'inquiry-export-dialog';
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.18);
            z-index: 10001;
            padding: 32px 24px 24px 24px;
            min-width: 400px;
            font-family: Arial, sans-serif;
        `;
        dialog.onclick = (e) => e.stopPropagation();

        dialog.innerHTML = `
            <div style="font-size:20px;font-weight:bold;margin-bottom:20px;color:#333;">📊 导出询盘明细</div>
            <div style="margin-bottom:16px;">
                <label style="display:block;margin-bottom:8px;color:#666;">采集页码(起始):</label>
                <input id="export-page-start" type="number" value="1" min="1" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;font-size:14px;">
            </div>
            <div style="margin-bottom:16px;">
                <label style="display:block;margin-bottom:8px;color:#666;">采集页数:</label>
                <input id="export-page-count" type="number" value="1" min="1" max="${totalPages}" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;font-size:14px;">
                <span style="color:#888;font-size:12px;margin-top:4px;display:block;">最大可采集页码数为 ${totalPages}</span>
            </div>
            <div style="margin-bottom:20px;padding:12px;background:#f8f9fa;border-radius:4px;">
                <span id="inquiry-export-status" style="font-size:14px;color:#666;">${statusText}</span>
            </div>
            <div style="display:flex;gap:12px;">
                <button id="start-export-btn" style="flex:1;background:#007bff;color:#fff;border:none;padding:10px 20px;border-radius:4px;cursor:pointer;font-size:15px;transition:all 0.3s;">
                    开始采集
                </button>
                <button id="close-export-btn" style="flex:1;background:#6c757d;color:#fff;border:none;padding:10px 20px;border-radius:4px;cursor:pointer;font-size:15px;transition:all 0.3s;">
                    关闭
                </button>
            </div>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(dialog);

        // 按钮悬停效果
        const startBtn = document.getElementById('start-export-btn');
        const closeBtn = document.getElementById('close-export-btn');

        startBtn.onmouseover = () => startBtn.style.background = '#0056b3';
        startBtn.onmouseout = () => startBtn.style.background = '#007bff';
        closeBtn.onmouseover = () => closeBtn.style.background = '#5a6268';
        closeBtn.onmouseout = () => closeBtn.style.background = '#6c757d';

        // 按钮事件
        closeBtn.onclick = () => {
            overlay.remove();
            dialog.remove();
        };

        startBtn.onclick = () => {
            const startPage = parseInt(document.getElementById('export-page-start').value, 10) || 1;
            let pageCount = parseInt(document.getElementById('export-page-count').value, 10) || 1;
            if (pageCount > totalPages) pageCount = totalPages;
            startCollection(startPage, pageCount, totalPages, dialog, tokens);
        };
    }

    // 更新状态
    function updateStatus(message, dialog) {
        const statusElement = dialog.querySelector('#inquiry-export-status');
        if (statusElement) {
            statusElement.textContent = message;
        }
        console.log(message);
    }

    // 开始采集
    async function startCollection(startPage, pageCount, totalPages, dialog, tokens) {
        if (isCollecting) return;

        isCollecting = true;
        const startBtn = document.getElementById('start-export-btn');
        if (startBtn) {
            startBtn.disabled = true;
            startBtn.style.opacity = '0.6';
            startBtn.style.cursor = 'not-allowed';
        }

        try {
            const endPage = Math.min(startPage + pageCount - 1, totalPages);
            updateStatus('开始采集数据...', dialog);

            // 采集数据
            const items = [];
            const seenTradeIds = new Set();

            for (let page = startPage; page <= endPage; page++) {
                updateStatus(`正在采集第 ${page}/${endPage} 页...`, dialog);
                const result = await fetchPage(page, tokens);
                const dataList = result?.data?.list || [];

                for (let entry of dataList) {
                    const itemList = Array.isArray(entry) ? entry : [entry];
                    for (let item of itemList) {
                        const tradeId = item.tradeId;
                        if (tradeId && !seenTradeIds.has(tradeId)) {
                            seenTradeIds.add(tradeId);
                            items.push(item);
                        }
                    }
                }
            }

            updateStatus(`共采集 ${items.length} 条记录,正在处理...`, dialog);

            // 处理数据
            const allRows = [];
            const seenKeys = new Set();

            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                updateStatus(`处理进度: ${i + 1}/${items.length}`, dialog);

                const row = {};
                const secTradeId = item.secTradeId || '';

                // 采集产品信息
                const productInfo = item.productInfo;
                if (Array.isArray(productInfo) && productInfo.length > 0) {
                    const p = productInfo[0];
                    row.productId = p.productId || p.id || '';
                    row.productName = p.productName || '';
                    row.imageUrl = p.imageUrl || '';
                    row.url = p.url || '';
                }

                // 采集主字段
                for (let field of FIELD_WHITELIST) {
                    if (!row[field]) {
                        row[field] = item[field] || '';
                    }
                }

                // 获取summary字段
                const summaryFields = await fetchQuerySummaryFields(secTradeId, tokens);
                for (let k of ['name']) {
                    if (!row[k]) {
                        row[k] = summaryFields[k] || '';
                    }
                }

                // 获取客户详细信息
                const accountIdEncrypt = await fetchAccountIdEncrypt(secTradeId, tokens);
                const khtToken = await fetchKHTAccessToken(row.tradeId);
                const customerInfo = await fetchCustomerInfo(accountIdEncrypt, secTradeId, khtToken, tokens);

                const dataInfo = customerInfo.data || {};
                const alicrmInfo = dataInfo.alicrmCustomerInfo || {};
                const buyerInfo = dataInfo.buyerInfo || {};
                const buyerContact = buyerInfo.buyerContactInfo || {};

                // 字段映射
                const fieldMap = {
                    ownerName: () => getNested(alicrmInfo, 'ownerName'),
                    email: () => getNested(buyerContact, 'email') || getNested(alicrmInfo, 'email'),
                    mobileNumber: () => getNested(buyerContact, 'mobileNumber') || getNested(alicrmInfo, 'mobileNumber'),
                    phoneNumber: () => getNested(buyerContact, 'phoneNumber') || getNested(alicrmInfo, 'phoneNumber'),
                    companyName: () => getNested(buyerInfo, 'companyName') || getNested(alicrmInfo, 'companyName'),
                    companyWebSite: () => getNested(buyerInfo, 'companyWebSite') || getNested(alicrmInfo, 'companyWebSite'),
                    noteCode: () => getNested(alicrmInfo, 'noteCode'),
                    country: () => getNested(buyerInfo, 'country'),
                    levelTag: () => getNested(buyerInfo, 'levelTag'),
                    registerDate: () => getNested(buyerInfo, 'registerDate'),
                    productViewCount: () => getNested(buyerInfo, 'productViewCount'),
                    validInquiryCount: () => getNested(buyerInfo, 'validInquiryCount'),
                    repliedInquiryCount: () => getNested(buyerInfo, 'repliedInquiryCount'),
                    validRfqCount: () => getNested(buyerInfo, 'validRfqCount'),
                    loginDays: () => getNested(buyerInfo, 'loginDays'),
                    spamInquiryMarkedBySupplierCount: () => getNested(buyerInfo, 'spamInquiryMarkedBySupplierCount'),
                    addedToBlacklistCount: () => getNested(buyerInfo, 'addedToBlacklistCount'),
                    totalOrderCount: () => getNested(buyerInfo, 'totalOrderCount'),
                    totalOrderVolume: () => getNested(buyerInfo, 'totalOrderVolume'),
                    tradeSupplierCount: () => getNested(buyerInfo, 'tradeSupplierCount'),
                    highQualityLevelTag: () => getNested(buyerInfo, 'highQualityLevelTag'),
                    preferredIndustries: () => getNested(buyerInfo, 'preferredIndustries')
                };

                for (let field of FIELD_WHITELIST) {
                    if (fieldMap[field] && !row[field]) {
                        row[field] = fieldMap[field]() || row[field] || '';
                    }
                }

                // 格式化时间字段
                for (let tsField of ['createTime', 'lastestReplyTime', 'readTime']) {
                    if (row[tsField]) {
                        row[tsField] = formatTimestamp(row[tsField]);
                    }
                }

                if (row.registerDate) {
                    row.registerDate = formatDate(row.registerDate);
                }

                // 替换-1为'客户隐藏'
                for (let k in row) {
                    if (row[k] === -1 || row[k] === '-1') {
                        row[k] = '客户隐藏';
                    }
                }

                // 去重
                const key = `${row.name}|${row.registerDate}|${row.companyName}`;
                if (!seenKeys.has(key)) {
                    seenKeys.add(key);
                    allRows.push(row);
                }
            }

            updateStatus(`正在导出Excel...`, dialog);

            // 导出Excel
            const ws_data = [FIELD_WHITELIST.map(k => FIELD_CHINESE_MAP[k])];
            for (let row of allRows) {
                const rowData = FIELD_WHITELIST.map(k => {
                    let v = row[k] || '';
                    if (Array.isArray(v)) v = v.join(', ');
                    return v;
                });
                ws_data.push(rowData);
            }

            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.aoa_to_sheet(ws_data);
            XLSX.utils.book_append_sheet(wb, ws, '询盘明细');

            // 使用更兼容的方式导出Excel文件
            const wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: false, type: 'array' });
            const blob = new Blob([wbout], { type: 'application/octet-stream' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
            a.download = `询盘明细_${date}.xlsx`;
            a.click();
            window.URL.revokeObjectURL(url);

            updateStatus(`✅ 导出完成!共 ${allRows.length} 条数据`, dialog);
            showMessage(`导出完成!共 ${allRows.length} 条数据`, 'success');

        } catch (error) {
            console.error('采集过程出错:', error);
            updateStatus(`❌ 采集失败: ${error.message}`, dialog);
            showMessage(`采集失败: ${error.message}`, 'error');
        } finally {
            isCollecting = false;
            if (startBtn) {
                startBtn.disabled = false;
                startBtn.style.opacity = '1';
                startBtn.style.cursor = 'pointer';
            }
        }
    }

    // 添加启动按钮
    function addButton() {
        // 等待页面元素加载完成
        const interval = setInterval(() => {
            const replyInfoTitle = document.querySelector('.reply-info-title');
            if (replyInfoTitle) {
                clearInterval(interval);

                // 创建导出按钮
                const btn = document.createElement('button');
                btn.id = 'inquiry-export-btn';
                btn.textContent = '📊 采集询盘数据';
                btn.style.cssText = `
                    margin-left: 10px;
                    padding: 4px 12px;
                    background: #ff6a00;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: all 0.3s;
                    vertical-align: middle;
                `;
                btn.onmouseover = () => btn.style.background = '#e65a00';
                btn.onmouseout = () => btn.style.background = '#ff6a00';
                btn.onclick = showSettingsDialog;

                // 将按钮添加到"接待数据"标题后面
                replyInfoTitle.appendChild(btn);
            }
        }, 1000); // 每秒检查一次元素是否加载完成
    }

    // 页面加载完成后添加按钮
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addButton);
    } else {
        addButton();
    }

})();