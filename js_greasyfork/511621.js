// ==UserScript==
// @name         NOI报名网站再也不用验证码啦
// @namespace    http://limit-bed.com/
// @version      1.1.0
// @description  启动脚本，打开 <https://cspsjtest.noi.cn/> 后，验证码一栏直接消失。点登陆即可。
// @license MIT
// @author       Lim Watt
// @match        https://cspsjtest.noi.cn/*
// @icon         https://cspsjtest.noi.cn/resource/images/noi2.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511621/NOI%E6%8A%A5%E5%90%8D%E7%BD%91%E7%AB%99%E5%86%8D%E4%B9%9F%E4%B8%8D%E7%94%A8%E9%AA%8C%E8%AF%81%E7%A0%81%E5%95%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/511621/NOI%E6%8A%A5%E5%90%8D%E7%BD%91%E7%AB%99%E5%86%8D%E4%B9%9F%E4%B8%8D%E7%94%A8%E9%AA%8C%E8%AF%81%E7%A0%81%E5%95%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    let ele = document.getElementById('checkCode').parentNode;
    ele.innerHTML = "";
})();