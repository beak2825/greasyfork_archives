// ==UserScript==
// @icon            http://bilibili.com/favicon.ico
// @name            av还原助手
// @namespace       [url=mailto:zzy0302@vip.qq.com]zzy0302@vip.qq.com[/url]
// @author          zzy0302
// @description     av还原助手,还原所有bv至av
// @match           *://*.bilibili.com/video*
// @version         0.0.4
// @grant           none
// @license         MIT License
// @homepage        https://github.com/zzy0302/bv2av/tree/master/
// @homepageURL     https://github.com/zzy0302/bv2av/tree/master/
// @supportURL      https://github.com/zzy0302/bv2av/issues
// @downloadURL https://update.greasyfork.org/scripts/398640/av%E8%BF%98%E5%8E%9F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/398640/av%E8%BF%98%E5%8E%9F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

// some code from https://greasyfork.org/en/scripts/398535-bv2av/code
(function () {
    'use strict';
    let elem = document.querySelector('#video-page-app');
    if (!elem) return;
    function bv2av(x) {
        var bvs = x.match(/[bB][vV][fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF]{10}/g);
        if (bvs) {
            console.log(bvs)
            x = x.replace(bvs, 'av' + window.aid);
        }
        return x;
    }

    var url = window.location.href;
    var newUrl = bv2av(url);
    if (url != newUrl) {
        window.history.pushState(null, null, newUrl);
    }
})();