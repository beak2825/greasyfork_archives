
// ==UserScript==
// @name         酷安拦截自动定向
// @author       致情吖
// @namespace    coolapk.ZhiQingYa
// @version      1.0
// @description  被小绿书拦截的链接自动跳转到它该去的地方，有问题酷安@ZhiQingYa
// @match        https://www.coolapk.com/link?url=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471806/%E9%85%B7%E5%AE%89%E6%8B%A6%E6%88%AA%E8%87%AA%E5%8A%A8%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/471806/%E9%85%B7%E5%AE%89%E6%8B%A6%E6%88%AA%E8%87%AA%E5%8A%A8%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var url = document.location.href;
    var redirectUrl = unescape(url.match(/link\?url=(.*)/)[1]);

    if (redirectUrl) {
        document.location.href = redirectUrl;
    }
})();
