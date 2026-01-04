// ==UserScript==
// @name         1024去引用部分
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  1024去引用部分！
// @author       You
// @match        http://www.t66y.com/htm_data/2106/25/4530287.html
// @icon         https://www.google.com/s2/favicons?domain=t66y.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428436/1024%E5%8E%BB%E5%BC%95%E7%94%A8%E9%83%A8%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/428436/1024%E5%8E%BB%E5%BC%95%E7%94%A8%E9%83%A8%E5%88%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let temp = document.querySelector("#main > div.t.t2 > table > tbody > tr.tr1.do_not_catch > th:nth-child(2) > table > tbody > tr > td > div.tpc_content.do_not_catch > b:nth-child(36) > b > blockquote")
    temp.parentNode.removeChild(temp);
})();