// ==UserScript==
// @name         Mortal Auto Selector
// @namespace    https://greasyfork.org/zh-CN/users/1284613
// @version      0.1
// @description  自動選擇 "3.0" 並勾選 "顯示 rating"
// @author       Scott
// @match        *://mjai.ekyu.moe/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529858/Mortal%20Auto%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/529858/Mortal%20Auto%20Selector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function selectMortalNetwork() {
        const selectElement = document.querySelector('#mortal-model-tag');
        if (selectElement) {
            selectElement.value = '3.0';
            selectElement.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    function checkShowRating() {
        const ratingCheckbox = document.querySelector('input[name="show-rating"]');
        if (ratingCheckbox && !ratingCheckbox.checked) {
            ratingCheckbox.checked = true;
            ratingCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    function init() {
        selectMortalNetwork();
        checkShowRating();
    }

    // 等待 DOM 加載完成
    window.addEventListener('load', init);
})();
