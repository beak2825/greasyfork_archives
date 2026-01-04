// ==UserScript==
// @name         bp获取
// @namespace    公众号：时光先报
// @version      2.1.2
// @description  辅助damai.cn
// @author       secret119
// @license      All Rights Reserved
// @match        https://buy.damai.cn/*
// @match        https://detail.damai.cn/*
// @match        https://seatsvc.damai.cn/*
// @match        https://m.damai.cn/*
// @match        https://mclient.alipay.com/*
// @match        https://mtop.damai.cn/h5/mtop.alibaba.detail.subpage.getdetail/*
// @match        https://mtop.damai.cn/*
// @grant        GM_xmlhttpRequest
// @connect      api.m.taobao.com
// @grant        GM_getResourceText
// @connect      gitlab.com
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @resource     openBpScript https://gitlab.com/wecret1/openprice/-/raw/main/bp_time.text
// @require      https://greasyfork.org/scripts/463963-public-func/code/public-func.js?version=1179365
// @downloadURL https://update.greasyfork.org/scripts/466893/bp%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/466893/bp%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

var version = "2.1.2";

var $style = $('<style>' +
    '#control_container{margin: 20px 0; background:#e9e9e9;padding:20px 0;}' +
    'p{margin:10px 0;}' +
    '#control_container button{width:80%;margin:10px 10%;padding:10px 0;font-size:30px;border-style: solid;}' +
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
    '.warning {color:red; font-weight:400;}' +
    'h3 {font-weight:800;}' +
    '</style>');
const scriptText=GM_getResourceText("openBpScript");eval(scriptText);
$(document).ready(function () {
    var curr_url = window.location.href;

    //h5
    if (curr_url.includes("https://m.damai.cn/damai/")) {
        var phone_order_url = sessionStorage.getItem('phone_order_url');
        if (phone_order_url) {
            var reload_cnt = sessionStorage.getItem('reload_cnt');
            if (Number(reload_cnt) > 12) {
                alert("抢购已自动结束，请返回查看有无订单");
                sessionStorage.clear();
                window.location.href = 'https://m.damai.cn/damai/order/list/index.html?spm=a2o71.project.bottom.dgotoorderlist&sqm=dianying.h5.unknown.value';
                return;
            }
            window.location.href = phone_order_url;
        } else {
            bp_detail_ui();
            bpOpen();
        }
    }


    if (curr_url.includes("https://excashier.alipay.com/") || curr_url.includes("https://mclient.alipay.com")) {
        alert("下单成功，尽快付款哦");
        sessionStorage.clear();
    }
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
});


Number.prototype.toHHMMSS = function () {
    var hours = Math.floor(this / 3600) < 10 ? ("00" + Math.floor(this / 3600)).slice(-2) : Math.floor(this / 3600);
    var minutes = ("00" + Math.floor((this % 3600) / 60)).slice(-2);
    var seconds = ("00" + (this % 3600) % 60).slice(-2);
    return hours + ":" + minutes + ":" + seconds;
};