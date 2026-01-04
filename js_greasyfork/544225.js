// ==UserScript==
// @name         Drawaria.Online Local Image Marker
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Upload and repeatedly stamp an image locally on your Drawaria.online canvas (not synced with others).
// @author       ChatGPT
// @match        https://drawaria.online/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544225/DrawariaOnline%20Local%20Image%20Marker.user.js
// @updateURL https://update.greasyfork.org/scripts/544225/DrawariaOnline%20Local%20Image%20Marker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let stampingInterval = null;
    let img = null;

    function getCanvas() {
        return document.querySelector('canvas');
    }

    function addUI(canvas) {
        if(document.getElementById('image-marker-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'image-marker-btn';
        btn.textContent = 'Upload & Stamp Image Locally';
        btn.style.position = 'fixed';
        btn.style.top = '10px';
        btn.style.right = '10px';
        btn.style.zIndex = 9999;
        btn.style.padding = '8px 12px';
        btn.style.fontSize = '14px';
        btn.style.cursor = 'pointer';
        btn.style.backgroundColor = '#3399ff';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '6px';

        btn.addEventListener('click', () => {
            if (stampingInterval) {
                clearInterval(stampingInterval);
                stampingInterval = null;
                btn.textContent = 'Upload & Stamp Image Locally';
                return;
            }

            // Open file selector
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.style.display = 'none';
            input.onchange = e => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = ev => {
                    img = new Image();
                    img.onload = () => {
                        startStamping(canvas, img);
                        btn.textContent = 'Stop Stamping';
                    };
                    img.onerror = () => alert('Failed to load the image.');
                    img.src = ev.target.result;
                };
                reader.readAsDataURL(file);
            };

            document.body.appendChild(input);
            input.click();
            document.body.removeChild(input);
        });

        document.body.appendChild(btn);
    }

    function startStamping(canvas, img) {
        const ctx = canvas.getContext('2d');
        const stampWidth = 100;
        const stampHeight = stampWidth * img.height / img.width;

        stampingInterval = setInterval(() => {
            const x = Math.random() * (canvas.width - stampWidth);
            const y = Math.random() * (canvas.height - stampHeight);
            ctx.drawImage(img, x, y, stampWidth, stampHeight);
        }, 500);
    }

    function init() {
        const canvas = getCanvas();
        if(canvas) {
            addUI(canvas);
        } else {
            setTimeout(init, 1000);
        }
    }

    init();

})();