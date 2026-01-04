// ==UserScript==
// @name         Wallhaven Ratio Check / Fit to Wallpaper 16:9
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Add ratio information to Wallhaven images and check hot to fit this wallpaper to 16:9 screen
// @author       Olexandro
// @icon         https://wallhaven.cc/favicon.ico
// @match        https://wallhaven.cc/w/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539858/Wallhaven%20Ratio%20Check%20%20Fit%20to%20Wallpaper%2016%3A9.user.js
// @updateURL https://update.greasyfork.org/scripts/539858/Wallhaven%20Ratio%20Check%20%20Fit%20to%20Wallpaper%2016%3A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add CSS styles
    const styles = `
        body {
            overflow: hidden;
        }

        canvas.custom-canvas {
            position: absolute;
            border: none;
        }

        button.custom-button {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 40px;
            padding: 10px 20px;
            background: radial-gradient(circle, #1976d2, #0d47a1);
            color: #ffffff;
            border: 0 solid rgb(41, 41, 41);
            border-left-width: 1px;
            border-left-color: rgba(255, 255, 255, 0.15);
            border-radius: 3px;
            cursor: pointer;
            margin-top: 10px;
            font-size: 14px;
            font-family: 'Verdana, sans-serif';
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
        }

        button.custom-button:hover {
            background: radial-gradient(circle, #1565c0, #0b3c91);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
        }

        .cover-rectangle {
            position: absolute;
            background-color: rgba(0, 0, 0, 0.95);
            z-index: 1001;
        }
    `;

    // Inject CSS
    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    function print(args) {
        console.log(args);
    }

    function calculateAspectRatio(width, height) {
        return (width / height).toFixed(3);
    }

    function updateH3Element(h3Element, ratio) {
        h3Element.textContent += `\n(${ratio})`;
        var subData = h3Element.attributes.getNamedItem("original-title");
        if (subData) {
            subData.textContent += " (1.778)";
        }
    }

    function createCanvas(img) {
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.className = 'custom-canvas';
        document.body.appendChild(canvas);
        return canvas;
    }

    function updateCanvasSize(canvas, img) {
        var rect = img.getBoundingClientRect();
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.style.left = rect.left + 'px';
        canvas.style.top = rect.top + 'px';
    }

    function updateCanvasVisibility(canvas, img) {
        var rect = img.getBoundingClientRect();
        if (rect.width > window.innerWidth || rect.height > window.innerHeight) {
            canvas.style.display = 'none';
        } else {
            canvas.style.display = 'block';
            updateCanvasSize(canvas, img);
        }
    }

    function createButton(h3Element) {
        var button = document.createElement('button');
        button.textContent = 'CHECK RESOLUTION 16:9';
        button.className = 'custom-button';
        button.addEventListener('click', handleButtonClick);
        h3Element.parentNode.insertBefore(button, h3Element.nextSibling);
    }

    function handleButtonClick(event) {
        var img = document.getElementById('wallpaper');
        var originalWidth = parseInt(img.getAttribute('data-original-width'));
        var originalHeight = parseInt(img.getAttribute('data-original-height'));
        if (img.width === originalWidth && img.height === originalHeight) {
            var rectanglesToggled = toggleCoverRectangles();
            if (rectanglesToggled) {
                toggleButtonCheck(event.target);
            }
        }
    }

    function toggleButtonCheck(button) {
        if (button.textContent.includes('✔')) {
            button.textContent = 'CHECK RESOLUTION 16:9';
        } else {
            button.textContent = 'CHECK RESOLUTION 16:9 ✔';
        }
    }

    function toggleCoverRectangles() {
        var existingCovers = document.querySelectorAll('.cover-rectangle');
        if (existingCovers.length > 0) {
            existingCovers.forEach(cover => cover.remove());
            return true;
        } else {
            var img = document.getElementById('wallpaper');
            if (img) {
                createCoverRectangles(img);
                return true;
            }
        }
        return false;
    }

    function createRectangle(left, top, width, height) {
        var rect = document.createElement('div');
        rect.className = 'cover-rectangle';
        rect.style.left = left + 'px';
        rect.style.top = top + 'px';
        rect.style.width = width + 'px';
        rect.style.height = height + 'px';

        document.body.appendChild(rect);
    }

    function createCoverRectangles(img) {
        var rect = img.getBoundingClientRect();
        var targetWidth = img.width;
        var targetHeight = targetWidth / 16 * 9;
        if (targetHeight > img.height) {
            targetHeight = img.height;
            targetWidth = targetHeight * 16 / 9;
        }

        if (img.width > targetWidth) {
            createRectangle(rect.left, rect.top, (img.width - targetWidth) / 2, img.height);
            createRectangle(rect.left + ((img.width + targetWidth) / 2), rect.top,
                          (img.width - targetWidth) / 2, img.height);
        }

        if (img.height > targetHeight) {
            createRectangle(rect.left, rect.top, img.width, (img.height - targetHeight) / 2);
            createRectangle(rect.left, rect.top + ((img.height + targetHeight) / 2),
                          img.width, (img.height - targetHeight) / 2);
        }
    }

    function initialize() {
        var h3Elements = document.getElementsByTagName('h3');
        if (h3Elements.length > 0) {
            var res = h3Elements[0].textContent;
            var parts = res.split(" x ");
            var width = parseInt(parts[0]);
            var height = parseInt(parts[1]);
            var ratio = calculateAspectRatio(width, height);
            updateH3Element(h3Elements[0], ratio);
            createButton(h3Elements[0]);
        }

        var img = document.getElementById('wallpaper');
        if (img) {
            var canvas = createCanvas(img);
            var ctx = canvas.getContext('2d');

            img.addEventListener('click', function() {
                updateCanvasVisibility(canvas, img);
            });

            if (img.width && img.height) {
                img.setAttribute('data-original-width', img.width);
                img.setAttribute('data-original-height', img.height);
            } else {
                img.addEventListener('load', function() {
                    img.setAttribute('data-original-width', img.width);
                    img.setAttribute('data-original-height', img.height);
                });
            }
        }
    }

    // Wait for page to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();