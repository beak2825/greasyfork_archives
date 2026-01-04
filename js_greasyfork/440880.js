// ==UserScript==
// @name         arxiv2cn
// @name:zh      arxiv2cn
// @name:en      arxiv2cn
// @namespace    arxiv2cn
// @homepage     arxiv2cn
// @version      1.0
// @author       KyanChen
// @description  An Arxiv Jumper to China Image Source
// @description:zh  An Arxiv Jumper to China Image Source
// @description:en  An Arxiv Jumper to China Image Source
// @include      /^https?://(.*\.)?arxiv\.org/.*/
// @run-at       document-end
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/440880/arxiv2cn.user.js
// @updateURL https://update.greasyfork.org/scripts/440880/arxiv2cn.meta.js
// ==/UserScript==
window.onload=function () {
    let h0 = document.querySelector('#abs-outer > div.extra-services > div.full-text > ul');
    let h1 = document.querySelector('#abs-outer > div.extra-services > div.full-text > ul > li:nth-child(1)');
    let h2 = h1.cloneNode(h1);
    h2.children[0].text='arxiv2cn';
    h2.children[0].href = h2.children[0].href.replace('https://arxiv.org','http://xxx.itp.ac.cn');
    h0.insertBefore(h2,h0.children[0]);
}();