// ==UserScript==
// @name         阿里巴巴国际站客户信息导出--树洞先生
// @namespace    http://tampermonkey.net/
// @version      1.8
// @license      MIT
// @description  更新加入了公海客户和我的客户支持筛选导出并对客户行为字段进行爬取，"产品浏览数", "有效询盘数", "有效RFQ数", "登录天数", "垃圾询盘数", "被加为黑名单数", "订单总数", "订单总金额", "交易供应商数", "最近搜索词", "最常采购行业", "最近询盘产品链接"
// @author       树洞先生
// @match        https://alicrm.alibaba.com/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js
// @downloadURL https://update.greasyfork.org/scripts/540072/%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E5%9B%BD%E9%99%85%E7%AB%99%E5%AE%A2%E6%88%B7%E4%BF%A1%E6%81%AF%E5%AF%BC%E5%87%BA--%E6%A0%91%E6%B4%9E%E5%85%88%E7%94%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/540072/%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E5%9B%BD%E9%99%85%E7%AB%99%E5%AE%A2%E6%88%B7%E4%BF%A1%E6%81%AF%E5%AF%BC%E5%87%BA--%E6%A0%91%E6%B4%9E%E5%85%88%E7%94%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 字段映射
    const fields = [
        "客户姓名", "旺旺ID", "业务员", "来源", "性别", "客户国家", "客户等级", "职位",
        "头像", "客户名片链接", "邮箱", "手机号码", "座机号码", "社交账号", "建档时间", "注册时间",
        "年采购额", "公司名称", "公司部门", "公司网址", "公司地址",
        // 行为字段
        "产品浏览数", "有效询盘数", "有效RFQ数", "登录天数", "垃圾询盘数", "被加为黑名单数", "订单总数", "订单总金额", "交易供应商数", "最近搜索词", "最常采购行业", "最近询盘产品链接"
    ];

    // 英文与中文字段映射
    const behaviorFieldMap = {
        productViewCount: "产品浏览数",
        validInquiryCount: "有效询盘数",
        validRfqCount: "有效RFQ数",
        loginDays: "登录天数",
        spamInquiryMarkedBySupplierCount: "垃圾询盘数",
        addedToBlacklistCount: "被加为黑名单数",
        totalOrderCount: "订单总数",
        totalOrderVolume: "订单总金额",
        tradeSupplierCount: "交易供应商数",
        searchWords: "最近搜索词",
        preferredIndustries: "最常采购行业",
        latestInquiryProducts: "最近询盘产品链接"
    };

    // 判断是否为公海客户页面
    function isPublicCustomerPage() {
        // 直接根据URL hash判断
        return location.hash === '#public-customer';
    }

    // 采集公海客户ID（分页采集，支持筛选参数）
    async function getPublicCustomerIds(_tb_token_, progressCb) {
        let customerIds = [];
        let pageNum = 1;
        const filterParams = getCurrentFilterParams(); // 获取筛选参数
        const pageSize = 10;
        let total = 0;
        while (true) {
            const body = {
                jsonArray: filterParams.jsonArray || '[]',
                orderDescs: [{col: 'opp_gmt_modified', asc: false}],
                pageNum: pageNum,
                pageSize: pageSize
            };
            const resp = await fetch('https://alicrm.alibaba.com/eggCrmQn/crm/customerQueryServiceI/queryPublicCustomerList.json?_tb_token_=' + encodeURIComponent(_tb_token_), {
                method: 'POST',
                headers: {
                    'content-type': 'application/json;charset=UTF-8',
                    'accept': '*/*'
                },
                credentials: 'include',
                body: JSON.stringify(body)
            });
            const data = await resp.json();
            if (pageNum === 1) {
                total = data?.data?.total || 0;
            }
            const customers = data?.data?.data || [];
            if (!customers.length) break;
            for (const c of customers) {
                if (c.customerId) customerIds.push(c.customerId);
            }
            if (progressCb) progressCb(pageNum, customerIds.length, total);
            if (customerIds.length >= total) break;
            pageNum++;
            await new Promise(r => setTimeout(r, 300));
        }
        return customerIds;
    }

    // 获取cookie
    function getCookie(name) {
        const value = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
        return value ? value.pop() : '';
    }

    // --- 自动捕获最新筛选参数 ---
    let lastJsonArray = null;
    window._lastJsonArray = lastJsonArray;
    if (typeof unsafeWindow !== 'undefined') {
        unsafeWindow._lastJsonArray = lastJsonArray;
    }
    (function() {
        const oldFetch = window.fetch;
        window.fetch = function(input, init) {
            if (typeof input === 'string' && (input.includes('queryCustomerList.json') || input.includes('queryPublicCustomerList.json')) && init && init.body) {
                try {
                    const body = JSON.parse(init.body);
                    if (body.jsonArray) {
                        lastJsonArray = body.jsonArray;
                        window._lastJsonArray = lastJsonArray;
                        if (typeof unsafeWindow !== 'undefined') {
                            unsafeWindow._lastJsonArray = lastJsonArray;
                        }
                    }
                } catch (e) {}
            }
            return oldFetch.apply(this, arguments);
        };
    })();

    // 获取当前页面筛选参数（如有特殊参数可补充）
    function getCurrentFilterParams() {
        if (lastJsonArray) {
            return { jsonArray: lastJsonArray };
        }
        // fallback: 可选，返回空或默认
        return {};
    }

    // 采集所有筛选结果的客户ID（分页采集）
    async function getFilteredCustomerIds(_tb_token_, progressCb) {
        let customerIds = [];
        let pageNum = 1;
        const filterParams = getCurrentFilterParams();
        const pageSize = 10; // 和页面一致
        let total = 0;
        while (true) {
            const body = {
                jsonArray: filterParams.jsonArray || '[]',
                orderDescs: [{col: 'opp_gmt_modified', asc: false}],
                pageNum: pageNum,
                pageSize: pageSize
            };
            const resp = await fetch('https://alicrm.alibaba.com/eggCrmQn/crm/customerQueryServiceI/queryCustomerList.json?_tb_token_=' + encodeURIComponent(_tb_token_), {
                method: 'POST',
                headers: {
                    'content-type': 'application/json;charset=UTF-8',
                    'accept': '*/*'
                },
                credentials: 'include',
                body: JSON.stringify(body)
            });
            const data = await resp.json();
            if (pageNum === 1) {
                total = data?.data?.total || 0;
            }
            const customers = data?.data?.data || [];
            if (!customers.length) break;
            for (const c of customers) {
                if (c.customerId) customerIds.push(c.customerId);
            }
            if (progressCb) progressCb(pageNum, customerIds.length, total);
            if (customerIds.length >= total) break;
            pageNum++;
            await new Promise(r => setTimeout(r, 300));
        }
        return customerIds;
    }

    // 获取客户行为
    async function getCustomerBehavior(customerId, _tb_token_) {
        const url = `https://alicrm.alibaba.com/eggCrmQn/crm/customerQueryServiceI/queryCustomerBehavior.json?customerId=${customerId}&_tb_token_=${encodeURIComponent(_tb_token_)}`;
        const resp = await fetch(url, {
            method: 'GET',
            credentials: 'include'
        });
        const data = await resp.json();
        const behavior = data?.data?.data || {};
        // 处理映射和数组字段
        const result = {};
        for (const key in behaviorFieldMap) {
            let val = behavior[key];
            if (Array.isArray(val)) {
                if (key === "latestInquiryProducts") {
                    // 拼接图片和链接
                    val = val.map(item => item.productUrl).join(", ");
                } else {
                    val = val.join(", ");
                }
            }
            // 特殊处理-1为客户隐藏
            if (["totalOrderCount", "totalOrderVolume", "tradeSupplierCount"].includes(key) && val === -1) {
                val = "客户隐藏";
            }
            result[behaviorFieldMap[key]] = val !== undefined ? val : '';
        }
        return result;
    }

    // 获取客户详情
    async function getCustomerDetail(customerId, _tb_token_) {
        const url = `https://alicrm.alibaba.com/eggCrmQn/crm/customerQueryServiceI/queryCustomerAndContacts.json?customerId=${customerId}&_tb_token_=${encodeURIComponent(_tb_token_)}`;
        const resp = await fetch(url, {
            method: 'GET',
            credentials: 'include'
        });
        const data = await resp.json();
        const customer = data?.data?.customerDetailCO || {};
        const contacts = data?.data?.contactQueryCOList || [];
        const contact = contacts[0] || {};

        // growthLevel优先取联系人，没有再取客户
        const growthLevel = contact.growthLevel || (customer.growthLevelInfo?.growthLevel || "");

        // address优先取客户，没有再取联系人
        let address = customer.address || contact.address || "";
        if (typeof address === 'object' && address !== null) {
            address = ["country", "province", "city", "district", "street"].map(k => address[k] || "None").join(",");
        }

        // 合并姓名
        const name = [contact.firstName || "", contact.lastName || ""].join(" ").trim();

        // registerDate 字段处理
        let registerDate = "";
        if (customer.registerDate && /^\d+$/.test(customer.registerDate)) {
            registerDate = new Date(Number(customer.registerDate) * 1000).toISOString().slice(0,10);
        }

        function list2str(val) {
            if (Array.isArray(val)) {
                if (val.length && typeof val[0] === 'object') {
                    return val.map(item => ["countryCode", "areaCode", "number"].map(k => item[k] || "").join("-")).join(",");
                } else {
                    return val.join(",");
                }
            }
            return val || "";
        }

        // 字段映射
        const result = {
            "客户姓名": name,
            "旺旺ID": contact.loginId || "",
            "业务员": customer.oppModifier || "",
            "来源": customer.source || "",
            "性别": contact.gender || "",
            "客户国家": customer.country || "",
            "客户等级": growthLevel,
            "职位": contact.position || "",
            "头像": contact.avatar || "",
            "客户名片链接": contact.profileLink || "",
            "邮箱": list2str(contact.email),
            "手机号码": list2str(contact.mobiles),
            "座机号码": list2str(contact.phoneNumbers),
            "社交账号": list2str(contact.ims),
            "建档时间": customer.gmtCreate || "",
            "注册时间": registerDate,
            "年采购额": customer.annualProcurement || "",
            "公司名称": customer.companyName || "",
            "公司部门": contact.department || "",
            "公司网址": customer.website || "",
            "公司地址": address
        };
        // 合并行为数据
        const behavior = await getCustomerBehavior(customerId, _tb_token_);
        return {
            ...result,
            ...behavior
        };
    }

    // 导出为Excel
    function exportExcel(data, filename) {
        const ws = XLSX.utils.json_to_sheet(data, {header: fields});
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "客户信息");
        const wbout = XLSX.write(wb, {bookType:'xlsx', type:'array'});
        const blob = new Blob([wbout], {type: "application/octet-stream"});
        const url = URL.createObjectURL(blob);

        // 用 a 标签下载
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    }

    // 并发控制函数
    async function concurrentMap(inputs, limit, asyncFn, progressCb) {
        const results = [];
        let idx = 0;
        let running = 0;
        return new Promise((resolve, reject) => {
            function next() {
                if (idx >= inputs.length && running === 0) {
                    resolve(results);
                    return;
                }
                while (running < limit && idx < inputs.length) {
                    const curIdx = idx;
                    running++;
                    asyncFn(inputs[curIdx], curIdx)
                        .then(res => {
                            results[curIdx] = res;
                            if (progressCb) progressCb(curIdx + 1, inputs.length);
                        })
                        .catch(e => {
                            results[curIdx] = null;
                        })
                        .finally(() => {
                            running--;
                            next();
                        });
                    idx++;
                }
            }
            next();
        });
    }

    // 等待页面 loading 状态消失
    async function waitForLoadingToFinish() {
        let count = 0;
        while (document.querySelector('.loading-indicator, .next-loading, .ant-spin-spinning')) {
            if (count++ > 50) { // 最多等10秒
                console.log('loading 等待超时，强制继续');
                break;
            }
            await new Promise(r => setTimeout(r, 200));
        }
    }

    // 主入口
    async function run() {
        if (!confirm("是否开始导出客户信息？")) return;
        const _tb_token_ = getCookie('_tb_token_');
        if (!_tb_token_) {
            alert("未检测到 _tb_token_，请先登录并刷新页面！");
            return;
        }
        // 等待页面 loading 状态消失，确保筛选请求已完成
        await waitForLoadingToFinish();
        // 获取进度元素
        const progress = document.getElementById('exportCustomerProgress');
        if (progress) {
            progress.style.display = 'block';
            progress.textContent = `正在采集客户ID，请耐心等待...`;
        }
        // 采集客户ID（根据页面类型自动切换）
        let customerIds;
        if (isPublicCustomerPage()) {
            customerIds = await getPublicCustomerIds(_tb_token_, (page, total, all) => {
                if (progress) progress.textContent = `正在采集公海客户ID，请耐心等待...（第${page}页，已采集${total}个客户${all ? `/共${all}个` : ''}）`;
            });
        } else {
            customerIds = await getFilteredCustomerIds(_tb_token_, (page, total, all) => {
                if (progress) progress.textContent = `正在采集客户ID，请耐心等待...（第${page}页，已采集${total}个客户${all ? `/共${all}个` : ''}）`;
            });
        }
        if (!customerIds.length) {
            alert("未采集到客户ID，请确认筛选条件下有客户。");
            if (progress) progress.style.display = 'none';
            return;
        }
        alert(`共采集到 ${customerIds.length} 个客户ID，开始采集详情...`);
        if (progress) {
            progress.textContent = `正在导出 0/${customerIds.length}`;
        }
        // 并发采集详情
        const concurrentLimit = 5;
        const results = await concurrentMap(
            customerIds,
            concurrentLimit,
            (id, i) => getCustomerDetail(id, _tb_token_),
            (done, total) => {
                if (progress) progress.textContent = `正在导出 ${done}/${total}`;
                console.log(`已采集详情 ${done}/${total}`);
            }
        );
        const today = new Date().toISOString().slice(0,10).replace(/-/g, "");
        const exportType = isPublicCustomerPage() ? "公海客户" : "客户列表";
        const filename = `${exportType}信息导出${today}.xlsx`;
        exportExcel(results.filter(Boolean), filename);
        if (progress) {
            progress.textContent = `${exportType}导出完成！`;
            setTimeout(() => { progress.style.display = 'none'; }, 3000);
        }
        alert(`${exportType}导出完成！`);
    }

    // 页面添加按钮
    function addButton() {
        if (document.getElementById('exportCustomerBtn')) return;
        const btn = document.createElement('button');
        btn.id = 'exportCustomerBtn';
        // 根据页面类型设置按钮名称
        btn.textContent = isPublicCustomerPage() ? '公海客户导出--树洞先生' : '我的客户导出--树洞先生';
        btn.style.position = 'fixed';
        btn.style.top = '100px';
        btn.style.right = '40px';
        btn.style.zIndex = 9999;
        btn.style.background = '#4CAF50';
        btn.style.color = '#fff';
        btn.style.padding = '10px 20px';
        btn.style.border = 'none';
        btn.style.borderRadius = '5px';
        btn.style.cursor = 'pointer';
        btn.onclick = run;
        document.body.appendChild(btn);

        // 添加进度显示元素
        const progress = document.createElement('span');
        progress.id = 'exportCustomerProgress';
        progress.style.position = 'fixed';
        progress.style.top = '140px';
        progress.style.right = '40px';
        progress.style.background = 'rgba(0,0,0,0.7)';
        progress.style.color = '#fff';
        progress.style.padding = '6px 16px';
        progress.style.borderRadius = '5px';
        progress.style.fontSize = '16px';
        progress.style.zIndex = 9999;
        progress.style.display = 'none';
        document.body.appendChild(progress);
    }

    // 动态更新按钮名称（监听hash变化）
    function updateButtonName() {
        const btn = document.getElementById('exportCustomerBtn');
        if (btn) {
            btn.textContent = isPublicCustomerPage() ? '公海客户导出--树洞先生' : '我的客户导出--树洞先生';
        }
    }
    window.addEventListener('hashchange', updateButtonName);

    // 等待页面加载
    window.addEventListener('load', () => {
        addButton();
        updateButtonName();
    });

})();