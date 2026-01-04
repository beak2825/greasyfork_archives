// ==UserScript==
// @name         知乎阅读模式
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  知乎回答详情页和盐选阅读页点击阅读模式，享受完美阅读体验
// @author       longjie
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @license MIT

// @grant               none
// @run-at              document-end
// @include             *.zhihu.com/*
// @downloadURL https://update.greasyfork.org/scripts/462385/%E7%9F%A5%E4%B9%8E%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/462385/%E7%9F%A5%E4%B9%8E%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function () {
  'use strict';

  if (window.location.href.indexOf("zhihu.com/market") > -1 || window.location.href.indexOf("zhihu.com/question") > -1) {
    var styleBtn = document.createElement("button");
    styleBtn.id = "styleBtn";
    styleBtn.innerHTML = "阅读模式";
    styleBtn.onclick = function () {
      styleBtn.style = "display:none;"
      changeStyle()
    }
    styleBtn.style = "position: fixed;width:80px;height:40px;top:0;left:0;z-index:999;background:#666;color:#fff;"
    document.body.append(styleBtn);
  }

  function changeStyle() {
    document.getElementsByTagName("body")[0].style = "background-color:#DCE2F1";
    // 专栏优化 market
    if (window.location.href.indexOf("zhihu.com/market") > -1) {
      var btmToolBar = document.getElementById("bottomToolBar");
      btmToolBar.style = "display:none";

      var topToolBar = document.getElementsByClassName("ShelfTopNav-root-eb3BX");
      topToolBar[0].style = "display:none";

      try {
        document.getElementsByClassName("WebPage-shareArea-kjPRL")[0].style = "display:none";
      } catch (error) {
      }

      var manuscript = document.getElementById("manuscript");
      manuscript.style = "font-size: 2rem;";

      document.getElementsByClassName("WebPage-root-g7WXc")[0].style = "background-color:#DCE2F1";
    }
    // 问答优化  question
    if (window.location.href.indexOf("zhihu.com/question") > -1) {
      // ContentItem-actions 底部tool
      document.getElementsByClassName("ContentItem-actions")[0].style = "display:none";
      // AppHeader 顶部导航
      document.getElementsByClassName("AppHeader")[0].style = "display:none";
      // 回答宽度100%
      document.getElementsByClassName("Question-main")[0].style = "width: 100%";
      document.getElementsByClassName("ListShortcut")[0].style = "width: 100%";
      document.getElementsByClassName("Question-mainColumn")[0].style = "width: 100%";

      // 边栏
      document.getElementsByClassName("Question-sideColumn")[0].remove();

      // RichContent RichContent--unescapable 增加类
      document.getElementsByClassName("RichContent")[0].style = "font-size: 2rem;";

      document.getElementsByClassName("AnswerCard")[0].style = "background-color:#DCE2F1";

      // 更多回答
      document.getElementsByClassName("MoreAnswers")[0].style = "display:none";

      // 问题
      document.getElementsByClassName("QuestionHeader")[0].style = "display:none";

      var viewAll = document.getElementsByClassName("ViewAll")
      for (let element of viewAll) {
        element.style = "display:none";
      }
    }
  }

})();