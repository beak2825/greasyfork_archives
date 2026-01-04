// ==UserScript==
// @name         清华教参 HTML5
// @namespace    https://dev.oriki.moe
// @version      1.0
// @description  Make THU reserve lib HTML5 again!
// @author       lwpie
// @match        http://reserves.lib.tsinghua.edu.cn/Search/BookDetail?bookId=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397221/%E6%B8%85%E5%8D%8E%E6%95%99%E5%8F%82%20HTML5.user.js
// @updateURL https://update.greasyfork.org/scripts/397221/%E6%B8%85%E5%8D%8E%E6%95%99%E5%8F%82%20HTML5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('p > a').each(function () {
        this.href = this.href.replace('index.html', 'HTML5/index.html');
    })
})();