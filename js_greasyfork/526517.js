// ==UserScript==
// @name         TagPro Custom Map Tiles (Anchored PIXI Overlay & Editor)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Uses a sprite sheet from Imgur and a combined grid data object (with gridTiles, gridLines, and an optional imgurLink) to draw custom tiles and lines on the TagPro map background. Also adds a homepage modal editor for adding and removing maps.
// @author
// @match        https://tagpro.koalabeast.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526517/TagPro%20Custom%20Map%20Tiles%20%28Anchored%20PIXI%20Overlay%20%20Editor%29.user.js
// @updateURL https://update.greasyfork.org/scripts/526517/TagPro%20Custom%20Map%20Tiles%20%28Anchored%20PIXI%20Overlay%20%20Editor%29.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Run once TagPro is ready.
    tagpro.ready(function() {

        ////////////////////////////////
        // Setup Combined Grid Data
        ////////////////////////////////

        var defaultCombinedGridData = [
            {
                "Asida": {
                    "gridLines": [
                        { "start": { "x": 16.5, "y": 17.5 }, "end": { "x": 6, "y": 9.75 }, "color": "red" },
                        { "start": { "x": 6, "y": 9.75 },   "end": { "x": 6.75, "y": 9 },   "color": "red" },
                        { "start": { "x": 6.75, "y": 9 },     "end": { "x": 6.75, "y": 9.5 }, "color": "red" },
                        { "start": { "x": 6.75, "y": 9 },     "end": { "x": 6.25, "y": 9 },   "color": "red" },
                        { "start": { "x": 16.5, "y": 17.5 },  "end": { "x": 16.25, "y": 17.25 }, "color": "red" },
                        { "start": { "x": 16.5, "y": 17.5 },  "end": { "x": 11, "y": 6 },     "color": "#f79999" },
                        { "start": { "x": 11, "y": 6.25 },    "end": { "x": 10.75, "y": 7 },  "color": "#f79999" },
                        { "start": { "x": 11, "y": 6 },       "end": { "x": 12, "y": 6.5 },   "color": "#f79999" },
                        { "start": { "x": 20.25, "y": 9.25 }, "end": { "x": 30.75, "y": 16.75 }, "color": "blue" },
                        { "start": { "x": 30.75, "y": 16.75 }, "end": { "x": 31, "y": 17 },     "color": "blue" },
                        { "start": { "x": 30.75, "y": 17.25 }, "end": { "x": 30, "y": 18 },     "color": "blue" },
                        { "start": { "x": 30, "y": 18 },      "end": { "x": 30.5, "y": 18 },   "color": "blue" },
                        { "start": { "x": 30, "y": 17.75 },   "end": { "x": 30, "y": 17.75 },  "color": "blue" },
                        { "start": { "x": 30, "y": 18 },      "end": { "x": 30, "y": 17.5 },   "color": "blue" },
                        { "start": { "x": 20.25, "y": 9.25 }, "end": { "x": 20.25, "y": 9.25 }, "color": "#99c1f1" },
                        { "start": { "x": 20.25, "y": 9.25 }, "end": { "x": 20.25, "y": 9.25 }, "color": "#99c1f1" },
                        { "start": { "x": 20.25, "y": 9.25 }, "end": { "x": 26, "y": 21 },     "color": "#99c1f1" },
                        { "start": { "x": 26, "y": 21 },      "end": { "x": 26, "y": 20.25 },  "color": "#99c1f1" },
                        { "start": { "x": 26, "y": 21 },      "end": { "x": 25.25, "y": 20.5 }, "color": "#99c1f1" }
                    ],
                    "gridTiles": [
                        { "x": 18, "y": 13, "tileIndex": 0 },
                        { "x": 16, "y": 12, "tileIndex": 0 },
                        { "x": 17, "y": 15, "tileIndex": 0 },
                        { "x": 20, "y": 14, "tileIndex": 0 },
                        { "x": 20, "y": 12, "tileIndex": 0 },
                        { "x": 18, "y": 14, "tileIndex": 1 },
                        { "x": 17, "y": 12, "tileIndex": 1 },
                        { "x": 19, "y": 12, "tileIndex": 1 },
                        { "x": 20, "y": 13, "tileIndex": 1 },
                        { "x": 20, "y": 15, "tileIndex": 1 },
                        { "x": 16, "y": 15, "tileIndex": 1 },
                        { "x": 19, "y": 14, "tileIndex": 2 },
                        { "x": 17, "y": 14, "tileIndex": 2 },
                        { "x": 18, "y": 12, "tileIndex": 2 },
                        { "x": 19, "y": 13, "tileIndex": 3 },
                        { "x": 17, "y": 13, "tileIndex": 3 },
                        { "x": 18, "y": 15, "tileIndex": 3 },
                        { "x": 16, "y": 14, "tileIndex": 3 },
                        { "x": 19, "y": 15, "tileIndex": 4 },
                        { "x": 16, "y": 13, "tileIndex": 4 },
                        { "x": 19, "y": 11, "tileIndex": 4 },
                        { "x": 17, "y": 11, "tileIndex": 4 },
                        { "x": 18, "y": 11, "tileIndex": 4 },
                        { "x": 18, "y": 11, "tileIndex": 0 },
                        { "x": 20, "y": 11, "tileIndex": 2 },
                        { "x": 16, "y": 11, "tileIndex": 2 }
                    ],
                    "imgurLink": "https://i.imgur.com/oZDnzgO.png"
                }
            }
        ];

        // Load any saved data from localStorage (or use the default).
        var combinedGridData;
        try {
            var stored = localStorage.getItem("tagproCombinedGridData");
            if (stored) {
                combinedGridData = JSON.parse(stored);
            } else {
                combinedGridData = defaultCombinedGridData;
            }
        } catch (e) {
            console.error("Error loading combinedGridData from localStorage", e);
            combinedGridData = defaultCombinedGridData;
        }

        // Helper function to save the grid data.
        function saveCombinedGridData() {
            localStorage.setItem("tagproCombinedGridData", JSON.stringify(combinedGridData));
        }

        ////////////////////////////////
        // Branch based on current page:
        ////////////////////////////////

        if (window.location.pathname.includes("/game")) {
            // If we are on a game page, wait until players are loaded.
            var waitForPlayers = setInterval(function(){
                if (tagpro.players && Object.keys(tagpro.players).length > 0) {
                    clearInterval(waitForPlayers);

                    // Use the first available player as a reference.
                    var firstPlayerId = Object.keys(tagpro.players)[0];
                    var playerContainer = tagpro.players[firstPlayerId].sprite.parent;

                    // Wait until the map is available.
                    var checkMapInterval = setInterval(function(){
                        if (tagpro.map && tagpro.map.name) {
                            clearInterval(checkMapInterval);

                            // Find matching grid data using tagpro.map.name.
                            var currentMapData = null;
                            for (var i = 0; i < combinedGridData.length; i++) {
                                var mapNameKey = Object.keys(combinedGridData[i])[0];
                                if (mapNameKey === tagpro.map.name) {
                                    currentMapData = combinedGridData[i][mapNameKey];
                                    break;
                                }
                            }
                            if (!currentMapData) {
                                return;
                            }

                            var gridLines = currentMapData.gridLines;
                            var gridTiles = currentMapData.gridTiles;
                            var spriteSheetUrl = currentMapData.imgurLink;

                            // Get TagPro's background container.
                            var bgContainer = tagpro.renderer.stage.children[0];
                            if (!bgContainer) {
                                return;
                            }

                            var customOverlay = new PIXI.Container();
                            var tileSize = 40;
                            var spriteSheetTexture = PIXI.Texture.from(spriteSheetUrl);

                            // Add custom tiles.
                            gridTiles.forEach(function(tile) {
                                var posX = tile.x * tileSize;
                                var posY = tile.y * tileSize;
                                var index = tile.tileIndex;
                                var srcX = (index % 10) * tileSize;
                                var srcY = Math.floor(index / 10) * tileSize;
                                var tileTexture = new PIXI.Texture(spriteSheetTexture.baseTexture, new PIXI.Rectangle(srcX, srcY, tileSize, tileSize));
                                var sprite = new PIXI.Sprite(tileTexture);
                                sprite.x = posX;
                                sprite.y = posY;
                                customOverlay.addChild(sprite);
                            });

                            // Draw custom lines.
                            var lineGraphics = new PIXI.Graphics();
                            gridLines.forEach(function(line) {
                                var lineColor = (typeof line.color === "string")
                                    ? PIXI.utils.string2hex(line.color)
                                    : (line.color !== undefined ? line.color : 0xFFFFFF);
                                lineGraphics.lineStyle(2, lineColor, 1);
                                var startX = line.start.x * tileSize;
                                var startY = line.start.y * tileSize;
                                var endX = line.end.x * tileSize;
                                var endY = line.end.y * tileSize;
                                lineGraphics.moveTo(startX, startY);
                                lineGraphics.lineTo(endX, endY);
                            });
                            customOverlay.addChild(lineGraphics);

                            // Insert the overlay into the player container so it is rendered behind all players.
                            if (playerContainer) {
                                playerContainer.addChildAt(customOverlay, 0);
                            } else {
                                console.error("Player container not found.");
                            }
                        }
                    }, 100);
                }
            }, 100);
        } else {
            // Non-game pages (e.g., the homepage): Set up the modal editor immediately.

            // Inject CSS for the modal editor.
            var style = document.createElement('style');
            style.textContent = `
               #customMapEditorModal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: none;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    font-family: Arial, sans-serif;
}

#customMapEditorContent {
    background: #f9f9f9;
    padding: 20px;
    border-radius: 12px;
    max-width: 500px;
    width: 90%;
    max-height: 80%;
    overflow-y: auto;
    position: relative;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
    border: 1px solid #ddd;
}

#customMapEditorContent h2 {
    margin-top: 0;
    font-size: 20px;
    color: #333;
    text-align: center;
}

.mapItem {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background: #ffffff;
    border-radius: 6px;
    margin-bottom: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.mapItem span {
    font-size: 16px;
    color: #444;
}

.mapItem button {
    background: #ff4d4d;
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    border-radius: 4px;
    transition: background 0.2s ease-in-out;
}

.mapItem button:hover {
    background: #e60000;
}

#addMapTextbox {
    width: 100%;
    height: 100px;
    margin-top: 10px;
    border-radius: 6px;
    border: 1px solid #ccc;
    padding: 8px;
    font-size: 14px;
}

#customMapEditorClose {
    position: absolute;
    top: 10px;
    right: 15px;
    cursor: pointer;
    font-size: 24px;
    color: #666;
    transition: color 0.2s;
}

#customMapEditorClose:hover {
    color: #222;
}

#customMapEditorButton {
    position: fixed;
    bottom: 15px;
    right: 15px;
    z-index: 10000;
    padding: 12px 18px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    transition: background 0.2s ease-in-out;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.2);
}

#customMapEditorButton:hover {
    background: #0056b3;
}`;
            document.head.appendChild(style);

            // Create a fixed-position button that opens the modal.
            var editorButton = document.createElement('button');
            editorButton.id = 'customMapEditorButton';
            editorButton.textContent = 'Edit Map Data';
            document.body.appendChild(editorButton);

            // Create the modal element.
            var modal = document.createElement('div');
            modal.id = 'customMapEditorModal';
            modal.innerHTML = `
                <div id="customMapEditorContent">
                    <span id="customMapEditorClose">&times;</span>
                    <h2>Custom Map Data Editor</h2>
                    <div id="mapListContainer"></div>
                    <textarea id="addMapTextbox" placeholder='Paste JSON object here to add (e.g., {"New Map": {"gridLines": [...], "gridTiles": [...], "imgurLink": "..."}})'></textarea>
                </div>
            `;
            document.body.appendChild(modal);

            // Function to update the list of maps.
            function updateMapList() {
                var container = document.getElementById('mapListContainer');
                container.innerHTML = '';
                if (combinedGridData.length === 0) {
                    container.textContent = 'No map data available.';
                    return;
                }
                combinedGridData.forEach(function(item, index) {
                    var mapName = Object.keys(item)[0];
                    var div = document.createElement('div');
                    div.className = 'mapItem';
                    div.innerHTML = `<span>${mapName}</span> <button data-index="${index}">x</button>`;
                    container.appendChild(div);
                });
            }
            updateMapList();

            // Listen for clicks on remove (x) buttons.
            document.getElementById('mapListContainer').addEventListener('click', function(e) {
                if (e.target && e.target.tagName === 'BUTTON') {
                    var index = parseInt(e.target.getAttribute('data-index'), 10);
                    if (!isNaN(index)) {
                        combinedGridData.splice(index, 1);
                        saveCombinedGridData();
                        updateMapList();
                    }
                }
            });

            // When a JSON object is pasted into the textarea, try to add it.
            var addMapTextbox = document.getElementById('addMapTextbox');
            addMapTextbox.addEventListener('paste', function(e) {
                setTimeout(function() {
                    try {
                        var pastedText = addMapTextbox.value.trim();
                        if (!pastedText) return;
                        var newMapData = JSON.parse(pastedText);
                        if (typeof newMapData === 'object' && newMapData !== null && Object.keys(newMapData).length === 1) {
                            combinedGridData.push(newMapData);
                            saveCombinedGridData();
                            updateMapList();
                            addMapTextbox.value = '';
                        } else {
                            alert('Invalid format. The JSON object must have exactly one key (the map name).');
                        }
                    } catch (err) {
                        alert('Error parsing JSON: ' + err);
                    }
                }, 100);
            });

            // Open the modal when clicking the editor button.
            editorButton.addEventListener('click', function() {
                modal.style.display = 'flex';
            });

            // Close the modal when clicking the close (×) button.
            document.getElementById('customMapEditorClose').addEventListener('click', function() {
                modal.style.display = 'none';
            });

            // Also close the modal if clicking outside the content.
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        } // End non-/game branch

    }); // End tagpro.ready
})(); // End IIFE
