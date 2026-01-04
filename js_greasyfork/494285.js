// ==UserScript==
// @name         微店订单详情/自动发货
// @namespace    http://tampermonkey.net/
// @version      2024-06-14
// @description  用于erp微店订单详情/自动发货
// @author       liukx
// @license      MIT
// @match        https://*.weidian.com/user/order-new/detail.php*
// @match        https://weidian.com/user/order-new/logistics.php*
// @match        https://weidian.com/buy/add-order/index.php*
// @match        https://weidian.com/address/buyerAddAddress.html*
// @match        https://weidian.com/user/order/list.php?type=1*
// @match        https://weidian.com/?userid=1625746264*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=weidian.com
// @connect      erp.unstars.com
// @connect      127.0.0.1
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_getTab
// @grant        GM_getTabs
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/494285/%E5%BE%AE%E5%BA%97%E8%AE%A2%E5%8D%95%E8%AF%A6%E6%83%85%E8%87%AA%E5%8A%A8%E5%8F%91%E8%B4%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/494285/%E5%BE%AE%E5%BA%97%E8%AE%A2%E5%8D%95%E8%AF%A6%E6%83%85%E8%87%AA%E5%8A%A8%E5%8F%91%E8%B4%A7.meta.js
// ==/UserScript==

class Utils {

}

function getUrlParams(url) {
    const searchParams = new URLSearchParams(url.split('?')[1]);
    const params = {};
    for (const [key, value] of searchParams.entries()) {
        params[key] = value;
    }
    return params;
}

function getOrderInfoKey(orderId){
    return 'orderInfo_'+orderId
}

function getOrderLogisticsInfoKey(orderId){
    return 'orderLogisticsInfo_'+orderId
}

const urlParams = getUrlParams(window.location.href);

function handleWeidianAddOrderPreviewInfo(){
    if(unsafeWindow.location.href.indexOf('weidian.com/buy/add-order/index.php') > -1 && urlParams.purchaseAction === 'createOrder'){
        // 执行
    }else{
        return;
    }

    const pay_footer_content_dom = document.getElementsByClassName('pay_footer_content')[0]

    pay_footer_content_dom.style.display = 'none';

    console.log('unsafeWindow.getData.order.result',unsafeWindow.getData?.order?.result)

    const weidianAddOrderPreviewInfo = unsafeWindow.getData?.order?.result


    if(weidianAddOrderPreviewInfo && urlParams.token){
        const requestData = {
            purchaseOrderId: urlParams.purchaseOrderId,
            weidianAddOrderPreviewInfo: weidianAddOrderPreviewInfo,
        }

        GM_xmlhttpRequest({
            method: "post",
            // url: 'http://127.0.0.1:48080/buffet/admin-api/agent-buyer/purchase-order-validate-before-place',
            url: 'https://erp.unstars.com/buffet/admin-api/agent-buyer/purchase-order-validate-before-place',
            data : JSON.stringify(requestData),
            dataType: "json",
            headers: {
                "Content-Type" : "application/json",
                "Authorization":"Bearer "+urlParams.token
            },
            onload: function(response){
                const responseText = response.responseText
                const responseJson = JSON.parse(responseText);
                console.log('请求成功响应文本',responseText);
                console.log('请求成功响应json',responseJson);

                if(responseJson.code === 200){
                    const validateResult = responseJson.data.validateResult;
                    if (validateResult === 'MODIFY_ADDRESS') {
                        const info = responseJson.data.info

                        if(!weidianAddOrderPreviewInfo.buyer_address.address_str.startsWith(info.areaInfo)){
                            alert('默认地址的所在区域和仓库的所在区域`'+info.areaInfo+'`对不上')
                            window.open("https://weidian.com/address/buyerListAddress.html?wfr=c&ifr=itemdetail","_blank")
                            unsafeWindow.close()
                            return
                        }

                        const url = `https://weidian.com/address/buyerAddAddress.html?addressId=${weidianAddOrderPreviewInfo.buyer_address.address_id}&callback=default_back&wfr=c&ifr=itemdetail&purchaseAction=modifyAddress&recipient=${info.recipient}&phone=${info.phone}&areaInfo=${info.areaInfo}&streetInfo=${info.streetInfo}&appendAddressKey=${info.appendAddressKey}`
                        const newWindow = window.open(url,"_blank")
                        console.log('buyerAddAddress.html newWindow',newWindow)
                        setTimeout(()=>{
                            unsafeWindow.location.reload()
                        },2000)
                        // alert('需要修改地址:\n' + JSON.stringify(responseJson.data));
                    } else if (validateResult === 'CAN_PLACE_ORDER') {
                        // alert("校验通过,可以下单");
                        if(responseJson.data.otherNoticeResults.length > 0){
                            alert(responseJson.data.otherNoticeResults.join(","))
                        }

                        const newElement = document.createElement('div');
                        newElement.textContent = '校验通过,可以付款';
                        newElement.style.fontSize = '20px'
                        newElement.style.fontWeight = 'bold'
                        newElement.style.color = 'red'
                        pay_footer_content_dom.appendChild(newElement)

                        pay_footer_content_dom.style.display = 'block'
                    } else {
                        alert(responseJson.data);
                    }
                }else{
                    alert(responseJson.msg)
                }
            },
            onerror: function(response){
                console.log("请求失败");
            }
        });
    }

}

function handleUpdateAddress(){
    if(unsafeWindow.location.href.indexOf('weidian.com/address/buyerAddAddress.html') > -1 && urlParams.purchaseAction === 'modifyAddress'){
        // 执行
    }else{
        return;
    }

    console.log('修改地址')

    // 有时候会提示,请填写正确收货人姓名,设置一个延迟
    // todo 拦截xhr请求

    setTimeout(()=>{
        const addressInfoDom = document.getElementsByClassName('address_info')[0]

        // 修改收件人姓名
        const recipientDom = addressInfoDom.getElementsByTagName('input')[0]
        recipientDom.value = urlParams.recipient
        recipientDom.dispatchEvent(new Event('input'))

        // 修改手机号码
        const phoneDom = addressInfoDom.getElementsByTagName('input')[1]
        phoneDom.value = urlParams.phone
        phoneDom.dispatchEvent(new Event('input'))

        const areaDom = document.getElementsByClassName('add_address_content add_city_content ')[0]
        const areaInfo = areaDom.innerText
        if(areaInfo.replace('暂不选择','') === urlParams.areaInfo){
            // 校验通过
        }else{
            alert('默认地址的所在区域`'+urlParams.areaInfo+'`和当前下单仓库不一致,请先添加该区域的地址/切换默认地址')
            window.location.href="https://weidian.com/address/buyerListAddress.html?wfr=c&ifr=itemdetail"
            return
        }

        // 修改详细地址
        const addressDom = document.getElementsByClassName('add_address_content street_content')[0]
        const textareaDom = addressDom.getElementsByTagName('textarea')[0]
        textareaDom.value = urlParams.streetInfo+urlParams.appendAddressKey
        textareaDom.dispatchEvent(new Event('input'))

        //点击 保存并使用按钮
        const divDom = document.getElementsByClassName('address_add_btn')[0]
        const saveAddressButtonDom = divDom.getElementsByClassName('add wd-theme__button1')[0]
        saveAddressButtonDom.click()

        setTimeout(()=>{
            unsafeWindow.close()
        },300)
    }, 500)



    // setTimeout(()=>{
    //     unsafeWindow.close()
    // },100)
}

function toWeidianAllUnpaid(){
    if(unsafeWindow.location.href.indexOf('weidian.com/?userid=1625746264') > -1 && urlParams.purchaseAction === 'toUnpaidOrdersPage'){
        // 预期执行
    }else{
        return;
    }

    if(unsafeWindow.API.isLogin()){
        unsafeWindow.location.href="https://weidian.com/user/order/list.php?type=1&purchaseAction=validateAndPay&token="+urlParams.token
    }
}

function toWeidianAllUnpaidAll(){
    if(unsafeWindow.location.href.indexOf('weidian.com/?userid=1625746264') > -1 && urlParams.purchaseAction === 'toUnpaidOrdersPageAll'){
        // 预期执行
    }else{
        return;
    }

    if(unsafeWindow.API.isLogin()){
        unsafeWindow.location.href="https://weidian.com/user/order/list.php?type=1&purchaseAction=validateAndPayAll&token="+urlParams.token
    }
}

function validateUnpaidOrders(){
    // https://weidian.com/user/order/list.php?type=1
    if(unsafeWindow.location.href.indexOf('weidian.com/user/order/list.php?type=1') > -1 && urlParams.purchaseAction === 'validateAndPay'){
        // 预期执行
    }else{
        return;
    }

    const unpaidOrders = unsafeWindow?.getData.list.result.listRespDTOList

    if (unpaidOrders && unpaidOrders.length > 0) {
        const ff = {
            weidianUnpaidOrderInfos: unpaidOrders
        }
        GM_xmlhttpRequest({
            method: "post",
            // url: 'http://127.0.0.1:48080/buffet/admin-api/agent-buyer/validate-purchase-order-nos-exist',
            url: 'https://erp.unstars.com/buffet/admin-api/agent-buyer/validate-purchase-order-nos-exist',
            data : JSON.stringify(ff),
            dataType: "json",
            headers: {
                "Content-Type" : "application/json",
                "Authorization":"Bearer "+urlParams.token
            },
            onload: function(response){
                const responseText = response.responseText
                console.log('请求成功响应',responseText);

                const json = JSON.parse(responseText);
                if(json.code === 200){
                    alert(json.data.description)
                }else{
                    alert(json.msg)
                }
            },
            onerror: function(response){
                console.log("请求失败",response);
            }
        });

    }
}

const allUnpaidOrders = []

function validateUnpaidOrdersAll(){
    // https://weidian.com/user/order/list.php?type=1
    if(unsafeWindow.location.href.indexOf('weidian.com/user/order/list.php?type=1') > -1 && urlParams.purchaseAction === 'validateAndPayAll'){
        // 预期执行
    }else{
        return;
    }

    console.log('validateUnpaidOrdersAll')

    const unpaidOrders = unsafeWindow?.getData.list.result.listRespDTOList

    if(unpaidOrders && unpaidOrders.length > 0){
        allUnpaidOrders.push(...unpaidOrders)
        const moreUnpaidOrderButton = document.getElementsByClassName('order_add_list')[0]
        if(moreUnpaidOrderButton){
            // moreUnpaidOrderButton.click()
        }
    }

}

function handleUnpaidOrderPage(orderPage){
    console.log('查询更多待付款111',orderPage)
    allUnpaidOrders.push(...orderPage.listRespDTOList)
    console.log('allUnpaidOrders',allUnpaidOrders)
    if(orderPage.lastPage){
        alert('已经拿到最后一页了')
        alert('准备校验数据')

        const ff = {
            weidianUnpaidOrderInfos: allUnpaidOrders
        }
        GM_xmlhttpRequest({
            method: "post",
            // url: 'http://127.0.0.1:48080/buffet/admin-api/agent-buyer/validate-purchase-order-nos-exist',
            url: 'https://erp.unstars.com/buffet/admin-api/agent-buyer/validate-purchase-order-nos-exist',
            data : JSON.stringify(ff),
            dataType: "json",
            headers: {
                "Content-Type" : "application/json",
                "Authorization":"Bearer "+urlParams.token
            },
            onload: function(response){
                const responseText = response.responseText
                console.log('请求成功响应',responseText);

                const json = JSON.parse(responseText);
                if(json.code === 200){
                    alert(json.data.description)
                }else{
                    alert(json.msg)
                }
            },
            onerror: function(response){
                console.log("请求失败",response);
            }
        });

    }else{
        console.log('模拟点击获取下一页数据')
        document.getElementsByClassName('order_add_list')[0].click()
    }
}

function handleOrderUpdateInfo(){
    if(unsafeWindow.location.href.indexOf('weidian.com/user/order-new/detail.php') > -1 && urlParams.purchaseAction === 'syncPaidInfo'){
        // 预期执行
    }else{
        return;
    }

    const orderInfo = unsafeWindow?.getData?.detail.result;
    console.log('订单信息handleOrderUpdateInfo:',orderInfo)

    if(orderInfo && urlParams.token){
        const info = {
            id: urlParams.purchaseOrderId,
            weidianOrderInfo: orderInfo
        }
        GM_xmlhttpRequest({
            method: "post",
            // url: 'http://127.0.0.1:48080/buffet/admin-api/agent-buyer/purchase-order-pay-success',
            url: 'https://erp.unstars.com/buffet/admin-api/agent-buyer/purchase-order-pay-success',
            data : JSON.stringify(info),
            dataType: "json",
            headers: {
                "Content-Type" : "application/json",
                "Authorization":"Bearer "+ urlParams.token
            },
            onload: function(response){
                const responseText = response.responseText
                console.log('请求成功响应',responseText);

                var json = JSON.parse(responseText);
                if(json.code === 200){
                    if('同步付款状态和信息成功' === json.data || '订单已关闭' === json.data){
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


}

function handleOrderSyncLogistics(){
    if(unsafeWindow.location.href.indexOf('weidian.com/user/order-new/detail.php')> -1 && urlParams.purchaseAction === 'syncLogisticsInfo'){
        // 符合
    }else {
        return
    }

    const orderId = urlParams.oid

    const orderInfo = unsafeWindow?.getData?.detail.result;
    console.log('订单信息:',orderInfo)

    const expressUrl = orderInfo.logisticsInfo.expressUrl

    GM_setValue(getOrderInfoKey(orderId),orderInfo)

    if(urlParams.token){
       // 带了token, 说明要尝试自动发货的
        if(expressUrl){
            // 有物流信息的地址 && token存在, 跳转发货
            unsafeWindow.location.href = expressUrl+'&purchaseAction=syncLogisticsInfo&token='+urlParams.token
        }else{
            unsafeWindow.close()
        }
    }
}

function handleOrderSyncLogistics_1(){
    if(unsafeWindow.location.href.indexOf('weidian.com/user/order-new/logistics.php') > -1 && urlParams.purchaseAction === 'syncLogisticsInfo'){
        // 符合
    }else{
        return
    }

    const orderId = urlParams.oid

    const orderLogisticsInfo = unsafeWindow?.getData?.orderLogistics.result;
    GM_setValue(getOrderLogisticsInfoKey(orderId),orderLogisticsInfo)

    console.log('订单物流信息: ',orderLogisticsInfo)
    if(orderLogisticsInfo.deliver_list && urlParams.token){
        const info = {
            weidianOrderNo: orderId,
            orderInfo: GM_getValue(getOrderInfoKey(orderId)),
            orderLogisticsInfo: GM_getValue(getOrderLogisticsInfoKey(orderId)),
        }
        GM_xmlhttpRequest({
            method: "post",
            // url: 'http://127.0.0.1:58080/buffet/admin-api/agent-buyer/weidian-deliver',
            url: 'https://erp.unstars.com/buffet/admin-api/agent-buyer/weidian-deliver',
            data : JSON.stringify(info),
            dataType: "json",
            headers: {
                "Content-Type" : "application/json",
                "Authorization":"Bearer "+urlParams.token
            },
            onload: function(response){
                const responseText = response.responseText
                console.log('请求成功响应',responseText);

                // GM_getTab(function(tab) {
                //     console.log('GM_getTab',tab)
                // });

                // GM_getTabs((tabs) => {
                //     for (const [tabId, tab] of Object.entries(tabs)) {
                //         console.log(`tab ${tabId}`, tab);
                //     }
                // });

                var json = JSON.parse(responseText);
                if(json.code === 200){
                    if('发货成功' === json.data){
                        unsafeWindow.close()
                    }else if('部分发货还没有更新' === json.data){
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
}

(function() {
    'use strict';

    handleWeidianAddOrderPreviewInfo()

    handleUpdateAddress()

    toWeidianAllUnpaid();
    validateUnpaidOrders();

    toWeidianAllUnpaidAll();
    validateUnpaidOrdersAll();

    handleOrderUpdateInfo()

    handleOrderSyncLogistics()
    handleOrderSyncLogistics_1()


    /**
     * 拦截并修改ajax请求
     */
    window.beforeXMLHttpRequestOpen = function (xhr, options) {
        // console.log('before open', xhr);
    };
    /**
     * 拦截并修改ajax请求
     */
    window.beforeXMLHttpRequestSend = function (xhr, body) {
        // console.log('before send', xhr);
        // 修改请求头
        // xhr.setRequestHeader('key1', 'value1');
    };

    /**
     * 重写open方法
     * https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/open
     */
    XMLHttpRequest.prototype.myOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
        // 用对象便于修改参数
        const options = {
            method: method,
            url: url,
            async: async,
            user: user,
            password: password
        };
        if ('function' === typeof window.beforeXMLHttpRequestOpen) {
            window.beforeXMLHttpRequestOpen(this, options);
        }
        this.myOpen(options.method, options.url, options.async);
    };

    /**
     * 重写send方法
     * https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/send
     */
    XMLHttpRequest.prototype.mySend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function (body) {
        if ('function' === typeof window.beforeXMLHttpRequestSend) {
            window.beforeXMLHttpRequestSend(this, body);
        }

        const self = this;

        const origin_onreadystatechange = this.onreadystatechange

        // console.log('this.onreadystatechange',this.onreadystatechange)

        // 监听readystatechange事件
        this.onreadystatechange = function() {
            let continue_origin = true

            // 当readyState变为4时获取响应
            if (self.readyState === 4) {
                // self 里面就是请求的全部信息
                // console.log('onreadystatechange self',self.responseURL,self)
                if (self.responseURL.indexOf('weidian.com/vbuy/CreateOrder/1.0') > -1) {
                    console.log('onreadystatechange self.response',self.responseURL,self.response)
                    continue_origin = false;
                    // 微店下单成功
                    const order_id = self.response.result.order_list[0].order_id;
                    const info = {
                        id: urlParams.purchaseOrderId,
                        platform: '微店-原链',
                        purchaseOrderNo: order_id
                    };
                    GM_xmlhttpRequest({
                        method: "post",
                        url: 'https://erp.unstars.com/buffet/admin-api/agent-buyer/purchase-order-to-pay',
                        data: JSON.stringify(info),
                        dataType: "json",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + urlParams.token
                        },
                        onload: function (response) {
                            const responseText = response.responseText
                            console.log('请求成功响应', responseText);

                            var json = JSON.parse(responseText);
                            if (json.code === 200) {
                                // alert('采购下单待付款-关联成功')
                                unsafeWindow.close()
                            } else {
                                alert(json.msg)
                            }
                        },
                        onerror: function (response) {
                            console.log("请求失败");
                        }
                    });
                }else if(self.responseURL.indexOf('weidian.com/tradeview/buyer.order.list/1.1') > -1){
                    const moreUnpaidOrderParams = getUrlParams('111?'+self._request?.data);
                    const param = JSON.parse(moreUnpaidOrderParams.param)
                    const page_no = param.page_no

                    console.log('page_no',page_no)

                    const orderPage = self.response.result

                    // 延迟一点执行,避免频率过快
                    setTimeout(()=>{
                        handleUnpaidOrderPage(orderPage)
                    },100)


                    // console.log('查询更多待付款',self,self._request.data,moreUnpaidOrderParams)

                }

                // JSON.parse(self.response);可以获取到返回的数据
            }

            if(continue_origin){
                origin_onreadystatechange()
            }else{
                // alert('取消origin_onreadystatechange')
            }
        };

        this.mySend(body);
    };

    // Your code here...
})();