// ==UserScript==
// @name        bilibili动态页面图片去掉 .avif
// @namespace    none
// @version      0.4
// @description  try to change the world!
// @author       klw
// @include      https://www.bilibili.com/opus/*
// @include      https://space.bilibili.com/*/dynamic
// @include      https://t.bilibili.com/
// @match        https://www.bilibili.com/opus/*
// @require      https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js
// @grant        none
// @license      GNU GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/525594/bilibili%E5%8A%A8%E6%80%81%E9%A1%B5%E9%9D%A2%E5%9B%BE%E7%89%87%E5%8E%BB%E6%8E%89%20avif.user.js
// @updateURL https://update.greasyfork.org/scripts/525594/bilibili%E5%8A%A8%E6%80%81%E9%A1%B5%E9%9D%A2%E5%9B%BE%E7%89%87%E5%8E%BB%E6%8E%89%20avif.meta.js
// ==/UserScript==

(function () {
  'use strict';
  //缩略图相关
  // let source = document.querySelectorAll(".bili-album__preview__picture source[type=\"image/avif\"]");
  // 读取初始缩略图,并替换图片路径
  // function funSource() {
  //   for (let i = 0; i < source.length; i++) {
  //     source[i].srcset = source[i].srcset.replace(pattern, str);
  //   }
  // }
  // 更新所有初始的缩略图
  // const timeSource = setInterval(function () {
  //   if (source.length === 0) {
  //     source = document.querySelectorAll(".bili-album__preview__picture source[type=\"image/avif\"]");
  //   } else {
  //     // 读取初始缩略图,并替换图片路径
  //     funSource();
  //     clearInterval(timeSource);
  //   }
  // }, 600);
  
  // 读取图片目标
  let allMinImgDiv = document.querySelectorAll(".bili-album .bili-album__preview");
  let bigImg = document.querySelectorAll(".bili-album__watch .bili-album__watch__content img");
  const cvImg = document.querySelectorAll(".center .b-img__inner source[type=\"image/avif\"]");
  
  
  // 下滑时更新图片目标
  window.addEventListener("scroll", _.debounce(function () {
    //缩略图相关
    // source = document.querySelectorAll(".bili-album__preview__picture source[type=\"image/avif\"]");
    // funSource();
    
    allMinImgDiv = document.querySelectorAll(".bili-album .bili-album__preview");
    funAllMinImgDiv();
    bigImg = document.querySelectorAll(".bili-album__watch .bili-album__watch__content img");
  }, 1000));
  
  // 更新函数
  
  function funAllMinImgDiv() {
    // 判断是否点击图片
    for (let i = 0; i < allMinImgDiv.length; i++) {
      allMinImgDiv[i].addEventListener('click', function (e) {
        if (e.target.tagName === "IMG") {
          bigImg = document.querySelectorAll(".bili-album__watch .bili-album__watch__content img");
          refresh(i);
          // 判读是否有上一张，如果有执行替换函数
          const prev = document.querySelector(".bili-album__watch .bili-album__watch__content .bili-album__watch__content__prev");
          if (prev) {
            prev.addEventListener('click', function (e) {
              refresh(i);
              const next = document.querySelector(".bili-album__watch .bili-album__watch__content .bili-album__watch__content__next");
              next.addEventListener('click', function (e) {
                refresh(i);
              });
            });
          }
          // 判读是否有下一张，如果有执行替换函数
          const next = document.querySelector(".bili-album__watch .bili-album__watch__content .bili-album__watch__content__next");
          if (next) {
            next.addEventListener('click', function (e) {
              refresh(i);
              const prev = document.querySelector(".bili-album__watch .bili-album__watch__content .bili-album__watch__content__prev");
              prev.addEventListener('click', function (e) {
                refresh(i);
              });
            });
          }
        }
      });
    }
  }
  
  // 更新放大 图片目标
  const timeBigImg = setInterval(function () {
    if (bigImg === null) {
      bigImg = document.querySelector(".bili-album__watch .bili-album__watch__content img");
    } else {
      clearInterval(timeBigImg);
    }
  }, 1000);
  
  // 确定正则表达式
  const pattern = /@.*/,
    str = '';
  
  
  
  // 读取并替换专栏图片
  for (let i = 0; i < cvImg.length; i++) {
    cvImg[i].srcset = cvImg[i].srcset.replace(pattern, str);
  }
  
  // 替换大图路径函数
  function refresh(num) {
    const time = setInterval(function () {
      if (bigImg[num].src === location.href) {
      } else {
        bigImg[num].src = bigImg[num].src.replace(pattern, str);
        clearInterval(time);
      }
    }, 1000);
  }
  
  
  // 更新所有新得到的缩略图
  const timeAllMinImgDiv = setInterval(function () {
    if (allMinImgDiv.length === 0) {
      allMinImgDiv = document.querySelectorAll(".bili-album .bili-album__preview");
    } else {
      funAllMinImgDiv();
      clearInterval(timeAllMinImgDiv);
    }
  }, 1000);
})();