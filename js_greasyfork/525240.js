// ==UserScript==
// @name         BLOXD.IO Customizer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  تخصيص تجربة اللعب في Bloxd.io بإضافة عبارات مميزة وتعديلات مرئية
// @author       You
// @match        https://bloxd.io/
// @match        https://apkpure.bloxd.io/
// @match        https://staging.bloxd.io/
// @match        https://www.bloxd.io/
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/525240/BLOXDIO%20Customizer.user.js
// @updateURL https://update.greasyfork.org/scripts/525240/BLOXDIO%20Customizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let pressCount = 0;
    let customPhrase = "🔥_Unstoppable_🔥"; // العبارة المميزة

    // تعديل مظهر اللعبة (تحسين الألوان والخطوط)
    GM_addStyle(`
        body {
            background-color: #1a1a1a !important;
            color: #fff !important;
        }
        .chat-box {
            font-size: 16px !important;
            font-weight: bold !important;
            color: #00ffcc !important;
        }
    `);

    // إضافة عبارة مميزة عند الضغط على Enter
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            pressCount++;
            let chatInput = document.querySelector('input[type="text"]'); // تحديد صندوق الدردشة
            if (chatInput && pressCount % 2 !== 0) {
                chatInput.value += ` ${customPhrase}`;
            }
        }
    });
})();
