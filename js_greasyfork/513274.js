// ==UserScript==
// @name         运维系统用户名密码
// @namespace    https://greasyfork.org/users/91873
// @version      1.0.0.0
// @description  User key
// @match        https://190.2.36.67/bhost/*
// @author       wujixian
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/513274/%E8%BF%90%E7%BB%B4%E7%B3%BB%E7%BB%9F%E7%94%A8%E6%88%B7%E5%90%8D%E5%AF%86%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/513274/%E8%BF%90%E7%BB%B4%E7%B3%BB%E7%BB%9F%E7%94%A8%E6%88%B7%E5%90%8D%E5%AF%86%E7%A0%81.meta.js
// ==/UserScript==
(function () {
  //将function函数赋值给onload对象
  window.onload = function ()
  {
    setInterval(function () {
      if(document.querySelector("#uCode")!=null)
      {
        document.querySelector("#uCode").value="711103";
        document.querySelector("#pW").value="CK_password2";
      }
    },3000);
  }
})();

