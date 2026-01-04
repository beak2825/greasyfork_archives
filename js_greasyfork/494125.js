// ==UserScript==
// @name     國泰登錄 普通版
// @match    https://www.cathaybk.com.tw/promotion/promotion/CreditCard/Event
// @match    https://www.cathaybk.com.tw/promotion/CreditCard/Event
// @description zh-tw
// @license MIT
// @grant    none
// @version 0.0.1.20240505081711
// @namespace https://greasyfork.org/users/1204797
// @downloadURL https://update.greasyfork.org/scripts/494125/%E5%9C%8B%E6%B3%B0%E7%99%BB%E9%8C%84%20%E6%99%AE%E9%80%9A%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/494125/%E5%9C%8B%E6%B3%B0%E7%99%BB%E9%8C%84%20%E6%99%AE%E9%80%9A%E7%89%88.meta.js
// ==/UserScript==

(function() {
    // 每 0.5 秒重新整理網站
    setInterval(function() {
        location.reload();
    }, 500);

    // 點擊所有「登錄」按鈕
    const loginButtons = document.querySelectorAll('.btn.btn-sign');
    loginButtons.forEach(button => {
        button.click();
    });
})();
