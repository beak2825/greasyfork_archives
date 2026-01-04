// ==UserScript==
// @name         CSDN打印助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  解决打印 CSDN 页面时样式错乱问题
// @author       You
// @match        https://blog.csdn.net/*/article/details/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468055/CSDN%E6%89%93%E5%8D%B0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/468055/CSDN%E6%89%93%E5%8D%B0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const removeList = []; // 要删除的元素列表
  // 侧边栏
  const aside = document.getElementsByTagName("aside");
  const asideList = Array.from(aside);
  // 右侧栏
  const rightAside = document.getElementById("rightAside");
  // 底部工具栏
  const toolBarBox = document.getElementById("toolBarBox");
  // 顶部工具栏
  const csdnToolbar = document.getElementById("csdn-toolbar");
  // 右侧固定的工具栏
  const csdnSideToolbar = document.getElementsByClassName("csdn-side-toolbar");
  const csdnSideToolbarList = Array.from(csdnSideToolbar);
  // 技能树
  const treeSkill = document.getElementById("treeSkill");
  // 推荐阅读
  const recommendBox = document.getElementsByClassName("recommend-box");
  const recommendBoxList = Array.from(recommendBox);
  // 评论
  const commentBox = document.getElementById("commentBox");
  const pcCommentBox = document.getElementById("pcCommentBox");
  const recommendNps = document.getElementById("recommendNps");
  // 底部
  const blogFooterBottom = document.getElementsByClassName("blog-footer-bottom")[0];
  removeList.push(
    ...asideList,
    rightAside,
    toolBarBox,
    csdnToolbar,
    ...csdnSideToolbarList,
    treeSkill,
    ...recommendBoxList,
    commentBox,
    pcCommentBox,
    recommendNps,
    blogFooterBottom
  );
  removeList.forEach((item) => {
    if (!item) return;
    item.remove();
  });

  // 展开所有代码
  const hidePreCodeBt = document.getElementsByClassName("hide-preCode-bt");
  const hidePreCodeBtList = Array.from(hidePreCodeBt);
  hidePreCodeBtList.forEach((item) => {
    item.click();
  });

  // 调整主体部分宽度
  const mainBox = document.getElementById("mainBox");
  mainBox.style.setProperty("width", "100%", "important");
  const main = document.querySelectorAll("#mainBox main")[0];
  main.style.setProperty("width", "100%", "important");

  // 打印按钮
  const title = document.getElementById("articleContentId");
  title.style.setProperty("display", "inline-block", "important");
  const articleTitleBox = document.getElementsByClassName("article-title-box")[0];
  articleTitleBox.style.setProperty("display", "flex", "important");
  articleTitleBox.style.setProperty("align-items", "center", "important");
  const printBtn = document.createElement("button");
  printBtn.innerText = "打印";
  printBtn.type = "button";
  printBtn.style.setProperty("font-size", "14px", "important");
  printBtn.style.setProperty("color", "#fff", "important");
  printBtn.style.setProperty("padding", "5px 10px", "important");
  printBtn.style.setProperty("height", "30px", "important");
  printBtn.style.setProperty("background-color", "#fc5531", "important");
  printBtn.style.setProperty("border", "none", "important");
  printBtn.style.setProperty("border-radius", "5px", "important");
  printBtn.style.setProperty("cursor", "pointer", "important");
  printBtn.style.setProperty("outline", "none", "important");
  printBtn.style.setProperty("margin-left", "20px", "important");

  printBtn.onclick = () => {
    window.print();
  };
  articleTitleBox.appendChild(printBtn);
})();
