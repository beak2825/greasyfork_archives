// ==UserScript==
// @name         Grille Immo
// @namespace    http://tampermonkey.net/
// @version      2.6.5
// @description  Grille 50×50 avec sélection, déplacement, copie/collage (CTRL+C/CTRL+V), undo (CTRL+Z/CTRL+Y), suppression (Suppr) et retournement en miroir (CTRL+D) des cases sélectionnées, limitée à l'interface de la grille.
// @match        https://www.dreadcast.eu/Main
// @match        https://www.dreadcast.net/Main
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530836/Grille%20Immo.user.js
// @updateURL https://update.greasyfork.org/scripts/530836/Grille%20Immo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = "gridState_50x50";
    const cols = 50;
    const rows = 50;
    const baseCellSize = 40;
    let scale = 1;
    const minScale = 0.5;
    const maxScale = 3;
    const overlayWidth = 1050;
    const overlayHeight = 900;
    const headerHeight = 30;
    const paletteWidth = 50;
    const contentWidth = overlayWidth;
    const contentHeight = overlayHeight - headerHeight;
    const canvasWidth = contentWidth - paletteWidth;
    const canvasHeight = contentHeight;
    let offsetX = 0;
    let offsetY = 0;
    let isDraggingCanvas = false;
    let dragStartX, dragStartY, startOffsetX, startOffsetY;
    let isOverlayDragging = false;
    let overlayDragStartX, overlayDragStartY, overlayStartLeft, overlayStartTop;
    let currentFillColor = "#bb6464";
    const paletteColors = [
        "#bb6464",
        "#64bb64",
        "#6464bb",
        "#bbbb64",
        "#64bbbb",
        "#bb64bb"
    ];
    const colorMapping = {
        "#bb6464": "Rouges",
        "#64bb64": "Vertes",
        "#6464bb": "Violettes",
        "#bbbb64": "Jaunes",
        "#64bbbb": "Bleues",
        "#bb64bb": "Roses"
    };
    let showLabels = true;
    let headerCounterInterval;

    // Variables pour la sélection / déplacement
    let isSelecting = false;
    let selectionStartCell = null;
    let selectionEndCell = null;
    let selectionActive = null; // { origin: {x,y}, cells: [{dx,dy,color}] }
    let isDraggingSelection = false;
    let selectionDragStart = { x: 0, y: 0 };
    let selectionCurrentOffset = { x: 0, y: 0 };

    // Variables pour la copie / collage
    let copiedSelection = null;
    // Pour connaître la position actuelle de la souris sur le canvas
    let lastMousePos = { x: 0, y: 0 };

    function getCellSize() {
        return baseCellSize * scale;
    }

    function getGridDimensions() {
        const cellSize = getCellSize();
        return {
            width: cols * cellSize,
            height: rows * cellSize
        };
    }

    let maxOffsetX = 0, maxOffsetY = 0;
    function updateMaxOffsets() {
        const { width, height } = getGridDimensions();
        maxOffsetX = Math.max(0, width - canvasWidth);
        maxOffsetY = Math.max(0, height - canvasHeight);
    }
    updateMaxOffsets();

    function getColumnLabel(n) {
        let label = '';
        n++;
        while(n > 0) {
            let remainder = (n - 1) % 26;
            label = String.fromCharCode(65 + remainder) + label;
            n = Math.floor((n - 1) / 26);
        }
        return label;
    }

    // Vérifie si une cellule (x,y) se trouve dans la sélection active
    function isPointInSelection(cellX, cellY) {
        if (!selectionActive) return false;
        let selOrigin = selectionActive.origin;
        let selWidth = 0, selHeight = 0;
        selectionActive.cells.forEach(cell => {
            selWidth = Math.max(selWidth, cell.dx + 1);
            selHeight = Math.max(selHeight, cell.dy + 1);
        });
        return (cellX >= selOrigin.x && cellX < selOrigin.x + selWidth &&
                cellY >= selOrigin.y && cellY < selOrigin.y + selHeight);
    }

    // Écouteurs globaux pour fermer la grille avec Escape ou CTRL+^ pour l'ouvrir/fermer
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === "^") {
            toggleGridWindow();
        }
        if (event.key === "Escape") {
            closeGrid();
        }
    });

    let undoRedoHandler = null;

    function closeGrid() {
        document.getElementById("gridOverlay")?.remove();
        document.getElementById("closeGridButton")?.remove();
        if(headerCounterInterval) {
            clearInterval(headerCounterInterval);
        }
        if (undoRedoHandler) {
            gridOverlay.removeEventListener("keydown", undoRedoHandler);
            undoRedoHandler = null;
        }
    }

    function toggleGridWindow() {
        if (document.getElementById("gridOverlay")) {
            closeGrid();
            return;
        }
        offsetX = 0;
        offsetY = 0;
        scale = 1;
        updateMaxOffsets();

        let stored = localStorage.getItem(STORAGE_KEY);
        let grid;
        if (stored) {
            let parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length === rows && parsed[0].length === cols) {
                grid = parsed;
            } else {
                grid = Array.from({ length: rows }, () => Array(cols).fill(null));
                localStorage.removeItem(STORAGE_KEY);
            }
        } else {
            grid = Array.from({ length: rows }, () => Array(cols).fill(null));
        }

        let undoStack = [];
        let redoStack = [];
        function pushUndoState() {
            undoStack.push(JSON.parse(JSON.stringify(grid)));
            redoStack = [];
        }

        let gridOverlay = document.createElement("div");
        gridOverlay.id = "gridOverlay";
        // Rendre l'overlay focusable et lui donner le focus
        gridOverlay.setAttribute("tabindex", "0");
        gridOverlay.focus();
        let initialLeft = (window.innerWidth - overlayWidth) / 2;
        let initialTop = (window.innerHeight - overlayHeight) / 2;
        gridOverlay.style.position = "fixed";
        gridOverlay.style.left = initialLeft + "px";
        gridOverlay.style.top = initialTop + "px";
        gridOverlay.style.width = overlayWidth + "px";
        gridOverlay.style.height = overlayHeight + "px";
        gridOverlay.style.background = "black";
        gridOverlay.style.border = "2px solid #6f6f6f";
        gridOverlay.style.zIndex = "999999";
        gridOverlay.style.display = "flex";
        gridOverlay.style.flexDirection = "column";
        gridOverlay.dataset.minimized = "false";
        document.body.appendChild(gridOverlay);

        let header = document.createElement("div");
        header.style.height = headerHeight + "px";
        header.style.background = "#333";
        header.style.color = "white";
        header.style.display = "flex";
        header.style.alignItems = "center";
        header.style.paddingLeft = "10px";
        header.style.cursor = "move";
        header.style.position = "relative";
        let headerText = document.createElement("span");
        headerText.innerText = "Déplacer";
        header.appendChild(headerText);
        let headerCounters = document.createElement("span");
        headerCounters.id = "headerCounters";
        headerCounters.style.marginLeft = "50px";
        header.appendChild(headerCounters);

        let resetButton = document.createElement("button");
        resetButton.innerText = "Reset";
        resetButton.style.position = "absolute";
        resetButton.style.right = "40px";
        resetButton.style.top = "5px";
        resetButton.style.width = "40px";
        resetButton.style.height = "20px";
        resetButton.style.background = "#555";
        resetButton.style.color = "white";
        resetButton.style.border = "none";
        resetButton.style.cursor = "pointer";
        resetButton.addEventListener("click", function() {
            pushUndoState();
            grid = Array.from({ length: rows }, () => Array(cols).fill(null));
            localStorage.setItem(STORAGE_KEY, JSON.stringify(grid));
            drawGrid();
        });
        header.appendChild(resetButton);

        let closeButton = document.createElement("button");
        closeButton.id = "closeGridButton";
        closeButton.innerText = "X";
        closeButton.style.position = "absolute";
        closeButton.style.right = "10px";
        closeButton.style.top = "5px";
        closeButton.style.width = "20px";
        closeButton.style.height = "20px";
        closeButton.style.background = "red";
        closeButton.style.color = "white";
        closeButton.style.border = "none";
        closeButton.style.cursor = "pointer";
        closeButton.addEventListener("click", closeGrid);
        header.appendChild(closeButton);

        gridOverlay.appendChild(header);

        header.addEventListener("dblclick", function(e) {
            if (gridOverlay.dataset.minimized === "false") {
                gridOverlay.dataset.minimized = "true";
                contentContainer.style.display = "none";
                gridOverlay.style.height = headerHeight + "px";
            } else {
                gridOverlay.dataset.minimized = "false";
                contentContainer.style.display = "flex";
                gridOverlay.style.height = overlayHeight + "px";
            }
        });

        header.addEventListener("mousedown", function(e) {
            isOverlayDragging = true;
            overlayDragStartX = e.clientX;
            overlayDragStartY = e.clientY;
            overlayStartLeft = parseInt(gridOverlay.style.left, 10);
            overlayStartTop = parseInt(gridOverlay.style.top, 10);
        });
        document.addEventListener("mousemove", function(e) {
            if (isOverlayDragging) {
                let dx = e.clientX - overlayDragStartX;
                let dy = e.clientY - overlayDragStartY;
                gridOverlay.style.left = (overlayStartLeft + dx) + "px";
                gridOverlay.style.top = (overlayStartTop + dy) + "px";
            }
        });
        document.addEventListener("mouseup", function(e) {
            isOverlayDragging = false;
        });

        let contentContainer = document.createElement("div");
        contentContainer.style.flex = "1";
        contentContainer.style.display = "flex";
        gridOverlay.appendChild(contentContainer);

        let palette = document.createElement("div");
        palette.style.width = paletteWidth + "px";
        palette.style.height = "100%";
        palette.style.background = "black";
        palette.style.display = "flex";
        palette.style.flexDirection = "column";
        palette.style.alignItems = "center";
        palette.style.paddingTop = "10px";
        palette.style.boxSizing = "border-box";
        palette.style.zIndex = "1000000";
        paletteColors.forEach(color => {
            let colorBox = document.createElement("div");
            colorBox.style.width = "30px";
            colorBox.style.height = "30px";
            colorBox.style.marginBottom = "10px";
            colorBox.style.background = color;
            colorBox.style.border = "2px solid " + (color === currentFillColor ? "white" : "#6f6f6f");
            colorBox.style.cursor = "pointer";
            colorBox.addEventListener("click", function() {
                currentFillColor = color;
                Array.from(palette.children).forEach(child => {
                    if(child.dataset.type !== "toggleLabel" && child.dataset.type !== "exportImport" && child.dataset.type !== "memorySlot") {
                        child.style.border = "2px solid #6f6f6f";
                    }
                });
                colorBox.style.border = "2px solid white";
            });
            palette.appendChild(colorBox);
        });

        let toggleLabelBtn = document.createElement("button");
        toggleLabelBtn.innerText = "G";
        toggleLabelBtn.dataset.type = "toggleLabel";
        toggleLabelBtn.style.width = "40px";
        toggleLabelBtn.style.height = "40px";
        toggleLabelBtn.style.background = "black";
        toggleLabelBtn.style.color = "white";
        toggleLabelBtn.style.border = "2px solid " + (showLabels ? "white" : "#6f6f6f");
        toggleLabelBtn.style.cursor = "pointer";
        toggleLabelBtn.style.marginTop = "25px";
        toggleLabelBtn.addEventListener("click", function() {
            showLabels = !showLabels;
            toggleLabelBtn.style.border = "2px solid " + (showLabels ? "white" : "#6f6f6f");
            drawGrid();
        });
        palette.appendChild(toggleLabelBtn);

        let exportBtn = document.createElement("button");
        exportBtn.innerText = "⬆";
        exportBtn.dataset.type = "exportImport";
        exportBtn.style.width = "50px";
        exportBtn.style.height = "60px";
        exportBtn.style.marginTop = "20px";
        exportBtn.style.background = "black";
        exportBtn.style.color = "white";
        exportBtn.style.border = "2px solid #6f6f6f";
        exportBtn.style.cursor = "pointer";
        exportBtn.style.fontSize = "200%";
        exportBtn.style.transform = "translateY(-10px)";
        exportBtn.addEventListener("click", function() {
            let data = JSON.stringify(grid);
            prompt("Copier le texte pour exporter la grille :", data);
        });
        palette.appendChild(exportBtn);

        let importBtn = document.createElement("button");
        importBtn.innerText = "⬇";
        importBtn.dataset.type = "exportImport";
        importBtn.style.width = "50px";
        importBtn.style.height = "60px";
        importBtn.style.marginTop = "10px";
        importBtn.style.background = "black";
        importBtn.style.color = "white";
        importBtn.style.border = "2px solid #6f6f6f";
        importBtn.style.cursor = "pointer";
        importBtn.style.fontSize = "200%";
        importBtn.style.transform = "translateY(-10px)";
        importBtn.addEventListener("click", function() {
            let input = prompt("Collez le code de la grille à importer :");
            if (input) {
                try {
                    let importedGrid = JSON.parse(input);
                    if (Array.isArray(importedGrid) && importedGrid.length === rows && importedGrid[0].length === cols) {
                        pushUndoState();
                        grid = importedGrid;
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(grid));
                        drawGrid();
                    } else {
                        alert("Données invalides (dimensions incorrectes).");
                    }
                } catch(e) {
                    alert("Erreur de parsing JSON.");
                }
            }
        });
        palette.appendChild(importBtn);

        let saveContainer = document.createElement("div");
        saveContainer.style.marginTop = "20px";
        saveContainer.style.display = "flex";
        saveContainer.style.flexDirection = "column";
        saveContainer.style.alignItems = "center";
        palette.appendChild(saveContainer);

        let selectedSlot = null;
        let slotButtons = {};

        let saveBtn = document.createElement("button");
        saveBtn.innerText = "🖬";
        saveBtn.style.width = "50px";
        saveBtn.style.height = "50px";
        saveBtn.style.marginTop = "10px";
        saveBtn.style.background = "black";
        saveBtn.style.color = "white";
        saveBtn.style.border = "2px solid #6f6f6f";
        saveBtn.style.cursor = "pointer";
        saveBtn.style.fontSize = "150%";
        saveBtn.addEventListener("click", function() {
            if (selectedSlot === null) {
                alert("Veuillez sélectionner un emplacement (1 à 5) avant de sauvegarder.");
            } else {
                localStorage.setItem("gridStateSlot" + selectedSlot, JSON.stringify(grid));
                alert("Grille sauvegardée dans l'emplacement " + selectedSlot);
            }
        });
        saveContainer.appendChild(saveBtn);

        let loadBtn = document.createElement("button");
        loadBtn.innerText = "╰┈➤";
        loadBtn.style.width = "50px";
        loadBtn.style.height = "50px";
        loadBtn.style.marginTop = "10px";
        loadBtn.style.background = "black";
        loadBtn.style.color = "white";
        loadBtn.style.border = "2px solid #6f6f6f";
        loadBtn.style.cursor = "pointer";
        loadBtn.style.fontSize = "150%";
        loadBtn.addEventListener("click", function() {
            if (selectedSlot === null) {
                alert("Veuillez sélectionner un emplacement (1 à 5) avant de charger.");
            } else {
                let saved = localStorage.getItem("gridStateSlot" + selectedSlot);
                if (saved) {
                    try {
                        let importedGrid = JSON.parse(saved);
                        if (Array.isArray(importedGrid) && importedGrid.length === rows && importedGrid[0].length === cols) {
                            pushUndoState();
                            grid = importedGrid;
                            localStorage.setItem(STORAGE_KEY, JSON.stringify(grid));
                            drawGrid();
                        } else {
                            alert("Données invalides dans l'emplacement " + selectedSlot);
                        }
                    } catch(e) {
                        alert("Erreur lors du chargement de l'emplacement " + selectedSlot);
                    }
                } else {
                    alert("Aucune grille sauvegardée dans l'emplacement " + selectedSlot);
                }
            }
        });
        saveContainer.appendChild(loadBtn);

        [1, 2, 3, 4, 5].forEach(num => {
            let btn = document.createElement("button");
            btn.innerText = num;
            btn.style.width = "50px";
            btn.style.height = "30px";
            btn.style.marginTop = "11px";
            btn.style.background = "black";
            btn.style.color = "white";
            btn.style.border = "2px solid #6f6f6f";
            btn.style.cursor = "pointer";
            btn.style.fontSize = "150%";
            btn.addEventListener("click", function() {
                selectedSlot = num;
                [1, 2, 3, 4, 5].forEach(n => {
                    slotButtons[n].style.border = (n === num) ? "2px solid white" : "2px solid #6f6f6f";
                });
            });
            slotButtons[num] = btn;
            saveContainer.appendChild(btn);
        });

        contentContainer.appendChild(palette);

        let canvas = document.createElement("canvas");
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.cursor = "grab";
        contentContainer.appendChild(canvas);

        let ctx = canvas.getContext("2d");

        // Fonction de dessin de la grille et de la sélection
        function drawGrid() {
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            const cellSize = getCellSize();
            updateMaxOffsets();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "#6f6f6f";
            ctx.font = `${10 * scale}px sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            const centerCol = Math.floor(cols / 2);
            const centerRow = Math.floor(rows / 2);
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    let posX = x * cellSize - offsetX;
                    let posY = y * cellSize - offsetY;
                    ctx.fillStyle = grid[y][x] ? grid[y][x] : "black";
                    ctx.fillRect(posX, posY, cellSize, cellSize);
                    ctx.strokeRect(posX, posY, cellSize, cellSize);
                    if (showLabels) {
                        let label = getColumnLabel(x) + (y + 1);
                        ctx.fillStyle = "#6f6f6f";
                        ctx.fillText(label, posX + cellSize/2, posY + cellSize/2);
                    }
                    if (x === centerCol && y === centerRow) {
                        ctx.strokeStyle = "blue";
                        ctx.lineWidth = 4;
                        ctx.strokeRect(posX, posY, cellSize, cellSize);
                        ctx.lineWidth = 2;
                        ctx.strokeStyle = "#6f6f6f";
                    }
                }
            }
            // Dessin du rectangle de sélection en cours (avant finalisation)
            if(isSelecting && selectionStartCell && selectionEndCell){
                let startX = Math.min(selectionStartCell.x, selectionEndCell.x);
                let endX = Math.max(selectionStartCell.x, selectionEndCell.x);
                let startY = Math.min(selectionStartCell.y, selectionEndCell.y);
                let endY = Math.max(selectionStartCell.y, selectionEndCell.y);
                ctx.strokeStyle = "white";
                ctx.lineWidth = 2;
                ctx.setLineDash([5,5]);
                ctx.strokeRect(startX * cellSize - offsetX, startY * cellSize - offsetY, (endX - startX + 1)*cellSize, (endY - startY + 1)*cellSize);
                ctx.setLineDash([]);
            }
            // Affichage de la sélection active (en déplacement ou collée)
            if(selectionActive){
                let originX = selectionActive.origin.x * cellSize - offsetX + selectionCurrentOffset.x;
                let originY = selectionActive.origin.y * cellSize - offsetY + selectionCurrentOffset.y;
                selectionActive.cells.forEach(cell => {
                    let posX = originX + cell.dx * cellSize;
                    let posY = originY + cell.dy * cellSize;
                    ctx.fillStyle = cell.color;
                    ctx.fillRect(posX, posY, cellSize, cellSize);
                    ctx.strokeStyle = "yellow";
                    ctx.lineWidth = 2;
                    ctx.strokeRect(posX, posY, cellSize, cellSize);
                    if(showLabels){
                        let colLabel = getColumnLabel(selectionActive.origin.x + cell.dx);
                        let label = colLabel + (selectionActive.origin.y + cell.dy + 1);
                        ctx.fillStyle = "#6f6f6f";
                        ctx.fillText(label, posX + cellSize/2, posY + cellSize/2);
                    }
                });
            }
        }

        function updateCounters() {
            let counts = { empty: 0 };
            for (let hex in colorMapping) {
                counts[hex] = 0;
            }
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++){
                    let cell = grid[row][col];
                    if (!cell) {
                        counts.empty++;
                    } else if (counts.hasOwnProperty(cell)) {
                        counts[cell]++;
                    }
                }
            }
            return counts;
        }

        function refreshHeaderCounters() {
            let counts = updateCounters();
            let countersText = `Vides : ${counts.empty}`;
            for (let hex in colorMapping) {
                countersText += ` / ${colorMapping[hex]} : ${counts[hex]}`;
            }
            headerCounters.innerText = countersText;
        }

        headerCounterInterval = setInterval(refreshHeaderCounters, 1000);

        // Gestion des événements sur le canvas
        canvas.addEventListener("mousedown", function(e) {
            let rect = canvas.getBoundingClientRect();
            // Mise à jour de la position de la souris
            lastMousePos.x = e.clientX - rect.left;
            lastMousePos.y = e.clientY - rect.top;
            let cellX = Math.floor((lastMousePos.x + offsetX) / getCellSize());
            let cellY = Math.floor((lastMousePos.y + offsetY) / getCellSize());

            if (e.ctrlKey) {
                // Si une sélection existe déjà et que le clic se fait dedans, démarrer le déplacement de la sélection
                if (selectionActive && isPointInSelection(cellX, cellY)) {
                    isDraggingSelection = true;
                    selectionDragStart.x = e.clientX;
                    selectionDragStart.y = e.clientY;
                } else {
                    // Sinon, démarrer une nouvelle sélection par rectangle
                    isSelecting = true;
                    selectionStartCell = { x: cellX, y: cellY };
                    selectionEndCell = { x: cellX, y: cellY };
                }
                return;
            }
            // Sans CTRL, gérer le déplacement de la grille ou le clic sur une cellule
            isDraggingCanvas = false;
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            startOffsetX = offsetX;
            startOffsetY = offsetY;
            canvas.style.cursor = "grabbing";
        });

        canvas.addEventListener("mousemove", function(e) {
            let rect = canvas.getBoundingClientRect();
            // Mise à jour de la position de la souris (pour le collage)
            lastMousePos.x = e.clientX - rect.left;
            lastMousePos.y = e.clientY - rect.top;

            if (e.ctrlKey) {
                if(isSelecting){
                    let moveX = e.clientX - rect.left;
                    let moveY = e.clientY - rect.top;
                    selectionEndCell = {
                        x: Math.floor((moveX + offsetX) / getCellSize()),
                        y: Math.floor((moveY + offsetY) / getCellSize())
                    };
                    drawGrid();
                    return;
                }
                if(isDraggingSelection){
                    selectionCurrentOffset.x = e.clientX - selectionDragStart.x;
                    selectionCurrentOffset.y = e.clientY - selectionDragStart.y;
                    drawGrid();
                    return;
                }
            }
            if (e.buttons !== 1) return;
            let dx = e.clientX - dragStartX;
            let dy = e.clientY - dragStartY;
            if (!isDraggingCanvas && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
                isDraggingCanvas = true;
            }
            if (isDraggingCanvas) {
                offsetX = startOffsetX - dx;
                offsetY = startOffsetY - dy;
                offsetX = Math.max(0, Math.min(offsetX, maxOffsetX));
                offsetY = Math.max(0, Math.min(offsetY, maxOffsetY));
                drawGrid();
            }
        });

        canvas.addEventListener("mouseup", function(e) {
            canvas.style.cursor = "grab";
            if(e.ctrlKey){
                if(isSelecting){
                    // Finalisation de la sélection par rectangle (sans retirer les cellules)
                    isSelecting = false;
                    let startX = Math.min(selectionStartCell.x, selectionEndCell.x);
                    let endX = Math.max(selectionStartCell.x, selectionEndCell.x);
                    let startY = Math.min(selectionStartCell.y, selectionEndCell.y);
                    let endY = Math.max(selectionStartCell.y, selectionEndCell.y);
                    let selCells = [];
                    for(let y = startY; y <= endY; y++){
                        for(let x = startX; x <= endX; x++){
                            if(grid[y][x]){
                                selCells.push({ dx: x - startX, dy: y - startY, color: grid[y][x] });
                            }
                        }
                    }
                    if(selCells.length > 0){
                        selectionActive = { origin: { x: startX, y: startY }, cells: selCells };
                        selectionCurrentOffset = { x: 0, y: 0 };
                    }
                    drawGrid();
                    return;
                }
                if(isDraggingSelection){
                    // Avant de déplacer la sélection, enregistrer l'état pour undo
                    pushUndoState();
                    let cellSize = getCellSize();
                    let deltaCellsX = Math.round(selectionCurrentOffset.x / cellSize);
                    let deltaCellsY = Math.round(selectionCurrentOffset.y / cellSize);
                    let newOriginX = selectionActive.origin.x + deltaCellsX;
                    let newOriginY = selectionActive.origin.y + deltaCellsY;
                    // Clamp pour rester dans la grille
                    let selWidth = 0, selHeight = 0;
                    selectionActive.cells.forEach(cell => {
                        selWidth = Math.max(selWidth, cell.dx + 1);
                        selHeight = Math.max(selHeight, cell.dy + 1);
                    });
                    newOriginX = Math.max(0, Math.min(newOriginX, cols - selWidth));
                    newOriginY = Math.max(0, Math.min(newOriginY, rows - selHeight));
                    // Vider la zone d'origine de la sélection
                    selectionActive.cells.forEach(cell => {
                        let oldX = selectionActive.origin.x + cell.dx;
                        let oldY = selectionActive.origin.y + cell.dy;
                        grid[oldY][oldX] = null;
                    });
                    // Placer la sélection à la nouvelle position
                    selectionActive.cells.forEach(cell => {
                        let x = newOriginX + cell.dx;
                        let y = newOriginY + cell.dy;
                        grid[y][x] = cell.color;
                    });
                    selectionActive = null;
                    isDraggingSelection = false;
                    selectionCurrentOffset = { x: 0, y: 0 };
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(grid));
                    drawGrid();
                    return;
                }
            }
            // Sans CTRL et si aucun déplacement de sélection, traiter le clic sur une cellule
            if (!isDraggingCanvas && !e.ctrlKey) {
                let rect = canvas.getBoundingClientRect();
                let clickX = e.clientX - rect.left;
                let clickY = e.clientY - rect.top;
                let cellX = Math.floor((clickX + offsetX) / getCellSize());
                let cellY = Math.floor((clickY + offsetY) / getCellSize());
                if (cellX < cols && cellY < rows) {
                    pushUndoState();
                    grid[cellY][cellX] = grid[cellY][cellX] === currentFillColor ? null : currentFillColor;
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(grid));
                    drawGrid();
                }
            }
            isDraggingCanvas = false;
        });

        canvas.addEventListener("mouseleave", function() {
            isDraggingCanvas = false;
            canvas.style.cursor = "grab";
        });

        canvas.addEventListener("wheel", function(e) {
            e.preventDefault();
            const oldScale = scale;
            const delta = e.deltaY < 0 ? 0.1 : -0.1;
            scale = Math.min(maxScale, Math.max(minScale, scale + delta));
            let rect = canvas.getBoundingClientRect();
            let mouseX = e.clientX - rect.left;
            let mouseY = e.clientY - rect.top;
            offsetX = (offsetX + mouseX) * (scale / oldScale) - mouseX;
            offsetY = (offsetY + mouseY) * (scale / oldScale) - mouseY;
            updateMaxOffsets();
            offsetX = Math.max(0, Math.min(offsetX, maxOffsetX));
            offsetY = Math.max(0, Math.min(offsetY, maxOffsetY));
            drawGrid();
        });

        drawGrid();

        // Raccourcis clavier attachés à l'overlay uniquement
        undoRedoHandler = function(e) {
            if (!e.ctrlKey) return;
            if (e.key.toLowerCase() === "z") {
                if (undoStack.length > 0) {
                    redoStack.push(JSON.parse(JSON.stringify(grid)));
                    grid = undoStack.pop();
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(grid));
                    drawGrid();
                }
                e.preventDefault();
            } else if (e.key.toLowerCase() === "y") {
                if (redoStack.length > 0) {
                    undoStack.push(JSON.parse(JSON.stringify(grid)));
                    grid = redoStack.pop();
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(grid));
                    drawGrid();
                }
                e.preventDefault();
            }
        };
        gridOverlay.addEventListener("keydown", undoRedoHandler);

        gridOverlay.addEventListener("keydown", function(e) {
            if(e.ctrlKey && e.key.toLowerCase() === "c"){
                if(selectionActive){
                    copiedSelection = JSON.parse(JSON.stringify(selectionActive));
                    console.log("Sélection copiée");
                }
                e.preventDefault();
            } else if(e.ctrlKey && e.key.toLowerCase() === "v"){
                if(copiedSelection){
                    pushUndoState();
                    let cellSize = getCellSize();
                    // Déterminer la cellule sous la souris pour le collage
                    let newOriginX = Math.floor((lastMousePos.x + offsetX) / cellSize);
                    let newOriginY = Math.floor((lastMousePos.y + offsetY) / cellSize);
                    // Clamp pour rester dans la grille
                    let selWidth = 0, selHeight = 0;
                    copiedSelection.cells.forEach(cell => {
                        selWidth = Math.max(selWidth, cell.dx + 1);
                        selHeight = Math.max(selHeight, cell.dy + 1);
                    });
                    newOriginX = Math.max(0, Math.min(newOriginX, cols - selWidth));
                    newOriginY = Math.max(0, Math.min(newOriginY, rows - selHeight));
                    // Coller la sélection dans la grille
                    copiedSelection.cells.forEach(cell => {
                        let x = newOriginX + cell.dx;
                        let y = newOriginY + cell.dy;
                        grid[y][x] = cell.color;
                    });
                    // La zone collée devient la nouvelle sélection active
                    selectionActive = {
                        origin: { x: newOriginX, y: newOriginY },
                        cells: JSON.parse(JSON.stringify(copiedSelection.cells))
                    };
                    selectionCurrentOffset = { x: 0, y: 0 };
                    drawGrid();
                }
                e.preventDefault();
            } else if(e.key === "Delete"){
                if(selectionActive){
                    pushUndoState();
                    let cellSize = getCellSize();
                    let deltaX = isDraggingSelection ? Math.round(selectionCurrentOffset.x / cellSize) : 0;
                    let deltaY = isDraggingSelection ? Math.round(selectionCurrentOffset.y / cellSize) : 0;
                    let delOriginX = selectionActive.origin.x + deltaX;
                    let delOriginY = selectionActive.origin.y + deltaY;
                    selectionActive.cells.forEach(cell => {
                        let x = delOriginX + cell.dx;
                        let y = delOriginY + cell.dy;
                        grid[y][x] = null;
                    });
                    selectionActive = null;
                    isDraggingSelection = false;
                    selectionCurrentOffset = { x: 0, y: 0 };
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(grid));
                    drawGrid();
                }
                e.preventDefault();
            } else if(e.ctrlKey && e.key.toLowerCase() === "d"){
                // Nouveau : retourner en miroir la sélection active
                if(selectionActive){
                    pushUndoState();
                    let cellSize = getCellSize();
                    // Déterminer la largeur du groupe sélectionné
                    let maxDx = 0;
                    selectionActive.cells.forEach(cell => {
                        if(cell.dx > maxDx) maxDx = cell.dx;
                    });
                    let width = maxDx + 1;
                    // Appliquer le retournement horizontal
                    selectionActive.cells = selectionActive.cells.map(cell => {
                        return { dx: (width - 1) - cell.dx, dy: cell.dy, color: cell.color };
                    });
                    // Pour appliquer le changement dans la grille, on vide d'abord la zone d'origine...
                    selectionActive.cells.forEach((cell, index) => {
                        // On récupère l'ancienne position à partir de l'ancienne valeur de dx (avant transformation)
                        // Ici, on suppose que le miroir s'applique sur la zone actuellement affichée,
                        // on vide toute la zone recouverte par la sélection.
                        // Une solution simple est de vider toutes les cases dans le rectangle de la sélection.
                    });
                    // Vider le rectangle correspondant à la sélection
                    let origin = selectionActive.origin;
                    let selWidth = width;
                    let selHeight = 0;
                    selectionActive.cells.forEach(cell => {
                        selHeight = Math.max(selHeight, cell.dy + 1);
                    });
                    for(let y = origin.y; y < origin.y + selHeight; y++){
                        for(let x = origin.x; x < origin.x + selWidth; x++){
                            grid[y][x] = null;
                        }
                    }
                    // Puis réinsérer le motif retourné
                    selectionActive.cells.forEach(cell => {
                        let x = origin.x + cell.dx;
                        let y = origin.y + cell.dy;
                        grid[y][x] = cell.color;
                    });
                    drawGrid();
                }
                e.preventDefault();
            }
        });
    }

    const openGridBtn = document.createElement("button");
    openGridBtn.innerText = "Grille";
    openGridBtn.style.position = "fixed";
    openGridBtn.style.left = "20px";
    openGridBtn.style.bottom = "20px";
    openGridBtn.style.width = "40px";
    openGridBtn.style.height = "40px";
    openGridBtn.style.backgroundColor = "#00008B";
    openGridBtn.style.color = "white";
    openGridBtn.style.border = "none";
    openGridBtn.style.cursor = "pointer";
    openGridBtn.style.zIndex = "1000000";
    openGridBtn.style.borderRadius = "4px";
    openGridBtn.addEventListener("click", function() {
        toggleGridWindow();
    });
    document.body.appendChild(openGridBtn);
})();
