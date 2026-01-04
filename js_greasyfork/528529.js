// ==UserScript==
// @name     うんはらバスターZv3(バグ注意)
// @namespace    うんはらバスターZv3
// @version    3.0
// @description    おんjで画像にモザイクをかける機能。
// @author     Wai
// @match      *://hayabusa.open2ch.net/test/read.cgi/livejupiter/*
// @grant      none
// @downloadURL https://update.greasyfork.org/scripts/528529/%E3%81%86%E3%82%93%E3%81%AF%E3%82%89%E3%83%90%E3%82%B9%E3%82%BF%E3%83%BCZv3%28%E3%83%90%E3%82%B0%E6%B3%A8%E6%84%8F%29.user.js
// @updateURL https://update.greasyfork.org/scripts/528529/%E3%81%86%E3%82%93%E3%81%AF%E3%82%89%E3%83%90%E3%82%B9%E3%82%BF%E3%83%BCZv3%28%E3%83%90%E3%82%B0%E6%B3%A8%E6%84%8F%29.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const mosaicStyle = "blur(10px)";
    const imgSet = new Set(); // 処理済み画像の管理

    function applyMosaic(img) {
        img.style.filter = mosaicStyle;
    }

    function removeMosaic(img) {
        img.style.filter = "none";
    }

    function getFileExtension(url) {
        const match = url.match(/\.([0-9a-z]+)(?=[?#])|(\.[0-9a-z]+)$/i);
        return match ? match[1] || match[2].substring(1) : "拡張子不明"; // "." を除去
    }

    function processImage(img) {
        if (imgSet.has(img.src)) return;
        imgSet.add(img.src);
        applyMosaic(img);

        img.addEventListener('click', e => e.preventDefault());

        // 画像とinfoDivを囲むdivを作成
        let wrapperDiv = document.createElement("div");
        wrapperDiv.style.display = "flex";
        wrapperDiv.style.alignItems = "center"; // 垂直方向中央揃え
        img.parentNode.insertBefore(wrapperDiv, img);
        wrapperDiv.appendChild(img);

        let infoDiv = document.createElement("div");
        infoDiv.style.marginLeft = "10px"; // 画像との間隔を調整
        wrapperDiv.appendChild(infoDiv);

        let btn = document.createElement("button");
        btn.textContent = "モザイク解除";
        btn.style.margin = "5px";
        btn.style.fontSize = "1.2em";
        btn.onclick = e => {
            e.preventDefault();
            removeMosaic(img);
            btn.replaceWith(createMosaicButton(img, btn));
        };
        infoDiv.appendChild(btn);

        let urlDisplay = document.createElement("div");
        urlDisplay.style.color = "blue";
        urlDisplay.style.wordWrap = "break-word";
        urlDisplay.textContent = img.src;
        infoDiv.appendChild(urlDisplay);

        let extDisplay = document.createElement("div");
        extDisplay.style.color = "red";
        extDisplay.style.marginTop = "3px";
        let ext = getFileExtension(img.src);
        extDisplay.textContent = ext.toUpperCase() === "GIF" ? "⚠️GIF" : ext;
        infoDiv.appendChild(extDisplay);
    }

    function createMosaicButton(img, originalBtn) {
        let mosaicBtn = document.createElement("button");
        mosaicBtn.textContent = "モザイク";
        mosaicBtn.style.margin = "5px";
        mosaicBtn.style.fontSize = "1.2em";
        mosaicBtn.onclick = e => {
            e.preventDefault();
            applyMosaic(img);
            mosaicBtn.replaceWith(originalBtn);
        };
        return mosaicBtn;
    }

    function checkImages(targetNode = document) {
        targetNode.querySelectorAll('img').forEach(img => {
            if (img.src.includes("imgur.com")) {
                processImage(img);
            }
        });
    }

    checkImages();

    new MutationObserver(mutations => {
        mutations.forEach(m => m.addedNodes.forEach(n => n.nodeType === 1 && checkImages(n)));
    }).observe(document.body, { childList: true, subtree: true });

    window.addEventListener('popstate', checkImages);

    const hookHistoryMethod = original => function() {
        let result = original.apply(this, arguments);
        checkImages();
        return result;
    };
    history.pushState = hookHistoryMethod(history.pushState);
    history.replaceState = hookHistoryMethod(history.replaceState);
})();