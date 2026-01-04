// ==UserScript==
// @name         shopline店铺结算页首屏数据获取
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  shopline店铺结算页首屏数据获取对比v1
// @author       skyhuang
// @match        https://*.myshopline.com/*/checkouts/*
// @match        https://*.myshoplinestg.com/*/checkouts/*
// @license      AGPL License
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539691/shopline%E5%BA%97%E9%93%BA%E7%BB%93%E7%AE%97%E9%A1%B5%E9%A6%96%E5%B1%8F%E6%95%B0%E6%8D%AE%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/539691/shopline%E5%BA%97%E9%93%BA%E7%BB%93%E7%AE%97%E9%A1%B5%E9%A6%96%E5%B1%8F%E6%95%B0%E6%8D%AE%E8%8E%B7%E5%8F%96.meta.js
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
         function copy_request(url,body,cookie,response) {
          
            const request_body = JSON.stringify(body)
            const newXHR = new XMLHttpRequest();
            newXHR.open('POST', url, true);
            newXHR.withCredentials = true;
            newXHR.setRequestHeader('Content-Type', 'application/json');
            // newXHR.setRequestHeader('cookie', cookie);

            newXHR.onload = function () {
                if (newXHR.status === 200) {
                    const response_2 = JSON.parse(newXHR.response);
                    console.log("首屏java的接口响应结果: ", response_2);
                    // 这里添加你的响应对比逻辑
                    const result = compareObject(response_2['data'],response);
                    console.log("首屏对比结果1: （tips:数组对象打印出来的null或{}是表示对比通过!!!", result);
                    console.log("首屏对比结果2: ",JSON.stringify(result));
                }
            };
            
            newXHR.send(request_body);
        }
    // 方法1：直接访问全局变量
    function capturePreloadState() {
        // 确保变量存在
        if (typeof window.__PRELOAD_STATE__ !== 'undefined') {
            const data = window.__PRELOAD_STATE__;
            const location_url = document.location.origin;
            const cookie = document.cookie;
            const trade_checkout = data['tradeCheckout'];
            const checkout = data['checkout'];
            console.log("捕获的结算页首屏tradeCheckout数据:", trade_checkout);
            //理论上chenckout里面的数据和tradeCheckout数据是一样的，所以这里还是自动对比一下
            const result = compareObject(trade_checkout,checkout);
            console.log("首屏tradeCheckout数据和checkout数据对比结果1: （tips:数组对象打印出来的null或{}是表示对比通过!!!", result);
            console.log("首屏tradeCheckout数据和checkout数据对比结果2: ",JSON.stringify(result));
            //获取首屏接口需要的参数
            const checkout_token = trade_checkout['abandonedOrderInfo']['checkoutToken'];
            const basic_info_step = trade_checkout['step'];
            const client_lang = trade_checkout['otherInfo']['clientLang'];
            // const mark = trade_checkout['mark'];
            // const seq = trade_checkout['seq'];
            const first_load_java_url = location_url + '/api/trade/center/settle/main-site/detail/first-load';
            const body = {"abandonedOrderInfo":{"checkoutToken":checkout_token},"spbInfo":{},"basicInfo":{"step":basic_info_step},"otherInfo":{"protocolAndDomain":location_url,"clientLang":client_lang,"isPreview":false,"buyScence":"detail"},"queryStringParam":""};
            copy_request(first_load_java_url,body,cookie,trade_checkout);
            
            
        } else {
            console.warn("__PRELOAD_STATE__ 命令无法执行！");
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