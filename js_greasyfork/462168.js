// ==UserScript==
// @name         shuiliyunbo
// @namespace    http://tampermonkey.net/
// @version      0.1.11
// @description  该版本关闭所有弹窗
// @author       德比利
// @match        *://cms.slyb.top/*
// @match        *://cms.slyunbo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=slyb.top
// @grant        none
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/462168/shuiliyunbo.user.js
// @updateURL https://update.greasyfork.org/scripts/462168/shuiliyunbo.meta.js
// ==/UserScript==

(function () {
  "use strict";
  console.log("监控弹窗版脚本开始运行******************");
    const callback = function (mutationsList, ob) {
      for (let mutation of mutationsList) {
        if (
          mutation.type === "childList" &&
          mutation.target === document.body
        ) {
          console.log("有弹窗出现**************");
          const endedNode = mutation.addedNodes[0];
          if (endedNode && endedNode.classList.contains("layui-layer-dialog")) {
              if (
              endedNode
                .querySelector(".layui-layer-content")
                .lastChild.textContent.trim() ===
              "本节学习完成，请点击下一节课继续学习。"
            ) {
              console.log("视频页面有弹窗出现**************");
              const confirm = endedNode.querySelector("a");
              confirm.click();
              console.log("弹窗关闭了**************");
            }
          }
        }
      }
    };
    const targetNode = document.body;
    const observerOptions = {
      childList: true,
    };
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, observerOptions);

  setTimeout(() => {

    const vb = document.querySelector("#videobox");
    if (!vb) return;
    const ve = vb.querySelector("video");
    if (!ve) {
      console.log("没有监听到video标签******************");
      return;
    }
    console.log("监听到video标签");
    function pauseVideo() {
      console.log("视频暂停了******************");
      ve.play();
    }
    function endedVideo() {
      console.log("视频结束了******************");
    }
    // 视频结束
    ve.addEventListener("ended", endedVideo, false);
    // 视频暂停
    ve.addEventListener("pause", pauseVideo, false);
  }, 5000);
})();
