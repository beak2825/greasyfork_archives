// ==UserScript==
// @name         通用阻止 ASP.NET 表單自動刷新
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  阻止 input/select/textarea 的 onchange 觸發 __doPostBack
// @author       shanlan(ChatGPT o3-mini)
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542877/%E9%80%9A%E7%94%A8%E9%98%BB%E6%AD%A2%20ASPNET%20%E8%A1%A8%E5%96%AE%E8%87%AA%E5%8B%95%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/542877/%E9%80%9A%E7%94%A8%E9%98%BB%E6%AD%A2%20ASPNET%20%E8%A1%A8%E5%96%AE%E8%87%AA%E5%8B%95%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 只移除 input/select/textarea 的 onchange 屬性中含 __doPostBack 的自動刷新
    function removeOnChangePostBack() {
        const elements = document.querySelectorAll('input[onchange], select[onchange], textarea[onchange]');
        elements.forEach(el => {
            const onchange = el.getAttribute('onchange');
            if (onchange && onchange.indexOf('__doPostBack') !== -1) {
                el.removeAttribute('onchange');
                el.onchange = null;
                // console.log('Tampermonkey: 移除 onchange __doPostBack', el);
            }
        });
    }

    // 監控 DOM 變化（支援 AJAX 更新）
    const observer = new MutationObserver(removeOnChangePostBack);
    observer.observe(document.body, { childList: true, subtree: true });

    // 頁面載入時先移除一次
    removeOnChangePostBack();

})();
