// ==UserScript==
// @name         智能下载名称
// @namespace    https://www.zjucjh.com/
// @version      0.1.2
// @description  替换ZJU各大办公网站的附件下载名称
// @author       ZJU帽子
// @match        http://*.zju.edu.cn/*
// @grant        none
// @compatible   firefox >=52
// @compatible   chrome >=55
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/412966/%E6%99%BA%E8%83%BD%E4%B8%8B%E8%BD%BD%E5%90%8D%E7%A7%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/412966/%E6%99%BA%E8%83%BD%E4%B8%8B%E8%BD%BD%E5%90%8D%E7%A7%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const allA = document.getElementsByTagName("a");
    for (let i = 0; i < allA.length; i++) {
        const a = allA[i];
        if (a.target.length <= 0 && isFile(a.href)) {
            a.download = a.innerHTML;
        }
    }

    function isFile(href) {
        const l = href.length;
        const str = href.substring(l - 6, l);
        if (str.includes('.')
            && !str.includes('.htm')
            && !str.includes('.cn')
            && !str.includes('.com')
            && !str.includes('.org')
            && !str.includes('.net')) {
            return true
        } else {
            return false
        }

    }
})();