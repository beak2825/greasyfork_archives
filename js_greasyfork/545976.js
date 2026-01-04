// ==UserScript==
// @name        司机社自动跳转
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       zzx114
// @description  访问其他域名时自动跳转到xsijishe.net
// @match        *://sjs47.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545976/%E5%8F%B8%E6%9C%BA%E7%A4%BE%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/545976/%E5%8F%B8%E6%9C%BA%E7%A4%BE%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 跳转映射表，后续可添加更多规则
    const redirectMap = {
        "sjs47.com": "xsijishe.net",
    };

    const currentHost = location.host;
    for (let sourceDomain in redirectMap) {
        if (currentHost === sourceDomain || currentHost.endsWith("." + sourceDomain)) {
            const targetDomain = redirectMap[sourceDomain];
            const newUrl = location.href.replace(sourceDomain, targetDomain);
            if (newUrl !== location.href) {
                console.log(`跳转：${location.href} → ${newUrl}`);
                location.replace(newUrl);
            }
            break;
        }
    }
})();
