// ==UserScript==
// @name         Greasy Fork editor adjuster
// @namespace    https://greasyfork.org/ja/users/570127
// @version      2025.12.14.5
// @description  Automatically adjusts the height of editor.
// @description:ja ソースエディタのテキストエリアの高さを行数に応じて高くします。
// @author       universato
// @match        https://greasyfork.org/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456082/Greasy%20Fork%20editor%20adjuster.user.js
// @updateURL https://update.greasyfork.org/scripts/456082/Greasy%20Fork%20editor%20adjuster.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const textarea = document.querySelector('#script_version_code');
    if (!textarea) return;

    // Adjust the height of editor.
    const numberOfLines = textarea.value.split('\n').length;
    textarea.style.height = (18 * Math.min(44, Math.max(12, numberOfLines))) + "px";

    const submit = document.querySelector('input[type="submit"][name="commit"]');
    if (!submit) return;

    return;

    submit.addEventListener('click', function (event) {
        const hasTrailingSpace = /[ \t]+$/m.test(textarea.value);
        if (!hasTrailingSpace) return;

        const proceed = confirm(
            '[UserScript] Greasy Fork editor adjuster:\n\n' +
            'Trailing whitespace were found.\n\n' +
            'Do you want to continue and submit anyway?'
        );

        if (!proceed) {
            event.preventDefault();
            event.stopPropagation();
        }
        // proceed === true の場合は何もせず送信続行
    }, true); // capture
})();