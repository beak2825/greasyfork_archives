// ==UserScript==
// @name         eln挂机助手
// @namespace    fartpig.org
// @version      0.1.1
// @description  自动结束视频播放,支持二分屏和scorm课程
// @author       fartpig
// @match        *://*.eln.fjnx.com.cn/els/html/courseStudyItem/*
// @match        *://*.21tb-file4.21tb.com/els/html/courseStudyItem/*
// @connect      github.org
// @run-at       document-end
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375839/eln%E6%8C%82%E6%9C%BA%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/375839/eln%E6%8C%82%E6%9C%BA%E5%8A%A9%E6%89%8B.meta.js
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
        + "&location=888888.9292112828632",\
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
    linkButton.attr("style","background-color: red");\
	var a = $("<a />");\
	a.attr("href","javascript:okPlay();");\
    a.attr("class","cl-go-link");\
	a.attr("style","background-color: red");\
	a.text("快速结束");\
	linkButton.append(a);\
    $(".cs-nav-menu").prepend(linkButton);\
}\
$("body").attr("onload","setTimeout(okPlay, 1000);")\
});';
var scriptE = document.createElement("script");
scriptE.setAttribute("type","text/javascript");
scriptE.innerHTML = scriptContent;
document.body.appendChild(scriptE);
})();