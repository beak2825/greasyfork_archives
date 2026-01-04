// ==UserScript==
// @name         精易论坛自动签到脚本
// @namespace    http://52shell.ltd/
// @version      1.3
// @description  自动点击签到按钮
// @author       Shell
// @match        https://bbs.125.la/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468271/%E7%B2%BE%E6%98%93%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/468271/%E7%B2%BE%E6%98%93%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
(function() {
    'use strict';
  
    // 检查localStorage中是否有日期值
  if (!localStorage.getItem('firstUseDate')) {
    // 如果没有日期值，说明是第一次使用，将当前日期存储到localStorage中
    localStorage.setItem('firstUseDate', new Date().toLocaleDateString());
    console.log('今日未签到，执行自动签到');
    qiandao();
  } else {
    // 如果有日期值，比较当前日期与存储的日期是否相同
    const storedDate = new Date(localStorage.getItem('firstUseDate'));
    const currentDate = new Date();
    if (storedDate.toLocaleDateString() !== currentDate.toLocaleDateString()) {
      // 如果日期不同，说明是新的一天，需要签到，执行相应的操作
      console.log('今日未签到，执行自动签到');
      qiandao();
    } else {
      console.log('今日已签到，不执行自动签到');
    }
  }
  
  
      function qiandao() {
      // 找到签到按钮元素
    console.log("开始查找签到按钮");
    var signBtn = document.querySelector(".qiandao1");
  
    // 如果找到了签到按钮元素，则模拟点击
    if (signBtn) {
      signBtn.click();
      console.log("签到按钮已被点击");
    }
  
    let index = 1;
    let intervalId = setInterval(() => {
      console.log("开始查找确定按钮");
      var btn = document.querySelector(".layui-layer-btn a.layui-layer-btn0");
      if (btn) {
        btn.click();
        console.log("确定按钮已被点击");
        clearInterval(intervalId); // 停止定时器
      }
    }, 20);
  }
  
  
  })();
  
  
  
  
