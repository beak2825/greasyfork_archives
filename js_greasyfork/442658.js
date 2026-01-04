// ==UserScript==
// @name         RPlace
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description   Düzenleme isteyenler: Çağlar#2809 - https://www.youtube.com/c/WarForPeace_YT/ - http://github.com/WarF0rPeace
// @author       WarForPeace
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/442658/RPlace.user.js
// @updateURL https://update.greasyfork.org/scripts/442658/RPlace.meta.js
// ==/UserScript==
if (window.top !== window.self) {
    window.addEventListener('load', () => {
        // Load the image
        const image = document.createElement("img");
        image.src = "https://raw.githubusercontent.com/WarF0rPeace/RPlace/master/blue_print.png";
        image.onload = () => {
            image.style = `position: absolute; left: 0; top: 0; width: ${image.width/3}px; height: ${image.height/3}px; image-rendering: pixelated; z-index: 1`;
        };

        // Add the image as overlay
        const camera = document.querySelector("mona-lisa-embed").shadowRoot.querySelector("mona-lisa-camera");
        const canvas = camera.querySelector("mona-lisa-canvas");
        canvas.shadowRoot.querySelector('.container').appendChild(image);

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