// ==UserScript==
// @name         南京智慧人社继续教育系统在线辅助-自动播放
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  南京专技人员继续教育平台、继续教育专业课学习平台(公需课)，自动播放课程列表，自动跳过弹窗。截至目前2023年6月，插件可用
// @author       Znonymous
// @match        https://m.mynj.cn:11188/*
// @match        https://jxjy.mynj.cn:8283/*
// @match        http://180.101.236.114:8283/*
// @run-at       document-end
// @grant        GM_notification
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447451/%E5%8D%97%E4%BA%AC%E6%99%BA%E6%85%A7%E4%BA%BA%E7%A4%BE%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%B3%BB%E7%BB%9F%E5%9C%A8%E7%BA%BF%E8%BE%85%E5%8A%A9-%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/447451/%E5%8D%97%E4%BA%AC%E6%99%BA%E6%85%A7%E4%BA%BA%E7%A4%BE%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%B3%BB%E7%BB%9F%E5%9C%A8%E7%BA%BF%E8%BE%85%E5%8A%A9-%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function () {
  function playVideo() {
    if (document.querySelector("video")) {
      console.log("检查是否有视频");
      let player = document.querySelector("video")
      if (player.paused) {
        console.log("检查是否暂停");
        player.play();
      }
    }
  }

  // function setPlayerPercent(percent) {
  //   if (document.querySelector("video")) {
  //     let player = document.querySelector("video")
  //     player.currentTime = player.duration*percent/100
  //   }
  // }

  function startLearning() {
    let url = location.href;

    if (url.includes("https://m.mynj.cn:11188/zxpx/tec/play/player") || url.includes("http://180.101.236.114:8283/rsrczxpx/tec/play/player") || url.includes("https://jxjy.mynj.cn:8283/rsrczxpx/tec/play/player")) {
      // 视频是否暂停
      playVideo()
      // 消除中间播放的弹窗
      let messageDialog = document.querySelector('.dialog-button a')
      if (messageDialog) {
        console.log("有弹窗，点击")
        messageDialog.click()
        setTimeout(() => {
          console.log("弹窗后，播放视频")
          playVideo()
        }, 2000)
      }

      let learnpercent = document.querySelector(".learnpercent span span").textContent
      if (learnpercent === "已完成") {
        console.log("完成课程")
        const unfinishedDom = Array.prototype.slice.call(document.querySelectorAll('.ztree a.level0'))
          .filter(function (el) {
            return el.innerText.includes('未开始') || el.innerText.includes('未完成')
          })[0]
        if (unfinishedDom) {
          unfinishedDom.click()
        } else {
          GM_notification({
            title: "课程已经完成",
            text: "已经完成，请返回页面确认",
            highlight: true,
          })
        }
      } else {
        if (!document.querySelector("video")) {
          console.log("没有视频了，还没看完")
          GM_notification({
            title: "没有视频了，还没看完",
            text: "请返回页面重新拖动进度条",
          })
        }
      }
    }
  }
  let myTimer = setInterval(startLearning, 3000);
})()
