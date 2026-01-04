// ==UserScript==
// @name         shopline店铺gp&ap快捷支付first-load、detail、create数据对比
// @namespace    http://tampermonkey.net/
// @version      0.1.25
// @description  shopline店铺gp&ap快捷支付first-load、detail、create数据对比v1
// @author       skyhuang
// @match        https://*.myshopline.com/*
// @match        https://*.myshoplinestg.com/*
// @include      https://*.myshopline.com/leproxy/api/trade/center/express/checkout/*
// @include      https://*.myshoplinestg.com/leproxy/api/trade/center/express/checkout/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      AGPL License
// @grant        GM_xmlhttpRequest
// @connect      us-store.myshopline.com
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/542911/shopline%E5%BA%97%E9%93%BAgpap%E5%BF%AB%E6%8D%B7%E6%94%AF%E4%BB%98first-load%E3%80%81detail%E3%80%81create%E6%95%B0%E6%8D%AE%E5%AF%B9%E6%AF%94.user.js
// @updateURL https://update.greasyfork.org/scripts/542911/shopline%E5%BA%97%E9%93%BAgpap%E5%BF%AB%E6%8D%B7%E6%94%AF%E4%BB%98first-load%E3%80%81detail%E3%80%81create%E6%95%B0%E6%8D%AE%E5%AF%B9%E6%AF%94.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
    
    $(() => { 
        const COPY_REQUEST_FLAG = '__isCopyRequest';
        function addXMLRequestCallback(callback){
            // 是一个劫持的函数
            var oldSend, i;
            if( XMLHttpRequest.callbacks ) {
                // 判断XMLHttpRequest对象下是否存在回调列表，存在就push一个回调的函数
                XMLHttpRequest.callbacks.push( callback );
            } else {
                // create a callback queue
                XMLHttpRequest.callbacks = [callback];
                // 如果不存在则在xmlhttprequest函数下创建一个回调列表
                oldSend = XMLHttpRequest.prototype.send;
                // 获取旧xml的send函数，并对其进行劫持
                XMLHttpRequest.prototype.send = function(){
                    // 跳过带有复制标记的请求
                    if (this[COPY_REQUEST_FLAG]) {
                        oldSend.apply(this, arguments);
                        return;
                    }
                    for( i = 0; i < XMLHttpRequest.callbacks.length; i++ ) {
                        XMLHttpRequest.callbacks[i]( this );
                    }
                    // 循环回调xml内的回调函数
                    // 请求参数设置，有些页面拿不到xhr.__sentry_xhr__.body，需要手动保存一下
                    this._requestBody = arguments[0];
                    oldSend.apply(this, arguments);
                //    由于我们获取了send函数的引用，并且复写了send函数，这样我们在调用原send的函数的时候，需要对其传入引用，而arguments是传入的参数
                }
            }
        }
        
         function copy_request(xhr,response) {
            const request_url = xhr.responseURL;
            const modifiedUrl = request_url.replace('/leproxy', '');
            let request_body;
            if (xhr.__sentry_xhr__ !== undefined){
               request_body = xhr.__sentry_xhr__.body;
            }else{
                request_body = xhr._requestBody;
            }
            // console.log("Original request body: ", request_body);
 
            const newXHR = new XMLHttpRequest();
            // 标记为复制请求（关键步骤）
            newXHR[COPY_REQUEST_FLAG] = true;
 
            newXHR.open('POST', modifiedUrl, true);
            newXHR.withCredentials = true;
            newXHR.setRequestHeader('Content-Type', 'application/json');

            newXHR.onload = function () {
                if (newXHR.status === 200) {
                    const response_2 = JSON.parse(newXHR.response);
                    console.log("java的接口响应结果: ", response_2);
                    // 这里添加你的响应对比逻辑
                    const result = compareObject(response_2['data'],response['data']);
                    console.log("对比结果1: （tips:数组对象打印出来的null或{}是表示对比通过!!!", result);
                    console.log("对比结果2: ",JSON.stringify(result));
                }
            };
            
            newXHR.send(request_body);
        }
        
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
        
        addXMLRequestCallback( function( xhr ) {
            // 跳过复制请求
            if (xhr[COPY_REQUEST_FLAG]) return;
            // 调用劫持函数，填入一个function的回调函数
            // 回调函数监听了对xhr调用了监听load状态，并且在触发的时候再次调用一个function，进行一些数据的劫持以及修改
            xhr.addEventListener("load", function(){
                if ( xhr.readyState == 4 && xhr.status == 200 ) {
                    if (xhr.responseURL.endsWith('/leproxy/api/trade/center/express/checkout/first-load') || xhr.responseURL.endsWith('/leproxy/api/trade/center/express/checkout/detail') || xhr.responseURL.endsWith('/leproxy/api/trade/center/express/checkout/create')) {
                        // console.log("xhr对象数据：",xhr);
                        const response = xhr.response;
                        const response_1 = JSON.parse(response);
                        console.log('go的接口响应结果:', response_1);
                        //获取请求头&&请求体
                        // const request_url = xhr.responseURL;
                        // const request_body = xhr.__sentry_xhr__.body;
                        // console.log('request_body:', request_body);
                        // const randomParam = { randomNumber: Math.floor(Math.random() * 1000) };
                        // const modifiedBody = Object.assign(request_body, randomParam);
                        // const modifiedBodyString = JSON.stringify(modifiedBody);
                        // console.log('Modified body:', modifiedBodyString);
                        // 复制一份请求
                        copy_request(xhr,response_1);
                }
                }
        });
        });
    });
})();