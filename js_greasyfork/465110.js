// ==UserScript==
// @name         Psypost Control Buttons
// @namespace    binjie09-psypost-control-buttons
// @version      1
// @description  Add buttons to control the page id in Psypost article list page URL by 1, using class 'jeg_block_loadmore' div as anchor element.
// @author       Binjie
// @match        https://www.psypost.org/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/465110/Psypost%20Control%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/465110/Psypost%20Control%20Buttons.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 获取目标元素
  var targetDiv = document.querySelector(".jeg_block_loadmore");

  if (targetDiv) {
    // 动态创建按钮
    var prevBtn = document.createElement("button");
    var nextBtn = document.createElement("button");
    prevBtn.innerHTML = "Prev";
    nextBtn.innerHTML = "Next";

    // 监听按钮点击事件
    prevBtn.addEventListener("click", function() {
      updatePageId(-1);
    });

    nextBtn.addEventListener("click", function() {
      updatePageId(1);
    });

    // 将按钮添加到目标元素中
    targetDiv.appendChild(prevBtn);
    targetDiv.appendChild(nextBtn);

    /**
     * 更新 URL 中的 page id
     * @param {Number} increment 增加的数量（负数表示减少）
     */
    function updatePageId(increment) {
      var currentPageId = getCurrentPageId();
      if (currentPageId !== null) {
        var newPageId = currentPageId + increment;
        if (newPageId >= 1) {
          var currentUrl = window.location.href;
          var regex = /page\/\d+/;
          var newUrl = currentUrl.replace(regex, "page/" + newPageId);
          window.location.href = newUrl;
        }
      }
    }

    /**
     * 从当前 URL 中提取出 page id
     */
    function getCurrentPageId() {
      var currentUrl = window.location.href;
      var regex = /page\/(\d+)/;
      var match = currentUrl.match(regex);
      if (match !== null) {
        return parseInt(match[1]);
      } else {
        return null;
      }
    }
  }
})();
