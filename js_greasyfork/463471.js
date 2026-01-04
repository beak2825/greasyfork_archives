// ==UserScript==
// @name         非官方页面自动跳转
// @version      1.0.0
// @description  当前页面非官方页面自动跳转
// @author       Haibara.Ai
// @namespace    https://greasyfork.org/users/1055254
// @match        *://c.pc.qq.com/*
// @match        *://link.zhihu.com/*
// @match        *://link.juejin.cn/*
// @match        *://www.jianshu.com/go-wild?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463471/%E9%9D%9E%E5%AE%98%E6%96%B9%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/463471/%E9%9D%9E%E5%AE%98%E6%96%B9%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

function urlParam(name)
{
    var reg = new RegExp("[\?&]?"+ name +"=([^&]*)");
    var result = window.location.search.substr().match(reg);
    if (result != null) return unescape(result[1]); return null;
}

(function() {
    'use strict';
    var url = null;
    switch (window.location.host) {
        case "c.pc.qq.com":
            url = urlParam('pfurl');
            if (url == null) {
                url = urlParam('url');
            }
            break;
        case "link.zhihu.com":
            url = urlParam('target');
            break;
        case "link.juejin.cn":
            url = urlParam('target');
            break;
        case "www.jianshu.com":
            url = urlParam('url');
            break;
        default:
            url = null;
    }
    if (url != null) window.location.href = url;
})();
