// ==UserScript==
// @name         Tapd Story详情复制
// @namespace    https://github.com/PRC-Cc/Tampermonkey.git
// @version      0.2
// @description  Story 详情页面标题后添加复制按钮，用于复制精简srotyId
// @author       Cache
// @match        https://www.tapd.cn/*/stories/view*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406864/Tapd%20Story%E8%AF%A6%E6%83%85%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/406864/Tapd%20Story%E8%AF%A6%E6%83%85%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function () {
  "use strict";

  var STATUS_COLOR_MAP = {
    NORMAL: "#bfbfbf",
    HOVER: "#8a8a8a",
    SUCCESS: "#1296db",
    FAIL: "#d81e06",
  };

  window.onload = function () {
    var storyId = location.href.replace(/.*view\/([^#?]*)([?#]?).*/, "$1").slice(-7);
    document.querySelector("#locateForStoryInfo");

    var followEle = document.querySelector(".subject-title__follow");

    var containerEle = document.createElement("div");
    var copyEle = document.createElement("span");
    copyEle.innerText = "复制";
    var inputEle = document.createElement("input");

    copyEle.style.fontSize = "14px";
    copyEle.style.color = STATUS_COLOR_MAP.NORMAL;
    copyEle.style.fontWeight = "500";
    copyEle.style.padding = "10px";

    containerEle.style.display = "inline-block";

    inputEle.style.width = "1px";
    inputEle.style.opacity = 0;
    inputEle.style.border = "none";

    inputEle.value = storyId;

    containerEle.appendChild(copyEle);
    containerEle.appendChild(inputEle);

    copyEle.addEventListener("mouseenter", function () {
      copyEle.style.color = STATUS_COLOR_MAP.HOVER;
      if (copyEle.innerText !== "复制") {
        copyEle.innerText = "复制";
      }
    });
    copyEle.addEventListener("mouseleave", function () {
      copyEle.style.color = STATUS_COLOR_MAP.NORMAL;
      if (copyEle.innerText !== "复制") {
        copyEle.innerText = "复制";
      }
    });

    copyEle.addEventListener("click", function (e) {
      e.stopPropagation();
      inputEle.select();
      var copyResult = document.execCommand("Copy");
      if (!copyResult) {
        copyResult = window.clipboardData.setData("text", storyId);
      }
      if (copyResult) {
        copyEle.style.color = STATUS_COLOR_MAP.SUCCESS;
        copyEle.innerText = "已复制";
      } else {
        copyEle.style.color = STATUS_COLOR_MAP.FAIL;
        copyEle.innerText = "复制失败";
      }
    });

    followEle.prepend(containerEle);
  };
})();
