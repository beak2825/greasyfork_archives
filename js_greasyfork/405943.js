// ==UserScript==
// @name        MooMoo.io, Agar.io, Surviv.io, Slither.io, Diep.io, Global Name Manager [Krunker Coming Soon]
// @namespace   https://greasyfork.org/en/users/198860-flarez-gaming
// @description Auto-fill nicknames into .io games! Supports Starve.io, MooMoo.io, Diep.io, Agar.io, Slither.io, Diep.io, Deeeep.io, Evowars.io, Zombs.io, Paper.io, and Skribbl.io
// @version     0.7
// @match       *://starve.io/*
// @match       *://moomoo.io/*
// @match       *://sandbox.moomoo.io/*
// @match       *://dev.moomoo.io/*
// @match       *://*.moomoo.io/*
// @match       *://surviv.io/*
// @match       *://agar.io/*
// @match       *://slither.io/*
// @match       *://diep.io/*
// @match       *://deeeep.io/*
// @match       *://evowars.io/*
// @match       *://zombs.io/*
// @match       *://paper-io.com/*
// @match       *://skribbl.io/*
// @grant       GM.setValue
// @grant       GM.getValue
// @grant       unsafeWindow
// @run-at      document_start
// @antifeature tracking
// @require     https://greasyfork.org/scripts/410512-sci-js-from-ksw2-center/code/scijs%20(from%20ksw2-center).js
// @downloadURL https://update.greasyfork.org/scripts/405943/MooMooio%2C%20Agario%2C%20Survivio%2C%20Slitherio%2C%20Diepio%2C%20Global%20Name%20Manager%20%5BKrunker%20Coming%20Soon%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/405943/MooMooio%2C%20Agario%2C%20Survivio%2C%20Slitherio%2C%20Diepio%2C%20Global%20Name%20Manager%20%5BKrunker%20Coming%20Soon%5D.meta.js
// ==/UserScript==

//retested code, still all works?
var name;
(async () => {
    if (await GM.getValue("name", null) == null) {
        //first exec
        await GM.setValue("name", "name");
    };
    name = await GM.getValue("name", 0);
})();

function execute() {
    switch (window.location.host) {
        case 'starve.io': document.getElementById("nickname_input").value = name; break;
        case 'surviv.io': document.getElementById("player-name-input-solo").value = name; break;
        case 'moomoo.io': document.getElementById("nameInput").value = name; break;
        case 'sandbox.moomoo.io': document.getElementById("nameInput").value = name; break;
        case 'dev.moomoo.io': document.getElementById("nameInput").value = name; break;
        case 'agar.io': document.getElementById("nick").value = name; break;
        case 'slither.io': document.getElementById("nick").value = name; break;
        case 'diep.io': document.getElementById("textInput").value = name; break;
        case 'deeeep.io': document.getElementsByClassName("name")[0].value = name; break;
        case 'evowars.io': document.querySelectorAll("input")[0].value = name; break;
        case 'zombs.io': document.getElementsByClassName("hud-intro-name")[0].value = name; break;
        case 'paper-io.com': document.getElementById("paperio_p1").value = name; break;
        case 'skribbl.io': document.getElementById("inputName").value = name; break;
    };
};
//for actual key executions, use `name` variable to do everything

document.onkeydown = keydown;
async function keydown (evt) {
    if (!evt) evt = event;
    if (evt.ctrlKey && evt.code === 'Backquote' && !evt.shiftKey) { //ctrl + ~
        evt.preventDefault();
        execute();
        alert("Executed name call!");
    };
    if (evt.ctrlKey && evt.shiftKey && evt.code === 'Backquote') { //ctrl + shift + ~
        evt.preventDefault();
        var new_name = prompt("New Name");
        GM.setValue("name", new_name || "none");
        name = new_name;
        execute();
    };
};
//name manager