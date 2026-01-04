// ==UserScript==
// @name         淘宝颜色分类增强
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  just for myself
// @author       pealpool
// @include      *://detail.tmall.*
// @include      *://item.taobao.*
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371276/%E6%B7%98%E5%AE%9D%E9%A2%9C%E8%89%B2%E5%88%86%E7%B1%BB%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/371276/%E6%B7%98%E5%AE%9D%E9%A2%9C%E8%89%B2%E5%88%86%E7%B1%BB%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var mySMMbuttomMark = 0;
    $("dt:contains('颜色')").attr("id","mySMMbuttom");
    $("#mySMMbuttom").css("cursor","pointer").attr("title","切换显示");
    $("#mySMMbuttom").on("click",function(){
        if($("ul[data-property='颜色分类']").length > 0){
            console.log("颜色分类");
            var mythis = $("ul[data-property='颜色分类']");
        }
        if($("ul[data-property='颜色']").length > 0){
            console.log("颜色");
            mythis = $("ul[data-property='颜色']");
        }
        if(mySMMbuttomMark==0){
            mythis.children("li").each(function(){
                if($(this).attr("class")!="tb-txt" && $(this).attr("class")!="tb-txt tb-selected"){
                    if($(this).attr("class")=="tb-selected"){
                        $(this).attr("class","mySMMCss tb-txt tb-selected");
                    }
                    else if($(this).attr("class")=="tb-out-of-stock"){
                        $(this).attr("class","mySMMCss tb-txt tb-out-of-stock");
                    }
                    else{
                        $(this).attr("class","mySMMCss tb-txt");
                    }
                    $(this).children("a").css("background-position","left");
                    $(this).children("a").children("span").css("text-indent","40px");
                }
            });
            mySMMbuttomMark=1;
        }
        else
        {
            mythis.children("li").each(function(){
                if($(this).attr("class")=="mySMMCss tb-txt" || $(this).attr("class")=="mySMMCss tb-txt tb-selected" || $(this).attr("class")=="mySMMCss tb-txt tb-out-of-stock"){
                    if($(this).attr("class")=="mySMMCss tb-txt tb-selected"){
                        $(this).attr("class","tb-selected");
                    }
                    else if($(this).attr("class")=="mySMMCss tb-txt tb-out-of-stock"){
                        $(this).attr("class","tb-out-of-stock");
                    }
                    else{
                        $(this).attr("class","");
                    }
                    $(this).children("a").css("background-position","center");
                    $(this).children("a").children("span").css("text-indent","-9999em");
                }
            });
            mySMMbuttomMark=0;
        }
    });
    $("#mySMMbuttom").hover(function(){
        $("#mySMMbuttom").css("color","red");
    },function(){
        $("#mySMMbuttom").css("color","#838383");
    });
    //以下为复制网址----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    var styleStr = `
.mycopyK_00{
line-height:15px;
text-align:center;
position:absolute;
right:1px;
cursor:pointer;
}
.mycopyK_01{
float:left;
color:#fff;
width:13px;
height:0px;
border-color: transparent transparent #ff4400;
border-style: none solid solid solid;
border-width: 10px 0px 15px 5px;
}
.mycopyK_02{
float:left;
color:#fff;
background:#ff8e1b;
width:25px;
height:15px;
}
.mycopyK_03{
float:left;
color:#fff;
background:#ff4400;
width:15px;
height:15px;
}
.mycopyK_01:hover,
.mycopyK_02:hover,
.mycopyK_03:hover{
opacity:0.7;
}
.mycopyK_01:active,
.mycopyK_02:active,
.mycopyK_03:active{
opacity:1;
}
    `;
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = styleStr;
    document.getElementsByTagName('HEAD').item(0).appendChild(style);
    var mypatt_1= /id\=\d{10,12}/;
    var mypatt_2= /.*\/item\.htm\?/;

    $(".tb-main-title").after("<div class='mycopyK_00'><div class='mycopyK_01'>I</div><div class='mycopyK_02'>S</div><div class='mycopyK_03'>T</div></div>");
    $(".tb-detail-hd h1").after("<div class='mycopyK_00'><div class='mycopyK_01'>I</div><div class='mycopyK_02'>S</div><div class='mycopyK_03'>T</div></div>");
    $("body").on("click",".mycopyK_01",function(){
        var mymyurl_1 = mypatt_1.exec(window.location.href);
        mymyurl_1 = mymyurl_1.toString().substr(3);
        console.log(mymyurl_1);
        if($("body").find("#copyYC").attr("id")!="copyYC"){
            $("body").append("<div id='copyYC'></div>");
        }
        let oInput = document.createElement('input');
        oInput.value = mymyurl_1;
        document.getElementById("copyYC").appendChild(oInput);
        oInput.select();
        document.execCommand("Copy");
        $("#copyYC").remove();
    });
    $("body").on("click",".mycopyK_02",function(){
        var mymyurl_1 = mypatt_1.exec(window.location.href);
        var mymyurl_2 = mypatt_2.exec(window.location.href);
        // console.log(mymyurl_1);
        if($("body").find("#copyYC").attr("id")!="copyYC"){
            $("body").append("<div id='copyYC'></div>");
        }
        let oInput = document.createElement('input');
        oInput.value = mymyurl_2 + mymyurl_1;
        document.getElementById("copyYC").appendChild(oInput);
        oInput.select();
        document.execCommand("Copy");
        $("#copyYC").remove();
    });
    $("body").on("click",".mycopyK_03",function(){
        var mymyurl_1 = mypatt_1.exec(window.location.href);
        var mymyurl_2 = mypatt_2.exec(window.location.href);
        var mymyurl_3 = "";
        if(mymyurl_2 == "https://detail.tmall.com/item.htm?"){
            mymyurl_3 = $.trim($(".tb-detail-hd").children("h1").text());
        }else if(mymyurl_2 == "https://item.taobao.com/item.htm?"){
            mymyurl_3 = $.trim($(".tb-main-title").text());
        }
        mymyurl_1 = mymyurl_3 + "\n" + mymyurl_2 + mymyurl_1;
        console.log(mymyurl_1);
        if($("body").find("#copyYC").attr("id")!="copyYC"){
            $("body").append("<div id='copyYC'></div>");
        }
        let oInput = document.createElement('input');
        oInput.value = mymyurl_1;
        document.getElementById("copyYC").appendChild(oInput);
        oInput.select();
        document.execCommand("Copy");
        $("#copyYC").remove();
    });
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------



})();
