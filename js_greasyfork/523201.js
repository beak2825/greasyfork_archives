// ==UserScript==
// @name         自動點擊翻譯按鈕
// @version      1.0
// @description  在Google圖片搜尋自動點擊翻譯圖片按鈕
// @author       BaconEgg
// @match        https://www.google.com/search?vsrid=*
// @namespace https://greasyfork.org/users/735944
// @downloadURL https://update.greasyfork.org/scripts/523201/%E8%87%AA%E5%8B%95%E9%BB%9E%E6%93%8A%E7%BF%BB%E8%AD%AF%E6%8C%89%E9%88%95.user.js
// @updateURL https://update.greasyfork.org/scripts/523201/%E8%87%AA%E5%8B%95%E9%BB%9E%E6%93%8A%E7%BF%BB%E8%AD%AF%E6%8C%89%E9%88%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', function() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    var translateButton = document.querySelector('button[aria-label="翻譯圖片"]');
                    if (translateButton) {
                        translateButton.click();
                        observer.disconnect();
                    }
                }
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }, false);
})();