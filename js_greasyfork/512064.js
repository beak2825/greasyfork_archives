// ==UserScript==
// 此插件仅用于解决一些网页显示不合理的地方。
// @name         显示督学端答题用时
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remove width styles from el-table header and body
// @match        *://supervise-v3.classba.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512064/%E6%98%BE%E7%A4%BA%E7%9D%A3%E5%AD%A6%E7%AB%AF%E7%AD%94%E9%A2%98%E7%94%A8%E6%97%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/512064/%E6%98%BE%E7%A4%BA%E7%9D%A3%E5%AD%A6%E7%AB%AF%E7%AD%94%E9%A2%98%E7%94%A8%E6%97%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        const tableHeader = document.querySelector('.el-table__header');
        const tableBody = document.querySelector('.el-table__body');

        if (tableHeader && tableHeader.style.width || '') {
            tableHeader.style.width = '';
        }

        if (tableBody && tableBody.style.width || '') {
            tableBody.style.width = '';
        }
    });

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                const tableHeader = document.querySelector('.el-table__header');
                const tableBody = document.querySelector('.el-table__body');
                if (tableHeader && tableHeader.style.width || '') {
                    tableHeader.style.width = '';
                }
                if (tableBody && tableBody.style.width || '') {
                    tableBody.style.width = '';
                }
            }
        });
    });

    observer.observe(document.body, { childList: true, attributes: true, subtree: true });
})();

