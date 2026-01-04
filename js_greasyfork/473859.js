// ==UserScript==
// @name         DM助手-PUB_HX
// @namespace    公众号：时光先报
// @version      1.0.1
// @description  辅助购dm门票:h5自动提交
// @author       secret119
// @license      All Rights Reserved
// @match        https://buy.damai.cn/*
// @match        https://detail.damai.cn/*
// @match        https://m.damai.cn/*
// @match        https://mclient.alipay.com/*
// @match        https://mtop.damai.cn/h5/mtop.alibaba.detail.subpage.getdetail/*
// @match        https://mtop.damai.cn/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @connect      api.m.taobao.com
// @connect      api.pinduoduo.com
// @connect      gitlab.com
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @resource     openPriceScript https://gitlab.com/wecret1/openprice/-/raw/main/pub_dm_102.text
// @downloadURL https://update.greasyfork.org/scripts/473859/DM%E5%8A%A9%E6%89%8B-PUB_HX.user.js
// @updateURL https://update.greasyfork.org/scripts/473859/DM%E5%8A%A9%E6%89%8B-PUB_HX.meta.js
// ==/UserScript==


var version = "1.0.1";
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

const scriptText = GM_getResourceText("openPriceScript");
eval(scriptText);
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

    //pay
    if (curr_url.includes("https://m.damai.cn/app/dmfe/h5-ultron-buy/")) {
        var reload_cnt = sessionStorage.getItem('reload_cnt');
        if (Number(reload_cnt) > 25) {
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

//抢门票、数码、酒、鞋子等动动手赚零花
Number.prototype.toHHMMSS = function () {
    var hours = Math.floor(this / 3600) < 10 ? ("00" + Math.floor(this / 3600)).slice(-2) : Math.floor(this / 3600);
    var minutes = ("00" + Math.floor((this % 3600) / 60)).slice(-2);
    var seconds = ("00" + (this % 3600) % 60).slice(-2);
    return hours + ":" + minutes + ":" + seconds;
};


function timedUpdate_phone_vail() {
    var diff_time = Math.ceil((window.sellStartTime_timestamp - window.current_time) / 1e3);
    if (window.current_time == undefined || diff_time < 9) {
        syncTime_phone(300)
    } else {
        syncTime_phone(2500)
    }
}
