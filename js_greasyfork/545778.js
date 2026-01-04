// ==UserScript==
// @name         知乎问题标题隐藏
// @namespace    http://zhihu.com
// @version      1.0
// @description  添加隐藏/显示问题按钮以切换问题的显示情况
// @author       View12138
// @match        https://*.zhihu.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545778/%E7%9F%A5%E4%B9%8E%E9%97%AE%E9%A2%98%E6%A0%87%E9%A2%98%E9%9A%90%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/545778/%E7%9F%A5%E4%B9%8E%E9%97%AE%E9%A2%98%E6%A0%87%E9%A2%98%E9%9A%90%E8%97%8F.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function onPageLoad() {
    let hiddenButton = document.createElement("button");
    hiddenButton.className = "Button FollowButton Button--primary Button--blue";
    hiddenButton.innerHTML = "隐藏问题";
    hiddenButton.type = "button";
    hiddenButton.onclick = (e) => onHiddenButtonClick(e.currentTarget);

    let buttonGroups = document.getElementsByClassName("QuestionButtonGroup");
    if (buttonGroups.length <= 0) {
      return;
    }
    buttonGroups[0].insertBefore(hiddenButton, buttonGroups[0].firstChild);
    onHiddenButtonClick(hiddenButton);
  }

  function onHiddenButtonClick(hiddenButton) {
    let title = document.getElementsByClassName("QuestionHeader-title")[0];
    let headTitle = document.querySelector("head > title");
    if (hiddenButton.innerHTML === "隐藏问题") {
      hiddenButton.innerHTML = "显示问题";
      title.style.display = "none";
      headTitle.innerHTML = "知乎 - 隐藏问题";
    } else {
      hiddenButton.innerHTML = "隐藏问题";
      title.style.display = "block";
      headTitle.innerHTML = title.innerHTML;
    }
  }

  if (document.readyState === "complete") {
    onPageLoad();
  } else {
    window.addEventListener("load", onPageLoad, false);
  }
})();
