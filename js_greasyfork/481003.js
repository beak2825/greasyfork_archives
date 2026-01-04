// ==UserScript==
// @name         山西公考网助手
// @version      0.2
// @author       rourou
// @match        https://www.sxgkw.cn/*
// @description  山西公考网的油猴脚本，用于广告去除、允许复制、来源网址直接点击跳转
// @grant        none
// @namespace https://greasyfork.org/users/1225152
// @downloadURL https://update.greasyfork.org/scripts/481003/%E5%B1%B1%E8%A5%BF%E5%85%AC%E8%80%83%E7%BD%91%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/481003/%E5%B1%B1%E8%A5%BF%E5%85%AC%E8%80%83%E7%BD%91%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(() => {
        document.onselectstart = null;
        document.oncontextmenu = null;
        document.head.innerHTML += "<style>.zhaokao ul.list li {display: flex}\n .zhaokao ul.list li a {width: 93%;white-space: nowrap;text-overflow: ellipsis;overflow: hidden}</style>";
        for(let i of document.querySelectorAll("body > div.proListClassify.clearfix > div > div > div.sectionC > div > div > div.info-cont p")) {
            if (i.innerText.includes("扫码")) {
                i.innerHTML = i.innerHTML.substr(0, i.innerHTML.indexOf("<br>"));
            }
            if (i.innerText.includes("来源")) {
                i.innerHTML = i.innerHTML.substr(0, 3) + "<a href='" + i.innerHTML.substr(3) + "'>" + i.innerHTML.substr(3) + "</a>";
            }
        }
        document.querySelectorAll("body > div.proListClassify.clearfix > div > div > div.sectionC > div > div > div.info-cont img").forEach((i) => i.remove())
    }, 30)
})();