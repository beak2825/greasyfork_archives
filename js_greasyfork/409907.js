// ==UserScript==
// @name         Đóng nó
// @namespace    idmresettrial
// @version      2021.02.13.01
// @description  click vào icon Thông báo đang mở sẽ đóng nó lại
// @author       You
// @match        https://voz.vn/*
// @grant        none
// @run-at       document-start
// @antifeature  tracking
// @downloadURL https://update.greasyfork.org/scripts/409907/%C4%90%C3%B3ng%20n%C3%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/409907/%C4%90%C3%B3ng%20n%C3%B3.meta.js
// ==/UserScript==

document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    let btnEls = document.querySelectorAll(".p-nav-opposite a[data-xf-click]");
    btnEls.forEach(function (btnEl) {
        btnEl.addEventListener("click", function(e) {
            e.preventDefault();
        });
    });

});