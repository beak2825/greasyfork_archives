// ==UserScript==
// @name         画像サイズチェック
// @namespace    http://tampermonkey.net/
// @version      1.10.01
// @description  画像の横幅と縦幅を表示。サイズに問題がある場合は赤枠で表示。
// @license      MIT
// @match        https://starlight.plusnao.co.jp/goods/image/edit/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501513/%E7%94%BB%E5%83%8F%E3%82%B5%E3%82%A4%E3%82%BA%E3%83%81%E3%82%A7%E3%83%83%E3%82%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/501513/%E7%94%BB%E5%83%8F%E3%82%B5%E3%82%A4%E3%82%BA%E3%83%81%E3%82%A7%E3%83%83%E3%82%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var allImages = [];
    var targetElement = document.querySelector('.col-xs-4.col-sm-6.col-md-5.col-lg-4');
    var hasRedBorder = false;

    function checkForImages(node) {
        if (node.nodeType === 1 && node.tagName === 'IMG') {
            if (node.complete) {
                processImage(node);
            } else {
                node.addEventListener('load', function() {
                    processImage(node);
                });
            }
        } else if (node.nodeType === 1 && node.hasChildNodes()) {
            node.childNodes.forEach(checkForImages);
        }
    }

    function processImage(img) {
        if (img.naturalWidth === 0 || img.naturalHeight === 0) {
            setTimeout(() => processImage(img), 100);
            return;
        }

        if (isExcludedStructure(img)) {
            return;
        }

        removeExistingSizeInfo(img);
        displayImageSize(img);
        updateImageList();
        addRedBorderIfNeeded();
        updateButtonDisplay();
    }

    function isExcludedStructure(img) {
        return img.closest('ul.list-group') !== null;
    }

    function removeExistingSizeInfo(img) {
        var parent = img.parentNode;
        var existingSizeInfo = parent.querySelector('.size-info');
        if (existingSizeInfo) {
            parent.removeChild(existingSizeInfo);
        }
    }

    function displayImageSize(img) {
        var sizeInfo = document.createElement('div');
        sizeInfo.className = 'size-info';
        sizeInfo.textContent = img.naturalWidth + '×' + img.naturalHeight;

        var parent = img.parentNode;
        parent.style.position = 'relative';
        parent.appendChild(sizeInfo);
    }

    function updateImageList() {
        allImages = [];
        var images = targetElement.querySelectorAll('img');
        images.forEach(img => {
            if (img.naturalWidth !== 0 && img.naturalHeight !== 0) {
                allImages.push({
                    element: img,
                    width: img.naturalWidth,
                    height: img.naturalHeight
                });
            }
        });
    }

    function addRedBorderIfNeeded() {
        hasRedBorder = false;

        if (allImages.length < 2) {
            allImages.forEach(img => {
                var redBorder = img.width < 500 || img.height / img.width > 1.5;
                img.element.style.border = redBorder ? '2px solid red' : 'none';
                if (redBorder) hasRedBorder = true;
            });
            return;
        }

        var minWidth = Math.min(...allImages.map(img => img.width));
        var maxWidth = Math.max(...allImages.map(img => img.width));
        var widthDifference = maxWidth / minWidth > 2;

        allImages.forEach(img => {
            var redBorder = img.width < 500 ||
                            (widthDifference && (img.width === minWidth || img.width === maxWidth)) ||
                            (img.height / img.width > 1.5);
            img.element.style.border = redBorder ? '2px solid red' : 'none';
            if (redBorder) hasRedBorder = true;
        });
    }

function updateButtonDisplay() {
    const targetButton = document.querySelector('button.btn.btn-primary.btn-lg.fullWidth.vMiddle.mb10');
    if (!targetButton) return;

    if (hasRedBorder) {
        targetButton.innerHTML = `⚠️注意⚠️ サイズ修正が必要な画像があります<br><i class="fa fa-floppy-o"></i> 強制的に保存する`;

        const originalClickHandler = targetButton.onclick;
        const existingOverlayButton = targetButton.parentElement.querySelector('.overlay-button');
        if (existingOverlayButton) {
            existingOverlayButton.remove();
        }

        const overlayButton = document.createElement('button');
        overlayButton.classList.add('overlay-button');
        targetButton.parentElement.appendChild(overlayButton);

        overlayButton.addEventListener('click', function(event) {
            event.preventDefault();
            showCustomAlert(
                'サイズの修正が必要な画像がありますが、本当にこのまま保存しますか？',
                function() {
                    if (originalClickHandler) {
                        originalClickHandler.call(targetButton);
                    } else {
                        targetButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                    }
                }
            );
        }, true);
    } else {
        targetButton.innerHTML = '<i class="fa fa-floppy-o"></i> 保存';
        const overlayButton = targetButton.parentElement.querySelector('.overlay-button');
        if (overlayButton) {
            overlayButton.remove();
        }
    }
}

    function showCustomAlert(message, onConfirm) {
        const overlay = document.createElement('div');
        overlay.classList.add('custom-alert-overlay');

        const alertBox = document.createElement('div');
        alertBox.classList.add('custom-alert-box');

        const title = document.createElement('div');
        title.classList.add('custom-alert-title');
        title.textContent = '⚠️ 警告 ⚠️';
        alertBox.appendChild(title);

        const alertMessage = document.createElement('div');
        alertMessage.classList.add('custom-alert-message');
        alertMessage.textContent = message;
        alertBox.appendChild(alertMessage);

        const confirmButton = document.createElement('button');
        confirmButton.classList.add('custom-alert-button');
        confirmButton.textContent = 'このまま保存する';
        confirmButton.addEventListener('click', function() {
            document.body.removeChild(overlay);
            if (onConfirm) onConfirm();
        });
        alertBox.appendChild(confirmButton);

        const cancelButton = document.createElement('button');
        cancelButton.classList.add('custom-alert-button');
        cancelButton.textContent = 'キャンセル';
        cancelButton.addEventListener('click', function() {
            document.body.removeChild(overlay);
        });
        alertBox.appendChild(cancelButton);

        overlay.appendChild(alertBox);
        document.body.appendChild(overlay);
    }

function init() {
    targetElement.querySelectorAll('img').forEach(checkForImages);

    updateImageList();
    addRedBorderIfNeeded();
    updateButtonDisplay();

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(function(node) {
                    checkForImages(node);
                });
            }
            if (mutation.removedNodes.length || mutation.type === 'attributes') {
                updateImageList();
                addRedBorderIfNeeded();
                if (mutation.target.tagName === 'IMG') {
                    processImage(mutation.target);
                }
                updateButtonDisplay();
            }
        });
    });

    observer.observe(targetElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });
}

    const style = document.createElement('style');
    style.textContent = `
        .col-lg-1-5.col-md-3.col-sm-4.col-xs-12.mb10.grid-img { margin-bottom: 1px !important; }
        .size-info {
            position: absolute;
            bottom: 35px;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(0, 0, 0, 0.5);
            color: white;
            font-size: 12px;
            padding: 1px 4px;
            text-align: center;
            pointer-events: none;
            border-radius: 5px;
        }
        .custom-alert-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        }
        .custom-alert-box {
            background-color: #cccccc;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            font-family: sans-serif;
            width: 300px;
        }
        .custom-alert-title {
            font-weight: bold;
            font-size: 18px;
            margin-bottom: 10px;
        }
        .custom-alert-message {
            margin-bottom: 20px;
            font-size: 14px;
        }
        .custom-alert-button {
            padding: 8px 16px;
            margin: 5px;
            border: 1px solid #000;
            border-radius: 5px;
            background-color: #f0f0f0;
            font-size: 14px;
            cursor: pointer;
        }
        .custom-alert-button:hover { background-color: #e0e0e0; }
        .overlay-button {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: transparent;
            z-index: 10001;
            cursor: pointer;
            border: none;
            outline: none;
        }
    `;
    document.head.appendChild(style);

    if (targetElement) {
        init();
    }

})();
