// ==UserScript==
// @name         广东白云学院在线刷课
// @namespace    http://www.bmt.pub/
// @version      1.0
// @description  自动完成白云在线刷课任务，秒刷
// @author       院长
// @match         http://mooc.baiyunu.edu.cn/Learn/Index/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394077/%E5%B9%BF%E4%B8%9C%E7%99%BD%E4%BA%91%E5%AD%A6%E9%99%A2%E5%9C%A8%E7%BA%BF%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/394077/%E5%B9%BF%E4%B8%9C%E7%99%BD%E4%BA%91%E5%AD%A6%E9%99%A2%E5%9C%A8%E7%BA%BF%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

$(function(){

    $("#hidLearnTime").val(($("#hidLength").val()));
    $('.tool_bar ul li:eq(5) a').click();
  });


