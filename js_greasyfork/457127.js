// ==UserScript==
// @name         Note.ms网页标题篡改
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  note.ms上，任何页面的标题都是“Note.ms”，这对收藏、整理note.ms的页面、标签页、查找note.ms的浏览器历史记录产生了麻烦。该脚本使用非常简单的代码修改页面标题为类似“path - Note.ms”的格式。
// @author       firetree
// @match        *://note.ms/*
// @icon         https://note.ms/favicon.ico
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/457127/Notems%E7%BD%91%E9%A1%B5%E6%A0%87%E9%A2%98%E7%AF%A1%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/457127/Notems%E7%BD%91%E9%A1%B5%E6%A0%87%E9%A2%98%E7%AF%A1%E6%94%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.title = location.pathname.slice(1) + ' - ' + document.title
})();