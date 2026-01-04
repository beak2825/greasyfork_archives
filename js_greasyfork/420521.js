// ==UserScript==
// @name         One Key Finesse
// @namespace    http://tampermonkey.net/
// @version      0.4.1
// @description  Adds 1 key finesse to jstris
// @author       Justin1L8
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420521/One%20Key%20Finesse.user.js
// @updateURL https://update.greasyfork.org/scripts/420521/One%20Key%20Finesse.meta.js
// ==/UserScript==

window.OneKF = class OneKF {
    // script will only run on the specified account or as a guest (unless it's set to "". then it will always run)
    // you probably shouldn't use 1KF on your main. it's unclear if it's allowed
    static expectedUsername = "Justin1KF";
    static runWhenGuest = true;

    // if true, you must press a key twice to actually hard drop it
    // useful for slower practice
    static doubleTapConfirmation = false;

    // determines how the keyboard column corresponds to the in-game position
    // left:    distance from the *left* wall    (A = against the left wall, S = 1 from left)
    // nearest: distance from the *nearest* wall (A = against the left wall, ; = against right wall, L = 1 from right)
    // I've removed some other alignment options because I didn't think anyone was using them. If I was wrong, lmk in discord and I'll re-add them
    static fromWall = "nearest";

    // first number is top row. 0 is start rotation, 1 is cw
    static rowRotations = [2,3,0,1];

    // keycodes. change only if your keyboard layout isn't qwerty
    static keyCodes = [[49, 50, 51, 52, 53, 54, 55, 56, 57, 48],
                       [81, 87, 69, 82, 84, 89, 85, 73, 79, 80],
                       [65, 83, 68, 70, 71, 72, 74, 75, 76, 186],
                       [90, 88, 67, 86, 66, 78, 77, 188, 190, 191]]

    static holdKeyCode = 32; // 32 = space


    /****************************************
              ignore the rest
    ****************************************/

    static enabled = true;
    static mostRecentKey = -1;


    static handleInput(key, game) {
        var position = OneKF.keyToPosition(key, game);

        // only hard drop double tap confirmation is disabled, or if this key was also the previous key
        var doHardDrop;
        if (OneKF.doubleTapConfirmation == false) doHardDrop = true;
        else {
            doHardDrop = OneKF.mostRecentKey == key.keyCode;
            if (doHardDrop) OneKF.mostRecentKey = -1; // if you press the same key for two pieces in a row, don't count that as a confirmation
            else OneKF.mostRecentKey = key.keyCode;
        }

        if (position != null) OneKF.movePieceTo(position.col, position.rot, doHardDrop, game);
    }

    // returns the in-game column and rotation based on the key pressed
    static keyToPosition(key, game) {
        // get the position on the keyboard. go through each row until indexOf(key) != -1
        var keyColumn, keyRow;
        for (keyRow = 0; keyRow < 4; keyRow++) {
            keyColumn = OneKF.keyCodes[keyRow].indexOf(key.keyCode);
            if (keyColumn != -1) break;
        }
        if (keyColumn == -1) return null; // key wasn't in the 10x4 area of 1kf keys

        // get the ingame position
        var rotation = OneKF.rowRotations[keyRow];

        // the ingame position of the left- and right-most placements
        var farLeft = -game.blockSets[game.activeBlock.set].blocks[game.activeBlock.id].cc[rotation];
        var farRight = farLeft + finesse[game.activeBlock.id][rotation].length - 1;

        var inGameColumn;
        if (OneKF.fromWall == "left" || keyColumn <= 4) // from left wall
            inGameColumn = Math.min(farLeft + keyColumn, farRight); // use min() to make sure it's in the bounds of the matrix
        else // from right wall
            inGameColumn = farRight - (9 - keyColumn);

        return {"col":inGameColumn, "rot":rotation};
    }

    // moves the piece to the in-game column and rotation given. also hard drops if enabled.
    static movePieceTo(column, rotation, hardDrop, game) {
        var time = game.timestamp();

        // rotation
        var rotateAmount = (rotation - game.activeBlock.rot) % 4; // can't assume starting rotation because of confirmation key
        if (rotateAmount == 3) rotateAmount = -1;

        rotate(rotateAmount);

        // column
        var startX = game.activeBlock.pos.x;
        var tapCount = Math.abs(startX - column)
        var tapDirection = (column < startX) ? -1 : 1;

        for (let i = 0; i < tapCount; i++) {
            tap(tapDirection);
        }

        // hd
        if (hardDrop) game.hardDrop(time);


        // moves a piece and adds an arr movement to the replay
        // direction must be 1 or -1
        function tap(direction) {
            game.moveCurrentBlock(direction, true, time);

            let replayAction = new ReplayAction(game.Replay.Action.ARR_MOVE, time);
            replayAction.d = [(direction == 1) ? 1 : 0];
            game.Replay.add(replayAction);
        }

        // rotates the piece and adds that action to the replay
        // amount must be 0, 1, 2, or -1
        function rotate(amount) {
            if (amount == 0) return;
            game.rotateCurrentBlock(amount);
            var replayAction;
            if (amount == 1) replayAction = game.Replay.Action.ROTATE_RIGHT;
            else if (amount == 2) replayAction = game.Replay.Action.ROTATE_180;
            else replayAction = game.Replay.Action.ROTATE_LEFT;

            game.Replay.add(new ReplayAction(replayAction, time));
        }
    }
}

// now, add it into jstris by changing Game's methods
if (typeof Game != "undefined") {

    // clear matrix is called at the start of any game
    let clear_matrix = Game.prototype.clearMatrix;
    Game.prototype.clearMatrix = function() {
        // check if 1kf should be disabled
        if (this.Live.authorized == false) { // player is a guest
            if (!OneKF.runWhenGuest) {
                console.log("1KF disabled; you're a guest runWhenGuest is false");
                OneKF.enabled = false;
            }
        }
        else if (this.Live.chatName != OneKF.expectedUsername) { // username doesn't match
            console.log("1KF disabled; expected username was " + OneKF.expectedUsername + ", but found " + this.Live.chatName);
            OneKF.enabled = false;
        }

        // set all controls to -1, so standard controls don't interfere with 1kf
        if (OneKF.enabled) {
            this.Settings.ml = -1;
            this.Settings.mr = -1;
            this.Settings.sd = -1;
            this.Settings.hd = OneKF.confirmationKey;
            this.Settings.rl = -1;
            this.Settings.rr = -1;
            this.Settings.hk = OneKF.holdKeyCode;
            this.Settings.dr = -1;
            this.Settings.controls[8] = -1; // reset keys
            this.Settings.controls[9] = -1; //
        }

        return clear_matrix.apply(this, arguments);
    }

    // keyInput2 is called on any keypress
    let key_input_2 = Game.prototype.keyInput2;
    Game.prototype.keyInput2 = function() {
        if (OneKF.enabled && this.focusState == 0 && this.play) OneKF.handleInput(arguments[0], this);

        return key_input_2.apply(this, arguments);
    }
}