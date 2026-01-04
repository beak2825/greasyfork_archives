
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
// @name         extra mass Gaver.io
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  extra mass Gaver.io by Akash
// @author       Akash
// @match        http://gaver.io/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30809/extra%20mass%20Gaverio.user.js
// @updateURL https://update.greasyfork.org/scripts/30809/extra%20mass%20Gaverio.meta.js
// ==/UserScript==

window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

var EntryMass = false;

var speed = 20000; //in ms

function keydown(event) {
    if (event.keyCode == 200000 && EntryMass === false) { // Auto
        MassDown = true;
        setTimeout(Mass, speed);
    }
}
function keyup(event) {
    if (event.keyCode == 200000) { // Auto
        Mass = false;
    }
}

function mass() {
    if (MassDown) {
        window.onkeydown({keyCode: 10000000000}); // Auto
        window.onkeyup({keyCode: 10000000000});
        setTimeout(mass, speed);
    }
}