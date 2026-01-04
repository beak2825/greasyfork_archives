// ==UserScript==
// @name        拼DD多功能
// @namespace    pddsuper
// @version      1.21
// @description  订单界面自动免拼单自动备注无痕发货,删除付款界面多余元素,导出退款失败等
// @author       刘俊辉
// @license      刘俊辉 license
// @match        *://mobile.yangkeduo.com/*
// @match        *://*.taobao.com/*
// @match        *://*.tmall.com/*
// @icon         https://www.pinduoduo.com/homeFavicon.ico
// @grant        none
// @require https://greasyfork.org/scripts/443445-nanobar/code/nanobar.js?version=1040509
// @require https://greasyfork.org/scripts/452508-%E9%BB%91%E5%90%8D%E5%8D%95%E5%95%86%E5%AE%B6/code/%E9%BB%91%E5%90%8D%E5%8D%95%E5%95%86%E5%AE%B6.js
// @downloadURL https://update.greasyfork.org/scripts/439748/%E6%8B%BCDD%E5%A4%9A%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/439748/%E6%8B%BCDD%E5%A4%9A%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==
var pddNumber = getCookie("pdd_user_id"),
    pddToken = getCookie("PDDAccessToken"),
    data_list = Array(["退款状态", "订单号", "申请金额", "申请时间", "\n"]),
    导出退款失败订单号, 导出退款失败订单金额, 导出退款失败下单时间, 导出退款失败下一页售后单号, 导出退款失败退款状态,售后信息, 拼多多用户名,
    //↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑上面不能改↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑//

    //↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓自定义↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓//
    手机号 = "13377715550",
    退货退款问题描述 = "不喜欢",
    自动备注拼多多订单内容 = "无痕发货有事请电联13377715550",
    导出退款失败表格名字 = '退款失败订单信息';
//↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑自定义↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑//

//↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓下面不能改↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓//
window.onload = addbut;
async function addbut() {
    if (location.search.substr(0, 16) == '?group_order_id=') { 发起备注(); };
    if (location.search.substr(0, 10) == '?goods_id='||location.pathname == '/item.htm') { 商家黑名单(); };
    if (location.search.substr(0, 7) == '?type=5') {创建一键免拼按钮();};
    if (location.search.substr(0, 16) == '?group_order_id=') { let 备注订单号 = window.rawData.store.data.queries.orderSn; await 发起备注(备注订单号); };
    if (location.search.substr(0, 8) == '?sku_id=') { 删除多余元素(); };
    if (location.search.substr(0, 13) == '?_oc_rank_id=') { 删除多余元素();/*拼多多*/ }else if (location.pathname == '/order_checkout.html') { 删除多余元素();/*拼多多2*/ }else if (location.pathname == '/auction/buy_now.jhtml') { 删除多余元素();/*淘宝*/ }else if (location.pathname == '/auction/buy_now.jhtml') { 删除多余元素();/*淘宝2*/ }else if (location.pathname == '/order/confirm_order.htm') { 删除多余元素();/*天猫*/ };
    if (location.search.substr(0, 9) == '?keyWord=') { 创建退款按钮(); };
    if (location.pathname == '/order.html') { 订单详情创建退款按钮(); };
    if (location.pathname == '/personal.html') { 创建导出退款失败订单(); };
};

function 商家黑名单() {
    var 拍单的店铺名字;
    if (document.getElementsByClassName("slogo-shopname").length>0) {
        拍单的店铺名字 = document.getElementsByClassName("slogo-shopname")[0].innerText;
    } else if (document.getElementsByClassName("tb-shop-name").length>0) {
        拍单的店铺名字 = document.getElementsByClassName("tb-shop-name")[0].innerText;
    }else if(document.getElementsByClassName('ShopHeader--title--2qsBE1A').length>0){
        拍单的店铺名字 = document.getElementsByClassName('ShopHeader--title--2qsBE1A')[0].innerText;
    }else {
        拍单的店铺名字 = window.rawData.store.initDataObj.mall.mallName;
    }
    console.log(拍单的店铺名字)
    var 是否存在 = 黑名单上家.includes(拍单的店铺名字);
    if (是否存在) { alert("这是黑名单上家"); } else { return false; };
};

function 删除多余元素() {
    var child = document.getElementById("layui-layer-shade2");
    child.parentNode.removeChild(child);
};

function 发起备注(备注订单号) {
    return new Promise((resolve) => {
        setTimeout(() => {
            let url = "https://mobile.yangkeduo.com/proxy/api/api/debye/update_order_buyer_memo?pdduid=" + pddNumber;
            let obj = { "order_sn": 备注订单号, "buyer_memo": 自动备注拼多多订单内容 };
            let httpRequest = new XMLHttpRequest();
            httpRequest.open('POST', url, true);
            httpRequest.setRequestHeader("Content-type", "application/json;charset=UTF-8");
            httpRequest.setRequestHeader("accesstoken", pddToken);
            httpRequest.setRequestHeader("Authorization", "PDDAccessToken=" + pddToken + ";pdd_user_id=" + pddNumber);
            httpRequest.send(JSON.stringify(obj));
            httpRequest.onreadystatechange = function () {
                if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                    resolve("发起备注完成");
                };
            };
        }, 0);
    });
};

function 直接免评(grouporderid) {
    return new Promise((resolve) => {
        setTimeout(() => {
            let url = "https://mobile.yangkeduo.com/proxy/api/api/vancouver/direct_auto_confirm_group?group_order_id=" + grouporderid + "&pdduid=" + pddNumber;
            let httpRequest = new XMLHttpRequest();
            httpRequest.open('POST', url, true);
            httpRequest.setRequestHeader("Content-type", "application/json;charset=UTF-8");
            httpRequest.setRequestHeader("accesstoken", pddToken);
            httpRequest.setRequestHeader("Authorization", "PDDAccessToken=" + pddToken + ";pdd_user_id=" + pddNumber);
            httpRequest.send();
            httpRequest.onreadystatechange = function () {
                if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                    resolve("免评成功");
                }else if(httpRequest.status == 403){
                    let 响应TEXT = httpRequest.responseText;
                    let 响应JSON = JSON.parse(响应TEXT);
                    alert(响应JSON.error_payload.view_object.title)
                    location.reload();
                    return false;
                }
            };
        }, 0)
    });
};

function 创建一键免拼按钮() {
    let button = document.createElement("a");
    button.id = "yijianmianpin";
    button.style = "background-color: #e02e24;border-bottom-left-radius: .04rem;border-top-left-radius: .04rem;color: #fff;font-size: .13rem;height: .32rem;line-height: .32rem;margin-top: .12rem;padding-right: .08rem;position: fixed;right: 0;text-align: center;top: 0;width: .9rem;z-index: 10001;margin-top: 1.75rem;"
    button.innerHTML = "<span>一键免拼</span>";
    button.onclick = async function () {
        获取带分享的订单();
    };
    let x = document.getElementsByClassName("pdd-go-to-app")[0].parentNode;
    x.appendChild(button);
};

function 获取带分享的订单() {
    return new Promise((resolve) => {
        setTimeout(() => {
            let url = "https://mobile.yangkeduo.com/proxy/api/api/aristotle/order_list_v3?pdduid=" + pddNumber + "&is_back=1";
            let data = { "type": "grouping", "page": 1, "origin_host_name": "mobile.yangkeduo.com", "page_from": 0, "size": 50, "offset": "" };
            let httpRequest = new XMLHttpRequest();
            httpRequest.open('POST', url, true);
            httpRequest.setRequestHeader("Content-type", "application/json;charset=UTF-8");
            httpRequest.setRequestHeader("accesstoken", pddToken);
            httpRequest.setRequestHeader("Authorization", "PDDAccessToken=" + pddToken + ";pdd_user_id=" + pddNumber);
            httpRequest.send(JSON.stringify(data));
            httpRequest.onreadystatechange = async function () {
                if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                    let 响应TEXT = httpRequest.responseText;
                    let 响应JSON = JSON.parse(响应TEXT);
                    let 订单数量 = 响应JSON.orders.length;
                    if (订单数量 > 0) {
                        for (let i = 0; i < 订单数量; i++) {
                            let grouporderid = 响应JSON.orders[i].group_order_id;
                            let 备注订单号 = 响应JSON.orders[i].order_sn;
                            await 直接免评(grouporderid);
                            await 发起备注(备注订单号);
                        };
                        获取带分享的订单();
                    } else {
                        alert("没有可以免评的订单了");
                        location.reload();
                        return false;
                    };
                    resolve("获取带分享的订单成功");
                };
            };
        }, 0);
    });
};

function 创建退款按钮() {
    let button = document.createElement("a");
    button.id = "btnthtk";
    button.className = "_318xvwzd";
    button.innerHTML = "<span>退货退款</span>";
    button.onclick = function () { 发起退货退款() };
    let button1 = document.createElement("a");
    button1.id = "btnqxdd";
    button1.className = "_318xvwzd";
    button1.innerHTML = "<span>取消订单</span>";
    button1.onclick = function () { 发起取消订单() };
    let x = document.getElementsByClassName("_2XxabK2M")[0];
    x.appendChild(button);
    x.appendChild(button1);
};

function 发起退货退款() {
    let 订单号 = window.rawData.resultStore.keyWord, 订单金额 = window.rawData.resultStore.orders[0].displayAmount;
    let url = "https://mobile.yangkeduo.com/proxy/api/after_sales/create?pdduid=" + pddNumber;
    let obj = { "order_sn": 订单号, "msg_id": 0, "coupon_return_control_type": 0, "after_sales_type": 2, "user_ship_status": 0, "user_phone": 手机号, "images": [], "return_coupon_amount": 0, "question_type": 88, "question_desc": 退货退款问题描述, "apply_amount": 订单金额, "refund_amount": 订单金额, "new_refund_amount": 订单金额, "is_lite": true };
    let httpRequest = new XMLHttpRequest();
    httpRequest.open('POST', url, true);
    httpRequest.setRequestHeader("Content-type", "application/json;charset=UTF-8");
    httpRequest.setRequestHeader("accesstoken", pddToken);
    httpRequest.setRequestHeader("Authorization", "PDDAccessToken=" + pddToken + ";pdd_user_id=" + pddNumber);
    httpRequest.send(JSON.stringify(obj));
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            window.location.reload();
        };
    };
};

function 发起取消订单() {
    let 订单号 = window.rawData.resultStore.keyWord, 订单金额 = window.rawData.resultStore.orders[0].displayAmount
    let url = "https://mobile.yangkeduo.com/proxy/api/after_sales/create?pdduid=" + pddNumber;
    let obj = { "order_sn": 订单号, "msg_id": 0, "coupon_return_control_type": 0, "after_sales_type": 1, "user_ship_status": 1, "user_phone": 手机号, "images": [], "return_coupon_amount": 0, "question_type": 197, "question_desc": "1", "apply_amount": 订单金额, "refund_amount": 订单金额, "new_refund_amount": 订单金额, "is_lite": true };
    let httpRequest = new XMLHttpRequest();
    httpRequest.open('POST', url, true);
    httpRequest.setRequestHeader("Content-type", "application/json;charset=UTF-8");
    httpRequest.setRequestHeader("accesstoken", pddToken);
    httpRequest.setRequestHeader("Authorization", "PDDAccessToken=" + pddToken + ";pdd_user_id=" + pddNumber);
    httpRequest.send(JSON.stringify(obj));
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            window.location.reload();
        };
    };
};

function 订单详情创建退款按钮() {
    let button = document.createElement("a");
    button.id = "btnthtk";
    button.className = "_1iJ5VLRf _2W5v1zLE";
    button.innerHTML = "<span>退货退款</span>";
    button.onclick = function () { 订单详情发起退货退款() };
    let button1 = document.createElement("a");
    button1.id = "btnqxdd";
    button1.className = "_1iJ5VLRf _2W5v1zLE";
    button1.innerHTML = "<span>取消订单</span>";
    button1.onclick = function () { 订单详情发起取消订单() };
    let x = document.getElementsByClassName("j22hvRYc")[0];
    x.appendChild(button);
    x.appendChild(button1);
};

function 订单详情发起退货退款() {
    let 订单号 = window.rawData.data.orderSn, 订单金额 = window.rawData.data.orderAmount;
    let url = "https://mobile.yangkeduo.com/proxy/api/after_sales/create?pdduid=" + pddNumber;
    let obj = { "order_sn": 订单号, "msg_id": 0, "coupon_return_control_type": 0, "after_sales_type": 2, "user_ship_status": 0, "user_phone": 手机号, "images": [], "return_coupon_amount": 0, "question_type": 88, "question_desc": 退货退款问题描述, "apply_amount": 订单金额, "refund_amount": 订单金额, "new_refund_amount": 订单金额, "is_lite": true };
    let httpRequest = new XMLHttpRequest();
    httpRequest.open('POST', url, true);
    httpRequest.setRequestHeader("Content-type", "application/json;charset=UTF-8");
    httpRequest.setRequestHeader("accesstoken", pddToken);
    httpRequest.setRequestHeader("Authorization", "PDDAccessToken=" + pddToken + ";pdd_user_id=" + pddNumber);
    httpRequest.send(JSON.stringify(obj));
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            window.location.reload();
        };
    };
};

function 订单详情发起取消订单() {
    let 订单号 = window.rawData.data.orderSn, 订单金额 = window.rawData.data.orderAmount;
    let url = "https://mobile.yangkeduo.com/proxy/api/after_sales/create?pdduid=" + pddNumber;
    let obj = { "order_sn": 订单号, "msg_id": 0, "coupon_return_control_type": 0, "after_sales_type": 1, "user_ship_status": 1, "user_phone": 手机号, "images": [], "return_coupon_amount": 0, "question_type": 197, "question_desc": "1", "apply_amount": 订单金额, "refund_amount": 订单金额, "new_refund_amount": 订单金额, "is_lite": true };
    let httpRequest = new XMLHttpRequest();
    httpRequest.open('POST', url, true);
    httpRequest.setRequestHeader("Content-type", "application/json;charset=UTF-8");
    httpRequest.setRequestHeader("accesstoken", pddToken);
    httpRequest.setRequestHeader("Authorization", "PDDAccessToken=" + pddToken + ";pdd_user_id=" + pddNumber);
    httpRequest.send(JSON.stringify(obj));
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            window.location.reload();
        };
    };
};
//获取退款列表查询单号
function GetnextQueryCreatedAt() {

    return new Promise((resolve, reject) => {
        setTimeout(() => {
    fetch("https://mobile.yangkeduo.com/complaint_list.html?refer_page_name=personal&refer_page_id=10001_1700576246281_nz1qzscwvm&refer_page_sn=10001", {
        "headers": {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        },
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(htmlContent => {
        // 使用正则表达式提取window.rawData的内容
        const match = htmlContent.match(/<script>window\.rawData=(.*?);<\/script>/);
        if (match && match[1]) {
            const rawDataText = match[1];
            const rawDataObject = JSON.parse(rawDataText);
            const nextQueryCreatedAt = rawDataObject.store.requestMap.all.nextQueryCreatedAt;
            // 处理你的数据
            resolve(nextQueryCreatedAt);
        } else {
            console.error('window.rawData script not found in the HTML.');
            resolve('window.rawData script not found in the HTML.');
        }
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
        resolve('There has been a problem with your fetch operation:', error);
    });
                    }, 0);
    });
}

var 当前进度, nanobar, options;
function 创建导出退款失败订单() {
    GetMyInfo();//获取拼多多用户信息
    let button = document.createElement("a");
    button.id = "daochjtksb";
    button.style = "background-color: #e02e24;border-bottom-left-radius: .04rem;border-top-left-radius: .04rem;color: #fff;font-size: .13rem;height: .32rem;line-height: .32rem;margin-top: .12rem;padding-right: .08rem;position: fixed;right: 0;text-align: right;top: 0;width: .9rem;z-index: 10001;margin-top: 1.3rem;";
    button.innerHTML = "<span>导出退款失败</span>";
    button.onclick = async function () {
        var msg = "开始导出" + 拼多多用户名 + "的退款失败订单\n导出完成后会自动弹出下载\n请耐心等待下\n\n在顶部会有进度条查看进度\n请确认是否导出！";
        if (confirm(msg) == true) {
            let nextQueryCreatedAt = await GetnextQueryCreatedAt();//获取退款列表查询单号
            await 取拼多多售后单(nextQueryCreatedAt);
        } else {
            return false;
        };
    };
    let x = document.getElementsByClassName("pdd-go-to-app")[0].parentNode;//通过父节点定位
    x.appendChild(button);
    options = {
        target: document.getElementById('main'),
    };
    nanobar = new Nanobar(options);
    当前进度 = 0;
    nanobar.go(100);
};

function extractOrderSn(url) {
    const match = url.match(/order_sn=([^&]+)/);
    return match ? match[1] : null;
}

function 核对导出退款失败退款状态(after_sales_id, order_sn) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const url = `https://mobile.yangkeduo.com/complaint_detail.html?after_sales_id=${after_sales_id}&order_sn=${order_sn}&refer_page_name=complaint&refer_page_id=10132_1700581288202_3ajmlyfzoy&refer_page_sn=10132`;

            fetch(url, {
                method: 'GET',
                headers: {
                    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                },
                mode: 'cors',
                credentials: 'include',
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(htmlContent => {
                // 使用正则表达式提取window.rawData的内容
                const match = htmlContent.match(/<script>window\.rawData=(.*?);<\/script>/);
                if (match && match[1]) {
                    const rawDataText = match[1];
                    const rawDataObject = JSON.parse(rawDataText);
                    售后信息 = rawDataObject;
                    resolve('Check refund status successful');
                } else {
                    console.error('window.rawData script not found in the HTML.');
                }
                resolve('Check refund status successful');
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
                reject(error);
            });
        }, 0);
    });
}

async function 取拼多多售后单(导出退款失败下一页售后单号) {
    return new Promise((resolve) => {
        setTimeout(() => {
            let 获取拼多多售后单url = "https://mobile.yangkeduo.com/proxy/api/api/blade/after_sales_list?pdduid=" + pddNumber;
            let 请求拼多多售后单信息 = new XMLHttpRequest();
            请求拼多多售后单信息.open('POST', 获取拼多多售后单url, true);
            请求拼多多售后单信息.setRequestHeader("Content-type", "application/json;charset=UTF-8");
            请求拼多多售后单信息.send(JSON.stringify({ range: "all", nextQueryCreatedAt: 导出退款失败下一页售后单号 }));
            请求拼多多售后单信息.onreadystatechange = async function () {
                if (请求拼多多售后单信息.readyState == 4 && 请求拼多多售后单信息.status == 200) {
                    let 获取第一页售后单 = 请求拼多多售后单信息.responseText;
                    let 取得第一页售后单 = eval("(" + 获取第一页售后单 + ")");
                    var 当前页数量 = 取得第一页售后单.result.listItemVOList.length;
                    var 全部数量 = 0;
                    全部数量 = 全部数量+当前页数量;
                    if (当前页数量 == 0) {
                        data_to_csv(data_list, 导出退款失败表格名字 + "(" + 拼多多用户名 + ")");
                        resolve('导出完成');
                        return false;
                    }
                    导出退款失败下一页售后单号 = 取得第一页售后单.result.nextQueryCreatedAt;
                    for (let i = 0; i < 当前页数量; i++) {
                        当前进度 = 全部数量 - (当前进度 - i);
                        let 导出退款失败退款状态 = 取得第一页售后单.result.listItemVOList[i].listItemStatusVO.statusText;
                        let afterSalesId = 取得第一页售后单.result.listItemVOList[i].afterSalesId;
                        let 导出退款失败订单号 = extractOrderSn(取得第一页售后单.result.listItemVOList[i].listItemExtraVO.navToDetailPageUrl);
                        if (导出退款失败退款状态 != "退款成功") {
                            //await 核对导出退款失败退款状态(导出退款失败订单号);
                            await 核对导出退款失败退款状态(afterSalesId, 导出退款失败订单号);

                             let 导出退款失败订单金额,导出退款申请时间;
                            售后信息.store.detailData.forEach((item) => {
                                if (item.resourceTag === "afterSalesApplyInfoWithGoods") {
                                    // 找到了符合条件的元素
                                    item.items[1].items.forEach((item2) => {
                                        if (item2.elements.desc.prefix === "申请金额") {
                                    导出退款失败订单金额 = item2.elements.desc.text.replace(/￥/, '');
                                        }
                                        if (item2.elements.desc.prefix === "申请时间") {
                                    导出退款申请时间 = item2.elements.desc.text;
                                        }
                                    })
                                    // 可以在这里添加其他处理逻辑
                                }
                            });
                             data_list.push([导出退款失败退款状态, 导出退款失败订单号, 导出退款失败订单金额, 导出退款申请时间, "\n"]);
                        };
                    };
                    var 进度条进度 = Math.round(当前进度 / 全部数量 * 200);
                    nanobar.go(进度条进度);
                    取拼多多售后单(导出退款失败下一页售后单号);
                };
            };
        }, 0);
    });
};



function GetMyInfo() {
    fetch("https://mobile.yangkeduo.com/personal.html?refer_page_name=login&refer_page_id=10169_1700576180416_9za2rynnis&refer_page_sn=10169&page_id=10001_1700576246281_nz1qzscwvm&is_back=1", {
        "headers": {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        },
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(htmlContent => {
        // 使用正则表达式提取window.rawData的内容
        const match = htmlContent.match(/window\.rawData=(.*?);document/);
        if (match && match[1]) {
            const rawDataText = match[1];
            const rawDataObject = JSON.parse(rawDataText);
            拼多多用户名 = rawDataObject.stores.store.userInfo.nickname;
        } else {
            console.error('window.rawData script not found in the HTML.');
        }
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
}

function data_to_csv(data, name) {
    const blob = new Blob(data, { type: 'text/csv,charset=UTF-8' });
    const uri = URL.createObjectURL(blob);
    let downloadLink = document.createElement('a');
    downloadLink.href = uri;
    downloadLink.download = (name + ".csv") || "temp.csv";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

function getCookie(name) {
    let cookieArr = document.cookie.split(";");
    for (let i = 0; i < cookieArr.length; i++) {
        let cookiePair = cookieArr[i].split("=");
        if (name == cookiePair[0].trim()) {
            return decodeURIComponent(cookiePair[1]);
        };
    };
    return null;
};