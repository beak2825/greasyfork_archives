// ==UserScript==
// @name         acfun自动投蕉
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  已关注up主的视频、文章自动投5蕉，无任何依赖，原生操作
// @author       泥壕
// @match        https://www.acfun.cn/v/*
// @match        https://www.acfun.cn/a/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438123/acfun%E8%87%AA%E5%8A%A8%E6%8A%95%E8%95%89.user.js
// @updateURL https://update.greasyfork.org/scripts/438123/acfun%E8%87%AA%E5%8A%A8%E6%8A%95%E8%95%89.meta.js
// ==/UserScript==

(function () {
  'use strict';
  function ready (fn) {
    if (document.readyState != 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }
  /**
   * 吃我大蕉
   * @param {String} className 香蕉列表class
   */
  function bananaEat (className) {
    document.querySelector(`.${className}[data-num="5"]`).click()
    console.log('= auto banana done =');
  }
  ready(() => {
    if (location.href.includes('/v/')) {
      // 视频页面
      const staffArea = document.querySelector('.staff-area')
      if (staffArea) {
        // 合作稿件
        if (!staffArea.querySelector('.up-details .follow').className.includes('hidden')) {
          // 未关注
          return
        }
      } else {
        // 独立稿件
        if (!document.querySelector('.follow-up').className.includes('followed')) {
          // 未关注
          return
        }
      }
      if (document.querySelector('.action-area .banana').className.includes('active')) {
        // 已投蕉
        return
      }
      bananaEat('banana')
    } else {
      // 文章页面
      setTimeout(() => {
        if (document.querySelector('.up-operate .focus').textContent === '关注') {
          // 未关注
          return
        }
        if (document.querySelector('#article-operation .bananacount').className.includes('active')) {
          // 已投蕉
          return
        }
        bananaEat('bananaer')
      }, 3000)
    }
  })
})();