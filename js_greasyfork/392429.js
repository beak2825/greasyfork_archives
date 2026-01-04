// ==UserScript==
// @name         Linesplit
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Linesplit Mod for Abs0rb.me
// @author       nyone
// @match        http://abs0rb.me/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/392429/Linesplit.user.js
// @updateURL https://update.greasyfork.org/scripts/392429/Linesplit.meta.js
// ==/UserScript==

window.addEventListener('keydown', keydown);

const Speed = 25;

function split() {
    $("body").trigger($.Event("keydown", {
        keyCode: 32
    }));
    $("body").trigger($.Event("keyup", {
        keyCode: 32
    }));
}

function keydown(event) {
    if (event.key == "f") {
        split();
        setTimeout(split, Speed);
        setTimeout(split, Speed * 2);
    }
    if (event.key == "ArrowRight") {
        let X = window.innerWidth / 0.5;
        let Y = window.innerHeight / 2;
        $("canvas").trigger($.Event("mousemove", {
            clientX: X,
            clientY: Y
        }));
    }
    if (event.key == "ArrowLeft") {
        let X2 = window.innerWidth / 3.5;
        let Y2 = window.innerHeight / 2;
        $("canvas").trigger($.Event("mousemove", {
            clientX: X2,
            clientY: Y2
        }));
    }
    if (event.key == "ArrowUp") {
        let X3 = window.innerWidth / 2;
        let Y3 = window.innerHeight / 3.5;
        $("canvas").trigger($.Event("mousemove", {
            clientX: X3,
            clientY: Y3
        }));
    }
    if (event.key == "ArrowDown") {
        let X4 = window.innerWidth / 2;
        let Y4 = window.innerHeight / 0.5;
        $("canvas").trigger($.Event("mousemove", {
            clientX: X4,
            clientY: Y4
        }));
    }
    if (event.key == "z") {
        let X5 = window.innerWidth / 2;
        let Y5 = window.innerHeight / 2;
        $("canvas").trigger($.Event("mousemove", {
            clientX: X5,
            clientY: Y5
        }));
    }
}