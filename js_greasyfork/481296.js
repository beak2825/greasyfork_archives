// ==UserScript==
// @name         低端影视辅助
// @namespace    FreezeNowDDYSHelper
// @version      1.0
// @description  自动切换到上次观看的集数
// @author       FreezeNow
// @match        *://ddys.pro/*
// @match        *://ddys.*/*
// @icon         https://ddys.pro/favicon-32x32.png
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481296/%E4%BD%8E%E7%AB%AF%E5%BD%B1%E8%A7%86%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/481296/%E4%BD%8E%E7%AB%AF%E5%BD%B1%E8%A7%86%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

'use strict';
const video = document.querySelector('video');

if (!video) {
  return;
}

const { origin, pathname, search } = location;

let playlist = document.querySelectorAll('.wp-playlist-caption');
const setClick = () => {
  playlist = document.querySelectorAll('.wp-playlist-caption');
  playlist.forEach((item, index) => {
    item.setAttribute('data-index', index + 1);
    item.addEventListener('click', (event) => {
      const { target } = event;
      if (!target) {
        return;
      }
      const ep = target.getAttribute('data-index');
      localStorage.setItem(pathname, ep);
    });
  });
};
setClick();
document.querySelector('.wp-playlist').addEventListener('click', (event) => {
  const { target } = event;
  if (target.className === 'wp-playlist-caption') {
    setClick();
  }
});

const lastEp = localStorage.getItem(pathname);
const searchList = search.replace('?', '').split('&');
let ep;
for (let i = 0; i < searchList.length; i++) {
  const element = searchList[i];
  const [key, value] = element.split('=');
  if (key === 'ep') {
    ep = value;
    localStorage.setItem(pathname, ep);
  }
}

if (!lastEp || ep === lastEp) {
  return;
}
playlist[lastEp - 1].click();
