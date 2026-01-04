// ==UserScript==
// @name         縦横軸設定リマインダー
// @namespace    http://tampermonkey.net/
// @version      1.00.1
// @description  受発注チェック画面で縦横軸管理画面に飛ぶ新たなボタンを追加
// @license      MIT
// @match        *://plus-nao.com/forests/*/sku_check/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512159/%E7%B8%A6%E6%A8%AA%E8%BB%B8%E8%A8%AD%E5%AE%9A%E3%83%AA%E3%83%9E%E3%82%A4%E3%83%B3%E3%83%80%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/512159/%E7%B8%A6%E6%A8%AA%E8%BB%B8%E8%A8%AD%E5%AE%9A%E3%83%AA%E3%83%9E%E3%82%A4%E3%83%B3%E3%83%80%E3%83%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentUrl = window.location.href;
    let code = currentUrl.split('/').pop();
    let axisLink = `https://starlight.plusnao.co.jp/goods/axisCode?code=${code}`;

    let saveButton = document.querySelector('.submit input[value="保存して出品完了"]');
    if (saveButton) {
        let axisButton = document.createElement('input');
        axisButton.type = 'button';
        axisButton.value = '保存して縦横軸設定を開く';
        axisButton.style.background = '#D6DADE';
        axisButton.style.border = '1px solid #6C808C';
        axisButton.style.color = '#6C808C';
        axisButton.style.padding = '4px 8px';
        axisButton.style.textDecoration = 'none';
        axisButton.style.minWidth = '0';
        axisButton.style.fontWeight = 'normal';
        axisButton.style.display = 'inline-block';
        axisButton.style.width = 'auto';
        axisButton.style.marginLeft = '10px';
        axisButton.style.fontSize = '110%';

        axisButton.addEventListener('mouseover', function() {
            axisButton.style.background = '-webkit-gradient(linear, left top, left bottom, from(#f7f7e1), to(#eeeca9))';
            axisButton.style.color = '#ffffff';
            axisButton.style.border = '1px solid #454D6B';
        });

        axisButton.addEventListener('mouseout', function() {
            axisButton.style.background = '#D6DADE';
            axisButton.style.color = '#6C808C';
            axisButton.style.border = '1px solid #6C808C';
        });

        axisButton.addEventListener('click', function() {
            window.open(axisLink, '_blank');
            saveButton.click();
        });

        saveButton.style.display = 'inline-block';
        saveButton.style.width = 'auto';
        saveButton.style.fontSize = '110%';

        saveButton.parentElement.appendChild(axisButton);
    }
})();
