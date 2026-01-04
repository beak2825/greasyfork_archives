// ==UserScript==
// @name         Linux.Do 清除左侧未读蓝点
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  清除未读蓝点
// @author       Ygmjjdev
// @match        https://linux.do/*
// @icon         https://linux.do/uploads/default/optimized/1X/3a18b4b0da3e8cf96f7eea15241c3d251f28a39b_2_180x180.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490288/LinuxDo%20%E6%B8%85%E9%99%A4%E5%B7%A6%E4%BE%A7%E6%9C%AA%E8%AF%BB%E8%93%9D%E7%82%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/490288/LinuxDo%20%E6%B8%85%E9%99%A4%E5%B7%A6%E4%BE%A7%E6%9C%AA%E8%AF%BB%E8%93%9D%E7%82%B9.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function waitForElement(selector, callback) {
    const observer = new MutationObserver((mutationsList, observer) => {
      // 查找页面中是否存在指定的元素。
      const element = document.querySelector(selector);
      if (element) {
        // 如果找到指定的元素，停止观察并执行回调函数。
        callback(element);
        observer.disconnect();
      }
    });
    observer.observe(document, { childList: true, subtree: true });
  }

  waitForElement('#d-sidebar', (element) => {

    var targetNode = document.getElementById(
      "d-sidebar",
    );

    // 清空已经有的蓝点
    var elements = document.querySelectorAll(
      "#d-sidebar span.unread",
    );
    elements.forEach(function (element) {
      element.remove();
    });


    var config = { attributes: false, childList: true, subtree: true };

    var callback = function (mutationsList, observer) {
      for (var mutation of mutationsList) {
        if (mutation.type === "childList") {
          var elements = targetNode.querySelectorAll("span.unread");
          elements.forEach(function (element) {
            element.remove();
          });
        }
      }
    };
    var observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
  });


})();
