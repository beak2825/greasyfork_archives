// ==UserScript==
// @name         JetBrainsManualJapanese
// @namespace    mikan-megane.JetBrainsManualJapanese
// @version      1.2
// @description  JetBrainsマニュアルの日本翻訳版ページと公式を行ったり来たり出来ます
// @author       mikan-megane
// @match        https://www.jetbrains.com/help/*
// @match        https://pleiades.io/help/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40898/JetBrainsManualJapanese.user.js
// @updateURL https://update.greasyfork.org/scripts/40898/JetBrainsManualJapanese.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var official = location.hostname == 'www.jetbrains.com';

    function toggleJapanese(e) {
        e.preventDefault();
        location.hostname = official ? 'pleiades.io' : 'www.jetbrains.com';
    }

    var wapper = document.createElement('div');
    wapper.setAttribute('class', 'group__item');
    var link = document.createElement('a');
    link.setAttribute('href', 'https://' + (official ? 'pleiades.io' : 'www.jetbrains.com') + '/help/');
    link.setAttribute('class', '_wt-button_snls9p_1 _wt-button_mode_contrast_snls9p_277 _wt-button_size_s_snls9p_104 _wt-button_theme_dark_snls9p_76 wt-button_align-icon_left header__download');
    link.appendChild(document.createTextNode(official ? '日本語ページへ' : '公式ページへ'));
    link.addEventListener('click', toggleJapanese,false);
    wapper.appendChild(link);
    var $links = document.querySelector('.header__switchers');
    $links.insertBefore(link, $links.nextSibling);

})();