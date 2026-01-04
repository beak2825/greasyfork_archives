// ==UserScript==
// @name         B站扣1复活科比
// @namespace    undefined
// @version      0.2
// @description  自动将B站评论修改为扣1复活科比
// @author       imtsy
// @match        *://*.bilibili.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468066/B%E7%AB%99%E6%89%A31%E5%A4%8D%E6%B4%BB%E7%A7%91%E6%AF%94.user.js
// @updateURL https://update.greasyfork.org/scripts/468066/B%E7%AB%99%E6%89%A31%E5%A4%8D%E6%B4%BB%E7%A7%91%E6%AF%94.meta.js
// ==/UserScript==
(function() {
setInterval(() => {
    let divList = document.querySelectorAll('div.root-reply');
    for(let div of divList) {
      let spanList = div.querySelectorAll('span.reply-content-container.root-reply');
      for(let span of spanList) {
          let commentList = span.querySelectorAll('span.reply-content');
          for(let comment of commentList) {
              comment.textContent = "扣 1 复活科比";
          }
      }
  }
  let subSpanList = document.querySelectorAll('span.reply-content-container.sub-reply-content');
    for(let subSpan of subSpanList) {
          let subCommentList = subSpan.querySelectorAll('span.reply-content');
          for(let subComment of subCommentList) {
              subComment.textContent = "111";
          }
      }
  let imgList = document.querySelectorAll('img.bili-avatar-img.bili-avatar-face.bili-avatar-img-radius');
    for(let img of imgList) {
        img.src = "//i2.hdslb.com/bfs/face/3674221c582cf849f11535052ca2b5d11a650bba.jpg@160w_160h_1c_1s_!web-avatar-comment.webp";
    }
}, 1000);

})();