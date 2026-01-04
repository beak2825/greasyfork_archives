// ==UserScript==
// @name         image color viewer
// @namespace    github.com/annaprojects
// @version      1.7
// @description  Adds context menu options and shortcuts to view images with white/black/grey backgrounds. Includes "All" side-by-side option in new tab.
// @author       AnnaRoblox
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/541707/image%20color%20viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/541707/image%20color%20viewer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let imageUrl = null;
    let currentImageElement = null;

    const WRAPPER_CLASS = 'gm-image-bg-wrapper';
    const DUAL_WRAPPER_CLASS = 'gm-image-bg-dual-container';

    /**
     * Context menu tracking
     */
    document.addEventListener('contextmenu', function(e) {
        if (e.target.tagName === 'IMG') {
            imageUrl = e.target.src;
            currentImageElement = e.target;
        } else {
            imageUrl = null;
            currentImageElement = null;
        }
    }, true);

    /**
     * Click shortcut handling
     */
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'IMG') {
            const imageElement = e.target;
            let handled = false;

            // Ctrl + Alt + Click: Multi View (Black, White, Grey)
            if (e.ctrlKey && e.altKey) {
                setMultiBackground(imageElement);
                handled = true;
            }
            // Ctrl + Shift + Click: Set background to White
            else if (e.ctrlKey && e.shiftKey) {
                setImageBackground(imageElement, 'white');
                handled = true;
            }
            // Alt + Shift + Click: Set background to Black
            else if (e.altKey && e.shiftKey) {
                setImageBackground(imageElement, 'black');
                handled = true;
            }
            // Alt + Click: Toggle background between Black, White, and Grey
            else if (e.altKey && !e.shiftKey) {
                const parent = imageElement.parentNode;
                let currentBgColor = '';

                if (parent && parent.classList && parent.classList.contains(WRAPPER_CLASS)) {
                    currentBgColor = parent.style.backgroundColor;
                }

                // Cycle: Black -> White -> Grey -> Black (Matching the 'All' layout order)
                if (currentBgColor === 'black') {
                    setImageBackground(imageElement, 'white');
                } else if (currentBgColor === 'white') {
                    setImageBackground(imageElement, 'rgb(128, 128, 128)');
                } else {
                    setImageBackground(imageElement, 'black');
                }
                handled = true;
            }

            if (handled) {
                e.preventDefault();
                e.stopImmediatePropagation();
            }
        }
    }, true);

    /**
     * Menu Commands
     */
    GM_registerMenuCommand("View Image in New Tab", () => imageUrl && openImageViewer(imageUrl, 'white'));
    GM_registerMenuCommand("Set Image BG (White)", () => currentImageElement && setImageBackground(currentImageElement, 'white'));
    GM_registerMenuCommand("Set Image BG (Black)", () => currentImageElement && setImageBackground(currentImageElement, 'black'));
    GM_registerMenuCommand("Set Image BG (Grey)", () => currentImageElement && setImageBackground(currentImageElement, 'rgb(128, 128, 128)'));
    GM_registerMenuCommand("Set Image BG (Transparent)", () => currentImageElement && setImageBackground(currentImageElement, 'transparent'));
    GM_registerMenuCommand("Reset Image BG", () => currentImageElement && resetImageBackground(currentImageElement));

    /**
     * Multi-view logic (Current Page)
     */
    function setMultiBackground(imageElement) {
        if (imageElement.parentNode.classList.contains(WRAPPER_CLASS)) {
            resetImageBackground(imageElement);
        }

        const parent = imageElement.parentNode;
        const dualContainer = document.createElement('div');
        dualContainer.classList.add(DUAL_WRAPPER_CLASS);

        dualContainer.style.cssText = `
            display: inline-flex !important;
            flex-direction: row;
            gap: 15px;
            padding: 10px;
            background-color: #222;
            border-radius: 8px;
            vertical-align: middle;
            position: relative;
            z-index: 9999;
        `;

        const createSubWrapper = (color) => {
            const w = document.createElement('div');
            w.classList.add(WRAPPER_CLASS);
            w.style.cssText = `display: inline-block; line-height: 0; background-color: ${color}; padding: 0; margin: 0; flex: 0 0 auto;`;
            return w;
        };

        const blackWrapper = createSubWrapper('black');
        const whiteWrapper = createSubWrapper('white');
        const greyWrapper = createSubWrapper('rgb(128, 128, 128)');

        const clone1 = imageElement.cloneNode(true);
        const clone2 = imageElement.cloneNode(true);

        parent.insertBefore(dualContainer, imageElement);
        blackWrapper.appendChild(imageElement);
        whiteWrapper.appendChild(clone1);
        greyWrapper.appendChild(clone2);

        dualContainer.appendChild(blackWrapper);
        dualContainer.appendChild(whiteWrapper);
        dualContainer.appendChild(greyWrapper);

        [imageElement, clone1, clone2].forEach(img => {
            img.style.cssText = "max-width: none; max-height: none; display: block; position: static; visibility: visible; opacity: 1;";
        });
    }

    /**
     * Single background logic (Current Page)
     */
    function setImageBackground(imageElement, bgColor) {
        const parent = imageElement.parentNode;
        if (parent.classList.contains(WRAPPER_CLASS) && parent.parentNode.classList.contains(DUAL_WRAPPER_CLASS)) {
            resetImageBackground(imageElement);
        }

        const currentParent = imageElement.parentNode;
        let wrapper = null;

        if (currentParent && currentParent.classList && currentParent.classList.contains(WRAPPER_CLASS)) {
            wrapper = currentParent;
        } else {
            wrapper = document.createElement('div');
            wrapper.classList.add(WRAPPER_CLASS);
            wrapper.style.cssText = "display: inline-block; line-height: 0; vertical-align: middle; transition: background-color 0.3s ease;";
            currentParent.insertBefore(wrapper, imageElement);
            wrapper.appendChild(imageElement);
        }

        if (bgColor === 'transparent') {
            wrapper.style.backgroundImage = 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)';
            wrapper.style.backgroundSize = '20px 20px';
            wrapper.style.backgroundColor = '';
        } else {
            wrapper.style.backgroundImage = 'none';
            wrapper.style.backgroundColor = bgColor;
        }

        imageElement.style.maxWidth = 'none';
        imageElement.style.maxHeight = 'none';
        imageElement.style.position = 'static';
    }

    /**
     * Restoration logic
     */
    function resetImageBackground(imageElement) {
        let parent = imageElement.parentNode;
        if (parent.classList.contains(WRAPPER_CLASS) && parent.parentNode.classList.contains(DUAL_WRAPPER_CLASS)) {
            const dualContainer = parent.parentNode;
            dualContainer.parentNode.insertBefore(imageElement, dualContainer);
            dualContainer.parentNode.removeChild(dualContainer);
        }
        else if (parent && parent.classList && parent.classList.contains(WRAPPER_CLASS)) {
            parent.parentNode.insertBefore(imageElement, parent);
            parent.parentNode.removeChild(parent);
        }
        imageElement.style.maxWidth = '';
        imageElement.style.maxHeight = '';
        imageElement.style.position = '';
    }

    /**
     * External Tab Viewer
     */
    function openImageViewer(url, initialBgColor) {
        const imageViewerHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Image Viewer - Pro Mode</title>
                <style>
                    body {
                        background-color: ${initialBgColor};
                        margin: 0;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                        transition: background-color 0.3s ease;
                        font-family: sans-serif;
                        overflow: auto;
                    }
                    .controls {
                        position: fixed;
                        top: 20px;
                        background: rgba(255, 255, 255, 0.95);
                        padding: 12px 20px;
                        border-radius: 12px;
                        display: flex;
                        gap: 12px;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                        z-index: 100;
                    }
                    button {
                        cursor: pointer;
                        padding: 8px 16px;
                        border: 1px solid #ccc;
                        border-radius: 6px;
                        background: white;
                        font-weight: bold;
                        transition: all 0.2s;
                    }
                    button:hover { background: #f0f0f0; border-color: #999; }
                    button.active { background: #007bff; color: white; border-color: #0056b3; }

                    #viewContainer {
                        margin-top: 80px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }

                    /* Multi Layout Styles */
                    .multi-layout {
                        display: flex;
                        gap: 20px;
                        padding: 20px;
                        background: #111;
                        border-radius: 10px;
                    }
                    .img-wrap { line-height: 0; }
                    .multi-layout img { max-width: 30vw; height: auto; }

                    /* Single View Styles */
                    .single-view img {
                        max-width: 90vw;
                        height: auto;
                        box-shadow: 0 0 30px rgba(0,0,0,0.2);
                    }
                </style>
            </head>
            <body>
                <div class="controls">
                    <button id="btn-white" onclick="setView('white')">White</button>
                    <button id="btn-black" onclick="setView('black')">Black</button>
                    <button id="btn-grey" onclick="setView('grey')">Grey</button>
                    <button id="btn-trans" onclick="setView('transparent')">Transparent</button>
                    <button id="btn-all" onclick="setView('all')">All</button>
                </div>

                <div id="viewContainer" class="single-view">
                    <img src="${url}" id="mainImg">
                </div>

                <script>
                    const url = "${url}";
                    const container = document.getElementById('viewContainer');

                    function setView(mode) {
                        document.querySelectorAll('button').forEach(b => b.classList.remove('active'));
                        document.getElementById('btn-' + mode.substring(0,5)).classList.add('active');

                        if (mode === 'all') {
                            document.body.style.backgroundColor = '#222';
                            document.body.style.backgroundImage = 'none';
                            container.className = '';
                            container.innerHTML = \`
                                <div class="multi-layout">
                                    <div class="img-wrap" style="background: black;"><img src="\${url}"></div>
                                    <div class="img-wrap" style="background: white;"><img src="\${url}"></div>
                                    <div class="img-wrap" style="background: rgb(128,128,128);"><img src="\${url}"></div>
                                </div>
                            \`;
                        } else {
                            container.className = 'single-view';
                            container.innerHTML = \`<img src="\${url}">\`;

                            const b = document.body;
                            if (mode === 'transparent') {
                                b.style.backgroundImage = 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)';
                                b.style.backgroundSize = '20px 20px';
                                b.style.backgroundColor = '';
                            } else {
                                b.style.backgroundImage = 'none';
                                b.style.backgroundColor = (mode === 'grey' ? 'rgb(128,128,128)' : mode);
                            }
                        }
                    }

                    document.getElementById('btn-white').classList.add('active');
                <\/script>
            </body>
            </html>
        `;

        const blob = new Blob([imageViewerHTML], { type: 'text/html' });
        const blobURL = URL.createObjectURL(blob);
        GM_openInTab(blobURL, { active: true });
        setTimeout(() => URL.revokeObjectURL(blobURL), 1000);
    }

})();
