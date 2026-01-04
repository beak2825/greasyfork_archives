// ==UserScript==
// @name         页面变灰
// @namespace    tao'sFirstScript
// @version      1.35
// @description  隐藏知乎首页的title防止别人一眼就看出你在摸鱼，页面改成灰色，防止图片引人注意
// @author       谷雨
// @match        *://www.zhihu.com/*
// @icon         https://static.zhihu.com/heifetz/favicon.ico
// @grant        none
// @run-at        document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462158/%E9%A1%B5%E9%9D%A2%E5%8F%98%E7%81%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/462158/%E9%A1%B5%E9%9D%A2%E5%8F%98%E7%81%B0.meta.js
// ==/UserScript==

(function () {
  //var slogan = document.querySelector('title')
  var icon = document.querySelector('link[rel="shortcut icon"]');
  var title = document.querySelector(".AppHeader");
  var questionPage = document.querySelector(".QuestionPage");
  var questionMain = document.querySelector(".Question-main");
  var sideColumn = document.querySelector(".Question-sideColumn");
  var container = document.querySelector(".Topstory-container");
  var mainColumn = document.querySelector(".Topstory-mainColumn");
  var siblings = container ? Array.from(container.parentNode.children) : null;
  var siblings2 = container ? Array.from(container.children) : null;
  // 推荐答案区域
  var answerArea = document.querySelector(".Topstory-recommend");
  console.log(answerArea);
  // 当前在读答案
  var nowAnswer = null;

  //slogan.textContent = 'JavaScript'

  if (container) {
    siblings.forEach(function (sibling) {
      if (sibling !== container) {
        sibling.style.display = "none";
      }
    });

    siblings2.forEach(function (sibling) {
      if (sibling !== mainColumn) {
        sibling.style.display = "none";
      }
    });
  }
  if (icon)
    icon.setAttribute(
      "href",
      "https://api.iconify.design/vscode-icons/file-type-js-official.svg"
    );

  if (title) title.style.display = "none";
  document.querySelector(".App-main").style.filter = "grayscale(1)";
  if (sideColumn) sideColumn.style.display = "none";

  var my = document.createElement("div");
  var closeAnswer = document.createElement("div");
  closeAnswer.style.display = my.style.display = "inline-block";
  closeAnswer.style.margin = my.style.margin = "40px";
  my.textContent = "JavaScript";
  closeAnswer.style.height = my.style.height = "60px";
  closeAnswer.style.width = my.style.width = "100px";
  closeAnswer.style.borderRadius = my.style.borderRadius = "12px";
  closeAnswer.style.position = my.style.position = "fixed";
  closeAnswer.style.textAlign = my.style.textAlign = "center";
  closeAnswer.style.lineHeight = my.style.lineHeight = "60px";
  closeAnswer.style.background = my.style.background = "white";
  closeAnswer.style.cursor = my.style.cursor = "pointer";
  closeAnswer.style.bottom = my.style.bottom = "0";
  my.style.right = "340px";
  my.addEventListener("click", function () {
    window.location.href = "https://www.zhihu.com/people/gu-yu-45-50";
  });
  document.body.appendChild(my);

  closeAnswer.textContent = "收起";
  closeAnswer.style.right = "480px";
  closeAnswer.addEventListener("click", function () {
    if (nowAnswer) {
      nowAnswer.querySelector(".ContentItem-rightButton").click();
    }
  });
  document.body.appendChild(closeAnswer);

  answerArea.addEventListener("mousemove", function (e) {
    var hoverEle = document.elementFromPoint(e.clientX, e.clientY);
    var parent = hoverEle.closest(".Card");
    nowAnswer = hoverEle.classList.contains("Card") ? hoverEle : parent;
  });

  answerArea.addEventListener("click", function (e) {
    // 观察DOM变化，把傻逼知乎的关键词搜索svg给去掉
    // 你tm搜还在知乎里搜，有个屁用
    // 用印象笔记保存还一堆狗屎svg占地方
    setTimeout(() => {
      const elements = nowAnswer.querySelectorAll(".RichContent-EntityWord");

      elements.forEach((element) => {
        element.parentElement.innerText = element.textContent;
      });
    }, 2000);
  });
})();
