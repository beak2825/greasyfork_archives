// ==UserScript==
// @name         Custom Validation
// @namespace    https://twitter.com/kumrnm
// @version      1.0.1
// @description  入力欄に禁止語句を入力した際に警告文を表示する
// @author       蝙蝠の目
// @license      MIT
// @match        *://*/*
// @downloadURL https://update.greasyfork.org/scripts/446144/Custom%20Validation.user.js
// @updateURL https://update.greasyfork.org/scripts/446144/Custom%20Validation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 検出する語句をここで指定します（記述方法は「正規表現」でググってください）
    const pattern = /あいうえおあいうえお/;

    const excludes = new Set();

    window.addEventListener("keyup", () => {
        const elm = document.activeElement;
        if (!elm) return;
        if (excludes.has(elm)) return;
        if (elm.tagName === "INPUT" || elm.tagName === "TEXTAREA") {
            const match = elm.value.match(pattern);
            if (match) {
                if (window.confirm("[Custom Validation]\n禁止語句の入力を検出しました。削除しますか？\n（「いいえ」を選択すると、ページを閉じるまでこの入力欄に対する検査を停止します。）")) {
                    elm.value = elm.value.substring(0, match.index) + elm.value.substring(match.index + match[0].length);
                } else {
                    excludes.add(elm);
                }
            }
        }
    });

    console.log("[Custom Validation] Activated.");
})();