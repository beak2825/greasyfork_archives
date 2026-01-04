// ==UserScript==
// @name         arkasvtc
// @namespace    https://okunamayanad.com/
// @version      1.2
// @description  Discord: @okunamayand, Github: https://github.com/okunamayanad/r-place-2023
// @author       okunamayanad
// @match        https://garlic-bread.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/471609/arkasvtc.user.js
// @updateURL https://update.greasyfork.org/scripts/471609/arkasvtc.meta.js
// ==/UserScript==

console.log("1");
if (window.top !== window.self) {
    console.log("2");
    // console.log("3");
    // Load the image
    const image = document.createElement("img");
    var d = new Date();
    image.src = "https://raw.githubusercontent.com/qweeren/r-place-2023/main/output.png";
    image.onload = () => {
        image.style = `position: absolute; left: 0; top: 0; width: ${image.width/3}px; height: ${image.height/3}px; image-rendering: pixelated; z-index: 1`;
    };

    // Add the image as overlay
    const camera = document.querySelector("garlic-bread-embed").shadowRoot.querySelector("garlic-bread-camera");
    const canvas = camera.querySelector("garlic-bread-canvas");
    const container = canvas.shadowRoot.querySelector('.container')
    container.appendChild(image);

    console.log("container", container);

    // Add a style to put a hole in the pixel preview (to see the current or desired color)
    const waitForPreview = setInterval(() => {
        const preview = camera.querySelector("garlic-bread-pixel-preview");
        if (preview) {
            clearInterval(waitForPreview);
            const style = document.createElement('style')
            style.innerHTML = '.pixel { clip-path: polygon(-20% -20%, -20% 120%, 37% 120%, 37% 37%, 62% 37%, 62% 62%, 37% 62%, 37% 120%, 120% 120%, 120% -20%); }'
            preview.shadowRoot.appendChild(style);
        }
    }, 100);
}
