// ==UserScript==
// @name         星空案何
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  顯示按鍵輸入並變色
// @author       jack9246
// @match        https://agario.xingkong.tw/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528863/%E6%98%9F%E7%A9%BA%E6%A1%88%E4%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/528863/%E6%98%9F%E7%A9%BA%E6%A1%88%E4%BD%95.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var boxStyle = `
        position: absolute;
        padding: 10px;
        background-color: transparent;
        border: 2px solid black;
        text-align: center;
        line-height: 1;
        white-space: nowrap;
        font-weight: bold;
        color: black;
    `;

    var largeBoxStyle = `
        font-size: 20px;
        padding: 20px;
    `;

    var keyBoxContainer = document.createElement('div');
    keyBoxContainer.id = 'keyBoxContainer';
    keyBoxContainer.style.cssText = `
        position: fixed;
        top: 50%;
        left: 10px;
        transform: translateY(-50%);
        z-index: 9999;
        transition: opacity 0.5s ease;
        opacity: 0;
    `;

    document.body.appendChild(keyBoxContainer);
    var hideTimer;
    var isComposing = false;

    function addKeyBox(key, color, isLarge) {
        var box = document.createElement('div');
        box.className = 'keyBox';
        box.textContent = key.toUpperCase();
        box.dataset.color = color;
        var style = isLarge ? `${boxStyle} ${largeBoxStyle}` : boxStyle;
        box.style.cssText = `
            ${style}
            background-color: ${color};
            border-color: ${color};
        `;

        // 清空原本的按鍵顯示，避免多個字符疊加
        keyBoxContainer.innerHTML = '';
        keyBoxContainer.appendChild(box);

        resetHideTimer();
    }

    // 監聽鍵盤按鍵 (只適用於非輸入法輸入)
    document.addEventListener('keydown', function(event) {
        if (isComposing) return; // 如果正在輸入拼音，則不顯示鍵位
        var key = event.key.toUpperCase();
        var color = getRandomColor();
        var isLarge = (key === ' ' || key === 'SHIFT');
        addKeyBox(key, color, isLarge);
    });

    // 監聽輸入法開始 (開始輸入拼音)
    document.addEventListener('compositionstart', function() {
        isComposing = true;
    });

    // 監聽輸入法輸入中 (即時顯示注音符號)
    document.addEventListener('compositionupdate', function(event) {
        var key = event.data; // 取得正在輸入的字符 (如 `ㄅ`)
        var color = getRandomColor();
        addKeyBox(key, color, false);
    });

    // 監聽輸入法結束 (確定最終輸入的文字)
    document.addEventListener('compositionend', function(event) {
        isComposing = false;
        var key = event.data; // 取得最終輸入的字符 (如 `波`)
        var color = getRandomColor();
        addKeyBox(key, color, false);
    });

    document.addEventListener('keyup', function() {
        clearTimeout(hideTimer);
        hideTimer = setTimeout(function() {
            keyBoxContainer.style.opacity = 0;
        }, 2000);
    });

    function resetHideTimer() {
        keyBoxContainer.style.opacity = 1;
        clearTimeout(hideTimer);
        hideTimer = setTimeout(function() {
            keyBoxContainer.style.opacity = 0;
        }, 2000);
    }

    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

})();
