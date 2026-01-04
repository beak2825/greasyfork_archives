// ==UserScript==
// @name         中国知网（CNKI）硕博论文跳转至“海外版”下载 pdf 文件
// @namespace    https://xzonn.top/
// @version      1.0.2
// @description  将中国知网（CNKI）搜索列表中的硕博论文详情页自动跳转至“海外版”网站，以便下载 pdf 文件。
// @author       Xzonn
// @include      http*://kns.cnki.net/kns8/defaultresult/index
// @icon         https://www.cnki.net/favicon.ico
// @grant        none
// @supportURL   https://xzonn.top/posts/Download-Pdf-File-from-Cnki.html
// @license      cc by-nc-sa 4.0
// @downloadURL https://update.greasyfork.org/scripts/435530/%E4%B8%AD%E5%9B%BD%E7%9F%A5%E7%BD%91%EF%BC%88CNKI%EF%BC%89%E7%A1%95%E5%8D%9A%E8%AE%BA%E6%96%87%E8%B7%B3%E8%BD%AC%E8%87%B3%E2%80%9C%E6%B5%B7%E5%A4%96%E7%89%88%E2%80%9D%E4%B8%8B%E8%BD%BD%20pdf%20%E6%96%87%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/435530/%E4%B8%AD%E5%9B%BD%E7%9F%A5%E7%BD%91%EF%BC%88CNKI%EF%BC%89%E7%A1%95%E5%8D%9A%E8%AE%BA%E6%96%87%E8%B7%B3%E8%BD%AC%E8%87%B3%E2%80%9C%E6%B5%B7%E5%A4%96%E7%89%88%E2%80%9D%E4%B8%8B%E8%BD%BD%20pdf%20%E6%96%87%E4%BB%B6.meta.js
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
            target.href = target.href.replace(/^https?:\/\/kns\.cnki\.net\/(.*=(?:CMFD|CDFD)(?:&.*)?)$/, "https://chn.oversea.cnki.net/$1");
        }
    };
    document.body.addEventListener("mousedown", changeLink);
    document.body.addEventListener("click", changeLink);
})();