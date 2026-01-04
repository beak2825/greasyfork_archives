// ==UserScript==
// @name         恢复LOL极速下载器
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  lol客户端下载显示极速下载器，防止绑定WeGame下载客户端
// @author       syczuan
// @match        *://lol.qq.com/download.shtml*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/444497/%E6%81%A2%E5%A4%8DLOL%E6%9E%81%E9%80%9F%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/444497/%E6%81%A2%E5%A4%8DLOL%E6%9E%81%E9%80%9F%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  "use strict";
  let media = document.getElementById("media");
  let ofh = media.getElementsByClassName("ofh")[0];
  let comment = ofh.childNodes[1];
  let liNotes = comment.nodeValue;
  let li = document.createElement("li");
  li.innerHTML = liNotes;
  let downlst = li.getElementsByClassName("downlst")[0];
  ofh.appendChild(downlst);
})();
