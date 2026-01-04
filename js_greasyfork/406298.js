// ==UserScript==
// @name         balls
// @namespace    http://tampermonkey.net/
// @version      ✓
// @description  Everything for boll games!
// @author       DeaDTrickS
// @match        https://gota.io/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/406298/balls.user.js
// @updateURL https://update.greasyfork.org/scripts/406298/balls.meta.js
// ==/UserScript==

window.addEventListener('keydown', keydown);

function keydown(event) {
    if (event.key == "g") {
        let X1 = window.innerWidth / 0.5;
        let Y1 = window.innerHeight / 2;
        $("canvas").trigger($.Event("mousemove", {
            clientX: X1,
            clientY: Y1
        }));
    }
    if (event.key == "d") {
        let X2 = window.innerWidth / 3.5;
        let Y2 = window.innerHeight / 2;
        $("canvas").trigger($.Event("mousemove", {
            clientX: X2,
            clientY: Y2
        }));
    }
    if (event.key == "r") {
        let X3 = window.innerWidth / 2;
        let Y3 = window.innerHeight / 3.5;
        $("canvas").trigger($.Event("mousemove", {
            clientX: X3,
            clientY: Y3
        }));
    }
    if (event.key == "v") {
        let X4 = window.innerWidth / 2;
        let Y4 = window.innerHeight / 0.5;
        $("canvas").trigger($.Event("mousemove", {
            clientX: X4,
            clientY: Y4
        }));
    }
    if (event.key == "f") {
        let X5 = window.innerWidth / 2;
        let Y5 = window.innerHeight / 2;
        $("canvas").trigger($.Event("mousemove", {
            clientX: X5,
            clientY: Y5
        }));
    }
    if (event.key == "e") {
        let X6 = window.innerWidth /2-200;
        let Y6 = window.innerHeight /2-200;
        $("canvas").trigger($.Event("mousemove", {
            clientX: X6,
            clientY: Y6
        }));
    }
    if (event.key == "b") {
        let X7 = window.innerWidth /2+200;
        let Y7 = window.innerHeight /2+200;
        $("canvas").trigger($.Event("mousemove", {
            clientX: X7,
            clientY: Y7
        }));
    }
    if (event.key == "t") {
        let X8 = window.innerWidth /2+200;
        let Y8 = window.innerHeight /2-200;
        $("canvas").trigger($.Event("mousemove", {
            clientX: X8,
            clientY: Y8
        }));
    }
    if (event.key == "c") {
        let X9 = window.innerWidth /2-200;
        let Y9 = window.innerHeight /2+200;
        $("canvas").trigger($.Event("mousemove", {
            clientX: X9,
            clientY: Y9
        }));
    }
}