// ==UserScript==
// @name         切换文档语言至简体中文
// @namespace    https://github.com/Sunhelter/LearningFile/blob/master/UserScript/Chang.en-us.to.zh-CN.js
// @version      0.8.1
// @description  支持MSDN/MDN
// @author       Sunhelter
// @license      MIT
// @date         2019-05-15
// @match        *://docs.microsoft.com/*
// @match        *://learn.microsoft.com/*
// @match        *://support.microsoft.com/*
// @match        *://azure.microsoft.com/*
// @match        *://developer.mozilla.org/*
// @exclude      *://learn.microsoft.com/en-us/answers/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382679/%E5%88%87%E6%8D%A2%E6%96%87%E6%A1%A3%E8%AF%AD%E8%A8%80%E8%87%B3%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/382679/%E5%88%87%E6%8D%A2%E6%96%87%E6%A1%A3%E8%AF%AD%E8%A8%80%E8%87%B3%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87.meta.js
// ==/UserScript==

(function () {
    var url = window.location.href;
    var cnurl = window.location.href;

    if (url.indexOf("/en-us") > -1) {
        cnurl = url.replace('/en-us', '/zh-CN');
    }
    else if (url.indexOf("/en-US") > -1) {
        cnurl = url.replace('/en-US', '/zh-CN');
    }
    else if (url.indexOf("/zh-tw") > -1) {
        cnurl = url.replace('/zh-tw', '/zh-CN');
    }
    else if (url.indexOf("/zh-TW") > -1) {
        cnurl = url.replace('/zh-TW', '/zh-CN');
    }

    if (cnurl != url) {
        window.location.href = cnurl;
    }
})();