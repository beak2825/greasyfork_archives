// ==UserScript==
// @name         知网批量下载PDF
// @namespace    https://ixz.im/
// @version      0.1
// @description  用于知网批量下载PDF
// @author       Juicpt
// @match        *://*.cnki.net/*
// @include      *://*.cnki.net.*
// @include      *://*/cnki.net/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382730/%E7%9F%A5%E7%BD%91%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BDPDF.user.js
// @updateURL https://update.greasyfork.org/scripts/382730/%E7%9F%A5%E7%BD%91%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BDPDF.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const html = document.querySelector(".SavePoint");
    const button = document.createElement('a');
    const Util = {
        dflag: res => res.replace('&dflag=nhdown', '&dflag=pdfdown'),

    };
    button.innerHTML = '批量下载PDF';

    if (html) {
        html.style.width = '600px';
        html.appendChild(button);

    }
    const table = document.querySelector('.GridTableContent');
    const tr = table.querySelectorAll('tr [bgcolor]');
    tr.forEach(
        res => {
            const a = res.querySelector('.briefDl_Y, .briefDl_D');
            a.href = a.href.match('&dflag') ? Util.dflag(a.href) : (a.href + '&dflag=pdfdown');
        }
    );
    button.addEventListener('click', () => {
        tr.forEach(
            res=>{
                const a = res.querySelector('.briefDl_Y, .briefDl_D');
                a.click();
            }
        )
    });

})();
