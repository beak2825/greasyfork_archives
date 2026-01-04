// ==UserScript==
// @name         AtCoder Editorial Title
// @namespace    https://fuwa.dev/
// @version      0.1
// @description  show editorial title in document.title
// @author       ibuki2003
// @match        https://atcoder.jp/contests/*/editorial
// @match        https://atcoder.jp/contests/*/editorial/*
// @icon         https://www.google.com/s2/favicons?domain=atcoder.jp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430504/AtCoder%20Editorial%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/430504/AtCoder%20Editorial%20Title.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (/\/editorial$/.test(location.pathname)) {
        document.querySelectorAll('#main-container ul li a[target=_blank]').forEach((e) => e.removeAttribute('target'))
    } else {
        const contest_name = document.title.substr(5);

        const editorial_title = document.getElementsByTagName('h2')[0].innerText;

        document.title = `${editorial_title} - ${contest_name}`;
    }
})();