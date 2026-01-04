// ==UserScript==
// @name         AtCoderRecursionLimitWarning
// @namespace    https://github.com/AwashAmityOak
// @version      0.1.0
// @description  Warn against using DFS without `setrecursionlimit` on Python.
// @author       AwashAmityOak
// @license      MIT
// @match        https://atcoder.jp/contests/*/tasks/*
// @match        https://atcoder.jp/contests/*/submit*
// @grant        unsafeWindow
// @copyright    2025 AwashAmityOak (https://github.com/AwashAmityOak)
// @downloadURL https://update.greasyfork.org/scripts/540733/AtCoderRecursionLimitWarning.user.js
// @updateURL https://update.greasyfork.org/scripts/540733/AtCoderRecursionLimitWarning.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const $ = unsafeWindow.$;

    ace.edit("editor").addEventListener("change", () => {
        const button = $("#submit");

        const lang = $("#select-lang select[name='data.LanguageId']");
        if (lang.find(":selected").text().indexOf("Python") == -1) {
            $(".AtCoderRecursionLimitWarning").remove();
            button.css("backgroundColor", "");
            button.css("borderColor", "");
            return;
        }

        const code = ace.edit("editor").getValue();

        if (code.toLowerCase().indexOf("dfs") != -1 && !/setrecursionlimit/.test(code)) {
            let br = $("<br>");
            let span = $("<span>⚠️Recursion Limit 未設定</span>");
            br.addClass("AtCoderRecursionLimitWarning");
            span.addClass("AtCoderRecursionLimitWarning");

            if (!$("br.AtCoderRecursionLimitWarning").length) button.append(br);
            if (!$("span.AtCoderRecursionLimitWarning").length) button.append(span);

            button.css("backgroundColor", "#cc3333");
            button.css("borderColor", "#cc3333");
        } else {
            $(".AtCoderRecursionLimitWarning").remove();
            button.css("backgroundColor", "");
            button.css("borderColor", "");
        }
    });
})();
