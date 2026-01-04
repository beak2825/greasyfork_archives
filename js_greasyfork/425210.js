// ==UserScript==
// @name         ServerTimeAndAutoTriger
// @namespace    http://tampermonkey.net/
// @version      0.35
// @description  ServerTimeAndAutoTrigeruserscript

// @author       LT
// @match        https://tj.xinshangmeng.com/eciop/*
// @match        http://tj.xinshangmeng.com/eciop/*
// @match        https://*.xinshangmeng.com/*
// @match        http://*.xinshangmeng.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/425210/ServerTimeAndAutoTriger.user.js
// @updateURL https://update.greasyfork.org/scripts/425210/ServerTimeAndAutoTriger.meta.js
// ==/UserScript==
function downloadString(text, fileType, fileName) {
    var blob = new Blob([text], { type: fileType });

    var a = document.createElement('a');
    a.download = fileName;
    a.href = URL.createObjectURL(blob);
    a.dataset.downloadurl = [fileType, a.download, a.href].join(':');
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function() { URL.revokeObjectURL(a.href); }, 1500);
}
(function() {
    'use strict';
    var serverDelay = null
    var timerDate = new Date();
    //setup view port
    $(".iop-head-nav").prepend($("<li class='iop-head-nav-item'><h3  class='serverClock'/></li>"))
    var loginbuttonelement = $("#subbtn");//激活自动登录按钮ID
    //loginbuttonelement = $("#btn-no-cgt-login");// test purpose
    loginbuttonelement.before($("<input type='time' id='timer_time' step='60'value='10:00:00' class='timer_mod' /> - <input type='number' step='1' min='0' value='12' id='timer_adv' width='20px' class='timer_mod' />ms  <h3 class='serverClock'/><input type='checkbox' id='enableAuto'><label for='enableAuto'>  自动提交  </label>"));
    var addtocart = $("#smt");
    addtocart.before($("<input type='button' class='xsm-order-check-box-input ml10' id='cart_all' value='全部加入' />"));
    addtocart.before($("<input type='button' class='xsm-order-check-box-input ml10' id='cart_all_avail' value='加入可用' />"));
    $("#cart_all").click(function(){
        //alert("1");
        //var pricelist = "";


        $("#newul").children().each(function(){
            var c_id = $(this).attr("data-cgt-code");

            if($("#ord_"+c_id).text() == " --"){
                $("#req_qty_"+c_id).val(1);
                $("#req_qty_"+c_id).blur();
                console.log(c_id, $(this).children().eq(3).text(),$(this).children().eq(9).text(),"Req");
            }
        })

        $("#newul").children().each(function(){
            var c_id = $(this).attr("data-cgt-code");

            if($("#ord_"+c_id).text() != " --" && $("qty_lmt_"+c_id).text() != "--" ){
                $("#ord_qty_"+c_id).val($("#qty_lmt_"+c_id).text());
                $("#ord_qty_"+c_id).blur();
                console.log(c_id, $(this).children().eq(3).text(),$(this).children().eq(9).text(),"OK");
            }

        })


        //pricelist = pricelist + $(this).children().eq(3).text().replace(" ","") + "," + $(this).children().eq(4).text() + ",\r"
        //downloadString(pricelist, "text/text", "price.txt")
    });
    $("#cart_all_avail").click(function(){
        //alert("1");
        //var pricelist = "";

        $("#newul").children().each(function(){
            var c_id = $(this).attr("data-cgt-code");
            var avail_c = parseInt($("#qty_lmt_"+c_id).text());
            if(!isNaN(avail_c)&& avail_c>0){
                var prefix = "#ord_qty_";
                if($("#ord_"+c_id).text() == " --"){
                    prefix = "#req_qty_";
                }
                $(prefix+c_id).val(avail_c).blur();;
                //$(prefix+c_id).blur();
                console.log(c_id, $(this).children().eq(3).text(),$(this).children().eq(9).text(),"OK_avail");

            };

        })
    });
    $("#timer_adv").css("width","40px");
    var s_timer_adv = localStorage.getItem("timer_adv");
    var s_timer_time =localStorage.getItem("timer_time");
    if(s_timer_adv !=null){
        $("#timer_adv").val(s_timer_adv);
    }
    if(s_timer_time !=null){
        $("#timer_time").val(s_timer_time);
    }
    timerDate.setHours(... $("#timer_time").val().split(':'));//auto triger time

    // get server time
    //console.log("url : ",location.href)
    GM_xmlhttpRequest ( {
        url:    location.href,
        method: "HEAD",
        onload: function (rsp) {
            var serverTime  = "Server date not reported!";
            var RespDate    = rsp.responseHeaders.match (/\bDate:\s+(.+?)(?:\n|\r)/i);
            if (RespDate  &&  RespDate.length > 1) {
                serverTime  = RespDate[1];
                var serverDate = new Date(serverTime);
                serverDelay = (serverDate.valueOf() - Date.now());
                timerDate = new Date(timerDate.valueOf()-serverDelay);
                if((timerDate-Date.now())>0){
                    $("#enableAuto").prop("disabled",false);
                }else{
                    $("#enableAuto").prop("disabled",true);
                }
                console.log("ServerDate        : ", serverDate.toLocaleString())
                console.log("LocalDate         : ", new Date().toLocaleString());
                console.log("ServerDelay       : ", serverDelay);
                console.log("TimerADV          : ", $("#timer_adv").val());
                console.log("LocalTime2Trigger : ", timerDate.toLocaleString());
                console.log("store_timeer_adv  : ", localStorage.getItem("timer_adv"));
                console.log("store_timeer_time : ", localStorage.getItem("timer_time"));


                //setup clock refresh
                var clocki= setInterval(function(){
                    if(serverDelay){
                        var clockDate = new Date(Date.now() + serverDelay);
                        var clocktimestr = /\d{1,2}:\d{2}:\d{2}/g.exec(clockDate.toLocaleString('zh-CN',{hour12: false}))[0]
                        $(".serverClock").text(clocktimestr+"  ");
                        //console.log ("Clock server : ", clockDate.toLocaleString());
                    }else{
                        $(".serverClock").text("服务器时间获取失败");
                    }
                },500);
            }
        }
    });


    //auto trigger
    var autoi;
    $("#enableAuto").change(function(){
        if (this.checked) {
            var timerAdvDate = new Date(timerDate.valueOf()-$("#timer_adv").val());

            if((timerAdvDate-Date.now())>0){
                autoi = setTimeout(function(ej){
                    loginbuttonelement.click();
                    $(ej).prop("checked",false);
                    $(ej).prop("disabled",true);
                }, timerAdvDate.valueOf()-Date.now(),this);
                $(".timer_mod").prop("disabled",true);
                console.log("LocalTime2TrigADV : ", timerAdvDate.toLocaleString());

            }else{
                alert("超过自动提交时间，禁止自动提交。");
                $(this).prop("checked",false);
                $(this).prop("disabled",true);
            }
        } else {
            clearTimeout(autoi);
            $(".timer_mod").prop("disabled",false);
        }
    });
    $(".timer_mod").change(function(){
        timerDate.setHours(... $("#timer_time").val().split(':'));//auto triger time
        if((timerDate-Date.now())>0){
            $("#enableAuto").prop("disabled",false);
        }else{
            $("#enableAuto").prop("disabled",true);
        }
        localStorage.setItem("timer_adv", $("#timer_adv").val());
        localStorage.setItem("timer_time", $("#timer_time").val());

    });



})();