"use strict";
// ==UserScript==
// @name         屏蔽百度贴吧超长评论
// @namespace    https://github.com/qianjiachun
// @version      2022.09.29.02
// @description  屏蔽、缩短百度贴吧超长评论（超过50行）
// @author       小淳
// @match			*://tieba.baidu.com/p/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452205/%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E8%B6%85%E9%95%BF%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/452205/%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E8%B6%85%E9%95%BF%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==

const MAX_LINE = 50; // 帖子最大行数，超过这个值将会被缩短

function init() {
  let timer = setInterval(() => {
    let dom = document.getElementsByClassName("d_post_content");
    if (dom.length > 0) {
      clearInterval(timer);
      killLongPosts();
      setInterval(killLongPosts, 1500);
    }
  }, 300);
}

function killLongPosts() {
  let posts = document.getElementsByClassName("d_post_content");
  for (let i = 0; i < posts.length; i++) {
    let post = posts[i];
    let brCount = post.innerHTML.split("br").length;
    if (brCount >= MAX_LINE) {
      post.innerHTML = post.innerHTML.replace(/<br>/g, "").replace(/<br\/>/g, "").replace(/<br \/>/g, "");
    }
  }
}

(function () {
  init();
})()