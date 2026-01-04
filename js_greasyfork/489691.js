// ==UserScript==
// @name         哔哩哔哩 - 移除低于指定时长的视频
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  精简哔哩哔哩首页推荐内容，移除各种推荐板块，只显示大于指定时长的视频（默认设置为只看大于5分钟的视频）
// @author       Ant
// @match        https://www.bilibili.com/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489691/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%20-%20%E7%A7%BB%E9%99%A4%E4%BD%8E%E4%BA%8E%E6%8C%87%E5%AE%9A%E6%97%B6%E9%95%BF%E7%9A%84%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/489691/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%20-%20%E7%A7%BB%E9%99%A4%E4%BD%8E%E4%BA%8E%E6%8C%87%E5%AE%9A%E6%97%B6%E9%95%BF%E7%9A%84%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function () {
  "use strict";
  // 指定时长：分钟
  const minute = 5;

  let container_class = ".recommended-container_floor-aside > .container";
  let observe = new MutationObserver((mutations, observer) => {
    // 删除低于指定时长的视频
    let card_list = document.querySelectorAll(".bili-video-card");
    for (const card of card_list) {
      let obj_dur = card.querySelector(".bili-video-card__stats__duration");
      if (obj_dur) {
        let time_sec = time2sec(obj_dur.innerText);
        if (time_sec < minute * 60) {
          console.log(time_sec);
          card.parentElement.removeChild(card);
          continue;
        }
      }
    }

    // 删除直播视频
    let live_list = document.querySelectorAll(".bili-live-card");
    // 删除 floor-card
    let floor_list = document.querySelectorAll(".floor-single-card");

    let remove_list = [];
    remove_list.push.apply(remove_list, live_list);
    remove_list.push.apply(remove_list, floor_list);
    for (const card of remove_list) {
      card.parentElement.removeChild(card);
    }
    // 删除空的 feed-card
    let feed_list = document.querySelectorAll(".feed-card");
    for (const card of feed_list) {
      if (!card.innerText) card.parentElement.removeChild(card);
    }
  });

  observe.observe(document.querySelector(container_class), {
    childList: true,
    attributes: false,
  });
})();

function time2sec(time) {
  let hour = 0,
    min = 0,
    sec = 0;
  let array = time.split(":");
  if (array.length == 2) {
    // demo 08:45
    hour = 0;
    min = Number(array[0]) * 60;
    sec = Number(array[1]);
  }
  if (array.length == 3) {
    // demo 01:48:15
    hour = Number(array[0]) * 3600;
    min = Number(array[1]) * 60;
    sec = Number(array[2]);
  }

  return parseInt(hour + min + sec);
}

console.log(time2sec("01:01"));
