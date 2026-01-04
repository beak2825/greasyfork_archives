// ==UserScript==
// @name         精简必应url
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  移除 Bing 搜索 URL 中 q= 后面的等号
// @author       wjm13206
// @match        https://www.bing.com/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538949/%E7%B2%BE%E7%AE%80%E5%BF%85%E5%BA%94url.user.js
// @updateURL https://update.greasyfork.org/scripts/538949/%E7%B2%BE%E7%AE%80%E5%BF%85%E5%BA%94url.meta.js
// ==/UserScript==

(function() {
    'use strict';
L
    let currentUrl = window.location.href;

    if (currentUrl.includes('q=')) {
        let newUrl = currentUrl.replace(/q=([^&]*)/, function(match, p1) {
            if (p1.startsWith('=')) {
                return 'q=' + p1.substring(1);
            }
            return match; 
        });

        if (newUrl !== currentUrl) {
            window.location.replace(newUrl);
        }
    }
})();