// ==UserScript==
// @name         早教中国网无限制下载
// @namespace    https://greasyfork.org/zh-CN/scripts/369492-%E6%97%A9%E6%95%99%E4%B8%AD%E5%9B%BD%E7%BD%91%E6%97%A0%E9%99%90%E5%88%B6%E4%B8%8B%E8%BD%BD
// @version      0.1.1
// @description  try to take over the world!
// @author       OneBe
// @match        *.zaojiao-china.com/*
// @match        *.zaojiao-china.com/member/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369492/%E6%97%A9%E6%95%99%E4%B8%AD%E5%9B%BD%E7%BD%91%E6%97%A0%E9%99%90%E5%88%B6%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/369492/%E6%97%A9%E6%95%99%E4%B8%AD%E5%9B%BD%E7%BD%91%E6%97%A0%E9%99%90%E5%88%B6%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

var elements=document.getElementsByClassName("allTransparents")[0];
    elements.parentNode.removeChild(elements);

})();