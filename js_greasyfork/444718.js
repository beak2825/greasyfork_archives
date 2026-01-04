// ==UserScript==
// @name         appendModel
// @namespace    http://tampermonkey.net/
// @version      10.01
// @description  append model in orderDetailAddPage
// @author       FengXia
// @match        http://147.107.106.156/*
// @match        http://22.13.25.247/*
// @icon
// @grant        none
// @license MIT
// @require https://greasyfork.org/scripts/448895-elementgetter%E5%BA%93/code/ElementGetter%E5%BA%93.js?version=1077494
// @require https://unpkg.com/ajax-hook@2.1.3/dist/ajaxhook.min.js
// @downloadURL https://update.greasyfork.org/scripts/444718/appendModel.user.js
// @updateURL https://update.greasyfork.org/scripts/444718/appendModel.meta.js
// ==/UserScript==
 
 
(function() {
    let re_url = /(\b25[0-5]|\b2[0-4][0-9]|\b[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/;
    let temp_url = window.location.href;
    window.site_url;
    window.test = re_url.exec(temp_url)[0];
    const elmGetter = new ElementGetter();  //初始化ElementGetter
    let url_bool = false;   //网址判断变量
    let add_in_url = /storage\/showPurchaseEnterDetailAddPage\.do\?supplierid=[0-9\-]{2,}&type=[0-9\-]{1,}&_=[0-9]{13}$/
    ah.proxy({  //ajax hook
        //请求发起前进入
        onRequest: async (config, handler) => {
            // console.log(config.url)
            if (config.url==='sales/getGoodsDetail.do'){    //判断xhr网址是否是获取新增订单商品
                url_bool =true;
            }else if(config.url==='sales/getReceiptAndRejectBillList.do'){
                config.body = config.body.replace(/rows=\d+/, "rows=5000");
            }else if (typeof(config.url) === 'string' ? config.url.search(add_in_url) === 0 : false) {    //判断xhr网址是否是获取新增订单商品
                elmGetter.each('#storage-dialog-purchaseEnterAddPage-content', document, add_history_price => {
                    // console.log(add_history_price);
                    const div = add_history_price.parentNode;
                    div.style.width = '1001px'
                    let div_string = `
<div class="panel window" id="addhistoryinprice" style="width: 320px; left:681px">
<div class="panel-header panel-header-noborder window-header" style="width: 320px;">
<div class="panel-title" style="">商品历史进价</div>
</div>
<div class="easyui-layout layout easyui-fluid" data-options="fit:true" style="width: 320px; height: 424px;">
<div class="panel layout-panel layout-panel-center" style="width: 320px; left: 0px; top: 0px;">
<div data-options="region:'center',border:false" title="" class="panel-body panel-body-noheader panel-body-noborder layout-body" style="width: 600px; height: 424px;">
<table cellpadding="0" cellspacing="0">
<tbody>
<tr class="datagrid-header-row">
<td class="len120">日期</td>
<td class="len100">数量</td>
<td class="len100">单价</td>
</tr>
</tbody></table>
<table cellpadding="0" cellspacing="0">
<tbody id="table_row">
</tbody></table>
</div>
</div>
</div>
</div>
`
                    addElement(div, '#addhistoryinprice', div_string, 'afterbegin')
                });
 
                // updateData(response.response);
                // console.log(config)
            }else if(config.url === 'basefiles/computeGoodsByUnitnum.do') {
                // handler.next(config);
                // let products_customer = getUrlStr(config.body);
                // let products_customer = document.querySelector('[name="purchaseEnter.supplierid"] object')
 
                // let brand_id = await elmGetter.get('[name="purchaseEnter.supplierid"]');
                let brand_id = document.querySelector('[name="purchaseEnter.supplierid"]')
                if(brand_id) {
                    let objext_str = JSON.parse(brand_id.getAttribute('object'));
                    let products = /[0-9\-]{7,}/;
                    let products_id = config.body.match(products);
                    queryHistoryInPrice(objext_str['id'], products_id[0])
                }
            }
            handler.next(config);
        },
        //请求成功后进入
        onResponse: (response, handler) => {
            if (url_bool) { //
                // console.log(response.response);
                updateData(response.response);
                url_bool =false;
            }
 
            handler.next(response)
        }
    });
 
    // module 给销售核销增加单据搜索
    elmGetter.get('input[name="saleorderid"]').then(input_order => {
        input_order.addEventListener("keypress", addSearch,true);
        // console.log(order);
    });
 
    // module 给新增销售订单的单号元素添加重复订单查询监听
    elmGetter.each('#sales-sourceid-orderAddPage', document, order => {
        order.addEventListener("focusout", addListener,true);
        // console.log(order);
    });
 
    // module 给新增退货通知单的单号元素添加重复退货单查询监听
    elmGetter.each('#sales-sourceid-rejectBillAddPage', document, out_order => {
        out_order.addEventListener("focusout", addListenerOutOrder,true);
        // console.log(out_order);
    });
 
 
    // module 订单添加规格
    elmGetter.each('#remark', document, add_model => {
        const table_tr=add_model.parentNode.parentNode;
        let model_string = `
<td>规格:</td>
<td><input id="products_model" class="len150 readonly" readonly="readonly" name="model" placeholder=""></td>
</tr>`
        addElement(table_tr,'#products_model',model_string,'beforeend')
    });
 
    // module 换货单添加'*'监控，自动完成正负
    elmGetter.each('#sales-form-swapOrderDetailAddPage', document, swap => {
        if (swap) {
            // console.log('find')
            swap.addEventListener('keydown', checkKey);
        }
    });
 
    // module 订单添加最新采购价
    elmGetter.each('#sales-loading-orderDetailAddPage', document, add_price => {
        const table = add_price.parentNode.parentNode;
        let price_string = `
<tr>
<td>最新采购价：</td>
<td><input id="products_price" class="len150 readonly" readonly="readonly" name="newstorageprice" placeholder="">
</td>
</tr>`
        addElement(table,'#products_price',price_string,'beforeend')
    });
 
 
    // module 销售单添加历史销售明细
    elmGetter.each('#sales-dialog-orderAddPage-content', document, add_history_price => {
        // console.log(add_history_price);
        const div = add_history_price.parentNode;
        div.style.width = '1201px'
        let div_string = `
<div class="panel window" id="addhistoryprice" style="width: 600px; left:601px">
<div class="panel-header panel-header-noborder window-header" style="width: 600px;">
<div class="panel-title" style="">商品历史价格</div>
</div>
<div class="easyui-layout layout easyui-fluid" data-options="fit:true" style="width: 600px; height: 424px;">
<div class="panel layout-panel layout-panel-center" style="width: 600px; left: 0px; top: 0px;">
<div data-options="region:'center',border:false" title="" class="panel-body panel-body-noheader panel-body-noborder layout-body" style="width: 600px; height: 424px;">
<table cellpadding="0" cellspacing="0">
<tbody>
<tr class="datagrid-header-row">
<td class="len120">日期</td>
<td class="len100">数量</td>
<td class="len100">单价</td>
<td class="len100">出库数量</td>
<td class="len100">验收单价</td>
</tr>
</tbody></table>
<table cellpadding="0" cellspacing="0">
<tbody id="table_row">
</tbody></table>
</div>
</div>
</div>
</div>
`
        addElement(div,'#addhistoryprice',div_string,'afterbegin')
    });
 
    // module 换货单添加历史销售明细
    elmGetter.each('#sales-dialog-swapOrderAddPage-content', document, add_history_swap => {
        // console.log(add_history_price);
        const div = add_history_swap.parentNode;
        div.style.width = '1201px'
        let div_string = `
<div class="panel window" id="addhistoryswap" style="width: 600px; left:601px">
<div class="panel-header panel-header-noborder window-header" style="width: 600px;">
<div class="panel-title" style="">商品历史价格</div>
</div>
<div class="easyui-layout layout easyui-fluid" data-options="fit:true" style="width: 600px; height: 424px;">
<div class="panel layout-panel layout-panel-center" style="width: 600px; left: 0px; top: 0px;">
<div data-options="region:'center',border:false" title="" class="panel-body panel-body-noheader panel-body-noborder layout-body" style="width: 600px; height: 424px;">
<table cellpadding="0" cellspacing="0">
<tbody>
<tr class="datagrid-header-row">
<td class="len120">日期</td>
<td class="len100">数量</td>
<td class="len100">单价</td>
<td class="len100">出库数量</td>
<td class="len100">验收单价</td>
</tr>
</tbody></table>
<table cellpadding="0" cellspacing="0">
<tbody id="table_row">
</tbody></table>
</div>
</div>
</div>
</div>
`
        addElement(div,'#addhistoryswap',div_string,'afterbegin')
    });
 
    // module 退货单添加历史销售明细
    elmGetter.each('#sales-dialog-rejectBillAddPage-content', document, add_history_reject => {
        // console.log(add_history_price);
        const div = add_history_reject.parentNode;
        div.style.width = '1201px';
        div.style.left='360px';
        let div_string = `
<div class="panel window" id="addhistoryreject" style="width: 600px; left:601px">
<div class="panel-header panel-header-noborder window-header" style="width: 600px;">
<div class="panel-title" style="">商品历史价格</div>
</div>
<div class="easyui-layout layout easyui-fluid" data-options="fit:true" style="width: 600px; height: 480px;">
<div class="panel layout-panel layout-panel-center" style="width: 600px; left: 0px; top: 0px;">
<div data-options="region:'center',border:false" title="" class="panel-body panel-body-noheader panel-body-noborder layout-body" style="width: 600px; height: 480px;">
<table cellpadding="0" cellspacing="0">
<tbody>
<tr class="datagrid-header-row">
<td class="len120">日期</td>
<td class="len100">数量</td>
<td class="len100">单价</td>
<td class="len100">出库数量</td>
<td class="len100">验收单价</td>
</tr>
</tbody></table>
<table cellpadding="0" cellspacing="0">
<tbody id="table_row">
</tbody></table>
</div>
</div>
</div>
</div>
`
        addElement(div,'#addhistoryreject',div_string,'afterbegin')
    });
 
 
    // module 换货单添加最新采购价
    elmGetter.each('#sales-loading-swapOrderDetailAddPage', document, add_price => {
        const table = add_price.parentNode.parentNode;
        let price_string = `
<tr>
<td>最新采购价：</td>
<td><input id="products_price" class="len150 readonly" readonly="readonly" name="newstorageprice" placeholder="">
</td>
</tr>`
        addElement(table,'#products_price',price_string,'beforeend')
    });
 
    // module 构造右键菜单历史进价
    elmGetter.each('#purchase-arrivalOrderAddPage-remark', document, order => {
        let old_div = document.querySelector('#purchase-arrivalOrderPage-layout');
        let new_div = `<div id="orderPage-goods1-history-price">
<div id="rejectBill-goods-history-price-dialog" class="datagrid-f" style="display: none;"></div>
</div>`;
        addElement(old_div,'#orderPage-goods1-history-price',new_div,'beforeend')
    });
    elmGetter.each('#purchase-Button-tableMenu', document, his => {
        let html_str = `<div id="purchase-arrivalOrderAddPage-addRow2" 
data-options="iconCls:'button-add'" 
class="menu-item m-l" 
style="height: 20px;">
<div class="menu-text" style="height: 20px; 
line-height: 20px;">历史进价</div>
<div class="menu-icon button-add"></div></div>
<style>
.m-l:hover{
color:rgb(0,0,0);
background:rgb(6,169,235);
border-radius:5px;
}
</style>`
        his.insertAdjacentHTML('beforeend',html_str)
    });
    elmGetter.each('#purchase-arrivalOrderAddPage-addRow2', document, out_order => {
        out_order.addEventListener("click", showHistoryGoodsPrice2,true);
        // console.log(out_order);
    });
})();
 
 
// module 添加元素
function addElement(element,element_id,add_string,add_mode){
    if(!document.querySelector(element_id)){
        element.insertAdjacentHTML(add_mode,add_string)
    }
}
 
// module 查询订单号重复
function QueryCustomerOrder(customer,order){
    let xhr = new XMLHttpRequest();
    let url = new URL(`http://${window.test}:8888/sales/getOrderList.do`);
    let query_date = getIntervalDate();
    url.searchParams.set('businessdate', query_date.start_date);
    url.searchParams.set('businessdate1', query_date.end_date);
    url.searchParams.set('id', '');
    url.searchParams.set('salesdept', '');
    url.searchParams.set('customerid', customer);
    url.searchParams.set('status', '');
    url.searchParams.set('sourceid', order);
    url.searchParams.set('goodsid', '');
    url.searchParams.set('printsign', '');
    url.searchParams.set('queryprinttimes', '');
    url.searchParams.set('urgentlevel', '');
    url.searchParams.set('lineid', '');
    url.searchParams.set('isstoragelock', '0');
    url.searchParams.set('salesuserArrs', '');
    url.searchParams.set('page', '1');
    url.searchParams.set('rows', '200');
    url.searchParams.set('sort', 'addtime');
    url.searchParams.set('order', 'desc');
 
    // 2. 配置它：从 URL /article/.../load GET-request
    xhr.open('post', url);
 
    // 3. 通过网络发送请求
    xhr.send();
 
    // 4. 当接收到响应后，将调用此函数
    xhr.onload = function() {
        if (xhr.status != 200) { // 分析响应的 HTTP 状态
            alert(`Error ${xhr.status}: ${xhr.statusText}`); // 例如 404: Not Found
        } else { // 显示结果
            let xhrString = JSON.parse(xhr.response)
            // console.log(xhrString)
            if (xhrString.total > 0){
                let i = 0;
                let orderNo='';
                for (; i < xhrString.rows.length;i++) {
                    if (xhrString.rows[i].status != '5'){
                        orderNo += `${xhrString.rows[i].id},`
                    }
                }
                if (orderNo){
                    alert( `有重复订单，订单号为${orderNo}`);
                }
            }
            // alert(`Done, got ${xhr.response.length} bytes`); // response 是服务器响应
        }
    };
 
    xhr.onerror = function() {
        alert("Request failed");
    };
 
}
 
// module 更新规格和最新采购价
function updateData(xhr_string) {
    try {
        let xhrString = JSON.parse(xhr_string);
        let customer = document.querySelector('[id^="sales-customer-showid"] a');
        let model_string = xhrString.detail.goodsInfo.model;
        let products_price  = xhrString.detail.goodsInfo.newbuyprice;
        let products_string = xhrString.detail.goodsInfo.id;
        queryHistoryPrice((customer?customer.innerText:
            document.querySelector('#sales-customer-showid-dispatchBillAddPage').innerText.substring(3)), products_string);
        document.querySelector('#products_model').setAttribute("placeholder", model_string);
        document.querySelector('#products_price').setAttribute("placeholder", products_price);
    } catch (err) {
        // console.log('err');
        return
    }
}
 
// module 销售核销添加搜索功能
function addSearch(evt){
    if (evt.keyCode == 13){
        let inputString =document.querySelector('input[name="saleorderid"]');
        let alertString = document.querySelector('#alertTd')
        regInputString(inputString.value)
        inputString.select();
    }
}
 
// module 用正则判断输入文字
function regInputString(str) {
    let salestr = /^[X]?[D]?[2]?[2-4]?[1]{1}[0-2]{1}[0-9]{5}$|^[X]?[D]?[2]?[2-4]?[0]?[1-9]{1}[0-9]{5}$/
    let returnstr = /^t[h]?[t]?[z]?[d]?[-]?[2]?[0]?[2]?[2-4]?[1]{1}[0-2]{1}[0-9]{2}[-]?[0-9]{4}$|^t[h]?[t]?[z]?[d]?[-]?[2]?[0]?[2]?[2-4]?[0]?[1-9]{1}[0-9]{2}[-]?[0-9]{4}$/
    let chargebackstr = /^c[c]?[-]?[2]?[0]?[2]?[2-4]?[1]{1}[0-2]{1}[0-9]{2}[-]?[0-9]{4}$|^c[c]?[-]?[2]?[0]?[2]?[2-4]?[0]?[1-9]{1}[0-9]{2}[-]?[0-9]{4}$/
    let swapstr = /^h[h]?[d]?[-]?[2]?[0]?[2]?[2-4]?[1]{1}[0-2]{1}[0-9]{2}[-]?[0-9]{3}$|^h[h]?[d]?[-]?[2]?[0]?[2]?[2-4]?[0]?[1-9]{1}[0-9]{2}[-]?[0-9]{3}$/
    if (str.search(salestr) === 0){
        let arr = searchOrder(str,'td[field="orderid"]');
        if(arr) {
            searchOrderFollowUp(str, arr, 1);
        }
    }else if(str.search(returnstr)===0){
        let orderstr = formatReturnOrder(str);
        let arr =searchOrder(orderstr,'td[field="id"]');
        if(arr) {
            searchOrderFollowUp(orderstr, arr, 2);
        }
    }else if(str.search(swapstr)===0){
        let swaporder = formatReturnOrder(str,3);
        let arr =searchOrder(swaporder,'td[field="sourceid"]');
        if(arr) {
            searchOrderFollowUp(swaporder, arr, 3);
        }
    }else if(str.search(chargebackstr)===0){
        let chargebackorder = formatReturnOrder(str);
        let arr = searchOrder(chargebackorder,'td[field="id"]');
        if(Object.keys(arr).length === 0){
            alertMsg('无此冲差单，请确认')
        }else{
            searchOrderFollowUp(chargebackorder,arr,3);
        }
    }
    return;
}
 
// module 格式化退货单
function formatReturnOrder(str,position=4) {
    returnorder = str.replace(/-/g,'');
    returnorder = returnorder.replace(/[a-z]/g,'');
    let formatorder = returnorder.substring(0,returnorder.length-position)+'-'+returnorder.substring(returnorder.length-position)
    return formatorder
 
}
 
// module 搜索单据
function searchOrder(order,trname) {
    // let elmGetter = new ElementGetter();  //初始化ElementGetter
    // elmGetter.each('td[field="orderid"]', document, div => {
    // elmGetter.get('td[field="orderid"]').then(div => {
    let orderlist = document.querySelectorAll(trname);
    let arr = new Object();
    for (let i = 0; i < orderlist.length; i++) {
        const btn = orderlist[i].innerHTML.search(order)
        // let p = orderlist[i].parentNode;
        // console.log(p.classList.contains('datagrid-row-selected'));
        if (btn > 0) {
            let parenttd = orderlist[i].parentNode;
            let childdiv = orderlist[i].firstChild.innerHTML;
            if (parenttd.classList.contains('datagrid-row-selected')) {
                console.log('okkkkkkkk');
                alertMsg(`${childdiv}已经选择，请检查`)
                return
            } else {
                arr[childdiv + '(' + i.toString() + ')'] = orderlist[i];
            }
        }
    }
    return arr
}
async function searchOrderFollowUp(order,arr,mode){
    let num = Object.keys(arr).length
    let customer = document.querySelector('#account-customerid-salesInvoiceSourceQueryPage-hidden');
    let customerid = customer.getAttribute('value');
    if(customerid === '') {
        customer = document.querySelector('#account-pcustomerid-salesInvoiceSourceQueryPage-hidden');
        customerid = customer.getAttribute('value');
    }
    if(num === 0){
        if(mode===1){
            let text=await QueryReceiptOrder(customerid, order);
            alertMsg(text)
        }else if(mode===2){
            let text=await QueryReceiptOrder(customerid, order,'',2);
            alertMsg(text)
        }else if(mode===3) {
            let text=await QueryReceiptOrder(customerid, '',order);
            let return_text = await QueryCustomerReturnOrder(customerid,order);
            alertMsg(text+'/n'+return_text)
        }
    }else if(num ===1){
        Object.values(arr)[0].click();
        alertMsg(`选择${Object.keys(arr)[0]}`)
    }else if(num ===2 && mode === 3){
        Object.values(arr)[0].click();
        Object.values(arr)[1].click();
        alertMsg(`选择2张${Object.keys(arr)[0]}`)
    }else{
        alertMsg('有多张相似单号，请重新输入完整单号')
    }
    // console.log(arr)
}
 
// module 提醒文字
function alertMsg(alertString) {
    let alertTd = document.querySelector('#alertTd');
    if (alertTd) {
        // console.log(alertTd.innerHTML);
        alertTd.innerHTML =alertString;
    } else {
        let alertTr = document.querySelectorAll('form[id="account-form-query-salesInvoiceSouceBill"] tr');
        let createTd = document.createElement("td");
        createTd.innerHTML=`<font color="red" id="alertTd" >${alertString}</font>`
        alertTr[2].appendChild(createTd);
    }
}
 
 
 
 
 
// module 查询销售回单,退货验收单
function QueryReceiptOrder(customer,order,swap_order='',mode=1){
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        let url = new URL(`http://${window.test}:8888/sales/getReceiptList.do`);
        url.searchParams.set('businessdate', '');
        url.searchParams.set('businessdate1', '');
        url.searchParams.set('id', order);
        url.searchParams.set('customersort', '');
        url.searchParams.set('detailOrder', '0');
        url.searchParams.set('isbook', '');
        url.searchParams.set('writeoffdate1', '');
        url.searchParams.set('writeoffdate2', '');
        url.searchParams.set('indooruserid', '');
        url.searchParams.set('salesuser', '');
        url.searchParams.set('isinvoice', '-1');
        url.searchParams.set('accounttype', '');
        url.searchParams.set('customerid', customer);
        url.searchParams.set('salesarea', '');
        url.searchParams.set('ispassdue', '');
        url.searchParams.set('brandid', '');
        url.searchParams.set('checkstatusflag', '');
        url.searchParams.set('status', '');
        url.searchParams.set('isledger', '');
        url.searchParams.set('deliveryid', '');
        url.searchParams.set('sourceid', swap_order);
        url.searchParams.set('goodsid', '');
        url.searchParams.set('page', '1');
        url.searchParams.set('rows', '100');
        url.searchParams.set('sort', 'id');
        url.searchParams.set('order', 'desc');
        if(mode ===2){
            url = new URL(`http://${window.test}:8888/sales/getRejectBillList.do`);
            url.searchParams.set('ysbusinessdate', '');
            url.searchParams.set('ysbusinessdate1', '');
            url.searchParams.set('isinvoice', '3');
            url.searchParams.set('id', order);
            url.searchParams.set('goodsid', '');
            url.searchParams.set('billtype', '');
            url.searchParams.set('isbook', '');
            url.searchParams.set('customerid', customer);
            url.searchParams.set('ysprintsign', '');
            url.searchParams.set('queryysprinttimes', '0');
            url.searchParams.set('isledger', '');
            url.searchParams.set('status', '');
            url.searchParams.set('page', '1');
            url.searchParams.set('rows', '1000');
            url.searchParams.set('sort', 'addtime');
            url.searchParams.set('order', 'desc');
        }
 
        // 2. 配置它：从 URL /article/.../load GET-request
        xhr.open('post', url);
 
        // 3. 通过网络发送请求
        xhr.send();
 
        // 4. 当接收到响应后，将调用此函数
        xhr.onload = function() {
            if (xhr.status != 200) { // 分析响应的 HTTP 状态
                alert(`Error ${xhr.status}: ${xhr.statusText}`); // 例如 404: Not Found
            } else { // 显示结果
                if(mode===1) {
                    let xhrString = JSON.parse(xhr.response)
                    if (xhrString.total === 0) {
                        resolve('该客户无此单号或者未出库，请检查')
                        // alertMsg('该客户无此单号或者未出库，请检查')
                    } else if (xhrString.total === 1) {
                        let row = xhrString.rows;
                        let saleorderid = row[0].saleorderid;
                        if (row[0].status === '2') {
                            resolve(`${saleorderid}还没验收，请验收`)
                            // alertMsg(`${saleorderid}还没验收，请验收`)
                        } else if (row[0].status === '3' && row[0].isinvoice === '1') {
                            resolve(`${saleorderid}已经申请抽单`)
                            // alertMsg(`${saleorderid}已经申请抽单`)
                        } else {
                            resolve(`${saleorderid}已经核销`)
                            // alertMsg(`${saleorderid}已经核销`)
                        }
                    }
                }else if(mode===2){
                    let xhrString = JSON.parse(xhr.response)
                    if (xhrString.total === 0) {
                        resolve('退货单未验收')
                    } else if (xhrString.total === 1) {
                        let row = xhrString.rows;
                        let saleorderid = row[0].id;
                        if (row[0].status === '4') {
                            resolve(`${saleorderid}已经核销`)
                        } else if (row[0].status === '3' && row[0].isinvoice === '1') {
                            resolve(`${saleorderid}已经申请抽单`)
                        }
                    }
                }
                // alert(`Done, got ${xhr.response.length} bytes`); // response 是服务器响应
            }
        };
 
        xhr.onerror = function() {
            alert("Request failed");
        };
    })
}
 
// module 添加窗口弹出
function AddAlertTd(alertString) {
    let alertTd = document.querySelector('#alertTd');
    if (alertTd) {
        // console.log(alertTd.innerHTML);
        alertTd.innerHTML =alertString;
    } else {
        let alertTr = document.querySelectorAll('form[id="account-form-query-salesInvoiceSouceBill"] tr');
        let createTd = document.createElement("td");
        createTd.innerHTML=`<font color="red" id="alertTd" >${alertString}</font>`
        alertTr[2].appendChild(createTd);
    }
}
 
// module 添加销售单单号重复查询
function addListener(){
    let customerInput = document.querySelector('#sales-customer-showid-orderAddPage a');
    let inputOrder = document.querySelector('#sales-sourceid-orderAddPage');
    if (inputOrder.value){
        QueryCustomerOrder(customerInput.innerText,inputOrder.value);
    }
}
 
// module 添加退货通知单单号重复查询
function addListenerOutOrder(){
    let customer = document.querySelector('#sales-customer-showid-dispatchBillAddPage');
    let out_order = document.querySelector('#sales-sourceid-rejectBillAddPage');
    if (out_order.value){
        // console.log(customer.innerText.slice(3),out_order.value);
        queryOutOrder(customer.innerText.slice(3),out_order.value);
 
    }
}
 
// module 查询销售单是否核销
function CheckSaleOrder(orderId,customer) {
    let xhr = new XMLHttpRequest();
    let url = new URL(`http://${window.test}:8888/sales/getReceiptList.do`);
    let returnString;
    let query_date = getIntervalDate()
    url.searchParams.set('businessdate', '');
    url.searchParams.set('businessdate1', '');
    url.searchParams.set('id', orderId);
    url.searchParams.set('customersort', '');
    url.searchParams.set('detailOrder', '0');
    url.searchParams.set('customerid', customer);
    url.searchParams.set('indooruserid', '');
    url.searchParams.set('salesuser', '');
    url.searchParams.set('isinvoice', '-1');
    url.searchParams.set('status', '');
    url.searchParams.set('accounttype', '');
    url.searchParams.set('salesarea', '');
    url.searchParams.set('ispassdue', '');
    url.searchParams.set('brandid', '');
    url.searchParams.set('isbook', '');
    url.searchParams.set('isledger', '');
    url.searchParams.set('deliveryid', '');
    url.searchParams.set('sourceid', '');
    url.searchParams.set('goodsid', '');
    url.searchParams.set('page', '1');
    url.searchParams.set('rows', '100');
    url.searchParams.set('sort', 'id');
    url.searchParams.set('order', 'desc');
 
    // 2. 配置它：从 URL /article/.../load GET-request
    xhr.open('post', url);
 
    // 3. 通过网络发送请求
    xhr.send();
 
    // 4. 当接收到响应后，将调用此函数
    xhr.onload = function() {
        if (xhr.status != 200) { // 分析响应的 HTTP 状态
            alert(`Error ${xhr.status}: ${xhr.statusText}`); // 例如 404: Not Found
        } else { // 显示结果
            let xhrString = JSON.parse(xhr.response)
            // console.log(xhrString)
            if (xhrString.total > 0){
                let rows = xhrString.rows;
                if (rows[0].status === '4'){
                    AddAlertTd('已经核销');
                    return
                }else if(rows[0].status === '2'){
                    AddAlertTd('未验收');
                    return
                } else if(rows[0].isinvoice === '4' || rows[0].isinvoice === '1'){
                    AddAlertTd('已经申请抽单');
                    return
                }else{
                    AddAlertTd('未出库');
                    return
                }
            } else {
                AddAlertTd('请输入正确单号');
                return
            }
            // alert(`Done, got ${xhr.response.length} bytes`); // response 是服务器响应
 
        }
    };
    xhr.onerror = function() {
        alert("Request failed");
    };
    return returnString
}
 
// module 查询退货单是否核销
function CheckOutOrder(orderId,customer) {
    let xhr = new XMLHttpRequest();
 
    let url = new URL(`http://${window.test}:8888/sales/getRejectBillList.do`);
    url.searchParams.set('businessdate', '');
    url.searchParams.set('businessdate1', '');
    url.searchParams.set('salesdept','');
    url.searchParams.set('indooruserid', '');
    url.searchParams.set('ysbusinessdate', '');
    url.searchParams.set('ysbusinessdate1', '');
    url.searchParams.set('isinvoice', '3');
    url.searchParams.set('id', orderId);
    url.searchParams.set('goodsid', '');
    url.searchParams.set('billtype', '');
    url.searchParams.set('isbook', '');
    url.searchParams.set('customerid', customer);
    url.searchParams.set('ysprintsign', '');
    url.searchParams.set('queryysprinttimes', '0');
    url.searchParams.set('isledger', '');
    url.searchParams.set('status', '');
    url.searchParams.set('page', '1');
    url.searchParams.set('rows', '20');
    url.searchParams.set('sort', 'addtime');
    url.searchParams.set('order', 'desc');
 
    // 2. 配置它：从 URL /article/.../load GET-request
    xhr.open('post', url);
 
    // 3. 通过网络发送请求
    xhr.send();
 
    // 4. 当接收到响应后，将调用此函数
    xhr.onload = function() {
        if (xhr.status != 200) { // 分析响应的 HTTP 状态
            alert(`Error ${xhr.status}: ${xhr.statusText}`); // 例如 404: Not Found
        } else { // 显示结果
            let xhrString = JSON.parse(xhr.response)
            // console.log(xhrString)
            if (xhrString.total > 0){
                let rows = xhrString.rows;
                if (rows[0].isinvoice === '2'){
                    AddAlertTd('已经核销');
 
                } else if (rows[0].isinvoice === '1'){
                    AddAlertTd('已经申请抽单');
 
                }
            } else {
                AddAlertTd('未验收');
 
            }
            // alert(`Done, got ${xhr.response.length} bytes`); // response 是服务器响应
 
        }
    };
    xhr.onerror = function() {
        alert("Request failed");
    };
}
 
// module 查询退货单号重复
function queryOutOrder(customer,order_id){
    let xhr = new XMLHttpRequest();
    let url = new URL(`http://${window.test}:8888/sales/getRejectBillList.do`);
    let query_date = getIntervalDate();
    url.searchParams.set('businessdate', query_date.start_date);
    url.searchParams.set('businessdate1', query_date.end_date);
    url.searchParams.set('storageid','');
    url.searchParams.set('id','');
    url.searchParams.set('confirmstatus','');
    url.searchParams.set('goodsid','');
    url.searchParams.set('billtype','');
    url.searchParams.set('source','9');
    url.searchParams.set('status','');
    url.searchParams.set('sourceid','');
    url.searchParams.set('printsign','');
    url.searchParams.set('queryprinttimes','0');
    url.searchParams.set('customerid',customer);
    url.searchParams.set('page','1');
    url.searchParams.set('rows','1000');
    url.searchParams.set('sort','addtime');
    url.searchParams.set('order','desc');
 
    // 2. 配置它：从 URL /article/.../load GET-request
    xhr.open('post', url);
 
    // 3. 通过网络发送请求
    xhr.send();
 
    // 4. 当接收到响应后，将调用此函数
    xhr.onload = function() {
        if (xhr.status != 200) { // 分析响应的 HTTP 状态
            alert(`Error ${xhr.status}: ${xhr.statusText}`); // 例如 404: Not Found
        } else { // 显示结果
            let xhrString = JSON.parse(xhr.response)
            // console.log(xhrString)
            if (xhrString.total > 0){
                let i = 0;
                let orderNo='';
                for (; i < xhrString.rows.length;i++) {
                    if (xhrString.rows[i].remark === order_id || xhrString.rows[i].sourceid === order_id ){
                        orderNo += `${xhrString.rows[i].id},`
                    }
                }
                if (orderNo){
                    alert( `有重复单，单号为${orderNo}`);
                }
            }
            // alert(`Done, got ${xhr.response.length} bytes`); // response 是服务器响应
        }
    };
 
    xhr.onerror = function() {
        alert("Request failed");
    };
}
 
// module 获取时间参数
function getIntervalDate(){
    let date = new Date();
    let end_date = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,"0")}-${date.getDate().toString().padStart(2,'0')}`;
    date.setDate(date.getDate()-90);
    let start_date = `${date.getFullYear()}-${date.getMonth().toString().padStart(2,"0")}-${date.getDate().toString().padStart(2,'0')}`;
    let query_date ={
        'start_date':start_date,
        'end_date':end_date
    }
    return query_date
}
 
// module 查询销售情况流水明细
// function showCustomerSalesFlowList(customer,products){
//     let xhr = new XMLHttpRequest();
//     let url = new URL('http://47.107.106.156:8888/report/finance/showCustomerSalesFlowList.do');
//     let query_date = getIntervalDate();
//     url.searchParams.set("businessdate1", "2022-03-01");
//     url.searchParams.set("businessdate2", query_date.end_date);
//     url.searchParams.set("goodsid", products);
//     url.searchParams.set("salesuser", "");
//     url.searchParams.set("batchno", "");
//     url.searchParams.set("goodssort", "");
//     url.searchParams.set("customerid", customer);
//     url.searchParams.set("pcustomerid", "");
//     url.searchParams.set("salesarea", "");
//     url.searchParams.set("customersort","");
//     url.searchParams.set("salesdept", "");
//     url.searchParams.set("brandid", "");
//     url.searchParams.set("orderid", "");
//     url.searchParams.set("type", "");
//     url.searchParams.set("invoice1", "1");
//     url.searchParams.set("writeoff1","1");
//     url.searchParams.set("invoice2", "1");
//     url.searchParams.set("writeoff2", "1");
//     url.searchParams.set("id", "");
//     url.searchParams.set("storageid", "");
//     url.searchParams.set("supplierid", "");
//     url.searchParams.set("page", "1");
//     url.searchParams.set("rows", "1000");
//     // 2. 配置它：从 URL /article/.../load GET-request
//     xhr.open('post', url);
//
//     // 3. 通过网络发送请求
//     xhr.send();
//
//     // 4. 当接收到响应后，将调用此函数
//     xhr.onload = function() {
//         if (xhr.status != 200) { // 分析响应的 HTTP 状态
//             alert(`Error ${xhr.status}: ${xhr.statusText}`); // 例如 404: Not Found
//         } else { // 显示结果
//             let xhrString = JSON.parse(xhr.response)
//             // console.log(xhrString)
//             let table_html = '';
//             let table_parentNode = document.querySelector("#table_row");
//             if (xhrString.total > 0){
//                 let row_data = xhrString.rows;
//                 let x = 1;  //用x取余来做斑马格
//                 for (let row_num in row_data){
//                     table_html = `
// <tr class="${(x%2 ==0) ?"datagrid-row-alt datagrid-row":"datagrid-row"}">
// <td class="len120">${row_data[row_num].addtime}</td>
// <td class="len80">${row_data[row_num].deliverystoragename}</td>
// <td class="len80">${row_data[row_num].unitname}</td>
// <td class="len100">${row_data[row_num].unitnum}</td>
// <td class="len100">${row_data[row_num].price}</td>
// <td class="len120">${row_data[row_num].taxamount}</td>
// </tr>
// ` + table_html;
//                     x=++x;
//                 }
//             }
//             table_parentNode.innerHTML=table_html;
//             // alert(`Done, got ${xhr.response.length} bytes`); // response 是服务器响应
//         }
//     };
//
//     xhr.onerror = function() {
//         alert("Request failed");
//     };
// }
 
// module 查询订单是否可以配置库存
function queryOrderStock(order) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        let url = new URL(`http://${window.test}:8888/sales/orderDeployInfo.do?id=${order}`);
 
        // 2. 配置它：从 URL /article/.../load GET-request
        xhr.open('post', url);
 
        // 3. 通过网络发送请求
        xhr.send();
 
        // 4. 当接收到响应后，将调用此函数
        xhr.onload = function() {
            if (xhr.status != 200) { // 分析响应的 HTTP 状态
                alert(`Error ${xhr.status}: ${xhr.statusText}`); // 例如 404: Not Found
            } else { // 显示结果
                let xhrString = JSON.parse(xhr.response)
                console.log(xhrString.flag);
                resolve(xhrString.flag);
            }
        };
 
        xhr.onerror = function() {
            alert("Request failed");
        };
    })
}
 
// module 编辑订单模式
function queryEditOrder(order_num,num,total,urgentlevel,mode_page){
    return new Promise((resolve, reject) => {
        let urgentlevel_list = ['1','2','3'];
        let xhr = new XMLHttpRequest();
        let timestamp = Date.parse( new Date());
        let saleorder_salestype = false;
        let goodsjson;
        let url = new URL(`http://${window.test}:8888/sales/${mode_page}?id=${order_num}&_=${timestamp}`);
        // 2. 配置它：从 URL /article/.../load GET-request
        xhr.open('post', url);
        // 3. 通过网络发送请求
        xhr.send();
        // 4. 当接收到响应后，将调用此函数
        xhr.onload = function() {
            if (xhr.status != 200) { // 分析响应的 HTTP 状态
                alert(`Error ${xhr.status}: ${xhr.statusText}`); // 例如 404: Not Found
            } else { // 显示结果
                let parser = new DOMParser();
                let doc = parser.parseFromString(xhr.response, "text/html")
                // console.log(doc);
                let script_string = doc.scripts.item(0).text;
                let saleorder_id = order_num;
                let saleorder_businessdate = doc.querySelector('#sales-businessdate-orderAddPage').value;
                let saleorder_urgentlevel = doc.querySelector('[name="saleorder.urgentlevel"] option[selected="selected"]').value;
                if (urgentlevel_list.includes(urgentlevel)){
                    saleorder_urgentlevel = urgentlevel
                }
                if ('orderEditPage.do' === mode_page){
                    saleorder_salestype = doc.querySelector('[name="saleorder.salestype"] option[selected="selected"]').value;
                    goodsjson = script_string.match(/\[{".*"}\]/);
                } else {
                    goodsjson = script_string.match(/\[{".*}\]/);
                }
                let saleorder_status = doc.querySelector('[name="saleorder.status"]').value;
                let saleorder_customerid = doc.querySelector('[name="saleorder.customerid"]').value;
                let saleorder_salesuser = doc.querySelector('[name="saleorder.salesuser"]').value;
                let saleorder_storageid = doc.querySelector('[name="saleorder.storageid"]').value;
                let saleorder_salesdept = doc.querySelector('[name="saleorder.salesdept"]').value;
                let saleorder_sourceid = doc.querySelector('[name="saleorder.sourceid"]').value;
                let saleorder_remark = doc.querySelector('[name="saleorder.remark"]').value;
                let regexp = /[,]*此单为超级审核[,]*/g;
                saleorder_remark = `${total}${num} ${saleorder_remark.replaceAll(regexp, "")}`;
                // console.log(saleorder_remark);
                let lackGoodsjson = doc.querySelector('[name="lackGoodsjson"]').innerHTML;
                let saveaudit = doc.querySelector('[name="saveaudit"]').value;
                // let oldFromData = doc.querySelector('[name="oldFromData"]').value;
 
                let from_date = {
                    'saleorder_id': saleorder_id,
                    'saleorder_businessdate': saleorder_businessdate,
                    'saleorder_status': saleorder_status,
                    'saleorder_customerid': saleorder_customerid,
                    'saleorder_salestype': saleorder_salestype,
                    'saleorder_urgentlevel': saleorder_urgentlevel,
                    'saleorder_storageid': saleorder_storageid,
                    'saleorder_salesdept': saleorder_salesdept,
                    'saleorder_salesuser': saleorder_salesuser,
                    'saleorder_sourceid': saleorder_sourceid,
                    'saleorder_remark': saleorder_remark,
                    'goodsjson': goodsjson,
                    'lackGoodsjson': lackGoodsjson,
                    'saveaudit': saveaudit,
                    // 'oldFromData':oldFromData,
                };
                resolve(from_date);
                // console.log(from_date);
 
                // alert(`Done, got ${xhr.response.length} bytes`); // response 是服务器响应
            }
        };
 
        xhr.onerror = function() {
            alert("Request failed");
        };
    })
}
 
// module 更新订单
function updateOrder(from_date){
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        let data;
        xhr.open('post', `http://${window.test}:8888/sales/updateOrder.do`);
        // 必须在xhr.send()前设置
        xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
        // data必须是这种表单数据格式的字符串；否则服务器接受到数据，按照表单数据格式解析，实际发送的不是表单格式的数据，将会解析不出来
        if (from_date.saleorder_salestype) {
            data = `addType=real&saleorder.oldid=${from_date.saleorder_id}&saleorder.id=${from_date.saleorder_id}&saleorder.businessdate=${from_date.saleorder_businessdate}&saleorder.status=${from_date.saleorder_status}&saleorder.customerid=${from_date.saleorder_customerid}&saleorder.salestype=${from_date.saleorder_salestype}&saleorder.urgentlevel=${from_date.saleorder_urgentlevel}&saleorder.storageid=${from_date.saleorder_storageid}&saleorder.salesdept=${from_date.saleorder_salesdept}&saleorder.salesuser=${from_date.saleorder_salesuser}&saleorder.sourceid=${from_date.saleorder_sourceid}&saleorder.remark=${from_date.saleorder_remark}&goodsjson=${from_date.goodsjson}&lackGoodsjson=${from_date.lackGoodsjson}&saveaudit=${from_date.saveaudit}`;
        } else {
            data = `addType=real&saleorder.oldid=${from_date.saleorder_id}&saleorder.id=${from_date.saleorder_id}&saleorder.businessdate=${from_date.saleorder_businessdate}&saleorder.status=${from_date.saleorder_status}&saleorder.customerid=${from_date.saleorder_customerid}&saleorder.urgentlevel=${from_date.saleorder_urgentlevel}&saleorder.storageid=${from_date.saleorder_storageid}&saleorder.salesdept=${from_date.saleorder_salesdept}&saleorder.salesuser=${from_date.saleorder_salesuser}&saleorder.sourceid=${from_date.saleorder_sourceid}&saleorder.remark=${from_date.saleorder_remark}&goodsjson=${from_date.goodsjson}&lackGoodsjson=${from_date.lackGoodsjson}&saveaudit=${from_date.saveaudit}`;
        }
        xhr.send(encodeURI(data));
        xhr.onload = function() {
            if (xhr.status != 200) { // 分析响应的 HTTP 状态
                alert(`Error ${xhr.status}: ${xhr.statusText}`); // 例如 404: Not Found
            } else { // 显示结果
                let xhrString = JSON.parse(xhr.response)
                console.log(xhrString.flag);
                resolve(xhrString.flag);
            }
        };
        xhr.onerror = function() {
            alert("Request failed");
        };
    })
}
 
// module 根据客户数量排序
function customerNumber(customer){
    let customer_list=[];   // 用来存放客户对象列表
// 循环客户数组
    customer.forEach((item, index, array) => {
        let customer_arr = {};  // 客户对象
        let customer_index = [];    // 客户顺序数组
        // 用客户数组里的客户搜索客户对象列表里的客户对象并且取反
        if (!customer_list.find(customer_arr => customer_arr.customer === item)) {
            // 如果没找到，则证明客户对象列表里没有这个名称的客户对象，然后循环客户数组找出序号
            customer.forEach((item_1, index_1, array_1) => {
                if (item === item_1) {
                    customer_index.push(index_1)
                }
            });
            customer_arr = {
                'customer': item,
                'index': customer_index
            }
            customer_list.push(customer_arr)
        }
    });
    // console.log(customer_list);
 
// 客户序号数组
    let order_index = [];
// 循环给客户序号数组赋值为0
    for (let i = 0; i < customer.length; i++) {
        order_index.push(0)
    }
    let customer_num = 1;   // 客户送货顺序变量
// 循环客户对象列表
    for (let key in customer_list) {
        // 当客户对象里index列表大于1时，则说明有2个以上相同的客户
        if (customer_list[key].index.length>1){
            let customer_index= customer_list[key].index;   //变量等于当前这个客户index列表
            let num_list =1;    //相同客户计数
            // 循环客户index列表
            customer_index.forEach((item, index, array) => {
                if (order_index[item]===0) {
                    order_index.splice(item, 1, `${customer_num}-${num_list}`)
                }
                ++num_list
            });
            ++customer_num
        } else {
            order_index.splice(customer_list[key].index,1,customer_num);
            ++customer_num
        }
    }
    return order_index
}
 
// module 获取订单的客户名
function getOrderCustomer(order){
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        let url = new URL(`http://${window.test}:8888/sales/getOrderList.do`);
        url.searchParams.set('businessdate', '');
        url.searchParams.set('businessdate1', '');
        url.searchParams.set('id', order);
        url.searchParams.set('salesdept', '');
        url.searchParams.set('customerid', '');
        url.searchParams.set('status', '2');
        url.searchParams.set('sourceid', '');
        url.searchParams.set('goodsid', '');
        url.searchParams.set('printsign', '');
        url.searchParams.set('queryprinttimes', '0');
        url.searchParams.set('urgentlevel', '');
        url.searchParams.set('lineid', '');
        url.searchParams.set('isstoragelock', '0');
        url.searchParams.set('salesuserArrs', '');
        url.searchParams.set('page', '1');
        url.searchParams.set('rows', '20');
        url.searchParams.set('sort', 'addtime');
        url.searchParams.set('order', 'desc');
 
        // 2. 配置它：从 URL /article/.../load GET-request
        xhr.open('post', url);
 
        // 3. 通过网络发送请求
        xhr.send();
 
        // 4. 当接收到响应后，将调用此函数
        xhr.onload = function() {
            if (xhr.status != 200) { // 分析响应的 HTTP 状态
                alert(`Error ${xhr.status}: ${xhr.statusText}`); // 例如 404: Not Found
            } else { // 显示结果
                let xhrString = JSON.parse(xhr.response)
                if (xhrString.total > 0){
                    // console.log(xhrString.rows[0].customername);
                    resolve(xhrString.rows[0].customername);
                }
            }
        };
 
        xhr.onerror = function() {
            alert("Request failed");
        };
    })
}
 
// module 排序单号
function sortOrder(order_list, customer_list) {
    let order_temp=[];
    let customer_temp = [];
    customer_list.forEach((item, index) => {
        let find_index = customer_temp.indexOf(item);
        if (find_index>=0){
            customer_temp.splice(find_index, 0, item);
            order_temp.splice(find_index,0,order_list[index]);
            // console.log(order_temp,customer_temp);
        } else {
            customer_temp.splice(index, 0, item);
            order_temp.splice(index,0,order_list[index]);
            // console.log(order_temp,customer_temp);
        }
    });
    return [order_temp,customer_temp]
}
 
// module 重制查询历史数据
function showCustomerSalesFlowList(customer,products){
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        let query_date = getIntervalDate();
        let url = new URL(`http://${window.test}:8888/report/finance/showCustomerSalesFlowList.do`);
        url.searchParams.set("businessdate1", "2022-03-01");
        url.searchParams.set("businessdate2", query_date.end_date);
        url.searchParams.set("goodsid", products);
        url.searchParams.set("salesuser", "");
        url.searchParams.set("batchno", "");
        url.searchParams.set("goodssort", "");
        url.searchParams.set("customerid", customer);
        url.searchParams.set("pcustomerid", "");
        url.searchParams.set("salesarea", "");
        url.searchParams.set("customersort","");
        url.searchParams.set("salesdept", "");
        url.searchParams.set("brandid", "");
        url.searchParams.set("billtype[]", "2");
        url.searchParams.append("billtype[]", "3");
        url.searchParams.set("orderid", "");
        url.searchParams.set("type", "");
        url.searchParams.set("invoice1", "1");
        url.searchParams.set("writeoff1","1");
        url.searchParams.set("invoice2", "1");
        url.searchParams.set("writeoff2", "1");
        url.searchParams.set("id", "");
        url.searchParams.set("storageid", "");
        url.searchParams.set("supplierid", "");
        url.searchParams.set("page", "1");
        url.searchParams.set("rows", "1000");
        // 2. 配置它：从 URL /article/.../load GET-request
        xhr.open('post', url);
 
        // 3. 通过网络发送请求
        xhr.send();
 
        // 4. 当接收到响应后，将调用此函数
        xhr.onload = function() {
            if (xhr.status != 200) { // 分析响应的 HTTP 状态
                alert(`Error ${xhr.status}: ${xhr.statusText}`); // 例如 404: Not Found
            } else { // 显示结果
                let xhrString = JSON.parse(xhr.response)
                resolve(xhrString.rows)
                // alert(`Done, got ${xhr.response.length} bytes`); // response 是服务器响应
            }
        };
 
        xhr.onerror = function() {
            alert("Request failed");
        };
    })
}
 
 
function showSalesOrderTrackReportData(customer,products){
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        let url = new URL(`http://${window.test}:8888/report/sales/showSalesOrderTrackReportData.do`);
        let query_date = getIntervalDate();
        url.searchParams.set("businessdate1", "2022-03-01");
        url.searchParams.set("businessdate2", query_date.end_date);
        url.searchParams.set("id","");
        url.searchParams.set("brandid","");
        url.searchParams.set("goodsid", products);
        url.searchParams.set("customerid",customer);
        url.searchParams.set("checkstatus","");
        url.searchParams.set("salesuser","");
        url.searchParams.set("pcustomerid","");
        url.searchParams.set("indooruserid","");
        url.searchParams.set("sourceid","");
        url.searchParams.set("goodssort","");
        url.searchParams.set("page", "1");
        url.searchParams.set("rows", "1000");
        url.searchParams.set("sort", "businessdate");
        url.searchParams.set("order", "asc");
        // 2. 配置它：从 URL /article/.../load GET-request
        xhr.open('post', url);
 
        // 3. 通过网络发送请求
        xhr.send();
 
        // 4. 当接收到响应后，将调用此函数
        xhr.onload = function() {
            if (xhr.status != 200) { // 分析响应的 HTTP 状态
                alert(`Error ${xhr.status}: ${xhr.statusText}`); // 例如 404: Not Found
            } else { // 显示结果
                let xhrString = JSON.parse(xhr.response)
                resolve(xhrString.rows)
                // alert(`Done, got ${xhr.response.length} bytes`); // response 是服务器响应
            }
        };
 
        xhr.onerror = function() {
            alert("Request failed");
        };
    })
}
 
async function queryHistoryPrice(customer,products){
    let user = new Object();
    let list_order = [];
    let returns_order=await showCustomerSalesFlowList(customer,products);
    let sale_order=await showSalesOrderTrackReportData(customer,products);
    // console.log(text)
    for (let row_num in returns_order){
        user = {     // 一个对象
            date: returns_order[row_num].businessdate,
            unitnum:returns_order[row_num].unitnum,
            price:returns_order[row_num].price,
            sendnum:returns_order[row_num].unitnum,
            checkprice:returns_order[row_num].price,
        };
        list_order.push(user)
    }
    for (let row_num in sale_order){
        if (sale_order[row_num].ordernum > 0) {
            user = {     // 一个对象
                date: sale_order[row_num].businessdate,
                unitnum: sale_order[row_num].initsendnum,
                price: sale_order[row_num].dispatchprice,
                sendnum: sale_order[row_num].sendnum === undefined?'未出库':sale_order[row_num].sendnum,
                checkprice: sale_order[row_num].checkprice === undefined?'未验收':sale_order[row_num].checkprice,
            };
            list_order.push(user)
        }
    }
    list_order.sort(function(a,b){
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(a.date)-new Date(b.date);
    });
    // console.log(xhrString)
    let table_html = '';
    let table_parentNode = document.querySelector("#table_row");
    let x = 1;  //用x取余来做斑马格
    for (let row_num in list_order){
        table_html = `
<tr class="${(x%2 ==0) ?"datagrid-row-alt datagrid-row":"datagrid-row"}" style="${(list_order[row_num].price !==list_order[row_num].checkprice) ? "font-weight: bold;color: red;":""}">
<td class="len120">${list_order[row_num].date}</td>
<td class="len100">${list_order[row_num].unitnum}</td>
<td class="len100">${list_order[row_num].price}</td>
<td class="len100">${list_order[row_num].sendnum}</td>
<td class="len100">${list_order[row_num].checkprice}</td>
</tr>
` + table_html;
        x=++x;
    }
    // console.log(table_html);
    table_parentNode.innerHTML=table_html;
}
 
// module 按键监听事件并且判断输入价格
function checkKey(e) {
    if (e.key == '*') {
        e.preventDefault();
        let price = prompt("请输入价格", ""); //输入价格
        price_number = Number(price);
        if (price != '' && price_number){
            console.log('ok')
            addSaveDetailCopy(true,price_number)
        }
    }
}
 
// module 深复制
function deepCopy(obj) {
    //判断要克隆的是数组还是对象。
    var toStr = Object.prototype.toString, //引用，目的是简化
        arrStr = '[ Object Array ] ',//引用，目的是简化比对
        newObj= toStr.call (obj) ==arrStr ? [] : {};
    //用instanceof运算符就是var newObj = obj instanceof Array ? [] : {};
    //用constructor运算符就是var newObj = new obj.constructor();
    if(obj instanceof Date) return new Date(obj);
    if(obj instanceof RegExp) return new RegExp(obj);
    //克隆正则和Date对象的情况。
    for (var key in obj) {
        //检测一个属性是否是对象的自有属性
        if (obj.hasOwnProperty(key)) {
            //三木运算符简化代码，判断是对象或者数组且不为空，为真则递归，不然返回值。
            newObj[key] = typeof obj[key] === 'object' && obj[key] !== null ? deepCopy(obj[key]) : obj[key];
        }
    }
    return newObj;
}
 
// module 换货单添加数据进表格
function addSaveDetailCopy(go,price) { //添加新数据确定后操作，
    var flag = $("#sales-form-swapOrderDetailAddPage").form('validate');
    if (flag == false) {
        return false;
    }
    var form = $("#sales-form-swapOrderDetailAddPage").serializeJSON();
    var goodsJson = $("#sales-goodsId-swapOrderDetailAddPage").goodsWidget('getObject');
    form.goodsInfo = goodsJson;
    var customer = $("#sales-customer-swapOrderAddPage-hidden").val();
    form.fixnum = form.unitnum;
    if (form.overnum != 0) {
        if (form.auxnum == null || form.auxnum == "") {
            form.auxnum = 0;
        }
        form.auxnumdetail = form.auxnum + form.auxunitname + form.overnum + form.unitname;
    } else {
        form.auxnumdetail = form.auxnum + form.auxunitname;
    }
    let form_copy =deepCopy(form);
    addSaveDetailReverse(form_copy,price);
    var rowIndex = 0;
    var rows = $wareList.datagrid('getRows');
    var updateFlag = false;
    for (var i = 0; i < rows.length; i++) {
        var rowJson = rows[i];
 
        if (rowJson.goodsid == undefined && rowJson.brandid == undefined) {
            rowIndex = i;
            break;
        }
    }
    // console.log(form)
    if (rowIndex == rows.length - 1) {
        $wareList.datagrid('appendRow', {}); //如果是最后一行则添加一新行
    }
    if (insertIndex == undefined) {
        $wareList.datagrid('updateRow', {index: rowIndex, row: form}); //将数据更新到列表中
    }
    else {
        $wareList.datagrid('insertRow', {index: insertIndex + 1, row: form});
        insertIndex = undefined;
    }
    if (go) { //go为true确定并继续添加一条
        $("#sales-form-swapOrderDetailAddPage").form("clear");
        $("input[name=deliverydate]").val(deliverydate);
        $("#sales-deliverytype-swapOrderDetailAddPage").val("0");
    }
    else { //否则直接关闭
        $("#sales-dialog-swapOrderAddPage-content").dialog('close', true)
    }
 
    countTotal(); //第添加一条商品明细计算一次合计
}
 
 
// module 换货单商品数量取反
function addSaveDetailReverse(form,price) { //添加新数据确定后操作，
    form.taxprice = price;
    form.boxprice = price *Number(form.boxnum);
    form.unitnum = -1*Number(form.unitnum);
    form.fixnum = form.unitnum;
    form.taxamount = form.taxprice * form.unitnum
 
    var rowIndex = 0;
    var rows = $wareList.datagrid('getRows');
    var updateFlag = false;
    for (var i = 0; i < rows.length; i++) {
        var rowJson = rows[i];
 
        if (rowJson.goodsid == undefined && rowJson.brandid == undefined) {
            rowIndex = i;
            break;
        }
    }
    // console.log(form)
    if (rowIndex == rows.length - 1) {
        $wareList.datagrid('appendRow', {}); //如果是最后一行则添加一新行
    }
    if (insertIndex == undefined) {
        $wareList.datagrid('updateRow', {index: rowIndex, row: form}); //将数据更新到列表中
    }
    else {
        $wareList.datagrid('insertRow', {index: insertIndex + 1, row: form});
        insertIndex = undefined;
    }
    // if (go) { //go为true确定并继续添加一条
    //     // $("#sales-form-swapOrderDetailAddPage").form("clear");
    //     // $("input[name=deliverydate]").val(deliverydate);
    //     // $("#sales-deliverytype-swapOrderDetailAddPage").val("0");
    // }
    // else { //否则直接关闭
    //     $("#sales-dialog-swapOrderAddPage-content").dialog('close', true)
    // }
 
    countTotal(); //第添加一条商品明细计算一次合计
}
 
// module 退货单通用查询换货单单号
function QueryCustomerReturnOrder(swap_customer,swap_order){
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        let url = new URL(`http://${window.test}:8888/sales/getRejectBillList.do`);
        // let swap_order ='HHD-20230630-001'
        url.searchParams.set('queryRules', `{"rules":[{"field":"customerid","op":"equal","value":"${swap_customer}"},{"field":"sourceid","op":"like","value":"${swap_order}"}],"op":"and"}`);
        url.searchParams.set('orderRules', '[]');
        url.searchParams.set('page', '1');
        url.searchParams.set('rows', '20');
        url.searchParams.set('sort', 'addtime');
        url.searchParams.set('order', 'desc');
 
        // 2. 配置它：从 URL /article/.../load GET-request
        xhr.open('post', url);
 
        // 3. 通过网络发送请求
        xhr.send();
 
        // 4. 当接收到响应后，将调用此函数
        xhr.onload = function() {
            if (xhr.status != 200) { // 分析响应的 HTTP 状态
                alert(`Error ${xhr.status}: ${xhr.statusText}`); // 例如 404: Not Found
            } else { // 显示结果
                let xhrString = JSON.parse(xhr.response)
                console.log(xhrString)
                if (xhrString.total > 0){
                    let rows = xhrString.rows;
                    if (rows[0].isinvoice === '2'){
                        resolve(`${rows[0].id}已经核销`)
                    }else if(rows[0].isinvoice === '1'){
                        resolve(`${rows[0].id}已经申请`)
                    } else{
                        resolve('已经申请抽单')
                    }
                }else{
                    resolve('无此单，请查证后输入')
                }
 
                // alert(`Done, got ${xhr.response.length} bytes`); // response 是服务器响应
            }
        };
 
        xhr.onerror = function() {
            alert("Request failed");
        };
    })
}
 
async function queryHistoryInPrice(brand,products){
    let user = new Object();
    let list_order = [];
    let returns_order=await showInOutFlowListData(brand,products)
    // console.log(text)
    for (let row_num in returns_order){
        user = {     // 一个对象
            date: returns_order[row_num].businessdate,
            unitnum:returns_order[row_num].enternum,
            price:returns_order[row_num].price,
        };
        list_order.push(user)
    }
 
    // list_order.sort(function(a,b){
    //     // Turn your strings into dates, and then subtract them
    //     // to get a value that is either negative, positive, or zero.
    //     return new Date(a.date)-new Date(b.date);
    // });
    // console.log(xhrString)
    let table_html = '';
    let table_parentNode = document.querySelector("#table_row");
    let x = 1;  //用x取余来做斑马格
    for (let row_num in list_order){
        table_html = `
<tr class="${(x%2 ==0) ?"datagrid-row-alt datagrid-row":"datagrid-row"}">
<td class="len120">${list_order[row_num].date}</td>
<td class="len100">${list_order[row_num].unitnum}</td>
<td class="len100">${list_order[row_num].price}</td>
</tr>
` + table_html;
        x=++x;
    }
    // console.log(table_html);
    table_parentNode.innerHTML=table_html;
}
 
function showInOutFlowListData(brand,products){
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        let url_data = `businessdate1=&businessdate2=&id=&brandid=&goodsid=${products}&billtype=0&supplierid=${brand}&customerid=&storageid=&customersort=&audituserid=&oldFromData=%7B%22businessdate1%22%3A%222023-07-11%22%2C%22businessdate2%22%3A%222023-07-11%22%2C%22id%22%3A%22%22%2C%22brandid%22%3A%22%22%2C%22goodsid%22%3A%22%22%2C%22supplierid%22%3A%22%22%2C%22customerid%22%3A%22%22%2C%22storageid%22%3A%22%22%2C%22customersort%22%3A%22%22%2C%22audituserid%22%3A%22%22%7D&page=1&rows=100&sort=businessdate&order=asc`
        // 2. 配置它：从 URL /article/.../load GET-request
        xhr.open('POST', `http://${window.test}:8888/report/storage/showInOutFlowListData.do`);
 
        // 3. 通过网络发送请求
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(url_data);
 
        // 4. 当接收到响应后，将调用此函数
        xhr.onload = function() {
            if (xhr.status != 200) { // 分析响应的 HTTP 状态
                alert(`Error ${xhr.status}: ${xhr.statusText}`); // 例如 404: Not Found
            } else { // 显示结果
                let xhrString = JSON.parse(xhr.response)
                resolve(xhrString.rows)
                // alert(`Done, got ${xhr.response.length} bytes`); // response 是服务器响应
            }
        };
 
        xhr.onerror = function() {
            alert("Request failed");
        };
    })
}
 
// module 查询历史进价
async function showHistoryGoodsPrice2() {
    const elmGetter = new ElementGetter();
    elmGetter.each('#purchase-Button-tableMenu', document, out_order => {
        out_order.style.display = "none";
    });
    elmGetter.each('.menu-shadow', document, out_order => {
        out_order.style.display = "none";
    });
    let list_order = [];
    let brand_id = document.querySelector('#purchase-supplier-showid-arrivalOrderAddPage').innerHTML;
    let brand_re = /[0-9\-]{2,}/;
    let brand = brand_id.match(brand_re);
    let goodsid = document.querySelector('tr.datagrid-row-selected td[field="goodsid"] div')
    let goodsname = document.querySelector('tr.datagrid-row-selected td[field="name"] div')
    // console.log(goodsid.innerHTML)
    // const form3 = await elmGetter.get('tr.datagrid-row-selected td[field="goodsname"] div');
    if (goodsid.innerHTML == '' || goodsid.innerHTML==undefined || goodsid.innerHTML == null) {
        $.messager.alert("提醒", "请选择一条记录");
        return false;
    }
    $("#orderPage-goods1-history-price").dialog({
        title: '供应商[' + brand + '] 商品[' + goodsid.innerHTML + ']' + goodsname.innerHTML + ' 历史进价',
        width: 600,
        height: 400,
        closed: false,
        modal: true,
        cache: false,
        maximizable: true,
        resizable: true,
    });
 
    const form = await elmGetter.get('#orderPage-goods1-history-price');
    let div_string = `
<div class="datagrid-header" style="width: 100%; height: 23px;">
    <div class="datagrid-header-inner" style="display: block;">
        <table class="datagrid-htable" border="0" cellspacing="0" cellpadding="0" style="height: 25px;">
            <tbody>
            <tr class="datagrid-header-row">
                <td field="businessdate" style="width: 16%">
                <div class="datagrid-cell datagrid-cell-c7-businessdate" style="text-align: center;">业务日期</div>
                </td>
                <td field="unitname" style="width: 8%">
                    <div class="datagrid-cell datagrid-cell-c6-unitname" style="text-align: center;">
                        <span>单位</span>
                        <span class="datagrid-sort-icon">&nbsp;</span>
                    </div>
                </td>
                <td field="unitnum" style="width: 16%">
                    <div class="datagrid-cell datagrid-cell-c6-unitnum" style="text-align: center;">
                        <span>数量</span>
                        <span class="datagrid-sort-icon">&nbsp;</span>
                    </div>
                </td>
                <td field="taxprice" style="width: 13%">
                    <div class="datagrid-cell datagrid-cell-c6-taxprice" style="text-align: center;">
                        <span>单价</span>
                        <span class="datagrid-sort-icon">&nbsp;</span>
                    </div>
                </td>
                <td field="boxprice" style="width: 13%">
                    <div class="datagrid-cell datagrid-cell-c6-boxprice" style="text-align: center;">
                        <span>箱价</span>
                        <span class="datagrid-sort-icon">&nbsp;</span>
                    </div>
                </td>
                <td field="taxamount" style="width: 17%">
                    <div class="datagrid-cell datagrid-cell-c6-taxamount" style="text-align: center;">
                        <span>金额</span>
                        <span class="datagrid-sort-icon">&nbsp;</span>
                    </div>
                </td>
                <td field="auxnumdetail" style="width: 17%">
                    <div class="datagrid-cell datagrid-cell-c6-auxnumdetail" style="text-align: center;">
                        <span>辅数量</span>
                        <span class="datagrid-sort-icon">&nbsp;</span>
                    </div>
                </td>
            </tr>
            </tbody>
            
        </table>
    </div>
</div>
<div class="datagrid-body" style="width: 100%; margin-top: 0px; height: 349px;">
    <table class="datagrid-btable">
        <tbody id ='table_row'>
        </tbody>
    </table>
</div>
`
    const form2 = await elmGetter.get('#orderPage-goods1-history-price');
 
    form2.innerHTML = div_string;
    let returns_order = await showInOutFlowListData(brand, goodsid.innerHTML)
    for (let row_num in returns_order) {
        user = {     // 一个对象
            date: returns_order[row_num].businessdate,  //业务日期
            unitname: returns_order[row_num].unitname,   //主单位
            unitnum: returns_order[row_num].enternum,    //数量
            price: returns_order[row_num].price,         //单价
            boxprice: ((returns_order[row_num].price * 1) * (returns_order[row_num].boxnum * 1)).toFixed(2),    //箱价
            amount: returns_order[row_num].amount,       //金额
            auxenternumdetail: returns_order[row_num].auxenternumdetail,     //入库辅数量
        };
        list_order.push(user)
    }
    let table_html = '';
    let table_parentNode = document.querySelector("#table_row");
    let x = 0;  //用x取余来做斑马格
    for (let row_num in list_order) {
        table_html = `
<tr id="datagrid-row-r6-2-${x}" datagrid-row-index="${x}" class="datagrid-row" style="height: 25px;width: 100%;">
    <td field="businessdate" style="width: 14.72%">
        <div style="text-align:center;height:auto;" class="datagrid-cell">
            ${list_order[row_num].date}
        </div>
    </td>
    <td field="unitname" style="width: 10%">
        <div style="text-align:center;height:auto;" class="datagrid-cell datagrid-cell-c6-unitname">
        ${list_order[row_num].unitname}</div>
    </td>
    <td field="unitnum" style="width: 16%">
        <div style="text-align:center;height:auto;" class="datagrid-cell datagrid-cell-c6-unitnum">
        ${list_order[row_num].unitnum}</div>
    </td>
    <td field="taxprice" style="width: 13%">
        <div style="text-align:center;height:auto;" class="datagrid-cell datagrid-cell-c6-taxprice">
        ${list_order[row_num].price}</div>
    </td>
    <td field="boxprice" style="width: 13%">
        <div style="text-align:center;height:auto;" class="datagrid-cell datagrid-cell-c6-boxprice">
        ${list_order[row_num].boxprice}</div>
    </td>
    <td field="taxamount" style="width: 17%">
        <div style="text-align:center;height:auto;" class="datagrid-cell datagrid-cell-c6-taxamount">
        ${list_order[row_num].amount}</div>
    </td>
    <td field="notaxprice" style="width: 17%">
        <div style="text-align:center;height:auto;" class="datagrid-cell datagrid-cell-c6-auxnumdetail">
        ${list_order[row_num].auxenternumdetail}</div>
    </td>
</tr>
` + table_html;
        x = ++x;
    }
    // console.log(table_html);
    table_parentNode.innerHTML = table_html;
}