// ==UserScript==
// @name         【Jensen】bugly次数crash率计算
// @namespace    zys
// @version      1.4
// @description  bugly次数crash率只有每天的，如果想知道一段时间段的次数crash率需要自己手动计算，该脚本可以自动计算次数crash率
// @author       Jensen
// @match        https://bugly.qq.com/*
// @exclude      https://bugly.qq.com/v2/crash-reporting/advanced-search/*
// @icon         https://bugly.qq.com/v2/image?id=2c06cba9-7d27-4f1c-8b0d-b932c33deaf3
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_log
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/454859/%E3%80%90Jensen%E3%80%91bugly%E6%AC%A1%E6%95%B0crash%E7%8E%87%E8%AE%A1%E7%AE%97.user.js
// @updateURL https://update.greasyfork.org/scripts/454859/%E3%80%90Jensen%E3%80%91bugly%E6%AC%A1%E6%95%B0crash%E7%8E%87%E8%AE%A1%E7%AE%97.meta.js
// ==/UserScript==

// 解析url参数
function parseURL(url) {
    let arr = url.split('?');
    let res = arr[1].split('&');
    let items = {};
    for (let i=0; i<res.length; i++) {
        let a = res[i].split('=');
        items[a[0]] = a[1];
    }
    return items
}

function formatTypeStr(type) {
    var str = '崩溃'
    if (type === 'anr') {
        str = '卡顿'
    } else if (type === 'error') {
        str = '错误'
    }
    return str
}

// 添加 css 样式
function addCSSStyle() {
    let css = `
    #zys-avg-crash-tip {
    color: #333;
    }

    #zys-avg-crash {
    color: #f00;
    font-weight: 400;
    }

    #zys-crash-id{
    line-height: 60px;
    font-size: 14px;
    padding: 0 30px;
    }
    `
    GM_addStyle(css)
}

// 添加crash率标签
function addCrashRateDiv(typeStr, crashNum, accessNum, crashUsers) {
    let avgCrashRate = accessNum == 0 ? 0 : ((crashNum / accessNum) * 100).toFixed(2)
    console.log("【Jensen】次数" + typeStr + "率:" + avgCrashRate + "%")
    let html = `<span id='zys-avg-crash-tip'>${typeStr}次数: </span><span id='zys-avg-crash'>${crashNum}</span>
    <span id='zys-avg-crash-tip'>，联网次数: </span><span id='zys-avg-crash'>${accessNum}</span>
    <span id='zys-avg-crash-tip'>，次数${typeStr}率: </span><span id='zys-avg-crash'>${avgCrashRate}%</span>
    <span id='zys-avg-crash-tip'>，影响设备数: </span><span id='zys-avg-crash'>${crashUsers}</span>`
    var container = document.getElementsByClassName('_21YdQb5lVHatEdy0RZdASa')[0].parentNode
    var div = document.getElementById('zys-crash-id')
    if (div == undefined) {
        div = document.createElement("div")
        div.setAttribute('id', 'zys-crash-id')
        container.appendChild(div)
    }
    div.hidden = false
    div.innerHTML = html
    // 添加 css 样式
    addCSSStyle()
}

// 隐藏crash率标签
function hiddenCrashRateDiv() {
    let crashRateDiv = document.getElementById('zys-crash-id')
    if (crashRateDiv != undefined && crashRateDiv.hidden === false) {
        crashRateDiv.hidden = true
    }
}

(function() {
    'use strict';

    GM_log('【Jensen】bugly崩溃率计算脚本启动')

    const originFetch = fetch
    // console.log(originFetch)
    window.unsafeWindow.fetch = (url, options) => {
        return originFetch(url, options).then(async (response) => {
            let pre_url_prefix = 'https://bugly.qq.com/v4/api/old/get-crash-trend?appId='
            let today_url_prefix = 'https://bugly.qq.com/v4/api/old/get-real-time-hourly-stat?appId='
            let is_pre_url = url.includes(pre_url_prefix)
            let is_today_url = url.includes(today_url_prefix)
            if (is_pre_url || is_today_url) {
                let queryItems = parseURL(url)
                let typeStr = formatTypeStr(queryItems.type)
                // 不显示对比数据
                if (queryItems.dataType === 'compareData' || queryItems.dataType === 'realTimeCompareData') {
                    return response
                }
                const responseClone = response.clone()
                let res = await responseClone.json()
                let crashList = res.data.data
                var totalCrashNum = 0 // 总的crash次数
                var totalAccessNum = 0 // 总的联网次数
                var totalCrashUser = 0 // 总的crash用户
                if (crashList != null && crashList.length > 0) {
                    for (let i = 0; i < crashList.length; i++) {
                        let crash = crashList[i]
                        let crashNum = crash.crashNum
                        let accessNum = crash.accessNum
                        let crashUser = crash.crashUser
                        if (crashNum > 0 ) {
                            totalCrashNum += crashNum
                        }
                        if (accessNum > 0) {
                            totalAccessNum += accessNum
                        }
                        if (crashUser > 0) {
                            totalCrashUser += crashUser
                        }
                    }
                }
                addCrashRateDiv(typeStr, totalCrashNum, totalAccessNum, totalCrashUser)
            }
            return response
        });
    }
})();