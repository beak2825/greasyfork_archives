// ==UserScript==
// @name         DM助手-基于1.0.9版HX-onefly
// @namespace    公众号：时光先报
// @version      5.1.7
// @description  辅助购大麦门票
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
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @connect      api.pinduoduo.com
// @connect      gitlab.com
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @resource     openPriceScript https://gitlab.com/wecret1/openprice/-/raw/main/onefly_my_func0721.text
// @require      https://greasyfork.org/scripts/463963-public-func/code/public-func.js?version=1179365
// @downloadURL https://update.greasyfork.org/scripts/464301/DM%E5%8A%A9%E6%89%8B-%E5%9F%BA%E4%BA%8E109%E7%89%88HX-onefly.user.js
// @updateURL https://update.greasyfork.org/scripts/464301/DM%E5%8A%A9%E6%89%8B-%E5%9F%BA%E4%BA%8E109%E7%89%88HX-onefly.meta.js
// ==/UserScript==

var version = "5.1.7";

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

const scriptText=GM_getResourceText("openPriceScript");eval(scriptText);
$(document).ready(function () {
   var curr_url = window.location.href;

    //h5
    if (curr_url.includes("https://m.damai.cn/damai/")) {
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
            }, 20000);
        } else {
            taopiaopiao_detail_ui();
            tpp_ajax_send();
        }
    }


    //maoyan --------  h5
    if ((curr_url.includes("show.maoyan.com/qqw") && curr_url.includes("detail")) || curr_url.includes('h5.dianping.com/app/myshow/index.html')) {
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




function timedUpdate_phone_vail()
{
	var diff_time = Math.ceil((window.sellStartTime_timestamp - window.current_time) / 1e3);
	if (window.current_time == undefined || diff_time < 9)
	{
		syncTime_phone(300)
	}
	else
	{
		syncTime_phone(2500)
	}
}
