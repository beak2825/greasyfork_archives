// ==UserScript==
// @name         ouo.io bypass
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  auto ouo.io skip
// @author       aligood
// @match        *://ouo.io/*
// @match        *://ouo.press/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519309/ouoio%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/519309/ouoio%20bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // هذه الدالة تبحث عن جميع العناصر التي تحمل الكلاس المحدد وتنقر على أول عنصر تجده
    function clickButton() {
        const button = document.querySelector('.btn-main.btn');
        if (button) {
            button.click();
        }
    }

    // نستخدم مراقبًا لمراقبة تغييرات DOM، بحيث يتم تنفيذ الدالة أعلاه عند إضافة عنصر جديد يحمل الكلاس المحدد
    const observer = new MutationObserver(clickButton);
    observer.observe(document.body, { childList: true, subtree: true });

    // ندعو الدالة مرة واحدة في البداية للتحقق من وجود أزرار موجودة بالفعل
    clickButton();
})();