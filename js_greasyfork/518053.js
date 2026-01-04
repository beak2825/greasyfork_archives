// ==UserScript==
// @name         Shakashaka Lattice
// @namespace    http://tampermonkey.net/
// @version      24.11.19.1
// @description  Mark the crosses.
// @author       Leaving Leaves
// @match        https://puzz.link/p?shakashaka/*
// @match        https://pzplus.tck.mn/p?shakashaka/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=puzz.link
// @license      GPL
// @grant        none
// @namespace    https://greasyfork.org/users/1192854
// @downloadURL https://update.greasyfork.org/scripts/518053/Shakashaka%20Lattice.user.js
// @updateURL https://update.greasyfork.org/scripts/518053/Shakashaka%20Lattice.meta.js
// ==/UserScript==

'use strict';
let done = false;
function main() {
    document.querySelector('div[data-value="dot"]').removeAttribute('style');
    ui.puzzle.mouse.inputModes.play.push('dot');
    ui.puzzle.mouse.__proto__.mouseinput_other = function () {
        if (this.inputMode === "dot") {
            this.inputdot();
        }
    };
    ui.puzzle.mouse.__proto__.inputdot = function () {
        var pos = this.getpos(0.25);
        if (this.prevPos.equals(pos)) {
            return;
        }
        var dot = pos.getobj();
        this.prevPos = pos;
        if (!pos.oncross || dot === null) {
            return;
        }
        if (this.inputData === null) {
            if (this.btn === "left") {
                this.inputData = { 0: 1, 1: 2, 2: 0 }[dot.qsub];
            } else if (this.btn === "right") {
                this.inputData = { 0: 2, 1: 0, 2: 1 }[dot.qsub];
            } else {
                return;
            }
        }
        dot.setQsub(this.inputData);
        dot.draw();
    };

    let o = {
        drawDots: function () {
            var g = this.vinc("dot", "auto");

            g.lineWidth = (1 + this.cw / 40) | 0;
            var d = this.range;
            var size = this.cw * 0.15;
            if (size < 3) {
                size = 3;
            }
            var dlist = this.board.crossinside(d.x1, d.y1, d.x2, d.y2);
            for (var i = 0; i < dlist.length; i++) {
                var dot = dlist[i],
                    bx = dot.bx,
                    by = dot.by,
                    px = bx * this.bw,
                    py = by * this.bh;

                g.vid = "s_dot_" + dot.id;
                var outline = this.getDotOutlineColor(dot);
                var color = this.getDotFillColor(dot);
                if (dot.qsub === 1) {
                    g.strokeStyle = outline;
                    g.fillStyle = color;
                    g.shapeCircle(px, py, this.cw * this.getDotRadius(dot));
                } else if (dot.qsub === 2) {
                    g.strokeStyle = outline;
                    g.fillStyle = color;
                    g.beginPath();
                    g.moveTo(px - size, py - size);
                    g.lineTo(px + size, py + size);
                    g.moveTo(px - size, py + size);
                    g.lineTo(px + size, py - size);
                    g.closePath();
                    g.stroke();
                } else {
                    g.vhide();
                }
            }
        },

        getDotFillColor: function (dot) {
            if (dot.qsub === 1 || dot.qsub === 2) {
                return dot.trial ? this.trialcolor : this.pekecolor;
            }
            return null;
        },
        getDotOutlineColor: function (dot) {
            if (dot.qsub === 1 || dot.qsub === 2) {
                return dot.trial ? this.trialcolor : this.pekecolor;
            }
            return null;
        },
        getDotRadius: function (dot) {
            return 0.1;
        }
    };
    for (let e in o) { ui.puzzle.painter[e] = o[e]; }
    ui.puzzle.painter.paint = (function () {
        let origin = ui.puzzle.painter.paint;
        return function () {
            origin.apply(this, arguments);
            ui.puzzle.painter.drawDots();
        };
    })();
}
ui.puzzle.on('ready', main, false);
let initTimer = setInterval(() => {
    if (done) {
        clearInterval(initTimer);
        return;
    }
    main();
}, 1000);