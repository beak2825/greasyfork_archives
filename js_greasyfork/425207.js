// ==UserScript==
// @name         1 Key Finesse
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  adds 1 key finesse to jstris
// @author       You
// @match        https://jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425207/1%20Key%20Finesse.user.js
// @updateURL https://update.greasyfork.org/scripts/425207/1%20Key%20Finesse.meta.js
// ==/UserScript==
 
(function() {
    // controls how the column on the keyboard corresponds to the piece's x position
    // options are left, right, center, inward, and outward (case sensitive)
    //
    // left: keyboard column = furthest left mino
    // right: keyboard column = furthest right mino
    // center: keyboard  column = center of rotation
    // inward: left half columns are left aligned; right half is right aligned. not used anywhere else but I like it
    // outward: ^ that but swapped. no clue why you'd use this
    Game.oneKF_alignment = 'left';
 
    // if true, first tap moves the ghost. press again to actually move the piece
    // might be good for slow practicing
    Game.oneKF_require2Taps = false;
 
    // how rotations correspond to the rows on the keyboard. rowRotations[row] = rotation (top row is row 0)
    Game.oneKF_rowRotations = [2, 3, 0, 1]
 
    // keycodes. change only if your keyboard layout isn't qwerty
    Game.oneKF_keyCodes = [[49, 50, 51, 52, 53, 54, 55, 56, 57, 48],
                           [81, 87, 69, 82, 84, 89, 85, 73, 79, 80],
                           [65, 83, 68, 70, 71, 72, 74, 75, 76, 186],
                           [90, 88, 67, 86, 66, 78, 77, 188, 190, 191]]
    var holdKeyCode = 32;
 
    // script will only run on this account or as a guest
    // if expectedUsername == "", 1KF is always enabled
    // I wouldn't advise playing on an unhidden account though
    // (case sensitive)
    var expectedUsername = "Justin1KF"
    var runWhenGuest = true
 
 
    /****************
     ignore the rest
    ****************/
 
 
    if (expectedUsername != "") {
        var navbarRight = document.getElementsByClassName("navbar-right")[0].children;
        var username = navbarRight[navbarRight.length-1].innerText.slice(0,-1);
 
        if (username == "Registe") { // guest
            if (!runWhenGuest) {
                console.log("1KF disabled; you're a guest and runWhenGuest == false")
            }
        }
        else if (username != expectedUsername) {
            console.log("1KF disabled; expected username " + expectedUsername + " but got " + username)
            return
        }
    }
 
 
    Game.prototype.oneKF_getMoves = function(col=undefined, rot=undefined) {
        var nodes = [{x:this.activeBlock.pos.x, y:this.activeBlock.pos.y, r:this.activeBlock.rot, actions:[]}];
        var branches = [];
        var branchActions = ['<<', '>>', '<', '>', 'cw', 'ccw', '180'];
        var options = [];
 
        // 4x11x24 array of zeros
        // does js suck or am I missing a better way to do this
        var explored = [[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],
                        [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],
                        [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],
                        [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]]
 
        while (nodes.length != 0) {
            for (let n = 0; n < nodes.length; n++) {
                let state = nodes[n];
 
                for (let m = 0; m < branchActions.length; m++) {
                    let action = branchActions[m];
 
                    let nextState = this.oneKF_simulateAction(state, action)
                    nextState.actions = [...state.actions]
 
                    if (nextState.y <= -4) {continue;}
                    if (explored[nextState.r][nextState.x+2][nextState.y+3] == 0) {
                        explored[nextState.r][nextState.x+2][nextState.y+3] = 1;
                        nextState.actions.push(action);
 
                        branches.push(nextState);
                    }
                }
 
                // softdrop
                for (let sd = 1; sd < 40; sd++) {
                    let nextState = {...state};
                    nextState.y += sd;
                    if (explored[nextState.r][nextState.x+2][nextState.y+3]) {break;}
                    if (this.checkIntersection(nextState.x, nextState.y, nextState.r)) {
                        if (sd == 1) {
                            if (state.actions[state.actions.length-1] == 'sd') {state.actions.pop();}
                            state.actions.push('hd')
                            if ((state.x == col || col == undefined) && (state.r == rot || rot == undefined)) {options.push(state);}
 
                            // check equivalent positions
                            else if (this.activeBlock.id == 0 || this.activeBlock.id == 5 || this.activeBlock.id == 6) {// piece == I, Z, or S
                                if (state.r%2 == 0 && rot%2 == 0 && state.x == col) {options.push(state);}
                                else if (state.r == 1 && rot == 3 && state.x+1 == col) {options.push(state);}
                                else if (state.r == 3 && rot == 1 && state.x-1 == col) {options.push(state);}
                            }
                        }
                        else {
                            nextState.y -= 1;
                            nextState.actions = [...state.actions, 'sd']
                            branches.push(nextState);
                        }
                        break;
                    }
                    else {
                        explored[nextState.r][nextState.x+2][nextState.y+3] = 1;
                    }
                }
            }
            nodes = branches;
            branches = []
        }
        return options
    }
 
    Game.prototype.oneKF_simRotate = function(state_input, r) {
        var state = {...state_input}
        let rString = (r === -1) ? '-1' : ((r === 1) ? '1' : '2'),
            newRot = (state.r + r + 4)%4;
        let block = this.blockSets[this.activeBlock.set].blocks[this.activeBlock.id],
            kicks = block.kicks[state.r][rString],
            kickLength = kicks.length;
 
        for (let i = 0; i < kickLength; i++) {
            let xOffset = kicks[i][0],
                yOffset = kicks[i][1];
            if (!this.checkIntersection(state.x + xOffset, state.y - yOffset, newRot)) {
                state.x += xOffset;
                state.y -= yOffset;
                state.r = newRot;
                return state;
            }
        };
        return state
    }
 
    Game.prototype.oneKF_simulateAction = function(state_input, action) {
        var state = {...state_input};
        if (action == '<<') {
            for (let shift = 1; shift < 15; shift++) {
                if (this.checkIntersection(state.x-shift, state.y, state.r)) {
                    state.x -= shift - 1;
                    return state;
                }
            }
        }
        else if (action == '>>') {
            for (let shift = 1; shift < 15; shift++) {
                if (this.checkIntersection(state.x+shift, state.y, state.r)) {
                    state.x += shift - 1;
                    return state;
                }
            }
        }
        else if (action == '<') {
            if (!this.checkIntersection(state.x-1, state.y, state.r)) {
                state.x--;
                return state;
            }
            else {return state;}
        }
        else if (action == '>') {
            if (!this.checkIntersection(state.x+1, state.y, state.r)) {
                state.x++;
                return state;
            }
            else {return state;}
        }
        else if (action == 'cw') {
            return this.oneKF_simRotate(state, 1);
        }
        else if (action == 'ccw') {
            return this.oneKF_simRotate(state, -1);
        }
        else if (action == '180') {
            return this.oneKF_simRotate(state, 2);
        }
        else if (action == 'sd') {
            for (let sd = 1; sd < 40; sd++) {
                if (this.checkIntersection(state.x, state.y+sd, state.r)) {
                    state.y = state.y + sd - 1;
                    return state;
                }
            }
        }
    }
 
    Game.prototype.oneKF_fireAction = function(action, time=undefined) {
        time = time || this.timestamp();
        if (action == '<<') {
            this.activateDAS(-1, time);
            this.ARRon[-1] = false;
        }
        else if (action == '>>') {
            this.activateDAS(1, time);
            this.ARRon[1] = false;
        }
        else if (action == '<') {
            let timestamp = time;
            this.moveCurrentBlock(-1, false, timestamp);
            this.pressedDir['-1'] = timestamp;
            this.Replay.add(new ReplayAction(this.Replay.Action.MOVE_LEFT, this.pressedDir['-1']));
        }
        else if (action == '>') {
            let timestamp = time;
            this.moveCurrentBlock(1, false, timestamp);
            this.pressedDir['1'] = timestamp;
            this.Replay.add(new ReplayAction(this.Replay.Action.MOVE_RIGHT, this.pressedDir['1']));
        }
        else if (action == 'hold') {
            if (!this.holdPressed) {
                this.holdBlock();
                this.holdPressed = true;
            }
        }
        else if (action == 'cw') {
            this.rotateCurrentBlock(1);
            this.Replay.add(new ReplayAction(this.Replay.Action.ROTATE_RIGHT, time));
        }
        else if (action == 'ccw') {
            this.rotateCurrentBlock(-1);
            this.Replay.add(new ReplayAction(this.Replay.Action.ROTATE_LEFT, time));
        }
        else if (action == '180') {
            this.rotateCurrentBlock(2);
            this.Replay.add(new ReplayAction(this.Replay.Action.ROTATE_180, time));
        }
        else if (action == 'hd') {
            this.hardDrop(time);
        }
        else if (action == 'sd') {
            this.softDropSet(true, time);
            this.update(0, time);
            this.softDropSet(false, time);
        }
    }
 
    Game.prototype.oneKF_getRealPos = function(keyboardCol, keyboardRow) {
        var rot = Game.oneKF_rowRotations[keyboardRow]
 
        var x;
        let farLeft = -this.blockSets[this.activeBlock.set].blocks[this.activeBlock.id].cc[rot];
        let farRight = farLeft + finesse[this.activeBlock.id][rot].length - 1;
        if (Game.oneKF_alignment == 'left') x = keyboardCol + farLeft;
        else if (Game.oneKF_alignment == 'right') x = farRight - (9 - keyboardCol)
        else if (Game.oneKF_alignment == 'center') x = keyboardCol
        else if (Game.oneKF_alignment == 'inward') {
            if (keyboardCol <= 4) x = keyboardCol + farLeft;
            else x = farRight - (9 - keyboardCol);
        }
        else if (Game.oneKF_alignment == 'outward') {
            if (keyboardCol <= 4) x = farRight - (9 - keyboardCol);
            else x = keyboardCol + farLeft;
        }
 
        x = Math.max(Math.min(x, farRight), farLeft);
 
        return [x, rot]
    }
 
    Game.prototype.oneKF_getLowestMove = function(x, r) {
        var moves = this.oneKF_getMoves(x, r);
        var lowestMove = moves[0];
        for (let m = 1; m < moves.length; m++) {
            if (moves[m].y > lowestMove.y) {lowestMove = moves[m];}
        }
        return lowestMove
    }
 
 
    Game.prototype.oneKF_handleInputs = function (e){
        if (e.repeat) {return;}
        if (this.focusState != 0 || !this.play) {return;}
 
 
 
        if (!Game.oneKF_require2Taps || e.keyCode == Game.oneKF_lastKeyCode) {
            for (let r = 0; r < 4; r++) {
                let index = Game.oneKF_keyCodes[r].indexOf(e.keyCode)
                if (index > -1) {
                    var move = this.oneKF_getLowestMove(...this.oneKF_getRealPos(index, r));
                    // fire actions
                    var time = this.timestamp()
                    for (let a = 0; a < move.actions.length; a++) {
                        this.oneKF_fireAction(move.actions[a], time);
                    }
 
                    Game.oneKF_lastKeyCode = undefined;
                    break;
                }
            }
        }
        else {
            for (let r = 0; r < 4; r++) {
                let index = Game.oneKF_keyCodes[r].indexOf(e.keyCode)
                if (index > -1) {
                    var move = this.oneKF_getLowestMove(...this.oneKF_getRealPos(index, r));
 
                    // edit ghost
                    let rotateBy = (move.r - this.activeBlock.rot + 4) % 4;
                    if (rotateBy != 0) {
                        this.oneKF_fireAction(rotateBy == 1 ? 'cw' : (rotateBy == 2 ? '180' : 'ccw'));
                    }
                    this.ghostPiece.pos = {x:move.x, y:move.y};
                    this.redraw();
 
                    Game.oneKF_lastKeyCode = e.keyCode;
                    break;
                }
            }
        }
    }
 
    var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}
    var getParams=a=>{var params=a.slice(a.indexOf("(")+1);params=params.substr(0,params.indexOf(")")).split(",");return params}
 
    // edit keyInput2 to call oneKF_handleInputs and ignore restarting without f2 or f4
    var functionStr = Game.prototype.keyInput2.toString();
    var key = getParams(functionStr)[0];
    var preFunction = `this.oneKF_handleInputs(${key});if ((${key}.keyCode == this.Settings.controls[8] && this.Settings.controls[8] != 115) || (${key}.keyCode == this.Settings.controls[9] && this.Settings.controls[9] != 113)) {return;}`
    Game.prototype.keyInput2 = new Function(key, preFunction + trim(functionStr));
 
    // change settings
    functionStr = Game.prototype.startPractice.toString();
    var params = getParams(functionStr)
    preFunction = `
this.softDropId = 4;
this.Settings.ARR = 0;
this.Settings.ml = -1;
this.Settings.mr = -1;
this.Settings.sd = -1;
this.Settings.hd = -1;
this.Settings.rl = -1;
this.Settings.rr = -1;
this.Settings.hk = ${holdKeyCode};
this.Settings.dr = -1;
`
    Game.prototype.startPractice = new Function(...params, preFunction+trim(functionStr));
})();