// ==UserScript==
// @name         MyDealz Bilder nachbearbeiten Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  "Bild nachbearbeiten"-Button mit Cropping/Rotation für den MyDealz Upload-Dialog
// @author       MD928835
// @license      MIT
// @match        https://www.mydealz.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534742/MyDealz%20Bilder%20nachbearbeiten%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/534742/MyDealz%20Bilder%20nachbearbeiten%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const svgLeft = `<svg width="28" height="28" viewBox="0 0 24 24"><path fill="#222" d="M7.11,8.53A6,6,0,1,1,6,12H4a8,8,0,1,0,2.34-5.66l-.89-.89V8.53H7.11Z"/><path fill="#222" d="M7,3H3V7H5V5.41l4.3,4.3,1.42-1.42L6.41,4.01Z"/></svg>`;
    const svgRight = `<svg width="28" height="28" viewBox="0 0 24 24"><path fill="#222" d="M16.89,8.53A6,6,0,1,0,18,12h2a8,8,0,1,1-2.34-5.66l.89-.89V8.53H16.89Z"/><path fill="#222" d="M17,3h4V7h-2V5.41l-4.3,4.3-1.42-1.42,4.3-4.3Z"/></svg>`;

    function insertCropperUI() {
        if (document.getElementById('mydealz-cropper-modal')) return;

        const html = `
        <div id="mydealz-cropper-modal" style="display:none;position:fixed;z-index:99999;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.6);align-items:center;justify-content:center;">
            <div id="mydealz-cropper-content" style="background:#fff;padding:20px;position:relative;min-width:350px;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.2);">
                <div style="display:flex;justify-content:center;align-items:center;margin-bottom:10px;gap:16px;">
                    <button id="mydealz-cropper-rotate-left" title="90° links drehen" style="background:none;border:none;cursor:pointer;">${svgLeft}</button>
                    <canvas id="mydealz-cropper-canvas" style="border:1px solid #888;cursor:crosshair;display:block;background:#eee;"></canvas>
                    <button id="mydealz-cropper-rotate-right" title="90° rechts drehen" style="background:none;border:none;cursor:pointer;">${svgRight}</button>
                </div>
                <div id="mydealz-cropper-size" style="margin:10px 0;text-align:center;font-size:14px;color:#555;"></div>
                <div style="display:flex;justify-content:space-between;gap:18px;margin-top:10px;">
                    <button id="mydealz-cropper-cancel" class="button button--shape-circle button--type-secondary button--mode-default" style="flex:1;text-align:center;padding:10px 12px;font-weight:bold;">Abbrechen</button>
                    <button id="mydealz-cropper-upload" class="button button--shape-circle button--type-primary button--mode-brand" style="flex:1;text-align:center;padding:10px 12px;background-color:#009900;color:white;font-weight:bold;">OK</button>
                </div>
            </div>
        </div>
        `;

        document.body.insertAdjacentHTML('beforeend', html);

        const modal = document.getElementById('mydealz-cropper-modal');
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
            e.stopPropagation();
        });

        const buttons = modal.querySelectorAll('button');
        buttons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        });
    }

    function simpleCropImageFromUrl(imgUrl) {
        insertCropperUI();
        const modal = document.getElementById('mydealz-cropper-modal');
        const canvas = document.getElementById('mydealz-cropper-canvas');
        const ctx = canvas.getContext('2d');
        const sizeDiv = document.getElementById('mydealz-cropper-size');
        const uploadBtn = document.getElementById('mydealz-cropper-upload');
        const cancelBtn = document.getElementById('mydealz-cropper-cancel');

        let img = new Image();
        let cropping = false;
        let cropStart = {};
        let cropEnd = {};
        let cropRect = {};
        let rotation = 0;

        img.onload = function() {
            const maxDim = Math.max(img.width, img.height, 1);
            const size = Math.min(maxDim, 600);
            canvas.width = size;
            canvas.height = size;
            drawRotatedImage();
            sizeDiv.textContent = `Original: ${img.width} x ${img.height} Pixel`;
            uploadBtn.disabled = false;
        };

        function drawRotatedImage() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(rotation * Math.PI / 180);

            let drawW = img.width;
            let drawH = img.height;
            const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
            drawW *= scale;
            drawH *= scale;

            ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
            ctx.restore();

            if (cropping || cropRect.w) {
                const r = cropping ? {
                    x: Math.min(cropStart.x, cropEnd.x),
                    y: Math.min(cropStart.y, cropEnd.y),
                    w: Math.abs(cropStart.x - cropEnd.x),
                    h: Math.abs(cropStart.y - cropEnd.y)
                } : cropRect;

                if (r.w && r.h) {
                    ctx.save();
                    ctx.strokeStyle = '#009900';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(r.x, r.y, r.w, r.h);

                    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                    ctx.fillRect(0, 0, canvas.width, r.y);
                    ctx.fillRect(0, r.y, r.x, r.h);
                    ctx.fillRect(r.x + r.w, r.y, canvas.width - r.x - r.w, r.h);
                    ctx.fillRect(0, r.y + r.h, canvas.width, canvas.height - r.y - r.h);

                    ctx.restore();
                    sizeDiv.textContent = `Crop: ${r.w} x ${r.h} Pixel`;
                }
            }
        }

        canvas.onmousedown = function(e) {
            e.stopPropagation();
            cropping = true;
            cropStart = getMousePos(e);
            cropEnd = cropStart;
            drawRotatedImage();
        };

        canvas.onmousemove = function(e) {
            if (!cropping) return;
            cropEnd = getMousePos(e);
            drawRotatedImage();
        };

        canvas.onmouseup = function(e) {
            e.stopPropagation();
            cropping = false;
            cropEnd = getMousePos(e);
            cropRect = {
                x: Math.min(cropStart.x, cropEnd.x),
                y: Math.min(cropStart.y, cropEnd.y),
                w: Math.abs(cropStart.x - cropEnd.x),
                h: Math.abs(cropStart.y - cropEnd.y)
            };
            drawRotatedImage();
            uploadBtn.disabled = false;
        };

        function getMousePos(evt) {
            const rect = canvas.getBoundingClientRect();
            return {
                x: Math.round(evt.clientX - rect.left),
                y: Math.round(evt.clientY - rect.top)
            };
        }

        document.getElementById('mydealz-cropper-rotate-left').onclick = function(e) {
            e.stopPropagation();
            rotation = (rotation - 90 + 360) % 360;
            cropRect = {};
            drawRotatedImage();
        };

        document.getElementById('mydealz-cropper-rotate-right').onclick = function(e) {
            e.stopPropagation();
            rotation = (rotation + 90) % 360;
            cropRect = {};
            drawRotatedImage();
        };

        uploadBtn.onclick = function(e) {
            e.stopPropagation();
            let outCanvas = document.createElement('canvas');
            let outCtx = outCanvas.getContext('2d');

            if (!cropRect.w || !cropRect.h) {
                outCanvas.width = canvas.width;
                outCanvas.height = canvas.height;
                outCtx.drawImage(canvas, 0, 0);
            } else {
                const adjustedX = cropRect.x + 1;
                const adjustedY = cropRect.y + 1;
                const adjustedW = Math.max(cropRect.w - 2, 1);
                const adjustedH = Math.max(cropRect.h - 2, 1);

                outCanvas.width = adjustedW;
                outCanvas.height = adjustedH;
                outCtx.drawImage(canvas, adjustedX, adjustedY, adjustedW, adjustedH, 0, 0, adjustedW, adjustedH);
            }

            outCanvas.toBlob(function(blob) {
                modal.style.display = 'none';

                const fileInput = document.querySelector('input[type="file"]');
                if (fileInput) {
                    const newFile = new File([blob], "bearbeitet.png", {type: "image/png"});
                    const dt = new DataTransfer();
                    dt.items.add(newFile);
                    fileInput.files = dt.files;
                    fileInput.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }, 'image/png');
        };

        cancelBtn.onclick = function(e) {
            e.stopPropagation();
            modal.style.display = 'none';
        };

        modal.style.display = 'flex';
        img.src = imgUrl;
    }

    function addEditButtonToMyDealzUploader() {
        let popupElements = Array.from(document.querySelectorAll('section[role="dialog"], div[role="dialog"]')).filter(el => {
            return el.textContent.includes('Bild hinzufügen') &&
                   el.querySelector('input[type="file"]') &&
                   !el.querySelector('#mydealz-edit-image-btn');
        });

        if (!popupElements.length) {
            return;
        }

        const popup = popupElements[0];

        const editBtn = document.createElement('button');
        editBtn.id = 'mydealz-edit-image-btn';
        editBtn.textContent = 'nachbearbeiten';

        editBtn.style.cssText = `
            display: block !important;
            margin: 8px auto !important;
            padding: 10px 12px !important;
            background-color: #f5f5f5 !important;
            border: none !important;
            border-radius: 24px !important;
            color: #999 !important;
            cursor: not-allowed !important;
            font-weight: normal !important;
            text-align: center !important;
            width: 100% !important;
        `;

        let positionSuccess = false;

        const fileNameDisplay = popup.querySelector('div.flex.boxAlign-ai--all-c + div');
        if (fileNameDisplay) {
            fileNameDisplay.parentElement.insertBefore(editBtn, fileNameDisplay.nextSibling);
            positionSuccess = true;
        }

        if (!positionSuccess) {
            const auswaehlenBtn = Array.from(popup.querySelectorAll('button, label')).find(el =>
                el.textContent.includes('Auswählen')
            );

            if (auswaehlenBtn && auswaehlenBtn.parentElement) {
                auswaehlenBtn.parentElement.insertBefore(editBtn, auswaehlenBtn.nextSibling);
                positionSuccess = true;
            }
        }

        if (!positionSuccess) {
            const fileInput = popup.querySelector('input[type="file"]');
            if (fileInput && fileInput.parentElement) {
                const container = fileInput.closest('div[class*="popover-content"]') || fileInput.parentElement;

                let targetPosition = fileInput.parentElement;
                while (targetPosition && targetPosition.parentElement && !targetPosition.parentElement.querySelector('div[class*="Bild-URL"]')) {
                    targetPosition = targetPosition.parentElement;
                }

                if (targetPosition) {
                    targetPosition.appendChild(editBtn);
                    positionSuccess = true;
                }
            }
        }

        if (!positionSuccess) {
            return;
        }

        const fileInput = popup.querySelector('input[type="file"]');
        function updateEditBtnState() {
            const hasFile = fileInput && fileInput.files && fileInput.files.length > 0;
            editBtn.disabled = !hasFile;

            if (hasFile) {
                editBtn.style.cssText = `
                    display: block !important;
                    margin: 8px auto !important;
                    padding: 10px 12px !important;
                    background-color: #009900 !important;
                    border: none !important;
                    border-radius: 24px !important;
                    color: #ffffff !important;
                    cursor: pointer !important;
                    font-weight: normal !important;
                    text-align: center !important;
                    width: 100% !important;
                `;
            } else {
                editBtn.style.cssText = `
                    display: block !important;
                    margin: 8px auto !important;
                    padding: 10px 12px !important;
                    background-color: #f5f5f5 !important;
                    border: none !important;
                    border-radius: 24px !important;
                    color: #999 !important;
                    cursor: not-allowed !important;
                    font-weight: normal !important;
                    text-align: center !important;
                    width: 100% !important;
                `;
            }
        }

        if (fileInput) {
            updateEditBtnState();
            fileInput.addEventListener('change', function() {
                updateEditBtnState();
            });
        }

        editBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            if (!editBtn.disabled && fileInput && fileInput.files && fileInput.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    simpleCropImageFromUrl(e.target.result);
                };
                reader.readAsDataURL(fileInput.files[0]);
            }
        });

        editBtn.style.pointerEvents = 'auto';
        if (editBtn.parentElement) {
            editBtn.parentElement.style.pointerEvents = 'auto';
        }
    }

    function initButtonAddition() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length || mutation.attributeName === 'style' || mutation.attributeName === 'class') {
                    setTimeout(addEditButtonToMyDealzUploader, 300);
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        });

        let attemptCount = 0;
        function tryAddingButton() {
            if (attemptCount < 10) {
                addEditButtonToMyDealzUploader();
                attemptCount++;
                setTimeout(tryAddingButton, 1000);
            }
        }

        setTimeout(addEditButtonToMyDealzUploader, 500);
        setTimeout(tryAddingButton, 1500);

        document.addEventListener('click', function(e) {
            const isUploadRelated = e.target.textContent && (
                e.target.textContent.includes('Bild') ||
                e.target.textContent.includes('hochladen') ||
                e.target.textContent.includes('Upload')
            );

            if (isUploadRelated) {
                setTimeout(addEditButtonToMyDealzUploader, 500);
            }
        }, true);
    }

    initButtonAddition();
})();
