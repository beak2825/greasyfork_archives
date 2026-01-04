// ==UserScript==
// @name         k8s取消付费提示
// @namespace    http://tampermonkey.net/
// @version      2024-11-27
// @description  工具
// @author       You
// @match        https://kuboard.dev.htairline.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=htairline.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519007/k8s%E5%8F%96%E6%B6%88%E4%BB%98%E8%B4%B9%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/519007/k8s%E5%8F%96%E6%B6%88%E4%BB%98%E8%B4%B9%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function name(params) {
    window.KuboardLicenseUtil.hasGrant = function(){return true}
}, 5000);

})();