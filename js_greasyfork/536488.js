// ==UserScript==
// @name         Tokyo Tech Portal Login Enhancer
// @version      0.0.1
// @description  Enable better autofill on Tokyo Tech Portal login form
// @namespace    yas_ako_6
// @match        https://portal.nap.gsic.titech.ac.jp/GetAccess/Login*
// @license      MIT
// @author       https://x.com/yas_ako_6
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536488/Tokyo%20Tech%20Portal%20Login%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/536488/Tokyo%20Tech%20Portal%20Login%20Enhancer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ユーザー名入力欄に autocomplete="username" を追加
    const usernameInput = document.querySelector('input[name="usr_name"]');
    if (usernameInput) {
        usernameInput.setAttribute("autocomplete", "username");
    }

    // MutationObserver を使って TOTP フィールドが動的に現れたときに、 type を password から text に変更
    // これにより、パスワードマネージャーがソフトトークンをパスワードだと勘違いしなくなる
    const observer = new MutationObserver(() => {
        const totpInput = document.querySelector('input[name="message4"]');
        if (totpInput && totpInput.type === "password") {
            totpInput.type = "text";
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
})();
