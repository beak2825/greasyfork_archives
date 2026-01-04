// ==UserScript==
// @name         煎蛋半自动摸鱼小助手
// @namespace    https://greasyfork.org/users/186574
// @homepage     https://greasyfork.org/scripts/368223
// @version      1.6.1
// @description  随滚动自动展开评论+gif+直接看大图
// @author       dccxi
// @match        http://jandan.net/pic*
// @match        http://jandan.net/top*
// @match        https://jandan.net/pic*
// @match        https://jandan.net/top*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368223/%E7%85%8E%E8%9B%8B%E5%8D%8A%E8%87%AA%E5%8A%A8%E6%91%B8%E9%B1%BC%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/368223/%E7%85%8E%E8%9B%8B%E5%8D%8A%E8%87%AA%E5%8A%A8%E6%91%B8%E9%B1%BC%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

'use strict';

// 自动展开吐槽
function load1() {
  document
    .querySelectorAll(
      'div.comment-func:not(:has(+ div.tucao-container)) > span.button-group:nth-child(3)'
    )
    .forEach((ele) => ele.click());
}

// 自动点击大图
function load2() {
  document
    .querySelectorAll(
      'div.comment-row > div.comment-content > div.img-container > img.img-min'
    )
    .forEach((ele) => ele.click());
}

// 加载 gif
function load3() {
  document
    .querySelector('div.gif-overlay:not(div.d-none):has(span > i.bi-play)')
    ?.click();
}

setInterval(() => {
  load1();
  load2();
  load3();
}, 1000);
