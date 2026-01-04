// ==UserScript==
// @name        重构omofuns的视频播放，去除插播广告，播完自动下集、快捷键n键下集f键全屏、播放进度保存
// @namespace   omofuns
// @match       https://omofuns.xyz/vod/play/id/*
// @version     2.1
// @grant       none
// @require     https://cdn.jsdelivr.net/npm/hls.js@1.6.9
// @require     https://cdn.jsdelivr.net/npm/plyr@3.7.8
// @resource    plyr_css https://cdn.jsdelivr.net/npm/plyr@3.7.8/dist/plyr.css
// @grant       GM_getResourceText
// @grant       GM_addStyle
// @author      star2000
// @license     AGPL-3.0-or-later
// @description 2025/7/12 16:39:37
// @downloadURL https://update.greasyfork.org/scripts/544303/%E9%87%8D%E6%9E%84omofuns%E7%9A%84%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%EF%BC%8C%E5%8E%BB%E9%99%A4%E6%8F%92%E6%92%AD%E5%B9%BF%E5%91%8A%EF%BC%8C%E6%92%AD%E5%AE%8C%E8%87%AA%E5%8A%A8%E4%B8%8B%E9%9B%86%E3%80%81%E5%BF%AB%E6%8D%B7%E9%94%AEn%E9%94%AE%E4%B8%8B%E9%9B%86f%E9%94%AE%E5%85%A8%E5%B1%8F%E3%80%81%E6%92%AD%E6%94%BE%E8%BF%9B%E5%BA%A6%E4%BF%9D%E5%AD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/544303/%E9%87%8D%E6%9E%84omofuns%E7%9A%84%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%EF%BC%8C%E5%8E%BB%E9%99%A4%E6%8F%92%E6%92%AD%E5%B9%BF%E5%91%8A%EF%BC%8C%E6%92%AD%E5%AE%8C%E8%87%AA%E5%8A%A8%E4%B8%8B%E9%9B%86%E3%80%81%E5%BF%AB%E6%8D%B7%E9%94%AEn%E9%94%AE%E4%B8%8B%E9%9B%86f%E9%94%AE%E5%85%A8%E5%B1%8F%E3%80%81%E6%92%AD%E6%94%BE%E8%BF%9B%E5%BA%A6%E4%BF%9D%E5%AD%98.meta.js
// ==/UserScript==

GM_addStyle(GM_getResourceText("plyr_css"));


(function () {
  "use strict";

  /**
   * 从URL中匹配M3U8链接
   * @param {string} url URL字符串
   * @return {string|undefined} 匹配到的M3U8链接或undefined
   */
  function urlMatchM3u(url) {
    if (url) {
      const m3u8Link = url.match(/http[^?]*\.m3u8/);
      if (m3u8Link) {
        return m3u8Link[0];
      }
    }
  }

  /**
   * 去除M3U8文本中的插播广告
   * @param {string} text M3U8文本
   * @returns {string} 去除插播广告后的M3U8文本
   */
  function pruner(text) {
    if (!text.includes("#EXT-X-DISCONTINUITY")) {
      return text;
    }

    const lines = text.split("\n");
    const pruned_lines = [];
    let normal_link = ''
    let is_start = false;
    let is_ad = false;
    for (let i = 0; i < lines.length; i++) {
      let l = lines[i];
      if (is_start) {
        if (l == "#EXT-X-ENDLIST") {
          is_ad = false;
        }
        if (l == "#EXT-X-DISCONTINUITY") {
          if (normal_link){
            is_ad = !lines[i+2].includes(normal_link)
          } else {
            is_ad = !is_ad;
          }
          continue;
        }
        if (is_ad) {
          continue;
        }
      } else if (l.startsWith("#EXTINF")) {
        is_start = true;
        const match_link = lines[i+1].match(/.*\//)
        if (match_link) {
          normal_link = lines[i+1].match(/.*\//)[0]
        }
      }
      pruned_lines.push(l);
    }
    return pruned_lines.join("\n");
  }

  // 监听M3U8请求
  XMLHttpRequest.prototype.open = new Proxy(XMLHttpRequest.prototype.open, {
    apply: async (target, thisArg, args) => {
      if (urlMatchM3u(args[1]))
        thisArg.addEventListener("readystatechange", function () {
          if (thisArg.readyState !== 4) {
            return;
          }
          const type = thisArg.responseType;
          if (type !== "" && type !== "text") {
            return;
          }
          const textin = thisArg.responseText;
          const textout = pruner(textin);
          if (textout === textin) {
            return;
          }
          Reflect.defineProperty(thisArg, "response", { value: textout });
          Reflect.defineProperty(thisArg, "responseText", { value: textout });
        });
      return Reflect.apply(target, thisArg, args);
    },
  });


  function next() {
    const nextButton = Array.from(document.querySelectorAll("a")).find(
      (a) => a.text == "下集"
    );
    if (nextButton) {
      nextButton.click();
    }
  }

  // 监听按键
  document.addEventListener("keydown", function (event) {
    if (event.key === "n") {
      next();
    }
  });

  const p = document.getElementsByClassName("player-box-main")[0];
  if (!p) return;
  const ifs = document.getElementsByTagName("iframe");
  let i;
  let url;
  for (const k in ifs) {
    if (Object.prototype.hasOwnProperty.call(ifs, k)) {
      url = ifs[k].src.split("url=")[1]
      if (url && url.startsWith('http')) {
        i = ifs[k];
        break;
      }
    }
  }
  if (!i) return;

  const video = document.createElement("video");
  video.style.aspectRatio = "16 / 9";
  video.style.width = "100%";
  video.controls = true;
  video.autofocus = true;
  video.addEventListener("ended", function () {
    next();
  });

  // 播放进度保存
  const progressKey = `${vod_name} ${vod_part}`;
  video.addEventListener("timeupdate", function () {
    if (video.currentTime) {
      localStorage.setItem(progressKey, video.currentTime);
    }
  });
  // 播放进度恢复
  video.addEventListener("loadedmetadata", function () {
    const t = localStorage.getItem(progressKey);
    if (t) {
      video.currentTime = parseFloat(t);
      video.play();
    }
  });

  const m3u8Url = urlMatchM3u(i.src);
  if (m3u8Url) {
    video.src = m3u8Url;
    const hls = new Hls();
    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      video.play();
    });
    hls.on(Hls.Events.ERROR, function (event, data) {
      if (data.fatal) {
        switch (data.type) {
          case Hls.ErrorTypes.MEDIA_ERROR:
          case Hls.ErrorTypes.NETWORK_ERROR:
            console.log("error");
            hls.recoverMediaError();
            break;
          default:
            hls.destroy();
        }
      }
    });
    hls.loadSource(video.src);
    hls.attachMedia(video);
  } else {
    video.src = url;
  }
  while (p.firstChild) {
    p.removeChild(p.firstChild);
  }
  p.appendChild(video);

  new Plyr(video, {
    keyboard: {
      focused: false,
      global: true,
    },
    controls: [
      "play-large",
      "rewind",
      "play",
      "fast-forward",
      "progress",
      "current-time",
      "duration",
      "mute",
      "volume",
      "settings",
      "pip",
      "fullscreen",
    ],
  });
})();
