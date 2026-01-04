// ==UserScript==
// @name         Drawaria VS Character Drawer Menu
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Pastes various 'VS' themed characters/actions directly onto your Drawaria.online canvas from APIs. (Client-side only)
// @author       YouTubeDrawaria
// @include      https://drawaria.online*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online/room/
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537137/Drawaria%20VS%20Character%20Drawer%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/537137/Drawaria%20VS%20Character%20Drawer%20Menu.meta.js
// ==/UserScript==

(() => {
    'use strict';

    console.log("VS Character Drawer (Direct Canvas Paste): Script starting...");

    const EL = (sel) => document.querySelector(sel);

    let previewCanvas = document.createElement('canvas'); // Used to prepare the image
    let originalCanvas = null; // The game's main canvas

    function addBoxIconsAndFonts() {
        console.log("VS Character Drawer: addBoxIconsAndFonts called");
        // Boxicons
        if (!document.querySelector('link[href="https://unpkg.com/boxicons@2.1.2/css/boxicons.min.css"]')) {
            let boxicons_link = document.createElement('link');
            boxicons_link.href = 'https://unpkg.com/boxicons@2.1.2/css/boxicons.min.css';
            boxicons_link.rel = 'stylesheet';
            document.head.appendChild(boxicons_link);
        }
        // Google Font: Press Start 2P
        if (!document.querySelector('link[href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"]')) {
            let font_link = document.createElement('link');
            font_link.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
            font_link.rel = 'stylesheet';
            document.head.appendChild(font_link);
        }
    }

    function CreateStylesheet() {
        console.log("VS Character Drawer: CreateStylesheet called");
        if (document.getElementById('VsCharacterDrawerStyles')) {
            return;
        }
        let styleElement = document.createElement('style');
        styleElement.id = 'VsCharacterDrawerStyles';
        styleElement.innerHTML = `
            /* VS Character Drawer Styles */
            input[type="number"] { text-align: center; -webkit-appearance: none; -moz-appearance: textfield; }
            .hidden { display: none !important; }

            .vs-drawer-container {
                position: relative; width: 100%; background-color: #333; /* Dark Grey */
                border: 2px solid #F00; /* Red */
                border-radius: 15px; padding: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
                margin-top: 10px; font-family: 'Press Start 2P', cursive; /* Retro Gaming Font */
                color: #FFD700; /* Gold */
                text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
            }
            .vs-drawer-container h3 {
                text-align: center; color: #DC143C; /* Crimson */
                margin-bottom: 10px; display: flex;
                align-items: center; justify-content: center; gap: 8px;
                font-size: 1.2em; /* Slightly larger title */
            }
            .vs-drawer-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; justify-content: center; align-items: center;}
            .vs-drawer-row > * { flex: 1 1 auto; min-width: 80px; text-align: center; }
            .vs-border-input {
                border: 1px solid #DC143C; /* Crimson */
                border-radius: 8px; padding: 5px;
                background-color: #555; /* Darker Grey */
                color: #FFD700; /* Gold */
                font-size: 13px;
                font-family: 'Press Start 2P', cursive;
            }
            .vs-drawer-button {
                background-color: #DC143C; /* Crimson */
                color: white; border: none; border-radius: 10px;
                padding: 10px 15px; font-size: 15px; cursor: pointer; transition: all 0.3s ease;
                box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2); display: flex; align-items: center;
                justify-content: center; gap: 8px;
                font-family: 'Press Start 2P', cursive;
                text-transform: uppercase;
            }
            .vs-drawer-button:hover { background-color: #FFD700; color: #DC143C; transform: translateY(-3px); box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3); }
            .vs-drawer-button:active { transform: translateY(0); box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); }
            .vs-drawer-button:disabled { background-color: #777; color: #BBB; cursor: not-allowed; }

            #vsImageDisplay {
                width: 100%; max-height: 200px; object-fit: contain; border: 1px dashed #DC143C; /* Crimson Dashed */
                border-radius: 10px; margin-bottom: 10px; background-color: #222; /* Even darker for image placeholder */
            }
            #toggleVsDrawer {
                background-color: #DC143C; /* Crimson */
                color: white; border: none; border-radius: 50%;
                width: 45px; height: 45px; font-size: 26px; cursor: pointer; transition: all 0.3s ease;
                box-shadow: 0 3px 6px rgba(0,0,0,0.3); display: flex; align-items: center;
                justify-content: center; margin-left: 8px; z-index: 10001;
            }
            #toggleVsDrawer:hover { background-color: #FFD700; color: #DC143C; transform: rotate(15deg) scale(1.1); }
            #toggleVsDrawer.active { background-color: #FFD700; color: #DC143C; } /* Active color for contrast */
            .vs-category-select {
                border: 1px solid #DC143C; /* Crimson */
                border-radius: 8px; padding: 5px;
                background-color: #555; /* Darker Grey */
                color: #FFD700; /* Gold */
                font-size: 13px; cursor: pointer;
                font-family: 'Press Start 2P', cursive;
            }
            #status_message { font-size: 12px; padding: 3px; margin-top: 5px; flex-basis: 100% !important; text-align: center; color: #FFD700; /* Gold */ }
        `;
        document.head.appendChild(styleElement);
    }

    async function fetchVsImage(category) {
        console.log("VS Character Drawer: fetchVsImage called for", category);
        return new Promise((resolve, reject) => {
            const targetUrl = `https://api.waifu.pics/sfw/${category}`;
            GM_xmlhttpRequest({
                method: "GET", url: targetUrl,
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const result = JSON.parse(response.responseText);
                            if (result && result.url) { resolve(result.url); }
                            else { reject(new Error('API response did not contain a URL.')); }
                        } catch (e) { reject(e); }
                    } else { reject(new Error(`HTTP error! status: ${response.statusText}`)); }
                },
                onerror: function(response) { reject(new Error(`Network error: ${response.statusText || response.error}`)); }
            });
        });
    }

    async function loadImage(url, vsImageDisplayElement) {
        console.log("VS Character Drawer: loadImage called for URL:", url);
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET', url: url, responseType: 'blob',
                onload: function(response) {
                    if (response.status === 200) {
                        var img = new Image();
                        var objectURL = URL.createObjectURL(response.response);
                        img.onload = () => {
                            if (!originalCanvas) {
                                reject(new Error("Main game canvas not found during loadImage.onload.")); return;
                            }
                            // Set previewCanvas dimensions to match the game's canvas
                            previewCanvas.width = originalCanvas.width;
                            previewCanvas.height = originalCanvas.height;

                            var ctx = previewCanvas.getContext('2d');
                            ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height); // Clear before drawing

                            // Calculate dimensions to draw the image centered and scaled to fit onto previewCanvas
                            let imgAspectRatio = img.width / img.height;
                            let canvasAspectRatio = previewCanvas.width / previewCanvas.height;
                            let drawWidth, drawHeight, offsetX_preview, offsetY_preview;

                            if (imgAspectRatio > canvasAspectRatio) {
                                drawWidth = previewCanvas.width;
                                drawHeight = previewCanvas.width / imgAspectRatio;
                                offsetX_preview = 0;
                                offsetY_preview = (previewCanvas.height - drawHeight) / 2;
                            } else {
                                drawHeight = previewCanvas.height;
                                drawWidth = previewCanvas.height * imgAspectRatio;
                                offsetY_preview = 0;
                                offsetX_preview = (previewCanvas.width - drawWidth) / 2;
                            }
                            ctx.drawImage(img, offsetX_preview, offsetY_preview, drawWidth, drawHeight);
                            console.log(`VS Character Drawer: Image drawn to previewCanvas (size ${previewCanvas.width}x${previewCanvas.height})`);
                            if (vsImageDisplayElement) {
                                vsImageDisplayElement.src = objectURL;
                                vsImageDisplayElement.classList.remove('hidden');
                            }
                            resolve(); // Resolve once previewCanvas is ready
                        };
                        img.onerror = (e) => { URL.revokeObjectURL(objectURL); reject(e); };
                        img.src = objectURL;
                    } else { reject(new Error(`Failed to download image: ${response.statusText}`)); }
                },
                onerror: function(response) { reject(new Error(`Network error downloading image: ${response.statusText || response.error}`));}
            });
        });
    }

    function VsCharacterDrawerEngine() {
        console.log("VS Character Drawer: VsCharacterDrawerEngine called.");
        let vsDrawerContainer = document.getElementById('VsCharacterDrawerContainer');
        if (vsDrawerContainer) { return; } // Already initialized
        vsDrawerContainer = document.createElement('div');
        vsDrawerContainer.id = 'VsCharacterDrawerContainer';
        vsDrawerContainer.className = 'vs-drawer-container hidden';
        const chatMessagesElement = document.getElementById('chatbox_messages');
        if (chatMessagesElement) { chatMessagesElement.after(vsDrawerContainer); }
        else { document.body.appendChild(vsDrawerContainer); }

        CreateToggleButton(vsDrawerContainer);
        VsImageControls(vsDrawerContainer);
    }

    function CreateToggleButton(containerToToggle) {
        console.log("VS Character Drawer: CreateToggleButton called.");
        let target = document.getElementById('chatbox_textinput');
        if (!target) { console.error("VS Character Drawer: Chat input for toggle button not found."); return; }
        if (document.getElementById('toggleVsDrawer')) { return; }

        let btncontainer = document.createElement('div');
        btncontainer.className = 'input-group-append';
        let togglebtn = document.createElement('button');
        togglebtn.id = 'toggleVsDrawer';
        togglebtn.innerHTML = '<i class="bx bxs-bolt"></i>'; // Lightning bolt icon
        togglebtn.title = "Toggle VS Character Drawer";
        togglebtn.type = "button";
        togglebtn.addEventListener('click', (e) => {
            e.preventDefault();
            togglebtn.classList.toggle('active');
            if (containerToToggle) { containerToToggle.classList.toggle('hidden'); }
        });
        btncontainer.appendChild(togglebtn);
        target.after(btncontainer);
        console.log("VS Character Drawer: Toggle button added.");
    }

    function VsImageControls(container) {
        console.log("VS Character Drawer: VsImageControls called.");
        let controlsDiv = document.createElement('div');
        controlsDiv.innerHTML = `
            <h3>VS Character Menu <i class='bx bxs-swords'></i></h3> <!-- Crossed swords icon -->
            <img id="vsImageDisplay" src="" alt="VS Image Preview" class="hidden">
            <div class="vs-drawer-row">
                <select id="vsCategorySelect" class="vs-category-select"></select>
                <button id="loadVsBtn" class="vs-drawer-button"><i class='bx bxs-rocket'></i> Load VS Image</button>
            </div>
            <div class="vs-drawer-row">
                 <label for="engine_offset_x" class="vs-border-input" title="Offset X (% of canvas width)">Offset X (%):</label>
                <input type="number" id="engine_offset_x" min="-100" max="100" value="0" class="vs-border-input">
                <label for="engine_offset_y" class="vs-border-input" title="Offset Y (% of canvas height)">Offset Y (%):</label>
                <input type="number" id="engine_offset_y" min="-100" max="100" value="0" class="vs-border-input">
            </div>
            <div class="vs-drawer-row">
                <button id="pasteToCanvasBtn" class="vs-drawer-button"><i class='bx bxs-brush'></i> Paste to Canvas</button>
                <button id="clearPreviewBtn" class="vs-drawer-button" title="Clear the preview image and any pasted image (by drawing white over area)"><i class='bx bx-trash'></i> Clear Preview</button>
            </div>
            <div class="vs-drawer-row">
                 <span id="status_message"></span>
            </div>
        `;
        container.appendChild(controlsDiv);

        const vsImageDisplay = EL('#vsImageDisplay');
        const vsCategorySelect = EL('#vsCategorySelect');
        const loadVsBtn = EL('#loadVsBtn');
        const pasteToCanvasBtn = EL('#pasteToCanvasBtn');
        const clearPreviewBtn = EL('#clearPreviewBtn');
        const statusMessage = EL('#status_message');

        // Categorías de acción/VS de waifu.pics, filtradas
        const categories = [
            'kill', 'kick', 'slap', 'bonk', 'yeet', 'bite', 'bully'
        ];
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1).replace(/_/g, ' '); // Formatear para mejor lectura
            vsCategorySelect.appendChild(option);
        });

        loadVsBtn.addEventListener('click', async () => {
            const category = vsCategorySelect.value;
            loadVsBtn.disabled = true; loadVsBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Loading...';
            statusMessage.textContent = 'Fetching image URL...';
            try {
                const imageUrl = await fetchVsImage(category);
                if (imageUrl) {
                    statusMessage.textContent = 'Image URL fetched. Loading image data...';
                    await loadImage(imageUrl, vsImageDisplay); // loadImage now prepares previewCanvas
                    statusMessage.textContent = 'Image loaded. Ready to paste.';
                } else {
                    statusMessage.textContent = 'Failed to get image URL.';
                }
            } catch (error) {
                console.error('VS Character Drawer: Error in loadVsBtn click:', error);
                statusMessage.textContent = 'Error loading image. See console.';
            } finally {
                loadVsBtn.disabled = false; loadVsBtn.innerHTML = '<i class="bx bxs-rocket"></i> Load VS Image';
            }
        });

        pasteToCanvasBtn.addEventListener('click', () => {
            if (!previewCanvas || previewCanvas.width === 0 || previewCanvas.height === 0) {
                statusMessage.textContent = 'Load an image first to prepare it on the preview canvas.';
                alert('Please load a VS image first!');
                return;
            }
            if (!originalCanvas) {
                 statusMessage.textContent = 'Game canvas not found.';
                 alert('Error: Game canvas not found!');
                 return;
            }

            const gameCtx = originalCanvas.getContext('2d');
            if (!gameCtx) {
                statusMessage.textContent = 'Could not get game canvas context.';
                alert('Error: Could not get game canvas context!');
                return;
            }

            const offsetXPercent = parseFloat(EL('#engine_offset_x').value) || 0;
            const offsetYPercent = parseFloat(EL('#engine_offset_y').value) || 0;

            const dx = (offsetXPercent / 100) * originalCanvas.width;
            const dy = (offsetYPercent / 100) * originalCanvas.height;

            try {
                gameCtx.drawImage(previewCanvas, dx, dy);
                statusMessage.textContent = 'Image pasted to your canvas!';
                console.log(`VS Character Drawer: Pasted previewCanvas to game canvas at ${dx.toFixed(0)}, ${dy.toFixed(0)}`);
            } catch (e) {
                statusMessage.textContent = 'Error pasting image. See console.';
                console.error("VS Character Drawer: Error during gameCtx.drawImage():", e);
                alert("An error occurred while pasting the image. Check console.");
            }
        });

        clearPreviewBtn.addEventListener('click', () => {
            vsImageDisplay.src = '';
            vsImageDisplay.classList.add('hidden');
            if (previewCanvas) {
                const prevCtx = previewCanvas.getContext('2d');
                prevCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
            }
            if(originalCanvas && previewCanvas && previewCanvas.width > 0 && previewCanvas.height > 0){
                const gameCtx = originalCanvas.getContext('2d');
                 const offsetXPercent = parseFloat(EL('#engine_offset_x').value) || 0;
                 const offsetYPercent = parseFloat(EL('#engine_offset_y').value) || 0;
                 const dx = (offsetXPercent / 100) * originalCanvas.width;
                 const dy = (offsetYPercent / 100) * originalCanvas.height;
                gameCtx.fillStyle = 'white'; // Assuming default bg is white
                gameCtx.fillRect(dx, dy, previewCanvas.width, previewCanvas.height); // Draw white over the area
                 statusMessage.textContent = 'Preview cleared and area on canvas whited out.';
            } else {
                 statusMessage.textContent = 'Preview cleared.';
            }
            console.log("VS Character Drawer: Preview cleared.");
        });
    }

    function initializeScript() {
        console.log("VS Character Drawer: initializeScript called.");
        originalCanvas = document.getElementById('canvas'); // Get the game's canvas

        if (!originalCanvas) {
            console.log("VS Character Drawer: Game canvas ('canvas') not found yet. Retrying...");
            setTimeout(initializeScript, 1000); return;
        }
        console.log(`VS Character Drawer: Game canvas found. Dimensions: ${originalCanvas.width}x${originalCanvas.height}`);

        previewCanvas.width = originalCanvas.width; // Initialize with game canvas size
        previewCanvas.height = originalCanvas.height;

        const chatInput = document.getElementById('chatbox_textinput');
        const chatMessages = document.getElementById('chatbox_messages');
        if (!chatInput || !chatMessages) {
            console.log("VS Character Drawer: Chat elements not found yet. Retrying...");
            setTimeout(initializeScript, 1000); return;
        }

        if (!document.getElementById('VsCharacterDrawerContainer')) {
            addBoxIconsAndFonts();
            CreateStylesheet();
            VsCharacterDrawerEngine();
            console.log('VS Character Drawer (Direct Canvas Paste) UI Initialized!');
        }
    }

    if (document.readyState === "complete" || document.readyState === "interactive") {
        initializeScript();
    } else {
        window.addEventListener('DOMContentLoaded', initializeScript);
    }

})();