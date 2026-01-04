// ==UserScript==
// @name         T　
// @namespace    https://greasyfork.org/users/91873
// @version      1.0.0.1
// @description  TB　
// @match        https://login.taobao.com/member/login.jhtml
// @author       wujixian
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/407758/T.user.js
// @updateURL https://update.greasyfork.org/scripts/407758/T.meta.js
// ==/UserScript==
(function () {
  //将function函数赋值给onload对象
  window.onload = function ()
  {   
    document.querySelector("#fm-login-id").value = "2297557877zm";
    document.querySelector("#fm-login-password").value = "zhuimeng147";  
    document.querySelector("#login-form > div.fm-btn > button").click();
  }
})();