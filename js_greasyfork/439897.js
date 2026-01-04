// ==UserScript==
// @name         download
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  download pictures
// @author       yywc
// @include      /^https:\/\/www\.szwego\.com\/static\/index\.html\?t=./
// @include      /^https:\/\/www\.alibaba\.com\/product-detail/.*/
// @include      /^https:\/\/detail\.1688\.com/offer.*/
// @include      /^https:\/\/www\.facebook\.com\/groups/.*/
// @include      /^https:\/\/www\.amazon\.com\/.*/
// @icon         https://img.alicdn.com/imgextra/i4/O1CN01EYTRnJ297D6vehehJ_!!6000000008020-55-tps-64-64.svg
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/439897/download.user.js
// @updateURL https://update.greasyfork.org/scripts/439897/download.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const hostname = {
    'www.amazon.com': () => {
      return {
        imgList: Array.from(document.querySelectorAll('#altImages img')),
        regExp: /\._AC_SR38,50_/,
      };
    },
    'www.szwego.com': () => {
      return {
        imgList: Array.from(document.querySelectorAll('.w-1-3 img')),
        regExp: /\?.*/,
      };
    },
    'www.alibaba.com': () => {
      let imgList = [];
      const one = Array.from(document.querySelectorAll('#block-mainscreen-center img'));
      const two = Array.from(document.querySelectorAll('.main-list .main-item img'));
      return {
        imgList: one.length ? one : two,
        regExp: /_100.*/
      }
    },
    'detail.1688.com': () => {
      const arr = document.querySelector('.transverse-filter') || document.querySelector('.expand-view-list');
      const imgList = Array.from(arr.querySelectorAll('img'));
      return {
        imgList,
        regExp: /_sum.jpg/,
      };
    },
    'www.facebook.com': () => {
      const imgs = document.querySelectorAll('a img');
      const imgList = [];
      imgs.forEach(img => {
        if (
          img.attributes.referrerpolicy &&
          !img.alt &&
          !img.dataset.imgperflogname
        ) {
          imgList.push(img);
        }
      });
      return {
        imgList,
      };
    },
  };

  // Your code here...
  function downloadImage(url, name) {
    return new Promise(resolve => {
      const image = new Image();
      // 解决跨域 Canvas 污染问题
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
      image.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;

        canvas
          .getContext('2d')
          .drawImage(image, 0, 0, image.width, image.height);

        const a = document.createElement('a');

        a.download = name || new Date().getTime();
        a.href = canvas.toDataURL('image/png');
        a.dispatchEvent(new MouseEvent('click'));
        setTimeout(() => {
          resolve();
        }, 500);
      };
    });
  }

  let btn = document.querySelector('#oneKeyDownload');
  if (!btn) {
    btn = document.createElement('div');
    btn.textContent = '下载';
    btn.id = 'oneKeyDownload';
    btn.style.cssText = `
      position: fixed;
      bottom: 100px;
      right: 100px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: rgb(248, 218, 211);
      line-height: 50px;
      text-align: center;
      cursor: pointer;
      box-shadow: rgb(0 0 0 / 10%) 0px 0px 10px 1px;
      color: rgb(68, 68, 68);
      font-size: 14px;
      z-index: 99999;
      -webkit-user-select: none; /* Safari */
      -ms-user-select: none; /* IE 10+ and Edge */
      user-select: none; /* Standard syntax */
    `;
    document.body.appendChild(btn);
  }
  btn.onclick = async function click() {
    const { imgList, regExp } = hostname[location.hostname]();
    if (imgList.length) {
      for (const img of imgList) {
        const src = regExp ? img.src.replace(regExp, '') : img.src;
        await downloadImage(src);
      }
    } else {
      alert('未检测到可供下载的图片');
    }
  };
})();