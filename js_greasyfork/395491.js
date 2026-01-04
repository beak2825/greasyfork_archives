// ==UserScript==
// @name         startimes kibana auto link
// @namespace    http://kibana.startimes.me/
// @description  Startimes kibana scripts
// @version      3.3
// @author       yang.xiaolong
// @match        *://kibana.startimes.me/*
// @grant        none
// @note         2020年01月21日11:34:10 增加了翻页的监控，修复翻页后动态加载的信息没有添加链接的bug
// @note         2020年01月21日14:35:54 更新脚本名字，脚本名字写错了
// @note         2020年01月21日14:49:04 测试更新脚本功能是否可用
// @note         2020年02月19日10:22:57 增加了判断列的逻辑，从===改为了indexOf,同时将滚动监听改为了定时监听
// @downloadURL https://update.greasyfork.org/scripts/395491/startimes%20kibana%20auto%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/395491/startimes%20kibana%20auto%20link.meta.js
// ==/UserScript==

(function () {
  'use strict';
  handleLink();
  
  setInterval(function() {
      handleLink();
  }, 1000);

  function handleLink() {
    var table = document.querySelector('.kbn-table.table');
    if (table) {
      var thead = table.querySelectorAll('thead > tr')[0].children;
      var current = 0;
      for (var i = 0; i < thead.length; i++) {
        if (thead[i].innerText.indexOf('cronet_log_analytics_url') >= 0) {
          current = i;
        }
      }
      var tbody = table.querySelectorAll('tbody > tr');
      for (var j = 0; j < tbody.length; j++) {
        var tbodyTr = tbody[j];
        if (tbodyTr && !tbodyTr.getAttribute('data-test-subj')) {
          var currentTd = tbodyTr.children[current];
          var url = currentTd.innerText;
          currentTd.innerHTML = '<a href="' + url + '" target="_blank">' + url + '</a>';
        }
      }
    } else {
      setTimeout(handleLink, 1000);
    }
  }
})();