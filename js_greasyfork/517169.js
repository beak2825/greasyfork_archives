// ==UserScript==
// @name         Video Tweaker
// @namespace    https://greasyfork.org/en/users/781396-yad
// @version      1.0
// @description  Adds more settings to a video
// @author       YAD
// @license      MIT
// @icon         https://avatarfiles.alphacoders.com/344/34421.gif
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517169/Video%20Tweaker.user.js
// @updateURL https://update.greasyfork.org/scripts/517169/Video%20Tweaker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a TrustedHTML policy
    const trustedTypes = window.trustedTypes;
    const policy = trustedTypes.createPolicy('trusted-html', {
        createHTML: (string) => string
    });

    // Inject CSS for modal and sliders
    const style = document.createElement('style');
    style.textContent = `
    #videoTweakerModal {
        all: revert;
        position: fixed !important;
        top: 50% !important;
        left: 50% !important;
        transform: translate(-50%, -50%) !important;
        padding: 10px !important;
        background-color: #222 !important;
        color: #fff !important;
        border-radius: 3px;
        box-shadow: 0 0 10px rgba(0,0,0,0.5) !important;
        z-index: 9999 !important;
        font-family: Arial, sans-serif !important;
    }
    #videoTweakerModal h2 {
        margin: 2px !important;
    }
    #videoTweakerModal label {
        display: block !important;
        margin: 0px !important;
    }
    #videoTweakerModal input[type="range"] {
        width: 100% !important;
        margin: 4px 0 4px !important;
        -webkit-appearance: none !important;
        background: #444 !important;
        outline: none !important;
        height: 8px !important;
        border-radius: 5px !important;
    }
    #videoTweakerModal input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none !important;
        width: 15px !important;
        height: 15px !important;
        background: #007BFF !important;
        cursor: pointer !important;
        border-radius: 50% !important;
    }
    #videoTweakerModal button {
        display: inline-block !important;
        margin: 5px 5px 0 0 !important;
        padding: 5px 10px !important;
        background-color: #007BFF !important;
        color: #fff !important;
        border: none !important;
        cursor: pointer !important;
    }
    video {
        transition: 0.5s !important;
    }
    `;
    document.head.appendChild(style);

    // Function to apply video styles
    function applyVideoStyles() {
        const videos = document.querySelectorAll('video');
        const saturation = document.getElementById('saturation').value;
        const brightness = document.getElementById('brightness').value;
        const contrast = document.getElementById('contrast').value;
        const sepia = document.getElementById('sepia').value;
        const blur = document.getElementById('blur').value;
        const rotate = document.getElementById('rotate').value;
        const scaleX = document.getElementById('scaleX').value;
        const scaleY = document.getElementById('scaleY').value;
        const flip = document.getElementById('flip').checked;

        videos.forEach(video => {
            video.style.filter = `
                saturate(${saturation}%)
                brightness(${brightness}%)
                contrast(${contrast}%)
                sepia(${sepia}%)
                blur(${blur}px)
            `;
            video.style.transform = `
                rotate(${rotate}deg)
                scaleX(${flip ? -scaleX : scaleX})
                scaleY(${scaleY})
            `;
        });
    }

    // Function to create the modal
    function createModal() {
        const modal = document.createElement('div');
        modal.id = 'videoTweakerModal';

        modal.innerHTML = policy.createHTML(`
            <h2>Video Tweaker Settings</h2>
            <label for="saturation">Saturation: </label>
            <input type="range" id="saturation" name="saturation" min="1" max="500" value="100" oninput="applyVideoStyles()"><br>
            <label for="brightness">Brightness: </label>
            <input type="range" id="brightness" name="brightness" min="1" max="500" value="100" oninput="applyVideoStyles()"><br>
            <label for="contrast">Contrast: </label>
            <input type="range" id="contrast" name="contrast" min="1" max="500" value="100" oninput="applyVideoStyles()"><br>
            <label for="sepia">Sepia: </label>
            <input type="range" id="sepia" name="sepia" min="0" max="200" value="0" oninput="applyVideoStyles()"><br>
            <label for="blur">Blur: </label>
            <input type="range" id="blur" name="blur" min="0" max="50" value="0" oninput="applyVideoStyles()"><br>
            <label for="rotate">Rotate: </label>
            <input type="range" id="rotate" name="rotate" min="0" max="360" value="0" oninput="applyVideoStyles()"><br>
            <label for="scaleX">Scale X: </label>
            <input type="range" id="scaleX" name="scaleX" min="0.1" max="3" value="1" step="0.1" oninput="applyVideoStyles()"><br>
            <label for="scaleY">Scale Y: </label>
            <input type="range" id="scaleY" name="scaleY" min="0.1" max="3" value="1" step="0.1" oninput="applyVideoStyles()"><br>
            <label for="flip">Flip: </label>
            <input type="checkbox" id="flip" name="flip" oninput="applyVideoStyles()"><br>
            <button id="resetSettings">Reset</button>
            <button id="closeModal">Close</button>
        `);

        document.body.appendChild(modal);

        document.getElementById('closeModal').addEventListener('click', () => {
            modal.style.display = 'none';
        });

        document.getElementById('resetSettings').addEventListener('click', () => {
            document.getElementById('saturation').value = 100;
            document.getElementById('brightness').value = 100;
            document.getElementById('contrast').value = 100;
            document.getElementById('sepia').value = 0;
            document.getElementById('blur').value = 0;
            document.getElementById('rotate').value = 0;
            document.getElementById('scaleX').value = 1;
            document.getElementById('scaleY').value = 1;
            document.getElementById('flip').checked = false;
            applyVideoStyles();
        });
    }

    // Event listener for Ctrl + Shift + Y
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.shiftKey && event.key === 'Y') {
            event.preventDefault();
            console.log('Ctrl+Shift+M pressed');
            const modal = document.getElementById('videoTweakerModal');
            if (modal) {
                modal.style.display = 'block';
            } else {
                createModal();
            }
        }
    });


    window.applyVideoStyles = applyVideoStyles;

    console.log('Userscript loaded');
})();
