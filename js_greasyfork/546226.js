// ==UserScript==
// @name         阿里巴巴国际站询盘数据导出工具
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  更新了买家最近搜索词和询价产品的图片,采集阿里巴巴询盘数据并导出为Excel
// @author       You
// @license      MPL
// @match        https://message.alibaba.com/message/default.htm*
// @grant        GM.xmlHttpRequest
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @connect      message.alibaba.com
// @connect      alicrm.alibaba.com
// @require      https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js
// @downloadURL https://update.greasyfork.org/scripts/546226/%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E5%9B%BD%E9%99%85%E7%AB%99%E8%AF%A2%E7%9B%98%E6%95%B0%E6%8D%AE%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/546226/%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E5%9B%BD%E9%99%85%E7%AB%99%E8%AF%A2%E7%9B%98%E6%95%B0%E6%8D%AE%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // 配置常量
    const FIELD_WHITELIST = [
        "name", "highQualityLevelTag", "levelTag", "appFrom", "feedbackType", "source",
        "subject", "tradeId", "createTime", "lastestReplyTime", "readTime", "productId",
        "productName", "imageUrl", "url", "ownerName", "registerDate",
        "country", "companyName", "companyWebSite", "email", "mobileNumber", "phoneNumber",
        "preferredIndustries", "productViewCount", "validInquiryCount", "repliedInquiryCount",
        "validRfqCount", "loginDays", "spamInquiryMarkedBySupplierCount", "addedToBlacklistCount",
        "totalOrderCount", "totalOrderVolume", "tradeSupplierCount", "searchWords", "latestInquiryProducts"
    ];
 
    const FIELD_CHINESE_MAP = {
        "appFrom": "询盘来源终端", "name": "客户名", "productId": "询盘产品ID",
        "productName": "询盘产品标题", "imageUrl": "询盘产品图片", "url": "询盘产品链接",
        "feedbackType": "询盘类型", "createTime": "创建时间", "lastestReplyTime": "最新回复时间",
        "readTime": "读取时间", "source": "询盘来源", "subject": "询盘标题", "tradeId": "询盘ID",
        "ownerName": "业务员", "country": "国家/地区", "levelTag": "买家类型标签",
        "registerDate": "注册日期", "companyName": "公司名称", "companyWebSite": "公司网站",
        "productViewCount": "产品浏览数", "validInquiryCount": "有效询价数", "repliedInquiryCount": "回复询价数量",
        "validRfqCount": "有效RFQ数", "loginDays": "登录天数", "spamInquiryMarkedBySupplierCount": "垃圾询盘数",
        "addedToBlacklistCount": "被加为黑名单数", "totalOrderCount": "订单总数", "totalOrderVolume": "订单总金额",
        "tradeSupplierCount": "交易供应商数", "highQualityLevelTag": "买家等级标签", "email": "邮箱",
        "mobileNumber": "手机号码", "phoneNumber": "电话号码", "preferredIndustries": "最常采购行业",
        "searchWords": "最近搜索词", "latestInquiryProducts": "最新询价产品"
    };
 
    // 全局变量
    let allRows = [];
    let currentPage = 1;
    let isCollecting = false;
    let totalCollected = 0;
 
    // 工具函数
    function getCookie(name) {
        let pattern = new RegExp(name + "=([^;]*)");
        let matches = document.cookie.match(pattern);
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }
 
    function getPageVarByRegex(regex) {
        const html = document.documentElement.innerHTML;
        const match = html.match(regex);
        return match ? match[1] : '';
    }
 
    function getNested(data, ...keys) {
        for (const key of keys) {
            if (data === null || data === undefined) {
                return "";
            }
            data = data[key];
        }
        return data !== null && data !== undefined ? data : "";
    }
 
    function formatTimestamp(ts) {
        try {
            ts = parseInt(ts);
            if (ts > 1e12) {
                ts = Math.floor(ts / 1000);
            }
            return new Date(ts * 1000).toLocaleString('zh-CN');
        } catch (e) {
            return ts;
        }
    }
 
    function formatDate(ts) {
        try {
            ts = parseInt(ts);
            return new Date(ts * 1000).toISOString().split('T')[0];
        } catch (e) {
            return ts;
        }
    }
 
    function replaceHiddenValue(value) {
        if (value === -1 || value === "-1") {
            return "客户隐藏";
        }
        return value;
    }
 
    // 修正 ctoken 获取方式
    function getCtoken() {
        let xman_us_t = getCookie('xman_us_t');
        if (xman_us_t) {
            let match = xman_us_t.match(/ctoken=([^&;]+)/);
            if (match) return match[1];
        }
        return undefined;
    }
 
    // 临时写死 dmtrack_pageid
    function getDmtrackPageId() {
        return '6797ac2f2102fbdd1750902252'; // 用你抓包时的值
    }
 
    // API请求函数
    async function fetchPage(page) {
        console.log(`正在请求第 ${page} 页数据...`);
 
        // 动态获取 ctoken 和 dmtrack_pageid
        const ctoken = getCtoken();
        const dmtrack_pageid = getDmtrackPageId();
        console.log('ctoken:', ctoken);
        console.log('dmtrack_pageid:', dmtrack_pageid);
 
        const postId = getPageVarByRegex(/postId["']?\s*[:=]\s*["']([^"']+)/) || '';
 
        const params = {
            ctoken: ctoken,
            dmtrack_pageid: dmtrack_pageid,
        };
 
        const paramsJson = {
            system: "feedback",
            listType: "all",
            pageSize: "100",
            pagination: { nextPage: page, pageSize: "100" },
            filter: { isShowAtm: false },
            order: { order: "desc", orderBy: "latest_contact_time" },
            search: {}
        };
 
        // 拼接URL参数
        const url = `https://message.alibaba.com/message/ajax/feedback/subjectList.htm?ctoken=${encodeURIComponent(params.ctoken)}&dmtrack_pageid=${encodeURIComponent(params.dmtrack_pageid)}`;
 
        const data = {
            _csrf_token_: getCookie('_csrf_token_'),
            postId: postId,
            params: JSON.stringify(paramsJson)
        };
 
        try {
            const response = await new Promise((resolve, reject) => {
                GM.xmlHttpRequest({
                    method: 'POST',
                    url: url,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'X-Requested-With': 'XMLHttpRequest',
                        'Referer': 'https://message.alibaba.com/message/default.htm',
                        'Origin': 'https://message.alibaba.com',
                        'X-XSRF-TOKEN': getCookie('XSRF-TOKEN')
                    },
                    data: new URLSearchParams(data).toString(),
                    responseType: 'text',
                    onload: resolve,
                    onerror: reject
                });
            });
 
            console.log('接口原始返回内容:', response);
            let parsedData;
            try {
                parsedData = JSON.parse(response.responseText);
            } catch (e) {
                parsedData = {};
            }
            console.log('接口JSON解析后:', parsedData);
            console.log(`第 ${page} 页数据请求成功`);
            return parsedData;
        } catch (e) {
            console.error(`请求第 ${page} 页数据失败:`, e);
            return {};
        }
    }
 
    async function fetchAccountIdEncrypt(secTradeId) {
        if (!secTradeId) return "";
 
        const data = {
            _csrf_token_: getCookie('_csrf_token_'),
            params: JSON.stringify({ secTradeId: secTradeId }),
        };
 
        try {
            const response = await new Promise((resolve, reject) => {
                GM.xmlHttpRequest({
                    method: 'POST',
                    url: 'https://message.alibaba.com/message/ajax/feedback/querySummary.htm',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'X-Requested-With': 'XMLHttpRequest',
                        'Referer': 'https://message.alibaba.com/message/default.htm',
                        'Origin': 'https://message.alibaba.com',
                        'X-XSRF-TOKEN': getCookie('XSRF-TOKEN')
                    },
                    data: new URLSearchParams(data).toString(),
                    responseType: 'text',
                    onload: resolve,
                    onerror: reject
                });
            });
            let parsedData;
            try {
                parsedData = JSON.parse(response.responseText);
            } catch (e) {
                parsedData = {};
            }
            return parsedData?.data?.contact?.accountIdEncrypt || "";
        } catch (e) {
            console.error(`获取 accountIdEncrypt 失败:`, e);
            return "";
        }
    }
 
    async function fetchKhtAccessToken(tradeId) {
        if (!tradeId) return "";
 
        try {
            const response = await new Promise((resolve, reject) => {
                GM.xmlHttpRequest({
                    method: 'GET',
                    url: `https://message.alibaba.com/message/maDetail.htm?imInquiryId=${tradeId}&hash=`,
                    responseType: 'text',
                    onload: resolve,
                    onerror: reject
                });
            });
            const html = response.responseText;
            const match = html.match(/window\.KHTAccessToken\s*=\s*['"]([^'"]+)['"]/);
            if (match) {
                return match[1];
            } else {
                console.log(`未找到KHTAccessToken, tradeId=${tradeId}`);
                return "";
            }
        } catch (e) {
            console.error(`获取KHTAccessToken失败:`, e);
            return "";
        }
    }
 
    async function fetchQuerySummaryFields(secTradeId) {
        if (!secTradeId) return {};
 
        const data = {
            _csrf_token_: getCookie('_csrf_token_'),
            params: JSON.stringify({ secTradeId: secTradeId }),
        };
 
        try {
            const response = await new Promise((resolve, reject) => {
                GM.xmlHttpRequest({
                    method: 'POST',
                    url: 'https://message.alibaba.com/message/ajax/feedback/querySummary.htm',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'X-Requested-With': 'XMLHttpRequest',
                        'Referer': 'https://message.alibaba.com/message/default.htm',
                        'Origin': 'https://message.alibaba.com',
                        'X-XSRF-TOKEN': getCookie('XSRF-TOKEN')
                    },
                    data: new URLSearchParams(data).toString(),
                    responseType: 'text',
                    onload: resolve,
                    onerror: reject
                });
            });
            let parsedData;
            try {
                parsedData = JSON.parse(response.responseText);
            } catch (e) {
                parsedData = {};
            }
            const contact = parsedData?.data?.contact || {};
            return {
                name: contact.name || "",
                productId: contact.productId || "",
                productName: contact.productName || "",
                imageUrl: contact.imageUrl || "",
                url: contact.url || ""
            };
        } catch (e) {
            console.error(`获取querySummary字段失败:`, e);
            return {};
        }
    }
 
    function buildCustomerInfoLink(accountIdEncrypt, secTradeId, khtAccessToken) {
        const params = {
            buyerAccountId: accountIdEncrypt,
            secTradeId: secTradeId,
            buyerLoginId: '',
            secReqToken: khtAccessToken,
            clientType: '',
            ctoken: getCtoken(),
            _tb_token_: getCookie('_tb_token_'),
            callback: '',
        };
 
        const baseUrl = 'https://alicrm.alibaba.com/jsonp/customerPluginQueryServiceI/queryCustomerInfo.json';
        const urlParams = new URLSearchParams(params);
        return `${baseUrl}?${urlParams.toString()}`;
    }
 
    async function fetchCustomerInfo(customerInfoUrl) {
        try {
            const response = await new Promise((resolve, reject) => {
                GM.xmlHttpRequest({
                    method: 'GET',
                    url: customerInfoUrl,
                    responseType: 'text',
                    onload: resolve,
                    onerror: reject
                });
            });
            const text = response.responseText;
            const jsonStr = text.replace(/^\w+\((.*)\)$/, '$1');
            const data = JSON.parse(jsonStr);
            return data?.data || {};
        } catch (e) {
            console.error(`获取客户信息失败:`, e);
            return {};
        }
    }
 
    // 数据处理函数
    async function processItem(item, index, total) {
        console.log(`处理第 ${index + 1}/${total} 条记录...`);
 
        const row = {};
        const secTradeId = item.secTradeId || "";
 
        // 从item主字段采集
        for (const field of FIELD_WHITELIST) {
            row[field] = item[field] || "";
        }
 
        // 采集 productInfo 里的产品信息（覆盖主字段）
        if (Array.isArray(item.productInfo) && item.productInfo.length > 0) {
            const p = item.productInfo[0];
            row.productId = p.productId || p.id || "";
            row.productName = p.productName || "";
            row.imageUrl = p.imageUrl || "";
            row.url = p.url || "";
        }
 
        // 采集querySummary接口的字段（不再覆盖产品相关字段）
        const summaryFields = await fetchQuerySummaryFields(secTradeId);
        for (const k of ["name"]) {
            row[k] = summaryFields[k] || row[k] || "";
        }
        // 其它 summary 字段如需采集可补充，但不要覆盖 productId/productName/imageUrl/url
 
        row.accountIdEncrypt = await fetchAccountIdEncrypt(secTradeId);
        const tradeId = row.tradeId || "";
        row.KHTAccessToken = await fetchKhtAccessToken(tradeId);
        row.customer_info_link = buildCustomerInfoLink(
            row.accountIdEncrypt, row.secTradeId || "", row.KHTAccessToken
        );
 
        const customerInfo = await fetchCustomerInfo(row.customer_info_link);
        const dataInfo = customerInfo.data || {};
        const alicrmInfo = dataInfo.alicrmCustomerInfo || {};
        const buyerInfo = dataInfo.buyerInfo || {};
        const buyerContact = buyerInfo.buyerContactInfo || {};
        const shopBehavior = buyerInfo.buyerShopBehaviorInfo || {};
 
        // 字段采集映射
        const fieldMap = {
            ownerName: (a, b, c, s) => getNested(a, "ownerName"),
            email: (a, b, c, s) => getNested(c, "email") || getNested(a, "email"),
            mobileNumber: (a, b, c, s) => getNested(c, "mobileNumber") || getNested(a, "mobileNumber"),
            phoneNumber: (a, b, c, s) => getNested(c, "phoneNumber") || getNested(a, "phoneNumber"),
            companyName: (a, b, c, s) => getNested(b, "companyName") || getNested(a, "companyName"),
            companyWebSite: (a, b, c, s) => getNested(b, "companyWebSite") || getNested(a, "companyWebSite"),
            customerGroup: (a, b, c, s) => getNested(a, "customerGroup"),
            contractId: (a, b, c, s) => getNested(a, "contractId"),
            noteCode: (a, b, c, s) => getNested(a, "noteCode"),
            country: (a, b, c, s) => getNested(b, "country"),
            levelTag: (a, b, c, s) => getNested(b, "levelTag"),
            registerDate: (a, b, c, s) => getNested(b, "registerDate"),
            productViewCount: (a, b, c, s) => getNested(b, "productViewCount"),
            validInquiryCount: (a, b, c, s) => getNested(b, "validInquiryCount"),
            repliedInquiryCount: (a, b, c, s) => getNested(b, "repliedInquiryCount"),
            validRfqCount: (a, b, c, s) => getNested(b, "validRfqCount"),
            loginDays: (a, b, c, s) => getNested(b, "loginDays"),
            spamInquiryMarkedBySupplierCount: (a, b, c, s) => getNested(b, "spamInquiryMarkedBySupplierCount"),
            addedToBlacklistCount: (a, b, c, s) => getNested(b, "addedToBlacklistCount"),
            totalOrderCount: (a, b, c, s) => getNested(b, "totalOrderCount"),
            totalOrderVolume: (a, b, c, s) => getNested(b, "totalOrderVolume"),
            tradeSupplierCount: (a, b, c, s) => getNested(b, "tradeSupplierCount"),
            isGoldenBuyer: (a, b, c, s) => getNested(b, "isGoldenBuyer"),
            highQualityLevelTag: (a, b, c, s) => getNested(b, "highQualityLevelTag"),
            visible: (a, b, c, s) => getNested(c, "visible"),
            applyStatus: (a, b, c, s) => getNested(c, "applyStatus"),
            searchWords: (a, b, c, s) => getNested(b, "searchWords"),
            lastestRfqList: (a, b, c, s) => getNested(b, "lastestRfqList"),
            latestInquiryProducts: (a, b, c, s) => getNested(b, "latestInquiryProducts"),
            productId: (a, b, c, s) => getNested(s, "productId"),
            productName: (a, b, c, s) => getNested(s, "productName"),
            url: (a, b, c, s) => getNested(s, "url"),
            preferredIndustries: (a, b, c, s) => getNested(b, "preferredIndustries"),
            imageUrl: (a, b, c, s) => getNested(s, "imageUrl"),
        };
 
        for (const field of FIELD_WHITELIST) {
            if (fieldMap[field]) {
                row[field] = fieldMap[field](alicrmInfo, buyerInfo, buyerContact, shopBehavior) || row[field] || "";
            }
        }
 
        // 时间戳字段格式化
        for (const tsField of ["createTime", "lastestReplyTime", "readTime"]) {
            if (row[tsField]) {
                row[tsField] = formatTimestamp(row[tsField]);
            }
        }
 
        // 注册日期格式化
        if (row.registerDate) {
            row.registerDate = formatDate(row.registerDate);
        }
 
        // 替换所有-1为'客户隐藏'
        for (const k in row) {
            row[k] = replaceHiddenValue(row[k]);
        }
 
        return row;
    }
 
    // 导出CSV函数
    function exportToCSV(data, filename) {
        const headers = FIELD_WHITELIST.map(field => FIELD_CHINESE_MAP[field]);
        const csvContent = [
            headers.join(','),
            ...data.map(row =>
                FIELD_WHITELIST.map(field => {
                    const value = row[field] || "";
                    // 处理包含逗号、引号或换行符的值
                    if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
                        return `"${value.replace(/"/g, '""')}"`;
                    }
                    return value;
                }).join(',')
            )
        ].join('\n');
 
        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
    }
 
    // 导出XLSX函数
    function exportToXLSX(data, filename) {
        const headers = FIELD_WHITELIST.map(field => FIELD_CHINESE_MAP[field]);
        const rows = data.map(row => FIELD_WHITELIST.map(field => row[field] || ""));
        const worksheetData = [headers, ...rows];
        const ws = XLSX.utils.aoa_to_sheet(worksheetData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: "application/octet-stream" });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
    }
 
    // 并发处理工具
    async function asyncPool(poolLimit, array, iteratorFn) {
        const ret = [];
        const executing = [];
        for (let i = 0; i < array.length; i++) {
            const p = Promise.resolve().then(() => iteratorFn(array[i], i));
            ret.push(p);
            if (poolLimit <= array.length) {
                const e = p.then(() => executing.splice(executing.indexOf(e), 1));
                executing.push(e);
                if (executing.length >= poolLimit) {
                    await Promise.race(executing);
                }
            }
        }
        return Promise.all(ret);
    }
 
    // 悬浮导出按钮
    function createExportButton() {
        const btn = document.createElement('button');
        btn.id = 'inquiry-export-float-btn';
        btn.textContent = '导出询盘明细';
        btn.style.cssText = `
            background: #007bff;
            color: #fff;
            border: none;
            border-radius: 6px;
            padding: 6px 14px;
            font-size: 14px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            cursor: pointer;
            margin-left: 12px;
        `;
        btn.onclick = showExportDialog;
        // 插入到 reply-info-title 的 options 区域后面
        const replyInfoTitle = document.querySelector('.reply-info-title');
        if (replyInfoTitle) {
            // 找到 options 区域
            const optionsDiv = replyInfoTitle.querySelector('.options');
            if (optionsDiv) {
                optionsDiv.parentNode.insertBefore(btn, optionsDiv.nextSibling);
            } else {
                replyInfoTitle.appendChild(btn);
            }
        } else {
            document.body.appendChild(btn);
        }
    }
 
    // 选择页码弹窗
    async function showExportDialog() {
        if (document.getElementById('inquiry-export-dialog')) return;
 
        // 1. 优先从页面获取用户数量
        let totalCount = 0;
        let totalPages = 1;
        let pageSize = 100;
        let statusText = '正在获取总页数...';
 
        const infoDiv = document.querySelector('.op-search-result-info');
        if (infoDiv) {
            const match = infoDiv.textContent.match(/(\d+)/);
            if (match) {
                totalCount = parseInt(match[1], 10);
                totalPages = Math.ceil(totalCount / pageSize);
                if (totalPages < 1) totalPages = 1;
                statusText = `共 ${totalCount} 条，约 ${totalPages} 页（基于页面显示）`;
            }
        }
 
        // 2. 如果页面没有，兜底用接口
        if (!totalCount) {
            try {
                const result = await fetchPage(1);
                totalCount = result?.data?.total || 0;
                pageSize = result?.data?.pageSize || 100;
                totalPages = Math.ceil(totalCount / pageSize);
                if (totalPages < 1) totalPages = 1;
                statusText = `共 ${totalCount} 条，约 ${totalPages} 页（基于接口）`;
            } catch (e) {
                statusText = '无法获取总页数';
            }
        }
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
            min-width: 320px;
            font-family: Arial, sans-serif;
        `;
        dialog.innerHTML = `
            <div style="font-size:18px;font-weight:bold;margin-bottom:16px;">导出询盘明细</div>
            <div style="margin-bottom:12px;">
                <label>采集页码（起始）：<input id="export-page-start" type="number" value="1" min="1" style="width:60px;"></label>
            </div>
            <div style="margin-bottom:12px;">
                <label>采集页数：<input id="export-page-count" type="number" value="1" min="1" max="${totalPages}" style="width:60px;"></label>
                <span style="color:#888;font-size:12px;margin-left:8px;">最大可采集页码数为 ${totalPages}</span>
            </div>
            <div style="margin-bottom:18px;">
                <span id="inquiry-export-status" style="font-size:12px;color:#666;">${statusText}</span>
            </div>
            <button id="start-export-btn" style="background:#007bff;color:#fff;border:none;padding:8px 20px;border-radius:4px;cursor:pointer;font-size:15px;">开始采集</button>
            <button id="close-export-btn" style="background:#6c757d;color:#fff;border:none;padding:6px 16px;border-radius:4px;cursor:pointer;font-size:13px;margin-left:12px;">关闭</button>
        `;
        document.body.appendChild(dialog);
        document.getElementById('close-export-btn').onclick = () => dialog.remove();
        document.getElementById('start-export-btn').onclick = () => {
            const startPage = parseInt(document.getElementById('export-page-start').value, 10) || 1;
            let pageCount = parseInt(document.getElementById('export-page-count').value, 10) || 1;
            if (pageCount > totalPages) pageCount = totalPages;
            startCollectionWithPages(startPage, pageCount, totalPages, dialog);
        };
    }
 
    // 多页采集主函数，增加 totalPages 和 dialog 参数用于进度显示
    async function startCollectionWithPages(startPage, pageCount, totalPages, dialog) {
        if (isCollecting) {
            alert('正在采集中，请稍候...');
            return;
        }
        isCollecting = true;
        allRows = [];
        totalCollected = 0;
        updateStatus('开始采集数据...', dialog);
        try {
            for (let currentPage = startPage; currentPage < startPage + pageCount; currentPage++) {
                const result = await fetchPage(currentPage);
                const dataList = result?.data?.list || [];
                const items = [];
                for (const sublist of dataList) items.push(...sublist);
                updateStatus(`正在采集第 ${currentPage - startPage + 1}/${pageCount} 页（全站约 ${totalPages} 页），共 ${items.length} 条`, dialog);
                if (items.length > 0) {
                    await asyncPool(25, items, async (item, i) => {
                        updateStatus(`正在采集第 ${currentPage - startPage + 1}/${pageCount} 页（全站约 ${totalPages} 页），第 ${i + 1}/${items.length} 条`, dialog);
                        const row = await processItem(item, i, items.length);
                        allRows.push(row);
                        totalCollected++;
                    });
                }
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            updateStatus(`采集完成，共 ${allRows.length} 条记录，正在导出...`, dialog);
            for (const row of allRows) {
                if (Array.isArray(row.preferredIndustries)) {
                    row.preferredIndustries = row.preferredIndustries.join(', ');
                }
                if (Array.isArray(row.searchWords)) {
                    row.searchWords = row.searchWords.join(', ');
                }
                if (Array.isArray(row.latestInquiryProducts)) {
                    row.latestInquiryProducts = row.latestInquiryProducts.join(', ');
                }
            }
            const uniqueMap = new Map();
            for (const row of allRows) {
                const key = `${row.name}||${row.country}||${row.registerDate}`;
                if (!uniqueMap.has(key)) {
                    uniqueMap.set(key, row);
                }
            }
            const uniqueRows = Array.from(uniqueMap.values());
            uniqueRows.sort((a, b) => Number(b.createTime) - Number(a.createTime));
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
            const filename = `询盘明细_${timestamp}.xlsx`;
            exportToXLSX(uniqueRows, filename);
            updateStatus(`导出完成！文件名: ${filename}，共 ${uniqueRows.length} 条记录`, dialog);
        } catch (error) {
            console.error('采集过程中出错:', error);
            updateStatus(`采集出错: ${error.message}`, dialog);
        } finally {
            isCollecting = false;
        }
    }
 
    // updateStatus 支持传递 dialog
    function updateStatus(message, dialog) {
        let statusElement = document.getElementById('inquiry-export-status');
        if (!statusElement && dialog) {
            statusElement = dialog.querySelector('#inquiry-export-status');
        }
        if (statusElement) {
            statusElement.textContent = message;
        }
        console.log(message);
    }
 
    // 初始化
    function init() {
        // 只显示悬浮按钮
        createExportButton();
    }
 
    // 启动脚本
    init();
})();