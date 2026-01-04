// ==UserScript==
// @name        Automated moves
// @namespace   Violentmonkey Scripts
// @match       https://chess.ytdraws.win/*
// @grant       none
// @version     1.0
// @author      -
// @description 14/04/2025, 16:54:06
// @license     CC0
// @downloadURL https://update.greasyfork.org/scripts/532839/Automated%20moves.user.js
// @updateURL https://update.greasyfork.org/scripts/532839/Automated%20moves.meta.js
// ==/UserScript==


let basicBotInterval = null;

// --- Helper Functions (Existing + New) ---

/**
 * Calculates Manhattan distance between two points.
 * @param {number} x1
 * @param {number} y1
 * * @param {number} x2
 * @param {number} y2
 * @returns {number}
 */
function manhattanDistance(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

/**
 * Finds all coordinates of the player's pieces of a specific type.
 * @param {number} pieceType - The type of piece (1-6).
 * @returns {Array<Array<number>>} An array of [x, y] coordinates.
 */
function findMyPiecesOfType(pieceType) {
    const pieces = [];
    if (typeof selfId === 'undefined' || selfId === -1) return pieces;

    for (let x = 0; x < boardW; x++) {
        for (let y = 0; y < boardH; y++) {
            if (board[x][y] === pieceType && teams[x][y] === selfId) {
                pieces.push([x, y]);
            }
        }
    }
    return pieces;
}

/**
 * Finds all coordinates of the player's King(s).
 * @returns {Array<Array<number>>} An array of [x, y] coordinates.
 */
function findMyKings() {
    return findMyPiecesOfType(6); // 6 is King
}

/**
 * Checks if the player only has King(s) left.
 * @returns {boolean} True if only Kings remain, false otherwise.
 */
function isOnlyKingLeft() {
    if (typeof selfId === 'undefined' || selfId === -1) return false;
    for (let x = 0; x < boardW; x++) {
        for (let y = 0; y < boardH; y++) {
            // If we find a piece belonging to us that is NOT a King (type 6)
            if (teams[x][y] === selfId && board[x][y] !== 6 && board[x][y] !== 0) {
                return false; // Found a non-king piece
            }
        }
    }
    return true; // No non-king pieces found
}

/**
 * Checks if a specific square is attacked by any enemy piece.
 * (Same as before - potentially inefficient)
 * @param {number} targetX - The x-coordinate of the square to check.
 * @param {number} targetY - The y-coordinate of the square to check.
 * @returns {boolean} True if the square is under attack, false otherwise.
 */
function isSquareAttacked(targetX, targetY) {
    if (typeof selfId === 'undefined' || selfId === -1) return false;
    if (typeof generateLegalMoves === 'undefined') return false; // Safety check

    for (let x = 0; x < boardW; x++) {
        for (let y = 0; y < boardH; y++) {
            if (board[x][y] !== 0 && teams[x][y] !== selfId && teams[x][y] !== 0) {
                try {
                    const enemyMoves = generateLegalMoves(x, y, board, teams);
                    for (const move of enemyMoves) {
                        if (move[0] === targetX && move[1] === targetY) {
                            return true;
                        }
                    }
                } catch (e) {
                    // console.error(`Error generating moves for enemy at ${x},${y} when checking attack on ${targetX},${targetY}:`, e);
                }
            }
        }
    }
    return false;
}

/**
 * Finds the coordinates of the nearest neutral (Team 0) piece.
 * @param {number} fromX - The starting X coordinate.
 * @param {number} fromY - The starting Y coordinate.
 * @returns {Array<number> | null} Coordinates [x, y] of the nearest neutral piece, or null if none found.
 */
function findNearestNeutralPiece(fromX, fromY) {
    let nearestPos = null;
    let minDistance = Infinity;

    for (let x = 0; x < boardW; x++) {
        for (let y = 0; y < boardH; y++) {
            // Team 0 is assumed to be neutral/white/unclaimed
            if (teams[x][y] === 0 && board[x][y] !== 0) {
                const dist = manhattanDistance(fromX, fromY, x, y);
                if (dist < minDistance) {
                    minDistance = dist;
                    nearestPos = [x, y];
                }
            }
        }
    }
    return nearestPos;
}


/**
 * Checks if a player's piece is "idle" (not attacking anything and not under attack).
 * @param {number} pieceX The piece's X coordinate.
 * @param {number} pieceY The piece's Y coordinate.
 * @param {Array<Array<number>>} legalMoves The pre-calculated legal moves for this piece.
 * @returns {boolean} True if the piece is idle, false otherwise.
 */
function isPieceIdle(pieceX, pieceY, legalMoves) {
     // 1. Check if under attack
    if (isSquareAttacked(pieceX, pieceY)) {
        return false;
    }

    // 2. Check if any legal move is a capture
    for (const move of legalMoves) {
        const [toX, toY] = move;
        // Is the destination occupied by an enemy (not empty, not ours, not neutral)?
        if (board[toX][toY] !== 0 && teams[toX][toY] !== selfId && teams[toX][toY] !== 0) {
            return false; // This piece can attack
        }
    }

    // If not attacked and cannot attack, it's idle
    return true;
}

/**
 * Finds the best move from a list of legal moves towards a target coordinate.
 * Handles Knights (type 2) separately to mitigate looping issues.
 * "Best" minimizes Manhattan distance, with tie-breaking for Knights.
 * @param {number} pieceType The type (1-6) of the moving piece.
 * @param {number} currentX The current X of the moving piece.
 * @param {number} currentY The current Y of the moving piece.
 * @param {Array<Array<number>>} legalMoves List of [toX, toY] moves.
 * @param {number} targetX Target X coordinate.
 * @param {number} targetY Target Y coordinate.
 * @returns {Array<number> | null} The best move [toX, toY] or null if no suitable legal moves.
 */
function findBestMoveTowards(pieceType, currentX, currentY, legalMoves, targetX, targetY) {
    let bestMove = null;
    let minDistance = Infinity;
    let madeProgress = false; // Did any move reduce distance?

    const currentTargetDist = manhattanDistance(currentX, currentY, targetX, targetY);

    // --- Knight-Specific Logic (Type 2) ---
    if (pieceType === 2) {
        let potentialMoves = [];
        for (const move of legalMoves) {
            const [toX, toY] = move;
            // Skip moves onto own pieces
            if (teams[toX]?.[toY] === selfId) continue;

            const newDist = manhattanDistance(toX, toY, targetX, targetY);
            potentialMoves.push({ move: move, dist: newDist });
        }

        // Sort potential moves: prioritize smaller distance, then break ties
        potentialMoves.sort((a, b) => {
            if (a.dist !== b.dist) {
                return a.dist - b.dist; // Closer is better
            } else {
                 // Tie-breaker: Prioritize move that reduces the LARGER axis difference more
                 const [ax, ay] = a.move;
                 const [bx, by] = b.move;
                 const aDiffX = Math.abs(ax - targetX);
                 const aDiffY = Math.abs(ay - targetY);
                 const bDiffX = Math.abs(bx - targetX);
                 const bDiffY = Math.abs(by - targetY);
                 const currentDiffX = Math.abs(currentX - targetX);
                 const currentDiffY = Math.abs(currentY - targetY);

                 if (currentDiffX > currentDiffY) { // Further in X direction
                     return aDiffX - bDiffX; // Smaller X difference is better
                 } else if (currentDiffY > currentDiffX) { // Further in Y direction
                     return aDiffY - bDiffY; // Smaller Y difference is better
                 } else {
                     return 0; // No preference if equidistant on axes
                 }
            }
        });

        // Return the best valid move found
        if (potentialMoves.length > 0) {
            bestMove = potentialMoves[0].move;
             // Basic loop avoidance: if best move doesn't decrease distance, maybe pick 2nd best if it does?
             if(potentialMoves.length > 1 && potentialMoves[0].dist >= currentTargetDist && potentialMoves[1].dist < currentTargetDist) {
                bestMove = potentialMoves[1].move;
                // console.log(`Knight: Avoiding non-progress move, taking 2nd best.`);
             }
        }
        return bestMove;

    } else {
        // --- Standard Logic (Non-Knights) ---
        for (const move of legalMoves) {
            const [toX, toY] = move;
            // Skip moves onto own pieces
            if (teams[toX]?.[toY] === selfId) continue;

            const dist = manhattanDistance(toX, toY, targetX, targetY);

            if (dist < minDistance) {
                minDistance = dist;
                bestMove = move;
                if (dist < currentTargetDist) madeProgress = true;
            }
        }
        // If the best move doesn't actually get closer, maybe reconsider?
        // For non-knights, usually direct path is fine, but this could be added if needed.
         // If best move doesn't make progress, but other moves *do*, prefer one that does?
         if(bestMove && !madeProgress) {
            let progressMove = null;
            let progressMinDist = Infinity;
             for (const move of legalMoves) {
                 const [toX, toY] = move;
                 if (teams[toX]?.[toY] === selfId) continue;
                 const dist = manhattanDistance(toX, toY, targetX, targetY);
                 if (dist < currentTargetDist && dist < progressMinDist) { // Found a move that makes progress
                     progressMinDist = dist;
                     progressMove = move;
                 }
             }
             if(progressMove) {
                // console.log(`Non-Knight: Prioritizing progress move over non-progress best move.`);
                bestMove = progressMove;
             }
         }

        return bestMove;
    }
}

/**
 * Checks if moving a high-value piece (Rook/Queen) to a square is acceptably safe.
 * Currently just checks if the destination square is attacked.
 * @param {number} toX Destination X.
 * @param {number} toY Destination Y.
 * @returns {boolean} True if the move is considered safe enough, false otherwise.
 */
function isHunterMoveSafe(toX, toY) {
    // For now, "safe enough" means the destination isn't directly attacked.
    // Could be expanded (e.g., allow if capturing equally valuable piece).
    return !isSquareAttacked(toX, toY);
}

/**
 * Counts the number of Rooks (4) and Queens (5) the player controls.
 * @returns {number} The total count of Rooks and Queens.
 */
function countMyHunterPieces() {
    let count = 0;
    if (typeof selfId === 'undefined' || selfId === -1) return 0;

    for (let x = 0; x < boardW; x++) {
        for (let y = 0; y < boardH; y++) {
            if (teams[x][y] === selfId && (board[x][y] === 4 || board[x][y] === 5)) {
                count++;
            }
        }
    }
    return count;
}

/**
 * Finds the coordinates of the nearest enemy King (piece type 6).
 * @param {number} fromX - The starting X coordinate.
 * @param {number} fromY - The starting Y coordinate.
 * @returns {Array<number> | null} Coordinates [x, y] of the nearest enemy king, or null if none found.
 */
function findNearestEnemyKing(fromX, fromY) {
    let nearestPos = null;
    let minDistance = Infinity;

    for (let x = 0; x < boardW; x++) {
        for (let y = 0; y < boardH; y++) {
            // Check for King (6) that is NOT ours and NOT neutral (0)
            if (board[x][y] === 6 && teams[x][y] !== selfId && teams[x][y] !== 0) {
                const dist = manhattanDistance(fromX, fromY, x, y);
                if (dist < minDistance) {
                    minDistance = dist;
                    nearestPos = [x, y];
                }
            }
        }
    }
    return nearestPos;
}


/**
 * Finds the coordinates of the nearest *prioritized* neutral (Team 0) piece.
 * Priority: Queens/Rooks > Other Pieces. Distance breaks ties within priority.
 * @param {number} fromX - The starting X coordinate.
 * @param {number} fromY - The starting Y coordinate.
 * @returns {Array<number> | null} Coordinates [x, y] of the best neutral target, or null if none found.
 */
function findPrioritizedNearestNeutralPiece(fromX, fromY) {
    let bestHighPriorityTarget = { pos: null, dist: Infinity }; // Rooks (4), Queens (5)
    let bestLowPriorityTarget = { pos: null, dist: Infinity };  // Others (1, 2, 3, 6)

    for (let x = 0; x < boardW; x++) {
        for (let y = 0; y < boardH; y++) {
            // Team 0 is assumed to be neutral/white/unclaimed
            if (teams[x][y] === 0 && board[x][y] !== 0) {
                const pieceType = board[x][y];
                const dist = manhattanDistance(fromX, fromY, x, y);

                // Check if it's a high-priority target (Rook or Queen)
                if (pieceType === 4 || pieceType === 5) {
                    if (dist < bestHighPriorityTarget.dist) {
                        bestHighPriorityTarget.dist = dist;
                        bestHighPriorityTarget.pos = [x, y];
                    }
                } else { // Low priority target
                    if (dist < bestLowPriorityTarget.dist) {
                        bestLowPriorityTarget.dist = dist;
                        bestLowPriorityTarget.pos = [x, y];
                    }
                }
            }
        }
    }

    // Return the high-priority target if found, otherwise the low-priority one
    if (bestHighPriorityTarget.pos) {
        // console.log(`Prioritized Neutral Target: High Prio [${bestHighPriorityTarget.pos}] at dist ${bestHighPriorityTarget.dist}`);
        return bestHighPriorityTarget.pos;
    } else if (bestLowPriorityTarget.pos) {
        // console.log(`Prioritized Neutral Target: Low Prio [${bestLowPriorityTarget.pos}] at dist ${bestLowPriorityTarget.dist}`);
        return bestLowPriorityTarget.pos;
    }

    return null; // No neutral pieces found
}


/**
 * The main logic function for the bot, run periodically.
 */
function basicBotTurnLogic() {
    // --- Pre-computation Checks ---
    if (gameOver || typeof selfId === 'undefined' || selfId === -1 || typeof board === 'undefined' || typeof teams === 'undefined' || typeof generateLegalMoves === 'undefined' || typeof send === 'undefined' || typeof boardW === 'undefined' || typeof curMoveCooldown === 'undefined') {
        return; // Not ready
    }
    if (curMoveCooldown > 220) {
        return; // On cooldown
    }

    let actionTakenThisTurn = false; // Flag to prevent multiple actions
    const pieceMovesCache = {}; // Cache moves for potential reuse

    // --- Priority 1: King Safety ---
    const myKings = findMyKings();
    for (const kingPos of myKings) {
        const [kingX, kingY] = kingPos;
        if (isSquareAttacked(kingX, kingY)) {
            console.log(`BasicBot: King at ${kingX},${kingY} is under attack! Finding safe move.`);
            try {
                const kingMoves = generateLegalMoves(kingX, kingY, board, teams);
                let safeMove = null;
                let desperationMove = null;
                for (const move of kingMoves) { // Find best escape
                    const [toX, toY] = move;
                    if (teams[toX]?.[toY] === selfId) continue;
                    if (!isSquareAttacked(toX, toY)) { safeMove = move; break; }
                    else if (!desperationMove) { desperationMove = move; }
                }
                if (safeMove) { // Execute safe move
                    console.log(`BasicBot: Moving King from ${kingX},${kingY} to SAFE square ${safeMove[0]},${safeMove[1]}.`);
                    send(new Uint16Array([kingX, kingY, safeMove[0], safeMove[1]]));
                    actionTakenThisTurn = true;
                } else if (desperationMove) { // Execute desperation move
                    console.warn(`BasicBot: No safe escape! Moving King from ${kingX},${kingY} to potentially UNSAFE square ${desperationMove[0]},${desperationMove[1]}.`);
                    send(new Uint16Array([kingX, kingY, desperationMove[0], desperationMove[1]]));
                    actionTakenThisTurn = true;
                } else { console.error(`BasicBot: King at ${kingX},${kingY} attacked, NO legal moves!`); }
            } catch (e) { console.error(`BasicBot: Error processing King escape @ ${kingX},${kingY}:`, e); }
            if (actionTakenThisTurn) return; // End turn
        }
    }

    // --- Priority 2: Standard Capture Opportunity ---
    if (actionTakenThisTurn) return;
    for (let x = 0; x < boardW; x++) {
        for (let y = 0; y < boardH; y++) {
            if (teams[x]?.[y] === selfId && board[x][y] !== 0 && board[x][y] !== 6) { // Our piece, not King
                const pieceType = board[x][y];
                try {
                    const legalMoves = pieceMovesCache[`${x},${y}`] || generateLegalMoves(x, y, board, teams);
                    if (!pieceMovesCache[`${x},${y}`]) pieceMovesCache[`${x},${y}`] = legalMoves;

                    for (const move of legalMoves) {
                        const [toX, toY] = move;
                        const targetPiece = board[toX]?.[toY];
                        const targetTeam = teams[toX]?.[toY];

                        // Is it a capture of an enemy piece?
                        if (targetPiece !== 0 && targetTeam !== selfId && targetTeam !== 0) {
                            // ** Hunter Safety Check for Capture **
                            if (pieceType === 4 || pieceType === 5) { // Is the capturing piece a Rook or Queen?
                                if (!isHunterMoveSafe(toX, toY)) {
                                     console.log(`BasicBot: Hunter (${pieceType}) at ${x},${y} avoiding UNSAFE capture at ${toX},${toY}.`);
                                     continue; // Skip this specific capture attempt
                                }
                            }

                            // If safe (or not a hunter), proceed with capture
                            console.log(`BasicBot: Capture! Moving ${pieceType} from ${x},${y} to ${toX},${toY}`);
                            send(new Uint16Array([x, y, toX, toY]));
                            actionTakenThisTurn = true;
                            break; // Exit inner loop (capture found)
                        }
                    }
                } catch (e) { /* Handle error */ }
            }
            if (actionTakenThisTurn) break; // Exit outer loop
        }
        if (actionTakenThisTurn) break; // Exit loops if standard capture made
    }
    if (actionTakenThisTurn) return;


    // --- Priority 3: Lone King Moves Towards Prioritized Neutral (If Safe) ---
    if (actionTakenThisTurn) return;
    const onlyKingLeft = isOnlyKingLeft();
    if (onlyKingLeft && myKings.length > 0) {
        const [kingX, kingY] = myKings[0];
        if (!isSquareAttacked(kingX, kingY)) { // Only if King is currently safe
            const nearestNeutral = findPrioritizedNearestNeutralPiece(kingX, kingY);
            if (nearestNeutral) {
                const [targetX, targetY] = nearestNeutral;
                const targetType = board[targetX]?.[targetY] || '?';
                try {
                    const kingMoves = pieceMovesCache[`${kingX},${kingY}`] || generateLegalMoves(kingX, kingY, board, teams);
                    // Use the modified findBestMoveTowards (though King is not type 2)
                    const bestMove = findBestMoveTowards(6, kingX, kingY, kingMoves, targetX, targetY);
                    if (bestMove) {
                        const [toX, toY] = bestMove;
                        if (!isSquareAttacked(toX, toY)) { // Check destination safety
                            console.log(`BasicBot: Lone King moving from ${kingX},${kingY} to SAFE square ${toX},${toY} towards neutral type ${targetType}.`);
                            send(new Uint16Array([kingX, kingY, toX, toY]));
                            actionTakenThisTurn = true;
                        } else { /* console.log(`BasicBot: Lone King best move to ${toX},${toY} is UNSAFE. Holding.`); */ }
                    }
                } catch (e) { console.error(`BasicBot: Error processing Lone King move towards neutral:`, e); }
            }
        }
    }
    if (actionTakenThisTurn) return;

    // --- Priority 4: Idle Pieces Move Towards Prioritized Neutral ---
    if (actionTakenThisTurn) return;
    if (onlyKingLeft) return; // Don't run if only king left

    for (let x = 0; x < boardW; x++) {
        for (let y = 0; y < boardH; y++) {
            if (teams[x]?.[y] === selfId && board[x][y] !== 0 && board[x][y] !== 6) { // Our piece, not King
                 const pieceType = board[x][y];
                try {
                    const legalMoves = pieceMovesCache[`${x},${y}`] || generateLegalMoves(x, y, board, teams);
                    if (!pieceMovesCache[`${x},${y}`]) pieceMovesCache[`${x},${y}`] = legalMoves;

                    if (isPieceIdle(x, y, legalMoves)) { // Check if idle first
                        const nearestNeutral = findPrioritizedNearestNeutralPiece(x, y);
                        if (nearestNeutral) {
                            const [targetX, targetY] = nearestNeutral;
                            const targetType = board[targetX]?.[targetY] || '?';
                            // Use the modified findBestMoveTowards
                            const bestMove = findBestMoveTowards(pieceType, x, y, legalMoves, targetX, targetY);
                            if (bestMove) {
                                const [toX, toY] = bestMove;

                                // ** Hunter Safety Check for Idle Move **
                                if (pieceType === 4 || pieceType === 5) { // Is the moving piece a Rook or Queen?
                                    if (!isHunterMoveSafe(toX, toY)) {
                                        console.log(`BasicBot: Hunter (${pieceType}) at ${x},${y} avoiding move to UNSAFE idle target square ${toX},${toY}.`);
                                        continue; // Skip moving this piece this turn, maybe another idle piece can move.
                                    }
                                }

                                // If safe (or not a hunter), proceed with move
                                console.log(`BasicBot: Moving idle piece ${pieceType} from ${x},${y} to ${toX},${toY} towards neutral type ${targetType}.`);
                                send(new Uint16Array([x, y, toX, toY]));
                                actionTakenThisTurn = true;
                                break; // Exit inner loop (idle piece moved)
                            }
                        }
                    }
                } catch (e) { /* Handle error */ }
            }
            if (actionTakenThisTurn) break; // Exit outer loop
        }
        if (actionTakenThisTurn) break; // Exit loops if idle piece moved
    }

    // if (!actionTakenThisTurn) console.log("BasicBot: No actions taken this cycle.");
}


// --- startBasicBot and stopBasicBot functions remain the same ---

/**
 * Starts the bot's periodic execution.
 */
function startBasicBot(intervalMs = 300) {
    if (basicBotInterval) { console.log("BasicBot: Already running."); return; }
    if (typeof selfId === 'undefined' || selfId === -1) {
         console.warn("BasicBot: Cannot start, game not fully initialized (selfId unknown). Try again shortly.");
         setTimeout(() => startBasicBot(intervalMs), 2000); return;
    }
    console.log(`BasicBot: Starting bot with ${intervalMs}ms interval. R/Q safety enabled.`);
    if (basicBotInterval) clearInterval(basicBotInterval);
    basicBotInterval = setInterval(basicBotTurnLogic, intervalMs);
}

/**
 * Stops the bot's periodic execution.
 */
function stopBasicBot() {
    if (basicBotInterval) { console.log("BasicBot: Stopping bot."); clearInterval(basicBotInterval); basicBotInterval = null; }
    else { console.log("BasicBot: Bot is not running."); }
}

startBasicBot()