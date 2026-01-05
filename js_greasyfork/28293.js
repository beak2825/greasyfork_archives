// ==UserScript==
// @name         TTMSR
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       You
// @match        http://promotion.creditcard.cmbc.com.cn/promotion/*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28293/TTMSR.user.js
// @updateURL https://update.greasyfork.org/scripts/28293/TTMSR.meta.js
// ==/UserScript==

(function() {
     'use strict';
    
    var cookie = "Cookie: sharePopFlag=false; promotion_activityDay_encryptStr=L5/x6SmE8OL6pfhdg4TE8G+b60BYq55dRiN77xqfN4KFi3xCXDMYuhefd6Y43aEZFxWKsPJQcoqUZWpjtcD83Ithc135nu5j8VNcasi76hcLvtyhdNYJ+wgTRg4wuwR9s4ayGB4t0IJPCbm+HLwDzPJL8dgHqK3V5/RmW0Ctfbw=; promotion_activityDay_pepole=6lhPJ+7zERkJFOVY+sXrnx9RRZgbBfMd; Hm_lvt_3d3a094b33b15c394ba6e7d495ad808a=1490765412; Hm_lpvt_3d3a094b33b15c394ba6e7d495ad808a=1490838424";
    console.log(JSON.stringify(cookie.split("Cookie: ")[1].split("; ").map((s, i) => {
        var a = s.split("=");
        return {
            "domain": ".promotion.creditcard.cmbc.com.cn",
            "expirationDate": 1521255480,
            "hostOnly": false,
            "httpOnly": false,
            "name": a[0],
            "path": "/",
            "sameSite": "no_restriction",
            "secure": false,
            "session": false,
            "storeId": "0",
            "value": a[1],
            "id": i
        };
    })));
   
    $("#con").show().css({
        "top":"0px;",
        "left": "0px",
        "margin-top": "0px;"
    });
    $("#HidIndex").attr("type", "text").attr("style", "display: block; position: absolute; top: 130px; left: 0; border: 2px red solid; ");
    $(".inputc").hide();
    $(".zh_authcode_backspace.J_captcha_backspace").hide();
    $("#BtnComfir").hide();
    $("#j_captcha").attr("type", "text").unbind("click").val("").css({
        "border": "2px solid red"
    });
    $(".foter").attr("style", "top: -340px;position: relative;");
    
    if($(".J_pick").length > 0){
        var str = "";
        $(".J_pick").unbind("click").on("click", function(){
            str += $(this).text().substr(0,1);
            $("#j_captcha").val(str);
        }).each(function(){
            var id = $(this).attr("id");
            var text = $(this).text() + id;
            $(this).text(text);
        });
    }else{
        console.log(`var str = ""; $(".J_pick").unbind("click").on("click", function(){str += $(this).text().substr(0, 1); $("#j_captcha").val(str); }).each(function(){var id = $(this).attr("id"); var text = $(this).text() + id; $(this).text(text); });`);
    }
    
    var img = $("#imgValadate").attr("src");
    if(img){
        $("#imgValadate").attr("src", img);
        $("#imgValadate").on("click", function(){
            $(this).attr("src", img);
        });
    }
//    var nameNTime = img.split("/")[4].split("image")[1].split(".jpg?timestamp");
  //  var imgName = nameNTime[0];
    //var imgNameLen = imgName.length;
//    var imgKey = imgName.substr(0, imgNameLen / 2);
  //  var time = nameNTime[1];
    
    $("#HidIndex").on("keypress", function(e){
        if(e.keyCode === 13){
            var prod = location.search.split("week=")[1] || 1;
            var postData = {"prodId": prod,
                            "j_captcha":$("#HidIndex").val(),
                            "imageKey":$("#imageKey").val(),
                           };
            
            if(prod == 4){
                postData = {"prodId": "01",
                            "j_captcha":$("#HidIndex").val(),
                            "imageKey":$("#imageKey").val(),
                            "merchantType": "01",
                            "carType": "01",
                            "timestamp":new Date().getTime()
                           };

                $.ajax({
                    url:"http://promotion.creditcard.cmbc.com.cn/promotion/activityday/goOrder.jhtml",
                    type: "POST",
                    async	:false,
                    data:postData,
                    dataType:"json",
                    success:function(d){console.log(d); if(d.result == 4){console.log("OK");queryOrderResult();}else{console.log("Error" + d);}}
                });
            }else{
                 $.ajax({
                     url:"http://promotion.creditcard.cmbc.com.cn/promotion/activityday/goOrder.jhtml?temp=" + (new Date()).getTime(),
                     type: "GET",
                     data:postData,
                     success:function(d){console.log(d); if(d.result == 4){console.log("OK");queryOrderResult();}else{console.log("Error" + d);}}
                 });
            }
        }
    });
    // Your code here...
})();
