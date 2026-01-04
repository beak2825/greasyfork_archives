// ==UserScript==
// @name        XJTU思源学习空间课程回放体验优化
// @namespace   zaqai
// @match       *://v.ispace.xjtu.edu.cn/replay-frame/*
// @grant       none
// @version     1.0
// @author      zaqai
// @description 原回放网址http://ispace.xjtu.edu.cn/course/16777/learning-activity太坑了, 用了iframe嵌入*://v.ispace.xjtu.edu.cn/replay-frame/*, 导致获取不到元素, 解决方法就是将脚本作用于*://v.ispace.xjtu.edu.cn/replay-frame/*, 油猴检测到iframe, 也会起作用
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/483110/XJTU%E6%80%9D%E6%BA%90%E5%AD%A6%E4%B9%A0%E7%A9%BA%E9%97%B4%E8%AF%BE%E7%A8%8B%E5%9B%9E%E6%94%BE%E4%BD%93%E9%AA%8C%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/483110/XJTU%E6%80%9D%E6%BA%90%E5%AD%A6%E4%B9%A0%E7%A9%BA%E9%97%B4%E8%AF%BE%E7%A8%8B%E5%9B%9E%E6%94%BE%E4%BD%93%E9%AA%8C%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==


  'use strict'
  // 创建一个点击事件处理函数
  function simulateClick() {
    // 选择要点击的元素
    var elementToClick = document.querySelector("#multi-player > div.mvp-player-controls > div.mvp-controls-left-area > button > i");

    // 创建一个鼠标点击事件
    var clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });

    // 触发点击事件
    elementToClick.dispatchEvent(clickEvent);
  }

// 监听键盘事件
  document.addEventListener('keydown', function(event) {
    // 检查是否按下的是空格键（键码为32）
    if (event.keyCode === 32) {
    // 阻止默认行为（防止空格键触发滚动）
    event.preventDefault();
      // 调用 simulateClick() 函数
      simulateClick();
    }
  });

// 设置定时器等待iframe加载完成
var timer = setInterval(function() {
  var targetElement = document.querySelector("#multi-player > div.mvp-videos-box");
  if (targetElement) {
    console.log("找到了指定的元素：", targetElement);
    clearInterval(timer);
    targetElement.addEventListener('click', simulateClick);
  }else {
    console.log("未找到指定的元素。");
  }
}, 3000); // 每隔一秒钟尝试一次获取元素


