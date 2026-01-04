// ==UserScript==
// @name         重庆市专业技术人员继续教育-刷课
// @namespace    https://www.tuziang.com/combat/2212.html
// @version      0.1
// @description  重庆市专业技术人员继续教育-秒刷脚本
// @author       Tuziang
// @match        *://*.chinaredstar.21tb.com/*
// @run-at       document-end
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396805/%E9%87%8D%E5%BA%86%E5%B8%82%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2-%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/396805/%E9%87%8D%E5%BA%86%E5%B8%82%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2-%E5%88%B7%E8%AF%BE.meta.js
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
        data: "scoId=" + info.scoId\
        + "&location=1",\
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
$("body").attr("onload","setTimeout(okPlay, 1000);")\
});';
})();