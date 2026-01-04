// ==UserScript==
// @name         11h đêm tôi vẫn chưa được ngủ dume đám fb
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  LoliUniveser muôn năm
// @author       Leonios
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/442746/11h%20%C4%91%C3%AAm%20t%C3%B4i%20v%E1%BA%ABn%20ch%C6%B0a%20%C4%91%C6%B0%E1%BB%A3c%20ng%E1%BB%A7%20dume%20%C4%91%C3%A1m%20fb.user.js
// @updateURL https://update.greasyfork.org/scripts/442746/11h%20%C4%91%C3%AAm%20t%C3%B4i%20v%E1%BA%ABn%20ch%C6%B0a%20%C4%91%C6%B0%E1%BB%A3c%20ng%E1%BB%A7%20dume%20%C4%91%C3%A1m%20fb.meta.js
// ==/UserScript==
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