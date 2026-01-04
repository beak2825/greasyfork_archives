// ==UserScript==
// @name BlockKeywordsByCnBeta
// @namespace Violentmonkey Scripts
// @match https://www.cnbeta.com/
// @grant none
// @description 在CB中拦截指定关键词的文章
// @version 0.0.1.20190327033443
// @downloadURL https://update.greasyfork.org/scripts/380988/BlockKeywordsByCnBeta.user.js
// @updateURL https://update.greasyfork.org/scripts/380988/BlockKeywordsByCnBeta.meta.js
// ==/UserScript==


// 拦截包含以下关键词的文章
const keywords = ["华为", "苹果", "三星", "小米", "环球时报"];

var keywordsRegs = [];
keywords.forEach(k => {
  keywordsRegs.push(new RegExp(k));
});

window.addEventListener("load", () => {
  var targetNode = document.querySelector(".items-area"); // 文章节点容器
  var config = { childList: true };

  var remove = () => {
    let list = targetNode.querySelectorAll(".item"); // 文章节点列表
    list.forEach(item => {
      let block = false;
      keywordsRegs.forEach(r => {
        if (r.test(item.textContent)) {
          block = true;
        }
      });
      if (block) {
        targetNode.removeChild(item);
      }
    });
    observer.observe(targetNode, config);
  };
  var callback = function(mutationsList, observer) {
    for (var mutation of mutationsList) {
      if (mutation.type == "childList") {
        console.log("A child node has been added or removed.");
        observer.disconnect(); // 终止监听
        remove();
      }
    }
  };
  var observer = new MutationObserver(callback);
  remove();
});
