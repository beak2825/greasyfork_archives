// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2024-05-28
// @description  刷课
// @author       You
// @match        https://basic.smartedu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496323/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/496323/New%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';
  function autoPlay() {
  setTimeout(() => {
    const video = $('video')[0];
    console.log("脚本开始执行~~~", video, $('video'));
    video.playbackRate = 16;
    video.muted = true;
    video.play();


    video.addEventListener("ended", function () {
      console.log("视频播放结束");
      setTimeout(() => {
        // 点击下一课

        // 获取当前激活高亮的课程的下一项
        const currentActiveItem = $(
          ".resource-item-active"
        );

        // 获取当前高亮课程的父级：专题
        const currentTopicItem = currentActiveItem.parent().parent().parent().parent().parent()
        console.log('currentTopicItem',currentTopicItem);
        const currentTopicText = currentTopicItem.find(
            ".fish-collapse-header"
          ).text();
        const currentLessonText =
          currentActiveItem.find("div").text();
        console.log(`已播放${currentTopicText}专题：${currentLessonText}`);
        const nextItem = currentActiveItem.next();
        if (nextItem.length) {
          nextItem.click();
          autoPlay()
        } else {
          // 说明已经是这个专题的最后一节课
          // 点击下一个专题
        //   debugger
          const nextTopicItem = currentTopicItem.next();
          nextTopicItem.find('.fish-collapse-header').click();
          // 点击下一个专题的第一节课

          setTimeout(() => {
            console.log('nextTopicItem',nextTopicItem);
            console.log('nextTopicItem.find(".resource-item:first")', nextTopicItem.find(".resource-item:first"));
            nextTopicItem.find(".resource-item:first").click();
            autoPlay()
          }, 3000)

        }
      }, 3000);
    });
  }, 10000);
}
document.addEventListener('visibilitychange',null)
autoPlay()
    // Your code here...
})();