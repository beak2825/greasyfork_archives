// ==UserScript==
// @name        虎扑图片缩小
// @description    虎扑帖子图片缩小
// @namespace   Violentmonkey Scripts
// @match       *://bbs.hupu.com/*
// @version     1.0
// @author      Jason
// @license      GPL-3.0 License
// @compatible  Chrome
// @downloadURL https://update.greasyfork.org/scripts/469848/%E8%99%8E%E6%89%91%E5%9B%BE%E7%89%87%E7%BC%A9%E5%B0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/469848/%E8%99%8E%E6%89%91%E5%9B%BE%E7%89%87%E7%BC%A9%E5%B0%8F.meta.js
// ==/UserScript==

(function () {
  'use strict';
  process();
  window.addEventListener('scroll', () => {
    process();
  })
  function process() {
    //页面向下滚动时，标题不要固定在页面顶端
    let title = document.querySelector('.post-fix-title');
    if(title != null) {
      title.style.position = 'absolute';
      title = title.parentNode.parentNode;
      title.style.position = 'absolute';
    }
    //楼中图片
    let threadImgs = document.querySelectorAll(".thread-content-detail img");
    for(let i = 0; i < threadImgs.length; ++i) {
      let threadImg = threadImgs[i];
      let computedStyle = window.getComputedStyle(threadImg);
      let width = parseFloat(computedStyle.width.replace('px', ''));
      let height = parseFloat(computedStyle.height.replace('px', ''));
      //图片宽高比
      let rate = height / width;

      let smallWidth = '50%';
      let smallHeight = '50%';
      //如果图片近似于正方形，就当它是表情包，表情包宽度缩小到50px，高度也按比例缩小；否则就当它是普通图片，宽度和高度缩小50%
      if(rate <= 1.2 && rate >= 0.7) {
        smallWidth = 50;
        smallHeight = smallWidth * rate;
        threadImg.style.width = smallWidth + 'px';
        threadImg.style.height = smallHeight + 'px';
      } else {
        threadImg.style.width = smallWidth;
        threadImg.style.height = smallHeight;
      }
    }
  }
})();