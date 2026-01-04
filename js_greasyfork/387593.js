// ==UserScript==
// @name         highlight_google_result
// @namespace    https://github.com/Benzenoil/highlight_google_result
// @version      0.1
// @description  改变google搜索结果中的强调方式
// @author       benzenoil
// @include      https://www.google.com/search?*
// @include      https://www.google.co.jp/search?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387593/highlight_google_result.user.js
// @updateURL https://update.greasyfork.org/scripts/387593/highlight_google_result.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const result = document.querySelectorAll('.s')

    for (let i in result) {
        result[i].innerHTML = result[i].innerHTML.replace(/em/gi, 'mark')
    }
})();
