// ==UserScript==
// @name        自动修改云之家审批标题
// @namespace   Violentmonkey Scripts
// @match       https://www.yunzhijia.com/cloudflow/home/manage/approval-detail*
// @grant       none
// @version     1.0
// @author      -
// @description 自动将标签页名称改为审批标题
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/516355/%E8%87%AA%E5%8A%A8%E4%BF%AE%E6%94%B9%E4%BA%91%E4%B9%8B%E5%AE%B6%E5%AE%A1%E6%89%B9%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/516355/%E8%87%AA%E5%8A%A8%E4%BF%AE%E6%94%B9%E4%BA%91%E4%B9%8B%E5%AE%B6%E5%AE%A1%E6%89%B9%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==

console.log('油猴脚本-修改审批标题启动');

var interval = setInterval(function() {
  ChangeTabTitle();
}, 3000);

var TimeCount = 0; // 尝试判断次数
var maxAttempts = 5; // 最大尝试次数

function ChangeTabTitle() {
  console.log('尝试获取审批标题');

  // 使用选择器获取标题元素
  const titleElement = document.querySelector('.approval-title h2.name');

  if (titleElement) {
    const approvalTitle = titleElement.textContent.trim();
    if (approvalTitle) {
      document.title = approvalTitle;
      console.log(`第 ${TimeCount + 1} 次：成功修改标题为 "${approvalTitle}"`);

      TimeCount++;
      if (TimeCount >= 2) { // 成功修改两次后停止
        clearInterval(interval);
        console.log("完成重命名工作");
      }
    }
  } else {
    console.log(`第 ${TimeCount + 1} 次：未找到标题元素`);
    TimeCount++;

    // 如果超过最大尝试次数，停止尝试
    if (TimeCount >= maxAttempts) {
      clearInterval(interval);
      console.log("达到最大尝试次数，停止重命名");
    }
  }
}

// 页面加载完成后开始执行
document.onreadystatechange = function () {
  if (document.readyState == "complete") {
    console.log('页面加载完成，开始执行标题修改');
    interval;
  }
}
