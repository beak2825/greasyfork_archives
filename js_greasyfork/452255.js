// ==UserScript==
// @name         心理测试-打开自动跳转
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  这是一个用来自动完成心理测试的脚本，你只需要打开测试页面启动该脚本，并开启自动跳转，它就会帮你点击第一个选项，小心使用哦，有时候第一个选项还有点可怕
// @author       Scream
// @match        http://neuq.psy-cloud.net/user/web-v2/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=psy-cloud.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452255/%E5%BF%83%E7%90%86%E6%B5%8B%E8%AF%95-%E6%89%93%E5%BC%80%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/452255/%E5%BF%83%E7%90%86%E6%B5%8B%E8%AF%95-%E6%89%93%E5%BC%80%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function () {
  'use strict';
  console.log("helloworld");
  // Your code here...
  var i = 0
  var timer = setInterval(function () {
    i++
    var a = document.querySelector('.question_options')
    var len = a.children.length
    for (var i = 0; i < len; i++) {
      if (i === 0) {
        a.children[i].className = 'active'
      } else {
        a.children[i].className = ''
      }
    }
    document.querySelector('.active').click()
    if (i === 100) {
      clearInterval(timer)
    }
  }, 300);
})();
