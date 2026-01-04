// ==UserScript==
// @name          SWUST 教务处自动完成教学质量评价学生问卷
// @author        lengthmin <lengthmin@gmail.com>
// @namespace     dean.swust.evaluateOnline
// @version       1.1
// @description   自动完成教学质量评价学生问卷
// @include       https://matrix.dean.swust.edu.cn/acadmicManager/index.cfm?event=evaluateOnline:DEFAULT_EVENT
// @include       https://matrix.dean.swust.edu.cn/acadmicManager/index.cfm?event=evaluateOnline:evaluateResponse*
// @grant GM_setClipboard
// @grant GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/393260/SWUST%20%E6%95%99%E5%8A%A1%E5%A4%84%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90%E6%95%99%E5%AD%A6%E8%B4%A8%E9%87%8F%E8%AF%84%E4%BB%B7%E5%AD%A6%E7%94%9F%E9%97%AE%E5%8D%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/393260/SWUST%20%E6%95%99%E5%8A%A1%E5%A4%84%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90%E6%95%99%E5%AD%A6%E8%B4%A8%E9%87%8F%E8%AF%84%E4%BB%B7%E5%AD%A6%E7%94%9F%E9%97%AE%E5%8D%B7.meta.js
// ==/UserScript==

var setting = {
  wait: 3000,
  timeout: 3000,
};

function eventHandler() {
  if (
    location.href ==
    "https://matrix.dean.swust.edu.cn/acadmicManager/index.cfm?event=evaluateOnline:DEFAULT_EVENT"
  ) {
    document
      .querySelectorAll(
        "#Questionnaire > table tr.editRows > td:nth-child(6) > a"
      )
      .forEach((node, index) => {
        if (index == 0) {
          node.click();
        }
      });
  } else {
    setInterval(evaluateClass, setting.timeout);
  }
}

function evaluateClass() {
  setTimeout(() => {
    document
      .querySelectorAll(
        "#sheetTable > tbody > tr > td.quota.ltr > a[data-opt=1]"
      )
      .forEach((node) => {
        node.click();
      });
    document.querySelector("#CourseComment").value = "无";
    document.querySelector("#postTrigger").click();
  }, setting.wait);
}

// 检测 DOMContentLoaded 是否已完成
if (document.readyState !== "loading") {
  eventHandler();
} else {
  document.addEventListener("DOMContentLoaded", eventHandler);
}
