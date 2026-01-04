// ==UserScript==
// @name         bd-file 详情页下载链接提前&默认展示所有链接
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  try to take over the world!
// @author       You
// @match        https://www.bd-film.cc/*
// @icon         https://www.google.com/s2/favicons?domain=bd-film.cc
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420858/bd-file%20%E8%AF%A6%E6%83%85%E9%A1%B5%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5%E6%8F%90%E5%89%8D%E9%BB%98%E8%AE%A4%E5%B1%95%E7%A4%BA%E6%89%80%E6%9C%89%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/420858/bd-file%20%E8%AF%A6%E6%83%85%E9%A1%B5%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5%E6%8F%90%E5%89%8D%E9%BB%98%E8%AE%A4%E5%B1%95%E7%A4%BA%E6%89%80%E6%9C%89%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector('.dfg-video-title').insertAdjacentHTML('beforebegin',document.querySelectorAll('.dfg-layout')[1].outerHTML);
    document.querySelector('#showmore a').click()
    // Your code here...
})();