// ==UserScript==
/*
 * Copyright (c) 2025 qbaonguyen050@gmail.com / proprietary
 * All rights reserved.
 *
 * This code is proprietary and confidential.
 *
 * 1. USE: You are permitted to execute and use this software for personal purposes.
 * 2. MODIFICATION: You are NOT permitted to modify, merge, publish, distribute,
 *    sublicense, and/or sell copies of this software.
 * 3. DISTRIBUTION: You are NOT permitted to distribute this software or derivative
 *    works of this software.
 */
// @name         Chess.com Stockfish Bot
// @namespace    BottleOrg Scripts
// @version      2.2
// @description  Uses unsafeWindow to read game state & dual APIs for reliability
// @author       BottleOrg / Optimized by Assistant
// @match        https://www.chess.com/play/*
// @match        https://www.chess.com/game/*
// @match        https://www.chess.com/puzzles/*
// @icon         https://www.chess.com/bundles/web/images/offline-play/standardboard.1d6f9426.png
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @run-at       document-start
// @license      All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/526240/Chesscom%20Stockfish%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/526240/Chesscom%20Stockfish%20Bot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        primaryApi: "https://chess-api.com/v1",
        backupApi: "https://stockfish.online/api/s/v2.php",
        version: '4.7.0'
    };

    const STATE = {
        isCoach: false,
        isMove: false,
        isAutoMatch: false,
        isDebug: false,
        depth: 13,
        isThinking: false,
        lastFen: "",
        boardFound: false
    };

    let arrowLayer = null;

    function log(msg, style = "color: #81b64c; font-weight: bold;") {
        console.log(`%c[SF Bot] ${msg}`, style);
    }

    log(`Initializing v${CONFIG.version}...`);

    // --- 1. VISUALS ---

    function createArrowLayer() {
        if (document.getElementById('stockfish-arrows')) return;
        arrowLayer = document.createElement('div');
        arrowLayer.id = 'stockfish-arrows';
        arrowLayer.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            pointer-events: none; z-index: 9999;
        `;
        document.body.appendChild(arrowLayer);
    }

    function clearArrows() {
        if (arrowLayer) arrowLayer.innerHTML = '';
    }

    function drawArrow(fromSq, toSq) {
        createArrowLayer();
        clearArrows();
        const start = getSquareCoords(fromSq);
        const end = getSquareCoords(toSq);
        if (!start || !end) return;

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.style.cssText = "width: 100%; height: 100%; position: absolute; left: 0; top: 0;";

        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", start.x);
        line.setAttribute("y1", start.y);
        line.setAttribute("x2", end.x);
        line.setAttribute("y2", end.y);
        line.setAttribute("stroke", "#81b64c");
        line.setAttribute("stroke-width", "16");
        line.setAttribute("stroke-opacity", "0.7");
        line.setAttribute("stroke-linecap", "round");

        svg.appendChild(line);
        arrowLayer.appendChild(svg);
    }

    function showDebugDot(x, y, color = 'red') {
        if (!STATE.isDebug) return;
        const dot = document.createElement('div');
        dot.style.cssText = `
            position: fixed; left: ${x-5}px; top: ${y-5}px; width: 10px; height: 10px;
            background: ${color}; border-radius: 50%; z-index: 100000; pointer-events: none;
            transition: opacity 0.5s; box-shadow: 0 0 3px white;
        `;
        document.body.appendChild(dot);
        setTimeout(() => { dot.style.opacity = 0; setTimeout(() => dot.remove(), 500); }, 500);
    }

    // --- 2. GEOMETRY & ACCESS ---

    // Attempt to find the board in both standard DOM and unsafeWindow (Sandbox escape)
    function getBoard() {
        let board = document.querySelector('wc-chess-board') || document.querySelector('chess-board') || document.getElementById('board-single');

        // If we found the element but it has no 'game' property, try unsafeWindow
        if (board && !board.game && window.unsafeWindow) {
            const unsafeBoard = unsafeWindow.document.querySelector('wc-chess-board') || unsafeWindow.document.querySelector('chess-board');
            if (unsafeBoard && unsafeBoard.game) {
                return unsafeBoard;
            }
        }
        return board;
    }

    function getBoardOrientation() {
        const board = getBoard();
        if (!board) return 'white';

        if (board.game && board.game.getPlayingAs) {
            const p = board.game.getPlayingAs();
            return (p === 'b' || p === 2) ? 'black' : 'white';
        }
        if (board.classList.contains('flipped')) return 'black';

        const coords = document.querySelectorAll('.coordinates text, .coords-component text');
        for(let c of coords) {
            if(c.textContent === '1') return c.getBoundingClientRect().top < board.getBoundingClientRect().top + 100 ? 'black' : 'white';
        }
        return 'white';
    }

    function getSquareCoords(square) {
        const board = document.querySelector('wc-chess-board') || document.querySelector('chess-board'); // Use standard DOM for coords
        if (!board) return null;

        const rect = board.getBoundingClientRect();
        if (rect.width < 10) return null;

        const size = rect.width / 8;
        const file = square.charCodeAt(0) - 97;
        const rank = square.charCodeAt(1) - 49;
        const isBlack = getBoardOrientation() === 'black';

        let xIdx = isBlack ? (7 - file) : file;
        let yIdx = isBlack ? rank : (7 - rank);

        let x = rect.left + (xIdx * size) + (size / 2);
        let y = rect.top + (yIdx * size) + (size / 2);

        return { x, y };
    }

    // --- 3. CLICK EXECUTION ---

    function fireEventsAt(x, y) {
        const candidates = document.elementsFromPoint(x, y);
        let target = null;

        target = candidates.find(el => el.classList.contains('piece') || el.getAttribute('data-piece'));
        if (!target) target = candidates.find(el => el.classList.contains('hint') || el.classList.contains('square') || el.tagName.includes('CHESS'));
        if (!target) target = candidates[0];

        if (!target) return;

        showDebugDot(x, y, target.classList.contains('piece') ? 'green' : 'red');

        // Use real window for event view
        const win = target.ownerDocument.defaultView || window;

        const opts = {
            bubbles: true, cancelable: true, view: win,
            clientX: x, clientY: y, button: 0, buttons: 1
        };

        target.dispatchEvent(new PointerEvent('pointerdown', opts));
        target.dispatchEvent(new MouseEvent('mousedown', opts));
        target.dispatchEvent(new PointerEvent('pointerup', opts));
        target.dispatchEvent(new MouseEvent('mouseup', opts));
        target.dispatchEvent(new MouseEvent('click', opts));
    }

    function movePiece(from, to) {
        const start = getSquareCoords(from);
        const end = getSquareCoords(to);
        if (!start || !end) return;

        fireEventsAt(start.x, start.y);

        setTimeout(() => {
            fireEventsAt(end.x, end.y);
            setTimeout(() => {
                const promoQueens = document.querySelectorAll('.promotion-piece.wq, .promotion-piece.bq');
                if(promoQueens.length > 0) promoQueens[0].click();
            }, 150);
        }, 150 + Math.random() * 80);
    }

    // --- 4. API & ENGINE ---

    function isValidFen(fen) {
        if (!fen || typeof fen !== 'string') return false;
        const parts = fen.trim().split(/\s+/);
        return parts.length >= 6;
    }

    function fetchPrimary(fen) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: CONFIG.primaryApi,
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify({
                    fen: fen,
                    depth: Math.min(STATE.depth, 18),
                    maxThinkingTime: 200
                }),
                onload: (res) => {
                    try {
                        const d = JSON.parse(res.responseText);
                        if (d.move) resolve(d.move);
                        else reject("Missing move");
                    } catch (e) { reject(e); }
                },
                onerror: reject
            });
        });
    }

    function fetchBackup(fen) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `${CONFIG.backupApi}?fen=${encodeURIComponent(fen)}&depth=${STATE.depth}`,
                onload: (res) => {
                    try {
                        const d = JSON.parse(res.responseText);
                        if (d.success) resolve(d.bestmove.split(' ')[1]);
                        else reject("Backup API failed");
                    } catch (e) { reject(e); }
                },
                onerror: reject
            });
        });
    }

    async function fetchMove(fen) {
        try {
            return await fetchPrimary(fen);
        } catch (err) {
            log("Primary failed, using Backup...", "color:orange");
            return await fetchBackup(fen);
        }
    }

    function mainLoop() {
        if ((!STATE.isCoach && !STATE.isMove) || STATE.isThinking) return;

        const board = getBoard();

        if (!board) {
            if (STATE.boardFound) { log("Board lost!", "color:red"); STATE.boardFound = false; }
            return;
        }

        if (!STATE.boardFound) {
            log("Board connected.", "color:green");
            STATE.boardFound = true;
        }

        // Turn Detection
        let isMyTurn = false;

        // 1. Try API
        if (board.game && board.game.getTurn && board.game.getPlayingAs) {
            isMyTurn = board.game.getTurn() === board.game.getPlayingAs();
        }
        // 2. Try DOM Fallback (Clock)
        else {
            const bottomClock = document.querySelector('.clock-bottom');
            if (bottomClock && bottomClock.classList.contains('clock-player-turn')) isMyTurn = true;
        }

        if (!isMyTurn) {
            STATE.lastFen = "";
            if (arrowLayer) clearArrows();
            return;
        }

        // FEN Extraction
        let fen = "";
        if (board.game && board.game.getFEN) {
            fen = board.game.getFEN();
        } else {
            // Silent fail for now, will retry next loop
            return;
        }

        if (fen === STATE.lastFen || !isValidFen(fen)) return;

        STATE.isThinking = true;
        updateStatus('Thinking...');

        fetchMove(fen).then(move => {
            // Sanity check turn
            if(board.game && board.game.getFEN() !== fen) {
                STATE.isThinking = false; return;
            }

            STATE.lastFen = fen;
            STATE.isThinking = false;
            updateStatus('Ready');

            const f = move.substring(0, 2);
            const t = move.substring(2, 4);

            if (STATE.isMove) movePiece(f, t);
            if (STATE.isCoach) drawArrow(f, t);

        }).catch(err => {
            STATE.isThinking = false;
            if(err !== "Missing move") {
                updateStatus('Error');
                log("Engine Error: " + err, "color:red");
            }
        });
    }

    // --- 5. GUI ---

    function buildGUI() {
        const id = 'stockfish-gui-v47';
        if (document.getElementById(id)) return;

        const div = document.createElement('div');
        div.id = id;
        div.style.cssText = `
            position: fixed; top: 80px; right: 20px; width: 210px;
            background: #1e1e1e; border: 1px solid #3a3a3a; border-radius: 6px;
            color: #e0e0e0; font-family: 'Segoe UI', sans-serif; font-size: 12px;
            z-index: 100000; box-shadow: 0 4px 15px rgba(0,0,0,0.5);
        `;

        div.innerHTML = `
            <div style="padding:8px 12px; background:#252525; border-bottom:1px solid #3a3a3a; font-weight:600; display:flex; align-items:center; gap:10px; cursor:move;" id="${id}-drag">
                <div id="bot-status" style="width:8px; height:8px; background:#555; border-radius:50%;"></div>
                <span>SF Sandbox v${CONFIG.version}</span>
            </div>
            <div style="padding:12px;">
                <div style="display:flex; flex-direction:column; gap:8px;">
                    <label style="display:flex;align-items:center;cursor:pointer;">
                        <input type="checkbox" id="chk-coach" style="margin-right:8px; accent-color:#81b64c;"> Coach Mode (Arrows)
                    </label>
                    <label style="display:flex;align-items:center;cursor:pointer;">
                        <input type="checkbox" id="chk-move" style="margin-right:8px; accent-color:#81b64c;"> Auto Move
                    </label>
                    <label style="display:flex;align-items:center;cursor:pointer;">
                        <input type="checkbox" id="chk-match" style="margin-right:8px; accent-color:#81b64c;"> Auto New Game
                    </label>
                    <label style="display:flex;align-items:center;cursor:pointer;color:#888;">
                        <input type="checkbox" id="chk-debug" style="margin-right:8px; accent-color:#81b64c;"> Debug Clicks
                    </label>
                </div>
                <div style="margin-top:12px; padding-top:10px; border-top:1px solid #3a3a3a; display:flex; justify-content:space-between; align-items:center;">
                    <span>Depth: <b id="val-depth" style="color:#81b64c;">13</b></span>
                    <div style="display:flex; gap:4px;">
                        <button id="btn-dm" style="background:#333;color:#fff;border:none;width:24px;height:24px;border-radius:4px;cursor:pointer;font-weight:bold;">-</button>
                        <button id="btn-dp" style="background:#333;color:#fff;border:none;width:24px;height:24px;border-radius:4px;cursor:pointer;font-weight:bold;">+</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(div);

        const bind = (id, key) => document.getElementById(id).onchange = e => STATE[key] = e.target.checked;
        bind('chk-coach', 'isCoach');
        bind('chk-move', 'isMove');
        bind('chk-match', 'isAutoMatch');
        bind('chk-debug', 'isDebug');

        document.getElementById('chk-coach').onchange = (e) => { STATE.isCoach = e.target.checked; if(!e.target.checked) clearArrows(); };
        document.getElementById('btn-dm').onclick = () => { STATE.depth = Math.max(1, STATE.depth-1); document.getElementById('val-depth').innerText = STATE.depth; };
        document.getElementById('btn-dp').onclick = () => { STATE.depth = Math.min(18, STATE.depth+1); document.getElementById('val-depth').innerText = STATE.depth; };

        const head = document.getElementById(`${id}-drag`);
        let isDrag = false, sX, sY, iL, iT;
        head.onmousedown = e => { isDrag = true; sX = e.clientX; sY = e.clientY; const r = div.getBoundingClientRect(); iL = r.left; iT = r.top; };
        document.onmousemove = e => { if (isDrag) { div.style.left = (iL + e.clientX - sX) + 'px'; div.style.top = (iT + e.clientY - sY) + 'px'; }};
        document.onmouseup = () => { isDrag = false; };
    }

    function updateStatus(status) {
        const el = document.getElementById('bot-status');
        if (!el) return;
        const colors = { 'Thinking...': '#f1c40f', 'Ready': '#2ecc71', 'Error': '#e74c3c' };
        el.style.backgroundColor = colors[status] || '#555';
    }

    function autoMatch() {
        if (!STATE.isAutoMatch) return;
        const btn = document.querySelector('.game-over-modal button.cc-button-primary, .game-over-controls button.ui_v5-button-primary');
        if (btn) setTimeout(() => btn.click(), 2000);
    }

    function init() {
        const check = setInterval(() => {
            if (document.body) {
                clearInterval(check);
                buildGUI();
                setInterval(mainLoop, 200);
                setInterval(autoMatch, 1000);
            }
        }, 100);
    }

    init();

})();