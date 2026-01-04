// ==UserScript==
// @name         Dogemanga Delads
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Delete Dogemanga Ads
// @author       IsaacKam
// @match        https://dogemanga.com/p/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466858/Dogemanga%20Delads.user.js
// @updateURL https://update.greasyfork.org/scripts/466858/Dogemanga%20Delads.meta.js
// ==/UserScript==

function hello() {
  console.info('Hello Dogemanga Delads!')
}

function getAdsArr() {
  const arr = [];
  try {
    arr.push(...Array.from(document.querySelectorAll('.fixed-bottom')))
  } catch (error) {
    console.error('getAdsArr error(.fixed-bottom):', error);
  }

  // console.info(111, arr);

  return arr;
}

function removeAds() {
  const arr = getAdsArr();

  if (!arr.length) {
    return console.warn(`removeAds warn: arr.length = ${arr.length}`);
  }

  for (const it of arr) {
    try {
      it.remove();
    } catch (error) {
      console.error('removeAds error:', error);
    }
  }
}

function hideAds() {
  try {
    const ads = document.querySelector('.site-last-page-ad-slot');
    if (!ads) {
      return;
    }
    ads.style = 'height: 0;overflow: hidden;';
    ads.classList = '';
  } catch (error) {
    console.error('hideAds error(.site-last-page-ad-slot):', error);
  }
}

function changeStyle() {
  const menu = document.querySelector('.site-navbar');
  menu.style = 'width: 50%;';

  const next = document.querySelector('.site-reader__next-link');
  next.style = [
    'width: 50%;',
    'position: fixed;',
    'top: 0;',
    'z-index: 1020;',
    'height: 24px;',
    'right: 0;',
    'background: white;'
  ].join('');

  const nextIcon = next.children[0];
  nextIcon.style = [
    'font-size: var(--bs-body-font-size);',
    'line-height: var(--bs-body-line-height);'
  ].join('')
}

function loop(cb, cnt = 1) {
  if (cnt <= 0) {
    return console.info('loop end!');
  }

  console.info(`loop rest ${cnt - 1}`);
  cb();

  setTimeout(() => {
    loop(cb, cnt - 1);
  }, 1000);
}

function main() {
  hello();

  loop(() => {
    removeAds();
    hideAds();
  }, 3);

  changeStyle();
}

(function() {
  'use strict';

  window.onload = main;
})();
