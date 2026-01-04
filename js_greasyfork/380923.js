// ==UserScript==
// @name 河北云教育挂课加速器 www.hebyunedu.com
// @namespace Violentmonkey Scripts
// @version           1.1
// @description       河北云教育平台学习课件加速助手
// @match http://www.hebyunedu.com/lms/learning/courseware/*
// @require http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/380923/%E6%B2%B3%E5%8C%97%E4%BA%91%E6%95%99%E8%82%B2%E6%8C%82%E8%AF%BE%E5%8A%A0%E9%80%9F%E5%99%A8%20wwwhebyuneducom.user.js
// @updateURL https://update.greasyfork.org/scripts/380923/%E6%B2%B3%E5%8C%97%E4%BA%91%E6%95%99%E8%82%B2%E6%8C%82%E8%AF%BE%E5%8A%A0%E9%80%9F%E5%99%A8%20wwwhebyuneducom.meta.js
// ==/UserScript==
(function(){
  'use strict';
  $("#tsinfo2").html("<h1>你正在加速挂课，已挂课<span id='pastm' style='color:#f00'>1</span>分钟</h1><br/><br/><h2>注意：学习时长达到要求时关闭此页面标签即可。</h2>");
  showdiv2();
  var pt=1;
  function pasttime(){
    pt=pt+1;
    $("#pastm").text(pt);
  }
  setInterval(pasttime,1000);
  setInterval(learningSave,1000);
}
)();