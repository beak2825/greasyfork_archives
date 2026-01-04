// ==UserScript==
// @name         解除神马文学网页屏蔽
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  解决神马文学网的桌面端封禁
// @author       HDogs&ZZM-user
// @match        https://m.qbfuli.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430788/%E8%A7%A3%E9%99%A4%E7%A5%9E%E9%A9%AC%E6%96%87%E5%AD%A6%E7%BD%91%E9%A1%B5%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/430788/%E8%A7%A3%E9%99%A4%E7%A5%9E%E9%A9%AC%E6%96%87%E5%AD%A6%E7%BD%91%E9%A1%B5%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var body = document.getElementsByTagName("body")[0];
    body.style.display="block";
})();