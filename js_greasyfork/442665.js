// ==UserScript==
// @name         r/Place overlay for Vietnam
// @namespace    http://tampermonkey.net/
// @version      alpha two
// @description  r/Place overlay for the Vietnam flag and flappy bird. Stolen from OsuPlace.
// @author       u/oralekin (OC), u/LittleEndu, u/ekgame, u/84436, t3bol90 (not on reddit yet)
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/442665/rPlace%20overlay%20for%20Vietnam.user.js
// @updateURL https://update.greasyfork.org/scripts/442665/rPlace%20overlay%20for%20Vietnam.meta.js
// ==/UserScript==

//VE CO VIETNAM 
if (window.top !== window.self) {
    window.addEventListener('load', () => {
        // Load the image
        const image = document.createElement("img");
        // image.src = "https://cdn.mirai.gg/tmp/dotted-place-template.png";
        image.src = "https://raw.githubusercontent.com/t3bol90/flag-of-vietnam-rplace2022/main/flag.png";
        image.onload = () => {
            image.style = `position: absolute; left: 0; top: 0; width: ${image.width/3}px; height: ${image.height/3}px; image-rendering: pixelated; z-index: 1`;
        };
      
        // Add the image as overlay
        const camera = document.querySelector("mona-lisa-embed").shadowRoot.querySelector("mona-lisa-camera");
        const canvas = camera.querySelector("mona-lisa-canvas");
        canvas.shadowRoot.querySelector('.container').appendChild(image);
        
        // Add a 50% white overlay
        //canvas.shadowRoot.querySelector('.container canvas').style.opacity = "0.50";
      
        // Add a style to put a hole in the pixel preview (to see the current or desired color)
        const waitForPreview = setInterval(() => {
            const preview = camera.querySelector("mona-lisa-pixel-preview");
            if (preview) {
              clearInterval(waitForPreview);
              const style = document.createElement('style')
              style.innerHTML = '.pixel { clip-path: polygon(-20% -20%, -20% 120%, 37% 120%, 37% 37%, 62% 37%, 62% 62%, 37% 62%, 37% 120%, 120% 120%, 120% -20%); }'
              preview.shadowRoot.appendChild(style);
            }
        }, 100);
    }, false);
}
//VE CON CHIM
if (window.top !== window.self) {
    window.addEventListener('load', () => {
        const opacity = 1;
        const camera = document.querySelector("mona-lisa-embed").shadowRoot.querySelector("mona-lisa-camera");
        const canvas = camera.querySelector("mona-lisa-canvas");
        const container = canvas.shadowRoot.querySelector('.container');
        function addImage(src, posX, posY) {
            let img = document.createElement("img");
            img.onload = () => {
                const width = img.width;
                const height = img.height;
                const canvas = document.createElement("canvas");
                canvas.width = width * 3;
                canvas.height = height * 3;
                canvas.style = `position: absolute; left: ${posX}px; top: ${posY}px; image-rendering: pixelated; width: ${width}px; height: ${height}px;`;
                const ctx = canvas.getContext("2d");
                ctx.globalAlpha = opacity;
                for (let y = 0; y < height; y++) {
                    for (let x = 0; x < width; x++) {
                        ctx.drawImage(img, x, y, 1, 1, x * 3 + 1, y * 3 + 1, 1, 1);
                    }
                }
                container.appendChild(canvas);
            };
            img.src = src;
        }
        addImage("https://cdn.discordapp.com/attachments/960358693243863040/960566586471763968/unknown.png", 1398, 1971);
    }, false);
}