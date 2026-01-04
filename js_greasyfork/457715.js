// ==UserScript==
// @name         芳姐特供 2023寒假研修
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Special for you 
// @license      CC BY-NC-SA
// @match        https://*.zxx.edu.cn/*
// @match        https://*.smartedu.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457715/%E8%8A%B3%E5%A7%90%E7%89%B9%E4%BE%9B%202023%E5%AF%92%E5%81%87%E7%A0%94%E4%BF%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/457715/%E8%8A%B3%E5%A7%90%E7%89%B9%E4%BE%9B%202023%E5%AF%92%E5%81%87%E7%A0%94%E4%BF%AE.meta.js
// ==/UserScript==

(function () {
  "use strict";
  // function
  const sleep = async (time) => {
    var p = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, time);
    });
    return p;
  };

  console.log("刷课脚本开始运行");
  var groups = document.getElementsByClassName("fish-collapse-header");
  var resItems = document.getElementsByClassName("resource-item");
  const getVideoAndPlay = async (groupNo, resNo) => {
    await sleep(4000);
    console.log(666, `开始观看: 第${resNo + 1}个视频，第${groupNo + 1}/${groups.length}组`);

    var vid = document.getElementsByTagName("video")[0];
    vid.muted = true;
    vid.play();
    document.querySelector("video").playbackRate = 16;

    vid.addEventListener(
      "ended",
      async () => {
        //计算下一个视频的位置
        if (resNo + 1 == resItems.length) {
          //看完了当前组
          if (groupNo + 1 == groups.length) {
            console.log(666, "看完了所有组, 退出");
          } else {
            //观看下一组
            console.log(666, `点击下一组的第一个视频`);
            groups[groupNo + 1].click();
            await sleep(1000);
            resItems = document.getElementsByClassName("resource-item");
            resItems[resNo + 1].click();
            getVideoAndPlay(groupNo + 1, resNo + 1);
          }
        } else {
          //观看当前组的下一个视频
          resItems[resNo + 1].click();
          console.log(666, `点击当前组的下一个视频`);
          getVideoAndPlay(groupNo, resNo + 1);
        }
      },
      false
    );

    vid.addEventListener("pause", async () => {
      await sleep(1000);
      var options = document.getElementsByClassName("nqti-option");
      while (options.length) {
        options[0].click();
        console.log(666, "click options done.");
        await sleep(1000);
        document.getElementsByClassName("fish-btn")[1].click();
        await sleep(1000);
        options = document.getElementsByClassName("nqti-option");
      }
    });
  };
  getVideoAndPlay(0, 0);
})();
