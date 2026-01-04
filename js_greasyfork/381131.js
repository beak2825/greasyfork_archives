// ==UserScript==
// @name         JetBrainsManualJapaneseCustom
// @namespace    cypher256.JetBrainsManualJapaneseCustom
// @version      1.7
// @description  JetBrainsマニュアルの日本翻訳版ページと公式を行ったり来たり出来ます（右クリック開く対応）
// @author       cypher256 (origin mikan-megane)
// @match        https://www.jetbrains.com/help/*
// @match        https://pleiades.io/help/*
// @run-at       document-end
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/381131/JetBrainsManualJapaneseCustom.user.js
// @updateURL https://update.greasyfork.org/scripts/381131/JetBrainsManualJapaneseCustom.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
    'use strict';
    var official = location.hostname == 'www.jetbrains.com';

    function replaceLink() {
        return 'https://' + (official ? 'pleiades.io' : 'www.jetbrains.com') + location.href.replace(/^https:..[^\/]+/, '');
    }

    function toggleJapanese(e) {
        var a = document.getElementById('help_link');
        a.href = replaceLink();
        e.stopPropagation();
    }

    var wapper = document.createElement('div');
    wapper.style.position = 'fixed';
    wapper.style.right = 0;
    wapper.style.top = 0;
    wapper.style.zIndex = 1000;
    var link = document.createElement('a');
    link.setAttribute('id', 'help_link');
    link.setAttribute('href', replaceLink());
    link.setAttribute('class', 'dropdown__trigger-value');
    link.appendChild(document.createTextNode(official ? '日本語ページへ' : '英語ページへ'));
    link.addEventListener('click', toggleJapanese, false);
    link.addEventListener('mousedown', toggleJapanese, false);
    wapper.appendChild(link);

    var body = document.getElementsByTagName('body')[0];
    body.insertBefore(wapper, body.firstChild);
});
