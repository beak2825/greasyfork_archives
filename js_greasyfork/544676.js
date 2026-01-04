// ==UserScript==
// @name         shopline快捷支付paymentButton首屏数据获取
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  shopline店铺结算页首屏数据获取对比v1
// @author       skyhuang
// @match        https://*.myshopline.com/*
// @match        https://*.myshoplinestg.com/*
// @license      AGPL License
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544676/shopline%E5%BF%AB%E6%8D%B7%E6%94%AF%E4%BB%98paymentButton%E9%A6%96%E5%B1%8F%E6%95%B0%E6%8D%AE%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/544676/shopline%E5%BF%AB%E6%8D%B7%E6%94%AF%E4%BB%98paymentButton%E9%A6%96%E5%B1%8F%E6%95%B0%E6%8D%AE%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    const FILL = "当前索引没有值"

function toString(sv, tv) {
    if (sv === undefined) {
        sv = "undefined"
    }
    if (sv === null) {
        sv = "null"
    }
    if (tv === undefined) {
        tv = "undefined"
    }
    if (tv === null) {
        tv = "null"
    }
    if (sv instanceof Object) {
        sv = JSON.stringify(sv)
    }
    if (tv instanceof Object) {
        tv = JSON.stringify(tv)
    }
    return `${sv} ----> ${tv}`
}

function compareList(sourceList, targetList) {
    let resultList = []
    if (sourceList.length < targetList.length) {
        // 源字段的长度小于目标字段的长度时
        for (let i = sourceList.length; i < targetList.length; i++) {
            sourceList[i] = FILL
        }
    }
    for (let i = 0; i < sourceList.length; i++) {
        let sourceIdxValue = sourceList[i]
        let targetIdxValue = i >=targetList.length ? undefined : targetList[i]
        if (sourceIdxValue === FILL) {
            resultList[i] = toString(sourceIdxValue, targetIdxValue)
            continue
        }
        if (sourceIdxValue === undefined && targetIdxValue === undefined) {
            continue
        }
        if (sourceIdxValue === null && targetIdxValue === null) {
            continue
        }
        if (sourceIdxValue === undefined || sourceIdxValue === null || targetIdxValue === undefined || targetIdxValue === null) {
            resultList[i] = toString(sourceIdxValue, targetIdxValue)
            continue
        }
        if (sourceIdxValue instanceof Object && targetIdxValue instanceof Object) {
            resultList[i] = compareObject(sourceIdxValue, targetIdxValue)
            continue
        }
        if (sourceIdxValue === targetIdxValue) {
            resultList[i] = null
            continue
        }
        resultList[i] = toString(sourceIdxValue, targetIdxValue)
    }
    let flag = false;
    for (let v of resultList) {
        if (v !== undefined && v !== null) {
            if (typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length === 0) {
                // 判断是否是空对象{}
            } else {
                flag = true
                break
            }
        }
    }
    return flag ? resultList : []
}

function compareObject(sourceObj, targetObj) {
    let resultObj = {}
    Object.keys(sourceObj).forEach(key => {
        let sourceObjValue = sourceObj[key]
        let targetObjValue = targetObj[key]
        if (sourceObjValue === undefined && targetObjValue === undefined) {
            return
        }
        if (sourceObjValue === null && targetObjValue === null) {
            return
        }
        if (sourceObjValue === undefined || sourceObjValue === null || targetObjValue === undefined || targetObjValue === null) {
            resultObj[key] = toString(sourceObjValue, targetObjValue)
            return
        }
        if (sourceObjValue instanceof Array && targetObjValue instanceof Array) {
            let subListResult = compareList(sourceObjValue, targetObjValue)
            if (subListResult.length > 0) {
                resultObj[key] = subListResult
            }
            return
        }
        if (sourceObjValue instanceof Object && targetObjValue instanceof Object) {
            let subObjResult = compareObject(sourceObjValue, targetObjValue)
            if (Object.keys(subObjResult).length !== 0) {
                resultObj[key] = subObjResult
            }
            return
        }
        // 额外判断下string能不能转object、array
        if (typeof sourceObjValue === "string" && typeof targetObjValue === "string") {
            if (sourceObjValue.startsWith("{") && targetObjValue.startsWith("{")) {
                try {
                    let sourceString2Object = JSON.parse(sourceObjValue)
                    let targetString2Object = JSON.parse(targetObjValue)
                    let subObjResult = compareObject(sourceString2Object, targetString2Object)
                    if (Object.keys(subObjResult).length !== 0) {
                        resultObj[key] = subObjResult
                    }
                    return
                } catch (err) {
                    // 转对象失败继续往下执行
                }
            }

            if (sourceObjValue.startsWith("[{") && targetObjValue.startsWith("[{")) {
                try {
                    let sourceString2List = JSON.parse(sourceObjValue)
                    let targetString2List = JSON.parse(targetObjValue)
                    let subListResult = compareList(sourceString2List, targetString2List)
                    if (subListResult.length > 0) {
                        resultObj[key] = subListResult
                    }
                    return
                } catch (err) {
                }
            }
        }
        if (sourceObjValue === targetObjValue) {
            return
        }
        resultObj[key] = toString(sourceObjValue, targetObjValue)
    })
    return resultObj
}
         function copy_request(url,cookie,response) {
          
            const newXHR = new XMLHttpRequest();
            newXHR.open('GET', url, true);
            newXHR.withCredentials = true;
            newXHR.setRequestHeader('Content-Type', 'application/json');
            // newXHR.setRequestHeader('cookie', cookie);

            newXHR.onload = function () {
                if (newXHR.status === 200) {
                    const response_2 = JSON.parse(newXHR.response);
                    console.log("paymentButton 在java的接口响应结果: ", response_2);
                    // 这里添加你的响应对比逻辑
                    const result = compareObject(response_2['data'],response);
                    console.log("__paymentButtonConfig__对比结果1: （tips:数组对象打印出来的null或{}是表示对比通过!!!", result);
                    console.log("__paymentButtonConfig__对比结果2: ",JSON.stringify(result));
                }
            };
            
            newXHR.send();
        }
    // 方法1：直接访问全局变量
    function capturePreloadState() {
        // 确保变量存在
        if (typeof window.__PRELOAD_STATE__ !== 'undefined') {
            const data = window.__PRELOAD_STATE__.paymentButtonConfig;
            const location_url = document.location.origin;
            const cookie = document.cookie;
            console.log("捕获的__paymentButtonConfig__数据:", data);
            const payment_button_java_url = location_url + '/api/trade/pay/payment/payment-button/payments/data';
            copy_request(payment_button_java_url,cookie,data);
            
            
        } else if (typeof window.__paymentButtonConfig__ !== 'undefined'){
            const data = window.__paymentButtonConfig__;
            const location_url = document.location.origin;
            const cookie = document.cookie;
            console.log("捕获的__paymentButtonConfig__数据:", data);
            const payment_button_java_url = location_url + '/api/trade/pay/payment/payment-button/payments/data';
            copy_request(payment_button_java_url,cookie,data);
        } else {
            console.warn("__PRELOAD_STATE__ or __paymentButtonConfig__ 命令无法执行！");
        }
    }

    // 启动捕获逻辑
    if (document.readyState === 'complete') {
        capturePreloadState(); // 页面已加载完成
    } else {
        window.addEventListener('load', () => {
            capturePreloadState(); // 等待页面完全加载
        });
    }
})();