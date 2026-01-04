// ==UserScript==
// @name         Custom controls
// @namespace    http://tampermonkey.net/
// @version      0.4.059
// @description  adds custom controls to jstris
// @author       You
// @match        https://jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425208/Custom%20controls.user.js
// @updateURL https://update.greasyfork.org/scripts/425208/Custom%20controls.meta.js
// ==/UserScript==

(function() {
  /*
   * CHECKING USERNAME / WHETHER TO RUN SCRIPT
   */

  // script will only run on this account or as a guest
  // if expectedUsername == "", Custom controls are always enabled
  // I wouldn't advise playing on an unhidden account though
  // (case sensitive)
  var expectedUsername = "ckarnell"
  var runWhenGuest = true

  if (expectedUsername != "") {
    var navbarRight = document.getElementsByClassName("navbar-right")[0].children;
    var username = navbarRight[navbarRight.length-1].innerText.slice(0,-1).trim();

    if (username == "Registe") { // guest
      if (!runWhenGuest) {
        console.log("Custom controls disabled; you're a guest and runWhenGuest == false")
      }
    }

    // else if (username != expectedUsername) { // TODO: Fix
    //   console.log("Custom controls disabled; expected username " + expectedUsername + " but got " + username)
    //   return
    // }
  }


  /*
   * GET CURRENT GAME INSTANCE
   */

  let currentGame;
  // TODO: Implement this better
  // const isBannedStartSequenceFunctionString = Game.prototype.isBannedStartSequence.toString();
  // const modifiedFunctionString = 'function () { currentGame = this;' + isBannedStartSequenceFunctionString + ' }'
  // Game.prototype.isBannedStartSequence = modifiedFunctionString.parseFunction();
  Game['prototype']['isBannedStartSequence'] = function() {
    currentGame = this;
    return 2 <= this.queue.length &&
      1 === this.isPmode(!1) &&
      (5 <= this.queue[0].id || 1 === this.queue[0].id && 5<=this.queue[1].id);
  };


  /*
   * GET CUSTOM CONTROL SCHEME
   */

  const getCookie = (cname) => {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  let customControlSchemeCookie = getCookie('customControlScheme');

  // This can be 'standard', '1KF', or 'finesseChords'
  if (!customControlSchemeCookie) {
    document.cookie = `customControlScheme=standard`;
    customControlSchemeCookie = 'standard';
  }
  customControlScheme = customControlSchemeCookie;


  /*
   * 1 KEY FINESSE CONTROLS
   */

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
  var holdKeyCode1KF = 32;

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


  Game.prototype.oneKF_handleInputs = function (e) {
    if (e.repeat) return;
    if (this.focusState != 0 || !this.play) return;

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


  /*
   * FINESSE CHORDS CONTROLS
   */

  Game.prototype.finesseChordsControlMapping = {
    '81': 'leftDAS',
    '87': 'moveLeft',
    '69': 'moveRight',
    '82': 'rightDAS',
    '32': 'contextShift',
    '85': 'ccw',
    '73': '180',
    '79': 'cw',
    '80': '0',
    '77': 'hold',
  }
  holdKeyCodeFinesseChords = '77';

  // Keep track of finesse chords control state
  finesseChordsKeysHeld = {
    leftDAS: false,
    moveLeft: false,
    moveRight: false,
    rightDAS: false,
    contextShift: false,
    hold: false,
    'ccw': false,
    '180': false,
    'cw': false,
    '0': false,
  }
  finesseChordsLastKeysHeld = { ...finesseChordsKeysHeld }

  const onKeyUp = (e) => {
    const stringKeyCode = e.keyCode.toString();
    if (Object.keys(Game.prototype.finesseChordsControlMapping).includes(stringKeyCode)) {
      finesseChordsKeysHeld[Game.prototype.finesseChordsControlMapping[stringKeyCode]] = false;
    }
    if (currentGame.focusState != 0 || !currentGame.play) return;
    currentGame.finesseChords_handleInputs();
    // TODO: Need to call Game.finesseChords_handleInputs here
  }

  document.addEventListener('keyup', onKeyUp)
  // document.getElementById('myCanvas').addEventListener('keyup', onKeyUp)

  finesseChordsLastShiftDir = 0
  finessChordsLastDASDir = 0
  finessChordsOriginalX = undefined

  Game.prototype.finesseChords_handleInputs = function (e) {
    // This is called on keydown and only on keydown
    if (e !== undefined) {
      if (e.repeat) return;
      const keyCodeString = e.keyCode.toString();
      finesseChordsKeysHeld[Game.prototype.finesseChordsControlMapping[keyCodeString]] = true;

      if (keyCodeString == holdKeyCodeFinesseChords) {
        if (!this.holdPressed) {
          this.holdBlock();
          this.holdPressed = true;
          return;
        }
      }
      if (this.focusState != 0 || !this.play) return;

    }

    // DAS key pressed event
    if (finessChordsOriginalX === undefined) {
      finessChordsOriginalX = this.activeBlock.pos.x;
    }
    let calculatedX = finessChordsOriginalX;
    const contextShifted = finesseChordsKeysHeld.contextShift;
    let DASDir = 0;

    if (
      finesseChordsKeysHeld.leftDAS &&
      finesseChordsLastKeysHeld.leftDAS &&
      finesseChordsKeysHeld.rightDAS &&
      finesseChordsLastKeysHeld.rightDAS
    ) {
      // If they've been holding both DAS keys, default to whatever it was last
      DASDir = finessChordsLastDASDir;
    } else if (finesseChordsKeysHeld.leftDAS) {
      DASDir = -1;
      if (finessChordsLastDASDir === -1 && (!(finesseChordsLastKeysHeld.rightDAS) && finesseChordsKeysHeld.rightDAS)) {
        DASDir = 1;
      }
    } else if (finesseChordsKeysHeld.rightDAS) {
      DASDir = 1;

      if (finessChordsLastDASDir === 1 && (!(finesseChordsLastKeysHeld.leftDAS) && finesseChordsKeysHeld.leftDAS)) {
        DASDir = -1;
      }
    }
    finessChordsLastDASDir = DASDir;

    // Shift key pressed event
    let shiftDir = 0;
    if (
    finesseChordsKeysHeld.moveLeft &&
      finesseChordsLastKeysHeld.moveLeft &&
      finesseChordsKeysHeld.moveRight &&
      finesseChordsLastKeysHeld.moveRight
    ) {
      // If they've been holding both shift keys, default to whatever it was last
      shiftDir = finesseChordsLastShiftDir;
    } else if (finesseChordsKeysHeld.moveLeft) {
      shiftDir = -1;
      if (finesseChordsLastShiftDir === -1 && (!(finesseChordsLastKeysHeld.moveRight) && finesseChordsKeysHeld.moveRight)) {
        shiftDir = 1;
      }
    } else if (finesseChordsKeysHeld.moveRight) {
      shiftDir = 1;
      if (finesseChordsLastShiftDir === 1 && (!(finesseChordsLastKeysHeld.moveLeft) && finesseChordsKeysHeld.moveLeft)) {
        shiftDir = -1;
      }
    }
    finesseChordsLastShiftDir = shiftDir;

    // Calculate X based on inputs
    if (DASDir) {
      let xModifier = 0;
      if (DASDir < 0) {
        for (let shift = -1; shift > -10; shift--) {
          if (!this.checkIntersection(calculatedX+shift, this.activeBlock.pos.y, this.activeBlock.rot)) {
            xModifier = shift;
            // state.x -= 1;
            // return state;
          } else {
            break;
          }
        }
        calculatedX += xModifier;

        if (shiftDir) {
          calculatedX += 1;
        }
      } else {
        for (let shift = 0; shift < 10; shift++) {
          if (!this.checkIntersection(calculatedX+shift, this.activeBlock.pos.y, this.activeBlock.rot)) {
            xModifier = shift;
            // state.x -= 1;
            // return state;
          } else {
            break;
          }
        }
        calculatedX += xModifier;

        if (shiftDir) {
          calculatedX -= 1;
        }
      }
      // Call this.DASLeft or this.DASRight,
      // then check for flags.moveLeft and flags.moveRight and move accordingly
    } else if (shiftDir) {
      // this.shift(shiftDir);
      calculatedX += shiftDir;

      if (contextShifted) {
        calculatedX += shiftDir;
      }
    }

    // Move the piece along the X axis, if the calculated value is different
    const deltaX = calculatedX - this.activeBlock.pos.x;
    const timestamp = this.timestamp();
    if (deltaX !== 0) {
      this.moveCurrentBlock(deltaX, false, timestamp);
      if (deltaX < 0) {
        this.pressedDir['-1'] = timestamp;
        for (let i = 0; i > deltaX; i--) {
          this.Replay.add(new ReplayAction(this.Replay.Action.MOVE_LEFT, this.pressedDir['-1']));
        }
      } else {
        this.pressedDir['1'] = timestamp;
        for (let i = 0; i < deltaX; i++) {
          this.Replay.add(new ReplayAction(this.Replay.Action.MOVE_RIGHT, this.pressedDir['1']));
        }
      }
      // TODO: Figure this out
      // this.pressedDir['-1'] = timestamp;
      // this.Replay.add(new ReplayAction(this.Replay.Action.MOVE_LEFT, this.pressedDir['-1']));
    }

    let rotatedThisUpdate = false;
    if (finesseChordsKeysHeld.ccw && !finesseChordsLastKeysHeld.ccw) {
      this.rotateCurrentBlock(-1);
      this.Replay.add(new ReplayAction(this.Replay.Action.ROTATE_LEFT, timestamp));
      rotatedThisUpdate = true;
    } else if (finesseChordsKeysHeld.cw && !finesseChordsLastKeysHeld.cw) {
      this.rotateCurrentBlock(1);
      this.Replay.add(new ReplayAction(this.Replay.Action.ROTATE_RIGHT, timestamp));
      rotatedThisUpdate = true;
    } else if (finesseChordsKeysHeld['180'] && !finesseChordsLastKeysHeld['180']) {
      this.rotateCurrentBlock(2);
      this.Replay.add(new ReplayAction(this.Replay.Action.ROTATE_180, timestamp));
      rotatedThisUpdate = true;
    } else if (finesseChordsKeysHeld['0'] && !finesseChordsLastKeysHeld['0']) {
      rotatedThisUpdate = true;
    }

    if (rotatedThisUpdate) {
      if (!(contextShifted) && !(finesseChordsKeysHeld.moveLeft) && !(finesseChordsKeysHeld.moveRight)) {
        let xModifier = 0;
        if (finesseChordsKeysHeld.leftDAS) {
          while (!this.checkIntersection(this.activeBlock.pos.x - 1, this.activeBlock.pos.y, this.activeBlock.rot)) {
          // while (this.moveValid(-1, 0, this.tetro)) { // TODO: Fix
            // this.x--;
            this.moveCurrentBlock(-1, false, timestamp);
            this.pressedDir['-1'] = timestamp;
            this.Replay.add(new ReplayAction(this.Replay.Action.MOVE_LEFT, this.pressedDir['-1']));
          }
        } else if (finesseChordsKeysHeld.rightDAS) {
          // while (this.moveValid(1, 0, this.tetro)) { // TODO: Fix
          while (!this.checkIntersection(this.activeBlock.pos.x + 1, this.activeBlock.pos.y, this.activeBlock.rot)) {
            // this.x++;
            this.moveCurrentBlock(1, false, timestamp);
            this.pressedDir['1'] = timestamp;
            this.Replay.add(new ReplayAction(this.Replay.Action.MOVE_RIGHT, this.pressedDir['1']));
          }
        }
      }
      this.hardDrop(timestamp);
      // Now that there's a new piece, set finessChordsOriginalX to the new piece's x value
      finessChordsOriginalX = this.activeBlock.pos.x
    } else if (!(finesseChordsLastKeysHeld['0']) && finesseChordsKeysHeld['0']) {
      this.hardDrop(timestamp);
      // Now that there's a new piece, set finessChordsOriginalX to the new piece's x value
      finessChordsOriginalX = this.activeBlock.pos.x
    }

    finesseChordsLastKeysHeld = { ...finesseChordsKeysHeld }
  }


  /*
   * UTILITY FUNCTIONS AND CODE INJECTION
   */

  var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}
  var getParams=a=>{var params=a.slice(a.indexOf("(")+1);params=params.substr(0,params.indexOf(")")).split(",");return params}

  keyInput2DefaultFunctionStr = Game.prototype.keyInput2.toString();
  startPracticeDefaultFunctionStr = Game.prototype.startPractice.toString();

  // edit keyInput2 to call the correct function and ignore restarting without f2 or f4
  const setKeyInput2 = () => {
    // var functionStr = Game.prototype.keyInput2.toString();
    var key = getParams(keyInput2DefaultFunctionStr)[0];
    let preFunction = ''
    let currentHoldKeyCode = this.Settings.hk;
    switch (customControlScheme) {
      case '1KF':
        currentHoldKeyCode = holdKeyCode1KF;
        preFunction = `this.oneKF_handleInputs(${key});if ((${key}.keyCode == this.Settings.controls[8] && this.Settings.controls[8] != 115) || (${key}.keyCode == this.Settings.controls[9] && this.Settings.controls[9] != 113)) {return;}`
        break;
      case 'finesseChords':
        currentHoldKeyCode = holdKeyCodeFinesseChords;
        preFunction = `this.finesseChords_handleInputs(${key});if ((${key}.keyCode == this.Settings.controls[8] && this.Settings.controls[8] != 115) || (${key}.keyCode == this.Settings.controls[9] && this.Settings.controls[9] != 113)) {return;}`
        break;
    }
    // var preFunction = `this.finesseChords_handleInputs(${key});if ((${key}.keyCode == this.Settings.controls[8] && this.Settings.controls[8] != 115) || (${key}.keyCode == this.Settings.controls[9] && this.Settings.controls[9] != 113)) {return;}`
    Game.prototype.keyInput2 = new Function(key, preFunction + trim(keyInput2DefaultFunctionStr));

    // change settings
    // var functionStr = Game.prototype.startPractice.toString();
    var params = getParams(startPracticeDefaultFunctionStr)

    preFunction = `
this.softDropId = 4;
this.Settings.ARR = 0;
this.Settings.ml = -1;
this.Settings.mr = -1;
this.Settings.sd = -1;
this.Settings.hd = -1;
this.Settings.rl = -1;
this.Settings.rr = -1;
this.Settings.hk = ${currentHoldKeyCode};
this.Settings.dr = -1;
`
    Game.prototype.startPractice = new Function(...params, preFunction+trim(startPracticeDefaultFunctionStr));
  }

  setKeyInput2();


  /*
   * CUSTOM CONTROL SCHEME DROPDOWN
   */

  const gameElement = document.getElementById('main');
  updateControlScheme = (e) => {
    customControlScheme = e.value;
    document.cookie = `customControlScheme=${e.value}`;
    setKeyInput2();
  }

  var controlSchemesToDisplayValues = {
    'standard': 'Standard',
    '1KF': 'One Key Finesse',
    'finesseChords': 'Finesse Chords',
  }
  var controlSchemeDiv = document.createElement('div');   
  controlSchemeDiv.setAttribute('style', 'margin-top:15px;display:inline;');
  controlSchemeDiv.setAttribute('class', 'statL');
  controlSchemeDiv.innerHTML = 'Set control scheme:&nbsp;';

  var controlSchemeSelect = document.createElement('select');   
  controlSchemeSelect.setAttribute('name', 'controlSchemeSelect');
  controlSchemeSelect.setAttribute('id', 'controlSchemeSelect');
  controlSchemeSelect.setAttribute('onchange', 'updateControlScheme(this);');

  var standardOption = document.createElement('option');   
  standardOption.setAttribute('value', 'standard');
  standardOption.innerHTML = 'Standard';
  if (customControlScheme === 'standard') {
    standardOption.setAttribute('selected', true);
  }

  controlSchemeSelect.appendChild(standardOption);
  var oneKFOption = document.createElement('option');
  oneKFOption.setAttribute('value', '1KF');
  oneKFOption.innerHTML = 'One Key Finesse';
  if (customControlScheme === '1KF') {
    oneKFOption.setAttribute('selected', true);
  }

  controlSchemeSelect.appendChild(oneKFOption);
  var finesseChordsOption = document.createElement('option');
  finesseChordsOption.setAttribute('value', 'finesseChords');
  finesseChordsOption.innerHTML = 'Finesse Chords';
  if (customControlScheme === 'finesseChords') {
    finesseChordsOption.setAttribute('selected', true);
  }

  controlSchemeSelect.appendChild(finesseChordsOption);
  controlSchemeDiv.appendChild(controlSchemeSelect);
  gameElement.appendChild(controlSchemeDiv);
})();
