// ==UserScript==
// @name         漫画拼页加载器（hanime1.me）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动加载 hanime1.me 的所有漫画页面图片，实现拼页效果
// @match        https://hanime1.me/comic/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533383/%E6%BC%AB%E7%94%BB%E6%8B%BC%E9%A1%B5%E5%8A%A0%E8%BD%BD%E5%99%A8%EF%BC%88hanime1me%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/533383/%E6%BC%AB%E7%94%BB%E6%8B%BC%E9%A1%B5%E5%8A%A0%E8%BD%BD%E5%99%A8%EF%BC%88hanime1me%EF%BC%89.meta.js
// ==/UserScript==

(window.onload=function () {
    'use strict';

    // 获取漫画信息
const wrapper = document.querySelector('#comic-content-wrapper');
let now = 5;

for (let i = 1; i <= 5; i++) {
  const img = document.createElement('img');
  img.src = `https://i2.nhentai.net/galleries/2955918/${i}.jpg`;
  img.style.width = '100%';
  img.style.marginBottom = '10px';
  wrapper.appendChild(img);
}

  // 懒加载滚动监听
  window.addEventListener('scroll', () => {
      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
      if(nearBottom){
          for (let i = now+1; i <= now+5; i++) {
              const img = document.createElement('img');
              img.src = `https://i2.nhentai.net/galleries/2955918/${i}.jpg`;
              img.style.width = '100%';
              img.style.marginBottom = '10px';
              wrapper.appendChild(img);
          }
          now = now+5;
          console.log('bottom');
      }
  });

})();
