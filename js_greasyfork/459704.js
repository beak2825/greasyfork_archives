// ==UserScript==
// @name         中石油大学，继续教育、函授、华东石油大学、在线网课、刷课、自动、上课脚本。多个窗口需要使用隐身窗口 防止被检测到
// @namespace    http://tampermonkey.net/
// @version      0.10
// @description  设置视频倍速为2倍随机,自动播放下一个视频,目前只兼容石油大学      欢迎打赏,体验更完善版本
// @author       智慧
// @match        *://cj1047-kfkc.webtrn.cn/*
// @icon         https://www.google.com/s2/favicons?domain=webtrn.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459704/%E4%B8%AD%E7%9F%B3%E6%B2%B9%E5%A4%A7%E5%AD%A6%EF%BC%8C%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E3%80%81%E5%87%BD%E6%8E%88%E3%80%81%E5%8D%8E%E4%B8%9C%E7%9F%B3%E6%B2%B9%E5%A4%A7%E5%AD%A6%E3%80%81%E5%9C%A8%E7%BA%BF%E7%BD%91%E8%AF%BE%E3%80%81%E5%88%B7%E8%AF%BE%E3%80%81%E8%87%AA%E5%8A%A8%E3%80%81%E4%B8%8A%E8%AF%BE%E8%84%9A%E6%9C%AC%E3%80%82%E5%A4%9A%E4%B8%AA%E7%AA%97%E5%8F%A3%E9%9C%80%E8%A6%81%E4%BD%BF%E7%94%A8%E9%9A%90%E8%BA%AB%E7%AA%97%E5%8F%A3%20%E9%98%B2%E6%AD%A2%E8%A2%AB%E6%A3%80%E6%B5%8B%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/459704/%E4%B8%AD%E7%9F%B3%E6%B2%B9%E5%A4%A7%E5%AD%A6%EF%BC%8C%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E3%80%81%E5%87%BD%E6%8E%88%E3%80%81%E5%8D%8E%E4%B8%9C%E7%9F%B3%E6%B2%B9%E5%A4%A7%E5%AD%A6%E3%80%81%E5%9C%A8%E7%BA%BF%E7%BD%91%E8%AF%BE%E3%80%81%E5%88%B7%E8%AF%BE%E3%80%81%E8%87%AA%E5%8A%A8%E3%80%81%E4%B8%8A%E8%AF%BE%E8%84%9A%E6%9C%AC%E3%80%82%E5%A4%9A%E4%B8%AA%E7%AA%97%E5%8F%A3%E9%9C%80%E8%A6%81%E4%BD%BF%E7%94%A8%E9%9A%90%E8%BA%AB%E7%AA%97%E5%8F%A3%20%E9%98%B2%E6%AD%A2%E8%A2%AB%E6%A3%80%E6%B5%8B%E5%88%B0.meta.js
// ==/UserScript==

(function () {
  'use strict';
  setTimeout(function () {
    setInterval(function () {
      if ($(".layui-layer-btn0")[0] != undefined) {
        $(".layui-layer-btn0").click()
        $(".contentIframe").contents().find("iframe").contents().find("video")[0].play();
      }
      let doc = $(".contentIframe").contents();
      let videodom = doc.find("iframe").contents().find("video")[0]

      //设置视频突破2倍速限制改为16倍速.
      //if(videodom.playbackRate!=10){ videodom.playbackRate = 10;}
      if (videodom != undefined && videodom != null) {
         console.log("进了videodom", videodom.playbackRate);

        if (videodom.duration.toFixed(1) == videodom.currentTime.toFixed(1)) {
          let items = doc.find('li[id^=childItem_]');
          console.log("进了items", items)
          let curr = $(items[items.index(doc.find('.select'))]);
          let next = $(items[items.index(doc.find('.select')) + 1]);
          console.log("进了next", next);
          next.addClass("select");
          curr.removeClass("select");
          next.children('a').click()

          console.log("当前已经学完,自动播放下一个");
        }
        if (videodom.duration <= 200 ) {
          if (videodom.playbackRate != 1.5) { videodom.playbackRate = 1.5; }
        }
        else {
          if (videodom.playbackRate != 2) { videodom.playbackRate = 2; }

        }
      //  else {
       //   if (videodom.playbackRate <= 8) { videodom.playbackRate = videodom.playbackRate + 1; }
       // }


      }

    }, 10000);
  }, 3500);

  // Your code here...
})();