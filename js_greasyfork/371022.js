// ==UserScript==
// @name         炎黄盈动平台PIF页面优化
// @namespace    http://tampermonkey.net/
// @version      1.9.1
// @description  PIF表单图片直接展示
// @author       haiifenng
// @match        https://my.awspaas.com/*


// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/371022/%E7%82%8E%E9%BB%84%E7%9B%88%E5%8A%A8%E5%B9%B3%E5%8F%B0PIF%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/371022/%E7%82%8E%E9%BB%84%E7%9B%88%E5%8A%A8%E5%B9%B3%E5%8F%B0PIF%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    // #require      https://cdnjs.cloudflare.com/ajax/libs/video.js/8.3.0/video.min.js
    // #resource css https://cdnjs.cloudflare.com/ajax/libs/video.js/8.3.0/video-js.min.css
    'use strict';
    if(typeof(jQuery) == 'undefined'){
        return;
    }
    //GM_addStyle(GM_getResourceText("css"));
    //优化PIF中的图片
    var imgArray = [];
    $("#awsuiFile_FILES").find(".file_item").each(function(){

        var clickStr = $(this).find("span[onclick]").attr("onclick");
        var aInfo = [];
        var imgUrl = "";
        var title = "";
        if (clickStr) {
            imgUrl = clickStr.substring("AWSFile.officeFilePreview('".length, clickStr.indexOf(",")-1);
        } else {
            imgUrl = $(this).find("a").attr("href");
        }
        title = $(this).find(".aws-form-ui-file-label").text();
        var a = $(this).find("a");
        if (a.length > 0) {
            imgUrl = a.attr("href");
            //title = a.find("span").text();
        }
        if (title.toLowerCase().indexOf("png")>-1 || title.toLowerCase().indexOf("jpg")>-1 || title.toLowerCase().indexOf("jpeg")>-1 || title.toLowerCase().indexOf("gif")>-1){
            aInfo = {};
            aInfo.type = "img";
            aInfo.imgUrl = imgUrl;
            aInfo.title = title;
            imgArray.push(aInfo);
            $(this).hide();
        } else if (title.toLowerCase().indexOf("mp4")>-1 || title.toLowerCase().indexOf("webm")>-1 || title.toLowerCase().indexOf("ogv")>-1 || title.toLowerCase().indexOf("wmv")>-1 || title.toLowerCase().indexOf("mov")>-1){
            aInfo.type = "video";
            aInfo.fileType = "mp4";
            aInfo.imgUrl = imgUrl;
            aInfo.title = title;
            imgArray.push(aInfo);
            $(this).hide();
        }
    });
    if (imgArray.length > 0) {
        var div = $("<div></div>");
        var container = $($("div.tips")[2]);
        container.append(div);
        var divWidth = container.width();
        div.css({
            marginLeft: 0,
            marginRight: 0
            //width : $("#BugHistory").width(),
            //height : "200px"//,
            //border : "1px red solid"
        });
        for (var i = 0; i < imgArray.length; i++) {
            var imgInfo = imgArray[i];
            var url = imgInfo.imgUrl;
            var $div = $("<div></div>");
            $div.css({
                "margin":"10px 10px 20px 10px",
                "cursor":"pointer",
                "box-shadow": "0px 0px 20px 0px "+(i%2==0?"#008ed5":"#5fb878")
            });
            $div.attr("title","点击查看原图");
            var $title = $("<div><a href='"+imgInfo.imgUrl+"'>"+imgInfo.title+"</a></div>");
            $title.css({
                "text-align":"center",
                "width": "100%",
                "font-size":"16px"
            });
            var $img = $("<img src=''/>");
            var $video = $("<video controls></video>");
            $div.append($title);
            if (imgInfo.type=="img") {
                $div.append($img);
                var img = $img[0];
                img.src = url;
                img.onload = function () {
                    if ($(this).width() > divWidth) {
                        $(this).css({"width":"100%"});
                    }
                };
                $img.off("click").on("click",function(){
                    var topImg = $(this).clone();
                    topImg.css({"margin":"0 auto"});
                    topImg.attr("title","点击关闭");
                    var topDiv = $("<div></div>");
                    topDiv.css({
                        "position":"absolute",
                        "padding":"10px",
                        "box-sizing": "border-box",
                        "background-color": "rgba(226, 226, 226, 0.90)",
                        "z-index":"2000",
                        "top":$(document).scrollTop()+"px",
                        "width":"100%",
                        "height":"100%",
                        "alignItems":"center",
                        "display":"flex",
                        "display":"-webkit-flex",
                        "cursor":"pointer"
                    });
                    topDiv.append(topImg);
                    topDiv.off("click").on("click",function(){
                        $(this).remove();
                    });
                    $("body").append(topDiv);
                });
            } else if(imgInfo.type=="video"){
                $video.css({
                    width:"100%",
                    height:400
                });
                $video.attr("id","my-player");
                $video.attr("class","video-js");
                $video.attr("preload","auto");
                $video.attr("data-setup","{}");
                //$video.attr("height",500);
                //$video.attr("width","100%");
                $video.append("<source src='"+imgInfo.imgUrl+"' type='video/"+imgInfo.fileType+"'>");
                $div.append($video);
            }
            div.append($div);
        }
    }


    //PIF页面标题处理
    if ($("#PIFNO_Readonly").length > 0 && $("#CASENAME_Readonly").length > 0){
        //查找协同人员
        var title = $("#PIFNO_Readonly").text().substring(9);
        var shortNo = $("#PIFNO_Readonly").text().substring(9);
        var lastTr = $("#AWS_OPINION_TABLE tbody").find("tr").last();
        var opTd = lastTr.find("td:eq(4)");

        if (opTd.text() == "协同") {
            var nameTd = lastTr.find("td:eq(5)");
            var name = nameTd.find(".awsui-user-profile").text();
            title += "-" + name;
        }
        $("#FormReturnZone").show();
        $("#returnButton").hide();
        var toolbarText = $("#FormReturnZone").find(".toolbarText").text();

        var pattern = /PIF(\d+)/;
        var pattern2 = /(PIF\d+)/;
        var match = pattern.exec(toolbarText);
        var pifNo = "";
        // Check if a match is found
        if (match) {
            // Extract the content from the captured group
            pifNo = match[0];
        }
        var pifQueryUrl = "https://my.awspaas.com/r/w?sid="+$("#sid").val()+"&msaDefSvcId=oa&&msaAppId=com.crmpaas.apps.service&cmd=CLIENT_DW_PORTAL&processGroupId=obj_40522b2a44c44d55bf264b968d1da3af&appId=com.crmpaas.apps.service&hideToolbar=true&hideTitle=true&condition=";
        pifQueryUrl += encodeURIComponent("[{cp:'=',fd:'PIFNOOBJ_936301EB43D341D0A3421927FE05E80D',cv:'"+pifNo+"'}]");

        var aTag = '<a href="'+pifQueryUrl+'" target="'+pifNo+'">'+shortNo+'</a>';
        $("#FormReturnZone").find(".toolbarText").html(aTag + "-" + toolbarText);

        title += "-" + $("#CASENAME_Readonly").text()
        document.title = title;
        $(function(){
            window.opener.focus();
        });
    }

    if ($("#DWTitle").text()=="产品改善"){
        OPEN_TARGET_TAB = "blankwin";
    }
})();