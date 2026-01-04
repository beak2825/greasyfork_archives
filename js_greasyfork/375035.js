// ==UserScript==
// @version 0.0.2
// @description:zh-cn 跳过steam队列中无法浏览的项目
// @name Steam Skipper
// @namespace Violentmonkey Scripts
// @match https://store.steampowered.com/*
// @grant none
// @description 跳过steam队列中无法浏览的项目
// @downloadURL https://update.greasyfork.org/scripts/375035/Steam%20Skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/375035/Steam%20Skipper.meta.js
// ==/UserScript==

function do_skip(){
  var should_skip = confirm("您要跳过这个不能浏览的项目吗？");
  var url = window.location.href;
  var splited = url.split("/");
  var app_id = splited[splited.length - 2];
  jQuery.post(
    "/app/7", 
    { sessionid: g_sessionID, appid_to_clear_from_queue: app_id }
  ).done(
    function() {
      window.location.href = "https://store.steampowered.com/explore/";
    }
  );
  
}

function check_element() {
  var title = document.title;
  if (title !== "站点错误") {
    return
  }
  var element = jQuery(".error");
  if (element.text().include("不允许")) {
    do_skip();
  }
}

function main(){
  check_element();
}

main();