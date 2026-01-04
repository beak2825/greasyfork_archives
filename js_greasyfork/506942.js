// ==UserScript==
// @name         淘宝订单详情
// @namespace    http://tampermonkey.net/
// @version      2024-09-12_12_36
// @description  用于erp淘宝订单详情/自动发货
// @author       liukx
// @license      MIT
// @match        https://trade.taobao.com/trade/detail/trade_order_detail.htm*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=taobao.com
// @run-at       document-idle
// @connect      erp.unstars.com
// @connect      127.0.0.1
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/506942/%E6%B7%98%E5%AE%9D%E8%AE%A2%E5%8D%95%E8%AF%A6%E6%83%85.user.js
// @updateURL https://update.greasyfork.org/scripts/506942/%E6%B7%98%E5%AE%9D%E8%AE%A2%E5%8D%95%E8%AF%A6%E6%83%85.meta.js
// ==/UserScript==

function getUrlParams(url) {
    const searchParams = new URLSearchParams(url.split('?')[1]);
    const params = {};
    for (const [key, value] of searchParams.entries()) {
        params[key] = value;
    }
    return params;
}

const urlParams = getUrlParams(window.location.href);

(function() {
    'use strict';

    console.log('淘宝订单详情',data)

    const taobaoOrderInfo = {...data,purchaseOrderId:urlParams.purchaseOrderId}

    if(taobaoOrderInfo?.mainOrder?.id && urlParams.token && urlParams.purchaseAction === 'validateManualOrder'){
        const requestData = {
            id: urlParams.purchaseOrderId,
            weidianBuyerId: document.getElementsByClassName('site-nav-login-info-nick')[0].innerText,
            platform: '淘宝-原链',
            purchaseOrderNo: taobaoOrderInfo?.mainOrder?.id,
            taobaoOrderUnpaidInfo: taobaoOrderInfo
        }

        GM_xmlhttpRequest({
            method: "post",
            // url: 'http://127.0.0.1:58080/buffet/admin-api/agent-buyer/purchase-order-to-pay',
            url: 'https://erp.unstars.com/buffet/admin-api/agent-buyer/purchase-order-to-pay',
            data : JSON.stringify(requestData),
            dataType: "json",
            headers: {
                "Content-Type" : "application/json",
                "Authorization":"Bearer "+urlParams.token
            },
            onload: function(response){
                const responseText = response.responseText
                console.log('请求成功响应',responseText);

                var json = JSON.parse(responseText);
                if(json.code === 200){
                    if(json.data === null){
                        unsafeWindow.close()
                    }else{
                        alert(json.data)
                    }
                }else{
                    alert(json.msg)
                }
            },
            onerror: function(response){
                console.log("请求失败");
            }
        });
    }else if(taobaoOrderInfo?.mainOrder?.id && urlParams.token && urlParams.purchaseAction === 'syncPaidInfo'){
        GM_xmlhttpRequest({
            method: "post",
            // url: 'http://127.0.0.1:58080/buffet/admin-api/agent-buyer/taobao-order-info-update',
            url: 'https://erp.unstars.com/buffet/admin-api/agent-buyer/taobao-order-info-update',
            data : JSON.stringify(taobaoOrderInfo),
            dataType: "json",
            headers: {
                "Content-Type" : "application/json",
                "Authorization":"Bearer "+urlParams.token
            },
            onload: function(response){
                const responseText = response.responseText
                console.log('请求成功响应',responseText);

                var json = JSON.parse(responseText);
                if(json.code === 200){
                    if('同步成功' === json.data){
                        unsafeWindow.close()
                    }else{
                        alert(json.data)
                    }
                }else{
                    alert(json.msg)
                }
            },
            onerror: function(response){
                console.log("请求失败");
            }
        });
    }else if(taobaoOrderInfo?.mainOrder?.id && urlParams.token && urlParams.purchaseAction === 'syncLogisticsInfo'){
        GM_xmlhttpRequest({
            method: "post",
            // url: 'http://127.0.0.1:58080/buffet/admin-api/agent-buyer/taobao-order-info-deliver',
            url: 'https://erp.unstars.com/buffet/admin-api/agent-buyer/taobao-order-info-deliver',
            data : JSON.stringify(taobaoOrderInfo),
            dataType: "json",
            headers: {
                "Content-Type" : "application/json",
                "Authorization":"Bearer "+urlParams.token
            },
            onload: function(response){
                const responseText = response.responseText
                console.log('请求成功响应',responseText);

                var json = JSON.parse(responseText);
                if(json.code === 200){
                    if('等待卖家发货' === json.data || '发货成功' === json.data){
                        unsafeWindow.close()
                    }else{
                        alert(json.data)
                    }
                }else{
                    alert(json.msg)
                }
            },
            onerror: function(response){
                console.log("请求失败");
            }
        });
    }

    // Your code here...
})();