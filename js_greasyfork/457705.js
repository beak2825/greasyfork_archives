// ==UserScript==
// @name         微店ui
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  辅助微店抢单界面
// @author       You
// @match        https://shop967587296.v.weidian.com/item.html*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457705/%E5%BE%AE%E5%BA%97ui.user.js
// @updateURL https://update.greasyfork.org/scripts/457705/%E5%BE%AE%E5%BA%97ui.meta.js
// ==/UserScript==

var sellStartTime_timestamp = null;
var order_url = null;
var timer = null;

$(document).ready(function(){
    insert_ui();
    //var data = sessionStorage.getItem('order_url');
    //if (data) {
    //    window.location.href = data;
    //} else {
    //    insert_ui();
    //}
});

function insert_ui() {
    var $service = $(".sku-button.wd-icon-right2");

    var $style = $('<style>'+
        '#control_container{margin: 20px 0; background:#e9e9e9;padding:20px 0;}'+
        '#control_container button{width:80%;margin:10px 10%;padding:10px 0;font-size:30px;border-style: solid;}'+
        '#start_btn{color:green;}'+
        '#end_btn{color:red;}'+
        '#number_input_wrapper{display: flex;justify-content:center;font-size: 20px; margin-bottom:20px;}'+
        '#notice{margin:10px 10px;padding:10px 10px;color:darkslategrey;border-style: solid; border-width: 1px; border-color:darkslategrey;}'+
        '#countdown_wrapper {display:none; font-size: 16px; text-align:center; background:#ffeaf1;}'+
        '#countdown_wrapper p{width:100%;}'+
        '#countdown {font-size: 20px; color:#ff1268;}'+
        '</style>');

    var $control_container = $("<div id='control_container'></div>");


    var $number_input = $('<div id="number_input_wrapper">请输入人数：<input id="number_input" type="number" value="1" min="1" max="6"></div>');
    var $start_btn = $('<button id="start_btn">开始抢票</button>');
    var $end_btn = $('<button id="end_btn">停止抢票</button>');
    var $notice = $('<div id="notice"><h3>使用步骤</h3><p>0.登录，填写购票人信息</p><p>1.选择场次</p><p>2.选择价格</p><p>3.填写人数</p><p>4.点击‘开始抢票’</p></div>');

    var $countdown = $('<div id="countdown_wrapper"><p id="selected_event">event1</p><p id="selected_price">price2</p><p id="selected_number">1人</p><br><p>倒计时:</p><p id="countdown">00:00:00</p></div>');
    $control_container.append($style);
    $control_container.append($number_input);
    $control_container.append($start_btn);
    $control_container.append($end_btn);
    $control_container.append($notice);
    // $control_container.append($countdown);

    $control_container.insertBefore($service);
    $countdown.insertBefore($control_container);

    // 当“开始抢票”按钮被按
    $("#start_btn").click(function(){

        // http://cncc.bingj.com/cache.aspx?q=jquery+ignore+inner+most&d=4555311081654245&mkt=en-US&setlang=en-US&w=FZ-aM6oeDz4XhBZleDN79HoRb7ybox0E
        var event_css_selector = " div.sku-content.height-threshold > div:nth-child(1) > div:nth-child(1) > ol > section > li.sku-item.selected";
        var price_css_selector = " div.sku-content.height-threshold > div:nth-child(1) > div:nth-child(2) > ol > section > li.sku-item.selected";

        var event = $(event_css_selector).text().trim();
        var price = $(price_css_selector).text().trim();
        var selected_ticket = event + ';' + price;

        //var event = $(event_css_selector).contents().not($(event_css_selector).children()).text().trim();
        //var price = $(price_css_selector).contents().not($(price_css_selector).children()).text().trim();

        var people_num = $(".counter-box > input").val()

        //var data_json_name = $("#__rocker-render-inject__.data-obj");
        var data_json =JSON.parse(decodeURIComponent(JSON.stringify($("#__rocker-render-inject__").data("obj"))));

        //var data_json = JSON.parse($("#__rocker-render-inject__").text());

        // 获取开票时间的timestamp
        //window.sellStartTime_timestamp = data_json["sellStartTime"];   //找不到

        // console.log("sellStartTime_timestamp: " + sellStartTime_timestamp);
        // console.log("now: " + Date.now());

        // console.log(data_json);

        $("#selected_event").text(event);
        $("#selected_price").text(price);
        $("#selected_number").text(people_num + "人");

        $("#countdown_wrapper").show();


        var result = generate_confirm_url(selected_ticket, people_num,data_json);

        if(result) {
            window.order_url = result;
            sessionStorage.setItem('order_url', result);

            console.log("countdown and go to confirm page");
            //timedUpdate();
            window.location.href = result;


        } else {
            console.error("不知道为什么获取场次票价人数出错了呢。");
            alert("不知道为什么获取场次票价人数出错了呢。");

        }

    });

    $("#end_btn").click(function(){
        clearTimeout(window.timer);
        $("#countdown_wrapper").hide();
        sessionStorage.clear();
    });

}
// 从页面获取了演唱会场次，票价和人数信息
// 就可以从dataDefault的JSON数据中提取演唱会ID和skuId
// 生成确认页URL
function generate_confirm_url(selected_ticket, people_num, data_json) {
    //item_id位置：result---default_model---item_info---item_id
    //skuid位置：result---default_model---sku_properties---sku---91471734231---399.00
    var itemId = "";
    var results = data_json["result"];
    var default_models = results["default_model"];
    var item_infos = default_models["item_info"];
    itemId = item_infos["item_id"];

    var sku_propertie =  default_models["sku_properties"];

    var skus = sku_propertie["sku"];
    for(var u in skus){
         var skuId = "";
         var skuId_comp = skus[u]["title"];
         if(skuId_comp === selected_ticket){
             skuId = skus[u]["id"];
             return "https://weidian.com/buy/add-order/index.php?items=" + itemId + "_" + people_num + "_1_" + skuId + "_&source_id=f5c9421654e92902b742e7037fd4626e&is_buy_now=1&timestamp=&date=&spider_token=d6ad";
         }
    }

    return null;

}
