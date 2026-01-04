// ==UserScript==
// @name        H2P: 网页界面清爽
// @namespace   http://tampermonkey.net/
// @version     0.0.2
// @icon        https://avatars1.githubusercontent.com/u/18672358?s=60&v=4
// @description 网页界面清爽
// @author      H2P
// @compatible  chrome
// @match       *://greasyfork.org/*/users/*
// @match       *://fanyi.baidu.com/*
// @note        2020.07.20-V0.0.01      近期评论、Script Sets
// @note        2020.07.31-V0.0.02      百度翻译界面清爽
// @downloadURL https://update.greasyfork.org/scripts/407446/H2P%3A%20%E7%BD%91%E9%A1%B5%E7%95%8C%E9%9D%A2%E6%B8%85%E7%88%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/407446/H2P%3A%20%E7%BD%91%E9%A1%B5%E7%95%8C%E9%9D%A2%E6%B8%85%E7%88%BD.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const $H2P = function (xpath, one = true) {
    if (one) { return document.querySelector(xpath); }
    else { return Array.from(document.querySelectorAll(xpath)); }
  }

  const isGF        = window.location.href.includes('csdn');
  const isBDTransl  = window.location.href.includes('fanyi.baidu');

  let eleStyle = document.createElement('style');

  if (isGF) {
    eleStyle.innerHTML += `
      #user-discussions, #user-conversations, #user-script-sets-section { display: none!important; }
    `;
  }
  else if (isBDTransl) {
    eleStyle.innerHTML += `
      .manual-trans-info, .trans-machine, .simultaneous-interpretation,
      .download-guide, #transOtherRight { display: none!important; }
    `;
    // 200 种
    eleStyle.innerHTML += `
      .select-to-language:after, .domain-trans-wrapper,
      .footer { display: none!important; }
    `;
  }

  document.head.appendChild(eleStyle);
})();