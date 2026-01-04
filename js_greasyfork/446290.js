// ==UserScript==
// @name         Gmail dark mode helper
// @namespace    http://tampermonkey.net/
// @version      20220610
// @description  Apply pseudo dark mode to email pane.
// @author       chrono-meter@gmx.net
// @match        https://mail.google.com/mail/*
// @icon         https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446290/Gmail%20dark%20mode%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/446290/Gmail%20dark%20mode%20helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
    @media (prefers-color-scheme: dark) {
        :root {
            --dark-mode-basic-background-color: #161616;
            --dark-mode-control-background-color: #444;
            --dark-mode-control-hover-background-color: #555;
            --dark-mode-text-color: #fff;
            --dark-mode-sub-text-color: #999;
            --dark-mode-link-color: #809fff;

            --dark-mode-basic-background-color: #000;
            --dark-mode-control-background-color: #161616;
            --dark-mode-control-hover-background-color: #323232;
            --dark-mode-text-color: #fff;
            --dark-mode-sub-text-color: #bbb;
            --dark-mode-link-color: #809fff;
        }
        .aUU {
            background-color: var(--dark-mode-basic-background-color);
        }
        /* mail separator */
        .aUU .hx .ky .Bk .G2,
        .aUU .hx .kv .Bk .G2,
        .aUU .hx .h7 .Bk .G2,
        .aUU .hx .bx .Bk .G2,
        .aUU .bh>.adv>.Bk::after {
            border-color: var(--dark-mode-sub-text-color);
        }
        /* mail title */
        .aUU .ha > .hP {
            color: var(--dark-mode-text-color);
        }
        /* From name */
        .aUU .hx .gD {
            color: var(--dark-mode-text-color);
        }
        /* From address */
        .aUU .go {
            color: var(--dark-mode-sub-text-color);
        }
        /* summary card */
        .aUU .qY {
            background-color: var(--dark-mode-control-background-color);
            color: var(--dark-mode-text-color);
        }
        .aUU .qY .vU {
            color: var(--dark-mode-text-color);
        }
        .aUU .qY .tl {
            filter: invert(1);
        }
        .aUU .qY .t2,
        .aUU .qY .vL {
            color: var(--dark-mode-sub-text-color);
        }

        /* 省略されているメールの本文 */
        .aUU .g6 {
            color: var(--dark-mode-sub-text-color);
        }
        /* text mail body */
        .aUU .ii.gt .a3s.aiL:not(.html),
        .aUU .ii.gt .a3s.aiL:not(.html) * {
            color: var(--dark-mode-text-color);
        }
        /* tags in body */
        .aUU .ii.gt .a3s.aiL:not(.html) a[href] {
            color: var(--dark-mode-link-color);
        }
        .aUU .ii.gt .a3s.aiL:not(.html) > p,
        .aUU .ii.gt .a3s.aiL:not(.html) > span,
        .aUU .ii.gt .a3s.aiL:not(.html) > ul {
            color: var(--dark-mode-text-color);
        }
        /* html mail */
        .aUU .ii.gt .a3s.aiL.html {
            filter: invert(1);
        }
        .aUU .ii.gt .a3s.aiL.html,
        .aUU .ii.gt .a3s.aiL.html > * {
            background-color: var(--dark-mode-text-color);
        }
        .aUU .ii.gt .a3s.aiL.html table[background*="googleusercontent.com/"],
        .aUU .ii.gt .a3s.aiL.html img[src*="googleusercontent.com/"] {
            filter: invert(1);
        }
        /* youtube  */
        .aUU .ii.gt .a3s.aiL.html img[src*="ggpht.com/ytc/"] {
            filter: invert(1);
        }
        /* メッセージ全体を表示 */
        .aUU .ii.gt .a3s.aiL > .iX {
            background-color: var(--dark-mode-basic-background-color);
        }
        .aUU .ii.gt .a3s.aiL > .iX a {
            color: var(--dark-mode-link-color);
            background-color: var(--dark-mode-basic-background-color);
        }
        .aUU .ii.gt .a3s.aiL.html > .iX {
            filter: invert(1);
            color: var(--dark-mode-text-color);
        }
        /* To */
        .aUU .hx .hb {
            color: var(--dark-mode-sub-text-color);
        }
        /* To の右の arrow down icon */
        .aUU .ajy > .ajz {
            filter: invert(1);
        }
        /* star icon */
        .aUU .bi4 > .T-KT:not(.T-KT-Jp):not(.byM)::before {
            filter: invert(1);
        }
        /* email timestamp */
        .aUU .ig .g3,
        .aUU .hI .g3,
        .aUU .iv .g3 {
            color: var(--dark-mode-text-color);
        }
        /* 省略されたメールの数 */
        .aUU .bh > .adv .adx span {
            color: var(--dark-mode-basic-background-color);
        }
        /* 詳細ヘッダーのダイアログ */
        .aUU .ajA {
            background-color: var(--dark-mode-control-background-color);
            color: var(--dark-mode-text-color);
        }
        .aUU .ajA .bg0 {
            filter: invert(1);
        }
        .aUU .ajA .gt a {
            color: var(--dark-mode-link-color);
        }
        /* メールのドットメニュー */
        .aUU .J-M {
            background-color: var(--dark-mode-control-background-color);
        }
        .aUU .J-M .cj {
            color: var(--dark-mode-text-color);
        }
        .aUU .J-M .J-N:hover {
            background-color: var(--dark-mode-control-hover-background-color);
        }
        .aUU .J-M .hB,
        .aUU .J-M .mL,
        .aUU .J-M .mI {
            filter: invert(1);
        }
        /* 翻訳バナー */
        .aUU .btm > .adI {
            background-color: var(--dark-mode-control-background-color);
        }
        .aUU .btm > .adI .J-JN-M-I {
            color: var(--dark-mode-text-color);
        }
        .aUU .btm > .adI .B9 {
            color: var(--dark-mode-link-color);
        }
        .aUU .btm > .adI .hc,
        .aUU .btm > .adI .adG {
            filter: invert(1);
        }
        .aUU .btm > .adI .J-JN-M-I-JG {
            filter: invert(1);
        }
        /* 各種アイコン */
        .aUU .btm > .adI .zz {
            filter: invert(1);
        }
        .aUU .T-I .T-I-J3 {
            filter: invert(1);
        }
        /* 返信、転送 バナー */
        .aUU .nr {
            background-color: var(--dark-mode-basic-background-color);
        }
        .aUU .nr .amn > .ams {
            background-color: var(--dark-mode-control-background-color);
            color: var(--dark-mode-text-color);
        }
        .aUU .nr .amn > .ams::before {
            filter: invert(1);
        }
        .aUU .nr .amn > .ams:hover,
        .aUU .nr .amn > .ams:focus {
            background-color: var(--dark-mode-control-hover-background-color);
        }
        /* メールを削除しましたバナー */
        .aUU .iS,
        .aUU .iU {
            background-color: var(--dark-mode-control-background-color);
            color: var(--dark-mode-text-color);
        }
        .aUU .iS .iT {
            color: var(--dark-mode-link-color);
        }
        /* 添付ファイル */
        .aUU .ho>.aVW {
            color: var(--dark-mode-text-color);
        }
        /* 新しいメール */
        .aUU .HM .I5 :not(.btC) * {
            color: initial;
        }
        .aUU .HM .I5 .btC .btA .Uo {
            color: var(--dark-mode-text-color);
        }
        .aUU .HM .I5 .btC .btA .T-I .T-I-J3 {
            filter: none;
        }
    }
    `);

    new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            for (const addedNode of mutation.addedNodes) {
                if (addedNode instanceof HTMLElement && addedNode.getAttribute('role') === 'listitem'){
                    for (const mailBody of addedNode.querySelectorAll('.ii.gt .a3s.aiL')){
                        if ([...mailBody.querySelectorAll('*')].some(_ => (_.style.backgroundColor || _.style.color || _.bgColor) && (!_.matches('.gmail_chip, .gmail_chip *')))){
                            mailBody.classList.add('html');
                        }
                    }
                }
            }
        });
    }).observe(document.documentElement || document.body, { childList: true, subtree: true });
})();