// ==UserScript==
// @name         山东省教师教育网2025中小学远程研修（全自动学习，修复继续学习点击问题）
// @namespace    http://tampermonkey.net/
// @version      3.2
// @author       colin
// @description  自动学习山东省教师教育网课程，支持自动点击课程、自动播放视频、自动答题、完成后自动关闭
// @match        *://www.qlteacher.com/
// @match        *://yxjc.qlteacher.com/project/2025cqyx/*
// @match        *://yxjc.qlteacher.com/project/2025cqyx/lesson/learn
// @match        *://player.qlteacher.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qlteacher.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546934/%E5%B1%B1%E4%B8%9C%E7%9C%81%E6%95%99%E5%B8%88%E6%95%99%E8%82%B2%E7%BD%912025%E4%B8%AD%E5%B0%8F%E5%AD%A6%E8%BF%9C%E7%A8%8B%E7%A0%94%E4%BF%AE%EF%BC%88%E5%85%A8%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%EF%BC%8C%E4%BF%AE%E5%A4%8D%E7%BB%A7%E7%BB%AD%E5%AD%A6%E4%B9%A0%E7%82%B9%E5%87%BB%E9%97%AE%E9%A2%98%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/546934/%E5%B1%B1%E4%B8%9C%E7%9C%81%E6%95%99%E5%B8%88%E6%95%99%E8%82%B2%E7%BD%912025%E4%B8%AD%E5%B0%8F%E5%AD%A6%E8%BF%9C%E7%A8%8B%E7%A0%94%E4%BF%AE%EF%BC%88%E5%85%A8%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%EF%BC%8C%E4%BF%AE%E5%A4%8D%E7%BB%A7%E7%BB%AD%E5%AD%A6%E4%B9%A0%E7%82%B9%E5%87%BB%E9%97%AE%E9%A2%98%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

// 屏蔽后台检测
Object.defineProperty(document, "hidden", {value: false});
Object.defineProperty(document, "visibilityState", {value: "visible"});

// 阻止事件触发
document.addEventListener("visibilitychange", (e) => {
  e.stopImmediatePropagation();
}, true);


  let currentButtonIndex = -1;
  let clickedButtons = new Set();

  // 课程目录页自动点击逻辑
  function coursesPage() {
    if (document.URL.includes('yxjc.qlteacher.com/project/')) {
      if (!document.hidden) {
        var buttons = document.querySelectorAll("button");

        // 先找“继续学习”
        for (let i = 0; i < buttons.length; i++) {
          if (clickedButtons.has(i)) continue;
          let text = buttons[i].innerText.trim();
          if (text === "继续学习") {
            currentButtonIndex = i;
            clickedButtons.add(i);
            buttons[i].click();
            console.log("点击了索引为", i, "的【继续学习】按钮");
            return;
          }
        }

        // 再找“开始学习”
        for (let i = 0; i < buttons.length; i++) {
          let text = buttons[i].innerText.trim();
          if (text === "开始学习") {
            buttons[i].click();
            console.log("点击了索引为", i, "的【开始学习】按钮");
            return;
          }
        }

        console.log("没有找到可点击的按钮，重置状态");
        currentButtonIndex = -1;
        clickedButtons.clear();
      }
    }
  }
  setInterval(coursesPage, 3000);

  // 课程学习页面逻辑
  function coursePage() {
    var patt = /^https:\/\/player\.qlteacher\.com\/learning\/.*$/;
    if (patt.test(document.URL)) {
      var buttons = document.getElementsByTagName("button");
      const progressElement = document.querySelector('span.d-inline-block.mt-xs.ft-16.text-primary');
      if (progressElement && progressElement.textContent.trim() === '100%') {
            window.history.back();
      }
      for (var i = 0; i < buttons.length; i++) {
        let text = buttons[i].innerText.trim();
        if (text === "继续学习" || text === "开始学习") {
          buttons[i].click();
        }
        if (text === "已完成学习") {
          window.close();
        }
      }
    }
  }
  window.onload = function () {
    setInterval(coursePage, 1000);
  };

  // 播放视频、答题逻辑
  function play() {
    var patt = /^https:\/\/player\.qlteacher\.com\/learning\/.*$/;
    if (patt.test(document.URL)) {

      // 标准化测试
      if (document.querySelector(".mt-32.ft-16") &&
          document.querySelector(".mt-32.ft-16").innerText.includes('标准化测试')) {
        var tests = document.getElementsByClassName("mb-16 ng-star-inserted");
        for (var t = 0; t < tests.length; t++) {
          tests[t].querySelectorAll("label")[0].click();
        }
        var buttons = document.querySelectorAll("button");
        buttons.forEach(btn => {
          if (btn.innerText.trim() === "提交") btn.click();
          if (btn.innerText.trim() === "确定") btn.click();
        });
        if (document.querySelector('.count-down.ng-star-inserted')?.innerText === "已完成") {
          window.close();
        }
      }

      // 多选题
      else if (document.getElementsByClassName("ant-checkbox").length > 0) {
        var items1 = document.getElementsByClassName("ant-checkbox");
        var cnt = 0;
        for (var i = 0; i < items1.length; i++) {
          if (Math.random() > 0.5) {
            cnt++;
            items1[i].click();
          }
        }
        if (cnt > 0) {
          document.querySelector(".ant-btn.radius-4.px-lg.py0.ant-btn-primary").click();
        }
      }

      // 单选题
      else if (document.getElementsByClassName("ant-radio-input").length > 0) {
        var options = document.getElementsByClassName("ant-radio-input");
        var randomIndex = Math.floor(Math.random() * options.length);
        options[randomIndex].click();
        document.querySelector(".ant-btn.radius-4.px-lg.py0.ant-btn-primary").click();
      }

      // 视频播放
      else if (document.querySelector("video") && document.querySelector("video").paused) {
        let video = document.querySelector("video");
        video.muted = true;
        video.play();
        //video.playbackRate = 2; // 如果想加快播放速度，可以改这里
      }

      // 如果完成，则退出
      if (document.querySelector('.count-down.ng-star-inserted')?.innerText === "已完成") {
         window.history.back(); // 返回上一页
      }
    }
  }
  setInterval(play, 1000);

})();
