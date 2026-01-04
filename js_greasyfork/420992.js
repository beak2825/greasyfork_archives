// ==UserScript==
// @name         Tapd 详情复制 ：id+title (转载修改)
// @namespace    https://github.com/PRC-Cc/Tampermonkey.git
// @version      0.21
// @description  Story 详情页面标题后添加复制按钮，用于复制精简srotyId
// @author       Cache
// @match        https://www.tapd.cn/*/stories/view*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420992/Tapd%20%E8%AF%A6%E6%83%85%E5%A4%8D%E5%88%B6%20%EF%BC%9Aid%2Btitle%20%28%E8%BD%AC%E8%BD%BD%E4%BF%AE%E6%94%B9%29.user.js
// @updateURL https://update.greasyfork.org/scripts/420992/Tapd%20%E8%AF%A6%E6%83%85%E5%A4%8D%E5%88%B6%20%EF%BC%9Aid%2Btitle%20%28%E8%BD%AC%E8%BD%BD%E4%BF%AE%E6%94%B9%29.meta.js
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
    var story_id = document.querySelectorAll('.story-title  .story-title-id')[0].innerHTML;
    var story_title = document.querySelectorAll('.story-title  .editable-value')[0].innerHTML;
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
    inputEle.style.opacity = 0.9;
    inputEle.style.border = "none";
    // 复制tapd ID
    //inputEle.value = storyId;
    // 复制tapd ID+title
      inputEle.value = story_id+story_title;

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
