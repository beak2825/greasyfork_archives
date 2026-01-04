// ==UserScript==
// @name     yosupo judge copy button
// @version  1
// @grant    none
// @author   tomboftime
// @namespace https://twitter.com/tomboftime
// @description yosupo judgeのサンプルinputにコピーボタンをつけます。
// @match    https://judge.yosupo.jp/problem/*
// @require  https://cdn.jsdelivr.net/npm/clipboard@2/dist/clipboard.min.js
// @downloadURL https://update.greasyfork.org/scripts/393766/yosupo%20judge%20copy%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/393766/yosupo%20judge%20copy%20button.meta.js
// ==/UserScript==
new ClipboardJS('.btn');

var pres = document.getElementsByTagName('pre'); 

for (var i = 0; i < pres.length; i++) {
  var pre = pres[i];
  if (pre.childElementCount == 0){
   //console.log(pre);
   var data = pre.childNodes[0].data;
   //console.log(data);
   var button = document.createElement("button");
   button.className = 'btn';
   button.innerHTML = "copy";
   button.setAttribute("data-clipboard-text",data);
    pre.parentNode.insertBefore(button, pre);
  }
}