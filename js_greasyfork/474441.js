// ==UserScript==
// @name         iyingshi 看球去广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  iyingshi zhibo ad
// @match        *.aiyingshi.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aiyingshi.tv
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474441/iyingshi%20%E7%9C%8B%E7%90%83%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/474441/iyingshi%20%E7%9C%8B%E7%90%83%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    document.querySelector('.play-primary #ads').remove();

const injectCSS = css => {
  let el = document.createElement('style');
  el.type = 'text/css';
  el.innerText = css;
  document.head.appendChild(el);
  return el;
};

    injectCSS('.zb_main a > img {display: none}');


})();