// ==UserScript==
// @name         知网PDF下载
// @namespace    https://xzonn.top/
// @version      1.0.1
// @description  对指向网址进行了修改，可下载知网pdf文件
// @author       sanf
// @include      http*://kns.cnki.net/kns8/defaultresult/index
// @icon         https://www.cnki.net/favicon.ico
// @grant        none
// @supportURL   https://xzonn.top/posts/Download-Pdf-File-from-Cnki.html
// @license      cc by-nc-sa 4.0
// @downloadURL https://update.greasyfork.org/scripts/454805/%E7%9F%A5%E7%BD%91PDF%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/454805/%E7%9F%A5%E7%BD%91PDF%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let changeLink = function (e) {
        let target = e.target;
        while (target.tagName.toLowerCase() != "a") {
            if (target.tagName.toLowerCase() == "body") {
                return;
            }
            target = target.parentNode;
        }
        if (target.href && target.href.match(/^https?:\/\/kns\.cnki\.net\/(.*=(?:CMFD|CDFD)(?:&.*)?)$/)) {
            target.href = target.href.replace(/^https?:\/\/kns\.cnki\.net\/(.*=(?:CMFD|CDFD)(?:&.*)?)$/, "https://oversea.cnki.net/$1");
        }
    };
    document.body.addEventListener("mousedown", changeLink);
    document.body.addEventListener("click", changeLink);
})();