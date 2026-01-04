// ==UserScript==
// @name         sample erase
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  サンプルを消します
// @author       imomo
// @match        https://atcoder.jp/contests/*/tasks/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421871/sample%20erase.user.js
// @updateURL https://update.greasyfork.org/scripts/421871/sample%20erase.meta.js
// ==/UserScript==

 window.onload = function(){
     var elements = document.getElementsByClassName("lang-ja")[0];
     for(var i = elements.children.length - 1;0<=i;i--){
         if(elements.children[i].className === "io-style")break;
         else elements.removeChild(elements.children[i]);
     }
     elements.appendChild(document.createElement("hr"));
     var alertText = document.createElement("h3");
     alertText.innerHTML="<span style='color: red;'>スクリプトでサンプルを非表示にしています。<br>バチャ終了後このスクリプトをオフにしてください</span>";
     elements.appendChild(alertText);
 }