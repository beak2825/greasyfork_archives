// ==UserScript==
// @name         ニコニコ大百科 ピコExt
// @namespace    https://yyya-nico.co/
// @version      1.0.4
// @description  投稿されているピコカキコのプレイヤー下に便利機能を足します。
// @author       yyya_nico
// @license      MIT License
// @match        https://dic.nicovideo.jp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nicovideo.jp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512737/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%A4%A7%E7%99%BE%E7%A7%91%20%E3%83%94%E3%82%B3Ext.user.js
// @updateURL https://update.greasyfork.org/scripts/512737/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%A4%A7%E7%99%BE%E7%A7%91%20%E3%83%94%E3%82%B3Ext.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const pikos = document.querySelectorAll('[id^="piko"]');

    const idRegex = /piko[a-z]*(\d+)(_u\d+)?/;
    [...pikos].forEach(piko => {
        const mmlId = piko.id.replace(idRegex, '$1');

        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = 'MMLをコピー';
        button.onclick = async () => {
            const mmlText = await fetch(`/mml/${mmlId}`).then(res => res.text());
            const textCache = button.textContent;
            button.disabled = true;
            navigator.clipboard.writeText(mmlText)
                .then(() => {
                    button.disabled = true;
                    button.textContent = 'コピーしました';
                    setTimeout(() => {
                        button.textContent = textCache;
                        button.disabled = false;
                    }, 1500);
                })
                .catch(e => alert('コピーできませんでした\n' + e));
        };
        const a = document.createElement('a');
        a.href = `/mml/${mmlId}`;
        a.textContent = mmlId;
        const div = document.createElement('div');
        div.append(button, ' ', a);
        piko.after(div);
    });
})();