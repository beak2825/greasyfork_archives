// ==UserScript==
// @name         恢复 Tiktok 无版权音乐播放
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  优化性能，避免重复加载和设置
// @author       wzj042
// @match        https://www.tiktok.com/*/video/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tiktok.com
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504919/%E6%81%A2%E5%A4%8D%20Tiktok%20%E6%97%A0%E7%89%88%E6%9D%83%E9%9F%B3%E4%B9%90%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/504919/%E6%81%A2%E5%A4%8D%20Tiktok%20%E6%97%A0%E7%89%88%E6%9D%83%E9%9F%B3%E4%B9%90%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function () {
  function setVideoToPlay() {
    var musicLink = document.querySelector("h4 a");
    var copyright = musicLink
      ? musicLink.href === "https://www.tiktok.com/"
      : false;

    if (copyright) {
      var video = document.querySelector("video");

      if (video && video.muted && video.volume > 0) {
        video.muted = false;
        // 尝试播放视频
        video.play().catch((e) => {
          if (e.name !== "NotAllowedError") {
            console.error(e);
          }
        });
      }
      // 更新来源
      if (musicLink && !musicLink.dataset.labelSet) {
        var script = document.getElementById(
          "__UNIVERSAL_DATA_FOR_REHYDRATION__"
        );
        if (script) {
          var data = JSON.parse(script.textContent || script.innerText);
          var music =
            data.__DEFAULT_SCOPE__["webapp.video-detail"].itemInfo.itemStruct
              .music;
          var musicLabel = `${music.title}-${music.authorName}`;
          musicLink.innerText = musicLabel;
          musicLink.dataset.labelSet = true; // 标记已设置
        }
      }
    }
  }

  setInterval(setVideoToPlay, 1000);
})();
