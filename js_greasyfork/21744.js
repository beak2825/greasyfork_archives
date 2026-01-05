// ==UserScript==
// @name       nyaa preview load
// @namespace  http://www.nyaa.se/
// @version    0.49
// @description  nyaa list preview load
// @include     http*://*.nyaa.*/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant      none
// @copyright  2012+, You
// @downloadURL https://update.greasyfork.org/scripts/21744/nyaa%20preview%20load.user.js
// @updateURL https://update.greasyfork.org/scripts/21744/nyaa%20preview%20load.meta.js
// ==/UserScript==

var listDelay = 1000;//불러오기 딜레이 시간 (1000 = 1초, 너무 빠르게 로딩하면 접근이 제한될 수 있습니다)
var imgMaxWidth = 480;//이미지 최대 넓이 크기 (너무 크게 설정하면 화면 스크롤이 너무 길어질 수 있습니다)
var imgThumbLoad = true;//첫번째 미리보기 원본 이미지 불러오기 (원본 이미지를 불러올 수 있는 링크에 한해서)

var listData = [];
$(function() {        
    var getTable = $("table.tlist");
    if(getTable.length == 0) return;
    
    $("<style>.preview_box td img{max-width:" + imgMaxWidth + "px}#popup_preview_msg{position:fixed;left:50%;top:40px;margin-left:-300px;padding:10px;font-size:13px;color:#000;border:2px solid #000;border-radius:3px;background:#fff;z-index:500}</style>").appendTo("head");
    if(getTable.hasClass("previewover")) {
        $("body").append("<div id='popup_preview_msg'>마우스오버 미리보기 유저스크립트를 사용중입니다. 미리보기 불러오기 혹은 마우스오 미리보기 둘 중 하나만 사용해주세요.</div>");
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
    
    getTable.addClass("previewload").find("tr.tlistrow").each(function() {
        listData.push($(this));
    });
    
    if(listData.length > 0) {
        $.each(listData, function() {
            $("<tr class='tlistrow preview_box'><td colspan='8' style='padding:5px'>불러오는중...</td></tr>").insertAfter($(this));
        });
        
        previewLoad(-1);
    }
    
});

function previewLoad(idx) {
    var getIdx = idx + 1;
    if(listData[getIdx] != undefined) {
        var getData = listData[getIdx];
        var getUrl = getData.find("td.tlistname a").attr("href");
        if(getUrl != "") {
            $.ajax({
                type: "POST",
                url:getUrl,
                dataType:"html",
                success:function(data) {
                    var getDesc = $(data).find(".viewdescription");
                    if(getDesc.length > 0) {
                        var getPreviewBox = getData.next(".preview_box").find("td").html(getDesc.html());
                        getPreviewBox.find("a").attr("target","_blank");
                        if(imgThumbLoad) {
                            getPreviewBox.find("img").eq(0).each(function() {                                
                                var getSrc = "";
                                var getImgEle = $(this);
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

                                if(getSrc != "") {
                                    var imgObj = new Image();
                                    imgObj.onload = function() {
                                        getImgEle.attr("src",getSrc).closest("a").attr("href",getSrc);
                                    };
                                    imgObj.src = getSrc;                                     
                                }                                    
                            });                        
                        }                        
                    }
                }
            });
        }
                
        setTimeout(function() {
            previewLoad(getIdx);
        }, listDelay);
    }
}