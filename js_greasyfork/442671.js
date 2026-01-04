

    // ==UserScript==
    // @name         Toki Pona Overlay 2
    // @namespace    http://tampermonkey.net/
    // @version      0.3
    // @description  try to take over the canvas!
    // @author       Mikarific
    // @match        https://hot-potato.reddit.com/embed*
    // @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
    // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442671/Toki%20Pona%20Overlay%202.user.js
// @updateURL https://update.greasyfork.org/scripts/442671/Toki%20Pona%20Overlay%202.meta.js
    // ==/UserScript==
    if (window.top !== window.self) {
        window.addEventListener('load', () => {
            // Load the image
            const image = document.createElement("img");
            const time = Date.now();
            image.src = "https://user-images.githubusercontent.com/48604279/161447646-182dc4e4-364c-40ca-a255-e5debbfc76e6.png?time=" + time;
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

