// ==UserScript==
// @name         chaoxing学习通，自动两倍速刷视频，禁止自动暂停，自动下一章
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  此脚本仅适用于 mooc1.chaoxing.com 这个网址
// @author       glitchboyl
// @match        *://mooc1.chaoxing.com/*
// @icon         https://www.google.com/s2/favicons?domain=chaoxing.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454348/chaoxing%E5%AD%A6%E4%B9%A0%E9%80%9A%EF%BC%8C%E8%87%AA%E5%8A%A8%E4%B8%A4%E5%80%8D%E9%80%9F%E5%88%B7%E8%A7%86%E9%A2%91%EF%BC%8C%E7%A6%81%E6%AD%A2%E8%87%AA%E5%8A%A8%E6%9A%82%E5%81%9C%EF%BC%8C%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E7%AB%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/454348/chaoxing%E5%AD%A6%E4%B9%A0%E9%80%9A%EF%BC%8C%E8%87%AA%E5%8A%A8%E4%B8%A4%E5%80%8D%E9%80%9F%E5%88%B7%E8%A7%86%E9%A2%91%EF%BC%8C%E7%A6%81%E6%AD%A2%E8%87%AA%E5%8A%A8%E6%9A%82%E5%81%9C%EF%BC%8C%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E7%AB%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

     
      let re = true;
      function fn() {
        const frames = Array.from(
          window?.frames?.[3]?.document.querySelectorAll("iframe") || []
        );
        if (frames.length) {
          re = false;
        }
        if (re) {
          setTimeout(fn, 500);
          return;
        }
        const videos = [];
        const flags = new Proxy([], {
          get(target, key, receiver) {
            return Reflect.get(target, key, receiver);
          },
          set(target, key, value, receiver) {
            const result = Reflect.set(target, key, value, receiver);
            if (target.every((f) => f)) {
              document.querySelector(".jb_btn.prev_next.next")?.click();
              setTimeout(() => window.location.reload(), 500);
            }
            return result;
          },
        });
        Promise.all(
          frames.map(
            (frame) =>
              new Promise((resolve) => {
                setTimeout(() => {
                  const video =
                    frame.contentWindow.document.getElementById(
                      "video_html5_api"
                    );
                  if (video) {
                    flags.push(false);
                    videos.push(video);
                    resolve();
                  }
                }, 800);
              })
          )
        ).then(() => {
          let i = 0;
          function play() {
            const video = videos[i];
            if (!video) return;
            video.volume = 0;
            video.autoplay = true;
            video.defaultPlaybackRate = 2;
            video.playbackRate = 2;

            video.onpause = () =>
              !video.ended && setTimeout(() => video.play());
            video.onended = () => {
              flags[i] = true;
              video.onwaiting = null;
              video.onpause = null;
              clearInterval(timer);
              if (i < videos.length) {
                i++;
                play();
              }
            };
            let timer = setInterval(() => {
              if (!video.paused) video.play();
            }, 1000);
            video.play();
          }
          play();
        });
      }

      window.onload = fn;
})();