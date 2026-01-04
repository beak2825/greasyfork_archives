// ==UserScript==
// @name         简书直接跳转
// @namespace    github.com/axiref?to-jianshu
// @version      1.0
// @description  使简书内页的网址直接跳转，而不是让用户手动复制链接
// @author       axiref
// @match        https://www.jianshu.com/*
// @downloadURL https://update.greasyfork.org/scripts/411059/%E7%AE%80%E4%B9%A6%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/411059/%E7%AE%80%E4%B9%A6%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let tags = document.getElementsByTagName("a")
    for (let tag of tags) {
        let u = tag.href
        if (u.indexOf("jianshu.com/go?to=") !== -1) {
            let index = u.search(/\?to=/) + 4;
            let url = decodeURIComponent(u.substring(index));
            tag.href = url;
        }
    }
})();