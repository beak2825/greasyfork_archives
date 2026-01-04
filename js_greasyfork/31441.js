// ==UserScript==
// @name         CLearChromeNewtab
// @name:zh-CN   清理Chrome新建标签页
// @namespace    Kalone
// @version      0.1
// @description  Remove most-visited blocks in Chrome newtab page for you.
// @description:zh-CN   为你去除新建标签页中搜索框下面的最热访问页面
// @author       Kalone
// @match        https://*/_/chrome/newtab*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31441/CLearChromeNewtab.user.js
// @updateURL https://update.greasyfork.org/scripts/31441/CLearChromeNewtab.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById('most-visited').style.display='none';
})();