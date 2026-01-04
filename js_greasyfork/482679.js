// ==UserScript==
// @name         自动跳转脚本
// @namespace    https://example.com/
// @version      1
// @description  自动跳转到指定网址，可用于自动完成任务等场景。
// @author       Your Name
// @match        https://example.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482679/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/482679/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var count = 0;

  function runTask() {
    if (count >= 300) {
      console.log("任务已完成");
      return;
    }

    setTimeout(function() {
      window.location.href = "https://teach.sxjgxy.edu.cn/meol/jpk/course/layout/newpage/index.jsp?courseId=12112";
      setTimeout(function() {
        window.location.href = "https://teach.sxjgxy.edu.cn/meol/personal.do?loginRedirect=true###";
        setTimeout(function() {
          window.location.href = "https://teach.sxjgxy.edu.cn/meol/jpk/course/layout/newpage/index.jsp?courseId=12112";
          count++;
          console.log(`已完成${count}次`);
          runTask();
        }, 2000);
      }, 2000);
    }, 2000);
  }

  runTask();
})();
