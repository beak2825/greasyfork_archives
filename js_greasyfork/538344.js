// ==UserScript==
// @name         Chess.com Bot Pro
// @namespace    ChessBotPro
// @version      3.0.0
// @description  Bot avançado para Chess.com com múltiplas funcionalidades
// @author       Perplexity AI
// @match        https://www.chess.com/play/*
// @match        https://www.chess.com/game/*
// @match        https://www.chess.com/puzzles/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/9.0.0/stockfish.js
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/538344/Chesscom%20Bot%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/538344/Chesscom%20Bot%20Pro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class ChessBot {
        constructor() {
            this.engine = null;
            this.isThinking = false;
            this.autoRun = false;
            this.trainingMode = false;
            this.delay = 1.0;
            this.depth = 15;
            this.moveHistory = [];
            this.currentBestMoves = [];
            this.currentEval = '--';
            this.init();
        }

        init() {
            this.initEngine();
            this.setupUI();
            this.setupEventListeners();
            this.mainLoop();
        }

        initEngine() {
            if (this.engine) this.engine.terminate();
            this.engine = new Worker(URL.createObjectURL(new Blob([GM_getResourceText('stockfish.js')], {type: 'application/javascript'})));
            
            this.engine.onmessage = (e) => {
                this.handleEngineMessage(e.data);
            };

            this.engine.postMessage('uci');
            this.engine.postMessage('setoption name Skill Level value 20');
            this.engine.postMessage('ucinewgame');
        }

        handleEngineMessage(data) {
            if (data.startsWith('info')) {
                this.parseEvaluation(data);
                this.parseBestMoves(data);
            }

            if (data.startsWith('bestmove')) {
                const move = data.split(' ')[1];
                this.processBestMove(move);
            }
        }

        parseEvaluation(data) {
            const evalMatch = data.match(/score (cp|mate) ([-\d]+)/);
            if (evalMatch) {
                const [_, type, value] = evalMatch;
                this.currentEval = type === 'cp' 
                    ? `${(value / 100).toFixed(1)} pawns` 
                    : `Mate in ${Math.abs(value)}`;
                this.updateUI();
            }
        }

        parseBestMoves(data) {
            const pvMatch = data.match(/pv (\S+)/);
            if (pvMatch) {
                this.currentBestMoves = pvMatch[1].split(' ').slice(0, 3);
                this.updateUI();
            }
        }

        processBestMove(move) {
            this.isThinking = false;
            this.addToHistory(move);
            this.highlightMove(move);
            
            if (this.autoRun && !this.trainingMode) {
                this.makeMove(move);
            }
        }

        async makeMove(move) {
            const [from, to] = this.splitMove(move);
            await this.simulateHumanClick(from);
            await new Promise(resolve => setTimeout(resolve, 500));
            await this.simulateHumanClick(to);
        }

        splitMove(move) {
            return [move.substring(0,2), move.substring(2,4)];
        }

        async simulateHumanClick(square) {
            const element = $(`div[data-square="${square}"]`);
            if (element.length) {
                element[0].dispatchEvent(new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true
                }));
            }
        }

        addToHistory(move) {
            this.moveHistory.push(move);
            if (this.moveHistory.length > 10) this.moveHistory.shift();
            this.updateUI();
        }

        highlightMove(move) {
            $('.chessbot-highlight').removeClass('chessbot-highlight');
            $(`div[data-square="${move.substring(0,2)}"], div[data-square="${move.substring(2,4)}"]`)
                .addClass('chessbot-highlight');
        }

        updateUI() {
            $('#chessbot-eval').text(`Avaliação: ${this.currentEval}`);
            $('#chessbot-topmoves').text(`Melhores lances: ${this.currentBestMoves.join(', ')}`);
            $('#chessbot-history').html(this.moveHistory.map(m => `<li>${m}</li>`).join(''));
        }

        setupUI() {
            GM_addStyle(`
                #chessbot-panel {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #1a1a1a;
                    color: #fff;
                    padding: 15px;
                    border-radius: 10px;
                    z-index: 99999;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.3);
                    min-width: 250px;
                }
                .chessbot-highlight {
                    background: rgba(255,255,0,0.3) !important;
                }
                #chessbot-history {
                    max-height: 150px;
                    overflow-y: auto;
                    margin: 10px 0;
                    padding: 0;
                    list-style: none;
                }
                .chessbot-btn {
                    background: #404040;
                    border: none;
                    color: #fff;
                    padding: 8px 15px;
                    margin: 5px;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: 0.3s;
                }
                .chessbot-btn.active {
                    background: #4CAF50;
                }
            `);

            $('body').append(`
                <div id="chessbot-panel">
                    <h3 style="margin:0 0 10px 0">ChessBot Pro</h3>
                    <div id="chessbot-eval">Avaliação: --</div>
                    <div id="chessbot-topmoves">Melhores lances: --</div>
                    <ul id="chessbot-history"></ul>
                    <div>
                        <button class="chessbot-btn" id="chessbot-autorun">Autorun: OFF</button>
                        <button class="chessbot-btn" id="chessbot-train">Modo Treino: OFF</button>
                    </div>
                    <div>
                        <input type="number" id="chessbot-depth" value="15" min="1" max="25" style="width:60px;">
                        <button class="chessbot-btn" id="chessbot-setdepth">Set Depth</button>
                    </div>
                </div>
            `);
        }

        setupEventListeners() {
            $('#chessbot-autorun').click(() => this.toggleAutoRun());
            $('#chessbot-train').click(() => this.toggleTrainingMode());
            $('#chessbot-setdepth').click(() => this.setDepth());
            
            document.addEventListener('keydown', (e) => {
                if (e.key === 'a') this.toggleAutoRun();
                if (e.key === 't') this.toggleTrainingMode();
            });
        }

        toggleAutoRun() {
            this.autoRun = !this.autoRun;
            $('#chessbot-autorun')
                .text(`Autorun: ${this.autoRun ? 'ON' : 'OFF'}`)
                .toggleClass('active', this.autoRun);
        }

        toggleTrainingMode() {
            this.trainingMode = !this.trainingMode;
            $('#chessbot-train')
                .text(`Modo Treino: ${this.trainingMode ? 'ON' : 'OFF'}`)
                .toggleClass('active', this.trainingMode);
        }

        setDepth() {
            this.depth = Math.min(25, Math.max(1, parseInt($('#chessbot-depth').val())));
            $('#chessbot-depth').val(this.depth);
        }

        getFEN() {
            return $('chess-board')[0]?.game?.getFEN() || '';
        }

        mainLoop() {
            setInterval(() => {
                if (this.shouldAnalyze()) {
                    this.analyzePosition();
                }
            }, this.delay * 1000);
        }

        shouldAnalyze() {
            return !this.isThinking && 
                   this.autoRun && 
                   !this.isGameEnded() && 
                   this.isPlayerTurn();
        }

        isPlayerTurn() {
            const fen = this.getFEN();
            return fen.split(' ')[1] === (this.trainingMode ? 'w' : 'b');
        }

        isGameEnded() {
            return $('.game-over').length > 0;
        }

        analyzePosition() {
            this.isThinking = true;
            this.engine.postMessage(`position fen ${this.getFEN()}`);
            this.engine.postMessage(`go depth ${this.depth}`);
        }
    }

    // Inicialização
    window.addEventListener('load', () => new ChessBot());
})();
