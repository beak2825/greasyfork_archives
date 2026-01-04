// ==UserScript==
// @name         eh-change-title
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  修改eh搜索页的标题，方便收藏网站
// @author       Y_jun
// @match        *://*.exhentai.org/*f_search=*
// @match        *://*.e-hentai.org/*f_search=*
// @license      MIT
// @icon         https://em-content.zobj.net/source/skype/289/black-nib_2712-fe0f.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466188/eh-change-title.user.js
// @updateURL https://update.greasyfork.org/scripts/466188/eh-change-title.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
        var context = "";
        if (r != null) {
            context = decodeURIComponent(r[2]);
        }
        reg = null;
        r = null;
        return context == null || context == "" || context == "undefined" ? "" : context;
    }

    // document.title = decodeURIComponent(window.location.href).slice(window.location.href.indexOf('=') + 1);
    var newTitle = decodeURIComponent(GetQueryString("f_search"));
    if (newTitle != null) {
        document.title = newTitle;
    }
})();