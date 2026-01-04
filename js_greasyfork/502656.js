// ==UserScript==
// @name         微店订单详情/自动发货-new
// @namespace    http://tampermonkey.net/
// @version      2025-01-22_21_25
// @description  用于erp微店订单详情/自动发货-已迁移到weidian-brower-plugin
// @author       liukx
// @license      MIT
// @match        https://*.weidian.com/user/order-new/detail.php*
// @match        https://weidian.com/user/order-new/logistics.php*
// @match        https://weidian.com/buy/add-order/index.php*
// @match        https://weidian.com/address/buyerAddAddress.html*
// @match        https://weidian.com/user/order/list.php?type=1*
// @match        https://weidian.com/?userid=1625746264*
// @match        https://sso.weidian.com/login/index.php*
// @match        https://weidian.com/weidian-h5/user/index.html*
// @match        https://weidian.com/decoration/uni-mine/*
// @match        https://h5.weidian.com/miniapp/uni-user/*
// @match        https://d.weidian.com/weidian-pc/weidian-loader/?weidianShopBalance*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=weidian.com
// @connect      erp.unstars.com
// @connect      erp.mtkjn.com
// @connect      127.0.0.1
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @grant        GM_listValues
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_getTab
// @grant        GM_getTabs
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/502656/%E5%BE%AE%E5%BA%97%E8%AE%A2%E5%8D%95%E8%AF%A6%E6%83%85%E8%87%AA%E5%8A%A8%E5%8F%91%E8%B4%A7-new.user.js
// @updateURL https://update.greasyfork.org/scripts/502656/%E5%BE%AE%E5%BA%97%E8%AE%A2%E5%8D%95%E8%AF%A6%E6%83%85%E8%87%AA%E5%8A%A8%E5%8F%91%E8%B4%A7-new.meta.js
// ==/UserScript==

class Utils {

}

const windowScriptInfoHolder = {}

function GM_deleteValues(){
    const listValues = GM_listValues()
    console.log('GM_listValues to delete',listValues)
    for (let listValue of listValues) {
        GM_deleteValue(listValue);
    }
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

function getAddressIdKey(purchaseOrderId){
    return 'addressId_'+purchaseOrderId
}

function getWeidianUserIdKey(userId){
    return 'weidianUserId_'+userId
}

const urlParams = getUrlParams(window.location.href);

function windowClose(){
    // 封装一下, 方便控制某些情况下不需要关闭窗口
    unsafeWindow.close()
}

function getAutoPurchaseString(){
    if(urlParams.autoPurchase === 'true'){
        return 'true'
    }else {
        return 'false'
    }
}

function isAutoPurchase(){
    return getAutoPurchaseString() === 'true'
}

function deleteBuyerAddress(){
    // 删除本次使用的地址
    const xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.withCredentials = true
    xmlHttpRequest.open('post','https://thor.weidian.com/address/buyerDeleteAddress/1.0',true)
    xmlHttpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

    const deleteAddress = {buyer_address_id: windowScriptInfoHolder.toDeleteAddressId, bizType: 0}
    xmlHttpRequest.send('param='+encodeURIComponent(JSON.stringify(deleteAddress)));

    xmlHttpRequest.onreadystatechange = function () {
        if (xmlHttpRequest.readyState === 4) {
            console.log('删除地址响应结果: ',xmlHttpRequest.responseText);
            // debugger
            GM_deleteValue(getAddressIdKey(urlParams.purchaseOrderId))

            windowClose()
        }
    };
}

function windowAutoClose(){
    if(urlParams.pageAction === 'autoClose'){
        windowClose()
    }else if(window.location.href.indexOf('pageAction=autoClose') > -1){
        //重登的时候同时又在下单,可能跳转到了会员店铺的个人中心 weidian.com/decoration/uni-mine/?pageAction=autoClose#/
        windowClose()
    }else if(window.location.href.indexOf('pageAction=saveUserInfo') > -1){
        setTimeout(()=>{
            // linux 火狐, 接口那里关闭不了 这里处理
            windowClose()
        },3000)
    }
}

function timeOutClose(){
    if(isAutoPurchase()){
        // 设置15秒, 用好的处理器跑起来很快
        setTimeout(()=>{
            windowClose()
        },15*1000)
    }
}

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
    const purchaseOrderId = urlParams.purchaseOrderId

    if(weidianAddOrderPreviewInfo){
        const buyer_id = weidianAddOrderPreviewInfo.buyer.buyer_id
        const htmlString = `
            <div style="font-size: 20px;font-weight: bold;color: red">微店buyerId: ${buyer_id} 地址Id: ${GM_getValue(getAddressIdKey(purchaseOrderId))} </div>
            <div style="font-size: 20px;font-weight: bold;color: red">微店昵称: ${GM_getValue(getWeidianUserIdKey(buyer_id))?.nickName} 微店手机号: ${GM_getValue(getWeidianUserIdKey(buyer_id))?.phone} </div>
            <div style="font-size: 20px;font-weight: bold;color: blue">采购订单id: ${urlParams.purchaseOrderId} ${urlParams.autoPurchase ? '自动采购':'手动采购'} </div>
        `
        const buyerInfo_dom = document.createElement('div');
        buyerInfo_dom.innerHTML = htmlString;
        buyerInfo_dom.style.paddingLeft = '30px'
        document.getElementsByClassName('buyer_address_content')[0].appendChild(buyerInfo_dom)
    }

    const statusMessage = unsafeWindow.getData?.order?.status.message
    if(statusMessage === '人潮拥挤, 请稍后再试'){
        // 下单频率过快 , 重载页面 , 等待3秒关闭窗口

        const timeoutSecond = Math.floor(Math.random() * 5) + 1

        setTimeout(()=>{
            // unsafeWindow.location.reload()
            windowClose()
        },timeoutSecond * 1000)
        return;
    }

    if((weidianAddOrderPreviewInfo || statusMessage === '系统开小差了, 请稍后再试' || statusMessage === '账号系统繁忙,请稍后重试') && urlParams.token){
        const requestData = {
            purchaseOrderId: purchaseOrderId,
            autoPurchase: getAutoPurchaseString(),
            weidianAddOrderPreviewInfo: weidianAddOrderPreviewInfo,
            statusMessage: unsafeWindow.getData?.order?.status.message,
        }

        console.log('微店下单预览检查: ',urlParams.purchaseOrderId)

        GM_xmlhttpRequest({
            method: "post",
            // url: 'http://127.0.0.1:58080/buffet/admin-api/agent-buyer/purchase-order-validate-before-place',
            url: 'https://erp.mtkjn.com/buffet/admin-api/agent-buyer/purchase-order-validate-before-place',
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

                const ff = document.createElement('div');
                // 可能空指针
                ff.textContent = responseText;
                ff.style.fontSize = '20px'
                ff.style.fontWeight = 'bold'
                ff.style.color = 'red'
                ff.style.textAlign = 'center'

                document.getElementsByClassName('buyer_address_content')[0].append(ff)

                if(responseJson.code === 200){
                    const validateResult = responseJson.data.validateResult;
                    if (validateResult === 'MODIFY_ADDRESS') {
                        const info = responseJson.data.info

                        let autoRecogniseAddressUrl = ` https://weidian.com/address/buyerAddAddress.html?callback=cart_buy&wfr=c&ifr=itemdetail&purchaseOrderId=${purchaseOrderId}&autoRecogniseAddress=${encodeURIComponent(info.autoRecogniseAddress)}`

                        const purchaseOrderId_referred_addressId = GM_getValue(getAddressIdKey(purchaseOrderId));
                        if(purchaseOrderId_referred_addressId){
                            // debugger
                            console.log('读取到采购单关联的addressId,准备更新地址,addressId:',purchaseOrderId_referred_addressId)
                            autoRecogniseAddressUrl = autoRecogniseAddressUrl+`&addressId=${purchaseOrderId_referred_addressId}`
                        }else{
                            console.log('purchaseOrderId_referred_addressId不存在')
                        }

                        // if(!weidianAddOrderPreviewInfo.buyer_address.address_str.startsWith(info.areaInfo)){
                        //     // alert('默认地址的所在区域和仓库的所在区域`'+info.areaInfo+'`对不上')
                        //
                        //     windowScriptInfoHolder.addressInfo = info
                        //     // 点击地址栏会调用查询地址,通过xhr拦截找到区域相同的地址, 跳转过去修改
                        //     document.getElementsByClassName('address_info')[0].click()
                        //     // window.open("https://weidian.com/address/buyerListAddress.html?wfr=c&ifr=itemdetail","_blank")
                        //     // windowClose()
                        //     return
                        // }

                        // const url = `https://weidian.com/address/buyerAddAddress.html?addressId=${weidianAddOrderPreviewInfo.buyer_address.address_id}&callback=default_back&wfr=c&ifr=itemdetail&purchaseAction=modifyAddress&recipient=${info.recipient}&phone=${info.phone}&areaInfo=${info.areaInfo}&streetInfo=${info.streetInfo}&appendAddressKey=${info.appendAddressKey}`

                        const newWindow = window.open(autoRecogniseAddressUrl,"_blank")
                        console.log('buyerAddAddress.html newWindow',newWindow)
                        setInterval(()=>{
                            // 这里定时器不用加结束, 因为还有另外一个定时器控制窗口关闭的
                            if(newWindow.closed){
                                // 这里重载了,会触发脚本重新走流程
                                unsafeWindow.location.reload()
                            }
                            // 这个超时时间不能调太低了, 否则会出现提示`人潮汹涌,请稍候再试`
                        },500)
                        // alert('需要修改地址:\n' + JSON.stringify(responseJson.data));
                    } else if (validateResult === 'CAN_PLACE_ORDER') {
                        // alert("校验通过,可以下单");

                        const newElement = document.createElement('div');
                        newElement.textContent = '校验通过,可以付款';
                        newElement.style.fontSize = '20px'
                        newElement.style.fontWeight = 'bold'
                        newElement.style.color = 'red'
                        pay_footer_content_dom.appendChild(newElement)

                        pay_footer_content_dom.style.display = 'block'

                        windowScriptInfoHolder.toDeleteAddressId = weidianAddOrderPreviewInfo.buyer_address.address_id

                        if(responseJson.data.otherNoticeResults.length > 0){
                            // 其实是订单需要备注, 可能有多个商品同时备注
                            if(responseJson.data.otherNoticeResults.includes('商品需要备注')){
                                // window.open(`https://erp.mtkjn.com/buffet/#/order/purchase-info/${urlParams.purchaseOrderId}`)
                            }

                            // 需要备注等等
                            alert(responseJson.data.otherNoticeResults.join(","))
                            return;
                        }

                        const submit_order_button = document.getElementById('pay_btn').getElementsByTagName('span')[0]
                        if(submit_order_button.innerText !== '提交订单'){
                            alert('没有找到页面的"提交订单"按钮')
                            return;
                        }


                        if(isAutoPurchase() || urlParams.autoSubmit === 'true'){
                            submit_order_button.click()

                            setTimeout(()=>{
                                // 有时候点了 提交订单 按钮,提示正在下单,又下不成功,再手动点击按钮也不行,刷新一下页面就可以,因此增加一个补偿
                                unsafeWindow.location.reload()
                            },3000)
                        }
                    } else if(validateResult === 'BG_CANCEL_ORDER'){
                        windowClose()
                    } else {
                        alert(responseJson.data);
                    }
                }else{
                    // todo 无法采购的 直接回退
                    const newElement = document.createElement('div');
                    // 可能空指针
                    newElement.textContent = responseJson.msg || JSON.stringify(responseJson);
                    newElement.style.fontSize = '30px'
                    newElement.style.fontWeight = 'bold'
                    newElement.style.color = 'red'
                    newElement.style.textAlign = 'center'

                    document.getElementsByClassName('buyer_address_content')[0].append(newElement)


                    // alert(responseJson.msg)
                }
            },
            onerror: function(response){
                console.log("请求失败");
            }
        });
    }

}

function handleAddAddress(){
    if(unsafeWindow.location.href.indexOf('weidian.com/address/buyerAddAddress.html') > -1 && urlParams.autoRecogniseAddress){
        // 执行
    }else{
        return;
    }

    // 自动识别地址(添加/修改) 都是这个

    console.log('添加自动识别地址: ',urlParams.autoRecogniseAddress)

    const analysis_dom = document.getElementsByClassName('analysis')[0];
    const analysis_textarea_dom = analysis_dom.getElementsByTagName('textarea')[0]

    analysis_textarea_dom.addEventListener('input', function(event) {
        // console.log('Input value changed to: ' + event.target.value);
        const autoRecognise_dom = analysis_dom.getElementsByClassName('wd-theme__button1')[0]
        autoRecognise_dom.click()

        const addressInfoDom = document.getElementsByClassName('address_info')[0]
        // 修改收件人姓名
        const recipientDom = addressInfoDom.getElementsByTagName('input')[0]

        // autoRecognise_dom.click() 操作会调用接口识别地址,延迟久一点
        setInterval(()=>{
            if(recipientDom.value && recipientDom.value.length>=2){
                // 有时候会提示,请填写正确收货人姓名, 是由于地址识别出来了还没有填充到 收件人姓名上面去,就点了click按钮, 判断大于等于2个字符
                // 点击按钮, 拦截了保存地址的接口,addressId保存成功之后自动关闭
                console.log('点击保存并使用按钮')
                document.getElementsByClassName('address_add_btn')[0].getElementsByClassName('wd-theme__button1')[0].click()
            }
        },200)
    });

    analysis_textarea_dom.value = urlParams.autoRecogniseAddress
    analysis_textarea_dom.dispatchEvent(new Event('input'))

    setTimeout(()=>{
        // 有时候修改地址,会提示系统开小差了,请稍候再试,这个时候需要刷新一下页面,补偿措施
        console.log('刷新一下页面,补偿措施')
        unsafeWindow.location.reload()
    },1000)

}

function weidianAutoLogin(){
    if(unsafeWindow.location.href.indexOf('sso.weidian.com/login/index.php') > -1){
        /** 用户重新登录的时候,清除油猴的设置的缓存,这个时机比较合适 */
        GM_deleteValues()

        if(urlParams.weidian_username){
            // erp主动发起登录
        }else if(unsafeWindow.location.href.indexOf('purchaseAction') > -1){
            // 登录失效自动重新登录
        }else if(unsafeWindow.location.href.indexOf('autoRecogniseAddress') > -1){
            // 新建/修改地址时登录失效,自动重新登录
        }else{
            // 手动登录先不管
            return;
        }
    }else{
        return;
    }

    let weidian_username = urlParams.weidian_username
    let weidian_password = urlParams.weidian_password

    if(weidian_username && weidian_password){
        localStorage.setItem("weidian_username",weidian_username)
        localStorage.setItem("weidian_password",weidian_password)
    }else if(localStorage.getItem('weidian_username') && localStorage.getItem('weidian_password')){
        weidian_username = localStorage.getItem('weidian_username')
        weidian_password = localStorage.getItem('weidian_password')
    }

    // 延迟时间调长一点,有时候网络卡一点就会失败的, 后面可以改成 setInterval
    let cur_count = 0
    const login_interval = setInterval(()=>{
        const login_init_by_login_dom = document.getElementById('login_init_by_login');

        if(login_init_by_login_dom){
            clearInterval(login_interval)
            // 可以登录了
            console.log('login_init_by_login_dom已加载成功,可以登录')
        } else if(cur_count>=600){
            // 设置大一点,还有自动关闭窗口的  这里设置大一点也不影响的
            clearInterval(login_interval)
            console.log('login_init_by_login_dom加载超时,清除定时器')
            return;
        }else{
            cur_count++
            console.log('login_init_by_login_dom不存在,已尝试次数: ',cur_count)
            return
        }

        if(login_init_by_login_dom){
            login_init_by_login_dom.click()

            setTimeout(()=>{

                // 这个也可能没有加载出来, 后面把定时器挪过来
                document.getElementsByClassName('login_content_h4')[0].click()

                setTimeout(()=>{
                    document.getElementById('login_isRegiTele_input').value = weidian_username
                    document.getElementById('login_pwd_input').value = weidian_password
                    document.getElementById('login_pwd_submit').click()
                    document.getElementById('login_pwd_submit').click()
                },1000)

            },2000)
        }

    },1000)


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

    // 显示实际订单数量
    const statusCounts = unsafeWindow?.getData.count.result.statusCounts
    const statusCounts_dom = document.createElement('div');
    const htmlString = `
        <div style="font-size: 20px;font-weight: bold;color: red;margin-left: 30px"> 
            <div>
                全部: ${statusCounts['0']}; 
                待付款: ${statusCounts['1']}; 
                待发货: ${statusCounts['2']}; 
            </div>
            <div>
                待收货: ${statusCounts['3']}; 
                待评价: ${statusCounts['4']}; 
                退款/售后: ${statusCounts['5']}; 
            </div>
        </div>
    `
    statusCounts_dom.innerHTML = htmlString;
    document.getElementsByClassName('tab_content')[0].appendChild(statusCounts_dom)

    const unpaidOrders = unsafeWindow?.getData.list.result.listRespDTOList

    if (unpaidOrders && unpaidOrders.length > 0) {
        const ff = {
            weidianUnpaidOrderInfos: unpaidOrders
        }
        GM_xmlhttpRequest({
            method: "post",
            // url: 'http://127.0.0.1:58080/buffet/admin-api/agent-buyer/validate-purchase-order-nos-exist',
            url: 'https://erp.mtkjn.com/buffet/admin-api/agent-buyer/validate-purchase-order-nos-exist',
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
            // url: 'http://127.0.0.1:58080/buffet/admin-api/agent-buyer/validate-purchase-order-nos-exist',
            url: 'https://erp.mtkjn.com/buffet/admin-api/agent-buyer/validate-purchase-order-nos-exist',
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
            autoPurchase: getAutoPurchaseString(),
            weidianOrderInfo: orderInfo,
            ignoreAddressValidate: urlParams.ignoreAddressValidate ? 'true' : 'false'
        }

        GM_xmlhttpRequest({
            method: "post",
            // url: 'http://127.0.0.1:58080/buffet/admin-api/agent-buyer/purchase-order-pay-success',
            url: 'https://erp.mtkjn.com/buffet/admin-api/agent-buyer/purchase-order-pay-success',
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
                    if('同步付款状态和信息成功' === json.data || '订单待付款' === json.data || '订单已关闭' === json.data || '系统已处理' === json.data){
                        windowClose()
                    }else{
                        alert(json.data)
                    }
                }else{
                    alert(json.msg)
                }
            },
            onerror: function(response){
                console.log("请求失败",response);
                alert('请求失败,'+response.finalUrl)
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
            unsafeWindow.location.href = `${expressUrl}&purchaseAction=syncLogisticsInfo&autoPurchase=${getAutoPurchaseString()}&purchaseOrderId=${urlParams.purchaseOrderId}&token=${urlParams.token}`
        }else{
            // 没有物流的
            const info = {
                purchaseOrderId: urlParams.purchaseOrderId,
                autoPurchase: getAutoPurchaseString(),
                weidianOrderNo: orderId,
                orderInfo: GM_getValue(getOrderInfoKey(orderId)),
            }
            GM_xmlhttpRequest({
                method: "post",
                // url: 'http://127.0.0.1:58080/buffet/admin-api/agent-buyer/weidian-deliver',
                url: 'https://erp.mtkjn.com/buffet/admin-api/agent-buyer/weidian-deliver',
                data : JSON.stringify(info),
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
                        if('等待商家发货' === json.data){
                            windowClose()
                        }else if('系统已处理' === json.data){
                            windowClose()
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
            purchaseOrderId: urlParams.purchaseOrderId,
            weidianOrderNo: orderId,
            autoPurchase: getAutoPurchaseString(),
            orderInfo: GM_getValue(getOrderInfoKey(orderId)),
            orderLogisticsInfo: GM_getValue(getOrderLogisticsInfoKey(orderId)),
        }
        GM_xmlhttpRequest({
            method: "post",
            // url: 'http://127.0.0.1:58080/buffet/admin-api/agent-buyer/weidian-deliver',
            url: 'https://erp.mtkjn.com/buffet/admin-api/agent-buyer/weidian-deliver',
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
                        windowClose()
                    }else if('部分发货还没有更新' === json.data){
                        windowClose()
                    }else if('系统已处理' === json.data){
                        windowClose()
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

function syncWeidianShopBalance(){
    if(unsafeWindow.location.href.indexOf('https://d.weidian.com/weidian-pc/weidian-loader/?weidianShopBalance') > -1){
        // 符合
    }else{
        return
    }

    const token = window.location.href.replace(/.*?weidianShopBalance(\w+)#.*/,'$1')
    const weidian_label = window.location.href.replace(/.*?weidian_label=(.*)/,'$1')

    setTimeout(()=>{
        const weidianShopBalanceString = document.getElementsByClassName('valid-amount__number')[0].getElementsByTagName('span')[0].innerText

        console.log('weidianShopBalanceString: ',weidianShopBalanceString)

        const data = {
            cnyBalance: weidianShopBalanceString,
            username: decodeURIComponent(escape(atob(weidian_label))) ,
        }

        GM_xmlhttpRequest({
            method: 'POST',
            // url: 'http://127.0.0.1:58080/buffet/admin-api/taobao/iop/push-kuajingbao-balance-message',
            url: 'https://erp.mtkjn.com/buffet/admin-api/taobao/iop/push-kuajingbao-balance-message',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            data: JSON.stringify(data),
            onload: function (response) {
                console.log('Response:', response.responseText)

                // 延迟5秒钟关闭窗口
                setTimeout(()=>{
                    windowClose()
                },5*1000)
            },
            onerror: function (error) {
                console.error('Error:', error)
            },
        })

    },1000)

}

(function() {
    'use strict';

    windowAutoClose()

    timeOutClose()

    weidianAutoLogin();

    handleWeidianAddOrderPreviewInfo()

    handleAddAddress()

    // handleUpdateAddress()

    toWeidianAllUnpaid();
    validateUnpaidOrders();

    toWeidianAllUnpaidAll();
    validateUnpaidOrdersAll();

    handleOrderUpdateInfo()

    handleOrderSyncLogistics()
    handleOrderSyncLogistics_1()

    syncWeidianShopBalance()


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
        // console.log('before send 1', xhr._request?.url,body);

        const requestUrl = xhr._request?.url

        // 地址不会混用的 其实可以把这个去掉了

        if(requestUrl && requestUrl.indexOf('weidian.com/vbuy/CreateOrder/1.0') > -1){
            const addressId = GM_getValue(getAddressIdKey(urlParams.purchaseOrderId))
            if(addressId && typeof addressId === 'number'){

            }else {
                const message = '采购订单关联的微店地址id异常,请在新窗口编辑默认地址,保存并使用,再重试,否则可能会出现地址id一直undefined'
                alert(message)
                window.open('https://weidian.com/address/buyerListAddress.html',"_blank")
                throw new Error(message)
            }

            // console.log('body',body)
            if(body.indexOf(addressId)>-1){
                // 按照预期的地址提交的
            }else {
                // todo 可能需要关闭窗口 , 或者是刷新页面
                // 可能并行下单,串地址了
                const message = `微店下单使用的微店地址id: ${body}不包含${addressId}`
                alert(message)
                throw new Error(message)
            }
        }

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
                    const buyer_id = self.response.result.buyer.buyer_id;
                    const info = {
                        id: urlParams.purchaseOrderId,
                        platform: '微店-原链',
                        purchaseOrderNo: order_id,
                        weidianBuyerId: buyer_id
                    };
                    GM_xmlhttpRequest({
                        method: "post",
                        // url: 'http://127.0.0.1:58080/buffet/admin-api/agent-buyer/purchase-order-to-pay',
                        url: 'https://erp.mtkjn.com/buffet/admin-api/agent-buyer/purchase-order-to-pay',
                        data: JSON.stringify(info),
                        dataType: "json",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + urlParams.token
                        },
                        onload: function (response) {
                            const responseText = response.responseText
                            console.log('请求成功响应', responseText);

                            const json = JSON.parse(responseText);
                            if (json.code === 200) {
                                // alert('采购下单待付款-关联成功')

                                deleteBuyerAddress()
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

                }else if(self.responseURL.indexOf('weidian.com/address/buyerAddAddress/1.0') > -1 && urlParams.purchaseOrderId){
                    // 微店添加新地址  weidian.com/address/buyerAddAddress/1.0
                    // debugger
                    const addressId = self.response.result.id
                    GM_setValue(getAddressIdKey(urlParams.purchaseOrderId),addressId)
                    // console.log('ererererere 微店添加新地址',self.response.result,addressId)
                    // alert('微店添加新地址'+ GM_getValue(getAddressIdKey(urlParams.purchaseOrderId)))
                    windowClose()
                }else if(self.responseURL.indexOf('weidian.com/address/buyerUpdateAddress/1.0') > -1 && urlParams.purchaseOrderId){
                    // https://thor.weidian.com/address/buyerUpdateAddress/1.0 修改地址不用管,先拿到了地址id了,直接关闭
                    // debugger
                    windowClose()
                }else if(self.responseURL.indexOf('weidian.com/udccore/udc.user.getUserInfoById/1.0') > -1){
                    const userInfo = self.response.result

                    const saveUserInfo = {nickName: userInfo.basic.encryptedNickName,phone:userInfo.phone.telephone,userId: userInfo.phone.userId}
                    GM_setValue(getWeidianUserIdKey(userInfo.phone.userId),saveUserInfo)

                    console.log('saveUserInfo',saveUserInfo)

                    if(unsafeWindow.location.href.indexOf('pageAction=saveUserInfo') > -1){
                        windowClose()
                    }
                }else if(self.responseURL.indexOf('weidian.com/address/buyerGetAddressList/1.0') > -1){
                    const weidianAddressList = self.response.result
                    const addressInfo = windowScriptInfoHolder.addressInfo
                    if(urlParams.purchaseAction === 'createOrder' && addressInfo){
                        console.log('createOrder buyerGetAddressList',weidianAddressList,addressInfo)

                        const matchAreaInfoAddressList = weidianAddressList.filter(weidianAddress=>{
                            if(weidianAddress.addressStrTown === ('中国'+addressInfo.areaInfo)){
                                return true
                            }else{
                                return false
                            }
                        })

                        console.log('matchAreaInfoAddressList',matchAreaInfoAddressList)

                        if(matchAreaInfoAddressList.length === 0){
                            alert(`地址还没有添加所在区域'${addressInfo.areaInfo}'`)
                        }else {
                            const url = `https://weidian.com/address/buyerAddAddress.html?addressId=${matchAreaInfoAddressList[0].id}&callback=default_back&wfr=c&ifr=itemdetail&purchaseAction=modifyAddress&recipient=${addressInfo.recipient}&phone=${addressInfo.phone}&areaInfo=${addressInfo.areaInfo}&streetInfo=${addressInfo.streetInfo}&appendAddressKey=${addressInfo.appendAddressKey}`
                            const newWindow = window.open(url,"_blank")
                            console.log('buyerAddAddress.html newWindow',newWindow)
                            setTimeout(()=>{
                                unsafeWindow.location.reload()
                            },2000)
                        }
                    }
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
