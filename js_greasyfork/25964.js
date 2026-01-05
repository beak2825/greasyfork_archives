// ==UserScript==
// @name          Google & baidu Switcher (修改版)
// @namespace     http://tampermonkey.net/
// @author        ZeroCode
// @version       0.2.2
// @description   基于Google_baidu_Switcher_(ALL_in_One)修改，分别在百度和google的搜索结果页面增加搜索跳转按钮。
// @include       https://www.google.*
// @include       http://www.google.*
// @include       https://ipv6.google.*
// @include       http://ipv6.google.*
// @include       http://www.baidu.com/*
// @include       https://www.baidu.com/*
// @include       http://image.baidu.com/*
// @include       https://image.baidu.com/*
// @require       https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @note          18.12.30-V0.2.2 谷歌搜索按钮优化。
// @note          18.12.11-V0.2.1 搜索按钮显示效果调整。
// @note          18.12.11-V0.2.0 增加百度图片搜索与谷歌图片搜索之间跳转功能。
// @note          18.01.02-V0.1.2 微调百度页面中google搜索按钮，兼容AC-Baidu。
// @note          17.08.22-V0.1.1 微调Google中百度搜索按钮显示效果。
// @note          16.12.23-V0.1.0

// @downloadURL https://update.greasyfork.org/scripts/25964/Google%20%20baidu%20Switcher%20%28%E4%BF%AE%E6%94%B9%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/25964/Google%20%20baidu%20Switcher%20%28%E4%BF%AE%E6%94%B9%E7%89%88%29.meta.js
// ==/UserScript==
(function() {
  'use strict';
  if(location.host.indexOf("baidu.com") > -1){
    if (getUrlParam("wd").length > 0 || getUrlParam("word").length > 0 || window.location.href.lastIndexOf("/s?") > 0) {
      baidu2google();
    }
    //2018/11/07 F9y4ng 检测从baidu首页进入的搜索（修正自动提交的Bug）
    if (/^http(s)?:\/\/(www\.)?baidu\.com\/$/ig.test(window.location.href)) {
      $("#kw").on("blur", function () {
        if ($('#kw').val().length > 0) {
          setTimeout(function () {
            if ($('#google_search').length < 1 && getUrlParam("wd").length > 0) {
              baidu2hgoogle();
            }
          }, 600);
        }
      });
    }
  }
  else if(location.host.indexOf(".google.") > -1){
    if (window.location.hash.lastIndexOf("q=") > 0 || window.location.search.lastIndexOf("q=") > 0) {
      google2baidu();
    }
    //2018/11/07 F9y4ng GOOGLE首页自动提交搜索修正
    if (/^http(s)?:\/\/(www\.)?google\.\w+(\.\w+)?\/$/ig.test(window.location.href) || getUrlParam("q") === "") {
      var gfm = $('input[name="q"]');
      if ("undefined" == typeof (gfm)) {
        gfm = $("input[role='combobox']");
      }
      gfm.off('click').on({
        blur: function () {
          if (gfm.val().length > 0) {
            $("form").submit();
          }
        }
      });
    }
    var ua = myBrowser();
    if (ua == "FF" || ua == "Edge") {
      $('#bdyxwz').css('margin-top', '10px');
      $('#bdyxss').css('margin', '12px 2px 0 4px');
    }
    else {
      $('#bdyxwz').css('margin-top', '0px');
      $('#bdyxss').css('margin', '2px 2px 0 4px');
    }
    var elm = $('#bdyx');
    var startPos = $(elm).offset().top;
    $.event.add(window, "scroll", function () {
      var p = $(window).scrollTop();
      $(elm).css('height', ((p) > startPos) ? '37px' : '49px');
      if (ua == "FF" || ua == "Edge") {
        $('#bdyxwz').css('margin-top', ((p) > startPos) ? '5px' : '10px');
        $('#bdyxss').css('margin', ((p) > startPos) ? '7px 2px 0 4px' : '12px 2px 0 4px');
      }
    });
  }
  function baidu2google() {
    $('.s_btn_wr').after('<div class="bg s_btn_wr" style="margin-left:10px"><input type="button" id="google_search" value="Google一下" class="bg s_btn" ></div>');
    var s_url = "https://www.google.com/search?newwindow=1&hl=zh-CN&source=hp";
    if(getUrlParam("tn") == "baiduimage") {
      s_url = s_url + "&tbm=isch";
    }
    $('#google_search').on({
      click: function () {
        window.open(s_url + "&q=" + encodeURIComponent($('#kw').val()));
        return false;
      }
    });
    baidu_resize();
    $(window).on("resize", function(){
      baidu_resize();
    });
  }
  function baidu_resize() {
    if($("#result_logo").css("left") != "auto"){
        $(".s_ipt_wr").width($(".s_ipt_wr").width() - 70);
    }
  }
  function google2baidu(){
    $('#tsf').prepend('<div id="sfdiv_bd" style="display:inline-block;position:relative;height:0px;width:110px;right:-115px;\
top:0px;float:right;"><button id="bdyx" class="lsbb kpbb" style="width:120px;height:49px;margin-top:-2px;cursor:pointer;\
display: flex;border-radius: 8px;border: 1px solid #dfe1e5;box-shadow: none;border-radius: 24px;" type="button"><span \
class="sbico" id="bdyxss" style="color:#fff"><svg focusable="false" style="fill: #fff;" xmlns="https://www.w3.org/2000/svg"\
viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 \
4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z">\
</path></svg></span><span id="bdyxwz" style="font-size:16px;">百度一下</span></button></div>');
    var s_url = "https://www.google.com/search?newwindow=1&hl=zh-CN&source=hp";
    $('#sfdiv_bd').off("click").on("click", function(){
      var kw = $('input[name="q"]').val();
      //获取属性标签容错
      if ("undefined" == typeof (kw)) {
        kw = getUrlParam("q");
      }
      var s_url = "https://www.baidu.com/s?ie=utf-8&rqlang=cn";
      if(getUrlParam("tbm") == "isch") s_url = "https://image.baidu.com/search/index?tn=baiduimage&ie=utf-8&rqlang=cn";
      window.open(s_url + "&wd=" + encodeURIComponent(kw));
      return false;
    });
  }

  function getUrlParam(name) {
    //构造一个含有目标参数的正则表达式对象
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    //匹配目标参数
    var r = window.location.search.substr(1).match(reg);
    //返回参数值
    if (r != null) return unescape(r[2]);
    return "";
  }
})();

function myBrowser() {
  var userAgent = navigator.userAgent;
  if (userAgent.indexOf("Firefox") > -1) {
    return "FF";
  }
  if (userAgent.indexOf("Edge") > -1) {
    return "Edge";
  }
}
