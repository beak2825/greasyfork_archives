// ==UserScript==
// @name         OPPO平台数据监控
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  每10秒监控接口数据并过滤后发送到后端
// @author       liu tutou
// @match        https://e.oppomobile.com/markets/manage/agency/home
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      e.oppomobile.com
// @connect      control.zjwec.cn
// @downloadURL https://update.greasyfork.org/scripts/543168/OPPO%E5%B9%B3%E5%8F%B0%E6%95%B0%E6%8D%AE%E7%9B%91%E6%8E%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/543168/OPPO%E5%B9%B3%E5%8F%B0%E6%95%B0%E6%8D%AE%E7%9B%91%E6%8E%A7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let intervalId = null;
    const apiUrl = 'https://e.oppomobile.com/v3/data/common/agency/query/queryMktAggData';
    let opData = [];
    let ownerIdList = [];

    const monitorButton = document.createElement('button');
    monitorButton.innerText = '开启监控';
    monitorButton.id = 'monitorToggle';
    document.body.appendChild(monitorButton);

// 添加样式函数的兼容性实现
function addStyle(css) {
    if (typeof GM_addStyle !== "undefined") {
        GM_addStyle(css)      // 兼容Tampermonkey (Chrome)
    } else if (typeof GM !== "undefined" && GM.addStyle) {
        GM.addStyle(css)     // 兼容Greasemonkey V4+ (Firefox)
    } else {
        // 降级方案：原生DOM方法（通用）
        const style = document.createElement('style');
        style.textContent = css;
        (document.head || document.documentElement).appendChild(style);
    }
}

// 使用新函数添加样式
addStyle(`
    #monitorToggle {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        padding: 10px 20px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-family: Arial, sans-serif;   /* 增加字体定义 */
        font-size: 14px;                 /* 增加字体大小 */
        box-shadow: 0 2px 10px rgba(0,0,0,0.2); /* 添加阴影提升效果 */
        transition: all 0.3s ease;        /* 添加悬停动画 */
    }
    #monitorToggle:hover {
        background-color: #3d8b40;        /* 悬停颜色加深 */
        transform: translateY(-2px);      /* 轻微上浮效果 */
    }
`);

    monitorButton.addEventListener('click', () => {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
            monitorButton.innerText = '开启监控';
            console.log('[监控] 已关闭');
        } else {
            intervalId = setInterval(monitorData, 10000);
            monitorButton.innerText = '关闭监控';
            console.log('[监控] 已开启');
            monitorData();
        }
    });

    function fetchOwnerIds() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://control.zjwec.cn/oppo/monitor/listAllZownerIds',
            onload: ({ responseText }) => {
                try {
                    const data = JSON.parse(responseText);
                    if (Array.isArray(data.data)) {
                        ownerIdList = data.data;
                        console.log('[owneridList] 已更新:', ownerIdList);
                    } else {
                        console.error('[owneridList] 返回数据格式错误，期待数组');
                    }
                } catch (e) {
                    console.error('[owneridList] 数据解析失败', e);
                }
            },
            onerror: (err) => {
                console.error('[owneridList] 请求失败', err);
            }
        });
    }

    fetchOwnerIds();
    setInterval(fetchOwnerIds, 300000);

    function monitorData() {
        const payload = {
            page: 1,
            pageCount: 100,
            paraMap: { orderByColumn: 'owner_insert_time' },
            ascDesc: 'desc'
        };

        const headers = {
            'Content-Type': 'application/json',
            'Referer': 'https://e.oppomobile.com/markets/manage/agency/home',
            'Origin': 'https://e.oppomobile.com',
            'tk': getCookie('adstk'),
            'Cookie': document.cookie
        };

        GM_xmlhttpRequest({
            method: 'POST',
            url: apiUrl,
            headers,
            data: JSON.stringify(payload),
            onload: ({ responseText }) => {
                try {
                    const data = JSON.parse(responseText);
                    if (data.code === 0 && data.data && Array.isArray(data.data.items)) {
                        opData = data.data.items;
                        console.log('获取到的:', opData);

                        const filteredData = opData.filter(item =>
                            ownerIdList.includes(String(item.owner_id))
                        );

                        console.log('[监控] 过滤后数据:', filteredData);

                        const timestamp = Date.now();
                const apiPayload = filteredData.map(({ owner_name, owner_id, today_total_cost }) => ({
    kname: owner_name || '',
    kownerid: String(owner_id),
    todayconsume: (Math.round(Number(today_total_cost || 0)) / 100).toFixed(2),
    ts: timestamp
}));

                        GM_xmlhttpRequest({
                            method: 'POST',
                            url: 'https://control.zjwec.cn/oppo/monitorConsume/batchSaveOrUpdate',
                            data: JSON.stringify(apiPayload),
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            onload: ({ status, responseText }) => {
                                if (status === 200) {
                                    console.log('✅ 数据上报成功:', responseText);
                                } else {
                                    console.error('❌ 数据上报失败:', status, responseText);
                                }
                            },
                            onerror: (error) => {
                                console.error('⚠️ 网络请求异常:', error);
                            }
                        });
                    } else {
                        console.error('[监控] 返回数据格式不符合预期', data);
                    }
                } catch (e) {
                    console.error('[监控] 数据解析失败', e);
                }
            },
            onerror: (err) => {
                console.error('[监控] 请求失败', err);
            }
        });
    }

    function getCookie(name) {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : '';
    }
})();
