// ==UserScript==
// @name         NOI CSP 报名网站登录验证码
// @namespace    https://www.noi.cn/
// @version      1.04
// @description  自动填写 NOI CSP 报名网站的登录验证码
// @author       jyking
// @match        https://cspsjtest.noi.cn/index.php
// @match        https://cspsjtest.noi.cn/
// @match        https://cspsj.noi.cn/index.php
// @icon         https://img0.baidu.com/it/u=2201951013,611923802&fm=253&fmt=auto&app=138&f=JPEG?w=100&h=100
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510674/NOI%20CSP%20%E6%8A%A5%E5%90%8D%E7%BD%91%E7%AB%99%E7%99%BB%E5%BD%95%E9%AA%8C%E8%AF%81%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/510674/NOI%20CSP%20%E6%8A%A5%E5%90%8D%E7%BD%91%E7%AB%99%E7%99%BB%E5%BD%95%E9%AA%8C%E8%AF%81%E7%A0%81.meta.js
// ==/UserScript==

(async function () {
    await new Promise(resolve => setTimeout(resolve, 1000));
    $(function() {
        let code_382 = $("#hiddenCheckCode").val();
        $("#checkCode").val(code_382)
    });
})();