// ==UserScript==
// @name         AtCoderLeftShiftOverflowWarning
// @namespace    https://github.com/AwashAmityOak
// @version      0.1.0
// @description  Warn you when you write `1 << x` on AtCoder.
// @author       AwashAmityOak
// @license      MIT
// @match        https://atcoder.jp/contests/*/tasks/*
// @match        https://atcoder.jp/contests/*/submit*
// @grant        unsafeWindow
// @copyright    2025 AwashAmityOak (https://github.com/AwashAmityOak)
// @downloadURL https://update.greasyfork.org/scripts/536353/AtCoderLeftShiftOverflowWarning.user.js
// @updateURL https://update.greasyfork.org/scripts/536353/AtCoderLeftShiftOverflowWarning.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const $ = unsafeWindow.$;

    ace.edit("editor").addEventListener("change", () => {
        const button = $("#submit");

        const lang = $("#select-lang select[name='data.LanguageId']");
        if (lang.find(":selected").text().indexOf("C++") == -1) return;

        const code = ace.edit("editor").getValue();

        if (/(?<!<<\s*)(?<![a-zA-Z_])\d+\s*<</.test(code)) {
            let br = $("<br>");
            let span = $("<span>⚠️左シフトオーバーフロー</span>");
            br.addClass("AtCoderLeftShiftOverflowNotifier");
            span.addClass("AtCoderLeftShiftOverflowNotifier");

            if (!$("br.AtCoderLeftShiftOverflowNotifier").length) button.append(br);
            if (!$("span.AtCoderLeftShiftOverflowNotifier").length) button.append(span);

            button.css("backgroundColor", "#cc3333");
            button.css("borderColor", "#cc3333");
        } else {
            $(".AtCoderLeftShiftOverflowNotifier").remove();
            button.css("backgroundColor", "");
            button.css("borderColor", "");
        }
    });
})();
