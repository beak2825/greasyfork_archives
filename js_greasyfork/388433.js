// ==UserScript==
// @name         21TB_AutoStudy
// @namespace    http://tampermonkey.net/
// @version      11.1.1
// @description  自动结束视频播放,支持二分屏和scorm课程
// @author       You
// @match        *://*.rcpx.21tb.com/els/html/courseStudyItem/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388433/21TB_AutoStudy.user.js
// @updateURL https://update.greasyfork.org/scripts/388433/21TB_AutoStudy.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var scriptContent = 'function okPlay() {\
  if (info.scoId === undefined ) {\
     return;\
  }\
  if (info.courseStandard =="SCORM12") {\
    var scormObject = scormProcessor.init();\
    scormObject.isLMSInitialized = true;\
    scormObject.scoDataManager.core.lesson_progress.value = 100;\
    scormProcessor.LMSFinish(info.courseId, info.scoId, scormObject, "");\
  } else {\
    var sourceUrl = "html/courseStudyItem/courseStudyItem.selectResource.do";\
    $.ajax({\
        type: "POST",\
        url: CONFIG.ctx + sourceUrl + "?host=" + CONFIG.hostDomain + "&vbox_server="  + "&fromNetWorkSetting=false" + "&chooseHttp=" + document.location.protocol + "&courseType=NEW_COURSE_CENTER",\
        data: "scoId=" + info.scoId + "&courseId=" + info.courseId\
        + "&firstLoad=false"\
        + "&location=9527.58",\
        async: false,\
        success: function (d) {\
        var aLength = $("#courseItemId .cl-catalog-item .cl-catalog-item-sub a:visible").length;\
  	  var aleadyPlay = $("#courseItemId .cl-catalog-item .cl-catalog-item-sub .cl-catalog-icon:visible").length;\
  	  console.log("aLength:" + aLength);\
  	  console.log("aleadyPlay:" + aleadyPlay);\
        if (aLength != aleadyPlay) {\
  	     document.location.reload();\
  	  }\
        },\
        error: function () {\
        }\
    });\
  }\
}\
$(function(){\
if ($(".cs-nav-menu").length > 0) {\
    var linkButton = $("<li />");\
    linkButton.attr("class","cs-menu-item cl-go-btn pull-right");\
	var a = $("<a />");\
	a.attr("href","javascript:okPlay();");\
    a.attr("class","cl-go-link");\
	a.text("关 闭");\
	linkButton.append(a);\
    $(".cs-nav-menu").prepend(linkButton);\
}\
});';
    var scriptE = document.createElement("script");
    scriptE.setAttribute("type", "text/javascript");
    scriptE.innerHTML = scriptContent;
    document.body.appendChild(scriptE);

    document.getElementById('goBack').remove();
    document.getElementById('discussAnchorPoint').remove();
    document.getElementById('palyerContainerId').remove();
    window.onload = function() {
        setTimeout(search, 1500);
    }
    function search() {
        if (window.find("未学完")) {
            window.location.href = "javascript:okPlay();";
        } else if (window.find("已学完")) {
            window.close();
        } else {
            return false;
        }
    }
})();