// ==UserScript==
// @name         followin2cn
// @namespace    https://github.com/Sunhelter/LearningFile/blob/master/UserScript/Chang.en-us.to.zh-CN.js
// @version     0.0.2
// @description  设置 https://followin.io/ 到中文，感谢原作者Sunhelter
// @author       fz420@qq.com
// @license      MIT
// @date         2023-04-06
// @match        *://followin.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463472/followin2cn.user.js
// @updateURL https://update.greasyfork.org/scripts/463472/followin2cn.meta.js
// ==/UserScript==

(function () {
    var url = window.location.href;
    var cnurl = window.location.href;
    var LANG_ZH = "/zh-Hans";
    var LANG_TW = "/zh-Hant";


    if (url.indexOf(LANG_TW)) {
        cnurl = url.replace(LANG_TW, LANG_ZH);
    }


    if (cnurl != url) {
        window.location.href = cnurl;
    }
})();
