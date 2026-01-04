// ==UserScript==
// @name         VNDB Show Original Name
// @name:ja      VNDB 元言語タイトル表示
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  A very simple text replace to show original language title on vndb
// @description:ja vndb.org　日本語でタイトルを表示させるものです。
// @author       samnyan
// @match        https://vndb.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397805/VNDB%20Show%20Original%20Name.user.js
// @updateURL https://update.greasyfork.org/scripts/397805/VNDB%20Show%20Original%20Name.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelectorAll('a[title]').forEach(x => {
        if(x.childElementCount === 0) {
            let temp = x.text;
            x.text = x.title;
            x.title = temp;
        }
    });
})();