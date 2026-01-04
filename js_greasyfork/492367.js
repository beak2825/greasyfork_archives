// ==UserScript==
// @name         Checkers Script
// @namespace    http://tampermonkey.net/
// @version      2024-05-05
// @description  Checkers Komputer - a checkers playing AI, built as a warm up for other games.
// @author       Stephen Wilbo Montague
// @match        http://gamesbyemail.com/Games/Checkers
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gamesbyemail.com
// @downloadURL https://update.greasyfork.org/scripts/492367/Checkers%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/492367/Checkers%20Script.meta.js
// ==/UserScript==

(function() {
    // Begin main script.
    console.log("Hello Checkers.");

    // Wait for the page to load.
    waitForKeyElements("#Foundation_Elemental_7_savePlayerNotes", () => {

        // Add functions for simulating mouse input.
        Foundation.$registry[7].simulateMouseDown = function (valueIndex)
        {
            var boardPoint=this.boardPointFromValueIndex(valueIndex);
            var piece=this.pieces.findAtPoint(boardPoint);
            if (piece && piece.color==this.player.team.color)
            {
                if (this.madeMove && (!boardPoint.equals(this.lastMovePiece.boardPoint) || this.readyToSend))
                {
                    if (boardPoint.equals(this.lastMovePiece.boardPoint))
                        boardPoint=this.originalMoveFromPoint;
                    this.undo();
                    piece=this.pieces.findAtPoint(boardPoint);
                }
                this.clearHilites();
                this.pieces.cancelFlashes();
                this.lastMoveFromPoint=boardPoint;
                this.onLeftMouseUp="mouseUp";
                this.onDragByClicks="dragByClicks";
                this.lastMovePiece=piece;
                this.lastCheckedPoint=boardPoint.clone();
                this.lastCheckedLegal=false;
            }
        }; // End simulateMouseDown
        Foundation.$registry[7].simulateMouseUp = function(valueIndex)
        {
            this.onMouseMove=null;
            this.onLeftMouseUp=null;
            var boardPoint=this.boardPointFromValueIndex(valueIndex);
            var moveData=this.checkMove(boardPoint,this.lastMoveFromPoint);
            if (moveData)
            {
                this.setMoveData(moveData);
                this.lastMovePiece=this.pieces.findAtPoint(boardPoint);
                if (!this.madeMove)
                    this.originalMoveFromPoint=this.lastMoveFromPoint.clone();
                this.madeMove=true;
                if (moveData.canContinueJumping)
                {
                    this.pieces.flash(3,null,moveData.canContinueJumping);
                    this.readyToSend=false;
                }
                else
                    this.readyToSend=true;
                this.update();
            }
            else
            {
                this.lastMovePiece.reset();
                if (!this.madeMove)
                {
                    this.lastMovePiece=null;
                    this.lastMoveFromPoint=null;
                }
            }
        }; // End simulateMouseUp

        // Add button to page.
        console.log("Adding AI agent control button.");
        addButton("Run Checkers Komputer", runKomputer);
        window.IS_KOMPUTER_READY = true;
   }); // End wait for page load

})(); // End main script.

function addButton(text, onclick, cssObj) {
    let style = cssObj || {position: 'absolute', top: '574px', left:'24px', 'z-index': '9999', "-webkit-transition-duration": "0.6s", "transition-duration": "0.6s", overflow: 'hidden'}
    let button = document.createElement('button');
    button.setAttribute("class", "button_runKomputer");
    button.innerHTML = text;
    button.onclick = onclick;
    let btnStyle = button.style;
    Object.keys(style).forEach(key => btnStyle[key] = style[key]);
    document.body.appendChild(button); // For now, this works well enough.

    // Add Button Press Transition 1
    const cssButtonClassString1 = `.button_runKomputer:after{content: ""; background: #90EE90; display: block; position: absolute; padding-top: 300%; padding-left: 350%; margin-left: -20px!important; margin-top: -120%; opacity: 0; transition: all 1.0s}`;
    const styleTag1 = document.createElement("style");
    styleTag1.innerHTML = cssButtonClassString1;
    document.head.insertAdjacentElement('beforeend', styleTag1);

    // Add Button Press Transition 2
    const cssButtonClassString2 = `.button_runKomputer:active:after{padding: 0; margin: 0; opacity: 1; transition: 0s}`;
    const styleTag2 = document.createElement("style");
    styleTag2.innerHTML = cssButtonClassString2;
    document.head.insertAdjacentElement('beforeend', styleTag2);
}

async function inputMovements(origin, movements)
{
    let GBE_Origin = convertToGBE_Index(origin);
    let GBE_Destination = null;
    let firstMove = true;
    while (movements.length > 0)
    {
        if (firstMove)
        {
            await Foundation.$registry[7].simulateMouseDown(GBE_Origin);
            firstMove = false;
        }
        else
        {
            await Foundation.$registry[7].simulateMouseDown(GBE_Destination);
        }
        GBE_Destination = convertToGBE_Index(movements.shift());
        await Foundation.$registry[7].simulateMouseUp(GBE_Destination);
    }
    window.G_interval = await setInterval(sendMove, 100);
}


function convertToGBE_Index(localIndex)
{
    let GBE_Index = Math.abs(localIndex-31)
    if (GBE_Index % 4 === 3)
    {
        GBE_Index -= 3;
    }
    else if (GBE_Index % 4 === 2)
    {
        GBE_Index -= 1;
    }
     else if (GBE_Index % 4 === 1)
    {
        GBE_Index += 1;
    }
    else
    {
        GBE_Index += 3;
    }
    return GBE_Index;
}

async function sendMove()
{
    if (Foundation.$registry[7].readyToSend)
    {
        await Foundation.$registry[7].sendMove();
        if (typeof window.G_interval !== 'undefined' && window.G_interval)
        {
            clearInterval(window.G_interval);
        }
        window.IS_KOMPUTER_READY = true;
    }
}

async function maybeSendLastUserMove()
{
    if (Foundation.$registry[7].readyToSend)
    {
        await Foundation.$registry[7].sendMove();
        return 100;
    }
    return 1;
}

/**
     * Greasemonkey Wrench by CoeJoder, for public use.
     * Source: https://github.com/CoeJoder/GM_wrench/blob/master/src/GM_wrench.js
	 * Detect and handle AJAXed content.  Can force each element to be processed one or more times.
	 *
	 * @example
	 * GM_wrench.waitForKeyElements('div.comments', (element) => {
	 *   element.innerHTML = 'This text inserted by waitForKeyElements().';
	 * });
	 *
	 * GM_wrench.waitForKeyElements(() => {
	 *   const iframe = document.querySelector('iframe');
	 *   if (iframe) {
	 *     const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
	 *     return iframeDoc.querySelectorAll('div.comments');
	 *   }
	 *   return null;
	 * }, callbackFunc);
	 *
	 * @param {(string|function)} selectorOrFunction The selector string or function.
	 * @param {function}          callback           The callback function; takes a single DOM element as parameter.  If
	 *                                               returns true, element will be processed again on subsequent iterations.
	 * @param {boolean}           [waitOnce=true]    Whether to stop after the first elements are found.
	 * @param {number}            [interval=300]     The time (ms) to wait between iterations.
	 * @param {number}            [maxIntervals=-1]  The max number of intervals to run (negative number for unlimited).
*/
function waitForKeyElements (selectorOrFunction, callback, waitOnce, interval, maxIntervals) {
    if (typeof waitOnce === "undefined") {
        waitOnce = true;
    }
    if (typeof interval === "undefined") {
        interval = 300;
    }
    if (typeof maxIntervals === "undefined") {
        maxIntervals = -1;
    }
    var targetNodes =
        typeof selectorOrFunction === "function"
    ? selectorOrFunction()
    : document.querySelectorAll(selectorOrFunction);

    var targetsFound = targetNodes && targetNodes.length > 0;
    if (targetsFound) {
        targetNodes.forEach(function (targetNode) {
            var attrAlreadyFound = "data-userscript-alreadyFound";
            var alreadyFound = targetNode.getAttribute(attrAlreadyFound) || false;
            if (!alreadyFound) {
                var cancelFound = callback(targetNode);
                if (cancelFound) {
                    targetsFound = false;
                } else {
                    targetNode.setAttribute(attrAlreadyFound, true);
                }
            }
        });
    }

    if (maxIntervals !== 0 && !(targetsFound && waitOnce)) {
        maxIntervals -= 1;
        setTimeout(function () {
            waitForKeyElements(selectorOrFunction, callback, waitOnce, interval, maxIntervals);
        }, interval);
    }
};


async function runKomputer()
{
// Below is the Komputer AI script, via webpack without minification, as per the rules of Greasy Fork.
// Will create an organized, compact version of this soon. Time spent thinking per turn can be changed here.
// It's also possible to change AI versions - search for "const SETUP" and modify agent_0 to "Random", "MCTS-UCT", "MCTS-UCT-ENHANCED", etc.
// MCTS-PUCT-NET is currently not available, as importing the neural network into script managers and Greasy Fork is rather complicated.
// Instead, the AI is using a strong (sometimes better) alternative - a crafted hueristic based MCTS-PUCT algorithm.

// There's quite a few extra SETUP parameters for a standalone demo version on GitHub that allows tournaments.
// Most of these should be left as is.

if (window.IS_KOMPUTER_READY){
window.IS_KOMPUTER_READY = false;

// It's easy for a user to forget to send a move, so if a move is ready, send it first.
let delay = await maybeSendLastUserMove();

const WEBPACK_SCRIPT_OBJ = { f: function f(gameInfo) {

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 442:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  g: () => (/* binding */ Agent)
});

// EXTERNAL MODULE: ./src/setup.js
var setup = __webpack_require__(560);
;// CONCATENATED MODULE: ./src/mcts-puct/children.js


/*
This is an LRU cache for Node children.
The Least Recently Used child is deleted upon reaching max capacity.
This data structure, combined with a depth limit, is a simple way to cap memory use.

Based on Sean Welsh Brown's implementation.
Source: https://dev.to/seanwelshbrown/implement-a-simple-lru-cache-in-javascript-4o92
*/

class Children
{
    constructor(depth, childrenToClone = null)
    {
      this.cache = childrenToClone ? new Set(childrenToClone.cache) : new Set();
      this.capacity = initCapacity(depth);
    }

    get(key)
    {
        if (!this.cache.has(key)) return undefined;

        this.cache.delete(key);
        this.cache.add(key);
        return key;
    }

    put(key)
    {
        this.cache.delete(key);

        if (this.cache.size === this.capacity) {
          this.cache.delete(this.cache.keys().next().value);
          this.cache.add(key);
        } else {
          this.cache.add(key);
        }
    }
}

function initCapacity (depth)
{
  if (depth === 1)
  {
    return setup/* SETUP */.K.PUCT_ROOT_DEPTH_1_CHILD_CAPACITY;
  }
  else if (depth === 2)
  {
    return setup/* SETUP */.K.PUCT_NODE_DEPTH_2_CHILD_CAPACITY;
  }
  else
  {
    return setup/* SETUP */.K.PUCT_NODE_GENERAL_CHILD_CAPACITY;
  }
}

;// CONCATENATED MODULE: ./src/mcts-puct/node.js


class Node
{
    constructor(board, isPlayer1, visitCount = 0, sumValue = 0, parent = null, childrenToClone = null, isProvenWinner = false)
    {
        this.board = board;
        this.isPlayer1 = isPlayer1;
        this.visitCount = visitCount;
        this.sumValue = sumValue;
        this.parent = parent;
        this.depth = (parent === null) ? 0 : parent.depth + 1;
        this.children = new Children(this.depth + 1, childrenToClone);
        this.isProvenWinner = isProvenWinner;
    }

    clone()
    {
        return (new Node(this.board, this.isPlayer1, this.visitCount, this.sumValue, this.parent, this.children, this.isProvenWinner));
    }
}

;// CONCATENATED MODULE: ./src/mcts-puct/select.js


const DEPTH_LIMIT = setup/* SETUP */.K.PUCT_TREE_DEPTH_LIMIT;
const UCB_C = setup/* SETUP */.K.UCB_FORMULA_CONSTANT;

function SelectNode(root, rules)
{
    let bestUCB = 0;
    let bestChild = null;
    let selectedNode = root.clone();
    let depth = selectedNode.depth;

    // If the selected node has children, find the best descendant.
    while (depth < DEPTH_LIMIT && selectedNode.children.cache.size > 0)
    {
        for (let child of selectedNode.children.cache.keys())
        {
            if (child.visitCount > 0)
            {
                // Use PUCT formula, adjusted for adversarial play
                const P = ( 1 - rules.getPrediction(child.board, child.isPlayer1) ) ;
                const UCB_SCORE = (
                    (child.sumValue / child.visitCount) + (P * UCB_C * Math.sqrt( Math.log(child.parent.visitCount) / child.visitCount ) )
                    );
                if (UCB_SCORE > bestUCB)
                {
                    bestUCB = UCB_SCORE;
                    bestChild = child;
                }
            }
        }
        // Continue search under best child, and use the LRU children getter, to record using this child.
        selectedNode = bestChild? selectedNode.children.get(bestChild) : selectedNode.children.cache.keys().next().value;
        bestUCB = 0;
        bestChild = null;
        depth++;
    }
    return selectedNode;
}

/*

UCB1 formula: avgValue + ( 2 * sqrt( ln N / n ) )

---

avgValue:  node.sumValue / node.visitCount

ln: natural log

N: parent.visitCount

n: node.visitCount

---

Note: to avoid division by 0 error, visitCount > zero is required.
It also helps the formula work, to get at least some data from each node.

*/

;// CONCATENATED MODULE: ./src/mcts-puct/backpropagate.js

function Backpropagate(node, result)
{
    const simulatedNode = node;

    // Update all ancestors who match the simulated node by player, ending after root is updated.
    while(node.parent !== null)
    {
        if (node.parent.isPlayer1 === simulatedNode.isPlayer1)
        {
            node.parent.sumValue += result;
        }
        node.parent.visitCount++;
        node = node.parent;
    }
}

;// CONCATENATED MODULE: ./src/mcts-puct/expand.js




function Expand(node, rules)
{
    if (hasNextState(node, rules))
    {
        for (const NEXT_BOARD of rules.nextPossibleBoards)
        {
            node.children.put(new Node(NEXT_BOARD, !node.isPlayer1, 0, 0, node))
        }
    }
    else
    {
        handleLeaf(node, rules);
    }
}

function handleLeaf(node, rules)
{
    let result = 0;
    if (isTie(rules))
    {
        result = setup/* SETUP */.K.REWARD.TIE;
    }
    else if (isWin(node, rules))
    {
        result = calculateProvenWinReward(node.depth);
        node.isProvenWinner = true;
    }
    node.sumValue += result;
    node.visitCount++;
    Backpropagate(node, result);
}

function hasNextState(node, rules)
{
    return (rules.hasGeneratedNextPossibleStates(node.board, node.isPlayer1));
}

function isTie(rules)
{
    return (rules.winner.isPlayer1 === null);
}

function isWin(node, rules)
{
    return (rules.winner.isPlayer1 && node.parent.isPlayer1 || !rules.winner.isPlayer1 && !node.parent.isPlayer1);
}

function calculateProvenWinReward(depth) {
    switch(depth)
    {
        // An exponential decay function for rewards by depth, from Depth 1: million to Depth > 9.
        // These large rewards may help to differentiate between a winning game vs a won game.
        // Otherwise, a winning depth-limited agent may be happy to push pieces in a circle.
        // Basically, a proven win should be worth more than a win guess after simulation.
        // Likewise, a near win should be worth more than a distant win.

        // case 1:  Depth 1 doesn't need a reward, since proven winners are always chosen.
        //     return 1E6;
        case 2:
            return 400000;
        case 3:
            return 150000;
        case 4:
            return 60000;
        case 5:
            return 20000;
        case 6:
            return 6000;
        case 7:
            return 1500;
        case 8:
            return 400;
        case 9:
            return 120;
        default:
            return 30;
    }
}

;// CONCATENATED MODULE: ./src/random.js

/// Functions for random behavior.

function GetRandomNextBoard(nextPossibleBoards)
{
    const MAX = nextPossibleBoards.length;
    const RANDOM_INDEX = getRandomIndexExclusive(MAX);
    return nextPossibleBoards[RANDOM_INDEX];
}

// Returns random key from Set or Map.
// Source: https://stackoverflow.com/questions/42739256/how-get-random-item-from-es6-map-or-set
// This is slow O(n), so if there's a lot of keys, better take one of the first few keys,
// Or use a data structure that supports random access.
function GetRandomKey(collection) {
    let counter = 0;
    const RANDOM_INDEX = getRandomIndexExclusive(collection.size);
    for (let key of collection.keys()) {
        if (counter++ === RANDOM_INDEX) {
            return key;
        }
    }
}

// Returns random integer between [zero, max).
function getRandomIndexExclusive(max)
{
    return Math.floor(Math.random() * max);
}

;// CONCATENATED MODULE: ./src/mcts-puct/simulate.js



const simulate_DEPTH_LIMIT = setup/* SETUP */.K.PUCT_SIMULATION_DEPTH_LIMIT;
const TURN_LIMIT = setup/* SETUP */.K.MAX_TURNS_PER_GAME;

function Simulate(child, rules)
{
    let result = 0;
    const IS_PLAYER1_WINNER = getIsPlayer1Winner(child.board, child.isPlayer1, rules);
    if (IS_PLAYER1_WINNER === null)
    {
        result = setup/* SETUP */.K.REWARD.TIE;
    }
    else if (IS_PLAYER1_WINNER && child.parent.isPlayer1 || !IS_PLAYER1_WINNER && !child.parent.isPlayer1)
    {
        result = setup/* SETUP */.K.REWARD.WIN;
    }
    child.sumValue += result;
    child.visitCount++;
    return result;
}

///  Returns true for player1 win or false for loss, null if none.
function getIsPlayer1Winner(board, isPlayer1, rules)
{
    // Game loop for sim
    let turn = 0;
    let depth = 0;
    while(true)
    {
        const HAS_NEXT_STATE = rules.hasGeneratedNextPossibleStates(board, isPlayer1);

        // Check for a winner.
        if (rules.winner.isPlayer1 !== null)
        {
            return rules.winner.isPlayer1;
        }
        // Check for a tie.
        else if(!HAS_NEXT_STATE)
        {
            return null;
        }
        // Maybe continue.
        else if (depth < simulate_DEPTH_LIMIT && turn < TURN_LIMIT )
        {
            board = GetPredictedNextBoard(isPlayer1, rules);
            isPlayer1 = !isPlayer1;
            depth++;
        }
        // Guess result.
        else
        {
            return rules.willPlayer1Win(board, isPlayer1);
        }
    }
}

function GetPredictedNextBoard(currentIsPlayer1, rules)
{
    // Choose the board that has the least predicted chance for the opponent to win.
    let bestPrediction = Number.MAX_VALUE;
    let bestBoards = [];
    for (const NEXT_POSSIBLE_BOARD of rules.nextPossibleBoards)
    {
        const PREDICTION = rules.getPrediction(NEXT_POSSIBLE_BOARD, !currentIsPlayer1);
        if (PREDICTION < bestPrediction)
        {
            bestPrediction = PREDICTION;
            bestBoards = [];
            bestBoards.push(NEXT_POSSIBLE_BOARD);
        }
        else if (PREDICTION === bestPrediction)
        {
            bestBoards.push(NEXT_POSSIBLE_BOARD);
        }
    }
    return (bestBoards.length > 1) ? GetRandomNextBoard(bestBoards) : bestBoards[0];
}

// EXTERNAL MODULE: ./src/game-rules/tictactoe.js
var tictactoe = __webpack_require__(706);
// EXTERNAL MODULE: ./src/game-rules/checkers.js
var checkers = __webpack_require__(512);
;// CONCATENATED MODULE: ./src/mcts-puct/mcts_putc.js









const SEARCH_TIME = setup/* SETUP */.K.SEARCH_TIME;
const MAX_ITERATIONS = setup/* SETUP */.K.MAX_ITERATIONS;
const mcts_putc_DEPTH_LIMIT = setup/* SETUP */.K.PUCT_TREE_DEPTH_LIMIT;

class MCTS_PUCT_Logic
{
    constructor()
    {
        this.endSearchTime = null;
        this.rootNode = null;
        this.rules = null;
    }

    init(game, isPlayer1)
    {
        this.endSearchTime = (Date.now() + SEARCH_TIME);
        this.rootNode = new Node(game.board, isPlayer1);
        if (this.rules === null)
        {
            this.rules = this.getSimulationRules(game);
        }
        this.expandRoot(game.rules.nextPossibleBoards);
        for (const CHILD of this.rootNode.children.cache.keys())
        {
            const RESULT = Simulate(CHILD, this.rules);
            Backpropagate(CHILD, RESULT);
        }
    }

    getNextState()
    {
        while (this.hasTimeToThink() && this.hasMoreIterations())
        {
            const NODE_TO_VISIT = SelectNode(this.rootNode, this.rules);
            if (NODE_TO_VISIT.depth < mcts_putc_DEPTH_LIMIT)
            {
                Expand(NODE_TO_VISIT, this.rules);
                // Get first child via LRU children getter, which moves child to end, cycling who gets simulated next visit.
                for (let child of NODE_TO_VISIT.children.cache.keys())
                {
                    const CHILD_TO_SIM = NODE_TO_VISIT.children.get(child);
                    const RESULT = Simulate(CHILD_TO_SIM, this.rules);
                    Backpropagate(CHILD_TO_SIM, RESULT);
                    break;
                }
            }
            else
            {
                // At tree depth limit, just simulate the node.
                const RESULT = Simulate(NODE_TO_VISIT, this.rules);
                Backpropagate(NODE_TO_VISIT, RESULT);
            }
        }
        return this.getBest();
    }

    hasTimeToThink()
    {
        return (Date.now() < this.endSearchTime);
    }

    hasMoreIterations()
    {
        return (this.rootNode.visitCount < MAX_ITERATIONS);
    }

    getBest()
    {
        let bestChild = null;
        let bestVisitCount = 0;

        for (const CHILD of this.rootNode.children.cache.keys())
        {
            if (CHILD.isProvenWinner === true)
            {
                bestChild = CHILD;
                break;
            }
            if (CHILD.visitCount > bestVisitCount)
            {
                bestVisitCount = CHILD.visitCount;
                bestChild = CHILD;
            }
        }
        return bestChild.board;
    }

    getSimulationRules(game)
    {
        let rules = null;
        switch(game.name)
        {
            case "tictactoe":
                rules = new tictactoe/* TicTacToeRules */.u();
                break;
            case "checkers":
                rules = new checkers/* CheckersRules */.Y();
                break;
            default:
                console.error("Error: invalid game passed to MCTS for simulation.")
                break;
        }
        return rules;
    }

    expandRoot(nextPossibleBoards)
    {
        for (const BOARD of nextPossibleBoards)
        {
            this.rootNode.children.put(new Node(BOARD, !this.rootNode.isPlayer1, 0, 0, this.rootNode));
        }
    }
}

;// CONCATENATED MODULE: ./src/mcts-uct-enhanced/children.js


/*
This is an LRU cache for Node children.
The Least Recently Used child is deleted upon reaching max capacity.
This data structure, combined with a depth limit, is a simple way to cap memory use.

Based on Sean Welsh Brown's implementation.
Source: https://dev.to/seanwelshbrown/implement-a-simple-lru-cache-in-javascript-4o92
*/

class children_Children
{
    constructor(depth, childrenToClone = null)
    {
      this.cache = childrenToClone ? new Set(childrenToClone.cache) : new Set();
      this.capacity = children_initCapacity(depth);
    }

    get(key)
    {
        if (!this.cache.has(key)) return undefined;

        this.cache.delete(key);
        this.cache.add(key);
        return key;
    }

    put(key)
    {
        this.cache.delete(key);

        if (this.cache.size === this.capacity) {
          this.cache.delete(this.cache.keys().next().value);
          this.cache.add(key);
        } else {
          this.cache.add(key);
        }
    }
}

function children_initCapacity (depth)
{
  if (depth === 1)
  {
    return setup/* SETUP */.K.ROOT_DEPTH_1_CHILD_CAPACITY;
  }
  else if (depth === 2)
  {
    return setup/* SETUP */.K.NODE_DEPTH_2_CHILD_CAPACITY;
  }
  else
  {
    return setup/* SETUP */.K.NODE_GENERAL_CHILD_CAPACITY;
  }
}

;// CONCATENATED MODULE: ./src/mcts-uct-enhanced/node.js


class node_Node
{
    constructor(board, isPlayer1, visitCount = 0, sumValue = 0, parent = null, childrenToClone = null, isProvenWinner = false)
    {
        this.board = board;
        this.isPlayer1 = isPlayer1;
        this.visitCount = visitCount;
        this.sumValue = sumValue;
        this.parent = parent;
        this.depth = (parent === null) ? 0 : parent.depth + 1;
        this.children = new children_Children(this.depth + 1, childrenToClone);
        this.isProvenWinner = isProvenWinner;
    }

    clone()
    {
        return (new node_Node(this.board, this.isPlayer1, this.visitCount, this.sumValue, this.parent, this.children, this.isProvenWinner));
    }
}

;// CONCATENATED MODULE: ./src/mcts-uct-enhanced/select.js


const select_DEPTH_LIMIT = setup/* SETUP */.K.TREE_DEPTH_LIMIT;
const select_UCB_C = setup/* SETUP */.K.UCB_FORMULA_CONSTANT;

function select_SelectNode(root)
{
    let bestUCB = 0;
    let bestChild = null;
    let selectedNode = root.clone();

    // If the selected node has children, find the best descendant.
    while (selectedNode.depth < select_DEPTH_LIMIT && selectedNode.children.cache.size > 0)
    {
        for (let child of selectedNode.children.cache.keys())
        {
            if (child.visitCount > 0)
            {
                // Use UCB1 formula to find best node.
                const UCB_SCORE = (
                    (child.sumValue / child.visitCount) + (select_UCB_C * Math.sqrt( Math.log(child.parent.visitCount) / child.visitCount ) )
                    );
                if (UCB_SCORE > bestUCB)
                {
                    bestUCB = UCB_SCORE;
                    bestChild = child;
                }
            }
        }
        // Continue search under best child, and use the LRU children getter, to record using this child.
        selectedNode = bestChild? selectedNode.children.get(bestChild) : selectedNode.children.cache.keys().next().value;
        bestUCB = 0;
        bestChild = null;
    }
    return selectedNode;
}

/*

UCB1 formula: avgValue + ( 2 * sqrt( ln N / n ) )

---

avgValue:  node.sumValue / node.visitCount

ln: natural log

N: parent.visitCount

n: node.visitCount

---

Note: to avoid division by 0 error, visitCount > zero is required.
It also helps the formula work, to get at least some data from each node.

*/

;// CONCATENATED MODULE: ./src/mcts-uct-enhanced/backpropagate.js

function backpropagate_Backpropagate(node, result)
{
    const simulatedNode = node;

    // Update all ancestors who match the simulated node by player, ending after root is updated.
    while(node.parent !== null)
    {
        if (node.parent.isPlayer1 === simulatedNode.isPlayer1)
        {
            node.parent.sumValue += result;
        }
        node.parent.visitCount++;
        node = node.parent;
    }
}

;// CONCATENATED MODULE: ./src/mcts-uct-enhanced/expand.js




function expand_Expand(node, rules)
{
    if (expand_hasNextState(node, rules))
    {
        for (const NEXT_BOARD of rules.nextPossibleBoards)
        {
            node.children.put(new node_Node(NEXT_BOARD, !node.isPlayer1, 0, 0, node))
        }
    }
    else
    {
        expand_handleLeaf(node, rules);
    }
}

function expand_handleLeaf(node, rules)
{
    let result = 0;
    if (expand_isTie(rules))
    {
        result = setup/* SETUP */.K.REWARD.TIE;
    }
    else if (expand_isWin(node, rules))
    {
        result = expand_calculateProvenWinReward(node.depth);
        node.isProvenWinner = true;
    }
    node.sumValue += result;
    node.visitCount++;
    backpropagate_Backpropagate(node, result);
}

function expand_hasNextState(node, rules)
{
    return (rules.hasGeneratedNextPossibleStates(node.board, node.isPlayer1));
}

function expand_isTie(rules)
{
    return (rules.winner.isPlayer1 === null);
}

function expand_isWin(node, rules)
{
    return (rules.winner.isPlayer1 && node.parent.isPlayer1 || !rules.winner.isPlayer1 && !node.parent.isPlayer1);
}

function expand_calculateProvenWinReward(depth) {
    switch(depth)
    {
        // An exponential decay function for rewards by depth, from Depth 1: million to Depth > 9.
        // These large rewards may help to differentiate between a winning game vs a won game.
        // Otherwise, a winning depth-limited agent may be happy to push pieces in a circle.
        // Basically, a proven win should be worth more than a win guess after simulation.
        // Likewise, a near win should be worth more than a distant win.

        // case 1:  Depth 1 doesn't need a reward, since proven winners are always chosen.
        //     return 1E6;
        case 2:
            return 400000;
        case 3:
            return 150000;
        case 4:
            return 60000;
        case 5:
            return 20000;
        case 6:
            return 6000;
        case 7:
            return 1500;
        case 8:
            return 400;
        case 9:
            return 120;
        default:
            return 30;
    }
}

;// CONCATENATED MODULE: ./src/mcts-uct-enhanced/simulate.js



const mcts_uct_enhanced_simulate_DEPTH_LIMIT = setup/* SETUP */.K.SIMULATION_DEPTH_LIMIT;

function simulate_Simulate(child, rules)
{
    let result = 0;
    const IS_PLAYER1_WINNER = simulate_getIsPlayer1Winner(child.board, child.isPlayer1, rules);
    if (IS_PLAYER1_WINNER === null)
    {
        result = setup/* SETUP */.K.REWARD.TIE;
    }
    else if (IS_PLAYER1_WINNER && child.parent.isPlayer1 || !IS_PLAYER1_WINNER && !child.parent.isPlayer1)
    {
        result = setup/* SETUP */.K.REWARD.WIN;
    }
    child.sumValue += result;
    child.visitCount++;
    return result;
}

///  Returns true for player1 win or false for loss, null if none.
function simulate_getIsPlayer1Winner(board, isPlayer1, rules)
{
    // Game loop for sim
    let depth = 0;
    while(true)
    {
        const HAS_NEXT_STATE = rules.hasGeneratedNextPossibleStates(board, isPlayer1);

        // Check for a winner.
        if (rules.winner.isPlayer1 !== null)
        {
            return rules.winner.isPlayer1;
        }
        // Check for a tie.
        else if(!HAS_NEXT_STATE)
        {
            return null;
        }
        // Maybe continue.
        else if (depth < mcts_uct_enhanced_simulate_DEPTH_LIMIT)
        {
            board = GetRandomNextBoard(rules.nextPossibleBoards);
            isPlayer1 = !isPlayer1;
            depth++;
        }
        // Guess result.
        else
        {
            return rules.willPlayer1Win(board, isPlayer1);
        }
    }
}

;// CONCATENATED MODULE: ./src/mcts-uct-enhanced/mcts_utc_enhanced.js









const mcts_utc_enhanced_SEARCH_TIME = setup/* SETUP */.K.SEARCH_TIME;
const mcts_utc_enhanced_MAX_ITERATIONS = setup/* SETUP */.K.MAX_ITERATIONS;
const mcts_utc_enhanced_DEPTH_LIMIT = setup/* SETUP */.K.TREE_DEPTH_LIMIT;

class MCTS_UCT_Enhanced_Logic
{
    constructor()
    {
        this.endSearchTime = null;
        this.rootNode = null;
        this.rules = null;
    }

    init(game, isPlayer1)
    {
        this.endSearchTime = (Date.now() + mcts_utc_enhanced_SEARCH_TIME);
        this.rootNode = new node_Node(game.board, isPlayer1);
        this.rules = this.getSimulationRules(game);

        this.expandRoot(game.rules.nextPossibleBoards);
        for (const CHILD of this.rootNode.children.cache.keys())
        {
            const RESULT = simulate_Simulate(CHILD, this.rules);
            backpropagate_Backpropagate(CHILD, RESULT);
        }
    }

    getNextState()
    {
        while (this.hasTimeToThink() && this.hasMoreIterations())
        {
            const NODE_TO_VISIT = select_SelectNode(this.rootNode);
            if (NODE_TO_VISIT.depth < mcts_utc_enhanced_DEPTH_LIMIT)
            {
                expand_Expand(NODE_TO_VISIT, this.rules);
                // Get first child via LRU children getter, which moves child to end, cycling who gets simulated next visit.
                for (let child of NODE_TO_VISIT.children.cache.keys())
                {
                    const CHILD_TO_SIM = NODE_TO_VISIT.children.get(child);
                    const RESULT = simulate_Simulate(CHILD_TO_SIM, this.rules);
                    backpropagate_Backpropagate(CHILD_TO_SIM, RESULT);
                    break;
                }
            }
            else
            {
                // At tree depth limit, just simulate the node.
                const RESULT = simulate_Simulate(NODE_TO_VISIT, this.rules);
                backpropagate_Backpropagate(NODE_TO_VISIT, RESULT);
            }
        }
        return this.getBest();
    }

    hasTimeToThink()
    {
        return (Date.now() < this.endSearchTime);
    }

    hasMoreIterations()
    {
        return (this.rootNode.visitCount < mcts_utc_enhanced_MAX_ITERATIONS);
    }

    getBest()
    {
        let bestChild = null;
        let bestVisitCount = 0;

        for (const CHILD of this.rootNode.children.cache.keys())
        {
            if (CHILD.isProvenWinner === true)
            {
                bestChild = CHILD;
                break;
            }
            if (CHILD.visitCount > bestVisitCount)
            {
                bestVisitCount = CHILD.visitCount;
                bestChild = CHILD;
            }
        }
        return bestChild.board;
    }

    getSimulationRules(game)
    {
        let rules = null;
        switch(game.name)
        {
            case "tictactoe":
                rules = new tictactoe/* TicTacToeRules */.u();
                break;
            case "checkers":
                rules = new checkers/* CheckersRules */.Y();
                break;
            default:
                console.error("Error: invalid game passed to MCTS for simulation.")
                break;
        }
        return rules;
    }

    expandRoot(nextPossibleBoards)
    {
        for (const BOARD of nextPossibleBoards)
        {
            this.rootNode.children.put(new node_Node(BOARD, !this.rootNode.isPlayer1, 0, 0, this.rootNode));
        }
    }
}

;// CONCATENATED MODULE: ./src/mcts-uct/node.js

class mcts_uct_node_Node
{
    constructor(board, isPlayer1, visitCount = 0, sumValue = 0, parent = null, children = null)
    {
        this.board = board;
        this.isPlayer1 = isPlayer1;
        this.visitCount = visitCount;
        this.sumValue = sumValue;
        this.parent = parent;
        this.children = new Set(children);
    }

    clone()
    {
        return (new mcts_uct_node_Node(this.board, this.isPlayer1, this.visitCount, this.sumValue, this.parent, this.children));
    }
}

;// CONCATENATED MODULE: ./src/mcts-uct/select.js



const mcts_uct_select_UCB_C = setup/* SETUP */.K.UCB_FORMULA_CONSTANT;

/// Return descendent child key with max UCB value.
function mcts_uct_select_SelectNode(root)
{
    let bestUCB = 0;
    let bestChild = null;
    let selectedNode = root.clone();

    // If the selected node has a map of children, find the best descendant.
    while (selectedNode.children.size > 0)
    {
        for (let child of selectedNode.children.keys())
        {
            if (child.visitCount > 0)
            {
                const UCB_SCORE = (
                    (child.sumValue / child.visitCount) + ( mcts_uct_select_UCB_C * Math.sqrt( Math.log(child.parent.visitCount) / child.visitCount ) )
                    );
                if (UCB_SCORE > bestUCB)
                {
                    bestUCB = UCB_SCORE;
                    bestChild = child;
                }
            }
        }
        // Continue search under best child.
        selectedNode = bestChild? bestChild: GetRandomKey(selectedNode.children); // Use this, or maybe use selectedNode.children.keys().next().value;
        bestUCB = 0;
        bestChild = null;
    }
    return selectedNode;
}

/*

UCB1 formula: avgValue + ( 2 * sqrt( ln N / n ) )

---

avgValue:  node.sumValue / node.visitCount

ln: natural log

N: parent.visitCount

n: node.visitCount

---

Note: to avoid division by 0 error, visitCount > zero is required.
It also helps the formula work, to get at least some data from each node.

*/

;// CONCATENATED MODULE: ./src/mcts-uct/backpropagate.js

function mcts_uct_backpropagate_Backpropagate(node, result)
{
    const simulatedNode = node;

    // Update all ancestors who match the simulated node by player, ending after root is updated.
    while(node.parent !== null)
    {
        if (node.parent.isPlayer1 === simulatedNode.isPlayer1)
        {
            node.parent.sumValue += result;
        }
        node.parent.visitCount++;
        node = node.parent;
    }
}

;// CONCATENATED MODULE: ./src/mcts-uct/expand.js




/// Add new nodes to given node as children, if able, or if terminal, update tree.
function mcts_uct_expand_Expand(node, rules)
{
    // Generate nextPossibleBoards / states. For each board, add to children, as an opponent.
    const HAS_NEXT_STATE = rules.hasGeneratedNextPossibleStates(node.board, node.isPlayer1);
    if (HAS_NEXT_STATE)
    {
        for (const NEXT_BOARD of rules.nextPossibleBoards)
        {
            node.children.add(new mcts_uct_node_Node(NEXT_BOARD, !node.isPlayer1, 0, 0, node, null))
        }
    }
    // When node is a leaf (game in terminal state), check result and update tree.
    else
    {
        mcts_uct_expand_handleLeaf(node, rules);
    }
}

function mcts_uct_expand_handleLeaf(node, rules)
{
    let result = 0;
    if (rules.winner.isPlayer1 === null)
    {
        result = setup/* SETUP */.K.REWARD.TIE;
    }
    else if (rules.winner.isPlayer1 && node.parent.isPlayer1 || !rules.winner.isPlayer1 && !node.parent.isPlayer1)
    {
        result = setup/* SETUP */.K.REWARD.WIN;
    }
    node.sumValue += result;
    node.visitCount++;
    mcts_uct_backpropagate_Backpropagate(node, result);
}

;// CONCATENATED MODULE: ./src/mcts-uct/simulate.js



const simulate_TURN_LIMIT = setup/* SETUP */.K.MAX_TURNS_PER_GAME;

function mcts_uct_simulate_Simulate(child, rules)
{
    let result = 0;
    const IS_PLAYER1_WINNER = getisPlayer1Winner(child.board, child.isPlayer1, rules);
    if (IS_PLAYER1_WINNER === null)
    {
        result = setup/* SETUP */.K.REWARD.TIE;
    }
    else if (IS_PLAYER1_WINNER && child.parent.isPlayer1 || !IS_PLAYER1_WINNER && !child.parent.isPlayer1)
    {
        result = setup/* SETUP */.K.REWARD.WIN;
    }
    child.sumValue += result;
    child.visitCount++;
    return result;
}

///  Returns true for player1 win or false for loss, null if none.
function getisPlayer1Winner(board, isPlayer1, rules)
{
    // Game loop for sim
    let turn = 0;
    while(true)
    {
        const HAS_NEXT_STATE = rules.hasGeneratedNextPossibleStates(board, isPlayer1);

        // Check for a winner.
        if (rules.winner.isPlayer1 !== null)
        {
            return rules.winner.isPlayer1;
        }
        // Check for a tie.
        else if( !HAS_NEXT_STATE || !(turn < simulate_TURN_LIMIT) )
        {
            return null;
        }
        // Continue game.
        else
        {
            board = GetRandomNextBoard(rules.nextPossibleBoards);
            isPlayer1 = !isPlayer1;
            turn++;
        }
    }
}

;// CONCATENATED MODULE: ./src/mcts-uct/mcts_utc.js










const mcts_utc_SEARCH_TIME = setup/* SETUP */.K.SEARCH_TIME;
const mcts_utc_MAX_ITERATIONS = setup/* SETUP */.K.MAX_ITERATIONS;

class MCTS_UCT_Logic
{
    constructor()
    {
        this.endSearchTime = null;
        this.rootNode = null;
        this.rules = null;
    }

    init(game, isPlayer1)
    {
        this.endSearchTime = (Date.now() + mcts_utc_SEARCH_TIME);
        this.rootNode = new mcts_uct_node_Node(game.board, isPlayer1);
        this.rules = this.getSimulationRules(game);

        this.fullyExpand(game.rules.nextPossibleBoards);
        for (let child of this.rootNode.children.keys())
        {
            const RESULT = mcts_uct_simulate_Simulate(child, this.rules);
            mcts_uct_backpropagate_Backpropagate(child, RESULT);
        }
    }

    getNextState()
    {
        while (this.hasTimeToThink() && (this.hasMoreIterations()))
        {
            const NODE_TO_VISIT = mcts_uct_select_SelectNode(this.rootNode);
            mcts_uct_expand_Expand(NODE_TO_VISIT, this.rules);
            for (let child of NODE_TO_VISIT.children.keys())
            {
                if (child.visitCount === 0)
                {
                    const RESULT = mcts_uct_simulate_Simulate(child, this.rules);
                    mcts_uct_backpropagate_Backpropagate(child, RESULT);
                    break;
                }
            }
        }
        return this.getBest();
    }

    hasTimeToThink()
    {
        return (Date.now() < this.endSearchTime);
    }

    hasMoreIterations()
    {
        return this.rootNode.visitCount < mcts_utc_MAX_ITERATIONS
    }

    getBest()
    {
        let bestChild = null;
        let bestVisitCount = 0;

        for (let child of this.rootNode.children.keys())
        {
            if (child.visitCount > bestVisitCount)
            {
                bestVisitCount = child.visitCount;
                bestChild = child;
            }
        }
        return bestChild.board;
    }

    getSimulationRules(game)
    {
        let rules = null;
        switch(game.name)
        {
            case "tictactoe":
                rules = new tictactoe/* TicTacToeRules */.u();
                break;
            case "checkers":
                rules = new checkers/* CheckersRules */.Y();
                break;
            default:
                console.error("Error: invalid game passed to MCTS for simulation.")
                break;
        }
        return rules;
    }

    fullyExpand(nextPossibleBoards)
    {
        for (const BOARD of nextPossibleBoards)
        {
            this.rootNode.children.add(new mcts_uct_node_Node(BOARD, !this.rootNode.isPlayer1, 0, 0, this.rootNode, null));
        }
    }
}

;// CONCATENATED MODULE: ./src/agent.js




// import { MCTS_PUCT_NET_Logic } from "./mcts-puct-net/mcts_putc_net.js";
// import { NeuralNet } from "./setup.js";

class Agent
{
    constructor(name, network = null)
    {
        this.logName = name;
        this.name = name.toLowerCase();
        switch (this.name)
        {
            case "random":
                this.logic = null;
                break;
            case "mcts-uct":
                this.logic = new MCTS_UCT_Logic();
                break;
            case "mcts-uct-enhanced":
                this.logic = new MCTS_UCT_Enhanced_Logic();
                break;
            case "mcts-puct":
                this.logic = new MCTS_PUCT_Logic();
                break;
            // case "mcts-puct-net":
            //     this.logic = new MCTS_PUCT_NET_Logic();
            //     this.requiresNetwork = true;
            //     break;
            default:
                console.error("Error: invalid agent name passed to Agent constructor.");
                break;
        }
        this.game = null;
        this.isPlayer1 = null;
        this.winCount = 0;
        console.log(this.logName + " Agent constructed.");
    }

    async begin(game, isPlayer1 = true)
    {
        this.game = game;
        this.isPlayer1 = isPlayer1;
        // if (this.requiresNetwork && !this.logic.network)
        // {
        //     this.logic.network = await NeuralNet();
        // }
        if (isPlayer1)
        {
            console.log("= = = = =");
            game.logBoard();
            console.log(`${this.logName} begins.`);
            console.log("= = = = =");
        }
    }

    async continue()
    {
        this.game.hasNextState = this.game.rules.hasGeneratedNextPossibleStates(this.game.board, this.isPlayer1);

        if (this.game.hasWinner())
        {
            this.game.isDone = true;
            console.log('Game won by Player %s.', this.game.rules.winner.logName);
        }
        else if(this.game.isOver()) // Only checks if game over, but here, this implies a tie.
        {
            this.game.isDone = true;
            console.log("Game over.");
        }
        else
        {
            await this.chooseNextState();
            this.game.logBoard();
            console.log(`Turn played by: ${this.logName}`);
            console.log("= = = = =");
        }
    }

    async chooseNextState()
    {
        if (this.name === "random")
        {
            this.game.board = GetRandomNextBoard(this.game.rules.nextPossibleBoards);
        }
        else
        {
            // Cache current board.
            this.game.lastBoard = this.game.board;
            console.log(`${this.logName} is thinking.`);
            // Set next board.
            this.logic.init(this.game, this.isPlayer1);
            this.game.board = this.logic.getNextState();
            // Derive piece movements.
            let movements = [];
            const ORIGIN = this.game.rules.deriveMovements(this.game.lastBoard, this.game.board, this.isPlayer1, movements);
            console.log("Next move origin: " + ORIGIN);
            console.log(`Next movements: [${movements.join()}]`);
            // From web worker to main thread, send move origin and movements.
            postMessage([ORIGIN, movements]);
        }
    } // End function chooseNextState()
} // End class Agent


/***/ }),

/***/ 512:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Y: () => (/* binding */ CheckersRules)
/* harmony export */ });
/* harmony import */ var _winner_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(710);

/// Board is a grid of 32 cells,
/// Usually as a string of characters,
/// From index 0 (top) to 31 (bottom),
/// Where player1 begins on the bottom.
///
///  Board vizualization:
///
///      0      1       2      3
///   4      5      6       7
///      8      9      10     11
///  12     13     14      15
///     16     17      18     19
///  20     21     22      23
///     24     25      26     27
///  28     29     30      31



const EMPTY = '+'  // Empty cell.
const MAN = 'M'  // Player1 pawn.
const KING = 'K'  // Player1 royal.
const WOMAN = 'W' // Player2 pawn.
const QUEEN = 'Q'  // Player2 royal.
const BOARD_WIDTH = 4;
const BOARD_HEIGHT = 8;
const BOARD_CELL_COUNT = 32;
const HAS_CHECKERS_PATTERN = true;  // For board logs.
const KING_PROMOTION_MAX = 4; // Max index, exclusive, of the top row.
const QUEEN_PROMOTION_MIN = 27; // Min index, exclusive, of the bottom row.

class CheckersRules
{
    constructor()
    {
        this.winner = new _winner_js__WEBPACK_IMPORTED_MODULE_0__/* .Winner */ .k();
        this.nextPossibleBoards = [];
        this.possibleTurnMovements = [];
        this.transitionMoves = [];
    }

    getNewBoard(initialBoard)
    {
        const BOARD = (initialBoard === null)? "WWWWWWWWWWWW++++++++MMMMMMMMMMMM" : initialBoard;
        return [BOARD, BOARD_HEIGHT, BOARD_WIDTH, HAS_CHECKERS_PATTERN];
    }

    hasGeneratedNextPossibleStates(board, isPlayer1)
     {
        // Clear data from any prior game / simulation.
        this.nextPossibleBoards = [];
        this.possibleTurnMovements = [];
        this.winner.isPlayer1 = null;
        this.winner.logName = null;

        let playerPawn = isPlayer1 ? MAN : WOMAN;
        let playerRoyal = isPlayer1 ? KING : QUEEN;
        let opponentPawn = isPlayer1 ? WOMAN : MAN;
        let opponentRoyal = isPlayer1 ? QUEEN : KING;

        if (this.isJumpPossibleOnBoard(board, isPlayer1, playerPawn, playerRoyal, opponentPawn, opponentRoyal))
        {
           this.pushAllJumps(board, isPlayer1, playerPawn, playerRoyal, opponentPawn, opponentRoyal);
        }
        else
        {
           this.pushAllAdjacentMoves(board, isPlayer1, playerPawn, playerRoyal);
        }
        if (this.nextPossibleBoards.length > 0)
        {
            return true;
        }
        else
        {
            // Whoever played last won.
            // So the winner is the opposite.
            this.winner.isPlayer1 = !isPlayer1;
            this.winner.logName = isPlayer1? "2" : "1";
            return false;
        }
    }

    isJumpPossibleOnBoard(board, isPlayer1, playerPawn, playerRoyal, opponentPawn, opponentRoyal)
    {
       for (let i = 0; i < BOARD_CELL_COUNT; i++)
       {
          // Check if the cell contains a piece of the current player
          if (board[i] === playerPawn || board[i] === playerRoyal)
          {
             // Calculate forward indexes near piece
             const fwdLeftIndex = isPlayer1 ? this.northWestGet(i) : this.southEastGet(i);
             const fwdRightIndex = isPlayer1 ? this.northEastGet(i) : this.southWestGet(i);
             const fwdLeftJumpIndex = isPlayer1 ? this.northWestJumpGet(i) : this.southEastJumpGet(i);
             const fwdRightJumpIndex = isPlayer1 ? this.northEastJumpGet(i) : this.southWestJumpGet(i);
             // Check for forward left jumps
             if (fwdLeftIndex !== null && fwdLeftJumpIndex !== null &&
                board[fwdLeftJumpIndex] === EMPTY &&
                (board[fwdLeftIndex] === opponentPawn ||
                board[fwdLeftIndex] === opponentRoyal))
             {
                return true;
             }
             // Check for forward right jumps
             if (fwdRightIndex !== null && fwdRightJumpIndex !== null &&
                board[fwdRightJumpIndex] === EMPTY &&
                (board[fwdRightIndex] === opponentPawn ||
                board[fwdRightIndex] === opponentRoyal))
             {
                return true;
             }
             if (board[i] === playerRoyal)
             {
                // Calculate backward cells near the piece
                const backLeftIndex = isPlayer1 ? this.southWestGet(i) : this.northEastGet(i);
                const backRightIndex = isPlayer1 ? this.southEastGet(i) : this.northWestGet(i);
                const backLeftJumpIndex = isPlayer1 ? this.southWestJumpGet(i) : this.northEastJumpGet(i);
                const backRightJumpIndex = isPlayer1 ? this.southEastJumpGet(i) : this.northWestJumpGet(i);
                // Check for back left jumps
                if (backLeftIndex !== null && backLeftJumpIndex !== null &&
                   board[backLeftJumpIndex] === EMPTY &&
                   (board[backLeftIndex] === opponentPawn ||
                   board[backLeftIndex] === opponentRoyal))
                {
                   return true;
                }
                // Check for back right jumps
                if (backRightIndex !== null && backRightJumpIndex !== null &&
                   board[backRightJumpIndex] === EMPTY &&
                   (board[backRightIndex] === opponentPawn ||
                   board[backRightIndex] === opponentRoyal))
                {
                   return true;
                }
             }
          }
       }
       return false;
    }

    pushAllJumps(board, isPlayer1, playerPawn, playerRoyal, opponentPawn, opponentRoyal) {
        for (let index = 0; index < BOARD_CELL_COUNT; index++) {
            if (board[index] === playerPawn || board[index] === playerRoyal) {
                this.generateNextJumpBoards(board, index, isPlayer1, playerPawn, playerRoyal, opponentPawn, opponentRoyal);
            }
        }
    }

    pushAllAdjacentMoves(board, isPlayer1, playerPawn, playerRoyal) {
        for (let i = 0; i < BOARD_CELL_COUNT; i++) {
            if (board[i] === playerPawn || board[i] === playerRoyal) {
                // Calculate forward indexes near piece
                const FWD_LEFT_INDEX = isPlayer1 ? this.northWestGet(i) : this.southEastGet(i);
                const FWD_RIGHT_INDEX = isPlayer1 ? this.northEastGet(i) : this.southWestGet(i);

                // Check if piece can move to adjacent cell
                if (FWD_LEFT_INDEX !== null && board[FWD_LEFT_INDEX] === EMPTY) {
                    // Make the move on a new board.
                    const [NEW_BOARD, _] = this.getNewBoardFromMove(board, i, FWD_LEFT_INDEX);
                    // Add new board to next possible boards
                    this.possibleTurnMovements.push([FWD_LEFT_INDEX]);
                    this.nextPossibleBoards.push(NEW_BOARD);
                }
                if (FWD_RIGHT_INDEX !== null && board[FWD_RIGHT_INDEX] === EMPTY) {
                    const [NEW_BOARD, _] = this.getNewBoardFromMove(board, i, FWD_RIGHT_INDEX);
                    this.possibleTurnMovements.push([FWD_RIGHT_INDEX]);
                    this.nextPossibleBoards.push(NEW_BOARD);
                }
                // Check for king moves
                if (board[i] === playerRoyal) {
                    const BACK_LEFT_INDEX = isPlayer1 ? this.southWestGet(i) : this.northEastGet(i);
                    const BACK_RIGHT_INDEX = isPlayer1 ? this.southEastGet(i) : this.northWestGet(i);
                    if (BACK_LEFT_INDEX !== null && board[BACK_LEFT_INDEX] === EMPTY) {
                        const [NEW_BOARD, _] = this.getNewBoardFromMove(board, i, BACK_LEFT_INDEX);
                        this.possibleTurnMovements.push([BACK_LEFT_INDEX]);
                        this.nextPossibleBoards.push(NEW_BOARD);
                    }
                    if (BACK_RIGHT_INDEX !== null && board[BACK_RIGHT_INDEX] === EMPTY) {
                        const [NEW_BOARD, _] = this.getNewBoardFromMove(board, i, BACK_RIGHT_INDEX);
                        this.possibleTurnMovements.push([BACK_RIGHT_INDEX]);
                        this.nextPossibleBoards.push(NEW_BOARD);
                    }
                }
            }
        }
    }

    generateNextJumpBoards(board, piece, isPlayer1, playerPawn, playerRoyal, opponentPawn, opponentRoyal)
    {
        // Calculate forward indexes near piece
        const FWD_LEFT_INDEX = isPlayer1 ? this.northWestGet(piece) : this.southEastGet(piece);
        const FWD_RIGHT_INDEX = isPlayer1 ? this.northEastGet(piece) : this.southWestGet(piece);
        const FWD_LEFT_JUMP_INDEX = isPlayer1 ? this.northWestJumpGet(piece) : this.southEastJumpGet(piece);
        const FWD_RIGHT_JUMP_INDEX = isPlayer1 ? this.northEastJumpGet(piece) : this.southWestJumpGet(piece);
        // Check for a forward left jump
        if (FWD_LEFT_INDEX !== null && FWD_LEFT_JUMP_INDEX !== null &&
            board[FWD_LEFT_JUMP_INDEX] === EMPTY &&
            (board[FWD_LEFT_INDEX] === opponentPawn ||
            board[FWD_LEFT_INDEX] === opponentRoyal))
        {
            // Make move on a new board
            let [newBoard, wasPromoted] = this.getNewBoardFromMove(board, piece, FWD_LEFT_JUMP_INDEX, FWD_LEFT_INDEX);
            // Continue jumping if possible, or if terminal, add the new board
            if (!wasPromoted && this.isJumpPossibleForPiece(newBoard, isPlayer1, FWD_LEFT_JUMP_INDEX, playerRoyal, opponentPawn, opponentRoyal))
            {
                this.transitionMoves.push(FWD_LEFT_JUMP_INDEX);
                this.generateNextJumpBoards(newBoard, FWD_LEFT_JUMP_INDEX, isPlayer1, playerPawn, playerRoyal, opponentPawn, opponentRoyal);
            }
            else
            {
                this.transitionMoves.push(FWD_LEFT_JUMP_INDEX);
                this.possibleTurnMovements.push(Array.from(this.transitionMoves));
                this.nextPossibleBoards.push(newBoard);
                this.transitionMoves = [];
            }
        }
        // Check for a forward right jump
        if (FWD_RIGHT_INDEX !== null && FWD_RIGHT_JUMP_INDEX !== null &&
            board[FWD_RIGHT_JUMP_INDEX] === EMPTY &&
            (board[FWD_RIGHT_INDEX] === opponentPawn ||
            board[FWD_RIGHT_INDEX] === opponentRoyal))
        {
            // Make move on a new board
            let [newBoard, wasPromoted] = this.getNewBoardFromMove(board, piece, FWD_RIGHT_JUMP_INDEX, FWD_RIGHT_INDEX);
            // Continue jumping if possible, or if terminal, add the new board
            if (!wasPromoted && this.isJumpPossibleForPiece(newBoard, isPlayer1, FWD_RIGHT_JUMP_INDEX, playerRoyal, opponentPawn, opponentRoyal))
            {
                this.transitionMoves.push(FWD_RIGHT_JUMP_INDEX);
                this.generateNextJumpBoards(newBoard, FWD_RIGHT_JUMP_INDEX, isPlayer1, playerPawn, playerRoyal, opponentPawn, opponentRoyal);
            }
            else
            {
                this.transitionMoves.push(FWD_RIGHT_JUMP_INDEX);
                this.possibleTurnMovements.push(Array.from(this.transitionMoves));
                this.nextPossibleBoards.push(newBoard);
                this.transitionMoves = [];
            }
        }
        // Check if the piece is a king
        if (board[piece] === playerRoyal)
        {
            // Calculate backward cells near the piece
            const BACK_LEFT_INDEX = isPlayer1 ? this.southWestGet(piece) : this.northEastGet(piece);
            const BACK_RIGHT_INDEX = isPlayer1 ? this.southEastGet(piece) : this.northWestGet(piece);
            const BACK_LEFT_JUMP_INDEX = isPlayer1 ? this.southWestJumpGet(piece) : this.northEastJumpGet(piece);
            const BACK_RIGHT_JUMP_INDEX = isPlayer1 ? this.southEastJumpGet(piece) : this.northWestJumpGet(piece);
            // Check for a back left jump
            if (BACK_LEFT_INDEX !== null && BACK_LEFT_JUMP_INDEX !== null &&
                board[BACK_LEFT_JUMP_INDEX] === EMPTY &&
                (board[BACK_LEFT_INDEX] === opponentPawn ||
                board[BACK_LEFT_INDEX] === opponentRoyal))
            {
                // Make move on a new board
                let [newBoard, wasPromoted] = this.getNewBoardFromMove(board, piece, BACK_LEFT_JUMP_INDEX, BACK_LEFT_INDEX);
                // Continue jumping if possible, or if terminal, add the new board
                if (!wasPromoted && this.isJumpPossibleForPiece(newBoard, isPlayer1, BACK_LEFT_JUMP_INDEX, playerRoyal, opponentPawn, opponentRoyal))
                {
                    this.transitionMoves.push(BACK_LEFT_JUMP_INDEX);
                    this.generateNextJumpBoards(newBoard, BACK_LEFT_JUMP_INDEX, isPlayer1, playerPawn, playerRoyal, opponentPawn, opponentRoyal);
                }
                else
                {
                    this.transitionMoves.push(BACK_LEFT_JUMP_INDEX);
                    this.possibleTurnMovements.push(Array.from(this.transitionMoves));
                    this.nextPossibleBoards.push(newBoard);
                    this.transitionMoves = [];
                }
            }
            // Check for a back right jump
            if (BACK_RIGHT_INDEX !== null && BACK_RIGHT_JUMP_INDEX !== null &&
                board[BACK_RIGHT_JUMP_INDEX] === EMPTY &&
                (board[BACK_RIGHT_INDEX] === opponentPawn ||
                board[BACK_RIGHT_INDEX] === opponentRoyal))
            {
                // Make move on a new board
                let [newBoard, wasPromoted] = this.getNewBoardFromMove(board, piece, BACK_RIGHT_JUMP_INDEX, BACK_RIGHT_INDEX);
                // Continue jumping if possible, or if terminal, add the new board
                if (!wasPromoted && this.isJumpPossibleForPiece(newBoard, isPlayer1, BACK_RIGHT_JUMP_INDEX, playerRoyal, opponentPawn, opponentRoyal))
                {
                    this.transitionMoves.push(BACK_RIGHT_JUMP_INDEX);
                    this.generateNextJumpBoards(newBoard, BACK_RIGHT_JUMP_INDEX, isPlayer1, playerPawn, playerRoyal, opponentPawn, opponentRoyal);
                }
                else
                {
                    this.transitionMoves.push(BACK_RIGHT_JUMP_INDEX);
                    this.possibleTurnMovements.push(Array.from(this.transitionMoves));
                    this.nextPossibleBoards.push(newBoard);
                    this.transitionMoves = [];
                }
            }
        }
    }

    isJumpPossibleForPiece(board, isPlayer1, pieceIndex, playerRoyal, opponentPawn, opponentRoyal)
    {
        // Calculate forward indexes near piece
        let fwdLeftIndex = isPlayer1 ? this.northWestGet(pieceIndex) : this.southEastGet(pieceIndex);
        let fwdRightIndex = isPlayer1 ? this.northEastGet(pieceIndex) : this.southWestGet(pieceIndex);
        let fwdLeftJumpIndex = isPlayer1 ? this.northWestJumpGet(pieceIndex) : this.southEastJumpGet(pieceIndex);
        let fwdRightJumpIndex = isPlayer1 ? this.northEastJumpGet(pieceIndex) : this.southWestJumpGet(pieceIndex);
        // Check for forward left jumps
        if (fwdLeftIndex !== null && fwdLeftJumpIndex !== null &&
            board[fwdLeftJumpIndex] === EMPTY &&
            (board[fwdLeftIndex] === opponentPawn ||
            board[fwdLeftIndex] === opponentRoyal))
        {
            return true;
        }
        // Check for forward right jumps
        if (fwdRightIndex !== null && fwdRightJumpIndex !== null &&
            board[fwdRightJumpIndex] === EMPTY &&
            (board[fwdRightIndex] === opponentPawn ||
            board[fwdRightIndex] === opponentRoyal))
        {
            return true;
        }
        if (board[pieceIndex] === playerRoyal)
        {
            // Calculate backward cells near the piece
            let backLeftIndex = isPlayer1 ? this.southWestGet(pieceIndex) : this.northEastGet(pieceIndex);
            let backRightIndex = isPlayer1 ? this.southEastGet(pieceIndex) : this.northWestGet(pieceIndex);
            let backLeftJumpIndex = isPlayer1 ? this.southWestJumpGet(pieceIndex) : this.northEastJumpGet(pieceIndex);
            let backRightJumpIndex = isPlayer1 ? this.southEastJumpGet(pieceIndex) : this.northWestJumpGet(pieceIndex);
            // Check for back left jumps
            if (backLeftIndex !== null && backLeftJumpIndex !== null &&
                board[backLeftJumpIndex] === EMPTY &&
                (board[backLeftIndex] === opponentPawn ||
                board[backLeftIndex] === opponentRoyal))
            {
                return true;
            }
            // Check for back right jumps
            if (backRightIndex !== null && backRightJumpIndex !== null &&
                board[backRightJumpIndex] === EMPTY &&
                (board[backRightIndex] === opponentPawn ||
                board[backRightIndex] === opponentRoyal))
            {
                return true;
            }
        }
        return false;
    }

    getNewBoardFromMove (board, originIndex, destinationIndex, opponentIndex = null)
    {
        // Move piece to destination.
        let newBoard = board.split("");
        newBoard[destinationIndex] = board[originIndex];
        newBoard[originIndex] = EMPTY;

        // If an opponent was jumped, remove it.
        if (opponentIndex !== null)
            newBoard[opponentIndex] = EMPTY;

        // Check if a pawn reached the last row and promote if necessary.
        let wasPromoted = false;
        if (newBoard[destinationIndex] === MAN && destinationIndex < KING_PROMOTION_MAX)
        {
            newBoard[destinationIndex] = KING;
            wasPromoted = true;
        }
        if (newBoard[destinationIndex] === WOMAN && destinationIndex > QUEEN_PROMOTION_MIN)
        {
            newBoard[destinationIndex] = QUEEN;
            wasPromoted = true;
        }
        return [newBoard.join(""), wasPromoted]
    }

    /// ---
    /// Functions to help find what's near any given piece.
    /// Returns some board index nearby a given piece index.
    /// Returns null if off the board.
    /// ---

    northWestGet(index) {
        // Index visual of the checker board to confirm below.
        //   +  0   +  1   +   2   +  3
        //   4  +   5  +   6   +   7  +
        //   +  8   +  9   +  10   + 11
        //  12  +  13  +  14   +  15  +
        //   + 16   + 17   +  18   + 19
        //  20  +  21  +  22   +  23  +
        //   + 24   + 25   +  26   + 27
        //  28  +  29  +  30   +  31  +
        // Check for topmost cells that have no northWest.
        if (index < 5)
            return null;
        // Check rows that offset toward East, which all have a northWest.
        if ((index % 8) < 4)
        {
            return index - 4;
        }
        // Row is not offset, so after each remaining row beginning, calculate the northWest.
        else
        {
            // Check if row beginning.
            if (index % 4 == 0)
                return null;
            else
                return index - 5;
        }
    }

    northEastGet(index) {
        // Index visual of the checker board to confirm below.
        //   +  0   +  1   +   2   +  3
        //   4  +   5  +   6   +   7  +
        //   +  8   +  9   +  10   + 11
        //  12  +  13  +  14   +  15  +
        //   + 16   + 17   +  18   + 19
        //  20  +  21  +  22   +  23  +
        //   + 24   + 25   +  26   + 27
        //  28  +  29  +  30   +  31  +
        // Check the top row, which has no northEast.
        if (index < 4)
            return null;
        // Check rows that offset toward East, which all, except for end cells, have a northEast.
        if ((index % 8) < 4)
        {
            if (index % 4 == 3)
                return null;
            else
                return index - 3;
        }
        // Row is not offset, so for all cells calculate the northEast.
        else
        {
            return index - 4;
        }
    }

    southWestGet(index) {
        // Index visual of the checker board to confirm below.
        //   +  0   +  1   +   2   +  3
        //   4  +   5  +   6   +   7  +
        //   +  8   +  9   +  10   + 11
        //  12  +  13  +  14   +  15  +
        //   + 16   + 17   +  18   + 19
        //  20  +  21  +  22   +  23  +
        //   + 24   + 25   +  26   + 27
        //  28  +  29  +  30   +  31  +
        // Check for lowest row cells that have no southWest.
        if (index > 27)
            return null;
        // Check rows that offset toward East, which all have a southWest.
        if ((index % 8) < 4)
        {
            return index + 4;
        }
        // Row is not offset, so after each remaining row beginning, calculate the southWest.
        else
        {
            // Check if row beginning.
            if (index % 4 == 0)
                return null;
            else
                return index + 3;
        }
    }

    southEastGet(index) {
        // Index visual of the checker board to confirm below.
        //   +  0   +  1   +   2   +  3
        //   4  +   5  +   6   +   7  +
        //   +  8   +  9   +  10   + 11
        //  12  +  13  +  14   +  15  +
        //   + 16   + 17   +  18   + 19
        //  20  +  21  +  22   +  23  +
        //   + 24   + 25   +  26   + 27
        //  28  +  29  +  30   +  31  +
        // Check near bottom row cells, which have no southEast.
        if (index > 26)
            return null;
        // Check rows that offset toward East, which all, except for end cells, have a southEast.
        if ((index % 8) < 4)
        {
            if (index % 4 == 3)
                return null;
            else
                return index + 5;
        }
        // Row is not offset, so for all cells calculate the southEast.
        else
        {
            return index + 4;
        }
    }

    northWestJumpGet(index) {
        // Index visual of the checker board to confirm below.
        //   +  0   +  1   +   2   +  3
        //   4  +   5  +   6   +   7  +
        //   +  8   +  9   +  10   + 11
        //  12  +  13  +  14   +  15  +
        //   + 16   + 17   +  18   + 19
        //  20  +  21  +  22   +  23  +
        //   + 24   + 25   +  26   + 27
        //  28  +  29  +  30   +  31  +
        // Check for topmost cells or row beginnings, all which have no northWest jump.
        if (index < 9 || index % 4 == 0)
            return null;
        else
            return index - 9;
    }

    northEastJumpGet(index) {
        // Index visual of the checker board to confirm below.
        //   +  0   +  1   +   2   +  3
        //   4  +   5  +   6   +   7  +
        //   +  8   +  9   +  10   + 11
        //  12  +  13  +  14   +  15  +
        //   + 16   + 17   +  18   + 19
        //  20  +  21  +  22   +  23  +
        //   + 24   + 25   +  26   + 27
        //  28  +  29  +  30   +  31  +
        // Check for topmost cells or row ends, all which have no northEast jump.
        if (index < 8 || index % 4 == 3)
            return null;
        else
            return index - 7;
    }

    southWestJumpGet(index) {
        // Index visual of the checker board to confirm below.
        //   +  0   +  1   +   2   +  3
        //   4  +   5  +   6   +   7  +
        //   +  8   +  9   +  10   + 11
        //  12  +  13  +  14   +  15  +
        //   + 16   + 17   +  18   + 19
        //  20  +  21  +  22   +  23  +
        //   + 24   + 25   +  26   + 27
        //  28  +  29  +  30   +  31  +
        // Check for bottom cells or row beginnings, which all have no southWest jump.
        if (index > 23 || index % 4 == 0)
            return null;
        else
            return index + 7;
    }

    southEastJumpGet(index) {
        // Index visual of the checker board to confirm below.
        //   +  0   +  1   +   2   +  3
        //   4  +   5  +   6   +   7  +
        //   +  8   +  9   +  10   + 11
        //  12  +  13  +  14   +  15  +
        //   + 16   + 17   +  18   + 19
        //  20  +  21  +  22   +  23  +
        //   + 24   + 25   +  26   + 27
        //  28  +  29  +  30   +  31  +
        // Check for bottom cells or row ends, which all have no southEast jump.
        if (index > 23 || index % 4 == 3)
            return null;
        else
            return index + 9;
    }

    ///  Helper to console log boards in a checkers pattern.
    getSpecialPattern(board, textRow, x, y)
    {
        let cellIndex = (y * BOARD_WIDTH) + x;
        if (y % 2 == 1)
        {
            textRow.push(board[cellIndex]);
            textRow.push(" ")
        }
        else if (x % BOARD_WIDTH == 0)
        {
            textRow.push(" ");
            textRow.push(board[cellIndex])
            textRow.push(" ");
        }
        else
        {
            textRow.push(board[cellIndex])
            textRow.push(" ");
        }
        return textRow;
    }

    /// An eval function for simulations at a depth limit to guess the game result.
    /// An advantage of more than a pawn predicts a Win, otherwise a Tie.
    /// Returns true for player1 win, false for loss, or null for tie.
    willPlayer1Win(board, isPlayer1)
    {
        const ACTIVE_PAWN = isPlayer1? MAN : WOMAN;
        const ACTIVE_ROYAL = isPlayer1? KING : QUEEN;
        const OPPONENT_PAWN = isPlayer1? WOMAN : MAN;
        const OPPONENT_ROYAL = isPlayer1? QUEEN : KING;

        let activePawnCount = 0;
        let activeRoyalCount = 0;
        let opponentPawnCount = 0;
        let opponentRoyalCount = 0;

        // Count each piece type on board.
        for (let i = 0; i < BOARD_CELL_COUNT; i++)
        {
            if (board[i] === ACTIVE_PAWN)
                activePawnCount++;
            else if (board[i] === ACTIVE_ROYAL)
                activeRoyalCount++;
            else if (board[i] === OPPONENT_PAWN)
                opponentPawnCount++;
            else if (board[i] === OPPONENT_ROYAL)
                opponentRoyalCount++;
        }

        const PAWN_VALUE = 2;
        const ROYAL_VALUE = 3;
        const ACTIVE_PLAYER_SCORE = (PAWN_VALUE * activePawnCount) + (ROYAL_VALUE * activeRoyalCount);
        const OPPONENT_SCORE = (PAWN_VALUE * opponentPawnCount) + (ROYAL_VALUE * opponentRoyalCount);
        if (ACTIVE_PLAYER_SCORE > OPPONENT_SCORE + PAWN_VALUE)
            return ( isPlayer1? true : false );
        else if (OPPONENT_SCORE > ACTIVE_PLAYER_SCORE + PAWN_VALUE)
            return ( isPlayer1? false : true);
        return null;
    }

    /// Returns a prediction between (0,1) for the chance to win on a given board by a given player.
    getPrediction(board, isPlayer1)
    {
        const ACTIVE_PAWN = isPlayer1? MAN : WOMAN;
        const ACTIVE_ROYAL = isPlayer1? KING : QUEEN;
        const OPPONENT_PAWN = isPlayer1? WOMAN : MAN;
        const OPPONENT_ROYAL = isPlayer1? QUEEN : KING;

        let activePawnCount = 0;
        let activeRoyalCount = 0;
        let opponentPawnCount = 0;
        let opponentRoyalCount = 0;

        // Count each piece type on the board.
        for (let i = 0; i < BOARD_CELL_COUNT; i++)
        {
            if (board[i] === ACTIVE_PAWN)
                activePawnCount++;
            else if (board[i] === ACTIVE_ROYAL)
                activeRoyalCount++;
            else if (board[i] === OPPONENT_PAWN)
                opponentPawnCount++;
            else if (board[i] === OPPONENT_ROYAL)
                opponentRoyalCount++;
        }

        /*
            Predictions are based on the idea that a tie game has a 50% chance to win, and any advantage is added to this base.
            Pawns are worth 50% less than royals, and the exact value of each was set by experimentation.

            Under the values given below, winning by 2 pawns results in a prediction of a 66% chance to win, from 50 + (8 * 2).
            Likewise, winning by 1 pawn and 1 royal gives a 70% chance to win, from 50 + 8 + 12.
            Values are clamped between (0,1), so a huge advantage and a grossly huge advantage get the same prediction.
        */

        const PAWN_VALUE = 8;
        const ROYAL_VALUE = 12;
        const ACTIVE_PLAYER_SCORE = (PAWN_VALUE * activePawnCount) + (ROYAL_VALUE * activeRoyalCount);
        const OPPONENT_SCORE = (PAWN_VALUE * opponentPawnCount) + (ROYAL_VALUE * opponentRoyalCount);

        let advantage = 0;
        let prediction = 0;
        if (ACTIVE_PLAYER_SCORE > OPPONENT_SCORE)
        {
            advantage = (ACTIVE_PLAYER_SCORE - OPPONENT_SCORE) + 50;
            prediction = (advantage >= 100) ? 1 - Number.EPSILON : ( advantage / 100);
        }
        else if (OPPONENT_SCORE > ACTIVE_PLAYER_SCORE)
        {
            advantage = (OPPONENT_SCORE - ACTIVE_PLAYER_SCORE) + 50;
            prediction = (advantage >= 100) ? Number.EPSILON : ( 1 - (advantage / 100));
        }
        else
            prediction = 0.5;

        return prediction;
    }

    // Returns the board index of move origin and fills an out-parameter array of movements.
    deriveMovements(lastBoard, nextBoard, isPlayer1, movements)
    {
        const ACTIVE_PAWN = isPlayer1? MAN : WOMAN;
        const ACTIVE_ROYAL = isPlayer1? KING : QUEEN;

        let origin = null;

        // Find each piece on the board belonging to the active player.
        // If any piece is not on the next board (at the same index), it's the origin.
        // If all pieces are in the same place, then a piece jumped in a circle.
        // In this case, the origin is the same as the final destination.

        // Try to find the origin.
        for (let i = 0; i < lastBoard.length; i++)
        {
            if (lastBoard[i] === ACTIVE_PAWN || lastBoard[i] === ACTIVE_ROYAL)
            {
                if (lastBoard[i] !== nextBoard[i])
                {
                    origin = i;
                    break;
                }
            }
        }

        // Find all movements, and if moves were circular, the last move is also the origin.
        for (const [INDEX, BOARD] of this.nextPossibleBoards.entries())
        {
            if (BOARD === nextBoard)
            {
                if (origin === null)
                {
                    origin = this.possibleTurnMovements[INDEX][this.possibleTurnMovements.length-1];  // .at(-1); is cool, but it's only supported JS since 2022.
                }
                // Note that this.nextPossibleBoards and this.nextPossibleTurnMovements are in the same order,
                // so the index of next boards matches the index of next moves.
                // Shallow copy possible movements into the movements array.
                // Since this is an out-parameter, iterate and push each move, rather than assign (point) to a new array.
                for (const MOVE of this.possibleTurnMovements[INDEX])
                {
                    movements.push(MOVE);
                }
                break;
            }
        }
        return origin;
    }

} // End class


/***/ }),

/***/ 706:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   u: () => (/* binding */ TicTacToeRules)
/* harmony export */ });
/* harmony import */ var _winner_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(710);

/// Tic Tac Toe



const player1Mark = 'X'
const player2Mark = 'O'
const EMPTY = '-'
const BOARD_WIDTH = 3;
const BOARD_HEIGHT = 3;
const BOARD_CELL_COUNT = 9;
const HAS_SPECIAL_PATTERN = false;  // For board logs. False defaults to a grid.

class TicTacToeRules
{
    constructor()
    {
        this.nextPossibleBoards = []
        this.winner = new _winner_js__WEBPACK_IMPORTED_MODULE_0__/* .Winner */ .k();
    }

    getNewBoard(initialBoard)
    {
        const BOARD = (initialBoard === null)? "---------" : initialBoard;
        return [BOARD, BOARD_HEIGHT, BOARD_WIDTH, HAS_SPECIAL_PATTERN];
    }

    hasGeneratedNextPossibleStates(board, isPlayer1)
    {
        // Clear winner from any previous game / simulation.
        this.winner.logName = null;
        this.winner.isPlayer1 = null;

        if (this.isWon(board, isPlayer1))
        {
            // Whoever played last won.
            // So the winner is the opposite.
            this.winner.isPlayer1 = !isPlayer1;
            this.winner.logName = isPlayer1? player2Mark: player1Mark;
            return false;
        }
        else
        {
            if (this.isMovePossible(board))
            {
                this.nextPossibleBoards = [];
                this.pushAllPossibleBoards(board, isPlayer1);
                return true;
            }
            return false;
        }
    }

    isMovePossible(board)
    {
        for (const cell of board)
        {
            if (cell === EMPTY)
                return true;
        }
        return false;
    }

    pushAllPossibleBoards(board, isPlayer1)
    {
        let playerMark = isPlayer1? player1Mark : player2Mark;
        for (let index = 0; index < BOARD_CELL_COUNT; index++)
        {
            if (board[index] === EMPTY)
            {
                let newBoard = board.split("");
                newBoard[index] = playerMark;
                newBoard = newBoard.join("");
                this.nextPossibleBoards.push(newBoard);
            }
        }
    }

    // Check if whoever played last won.
    isWon(board, isPlayer1)
    {
        let opponentMark = isPlayer1? player2Mark : player1Mark;
        return (
            ((board[0] ===   opponentMark) && (board[1] ===   opponentMark) && (board[2] ===   opponentMark)) || // Top row
            ((board[3] ===   opponentMark) && (board[4] ===   opponentMark) && (board[5] ===   opponentMark)) || // Center row
            ((board[6] ===   opponentMark) && (board[7] ===   opponentMark) && (board[8] ===   opponentMark)) || // Bottom row
            ((board[0] ===   opponentMark) && (board[3] ===   opponentMark) && (board[6] ===   opponentMark)) || // Left column
            ((board[1] ===   opponentMark) && (board[4] ===   opponentMark) && (board[7] ===   opponentMark)) || // Center column
            ((board[2] ===   opponentMark) && (board[5] ===   opponentMark) && (board[8] ===   opponentMark)) || // Right column
            ((board[0] ===   opponentMark) && (board[4] ===   opponentMark) && (board[8] ===   opponentMark)) || // Diagonal down
            ((board[2] ===   opponentMark) && (board[4] ===   opponentMark) && (board[6] ===   opponentMark)));  // Diagonal up
    }

    /// Don't expect to use these for TicTacToe, but if a PUCT agent calls, it'll cause no harm.

    willPlayer1Win(board, isPlayer1)
    {
        return null;
    }

    getPrediction(board, isPlayer1)
    {
        return 0;
    }
}


/***/ }),

/***/ 707:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* binding */ Game)
/* harmony export */ });
/* harmony import */ var _game_rules_checkers_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(512);
/* harmony import */ var _game_rules_tictactoe_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(706);



class Game
{
    constructor(gameName, initialBoard = null)
    {
        this.logName = gameName;
        this.name = gameName.toLowerCase();
        this.hasNextState = true;
        this.isDone = false;
        this.lastBoard = null;
        switch (this.name)
        {
            case "tictactoe":
                console.log("Constructing Tic Tac Toe.");
                this.rules = new _game_rules_tictactoe_js__WEBPACK_IMPORTED_MODULE_0__/* .TicTacToeRules */ .u();
                [this.board, this.boardHeight, this.boardWidth,
                 this.hasSpecialPattern] = this.rules.getNewBoard(initialBoard);
                break;
            case "checkers":
                console.log("Constructing Checkers.");
                this.rules = new _game_rules_checkers_js__WEBPACK_IMPORTED_MODULE_1__/* .CheckersRules */ .Y();
                [this.board, this.boardHeight, this.boardWidth,
                 this.hasSpecialPattern] = this.rules.getNewBoard(initialBoard);
                break;
            default:
                console.error("Error: invalid game.")
                break;
        }
    }

    /// Console log board from top (index 0) to bottom.
    logBoard()
    {
        let textRow = [];
        for (let y = 0; y < this.boardHeight; y++)
        {
            for (let x = 0; x < this.boardWidth; x++)
            {
                if (this.hasSpecialPattern)
                {
                    textRow = this.rules.getSpecialPattern(this.board, textRow, x, y);
                }
                else
                {
                    let cellIndex = (y * this.boardWidth) + x;
                    textRow.push(" ");
                    textRow.push(this.board[cellIndex])
                    textRow.push(" ");
                }
            }
            console.log(textRow.join(""));
            textRow = [];
        }
    }

    hasWinner()
    {
        return this.rules.winner.isPlayer1 !== null;
    }

    isOver()
    {
        return !this.hasNextState;
    }
}


/***/ }),

/***/ 173:
/***/ ((__webpack_module__, __unused_webpack___webpack_exports__, __webpack_require__) => {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony import */ var _setup_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(560);
/* harmony import */ var _agent_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(442);
/* harmony import */ var _game_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(707);


const INITIAL_BOARD = convertGBE_BoardToLocalBoard(gameInfo.data[0]); // await Foundation.$registry[7].info.board
let game = new _game_js__WEBPACK_IMPORTED_MODULE_2__/* .Game */ .Z(_setup_js__WEBPACK_IMPORTED_MODULE_0__/* .SETUP */ .K.GAME_TO_PLAY, INITIAL_BOARD);
let agent = new _agent_js__WEBPACK_IMPORTED_MODULE_1__/* .Agent */ .g(_setup_js__WEBPACK_IMPORTED_MODULE_0__/* .SETUP */ .K.AGENT_0);
let isPlayer1 = (gameInfo.data[1])? true : false;  // Foundation.$registry[7].perspectiveColor === 0
await agent.begin(game, isPlayer1);
await agent.continue();
console.log("Turn complete.");
close();

/// Helper functions below.

function convertGBE_BoardToLocalBoard(board) {
    let localBoard = []
    for (let i = 0; i < 32; i++)
    {
        let index = Math.abs(i-31)
        if (index % 4 === 3)
        {
            index -= 3;
        }
        else if (index % 4 === 2)
        {
            index -= 1;
        }
         else if (index % 4 === 1)
        {
            index += 1;
        }
        else
        {
            index += 3;
        }
        localBoard.push(convertGBE_SymbolToLocalSymbol(board[index]));
    }
    return localBoard.join("");
}

function convertGBE_SymbolToLocalSymbol(symbol)
{
    switch(symbol)
    {
        case ' ':
            return '+'
        case 'r':
            return 'M'
        case 'w':
            return 'W'
        case 'R':
            return 'K'
        case 'W':
            return 'Q'
    }
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } }, 1);

/***/ }),

/***/ 560:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   K: () => (/* binding */ SETUP)
/* harmony export */ });
/// Setup file for tournaments and agents.
const SETUP = {

    // Tournament
    AGENT_0 : "MCTS-PUCT", // Use Random, MCTS-UCT, MCTS-UCT-ENHANCED, MCTS-PUCT, or MCTS-PUCT-NET.
    AGENT_1 : "MCTS-PUCT",
    GAME_TO_PLAY : "Checkers", // Expects Checkers or TicTacToe.
    SPECIFY_INITIAL_BOARD: null, // Expects null (default) or board string. Example TicTacToe string: "X--OO-X--"
    SHOULD_ALTERNATE_PLAY_ORDER : true, // Per game, switch sides.
    MAX_TURNS_PER_GAME : 1, // Should be >=1 turn.
    TOURNAMENT_LENGTH : 1, // Should be >= 1 game.

    // For all (non-random) agents
    SEARCH_TIME : 1800, // In milliseconds: 1000 == 1 second. If debugging with break points, set to NUMBER.MAX_VALUE.
    MAX_ITERATIONS : Number.MAX_VALUE, // If using break points, set this, not time.
    UCB_FORMULA_CONSTANT : 2, // Controls exploit-explore ratio, where 0 is greedy.

    // MCTS-UCT Enhanced: Depth-Limited Evaluation & Tree Size Limits
    TREE_DEPTH_LIMIT: 18, // For no limit, use Number.MAX_VALUE;
    SIMULATION_DEPTH_LIMIT: 4, // Research says for many games, 4-8 is ideal.
    ROOT_DEPTH_1_CHILD_CAPACITY: 64,
    NODE_DEPTH_2_CHILD_CAPACITY: 8,
    NODE_GENERAL_CHILD_CAPACITY: 8,

    // MCTS-PUCT: same controls
    PUCT_TREE_DEPTH_LIMIT: 18,
    PUCT_SIMULATION_DEPTH_LIMIT: 4,
    PUCT_ROOT_DEPTH_1_CHILD_CAPACITY: 64,
    PUCT_NODE_DEPTH_2_CHILD_CAPACITY: 12,
    PUCT_NODE_GENERAL_CHILD_CAPACITY: 8,

    // MCTS-PUCT-NET
    // NETWORK_PATH: "./network/checkers_net_sim-based_4-5-2024_1601-10m.json",
    // HIDDEN_LAYERS: [36, 16, 4],
    // PUCT_NET_TREE_DEPTH_LIMIT: 18,
    // PUCT_NET_SIMULATION_DEPTH_LIMIT: 5,
    // PUCT_NET_ROOT_DEPTH_1_CHILD_CAPACITY: 64,
    // PUCT_NET_NODE_DEPTH_2_CHILD_CAPACITY: 12,
    // PUCT_NET_NODE_GENERAL_CHILD_CAPACITY: 8,

    // Rewards: expects positive numbers
    REWARD : {
        TIE :  1,
        WIN :  2
    }
}

// export async function NeuralNet()
// {
//     return await (fetch(SETUP.NETWORK_PATH)
//         .then(response => response.json())
//             .then(async data =>  {
//                 await import("./network/browser.js"); // To import from the web, use: import("https://cdn.rawgit.com/BrainJS/brain.js/45ce6ffc/browser.js");
//                 let net = new brain.NeuralNetwork({ inputSize: 33, hiddenLayers: SETUP.HIDDEN_LAYERS, outputSize: 1, activation: 'relu' });
//                 net.fromJSON(data);
//                 return net;
//         }).catch(error => console.error(error))
//     );
// }


/***/ }),

/***/ 710:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   k: () => (/* binding */ Winner)
/* harmony export */ });
class Winner
{
    constructor()
    {
        this.logName = null;
        this.isPlayer1 = null;
    }
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/************************************************************************/
/******/ 	/* webpack/runtime/async module */
/******/ 	(() => {
/******/ 		var webpackQueues = typeof Symbol === "function" ? Symbol("webpack queues") : "__webpack_queues__";
/******/ 		var webpackExports = typeof Symbol === "function" ? Symbol("webpack exports") : "__webpack_exports__";
/******/ 		var webpackError = typeof Symbol === "function" ? Symbol("webpack error") : "__webpack_error__";
/******/ 		var resolveQueue = (queue) => {
/******/ 			if(queue && queue.d < 1) {
/******/ 				queue.d = 1;
/******/ 				queue.forEach((fn) => (fn.r--));
/******/ 				queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
/******/ 			}
/******/ 		}
/******/ 		var wrapDeps = (deps) => (deps.map((dep) => {
/******/ 			if(dep !== null && typeof dep === "object") {
/******/ 				if(dep[webpackQueues]) return dep;
/******/ 				if(dep.then) {
/******/ 					var queue = [];
/******/ 					queue.d = 0;
/******/ 					dep.then((r) => {
/******/ 						obj[webpackExports] = r;
/******/ 						resolveQueue(queue);
/******/ 					}, (e) => {
/******/ 						obj[webpackError] = e;
/******/ 						resolveQueue(queue);
/******/ 					});
/******/ 					var obj = {};
/******/ 					obj[webpackQueues] = (fn) => (fn(queue));
/******/ 					return obj;
/******/ 				}
/******/ 			}
/******/ 			var ret = {};
/******/ 			ret[webpackQueues] = x => {};
/******/ 			ret[webpackExports] = dep;
/******/ 			return ret;
/******/ 		}));
/******/ 		__webpack_require__.a = (module, body, hasAwait) => {
/******/ 			var queue;
/******/ 			hasAwait && ((queue = []).d = -1);
/******/ 			var depQueues = new Set();
/******/ 			var exports = module.exports;
/******/ 			var currentDeps;
/******/ 			var outerResolve;
/******/ 			var reject;
/******/ 			var promise = new Promise((resolve, rej) => {
/******/ 				reject = rej;
/******/ 				outerResolve = resolve;
/******/ 			});
/******/ 			promise[webpackExports] = exports;
/******/ 			promise[webpackQueues] = (fn) => (queue && fn(queue), depQueues.forEach(fn), promise["catch"](x => {}));
/******/ 			module.exports = promise;
/******/ 			body((deps) => {
/******/ 				currentDeps = wrapDeps(deps);
/******/ 				var fn;
/******/ 				var getResult = () => (currentDeps.map((d) => {
/******/ 					if(d[webpackError]) throw d[webpackError];
/******/ 					return d[webpackExports];
/******/ 				}))
/******/ 				var promise = new Promise((resolve) => {
/******/ 					fn = () => (resolve(getResult));
/******/ 					fn.r = 0;
/******/ 					var fnQueue = (q) => (q !== queue && !depQueues.has(q) && (depQueues.add(q), q && !q.d && (fn.r++, q.push(fn))));
/******/ 					currentDeps.map((dep) => (dep[webpackQueues](fnQueue)));
/******/ 				});
/******/ 				return fn.r ? promise : getResult();
/******/ 			}, (err) => ((err ? reject(promise[webpackError] = err) : outerResolve(exports)), resolveQueue(queue)));
/******/ 			queue && queue.d < 0 && (queue.d = 0);
/******/ 		};
/******/ 	})();
/******/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/
/************************************************************************/
/******/
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module used 'module' so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(173);
/******/
/******/ })()
}} // End WEBPACK_SCRIPT_OBJ

// Run web-pack script in a worker thread.
let blob = new Blob(["onmessage = " + WEBPACK_SCRIPT_OBJ.f], {type: 'text/javascript'});
let blobURL = URL.createObjectURL(blob);
let worker = new unsafeWindow.Worker(blobURL);
URL.revokeObjectURL(blobURL);

// Add handler to receive worker messages.
worker.onmessage = (chosenMoveInputs) => {
  inputMovements(chosenMoveInputs.data[0], chosenMoveInputs.data[1]);
};

// Send message to worker: info on board and player.
setTimeout(function () {worker.postMessage([Foundation.$registry[7].info.board, (Foundation.$registry[7].perspectiveColor === 0)])}, delay);
} // End condition: isKomputerReady
} // End function runKomputer.
