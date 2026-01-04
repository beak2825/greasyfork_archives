// ==UserScript==
// @name         shanbay word web phone optimize
// @namespace    https://github.com/x22x22
// @version      0.2
// @description  使用油猴脚本优化使用安卓端的yandex, Firefox等支持油猴插件的浏览器访问扇贝时对手机端界面的展示.
// @author       x22x22
// @match        https://www.shanbay.com/bdc/review/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373724/shanbay%20word%20web%20phone%20optimize.user.js
// @updateURL https://update.greasyfork.org/scripts/373724/shanbay%20word%20web%20phone%20optimize.meta.js
// ==/UserScript==

(function() {
  'use strict';
  let ua = navigator.userAgent.toLowerCase();
  let OLeft = 0;
  let viewWidth = window.innerWidth;
  if (/mobile|android|iphone|ipad|phone/i.test(ua) && viewWidth <= 767) {
    document.addEventListener('click', () => {
      let nextButtons = document.getElementsByClassName('continue continue-button');
      let progress = document.getElementsByClassName('row hide bottom-progress progress-box');
      if (progress && progress.length > 0) {
        progress[0].style.width = viewWidth - 120 + 'px';
      }
      if (
        nextButtons &&
        nextButtons.length === 1 &&
        (OLeft === 0 || nextButtons[0].style.left.replace('px', '') === OLeft)
      ) {
        OLeft = nextButtons[0].style.left.replace('px', '');
        nextButtons[0].style.left = OLeft - 620 + 'px';
      } else if (
        nextButtons &&
        nextButtons.length === 2 &&
        (OLeft === 0 || nextButtons[1].style.left.replace('px', '') === OLeft)
      ) {
        OLeft = nextButtons[0].style.left.replace('px', '');
        nextButtons[0].style.left = OLeft - 610 + 'px';
      }
    });
  }
})();
