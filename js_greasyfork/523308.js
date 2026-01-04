// ==UserScript==
// @name         Draw Anywhere!
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Draw on any website except certain search engines.
// @author       Unknown Hacker
// @license      CC BY-NC
// @match        *://*/*
// @exclude      *://www.google.com/search*
// @exclude      *://search.brave.com/*
// @exclude      *://duckduckgo.com/*
// @exclude      *://www.bing.com/*
// @exclude      *://search.yahoo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523308/Draw%20Anywhere%21.user.js
// @updateURL https://update.greasyfork.org/scripts/523308/Draw%20Anywhere%21.meta.js
// ==/UserScript==

/*
  _____                                                     _                      _    _          _    _
 |  __ \                         /\                        | |                    | |  | |        | |  | |
 | |  | |_ __ __ ___      __    /  \   _ __  _   ___      _| |__   ___ _ __ ___   | |  | |_      _| |  | |
 | |  | | '__/ _` \ \ /\ / /   / /\ \ | '_ \| | | \ \ /\ / / '_ \ / _ \ '__/ _ \  | |  | \ \ /\ / / |  | |
 | |__| | | | (_| |\ V  V /   / ____ \| | | | |_| |\ V  V /| | | |  __/ | |  __/  | |__| |\ V  V /| |__| |
 |_____/|_|  \__,_| \_/\_/   /_/    \_\_| |_|\__, | \_/\_/ |_| |_|\___|_|  \___|   \____/  \_/\_/  \____/
                                              __/ |
                                             |___/
*/

// Customization may or may not come; I didn't add it on purpose.

(function() {
    'use strict';

    function isIncognito() {
        return new Promise(resolve => {
            const fs = window.RequestFileSystem || window.webkitRequestFileSystem;
            if (!fs) return resolve(false);
            fs(window.TEMPORARY, 100, () => resolve(false), () => resolve(true));
        });
    }

    isIncognito().then(incognito => {
        if (incognito) return;

        let canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = 0;
        canvas.style.left = 0;
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = 9999;
        canvas.style.pointerEvents = 'auto';
        document.body.appendChild(canvas);

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        let ctx = canvas.getContext('2d');
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';

        let drawing = false;

        function setPenColor() {
            let bgColor = window.getComputedStyle(document.body).backgroundColor;
            let rgb = bgColor.match(/\d+/g).map(Number);
            let brightness = Math.sqrt(
                0.299 * (rgb[0] ** 2) +
                0.587 * (rgb[1] ** 2) +
                0.114 * (rgb[2] ** 2)
            );

            ctx.strokeStyle = brightness < 128 ? 'white' : 'black';
        }
        setPenColor();

        function startDrawing(x, y) {
            drawing = true;
            ctx.beginPath();
            ctx.moveTo(x, y);
        }

        function draw(x, y) {
            if (!drawing) return;
            ctx.lineTo(x, y);
            ctx.stroke();
        }

        function stopDrawing() {
            drawing = false;
        }

        canvas.addEventListener('mousedown', (e) => startDrawing(e.clientX, e.clientY));
        canvas.addEventListener('mousemove', (e) => draw(e.clientX, e.clientY));
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);

        canvas.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            startDrawing(touch.clientX, touch.clientY);
            e.preventDefault();
        });
        canvas.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            draw(touch.clientX, touch.clientY);
            e.preventDefault();
        });
        canvas.addEventListener('touchend', stopDrawing);
        canvas.addEventListener('touchcancel', stopDrawing);

        window.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key.toLowerCase() === 'c') {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        });

        /*
         
         This is to communication with a website "https://drawanywhere.playcode.io/" you can enable it and try it out
         but from what i tested it dosn't work.
         
        window.addEventListener('message', function(event) {
            if (event.data.action === 'startDrawing') {
                // Start drawing or prepare canvas once received the signal
                console.log('Drawing started');
                setPenColor(); // Ensure pen color is updated based on the background
            }
        });
        
        */

    });
})();
