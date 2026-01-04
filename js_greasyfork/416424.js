// ==UserScript==
// @name         b站多倍速调节（支持视频）已支持自动变速
// @namespace    lgldlk
// @version      1.1
// @description  b站多倍速调节（支持视频）已支持自动变速🤞🤞🤞~~~
// @author       lgldlk
// @include      *://*.bilibili.com/video/*
// @include      *://*.bilibili.tv/video/*
// @include      *://*.bilibili.com/bangumi/*
// @include      *://*.bilibili.tv/bangumi/*
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/416424/b%E7%AB%99%E5%A4%9A%E5%80%8D%E9%80%9F%E8%B0%83%E8%8A%82%EF%BC%88%E6%94%AF%E6%8C%81%E8%A7%86%E9%A2%91%EF%BC%89%E5%B7%B2%E6%94%AF%E6%8C%81%E8%87%AA%E5%8A%A8%E5%8F%98%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/416424/b%E7%AB%99%E5%A4%9A%E5%80%8D%E9%80%9F%E8%B0%83%E8%8A%82%EF%BC%88%E6%94%AF%E6%8C%81%E8%A7%86%E9%A2%91%EF%BC%89%E5%B7%B2%E6%94%AF%E6%8C%81%E8%87%AA%E5%8A%A8%E5%8F%98%E9%80%9F.meta.js
// ==/UserScript==
let cacheRate = 1,
  cacheFlag = true,
  rateArr = [5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5, 0.1];

let selector = document.querySelector.bind(document);

function waitForNode(nodeSelector, callback) {
  if (nodeSelector()) {
    callback();
  } else {
    setTimeout(() => {
      waitForNode(nodeSelector, callback);
    }, 300);
  }
}
function debounce(func, wait) {
  let timer;
  return function () {
    let args = arguments;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}
function deleteChild(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

const key = 'lgldl_rate_key';

function setRate(video, rate) {
  video.playbackRate = rate;
  cacheRate = rate;
  localStorage.setItem(key, rate);
  setRateText(rate);
}

function setRateText(rate) {
  const rateElement = selector('.bpx-player-ctrl-playbackrate-result');
  if (rateElement) {
    rateElement.innerText = `${rate}x`;
  }
}

const initRateBody = function (callBack) {
  waitForNode(
    () => selector('ul.bpx-player-ctrl-playbackrate-menu'),
    () => {
      const menuNode = selector('ul.bpx-player-ctrl-playbackrate-menu');
      cacheRate = Number(localStorage.getItem(key) || 1);
      const videoElement = selector('video') || selector('bwp-video');
      if (!videoElement) {
        alert('清空缓存后刷新即可使用');
        return;
      }

      deleteChild(menuNode);
      rateArr.forEach((rate) => {
        const rateItem = document.createElement('li');
        rateItem.classList.add('bpx-player-ctrl-playbackrate-menu-item');
        rateItem.innerText = `${rate}x`;
        rateItem.style.height = '30px';
        rateItem.style.fontSize = '16px';
        rateItem.style.lineHeight = '30px';
        rateItem.addEventListener('click', () => {
          setRate(videoElement, rate);
        });
        menuNode.appendChild(rateItem);
      });

      const applyCachedRate = () => {
        if (cacheRate !== videoElement.playbackRate) {
          setRate(videoElement, cacheRate);
        }
      };
      applyCachedRate();
      videoElement.addEventListener('playing', applyCachedRate);
      callBack && callBack();
    }
  );
};
window.addEventListener('load', () => initRateBody(null));
window.onhashchange = () => initRateBody();
