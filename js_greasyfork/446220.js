// ==UserScript==
// @name         Replay Piece Step
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  makes replayer arrows step to next piece
// @author       Justin1L8
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446220/Replay%20Piece%20Step.user.js
// @updateURL https://update.greasyfork.org/scripts/446220/Replay%20Piece%20Step.meta.js
// ==/UserScript==

if (ReplayController == 'undefined') return;

ReplayController.prototype.nextFrame = function() {
    // find the next upcoming hard drop
    let nextHdTime = -1;
    this.g.forEach((r, _) => {
        for (let i = r.ptr; i < r.actions.length; i++) {
            let action = r.actions[i].a;
            let time = r.actions[i].t;

            if (action == Action.HARD_DROP) {
                if (nextHdTime == -1 || time < nextHdTime)
                    nextHdTime = time;
                break;
            }
        }
    });

    // play all replayers until that time
    if (nextHdTime < 0) return;
    this.g.forEach((r, _) => r.playUntilTime(nextHdTime));
}

ReplayController.prototype.prevFrame = function(){
    // ignore the latest hd; find the one before that
    let prevHdTime = -1;
    this.g.forEach((r, _) => {
        let foundLatestHd = false;
        for (let i = r.ptr-1; i >= 0; i--) {
            let action = r.actions[i].a;
            let time = r.actions[i].t;

            if (action == Action.HARD_DROP) {
                if (foundLatestHd) {
                    if (prevHdTime == -1 || time > prevHdTime)
                        prevHdTime = time;
                    break;
                }
                else foundLatestHd = true;
            }
        }
    });

    // go to that time
    if (prevHdTime < 0) return;
    this.loadAtTime(prevHdTime);
}