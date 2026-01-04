// ==UserScript==
// @name         中转页面自动跳转
// @namespace    dhjesus
// @version      0.0.9
// @keywords     微信,稀土掘金,CSDN,知乎
// @description  某些网站打开链接会进入安全中转页面，此脚本实现自动跳转功能
// @icon         data:image/png;base64,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
// @author       DHJesus
// @include     *://weixin110.qq.com/*
// @include     *://link.juejin.cn/*
// @include     *://link.csdn.net/*
// @include     *://link.zhihu.com/*
// @include     *://docs.qq.com/*
// @grant        none
// @compatible	 Chrome
// @compatible	 Firefox
// @compatible	 Edge
// @compatible	 Safari
// @compatible	 Opera
// @compatible	 UC
// @downloadURL https://update.greasyfork.org/scripts/419688/%E4%B8%AD%E8%BD%AC%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/419688/%E4%B8%AD%E8%BD%AC%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function () {
  var host = window.location.host;
  var href = window.location.href;
  function getQueryVariable(variable) {
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
  }

  if(host.indexOf('weixin110') != -1) {
    window.location.href = document.getElementsByClassName('weui-msg__desc')[0].textContent;
  }
  
  if(host.indexOf('juejin') != -1) {
    var target = decodeURIComponent(getQueryVariable('target'));
    window.location.href = target;
    // window.location.href = document.getElementsByTagName('p')[1].textContent;
  }
  
  if(host.indexOf('csdn') != -1) {
    var target = decodeURIComponent(getQueryVariable('target'));
    window.location.href = target;
  }
  
  if(host.indexOf('zhihu') != -1) {
    var target = decodeURIComponent(getQueryVariable('target'));
    window.location.href = target;
  }

  if(href.indexOf('docs.qq.com/scenario/link.html') != -1) {
    var target = decodeURIComponent(getQueryVariable('url'));
    window.location.href = target
  }
})();
