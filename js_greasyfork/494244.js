// ==UserScript==
// @name        qdm-wider-video
// @namespace   Violentmonkey Scripts
// @match       https://www.qdm66.com/dongmanplay/*
// @match       https://www.qdm8.com/dongmanplay/*
// @grant       none
// @version     1.2
// @author      mesimpler
// @grant       GM_addStyle
// @license     MIT
// @description 让趣动漫的视频播放器宽屏播放（并且移除了页面中的一些干扰元素，更专注视频）。
// @downloadURL https://update.greasyfork.org/scripts/494244/qdm-wider-video.user.js
// @updateURL https://update.greasyfork.org/scripts/494244/qdm-wider-video.meta.js
// ==/UserScript==

/* 宽屏 */
const video_wrap = document.querySelector("#player-left");
const video_side = document.querySelector("#player-sidebar");
video_wrap.classList.remove("col-md-wide-75");
video_wrap.classList.add("col-md-wide-100");
video_side.classList.remove("col-md-wide-25");
video_side.classList.add("col-md-wide-100");
setTimeout(() => {
  video_side.style.height = "auto";
}, 800);

/* */
GM_addStyle(`
  body {
    background-color: #27272f;
  }
  .myui-header__top {
    background-color: #27272f;
    box-shadow: 1px 1px 2px #636466;
  }
  .myui-header__user > li > a, .myui-header__user > li > a .fa {
    color: #E5EAF3;
  }
  .myui-header__menu > li > a {
    color: #E5EAF3;
  }
`);

/* 移除公告 */
const gongaos = document.querySelectorAll("#gongao");
gongaos.forEach((el) => el.remove());

/* 移除滚动提示 */
const tips = document.querySelector("#tips");
tips.remove();

/* 移除路线切换提示 */
const switch_tips = document.querySelector(".tips.close-box");
switch_tips.remove();

/* 重排剧集布局 */
const video_lis = document.querySelectorAll(".myui-content__list > li");
video_lis.forEach(
  (el) => (el.className = "col-lg-5 col-md-4 col-sm-7 col-xs-6  ")
);
