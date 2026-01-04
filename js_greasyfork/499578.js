// ==UserScript==
// @name         NHKプラス キーボード操作可能に
// @namespace    https://yyya-nico.co/
// @version      1.0.0
// @description  NHKプラスのキーボード操作を一部拡張します。カーソル左右で進む/戻る、スペースで一時停止/再生、カーソル上下で再生速度変更。
// @author       yyya_nico
// @license      MIT License
// @match        https://plus.nhk.jp/watch/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nhk.jp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499578/NHK%E3%83%97%E3%83%A9%E3%82%B9%20%E3%82%AD%E3%83%BC%E3%83%9C%E3%83%BC%E3%83%89%E6%93%8D%E4%BD%9C%E5%8F%AF%E8%83%BD%E3%81%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/499578/NHK%E3%83%97%E3%83%A9%E3%82%B9%20%E3%82%AD%E3%83%BC%E3%83%9C%E3%83%BC%E3%83%89%E6%93%8D%E4%BD%9C%E5%8F%AF%E8%83%BD%E3%81%AB.meta.js
// ==/UserScript==

(() => {
    'use strict';

    document.addEventListener('keydown', e => {
        switch (e.key) {
            case 'ArrowUp'   :
            case 'ArrowDown' :
                (() => {
                    e.preventDefault();
                    const menuOpenBtn = document.querySelector('button[aria-label="再生速度"]');
                    menuOpenBtn?.click();
                    setTimeout(() => {
                        const btns = document.querySelectorAll("#playbackRateMenu button");
                        const selectedIndex = [...btns].findIndex(elem => elem.classList.contains('-selected'));
                        switch(e.key) {
                            case 'ArrowUp'   : btns[selectedIndex === btns.length - 1 ? 0 : selectedIndex + 1]?.click(); break;
                            case 'ArrowDown' : btns[selectedIndex === 0 ? btns.length - 1 : selectedIndex - 1]?.click(); break;
                        }
                    }, 1);
                })();
                break;
            case 'ArrowRight': document.querySelector('button[aria-label="30秒進む"]')?.click(); e.preventDefault(); e.stopPropagation(); break;
            case 'ArrowLeft' : document.querySelector('button[aria-label="10秒戻る"]')?.click(); e.preventDefault(); e.stopPropagation(); break;
            case ' '         : document.querySelector('button:is([aria-label="再生"],[aria-label="一時停止"])')?.click(); e.preventDefault(); break;
        }
    });
})();