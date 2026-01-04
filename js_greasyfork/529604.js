// ==UserScript==
// @name         SmartFrame Downloader
// @namespace    hoixw
// @version      2.0
// @description  Allows for the download of SmartFrame images, using a TamperMonkey script
// @author       hoixw
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529604/SmartFrame%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/529604/SmartFrame%20Downloader.meta.js
// ==/UserScript==

// Stores reference to shadow root so that we can access it later
let smartFrameShadowRoot = null;
const nativeAttachShadow = Element.prototype.attachShadow;
Element.prototype.attachShadow = function(init) {
    const shadowRoot = nativeAttachShadow.call(this, init);
    if (this.tagName.toLowerCase() === 'smartframe-embed') {
        smartFrameShadowRoot = shadowRoot;
    }
    return shadowRoot;
};

// Wait for the page to load completely (otherwise smart-frame won't exist)
window.addEventListener('load', () => {
    const smartFrame = document.querySelector('smartframe-embed');

    // Proceed only if a SmartFrame embed exists on the page.
    if (smartFrame) {
        const executeButton = document.createElement('button');
        executeButton.textContent = 'Download Hi-Res';

        // Apply the original styling to the button.
        Object.assign(executeButton.style, {
            padding: '10px 20px',
            backgroundColor: '#007BFF',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            margin: '10px',
            position: 'relative',
        });

        executeButton.addEventListener('click', () => {
            // Actual width and height of image are stored here
            const width = smartFrame.style.getPropertyValue('--sf-original-width');
            const height = smartFrame.style.getPropertyValue('--sf-original-height');
            
            // Correct width and height variables
            smartFrame.style.width = width + "px";
            smartFrame.style.maxWidth = width + "px";
            smartFrame.style.height = height + "px";
            smartFrame.style.maxHeight = height + "px";

            setTimeout(() => {
                if (smartFrameShadowRoot) {
                    var stage = smartFrameShadowRoot.querySelector("canvas.stage");
                    var url = document.createElement("canvas").toDataURL.call(stage);
                    var t = smartFrame.getAttribute("image-id").replace(/\s/g, '-') + ".png";
                    var a = document.createElement("a");
                    a.href = url;
                    a.download = t;
                    a.click();
                } else {
                    console.error("smartFrameShadowRoot not available");
                }
            }, 1000);
        });
        
        if (smartFrame.parentElement) {
            smartFrame.parentElement.appendChild(executeButton);
        }
    }
});