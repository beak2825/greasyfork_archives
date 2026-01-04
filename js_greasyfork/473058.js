// ==UserScript==
// @name         dm_助手（H5-dm-bp源版）
// @namespace    公众号：时光先报
// @version      1.0.3
// @description  辅助购大麦门票:非选座类自动提交，选座场次--手动选座后自动提交
// @author       secret119
// @license      All Rights Reserved
// @match        https://buy.damai.cn/*
// @match        https://detail.damai.cn/*
// @match        https://m.damai.cn/*
// @match        https://show.maoyan.com/*
// @match        https://h5.dianping.com/*
// @match        https://mclient.alipay.com/*
// @match        https://mtop.damai.cn/h5/mtop.alibaba.detail.subpage.getdetail/*
// @match        https://mtop.damai.cn/*
// @match        https://m.taopiaopiao.com/*
// @grant        GM_xmlhttpRequest
// @connect      api.m.taobao.com
// @connect      api.pinduoduo.com
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/473058/dm_%E5%8A%A9%E6%89%8B%EF%BC%88H5-dm-bp%E6%BA%90%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/473058/dm_%E5%8A%A9%E6%89%8B%EF%BC%88H5-dm-bp%E6%BA%90%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

var version = "1.0.3";

var $style = $('<style>' +
    '.bui-detail-location{text-align:center;margin: 20px 0; background:#e9e9e9;padding:20px 0;}' +
    'p{margin:10px 0;}' +
    '.bui-detail-location button{width:80%;margin:10px 10%;padding:10px 0;font-size:50px;border-style: solid;}' +
    '#start_btn{margin:15px 0;color:#fff;background:#ff457a;}' +
    '#end_btn{color:red;}' +
    '.input_wrapper{display: flex;justify-content:center;font-size: 16px; margin-bottom:10px;}' +
    ".input_wrapper_phone{font-size: 28px;padding:5px 0; text-align:center;}" +
    ".input_wrapper_phone input{width: 30%;}" +
    '.notice{margin:0px 10px;padding:10px 10px;color:darkslategrey;}' +
    '#wx{text-align: center;}' +
    '#countdown_wrapper {display:none; font-size: 30px; text-align:center; background:#ffeaf1;}' +
    '#countdown_wrapper p{width:100%;}' +
    '#countdown {font-size: 50px; color:#ff1268;}' +
    '#selected_event {font-size: 30px; color:#ff1268;}' +
    '.warning {color:red; font-weight:400;}' +
    'h3 {font-weight:800;}' +
    '</style>');
// 修改用户代理为支付宝应用
//Object.defineProperty(navigator, 'userAgent', {
// value: 'DMPortal/30268170 CFNetwork/1404.0.5 Darwin/22.3.0',
// writable: false,
// configurable: true
//});
$(document).ready(function () {
    var curr_url = window.location.href;

    //h5
    if (curr_url.includes("https://m.damai.cn/shows/")) {
        var phone_order_url = sessionStorage.getItem('phone_order_url');
        if (phone_order_url) {
            var reload_cnt = sessionStorage.getItem('reload_cnt');
            if (Number(reload_cnt) > 6) {
                alert("抢购已自动结束，请返回查看有无订单");
                sessionStorage.clear();
                window.location.href = 'https://m.damai.cn/damai/order/list/index.html?spm=a2o71.project.bottom.dgotoorderlist&sqm=dianying.h5.unknown.value';
                return;
            }
            window.location.href = phone_order_url;
        } else {
            phone_detail_ui();
            priceOpen();
        }
    }

    //pay
    if (curr_url.includes("https://m.damai.cn/app/dmfe/h5-ultron-buy/")) {
        var reload_cnt = sessionStorage.getItem('reload_cnt');
        if (Number(reload_cnt) > 6) {
            alert("抢购已自动结束，请返回查看有无订单");
            sessionStorage.clear();
            window.location.href = 'https://m.damai.cn/damai/order/list/index.html?spm=a2o71.project.bottom.dgotoorderlist&sqm=dianying.h5.unknown.value';
            return;
        } else {
            sessionStorage.setItem('reload_cnt', Number(reload_cnt) + 1);
        }
        setTimeout(fill_phone_form, 100);
        var viewer = $(".viewer >div >div");
        if (viewer != null && viewer.length != 0) {
            if ($("#app >div >div").innerHTML.indexOf("系统繁忙") != -1) {
                window.location.reload();
            }
        }
    }

    //select-seat
    if (curr_url.includes('m.damai.cn/app/dmfe/select-seat-biz/kylin.html')) {
        wait_select_seat();
    }


    //tips
    if (curr_url.includes("https://excashier.alipay.com/") || curr_url.includes("https://mclient.alipay.com") || curr_url.includes("https://mpay.meituan.com")) {
        clearTimeout(window.timer);
        clearTimeout(window.timer_order);
        sessionStorage.clear();
        alert("下单成功，尽快付款哦");
    }
});


Number.prototype.toHHMMSS = function () {
    var hours = Math.floor(this / 3600) < 10 ? ("00" + Math.floor(this / 3600)).slice(-2) : Math.floor(this / 3600);
    var minutes = ("00" + Math.floor((this % 3600) / 60)).slice(-2);
    var seconds = ("00" + (this % 3600) % 60).slice(-2);
    return hours + ":" + minutes + ":" + seconds;
};

// -------  待text   --------

// -------  dm 完整版普通+选座辅助版 开始  --------
function wait_select_seat() {
    const source_text_dom = $('.header-bar__perform--text');
    if (source_text_dom != null && source_text_dom.length > 0) {
        var people_num = Number(sessionStorage.getItem('phone_people_num'));
        const source_text = source_text_dom.text();
        const update_people_num = (num) => {
            source_text_dom.text(`${source_text} - 速度选座【${num}】个!！`);
        }
        update_people_num(people_num);

        const footer_bar_click = (people_num) => {
            var footer_bar = $('.footer-bar-seat__item');
            if (footer_bar == null || footer_bar.length == 0) {
                window.title1 = setTimeout(() => {
                    footer_bar_click(people_num);
                }, 200)
                return;
            }
            update_people_num(people_num - footer_bar.length);
            if (people_num - footer_bar.length === 0) {
                $('.footer-bar__button').click()
            } else {
                window.title2 = setTimeout(() => {
                    footer_bar_click(people_num);
                }, 200)
            }
        }
        footer_bar_click(people_num);
    } else {
        console.log('等待异步加载!')
        setTimeout(wait_select_seat, 200);
    }
}


function priceOpen() {
    var open = XMLHttpRequest.prototype.open;
    var send = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function () {
        var url = arguments[1];
        var method = arguments[0];
        if (method.toUpperCase() === 'GET' && url.indexOf('mtop.damai.cn/h5/mtop.alibaba.detail.subpage.getdetail') != -1) {
            this._url = url;
        }
        open.apply(this, arguments);
    };
    XMLHttpRequest.prototype.send = function () {
        this.addEventListener('readystatechange', function () {
            if (this.readyState === 4 && this.status === 200 && this._url && this._url.indexOf('mtop.damai.cn/h5/mtop.alibaba.detail.subpage.getdetail') != -1) {
                var responseText = JSON.parse(this.responseText);
                var result = JSON.parse(responseText.data.result);
                console.log('项目详情:', result);
                sessionStorage.setItem('ori_sign_key', result.itemBasicInfo.t);

                var seatindex = $('.service-normal-main');//选座
                if (seatindex != null && seatindex.length > 0) {
                    if (seatindex.children()[0].innerText.indexOf('可选座') != -1) {
                        sessionStorage.setItem('is_immediate', 'YES');
                        sessionStorage.setItem('seat_performId', result.perform.performId);
                        sessionStorage.setItem('seat_projectId', result.itemBasicInfo.projectId);
                    }
                }

                var skuList = result.perform.skuList;
                var if_janlou = sessionStorage.getItem('if_janlou');//开始捡漏
                if ("YES" == if_janlou) {
                    console.log('捡漏刷新中...');
                    var phone_people_num = sessionStorage.getItem('phone_people_num');
                    var eventJson_num = sessionStorage.getItem('eventJson_num');
                    eventJson_num = Number(eventJson_num);
                    if (skuList.length <= eventJson_num || eventJson_num < 0) {
                        eventJson_num = 0;
                    }
                    for (var k = 0; k < skuList.length; k++) {
                        if (skuList[k].skuSalable == 'true') {
                            if (eventJson_num == 0 || k == eventJson_num) {
                                var jianlou_url = phone_confirm_url(skuList[k].itemId, skuList[k].skuId, phone_people_num);
                                console.log("%c  检测到有余票    %c", "background:#f26522; color:#ffffff", "", "price--->" + skuList[k].priceName);
                                window.location.href = jianlou_url;
                                return;
                            }
                        }
                    }
                    //重新查询
                    var jl_timer_out = sessionStorage.getItem("jl_timer_out");
                    if (jl_timer_out == null || jl_timer_out == 'YES') {
                        setTimeout(() => {
                            skuContent_click(0);
                        }, 400);
                    }
                    return;
                }
                console.log('场次详情:', skuList);
                const skuIds = [];
                const itemIds = [];
                const priceNames = [];
                for (var k = 0; k < skuList.length; k++) {
                    skuIds.push(skuList[k].skuId);
                    itemIds.push(skuList[k].itemId);
                    priceNames.push(skuList[k].priceName);
                }
                sessionStorage.setItem('skuIds', skuIds);
                sessionStorage.setItem('itemIds', itemIds);
                sessionStorage.setItem('curr_performName', result.perform.performName);

                let priceNameStr = "";
                for (let i = 0; i < priceNames.length; i++) {
                    priceNameStr += i + " : " + priceNames[i] + "\n";
                }
                alert("选择对应的序号输入: \n\n" + "当前场次：" + result.perform.performName + "\n" + priceNameStr);
            }
        });
        send.apply(this, arguments);
    };
}

function skuContent_click(index) {
    var sku_content = $(".sku-content.sku-content-column >div >div");
    if (sku_content == null || sku_content.length == 0 || $("#sku-pop-wrapper") == null) {
        clearTimeout(window.timer);
        sessionStorage.clear();
        return;
    }
    var datetime_num_jl = sessionStorage.getItem('datetime_num_jl');
    datetime_num_jl = Number(datetime_num_jl);
    if (datetime_num_jl < 0 || datetime_num_jl >= sku_content.children().length) {
        datetime_num_jl = 0;
    }
    if (datetime_num_jl > 0 && sku_content.children()[datetime_num_jl] != null) {
        console.log('查询场次：' + sku_content.children()[datetime_num_jl].textContent);
    } else if (sku_content.children()[index] != null) {
        console.log('查询场次：' + sku_content.children()[index].textContent);
    } else {
        console.log('查询完毕，开始下一轮---------');
        sessionStorage.setItem("jl_timer_out", "YES");
        return;
    }

    if (datetime_num_jl == 0 && sku_content.children().length == 1) {
        sku_content.children()[index].click();
    } else if (datetime_num_jl > 0) {
        if (index < sku_content.children().length) {
            sku_content.children()[datetime_num_jl].click();
        }
    } else {
        if (index < sku_content.children().length) {
            if (index == sku_content.children().length - 1) {
                sessionStorage.setItem("jl_timer_out", "YES");
                sku_content.children()[index].click();
            } else {
                sku_content.children()[index].click();
                sessionStorage.setItem("jl_timer_out", "NO");
                window.timer = setTimeout(function () {
                    skuContent_click(index + 1);
                }, Math.floor(Math.random() * 800) + 200);
            }

        }
    }
}

//--------h5--------
function timedUpdate_phone_seat() {
    var diff_time = window.sellStartTime_timestamp - window.current_time;
    if (window.current_time == undefined || diff_time < 9000) {
        syncTime_pingduoduo_seat(300);
    } else if (diff_time < 60000) {
        syncTime_pingduoduo_seat(1000);
    } else {
        syncTime_pingduoduo_seat(3000);
    }
}

function syncTime_pingduoduo_seat(num) {
    GM_xmlhttpRequest({
        url: "https://api.pinduoduo.com/api/server/_stm",
        method: 'GET',
        timeout: 10000,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        onload: function (responseDetails) {
            if (responseDetails.status == 200) {
                var result = JSON.parse(responseDetails.responseText.replace('fff(', '').replace(')', ''));
                window.current_time = result.server_time;
                var time_difference = window.sellStartTime_timestamp - window.current_time;
                console.log("距开抢时间：" + time_difference);
                if (time_difference < 1000) {
                    window.location.href = window.seat_phone_order_url;
                } else {
                    var time_text = Math.ceil(time_difference / 1000);
                    $("#countdown").text(time_text.toHHMMSS());
                    $("#diff_start_ms").text("毫秒数：" + time_difference);
                    window.timer = setTimeout(timedUpdate_phone_seat, num);
                }
            } else {
                setTimeout(() => {
                    syncTime_pingduoduo_seat(500);
                }, 1000);
            }
        }
    });
}

function seat_phone_confirm_url(event, price_id, people_num) {
    var performId = sessionStorage.getItem('seat_performId');
    var projectId = sessionStorage.getItem('seat_projectId');
    return `https://m.damai.cn/app/dmfe/select-seat-biz/kylin.html?itemId=${event}&performId=${performId}&skuId=${price_id}&projectId=${projectId}&toDxOrder=true&quickBuy=0&channel=damai_app&spm=undefined&userPromotion=false`;
}

function timedUpdate_phone() {
    var diff_time = window.sellStartTime_timestamp - window.current_time;
    if (window.current_time == undefined || diff_time < 9000) {
        syncTime_phone(300);
    } else if (diff_time < 60000) {
        syncTime_pingduoduo(1000);
    } else {
        syncTime_pingduoduo(3000);
    }
}


function syncTime_phone(num) {
    GM_xmlhttpRequest({
        url: "https://api.m.taobao.com/rest/api3.do?api=mtop.common.getTimestamp",
        method: 'GET',
        timeout: 10000,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        onload: function (responseDetails) {
            if (responseDetails.status == 200) {
                var result = JSON.parse(responseDetails.responseText.replace('fff(', '').replace(')', ''));

                window.current_time = result.data.t;
                var time_difference = window.sellStartTime_timestamp - window.current_time;
                console.log("距开抢时间：" + time_difference);
                if (time_difference < 800) {
                    if (time_difference < 400) {
                        window.location.href = window.phone_order_url;
                    }
                    setTimeout(() => {
                        window.location.href = window.phone_order_url;
                    }, 400);
                } else {
                    var time_text = Math.ceil(time_difference / 1000);
                    $("#countdown").text(time_text.toHHMMSS());
                    $("#diff_start_ms").text("毫秒数：" + time_difference);
                    window.timer = setTimeout(timedUpdate_phone, num);
                }
            } else {
                setTimeout(() => {
                    syncTime_phone(500);
                }, 1000);
            }
        }
    });
}

function syncTime_pingduoduo(num) {
    GM_xmlhttpRequest({
        url: "https://api.pinduoduo.com/api/server/_stm",
        method: 'GET',
        timeout: 10000,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        onload: function (responseDetails) {
            if (responseDetails.status == 200) {
                var result = JSON.parse(responseDetails.responseText.replace('fff(', '').replace(')', ''));

                window.current_time = result.server_time;
                var time_difference = window.sellStartTime_timestamp - window.current_time;
                console.log("距开抢时间：" + time_difference);
                if (time_difference < 800) {
                    setTimeout(() => {
                        window.location.href = window.phone_order_url;
                    }, 500);
                    window.location.href = window.phone_order_url;
                } else {
                    var time_text = Math.ceil(time_difference / 1000);
                    $("#countdown").text(time_text.toHHMMSS());
                    $("#diff_start_ms").text("毫秒数：" + time_difference);
                    window.timer = setTimeout(timedUpdate_phone, num);
                }
            } else {
                setTimeout(() => {
                    syncTime_pingduoduo(500);
                }, 1000);
            }
        }
    });
}

function fill_phone_form() {
    var buyer_number = sessionStorage.getItem('phone_people_num');
    if (buyer_number == null) {
        buyer_number = 2;
    }
    console.log("勾选下单人数：" + buyer_number);
    var viewer = $(".viewer >div >div")
    var reload_cnt = Number(sessionStorage.getItem('reload_cnt'));
    if (viewer == null || viewer.length == 0) {
        sessionStorage.setItem("isStopped", "start");
        if (reload_cnt < 10) {
            check_phone_alert();
        } else {
            setTimeout(check_phone_alert, 300 + Math.floor(Math.random() * 500));
            return;
        }
        setTimeout(fill_phone_form, 200);
        return;
    }
    for (var i = 0; i < buyer_number; i++) {
        if (viewer.length > i) {
            viewer[i].click();
        }
    }
    setTimeout(submit_phone_order, 100);
    if (reload_cnt < 5) {
        //定时停止刷新
        setTimeout(() => {
            clearTimeout(window.timer);
            clearTimeout(window.title1);
            clearTimeout(window.title2);
            sessionStorage.clear();
            window.location.href = 'https://m.damai.cn/damai/order/list/index.html?spm=a2o71.project.bottom.dgotoorderlist&sqm=dianying.h5.unknown.value';
        }, 35000);
    }
}

function submit_phone_order() {
    console.log("提交订单中...");
    $("div[view-name='MColorFrameLayout']").attr("id", "myOrderSubmit");
    if ($("#myOrderSubmit")[0] == null) {
        sessionStorage.setItem("isStopped", "stop");
        return;
    }
    var submitBtn = $("#myOrderSubmit")[0].nextSibling;
    var myEvent = new Event('dx_tap');
    submitBtn.dispatchEvent(myEvent);
    setTimeout(check_phone_alert, 100 + Math.floor(Math.random() * 300));
    sessionStorage.setItem("isStopped", "start");
}

function phone_detail_ui() {
    var $service = $(".bui-detail-location");
    if ($service == null || $service.length == 0) {
        $service = $(".bui-detail-location");
    }
    if ($service == null || $service.length == 0) {
        setTimeout(phone_detail_ui, 200);
        return;
    }

    var $control_container = $("<div class='bui-detail-location'></div>");
    var $wx = $(`<div id="wx-tips" class="notice"><p>公众号【时光先报】 ${version}</p></div>`);
    var $eventId = $('<div class="input_wrapper_phone" id="event_input_wrapper">票价前序号：<input id="event_input" type="text" value="0" ></div>');
    var $number_input = $('<div class="input_wrapper_phone" id="number_input_wrapper">观影人数量：<input id="number_input" type="number" value="2" min="1" max="4"></div>');
    var $delayTime = $('<div class="input_wrapper_phone" id="delayTime_input_wrapper">延迟分钟数：<input id="delayTime_input" type="text" value="0"></div>');

    var $start_btn = $('<button id="start_btn">开始抢票</button>');
    var $end_btn = $('<button id="end_btn">停止-清除缓存</button>');
    var $notice = $('<div id="notice" class="notice"><h3>使用步骤</h3><p>1.提前登录-填写购票人,收货地址</p><p>2.先点击右下角[即将开抢]或[立即购买] 按钮，再按提示输入票价前的序号</p><p>3.点击‘开始抢票’</p></div>');

    var $notice2 = $('<div id="notice2" class="notice"><p>注：默认勾选2个观演人（可修改）</p></div>');
    var $countdown = $('<div id="countdown_wrapper"><p id="selected_event">场次</p><p id="diff_start_ms">ms</p><p>倒计时:</p><p id="countdown">00:00:00</p></div>');

    $control_container.append($style);
    $control_container.append($wx);
    $control_container.append($eventId);
    $control_container.append($number_input);
    $control_container.append($delayTime);
    $control_container.append($start_btn);
    //btn开始
    var $datetime_input = $(`<div id="datetime_input_div" style="display:flex; align-items:center;margin:25px 10%;"> <span style="width: 30%;font-size: 30px;">捡漏日期</span>
                            <input id="datetime_input" type="number" value="0" min="0" max="4" style="width: 15%;"><button id="jianloubtn" style="color: green;width: 55%;">开始捡漏</button></div>`);

    $control_container.append($datetime_input);


    $control_container.append($end_btn);
    $control_container.append($notice);
    $control_container.append($notice2);
    $countdown.insertBefore($wx);
    // 替换 $service
    $service.replaceWith($control_container);


    $("#start_btn").click(function () {
        var eventJson = $("#event_input").val();
        if (eventJson == "" || eventJson == null) {
            alert("请先输入票价对应的序号");
            return;
        }

        var skuIds = sessionStorage.getItem('skuIds');
        var itemIds = sessionStorage.getItem('itemIds');
        if (skuIds == null || itemIds == null || skuIds.length == 0 || itemIds.length == 0) {
            alert("请先点击右下角[即将开抢 预选场次]或[立即购买] 按钮获取票档，再按提示输入票价前的序号");
            return;
        }
        skuIds = skuIds.split(",");
        itemIds = itemIds.split(",");
        if (skuIds.length <= Number(eventJson)) {
            alert("序号错误，无该序号对应场次");
            return;
        }
        var price = skuIds[eventJson];
        var eventid = itemIds[eventJson];
        //获取场次id+价格id
        console.log("item_id:" + eventid);
        console.log("price_id:" + price);
        var signParams = sessionStorage.getItem('ori_sign_key');
        if (signParams == null || signParams.length == 0) {
            alert("参数错误，无signKey");
        }


        var people_num = $("#number_input").val();
        var result = phone_confirm_url(eventid, price, people_num);
        window.phone_people_num = people_num;
        sessionStorage.setItem('phone_people_num', people_num);
        sessionStorage.setItem('reload_cnt', 0);

        //已经开抢了，立即购买
        var cdate = $('.count-down-start');
        var sellStartTime = "";
        if (cdate == null || cdate.length == 0) {
            sellStartTime = new Date().getTime() + Number($("#delayTime_input").val()) * 60000; //开始时间时间戳
        } else {
            cdate = cdate.innerText == null ? cdate[0].innerText : cdate.innerText;
            var startTime = cdate.replace('月', '-').replace('日', '').replace('开抢', '') + ":00";
            startTime = new Date().getFullYear() + "-" + startTime;
            if (navigator.userAgent.indexOf("Safari") != -1) {
                startTime = startTime.replace(/-/g, '/');
            }
            sellStartTime = new Date(startTime).getTime() + Number($("#delayTime_input").val()) * 60000; //开始时间时间戳
        }
        window.sellStartTime_timestamp = sellStartTime;
        $("#selected_event").text(sessionStorage.getItem('curr_performName'));
        $("#countdown_wrapper").show();

        if ('YES' == sessionStorage.getItem('is_immediate')) {
            alert("该场次需配合手动选座，选座后自动提交");
            result = seat_phone_confirm_url(eventid, price, people_num);
            window.seat_phone_order_url = result;
            timedUpdate_phone_seat();
        } else {
            window.phone_order_url = result;
            sessionStorage.setItem('phone_order_url', result);
            timedUpdate_phone();
        }
        sessionStorage.setItem('order_url', result);

    });
    $("#end_btn").click(function () {
        clearTimeout(window.timer);
        clearTimeout(window.title1);
        clearTimeout(window.title2);
        $("#countdown_wrapper").hide();
        sessionStorage.clear();
    });

    $("#jianloubtn").click(jianloubtn_click);
}

function jianloubtn_click() {
    var people_num = $("#number_input").val();
    var datetime_num = $("#datetime_input").val();
    var eventJson = $("#event_input").val();
    sessionStorage.setItem('datetime_num_jl', datetime_num);
    sessionStorage.setItem('phone_people_num', people_num);
    sessionStorage.setItem('eventJson_num', eventJson);
    sessionStorage.setItem('if_janlou', "YES");//开始捡漏
    $(".buy__button").click();
}

function phone_confirm_url(event, price_id, people_num) {
    var signKey = sessionStorage.getItem('ori_sign_key');
    var ori_sign_key = encodeURIComponent(signKey);
    var param_sign_key = ori_sign_key;
    var singUrl = `%7B%22buyParam%22%3A%22${event}_${people_num}_${price_id}%22%2C%22buyNow%22%3Atrue%2C%22exParams%22%3A%22%257B%2522damai%2522%253A%25221%2522%252C%2522channel%2522%253A%2522damai_app%2522%252C%2522umpChannel%2522%253A%2522100031004%2522%252C%2522subChannel%2522%253A%2522damai%2540damaih5_h5%2522%252C%2522atomSplit%2522%253A1%252C%2522signKey%2522%253A%2522${param_sign_key}%2522%257D%22%7D`;
    sessionStorage.setItem("sign_params", singUrl);
    return `https://m.damai.cn/app/dmfe/h5-ultron-buy/index.html?buyParam=${event}_${people_num}_${price_id}&buyNow=true&exParams=%7B%22damai%22%3A%221%22%2C%22channel%22%3A%22damai_app%22%2C%22umpChannel%22%3A%22100031004%22%2C%22subChannel%22%3A%22damai%40damaih5_h5%22%2C%22atomSplit%22%3A1%2C%22signKey%22%3A%22${ori_sign_key}%22%7D&sqm=dianying.h5.unknown.value&from=def&spm=a2o71.project.0.bottom`;
}

function check_phone_alert() {
    var isStopped = sessionStorage.getItem("isStopped");
    if (isStopped != null && "stop" == isStopped) { // 判断标记变量，如果为 true 则停止执行
        return;
    }

    var mian = $("#app >div >div");
    if (mian != null) {
        var confirmContentText = $("#confirmContent");
        if (confirmContentText != null && confirmContentText.length > 0) {
            console.log("提示..." + confirmContentText[0].innerHTML);
            if (confirmContentText[0].innerHTML.indexOf("所选观演人") != -1) {
                return;
            } else if (confirmContentText[0].innerHTML.indexOf("未支付订单") != -1) {
                sessionStorage.clear();
                window.location.href = 'https://m.damai.cn/damai/order/list/index.html?spm=a2o71.project.bottom.dgotoorderlist&sqm=dianying.h5.unknown.value';
                return;
            }
        }

        if (mian.innerHTML != null) {
            if (mian.innerHTML.indexOf("系统繁忙") != -1) {
                window.location.reload();
            } else if (mian.innerHTML.indexOf("接口异常") != -1) {
                sessionStorage.clear();
                console.log("接口异常...");
            } else {
                window.current_time = window.current_time + 300;
                setTimeout(submit_phone_order, Math.floor(Math.random() * 300) + 100);
            }
        } else if (mian.length == 2) {
            if (mian[0].innerHTML == '接口超时') {
                console.log("接口超时...");
            }
            if (mian[1] != null) {
                if (mian[1].innerHTML == '刷新') {
                    mian[1].click();
                } else {
                    setTimeout(submit_phone_order, Math.floor(Math.random() * 300) + 100);
                }
            }
        } else if (mian.length > 2) {
            setTimeout(submit_phone_order, Math.floor(Math.random() * 300) + 100);
        } else {
            console.log("未知...");
        }

        var checkblack = $(".baxia-dialog-content");
        if (checkblack != null && checkblack.length > 0) {
            var reload_cnt = sessionStorage.getItem('reload_cnt');
            if (reload_cnt == null) {
                reload_cnt = 0;
            }
            if (reload_cnt > 6) {
                return;
            }
            sessionStorage.setItem('reload_cnt', Number(reload_cnt) + 3);
            var clostxx = $(".baxia-dialog-close");
            if (clostxx != null && clostxx.length == null) {
                $(".baxia-dialog-close").click();
                return;
            } else if (clostxx != null && clostxx.length == 1) {
                $(".baxia-dialog-close").click();
            }
            clearTimeout(window.timer);
            if (reload_cnt < 20) {
                var rorder_url = sessionStorage.getItem('order_url');
                if (rorder_url) {
                    window.location.href = rorder_url;
                }
            }
        }
    }
}

// -------  dm 完整版普通+选座辅助版 结束  --------