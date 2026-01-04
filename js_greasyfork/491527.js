// ==UserScript==
// @name         切换SynologyKB网站语言
// @namespace    wakaka9
// @version      0.2
// @description  支持SynologyKB
// @author       wakaka9
// @license      MIT
// @match        *://kb.synology.cn/*
// @match        *://kb.synology.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491527/%E5%88%87%E6%8D%A2SynologyKB%E7%BD%91%E7%AB%99%E8%AF%AD%E8%A8%80.user.js
// @updateURL https://update.greasyfork.org/scripts/491527/%E5%88%87%E6%8D%A2SynologyKB%E7%BD%91%E7%AB%99%E8%AF%AD%E8%A8%80.meta.js
// ==/UserScript==

(function () {
    var url = window.location.href;
    var cnurl = window.location.href;

    if (url.indexOf("com/zh-cn") > -1) {
        cnurl = url.replace('com/zh-cn', 'com/en-global');
    }
    else if (url.indexOf("cn/en-global") > -1) {
        cnurl = url.replace('cn/en-global', 'cn/zh-cn');
    }
    else if (url.indexOf("com/zh-tw") > -1) {
        cnurl = url.replace('com/zh-tw', 'com/en-global');
    }

    if (cnurl != url) {
        window.location.href = cnurl;
    }
})();