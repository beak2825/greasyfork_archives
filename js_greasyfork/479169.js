// ==UserScript==
// @name         NOI 报名网站免验证码登录
// @namespace    https://www.noi.cn/
// @version      0.1
// @description  移除 NOI 报名网站的登录验证码
// @author       d0j1a_1701
// @match        https://cspsjtest.noi.cn/
// @match        https://cspsj.noi.cn/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=noi.cn
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479169/NOI%20%E6%8A%A5%E5%90%8D%E7%BD%91%E7%AB%99%E5%85%8D%E9%AA%8C%E8%AF%81%E7%A0%81%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/479169/NOI%20%E6%8A%A5%E5%90%8D%E7%BD%91%E7%AB%99%E5%85%8D%E9%AA%8C%E8%AF%81%E7%A0%81%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 为什么会有人把验证码放在前端校验啊 唐
    var nod = document.getElementById ("codeImg");
    nod.parentNode.parentNode.removeChild (nod.parentNode);
})();