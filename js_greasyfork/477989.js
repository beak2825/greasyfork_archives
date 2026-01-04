// ==UserScript==
// @name         网站验证码破解收集
// @namespace    https://seven-it-work.github.io/my-blog/
// @version      0.1
// @description  执行更新中...破解部分网站下载验证码，不关注无用公众号
// @author       SevenYjl
// @match        https://www.idejihuo.com/*
// @match        http://idea.94goo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=idejihuo.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477989/%E7%BD%91%E7%AB%99%E9%AA%8C%E8%AF%81%E7%A0%81%E7%A0%B4%E8%A7%A3%E6%94%B6%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/477989/%E7%BD%91%E7%AB%99%E9%AA%8C%E8%AF%81%E7%A0%81%E7%A0%B4%E8%A7%A3%E6%94%B6%E9%9B%86.meta.js
// ==/UserScript==

(function () {
  'use strict'
  if (window.location.href.includes('www.idejihuo.com')) {
    console.log('已经检测到网站', 'www.idejihuo.com')
    if (down_code) {
      console.log('激活码', down_code)
      document.getElementsByClassName('form-group')[0].innerHTML += (`<div style="color: red">已经破解验证码：${down_code}</div>`)
    }
  }
  if (window.location.href.includes('idea.94goo.com')) {
    console.log('已经检测到网站', 'idea.94goo.com')
    if (down_code) {
      console.log('激活码', down_code)
      document.getElementsByClassName('form-group')[0].innerHTML += (`<div style="color: red">已经破解验证码：${down_code}</div>`)
    }
  }

  // Your code here...
})()
