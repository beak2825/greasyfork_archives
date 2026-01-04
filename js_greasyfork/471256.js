// ==UserScript==
// @name         Gityx汉化插件全局禁用
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  可 能 有 b u g
// @author       yuyanMC
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.io
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/471256/Gityx%E6%B1%89%E5%8C%96%E6%8F%92%E4%BB%B6%E5%85%A8%E5%B1%80%E7%A6%81%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/471256/Gityx%E6%B1%89%E5%8C%96%E6%8F%92%E4%BB%B6%E5%85%A8%E5%B1%80%E7%A6%81%E7%94%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    Object.defineProperty(unsafeWindow,"cnExcludeWhole",{get:function(){return [/[\s\S]*/]}});
    // Your code here...
})();