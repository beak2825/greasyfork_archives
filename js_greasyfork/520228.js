// ==UserScript==
// @name         B站暗黑模式 Bilibili dark mode
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  B站暗黑模式
// @author       zhyib
// @match        https://*.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520228/B%E7%AB%99%E6%9A%97%E9%BB%91%E6%A8%A1%E5%BC%8F%20Bilibili%20dark%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/520228/B%E7%AB%99%E6%9A%97%E9%BB%91%E6%A8%A1%E5%BC%8F%20Bilibili%20dark%20mode.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const styleSheet = {
    '--bg1': '#101010',
    '--bg3': '#101010',
    '--Ga0': '#151515',
    '--Ga0_s': '#151515',
    '--Ga0_t': '#151515',
    '--Ga1': '#101010',
    '--Ga1_s': '#101010',
    '--Ga1_t': '#101010',
    '--Ga1_e': '#101010',
    '--Ga2': '#303030',
    '--Ga2_t': '#303030',
    '--Ga3': '#505050',
    '--Ga3_t': '#505050',
    '--Ga4': '#707070',
    '--Ga4_t': '#707070',
    '--Ga5': '#909090',
    '--Ga5_t': '#909090',
    '--Ga6': '#A0A0A0',
    '--Ga6_t': '#A0A0A0',
    '--Ga7': '#B0B0B0',
    '--Ga7_t': '#B0B0B0',
    '--Ga8': '#D0D0D0',
    '--Ga8_t': '#D0D0D0',
    '--Ga9': '#F0F0F0',
    '--Ga9_t': '#F0F0F0',
    '--Ga10': '#FFFFFF',
    '--Ga10_t': '#FFFFFF',
    '--Ga11': '#101010',
    '--Ga12': '#202020',
    '--Ga12_s': '#151515',
    '--Ga13': '#202020',
    '--Ga13_s': '#202020',
    //
    '--Wh0': '#000',
    '--Wh0_t': '#000',
    '--Ba0': '#fff',
    '--Ba0_s': '#fff',
    '--Ba0_t': '#fff',
    //
    '--Wh0_rgb': '0, 0, 0',
    '--Ga0_rgb': '21, 21, 21',
    '--Ga0_s_rgb': '21, 21, 21',
    '--Ga1_rgb': '16, 16, 16',
    '--Ga1_s_rgb': '16, 16, 16',
    '--Ga2_rgb': '48, 48, 48',
    '--Ga3_rgb': '80, 80, 80',
    '--Ga5_rgb': '144, 144, 144',
    '--Ga7_rgb': '176, 176, 176',
    '--Ga10_rgb': '0, 0, 0',
    '--Ga11_rgb': '0, 0, 0',
    '--Ga12_rgb': '10, 10, 10',
    '--Ba0_rgb': '0, 0, 0',
  };
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    // force change global css variables
    const html = document.getElementsByTagName('html')[0];
    Object.entries(styleSheet).forEach(([k, v]) => {
      html.style.setProperty(k, v);
    })

    // activity pages
    const bg = document.getElementsByClassName('bg')[0];
    bg?.style.setProperty('background-image', `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), ${getComputedStyle(bg).getPropertyValue('background-image')}`)

    // message pages
    setTimeout(() => {
      const messageBg = document.getElementsByClassName('message-bg')[0];
      messageBg?.style.setProperty('background-image', `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), ${getComputedStyle(messageBg).getPropertyValue('background-image')}`)
    }, 1000)
  }
})();