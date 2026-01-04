// ==UserScript==
// @name         四大时代kibana链接跳转
// @namespace    http://kibana.startimes.me/
// @description  Startimes kibana scripts
// @version      1.3
// @author       yang.xiaolong
// @match        *://kibana.startimes.me/*
// @grant        none
// @note         2020年01月21日11:34:10 增加了翻页的监控，修复翻页后动态加载的信息没有添加链接的bug
// @downloadURL https://update.greasyfork.org/scripts/395490/%E5%9B%9B%E5%A4%A7%E6%97%B6%E4%BB%A3kibana%E9%93%BE%E6%8E%A5%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/395490/%E5%9B%9B%E5%A4%A7%E6%97%B6%E4%BB%A3kibana%E9%93%BE%E6%8E%A5%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function () {
  'use strict';
  handleLink();

  window.addEventListener('scroll', function () {
    var timer; //使用闭包，缓存变量
    var startTime = new Date();
    return function () {
      var curTime = new Date();
      if (curTime - startTime >= 2000) {
        timer = setTimeout(function () {
          handleLink()
        }, 500);
        startTime = curTime;
      }
    }
  }());

  function handleLink() {
    var table = document.querySelector('.kbn-table.table');
    if (table) {
      var thead = table.querySelectorAll('thead > tr')[0].children;
      var current = 0;
      for (var i = 0; i < thead.length; i++) {
        var span = thead[i].querySelector('span');
        if (span && span.innerText === 'cronet_log_analytics_url ') {
          current = i;
        }
      }
      var tbody = table.querySelectorAll('tbody > tr');
      for (var j = 0; j < tbody.length; j++) {
        var tbodyTr = tbody[j].children;
        if (tbodyTr[current]) {
          var currentSpan = tbodyTr[current].querySelector('div > span');
          if (currentSpan) {
            currentSpan.innerHTML = '<a href="' + currentSpan.innerText + '" target="_blank">' + currentSpan.innerText + '</a>';
          }
        }
      }
    } else {
      setTimeout(handleLink, 1000);
    }
  }
})();