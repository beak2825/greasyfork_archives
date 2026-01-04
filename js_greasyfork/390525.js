// ==UserScript==
// @name         atcoder-affiliation-finder
// @namespace    https://twitter.com/_TTJR_
// @version      0.22
// @description  When you click the affiliation, go to the ranking page (everyone who has the same affiliation appears only)
// @author       tsutaj
// @match        https://atcoder.jp/users/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390525/atcoder-affiliation-finder.user.js
// @updateURL https://update.greasyfork.org/scripts/390525/atcoder-affiliation-finder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const linkHeader = 'https://atcoder.jp/ranking?f.Affiliation=';
    const trs = document.querySelectorAll('.dl-table tr');

    trs.forEach(function(tr) {
        if(tr.innerText.search('所属') !== -1 || tr.innerText.search('Affiliation') !== -1) {
            const affiliation = tr.childNodes[1].innerText;
            const link = linkHeader + encodeURIComponent(affiliation);
            tr.childNodes[1].innerHTML = '<a href=' + link + '>' + affiliation + '</a>';
        }
    });
})();

