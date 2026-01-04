// ==UserScript==
// @name         AtCoder Titile Copy Bottun
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  問題名を左詰めでコピーするボタンが生成されます．
// @author       kumo
// @match        https://atcoder.jp/contests/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485785/AtCoder%20Titile%20Copy%20Bottun.user.js
// @updateURL https://update.greasyfork.org/scripts/485785/AtCoder%20Titile%20Copy%20Bottun.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function copyButton() {
        try {
            let textToCopy = document.querySelector(".h2").innerText;
            // 半角スペース、英数字、ハイフン以外の文字を削除
            textToCopy = textToCopy.replace(/\s/g, '');
            textToCopy = textToCopy.replace(/[^a-zA-Z0-9-]/g, '');
            navigator.clipboard.writeText(textToCopy).then(() => {
                $(this).tooltip('show');
                $(this).blur();
                setTimeout(() => { $(this).tooltip('hide'); }, 800);
            });
        } catch (err) {
            console.log(err);
        }
    }

    function addCopyButton(element) {
        const uuid = self.crypto.randomUUID();
        element.setAttribute('id', uuid);

        const copyBtn = $(`<button class="btn btn-default btn-xs btn-copy ml-1" tabindex="0" data-toggle="tooltip" data-trigger="manual" title="Copied!" data-target="${uuid}">Copy Title</button>`);
        $(element).after(copyBtn);
        copyBtn.click(copyButton);

        // ボタンの位置を微調整
        copyBtn.css({
            position: 'absolute',
            top: '9px',
        });
    }

    const targetElement = document.querySelector(".h2");
    addCopyButton(targetElement);
})();
