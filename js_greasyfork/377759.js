// ==UserScript==
// @name         获取SS地址
// @namespace    http://tampermonkey.net/
// @version      0.1.10
// @icon         https://shadowsocks.org/assets/img/favicon/favicon.ico
// @description  目前自用中...!
// @author       Jackey.W
// @match        *://free-ss.tw/*
// @match        *://free-ss.site/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377759/%E8%8E%B7%E5%8F%96SS%E5%9C%B0%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/377759/%E8%8E%B7%E5%8F%96SS%E5%9C%B0%E5%9D%80.meta.js
// ==/UserScript==
function getCookie(name)
{
var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
if(arr=document.cookie.match(reg))
return unescape(arr[2]);
else
return null;
}

function setCookie(name,value)
{
var Days = 30;
var exp = new Date();
exp.setTime(exp.getTime() + Days*24*60*60*1000);
document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}
//获取地址
function getAddrs(){
    console.log("开始了...获取数据上传");
    var t1 = $(".main div:eq(3)");
    var t2 = $(".main div:eq(4)");
    var t3 = $(".main div:eq(5)");
    var bj = "200px";
    var mytrs=null;
    if(t1.css("height")>bj)
        mytrs=t1.children("table").children("tbody").children("tr");
    else if(t2.css("height")>bj)
        mytrs=t2.children("table").children("tbody").children("tr");
    else if(t3.css("height")>bj)
        mytrs=t3.children("table").children("tbody").children("tr");
    //console.log(mytrs);
    if(mytrs==null)
      mytrs = $(".main div:eq(3)").children("table").children("tbody").children("tr");
    var allArrList = new Array();
    mytrs.each(
        function(){
            var arrList = new Array();
            $(this).children("td").each(function(){
                if($(this).text()!=""){
                    arrList.push($(this).text());
                }
            });
            allArrList.push(arrList);
        }
    );
    var upData = {"data":allArrList};
    var jsonStr = JSON.stringify(upData);
    console.log("数据:"+jsonStr);
    //119.84.112.169:9123
    //localhost:5000
    var submit_url = "https://119.84.112.169:44300/api/SetAddrs/1";

    $.ajax({
        type: "PUT",
        dataType: "json",
        timeout : 20000,
        url: submit_url,
        contentType: "application/json; charset=utf-8",
        data: jsonStr,
        async: true,
        success: function (message) {
            if (message > 0) {
                alert("请求已提交！我们会尽快与您取得联系");
            }
        },
        error: function (message) {
            $("#request-process-patent").html("提交数据失败！");
        }
    });
    console.log("完成了...获取数据上传");
}
(function() {
    'use strict';
    //$("head").append('<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests" />');
    $(".container").before("<div class='rz_nav'><a href='#' id='rz99a1'><span>提</span>获取数据上传</a><a href='#' id='rz99a2'><span>开</span>开始定时提交</a><a href='#' id='rz99a3'><span>关</span>停止定时提交</a></div>");
    var btb=$(".rz_nav");
    var tempS;
    btb.css({
        "position":"fixed",
        "top":"0",
        "right":"0",
        "z-index":"9999",
        "width":"140px",
        "cursor":"pointer",
        "margin":"100px 0 0 0"
    });
    $(".rz_nav a").css({
        "display":"block",
        "position":"relative",
        "height":"30px",
        "line-height":"30px",
        "margin-bottom":"2px",
        "background":"#fff",
        "padding-right":"10px",
        "width":"130px",
        "overflow":"hidden",
        "color":"#333",
        "cursor":"pointer",
        "right":"-110px",
        "border":"0",
        "text-decoration":"none"
    });
    $(".rz_nav a span").css({
        "display":"block",
        "float":"left",
        "width":"30px",
        "background":"#636871",
        "color":"#fff",
        "font-size":"16px",
        "text-align":"center",
        "margin-right":"10px",
        "font-style":"normal"
    });
    $(".rz_nav a").hover(function(){
        $(this).css("color","#1974A1");
        $(this).children("span").css("background","#5FA429");
    },function(){
        $(this).css("color","#333");
        $(this).children("span").css("background","#636871");
    });
    btb.hover(function(){
        var thisObj = $(this);
        tempS = setTimeout(function(){
            thisObj.find("a").each(function(i){
                var tA=$(this);
                setTimeout(function(){
                    tA.animate({right:"0"},300);
                },50*i);
            });
        },200);
    },function(){
        if(tempS){
            clearTimeout(tempS);
        }
        $(this).find("a").each(function(i){
            var tA=$(this);
            setTimeout(function(){
                tA.animate({right:"-110"},300,function(){
                });
            },50*i);
        });
    });

    var dsLongTime = 3600000;
    var dsSortTime = 5000;
    var ds ='';
    var cookieVal= getCookie('rz_auto');
    if(cookieVal==1){
        console.log("定时刷新"+cookieVal);
        setTimeout(getAddrs,dsSortTime);
        ds = setInterval(function(){window.location.reload();},dsLongTime);
    }
    else{
        console.log("定时刷新：无"+cookieVal);
    }
    $("#rz99a1").click(getAddrs);
    $("#rz99a2").click(function() {
        console.log("开始了定时刷新");
        setCookie('rz_auto', '1');
        ds = setInterval(function(){window.location.reload();},dsLongTime);
    });
    $("#rz99a3").click(function() {
        console.log("停止了定时刷新");
        setCookie('rz_auto', '0');
        clearInterval(ds);
    });
})();


