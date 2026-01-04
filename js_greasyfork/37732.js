// ==UserScript==
// @name         ACFUN 文章区界面简化
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  0.11
// @author       fromsep
// @match        http://www.acfun.cn/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/37732/ACFUN%20%E6%96%87%E7%AB%A0%E5%8C%BA%E7%95%8C%E9%9D%A2%E7%AE%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/37732/ACFUN%20%E6%96%87%E7%AB%A0%E5%8C%BA%E7%95%8C%E9%9D%A2%E7%AE%80%E5%8C%96.meta.js
// ==/UserScript==

(function(){

    dispatch();

})();

function dispatch() {
    var url = window.location.href;
    var uri = url.replace(/http:\/\/www\.acfun\.cn/i, "");

    if(uri == "/") {
        return index();
    }

    if(uri.match(/^\/v\/list\d+\/index\.htm$/) !== null) {
        //newListPage();
        return jump2OldList(url);
    }

    if(uri.match(/^\/v\/list\d+\/index\=110\.htm$/) !== null) {
        return oldList();
    }

    if(uri.match(/^\/a\/ac\d+$/) !== null) {
        return detailPage();
    }

    return false;
}

function index() {
    var list = document.getElementsByClassName("module-tab")[0].children;
    var num;
    for (var i in list) {
        num = list[i].attributes['data-nav'].value;
        list[i].attributes.href.value = "/v/list" + num + "/index=110.htm";
        list[i].setAttribute("target", "_blank");
    }

    return true;
}

function jump2OldList(url) {
    window.location.href = url.replace(/index.htm/i, "index=110.htm");
    return true;
}

function oldList() {
    var list = document.getElementsByClassName("banner")[0].children;
    for (var i in list) {
        list[i].attributes.href.value = list[i].attributes.href.value.replace(/index.htm/i, "index=110.htm");
    }

    return true;
}

function detailPage() {
    var head, newStyle;
    head = document.getElementsByTagName('head')[0];

  if(head) {
    newStyle =  document.createElement('style');
    newStyle.setAttribute("type", "text/css");

    newStyle.innerHTML = '\
      #head-banner,#article-tags,div.fr {display:none;}\
      section.art-subject {height:10px !important;}\
      div.article-content {width:auto !important; margin-left:auto !important;}\
      div.content div.fl{width:1100px !important;}\
    ';

    head.appendChild(newStyle);
  }
  return true;
}


function newListPage() {
  var head, newStyle;
  head = document.getElementsByTagName('head')[0];

  if(head) {
    newStyle =  document.createElement('style');
    newStyle.setAttribute("type", "text/css");

    newStyle.innerHTML = '\
      div.refresh-bar {margin-bottom: 10px !important;}\
      div.domain-list {display:none !important;}\
      div.main-title {display:none !important;}\
      div.a-column-left {margin-top:0 !important;}\
      div.article-item {min-height:0 !important;}\
      hr.article-item-hr {margin:10px 0 10px 0 !important;}\
      a.atc-title {font-size:16px !important;font-weight:normal !important;}\
      div.atc-content {height:16px !important; margin-top:6px !important; }\
      div.atc-info {margin-top:12px !important;}\
      div.atc-left {min-height:0 !important;}\
      div.atc-image img {width:164px !important;height:90px !important;margin-left:55px !important}\
    ';

    head.appendChild(newStyle);
  }
  return true;
}
