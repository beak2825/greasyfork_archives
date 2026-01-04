// ==UserScript==
// @name         Youtube视频纯净
// @namespace    http://tampermonkey.net/
// @version      2025-11-16-3
// @description  隐藏 Youtube 常规视频、shorts 视频框里面多余元素，不仅可以消除还能还原。有助于你进行视频录制 :)
// @author       Sonder
// @match        https://www.youtube.com/watch?v=*
// @match        https://www.youtube.com/shorts/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520320/Youtube%E8%A7%86%E9%A2%91%E7%BA%AF%E5%87%80.user.js
// @updateURL https://update.greasyfork.org/scripts/520320/Youtube%E8%A7%86%E9%A2%91%E7%BA%AF%E5%87%80.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let hiddenElements = []; // 用于存储隐藏的元素，以便还原

  // 工具函数：隐藏一组元素，并记录它们
  function hideElements(selectors) {
    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(element => {
        if (element.style.display !== "none") {
          hiddenElements.push(element);
          element.style.display = "none";
        }
      });
    });
  }

  // 工具函数：恢复隐藏的元素
  function restoreElements() {
    hiddenElements.forEach(element => {
      element.style.display = "";
    });
    hiddenElements = [];
  }

  // 工具函数：创建按钮
  function createButton(text, onClickCallback, id) {
    let button = document.createElement("button");
    button.textContent = text;
    button.addEventListener("click", onClickCallback);
    button.id = id;
    return button;
  }

  // 主逻辑
  setTimeout(() => {
    // 处理常规视频页面
    let ownerElement = document.getElementById("owner");
    if (ownerElement) {
      let videoButton = createButton(
        "视频纯净",
        function () {
          hideElements([
            ".ytp-player-content",
            ".ytp-overlays-container",
            ".ytp-fullscreen-grid-buttons-container",
            ".ytp-ce-element",
            ".ytp-chrome-bottom",
            ".ytp-gradient-bottom",
            ".ytp-bezel",
            ".ytp-chrome-top",
            ".ytp-gradient-top"
          ]);
        },
        "cleanButton"
      );

      let restoreButton = createButton(
        "还原",
        function () {
          restoreElements();
        },
        "restoreButton"
      );

      ownerElement.appendChild(videoButton);
      ownerElement.appendChild(restoreButton);
    }

    // 处理短视频页面
    let experimentOverlayElement = document.getElementById("shorts-container");
    if (experimentOverlayElement) {
      let shortsButton = createButton(
        "视频纯净",
        function () {
          hideElements([
            ".metadata-container",
            ".action-container",
            ".player-controls",
            "#scrubber.style-scope.ytd-reel-video-renderer",
            ".ytp-caption-window-container",
            ".ytp-bezel",
            ".ytp-caption-window-container"
          ]);

          // 如果有 .scrubber 类的元素，设置其 display 为 none
          let scrubberElement = document.querySelector(".scrubber");
          if (scrubberElement) {
            scrubberElement.style.display = "none";
          }
        },
        "cleanButtonShorts"
      );

      let restoreButtonShorts = createButton(
        "还原",
        function () {
          restoreElements();
        },
        "restoreButtonShorts"
      );

      // 设置按钮的样式
      shortsButton.style.position = "fixed";
      shortsButton.style.top = "550px";
      shortsButton.style.right = "10px";
      shortsButton.style.zIndex = "9999";

      restoreButtonShorts.style.position = "fixed";
      restoreButtonShorts.style.top = "600px";
      restoreButtonShorts.style.right = "10px";
      restoreButtonShorts.style.zIndex = "9999";

      experimentOverlayElement.appendChild(shortsButton);
      experimentOverlayElement.appendChild(restoreButtonShorts);
    }

    // 复制章节名称
    let titleElements = document.querySelectorAll(
      ".macro-markers.ytd-macro-markers-list-item-renderer"
    );
    // 为每个元素添加点击事件监听器
    titleElements.forEach(element => {
      element.addEventListener("click", function () {
        // 创建一个临时 textarea 元素来复制文本
        const tempTextarea = document.createElement("textarea");
        tempTextarea.value = this.textContent || this.innerText;
        document.body.appendChild(tempTextarea);

        // 选中文本并复制
        tempTextarea.select();
        document.execCommand("copy");

        // 移除临时元素
        document.body.removeChild(tempTextarea);

        // 可选：显示复制成功的提示
        console.log("已复制: " + tempTextarea.value);
        // 或者使用更友好的提示方式，如 Toast 通知
      });

      // 可选：添加鼠标悬停样式提示
      element.title = "点击复制";
    });
  }, 1500);
})();
