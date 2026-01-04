// ==UserScript==
// @name         Image Downloader with Format Option
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Download images in different formats (PNG, JPEG, WEBP) from any website.
// @author       GMbox
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540423/Image%20Downloader%20with%20Format%20Option.user.js
// @updateURL https://update.greasyfork.org/scripts/540423/Image%20Downloader%20with%20Format%20Option.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const formats = ['png', 'jpeg', 'webp'];

    function createDownloadButton(img) {
        const btn = document.createElement('button');
        btn.textContent = '↓';
        btn.style.position = 'absolute';
        btn.style.zIndex = 9999;
        btn.style.top = '5px';
        btn.style.right = '5px';
        btn.style.padding = '2px 5px';
        btn.style.backgroundColor = '#000';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '12px';
        btn.style.borderRadius = '4px';

        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            e.preventDefault();
            const format = prompt("Choose format: png, jpeg, webp", "png");
            if (!formats.includes(format)) {
                alert("Unsupported format");
                return;
            }

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            context.drawImage(img, 0, 0);

            canvas.toBlob((blob) => {
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = `image.${format}`;
                document.body.appendChild(a);
                a.click();
                a.remove();
            }, `image/${format}`);
        });

        return btn;
    }

    function wrapImage(img) {
        if (img.closest('.image-download-wrapper')) return;

        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.style.display = 'inline-block';
        wrapper.classList.add('image-download-wrapper');

        const clonedImg = img.cloneNode(true);
        img.parentNode.replaceChild(wrapper, img);
        wrapper.appendChild(clonedImg);

        const btn = createDownloadButton(clonedImg);
        wrapper.appendChild(btn);
    }

    function observeImages() {
        document.querySelectorAll('img').forEach(wrapImage);
    }

    new MutationObserver(observeImages).observe(document.body, {
        childList: true,
        subtree: true
    });

    window.addEventListener('load', observeImages);
})();