// ==UserScript==
// @name         Navbar
// @namespace    1
// @version      1.0
// @description  Добавляет z-index: 10 к navbar
// @author       1
// @match        *://*/Admin/CompareBag/EditBag/*
// @match        *://*//Admin/CompareBag/EditBag/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540643/Navbar.user.js
// @updateURL https://update.greasyfork.org/scripts/540643/Navbar.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function applyZIndex() {
        const target = document.querySelector('body > div.navbar.navbar-static-top > div');
        if (target) {
            target.style.zIndex = '10';
        }
    }

    // Попробуем сразу
    applyZIndex();

    // И на случай динамической загрузки
    const observer = new MutationObserver(() => {
        applyZIndex();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
