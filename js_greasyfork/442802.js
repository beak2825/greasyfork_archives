// ==UserScript==
// @name         cppref-zh
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动换成中文版
// @author       You
// @match        https://en.cppreference.com/*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/442802/cppref-zh.user.js
// @updateURL https://update.greasyfork.org/scripts/442802/cppref-zh.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // more https://stackoverflow.com/questions/503093/how-do-i-redirect-to-another-webpage
    // https://www.tampermonkey.net/documentation.php#_match
    window.location.replace(`${location.origin.replace('en', 'zh')}${location.pathname}`);

})();
