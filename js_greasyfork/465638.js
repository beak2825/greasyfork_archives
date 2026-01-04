// ==UserScript==
// @name         fishcc 自动回复
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  fishcc 自动回复，早日积分满满
// @author       denglibing
// @match        https://fishc.com.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
//  @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465638/fishcc%20%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/465638/fishcc%20%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D.meta.js
// ==/UserScript==

(function () {
  'use strict';
  console.log('脚本开始');

  var message = document.querySelector('#fastpostmessage');
  message.value = '我的偶像 fishcc ' + Math.random();

  var fastpostsubmit = document.querySelector('#fastpostsubmit');
  fastpostsubmit.click();

  console.log('脚本开始');
})();
