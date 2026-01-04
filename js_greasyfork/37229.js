// ==UserScript==
// @name         google 加一个只显示中文结果的链接
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  nothing
// @author       You
// @match        https://www.google.com/search*
// @downloadURL https://update.greasyfork.org/scripts/37229/google%20%E5%8A%A0%E4%B8%80%E4%B8%AA%E5%8F%AA%E6%98%BE%E7%A4%BA%E4%B8%AD%E6%96%87%E7%BB%93%E6%9E%9C%E7%9A%84%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/37229/google%20%E5%8A%A0%E4%B8%80%E4%B8%AA%E5%8F%AA%E6%98%BE%E7%A4%BA%E4%B8%AD%E6%96%87%E7%BB%93%E6%9E%9C%E7%9A%84%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url = unsafeWindow.location.href;
    var newUrl = url + '&lr=lang_zh-CN';
    var link = document.createElement('a');
    link.href = newUrl;
    link.innerHTML = '只显示中文';
    var container = document.createElement('div');
    container.style = "position:fixed;left:10px;top:90px;z-index:999;";
    container.appendChild(link);
    document.body.appendChild(container);
    // Your code here...
})();