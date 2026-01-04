// ==UserScript==
// @name         下書き君（画像）v1.6.1
// @namespace    http://tampermonkey.net/
// @version      1.6.1
// @description  ピクトセンスに画像をオーバーレイ表示して模写・下書きを支援！iPadでもズレずに使える！
// @author       虚言癖
// @match        https://pictsense.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536927/%E4%B8%8B%E6%9B%B8%E3%81%8D%E5%90%9B%EF%BC%88%E7%94%BB%E5%83%8F%EF%BC%89v161.user.js
// @updateURL https://update.greasyfork.org/scripts/536927/%E4%B8%8B%E6%9B%B8%E3%81%8D%E5%90%9B%EF%BC%88%E7%94%BB%E5%83%8F%EF%BC%89v161.meta.js
// ==/UserScript==

(function () {
    'use strict';
　　//UIの設定　操作パネルもろもろ
    const imageContainer = document.createElement("div");
    imageContainer.id = "imageOverlayUI";
    Object.assign(imageContainer.style, {
        position: "fixed",
        bottom: "10px",
        right: "10px",
        backgroundColor: "#222",
        padding: "6px",
        borderRadius: "6px",
        color: "#fff",
        fontFamily: "Arial,sans-serif",
        userSelect: "none",
        boxShadow: "0 0 6px #000",
        zIndex: 10000,
        fontSize: "12px",
        lineHeight: "1.4",
        cursor: "grab",
    });
    //UIのHTML　操作パネルの見た目いじりたいときはこのへんいじればいいよ。
    imageContainer.innerHTML = `
        <div style="font-weight:bold; margin-bottom:6px; cursor: grab;">🖼 下書き君（画像）</div>
        <input type="file" id="imageInput" accept="image/*" style="margin-bottom:4px; font-size: 11px; background-color: #222; color: white; border: none; padding: 2px;" />
        <label style="display:block; margin-top:4px;">サイズ</label>
        <input type="range" id="imageSize" min="10" max="200" value="100" style="width:100%; margin-bottom:4px; accent-color: #555;" />
        <label style="display:block;">透明度</label>
        <input type="range" id="imageOpacity" min="10" max="100" value="100" style="width:100%; margin-bottom:4px; accent-color: #555;" />
        <button id="lockBtn" style="width:100%; font-size:11px; margin-top:4px; background-color: #444; color: white; border: none; padding: 4px;">🔒 固定モード OFF</button>
        <button id="removeBtn" style="width:100%; font-size:11px; margin-top:4px; background-color: #844; color: white; border: none; padding: 4px;">画像を消す</button>
    `;

    document.body.appendChild(imageContainer);

    const imageInput = document.getElementById("imageInput");
    const imageSize = document.getElementById("imageSize");
    const imageOpacity = document.getElementById("imageOpacity");
    const lockBtn = document.getElementById("lockBtn");
    const removeBtn = document.getElementById("removeBtn");

    //出した画像の設定もろもろ
    const overlayImage = document.createElement("img");
    overlayImage.style.position = "fixed";
    overlayImage.style.top = "150px";
    overlayImage.style.left = "20px";
    overlayImage.style.zIndex = 9999;
    overlayImage.style.pointerEvents = "auto";
    overlayImage.style.opacity = 1;
    overlayImage.style.maxWidth = "none";
    overlayImage.style.maxHeight = "none";
    overlayImage.style.cursor = "move";
    overlayImage.style.transformOrigin = "top left";
    document.body.appendChild(overlayImage);

    let currentScale = 1;
    let locked = false;

    imageInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            overlayImage.src = event.target.result;
            overlayImage.style.display = "block";
        };
        reader.readAsDataURL(file);
    });

    //サイズを変えるスライダーで変える。
    imageSize.addEventListener("input", () => {
        currentScale = imageSize.value / 100;
        overlayImage.style.transform = `scale(${currentScale})`;
    });

    //透過度。スライダーでオーパシティをいじる。
    imageOpacity.addEventListener("input", () => {
        const opacity = imageOpacity.value / 100;
        overlayImage.style.opacity = opacity;
    });

　　//画像を動かないようにするボタンドラッグを無効にする。
    lockBtn.addEventListener("click", () => {
        locked = !locked;
        overlayImage.style.pointerEvents = locked ? "none" : "auto";
        overlayImage.style.cursor = locked ? "default" : "move";
        lockBtn.textContent = locked ? "🔓 固定モード ON" : "🔒 固定モード OFF";
    });

    removeBtn.addEventListener("click", () => {
        overlayImage.src = "";
        overlayImage.style.display = "none";
    });

    let dragging = false;
    let offsetX = 0, offsetY = 0;

    overlayImage.addEventListener("mousedown", (e) => {
        if (locked) return;
        dragging = true;
        const rect = overlayImage.getBoundingClientRect();
        offsetX = (e.clientX - rect.left) / currentScale;
        offsetY = (e.clientY - rect.top) / currentScale;
        e.preventDefault();
    });

    document.addEventListener("mousemove", (e) => {
        if (!dragging || locked) return;
        overlayImage.style.left = `${e.clientX - offsetX * currentScale}px`;
        overlayImage.style.top = `${e.clientY - offsetY * currentScale}px`;
    });

    document.addEventListener("mouseup", () => {
        dragging = false;
    });
        //タッチ系。AIに任せた。
    overlayImage.addEventListener("touchstart", (e) => {
        if (locked) return;
        const touch = e.touches[0];
        const rect = overlayImage.getBoundingClientRect();
        const scale = window.visualViewport ? window.visualViewport.scale : 1;
        offsetX = (touch.clientX - rect.left) / (currentScale * scale);
        offsetY = (touch.clientY - rect.top) / (currentScale * scale);
        dragging = true;
        e.preventDefault();
    }, { passive: false });

    document.addEventListener("touchmove", (e) => {
        if (!dragging || locked) return;
        const touch = e.touches[0];
        const scale = window.visualViewport ? window.visualViewport.scale : 1;
        overlayImage.style.left = `${touch.clientX - offsetX * currentScale * scale}px`;
        overlayImage.style.top = `${touch.clientY - offsetY * currentScale * scale}px`;
    }, { passive: false });

    document.addEventListener("touchend", () => {
        dragging = false;
    }, { passive: false });

    let uiDragging = false;
    let uiOffsetX = 0, uiOffsetY = 0;

    imageContainer.addEventListener("mousedown", (e) => {
        if (["INPUT", "BUTTON", "LABEL"].includes(e.target.tagName)) return;
        uiDragging = true;
        const rect = imageContainer.getBoundingClientRect();
        uiOffsetX = e.clientX - rect.left;
        uiOffsetY = e.clientY - rect.top;
        imageContainer.style.cursor = "grabbing";
        e.preventDefault();
    });

    document.addEventListener("mousemove", (e) => {
        if (!uiDragging) return;
        imageContainer.style.left = `${e.clientX - uiOffsetX}px`;
        imageContainer.style.top = `${e.clientY - uiOffsetY}px`;
        imageContainer.style.bottom = "auto";
        imageContainer.style.right = "auto";
    });

    document.addEventListener("mouseup", () => {
        uiDragging = false;
        imageContainer.style.cursor = "grab";
    });

    imageContainer.addEventListener("touchstart", (e) => {
        if (["INPUT", "BUTTON", "LABEL"].includes(e.target.tagName)) return;
        const touch = e.touches[0];
        const rect = imageContainer.getBoundingClientRect();
        uiOffsetX = touch.clientX - rect.left;
        uiOffsetY = touch.clientY - rect.top;
        uiDragging = true;
        imageContainer.style.cursor = "grabbing";
        e.preventDefault();
    }, { passive: false });

    document.addEventListener("touchmove", (e) => {
        if (!uiDragging) return;
        const touch = e.touches[0];
        imageContainer.style.left = `${touch.clientX - uiOffsetX}px`;
        imageContainer.style.top = `${touch.clientY - uiOffsetY}px`;
        imageContainer.style.bottom = "auto";
        imageContainer.style.right = "auto";
    }, { passive: false });

    document.addEventListener("touchend", () => {
        uiDragging = false;
        imageContainer.style.cursor = "grab";
    }, { passive: false });
})();
