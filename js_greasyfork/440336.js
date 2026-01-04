// ==UserScript==
// @name         acfun牌子名称长度限制
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  acfun牌子名称长度限制，防止外语文本溢出导致阅读困难
// @author       泥壕
// @match        https://live.acfun.cn/live/*
// @icon         https://cdn.aixifan.com/ico/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/440336/acfun%E7%89%8C%E5%AD%90%E5%90%8D%E7%A7%B0%E9%95%BF%E5%BA%A6%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/440336/acfun%E7%89%8C%E5%AD%90%E5%90%8D%E7%A7%B0%E9%95%BF%E5%BA%A6%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function ready (fn) {
    if (document.readyState != 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }
  console.log('ready');

  ready(() => {
    const inject = document.createElement('style')
    inject.innerHTML = `
    .medal-wrapper .medal-name {
        max-width: 52px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    `
    document.querySelector('head').appendChild(inject)
    console.log('inject', inject);
  })
})();