// ==UserScript==
// @name         Agar.io image to custom skin
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Upload image for custom skin
// @author       New Jack 🕹️
// @match        agar.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465008/Agario%20image%20to%20custom%20skin.user.js
// @updateURL https://update.greasyfork.org/scripts/465008/Agario%20image%20to%20custom%20skin.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const config = {
        containerWidth: '400px',
        maxPreviewSize: 180,
        buttonColor: '#54c800',
        buttonHoverColor: '#45a800',
        dropZoneHeight: '120px',
        dropZoneBorderColor: '#ccc',
        dropZoneActiveColor: '#54c800',
        agarioColors: {
            green: '#54c800',
            blue: '#0078fa',
            red: '#ff3d3d',
            yellow: '#ffcc00',
            background: 'rgb(255, 255, 255)',
            text: '#000000'
        }
    };
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    const node = mutation.addedNodes[i];
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.querySelector('#skin-editor-canvas') || node.id === 'skin-editor-canvas') {
                            console.log('Skin editor detected!');
                            setTimeout(initializeImageUploader, 500);
                            return;
                        }
                    }
                }
            }
            if (mutation.removedNodes && mutation.removedNodes.length > 0) {
                for (let i = 0; i < mutation.removedNodes.length; i++) {
                    const node = mutation.removedNodes[i];
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.querySelector && (
                            node.querySelector('#skin-editor-canvas') ||
                            node.id === 'skin-editor-canvas' ||
                            node.classList && (
                                node.classList.contains('skin-editor') ||
                                node.classList.contains('skin-editor-dialog')
                            )
                        )) {
                            console.log('Skin editor closed!');
                            removeImageUploader();
                            return;
                        }
                        const editorCloseIndicators = [
                            '.sk-app', '.editor-app', '.skin-editor',
                            '[data-v-skin-editor]', '#skin-editor'
                        ];
                        for (const selector of editorCloseIndicators) {
                            if (node.matches && node.matches(selector)) {
                                console.log('Possible skin editor close detected!');
                                setTimeout(checkIfEditorClosed, 100);
                                return;
                            }
                        }
                    }
                }
            }
        });
    });
    function startObserver() {
        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true });
            console.log('Observer started successfully');
        } else {
            console.log('Body not ready, waiting...');
            setTimeout(startObserver, 100);
        }
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startObserver);
    } else {
        startObserver();
    }
    function initializeImageUploader() {
        if (document.getElementById('custom-image-uploader-container')) {
            return;
        }
        console.log('Initializing image uploader...');
        const uploadContainer = createUploadContainer();
        document.body.appendChild(uploadContainer);
        positionUploaderNextToEditor(uploadContainer);
        console.log('Image uploader initialized successfully!');
    }
    function findControlsContainer() {
        const canvas = document.getElementById('skin-editor-canvas');
        if (!canvas) return null;
        const toolsSelector = '.tools, .colors, .controls, .editor-controls, .skin-editor-tools';
        const toolsContainer = document.querySelector(toolsSelector);
        if (toolsContainer) return toolsContainer;
        const skinEditorContainer = document.querySelector('.skin-editor, #skin-editor, [data-v-skin-editor]');
        if (skinEditorContainer) {
            const controls = skinEditorContainer.querySelector('.controls, .tools');
            if (controls) return controls;
            return skinEditorContainer;
        }
        let parent = canvas.parentElement;
        for (let i = 0; i < 5 && parent; i++) {
            if (parent.classList.contains('sk-app') ||
                parent.classList.contains('editor') ||
                parent.id === 'skin-editor' ||
                parent.classList.contains('skin-editor')) {
                return parent;
            }
            const controlElements = parent.querySelectorAll('button, .color, input, select');
            if (controlElements.length > 3) {
                return parent;
            }
            parent = parent.parentElement;
        }
        const canvasParent = canvas.parentElement;
        const fallbackContainer = document.createElement('div');
        fallbackContainer.id = 'skin-editor-controls-fallback';
        fallbackContainer.style.marginTop = '10px';
        canvasParent.appendChild(fallbackContainer);
        console.log('Created fallback container for skin editor controls');
        return fallbackContainer;
    }
    function createUploadContainer() {
        const container = document.createElement('div');
        container.id = 'custom-image-uploader-container';
        container.style.position = 'absolute';
        container.style.right = '50px';
        container.style.top = '70px';
        container.style.width = config.containerWidth;
        container.style.padding = '15px';
        container.style.backgroundColor = config.agarioColors.background;
        container.style.color = config.agarioColors.text;
        container.style.borderRadius = '8px';
        container.style.boxSizing = 'border-box';
        container.style.zIndex = '9999';
        container.style.boxShadow = '0 0 15px rgba(0, 0, 0, 0.5)';
        container.style.fontFamily = 'Ubuntu, Arial, sans-serif';
        container.style.border = '2px solid ' + config.agarioColors.green;
        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.marginBottom = '15px';
        header.style.borderBottom = '1px solid ' + config.agarioColors.green;
        header.style.paddingBottom = '8px';
        const title = document.createElement('h3');
        title.textContent = 'New Jacks 🕹️ Skin Editor';
        title.style.margin = '0';
        title.style.color = config.agarioColors.blue;
        title.style.fontSize = '24px';
        title.style.fontWeight = 'bold';
        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = '−';
        toggleBtn.style.backgroundColor = config.agarioColors.green;
        toggleBtn.style.border = 'none';
        toggleBtn.style.color = '#ccc';
        toggleBtn.style.fontSize = '18px';
        toggleBtn.style.cursor = 'pointer';
        toggleBtn.style.width = '24px';
        toggleBtn.style.height = '24px';
        toggleBtn.style.display = 'flex';
        toggleBtn.style.justifyContent = 'center';
        toggleBtn.style.alignItems = 'center';
        toggleBtn.style.borderRadius = '4px';
        const contentContainer = document.createElement('div');
        contentContainer.id = 'image-uploader-content';
        toggleBtn.addEventListener('click', () => {
            if (contentContainer.style.display === 'none') {
                contentContainer.style.display = 'block';
                toggleBtn.textContent = '−';
            } else {
                contentContainer.style.display = 'none';
                toggleBtn.textContent = '+';
            }
        });
        header.appendChild(title);
        header.appendChild(toggleBtn);
        container.appendChild(header);
        container.appendChild(contentContainer);
        const urlContainer = document.createElement('div');
        urlContainer.style.marginBottom = '12px';
        urlContainer.style.display = 'flex';
        const urlInput = document.createElement('input');
        urlInput.type = 'text';
        urlInput.placeholder = 'Enter image URL... ibb.co best';
        urlInput.style.flex = '1';
        urlInput.style.padding = '10px';
        urlInput.style.border = '1px solid #444';
        urlInput.style.backgroundColor = 'rgba (135, 135, 135, 0.3)';
        urlInput.style.color = '#000';
        urlInput.style.borderRadius = '4px';
        urlInput.style.marginRight = '5px';
        urlInput.style.fontSize = '18px';
        const urlButton = document.createElement('button');
        urlButton.textContent = 'Load';
        urlButton.style.padding = '10px';
        urlButton.style.backgroundColor = config.agarioColors.green;
        urlButton.style.color = 'black';
        urlButton.style.border = 'none';
        urlButton.style.borderRadius = '4px';
        urlButton.style.cursor = 'pointer';
        urlButton.style.fontWeight = 'bold';
        urlContainer.appendChild(urlInput);
        urlContainer.appendChild(urlButton);
        contentContainer.appendChild(urlContainer);
        const uploadButtons = document.createElement('div');
        uploadButtons.style.display = 'flex';
        uploadButtons.style.gap = '5px';
        uploadButtons.style.marginBottom = '12px';
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.id = 'custom-skin-file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        const fileButton = document.createElement('button');
        fileButton.textContent = 'Upload From Computer';
        fileButton.style.flex = '1';
        fileButton.style.padding = '10px';
        fileButton.style.backgroundColor = config.agarioColors.blue;
        fileButton.style.color = 'white';
        fileButton.style.border = 'none';
        fileButton.style.borderRadius = '4px';
        fileButton.style.cursor = 'pointer';
        fileButton.style.fontWeight = 'bold';
        uploadButtons.appendChild(fileInput);
        uploadButtons.appendChild(fileButton);
        contentContainer.appendChild(uploadButtons);
        const dropZone = document.createElement('div');
        dropZone.id = 'custom-skin-drop-zone';
        dropZone.textContent = 'Drop Image Here';
        dropZone.style.height = config.dropZoneHeight;
        dropZone.style.border = `2px dashed ${config.agarioColors.yellow}`;
        dropZone.style.borderRadius = '4px';
        dropZone.style.display = 'flex';
        dropZone.style.flexDirection = 'column';
        dropZone.style.alignItems = 'center';
        dropZone.style.justifyContent = 'center';
        dropZone.style.color = '#ccc';
        dropZone.style.marginBottom = '12px';
        dropZone.style.fontSize = '16px';
        dropZone.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
        const dropIcon = document.createElement('div');
        dropIcon.innerHTML = '⬇️';
        dropIcon.style.fontSize = '24px';
        dropIcon.style.marginBottom = '8px';
        dropZone.appendChild(dropIcon);
        dropZone.appendChild(document.createTextNode('Drag & Drop Image Here'));
        contentContainer.appendChild(dropZone);
        const previewContainer = document.createElement('div');
        previewContainer.style.textAlign = 'center';
        previewContainer.style.marginTop = '12px';
        previewContainer.style.display = 'none';
        previewContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        previewContainer.style.padding = '10px';
        previewContainer.style.borderRadius = '4px';
        const previewLabel = document.createElement('div');
        previewLabel.textContent = 'Preview:';
        previewLabel.style.marginBottom = '8px';
        previewLabel.style.color = config.agarioColors.yellow;
        previewLabel.style.fontSize = '14px';
        previewLabel.style.fontWeight = 'bold';
        const previewImg = document.createElement('img');
        previewImg.id = 'custom-skin-preview';
        previewImg.style.maxWidth = '100%';
        previewImg.style.maxHeight = `${config.maxPreviewSize}px`;
        previewImg.style.border = '1px solid #444';
        previewImg.style.borderRadius = '50%';
        previewContainer.appendChild(previewLabel);
        previewContainer.appendChild(previewImg);
        contentContainer.appendChild(previewContainer);
        const helpText = document.createElement('div');
        helpText.style.fontSize = '20px';
        helpText.style.color = '#000';
        helpText.style.textShadow = '1px 1px 1px #444';
        helpText.style.marginTop = '16px';
        helpText.style.lineHeight = '1.4';
        helpText.style.padding = '8px';
        helpText.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
        helpText.style.borderRadius = '4px';
        helpText.style.borderLeft = '3px solid ' + config.agarioColors.yellow;
        helpText.innerHTML = `
            <b style="color:${config.agarioColors.blue}">Tips:</b><br>
            • If image doesn't appear clearly, try <a href="https://picwish.com/unblur-image-portrait" target="_blank" style="color:${config.agarioColors.blue};">unblurring it PicWish.com</a><br>
            • Use <a href="https://crop-circle.imageonline.co/" target="_blank" style="color:${config.agarioColors.blue};">Crop Circle Tool</a> for best results<br>
            • Simple designs with few colors work best<br>
            • The image will be centered and scaled
        `;
        contentContainer.appendChild(helpText);
        urlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                loadImageFromUrl(urlInput.value);
            }
        });
        urlButton.addEventListener('click', () => {
            loadImageFromUrl(urlInput.value);
        });
        fileButton.addEventListener('click', () => {
            fileInput.click();
        });
        fileInput.addEventListener('change', () => {
            if (fileInput.files && fileInput.files[0]) {
                handleFileUpload(fileInput.files[0]);
            }
        });
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.style.borderColor = config.agarioColors.green;
            dropZone.style.backgroundColor = 'rgba(84, 200, 0, 0.1)';
        });
        dropZone.addEventListener('dragleave', () => {
            dropZone.style.borderColor = config.agarioColors.yellow;
            dropZone.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
        });
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.style.borderColor = config.agarioColors.yellow;
            dropZone.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFileUpload(e.dataTransfer.files[0]);
            }
        });
        [fileButton, urlButton].forEach(button => {
            button.addEventListener('mouseover', () => {
                const originalColor = button.style.backgroundColor;
                const darkerColor = originalColor === config.agarioColors.green ?
                      config.buttonHoverColor :
                (originalColor === config.agarioColors.blue ? '#0060cc' : originalColor);
                button.style.backgroundColor = darkerColor;
            });
            button.addEventListener('mouseout', () => {
                button.style.backgroundColor = button === fileButton ?
                    config.agarioColors.blue : config.agarioColors.green;
            });
        });
        makeDraggable(container, header);
        return container;
    }
    function makeDraggable(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        handle.style.cursor = 'move';
        handle.onmousedown = dragMouseDown;
        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }
        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
            element.style.right = 'auto';
        }
        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
    function removeImageUploader() {
        const uploader = document.getElementById('custom-image-uploader-container');
        if (uploader) {
            uploader.remove();
            console.log('Image uploader removed');
        }
    }
    function checkIfEditorClosed() {
        const canvas = document.getElementById('skin-editor-canvas');
        if (!canvas) {
            removeImageUploader();
        }
    }
    function positionUploaderNextToEditor(uploader) {
        const canvas = document.getElementById('skin-editor-canvas');
        if (!canvas) return;
        const canvasRect = canvas.getBoundingClientRect();
        const editorWidth = canvas.clientWidth || canvas.offsetWidth;
        uploader.style.top = `${canvasRect.top}px`;
        uploader.style.left = 'auto';
        uploader.style.right = '20px';
    }
    function loadImageFromUrl(url) {
        if (!url) return;
        if (!url.match(/^https?:\/\/.+\..+/i)) {
            alert('Please enter a valid URL');
            return;
        }
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
            updatePreview(img.src);
            drawImageToCanvas(img);
        };
        img.onerror = () => {
            alert('Error loading image. The URL might be invalid or the server does not allow cross-origin requests.');
        };
        img.src = url;
    }
    function handleFileUpload(file) {
        if (!file || !file.type.startsWith('image/')) {
            alert('Please select a valid image file');
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                updatePreview(e.target.result);
                drawImageToCanvas(img);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    function updatePreview(src) {
        const preview = document.getElementById('custom-skin-preview');
        const previewContainer = preview.parentElement;
        preview.src = src;
        previewContainer.style.display = 'block';
        const successMsg = document.createElement('div');
        successMsg.textContent = 'Image loaded successfully!';
        successMsg.style.color = config.agarioColors.green;
        successMsg.style.fontWeight = 'bold';
        successMsg.style.marginTop = '5px';
        successMsg.style.fontSize = '12px';
        const existingMsg = previewContainer.querySelector('.success-msg');
        if (existingMsg) {
            previewContainer.removeChild(existingMsg);
        }
        successMsg.className = 'success-msg';
        previewContainer.appendChild(successMsg);
        setTimeout(() => {
            successMsg.style.transition = 'opacity 1s';
            successMsg.style.opacity = '0';
        }, 3000);
    }
    function drawImageToCanvas(img) {
        const canvas = document.getElementById('skin-editor-canvas');
        if (!canvas) {
            console.error('Skin editor canvas not found');
            return;
        }
        const ctx = canvas.getContext('2d');
        const originalWidth = canvas.width;
        const originalHeight = canvas.height;
        ctx.clearRect(0, 0, originalWidth, originalHeight);
        const scale = Math.min(
            originalWidth / img.width,
            originalHeight / img.height
        );
        const x = (originalWidth - img.width * scale) / 2;
        const y = (originalHeight - img.height * scale) / 2;
        const width = img.width * scale;
        const height = img.height * scale;
        ctx.drawImage(img, x, y, width, height);
        const changeEvent = new Event('change', { bubbles: true });
        canvas.dispatchEvent(changeEvent);
        try {
            if (window.drawApp && typeof window.drawApp.render === 'function') {
                window.drawApp.render(true);
            }
        } catch (e) {
            console.log('Internal draw method not available:', e);
        }
    }
})();