// ==UserScript==
// @name         PubMed Auto Load More Results
// @name:zh-CN   PubMed自动加载下一页
// @name:zh-TW   PubMed自動加載下一頁
// @namespace    Zhang
// @version      1.1
// @description  Automatically load more results when scrolling to the bottom of PubMed pages. 
// @description:zh-CN  滚动到PubMed页面底部时自动加载更多结果。
// @description:zh-TW  滾動到PubMed頁面底部時自動載入更多結果。
// @author       Zhang
// @match        https://*pubmed.ncbi.nlm.nih.gov/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465672/PubMed%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD%E4%B8%8B%E4%B8%80%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/465672/PubMed%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD%E4%B8%8B%E4%B8%80%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function isBottom() {
    let scrollHeight = document.documentElement.scrollHeight;
    let scrollTop = document.documentElement.scrollTop;
    let clientHeight = document.documentElement.clientHeight;
    return (scrollHeight - scrollTop - clientHeight) < 10;
  }

  function clickButton() {
    let button = document.querySelector("button.load-button");
    if (button && button.style.display !== "none") {
      button.click();
      observer.observe(document.body, {childList: true, subtree: true});
    }
  }

  let timer;

  function toggleTimer() {
    if (timer) {
      clearInterval(timer);
      timer = null;
      console.log("停止自动加载下一页");
    } else {
      timer = setInterval(function() {
        if (isBottom()) {
          clickButton();
        }
      }, 500);
      console.log("开始自动加载下一页");
    }
  }

  function addClickListener(link) {
    if (!link.hasAttribute("data-listener")) {
      link.addEventListener("click", function(event) {
        event.preventDefault();
        let url = link.href;
        GM_openInTab(url, true);
      });
      link.setAttribute("data-listener", "true");
    }
  }

  let observer = new MutationObserver(function(mutations) {
    for (let mutation of mutations) {
      if (mutation.type === "childList") {
        for (let node of mutation.addedNodes) {
          if (node.nodeType === 1 && node.classList.contains("docsum-content")) {
            let link = node.querySelector("a.docsum-title");
            if (link) {
              addClickListener(link);
            }
          }
        }
      }
    }
  });

  window.addEventListener("load", function() {
    toggleTimer();
    addClickListener();
  });
})();