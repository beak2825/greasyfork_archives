// ==UserScript==
// @name         GitHub Image Previewer
// @description  Previews various image formats, including JPG, PNG, GIF, BMP, TIFF, WebP, SVG, and ICO.
// @icon         https://github.githubassets.com/favicons/favicon-dark.svg
// @version      1.2
// @author       afkarxyz
// @namespace    https://github.com/afkarxyz/userscripts/
// @supportURL   https://github.com/afkarxyz/userscripts/issues
// @license      MIT
// @match        https://github.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/520309/GitHub%20Image%20Previewer.user.js
// @updateURL https://update.greasyfork.org/scripts/520309/GitHub%20Image%20Previewer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const GitHubImagePreviewer = {
        supportedImageFormats: /\.(jpe?g|png|gif|bmp|ico|tiff?|webp|svg)$/i,
        imagePreviewContainer: null,
        imagePreviewElement: null,
        imagePreviewTitle: null,
        imagePreviewMetadata: null,

        init() {
            this.createImagePreviewElements();
            this.attachImagePreviewListeners();
            this.disableGitHubTooltips();
        },

        createImagePreviewElements() {
            this.imagePreviewContainer = document.createElement('div');
            this.imagePreviewContainer.style.cssText = `
                position: fixed;
                z-index: 9999;
                background: white;
                border: 1px solid #d1d5da;
                border-radius: 3px;
                box-shadow: 0 1px 5px rgba(27,31,35,0.15);
                display: none;
                padding: 10px;
                max-width: 300px;
                max-height: 300px;
                color: #24292e;
            `;

            this.imagePreviewTitle = document.createElement('div');
            this.imagePreviewTitle.style.cssText = `
                font-weight: bold;
                margin-bottom: 5px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            `;

            this.imagePreviewElement = document.createElement('img');
            this.imagePreviewElement.style.cssText = `
                max-width: 100%;
                max-height: 200px;
                display: block;
                margin: 0 auto;
                background-image: linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
                      linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
                      linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
                      linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
                background-size: 20px 20px;
                background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
            `;

            this.imagePreviewMetadata = document.createElement('div');
            this.imagePreviewMetadata.style.cssText = `
                font-size: 12px;
                color: #586069;
                margin-top: 5px;
                text-align: center;
            `;

            this.imagePreviewContainer.appendChild(this.imagePreviewTitle);
            this.imagePreviewContainer.appendChild(this.imagePreviewElement);
            this.imagePreviewContainer.appendChild(this.imagePreviewMetadata);
            document.body.appendChild(this.imagePreviewContainer);
        },

        attachImagePreviewListeners() {
            document.addEventListener('mouseover', this.handleImageMouseOver.bind(this));
            document.addEventListener('mouseout', this.handleImageMouseOut.bind(this));
            document.addEventListener('mousemove', this.handleImageMouseMove.bind(this));
        },

        disableGitHubTooltips() {
            const style = document.createElement('style');
            style.textContent = `
                .tooltipped::before, .tooltipped::after {
                    display: none !important;
                }
            `;
            document.head.appendChild(style);
        },

        handleImageMouseOver(event) {
            const target = event.target.closest('a');
            if (target && this.supportedImageFormats.test(target.href)) {
                if (target.hasAttribute('title')) {
                    target.dataset.originalTitle = target.getAttribute('title');
                    target.removeAttribute('title');
                }
                this.showImagePreview(target);
            }
        },

        handleImageMouseOut() {
            this.hideImagePreview();
        },

        handleImageMouseMove(event) {
            if (this.imagePreviewContainer.style.display !== 'none') {
                const mouseX = event.clientX;
                const mouseY = event.clientY;
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                const previewWidth = this.imagePreviewContainer.offsetWidth;
                const previewHeight = this.imagePreviewContainer.offsetHeight;
                
                let x = mouseX + 15;
                let y = mouseY + 15;
                
                if (x + previewWidth > viewportWidth) {
                    x = mouseX - previewWidth - 15;
                }
                
                if (y + previewHeight > viewportHeight) {
                    y = mouseY - previewHeight - 15;
                }
                
                this.imagePreviewContainer.style.left = `${x}px`;
                this.imagePreviewContainer.style.top = `${y}px`;
            }
        },

        showImagePreview(target) {
            const imageUrl = target.href.replace('/blob/', '/raw/');
            this.imagePreviewTitle.textContent = target.dataset.originalTitle || target.getAttribute('title') || target.textContent;
            this.imagePreviewElement.src = imageUrl;
            this.imagePreviewContainer.style.display = 'block';

            this.imagePreviewElement.onload = this.updateImageMetadata.bind(this);
        },

        hideImagePreview() {
            this.imagePreviewContainer.style.display = 'none';
        },

        updateImageMetadata() {
            const width = this.imagePreviewElement.naturalWidth;
            const height = this.imagePreviewElement.naturalHeight;
            this.imagePreviewMetadata.textContent = `${width} x ${height} px`;
        },
    };

    GitHubImagePreviewer.init();
})();