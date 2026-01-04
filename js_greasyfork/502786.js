// ==UserScript==
// @name         Drawaria Image Canvas Importer
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Import Images Directly to Drawaria Canvas
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @license      MIT 
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502786/Drawaria%20Image%20Canvas%20Importer.user.js
// @updateURL https://update.greasyfork.org/scripts/502786/Drawaria%20Image%20Canvas%20Importer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Resize canvas
    let canvas = document.getElementById('canvas');
    canvas.height = 650;
    canvas.width = 780;

    // Add drag and drop functionality
    canvas.addEventListener('dragover', function(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    });

    canvas.addEventListener('drop', function(event) {
        event.preventDefault();
        let file = event.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleImage(file);
        }
    });

    function handleImage(file) {
        let reader = new FileReader();
        reader.onload = function(e) {
            let img = new Image();
            img.onload = function() {
                let ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
})();