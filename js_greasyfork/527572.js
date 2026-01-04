// ==UserScript==
// @name         Waze Road Info Button 奈良県
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Wazeエディターから国土交通省道路情報ページへリダイレクトするためのボタンを追加します。中央初期位置、ドラッグで移動可能、画面外制限、位置記憶機能付き
// @author       Aoi
// @match        *://www.waze.com/*/editor*
// @match        https://www.waze.com/ja/editor?env=row&lat=*
// @icon        data:image/jpeg;base64,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
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527572/Waze%20Road%20Info%20Button%20%E5%A5%88%E8%89%AF%E7%9C%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/527572/Waze%20Road%20Info%20Button%20%E5%A5%88%E8%89%AF%E7%9C%8C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ボタンを作成
    var button = document.createElement('button');
    var iconUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAfCAMAAAAocOYLAAAApVBMVEX/8tn+8dj/+N7/++D/9Nr04868mpaWYW57NVF1KEp3LEyGR12rgYTVuq//9t336NGjdXxtE0FyIUd/OlXhy7twHETr2MWKT2GQWWibanP//+PCo5yCQFmwiYrQtarkz76ZZ3KnfIDro5bml47vsJ3ii4fzu6TurJvom5DebmrifXPpkH/YW1/mhnjZXmDcaGbbZGTunojheHDfcmzvoYnUTljSQlEu5L0+AAABfklEQVR4AXzR25KDIAwA0FzQAkosKtp6aXf//yfXcdQhPux5zI0wgQzCDeZhRGI2xGSuAGQMF+XDOl/VgeQquLqpeUbn7ca3XWC44b719pKepBeiEG3OPUS9PUSruZowmz56exN7uT4pIbap1SV+5GsDfr37on+3esBg4NDULDRNpVMbzBPTsR2CCXaprLbYlXAvAJBwTFcjVoLdf3kEGADMJzqreZeO/qKcDALPer9SzgNytRZcrPqF9JXz/vKJKabb/IURDkY6e5fC2b6RPt6X+2HI8Bx1etl7MS/I7tOOaECT75j8+e+SDCKCYrj/7VJK7jUjZXES2ogQ8cSmaWTiPSSyJ/5alAoDBoEY+KvgxBX2H60C0bMxz8u6rfs+L8e3531ft+M8j1c6ByCxqJkLh4p/AaqI5xcZGo1SFgzFdrzSW64QvDgpbmovHp5o9k2jFpYieIEj/i6gJg4DMGESQAPLEmL5S0qYaTBarJO+Yeq7I8sIurCBvuGI+wOAsTRfmw1vFwAAAABJRU5ErkJggg==';
    var icon = document.createElement('img');
    icon.src = iconUrl;
    icon.style.width = '24px';
    icon.style.height = '24px';
    icon.style.verticalAlign = 'middle';
    icon.style.backgroundColor = 'transparent';

    button.appendChild(icon);
    button.style.position = 'fixed';
    button.style.zIndex = '1000';
    button.style.padding = '10px';
    button.style.backgroundColor = 'transparent';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'move';

    // 保存された位置を読み込む、なければ画面中央に配置
    let savedPos = GM_getValue('buttonPosition');
    if (savedPos) {
        savedPos = JSON.parse(savedPos);
        button.style.top = savedPos.top;
        button.style.left = savedPos.left;
    } else {
        // 初期位置を画面中央に
        button.style.top = '50%';
        button.style.left = '50%';
        button.style.transform = 'translate(-50%, -50%)';
    }

    // クリック時の処理
    button.onclick = function(e) {
        if (e.button === 0 && !button.isDragging) {
            window.open('https://pref.nara.geocloud.jp/mp/10', '_blank');
        }
    };

    // ドラッグ機能の実装
    let isDragging = false;
    let currentX;
    let currentY;

    button.onmousedown = function(e) {
        if (e.button === 0) {
            isDragging = true;
            button.isDragging = true;
            const rect = button.getBoundingClientRect();
            currentX = e.clientX - rect.left;
            currentY = e.clientY - rect.top;
            button.style.transform = 'none'; // ドラッグ開始時にtransformを解除
            e.preventDefault();
        }
    };

    document.onmousemove = function(e) {
        if (isDragging) {
            let newLeft = e.clientX - currentX;
            let newTop = e.clientY - currentY;

            // 画面外に出ないように制限
            const buttonWidth = button.offsetWidth;
            const buttonHeight = button.offsetHeight;
            const maxLeft = window.innerWidth - buttonWidth;
            const maxTop = window.innerHeight - buttonHeight;

            newLeft = Math.max(0, Math.min(newLeft, maxLeft));
            newTop = Math.max(0, Math.min(newTop, maxTop));

            button.style.left = newLeft + 'px';
            button.style.top = newTop + 'px';
        }
    };

    document.onmouseup = function() {
        if (isDragging) {
            isDragging = false;
            button.isDragging = false;
            // 位置を保存（ピクセル値で保存）
            GM_setValue('buttonPosition', JSON.stringify({
                top: button.style.top,
                left: button.style.left
            }));
        }
    };

    // ボタンをページに追加
    document.body.appendChild(button);
})();