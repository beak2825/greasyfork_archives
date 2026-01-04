// ==UserScript==
// @name         AtCoder copy button adder
// @namespace    https://github.com/H20-DHMO
// @version      1.1
// @description  AtCoderの問題文中の文字列にの横にコピーボタンを置きます。
// @author       H20_dhmo
// @license      MIT
// @match        https://atcoder.jp/contests/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485389/AtCoder%20copy%20button%20adder.user.js
// @updateURL https://update.greasyfork.org/scripts/485389/AtCoder%20copy%20button%20adder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // copy button
    function copyButton() {
        window.getSelection().removeAllRanges();
        try {
            const targetId = $(this).data('target');
            const text = $('#' + targetId).text();
            navigator.clipboard.writeText(text).then(() => {
                $(this).tooltip('show');
                $(this).blur();
                setTimeout(() => { $(this).tooltip('hide'); }, 800);
            });
        } catch (err) {
            console.log(err);
        }
        window.getSelection().removeAllRanges();
    }


    function addCopyButton(element) {
        // コピー用のボタン（span要素）を作成
        const uuid = self.crypto.randomUUID();
        element.setAttribute('id', uuid);

        const copyBtn = $(`<span class="btn btn-default btn-xs btn-copy ml-1" tabindex="0" data-toggle="tooltip" data-trigger="manual" title="Copied!" data-target="${uuid}">Copy</span>`);
        $(element).after(copyBtn);
        copyBtn.click(copyButton);
    }

    // 問題内の<code>要素を取得
    const codes = document.querySelectorAll('#task-statement .part code');
    codes.forEach(function(elm) {
        addCopyButton(elm);
    });

})();