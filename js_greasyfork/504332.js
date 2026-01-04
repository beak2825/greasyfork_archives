

// ==UserScript==
// @name         temu备货单扩展-抢发货台
// @namespace    http://temu.nalido.com/
// @version      0.1
// @description  Access a link with the current page's cookies
// @author       You
// @match        https://seller.kuajingmaihuo.com/main/order-manag*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_getTabs
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/504332/temu%E5%A4%87%E8%B4%A7%E5%8D%95%E6%89%A9%E5%B1%95-%E6%8A%A2%E5%8F%91%E8%B4%A7%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/504332/temu%E5%A4%87%E8%B4%A7%E5%8D%95%E6%89%A9%E5%B1%95-%E6%8A%A2%E5%8F%91%E8%B4%A7%E5%8F%B0.meta.js
// ==/UserScript==

// temu js版本号
var HTML_V = '5-108-0';

// 0: json; 1:csv -1:none
const EXPORT_TYPE = -1;

var dataWindow = undefined;

// 监控页面是否发生变化
let exportEnabled = true;

var deliveryListPreDOM = undefined;
var deliveryRetryMsgPreDOM = undefined;
const maxRetries = 3;
var debounceLock = false;
// 无限重试的开关
var infinityFLag = true;
// 功能总开关
var retryEnabled = true;
const targetTimeMillis = new Date().setHours(13,59,30,0);

const selectedColumns = {
    "originalPurchaseOrderSn": "备货母单号",
    "subPurchaseOrderSn": "备货单号",
    "productName": "产品名称",
    "category": "类目",
    "categoryType": "categoryType",
    "productSkcId": "SKC",
    "productSkcPicture": "图片链接",
    "status": "状态",
    "className": "属性",
    "productSkuId": "SKU",
    "supplierPrice": "申报价格",
    "purchaseQuantity": "备货数",
    "realReceiveAuthenticQuantity": "入库数",
    "deliverQuantity": "送库数",
    "subWarehouseName": "收货仓库",
    "deliveryOrderSn": "发货单号",
    "deliverTime": "发货时间",
    "receiveTime": "收货时间",
    "isFirst": "是否首单",
    //"applyDeleteStatus": "作废审核中",
};

function selectedData(rawData){

    // 定义过滤函数，接收要过滤的属性名
    const selectProperties = (obj, propertiesToSelect) => {
        return Object.fromEntries(
            Object.entries(obj).filter(([key]) => {
                //console.log("key", key, propertiesToSelect.includes(key), propertiesToSelect);
                return propertiesToSelect.includes(key);
            })
        );
    };

    const selected = [];
    if(EXPORT_TYPE >= 0){
        selected.push(selectedColumns);
    }
    rawData.forEach(row => {
        // 使用过滤函数，指定要过滤的属性
        const filteredObject = selectProperties(row, Object.keys(selectedColumns));
        selected.push(filteredObject);
    });
    return selected;
}

function formateTimestamp(timestr) {
    const timestamp = Number(timestr);
    if(isNaN(timestamp) || timestamp == 0){
        return timestr;
    }

    const formattedDate = moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
    return formattedDate;
}

/**
按照csv格式输出
**/
function exportAsCsv(supplierName, data, filename){
    // 转换数据为文本格式
    let textContent = "";
    data.forEach(row => {
        Object.keys(selectedColumns).forEach(col => {
            if(['receiveTime','deliverTime'].includes(col)){
                textContent += formateTimestamp(row[col]) + ',';
            }
            else {
                textContent += row[col] + ',';
            }
        });
        textContent += '\n';
    });


    // 创建Blob对象
    const blob = new Blob([textContent], { type: 'text/plain' });

    // 创建下载链接并模拟点击下载
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `${supplierName}_${filename}.csv`;
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

};

/**
按照json格式输出
**/
function exportAsJson(supplierName, data, filename){
    // 转换数据为文本格式
    const textContent = JSON.stringify(data, null, 2);

    // 创建Blob对象
    const blob = new Blob([textContent], { type: 'text/plain' });

    // 创建下载链接并模拟点击下载
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `${supplierName}_${filename}.txt`;
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
};

function try2SaveInLocalDB(supplierName, data) {
    try{
        if(dataWindow){
            dataWindow.postMessage({
                type: "purchaseOrders",
                data,
                supplierName
            }, "*");
        }

        dataWindow.focus();
    } catch (e) {
        console.error(e);
    }
}

// 打开新窗口用于传输数据
function openDataWindow(){
    if(!dataWindow){
        dataWindow = window.open("http://localhost:8090/purchaseOrders", "dataWindow");
    }
}

function refetch(originalFetch, lastQuery) {

    if(!exportEnabled) {
        alert("暂时仅支持下载【普通备货单】数据!");
        return;
    }

    originalFetch(lastQuery.url, lastQuery.options)
        .then(response => response.json())
        .then(data => {
        console.log('Data:', data);

        if(!data.success){
            alert(data.errorMsg);
            return;
        }

        // 进一步处理数据
        const rawData = data.result.subOrderForSupplierList;
        console.log("rawData:", rawData);

        // 特殊处理
        const parsedData = {
            data: [],
            supplierName: "UNKNOWN"
        };
        rawData.forEach(row => {
            const { skuQuantityDetailList, deliverInfo, supplierName, ...filteredObject } = row;
            skuQuantityDetailList.forEach(sku => {
                const expandedRow = {
                    supplierName,
                    ...filteredObject,
                    ...deliverInfo,
                    ...sku,
                };
                console.log("expandedRow:", expandedRow);
                parsedData.data.push(expandedRow);
            });
            parsedData.supplierName = supplierName;
        });

        try2SaveInLocalDB(parsedData.supplierName, selectedData(parsedData.data));

        if(EXPORT_TYPE === 0){
            exportAsJson(parsedData.supplierName, selectedData(parsedData.data), lastQuery.requestName);
        }
        else if(EXPORT_TYPE === 1){
            exportAsCsv(parsedData.supplierName, selectedData(parsedData.data), lastQuery.requestName);
        }
    })
        .catch(error => {
        console.error('Error:', error);
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 更新倒计时的函数
function updateCountdown() {
    var curTime = new Date();
    const currentTimeMillis = curTime.getTime();
    const delayMillis = targetTimeMillis - currentTimeMillis;
    // console.log("ready to go:", {currentTimeMillis, targetTimeMillis, delayMillis});

    // 距离1秒内停止刷新
    if(delayMillis<=1000 || !retryEnabled){
        updatePreDOM(deliveryRetryMsgPreDOM, `重试: --`);
        console.log('开始自动抢发货台！');
        reJoin(-1);
        return;
    }

    // 计算毫秒、秒、分和小时
    const milliseconds = delayMillis % 1000;
    const seconds = Math.floor(delayMillis / 1000) % 60;
    const minutes = Math.floor(delayMillis / (1000 * 60)) % 60;
    const hours = Math.floor(delayMillis / (1000 * 60 * 60));

    // 将时间格式化为字符串
    const formattedTime = `${hours}:${minutes}:${seconds}.${milliseconds}`;

    updatePreDOM(deliveryRetryMsgPreDOM, `${formattedTime}\t后开始抢发货台`);

    // 请求下一帧更新倒计时
    requestAnimationFrame(updateCountdown);
}

function prepareToScramble(){
    var curTime = new Date();
    const currentTimeMillis = curTime.getTime();
    const delayMillis = targetTimeMillis - currentTimeMillis;
    console.log("ready to go:", {currentTimeMillis, targetTimeMillis, delayMillis});

    if(delayMillis > 0) {
        updateCountdown();
    }

    return delayMillis > 0;
}

// 发送请求的函数
async function reJoin(maxRetries) {
    let retries = 0;
    const isInfinity = maxRetries === -1 && infinityFLag;
    let forceRetryCountDown = 10;

    try{
        while (retries < maxRetries || isInfinity) {
            if(!retryEnabled){
                console.log(`退出抢发货台功能！`);
                break;
            }

            console.log(`开始抢发货台`, {debounceLock, retries, maxRetries, infinityFLag, isInfinity});
            if(!debounceLock) {
                handleBatchJoin();
                retries++;
                forceRetryCountDown = 10;
                updatePreDOM(deliveryRetryMsgPreDOM, `重试: ${retries}`);
            }
            else {
                forceRetryCountDown -= 1;
                if(forceRetryCountDown < 0){
                    debounceLock = false;
                }
                await sleep(200);
            }
        }

        updatePreDOM(deliveryRetryMsgPreDOM, `重试: ${retries}`);
        console.log('抢返货台已达到最大重试次数，终止请求。');
    }
    catch (e) {
        console.log('脚本执行出粗！', e);
        debounceLock = false;
        alert('脚本执行出错！！');
    }
}

function doJoinDelivery(maxRetries){
    if(maxRetries === 1 || maxRetries === -1) {
        reJoin(maxRetries);
        return;
    }

    const isReady = prepareToScramble();
    if(!isReady){
        console.log(`不在配置时间前触发，只自动运行${maxRetries}次`);
        reJoin(maxRetries);
    }
}

function handleBatchJoin(){
    getHTMLVersion();
    console.log("html版本号:", HTML_V);

    const selectAllCheckbox = document.querySelector(`#root > div > div.outerWrapper-1-3-1.outerWrapper-d0-1-3-2.index-module__table-with-filter___cCyT_ > div.index-module__flex-1-1___1sS5J.index-module__column-space-between___TZS4c > div.index-module__flex-1-1___1sS5J > div.TB_outerWrapper_${HTML_V}.TB_bordered_${HTML_V}.TB_notTreeStriped_${HTML_V} > div > div > div.TB_header_${HTML_V}.TB_headerSticky_${HTML_V}.TB_headerScroll_${HTML_V} > table > thead > tr > th.TB_checkCell_${HTML_V}.TB_th_${HTML_V}.TB_leftSticky_${HTML_V} > span > span > label > div > input`);
    if(!selectAllCheckbox.checked){
        selectAllCheckbox.click();
    }

    const batchJoinButton = document.querySelector(`#root > div > div.outerWrapper-1-3-1.outerWrapper-d0-1-3-2.index-module__table-with-filter___cCyT_ > div.index-module__flex-0-0___I-d-v > div.index-module__divider-wrapper___YbEak > div > div.order-manage_handleCnt__xLiVi > div.order-manage_leftCnt__29lG9 > button:nth-child(2)`);
    batchJoinButton.click();

    debounceLock = true;
}

function getHTMLVersion(){
    var elements = document.querySelectorAll('[class^="TAB_cardLabel_"]');
    HTML_V = elements[0].className.slice(14);
}

function removeClassName(dom, clazz){
    var classes = dom.className.split(' ');
    var filteredClasses = classes.filter(claz => claz !== clazz);
    dom.className = filteredClasses.toString();
}

function addClassName(dom, clazz){
    dom.className += ` ${clazz}`;
}


function updatePreDOM(preDOM, msg){
    if(!preDOM) {
        return;
    }

    preDOM.innerHTML = `${msg}`;
}

function updateDeliveryList(msg){
    if(!deliveryListPreDOM) {
        return;
    }

    deliveryListPreDOM.innerHTML = "发货单列表:\n";
    var jsonMsg = JSON.parse(msg);
    jsonMsg.joinDeliveryPlatformRequestList.forEach(row => {
        deliveryListPreDOM.innerHTML += `${row.subPurchaseOrderSn}\n`;
    });
}

(function() {
    'use strict';

    //     // 创建 MutationObserver 实例
    //     const observer = new MutationObserver(() => {
    //         // exportEnabled = window.location.href.endsWith("https://kuajing.pinduoduo.com/main/order-manage");
    //         // // 页面 URL 发生变化
    //         // console.log('Page URL has changed:', window.location.href, exportEnabled);

    //     });

    //     // 配置 MutationObserver 监听 <html> 元素的子节点变化
    //     const config = { childList: true, subtree: true };
    //     observer.observe(document.documentElement, config);



    //轮询页面出现的确认按钮，自动点击
    const timer = setInterval(function() {
        getHTMLVersion();
        // 在这里检查新按钮是否出现
        const confirmButton = document.querySelector(`body > div.MDL_outerWrapper_${HTML_V}.MDL_alert_${HTML_V}.undefined > div > div > div > div.MDL_body_${HTML_V}.MDL_noHeader_${HTML_V} > div > div:nth-child(3) > button.BTN_outerWrapper_${HTML_V}.BTN_primary_${HTML_V}.BTN_medium_${HTML_V}.BTN_outerWrapperBtn_${HTML_V}`);
        if (confirmButton) {
            // 如果新按钮出现了，执行你的操作
            console.log('批量加入发货台的确认按钮已出现，点击它！');
            confirmButton.click();
        }
        const joinFailedButton = document.querySelector(`body > div.MDL_outerWrapper_${HTML_V}.MDL_alert_${HTML_V}.MDL_withLogo_${HTML_V}.undefined > div > div > div > div.MDL_bottom_${HTML_V} > div.MDL_footer_${HTML_V} > div > button`);
        if (joinFailedButton) {
            // 如果新按钮出现了，执行你的操作
            console.log('批量加入发货台失败的确认按钮已出现，点击它！');
            joinFailedButton.click();
            debounceLock = false;
        }
    }, 200);

    // 保存原始的fetch函数
    const originalFetch = window.fetch;
    const lastQuerySubOrderList = {
        url: "",
        options:{},
        requestName: "",
    };
    const LastQueryOfJoinDelivery = {
        url: "",
        options:{},
        requestName: "",
    };

//     // 重写fetch函数
//     window.fetch = function(url, options) {
//         // 在这里添加你想要执行的逻辑，例如记录Fetch请求
//         //console.log('Fetch Request:', url, options);

//         // 判断请求是否匹配特定路径
//         if (url.endsWith('supplier/purchase/manager/querySubOrderList')) {
//             lastQuerySubOrderList.url = url;
//             lastQuerySubOrderList.options = options;
//             const requestBody = JSON.parse(options.body);
//             lastQuerySubOrderList.requestName = `querySubOrderList_${requestBody.statusList}_${requestBody.pageNo}_${requestBody.pageSize}`;
//             console.log('get a new querySubOrderList:', lastQuerySubOrderList);
//         }
//         // if (url.endsWith('supplier/purchase/manager/batchJoinDeliveryOrderPlatformV2')) {
//         //     LastQueryOfJoinDelivery.url = url;
//         //     LastQueryOfJoinDelivery.options = options;
//         //     const requestBody = JSON.parse(options.body);
//         //     LastQueryOfJoinDelivery.requestName = `batchJoinDeliveryOrderPlatformV2`;
//         //     updateDeliveryList(options.body);
//         //     console.log('get a new batchJoinDeliveryOrderPlatformV2:', LastQueryOfJoinDelivery);
//         // }

//         // 调用原始的fetch函数
//         return originalFetch.apply(this, arguments);
//     };

    window.addEventListener('beforeFetch', function(e) {
        const { url, options } = e.detail;
        if (url.endsWith('supplier/purchase/manager/querySubOrderList')) {
            lastQuerySubOrderList.url = url;
            lastQuerySubOrderList.options = options;
            const requestBody = JSON.parse(options.body);
            lastQuerySubOrderList.requestName = `querySubOrderList_${requestBody.statusList}_${requestBody.pageNo}_${requestBody.pageSize}`;
            console.log('get a new querySubOrderList:', lastQuerySubOrderList);
        }
    });




    // 创建一个新的style元素
    const styleElement = document.createElement('style');

    // 定义按钮样式
    styleElement.textContent = `
        .custom-button-container {
            position: absolute;
            top: 10px;
            left: 200px;
            height: 40px;
            z-index: 999;
        }
        .custom-button {
            background-color: #fb7701;
            border: none;
            color: white;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 14px;
            margin-right: 20px;
            margin-bottom: 8px;
            cursor: pointer;
            border-radius: 5px;
        }
        .floating-div {
            visibility: hidden;
            position: absolute;
            top: 80px;
            right: 24px;
            width: 400px;
            background-color: #fb7701d9;
            border: none;
            border-radius: 5px;
            color: white;
            padding: 10px 20px;
            z-index: 10 !important;
        }
        .visible {
            visibility: visible;
        }
    `;

    // 将style元素添加到页面头部
    document.head.appendChild(styleElement);


    // 所有扩展按钮的集合
    var buttonContainer = document.createElement("div");
    buttonContainer.className = 'custom-button-container';
    document.body.appendChild(buttonContainer);

    //===============↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓下载备货单数据↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓============================
    // // 创建按钮元素
    // var buttonExportSubOrders = document.createElement("button");

    // // 设置按钮文本
    // buttonExportSubOrders.innerHTML = "下载当前页面的备货单数据";

    // // 添加点击事件处理程序
    // buttonExportSubOrders.addEventListener("click", function() {
    //     openDataWindow();
    //     refetch(originalFetch, lastQuerySubOrderList);
    // });
    // // 添加样式，使按钮浮动在页面上方
    // buttonExportSubOrders.className = 'custom-button'; // 应用定义的样式类

    // // 将按钮添加到页面的某个元素中（这里添加到 buttonContainer 元素中）
    // buttonContainer.appendChild(buttonExportSubOrders);
    //===============↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑下载备货单数据↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑============================

    //===============↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓抢发货台↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓============================
    // 创建按钮元素
    var JoinDeliveryDiv = document.createElement("div");
    JoinDeliveryDiv.className = 'floating-div';
    document.body.appendChild(JoinDeliveryDiv);

    var buttonReJoin = document.createElement("button");
    buttonReJoin.innerHTML = "定时抢";
    buttonReJoin.addEventListener("click", function() {
        debounceLock = false;
        infinityFLag = true;
        doJoinDelivery(3);
    });
    buttonReJoin.className = 'custom-button';
    JoinDeliveryDiv.appendChild(buttonReJoin);

    var buttonReJoinInfinity = document.createElement("button");
    buttonReJoinInfinity.innerHTML = "无限抢";
    buttonReJoinInfinity.addEventListener("click", function() {
        debounceLock = false;
        infinityFLag = true;
        doJoinDelivery(-1);
    });
    buttonReJoinInfinity.className = 'custom-button';
    JoinDeliveryDiv.appendChild(buttonReJoinInfinity);

    var buttonReJoinByHand = document.createElement("button");
    buttonReJoinByHand.innerHTML = "手动抢";
    buttonReJoinByHand.addEventListener("click", function() {
        debounceLock = false;
        infinityFLag = false;
        doJoinDelivery(1);
    });
    buttonReJoinByHand.className = 'custom-button';
    JoinDeliveryDiv.appendChild(buttonReJoinByHand);

    var buttonReJoinClose = document.createElement("button");
    buttonReJoinClose.innerHTML = "关闭";
    buttonReJoinClose.addEventListener("click", function() {
        infinityFLag = false;
        retryEnabled = false;
        removeClassName(JoinDeliveryDiv, "visible");
    });
    buttonReJoinClose.className = 'custom-button';
    JoinDeliveryDiv.appendChild(buttonReJoinClose);

    deliveryRetryMsgPreDOM = document.createElement("pre");
    deliveryRetryMsgPreDOM.innerHTML = `重试: --`;
    JoinDeliveryDiv.appendChild(deliveryRetryMsgPreDOM);

    deliveryListPreDOM = document.createElement("pre");
    deliveryListPreDOM.innerHTML = `GO GO GO`;
    JoinDeliveryDiv.appendChild(deliveryListPreDOM);



    // 总开关按钮
    var buttonJoinDelivery = document.createElement("button");
    buttonJoinDelivery.innerHTML = "抢发货台";
    buttonJoinDelivery.addEventListener("click", function() {
        retryEnabled = true;
        addClassName(JoinDeliveryDiv, "visible");
    });
    buttonJoinDelivery.className = 'custom-button';
    buttonContainer.appendChild(buttonJoinDelivery);
    //===============↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑抢发货台↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑============================
})();
