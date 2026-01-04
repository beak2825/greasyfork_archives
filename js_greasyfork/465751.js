// ==UserScript==
// @name         bbs.tampermonkey.net自动回复+自动签到
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  bbs.tampermonkey.net自动回复(会有验证码拦截，不知道怎么处理)+自动签到
// @author       denglibing
// @match        https://bbs.tampermonkey.net.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465751/bbstampermonkeynet%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D%2B%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/465751/bbstampermonkeynet%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D%2B%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var href = document.location.href;
  console.log('当前页面地址为：' + href);

  if (href.includes('/thread-')) {
    console.log('自动回复脚本开始');

    var fastpostmessage = document.querySelector('#fastpostmessage');
    fastpostmessage.value = '我的偶像 tampermonkey ' + Math.random() * 1000;

    var fastpostsubmit = document.querySelector('#fastpostsubmit');
    fastpostsubmit.click();

    console.log('自动回复脚本结束');
  } else if (href.includes('/dsu_paulsign')) {
    console.log('自动签到脚本开始');

    var kx = document.querySelector('#kx');
    if (kx == undefined) {
      console.log('自动签到脚本结束-今日已经签到');
      return;
    }
    kx.click();

    //通常获取的是表单标签name
    var inputs = document.getElementsByName('qdmode');
    console.log(inputs);
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].value = '2';
    }

    // 执行签到事件
    showWindow('qwindow', 'qiandao', 'post', '0');

    console.log('自动签到脚本结束');
  }
})();
