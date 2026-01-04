// ==UserScript==
// @name  知乎，虎扑，扇贝文章等网站浏览时美化标题或图片
// @namespace    http://tampermonkey.net/
// @description 知乎推荐页缩小标题，虎扑隐藏标题缩小表情包图片，扇贝隐藏内容图片
// @version      0.1.5
// @match        *://web.shanbay.com/*
// @match        *://*.zhihu.com/*
// @match        *://bbs.hupu.com/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/509330/%E7%9F%A5%E4%B9%8E%EF%BC%8C%E8%99%8E%E6%89%91%EF%BC%8C%E6%89%87%E8%B4%9D%E6%96%87%E7%AB%A0%E7%AD%89%E7%BD%91%E7%AB%99%E6%B5%8F%E8%A7%88%E6%97%B6%E7%BE%8E%E5%8C%96%E6%A0%87%E9%A2%98%E6%88%96%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/509330/%E7%9F%A5%E4%B9%8E%EF%BC%8C%E8%99%8E%E6%89%91%EF%BC%8C%E6%89%87%E8%B4%9D%E6%96%87%E7%AB%A0%E7%AD%89%E7%BD%91%E7%AB%99%E6%B5%8F%E8%A7%88%E6%97%B6%E7%BE%8E%E5%8C%96%E6%A0%87%E9%A2%98%E6%88%96%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==
(function () {
  'use strict';


  (function () {
    var parentElement = document.body;

    var div = document.createElement("div");

    div.style.cssText = "color: red;position:fixed;left:10px;top:200px;cursor:pointer;width:18px;";
    div.innerText = "点击切换";

    div.addEventListener("click", function () {
      var imgs = document.querySelectorAll(".article-content img");
      if (imgs && imgs.length) {
        imgs.forEach(function (img) {
          if (img.style.display === "none") {
            img.style.display = "block";
          } else {
            img.style.display = "none";
          }
        });
      }
    });
    parentElement.appendChild(div);
  })();
  // 知乎推荐页 隐藏右边，顶栏，去掉标题加粗，顶栏，去掉标题加粗
  (function () {
    window.onscroll = function () {
      (function () {
        if (h) h.style.display = 'none';
        var h = document.querySelector('.css-1qyytj7');
        if (h) h.style.display = 'none';
        // 获取所有类名为 ContentItem-title 的 div 元素
        var titles = document.querySelectorAll('.ContentItem-title');
        if (titles) {
          // 遍历所有元素并设置样式
          titles.forEach(function (title) {
            title.style.fontWeight = 'normal';
            title.style.fontSize = '14px';
          });
        }
        var videoItems = document.querySelectorAll('.ZVideoItem');
        videoItems && videoItems.forEach(item => {
          item.style.display = 'none';
        });
      })();
      (function () {
        var h = document.querySelector('.post-fix-title');
        if (h) h.style.display = 'none';
        var wrapperContainers = document.querySelectorAll('.wrapper-container');
        if (wrapperContainers) {
          wrapperContainers.forEach(function (wrapperContainer) {
            var threadImgs = wrapperContainer.querySelectorAll('.thread-img');
            if (threadImgs) {
              for (let i = 0;i < threadImgs.length;i++) {
                threadImgs[i].style.width = '20px';
                threadImgs[i].style.height = '20px';
              }
            }
          })
        }
      })();
    };
  })();
  // 知乎
  (function () {

    var h = document.querySelector('.AppHeader');
    if (h) h.style.display = 'none';
    var hc1 = document.querySelector('.css-17rnw55');
    if (hc1) hc1.style.display = 'none';
    var hc = document.querySelector('.css-1qyytj7');
    if (hc) hc.style.display = 'none';
    // 获取所有类名为 ContentItem-title 的 div 元素
    var titles = document.querySelectorAll('.ContentItem-title');
    if (titles) {
      // 遍历所有元素并设置样式
      titles.forEach(function (title) {
        title.style.fontWeight = 'normal';
        title.style.fontSize = '14px';
      });
    }
    // 知乎推荐的视频
    var videoItems = document.querySelectorAll('.ZVideoItem');
    videoItems && videoItems.forEach(item => {
      item.style.display = 'none';
    });
  })();
  // 虎扑
  (function () {

    var h = document.querySelector('.post-fix-title');
    if (h) h.style.display = 'none';

    var wrapperContainers = document.querySelectorAll('.wrapper-container');
    if (wrapperContainers) {
      wrapperContainers.forEach(function (wrapperContainer) {
        var threadImgs = wrapperContainer.querySelectorAll('.thread-img');
        if (threadImgs) {
          for (let i = 0;i < threadImgs.length;i++) {
            threadImgs[i].style.width = '20px';
            threadImgs[i].style.height = '20px';
          }
        }
      })
    }

  })();

})();