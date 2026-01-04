// ==UserScript==
// @name        Time Limit Emphasizer
// @namespace   https://github.com/Ogtsn99
// @version      1.2
// @description AtCoderで問題の実行時間制限が2 secでない場合にちょっと主張を激しくする。
// @include     https://atcoder.jp/contests/*/tasks/*
// @auther Ogtsn99
// @downloadURL https://update.greasyfork.org/scripts/406381/Time%20Limit%20Emphasizer.user.js
// @updateURL https://update.greasyfork.org/scripts/406381/Time%20Limit%20Emphasizer.meta.js
// ==/UserScript==
var pTags = document.getElementsByTagName("p");
var length = pTags.length;
for (var i = 0; i < length; i++) {
  if (pTags[i].textContent.match(/実行時間制限:.*メモリ制限:.*/)) {
    var str = pTags[i].textContent.split(' ');
    if(str[1] !== '2'){
        pTags[i].innerHTML = str[0] + '<span style="color: red; font-size: 28px; "> ' + str[1] + '</span>' + ' ' + str[2] + ' ' + str[3] + ' ' + str[4] + ' ' + str[5] + ' ' + str[6];
    }
    break;
  }
}