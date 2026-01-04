// ==UserScript==
// @name         Advanced Finesse
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Plays a finesse fault sound upon any finesse fault, including missed das preservations
// @author       You
// @match        https://jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438610/Advanced%20Finesse.user.js
// @updateURL https://update.greasyfork.org/scripts/438610/Advanced%20Finesse.meta.js
// ==/UserScript==

var enableDoubleDas = true;
var consoleLogFaults = false;

// returns several paths to the destination, containing the optimal one
// (int) destCol and destRot: the destination's column and rotation
// (Block) piece
window.getAllPaths = function getAllPaths(destCol, destRot, piece) {
    const startX = 3;
    var allPaths = [];


    // order matters. in the event of a tie, the first in the list is chosen
    if (startX != destCol) {
        allPaths.push(generatePath("rotate", "das", "tap"));
        allPaths.push(generatePath("das", "rotate", "tap"));
    }

    allPaths.push(generatePath("rotate", "tap"));

    var symmetric = [0, 5, 6].includes(piece.id);
    if (symmetric) {
        for (let i = 0; i < allPaths.length; i++) {
            optimizeForSymmetry(allPaths[i]);
        }
    }

    return allPaths;

    function generatePath() {
        var path = [];
        var x = startX;
        var rot = 0;

        for (let i = 0; i < arguments.length; i++) {
            let arg = arguments[i];

            if (arg == "rotate") {
                rot = destRot;
                if (rot == 1) path.push("r90");
                else if (rot == 2) path.push("r180");
                else if (rot == 3) path.push("r270");
            }

            if (arg == "das") {
                if (destCol < startX) {
                    path.push("<<");
                    x = leftMost(piece, rot);
                }
                else {
                    path.push(">>");
                    x = rightMost(piece, rot);
                }
            }

            if (arg == "tap") {
                var tapCount = destCol - x;
                if (tapCount < 0) // tap left
                    for (; tapCount < 0; tapCount++) path.push("<");

                else // tap right
                    for (; tapCount > 0; tapCount--) path.push(">");

                x = destCol;
            }
        }

        return path;
    }

    // only call for symmetrical pieces
    // replace "<, cw" with "ccw" and similar faults
    function optimizeForSymmetry(path) {
        if (path.length < 2) return;

        var last = path[path.length-1];
        var secondLast = path[path.length-2];

        if (destRot == 2) {
            let index = path.indexOf("r180");
            if (index != -1) path.splice(index, 1);
        }

        else if (destRot == 1) {
            let index = path.indexOf("r90");
            if (index + 1 >= path.length) return;
            if (path[index+1] == "<")
                path.splice(index, 2, "r270");
        }

        else if (destRot == -1) {
            let index = path.indexOf("270");
            if (index + 1 >= path.length) return;
            if (path[index+1] == ">")
                path.splice(index, 2, "r90");
        }
    }
}

function leftMost(piece, rot) {
    return 0 - _blockSets[piece.set].blocks[piece.id].cc[rot];
}

function rightMost(piece, rot) {
    return leftMost(piece, rot) + finesse[piece.id][rot].length - 1;
}


window.evaluatePath = function evaluatePath(path, dasCharge) {
    var newPath = [...path];

    if (dasCharge.left) newPath = newPath.filter(function(e) {return e != "<<"})
    if (dasCharge.right) newPath = newPath.filter(function(e) {return e != ">>"})
    if (newPath.includes("<<")) newPath = newPath.filter(function(e) {return e != "<"})
    if (newPath.includes(">>")) newPath = newPath.filter(function(e) {return e != ">"})

    var score = 0 - newPath.length;
    return score;
}

window.bestPath = function bestPath(allPaths, dasCharge) {
    var bestIndex = 0;
    var bestEvaluation = Number.NEGATIVE_INFINITY;
    for (let i = 0; i < allPaths.length; i++) {
        let evaluation = evaluatePath(allPaths[i], dasCharge)
        if (evaluation > bestEvaluation) {
            bestIndex = i;
            bestEvaluation = evaluation;
        }
    }

    return allPaths[bestIndex];
}

window.getPathsCharges = function getPathsCharges(path, startCharges) {
    if (path.length == 0) return new DasCharge(false, false);

    var last = path[path.length-1];

    if (last == "r90" || last == "r180" || last == "r270") return new DasCharge(false, false);

    if (enableDoubleDas) {
        if (last == "<<") return new DasCharge(true, startCharges.right && (!!startCharges.left == (startCharges.primary == "left")), "left");
        if (last == ">>") return new DasCharge(startCharges.left && (!!startCharges.right == (startCharges.primary == "right")), true, "right");

        var secondLast = path.length >= 2 ? path[path.length - 2] : "";

        if (last == "<") return new DasCharge(true, secondLast == ">>", "left");
        if (last == ">") return new DasCharge(secondLast == "<<", true, "right");
    }
    else {
        if (last == "<<" || last == "<") return new DasCharge(true, false, "left");
        if (last == ">>" || last == ">") return new DasCharge(false, true, "left");
    }
}


window.DasCharge = class DasCharge {
    constructor(left, right, primary) {
        this.left = left;
        this.right = right;
        this.primary = primary;
    }
}




// now add to jstris's functions

let inGame = typeof Game != "undefined";
let inReplayer = typeof Replayer != "undefined";

if (inGame || inReplayer) {
    let G = inGame ? Game : Replayer; // the sub class of GameCore. both have nearly identical funcionality

    GameCore.prototype.finesseAddStep = function(action) {
        if (this.finessePath == undefined) this.finessePath = [];
        this.finessePath.push(action);
    }


    // move
    let move_current_block = G.prototype.moveCurrentBlock;
    G.prototype.moveCurrentBlock = function() {
        let direction = arguments[0];
        this.finesseAddStep(direction == -1 ? "<" : ">");

        return move_current_block.apply(this, arguments);
    }

    // rotate
    let rotate_current_block = G.prototype.rotateCurrentBlock;
    G.prototype.rotateCurrentBlock = function() {
        let direction = arguments[0];
        this.finesseAddStep(direction == 1 ? "r90" : (direction == 2 ? "r180" : "r270"));

        return rotate_current_block.apply(this, arguments);
    }

    // das
    let move_block_to_the_wall = GameCore.prototype.moveBlockToTheWall;
    GameCore.prototype.moveBlockToTheWall = function() {
        var val = move_block_to_the_wall.apply(this, arguments);

        if (val != 0) {
            let direction = arguments[0];
            var action = direction == -1 ? "<<" : ">>";
            var lastAction = (this.finessePath == undefined || this.finessePath.length == 0) ? "" : this.finessePath[this.finessePath.length-1];
            if (["r90", "r180", "r270"].includes(lastAction) || lastAction == action) ; // das caused by moving away from wall while holding key. ignore it
            else this.finesseAddStep(action);
        }

        return val;
    }

    // hard drop
    let place_block = G.prototype.hardDrop;
    G.prototype.hardDrop = function() {
        let optimalPath = bestPath(getAllPaths(this.activeBlock.pos.x, this.activeBlock.rot, this.activeBlock), this.possibleDasCharge);

        let playerEval = evaluatePath(this.finessePath, this.possibleDasCharge);
        let optimalEval = evaluatePath(optimalPath, this.possibleDasCharge); // might wanna make this not evaluate it twice but ehh whatever

        if (playerEval < optimalEval) {
            this.finesse = 1 + ((this.activeBlock.set===0)?finesse[this.activeBlock.id][this.activeBlock.rot][this.activeBlock.pos.x+this.blockSets[this.activeBlock.set].blocks[this.activeBlock.id].cc[this.activeBlock.rot]] : 0) // taken from jstris's code. expected keypresses + 1
            if (consoleLogFaults) console.log("Finesse fault number ", this.totalFinesse, " at block ", this.placedBlocks + 1, "!\n");
        }

        this.possibleDasCharge = getPathsCharges(optimalPath, this.possibleDasCharge);
        this.finessePath = [];

        return place_block.apply(this, arguments);
    }

    // clear matrix
    let clear_matrix = G.prototype.clearMatrix;
    G.prototype.clearMatrix = function() {
        this.finessePath = [];
        this.possibleDasCharge = new DasCharge(false, false);

        return clear_matrix.apply(this, arguments);
    }
}