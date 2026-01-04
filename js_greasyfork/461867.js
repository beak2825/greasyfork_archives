// ==UserScript==
// @name         河海大学学习平台-templateeight
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  河海大学学习平台自动下一集，和自动关闭半小时弹窗
// @author       德比利
// @match        *://*.webtrn.cn/learnspace/learn/learn/templateeight/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461867/%E6%B2%B3%E6%B5%B7%E5%A4%A7%E5%AD%A6%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0-templateeight.user.js
// @updateURL https://update.greasyfork.org/scripts/461867/%E6%B2%B3%E6%B5%B7%E5%A4%A7%E5%AD%A6%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0-templateeight.meta.js
// ==/UserScript==

(function () {
  setTimeout(() => {
      const callback = function (mutationsList, ob) {
      for (let mutation of mutationsList) {
        if (
          mutation.type === "childList" &&
          mutation.target === document.body
        ) {
          console.log("有弹窗出现**************");
          const endedNode = mutation.addedNodes[0];
                      console.log(endedNode);

          if (endedNode && endedNode.classList.contains("layui-layer-dialog")) {
            if (
              endedNode
                .querySelector(".layui-layer-content")
                .lastChild.textContent.trim() ===
              "亲，您已经学了30分钟了,点击“确定”继续学习。"
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
   const ve = document.querySelector("video");
  if (!ve) return;
  const incompleteList = parent.document.querySelectorAll(
    "div[completestate='0']"
  );
  const waitPlayVideos = Array.from(incompleteList).filter((v) => {
    return !v.classList.contains("s_pointerct");
  });
  // 获取当前视频的学习状态
  function nextVideo() {
    if (waitPlayVideos.length === 0) {
      alert("视频全部播放完毕");
      return;
    }
    console.log("%c%s", "color: green", "播放完毕，切换下一集");
    waitPlayVideos[0].click();
  }
    // 暂停判断
    function halfHourTip() {
      ve.play();
    }
    // 视频结束
    ve.addEventListener("ended", nextVideo, false);
    // 视频暂停
    ve.addEventListener("pause", halfHourTip, false);
  }, 10000);
})();
