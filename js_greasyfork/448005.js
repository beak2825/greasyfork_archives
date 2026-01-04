// ==UserScript==
// @name         拒绝小尾巴
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  解决某些网站复制小尾巴
// @author       佚名
// @match        *://*.bilibili.com/read/*
// @license       MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=freesion.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448005/%E6%8B%92%E7%BB%9D%E5%B0%8F%E5%B0%BE%E5%B7%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/448005/%E6%8B%92%E7%BB%9D%E5%B0%8F%E5%B0%BE%E5%B7%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';
[...document.querySelectorAll('*')].forEach(item=>{
    item.oncopy = function(e) {
        e.stopPropagation();
    }
});
})();