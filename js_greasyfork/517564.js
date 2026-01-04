// ==UserScript==
// @name         百度云网盘视频音频倍速播放
// @namespace    http://tampermonkey.net/
// @version      2025-03-22
// @description  百度云在线视频/音频 倍速播放，没有额外的按钮，直接点击视频中的倍数按钮 即可倍数播放。需要定制脚本请联系QQ2847046608
// @author       You
// @match        https://yun.baidu.com/pfile/video?*
// @match        https://yun.baidu.com/disk/main*
// @match        https://pan.baidu.com/pfile/video?*
// @match        https://pan.baidu.com/disk/main*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/517564/%E7%99%BE%E5%BA%A6%E4%BA%91%E7%BD%91%E7%9B%98%E8%A7%86%E9%A2%91%E9%9F%B3%E9%A2%91%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/517564/%E7%99%BE%E5%BA%A6%E4%BA%91%E7%BD%91%E7%9B%98%E8%A7%86%E9%A2%91%E9%9F%B3%E9%A2%91%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function () {
  'use strict';

  if (!localStorage.playSpeed) {
    localStorage.playSpeed = 1;
  }

  // 等待元素出现
  function waitForElement(selector, timeout = 3000) {
    return new Promise((resolve, reject) => {
      const element = document.querySelector(selector);
      if (element) return resolve(element); // 如果元素已存在，立即返回

      const observer = new MutationObserver(() => {
        const found = document.querySelector(selector);
        if (found) {
          observer.disconnect(); // 停止监听
          resolve(found);
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });

      setTimeout(() => {
        observer.disconnect(); // 超时后停止监听
        reject(new Error(`等待 ${selector} 超时`));
      }, timeout);
    });
  }


  // 音频
  (function () {
    const OriginalAudio = window.Audio;

    window.Audio = function (...args) {
      var myAudio = new OriginalAudio(...args);

      waitForElement(".audio-time-wrap").then(el => {
        var jiedian = document.querySelector(".audio-time-wrap");
        jiedian.insertAdjacentElement('afterend', myAudio);
        jiedian.style.display = "none";

        myAudio.controls = true;
        myAudio.style.width = "100%";
      }).catch(err => {
      });

      // 强制设置播放速度为 2 倍速
      myAudio.playbackRate = localStorage.playSpeed;
      myAudio.addEventListener('ratechange', () => {
        localStorage.playSpeed = myAudio.playbackRate;
        //console.log(`播放速度改变为: ${audio.playbackRate}x`);
      });
      return myAudio;
    };

    // 保留原型链
    window.Audio.prototype = OriginalAudio.prototype;
  })();

  //视频倍速
  clearInterval(window.asdasd);
  window.asdasd = setInterval(() => {
    var affsdasd = document.querySelector(".vp-video__control-bar--playback-rates");
    if (!!affsdasd && !affsdasd.classList.contains("aaaa")) {
      affsdasd.classList.add("aaaa");
      clearInterval(window.asdasd);




      //点击“选集”跳转到开头
      document.querySelector(".vp-aside-box__top-title").addEventListener("click", () => {
        document.querySelector("video").currentTime = 2
      });



      affsdasd.insertAdjacentHTML('afterbegin', `
<div class="vp-video__control-bar--video-button is-svip"><!----><button type="button" class="vp-btn normal is-round" style=""><!----><span><!----> 4X</span></button><!----><!----></div>
<div class="vp-video__control-bar--video-button is-svip"><!----><button type="button" class="vp-btn normal is-round" style=""><!----><span><!----> 3X</span></button><!----><!----></div>
<div class="vp-video__control-bar--video-button is-svip"><!----><button type="button" class="vp-btn normal is-round" style=""><!----><span><!----> 2.5X</span></button><!----><!----></div>
`)

      function changeSpeed(sp) {
        if (!!!sp) {
          sp = localStorage.playSpeed ?? 1;
        }
        document.querySelector("video").playbackRate = sp;

        document.querySelector(".chgsp.is-selected")?.classList.remove("is-selected");
        document.querySelector(".sp" + (sp + "").replace(/\./g, "-"))?.classList.add("is-selected");
      }

      document.querySelectorAll(".vp-video__control-bar--playback-rates > .vp-video__control-bar--video-button").forEach(o => {
        o.classList.add("chgsp");
        var sps = "sp" + o.querySelector("button").innerText.replace("X", "").trim().replace(/\./g, "-");
        o.classList.add(sps);

        o.onclick = function () {
          localStorage.playSpeed = o.querySelector("button").innerText.replace("X", "").trim();
          changeSpeed();
          document.querySelector("video").play();
          document.querySelector("wora-pc-dialog").style.display = "none";
        }
      });
      document.querySelector("video").onplay = function () {
        changeSpeed();
      }

      window.isRightDownTime = undefined;
      [
        document.body,
        document.querySelector(".video-js"), ...document.querySelector(".video-js").querySelectorAll('*')
      ].forEach(oo => {
        oo.onkeydown = () => {
          switch (event.code) {
            case "Right":
            case "ArrowRight":
              if (!!!window.isRightDownTime) {
                window.isRightDownTime = new Date();
              } else {
                changeSpeed(4.3);
              }
              event.stopImmediatePropagation();
              break;
          }
        };

        oo.onkeyup = () => {
          switch (event.code) {
            case "Right":
            case "ArrowRight":
              if (new Date() - window.isRightDownTime < 450) {
                document.querySelector("video").currentTime += 20;
              }
              window.isRightDownTime = undefined;
              changeSpeed();
              event.stopImmediatePropagation();
              break;
          }
        };
      });
    }
  }, 1000)
})();