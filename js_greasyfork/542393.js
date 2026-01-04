// ==UserScript==
// @name         kommiic去广告
// @namespace    http://tampermonkey.net/
// @version      2025-04-26
// @description  这是一个简单的 Tampermonkey 用户脚本，用于移除 komiic.com 网站上的广告元素。
// @author       yuko0931
// @match        https://komiic.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/542393/kommiic%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/542393/kommiic%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver((mutations) => {
        const ads = document.querySelector(".ads");
        if (ads) {
            ads.remove();
            observer.disconnect();
            console.log('动态广告已移除');
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();