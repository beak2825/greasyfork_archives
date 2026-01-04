// ==UserScript==
// @name         Thêm phím tắt cho vOz
// @namespace    idmresettrial
// @version      2021.02.13.01
// @description  ... dùng phím tắt đôi khi tiện hơn dùng chuột
// @author       You
// @match        https://voz.vn/t/*
// @grant        none
// @run-at       document-start
// @antifeature  tracking
// @downloadURL https://update.greasyfork.org/scripts/409963/Th%C3%AAm%20ph%C3%ADm%20t%E1%BA%AFt%20cho%20vOz.user.js
// @updateURL https://update.greasyfork.org/scripts/409963/Th%C3%AAm%20ph%C3%ADm%20t%E1%BA%AFt%20cho%20vOz.meta.js
// ==/UserScript==

document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    // Hiện link tới box đang xem
    // phím tắt: 0
    let nav = document.querySelector(".p-navSticky ul.p-nav-list");
    let currentBox = document.querySelector(".p-breadcrumbs li:last-child a");

    let newBtn = document.createElement("li");
    newBtn.innerHTML = '<div class="p-navEl"><a href="$1" class="p-navEl-link" data-xf-key="0" data-nav-id="voz_currentBox">$2</a></div>'
        .replace("$1", currentBox.href).replace("$2", currentBox.innerText);

    nav.appendChild(newBtn);

    // Trang trước, trang sau
    // phím tắt: b, n
    let pages = {
        prev: { el: document.querySelector(".pageNav-jump.pageNav-jump--prev"), key: "b" },
        next: { el: document.querySelector(".pageNav-jump.pageNav-jump--next"), key: "n" }
    };
    for (const button in pages) {
        let link = pages[button];
        if (link.el) {
            link.el.setAttribute("data-xf-key", link.key);
        }
    }

});