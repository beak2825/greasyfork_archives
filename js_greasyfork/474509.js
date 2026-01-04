// ==UserScript==
// @name         自動點以圖搜尋按鈕
// @version      2.2
// @description  在Google圖片搜尋自動點擊以圖搜尋按鈕
// @author       BaconEgg
// @match        https://www.google.com/imghp*
// @match        https://www.google.com.tw/imghp*
// @match        https://images.google.com/*
// @match        https://images.google.com.tw/*
// @match        https://www.google.com/webhp*
// @grant        none
// @namespace https://greasyfork.org/users/735944
// @downloadURL https://update.greasyfork.org/scripts/474509/%E8%87%AA%E5%8B%95%E9%BB%9E%E4%BB%A5%E5%9C%96%E6%90%9C%E5%B0%8B%E6%8C%89%E9%88%95.user.js
// @updateURL https://update.greasyfork.org/scripts/474509/%E8%87%AA%E5%8B%95%E9%BB%9E%E4%BB%A5%E5%9C%96%E6%90%9C%E5%B0%8B%E6%8C%89%E9%88%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', () => {
        const searchButton = document.querySelector('[aria-label="以圖搜尋"][role="button"]');
        if (searchButton) {
            searchButton.click();
        }
    }, { once: true });
})();