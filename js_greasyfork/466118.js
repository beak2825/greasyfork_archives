// ==UserScript==
// @name         TMS_Login
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  TPV TMS系统登录，需三个月修改一次账号密码
// @author       You
// @match        http://172.16.30.90:8000/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=30.90
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466118/TMS_Login.user.js
// @updateURL https://update.greasyfork.org/scripts/466118/TMS_Login.meta.js
// ==/UserScript==

(function() {
    'use strict';
     //无需请求服务器端
    //仅输入一次
    var checkInterval = setInterval(function()
        {
        var span=document.getElementById("lblMsg");
        if(span && span.innerText!=="")
        {
           clearInterval(checkInterval)
         }
          else
          {
            document.getElementById("txtUserID").focus()
            document.getElementById("txtUserID").click()//清除水印文本干扰
            document.getElementById("txtUserID").value=""//输入名字
            document.getElementById("txtUserPass").focus()
            document.getElementById("txtUserPass").click()
            document.getElementById("txtUserPass").value=""//输入密码
            document.getElementById("ibtLogon").click()
          }

        },500)

})();