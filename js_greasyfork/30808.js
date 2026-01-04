

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
// ==UserScript==
// @name         Ultr Super Fast Feed W Gaver.io
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Macro W Gaver.io by Akash
// @author       Akash
// @match        http://gaver.io/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30808/Ultr%20Super%20Fast%20Feed%20W%20Gaverio.user.js
// @updateURL https://update.greasyfork.org/scripts/30808/Ultr%20Super%20Fast%20Feed%20W%20Gaverio.meta.js
// ==/UserScript==

window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

var EjectDown = false;

var speed = 20000; //in ms

function keydown(event) {
    if (event.keyCode == 200000 && EjectDown === false) { // key A
        EjectDown = true;
        setTimeout(eject, speed);
    }
}
function keyup(event) {
    if (event.keyCode == 200000) { // key A
        EjectDown = false;
    }
}

function eject() {
    if (EjectDown) {
        window.onkeydown({keyCode: 10000000000}); // key W
        window.onkeyup({keyCode: 10000000000});
        setTimeout(eject, speed);
    }
}