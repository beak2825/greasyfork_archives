// ==UserScript==
// @name         教育部臺灣閩南語常用詞辭典|使用Alt+S跳至搜尋欄位
// @namespace    https://instagram.com/sweetpotatoyee
// @version      0.2
// @description  Jump to the search box on Alt+S press
// @author       SweetPotatoYee
// @match        https://sutian.moe.edu.tw/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495455/%E6%95%99%E8%82%B2%E9%83%A8%E8%87%BA%E7%81%A3%E9%96%A9%E5%8D%97%E8%AA%9E%E5%B8%B8%E7%94%A8%E8%A9%9E%E8%BE%AD%E5%85%B8%7C%E4%BD%BF%E7%94%A8Alt%2BS%E8%B7%B3%E8%87%B3%E6%90%9C%E5%B0%8B%E6%AC%84%E4%BD%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/495455/%E6%95%99%E8%82%B2%E9%83%A8%E8%87%BA%E7%81%A3%E9%96%A9%E5%8D%97%E8%AA%9E%E5%B8%B8%E7%94%A8%E8%A9%9E%E8%BE%AD%E5%85%B8%7C%E4%BD%BF%E7%94%A8Alt%2BS%E8%B7%B3%E8%87%B3%E6%90%9C%E5%B0%8B%E6%AC%84%E4%BD%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(e) {
        if (e.altKey && e.key === 's') {
            e.preventDefault();
            const searchBox = document.getElementById('id_tsha');
            if (searchBox) {
                searchBox.focus();
            }
        }
    });
})();
