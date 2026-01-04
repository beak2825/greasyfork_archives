// ==UserScript==
// @name         mytokencap2cn
// @namespace    https://github.com/Sunhelter/LearningFile/blob/master/UserScript/Chang.en-us.to.zh-CN.js
// @version     0.0.2
// @description  设置 mytokencap.com 到中文，感谢原作者Sunhelter
// @author       Sunhelter
// @license      MIT
// @date         2023-04-06
// @match        *://www.mytokencap.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463409/mytokencap2cn.user.js
// @updateURL https://update.greasyfork.org/scripts/463409/mytokencap2cn.meta.js
// ==/UserScript==

(function () {
    var url = window.location.href;
    var cnurl = window.location.href;
    var LANG_ZH = "/zh/";

    if (url.endsWith(".com")) {
        cnurl += LANG_ZH;
    } else if (url.endsWith(".com/")) {
      cnurl += LANG_ZH;
    }
    else if (url.endsWith("/en-us")) {
        cnurl = url.replace('/en-us', LANG_ZH);
    }
    else if (url.endsWith("/en-US")) {
        cnurl = url.replace('/en-US', LANG_ZH);
    }
    else if (url.endsWith("/zh-tw")) {
        cnurl = url.replace('/zh-tw', LANG_ZH);
    }
    else if (url.endsWith("/zh-TW")) {
        cnurl = url.replace('/zh-TW', LANG_ZH);
    }

    if (cnurl != url) {
        window.location.href = cnurl;
    }
})();
