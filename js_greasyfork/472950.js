// ==UserScript==
// @name         DVD corner hit
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      MIT
// @description  A DVD logo hitting occasinaly the corner. Not made in an optimized so it can be a bit laggy.
// @author       Leandro
// @match        *://*/*
// @icon         https://public.saraivam.ch/misc/dvd_icon_square_white.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472950/DVD%20corner%20hit.user.js
// @updateURL https://update.greasyfork.org/scripts/472950/DVD%20corner%20hit.meta.js
// ==/UserScript==

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

(function() {
    'use strict';

    const DVD_IMAGE_URL = 'https://public.saraivam.ch/misc/dvd_icon.png'
    const WIDTH = 97;
    const HEIGHT = 56;
    const SPEED = 0.1; // % per hundredth of a second
    const HUE_SPEED = 0.3;
    const pos = {x: getRandomInt(101), y: getRandomInt(101), direction: getRandomInt(4)};
    let hue = getRandomInt(361);
    // directions: 0=topLeft,1=topRight,2=bottomLeft,3=bottomRight
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Styling
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    canvas.style.zIndex = 9999;
    canvas.style.position = 'fixed';
    canvas.style.pointerEvents = 'none';

    // Draw a green debug rect
    //ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
    //ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    // Draw image
    const dvdImage = new Image();
    dvdImage.src = DVD_IMAGE_URL;

    // Add element to DOM
    document.getElementsByTagName('html')[0].prepend(canvas);

    // Handle movement
    window.setInterval(() => {
        if (pos.direction % 2 == 0) {
            pos.x -= SPEED;
        } else {
            pos.x += SPEED;
        }
        pos.direction = (pos.x < 0 || pos.x > 100 - (100 * WIDTH / window.innerWidth)) ? (pos.direction + (pos.direction % 2 == 0 ? 1 : -1)) % 4 : pos.direction;

        if (pos.direction < 2) {
            pos.y -= SPEED;
        } else {
            pos.y += SPEED;
        }
        pos.direction = (pos.y < 0 || pos.y > 100 - (100 * HEIGHT / window.innerHeight)) ? (pos.direction + 2) % 4 : pos.direction;

        // Move dvd image
        canvas.style.left = `${pos.x}%`;
        canvas.style.top = `${pos.y}%`;

        // Draw the image
        ctx.drawImage(dvdImage, 0, 0, WIDTH, HEIGHT);

        // Change the color of the drawn image to red
        ctx.globalCompositeOperation = "source-in";
        ctx.fillStyle = `hsl(${hue}, 50%, 50%)`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        hue = (hue + HUE_SPEED) % 360;

        // Reset the globalCompositeOperation to default
        ctx.globalCompositeOperation = "source-over";
    }, 10);
})();