// ==UserScript==
// @name         Streamwurstbude Ente Overlay
// @namespace    http://tampermonkey.net/
// @version      8.1.0
// @description  Verteidigt die Ente!
// @author       placeDE Devs <3 danke jungs
// @match        https://garlic-bread.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @downloadURL https://update.greasyfork.org/scripts/471637/Streamwurstbude%20Ente%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/471637/Streamwurstbude%20Ente%20Overlay.meta.js
// ==/UserScript==

var overlayImage = null;
var overlayButton = null;
if (window.top !== window.self) {
    window.addEventListener('load', () => {
        const canvasContainer = document.querySelector("garlic-bread-embed").shadowRoot.querySelector("div.layout").querySelector("garlic-bread-canvas").shadowRoot.querySelector("div.container");
        const canvas = canvasContainer.querySelector("canvas");
        overlayImage = document.createElement("img");
        updateImage();
        overlayImage.style = `position: absolute;left: 0;top: 0;image-rendering: pixelated;pointerEvents: 'none';`;
        canvasContainer.appendChild(overlayImage);
        overlayButton = document.createElement("button");
        overlayButton.style = "position: absolute; top: 28px;left: 80px;border-radius: 0;border: 3px solid black;padding: 4px 10px;height: fit-content;";
        overlayButton.textContent = "Overlay: an";
        overlayButton.addEventListener('click', () => {toggleOverlay();});
        window.document.body.append( overlayButton );

        // get width and height from canvas
        const canvasObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === "attributes") {
                    overlayImage.style.width = mutation.target.getAttribute("width") + "px";
                    overlayImage.style.height = mutation.target.getAttribute("height") + "px";
                }
            });
        });

        canvasObserver.observe(canvas, {
            attributes: true
        });

    }, false);
}

function updateImage() {
    overlayImage.src = "https://bilder.letsi.de/curry-ente.png?" + Date.now()
}

function toggleOverlay() {
    if( overlayImage.style.display == "none" ) {
        overlayImage.style.display = "block";
        overlayButton.textContent = "Overlay: an";
    } else {
        overlayImage.style.display = "none";
        overlayButton.textContent = "Overlay: aus";
    }
}


setInterval(function () {overlayImage.src = "https://bilder.letsi.de/curry-ente.png?" + Date.now()}, 30000);
