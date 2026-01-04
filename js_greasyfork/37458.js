// ==UserScript==
// @name         规则管理平台验证码自动填入
// @namespace    https://github.com/zhaojun0193
// @version      0.3
// @description  规则管理平台验证码自动填入(自用)
// @author       zhaojun
// @match        http://*/groupama/*
// @match        http://localhost:9999/*/web/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37458/%E8%A7%84%E5%88%99%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B0%E9%AA%8C%E8%AF%81%E7%A0%81%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/37458/%E8%A7%84%E5%88%99%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B0%E9%AA%8C%E8%AF%81%E7%A0%81%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
	var code =document.getElementById("checkCode").innerText;
	document.getElementById("inputCode").value = code;
})();