// ==UserScript==
// @name         智慧教育平台自动刷课助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  智能调速的自动刷课工具
// @author       Your Name
// @match        https://basic.smartedu.cn/*
// @grant        unsafeWindow
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545625/%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/545625/%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
   // 全局变量定义
  var videoList = []; // 视频列表
  var currentIndex = 0; // 当前播放索引
  var Rate = 1; // 播放速度
  var Duration = 100; // 监控时间窗口
  var popUpWindowNum = new Array(Duration).fill(0); // 弹窗计数器
  var config = {
    debug: true, // 调试模式
  };

  if (config.debug) {
    var iframe = document.createElement("iframe");
    iframe.style.display = "none"; // 隐藏
    document.body.appendChild(iframe); // 添加
    var _console = iframe.contentWindow.console; // new console
    _console.log("进入");
  }

  // 日志输出函数
  function log(message) {
    if (config.debug) {
      console.log("[自动刷课] " + message);
    }
  }

  // 初始化视频列表
  function initVideoList() {
    var monitor = window.setInterval(function () {
      if (
        $(".index-module_resources_jGppa .resource-item.resource-item-train")
          .length > 0
      ) {
        // 先展开所有目录
        $(".fish-collapse-header").each(function () {
          if (!$(this).parent().hasClass("fish-collapse-item-active")) {
            $(this).click();
          }
        });

        // 获取视频列表
        videoList = $(
          ".index-module_resources_jGppa .resource-item.resource-item-train"
        ).toArray();
        log("找到 " + videoList.length + " 个视频");

        window.clearInterval(monitor);
        startMonitor();
      }
    }, 1000);
  }

  // 查找当前播放视频的索引
  function findCurrentIndex() {
    // 使用 jQuery 查找带有 active 类的视频元素
    var activeVideo = $(
      ".resource-item.resource-item-train.resource-item-active"
    );
    if (activeVideo.length > 0) {
      return $(".resource-item.resource-item-train").index(activeVideo);
    }
    return -1;
  }

  // 处理视频播放
  function handleVideo() {
    var video = $("video.vjs-tech")[0];
    if (!video) return;

    // 设置视频播放属性
    video.playbackRate = Rate;
    video.autoplay = true;
    video.muted = true;

    // 添加播放结束检测
    $(video)
      .off("ended")
      .on("ended", function () {
        log("视频播放完成");
        playNext();
      });

    // 添加时间更新检测
    $(video)
      .off("timeupdate")
      .on("timeupdate", function () {
        // 检查是否接近结束
        if (this.currentTime >= this.duration - 1) {
          log("视频即将结束");
          prepareNextVideo();
        }
      });

    // 确保视频播放
    if (video.paused && !video.ended) {
      video.play();
    }

    // 防止暂停
    var originalPause = video.pause;
    video.pause = function () {
      if (!this.ended) {
        log("阻止视频暂停");
        return;
      }
      originalPause.call(this);
    };
  }

  // 准备下一个视频
  function prepareNextVideo() {
    var currentIdx = findCurrentIndex();
    if (currentIdx >= 0 && currentIdx < videoList.length - 1) {
      // 预加载下一个视频
      $(videoList[currentIdx + 1]).trigger("mouseenter");
    }
  }

  // 播放下一个视频
  function playNext() {
    var currentIdx = findCurrentIndex();
    if (currentIdx >= 0 && currentIdx < videoList.length - 1) {
      log("正在切换到下一个视频: " + (currentIdx + 2) + "/" + videoList.length);

      // 确保当前视频已暂停
      var currentVideo = $("video.vjs-tech")[0];
      if (currentVideo) {
        currentVideo.pause();
      }

      // 点击下一个视频项
      $(videoList[currentIdx + 1]).click();

      // 验证切换是否成功
      setTimeout(function () {
        var newVideo = $("video.vjs-tech")[0];
        if (newVideo && newVideo !== currentVideo) {
          handleVideo(); // 设置新视频
        } else {
          log("视频切换失败,重试");
          playNext();
        }
      }, 1000);
    } else {
      log("所有视频播放完成");
    }
  }

  // 处理弹窗
  function handlePopup() {
    if ($(".fish-modal-content").length > 0) {
      log("检测到弹窗,自动关闭");
      $(".fish-modal-content").find("button").click();
      popUpWindowNum.unshift(1);
    } else {
      popUpWindowNum.unshift(0);
    }

    // 维护固定长度
    while (popUpWindowNum.length > Duration) {
      popUpWindowNum.pop();
    }

    // 调整播放速度
    // adjustPlaybackRate();
  }

  // 调整播放速度
  function adjustPlaybackRate() {
    var sum = 0;
    for (var i = 0; i < popUpWindowNum.length; i++) {
      if (popUpWindowNum[i] === 1) sum++;
    }

    var popupRate = sum / popUpWindowNum.length;
    if (popupRate > 0.5) {
      Rate = 1;
      log("弹窗频繁,降低播放速度");
    } else if (popupRate < 0.25) {
      Rate = 2;
      log("弹窗较少,恢复播放速度");
    }

    // 更新当前视频速度
    var video = $("video.vjs-tech")[0];
    if (video) {
      video.playbackRate = Rate;
    }
  }

  // 启动监控
  function startMonitor() {
    window.setInterval(function () {
      handlePopup();
      handleVideo();
    }, 1000);
  }

  // 启动自动刷课
  initVideoList();
})();
