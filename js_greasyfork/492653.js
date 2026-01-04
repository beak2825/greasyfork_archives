// ==UserScript==
// @name         AtCoder-HiderRatingAndPerformance
// @namespace    https://github.com/PenguinCabinet
// @version      v0.0.3
// @description  The tool to hide atcoder rating and performance
// @author       PenguinCabinet
// @license      MIT
// @match        https://atcoder.jp/users/*
// @match        https://atcoder.jp/contests/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492653/AtCoder-HiderRatingAndPerformance.user.js
// @updateURL https://update.greasyfork.org/scripts/492653/AtCoder-HiderRatingAndPerformance.meta.js
// ==/UserScript==

//config
const config_hide_ranking = false;
//config

(function () {
    'use strict';

    if (window.location.href.match(/contests/)) {
        if (config_hide_ranking) {
            let lis = document.querySelectorAll('li');
            lis.forEach(function (elem) {
                if (
                    elem.textContent.match(/順位表/)
                ) {
                    elem.style.display = 'none';
                }
            });
        }
    }
    else if (window.location.href.match(/history/)) {
        let tables = document.querySelectorAll('table');
        tables.forEach(function (elem) {
            let len = elem.rows.length;

            for (let i = 0; i < len; i++) {
                for (let j = 0; j < (config_hide_ranking ? 5 : 4); j++) {
                    elem.rows[i].deleteCell(-1);
                }
            }
        })
    } else {
        let ths = document.querySelectorAll('th');
        ths.forEach(function (elem) {
            if (
                elem.textContent.indexOf('順位') != -1 ||
                elem.textContent.indexOf('Rank') != -1
            ) {
                if (config_hide_ranking) {
                    elem.nextElementSibling.innerHTML = "XXXX";
                }
            }
            if (
                elem.textContent.indexOf('Rating') != -1
            ) {
                const rateting_text_class_name =
                    elem.nextElementSibling.getElementsByTagName("span")[0]
                        .className;

                let hide_rating_text_elem = document.createElement('span');
                hide_rating_text_elem.className = rateting_text_class_name;
                hide_rating_text_elem.innerHTML = "XXXX";

                elem.nextElementSibling.innerHTML = "";
                elem.nextElementSibling.appendChild(hide_rating_text_elem);
            }
        });

        let canvases = document.querySelectorAll('canvas');
        canvases.forEach(function (elem) {
            elem.parentNode.style.display = 'none';
        });
    }
    // Your code here...
})();