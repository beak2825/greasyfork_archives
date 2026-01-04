// ==UserScript==
// @name         aneeo.com显示ipa文件地址
// @namespace    https://github.com/zhchjiang95
// @version      0.1
// @description  显示ipa文件直接下载地址
// @author       protoo <i@fiume.cn>
// @license      MIT
// @include      *//app.aneeo.com/show*
// @match        *//app.aneeo.com/show*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448353/aneeocom%E6%98%BE%E7%A4%BAipa%E6%96%87%E4%BB%B6%E5%9C%B0%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/448353/aneeocom%E6%98%BE%E7%A4%BAipa%E6%96%87%E4%BB%B6%E5%9C%B0%E5%9D%80.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const regexp = /(?<=").+\.ipa/g;
    const html = document.documentElement.innerHTML;
    const urls = html.match(regexp);
    const p = document.createElement('p');
    p.innerText = urls;
    document.querySelector('.w3ls_form')?.appendChild(p);
})();