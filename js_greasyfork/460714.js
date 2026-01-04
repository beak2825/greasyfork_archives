// ==UserScript==
// @name         生成纯元素CSS选择器
// @namespace    coycs.com
// @version      1.0.0
// @description  generate a element-only CSS selector
// @author       coycs
// @match        http://*/*
// @match        https://*/*
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460714/%E7%94%9F%E6%88%90%E7%BA%AF%E5%85%83%E7%B4%A0CSS%E9%80%89%E6%8B%A9%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/460714/%E7%94%9F%E6%88%90%E7%BA%AF%E5%85%83%E7%B4%A0CSS%E9%80%89%E6%8B%A9%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 根据选择器生成元素选择器
  const genTagSelector = (selector) => {
    let targetNode = document.querySelector(selector);
    let tagSelector = "";
  
    while (targetNode.nodeName != "BODY") {
      const parentNode = targetNode.parentNode;
      const childNodes = Array.from(parentNode.childNodes).filter(node => node.nodeName != "#text" && node.nodeName != "#comment");
      const tagName = targetNode.tagName.toLowerCase();
      let nthIndex = 0;
  
      // 判断父元素下目标元素的标签名是否唯一
      if (childNodes.filter(node => node.tagName.toLowerCase() == tagName).length == 1) {
        if (parentNode.nodeName != "BODY") {
          tagSelector = ` > ${tagName}` + tagSelector;
        } else {
          tagSelector = `body > ${tagName}` + tagSelector;
        }
  
      } else {
        // 获取nth-child的序号
        for (let i = 0; i < childNodes.length; i++) {
          if (childNodes[i] === targetNode) {
            nthIndex = i + 1;
            break;
          }
        };
  
        if (parentNode.nodeName != "BODY") {
          tagSelector = ` > ${tagName}:nth-child(${nthIndex})` + tagSelector;
        } else {
          tagSelector = `body > ${tagName}:nth-child(${nthIndex})` + tagSelector;
        }
        
      }
  
      targetNode = parentNode;
    }
  
    return tagSelector;
  }
  // 转换选择器
  const tranSelector = () => {
    const promptContent = window.prompt("请将原始的选择器粘贴在下面");
    // 判断粘贴内容是否合格
    if (promptContent === null) {// 点击取消按钮
      return;
    } else if (promptContent === "") {// 输入框内容为空时点击确定
      window.alert("内容为空！");
    } else if (!document.querySelector(promptContent)) {// 选择器无效
      window.alert("请检查选择器是否正确！");
    } else {
      const tagSelector = genTagSelector(promptContent);
      window.alert(tagSelector);
    }
  }


  GM_registerMenuCommand("输入选择器", tranSelector, "t");
})();
