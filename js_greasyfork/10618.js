// ==UserScript==
// @name         BugFree自动填充解决信息和展示图片
// @namespace    http://your.homepage/
// @version      1.3.2
// @description  自动填充解决信息，自动展示附件的图片信息
// @author       Haiifenng
// @match        http://192.168.0.8/bugfree/*
// @match        http://www.cn-java.com/bugfree/*
// @grant        none
// @require      http://code.jquery.com/jquery-1.9.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/10618/BugFree%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E8%A7%A3%E5%86%B3%E4%BF%A1%E6%81%AF%E5%92%8C%E5%B1%95%E7%A4%BA%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/10618/BugFree%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E8%A7%A3%E5%86%B3%E4%BF%A1%E6%81%AF%E5%92%8C%E5%B1%95%E7%A4%BA%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

try {
    if ($("#ResolvedBuild").length > 0 && $("#ResolvedBuild").attr("type") === "text" && $("#ResolvedBuild").val() === "") {
        $("#ResolvedBuild").val('svn');
        $("#Resolution").val('Fixed');
    }
    //document.getElementById('ResolvedBuild').value = 'svn';
    //document.getElementById('Resolution').value = 'Fixed';
} catch (e) {
}

//优化布局
$("#TopNavMain").css({"position":"fixed","top":"0px"});
$("#TopBCR").css({"margin-top":"36px"});
$("#ButtonList").css({"position":"fixed","top":"37px","background-color":"#C6C3C6","width":"100%"});

$("#BugForm").height($(window).height() - 59);
$("#BugForm").css({"overflow":"auto","margin-top":"59px"});

//自动展示图片
var aList = $(document.body).find("a[href^='FileInfo.php']");
var imgArray = [];
aList.each(function(){
    var a = $(this);
    var aInfo = [];
    var fileName = a.html().toLowerCase();
    if (fileName.indexOf(".png") > -1 || fileName.indexOf(".jpg") > -1 || fileName.indexOf(".jpeg") > -1 || fileName.indexOf(".gif") > -1) {
        aInfo[0] = a.attr("href");
        aInfo[1] = a.html();
        imgArray.push(aInfo);
    } 
});
if (imgArray.length > 0) {
    var div = $("<div></div>");
    //$("#BugMain").append(div);
    //$(document.body).append(div);
    $("#BugForm").append(div);
    div.css({
        marginLeft: 20,
        marginRight: 20
        //width : $("#BugHistory").width(),
        //height : "200px"//,
        //border : "1px red solid"
    });
    for (var i = 0; i < imgArray.length; i++) {
        var imgInfo = imgArray[i];
        var url = imgInfo[0];
        //var a = $("<div style='border:2px gray solid;margin-bottom:10px;'><img/><div>");
        var a = $("<fieldset style='margin-bottom:10px;'><legend>"+imgInfo[1]+"</legend><img/></fieldset>");
        a.find("img").attr("src", url);
        div.append(a);
    }
}
