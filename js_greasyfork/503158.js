// ==UserScript==
// @name         yc-抖音PC端识别跳转代码
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  抖音PC端识别跳转代码
// @author       wcbblll
// @match        https://www.douyin.com/*
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503158/yc-%E6%8A%96%E9%9F%B3PC%E7%AB%AF%E8%AF%86%E5%88%AB%E8%B7%B3%E8%BD%AC%E4%BB%A3%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/503158/yc-%E6%8A%96%E9%9F%B3PC%E7%AB%AF%E8%AF%86%E5%88%AB%E8%B7%B3%E8%BD%AC%E4%BB%A3%E7%A0%81.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function loopFunc(fn) {
    function callback(mutationsList, observer) {
      if (lastExecutionTime + delay < Date.now()) {
        fn(mutationsList, observer)
        lastExecutionTime = Date.now();
      }
    }

    let observer = new MutationObserver(callback);

    let delay = 500; // 间隔时间，单位毫秒
    let lastExecutionTime = 0;

    observer.observe(document.body, { childList: true, attributes: true, subtree: true });
  }


  loopFunc(() => {
    setVideoTime()
  })

  // 获取页面中面积最大的video
  function getMaxAreaVideo() {
    const videos = document.querySelectorAll("video");
    for (let i = 0; i < videos.length; i++) {
      const video = videos[i];
      const rect = video.getBoundingClientRect();
      if (rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)) return video
    }

    return null;
  }


  function matchTimeStr(timeStr, offset) {
    const regex =
      /\b((?:(?:[01]?\d|2[0-3]):[0-5]\d:[0-5]\d)|(?:(?:[01]?\d|2[0-3]):[0-5]\d)|(?:[1-9]|1[0-2]):[0-5]\d\s*(?:AM|PM))\b/g;
    const matches = timeStr.matchAll(regex);
    for (const match of matches) {
      const index = match["index"];
      match.lastIndex = index + match[0].length;
      if (offset >= index && offset < match.lastIndex) {
        return match[0]
      }
    }
    return null;
  }


  function timeToSeconds(timeStr) {
    const parts = timeStr.split(":").map(Number);
    if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    } else if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    return 0;
  }

  // 跳转代码0:24 00:28 1:34 00:2:35
  // 遍历节点，非文本节点不处理，匹配文本节点中的时间字符串，使用timeToSeconds处理，并添加点击事件
  function setVideoTime() {
    // 评论区
    // const comments = document.querySelectorAll("span[class='sU2yAQQU']");
    const commentBody = document.querySelector('#merge-all-comment-container:not([addListener])');
    if (!commentBody) return
    commentBody.setAttribute('addListener', true)
    commentBody.addEventListener('click', (e) => {
      console.log('执行');
      const targetNode = e.target
      if (targetNode.nodeName !== 'SPAN') return
      let range;
      let textNode;
      let offset;

      if (document.caretPositionFromPoint) {
        range = document.caretPositionFromPoint(e.clientX, e.clientY);
        textNode = range.offsetNode;
        offset = range.offset;
      } else if (document.caretRangeFromPoint) {
        // 使用 WebKit 专有回退方法
        range = document.caretRangeFromPoint(e.clientX, e.clientY);
        textNode = range.startContainer;
        offset = range.startOffset;
      } else {
        // 两个方法都不支持，什么都不做
        return;
      }
      const match = matchTimeStr(targetNode.innerText, offset)
      if (!match) return
      const currentTime = timeToSeconds(match)
      const video = getMaxAreaVideo()
      if (!video) return
      if (video.duration >= currentTime) {
        video.currentTime = currentTime
      }
    })
  }
})();
