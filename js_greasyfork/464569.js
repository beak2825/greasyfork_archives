// ==UserScript==
// @name         DM_助手（H5-max源版）
// @namespace    公众号：时光先报
// @version      5.1.9
// @description  辅助购大麦门票:非选座类自动提交，选座场次--手动选座后自动提交
// @author       secret119
// @license      All Rights Reserved
// @match        https://buy.damai.cn/*
// @match        https://detail.damai.cn/*
// @match        https://seatsvc.damai.cn/*
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
// @require      https://greasyfork.org/scripts/463963-public-func/code/public-func.js?version=1179365
// @downloadURL https://update.greasyfork.org/scripts/464569/DM_%E5%8A%A9%E6%89%8B%EF%BC%88H5-max%E6%BA%90%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/464569/DM_%E5%8A%A9%E6%89%8B%EF%BC%88H5-max%E6%BA%90%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

var version = "5.1.9";

var $style = $('<style>' +
    '#control_container{margin: 20px 0; background:#e9e9e9;padding:20px 0;}' +
    'p{margin:10px 0;}' +
    '#control_container button{width:80%;margin:10px 10%;padding:10px 0;font-size:50px;border-style: solid;}' +
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
            if (Number(reload_cnt) > 25) {
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
    //select-seat
    if (curr_url.includes('m.damai.cn/app/dmfe/select-seat-biz/kylin.html')) {
        wait_select_seat();
    }

    //pay
    if (curr_url.includes("https://m.damai.cn/app/dmfe/h5-ultron-buy/")) {
        var reload_cnt = sessionStorage.getItem('reload_cnt');
        if (Number(reload_cnt) > 15) {
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


    //taopiaopiao --------  h5
    if (curr_url.includes("m.taopiaopiao.com/tickets/vip/pages/rewards-detail/")) {
        if ('YES' == sessionStorage.getItem('if_start')) {
            check_rewards();
            //定时停止刷新
            setTimeout(() => {
                clearTimeout(window.timer);
                clearTimeout(window.timer_order);
                sessionStorage.clear();
            }, 10000);
        } else {
            taopiaopiao_detail_ui();
            tpp_ajax_send();
        }
    }


    //maoyan --------  h5
    if ((curr_url.includes("show.maoyan.com/qqw") && curr_url.includes("detail")) || curr_url.includes('h5.dianping.com/app/myshow')) {
        my_phone_detail_ui();
        my_ajax_test();
    }
    //my_pay
    if (curr_url.includes("https://show.maoyan.com/qqw/confirm") || curr_url.includes("https://h5.dianping.com/app/movieshoworder/pre-order.html")) {
        if ('YES' == sessionStorage.getItem('if_start')) {
            my_fill_phone_form();
            //定时停止刷新
            setTimeout(() => {
                clearTimeout(window.timer);
                clearTimeout(window.timer_order);
                sessionStorage.clear();

            }, 40000);
        }
    }
    if (curr_url.includes("show.maoyan.com/qqw#/ticket-level")) {
        setTimeout(my_ajax_test, 100);
        my_date_selected();
    }


    //pc-dm
    if (curr_url.includes("https://detail.damai.cn/")) {
        var order_url = sessionStorage.getItem('order_url');
        if (order_url) {
            window.location.href = order_url;
        } else {
            if ($("div.buybtn").text() == "选座购买" || $('.service-note .service-note-name').text().includes("可选座")) {
                alert("无法自动选座，请看“注意”。不要忘了先登录");
                detail_seat_ui();
            } else {
                detail_ui();
            }
        }
    }
    if (curr_url.includes("https://buy.damai.cn/")) {
        if (curr_url.includes("https://buy.damai.cn/multi/flow")) {
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
        } else {
            document.onkeydown = function () {
                var oEvent = window.event;
                if (oEvent.keyCode == 32) {
                    seat_click_buy_btn()
                }
            }
        }
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

// ------- tappiaopiaopiao 开始  --------

function tpp_ajax_send() {
    var open = XMLHttpRequest.prototype.open;
    var send = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function () {
        var url = arguments[1];
        var method = arguments[0];
        if (method.toUpperCase() === 'POST' && url.indexOf('taopiaopiao.com/h5/mtop.film.pfusercenter.profit.querydetail') != -1) {
            this._url = url;
        }
        open.apply(this, arguments);
    };
    XMLHttpRequest.prototype.send = function () {
        this.addEventListener('readystatechange', function () {
            if (this.readyState === 4 && this.status === 200) {
                if (this._url && this._url.indexOf('taopiaopiao.com/h5/mtop.film.pfusercenter.profit.querydetail') != -1) {
                    // 获取响应头部中的 Cookie
                    var cookie = this.getResponseHeader('Set-Cookie');
                    console.log(cookie);
                }
            }
        });
        send.apply(this, arguments);
    };
}


function check_rewards() {
    var my_bottom = $('.bt');
    if (my_bottom == null || my_bottom.length == 0) {
        var tpp_goods = $(".rewards-goods-content-wraper")
        if (tpp_goods == null || tpp_goods.length == 0) {
            setTimeout(check_rewards, 200);
            return;
        } else {
            window.location.reload();
            return;
        }
    }
    $('.bt')[0].click();
    setTimeout(tpp_confirm_button, 100);
}

function tpp_confirm_button() {
    var my_bottom = $('.tpp-sheet.fn-hide');
    if (my_bottom == null || my_bottom.length == 0) {
        var button2 = $('.btn.js-exchange-bt');
        var event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        button2.dispatchEvent(event);

        // // 获取按钮元素
        // var button = $('.btn.js-exchange-bt');
        // // 创建并触发 Touch 事件
        // var touchStartEvent = new TouchEvent('touchstart', {
        //     bubbles: true,
        //     cancelable: true,
        //     view: window
        // });
        // button.dispatchEvent(touchStartEvent);
        //
        // var touchEndEvent = new TouchEvent('touchend', {
        //     bubbles: true,
        //     cancelable: true,
        //     view: window
        // });
        // button.dispatchEvent(touchEndEvent);
    }else{
        $('.bt')[0].click();
        setTimeout(tpp_confirm_button, 100);
    }

    //手动

}

function taopiaopiao_detail_ui() {
    var $service = $(".rewards-goods-content-wraper");
    if ($service == null || $service.length == 0) {
        setTimeout(taopiaopiao_detail_ui, 300);
        return;
    }
    var $control_container = $("<div id='control_container'></div>");
    var $wx = $(`<div id="wx" class="notice"><p>公众号【时光先报】 ${version}</p></div>`);
    var $start_btn = $('<button id="start_btn">开始抢购</button>');
    var $end_btn = $('<button id="end_btn">停止-清缓存</button>');
    var $notice = $('<div id="notice" class="notice"><h3>使用步骤</h3><p>1.提前登录-提前几分钟点开始即可</p></div>');
    var $countdown = $('<div id="countdown_wrapper"><p id="diff_start_ms">ms</p><p>倒计时:</p><p id="countdown">00:00:00</p></div>');

    $control_container.append($style);
    $control_container.append($wx);
    $control_container.append($start_btn);

    $control_container.append($end_btn);
    $control_container.append($notice);

    $control_container.insertBefore($service);
    $countdown.insertBefore($control_container);

    $("#start_btn").click(function () {

        //已经开抢了，立即购买
        var cdate = $('.bt-text');
        var sellStartTime = "";
        if (cdate == null || cdate.length == 0||cdate.text().indexOf('开抢')==-1) {
            sellStartTime = new Date().getTime(); //开始时间时间戳
        } else {
            cdate = cdate.text() == null ? cdate[0].innerText : cdate.text();
            var startTime = cdate.replace('开抢', '').trim() + ":00";
            startTime = new Date().getFullYear() + "-" + startTime;
            if (navigator.userAgent.indexOf("Safari") != -1) {
                startTime = startTime.replace(/-/g, '/');
            }
            sellStartTime = new Date(startTime).getTime(); //开始时间时间戳
        }
        window.sellStartTime_timestamp = sellStartTime;
        sessionStorage.setItem('sellStartTime_timestamp', sellStartTime);

        $("#countdown_wrapper").show();
        sessionStorage.setItem('if_start', 'YES');//是否开始
        tpp_timed_Uphone();
    });
    $("#end_btn").click(function () {
        clearTimeout(window.timer);
        sessionStorage.clear();
        $("#countdown_wrapper").hide();
    });
}

function tpp_timed_Uphone() {
    var diff_time = window.sellStartTime_timestamp - window.current_time;
    if (window.current_time == undefined || diff_time < 9000) {
        my_syncTime_tpp(200);
    } else if (diff_time < 60000) {
        my_syncTime_tpp(1000);
    } else {
        my_syncTime_tpp(3000);
    }
}

function my_syncTime_tpp(num) {
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
                if (window.sellStartTime_timestamp == undefined) {
                    $("#countdown_wrapper").show();
                    window.sellStartTime_timestamp = Number(sessionStorage.getItem('sellStartTime_timestamp'));
                }
                var time_difference = window.sellStartTime_timestamp - window.current_time;
                console.log("距开抢时间：" + time_difference);
                if (time_difference < 1000) {
                    setTimeout(() => {
                        window.location.reload();
                    }, 200);
                } else {
                    var time_text = Math.ceil(time_difference / 1000);
                    $("#countdown").text(time_text.toHHMMSS());
                    $("#diff_start_ms").text("毫秒数：" + time_difference);
                    window.timer = setTimeout(tpp_timed_Uphone, num);
                }
            } else {
                setTimeout(() => {
                    my_syncTime_tpp(500);
                }, 1000);
            }
        }
    });
}


// ------- tappiaopiaopiao 结束  --------

// -------  maoyan 完整版普通版 开始  --------

function my_date_selected() {
    var my_bottom = $('.show-list-wrap');
    if (my_bottom == null || my_bottom.length == 0) {
        setTimeout(my_date_selected, 100);
        return;
    }

    //date-select
    var date_elms = $('.show-list-wrap').eq(0).find('.wrap-item');
    var changci_sn = Number(sessionStorage.getItem('changci_sn'));
    if (date_elms.length > changci_sn) {
        if (date_elms[changci_sn].className.indexOf('selected') == -1) {
            date_elms[changci_sn].click();
        }
    } else {
        if (date_elms[0].className.indexOf('selected') == -1) {
            date_elms[0].click();
        }

    }
    //open
}

function my_selected_price() {
    var price_elms = $('#ticket-list-wrap .wrap-item');
    if (price_elms == null || price_elms.length == 0) {
        setTimeout(my_selected_price, 200);
        return;
    }
    var price_sn = Number(sessionStorage.getItem('price_sn'));
    if (price_elms.length > price_sn) {
        if (price_elms[price_sn].className.indexOf('outOfStock') == -1 && price_elms[price_sn].className.indexOf('soldOut') == -1) {
            price_elms[price_sn].click();
        } else {
            alert(price_elms[price_sn].textContent + '，请重新选择');
            return;
        }
    } else {
        price_elms[0].click();
    }
    setTimeout(my_num_select, 100);
}

function my_num_select() {
    var number_select = $('.ticket-number-select-amount');
    if (number_select == null || number_select.length == 0) {
        setTimeout(my_num_select, 200);
        return;
    }
    var phone_people_num = Number(sessionStorage.getItem('phone_people_num'));
    if (phone_people_num == 0) {
        phone_people_num = 2;
    }
    var prenum = Number(number_select.text().substring(0, 1));
    console.log("设置数量：" + phone_people_num + ",已选人数：" + prenum);
    if (phone_people_num - prenum > 0) {
        for (var i = 0; i < phone_people_num - prenum; i++) {
            setTimeout(() => {
                $('.ticket-number-select-add').click();
            }, 100);
        }
    }
    setTimeout(my_price_button, 100);
}

function my_price_button() {
    var phone_people_num = Number(sessionStorage.getItem('phone_people_num'));
    if (phone_people_num == 0) {
        phone_people_num = 2;
    }
    var prenum = Number($('.ticket-number-select-amount').text().substring(0, 1));
    if (phone_people_num != prenum) {
        setTimeout(my_price_button, 100);
        return;
    }
    console.log("提交订单--设置数量：" + phone_people_num + ",已选人数：" + prenum);

    if ($('.buttom-block .button').text().indexOf('请选择') == -1) {
        $('.buttom-block .button').click();
    } else {
        my_date_selected();
    }
}

function my_syncTime_pdd(num) {
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
                if (window.sellStartTime_timestamp == undefined) {
                    $("#countdown_wrapper").show();
                    window.sellStartTime_timestamp = Number(sessionStorage.getItem('sellStartTime_timestamp'));
                }
                var time_difference = window.sellStartTime_timestamp - window.current_time;
                console.log("距开抢时间：" + time_difference);
                if (time_difference < 1200) {
                    my_bottom_button();
                } else {
                    var time_text = Math.ceil(time_difference / 1000);
                    $("#countdown").text(time_text.toHHMMSS());
                    $("#diff_start_ms").text("毫秒数：" + time_difference);
                    window.timer = setTimeout(my_timed_Uphone, num);
                }
            } else {
                setTimeout(() => {
                    my_syncTime_pdd(500);
                }, 1000);
            }
        }
    });
}

function my_bottom_button() {
    var my_bottom = $(".detail-normal-button");
    if (my_bottom == null || my_bottom.length == 0) {
        setTimeout(my_bottom_button, 200);
        return;
    }
    if (my_bottom.text().indexOf("立即") != -1) {
        //click tips
        $(".detail-normal-button").click();
    } else if (my_bottom.text().indexOf("缺货登记") != -1) {

    } else {
        setTimeout(my_bottom_button, 200);
    }
}

function my_timed_Uphone() {
    var diff_time = window.sellStartTime_timestamp - window.current_time;
    if (window.current_time == undefined || diff_time < 9000) {
        my_syncTime_pdd(200);
    } else if (diff_time < 60000) {
        my_syncTime_pdd(1000);
    } else {
        my_syncTime_pdd(3000);
    }
}

function my_fill_phone_form() {

    var selectinfo = $(".wrapper__count");
    if (selectinfo != null && selectinfo.length != 0) {
        var tipnum = Number(selectinfo.text().substring(10, 11));
        var yesnum = $(".wrapper__item.wrapper__item--selected").length;
        console.log("票数：" + tipnum + ",已选数：" + yesnum);
        if (tipnum - yesnum > 0) {
            var numdiv = $(".wrapper__item");
            for (var i = 0; i < tipnum - yesnum; i++) {
                for (var j = 0; j < numdiv.length; j++) {
                    if (numdiv[j].className.indexOf('wrapper__item--selected') == -1) {
                        numdiv[j].click();
                        break;
                    }
                }
            }
        }
    }
    my_check_fill();
}

function my_check_fill() {

    var selectinfo = $(".wrapper__count");
    if (selectinfo != null && selectinfo.length != 0) {
        var tipnum = Number(selectinfo.text().substring(2, 3));
        var yesnum = $(".wrapper__item.wrapper__item--selected").length;
        if (tipnum == yesnum) {
            setTimeout(my_submit_phone_order, 100);
        } else {
            setTimeout(my_fill_phone_form, 100);
        }
    } else {
        setTimeout(my_submit_phone_order, 100);
    }

}

function my_submit_phone_order() {
    console.log("提交订单中...");
    var submitBtn = $(".submit-right >button");
    if (submitBtn == null || submitBtn.length == 0) {
        setTimeout(my_fill_phone_form, 100);
        return;
    }
    submitBtn.click();

    window.timer_order = setTimeout(my_check_phone_alert, 100);
}

function my_check_phone_alert() {
    var unpay_modal = $(".unpay-modal-title");
    if (unpay_modal != null && unpay_modal.length != 0) {
        $(".confirm-btn").click();
        alert($(".unpay-modal-title").text())
        return;
    }
    var selectinfo = $(".wrapper__count");
    if (selectinfo != null && selectinfo.length != 0) {
        var tipnum = Number(selectinfo.text().substring(2, 3));
        var yesnum = $(".wrapper__item.wrapper__item--selected").length;
        if (tipnum != yesnum) {
            setTimeout(my_fill_phone_form, 100);
            return;
        }
    }

    var pingtu = $(".yoda-puzzle-slider-wrap._yoda_wrapper");
    if (pingtu != null && pingtu.length != 0) {
        //滑块拼图验证
        var puzzleImageMainElment = document.getElementById("puzzleImageMain");//拼图元素
        var sliderBoxElement = document.getElementById("puzzleSliderBox");//滑块按钮

        return;
    }
    var refreshButton = $(".refresh__button_container");//继续猫眼
    if (refreshButton != null || refreshButton.length != 0) {
        refreshButton.click();
        window.timer = setTimeout(my_submit_phone_order, Math.floor(Math.random() * 800));
        return;
    }
    var yoda_slider = $(".yoda-slider-wrapper._yoda_wrapper");
    if (yoda_slider == null || yoda_slider.length == 0) {
        window.timer = setTimeout(my_submit_phone_order, Math.floor(Math.random() * 300));
    }
    if (yoda_slider.text().indexOf('滑块验证') != -1) {
        console.log("滑块验证...");
        var sliderElement = document.getElementById("yodaBoxWrapper");
        if (sliderElement == null || sliderElement.length == 0) {
            window.timer = setTimeout(my_submit_phone_order, Math.floor(Math.random() * 300));
            return;
        }
        var sliderButtonElement = document.getElementById("yodaBox");//滑块按钮
        setTimeout(() => {
            my_yodaBoxWrapper(sliderButtonElement, sliderElement.offsetWidth - sliderButtonElement.offsetWidth);
        }, 100);
    }

    if (1 == 0) {
        window.location.href = 'https://show.maoyan.com/qqw/confirm?';
    }
}


function my_yodaBoxWrapper(sliderButtonElement, sliderDistance) {
    // var sliderElement = document.getElementById("yodaBoxWrapper");

    // var sliderButtonElement = document.getElementById("yodaBox");
    // var sliderDistance = sliderElement.offsetWidth - sliderButtonElement.offsetWidth; // 滑行的距离

    const touchIdentifier = Date.now();
    const touchStart = new Touch({
        identifier: touchIdentifier,
        target: sliderButtonElement,
        clientX: sliderButtonElement.getBoundingClientRect().left,
        clientY: sliderButtonElement.getBoundingClientRect().top,
        screenX: sliderButtonElement.getBoundingClientRect().left,
        screenY: sliderButtonElement.getBoundingClientRect().top,
        pageX: sliderButtonElement.getBoundingClientRect().left,
        pageY: sliderButtonElement.getBoundingClientRect().top,
        radiusX: 1,
        radiusY: 1,
        force: 1,
    });
    const touchStartEvent = new TouchEvent('touchstart', {
        cancelable: true,
        bubbles: true,
        composed: true,
        touches: [touchStart],
        targetTouches: [touchStart],
        changedTouches: [touchStart],
    });
    sliderButtonElement.dispatchEvent(touchStartEvent);

    const duration = 900; // 滑动持续时间（毫秒）
    const startTime = Date.now();

    function updateTouchMove() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1); // 计算进度（0到1之间）

        const speed = 1 - Math.pow(1 - progress, 3); // 根据进度计算速度，可以根据需求调整速度曲线
        const distance = sliderDistance * speed; // 根据速度计算当前滑动距离

        const randomX = Math.random() * 10 - 5; // X轴随机偏移量
        const randomY = Math.random() * 10 - 5; // Y轴随机偏移量

        const touchMove = new Touch({
            identifier: touchIdentifier,
            target: sliderButtonElement,
            clientX: sliderButtonElement.getBoundingClientRect().left + distance + randomX,
            clientY: sliderButtonElement.getBoundingClientRect().top + randomY,
            screenX: sliderButtonElement.getBoundingClientRect().left + distance + randomX,
            screenY: sliderButtonElement.getBoundingClientRect().top + randomY,
            pageX: sliderButtonElement.getBoundingClientRect().left + distance + randomX,
            pageY: sliderButtonElement.getBoundingClientRect().top + randomY,
            radiusX: 1,
            radiusY: 1,
            force: progress, // 根据进度设置压力值
        });

        const touchMoveEvent = new TouchEvent('touchmove', {
            cancelable: true,
            bubbles: true,
            composed: true,
            touches: [touchMove],
            targetTouches: [touchMove],
            changedTouches: [touchMove],
        });
        sliderButtonElement.dispatchEvent(touchMoveEvent);

        if (progress < 1) {
            requestAnimationFrame(updateTouchMove); // 继续更新滑动状态
        } else {
            const touchEnd = new Touch({
                identifier: touchIdentifier,
                target: sliderButtonElement,
                clientX: sliderButtonElement.getBoundingClientRect().left + sliderDistance + randomX,
                clientY: sliderButtonElement.getBoundingClientRect().top + randomY,
                screenX: sliderButtonElement.getBoundingClientRect().left + sliderDistance + randomX,
                screenY: sliderButtonElement.getBoundingClientRect().top + randomY,
                pageX: sliderButtonElement.getBoundingClientRect().left + sliderDistance + randomX,
                pageY: sliderButtonElement.getBoundingClientRect().top + randomY,
                radiusX: 1,
                radiusY: 1,
                force: 1,
            });

            const touchEndEvent = new TouchEvent('touchend', {
                cancelable: true,
                bubbles: true,
                composed: true,
                touches: [touchEnd],
                targetTouches: [touchEnd],
                changedTouches: [touchEnd],
            });
            sliderButtonElement.dispatchEvent(touchEndEvent);
        }
    }

    requestAnimationFrame(updateTouchMove);

    console.log("滑块验证..." + sliderDistance);
    window.timer_order = setTimeout(my_check_phone_alert, 1000);
}


function my_ajax_test() {
    var open = XMLHttpRequest.prototype.open;
    var send = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function () {
        var url = arguments[1];
        var method = arguments[0];
        if (method.toUpperCase() === 'GET' && url.indexOf('/myshow/ajax/v2') != -1) {
            this._url = url;
        }
        open.apply(this, arguments);
    };
    XMLHttpRequest.prototype.send = function () {
        this.addEventListener('readystatechange', function () {
            if (this.readyState === 4 && this.status === 200) {
                if (this._url && this._url.indexOf('/myshow/ajax/v2/show') != -1) {
                    var result = JSON.parse(this.responseText);
                    //price
                    if ("YES" == sessionStorage.getItem('if_janlou')) {
                        setTimeout(() => {
                            sessionStorage.setItem('jianlou_load', 'YES');
                            my_price_jianlou();
                        }, 100);

                    } else if ('YES' == sessionStorage.getItem('if_start')) {
                        setTimeout(my_selected_price, 100);
                    }
                } else if (this._url && this._url.indexOf('/myshow/ajax/v2/performance') != -1 && this._url.indexOf('/shows') != -1) {
                    var result = JSON.parse(this.responseText);
                    console.log(result.data);

                    var if_janlou = sessionStorage.getItem('if_janlou');//开始捡漏
                    if ("YES" == if_janlou) {
                        console.log('捡漏刷新中...');
                        setTimeout(() => {
                            sessionStorage.setItem('jianlou_load', 'YES')
                            my_dateContent_click(0);
                        }, 100);
                        return;
                    }
                    //date
                    // if (result.data.showList != null || result.data.length > 1) {
                    setTimeout(my_date_selected, 100);
                    // }
                }

            }
        });
        send.apply(this, arguments);
    };
}

function my_price_jianlou() {
    //price
    var price_elms = $('#ticket-list-wrap .wrap-item');
    if (price_elms == null || price_elms.length == 0) {
        setTimeout(my_price_jianlou, 200);
        return;
    }
    var price_sn = Number(sessionStorage.getItem('price_sn'));
    if (price_elms.length <= price_sn || price_sn < 0) {
        price_sn = 0;
    }
    for (var k = 0; k < price_elms.length; k++) {
        if (price_elms[k].className.indexOf('outOfStock') == -1 && price_elms[k].className.indexOf('soldOut') == -1) {
            if (price_sn == 0 || k == price_sn) {
                console.log("%c  检测到有余票    %c", "background:#f26522; color:#ffffff", "", "price--->" + price_elms[price_sn].textContent);
                price_elms[k].click();
                setTimeout(my_num_select, 100);
                return;
            }
        }
    }
    //重新查询
    var jl_timer_out = sessionStorage.getItem("jl_timer_out");
    if (jl_timer_out == null || jl_timer_out == 'YES') {
        setTimeout(() => {
            my_dateContent_click(0);
        }, Math.floor(Math.random() * 400) + 1100);
    }

}


function my_dateContent_click(index) {
    var my_bottom = $('.show-list-wrap');
    if (my_bottom == null || my_bottom.length == 0) {
        clearTimeout(window.timer);
        clearTimeout(window.timer_order);
        sessionStorage.clear();
        return;
    }
    //date-select
    var date_elms = $('.show-list-wrap').eq(0).find('.wrap-item');

    var changci_sn = Number(sessionStorage.getItem('changci_sn'));
    if (changci_sn < 0 || changci_sn >= date_elms.length) {
        changci_sn = 0;
    }
    if (date_elms[index] != null) {
        console.log('查询场次：' + date_elms[index].textContent);
    } else {
        console.log('查询完毕，开始下一轮---------');
        sessionStorage.setItem("jl_timer_out", "YES");
        return;
    }

    const jianlou_load = (changci_sn, date_elms, index) => {
        var jianlou_flag = sessionStorage.getItem('jianlou_load');
        if ('YES' == jianlou_flag || jianlou_flag == null) {
            if (changci_sn == 0) {
                date_elms[changci_sn].click();
            } else if (changci_sn > 0) {
                if (index < date_elms.length) {
                    date_elms[changci_sn].click();
                }
            } else {
                if (index < date_elms.length) {
                    if (index == date_elms.length - 1) {
                        sessionStorage.setItem("jl_timer_out", "YES");
                        date_elms[index].click();
                    } else {
                        date_elms[index].click();
                        sessionStorage.setItem("jl_timer_out", "NO");
                        sessionStorage.setItem('jianlou_load', 'NO')
                        window.timer = setTimeout(function () {
                            my_dateContent_click(index + 1);
                        }, Math.floor(Math.random() * 400) + 100);
                    }
                }
            }
        } else {
            window.timer = setTimeout(() => {
                jianlou_load(changci_sn, date_elms, index);
            }, 500)
        }
    }
    jianlou_load(changci_sn, date_elms, index);
}


function my_phone_detail_ui() {
    var $service = $(".index-tab-wrapper");
    // if ($service == null || $service.length == 0) {
    //     $service = $(".auto-banner");
    // }
    if ($service == null || $service.length == 0) {
        setTimeout(my_phone_detail_ui, 300);
        return;
    }

    var $control_container = $("<div id='control_container'></div>");
    var $wx = $(`<div id="wx" class="notice"><p>公众号【时光先报】 ${version}</p></div>`);
    var $changciId = $('<div class="input_wrapper_phone" id="changci_input_wrapper">场次序号：<input id="changci_input" type="text" value="0" ></div>');
    var $eventId = $('<div class="input_wrapper_phone" id="event_input_wrapper">票价序号：<input id="event_input" type="text" value="0" ></div>');
    var $number_input = $('<div class="input_wrapper_phone" id="number_input_wrapper">观影人数量：<input id="number_input" type="number" value="1" min="1" max="6"></div>');
    var $delayTime = $('<div class="input_wrapper_phone" id="delayTime_input_wrapper">延迟分钟数：<input id="delayTime_input" type="text" value="0"></div>');

    var $start_btn = $('<button id="start_btn">开始抢票</button>');
    var $end_btn = $('<button id="end_btn">停止-清缓存</button>');
    var $notice = $('<div id="notice" class="notice"><h3>使用步骤</h3><p>1.提前登录-填写购票人,收货地址</p><p>2.输入场次票价序号,从0开始</p><p>3.点击‘开始抢票’</p></div>');
    var $notice2 = $('<div id="notice2" class="notice"><p>注：默认选2个观演人（可修改）</p></div>');
    var $countdown = $('<div id="countdown_wrapper"><p id="diff_start_ms">ms</p><p>倒计时:</p><p id="countdown">00:00:00</p></div>');

    $control_container.append($style);
    $control_container.append($wx);
    $control_container.append($changciId);
    $control_container.append($eventId);
    $control_container.append($number_input);
    $control_container.append($delayTime);
    $control_container.append($start_btn);
    //btn开始
    var $datetime_input = $(`<div id="datetime_input_div" style="display:flex; align-items:center;margin:25px 10%;"> <button id="jianloubtn" style="color: green;width: 80%;">开始捡漏</button></div>`);

    $control_container.append($datetime_input);


    $control_container.append($end_btn);
    $control_container.append($notice);
    $control_container.append($notice2);

    $control_container.insertBefore($service);
    $countdown.insertBefore($control_container);

    $("#start_btn").click(function () {
        var changcisn = $("#changci_input").val();
        var price_sn = $("#event_input").val();
        if (price_sn == "" || price_sn == null) {
            alert("请先输入票价序号");
            return;
        }
        if (changcisn == "" || changcisn == null) {
            alert("请先输入场次序号");
            return;
        }
        sessionStorage.setItem('changci_sn', changcisn);
        sessionStorage.setItem('price_sn', price_sn);

        var people_num = $("#number_input").val();
        window.phone_people_num = people_num;
        sessionStorage.setItem('phone_people_num', people_num);
        sessionStorage.setItem('reload_cnt', 0);

        //已经开抢了，立即购买
        var cdate = $('.bomb-time');
        var sellStartTime = "";
        if (cdate == null || cdate.length == 0) {
            sellStartTime = new Date().getTime() + Number($("#delayTime_input").val()) * 60000; //开始时间时间戳
        } else {
            cdate = cdate.text() == null ? cdate[0].innerText : cdate.text();
            var startTime = cdate.replace('月', '-').replace('日', '').replace('开抢', '').trim() + ":00";
            startTime = new Date().getFullYear() + "-" + startTime;
            if (navigator.userAgent.indexOf("Safari") != -1) {
                startTime = startTime.replace(/-/g, '/');
            }
            sellStartTime = new Date(startTime).getTime() + Number($("#delayTime_input").val()) * 60000; //开始时间时间戳
        }
        window.sellStartTime_timestamp = sellStartTime;
        sessionStorage.setItem('sellStartTime_timestamp', sellStartTime);

        // $("#selected_event").text(changcisn);
        $("#countdown_wrapper").show();
        sessionStorage.setItem('if_start', 'YES');//是否开始
        if ('YES' == sessionStorage.getItem('is_immediate')) {
            alert("该场次需配合手动选座，选座后自动提交");
            result = seat_phone_confirm_url(eventid, price, people_num);
            window.seat_phone_order_url = result;
            timedUpdate_phone_seat();
        } else {
            my_timed_Uphone();
        }
    });
    $("#end_btn").click(function () {
        clearTimeout(window.timer);
        clearTimeout(window.timer_order);
        sessionStorage.clear();
        $("#countdown_wrapper").hide();
    });

    $("#jianloubtn").click(my_jianloubtn_click);
}

function my_jianloubtn_click() {
    var changcisn = $("#changci_input").val();
    var price_sn = $("#event_input").val();
    var people_num = $("#number_input").val();
    sessionStorage.setItem('phone_people_num', people_num);
    sessionStorage.setItem('changci_sn', changcisn);
    sessionStorage.setItem('price_sn', price_sn);

    sessionStorage.setItem('if_start', 'YES');//是否开始
    sessionStorage.setItem('if_janlou', "YES");//开始捡漏
    $(".detail-normal-button").click();
}

// -------  猫眼 完整版普通版 结束  --------


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

                var seatindex = $('.service-normal-main');
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
                if (time_difference < 800) {
                    setTimeout(() => {
                        window.location.href = window.seat_phone_order_url;
                    }, 200);
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
    var viewer = $(".viewer >div >div");
    if (viewer == null || viewer.length == 0) {
        sessionStorage.setItem("isStopped", "start");
        check_phone_alert();
        setTimeout(fill_phone_form, 200);
        return;
    }
    for (var i = 0; i < buyer_number; i++) {
        viewer[i].click();
    }
    setTimeout(submit_phone_order, 100);
    //定时停止刷新
    setTimeout(() => {
        clearTimeout(window.timer);
        clearTimeout(window.title1);
        clearTimeout(window.title2);
        sessionStorage.clear();
        window.location.href = 'https://m.damai.cn/damai/order/list/index.html?spm=a2o71.project.bottom.dgotoorderlist&sqm=dianying.h5.unknown.value';
    }, 35000);
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
    setTimeout(check_phone_alert, 300);
    sessionStorage.setItem("isStopped", "start");
}

function phone_detail_ui() {
    var $service = $(".bui-detail-location");
    if ($service == null || $service.length == 0) {
        $service = $(".bui-detail-location");
    }
    //if ($service == null || $service.length == 0) {
    //$service = $("#detail");
    //}
    if ($service == null || $service.length == 0) {
        setTimeout(phone_detail_ui, 200);
        return;
    }

    var $control_container = $("<div id='control_container'></div>");
    var $wx = $(`<div id="wx" class="notice"><p>公众号【时光先报】 ${version}</p></div>`);
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
        window.phone_people_num = people_num;
        sessionStorage.setItem('phone_people_num', people_num);
        sessionStorage.setItem('reload_cnt', 0);

        //已经开抢了，立即购买
        var cdate = $('.count-down-date');
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
    return `https://m.damai.cn/app/dmfe/h5-ultron-buy/index.html?buyParam=${event}_${people_num}_${price_id}&buyNow=true&exParams=%257B%2522damai%2522%253A%25221%2522%252C%2522channel%2522%253A%2522damai_app%2522%252C%2522umpChannel%2522%253A%2522100031004%2522%252C%2522subChannel%2522%253A%2522damai%2540damaih5_h5%2522%252C%2522atomSplit%2522%253A1%252C%2522signKey%2522%253A%2522clh%252FaHdVXwlgQF54TlthenlTdmZxWlwNZUNOfU9BZn1xX3xveV5aDHA7IxMqMBMEBjUcCgA5PGs%253D%2522%257D&sqm=dianying.h5.unknown.value&from=def&spm=a2o71.project.0.bottom`;
    return `https%3A//m.damai.cn/app/dmfe/h5-ultron-buy/index.html%3FbuyParam%3D${event}_${people_num}_${price_id}%26buyNow%3Dtrue%26exParams%3D%25257B%252522channel%252522%25253A%252522damai_app%252522%25252C%252522damai%252522%25253A%2525222%252522%25252C%252522umpChannel%252522%25253A%252522100041005%252522%25252C%252522subChannel%252522%25253A%252522damai%252540damaih5_h5%252522%25252C%252522atomSplit%252522%25253A1%25257D%26spm%3Da2o71.project.sku.dbuy%26sqm%3Ddianying.h5.unknown.value`;
}

function check_phone_alert() {
    var isStopped = sessionStorage.getItem("isStopped");
    if (isStopped != null && "stop" == isStopped) { // 判断标记变量，如果为 true 则停止执行
        return;
    }

    var mian = $("#app >div >div");
    if (mian != null) {
        if (mian.innerHTML != null) {
            if (mian.innerHTML.indexOf("系统繁忙") != -1) {
                window.location.reload();
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
            sessionStorage.setItem('reload_cnt', Number(reload_cnt) + 3);
            var clostxx = $(".baxia-dialog-close");
            if (clostxx != null && clostxx.length == null) {
                $(".baxia-dialog-close").click();
              } else if (clostxx != null && clostxx.length == 1) {
                $(".baxia-dialog-close").click();
            }
            clearTimeout(window.timer);
            if (reload_cnt < 12) {
                var rorder_url = sessionStorage.getItem('order_url');
                if (rorder_url) {
                    window.location.href = rorder_url;
                }
            }
        }
    }
}

// -------  dm 完整版普通+选座辅助版 结束  --------