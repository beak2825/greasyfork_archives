// ==UserScript==
// @name         掘金小册离线看
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  小册借阅看不完Ctrl+S保存至本地，文件名以章节序号命名，离线亦可点击目录跳转各章节，Chromium内核浏览器需为油猴插件开启"允许访问文件URL"权限。
// @author       hikey
// @match        file:///*.html
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460509/%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%E7%A6%BB%E7%BA%BF%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/460509/%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%E7%A6%BB%E7%BA%BF%E7%9C%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var elements = document.getElementsByClassName('section');
    for (var i = 0; i < elements.length; i++) {
        elements[i].setAttribute('href', './' + (i + 1) + '.html');
    }
})();