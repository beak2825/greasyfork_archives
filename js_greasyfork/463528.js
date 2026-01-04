// ==UserScript==
// @name         大麦抢票（闲鱼专用版）
// @namespace    永久更新售后维护，闲鱼联系
// @version      1.0
// @description  辅助抢购大麦网门票自动提交订单：网页普通场次自动下单、选座场次需手动选座；手机版浏览器普通场次自动提交
// @author       secret11979
// @license      secret11979
// @match        https://buy.damai.cn/*
// @match        https://detail.damai.cn/*
// @match        https://seatsvc.damai.cn/*
// @match        https://m.damai.cn/*
// @match        https://mclient.alipay.com/*
// @match        <https://mtop.damai.cn/h5/mtop.alibaba.detail.subpage.getdetail/*>
// @grant        GM_xmlhttpRequest
// @connect      api.m.taobao.com
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/463528/%E5%A4%A7%E9%BA%A6%E6%8A%A2%E7%A5%A8%EF%BC%88%E9%97%B2%E9%B1%BC%E4%B8%93%E7%94%A8%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/463528/%E5%A4%A7%E9%BA%A6%E6%8A%A2%E7%A5%A8%EF%BC%88%E9%97%B2%E9%B1%BC%E4%B8%93%E7%94%A8%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

// https://seatsvc.damai.cn/tms/selectSeat?itemId=624499596673&hasPromotion=true&performId=210252620&skuId=4427321477193&projectId=624499596673&spm=a2oeg.project.projectinfo.dbuy
// https://seatsvc.damai.cn/tms/selectSeat?itemId=624499596673&performId=210252601&skuId=4427321477292&projectId=624499596673

var version = "2.0.0"

var $style = $('<style>' +
    '#control_container{margin: 20px 0; background:#e9e9e9;padding:20px 0;}' +
    'p{margin:10px 0;}' +
    '#control_container button{width:80%;margin:10px 10%;padding:10px 0;font-size:30px;border-style: solid;}' +
    '#start_btn{color:green;}' +
    '#end_btn{color:red;}' +
    '.input_wrapper{display: flex;justify-content:center;font-size: 16px; margin-bottom:10px;}' +
    '.input_wrapper_phone{width: 70%;font-size: 25px;margin:20px 20px;padding:20px 20px; text-align:center;}' +
    '.notice{margin:10px 10px;padding:10px 10px;color:darkslategrey;border-style: solid; border-width: 1px; border-color:darkslategrey;}' +
    '#wx{text-align: center;}' +
    '#countdown_wrapper {display:none; font-size: 30px; text-align:center; background:#ffeaf1;}' +
    '#countdown_wrapper p{width:100%;}' +
    '#countdown {font-size: 50px; color:#ff1268;}' +
    '.warning {color:red; font-weight:400;}' +
    'h3 {font-weight:800;}' +
    '</style>');

$(document).ready(function () {

    var curr_url = window.location.href;

    if (curr_url.includes("https://detail.damai.cn/")) {
        var order_url = sessionStorage.getItem('order_url');
        if (order_url) {
            window.location.href = order_url;
        } else {
            if ($("div.buybtn").text() == "选座购买" || $('.service-note .service-note-name').text().includes("可选座")) {
                alert("无法全自动选座，请看“注意”部分。不要忘了先登录，填好联系人信息，删除多余联系人。");
                detail_seat_ui();
            } else {
                detail_ui();
            }
        }
    }

    if (curr_url.includes("https://buy.damai.cn/")) {
        if (curr_url.includes("https://buy.damai.cn/multi/flow")) {
            //下单挤爆了
            var order_url = curr_url.substring(curr_url.indexOf('=') + 1);
            sessionStorage.setItem('order_url', order_url);
            window.location.href = order_url;
        } else {
            if ($(".error-msg").length > 0) {
                if ($(".error-msg").text().includes("已过期")) {
                    document.getElementsByClassName("next-row error-reload")[0].children[0].click();
                } else {
                    var order_url = sessionStorage.getItem('order_url');
                    if (order_url) {
                        window.location.href = order_url;
                    } else {
                        window.location.reload();
                    }
                }
            } else {
                setTimeout(fill_form, 200);
            }
        }
    }

    if (curr_url.includes("https://seatsvc.damai.cn/")) {
        console.log("seat")
        var people_num = new URLSearchParams(window.location.href).get('people_num');
        if (people_num == 1) {
            new MutationObserver(function (mutations) {
                if (document.querySelector("#app > div.render-result-container > div.select-result")) {
                    console.log("found ele");
                    $("#app > div.render-result-container > div.select-result").bind("DOMNodeInserted", seat_click_buy_btn);
                }
            }).observe(document, {childList: true, subtree: true});

            // $("#app > div.render-result-container > div.select-result").bind("DOMNodeInserted", seat_click_buy_btn)
        } else {
            document.onkeydown = function () {
                var oEvent = window.event;
                if (oEvent.keyCode == 32) {
                    seat_click_buy_btn()
                }
            }
        }
    }


    //手机版抢票
    if (curr_url.includes("https://m.damai.cn/damai/")) {
        var phone_order_url = sessionStorage.getItem('phone_order_url');
        if (phone_order_url) {
            var reload_cnt = sessionStorage.getItem('reload_cnt');
            if (Number(reload_cnt) > 12) {
                alert("抢购已自动结束，请返回查看有无订单");
                sessionStorage.clear();
                return;
            }
            window.location.href = phone_order_url;
        } else {
            fetchGet();
            phone_detail_ui();
        }
    }

    //手机版抢票
    if (curr_url.includes("https://m.damai.cn/app/dmfe/")) {
        var reload_cnt = sessionStorage.getItem('reload_cnt');
        if (Number(reload_cnt) > 12) {
            alert("抢购已自动结束，请返回查看有无订单");
            sessionStorage.clear();
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
    //支付页面
    if (curr_url.includes("https://excashier.alipay.com/") || curr_url.includes("https://mclient.alipay.com")) {
        alert("恭喜下单成功，可前往APP查看，有5分钟付款时间");
        sessionStorage.clear();
    }

});

function fetchGet() {
    var open = XMLHttpRequest.prototype.open;
    var send = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function () {
        var url = arguments[1];
        var method = arguments[0];
        if (method.toUpperCase() === 'GET' && url.indexOf('mtop.damai.cn/h5/mtop.alibaba.detail.subpage.getdetail') != -1) {
            this._url = url;  //保存请求的 URL
            console.log('获取到了GET request');
        }
        open.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function () {
        this.addEventListener('readystatechange', function () {
            if (this.readyState === 4 && this.status === 200 && this._url && this._url.indexOf('mtop.damai.cn/h5/mtop.alibaba.detail.subpage.getdetail') != -1) {
                var responseText = JSON.parse(this.responseText);
                var result = JSON.parse(responseText.data.result);
                var skuList = result.perform.skuList;
                // 解析响应内容，获取相关信息
                console.log('获取到可选择的场次详情:', skuList);
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

                let priceNameStr = "";
                for (let i = 0; i < priceNames.length; i++) {
                    priceNameStr += i + " : " + priceNames[i] + "\n";
                }
                alert("请按票价前对应的序号输入: \n" + priceNameStr);

            }
        });
        send.apply(this, arguments);
    };
}


function seat_click_buy_btn() {
    console.log("click buy");
    $('#app > div.render-result-container > div.select-result > div.tip-order-button > button').click();
}


//https://stackoverflow.com/a/31112615
Number.prototype.toHHMMSS = function () {
    var hours = Math.floor(this / 3600) < 10 ? ("00" + Math.floor(this / 3600)).slice(-2) : Math.floor(this / 3600);
    var minutes = ("00" + Math.floor((this % 3600) / 60)).slice(-2);
    var seconds = ("00" + (this % 3600) % 60).slice(-2);
    return hours + ":" + minutes + ":" + seconds;
};

function timedUpdate() {
    var time_difference = Math.ceil((window.sellStartTime_timestamp - window.current_time) / 1000);
    //接近10开始请求网络时间
    if (window.current_time == undefined || time_difference < 10) {
        syncTime(200);
    } else {
        syncTime(2500);
    }
}

function syncTime(num) {
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
                var time_difference = Math.ceil((window.sellStartTime_timestamp - window.current_time) / 1000);
                console.log("相差秒数：" + time_difference);
                // 提前1秒开始
                if (time_difference < 2) {
                    window.location.href = window.order_url;
                } else {
                    var time_difference_str = time_difference.toHHMMSS();
                    $("#countdown").text(time_difference_str);

                    window.timer = setTimeout(timedUpdate, num);
                }
            } else {
                setTimeout(() => {
                    syncTime(500);
                }, 1000);
            }
        }
    });
}

function timedUpdate_phone() {
    var time_difference = Math.ceil((window.sellStartTime_timestamp - window.current_time) / 1000);
    //接近10开始快速请求网络时间
    if (window.current_time == undefined || time_difference < 10) {
        syncTime_phone(300);
    } else {
        syncTime_phone(2500);
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
                var time_difference = Math.ceil((window.sellStartTime_timestamp - window.current_time) / 1000);
                console.log("相差秒数：" + time_difference);
                // 提前1秒开始
                if (time_difference < 2) {
                    window.location.href = window.phone_order_url;
                } else {
                    var time_difference_str = time_difference.toHHMMSS();
                    $("#countdown").text(time_difference_str);
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

function generate_confirm_url(event, price, people_num, data_json) {

    var performBases = data_json["performBases"];
    var itemId = "";

    for (var i = 0; i < performBases.length; i++) {
        // console.log("1");
        var performBase = performBases[i];
        var performs = performBase["performs"];
        for (var j = 0; j < performs.length; j++) {
            // console.log("2");
            var perform = performs[j];
            if (perform["performName"] === event) {
                // console.log("3");
                itemId = perform["itemId"];
                window.itemId = itemId;
                var skuList = perform["skuList"];
                for (var k = 0; k < skuList.length; k++) {
                    // console.log("4");
                    var skuList_item = skuList[k];
                    if (skuList_item["skuName"] === price) {
                        // console.log("5");
                        var skuId = skuList_item["skuId"];
                        return `https://buy.damai.cn/orderConfirm?exParams=%7B%22damai%22%3A%221%22%2C%22channel%22%3A%22damai_app%22%2C%22umpChannel%22%3A%2210002%22%2C%22atomSplit%22%3A%221%22%2C%22serviceVersion%22%3A%221.8.5%22%7D&buyParam=${itemId}_${people_num}_${skuId}&buyNow=true&spm=a2oeg.project.projectinfo.dbuy`
                        // https://buy.damai.cn/orderConfirm?exParams=%7B%22damai%22%3A%221%22%2C%22channel%22%3A%22damai_app%22%2C%22umpChannel%22%3A%2210002%22%2C%22atomSplit%22%3A%221%22%2C%22serviceVersion%22%3A%221.8.5%22%2C%22umidToken%22%3A%22T2gAPtWBhV9tC67Mptnj5AU_d_KX-57DqykfreYNo38zNk2TgBZssV-gxQlN7aEPYnPc6dXI1re5zNemlLZpfS71%22%2C%22ua%22%3A%22134%23pciI2XXwXGEkxcXNZXkwdJ0D3QROwKOlAOzBtZ26EXkEHKc8qKrQAAmvANaH6n1KGaF4vxWgMEiyvJ8h9bbkRf%2FYEV1hBueE%2BJdqKXL3ZtWwTq1qijRmNyd3OOH8qkuJ%2BJd8qcHAZXnw%2Bcy8qqK7GANE1XazXJmg%2FR%2F5Utf35L2Od6%2FG0dbS1b%2B9L5ktB6IWasdFdaIn%2BqpUTLB8ajSqUVD0dOgouDkm78TjZ0CoGokuqXVsf1xdZ9p%2Fut6sLnyD7zJR7vi3xgho3ZvGI37q7cXGmA1IjAYsrBXU2kdbCbTZygJjLhS6%2FKJ7jMrS32iAng488JzvSMYV4D5o9mt%2BYWWddusAWqInij0%2FLKPSEnpK8MgQLbC8xXqcqv9ojtBm2DseaKe6g0CAXgFjW0XXA1aAhvJVTXDVIjariuT47UsZ94G4Vve%2Byr6FmI1RmtHBHwiiTN4YufCiYcr7UMN40vCkITwrXibXJVe5IW%2BkcuFlRVaK5fToG%2BK%2FDDJNLfO7LA4OoXB5BemruIehBXZPAVBHW5VgnKKG6A7MKWG8VHBsknL77EDMTYo%2FVGR5E9KfJtMNhTuRyPEJUXqIyuBs%2BWMeerkEllrcI4tn6j%2FQvxFo%2BMmoAnu4Gz05k2yBrt45eVj3sndkBqzjSOdocl5f%2BtA18aToWalQuZqLb0x31S4Ac6ZTPkhnqSnt%2BGGodrhKgkR1IyvyfYR85d2Yxnht1kSmE7O4YIEt6srmH2We9UqUdhkkeKByPHsj4MvAe2yejlSN1HcH0Mm0K4JjF59IvjH4Aw3UKv7GGnY1EtOcPvgZ8uNf7HfoWX%3D%3D%22%7D&buyParam=624490600818_1_4598946947036&buyNow=true&spm=a2oeg.project.projectinfo.dbuy
                    }
                }

            }
        }

    }
    return null;

}


function generate_seat_url(is_calendar, event, price, people_num, data_json) {
    var performBases = [];
    if (is_calendar) {
        var month = event.slice(0, 7);
        var calendarPerforms = data_json["calendarPerforms"];

        for (var i = 0; i < calendarPerforms.length; i++) {
            var calendarPerform = calendarPerforms[i];
            if (calendarPerform["month"] == month) {
                performBases = calendarPerform["performBases"];
            }
        }
    } else {
        performBases = data_json["performBases"];

    }

    var itemId = "";

    for (var i = 0; i < performBases.length; i++) {
        var performBase = performBases[i];
        var performs = performBase["performs"];


        for (var j = 0; j < performs.length; j++) {
            var perform = performs[j];
            var performId = perform.performId;
            var projectId = new URLSearchParams(window.location.href).get('id');
            if (perform["performName"] === event) {
                itemId = perform["itemId"];
                window.itemId = itemId;
                var skuList = perform["skuList"];
                for (var k = 0; k < skuList.length; k++) {
                    var skuList_item = skuList[k];
                    if (skuList_item["skuName"] === price) {
                        var skuId = skuList_item["skuId"];
                        return `https://seatsvc.damai.cn/tms/selectSeat?itemId=${itemId}&performId=${performId}&skuId=${skuId}&projectId=${projectId}`

                    }
                }

            }
        }

    }
    return null;

}

function detail_ui() {
    var $service = $(".content-right .service");

    var $control_container = $("<div id='control_container'></div>");

    var $wx = $(`<div id="wx" class="notice"><p>大麦抢票【闲鱼专用版】 </p><p>版本： ${version}</p></div>`);

    var $number_input = $('<div class="input_wrapper" id="number_input_wrapper">请输入人数：<input id="number_input" type="number" value="1" min="1" max="6"></div>');
    // var $email_input = $('<div class="input_wrapper" id="email_input_wrapper">email：<input id="email_input" type="email" value="example@hotmail.com"></div>');
    // var $name_input = $('<div class="input_wrapper" id="name_input_wrapper">联系人姓名：<input id="name_input" type="text" value="小明"></div>');
    // var $duration_input = $('<div class="input_wrapper" id="duration_input_wrapper">刷新间隔(ms)：<input id="duration_input" type="text" value="5000"></div>');

    var $start_btn = $('<button id="start_btn">开始抢票</button>');
    var $end_btn = $('<button id="end_btn">停止抢票</button>');
    var $notice = $('<div id="notice" class="notice"><h3>使用步骤</h3><p>1.登录，填写购票人信息</p><p>2.选择场次->价格->填写人数</p><p>3.点击‘开始抢票’</p></div>');

    var $notice2 = $('<div id="notice2" class="notice"><p>已同步网络时间</p><p>若误差过大请刷新页面，更新时间</p></div>');

    var $countdown = $('<div id="countdown_wrapper"><p id="selected_event">event1</p><p id="selected_price">price2</p><p id="selected_number">1人</p><br><p>倒计时:</p><p id="countdown">00:00:00</p></div>');

    $control_container.append($style);
    $control_container.append($wx);
    $control_container.append($number_input);
    // $control_container.append($email_input);
    // $control_container.append($name_input);
    // $control_container.append($duration_input);
    $control_container.append($start_btn);
    $control_container.append($end_btn);
    $control_container.append($notice);
    $control_container.append($notice2);
    // $control_container.append($countdown);

    $control_container.insertBefore($service);
    $countdown.insertBefore($control_container);

    $("#start_btn").click(function () {
        var event = get_event();
        var price = get_price();
        var people_num = $("#number_input").val();
        var data_json = JSON.parse($("#dataDefault").text());
        window.sellStartTime_timestamp = data_json["sellStartTime"];

        $("#selected_event").text(event);
        $("#selected_price").text(price);
        $("#selected_number").text(people_num + "人");

        $("#countdown_wrapper").show();

        // console.log(data_json)

        var result = generate_confirm_url(event, price, people_num, data_json);
        console.log("result--" + result);
        if (result) {
            window.order_url = result;
            sessionStorage.setItem('order_url', result);

            console.log("countdown and go to confirm page");
            timedUpdate();
        } else {
            alert("获取场次票价人数失败，请刷新再试");

        }

    });

    $("#end_btn").click(function () {
        clearTimeout(window.timer);
        $("#countdown_wrapper").hide();
        sessionStorage.clear();
    });

}

function phone_detail_ui() {
    var $service = $(".banner");
    if ($service == null || $service.length == 0) {
        $service = $(".auto-banner");
    }
    if ($service == null || $service.length == 0) {
        setTimeout(phone_detail_ui, 200);
        return;
    }

    var $control_container = $("<div id='control_container'></div>");
    var $wx = $(`<div id="wx" class="notice"><p>大麦抢票【闲鱼专用版】</p><p>版本： ${version}</p></div>`);
    var $eventId = $('<div class="input_wrapper_phone" id="event_input_wrapper">请输入票价前的序号：<input id="event_input" type="text" value="0" ></div>');
    var $number_input = $('<div class="input_wrapper_phone" id="number_input_wrapper">请输入人数：<input id="number_input" type="number" value="2" min="1" max="4"></div>');
    var $start_btn = $('<button id="start_btn">开始抢票</button>');
    var $end_btn = $('<button id="end_btn">停止抢票</button>');
    var $notice = $('<div id="notice" class="notice"><h3>使用步骤</h3><p>1.提前登录-填写购票人,收货地址</p><p>2.请先点击右下角[即将开抢 预选场次]或[立即购买] 按钮，再按提示输入票价前的序号</p><p>3.点击‘开始抢票’</p></div>');

    var $notice2 = $('<div id="notice2" class="notice"><p>注：倒计时开抢前差几秒无影响，开抢前10秒才会快速同步；默认自动勾选2个观演人（页面可修改）；自动提交</p></div>');

    var $countdown = $('<div id="countdown_wrapper"><p id="selected_event">场次</p><p id="selected_price">自动勾选人数</p><p id="selected_number">2人</p><br><p>倒计时:</p><p id="countdown">00:00:00</p></div>');

    $control_container.append($style);
    $control_container.append($wx);
    $control_container.append($eventId);
    $control_container.append($number_input);
    $control_container.append($start_btn);
    $control_container.append($end_btn);
    $control_container.append($notice);
    $control_container.append($notice2);

    $control_container.insertBefore($service);
    $countdown.insertBefore($control_container);

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

        var people_num = $("#number_input").val();
        var result = phone_confirm_url(eventid, price, people_num);
        window.phone_order_url = result;
        window.phone_people_num = people_num;
        sessionStorage.setItem('phone_order_url', result);
        sessionStorage.setItem('phone_people_num', people_num);
        sessionStorage.setItem('reload_cnt', 0);

        //已经开抢了，立即购买
        var cdate = $('.count-down-date');
        var sellStartTime = "";
        if (cdate == null || cdate.length == 0) {
            sellStartTime = new Date().getTime();//开始时间时间戳
        } else {
            cdate = cdate.innerText == null ? cdate[0].innerText : cdate.innerText;
            var startTime = cdate.replace('月', '-').replace('日', '').replace('开抢', '') + ":00";
            startTime = new Date().getFullYear() + "-" + startTime;
            if(navigator.userAgent.indexOf("Safari")!=-1){
                startTime = startTime.replace(/-/g,'/');
            }
            sellStartTime = new Date(startTime).getTime();//开始时间时间戳
        }
        window.sellStartTime_timestamp = sellStartTime;
        $("#selected_event").text(startTime);
        // $("#selected_price").text(price);
        $("#selected_number").text(people_num + "人");

        $("#countdown_wrapper").show();

        timedUpdate_phone();
    });


    $("#end_btn").click(function () {
        clearTimeout(window.timer);
        $("#countdown_wrapper").hide();
        sessionStorage.clear();
    });

}

function phone_confirm_url(event, price_id, people_num) {
    return `https://m.damai.cn/app/dmfe/h5-ultron-buy/index.html?buyParam=${event}_${people_num}_${price_id}&buyNow=true&exParams=%257B%2522channel%2522%253A%2522damai_app%2522%252C%2522damai%2522%253A%25221%2522%252C%2522umpChannel%2522%253A%2522100031004%2522%252C%2522subChannel%2522%253A%2522damai%2540damaih5_h5%2522%252C%2522atomSplit%2522%253A1%257D&spm=a2o71.project.0.i0&sqm=dianying.h5.unknown.value`
}

function get_text_exclude_children(css_selector_str) {
    return $(css_selector_str).contents().not($(css_selector_str).children()).text().trim();
}

function get_event() {
    var event_css_selector = ".perform__order__select.perform__order__select__performs .select_right_list .active>*";
    return get_text_exclude_children(event_css_selector);
}


function get_price() {
    var price_css_selector = ".select_right_list_item.sku_item.active .skuname";
    return get_text_exclude_children(price_css_selector);
}

function detail_seat_ui() {
    var $service = $(".content-right .service");
    var $control_container = $("<div id='control_container'></div>");


    var $wx = $(`<div id="wx" class="notice"><p>大麦抢票【闲鱼专用版】 </p><p>版本： ${version}</p></div>`);
    var $number_input = $('<div class="input_wrapper" id="number_input_wrapper">请输入人数：<input id="number_input" type="number" value="1" min="1" max="6"></div>');
    var $start_btn = $('<button id="start_btn">开始抢票</button>');
    var $end_btn = $('<button id="end_btn">停止抢票</button>');
    var $notice = $('<div id="notice" class="notice"><h3>使用步骤</h3><p>1.登录，填写购票人信息</p><p>2.选择场次->价格->填写人数</p><p>3.点击‘开始抢票’</p></div>');

    var $notice2 = $('<div id="notice" class="notice warning"><h3>注意</h3><p>若人数为1，选座页面手动选座后自动进入下一步</p><p>人数多于1时，选座页面手动选座后点击“确认选座”按钮或按下空格键进入下一步</p></div>');
    var $notice3 = $('<div id="notice2" class="notice"><p>已同步网络时间</p><p>若误差过大请刷新页面，更新时间</p></div>');

    var $countdown = $('<div id="countdown_wrapper"><p id="selected_event">event1</p><p id="selected_price">price2</p><p id="selected_number">1人</p><br><p>倒计时:</p><p id="countdown">00:00:00</p></div>');

    $control_container.append($style);
    $control_container.append($wx);
    $control_container.append($number_input);

    $control_container.append($start_btn);
    $control_container.append($end_btn);
    $control_container.append($notice);
    $control_container.append($notice2);
    $control_container.append($notice3);

    $control_container.insertBefore($service);
    $countdown.insertBefore($control_container);

    $("#start_btn").click(function () {
        var event = get_event();
        var price = get_price();
        var people_num = $("#number_input").val();


        var data_json = JSON.parse($("#dataDefault").text());
        window.sellStartTime_timestamp = data_json["sellStartTime"];

        $("#selected_event").text(event);
        $("#selected_price").text(price);
        $("#selected_number").text(people_num + "人");

        $("#countdown_wrapper").show();

        if ($("#dataDefault").text().includes("calendarPerforms")) {
            var result = generate_seat_url(true, event, price, people_num, data_json);

        } else {
            var result = generate_seat_url(false, event, price, people_num, data_json);

        }


        if (result) {
            window.order_url = `${result}&people_num=${people_num}`;
            sessionStorage.setItem('seat_url', result);
            console.log("countdown and go to confirm page");
            timedUpdate();


        } else {
            alert("获取场次票价人数出错了。");

        }

    });

    $("#end_btn").click(function () {
        clearTimeout(window.timer);
        $("#countdown_wrapper").hide();
        sessionStorage.clear();
    });

}


function check_alert() {
    var alerts = $(".next-dialog-alert");
    if (alerts.length > 0 || window.current_time >= window.max_time) {
        window.location.reload();
    } else {
        window.current_time = window.current_time + 300;
        setTimeout(check_alert, 300);
    }
}

function fill_form() {
    var buyer_number = parseInt($(".ticket-buyer-title em").text());
    window.buyer_number = buyer_number;
    window.curr_buyer = 0;
    console.log("勾选下单人数：" + buyer_number);
    var buyer_list = $(".buyer-list-item input");
    for (var i = 0; i < buyer_number; i++) {
        console.log(buyer_list[i]);
        buyer_list[i].click();
    }

    setTimeout(submit_order, 200);
}

function fill_phone_form() {
    var buyer_number = sessionStorage.getItem('phone_people_num');
    if (buyer_number == null) {
        buyer_number = 2;
    }
    console.log("勾选下单人数：" + buyer_number);
    var viewer = $(".viewer >div >div");
    if (viewer == null || viewer.length == 0) {
        sessionStorage.setItem("isStopped", "start");
        check_phone_alert();
        setTimeout(fill_phone_form, 100);
        return;
    }
    for (var i = 0; i < buyer_number; i++) {
        viewer[i].click();
    }
    setTimeout(submit_phone_order, 100);
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
    setTimeout(check_phone_alert, 200);
    sessionStorage.setItem("isStopped", "start");
}


function check_phone_alert() {
    var isStopped = sessionStorage.getItem("isStopped");
    if (isStopped != null && "stop" == isStopped) { // 判断标记变量，如果为 true 则停止执行
        return;
    }

    var checkblack = $(".baxia-dialog-content");
    if (checkblack != null && checkblack.length > 0) {
        var reload_cnt = sessionStorage.getItem('reload_cnt');
        if (reload_cnt == null) {
            reload_cnt = 0;
        }
        sessionStorage.setItem('reload_cnt', Number(reload_cnt) + 1);
        window.location.reload();
    }

    var mian = $("#app >div >div");
    if (mian != null) {
        if (mian.innerHTML = null) {
            if (mian.innerHTML.indexOf("系统繁忙") != -1) {
                window.location.reload();
            } else {
                window.current_time = window.current_time + 300;
                setTimeout(submit_phone_order, 300);
            }
        } else if (mian.length != 0) {
            setTimeout(submit_phone_order, 300);
        }
    }
    //设置1分钟后停止刷新
    setTimeout(() => {
        clearTimeout(window.timer);
        sessionStorage.clear();
    }, 30000);
}

function submit_order() {
    $(".submit-wrapper button").click();
    setTimeout(check_alert, 200);
}