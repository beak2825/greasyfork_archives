// ==UserScript==
// @name         订烟神器(pc版)试用账号设置
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  none
// @author       You
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yimenapp.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467891/%E8%AE%A2%E7%83%9F%E7%A5%9E%E5%99%A8%28pc%E7%89%88%29%E8%AF%95%E7%94%A8%E8%B4%A6%E5%8F%B7%E8%AE%BE%E7%BD%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/467891/%E8%AE%A2%E7%83%9F%E7%A5%9E%E5%99%A8%28pc%E7%89%88%29%E8%AF%95%E7%94%A8%E8%B4%A6%E5%8F%B7%E8%AE%BE%E7%BD%AE.meta.js
// ==/UserScript==

//设置试用账号(下面公用库也要更新设置)
var text = document.createElement("p");
text.innerHTML = "试用开启 230605 230606";//这里设置试用账号
text.style.position = "absolute";
text.style.bottom = "20px";
text.style.left = "20px";
text.style.color = "transparent";//透明色用 transparent
document.body.appendChild(text);

setTimeout(function() {
    text.style.display = "none";// 将这一行改为显示文本,如果隐藏用 none 显示用 block
}, 100);