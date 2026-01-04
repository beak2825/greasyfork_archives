// ==UserScript==
// @name         Juan0320
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  1 for the left, 3 for the right, 5 up, 2 down, 0 you stand still.
// @author       Juan0320
// @match        *.Abs0rb.me/*
// @match        Abs0rb.me
// @match        http://Abs0rb.me/
// @match        agar.io
// @match        cellz.io
// @match        abs0rb.me
// @match        abs0rb.me/index.php
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/404436/Juan0320.user.js
// @updateURL https://update.greasyfork.org/scripts/404436/Juan0320.meta.js
// ==/UserScript==

// User input.
window.addEventListener("keydown", keydown);
window.addEventListener("keyup", keyup);

//List instructions
var i = document.getElementById("instructions");
i.innerHTML += "<center>Press & hold <b>W</b> for macro feed</center>";
i.innerHTML += "<center>Press <b>A</b> or <b>2</b> to split 2x</center>";
i.innerHTML += "<center>Press <b>Q</b> or <b>1</b> to split 1x</center>";
i.innerHTML += "<center>Press <b>0</b> for horizontal linesplit position</center>";
i.innerHTML += "<center>Press <b>4</b> for vertical linesplit position</center>";
i.innerHTML += "<center>Press <b>1</b> and <b>1</b> to move left and right during a horizontal linesplit</center>";
i.innerHTML += "<center>Press <b>5</b> and <b>5</b> to move up and down during a vertical linesplit</center>";

//Auto-enable show mass/skip stats
//IMPORTANT: You must uncheck showmass/skip stats first then recheck them for it to auto save every time
function autoSet() {
    var m = document.getElementById('showMass'), s = document.getElementById('skipStats');
    if (document.getElementById("overlays").style.display!= "none") {
        document.getElementById("settings").style.display = "block";
        if (m.checked) {m.click();} m.click(); //Show mass
        if (s.checked) {s.click();} s.click(); //Skip stats
    } else setTimeout(autoSet, 100);
}

//Load macros
var canFeed = false;
function keydown(event) {
switch (event.keyCode) {
case 84: //Horizontal linesplit (0)
            X = window.innerWidth / 2;
            Y = window.innerHeight / 2;
            $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}));
            break;
case 89: //Vertical linesplit (4)
            X = window.innerWidth / 2;
            Y = window.innerHeight / 2.006;
            $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}));
            break;
case 71: //Move left Horizontal (1)
            X = window.innerWidth / 2.4;
            Y = window.innerHeight / 2;
            $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}));
            break;
case 86: //Move right Horizontal (3)
            X = window.innerWidth / 1.6;
            Y = window.innerHeight / 2;
            $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}));
            break;
case 72: // Move up Veritcal (5)
            X = window.innerWidth / 2;
            Y = window.innerHeight / 2.4;
            $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}));
            break;
case 66: // Move down Veritcal (2)
            X = window.innerWidth / 2;
            Y = window.innerHeight / 1.6;
            $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}));
            break;
    }
}

function keyup(event) {
    if (event.keyCode == 87)
        canFeed = false;
}

function feed() {
    if (canFeed) {
        window.onkeydown({keyCode: 87});
        window.onkeyup({keyCode: 87});
        setTimeout(feed, 0);
    }
}

function split() {
    $("body").trigger($.Event("keydown", { keyCode: 32}));
    $("body").trigger($.Event("keyup", { keyCode: 32}));
}