// ==UserScript==
// @name         Auto Click "Show More..." Button
// @version      1.0
// @description  This Tampermonkey script automatically clicks the "Show More..." button on the website https://online-fix.me/.
// @namespace    Goga)
// @match        https://online-fix.me/*
// @run-at       document-end
// @author       Role_Play
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464376/Auto%20Click%20%22Show%20More%22%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/464376/Auto%20Click%20%22Show%20More%22%20Button.meta.js
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
