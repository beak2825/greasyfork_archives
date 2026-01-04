// ==UserScript==
// @name        天翼云考试 测试
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @match       *://edu.ctyun.cn/exam/*
// @match       *://ctexam.mylearning.cn/pscexam/student/enterExam/*
// @grant       none
// @version     1.0
// @author      -
// @description 2023/9/13 20:20:01
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/479939/%E5%A4%A9%E7%BF%BC%E4%BA%91%E8%80%83%E8%AF%95%20%E6%B5%8B%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/479939/%E5%A4%A9%E7%BF%BC%E4%BA%91%E8%80%83%E8%AF%95%20%E6%B5%8B%E8%AF%95.meta.js
// ==/UserScript==


(function () {

  // 进行页面判断 判断是在外面页面还是考试页面
  unsafeWindow.onblur = null;
  Object.defineProperty(unsafeWindow, 'onblur', {
    set: function(v) {
      console.log('onblur',v)
    }
  });

  Object.defineProperty(unsafeWindow, 'onfocus', {
    set: function(v) {
      console.log('onfocus',v)
    }
  });

  console.log('运行切屏')

})();