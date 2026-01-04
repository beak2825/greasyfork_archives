// ==UserScript==
// @name         百度最新搜索结果
// @namespace    https://www.iicode.top/
// @version      0.1
// @description  使用百度搜索时，自动显示最近一年的结果，避免搜到很多年前的结果！
// @author       iicode
// @include         *://www.baidu.com/*
// @include         *://m.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404077/%E7%99%BE%E5%BA%A6%E6%9C%80%E6%96%B0%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/404077/%E7%99%BE%E5%BA%A6%E6%9C%80%E6%96%B0%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //https://www.baidu.com/s?ie=utf-8&wd=%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC
    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }

    var bUrl = window.location.href;
    var keyword = gpc = getUrlParam('wd');
    var gpc = getUrlParam('gpc');

    if(gpc == null) window.location.href = "https://www.baidu.com/s?ie=utf-8&wd="+keyword+"&gpc=stf%3D1558770283%2C1590392683%7Cstftype%3D1"

    if(gpc.length <= 10){
        alert("未选择最新的查询结果");
    }
})();


function getUrlParam(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var paramName = window.location.search.substr(1).match(reg);
      if(paramName != null){
          return decodeURIComponent(paramName[2]); //decodeURIComponent 处理中文乱码
      }
      return null;
}