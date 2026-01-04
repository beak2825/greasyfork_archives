// ==UserScript==
// @name         evernote、zhihu 中转链接直跳
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  evernote 网页版点击链接中转页自动跳转
// @author       You
// @include      https://www.evernote.com/OutboundRedirect.action?dest=*
// @include      https://app.yinxiang.com/OutboundRedirect.action?dest=*
// @include      https://link.zhihu.com/?target=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397019/evernote%E3%80%81zhihu%20%E4%B8%AD%E8%BD%AC%E9%93%BE%E6%8E%A5%E7%9B%B4%E8%B7%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/397019/evernote%E3%80%81zhihu%20%E4%B8%AD%E8%BD%AC%E9%93%BE%E6%8E%A5%E7%9B%B4%E8%B7%B3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var link = document.location + "";
    var key = "?dest=";
    if (link.indexOf("zhihu")>-1) {
        key = "?target=";
    }
    document.location = decodeURIComponent(document.location.search.replace(key, ""));
})();