// ==UserScript==
// @name           Bilibili自动点赞
// @name-en        Bilibili_Auto_Like
// @namespace      http://tampermonkey.net/
// @version        2.1
// @description    哔哩哔哩视频、番剧自动点赞
// @author         Howxcheng
// @match          *://*.bilibili.com/video/*
// @match          *://*.bilibili.com/bangumi/*
// @homepageURL    https://github.com/howxcheng/BiliBili_Auto_Like
// @supportURL     https://github.com/howxcheng/BiliBili_Auto_Like/issues
// @icon           https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://bilibili.com&size=16
// @license        MIT
// @run-at         document-start
// @grant          unsafeWindow
// @grant          GM_xmlhttpRequest
// @grant          GM_getResourceText
// @grant          GM_notification
// @grant          GM_openInTab
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/437147/Bilibili%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/437147/Bilibili%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.meta.js
// ==/UserScript==

(function () {
  "use strict";
  var WIDE_MODE_SWITCH = false; // 是否启用<自动宽屏模式>,true:开启,false:关闭
  var LIKE_TIME_OUT = 0; // 延迟点赞时间,单位:毫秒

  var originUrl = document.location.toString();
  var like_lock = false; // 点赞计时器锁
  var like_timer = null; // 点赞计时
  var like_count = 0; // 点赞失败计数器
  var wide_lock = false; // 宽屏计时器锁
  var wide_timer = null; // 宽屏计时器锁
  var wide_count = 0; // 宽屏失败计数器
  var main_timer = null;
  var main_lock = true;
  main_timer = setInterval(changeEvent, 1000);
  document.addEventListener("click", (_e) => {
    // console.log("监控到点击事件");
    setTimeout(() => {
      var currentUrl = document.location.toString();
      if (currentUrl !== originUrl) {
        // console.log("url不同，执行操作");
        if (!main_lock) {
          main_lock = true;
          main_timer = setInterval(changeEvent, 500);
        }
      }
    }, 500);
  });
  function changeEvent() {
    if (document.readyState === "complete") {
      // console.log("执行");
      if (!like_lock) {
        like_lock = true;
        // console.log("like锁定");
        like_count = 0;
        like_timer = setInterval(clickLike, 500);
      }
      if (WIDE_MODE_SWITCH && !wide_lock) {
        wide_lock = true;
        // console.log("wide锁定");
        wide_count = 0;
        wide_timer = setInterval(setWideMode, 500);
      }
      clearInterval(main_timer);
      originUrl = document.location.toString();
      // console.log("timer解锁");
      main_lock = false;
    }
  }
  // 自动宽屏模式
  function setWideMode() {
    wide_count++;
    var _set_wide_mode_button = document.querySelector('div[class="bpx-player-ctrl-btn bpx-player-ctrl-wide"]');
    if (_set_wide_mode_button !== null) {
      try {
        _set_wide_mode_button.click();
      } catch (error) {
        // console.log(error);
      }
      // console.log("非宽屏，切换宽屏,次数：" + wide_count);
      wide_count = 64;
    }
    if (document.querySelector('div[class="bpx-player-ctrl-btn bpx-player-ctrl-wide bpx-state-entered"]') !== null) {
      // console.log("宽屏，跳过,次数：" + wide_count);
      wide_count = 64;
    }
    if (wide_count <= 60) return;
    // console.log("wide解锁");
    clearInterval(wide_timer);
    goToSuitable();
    wide_lock = false;
  }
  // 滚动至合适位置
  function goToSuitable() {
    setTimeout(function () {
      window.scrollTo({
        top: 92,
        behavior: "smooth",
      });
    }, 1000);
  }
  // 点赞
  function clickLike() {
    like_count++;
    var _like_button = document.querySelector("div[class='video-like video-toolbar-left-item']");
    if (_like_button !== null) {
      try {
        // // console.log("正在点赞");
        new Promise((resolve) =>
          setTimeout(() => {
            _like_button.click();
            Toast("已自动点赞", 3000);
          }, LIKE_TIME_OUT)
        );
      } catch (error) {
        // console.log(error);
      }
      // console.log("未点赞，正在点赞,次数：" + like_count);
      like_count = 64;
    }
    if (document.querySelector("div[class='video-like video-toolbar-left-item on']") !== null) {
      // console.log("已点赞,次数：" + like_count);
      like_count = 64;
    }
    if (like_count <= 60) return;
    // console.log("like解锁");
    clearInterval(like_timer);
    like_lock = false;
  }
  //界面toast提示
  function Toast(msg, duration) {
    duration = isNaN(duration) ? 3000 : duration;
    var m = document.createElement("div");
    m.innerHTML = msg;
    m.style.cssText =
      "font-family:siyuan;max-width:60%;min-width: 150px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 10%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
    document.body.appendChild(m);
    setTimeout(function () {
      var d = 0.5;
      m.style.webkitTransition = "-webkit-transform " + d + "s ease-in, opacity " + d + "s ease-in";
      m.style.opacity = "0";
      setTimeout(function () {
        document.body.removeChild(m);
      }, d * 1000);
    }, duration);
  }
})();
