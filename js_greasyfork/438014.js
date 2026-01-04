// ==UserScript==
// @name         Google Image Redirect from CN
// @namespace    http://tampermonkey.net/
// @version      0.2.3
// @description  将谷歌搜索首页图片按钮的地址重定向到.com
// @author       entr0pia
// @include      /^https?:\/\/www.google.com(\.[a-z]{2})?\/(webhp.*)?$/
// @icon         https://www.google.com/favicon.ico
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/438014/Google%20Image%20Redirect%20from%20CN.user.js
// @updateURL https://update.greasyfork.org/scripts/438014/Google%20Image%20Redirect%20from%20CN.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.body.innerHTML = document.body.innerHTML.replace(/google.cn\/imghp/g, 'google.com/imghp');
})();
