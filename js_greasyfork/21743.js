// ==UserScript==
// @name       nyaa preview mouseover
// @namespace  http://www.nyaa.se/
// @version    0.49
// @description  nyaa list preview mouseover
// @include     http*://*.nyaa.*/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant      none
// @copyright  2012+, You
// @downloadURL https://update.greasyfork.org/scripts/21743/nyaa%20preview%20mouseover.user.js
// @updateURL https://update.greasyfork.org/scripts/21743/nyaa%20preview%20mouseover.meta.js
// ==/UserScript==


var overData = {};
var overPos = {x:0,y:0};
var overInterval = null;

var imgObj = new Image();
var imgThumbLoad = true;//썸네일 원본 이미지 불러오기(원본 이미지를 불러올 수 있는 링크에 한해서)

$(function() {      
    var getTable = $("table.tlist");    
    if(getTable.length == 0) return;
    
    $("<style>tr.tlistrow:hover td{filter:alpha(opacity=80);opacity:0.8;background-color:#ddd}tr.trusted.tlistrow:hover td{filter:alpha(opacity=80);opacity:0.8;background-color:#72c586}#popup_view{display:none;position:absolute;left:-10000px;top:0;z-index:1000;border:2px solid #000;border-radius:3px;background:#fff}#popup_view img{display:block;width:320px}#popup_view p{margin:0;padding:5px;font-size:12px;color:#000}#popup_preview_msg{position:fixed;left:50%;top:40px;margin-left:-300px;padding:10px;font-size:13px;color:#000;border:2px solid #000;border-radius:3px;background:#fff;z-index:500}</style>").appendTo("head");
    
    if(getTable.hasClass("previewload")) {
        $("body").append("<div id='popup_preview_msg'>미리보기 불러오기 유저스크립트를 사용중입니다. 미리보기 불러오기 혹은 마우스오버 미리보기 둘 중 하나만 사용해주세요.</div>");
        $("#popup_preview_msg").on("click",function() {
            $("#popup_preview_msg").stop(true,true).fadeOut(300);
        });
        $("#popup_preview_msg").fadeIn(300);
        setTimeout(function() {
            $("#popup_preview_msg").fadeOut(300);
        },10000);
        return false;
    }
    
    $("#popup_preview_msg").remove();
    $("body").append("<div id='popup_preview_msg'>새로운 미리보기 유저스크립트가 나왔습니다. <a href='https://greasyfork.org/ko/scripts/21905-nyaa-preview-script' target='_blank' style='color:blue;text-decoration:underline'>링크</a>를 눌러서 새버전을 설치해주세요. (기존 스크립트는 삭제해주세요!)</div>");
    $("#popup_preview_msg").on("click",function() {
        $("#popup_preview_msg").stop(true,true).fadeOut(300);
    });
    $("#popup_preview_msg").fadeIn(300);
    setTimeout(function() {
        $("#popup_preview_msg").fadeOut(300);
    },20000);    
    
    $("body").on("mousemove", function(e) {
        overPos.x = e.pageX;
        overPos.y = e.pageY;
    });
    getTable.addClass("previewover").find("tr.tlistrow td.tlistname").hover(
        function() {
            clearTimeout(overInterval);
            imgObj.onload = function() {};
            imgThumbLoad = false;
            $("#popup_view").hide();
            var getTarget = this;
            overInterval = setTimeout(function() {
                previewLoad(getTarget);
            },100);            
        },
        function() {
            clearTimeout(overInterval);
            overInterval = setTimeout(function() {
                $("#popup_view").stop(true,true).fadeOut(200);
            },300);            
        }
            
    );
    
});

function previewLoad(target) {
    var getUrl = $(target).find("a").attr("href");
    if(getUrl != "") {
        if($("#popup_view").length == 0) $("body").append("<div id='popup_view'></div>");
        
        if(overData[getUrl] == undefined) {
            $.ajax({
                type: "POST",
                url:getUrl,
                dataType:"html",
                success:function(data) {
                    var getDesc = $(data).find(".viewdescription");
                    if(getDesc.find("img").length > 0) {
                        var getSrc = "";
                        var getImgEle = getDesc.find("img").eq(0);
                        var getImgSrc = getImgEle.attr("src");                    
                        
                        if(getImgSrc.indexOf("pixsense") > -1) getSrc = getImgSrc.replace("upload/small-","upload/");                                    
                        else if(getImgSrc.indexOf("upload/small") > -1) getSrc = getImgSrc.replace("upload/small","upload/big");                                    
                        else if(getImgSrc.indexOf("images/small") > -1) getSrc = getImgSrc.replace("images/small","images/big");                                    
                        else if(getImgSrc.indexOf("imgtrex") > -1) getSrc = getImgSrc.replace("_t.jpg",".jpg").replace("_t.png",".png");                                    
                        else if(getImgSrc.indexOf("imgclick") > -1) getSrc = getImgSrc.replace("_t.jpg",".jpg").replace("_t.png",".png");                                    
                        else if(getImgSrc.indexOf("javtotal") > -1) getSrc = getImgSrc.replace("_thumb","");                                    
                        else if(getImgSrc.indexOf("imgdream") > -1) getSrc = getImgSrc.replace("_thumb","");      
                        else if(getImgSrc.indexOf("ironimg") > -1) {
                            var getSrcValue = getImgSrc.split("/t/")[1].split("/")[0];
                            if(getImgSrc.indexOf(".jpg") > -1) getSrc = getImgSrc.replace("ironimg.net", "i" + getSrcValue + ".ironimg.net").replace("/t/" + getSrcValue + "/","/i/").replace(".jpg","") + ".jpg";                                        
                            else if(getImgSrc.indexOf(".png") > -1) getSrc = getImgSrc.replace("ironimg.net", "i" + getSrcValue + ".ironimg.net").replace("/t/" + getSrcValue + "/","/i/").replace(".png","") + ".png";                                        
                        }                         
                        else if(getImgSrc.indexOf("imagetwist") > -1) {
                            var getImgValue = getImgSrc.replace("/th/","/i/").substring(0, getImgSrc.lastIndexOf("/"));
                            var getLinkValue = getImgEle.parent().attr("href").split(".com/")[1];                                    
                            var getLinkArray = getLinkValue.split("/");
                            if(getLinkArray[1].indexOf(".jpg") > -1) getSrc = getImgValue + getLinkArray[0] + ".jpg/" + getLinkArray[1];                                    
                            else if(getLinkArray[1].indexOf(".png") > -1) getSrc = getImgValue + getLinkArray[0] + ".png/" + getLinkArray[1];                                    
                        }
                        
                        overData[getUrl] = [getImgSrc,getSrc];
                        previewShow(getImgSrc,getSrc);                        
                    }
                    else previewNo();
                }
            });
        }
        else previewShow(overData[getUrl][0], overData[getUrl][1]);        
    }
}

function previewShow(small,big) {
    $("#popup_view").html("<img src='" + small  + "' alt=''>").stop(true,true).css({ left:overPos.x + 60, top:overPos.y - 240 }).fadeIn(200);
    
    if(big != "") {
        imgThumbLoad = true;
        imgObj.onload = function() {
            if(imgThumbLoad) $("#popup_view img").attr("src",big);
        };
        imgObj.src = big;                                     
    } 
}
function previewNo() {
    $("#popup_view").css("top",overPos.y - 40).html("<p>이미지 없음</p>").fadeIn(200);
}