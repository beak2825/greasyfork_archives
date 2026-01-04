// ==UserScript==
// @name         git-scm-doc
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://git-scm.com/book/zh/v2/Git-%E5%B7%A5%E5%85%B7-%E5%AD%90%E6%A8%A1%E5%9D%97
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393962/git-scm-doc.user.js
// @updateURL https://update.greasyfork.org/scripts/393962/git-scm-doc.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var style = document.createElement('style');
    var styles = [
        'h2 {',
        '  font-size: 32px;',
        '  color: #F54423;',
        '}',
        'h3 {',
        '  font-size: 24px;',
        '  color: #F54423;',
        '}',
        'h4 {',
        '  font-size: 18px;',
        '  color: #F54423;',
        '}',
    ].join('');
    style.innerHTML = styles;
    document.body.append(style)
    // Your code here...
})();