// ==UserScript==
// @name         op端口补全
// @namespace    http://tampermonkey.net/
// @match        http://beauty.hkttech.cn:8899/
// @version      0.1
// @description  op端口补全http://beauty.hkttech.cn ->  http://beauty.hkttech.cn:8899/
// @author       xx
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452009/op%E7%AB%AF%E5%8F%A3%E8%A1%A5%E5%85%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/452009/op%E7%AB%AF%E5%8F%A3%E8%A1%A5%E5%85%A8.meta.js
// ==/UserScript==
(function () {
    'use strict';
    if (window.location.href.includes('beauty.hkttech.cn')) {
        const href = window.location.href
        const links = document.getElementsByTagName('a')
        for (let i = 0; i < links.length; i++) {
            let linkUrl = links[i].href
            if (linkUrl.search(":8899") === -1) {
                linkUrl = linkUrl.replace("beauty.hkttech.cn", "beauty.hkttech.cn:8899")
                links[i].href = linkUrl;
            }
        }
        if (!href.includes('8899')) {
            window.location.href = href.replace("beauty.hkttech.cn", "beauty.hkttech.cn:8899")
        }
    }
})();