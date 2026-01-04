// ==UserScript==
// @name         カラーピッカーとランダムカラー
// @namespace    http://tampermonkey.net/
// @version      1.91
// @description  カラーピッカーでオリジナルパレット！ランダムカラーで楽しくお絵かき
// @author       you
// @match        https://pictsense.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536460/%E3%82%AB%E3%83%A9%E3%83%BC%E3%83%94%E3%83%83%E3%82%AB%E3%83%BC%E3%81%A8%E3%83%A9%E3%83%B3%E3%83%80%E3%83%A0%E3%82%AB%E3%83%A9%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/536460/%E3%82%AB%E3%83%A9%E3%83%BC%E3%83%94%E3%83%83%E3%82%AB%E3%83%BC%E3%81%A8%E3%83%A9%E3%83%B3%E3%83%80%E3%83%A0%E3%82%AB%E3%83%A9%E3%83%BC.meta.js
// ==/UserScript==

//なんか問題が起きても責任は取りません
//悪い再配布の可能性があるよ、不安な場合は信頼できる人から共有されたもの使ってね
//全部自己責任だよ
//パソコンのGoogleでしか動作確認してないよ。


(function() {
    'use strict';

    setTimeout(() => {
        if(document.getElementById("nativeColorPicker")) return;

        const container = document.createElement("div");
        container.id = "randomcollarUI";
        container.style.position = "fixed";
        container.style.top = "150px";
        container.style.left = "20px";
        container.style.zIndex = 9999;
        container.style.backgroundColor = "#222";
        container.style.padding = "8px";
        container.style.borderRadius = "6px";
        container.style.color = "#fff";
        container.style.fontFamily = "Arial,sans-serif";
        container.style.userSelect = "none";
        container.style.boxShadow = "0 0 10px #000";
        container.style.cursor = "grab";
        container.innerHTML = `
  <div style="font-weight:bold; margin-bottom:8px; user-select:text;cursor: grab;">カラーピッカー</div>
  <input type="color" id="colorInputNative" value="#ff0000" style="width: 100%; height: 40px; border-radius: 5px; border:none; cursor:pointer;" />
  <input type="number" id="colorIndex" min="1" max="10" value="1" style="width: 100%; margin-top:8px; height: 30px; border-radius: 5px; border:none; text-align:center;" placeholder="ボタン番号 (1-10)" />
  <button id="applyColorBtn" style="margin-top:8px; width: 100%; height: 30px; border:none; border-radius:5px; background:#555; color:#eee; cursor:pointer;">色変更</button>
  <button id="randomColorBtn" style="margin-top:8px; width: 100%; height: 30px; border:none; border-radius:5px; background:#339933; color:#eee; cursor:pointer;">ランダムカラー</button>
`;



        document.body.appendChild(container);

        const colorInput = document.getElementById("colorInputNative");
        const colorIndexInput = document.getElementById("colorIndex");
        const applyBtn = document.getElementById("applyColorBtn");
        const randomBtn = document.getElementById("randomColorBtn");

        const paletteButtons = Array.from(document.querySelectorAll("#colorPalette button")).slice(0, 10);

        function updateColorButton(index, hex) {
            const btn = paletteButtons[index];
            btn.setAttribute("data-color", hex.slice(1));
            btn.style.backgroundColor = hex;
            colorIndexInput.value = ((index + 1) % paletteButtons.length) + 1;

        }

        function getRandomColor() {
            // 0-255の値を16進数2桁で返す
            const r = Math.floor(Math.random() * 256).toString(16).padStart(2, "0");
            const g = Math.floor(Math.random() * 256).toString(16).padStart(2, "0");
            const b = Math.floor(Math.random() * 256).toString(16).padStart(2, "0");
            return `#${r}${g}${b}`;
        }

        applyBtn.addEventListener("click", () => {
            const hex = colorInput.value;
            const index = parseInt(colorIndexInput.value, 10) - 1;
            updateColorButton(index, hex);
        });

        randomBtn.addEventListener("click", () => {
            paletteButtons.forEach((btn, i) => {
                const randomHex = getRandomColor();
                updateColorButton(i, randomHex);
            });
            alert("ランダムな色でお絵描きしてみ～");
        });

        // ドラッグで移動
        let isDragging = false;
        let offsetX, offsetY;

        container.addEventListener("mousedown", (e) => {
            isDragging = true;
            offsetX = e.clientX - container.getBoundingClientRect().left;
            offsetY = e.clientY - container.getBoundingClientRect().top;
            container.style.cursor = "grabbing";
        });

        document.addEventListener("mousemove", (e) => {
            if (!isDragging) return;
            container.style.left = `${e.clientX - offsetX}px`;
            container.style.top = `${e.clientY - offsetY}px`;

        });

        document.addEventListener("mouseup", () => {
            isDragging = false;
            container.style.cursor = "grab";
        });

    }, 1500);
})();