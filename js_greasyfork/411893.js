// ==UserScript==
// @name weibo-directlink
// @namespace https://github.com/phith0n/tampermonkey
// @version 1.0.0
// @author phith0n
// @description a Tampermonkey script that is used to replace Weibo's link to its's original value
// @match *://t.cn/*
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/411893/weibo-directlink.user.js
// @updateURL https://update.greasyfork.org/scripts/411893/weibo-directlink.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const links = document.getElementsByClassName("link");
    if (links.length > 0 && /长按网址复制/.test(document.body.innerHTML)) {
        const link = links[0];
        const a = document.createElement("a");
        a.href = link.innerText;
        document.body.appendChild(a);
        a.click();
    }

})();
