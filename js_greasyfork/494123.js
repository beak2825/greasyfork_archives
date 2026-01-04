// ==UserScript==
// @name         优客在线
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  自用优客在线刷客脚本
// @author       Sheldon Lee
// @match        http://*/*
// @match        https://cce.org.uooconline.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/494123/%E4%BC%98%E5%AE%A2%E5%9C%A8%E7%BA%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/494123/%E4%BC%98%E5%AE%A2%E5%9C%A8%E7%BA%BF.meta.js
// ==/UserScript==

(function () {
  "use strict";
  var current = 0;
  var currentUncomplete = 0;
  var unfinishedVideoList;
  var bigUnfinishedList;

  async function myFunction() {
    // 打标
    markFuntion()
    // 当前播放
    current = 0;
    currentUncomplete = 0;
    unfinishedVideoList = await getUnfinishedVideo();
    bigUnfinishedList;
    var currentVideo;
    if (unfinishedVideoList.length === 0) {
      // 当前小章节没有课程的时候，获取当前页面的未完成的小章节
      var uncomplete = await getUnfinishedList();
      if (uncomplete.length > 0) {
        uncomplete[0].click();
        unfinishedVideoList = await getUnfinishedVideo();
      } else {
        bigUnfinishedList = getBigUnfinishedList();
        bigUnfinishedList[0].click();
        uncomplete = await getUnfinishedList();
        uncomplete[0].click();
        unfinishedVideoList = await getUnfinishedVideo();
      }
    }
    if (unfinishedVideoList[current]) {
      // 播放第一个视频
      unfinishedVideoList[current].click();
      currentVideo = document.querySelector("video");
      videoFn();
      removeMarkFuntion(unfinishedVideoList[current]);
    }

    addedned(currentVideo);
    var html = document.querySelector("html");
    // 添加鼠标移出事件
    html.addEventListener("mouseout", function () {
      // 视频相关
      videoFn()
    })
    html.addEventListener("visibilitychange", function () {
      // 视频相关
      videoFn()
    })
  }
  // 视频相关
  function videoFn () {
    var currentVideo = document.querySelector("video");
    currentVideo.setAttribute("muted", "muted");
    currentVideo.muted = true;
    currentVideo.autoplay = true;
    currentVideo.playsinline = true;
    currentVideo.playbackRate = 2;
    addedned(currentVideo);
    var playPromise = currentVideo.play();
    playPromise.then(() => {
    }).catch((error) => {
      currentVideo.play()
    });
  }

  // 添加onended事件
  function addedned(ele) {
    if (!ele) return;
    if (ele.onended) return;
    ele.onended = function () {
      current++;
      setTimeout(async () => {
        if (unfinishedVideoList[current]) {
          unfinishedVideoList[current].click();
          videoFn();
          return;
        }
        var uncomplete = await getUnfinishedList();
        if (uncomplete.length > 0) {
          currentUncomplete++;
          if (uncomplete[0]) {
            uncomplete[0].click();
            // 等得页面获取新的视频列表
            unfinishedVideoList = await getUnfinishedVideo();
            // 触发页面的点击事件
            unfinishedVideoList[0].click();
            videoFn();
          }
        } else {
          currentUncomplete = 0;
          bigUnfinishedList = getBigUnfinishedList();
          bigUnfinishedList[0].click();
          uncomplete = await getUnfinishedList();
          if (uncomplete[0]) {
            uncomplete[0].click();
            // 等得页面获取新的视频列表
            unfinishedVideoList = await getUnfinishedVideo();
            // 触发页面的点击事件
            unfinishedVideoList[0].click();
            videoFn();
          }

        }
      }, 300)
    };
  }

  // 获取未完成的列表
  function getUnfinishedList() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        var uncomplete = document.querySelectorAll('.basic.uncomplete');
        // 将大章节过滤掉
        var filtered = Array.prototype.filter.call(uncomplete, function (el) {
          return el.classList.length === 2;
        });
        resolve(filtered);
      }, 500);
    })
  }

  // 打标函数
  function markFuntion() {
    var _bigUnfinishedList = document.querySelectorAll(".basic.chapter.uncomplete");
    Array.prototype.forEach.call(_bigUnfinishedList, function(el) {
      // 打上标记
      el.classList.add('targetviacustom')
    })
  }

  // 去掉标记
  function removeMarkFuntion(currtentEl) {
    // 父级
    var parent = currtentEl.parentNode.parentNode.parentNode.parentNode
    parent.querySelector('.targetviacustom.uncomplete').classList.remove('targetviacustom')
  }

  function getBigUnfinishedList() {
    var _bigUnfinishedList = document.querySelectorAll(".targetviacustom.uncomplete");
    return _bigUnfinishedList;
  }
  // 获取未播放的视频
  function getUnfinishedVideo() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        var elements = document.querySelectorAll(".basic.ng-scope");
        var filtered = Array.prototype.filter.call(elements, function (el) {
          return el.classList.length === 2;
        });
        var currentVideoList = getCurrentVideoList();
        filtered = Array.from(filtered).concat(Array.from(currentVideoList));
        var elementsWithoutAfter = [];
        for (var i = 0; i < filtered.length; i++) {
          var style = window.getComputedStyle(filtered[i], "::after");
          var content = style.getPropertyValue("content");
          if (
            (!content || content === "none") &&
            filtered[i].innerText === " 视频"
          ) {
            elementsWithoutAfter.push(filtered[i]);
          }
        }
        resolve(elementsWithoutAfter);
      }, 2000);
    });
  }

  function getCurrentVideoList() {
    var _currentVideoList = document.querySelectorAll(".basic.ng-scope.active");
    return _currentVideoList;
  }
	setTimeout(myFunction, 3000);
})();
