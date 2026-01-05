// ==UserScript==
// @name         Macro para agariopvt
// @author       ThousZ
// @description  Dê massa rapidamente e splite rapidamente também! Use as teclas W e T.
// @match        http://agar.io/*
// @match        http://agariopvt.com/play*
// @match        http://es.agareoz.com/*
// @grant        none
// @version 0.0.1.20170301012747
// @namespace https://greasyfork.org/users/106355
// @downloadURL https://update.greasyfork.org/scripts/27768/Macro%20para%20agariopvt.user.js
// @updateURL https://update.greasyfork.org/scripts/27768/Macro%20para%20agariopvt.meta.js
// ==/UserScript==

window.settings = {
    start: function(){
        this.macros();
    },

    macros: function(){
window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

var ejecting = false;
var splitSpeed = 26;
var ejectSpeed = 28;

function keydown(event) {
    if (event.keyCode == 87 && ejecting === false) {
        ejecting = true;
        setTimeout(eject, ejectSpeed);
    }
    if (event.keyCode == 84) {
        split();
        setTimeout(split, splitSpeed);
        setTimeout(split, splitSpeed*2);
        setTimeout(split, splitSpeed*3);
    }
}

function keyup(event) {
    if (event.keyCode == 87) {
        ejecting = false;
    }
}

function eject() {
    if (ejecting) {
        window.onkeydown({keyCode: 87});
        window.onkeyup({keyCode: 87});
        setTimeout(eject, ejectSpeed);
    }
}

function split() {
    $("body").trigger($.Event("keydown", { keyCode: 32}));
    $("body").trigger($.Event("keyup", { keyCode: 32}));
}
    }
};
settings.start();