// ==UserScript==
// @name         禁闭
// @namespace    https://github.com/AngelCavalier/Front-end-foundation/blob/master/%E7%AA%97%E5%8F%A3%E5%85%B3%E9%97%AD.js
// @version      0.1
// @description  用于强制关闭想娱乐的网站，诸如虎牙、斗鱼、B站等。
// @author       AngelCavalier
// @match        http://*/*
// @grant        none
// @include     *://weibo.com/*
// @include     *://www.huya.com/*
// @include     *://www.douyu.com/*
// @include     *://dog99.tv/*
// @include     *://www.bilibili.com/*
// @downloadURL https://update.greasyfork.org/scripts/425532/%E7%A6%81%E9%97%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/425532/%E7%A6%81%E9%97%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

   var urlArray = ['weibo', 'huya', 'douyu', 'dog99', 'bilibili'];
var url = location.hostname;
console.log(url);

(function test() {
  for (var i = 0, len = urlArray.length; i < len; i++) {
    if (url.indexOf(urlArray[i]) !== -1) {
      alert('飘了你，滚去学习！！！');
      //sleep(1000).then(() => {
        Close();
     // });
    }
  }
})();

function Close() {
  window.opener = null;
  window.open('', '_self');
  window.close();
}

function sleep(time) {
  var p = new Promise((resolve) => {
    setTimeout(resolve, time);
  });
  return p;
}

})();