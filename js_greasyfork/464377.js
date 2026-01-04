// ==UserScript==
// @name         Автоматическое нажатие кнопки "Показать еще..."
// @version      1.0
// @description  Этот скрипт Tampermonkey автоматически нажимает кнопку "Показать еще..." на веб-сайте https://online-fix.me/.
// @namespace    Goga)
// @match        https://online-fix.me/*
// @run-at       document-end
// @author       Role_Play
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464377/%D0%90%D0%B2%D1%82%D0%BE%D0%BC%D0%B0%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%BE%D0%B5%20%D0%BD%D0%B0%D0%B6%D0%B0%D1%82%D0%B8%D0%B5%20%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%22%D0%9F%D0%BE%D0%BA%D0%B0%D0%B7%D0%B0%D1%82%D1%8C%20%D0%B5%D1%89%D0%B5%22.user.js
// @updateURL https://update.greasyfork.org/scripts/464377/%D0%90%D0%B2%D1%82%D0%BE%D0%BC%D0%B0%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%BE%D0%B5%20%D0%BD%D0%B0%D0%B6%D0%B0%D1%82%D0%B8%D0%B5%20%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%22%D0%9F%D0%BE%D0%BA%D0%B0%D0%B7%D0%B0%D1%82%D1%8C%20%D0%B5%D1%89%D0%B5%22.meta.js
// ==/UserScript==

(function() {
    var showMoreButton = document.querySelector('.btn.btn-small.btn-success[onclick="ajax_show_more(); return false;"]');
    var clicked = false;

    function clickShowMoreButton() {
        showMoreButton.click();
        clicked = true;
        setTimeout(function() {
            clicked = false;
        }, 2000);
    }

    function scrollHandler() {
        if (!clicked && (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 500)) {
            clickShowMoreButton();
        }
    }

    window.addEventListener('scroll', scrollHandler);
})();
