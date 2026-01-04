// ==UserScript==
// @name         IAAA-auto-click
// @name:zh-CN   PKU IAAA 自动点击
// @namespace    arkcia/iaaa-auto-click
// @version      0.5
// @description  Assuming that the credentials are filled in by the browser, this script clicks the big red button for you.
// @description:zh-cn 浏览器帮你填充用户名和密码，这个脚本帮你点登录按钮。
// @author       Arkcia
// @match        https://iaaa.pku.edu.cn/iaaa/oauth.jsp*
// @icon         https://iaaa.pku.edu.cn/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478157/IAAA-auto-click.user.js
// @updateURL https://update.greasyfork.org/scripts/478157/IAAA-auto-click.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const infoMsg = 'IAAA auto clicking...';
    console.log(infoMsg);
    document.getElementById('msg').textContent = infoMsg;

    function clicker(){
        const username = document.getElementById("user_name").value;
        const password = document.getElementById("password").value;
        if (username && password){
            document.getElementById('logon_button').click();
        }
        else{
            setTimeout(clicker, 100);
        }
    }

    setTimeout(clicker, 0);
})();