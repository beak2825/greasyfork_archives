// ==UserScript== 
// @name         Bilibili解锁任意倍速播放
// @author       zhosix
// @match        https://*.bilibili.com/*
// @version      1.2
// @description       为 B站 解锁任意倍速播放视频，支持ios、ipad的safari浏览器及pc端等网页浏览器原生修改倍速播放视频
// @icon               https://www.google.com/s2/favicons?domain=bilibili.com
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1122792
// @downloadURL https://update.greasyfork.org/scripts/470501/Bilibili%E8%A7%A3%E9%94%81%E4%BB%BB%E6%84%8F%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/470501/Bilibili%E8%A7%A3%E9%94%81%E4%BB%BB%E6%84%8F%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==   
(function () {
"use strict";

const video = document.querySelector('video');

const savedPlaybackRate = localStorage.getItem('customPlaybackRate');

if (savedPlaybackRate) {
video.playbackRate = parseFloat(savedPlaybackRate);
}

const intervalID = setInterval(() => {
const rate_2 = document.querySelector("li.bpx-player-ctrl-playbackrate-menu-item");
if (rate_2) {
clearInterval(intervalID);

  const customRate = rate_2.cloneNode(false);
  customRate.setAttribute("data-value", "custom");
  customRate.innerText = "自定义";
  rate_2.parentElement.insertBefore(customRate, rate_2);

  customRate.addEventListener("click", function () {
    const inputRate = prompt("请输入自定义倍速值：");
    if (inputRate) {
      const rate = parseFloat(inputRate);
      if (!isNaN(rate) && rate >= 0.1 && rate <= 100) {
        video.autoplay = false;
        localStorage.setItem('customPlaybackRate', rate.toString());
        video.load();
        video.addEventListener('loadeddata', function() {
          video.playbackRate = rate;
          video.play();
        });
      } else {
        alert("请输入有效的倍速值（0.1 - 100）");
      }
    }
  });

  const rates = [
    { value: 2.5, text: "2.5x" },
    { value: 3, text: "3.0x" },
    { value: 3.5, text: "3.5x" },
    { value: 4, text: "4.0x" },
    { value: 4.5, text: "4.5x" },
    { value: 5, text: "5.0x" },
    { value: 8, text: "8.0x" },
    { value: 10, text: "10.0x" },
  ];

  rates.reverse().forEach((rate) => {
    const rateOption = rate_2.cloneNode(false);
    rateOption.setAttribute("data-value", rate.value.toString());
    rateOption.innerText = rate.text;
    rate_2.parentElement.insertBefore(rateOption, rate_2);

    rateOption.addEventListener("click", function () {
      video.autoplay = false;
      localStorage.setItem('customPlaybackRate', rate.value.toString());
      video.load();
      video.addEventListener('loadeddata', function() {
        video.playbackRate = rate.value;
        video.play();
      });
    });
  });
}
}, 200);

video.addEventListener('loadedmetadata', function() {
const newPlaybackRate = localStorage.getItem('customPlaybackRate');
if (newPlaybackRate) {
video.playbackRate = parseFloat(newPlaybackRate);
}
});

video.addEventListener('ended', function() {
localStorage.removeItem('customPlaybackRate');
});

})();