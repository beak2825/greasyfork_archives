// ==UserScript==
// @name         CSDN免登录复制
// @version      1.2
// @description  你还在为CSDN需要登录才能复制而感到头疼吗？使用这款脚本，轻松解决你的烦恼。无需登录即可复制代码块。目前仅支持在博客复制。使用说明：直接复制代码，不要点复制按钮。
// @author       zenglk
// @match        https://blog.csdn.net/*/article/details/*
// @icon         https://zenglingkun.cn/C.ico
// @grant        none
// @namespace https://greasyfork.org/users/952529
// @downloadURL https://update.greasyfork.org/scripts/450493/CSDN%E5%85%8D%E7%99%BB%E5%BD%95%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/450493/CSDN%E5%85%8D%E7%99%BB%E5%BD%95%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let codes= document.querySelectorAll("code");
    codes.forEach(c => {
        c.contentEditable = "true";
    });

})();