// ==UserScript==
// @name         suprCHAD template :)
// @version      1.5
// @description  code to make the overlay here: https://github.com/alexshore/suprCHAD
// @author       kntrllr
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @namespace Violentmonkey Scripts
// @downloadURL https://update.greasyfork.org/scripts/442651/suprCHAD%20template%20%3A%29.user.js
// @updateURL https://update.greasyfork.org/scripts/442651/suprCHAD%20template%20%3A%29.meta.js
// ==/UserScript==
if (window.top !== window.self) {
    window.addEventListener('load', () => {
            document.getElementsByTagName("mona-lisa-embed")[0].shadowRoot.children[0].getElementsByTagName("mona-lisa-canvas")[0].shadowRoot.children[0].appendChild(
        (function () {
            const i = document.createElement("img");
            i.src = "https://raw.githubusercontent.com/alexshore/suprCHAD/main/output_images/final_CHAD.png";
            i.style = "position: absolute;left: 0;top: 0;image-rendering: pixelated;width: 2000px;height: 2000px;";
            console.log(i);
            return i;
        })())

    }, false);

}