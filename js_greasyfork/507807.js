// ==UserScript==
// @name         ChatGPT
// @namespace    https://greasyfork.org/users/91873
// @version      1.0.0.0
// @description  ChatGPT key
// @match        https://sharedchat.fun/*
// @author       wujixian
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/507807/ChatGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/507807/ChatGPT.meta.js
// ==/UserScript==
(function () {
  //将function函数赋值给onload对象
  window.onload = function ()
  {
    setInterval(function () {
      if(document.querySelector("body > div.swal2-container.swal2-center.swal2-backdrop-show > div > div.swal2-actions > button.swal2-confirm.swal2-styled")!=null)
      {
        document.querySelector("body > div.swal2-container.swal2-center.swal2-backdrop-show > div > input.swal2-input").value="123456789ddddddddddddd444444444444sssss";
        document.querySelector("body > div.swal2-container.swal2-center.swal2-backdrop-show > div > div.swal2-actions > button.swal2-confirm.swal2-styled").click();
      }
    },3000);
  }
})();

