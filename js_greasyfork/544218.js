// ==UserScript==
// @name         東京大学学生会館・キャンパスプラザ共用部屋申請フォーム自動入力
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  カスタムURLによる自動入力を有効にする
// @match        https://chusen.gkuc.net/group_first_lottery*
// @match        https://chusen.gkuc.net/group_second_lottery*
// @match        https://chusen.gkuc.net/individual_first_lottery*
// @match        https://chusen.gkuc.net/individual_second_lottery*
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544218/%E6%9D%B1%E4%BA%AC%E5%A4%A7%E5%AD%A6%E5%AD%A6%E7%94%9F%E4%BC%9A%E9%A4%A8%E3%83%BB%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%91%E3%82%B9%E3%83%97%E3%83%A9%E3%82%B6%E5%85%B1%E7%94%A8%E9%83%A8%E5%B1%8B%E7%94%B3%E8%AB%8B%E3%83%95%E3%82%A9%E3%83%BC%E3%83%A0%E8%87%AA%E5%8B%95%E5%85%A5%E5%8A%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/544218/%E6%9D%B1%E4%BA%AC%E5%A4%A7%E5%AD%A6%E5%AD%A6%E7%94%9F%E4%BC%9A%E9%A4%A8%E3%83%BB%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%91%E3%82%B9%E3%83%97%E3%83%A9%E3%82%B6%E5%85%B1%E7%94%A8%E9%83%A8%E5%B1%8B%E7%94%B3%E8%AB%8B%E3%83%95%E3%82%A9%E3%83%BC%E3%83%A0%E8%87%AA%E5%8B%95%E5%85%A5%E5%8A%9B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 対応済みの name 属性
    const fields = [
        'organization-name',
        'user-name',
        'student-id',
        'email',
        'email-check',
        'target-date',
        'gozen',
        'gogo',
        'yoru'
        // 必要があればここに追加
    ];

    const params = new URL(location.href).searchParams;

    fields.forEach(field => {
        const value = params.get(field);
        if (value) {
            const el = document.querySelector(`[id="${field}"]`);
            if (el) {
                el.value = value;
                el.dispatchEvent(new Event('input'));
            }
        }
    })
    for (let i = 1; i <= 10; i++){
        const value = params.get("wish" + String(i));
        if (value) {
            const el = document.querySelector(`input[name="wish${i}"][value="${value}"]`);
            if (el) {
                el.checked = true;
            }
        }
    }
    document.querySelector(`[id="agreement"]`).checked = true;
})();
