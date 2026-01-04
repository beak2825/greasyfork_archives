// ==UserScript==
// @name        关闭右下角与网页对话框
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.0
// @author      -
// @description 2023/11/21 15:46:10
// @downloadURL https://update.greasyfork.org/scripts/480602/%E5%85%B3%E9%97%AD%E5%8F%B3%E4%B8%8B%E8%A7%92%E4%B8%8E%E7%BD%91%E9%A1%B5%E5%AF%B9%E8%AF%9D%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/480602/%E5%85%B3%E9%97%AD%E5%8F%B3%E4%B8%8B%E8%A7%92%E4%B8%8E%E7%BD%91%E9%A1%B5%E5%AF%B9%E8%AF%9D%E6%A1%86.meta.js
// ==/UserScript==


setTimeout(close_window, 5000);

function close_window(){
  box = document.querySelector("#web-cat-message");
  box.style.display = 'none';
}
