// ==UserScript==
// @name         gdmy
// @namespace    http://tampermonkey.net/
// @version      V0.1
// @description  get data from guangdong
// @author       wei
// @match        https://pm.gd.csg.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @license      AGPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/537621/gdmy.user.js
// @updateURL https://update.greasyfork.org/scripts/537621/gdmy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 随机生成 30 到 60 秒的延迟
    function randomDelay(minDelay = 30000, maxDelay = 60000) {
        return new Promise(resolve => {
            const delayTime = Math.floor(Math.random() * (maxDelay - minDelay  + 1)) + minDelay; // minDelay ~ maxDelay秒
            setTimeout(resolve, delayTime);
        });
    }

    // 输入 '2024-10-01, 2024-10-10', 输出时间序列列表
    function generateDateList(dateRangeStr) {
        let [startDateStr, endDateStr] = dateRangeStr.split(',').map(date => date.trim());
        let startDate = new Date(startDateStr);
        let endDate = new Date(endDateStr);
        let dateList = [];
    
        while (startDate <= endDate) {
            dateList.push(startDate.toISOString().split('T')[0]); // 转为字符串格式
            startDate.setDate(startDate.getDate() + 1);           // 日期加1
        }
        return dateList;
    }

    function loadInformation(startDate, endDate) {
        let dateList = generateDateList(startDate+ ", " + endDate);
        console.log(dateList)
        let url = '/pfxh/qctc-pm-trade-market-out-plzx/PublishInfoCx/loadInformation';
    }

    // 负荷信息
    const url = '/pfxh/qctc-pm-trade-market-out-plzx/PublishInfoCx/loadInformation'

    // 正负备用信息
    // const url = '/pfxh/qctc-pm-trade-market-out-plzx/PublishInfoCx/getByInfo'

    // 节点电价
    // const url = '/pfxh/qctc-pm-trade-market-out-plzx/PublishInfoCx/getGrid'

    // 名称  https://pm.gd.csg.cn/pfxh/qctc-pm-trade-market-out-zzzx/daNodePriceQuery/getJddjTree?HdKGccbL=

    // 日前：
    // 全省      /pfxh/qctc-pm-trade-market-out-zzzx/daNodePriceQuery/getGrid?pdate=2025-05-27&nodeId=root
    // 鹅凰A站1M /pfxh/qctc-pm-trade-market-out-zzzx/daNodePriceQuery/getGrid?pdate=2025-05-19&nodeId=nodeid_0317B150000030CNN00BAM002
    // 鹅凰A站2M /pfxh/qctc-pm-trade-market-out-zzzx/daNodePriceQuery/getGrid?pdate=2025-05-19&nodeId=nodeid_0317B150000030CNN00BAM001
    // 鹅凰B站5a /pfxh/qctc-pm-trade-market-out-zzzx/daNodePriceQuery/getGrid?pdate=2025-05-27&nodeId=nodeid_101187465171077050
    // 鹅凰B站5b /pfxh/qctc-pm-trade-market-out-zzzx/daNodePriceQuery/getGrid?pdate=2025-05-27&nodeId=nodeid_101187465171077052
    // 鹅凰B站6a /pfxh/qctc-pm-trade-market-out-zzzx/daNodePriceQuery/getGrid?pdate=2025-05-27&nodeId=nodeid_101187465171077054
    // 鹅凰B站6b /pfxh/qctc-pm-trade-market-out-zzzx/daNodePriceQuery/getGrid?pdate=2025-05-27&nodeId=nodeid_101187465171077056

    // 实时:
    // 全省      /pfxh/qctc-pm-trade-market-out-zzzx/ssNodePriceQuery/getGrid?pdate=2025-05-27&nodeId=root
    // 鹅凰A站1M /pfxh/qctc-pm-trade-market-out-zzzx/ssNodePriceQuery/getGrid?pdate=2025-05-27&nodeId=nodeid_101187465165038432
    // 鹅凰A站2M /pfxh/qctc-pm-trade-market-out-zzzx/ssNodePriceQuery/getGrid?pdate=2025-05-27&nodeId=nodeid_101187465165038434
    // 鹅凰B站5a /pfxh/qctc-pm-trade-market-out-zzzx/ssNodePriceQuery/getGrid?pdate=2025-05-27&nodeId=nodeid_101187465171077050
    // 鹅凰B站5b /pfxh/qctc-pm-trade-market-out-zzzx/ssNodePriceQuery/getGrid?pdate=2025-05-27&nodeId=nodeid_101187465171077052
    // 鹅凰B站6a /pfxh/qctc-pm-trade-market-out-zzzx/ssNodePriceQuery/getGrid?pdate=2025-05-27&nodeId=nodeid_101187465171077054
    // 鹅凰B站6b /pfxh/qctc-pm-trade-market-out-zzzx/ssNodePriceQuery/getGrid?pdate=2025-05-27&nodeId=nodeid_101187465171077056

    let _token = localStorage.getItem('pfxh-token');
    let cur_date = '2025-05-13';
    // 发起 AJAX 请求以获取数据
    $.ajax({
        url: url,
        type: 'GET',
        headers: {
            'Authorization': `Bearer ${_token}`
        },
        data: {
            type: 'yc',
            pdate: cur_date
        },
        data: {
            unitid: '1',
            pdate: cur_date
        },
        success: function(res) {
            // 组织数据
            let data_dict = {
                "data_class": "鹅凰站",
                "date": cur_date,
                "data": res.data
            };
            console.log("数据准备发送:", data_dict);
            // 使用 fetch() 发送 POST 请求
            fetch('https://192.168.137.22:5011/receive', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                },
                body: JSON.stringify(data_dict), // 转换为 JSON 字符串
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status}`);
                }
                return response.json(); // 解析为 JSON
            })
            .then(data => {
                console.log("请求成功:", data);
            })
            .catch(error => {
                console.error("请求失败:", error);
            });
        },
        error: function(err) {
            console.error("获取数据失败:", err);
        }
        });
})