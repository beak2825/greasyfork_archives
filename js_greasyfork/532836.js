// ==UserScript==
// @name        Highlight squares
// @namespace   Violentmonkey Scripts
// @match       https://chess.ytdraws.win/*
// @grant       none
// @version     1.0
// @author      -
// @description 14/04/2025, 16:51:53
// @license CC-NC-SA
// @downloadURL https://update.greasyfork.org/scripts/532836/Highlight%20squares.user.js
// @updateURL https://update.greasyfork.org/scripts/532836/Highlight%20squares.meta.js
// ==/UserScript==
// == Pathfinding & Attack Visualization Script ==

(function() { // Encapsulate to avoid polluting global scope too much

    // --- Configuration ---
    const ATTACKED_SQUARE_COLOR = 'rgba(255, 0, 0, 0.25)'; // Red, semi-transparent
    const PATH_COLOR = 'rgba(0, 0, 255, 0.3)'; // Blue, semi-transparent
    const PATH_STEP_INTERVAL_MS = 50; // How often to check if we can take the next step (doesn't override game cooldown)
    const MOVE_COOLDOWN_THRESHOLD = 220; // From original game code, ms

    // --- State Variables ---
    let visualizeAttacksEnabled = false;
    let attackedSquares = new Set(); // Stores "x,y" strings of attacked squares
    let pathfindingData = {
        active: false,
        pieceType: 0,
        startX: -1,
        startY: -1,
        targetX: -1,
        targetY: -1,
        currentPath: [], // Array of [x, y] steps
        pathIndex: 0,
        intervalId: null
    };

    // --- Attack Calculation ---

    /**
     * Calculates all squares attacked by enemy pieces.
     * Assumes generateLegalMoves works correctly for all piece types.
     * @returns {Set<string>} A set of "x,y" strings representing attacked squares.
     */
    function calculateAllEnemyAttacks() {
        const attacked = new Set();
        if (typeof board === 'undefined' || typeof teams === 'undefined' || typeof selfId === 'undefined' || typeof generateLegalMoves !== 'function') {
            return attacked;
        }

        for (let x = 0; x < boardW; x++) {
            for (let y = 0; y < boardH; y++) {
                const team = teams[x]?.[y];
                const piece = board[x]?.[y];
                // Check if it's an enemy piece (not ours, not neutral, not empty)
                if (piece && team && team !== selfId && team !== 0) {
                    try {
                        const moves = generateLegalMoves(x, y, board, teams);
                        for (const move of moves) {
                            attacked.add(`${move[0]},${move[1]}`);
                        }
                    } catch (e) {
                        // console.warn(`Error generating moves for enemy at ${x},${y}:`, e);
                    }
                }
            }
        }
        return attacked;
    }

    // --- Pathfinding (BFS) ---

    /**
     * Finds the shortest path using Breadth-First Search.
     * @param {number} startX
     * @param {number} startY
     * @param {number} targetX
     * @param {number} targetY
     * @param {number} pieceType The type of piece trying to move (for generateLegalMoves)
     * @returns {Array<Array<number>> | null} Path as array of [x,y] steps, or null if no path.
     */
    function findPathBFS(startX, startY, targetX, targetY, pieceType) {
        console.log(`Pathfinding: Type ${pieceType} from ${startX},${startY} to ${targetX},${targetY}`);
        if (typeof board === 'undefined' || typeof teams === 'undefined' || typeof selfId === 'undefined' || typeof generateLegalMoves !== 'function') {
            console.error("Pathfinding failed: Missing game variables or functions.");
            return null;
        }

        const queue = [[startX, startY]];
        const visited = new Set([`${startX},${startY}`]);
        const parentMap = {}; // Store "childX,childY": [parentX, parentY]

        while (queue.length > 0) {
            const [currX, currY] = queue.shift();

            // Target found?
            if (currX === targetX && currY === targetY) {
                // Reconstruct path
                const path = [];
                let step = [targetX, targetY];
                while (step[0] !== startX || step[1] !== startY) {
                    path.push(step);
                    const parentKey = `${step[0]},${step[1]}`;
                    if (!parentMap[parentKey]) break; // Should not happen if target found
                    step = parentMap[parentKey];
                }
                path.push([startX, startY]); // Add start
                console.log("Path found:", path.reverse()); // Reverse to get start -> end
                return path;
            }

            // Get legal moves *as if* the piece were at currX, currY
            // We need a way to call generateLegalMoves assuming the piece *type*
            // is at currX, currY, temporarily ignoring the actual board state there
            // for planning purposes, *except* for blocking friendly pieces.
            // This requires modifying generateLegalMoves or having a variant.
            // --- SIMPLIFICATION for this example: ---
            // We'll call generateLegalMoves normally. This means it might fail if
            // the intermediate square is occupied inappropriately for the real piece.
            // A more robust solution needs a planning-specific move generator.
            // We also *simulate* the piece being there to check moves.
            const originalPiece = board[currX]?.[currY];
            const originalTeam = teams[currX]?.[currY];
            board[currX][currY] = pieceType; // Temporarily place piece for move generation
            teams[currX][currY] = selfId;
            let legalMoves = [];
            try {
                 legalMoves = generateLegalMoves(currX, currY, board, teams);
            } catch (e) { /* handle error */ }
            // Restore original board state
            board[currX][currY] = originalPiece === undefined ? 0 : originalPiece;
            teams[currX][currY] = originalTeam === undefined ? 0 : originalTeam;
            // --- End Simplification ---


            for (const move of legalMoves) {
                const [nextX, nextY] = move;
                const nextKey = `${nextX},${nextY}`;

                // Check bounds and if already visited
                if (nextX < 0 || nextX >= boardW || nextY < 0 || nextY >= boardH || visited.has(nextKey)) {
                    continue;
                }

                // Check if destination is blocked by a friendly piece (crucial!)
                // Allow moving *to* the target square even if occupied (capture/overwrite)
                if (teams[nextX]?.[nextY] === selfId && !(nextX === targetX && nextY === targetY)) {
                    continue;
                }

                // Mark visited, store parent, enqueue
                visited.add(nextKey);
                parentMap[nextKey] = [currX, currY];
                queue.push([nextX, nextY]);
            }
        }

        console.log("Pathfinding failed: No path found.");
        return null; // No path found
    }

    // --- Path Execution ---

    function executePathStep() {
        if (!pathfindingData.active || typeof send !== 'function' || typeof curMoveCooldown === 'undefined') {
            stopPathfinding();
            return;
        }

        // Check game cooldown
        if (curMoveCooldown > MOVE_COOLDOWN_THRESHOLD) {
            return; // Wait for cooldown
        }

        // Check if path is complete
        if (pathfindingData.pathIndex >= pathfindingData.currentPath.length - 1) {
            console.log("Path complete.");
            stopPathfinding();
            return;
        }

        const currentStep = pathfindingData.currentPath[pathfindingData.pathIndex];
        const nextStep = pathfindingData.currentPath[pathfindingData.pathIndex + 1];

        console.log(`Executing path step: [${currentStep[0]}, ${currentStep[1]}] -> [${nextStep[0]}, ${nextStep[1]}]`);

        try {
            // Send the move for the *next* step
            const buf = new Uint16Array(4);
            buf[0] = currentStep[0]; // From
            buf[1] = currentStep[1];
            buf[2] = nextStep[0];   // To
            buf[3] = nextStep[1];
            send(buf);

            // Advance path index (will be used in next interval check)
            pathfindingData.pathIndex++;
             // We assume the 'send' action triggers the game's cooldown mechanism.
             // Our check of `curMoveCooldown` at the start handles waiting.

        } catch (e) {
            console.error("Error sending path step move:", e);
            stopPathfinding();
        }
    }

    function startPathfinding(targetX, targetY) {
        stopPathfinding(); // Stop any previous path

        if (typeof selectedSquareX === 'undefined' || typeof selectedSquareY === 'undefined') {
            console.log("Pathfinding: No piece selected.");
            return;
        }
        if (selectedSquareX === targetX && selectedSquareY === targetY) {
            console.log("Pathfinding: Target is the same as start.");
            return;
        }
         const pieceType = board[selectedSquareX]?.[selectedSquareY];
         if (!pieceType) {
             console.error("Pathfinding: Cannot determine selected piece type.");
             return;
         }


        const path = findPathBFS(selectedSquareX, selectedSquareY, targetX, targetY, pieceType);

        if (path && path.length > 1) { // Need at least start and one step
            pathfindingData = {
                active: true,
                pieceType: pieceType,
                startX: selectedSquareX,
                startY: selectedSquareY,
                targetX: targetX,
                targetY: targetY,
                currentPath: path,
                pathIndex: 0, // Start at the beginning of the path
                intervalId: setInterval(executePathStep, PATH_STEP_INTERVAL_MS)
            };
            console.log("Pathfinding started.");
            // Deselect piece visually maybe? Or keep selected? User choice.
            // selectedSquareX = selectedSquareY = undefined; // Optional deselect
        } else {
            console.log("Pathfinding: No valid path found or path too short.");
            // Optionally provide user feedback (e.g., flash screen red)
        }
    }

    function stopPathfinding() {
        if (pathfindingData.intervalId) {
            clearInterval(pathfindingData.intervalId);
        }
        pathfindingData = { active: false, intervalId: null, currentPath: [], pathIndex: 0 }; // Reset state
        console.log("Pathfinding stopped.");
    }

    // --- Drawing ---

    function drawAttackedSquares() {
        if (!visualizeAttacksEnabled || typeof ctx === 'undefined' || typeof camera === 'undefined') return;

        // Recalculate attacks (can be optimized)
        attackedSquares = calculateAllEnemyAttacks();

        if (attackedSquares.size === 0) return;

        const originalTransform = ctx.getTransform(); // Save original transform
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(camera.scale, camera.scale);
        ctx.translate(camera.x, camera.y);

        ctx.fillStyle = ATTACKED_SQUARE_COLOR;

        // Get visible bounds (using canvasPos - slightly adapted)
        const topLeftView = canvasPos ? canvasPos({ x: 0, y: 0 }) : { x: -camera.x * camera.scale, y: -camera.y * camera.scale }; // Fallback if canvasPos missing
        const bottomRightView = canvasPos ? canvasPos({ x: innerWidth, y: innerHeight }) : { x: (innerWidth / camera.scale) - camera.x, y: (innerHeight / camera.scale) - camera.y }; // Fallback

        const startCol = Math.max(0, Math.floor(topLeftView.x / squareSize) - 1);
        const endCol = Math.min(boardW, Math.ceil(bottomRightView.x / squareSize) + 1);
        const startRow = Math.max(0, Math.floor(topLeftView.y / squareSize) - 1);
        const endRow = Math.min(boardH, Math.ceil(bottomRightView.y / squareSize) + 1);


        attackedSquares.forEach(key => {
            const [x, y] = key.split(',').map(Number);
            // Only draw if within rough view bounds
            if (x >= startCol && x < endCol && y >= startRow && y < endRow) {
                 ctx.fillRect(x * squareSize, y * squareSize, squareSize, squareSize);
            }
        });

        ctx.setTransform(originalTransform); // Restore original transform
    }

     function drawCurrentPath() {
        if (!pathfindingData.active || pathfindingData.currentPath.length === 0 || typeof ctx === 'undefined' || typeof camera === 'undefined') return;

        const originalTransform = ctx.getTransform();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(camera.scale, camera.scale);
        ctx.translate(camera.x, camera.y);

        ctx.fillStyle = PATH_COLOR;
        ctx.strokeStyle = 'rgba(0, 0, 150, 0.5)';
        ctx.lineWidth = 3 / camera.scale; // Make line width scale invariant

        // Draw path lines/squares
        for (let i = pathfindingData.pathIndex; i < pathfindingData.currentPath.length; i++) {
             const [x, y] = pathfindingData.currentPath[i];
             // Draw square highlight
             ctx.fillRect(x * squareSize, y * squareSize, squareSize, squareSize);

             // Draw line to next segment (optional)
             if (i < pathfindingData.currentPath.length - 1) {
                const [nextX, nextY] = pathfindingData.currentPath[i+1];
                ctx.beginPath();
                ctx.moveTo(x * squareSize + squareSize / 2, y * squareSize + squareSize / 2);
                ctx.lineTo(nextX * squareSize + squareSize / 2, nextY * squareSize + squareSize / 2);
                ctx.stroke();
             }
        }
        ctx.setTransform(originalTransform);
    }


    // --- Integration with Game Loop & Events ---

    // Monkey-patch the render function (use MutationObserver if render is complex/obfuscated)
    if (typeof render === 'function') {
        const originalRender = render;
        window.render = function(...args) {
            originalRender.apply(this, args); // Call original render first
            // Add our drawing functions
            try {
                drawAttackedSquares();
                drawCurrentPath();
            } catch (e) {
                 console.error("Error in visualization drawing:", e);
                 // Stop visuals if they error out?
                 visualizeAttacksEnabled = false;
                 stopPathfinding();
            }
        }
        console.log("Visualization hooks added to render function.");
    } else {
        console.error("Could not find global 'render' function to hook into.");
    }

    // Monkey-patch mousedown (or add event listener if preferred)
     if (typeof onmousedown === 'function') {
         const originalMouseDown = onmousedown;
         window.onmousedown = function(e) {
             // Stop any ongoing pathfinding if user clicks anywhere
             if (pathfindingData.active) {
                  console.log("User click interrupted pathfinding.");
                  stopPathfinding();
                  // Let the original handler decide if a new selection/move happens
             }

            // Calculate potential target square BEFORE calling original handler
             let targetX, targetY;
             let mousePosDown; // Store mouse pos for pathfinding check
             try {
                 const t = ctx.getTransform(); // Need context for transform
                 ctx.translate(canvas.width/2, canvas.height/2);
                 ctx.scale(camera.scale, camera.scale);
                 ctx.translate(camera.x, camera.y);
                 mousePosDown = canvasPos({ x: e.clientX, y: e.clientY }); // Use clientX/Y
                 ctx.setTransform(t); // Restore immediately
                 targetX = Math.floor(mousePosDown.x / squareSize);
                 targetY = Math.floor(mousePosDown.y / squareSize);
             } catch (err) {
                // console.error("Could not calculate target square on mousedown:", err);
                originalMouseDown.call(this, e); // Still call original
                return;
            }

            // --- Pathfinding Check ---
            let isImmediateLegalMove = false;
            if (typeof selectedSquareX !== 'undefined' && typeof selectedSquareY !== 'undefined' && typeof legalMoves !== 'undefined' && Array.isArray(legalMoves)) {
                for (let i = 0; i < legalMoves.length; i++) {
                    if (legalMoves[i][0] === targetX && legalMoves[i][1] === targetY) {
                        isImmediateLegalMove = true;
                        break;
                    }
                }
            }

            // Call the original handler *first* to handle selection/deselection/immediate moves
            originalMouseDown.call(this, e);

            // --- Initiate Pathfinding AFTER original handler ---
            // Check if:
            // 1. A piece *is still* selected (original handler didn't deselect or move successfully).
            // 2. The click was NOT an immediate legal move for the originally selected piece.
            // 3. The click is within board bounds.
            // 4. Pathfinding isn't already active (should have been stopped above, but double check).
            if (typeof selectedSquareX !== 'undefined' && typeof selectedSquareY !== 'undefined' &&
                !isImmediateLegalMove &&
                targetX >= 0 && targetX < boardW && targetY >= 0 && targetY < boardH &&
                !pathfindingData.active)
            {
                // Check cooldown just before starting pathfinding
                if (curMoveCooldown <= MOVE_COOLDOWN_THRESHOLD) {
                    console.log("Initiating pathfinding to", targetX, targetY);
                    startPathfinding(targetX, targetY);
                } else {
                    console.log("Cannot start pathfinding, move cooldown active.");
                }
            }
         }
         console.log("Pathfinding hook added to onmousedown function.");
     } else {
        console.error("Could not find global 'onmousedown' function to hook into.");
     }


    // --- Global Control Functions ---
    window.toggleAttackVisualization = function(enable = !visualizeAttacksEnabled) {
        visualizeAttacksEnabled = enable;
        console.log("Attack Visualization " + (visualizeAttacksEnabled ? "Enabled" : "Disabled"));
        if (!visualizeAttacksEnabled) {
            attackedSquares.clear(); // Clear stored squares when disabled
            // Request a redraw if possible (difficult without direct access to game loop flags)
        }
    }

    window.cancelCurrentPath = function() {
        stopPathfinding();
    }

    console.log("Pathfinding and Attack Visualization script loaded.");
    console.log("Use toggleAttackVisualization() to turn red squares on/off.");
    console.log("Click an invalid square after selecting a piece to pathfind.");
    console.log("Use cancelCurrentPath() to stop active pathfinding.");
    toggleAttackVisualization()

})(); // End IIFE