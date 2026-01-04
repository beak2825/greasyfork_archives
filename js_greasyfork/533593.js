// ==UserScript==
// @name         Resize Image Downloader
// @version      2.0
// @author       SleepingGiant
// @description  Download resized version of single-image pages
// @namespace    https://greasyfork.org/users/1395131
// @match        *://*/*.jpg
// @match        *://*/*.jpeg
// @match        *://*/*.png
// @match        *://*/*.webp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533593/Resize%20Image%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/533593/Resize%20Image%20Downloader.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let cropLines = {};
    let cropOverlay = null;
    let infoBox = null;

    const createUI = () => {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '20px';
        container.style.right = '20px';
        container.style.backgroundColor = '#222';
        container.style.color = 'white';
        container.style.padding = '10px';
        container.style.borderRadius = '10px';
        container.style.zIndex = '9999';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '6px';
        container.style.fontSize = '13px';

        const createLabeledInput = (labelText, defaultValue) => {
            const wrapper = document.createElement('div');
            wrapper.style.display = 'flex';
            wrapper.style.alignItems = 'center';
            wrapper.style.gap = '4px';

            const label = document.createElement('label');
            label.textContent = labelText;
            const input = document.createElement('input');
            input.type = 'number';
            input.value = defaultValue;
            input.style.width = '60px';
            input.style.padding = '4px';
            input.style.borderRadius = '4px';
            input.style.border = 'none';

            wrapper.appendChild(label);
            wrapper.appendChild(input);
            container.appendChild(wrapper);

            return input;
        };

        const widthInput = createLabeledInput('Width:', 1200);
        const heightInput = createLabeledInput('Height:', 1200);

        // Crop toggle checkbox
        const cropToggle = document.createElement('label');
        cropToggle.style.display = 'flex';
        cropToggle.style.alignItems = 'center';
        cropToggle.style.gap = '6px';
        const cropCheckbox = document.createElement('input');
        cropCheckbox.type = 'checkbox';
        cropCheckbox.checked = false;
        cropCheckbox.onchange = () => {
            if (cropCheckbox.checked) {
                const img = document.querySelector('img');
                if (img) createCropOverlay(img);
            } else {
                removeCropOverlay();
            }
        };
        cropToggle.appendChild(cropCheckbox);
        cropToggle.appendChild(document.createTextNode('Enable Crop'));
        container.appendChild(cropToggle);

        // Scaling toggle checkbox
        const scaleToggle = document.createElement('label');
        scaleToggle.style.display = 'flex';
        scaleToggle.style.alignItems = 'center';
        scaleToggle.style.gap = '6px';
        const scaleCheckbox = document.createElement('input');
        scaleCheckbox.type = 'checkbox';
        scaleCheckbox.checked = true;
        scaleToggle.appendChild(scaleCheckbox);
        scaleToggle.appendChild(document.createTextNode('Enable Scaling'));
        container.appendChild(scaleToggle);


        // Download button
        const downloadBtn = document.createElement('button');
        downloadBtn.textContent = '⬇️ Download';
        styleButton(downloadBtn);
        downloadBtn.onclick = () =>
            downloadCroppedAndResized(
                widthInput.value,
                heightInput.value,
                cropCheckbox.checked,
                scaleCheckbox.checked
            );


        container.appendChild(downloadBtn);
        document.body.appendChild(container);
    };

    const styleButton = (btn) => {
        btn.style.backgroundColor = '#007acc';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.padding = '6px 10px';
        btn.style.borderRadius = '6px';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '13px';
    };

    const createCropOverlay = (img) => {
        const rect = img.getBoundingClientRect();

        cropOverlay = document.createElement('div');
        cropOverlay.style.position = 'absolute';
        cropOverlay.style.left = `${rect.left + window.scrollX}px`;
        cropOverlay.style.top = `${rect.top + window.scrollY}px`;
        cropOverlay.style.width = `${rect.width}px`;
        cropOverlay.style.height = `${rect.height}px`;
        cropOverlay.style.zIndex = '9998';
        cropOverlay.style.pointerEvents = 'none';

        document.body.appendChild(cropOverlay);

        const directions = ['left', 'right', 'top', 'bottom'];
        directions.forEach(dir => {
            const line = document.createElement('div');
            line.className = `crop-line ${dir}`;
            Object.assign(line.style, {
                position: 'absolute',
                backgroundColor: 'red',
                pointerEvents: 'auto',
                zIndex: '10000',
                cursor: dir === 'left' || dir === 'right' ? 'ew-resize' : 'ns-resize',
            });

            if (dir === 'left' || dir === 'right') {
                line.style.top = '0';
                line.style.width = '2px';
                line.style.height = '100%';
                line.style.left = dir === 'left' ? '10px' : `${rect.width - 10}px`;
            } else {
                line.style.left = '0';
                line.style.height = '2px';
                line.style.width = '100%';
                line.style.top = dir === 'top' ? '10px' : `${rect.height - 10}px`;
            }

            makeDraggable(line, dir, img, rect);
            cropOverlay.appendChild(line);
            cropLines[dir] = line;
        });

        // Info box
        infoBox = document.createElement('div');
        infoBox.style.position = 'fixed';
        infoBox.style.bottom = '20px';
        infoBox.style.left = '20px';
        infoBox.style.background = '#000a';
        infoBox.style.color = 'white';
        infoBox.style.padding = '6px 10px';
        infoBox.style.borderRadius = '8px';
        infoBox.style.fontSize = '13px';
        infoBox.style.zIndex = '9999';
        document.body.appendChild(infoBox);

        updateInfoBox(img, rect);
    };

    const removeCropOverlay = () => {
        if (cropOverlay) cropOverlay.remove();
        if (infoBox) infoBox.remove();
        cropOverlay = null;
        infoBox = null;
        cropLines = {};
    };

    const makeDraggable = (element, direction, img, imgRect) => {
        let isDragging = false;

        element.addEventListener('mousedown', (e) => {
            e.preventDefault();
            isDragging = true;

            const onMouseMove = (moveEvent) => {
                if (!isDragging) return;

                const delta = direction === 'left' || direction === 'right'
                    ? moveEvent.clientX - imgRect.left
                    : moveEvent.clientY - imgRect.top;

                if (direction === 'left' || direction === 'right') {
                    const clamped = Math.max(0, Math.min(delta, imgRect.width));
                    element.style.left = `${clamped}px`;
                } else {
                    const clamped = Math.max(0, Math.min(delta, imgRect.height));
                    element.style.top = `${clamped}px`;
                }

                updateInfoBox(img, imgRect);
            };

            const onMouseUp = () => {
                isDragging = false;
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    };

    const getCropValues = (imgRect) => {
        const left = parseInt(cropLines.left?.style.left || '0');
        const right = parseInt(cropLines.right?.style.left || `${imgRect.width}`);
        const top = parseInt(cropLines.top?.style.top || '0');
        const bottom = parseInt(cropLines.bottom?.style.top || `${imgRect.height}`);

        const cropX = Math.min(left, right);
        const cropY = Math.min(top, bottom);
        const cropW = Math.abs(right - left);
        const cropH = Math.abs(bottom - top);

        return { cropX, cropY, cropW, cropH };
    };

    const updateInfoBox = (img, imgRect) => {
        const { cropX, cropY, cropW, cropH } = getCropValues(imgRect);
        const removedLeft = cropX;
        const removedTop = cropY;
        const removedRight = img.naturalWidth - (cropX + cropW);
        const removedBottom = img.naturalHeight - (cropY + cropH);

        infoBox.innerHTML = `
            <b>Crop</b><br/>
            Removed: Left ${removedLeft}px, Right ${removedRight}px<br/>
            Removed: Top ${removedTop}px, Bottom ${removedBottom}px<br/>
            Final: ${cropW} x ${cropH}px
        `;
    };

    const downloadCroppedAndResized = (newWidth, newHeight, cropEnabled, scaleEnabled) => {
        const img = document.querySelector('img');
        const rect = img.getBoundingClientRect();

        let cropX = 0, cropY = 0, cropW = img.naturalWidth, cropH = img.naturalHeight;

        if (cropEnabled && cropOverlay) {
            const values = getCropValues(rect);
            cropX = values.cropX * img.naturalWidth / rect.width;
            cropY = values.cropY * img.naturalHeight / rect.height;
            cropW = values.cropW * img.naturalWidth / rect.width;
            cropH = values.cropH * img.naturalHeight / rect.height;
        }

        const finalW = scaleEnabled ? parseInt(newWidth) : cropW;
        const finalH = scaleEnabled ? parseInt(newHeight) : cropH;

        const canvas = document.createElement('canvas');
        canvas.width = finalW;
        canvas.height = finalH;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, finalW, finalH);

        canvas.toBlob(blob => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `cropped_scaled_${canvas.width}x${canvas.height}.jpg`;
            link.click();
        }, 'image/jpeg', 0.9);
    };


    const interval = setInterval(() => {
        const img = document.querySelector('img');
        if (img && document.body) {
            createUI();
            clearInterval(interval);
        }
    }, 200);
})();
