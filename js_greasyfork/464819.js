// ==UserScript==
// @name         edgarcayce fix
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  解决凯西中文网文章末尾被遮挡的问题
// @author       You
// @match        http://www.edgarcayce.org.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=edgarcayce.org.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464819/edgarcayce%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/464819/edgarcayce%20fix.meta.js
// ==/UserScript==

(function() {
    'use strict';
    [...document.querySelectorAll('#canvas .wp-title_content')].at(-1).style.height='6700px';
    document.querySelector('#site_footer').style.top='6900px';
    // Your code here...
})();