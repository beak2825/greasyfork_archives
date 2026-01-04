// ==UserScript==
// @name         洛谷娱乐插件·猫和老鼠
// @namespace    http://tampermonkey.net/
// @version      1.5.2
// @license      MIT
// @description  在洛谷题库右下角（也就是广告处）添加猫和老鼠，供大家娱乐使用
// @author       jyb666（制作插件）&维尼（制作gif）
// @match        *://www.luogu.com.cn/problem/*
// @exclude      *://www.luogu.com.cn/problem/list
// @match        *://www.luogu.com.cn/training/*
// @exclude      *://www.luogu.com.cn/training/list
// @exclude      *://www.luogu.com.cn/contest/*
// @match        *://www.luogu.com.cn/record/*
// @match        *://www.luogu.com.cn/discuss/*
// @exclude      *://www.luogu.com.cn/discuss/list
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @connect      oj.hikari.owo.fit
// @downloadURL https://update.greasyfork.org/scripts/409967/%E6%B4%9B%E8%B0%B7%E5%A8%B1%E4%B9%90%E6%8F%92%E4%BB%B6%C2%B7%E7%8C%AB%E5%92%8C%E8%80%81%E9%BC%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/409967/%E6%B4%9B%E8%B0%B7%E5%A8%B1%E4%B9%90%E6%8F%92%E4%BB%B6%C2%B7%E7%8C%AB%E5%92%8C%E8%80%81%E9%BC%A0.meta.js
// ==/UserScript==
 
(function() {
  'use strict';
  var url = Array();
  GM_xmlhttpRequest({
    method: "GET",
    url: "https://oj.hikari.owo.fit/api/entertainment",
    onload: function(response) {
      var res = JSON.parse(response.responseText);
      if(res.status==200&&response.status==200) {
        url = res.url;
      } else {
        alert("与 Hikari 的连接错误");
      }
    }
  });
  function randomNum(minNum,maxNum){ 
    switch(arguments.length){ 
      case 1: 
        return parseInt(Math.random()*minNum+1,10); 
      break; 
      case 2:
        return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
      break; 
      default: 
        return 0; 
      break; 
    } 
  } 
  function init() {
    var html = "<div data-v-0a593618=\"\" data-v-7b37eb95=\"\" id=\"entertainment\" style=\"z-index: 9999;position: fixed;padding:5px;text-align:center;width: 400px;right: 10px;bottom: 10px;\"><img id=\"entertainment-img\" style=\"width:100%;\" src=\""+url[randomNum(0,url.length-1)]+"\"> <a id=\"entertainment-a\" onclick=\"location.reload();\">看过了？点我刷新</a><button data-v-86f36770=\"\" data-v-0a593618=\"\" type=\"button\" onclick=\"document.getElementById(\'entertainment\').innerHTML=\'\';\" style=\"border-color: rgba(255, 255, 255, 0.5); color: rgb(255, 255, 255); background-color: rgba(0, 0, 0, 0.5);\">教练来了</button></div>";
    var node = document.createElement('div');
    node.innerHTML = html;
    document.querySelector('body').insertAdjacentElement('afterend', node);
  }
  var document=unsafeWindow.document;
  window.onload=function(){setTimeout(function() {
    document.querySelector("div[data-v-0a593618]").remove();
    init();
  },500)}
})();