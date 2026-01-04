// ==UserScript==
// @name         Scratch Bioとアイコン内容変更
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ScratchのユーザーのBio内容とアイコンを変更するスクリプト
// @author       You
// @match        https://scratch.mit.edu/*
// @grant        none
// @license 　　 MIT
// @downloadURL https://update.greasyfork.org/scripts/525522/Scratch%20Bio%E3%81%A8%E3%82%A2%E3%82%A4%E3%82%B3%E3%83%B3%E5%86%85%E5%AE%B9%E5%A4%89%E6%9B%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/525522/Scratch%20Bio%E3%81%A8%E3%82%A2%E3%82%A4%E3%82%B3%E3%83%B3%E5%86%85%E5%AE%B9%E5%A4%89%E6%9B%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const newIconUrl = 'https://uploads.scratch.mit.edu/get_image/user/140087119_110x110.png';

    // BioとアイコンのURLを変更する関数
    const changeBioAndIcons = () => {
        // Bioの変更
        const bios = document.querySelectorAll('#bio-readonly .viewport .overview');
        bios.forEach(bio => {
            bio.textContent = '@Toyota1337 wuz here https://scratch.mit.edu/users/Toyota1337/';
        });

        // アイコンのURL変更
        const icons = document.querySelectorAll('img[src*="scratch.mit.edu/get_image/user"]');
        icons.forEach(icon => {
            icon.src = newIconUrl;
        });
    };

    // 初回適用
    changeBioAndIcons();

    // DOMの変化を監視して、Bioとアイコンが追加された場合に変更を適用
    const observer = new MutationObserver(changeBioAndIcons);

    // 設定: DOMの変更を監視（子ノードの追加）
    observer.observe(document.body, { childList: true, subtree: true });
})();
