// ==UserScript==
// @name        chess bot
// @namespace   bxcksy
// @license MIT
// @author      bxcksy
// @version     8.2.5
// @homepageURL https://github.com/sayfpack13/chess-analysis-bot
// @supportURL  https://mmgc.life/
// @match       https://www.chess.com/*
// @match       https://lichess.org/*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @grant       GM_getResourceText
// @grant       GM_registerMenuCommand
// @description 	Our chess analysis system is designed to give players the edge they need to win. By using advanced algorithms and cutting-edge technology, our system can analyze any chess position and suggest the best possible move, helping players to make smarter and more informed decisions on the board.
// @description:fr 	Notre système d'analyse d'échecs est conçu pour donner aux joueurs l'avantage dont ils ont besoin pour gagner. En utilisant des algorithmes avancés et des technologies de pointe, notre système peut analyser n'importe quelle position d'échecs et suggérer le meilleur coup possible, aidant les joueurs à prendre des décisions plus intelligentes et plus éclairées sur l'échiquier.
// @require     https://greasyfork.org/scripts/460400-usergui-js/code/userguijs.js?version=1157130
// @resource    jquery.js       	https://cdn.jsdelivr.net/npm/jquery@3.6.3/dist/jquery.min.js
// @resource    chessboard.js   	https://raw.githubusercontent.com/sayfpack13/chess-analysis-bot/main/tampermonkey%20script/content/chessboard.js
// @resource    chessboard.css  	https://raw.githubusercontent.com/sayfpack13/chess-analysis-bot/main/tampermonkey%20script/content/chessboard.css
// @resource    lozza.js        	https://raw.githubusercontent.com/sayfpack13/chess-analysis-bot/main/tampermonkey%20script/content/lozza.js
// @resource    stockfish-5.js  	https://raw.githubusercontent.com/sayfpack13/chess-analysis-bot/main/tampermonkey%20script/content/stockfish-5.js
// @resource    stockfish-2018.js   https://raw.githubusercontent.com/sayfpack13/chess-analysis-bot/main/tampermonkey%20script/content/stockfish-2018.js
// @run-at      document-start
// @inject-into content
// @downloadURL https://update.greasyfork.org/scripts/466846/chess%20bot.user.js
// @updateURL https://update.greasyfork.org/scripts/466846/chess%20bot.meta.js
// ==/UserScript==



// VARS
const repositoryRawURL = 'https://raw.githubusercontent.com/sayfpack13/chess-analysis-bot/main/tampermonkey%20script';
const LICHESS_API = "https://lichess.org/api/cloud-eval";
const CHESS_COM = 0;
const LICHESS_ORG = 1;
const TURN_UPDATE_FIX = false;


const MAX_DEPTH = 20;
const MIN_DEPTH = 1;
const MAX_MOVETIME = 2000;
const MIN_MOVETIME = 50;
const MAX_ELO = 3500;
const DEPTH_MODE = 0;
const MOVETIME_MODE = 1;
const rank = ["Beginner", "Intermediate", "Advanced", "Expert", "Master", "Grand Master"];




var nightMode = false;
var engineMode = 0;                                         // engine mode (0:depth / 1:movetime)
var engineIndex = 0;                                        // engine index (lozza => 0, stockfish => 1...)
var reload_every = 10;                                      // reload engine after x moves
var reload_engine = false;                                      // reload engine
var enableUserLog = true;                                   // enable interface log
var enableEngineLog = true;                                 // enable engine log
var displayMovesOnSite = false;                              // display moves on chess board
var show_opposite_moves = false;                            // show opponent best moves if available
var use_book_moves = false;                                 // use lichess api to get book moves
var node_engine_url = "http://localhost:5000";              // node server api url
var node_engine_name = "stockfish-15.exe"                   // default engine name (node server engine only)
var current_depth = Math.round(MAX_DEPTH / 2);              // current engine depth
var current_movetime = Math.round(MAX_MOVETIME / 3);        // current engine move time
var max_best_moves = 1;

var lastBestMoveID = 0;



const dbValues = {
    nightMode: 'nightMode',
    engineMode: 'engineMode',
    engineIndex: 'engineIndex',
    reload_every: 'reload_every',
    reload_engine: 'reload_engine',
    enableUserLog: 'enableUserLog',
    enableEngineLog: 'enableEngineLog',
    displayMovesOnSite: 'displayMovesOnSite',
    show_opposite_moves: "show_opposite_moves",
    use_book_moves: "use_book_moves",
    node_engine_url: "node_engine_url",
    node_engine_name: "node_engine_name",
    current_depth: "current_depth",
    current_movetime: "current_movetime",
    max_best_moves: "max_best_moves"
};


var Gui;
var closedGui = false;
var reload_count = 1;
var node_engine_id = 3;
var Interface = null;
var LozzaUtils = null;
var CURRENT_SITE = null;
var boardElem = null;
var firstPieceElem = null;
const MAX_LOGS = 50;


var initialized = false;
var firstMoveMade = false;

var forcedBestMove = false;
var engine = null;
var engineObjectURL = null;
var lastEngine = engineIndex;

var chessBoardElem = null;
var turn = '-';
var last_turn = null;
var playerColor = null;
var lastPlayerColor = null;
var isPlayerTurn = null;
var lastFen = null;

var uiChessBoard = null;

var activeGuiMoveHighlights = [];
var activeSiteMoveHighlights = [];

var engineLogNum = 1;
var userscriptLogNum = 1;
var enemyScore = 0;
var myScore = 0;

var possible_moves = [];


// style
const best_move_color = [0, 0, 250, 0.5];
const opposite_best_move_color = [250, 0, 0, 0.5];
const possible_moves_colors = [
    //[r,g,b,a]
    [200, 180, 0, 0.9],
    [150, 180, 0, 0.9],
    [100, 180, 0, 0.9],
    [50, 180, 0, 0.9]
]
const opposite_possible_moves_colors = [
    //[r,g,b,a]
    [250, 200, 200, 0.9],
    [250, 150, 150, 0.9],
    [250, 100, 100, 0.9],
    [250, 50, 50, 0.9]
]
const defaultFromSquareStyle = 'border: 4px solid rgb(0 0 0 / 50%);';
const defaultToSquareStyle = 'border: 4px dashed rgb(0 0 0 / 50%);';


function moveResult(from, to, power, clear = true) {
    if (from.length < 2 || to.length < 2) {
        return;
    }

    if (clear) {
        clearBoard();
    }


    if (!forcedBestMove) {
        if (isPlayerTurn) // my turn
            myScore = myScore + Number(power);
        else
            enemyScore = enemyScore + Number(power);

        Interface.boardUtils.updateBoardPower(myScore, enemyScore);
    } else {
        forcedBestMove = false;
        Gui.document.querySelector('#bestmove-btn').disabled = false;
    }



    // remove duplicated best moves
    possible_moves = removeDuplicates(possible_moves).slice(0, max_best_moves - 1);

    for (let a = 0; a < possible_moves.length; a++) {
        Interface.boardUtils.markMove(possible_moves[a].slice(0, 2), possible_moves[a].slice(2, 4), (isPlayerTurn ? possible_moves_colors[a] : opposite_possible_moves_colors[a]));
    }

    Interface.boardUtils.markMove(from, to, (isPlayerTurn ? best_move_color : opposite_best_move_color));



    Interface.stopBestMoveProcessingAnimation();
}



function getBookMoves(request) {

    GM_xmlhttpRequest({
        method: "GET",
        url: LICHESS_API + "?fen=" + request.fen + "&multiPv=1&variant=fromPosition",
        headers: {
            "Content-Type": "application/json"
        },
        onload: function (response) {
            if (response.response.includes("error") || !response.ok) {
                if (lastBestMoveID != request.id) {
                    return;
                }
                getBestMoves(request);
            } else {
                if (lastBestMoveID != request.id) {
                    return;
                }

                let data = JSON.parse(response.response);
                let nextMove = data.pvs[0].moves.split(' ')[0];



                moveResult(nextMove.slice(0, 2), nextMove.slice(2, 4), current_depth, true);
            }


        }, onerror: function (error) {
            if (lastBestMoveID != request.id) {
                return;
            }
            getBestMoves(request);

        }
    });

}

function getNodeBestMoves(request) {
    GM_xmlhttpRequest({
        method: "GET",
        url: node_engine_url + "/getBestMove?fen=" + request.fen + "&engine_mode=" + engineMode + "&depth=" + current_depth + "&movetime=" + current_movetime + "&turn=" + (last_turn || turn) + "&engine_name=" + node_engine_name,
        headers: {
            "Content-Type": "application/json"
        },
        onload: function (response) {
            if (response.response == "false") {
                return;
            }

            if (lastBestMoveID != request.id) {
                return;
            }


            let data = JSON.parse(response.response);
            let server_fen = data.fen;
            let depth = data.depth;
            let movetime = data.movetime;
            let power = data.score;
            let move = data.move;



            if (engineMode == DEPTH_MODE) {
                Interface.updateBestMoveProgress(`Depth: ${depth}`);
            } else {
                Interface.updateBestMoveProgress(`Move time: ${movetime} ms`);
            }



            moveResult(move.slice(0, 2), move.slice(2, 4), power, true);



        }, onerror: function () {
            Interface.log("check node server !!");
        }
    });

}

function getElo() {
    let elo;
    if (engineMode == DEPTH_MODE) {
        elo = MAX_ELO / MAX_DEPTH;
        elo *= current_depth;
    } else {
        elo = MAX_ELO / MAX_MOVETIME;
        elo *= current_movetime;
    }
    elo = Math.round(elo);

    return elo;
}

function getRank() {
    let part;
    if (engineMode == DEPTH_MODE) {
        part = current_depth / (MAX_DEPTH / rank.length);
    } else {
        part = current_movetime / (MAX_MOVETIME / rank.length);
    }
    part = Math.round(part);

    if (part >= rank.length) {
        part = rank.length - 1;
    }

    return rank[part];
}



function setEloDescription(eloElem) {
    eloElem.querySelector("#value").innerText = `Elo: ${getElo()}`;
    eloElem.querySelector("#rank").innerText = `Rank: ${getRank()}`;
    eloElem.querySelector("#power").innerText = engineMode == DEPTH_MODE ? `Depth: ${current_depth}` : `Move Time: ${current_movetime}`;
}




function isNotCompatibleBrowser() {
    return navigator.userAgent.toLowerCase().includes("firefox")
}

onload = function () {
    if (isNotCompatibleBrowser()) {
        Gui = new UserGui;
    }

}

if (!isNotCompatibleBrowser()) {
    Gui = new UserGui;
} else {
    onload();
}


Gui.settings.window.title = 'Smart Chess Bot';
Gui.settings.window.external = true;
Gui.settings.window.size.width = 500;
Gui.settings.gui.external.popup = false;
Gui.settings.gui.external.style += GM_getResourceText('chessboard.css');
Gui.settings.gui.external.style += `
div[class^='board'] {
    background-color: black;
}
body {
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 360px;
}
#fen {
    margin-left: 10px;
}
#engine-log-container {
    max-height: 35vh;
    overflow: auto!important;
}
#userscript-log-container {
    max-height: 35vh;
    overflow: auto!important;
}
.sideways-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.rendered-form .card {
    margin-bottom: 10px;
}
.hidden {
    display: none;
}
.main-title-bar {
    display: flex;
    justify-content: space-between;
}
@keyframes wiggle {
    0% { transform: scale(1); }
   80% { transform: scale(1); }
   85% { transform: scale(1.1); }
   95% { transform: scale(1); }
  100% { transform: scale(1); }
}

.wiggle {
  display: inline-block;
  animation: wiggle 1s infinite;
}
`;


function alphabetPosition(text) {
    return text.charCodeAt(0) - 97;
}


function FenUtils() {
    this.board = [
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
    ];

    this.pieceCodeToFen = pieceStr => {
        let [pieceColor, pieceName] = pieceStr.split('');

        return pieceColor == 'w' ? pieceName.toUpperCase() : pieceName.toLowerCase();
    }

    this.getFenCodeFromPieceElem = pieceElem => {
        if (CURRENT_SITE == CHESS_COM) {
            return this.pieceCodeToFen([...pieceElem.classList].find(x => x.match(/^(b|w)[prnbqk]{1}$/)));
        } else if (CURRENT_SITE == LICHESS_ORG) {
            let [pieceColor, pieceName] = pieceElem.cgPiece.split(' ');

            // fix pieceName
            if (pieceName == "knight") {
                pieceName = "n"
            }

            let pieceText = pieceColor[0] + pieceName[0];
            return this.pieceCodeToFen(pieceText)
        }
    }

    this.getPieceColor = pieceFenStr => {
        return pieceFenStr == pieceFenStr.toUpperCase() ? 'w' : 'b';
    }

    this.getPieceOppositeColor = pieceFenStr => {
        return this.getPieceColor(pieceFenStr) == 'w' ? 'b' : 'w';
    }

    this.squeezeEmptySquares = fenStr => {
        return fenStr.replace(/11111111/g, '8')
            .replace(/1111111/g, '7')
            .replace(/111111/g, '6')
            .replace(/11111/g, '5')
            .replace(/1111/g, '4')
            .replace(/111/g, '3')
            .replace(/11/g, '2');
    }

    this.posToIndex = pos => {
        let [x, y] = pos.split('');

        return { 'y': 8 - y, 'x': 'abcdefgh'.indexOf(x) };
    }

    this.getBoardPiece = pos => {
        let indexObj = this.posToIndex(pos);

        return this.board[indexObj.y][indexObj.x];
    }

    this.getRights = () => {
        let rights = '';

        // check for white
        let e1 = this.getBoardPiece('e1'),
            h1 = this.getBoardPiece('h1'),
            a1 = this.getBoardPiece('a1');

        if (e1 == 'K' && h1 == 'R') rights += 'K';
        if (e1 == 'K' && a1 == 'R') rights += 'Q';

        //check for black
        let e8 = this.getBoardPiece('e8'),
            h8 = this.getBoardPiece('h8'),
            a8 = this.getBoardPiece('a8');

        if (e8 == 'k' && h8 == 'r') rights += 'k';
        if (e8 == 'k' && a8 == 'r') rights += 'q';

        return rights ? rights : '-';
    }




    this.getBasicFen = () => {
        let pieceElems = null;

        if (CURRENT_SITE == CHESS_COM) {
            pieceElems = [...chessBoardElem.querySelectorAll('.piece')];
        } else if (CURRENT_SITE == LICHESS_ORG) {
            pieceElems = [...chessBoardElem.querySelectorAll('piece')];
        }


        pieceElems.filter(pieceElem => !pieceElem.classList.contains("ghost")).forEach(pieceElem => {
            let pieceFenCode = this.getFenCodeFromPieceElem(pieceElem);



            if (CURRENT_SITE == CHESS_COM) {
                let [xPos, yPos] = pieceElem.classList.toString().match(/square-(\d)(\d)/).slice(1);

                this.board[8 - yPos][xPos - 1] = pieceFenCode;
            } else if (CURRENT_SITE == LICHESS_ORG) {
                let [xPos, yPos] = pieceElem.cgKey.split('');

                this.board[8 - yPos][alphabetPosition(xPos)] = pieceFenCode;
            }
        });

        let basicFen = this.squeezeEmptySquares(this.board.map(x => x.join('')).join('/'));



        return basicFen;
    }


    this.getFen = () => {
        let basicFen = this.getBasicFen();
        let rights = this.getRights();

        return `${basicFen} ${last_turn || turn} ${rights} - 0 1`;
    }
}



function InterfaceUtils() {
    this.boardUtils = {
        findSquareElem: (squareCode) => {
            if (!Gui?.document) return;

            return Gui.document.querySelector(`.square-${squareCode}`);
        },
        markMove: (fromSquare, toSquare, rgba_color) => {
            if (!Gui?.document) return;

            let fromElem = toElem = null;


            if (CURRENT_SITE == CHESS_COM) {
                [fromElem, toElem] = [this.boardUtils.findSquareElem(fromSquare), this.boardUtils.findSquareElem(toSquare)];


                if (!isNotCompatibleBrowser()) {
                    fromElem.style.scale = 0.8;
                    toElem.style.scale = 0.9;
                    fromElem.style.backgroundColor = `rgb(${rgba_color[0]},${rgba_color[1]},${rgba_color[2]})`;
                    toElem.style.backgroundColor = `rgb(${rgba_color[0]},${rgba_color[1]},${rgba_color[2]})`;



                    activeGuiMoveHighlights.push(fromElem);
                    activeGuiMoveHighlights.push(toElem);
                }

            }

            if (displayMovesOnSite || (!isPlayerTurn && show_opposite_moves)) {
                markMoveToSite(fromSquare, toSquare, rgba_color);
            }
        },
        removeBestMarkings: () => {
            if (!Gui?.document) return;

            activeGuiMoveHighlights.forEach(elem => {
                elem.style.scale = 1.0;
                elem.style.backgroundColor = "";
            });

            activeGuiMoveHighlights = [];
        },
        updateBoardFen: fen => {
            if (!Gui?.document) return;

            Gui.document.querySelector('#fen').textContent = fen.slice(0, fen.lastIndexOf('-') - 1);
        },
        updateBoardPower: (myScore, enemyScore) => {
            if (!Gui?.document) return;

            Gui.document.querySelector('#enemy-score').textContent = enemyScore;
            Gui.document.querySelector('#my-score').textContent = myScore;
        },
        updateBoardOrientation: orientation => {
            if (!Gui?.document) return;

            const orientationElem = Gui?.document?.querySelector('#orientation');

            if (orientationElem) {
                orientationElem.textContent = orientation;
            }
        }
    }

    this.engineLog = str => {
        if (!Gui?.document || enableEngineLog == false) return;

        const logElem = document.createElement('div');
        logElem.classList.add('list-group-item');

        if (str.includes('info')) logElem.classList.add('list-group-item-info');
        if (str.includes('bestmove')) logElem.classList.add('list-group-item-success');

        logElem.innerText = `#${engineLogNum++} ${str}`;

        if (engineLogNum > MAX_LOGS) {
            Gui.document.querySelector('#engine-log-container').lastChild.remove();
        }

        Gui.document.querySelector('#engine-log-container').prepend(logElem);


    }

    this.log = str => {
        if (!Gui?.document || enableUserLog == false) return;

        const logElem = document.createElement('div');
        logElem.classList.add('list-group-item');

        if (str.includes('info')) logElem.classList.add('list-group-item-info');
        if (str.includes('bestmove')) logElem.classList.add('list-group-item-success');

        const container = Gui?.document?.querySelector('#userscript-log-container');

        if (container) {
            logElem.innerText = `#${userscriptLogNum++} ${str}`;

            if (userscriptLogNum > MAX_LOGS) {
                container.lastChild.remove();
            }


            container.prepend(logElem);
        }
    }

    this.getBoardOrientation = () => {
        if (CURRENT_SITE == CHESS_COM) {
            return document.querySelector('.board.flipped') ? 'b' : 'w';
        } else if (CURRENT_SITE == LICHESS_ORG) {
            return document.querySelector(".orientation-white") !== null ? 'w' : 'b'
        }

    }

    this.updateBestMoveProgress = text => {
        if (!Gui?.document || isNotCompatibleBrowser() || CURRENT_SITE === LICHESS_ORG) return;

        const progressBarElem = Gui.document.querySelector('#best-move-progress');

        progressBarElem.innerText = text;

        progressBarElem.classList.remove('hidden');
        progressBarElem.classList.add('wiggle');
    }

    this.stopBestMoveProcessingAnimation = () => {
        if (!Gui?.document || isNotCompatibleBrowser() || CURRENT_SITE === LICHESS_ORG) return;

        const progressBarElem = Gui.document.querySelector('#best-move-progress');

        progressBarElem.classList.remove('wiggle');
    }

    this.hideBestMoveProgress = () => {
        if (!Gui?.document || isNotCompatibleBrowser() || CURRENT_SITE === LICHESS_ORG) return;

        const progressBarElem = Gui.document.querySelector('#best-move-progress');

        if (!progressBarElem.classList.contains('hidden')) {
            progressBarElem.classList.add('hidden');
            this.stopBestMoveProcessingAnimation();
        }
    }
}

function LozzaUtility() {
    this.separateMoveCodes = moveCode => {
        moveCode = moveCode.trim();

        let move = moveCode.split(' ')[1];

        return [move.slice(0, 2), move.slice(2, 4)];
    }

    this.extractInfo = str => {

        const keys = ['time', 'nps', 'depth', 'pv'];

        return keys.reduce((acc, key) => {
            let match = str.match(`${key} (\\d+)`);


            if (match) {
                acc[key] = (match[1]);
            }

            return acc;
        }, {});
    }
}

function fenSquareToChessComSquare(fenSquareCode) {
    const [x, y] = fenSquareCode.split('');

    return `square-${['abcdefgh'.indexOf(x) + 1]}${y}`;
}

function markMoveToSite(fromSquare, toSquare, rgba_color) {
    const highlight = (fenSquareCode, style, rgba_color) => {

        let squareClass = highlightElem = existingHighLight = parentElem = null

        if (CURRENT_SITE == CHESS_COM) {
            squareClass = fenSquareToChessComSquare(fenSquareCode);

            highlightElem = document.createElement('div');
            highlightElem.classList.add('custom');
            highlightElem.classList.add('highlight');
            highlightElem.classList.add(squareClass);
            highlightElem.dataset.testElement = 'highlight';
            highlightElem.style = style;
            highlightElem.style.backgroundColor = `rgba(${rgba_color[0]},${rgba_color[1]},${rgba_color[2]},${rgba_color[3]})`;


            activeSiteMoveHighlights.push(highlightElem);


            if (TURN_UPDATE_FIX == true) {
                existingHighLight = document.querySelector(`.custom.highlight.${squareClass}`);
            } else {
                existingHighLight = document.querySelector(`.highlight.${squareClass}`);
            }

            if (existingHighLight) {
                existingHighLight.remove();
            }

            parentElem = chessBoardElem;

        } else if (CURRENT_SITE == LICHESS_ORG) {
            let x_pos, y_pos
            // check if flipped white: false  / black: true
            let flipped = document.querySelector(".orientation-white") !== null ? false : true


            let default_square_width = parseInt(chessBoardElem.querySelector("cg-container").style.width) / 8;
            let default_square_height = parseInt(chessBoardElem.querySelector("cg-container").style.height) / 8;


            if (!flipped) {
                // player has white side
                x_pos = alphabetPosition(fenSquareCode[0]) * default_square_width;
                y_pos = (8 - Number(fenSquareCode[1])) * default_square_height;
            } else {
                // black side
                x_pos = (7 - alphabetPosition(fenSquareCode[0])) * default_square_width;
                y_pos = (Number(fenSquareCode[1]) - 1) * default_square_height;
            }


            highlightElem = document.createElement('square');
            highlightElem.classList.add('custom');
            highlightElem.classList.add('highlight');
            highlightElem.dataset.testElement = 'highlight';
            highlightElem.style = style;
            highlightElem.style.backgroundColor = `rgba(${rgba_color[0]},${rgba_color[1]},${rgba_color[2]},${rgba_color[3]})`;


            highlightElem.style.transform = `translate(${x_pos}px,${y_pos}px)`;
            highlightElem.style.zIndex = 1;

            activeSiteMoveHighlights.push(highlightElem);

            parentElem = chessBoardElem.querySelector("cg-container");
        }



        parentElem.prepend(highlightElem);
    }



    highlight(fromSquare, defaultFromSquareStyle, rgba_color);
    highlight(toSquare, defaultToSquareStyle, rgba_color);
}

function removeSiteMoveMarkings() {
    activeSiteMoveHighlights.forEach(elem => {
        elem?.remove();
    });

    activeSiteMoveHighlights = [];
}




function getTurn() {

    const getSquareNumber = (elem) => {
        for (var a = 0; a < elem.classList.length; a++) {
            if (elem.classList[a].includes("square")) {
                return elem.classList[a];
            }
        }
        return "";
    }

    const getSimiliarChessPiece = (squareNumber) => {
        let similiarChessPieces = chessBoardElem.querySelectorAll("." + squareNumber);

        for (var a = 0; a < similiarChessPieces.length; a++) {
            if (similiarChessPieces[a].classList.contains("piece") == true) {
                return similiarChessPieces[a];
            }
        }
        return null;
    }

    const getChessPieceColor = (elem) => {
        for (var a = 0; a < elem.classList.length; a++) {
            if (elem.classList[a].length <= 2) {
                if (elem.classList[a][0] == "b") {
                    return "b";
                } else {
                    return "w";
                }
            }
        }
        return "";
    }



    Interface.boardUtils.removeBestMarkings();

    removeSiteMoveMarkings();


    let chessPieces = chessBoardElem.querySelectorAll(".highlight");

    for (var a = 0; a < chessPieces.length; a++) {

        // exclude custom highlighted squares
        if (chessPieces[a].classList.contains("custom") == true) {
            continue;
        }



        let squareNumber = getSquareNumber(chessPieces[a]);
        if (squareNumber == "") {
            return "";
        }



        let similiarChessPiece = getSimiliarChessPiece(squareNumber);

        if (similiarChessPiece == null) {
            continue;
        }



        let chessPieceColor = getChessPieceColor(similiarChessPiece);

        if (chessPieceColor == "") {
            return "";
        }




        if (chessPieceColor == "b") {
            return "w";
        } else if (chessPieceColor == "w") {
            return "b";
        }
    }



    return "";
}

function updateBestMove(mutationArr) {
    const FenUtil = new FenUtils();
    let currentFen = FenUtil.getFen();


    if (currentFen != lastFen) {
        lastFen = currentFen;


        if (mutationArr) {
            let attributeMutationArr

            if (CURRENT_SITE == CHESS_COM) {
                attributeMutationArr = mutationArr.filter(m => m.target.classList.contains('piece') && m.attributeName == 'class');
            } else if (CURRENT_SITE == LICHESS_ORG) {
                attributeMutationArr = mutationArr.filter(m => m.target.tagName == 'PIECE' && !m.target.classList.contains('fading') && m.attributeName == 'class');
            }



            if (attributeMutationArr?.length) {
                turn = FenUtil.getPieceOppositeColor(FenUtil.getFenCodeFromPieceElem(attributeMutationArr[0].target));

                last_turn = turn;



                // fix turn method
                if (TURN_UPDATE_FIX && getTurn() != "") {
                    turn = getTurn();
                }

                Interface.log(`Turn updated to ${turn}!`);
            }
        }


        updateBoard();
        sendBestMove();
    }
}






function sendBestMove() {
    if (!isPlayerTurn && !show_opposite_moves) {
        return;
    }

    sendBestMoveRequest();
}

function sendBestMoveRequest() {
    const FenUtil = new FenUtils();
    let currentFen = FenUtil.getFen();
    possible_moves = [];

    reloadChessEngine(false, () => {
        Interface.log('Sending best move request to the engine!');

        lastBestMoveID++;


        if (use_book_moves) {
            getBookMoves({ id: lastBestMoveID, fen: currentFen });
        } else {
            getBestMoves({ id: lastBestMoveID, fen: currentFen });
        }
    });
}




function clearBoard() {


    Interface.stopBestMoveProcessingAnimation();

    Interface.boardUtils.removeBestMarkings();

    removeSiteMoveMarkings();
}
function updateBoard(clear = true) {
    if (clear)
        clearBoard();

    const FenUtil = new FenUtils();
    let currentFen = FenUtil.getFen();

    if (currentFen == ("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1") || currentFen == ("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1")) {
        enemyScore = 0;
        myScore = 0;
        Interface.boardUtils.updateBoardPower(myScore, enemyScore);
    }

    isPlayerTurn = playerColor == null || last_turn == null || last_turn == playerColor;


    Interface.boardUtils.updateBoardFen(currentFen);
}


function removeDuplicates(arr) {
    return arr.filter((item,
        index) => arr.indexOf(item) === index);
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getBestMoves(request) {


    if (engineIndex != node_engine_id && CURRENT_SITE !== LICHESS_ORG) {
        // local engines
        while (!engine) {
            sleep(100);
        }

        engine.postMessage(`position fen ${request.fen}`);

        if (engineMode == DEPTH_MODE) {
            engine.postMessage('go depth ' + current_depth);
        } else {
            engine.postMessage('go movetime ' + current_movetime);
        }

        engine.onmessage = e => {
            if (lastBestMoveID != request.id) {
                return;
            }
            if (e.data.includes('bestmove')) {
                let move = e.data.split(' ')[1];



                moveResult(move.slice(0, 2), move.slice(2, 4), current_depth, true);
            }

            else if (e.data.includes('info')) {

                const infoObj = LozzaUtils.extractInfo(e.data);
                let depth = infoObj.depth || current_depth;
                let move_time = infoObj.time || current_movetime;

                let possible_move = e.data.slice(e.data.lastIndexOf("pv"), e.data.length).split(" ")[1];
                possible_moves.push(possible_move);



                if (engineMode == DEPTH_MODE) {
                    Interface.updateBestMoveProgress(`Depth: ${depth}`);
                } else {
                    Interface.updateBestMoveProgress(`Move time: ${move_time} ms`);
                }

            }
            Interface.engineLog(e.data);
        };

    } else {
        getNodeBestMoves(request);
    }
}

var updatingBestMove = false;

function observeNewMoves() {
    updateBestMove();

    const boardObserver = new MutationObserver(mutationArr => {
        lastPlayerColor = playerColor;

        updatePlayerColor(() => {
            if (playerColor != lastPlayerColor) {
                Interface.log(`Player color changed from ${lastPlayerColor} to ${playerColor}!`);

                updateBestMove();
            } else {
                updateBestMove(mutationArr);
            }
        });


    });

    boardObserver.observe(chessBoardElem, { childList: true, subtree: true, attributes: true });
}

function addGuiPages() {
    if (Gui?.document) return;

    Gui.addPage("Main", `
    <div class="rendered-form" id="main-tab">

                <script>${CURRENT_SITE != LICHESS_ORG ? GM_getResourceText('jquery.js') : ""}</script>
                <script>${CURRENT_SITE != LICHESS_ORG ? GM_getResourceText('chessboard.js') : ""}</script>

        
        <div class="card">
            <div class="card-body" id="chessboard">
                <div class="main-title-bar">
                    <h4 class="card-title">Live Chessboard:</h4>
                    <p class="card-title" id="best-move-progress"></p>
                </div>

                <div id="board" style="width: 447px"></div>
            </div>
            <div id="orientation" class="hidden"></div>
            <div class="card-footer sideways-card"><input class="btn" type="button" value="Get Best Move" id="bestmove-btn"></input></div>
            <div class="card-footer sideways-card">FEN :<div id="fen"></div></div>
            <div class="card-footer sideways-card">ENEMY SCORE :<div id="enemy-score"></div></div>
            <div class="card-footer sideways-card">MY SCORE : <div id="my-score"></div></div>
        </div>
        <script>
        const orientationElem = document.querySelector('#orientation');
        const fenElem = document.querySelector('#fen');

        let board = ChessBoard('board', {
            pieceTheme: '${repositoryRawURL}/content/chesspieces/{piece}.svg',
            position: 'start',
            orientation: '${playerColor == 'b' ? 'black' : 'white'}'
        });

        const orientationObserver = new MutationObserver(() => {
            board = ChessBoard('board', {
                pieceTheme: '${repositoryRawURL}/content/chesspieces/{piece}.svg',
                position: fenElem.textContent,
                orientation: orientationElem.textContent == 'b' ? 'black' : 'white'
            });
        });

        const fenObserver = new MutationObserver(() => {
            board.position(fenElem.textContent);
        });

        orientationObserver.observe(orientationElem, { attributes: true,  childList: true,  characterData: true });
        fenObserver.observe(fenElem, { attributes: true,  childList: true,  characterData: true });
        </script>
    </div>
    `);

    Gui.addPage('Log', `
    <div class="rendered-form" id="log-tab">
        <div class="card">
            <div class="card-body">
                <h4 class="card-title">Userscript Log:</h4>
                <ul class="list-group" id="userscript-log-container"></ul>
            </div>
        </div>
        <div class="card">
            <div class="card-body">
                <h4 class="card-title">Engine Log</h4>
                <ul class="list-group" id="engine-log-container"></ul>
            </div>
        </div>
    </div>
    `);







    Gui.addPage('Settings', `
    <style>
        body{
            width:40% !important;
            display:grid;
            justify-items: center;
            background-color:#fff;

            transition:0.2s;
        }


        body.night{
            background-color:#312e2b;
            transition:0.2s;
        }



        .rendered-form{
            width:500px;
        }

        .card{
            border: 3px solid rgba(0,0,0,.2) !important;
            background-color:#fff;
            transition:0.2s;
        }
        .card.night{
            background-color:#545454;
            transition:0.2s;
        }



        .card-title{
            color:#000;
            transition:0.2s;
        }
        .card-title.night{
            color:#fff;
            transition:0.2s;
        }


        .form-control{
            color:#000;
            background-color:#fff;
            transition:0.2s;
        }
        .form-control.night{
            color:#fff;
            background-color:#525252;
            transition:0.2s;
        }


        label,input{
            color:#000;
            transition:0.2s;
        }
        label.night,input.night{
            color:#fff;
            transition:0.2s;
        }

        input{
            background-color:#fff;
            transition:0.2s;
        }
        input.night{
            background-color:#525252;
            transition:0.2s;
        }


        .list-group div{
            background-color:#fff;
            transition:0.2s;
        }
        .list-group.night div{
            background-color:#bbb;
            transition:0.2s;
        }



        .card-footer{
            color:#000;
            font-weight:bold;
            transition:0.2s;
        }
        .card-footer.night{
            color:#fff;
            transition:0.2s;
        }

        #fen{
            color:#000;
            font-size: 15px;
            word-break: break-word;
            transition:0.2s;
        }
        #fen.night{
            color:#fff;
            transition:0.2s;
        }


        .nav-tabs .nav-link:hover {
            border-color: #454646  #454646  #454646;
            isolation: isolate;
        }
        .nav-tabs .nav-link.night:hover {
            border-color: #e9ecef #e9ecef #dee2e6;
            isolation: isolate;
        }

        .nav-tabs .nav-link.active{
            background-color:#bbb;
        }
        .nav-tabs .nav-link.active.night{
            background-color:#fff;
        }

        .btn{
            border-color:#bbb;
            border-width:3px;
            width:100%;
            transition :0.2s;
        }
        .btn:hover{
            background-color: #0d6efd;
            transition :0.2s;
        }
        .btn:active{
            background-color: #0c5acd;
            transition :0.2s;
        }

        .space{
            height:10px;
        }

        .form-control,.list-group{
            border: 2px solid #0000004f !important;
        }
        #reload-count{
            width:15%;
        }
        .nav-link{
            font-weight:bold;
        }
		
		.alert {
			padding: 20px;
			background-color: #f44336;
			color: white;
		}
		
		
        .container {
            display: block;
            position: relative;
            padding-left: 35px;
            margin-bottom: 12px;
            cursor: pointer;
            font-size: 15px;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }


        .container input {
            position: absolute;
            opacity: 0;
            cursor: pointer;
            height: 0;
            width: 0;
        }

        
        .checkmark {
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            top: 0;
            left: 0;
            height: 25px;
            width: 25px;
            background-color: #eee;
            outline:3px solid #bbb;
        }

        .checkmark.night{
            outline:none;
        }

        .container:hover input ~ .checkmark {
            background-color: #ccc;
        }

        
        .container input:checked ~ .checkmark {
            background-color: #2196F3;
        }


        .checkmark:after {
            content: "";
            position: absolute;
            display: none;
        }


        .container input:checked ~ .checkmark:after {
            display: block;
        }

        .container .checkmark:after {
            width: 40%;
            height: 70%;
            margin-left: 1px;
            border: solid white;
            border-width: 0 3px 3px 0;
            -webkit-transform: rotate(45deg);
            -ms-transform: rotate(45deg);
            transform: rotate(45deg);
        }
    </style>

    <div class="rendered-form" id="settings-tab">

    <div class="card">
        <div class="card-body">
            <h4 class="card-title">Main Settings:</h4>
            <input class="btn" type="button" value="Reset Settings" id="reset-settings">
            <div class="space"></div>
            <input class="btn" type="button" value="${nightMode == true ? 'Disable Night Mode' : 'Enable Night Mode'}" id="night-mode">

        </div>
    </div>

        <div class="card">
            <div class="card-body">
                <h4 class="card-title">Engine:</h4>
                <div class="form-group field-select-engine">
                    <select class="form-control" name="select-engine" id="select-engine">
                        <option value="option-lozza" id="web-engine">Lozza</option>
                        <option value="option-stockfish" id="web-engine">Stockfish 5</option>
                        <option value="option-stockfish2" id="web-engine">Stockfish 2018</option>
                        <option value="option-nodeserver" id="local-engine">Node Server Engines</option>
                    </select>
                </div>


                <label class="container">Use book moves
                    <input type="checkbox" id="use-book-moves" ${use_book_moves == true ? 'checked' : ''}>
                    <span class="checkmark"></span>
                </label>


                <div id="reload-engine-div" style="display:${node_engine_id == engineIndex ? 'none' : 'block'};">


                    <label class="container">Enable Engine Reload
                        <input type="checkbox" id="reload-engine" ${reload_engine == true ? 'checked' : ''}>
                        <span class="checkmark"></span>
                    </label>

                    <div id="reload-count-div" style="display:${reload_engine == true ? 'block' : 'none'};">
                        <label for="reload-count">Reload Engine every</label>
                        <input type="number" id="reload-count" value="${reload_every}">
                        <label for="reload-count"> moves</label>
                    </div>


    
                </div>



				
				<div id="node-engine-div" style="display:${(engineIndex == node_engine_id) ? 'block' : 'none'};">
                    <div>
                    <label for="engine-url">Engine URL:</label>
                    <input type="text" id="engine-url" value="${node_engine_url}">
                    </div>

                    <div class="space"></div>
                    <div>
					<label for="engine-name">Engine Name:</label>
					<input type="text" id="engine-name" value="${node_engine_name}">
                    </div>
				</div>
            </div>
        </div>


        <div class="card">
            <div class="card-body">
                <h4 class="card-title">Engine Strength:</h4>

			<h7 class="card-title">Engine Mode:</h7>
            <div class="form-group field-select-engine-mode">
                <select class="form-control" name="select-engine-mode" id="select-engine-mode">
                    <option value="option-depth" id="select-engine-mode-0">Depth</option>
                    <option value="option-movetime" id="select-engine-mode-1">Move time</option>
                </select>
            </div>


			
            <h7 class="card-title">Engine Power:</h7>
                <input type="range" class="form-range" min="${MIN_DEPTH}" max="${MAX_DEPTH}" step="1" value="${current_depth}" id="depth-range">
                <input type="number" class="form-range" min="${MIN_DEPTH}" max="${MAX_DEPTH}" value="${current_depth}" id="depth-range-number">
                <input type="range" class="form-range" min="${MIN_MOVETIME}" max="${MAX_MOVETIME}" step="50" value="${current_movetime}" id="movetime-range">
                <input type="number" class="form-range" min="${MIN_MOVETIME}" max="${MAX_MOVETIME}" value="${current_movetime}" id="movetime-range-number">
			</div>
            
            <div class="card-footer sideways-card" id="elo">
                <ul style="margin:0px;">
                    <li id="value">
                        Elo: 
                    </li>
                    <li id="rank">
                        Rank: 
                    </li>
                    <li id="power">
                        Elo: 
                    </li>
                </ul>
            </div>
        </div>



        <div class="card">
            <div class="card-body">
                <h4 class="card-title">Visual:</h4>

				<h6 class="alert">
                    <span>&#9888;</span>Warning<span>&#9888;</span>: Displaying moves are detectable, use with caution !! 
				</h6>
				
                <div id="max-moves-div" style="display:${node_engine_id == engineIndex ? 'none' : 'block'};">
                    <div>
                        <label for="reload-count">Max Best Moves</label>
                        <input type="number" min="1" max="4" id="max-moves" value="${max_best_moves}">
                    </div>
                </div>

                <label class="container">Display moves on chessboard
                    <input type="checkbox" id="display-moves-on-site" ${displayMovesOnSite == true ? 'checked' : ''}>
					<span class="checkmark"></span>
                </label>

                
                <label class="container">Display Opponent best moves
                    <input type="checkbox" id="show-opposite-moves" ${show_opposite_moves == true ? 'checked' : ''}>
                    <span class="checkmark"></span>
                </label>

         




       
            </div>
        </div>


        <div class="card">
        <div class="card-body">
            <h4 class="card-title">Other:</h4>


            <label class="container">Enable Userscript Log
            <input type="checkbox" id="enable-user-log" ${enableUserLog == true ? 'checked' : ''}>
            <span class="checkmark"></span>
            </label>


            <label class="container">Enable Engine Log
            <input type="checkbox" id="enable-engine-log" ${enableEngineLog == true ? 'checked' : ''}>
            <span class="checkmark"></span>
            </label>




    </div>
    </div>
    `);


}

function fixDepthMoveTimeInput(depthRangeElem, depthRangeNumberElem, moveTimeRangeElem, moveTimeRangeNumberElem, eloElem) {
    if (engineMode == DEPTH_MODE) {
        if (isNotCompatibleBrowser()) {
            depthRangeElem.style.display = "none";
            depthRangeNumberElem.style.display = "block";
            moveTimeRangeElem.style.display = "none";
            moveTimeRangeNumberElem.style.display = "none";
        } else {
            depthRangeElem.style.display = "block";
            depthRangeNumberElem.style.display = "none";
            moveTimeRangeElem.style.display = "none";
            moveTimeRangeNumberElem.style.display = "none";
        }
    } else {
        if (isNotCompatibleBrowser()) {
            depthRangeElem.style.display = "none";
            depthRangeNumberElem.style.display = "none";
            moveTimeRangeElem.style.display = "none";
            moveTimeRangeNumberElem.style.display = "block";
        } else {
            depthRangeElem.style.display = "none";
            depthRangeNumberElem.style.display = "none";
            moveTimeRangeElem.style.display = "block";
            moveTimeRangeNumberElem.style.display = "none";
        }
    }



    setEloDescription(eloElem);
}


async function resetSettings() {
    await GM_setValue(dbValues.nightMode, undefined);


    Gui.close();

    initialize();
}

function openGUI() {



    Gui.open(() => {
        const bodyElem = Gui.document.querySelector("body");
        const cardElem = Gui.document.querySelectorAll(".card");
        const cardTitleElem = Gui.document.querySelectorAll(".card-title");
        const FormControlElem = Gui.document.querySelectorAll(".form-control");
        const labelElem = Gui.document.querySelectorAll("label");
        const checkMarkElem = Gui.document.querySelectorAll(".checkmark");
        const inputElem = Gui.document.querySelectorAll("input");
        const listGroupElem = Gui.document.querySelectorAll(".list-group");
        const cardFooterElem = Gui.document.querySelectorAll(".card-footer");
        const textMutedElem = Gui.document.querySelectorAll("#fen");
        const navLinkElem = Gui.document.querySelectorAll(".nav-tabs .nav-link");




        const depthRangeElem = Gui.document.querySelector('#depth-range');
        const depthRangeNumberElem = Gui.document.querySelector('#depth-range-number');
        const maxMovesElem = Gui.document.querySelector('#max-moves');
        const maxMovesDivElem = Gui.document.querySelector('#max-moves-div');
        const moveTimeRangeElem = Gui.document.querySelector('#movetime-range');
        const moveTimeRangeNumberElem = Gui.document.querySelector('#movetime-range-number');
        const engineModeElem = Gui.document.querySelector('#select-engine-mode');
        const engineElem = Gui.document.querySelector('#select-engine');
        const engineNameDivElem = Gui.document.querySelector('#node-engine-div');
        const reloadEngineDivElem = Gui.document.querySelector('#reload-engine-div');
        const reloadEngineElem = Gui.document.querySelector('#reload-engine');
        const reloadEveryDivElem = Gui.document.querySelector('#reload-count-div');
        const reloadEveryElem = Gui.document.querySelector('#reload-count');
        const nodeEngineNameElem = Gui.document.querySelector('#engine-name');
        const nodeEngineUrlElem = Gui.document.querySelector('#engine-url');
        const useLocalEngineElem = Gui.document.querySelector('#use-book-moves');
        const showOppositeMovesElem = Gui.document.querySelector('#show-opposite-moves');
        const displayMovesOnSiteElem = Gui.document.querySelector('#display-moves-on-site');
        const enableUserLogElem = Gui.document.querySelector('#enable-user-log');
        const enableEngineLogElem = Gui.document.querySelector('#enable-engine-log');
        const eloElem = Gui.document.querySelector('#elo');
        const getBestMoveElem = Gui.document.querySelector('#bestmove-btn');
        const nightModeElem = Gui.document.querySelector('#night-mode');
        const resetElem = Gui.document.querySelector('#reset-settings');


        const setNightClassName = (elem) => {
            const pos = elem.className.indexOf("night");
            if (pos == -1) {
                elem.className += " night";
            }
        }

        const removeNightClassName = (elem) => {
            const pos = elem.className.indexOf("night");
            if (pos != -1) {
                elem.className = elem.className.slice(0, pos - 1);
            }
        }

        const setNightClassNames = (elems) => {
            for (var a = 0; a < elems.length; a++) {
                setNightClassName(elems[a]);
            }
        }
        const removeNightClassNames = (elems) => {
            for (var a = 0; a < elems.length; a++) {
                removeNightClassName(elems[a]);
            }
        }


        const checkNightMode = () => {
            if (nightMode) {
                setNightClassName(bodyElem);
                setNightClassNames(cardElem);
                setNightClassNames(cardTitleElem);
                setNightClassNames(FormControlElem);
                setNightClassNames(inputElem);
                setNightClassNames(labelElem);
                setNightClassNames(checkMarkElem);
                setNightClassNames(listGroupElem);
                setNightClassNames(cardFooterElem);
                setNightClassNames(textMutedElem);
                setNightClassNames(navLinkElem);
            } else {
                removeNightClassName(bodyElem);
                removeNightClassNames(cardElem);
                removeNightClassNames(cardTitleElem);
                removeNightClassNames(FormControlElem);
                removeNightClassNames(inputElem);
                removeNightClassNames(labelElem);
                removeNightClassNames(checkMarkElem);
                removeNightClassNames(listGroupElem);
                removeNightClassNames(cardFooterElem);
                removeNightClassNames(textMutedElem);
                removeNightClassNames(navLinkElem);
            }
        }




        fixDepthMoveTimeInput(depthRangeElem, depthRangeNumberElem, moveTimeRangeElem, moveTimeRangeNumberElem, eloElem);
        engineElem.selectedIndex = engineIndex;
        engineModeElem.selectedIndex = engineMode;
        checkNightMode();


        // compatibility fix
        if (isNotCompatibleBrowser()) {
            var forms = Gui.document.querySelectorAll('.rendered-form');
            for (var a = 0; a < forms.length; a++) {
                forms[a].style.width = "auto";
            }
            Gui.document.querySelector('#gui').style.minWidth = "350px";
            Gui.document.querySelector('#content').style.maxHeight = "500px";
            Gui.document.querySelector('#content').style.overflow = "scroll";
            Gui.document.querySelector('#chessboard').remove();
            Gui.document.querySelector('#orientation').remove();
            Gui.document.querySelector('#engine-log-container').style.maxHeight = "100px";
            Gui.document.querySelector('#engine-log-container').style.overflow = "scroll";
            Gui.document.querySelector('#userscript-log-container').style.maxHeight = "100px";
            Gui.document.querySelector('#userscript-log-container').style.overflow = "scroll";

            Gui.document.querySelector('#button-close-gui').addEventListener('click', e => {
                e.preventDefault();
                if (closedGui == true) {
                    closedGui = false;
                    Gui.document.querySelector("#content").style.display = "block";
                }
                else {
                    closedGui = true;
                    Gui.document.querySelector("#content").style.display = "none";

                }
            });
        }


        if (CURRENT_SITE == LICHESS_ORG) {
            // disabled web engine selection due to cors issues
            engineElem.childNodes.forEach(elem => {
                if (elem.id == "web-engine") {
                    elem.disabled = true;
                }
            })

            if(!isNotCompatibleBrowser()){
                Gui.document.querySelector('#chessboard').remove();
                Gui.document.querySelector('#orientation').remove();
            }

            engineElem.selectedIndex = node_engine_id;
            maxMovesDivElem.style.display = "none";
            engineNameDivElem.style.display = "block";
            reloadEngineDivElem.style.display = "none";
        }


        resetElem.onclick = () => {
            resetSettings()
        }


        nightModeElem.onclick = () => {
            if (nightMode) {
                nightMode = false;
                nightModeElem.value = "Enable Night Mode";
            } else {
                nightMode = true;
                nightModeElem.value = "Disable Night Mode";
            }



            checkNightMode();

            GM_setValue(dbValues.nightMode, nightMode);


        }

        getBestMoveElem.onclick = () => {
            if (forcedBestMove)
                return;

            getBestMoveElem.disabled = true;
            forcedBestMove = true;



            updateBoard();
            sendBestMove();
        }

        engineModeElem.onchange = () => {
            engineMode = engineModeElem.selectedIndex;
            GM_setValue(dbValues.engineMode, engineMode);

            fixDepthMoveTimeInput(depthRangeElem, depthRangeNumberElem, moveTimeRangeElem, moveTimeRangeNumberElem, eloElem);
        }
        nodeEngineNameElem.onchange = () => {
            node_engine_name = nodeEngineNameElem.value;
            GM_setValue(dbValues.node_engine_name, node_engine_name);
        }
        nodeEngineUrlElem.onchange = () => {
            node_engine_url = nodeEngineUrlElem.value;
            GM_setValue(dbValues.node_engine_url, node_engine_url);
        }

        enableUserLogElem.onchange = () => {
            enableUserLog = enableUserLogElem.checked;


            GM_setValue(dbValues.enableUserLog, enableUserLog);
        }
        enableEngineLogElem.onchange = () => {
            enableEngineLog = enableEngineLogElem.checked;


            GM_setValue(dbValues.enableEngineLog, enableEngineLog);
        }

        reloadEngineElem.onchange = () => {
            reload_engine = reloadEngineElem.checked;

            if (reload_engine) {
                reloadEveryDivElem.style.display = "block";
            } else {
                reloadEveryDivElem.style.display = "none";
            }

            GM_setValue(dbValues.reload_engine, reload_engine);
        }

        reloadEveryElem.onchange = () => {
            reload_every = reloadEveryElem.value;
            GM_setValue(dbValues.reload_every, reload_every);
        }

        engineElem.onchange = () => {
            lastEngine = engineIndex;
            engineIndex = engineElem.selectedIndex;
            GM_setValue(dbValues.engineIndex, engineIndex);


            if (node_engine_id == engineIndex) {
                reloadEngineDivElem.style.display = "none";
                engineNameDivElem.style.display = "block";
                maxMovesDivElem.style.display = "none";
            }
            else {
                reloadEngineDivElem.style.display = "block";
                engineNameDivElem.style.display = "none";
                maxMovesDivElem.style.display = "block";
            }





            if (engineObjectURL) {
                URL.revokeObjectURL(engineObjectURL);
                engineObjectURL = null;
            }




            reloadChessEngine(true, () => {
                Interface.boardUtils.removeBestMarkings();

                removeSiteMoveMarkings();

                Interface.boardUtils.updateBoardPower(0, 0);
            });

        }



        depthRangeElem.onchange = () => {
            changeEnginePower(depthRangeElem.value, eloElem);
        };

        depthRangeNumberElem.onchange = () => {
            changeEnginePower(depthRangeNumberElem.value, eloElem);
        };


        maxMovesElem.onchange = () => {
            max_best_moves = maxMovesElem.value;
            GM_setValue(dbValues.max_best_moves, max_best_moves);
        };



        moveTimeRangeElem.onchange = () => {
            changeEnginePower(moveTimeRangeElem.value, eloElem);
        };

        moveTimeRangeNumberElem.onchange = () => {
            changeEnginePower(moveTimeRangeNumberElem.value, eloElem);
        };

        showOppositeMovesElem.onchange = () => {
            show_opposite_moves = showOppositeMovesElem.checked;


            GM_setValue(dbValues.show_opposite_moves, show_opposite_moves);
        }

        useLocalEngineElem.onchange = () => {
            use_book_moves = useLocalEngineElem.checked;



            GM_setValue(dbValues.use_book_moves, use_book_moves);
        }

        displayMovesOnSiteElem.onchange = () => {
            displayMovesOnSite = displayMovesOnSiteElem.checked;


            GM_setValue(dbValues.displayMovesOnSite, displayMovesOnSite);
        };






        window.onunload = () => {
            if (Gui.window && !Gui.window.closed) {
                Gui.window.close();
            }
        };

        const isWindowClosed = setInterval(() => {
            if (Gui.window.closed) {
                clearInterval(isWindowClosed);
                if (engine != null)
                    engine.terminate();
            }
        }, 1000);



        Interface.log('Initialized GUI!');

        observeNewMoves();
    });
}

function changeEnginePower(val, eloElem) {
    if (engineMode == DEPTH_MODE) {
        current_depth = val
        GM_setValue(dbValues.current_depth, current_depth);
    } else {
        current_movetime = val
        GM_setValue(dbValues.current_movetime, current_movetime);
    }


    setEloDescription(eloElem);
}

function reloadChessEngine(forced, callback) {
    // reload only if using local engines
    if (node_engine_id == engineIndex && forced == false) {
        callback();
    }
    else if (reload_engine == true && reload_count >= reload_every || forced == true) {
        reload_count = 1;
        Interface.log(`Reloading the chess engine!`);

        if (engine)
            engine.terminate();

        loadChessEngine(callback);
    }
    else {
        reload_count = reload_count + 1;
        callback();
    }
}



function loadChessEngine(callback) {
    // exclude lichess.org
    if (CURRENT_SITE == LICHESS_ORG) {
        return callback();
    }

    if (!engineObjectURL) {
        if (engineIndex == 0)
            engineObjectURL = URL.createObjectURL(new Blob([GM_getResourceText('lozza.js')], { type: 'application/javascript' }));
        else if (engineIndex == 1)
            engineObjectURL = URL.createObjectURL(new Blob([GM_getResourceText('stockfish-5.js')], { type: 'application/javascript' }));
        else if (engineIndex == 2)
            engineObjectURL = URL.createObjectURL(new Blob([GM_getResourceText('stockfish-2018.js')], { type: 'application/javascript' }));
    }

    if (engineObjectURL) {
        engine = new Worker(engineObjectURL);

        engine.postMessage('ucinewgame');

        Interface.log(`Loaded the chess engine!`);
    }

    callback();
}



function updatePlayerColor(callback) {
    const boardOrientation = Interface.getBoardOrientation();

    playerColor = boardOrientation;
    turn = boardOrientation;


    Interface.boardUtils.updateBoardOrientation(playerColor);

    callback();
}

function initialize() {
    Interface = new InterfaceUtils();
    LozzaUtils = new LozzaUtility();

    const boardOrientation = Interface.getBoardOrientation();
    turn = boardOrientation;

    initializeDatabase(() => {
        loadChessEngine(() => {
            updatePlayerColor(() => {
                addGuiPages();
                openGUI();
            });
        });
    });



}

if (typeof GM_registerMenuCommand == 'function') {
    GM_registerMenuCommand("Open Smart Chess Bot", e => {
        if (chessBoardElem) {
            initialize();
        }
    }, 's');
}


const waitForChessBoard = setInterval(() => {
    if (CURRENT_SITE) {
        return;
    }



    if (window.location.href.includes("lichess.org")) {
        CURRENT_SITE = LICHESS_ORG;
        boardElem = document.querySelector('.main-board');
        firstPieceElem = document.querySelector('piece');
    }
    else if (window.location.href.includes("chess.com")) {
        CURRENT_SITE = CHESS_COM;
        boardElem = document.querySelector('chess-board');
        firstPieceElem = document.querySelector('.piece');
    }


    if (boardElem && firstPieceElem && chessBoardElem != boardElem) {
        chessBoardElem = boardElem;

        initialize();

    }
}, 2000);


async function initializeDatabase(callback) {
    nightMode = false;
    engineMode = 0;
    engineIndex = 0;
    reload_engine = false;
    reload_every = 10;
    enableUserLog = true;
    enableEngineLog = true;
    displayMovesOnSite = false;
    show_opposite_moves = false;
    use_book_moves = false;
    node_engine_url = "http://localhost:5000";
    node_engine_name = "stockfish-15.exe"
    current_depth = Math.round(MAX_DEPTH / 2);
    current_movetime = Math.round(MAX_MOVETIME / 3);
    max_best_moves = 1;

    if (GM_getValue(dbValues.nightMode) == undefined) {
        await GM_setValue(dbValues.nightMode, nightMode);
        await GM_setValue(dbValues.engineMode, engineMode);
        await GM_setValue(dbValues.engineIndex, engineIndex);
        await GM_setValue(dbValues.reload_engine, reload_engine);
        await GM_setValue(dbValues.reload_every, reload_every);
        await GM_setValue(dbValues.enableUserLog, enableUserLog);
        await GM_setValue(dbValues.enableEngineLog, enableEngineLog);
        await GM_setValue(dbValues.displayMovesOnSite, displayMovesOnSite);
        await GM_setValue(dbValues.show_opposite_moves, show_opposite_moves);
        await GM_setValue(dbValues.use_book_moves, use_book_moves);
        await GM_setValue(dbValues.node_engine_url, node_engine_url);
        await GM_setValue(dbValues.node_engine_name, node_engine_name);
        await GM_setValue(dbValues.current_depth, current_depth);
        await GM_setValue(dbValues.current_movetime, current_movetime);
        await GM_setValue(dbValues.max_best_moves, max_best_moves);
        callback();
    } else {
        nightMode = await GM_getValue(dbValues.nightMode);
        engineMode = await GM_getValue(dbValues.engineMode);
        engineIndex = await GM_getValue(dbValues.engineIndex);
        reload_engine = await GM_getValue(dbValues.reload_engine);
        reload_every = await GM_getValue(dbValues.reload_every);
        enableUserLog = await GM_getValue(dbValues.enableUserLog);
        enableEngineLog = await GM_getValue(dbValues.enableEngineLog);
        displayMovesOnSite = await GM_getValue(dbValues.displayMovesOnSite);
        show_opposite_moves = await GM_getValue(dbValues.show_opposite_moves);
        use_book_moves = await GM_getValue(dbValues.use_book_moves);
        node_engine_url = await GM_getValue(dbValues.node_engine_url);
        node_engine_name = await GM_getValue(dbValues.node_engine_name);
        current_depth = await GM_getValue(dbValues.current_depth);
        current_movetime = await GM_getValue(dbValues.current_movetime);
        max_best_moves = await GM_getValue(dbValues.max_best_moves);
        callback();
    }
}