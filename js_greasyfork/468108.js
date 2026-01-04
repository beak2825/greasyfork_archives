// ==UserScript==
// @name         jxkp auto play
// @namespace    jxkp_autoplay
// @version      0.2.5
// @description  嘉兴市专业技术人员继续教育平台自动播放
// @author       MewChen
// @include      http*://zy.jxkp.net/Person/Play/*
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @grant        none
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/468108/jxkp%20auto%20play.user.js
// @updateURL https://update.greasyfork.org/scripts/468108/jxkp%20auto%20play.meta.js
// ==/UserScript==

(function () {
  "use strict";
  $(function () {
    // 常量
    const baseUrl = "http://zy.jxkp.net";
    // 获取基础信息
    var video = $("video")[0];
    // 获取“下一集”信息
    //var nextPageText = $('.console-body').find('.pull-right').eq(0).text();
    var nextPageLink = $(".console-body").find(".pull-right").eq(0).children("a").attr("href");
    // 将视频设置静音
    video.volume = 0;
    // 监听窗口不在焦点方法，防止自动暂停
    $(window).blur(function (e) {
      e.preventDefault();
      console.log('window.blur');
      hasFocus = true;
      player.play();
    });
    // 覆盖暂停方法（防止暂停）
    player.pause = function () {
      console.log('video.pause');
      hasFocus = true;
      this.play();
    };
    // 监听结束并播放下一集
    video.addEventListener("ended", (event) => {
      // 随机延迟1~2秒
      var duration = Math.floor(Math.random() * 1000 + 1000);
      setTimeout(() => {
        if (nextPageLink) {
          window.location.href = baseUrl + nextPageLink;
        } else {
          window.location.href = baseUrl + "/Person/Kcs";
        }
      }, duration);
    });
  });
})();
