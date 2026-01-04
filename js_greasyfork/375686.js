// ==UserScript==
// @name         haha.mx增强选项
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  自动读取gif；自动屏蔽踩多的
// @author       Alan Wang
// @match        https://www.haha.mx/*
// @match        https://www.hahamx.cn/*
// @downloadURL https://update.greasyfork.org/scripts/375686/hahamx%E5%A2%9E%E5%BC%BA%E9%80%89%E9%A1%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/375686/hahamx%E5%A2%9E%E5%BC%BA%E9%80%89%E9%A1%B9.meta.js
// ==/UserScript==

function readAW() {
  var settings=localStorage.aw_haha;
  if (settings) {
    return JSON.parse(settings);
  } else {
    return {gif:true,hide:false};
  }
}

function writeAW(settings) {
  localStorage.aw_haha=JSON.stringify(settings);
}

window.onload=function() {
  'use strict';

  var $options=$('<div id="options" class="main-top-bar clearfix"/>').insertBefore($(".joke-list"));
  $options.html('　　　GIF图点击加载: <input type="checkbox" name="gif" id="gif" checked>　　　　隐藏不受欢迎图片: <input type="checkbox" name="hide" id="hide">').css({"line-height":"60px"});
  var settings=readAW();
  if (settings.hide) {
    $("#hide").attr("checked","checked");
    $(".joke-list-item").each(function(){
      var good=$(this).find(".btn-icon-good").text(),
          bad=$(this).find(".btn-icon-bad").text();
      if (bad-good>=50) {
        $(this).children(".joke-list-item-main").hide().after($('<div>因不受欢迎已被自动隐藏. <a class="jian" style="cursor:pointer">[手贱一回]</a></div>'));
      }
    });
  }
  if (!settings.gif) {
    $("#gif").removeAttr("checked");
    $(".joke-list-item-main:visible .joke-main-img-gif-wrapper").trigger("click");
  }
  $("#gif").click(function(){
    var settings=readAW();
    settings.gif=$(this).is(":checked");
    writeAW(settings);
    location.reload();
  });
  $("#hide").click(function(){
    var settings=readAW();
    settings.hide=$(this).is(":checked");
    writeAW(settings);
    location.reload();
  });
  $(".jian").click(function(){
    $(this).parent("div").hide().siblings(".joke-list-item-main").show();
  });
};

