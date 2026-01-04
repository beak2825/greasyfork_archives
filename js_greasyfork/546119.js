// ==UserScript==
// @name         Google Labs FX (ImageFX) ダウンロード名変更（フック版）
// @namespace    https://labs.google/fx/ja/library
// @version      2025-08-17
// @description  即時ダウンロードのファイル名を「プロンプト_シード_連番(5桁)」に変更
// @author       Nyampasu
// @match        https://labs.google/fx/ja/library*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546119/Google%20Labs%20FX%20%28ImageFX%29%20%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%89%E5%90%8D%E5%A4%89%E6%9B%B4%EF%BC%88%E3%83%95%E3%83%83%E3%82%AF%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/546119/Google%20Labs%20FX%20%28ImageFX%29%20%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%89%E5%90%8D%E5%A4%89%E6%9B%B4%EF%BC%88%E3%83%95%E3%83%83%E3%82%AF%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let counter = 1;

    // a.click をフック
    const origClick = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function() {
        try {
            if (this.download) {
                // プロンプトとシード取得
                const elems = document.querySelectorAll('.sc-e6a99d5c-3.eVxyTT');
                if (elems.length >= 2) {
                    let prompt = elems[0].innerText.trim();
                    let seed = elems[1].innerText.trim();
                    prompt = prompt.replace(/[\\/:*?"<>|]/g, '_');

                    const num = String(counter).padStart(5, '0');
                    counter++;

                    // 元の拡張子を保持
                    const extMatch = this.href.match(/(\.[a-zA-Z0-9]+)(?:\?|#|$)/);
                    const ext = extMatch ? extMatch[1] : '.jpg';

                    // 新しいファイル名をセット
                    this.download = `${prompt}_${seed}_${num}${ext}`;
                }
            }
        } catch (e) {
            console.error('Tampermonkey rename error:', e);
        }
        return origClick.apply(this, arguments);
    };

})();
