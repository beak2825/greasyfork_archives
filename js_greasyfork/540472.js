// ==UserScript==
// @name         阿里巴巴国际站访客详情采集导出--树洞先生
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      MIT
// @description  采集阿里巴巴访客详情并导出,可根据页面选择的日期
// @author       树洞先生
// @match        https://data.alibaba.com/marketing/visitor*
// @match        https://mydata.alibaba.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540472/%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E5%9B%BD%E9%99%85%E7%AB%99%E8%AE%BF%E5%AE%A2%E8%AF%A6%E6%83%85%E9%87%87%E9%9B%86%E5%AF%BC%E5%87%BA--%E6%A0%91%E6%B4%9E%E5%85%88%E7%94%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/540472/%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E5%9B%BD%E9%99%85%E7%AB%99%E8%AE%BF%E5%AE%A2%E8%AF%A6%E6%83%85%E9%87%87%E9%9B%86%E5%AF%BC%E5%87%BA--%E6%A0%91%E6%B4%9E%E5%85%88%E7%94%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 字段映射
    const FIELD_MAP = {
        'visitorId':'访客ID',
        'buyerName':'访客姓名',
        'buyerCountry':'访客国家',
        'buyerRegion':'访客国家区域',
        'statDate':'进店日期',
        'isGoldBuyer':'金标买家',
        'levelTag':'访客等级',
        'isBrandFansBuyer':'品牌粉丝',
        'buyerTag':'标签',
        'isOnlineRetailerBuyer':'电商买家',
        'searchKeyword':'进店关键词',
        'serKeywords':'全站偏好关键词',
        'staySecond':'停留时长',
        'visitPv':'浏览次数',
        'isMcFb':'是否发起了询盘',
        'isAtmFb':'是否发起了TM',
        'isVisitHomepage':'是否访问了主页',
        'isVisitProfilePage':'是否访问了店铺资料主页',
        'isVisitContactPage':'是否访问了联系页面',
        'isViewContactInformation':'是否查看了联系人信息',
        'isClickPlaceOrder':'点击了提交订单',
        'isVisitCertifiedInfo':'浏览证书信息',
        'sendEmailCnt':'发送邮件数量',
        'totalVisitPv':'总浏览量',
        'totalVisitSellerCnt':'浏览供应商数量',
        'totalRfqCnt':'发布RFQ数量',
        'totalMcFbCnt':'对多少个供应商发起了多少个询盘',
        'totalMcSellerCnt':'对多少个供应商发起了多少个TM'
    };

    const header = Object.values(FIELD_MAP);
    const requiredFields = Object.keys(FIELD_MAP);

    // 采集参数
    const pageSize = 10;

    // 获取 cookie
    function getCookie(name) {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([.$?*|{}()\[\]\\/+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    // 动态获取 dmtrack_pageid
    function getDmtrackPageId() {
        const match = document.cookie.match(/dmtrack_pageid=([^;]+)/);
        if (match) return match[1];
        if (window.dmtrack && window.dmtrack.pageid) return window.dmtrack.pageid;
        if (localStorage.getItem('dmtrack_pageid')) return localStorage.getItem('dmtrack_pageid');
        return Math.random().toString().slice(2) + Date.now();
    }

    // 引入SheetJS（xlsx）库
    const script = document.createElement('script');
    script.src = 'https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js';
    script.onload = () => { window.XLSX_READY = true; };
    document.head.appendChild(script);

    // 获取采集日期（从页面）
    function getDateRangeFromPage() {
        const dateDiv = document.querySelector('#J-common-state-text');
        if (dateDiv) {
            return {
                startDate: dateDiv.getAttribute('data-startdate') || '',
                endDate: dateDiv.getAttribute('data-enddate') || ''
            };
        }
        return { startDate: '', endDate: '' };
    }

    // 修改getVisitorData函数，支持传入startDate和endDate
    async function getVisitorData(pageNo, startDate, endDate) {
        const ctoken = '103hhn0vs58nu';
        const dmtrack_pageid = '6797ac192102fef51750650324';
        const xsrfToken = '717f8886-87b1-4bd1-aee0-dd98d2585668';
        const url = `https://mydata.alibaba.com/self/.json?action=CommonAction&iName=getVisitors&isVip=true&0.686084886315589&ctoken=${ctoken}&dmtrack_pageid=${dmtrack_pageid}`;
        const data = new URLSearchParams({
            orderBy: '',
            orderModel: '',
            pageSize: '10',
            pageNO: String(pageNo),
            statisticsType: 'day',
            selected: '0',
            startDate: startDate || '',
            endDate: endDate || '',
            searchKeyword: '',
            buyerRegion: '',
            buyerCountry: '',
            subMemberSeq: '',
            isMcFb: 'false',
            isAtmFb: 'false',
            hasRemarks: 'false',
            statisticType: 'os',
            desTime: String(Date.now())
        });

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7',
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'x-xsrf-token': xsrfToken
            },
            body: data,
            credentials: 'include'
        });
        const text = await res.text();
        console.log('接口返回内容:', text);
        return JSON.parse(text);
    }

    // 便于控制台直接调试fetch请求
    window.runVisitorExport = getVisitorData;

    // 导出为Excel xlsx
    function exportToXLSX(rows, filename = '访客详情.xlsx') {
        if (!window.XLSX_READY) {
            alert('Excel导出库加载中，请稍后再试');
            return;
        }
        // 组装二维数组，第一行为表头
        const aoa = [header, ...rows.map(row => header.map(h => row[h] ?? ''))];
        const ws = XLSX.utils.aoa_to_sheet(aoa);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, '访客详情');
        XLSX.writeFile(wb, filename);
    }

    // 页面添加按钮和进度条
    function addButton() {
        const btn = document.createElement('button');
        btn.textContent = '采集访客详情并导出-树洞先生';
        btn.style.position = 'fixed';
        btn.style.top = '100px';
        btn.style.right = '40px';
        btn.style.zIndex = 9999;
        btn.onclick = main;
        document.body.appendChild(btn);

        // 添加进度显示元素
        const progressDiv = document.createElement('div');
        progressDiv.id = 'visitor-progress';
        progressDiv.style.position = 'fixed';
        progressDiv.style.top = '140px';
        progressDiv.style.right = '40px';
        progressDiv.style.zIndex = 9999;
        progressDiv.style.background = 'rgba(255,255,255,0.95)';
        progressDiv.style.padding = '8px 16px';
        progressDiv.style.border = '1px solid #ccc';
        progressDiv.style.borderRadius = '4px';
        progressDiv.style.fontSize = '14px';
        progressDiv.style.display = 'none';
        document.body.appendChild(progressDiv);
    }

    // 主函数
    async function main() {
        alert('开始采集访客详情，完成后自动下载Excel文件');
        // 动态获取采集日期
        const { startDate, endDate } = getDateRangeFromPage();
        if (!startDate || !endDate) {
            alert('未能从页面获取采集日期，请先在页面选择日期');
            return;
        }
        // 先获取总数
        const firstPage = await getVisitorData(1, startDate, endDate);
        if (!firstPage.value || !firstPage.value.total) {
            alert('获取数据失败');
            return;
        }
        const total = firstPage.value.total;
        const totalPages = Math.ceil(total / pageSize);
        let allVisitors = [];

        // 显示进度条
        const progressDiv = document.getElementById('visitor-progress');
        progressDiv.style.display = 'block';
        progressDiv.textContent = `采集进度：0/${total} (0%)`;

        // 并发采集所有页面，并实时更新进度
        let completed = 0;
        let allPages = [];
        for (let i = 1; i <= totalPages; i++) {
            allPages.push(
                getVisitorData(i, startDate, endDate).then(page => {
                    console.log(`第${i}页数据:`, page.value && page.value.data);
                    completed += (page.value && page.value.data ? page.value.data.length : 0);
                    progressDiv.textContent = `采集进度：${completed}/${total} (${Math.min(100, Math.round(completed/total*100))}%)`;
                    return page;
                })
            );
        }
        const pages = await Promise.all(allPages);

        for (const page of pages) {
            if (page.value && page.value.data) {
                for (const visitor of page.value.data) {
                    // 映射字段
                    let row = {};
                    for (const [en, cn] of Object.entries(FIELD_MAP)) {
                        row[cn] = visitor[en] ?? '';
                    }
                    allVisitors.push(row);
                }
            }
        }
        console.log('全部采集完成，allVisitors长度:', allVisitors.length);
        console.log('allVisitors内容:', allVisitors);
        console.log('准备导出Excel...');
        // 拼接文件名
        const fileName = `访客详情_${startDate}_${endDate}.xlsx`;
        exportToXLSX(allVisitors, fileName);
        console.log('Excel导出完成');
        progressDiv.textContent = `采集完成，已采集 ${allVisitors.length} 条，Excel已下载`;
        setTimeout(() => { progressDiv.style.display = 'none'; }, 5000);
        alert('采集完成，Excel已下载');
    }

    addButton();
})();