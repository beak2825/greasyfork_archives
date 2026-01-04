// ==UserScript==
// @name         MY助手-PUB_HX
// @namespace    公众号：时光先报
// @version      2.0.6
// @description  my辅助购
// @author       secret119
// @license      All Rights Reserved
// @match        https://buy.damai.cn/*
// @match        https://seatsvc.damai.cn/*
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
// @resource     openPriceScript https://gitlab.com/wecret1/openprice/-/raw/main/pub_my_dp01.text
// @downloadURL https://update.greasyfork.org/scripts/473176/MY%E5%8A%A9%E6%89%8B-PUB_HX.user.js
// @updateURL https://update.greasyfork.org/scripts/473176/MY%E5%8A%A9%E6%89%8B-PUB_HX.meta.js
// ==/UserScript==

var version = "2.0.6";

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

    //maoyan --------  h5
    if (curr_url.includes("/ticket-level")) {
        setTimeout(my_ajax_test, 0);
        sessionStorage.setItem('selected_price', null);
        my_date_selected();
    }
    //bp
    if (curr_url.includes("show.maoyan.com/qqw/tickets")) {
        setTimeout(my_ajax_test, 0);
        my_bp_check();
    }

    if ((curr_url.includes("show.maoyan.com/qqw") && curr_url.includes("detail")) || curr_url.includes('h5.dianping.com/app/myshow')) {
        if ('YES' == sessionStorage.getItem('if_reset')) {
            window.location.href = sessionStorage.getItem('skuUrl');
        }
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
                if (curr_url.includes("dianping")) {
                    window.location.href = 'https://h5.dianping.com/app/myshow/?utm_source=dpshare&fromTag=dpshare&utm_content=dpshare#/order-list';
                } else {
                    window.location.href = 'https://show.maoyan.com/qqw/myshow/?#/order-list?%24%24frombottomtab=1';
                }
            }, 760000);
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
