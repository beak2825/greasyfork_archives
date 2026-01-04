// ==UserScript==
// @name         AtCoder Duplicate Checker
// @namespace    https://github.com/Raclamusi
// @version      1.0.2
// @description  重複提出をチェックします。 Check for duplicate submissions.
// @author       Raclamusi
// @supportURL   https://github.com/Raclamusi/atcoder-duplicate-checker
// @match        https://atcoder.jp/contests/*/tasks/*
// @match        https://atcoder.jp/contests/*/submit*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454704/AtCoder%20Duplicate%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/454704/AtCoder%20Duplicate%20Checker.meta.js
// ==/UserScript==

// AtCoder Duplicate Checker
//
// Copyright (c) 2022 Raclamusi
//
// This software is released under the MIT License, see https://github.com/Raclamusi/atcoder-duplicate-checker/blob/main/LICENSE .

(function () {
    "use strict";

    const getButtonText = lang => {
        const texts = {
            ja: "重複チェック中...",
            en: "Duplicate Checking...",
        };
        return texts[lang in texts ? lang : "ja"];
    };

    const getMessage = (lang, time) => {
        const messages = {
            ja: ["過去に同じコードを提出しています。", "本当に提出しますか？"],
            en: ["You have submitted the same code before.", "Are you sure you want to submit it?"],
        };
        const msg = messages[lang in messages ? lang : "ja"];
        return `${msg[0]} (${time})\n${msg[1]}`;
    };

    const aceEditor = ace.edit("editor");
    const plainEditor = document.getElementById("plain-textarea");
    const getSourceCode = () => {
        if (plainEditor.style.display === "none") {
            return aceEditor.getValue();
        }
        return plainEditor.value;
    };

    const getSubmissions = async contest => {
        const response = await fetch(`https://atcoder.jp/contests/${contest}/submissions/me`);
        const htmlText = await response.text();
        const iter = htmlText.matchAll(/<tr(?:.|\s)*?<time[^>]*>(.+?)<\/time>(?:.|\s)*?submissions\/(\d+)(?:.|\s)*?<\/tr>/g);
        return [...iter].map(([_, time, id]) => ({ time, id }));
    };

    const getSubmittedCode = async (contest, id) => {
        const response = await fetch(`https://atcoder.jp/contests/${contest}/submissions/${id}`);
        const htmlText = await response.text();
        const escapedCode = htmlText.match(/<pre id="submission-code"[^>]*>([^<]*)<\/pre>/)[1];
        const preElement = document.createElement("pre");
        preElement.innerHTML = escapedCode;
        return preElement.textContent;
    };

    const getDuplicateSubmisionTime = async code => {
        for (const { time, id } of await getSubmissions(contestScreenName)) {
            if (code === await getSubmittedCode(contestScreenName, id)) {
                return time;
            }
        }
        return null;
    };

    const submitButton = document.getElementById("submit");
    const submitButtonClickListener = e => {
        // チェックを待つため、一旦提出をキャンセル
        e.preventDefault();

        // チェック中であれば即終了
        if (submitButton.disabled) return;

        // 提出ボタンの表示を変更
        submitButton.disabled = true;
        const buttonText = submitButton.textContent;
        submitButton.textContent = getButtonText(LANG);

        (async () => {
            // 重複チェック
            const time = await getDuplicateSubmisionTime(getSourceCode());
            if (time === null || confirm(getMessage(LANG, time))) {
                // チェックが通ったら、このイベントリスナを外して本来の提出の処理をする
                submitButton.removeEventListener("click", submitButtonClickListener);
                setTimeout(() => submitButton.click());
            }

            // 提出ボタンの表示を戻す
            submitButton.disabled = false;
            submitButton.textContent = buttonText;
        })();
    };
    submitButton.addEventListener("click", submitButtonClickListener, { passive: false });
})();
