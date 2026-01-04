// ==UserScript==
// @name         ar25iv
// @name:zh      ar25iv
// @name:en      ar25iv
// @namespace    https://github.com/tao-shen/ar25iv
// @homepage     https://github.com/tao-shen/ar25iv
// @version      1.3
// @author       tao.shen
// @description  An Arxiv Jumper to Ar5iv (arxiv h5)
// @description:zh  An Arxiv Jumper to Ar5iv (arxiv h5)
// @description:en  An Arxiv Jumper to Ar5iv (arxiv h5)
// @include      /^https?://(.*\.)?arxiv\.org/.*/
// @run-at       document-end
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/440019/ar25iv.user.js
// @updateURL https://update.greasyfork.org/scripts/440019/ar25iv.meta.js
// ==/UserScript==
window.onload=function () {
    let h0 = document.querySelector('#abs-outer > div.extra-services > div.full-text > ul');
    let h1 = document.querySelector('#abs-outer > div.extra-services > div.full-text > ul > li:nth-child(2)');
    let h2 = h1.cloneNode(h1);
    h2.children[0].text='Ar5iv';
    h2.children[0].href = h2.children[0].href.replace('/format/', '/html/').replace('arxiv','ar5iv');
    //h2.children[0].href = h2.children[0].href.replace('arxiv.org/pdf/','ar5iv.labs.arxiv.org/html/');
    h0.insertBefore(h2,h0.children[0]);
}();
