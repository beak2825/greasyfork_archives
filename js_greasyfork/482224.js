// ==UserScript==
// @name         BigGo 下次一定啦
// @version      1.4
// @description  下次一定
// @author       BaconEgg
// @match        https://biggo.com.tw/r/transfer_extension*
// @grant        none
// @namespace https://greasyfork.org/users/735944
// @downloadURL https://update.greasyfork.org/scripts/482224/BigGo%20%E4%B8%8B%E6%AC%A1%E4%B8%80%E5%AE%9A%E5%95%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/482224/BigGo%20%E4%B8%8B%E6%AC%A1%E4%B8%80%E5%AE%9A%E5%95%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function clickButton() {
        document.querySelectorAll('a').forEach(button => {
            if (button.textContent.includes("下次一定")) {
                button.click();
            }
        });
    }
    window.addEventListener('load', () => {
        // Initial button click
        clickButton();
        setInterval(clickButton, 2000);
    });
})();