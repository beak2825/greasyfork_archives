// ==UserScript==
// @name cc58同城自用过滤器,欢迎自己修改
// @namespace Violentmonkey Scripts
// @match https://cc.58.com/*
// @grant none
// @description  cc58同城自用过滤器,欢迎自己修改,用于过滤58同城不想要的条目
// @version 0.0.1.20190108095827
// @downloadURL https://update.greasyfork.org/scripts/376469/cc58%E5%90%8C%E5%9F%8E%E8%87%AA%E7%94%A8%E8%BF%87%E6%BB%A4%E5%99%A8%2C%E6%AC%A2%E8%BF%8E%E8%87%AA%E5%B7%B1%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/376469/cc58%E5%90%8C%E5%9F%8E%E8%87%AA%E7%94%A8%E8%BF%87%E6%BB%A4%E5%99%A8%2C%E6%AC%A2%E8%BF%8E%E8%87%AA%E5%B7%B1%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==
//拿到列表
//
var lists=$(".house-list-wrap").children();
$.each(lists, function( i, l ){
  if($(l).find(".baseinfo").eq(0).text().match(/高层\(共[678]层\)/)){
    $(l).remove();
  }
  //没有轨道
  if($(l).find(".baseinfo").eq(1).children().length===1){
    $(l).remove();
  }
  //轨道不应该超过1000
  else if(parseInt($(l).find(".baseinfo").eq(1).children().text().match(/\d+米/)[0])>1000){
    $(l).remove();
  }
  if($(l).find(".jjrinfo").children().eq(1).text().match(/史媛媛/)){
    $(l).remove();
  }
  //汽车城
  if($(l).find(".baseinfo").eq(1).text().match(/汽车城/)){
    $(l).remove();
  }
});