// ==UserScript==
// @name         Dedao: No New Tab!
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  拦截得到网页版的点击打开新标签页
// @author       iamkissg
// @match        https://www.dedao.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dedao.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460389/Dedao%3A%20No%20New%20Tab%21.user.js
// @updateURL https://update.greasyfork.org/scripts/460389/Dedao%3A%20No%20New%20Tab%21.meta.js
// ==/UserScript==

(function() {
    window.open = function(url) {
        location.href = url;
    }
})();