// ==UserScript==
// @name         在搜索结果中屏蔽知乎
// @version      0.0.1
// @description  在google搜索结果中一劳永逸地屏蔽所有知乎结果
// @license      MIT
// @author       PincongBot
// @include      /^https?://(www|cse)\.google(\.\w+)+/search\?.*$/
// @run-at       document-start
// @grant        none
// @compatible   chrome >= 49
// @compatible   firefox >= 29
// @compatible   opera >= 46
// @compatible   safari >= 10.1
// @namespace https://greasyfork.org/users/314505
// @downloadURL https://update.greasyfork.org/scripts/387373/%E5%9C%A8%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E4%B8%AD%E5%B1%8F%E8%94%BD%E7%9F%A5%E4%B9%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/387373/%E5%9C%A8%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E4%B8%AD%E5%B1%8F%E8%94%BD%E7%9F%A5%E4%B9%8E.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var params = new URLSearchParams(location.search),
        q = params.get("q");

    if (q && q.indexOf("-site:zhihu.com") === -1) {
        params.set("q", q + " -site:zhihu.com");
        location.search = "?" + params.toString();
    }

})()