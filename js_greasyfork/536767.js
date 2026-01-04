// ==UserScript==
// @name         Drawaria Anime Drawer Menu
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Pastes anime characters directly onto your Drawaria.online canvas from APIs. (Client-side only)
// @author       YouTubeDrawaria
// @include      https://drawaria.online*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online/room/
// @grant        GM_xmlhttpRequest
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536767/Drawaria%20Anime%20Drawer%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/536767/Drawaria%20Anime%20Drawer%20Menu.meta.js
// ==/UserScript==

(() => {
    'use strict';

    console.log("Anime Bot Drawer (Direct Canvas Paste): Script starting...");

    const EL = (sel) => document.querySelector(sel);

    // No longer need drawing_active or pixelDrawQueue for this method
    let previewCanvas = document.createElement('canvas'); // Used to prepare the image
    let originalCanvas = null; // The game's main canvas
    // data from previewCanvas (pixel data) is no longer directly used for drawing, but loadImage still prepares it.
    // cw, ch will be dimensions of previewCanvas, matching originalCanvas.

    // WebSocket interception is no longer strictly needed for drawing, but can be kept for other potential features
    // or if the game relies on it for other script interactions. For now, let's keep it minimal.
    // window.sockets = [];
    // const originalSend = WebSocket.prototype.send;
    // WebSocket.prototype.send = function (...args) {
    //     if (window.sockets.indexOf(this) === -1) {
    //         window.sockets.push(this);
    //     }
    //     return originalSend.call(this, ...args);
    // };

    function addBoxIcons() {
        console.log("Anime Bot Drawer: addBoxIcons called");
        if (document.querySelector('link[href="https://unpkg.com/boxicons@2.1.2/css/boxicons.min.css"]')) {
            return;
        }
        let boxicons_link = document.createElement('link');
        boxicons_link.href = 'https://unpkg.com/boxicons@2.1.2/css/boxicons.min.css';
        boxicons_link.rel = 'stylesheet';
        document.head.appendChild(boxicons_link);
    }

    function CreateStylesheet() {
        console.log("Anime Bot Drawer: CreateStylesheet called");
        if (document.getElementById('AnimeBotDrawerStyles')) {
            return;
        }
        let styleElement = document.createElement('style');
        styleElement.id = 'AnimeBotDrawerStyles';
        styleElement.innerHTML = `
            input[type="number"] { text-align: center; -webkit-appearance: none; -moz-appearance: textfield; }
            .hidden { display: none !important; }
            .anime-drawer-container {
                position: relative; width: 100%; background-color: #ffe0f0; border: 2px solid #ff69b4;
                border-radius: 15px; padding: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                margin-top: 10px; font-family: 'Comic Sans MS', 'Chalkboard SE', cursive; color: #8a2be2;
            }
            .anime-drawer-container h3 {
                text-align: center; color: #c71585; margin-bottom: 10px; display: flex;
                align-items: center; justify-content: center; gap: 8px;
            }
            .anime-drawer-row { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 5px; justify-content: center; align-items: center;}
            .anime-drawer-row > * { flex: 1 1 auto; min-width: 80px; text-align: center; }
            .anime-border-input {
                border: 1px solid #ffb6c1; border-radius: 8px; padding: 5px;
                background-color: #fff0f5; color: #da70d6; font-size: 14px;
            }
            .anime-drawer-button {
                background-color: #ffc0cb; color: white; border: none; border-radius: 10px;
                padding: 8px 12px; font-size: 16px; cursor: pointer; transition: all 0.3s ease;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); display: flex; align-items: center;
                justify-content: center; gap: 5px;
            }
            .anime-drawer-button:hover { background-color: #ff69b4; transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); }
            .anime-drawer-button:active { transform: translateY(0); box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1); }
            .anime-drawer-button:disabled { background-color: #f8bbd0; cursor: not-allowed; }
            #animeImageDisplay {
                width: 100%; max-height: 200px; object-fit: contain; border: 1px dashed #ff69b4;
                border-radius: 10px; margin-bottom: 10px; background-color: #fce4ec;
            }
            #toggleAnimeDrawer {
                background-color: #a767f0; color: white; border: none; border-radius: 50%;
                width: 40px; height: 40px; font-size: 24px; cursor: pointer; transition: all 0.3s ease;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2); display: flex; align-items: center;
                justify-content: center; margin-left: 5px; z-index: 10001;
            }
            #toggleAnimeDrawer:hover { background-color: #7d3fbf; transform: rotate(15deg) scale(1.1); }
            #toggleAnimeDrawer.active { background-color: #ff69b4; }
            .anime-category-select {
                border: 1px solid #ffb6c1; border-radius: 8px; padding: 5px;
                background-color: #fff0f5; color: #da70d6; font-size: 14px; cursor: pointer;
            }
            #status_message { font-size: 12px; padding: 3px; margin-top: 5px; flex-basis: 100% !important; text-align: center; color: #c71585; }
        `;
        document.head.appendChild(styleElement);
    }

    async function fetchAnimeImage(category) { // Same as before
        console.log("Anime Bot Drawer: fetchAnimeImage called for", category);
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

    async function loadImage(url, animeImageDisplayElement) { // Same as before, prepares previewCanvas
        console.log("Anime Bot Drawer: loadImage called for URL:", url);
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
                            console.log(`Anime Bot Drawer: Image drawn to previewCanvas (size ${previewCanvas.width}x${previewCanvas.height})`);
                            if (animeImageDisplayElement) {
                                animeImageDisplayElement.src = objectURL;
                                animeImageDisplayElement.classList.remove('hidden');
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

    function AnimeBotDrawerEngine() {
        console.log("Anime Bot Drawer: AnimeBotDrawerEngine called.");
        let animeDrawerContainer = document.getElementById('AnimeBotDrawerContainer');
        if (animeDrawerContainer) { return; } // Already initialized
        animeDrawerContainer = document.createElement('div');
        animeDrawerContainer.id = 'AnimeBotDrawerContainer';
        animeDrawerContainer.className = 'anime-drawer-container hidden';
        const chatMessagesElement = document.getElementById('chatbox_messages');
        if (chatMessagesElement) { chatMessagesElement.after(animeDrawerContainer); }
        else { document.body.appendChild(animeDrawerContainer); }

        CreateToggleButton(animeDrawerContainer);
        AnimeImageControls(animeDrawerContainer);
    }

    function CreateToggleButton(containerToToggle) { // Same as before
        console.log("Anime Bot Drawer: CreateToggleButton called.");
        let target = document.getElementById('chatbox_textinput');
        if (!target) { console.error("Anime Bot Drawer: Chat input for toggle button not found."); return; }
        if (document.getElementById('toggleAnimeDrawer')) { return; }

        let btncontainer = document.createElement('div');
        btncontainer.className = 'input-group-append';
        let togglebtn = document.createElement('button');
        togglebtn.id = 'toggleAnimeDrawer';
        togglebtn.innerHTML = '<i class="bx bxs-paint"></i>';
        togglebtn.title = "Toggle Anime Drawer";
        togglebtn.type = "button";
        togglebtn.addEventListener('click', (e) => {
            e.preventDefault();
            togglebtn.classList.toggle('active');
            if (containerToToggle) { containerToToggle.classList.toggle('hidden'); }
        });
        btncontainer.appendChild(togglebtn);
        target.after(btncontainer);
        console.log("Anime Bot Drawer: Toggle button added.");
    }

    function AnimeImageControls(container) {
        console.log("Anime Bot Drawer: AnimeImageControls called.");
        let controlsDiv = document.createElement('div');
        controlsDiv.innerHTML = `
            <h3>Anime Drawer Menu <i class='bx bxs-heart'></i></h3>
            <img id="animeImageDisplay" src="" alt="Anime Image Preview" class="hidden">
            <div class="anime-drawer-row">
                <select id="animeCategorySelect" class="anime-category-select"></select>
                <button id="loadAnimeBtn" class="anime-drawer-button"><i class='bx bxs-image-add'></i> Load Anime</button>
            </div>
            <div class="anime-drawer-row">
                 <label for="engine_offset_x" class="anime-border-input" title="Offset X (% of canvas width)">Offset X (%):</label>
                <input type="number" id="engine_offset_x" min="-100" max="100" value="0" class="anime-border-input">
                <label for="engine_offset_y" class="anime-border-input" title="Offset Y (% of canvas height)">Offset Y (%):</label>
                <input type="number" id="engine_offset_y" min="-100" max="100" value="0" class="anime-border-input">
            </div>
            <div class="anime-drawer-row">
                <button id="pasteToCanvasBtn" class="anime-drawer-button"><i class='bx bxs-image'></i> Paste to Canvas</button>
                <button id="clearPreviewBtn" class="anime-drawer-button" title="Clear the preview image and any pasted image (by drawing white over area)"><i class='bx bx-eraser'></i> Clear Preview</button>
            </div>
            <div class="anime-drawer-row">
                 <span id="status_message"></span>
            </div>
        `;
        container.appendChild(controlsDiv);

        const animeImageDisplay = EL('#animeImageDisplay');
        const animeCategorySelect = EL('#animeCategorySelect');
        const loadAnimeBtn = EL('#loadAnimeBtn');
        const pasteToCanvasBtn = EL('#pasteToCanvasBtn');
        const clearPreviewBtn = EL('#clearPreviewBtn');
        const statusMessage = EL('#status_message');

        const categories = [ /* ... same categories ... */
            'waifu', 'neko', 'shinobu', 'megumin', 'bully', 'cuddle', 'cry',
            'hug', 'awoo', 'kiss', 'lick', 'pat', 'smug', 'bonk', 'yeet',
            'blush', 'smile', 'wave', 'highfive', 'handhold', 'nom', 'bite',
            'glomp', 'slap', 'kill', 'kick', 'happy', 'wink', 'poke', 'dance', 'cringe'
        ];
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
            animeCategorySelect.appendChild(option);
        });

        loadAnimeBtn.addEventListener('click', async () => {
            const category = animeCategorySelect.value;
            loadAnimeBtn.disabled = true; loadAnimeBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Loading...';
            statusMessage.textContent = 'Fetching image URL...';
            try {
                const imageUrl = await fetchAnimeImage(category);
                if (imageUrl) {
                    statusMessage.textContent = 'Image URL fetched. Loading image data...';
                    await loadImage(imageUrl, animeImageDisplay); // loadImage now prepares previewCanvas
                    statusMessage.textContent = 'Image loaded. Ready to paste.';
                } else {
                    statusMessage.textContent = 'Failed to get image URL.';
                }
            } catch (error) {
                console.error('Anime Bot Drawer: Error in loadAnimeBtn click:', error);
                statusMessage.textContent = 'Error loading image. See console.';
            } finally {
                loadAnimeBtn.disabled = false; loadAnimeBtn.innerHTML = '<i class="bx bxs-image-add"></i> Load Anime';
            }
        });

        pasteToCanvasBtn.addEventListener('click', () => {
            if (!previewCanvas || previewCanvas.width === 0 || previewCanvas.height === 0) {
                statusMessage.textContent = 'Load an image first to prepare it on the preview canvas.';
                alert('Please load an anime image first!');
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
                // previewCanvas already contains the scaled and centered image matching originalCanvas dimensions
                gameCtx.drawImage(previewCanvas, dx, dy);
                statusMessage.textContent = 'Image pasted to your canvas!';
                console.log(`Anime Bot Drawer: Pasted previewCanvas to game canvas at ${dx.toFixed(0)}, ${dy.toFixed(0)}`);
            } catch (e) {
                statusMessage.textContent = 'Error pasting image. See console.';
                console.error("Anime Bot Drawer: Error during gameCtx.drawImage():", e);
                alert("An error occurred while pasting the image. Check console.");
            }
        });

        clearPreviewBtn.addEventListener('click', () => {
            animeImageDisplay.src = '';
            animeImageDisplay.classList.add('hidden');
            if (previewCanvas) {
                const prevCtx = previewCanvas.getContext('2d');
                prevCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
            }
            // Optionally, attempt to clear the area on the main canvas
            // This is imperfect as it just draws white.
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
            console.log("Anime Bot Drawer: Preview cleared.");
        });
    }


    function initializeScript() {
        console.log("Anime Bot Drawer: initializeScript called.");
        originalCanvas = document.getElementById('canvas'); // Get the game's canvas

        if (!originalCanvas) {
            console.log("Anime Bot Drawer: Game canvas ('canvas') not found yet. Retrying...");
            setTimeout(initializeScript, 1000); return;
        }
        console.log(`Anime Bot Drawer: Game canvas found. Dimensions: ${originalCanvas.width}x${originalCanvas.height}`);

        // Ensure previewCanvas is set up, though its dimensions will be set relative to originalCanvas in loadImage
        previewCanvas.width = originalCanvas.width; // Initialize with game canvas size
        previewCanvas.height = originalCanvas.height;


        const chatInput = document.getElementById('chatbox_textinput');
        const chatMessages = document.getElementById('chatbox_messages');
        if (!chatInput || !chatMessages) {
            console.log("Anime Bot Drawer: Chat elements not found yet. Retrying...");
            setTimeout(initializeScript, 1000); return;
        }

        if (!document.getElementById('AnimeBotDrawerContainer')) {
            addBoxIcons();
            CreateStylesheet();
            AnimeBotDrawerEngine();
            console.log('Anime Bot Drawer (Direct Canvas Paste) UI Initialized!');
        }
    }

    if (document.readyState === "complete" || document.readyState === "interactive") {
        initializeScript();
    } else {
        window.addEventListener('DOMContentLoaded', initializeScript);
    }

})();