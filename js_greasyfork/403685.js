// ==UserScript==
// @name         Agar Macros
// @namespace    http://agar.io
// @version      1.2
// @description  try to take over the world!
// @author       Flushy
// @match        https://agar.io/
// @grant        none
// @require     https://code.jquery.com/jquery-3.5.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/403685/Agar%20Macros.user.js
// @updateURL https://update.greasyfork.org/scripts/403685/Agar%20Macros.meta.js
// ==/UserScript==

(function() {
function initMacros(keybinds) {
    var macroHelper = {
        ejecting: false,
        speed: 50,
        eject: function() {
            if (macroHelper.ejecting) {
                window.onkeydown({keyCode: 87}); // key W
                window.onkeyup({keyCode: 87});
                setTimeout(macroHelper.eject, macroHelper.speed);
            }
        },
        split: function() {
            $("body").trigger($.Event("keydown", {
                keyCode: 32
            }));
            $("body").trigger($.Event("keyup", {
                keyCode: 32
            }));
        },
        handler: {
            keydown: function(event) {
                if (event.keyCode == keybinds.eject && macroHelper.ejecting === false) { // key W
                    macroHelper.ejecting = true;
                    macroHelper.eject();  // W
                }
                if (event.keyCode == keybinds.double) { // D
                    macroHelper.split();
                    setTimeout(macroHelper.split, macroHelper.speed);
                }
                 if (event.keyCode == keybinds.triple) { // T
                    macroHelper.split();
                    setTimeout(macroHelper.split, macroHelper.speed);
                    setTimeout(macroHelper.split, macroHelper.speed*2);
                }
                 if (event.keyCode == keybinds.quad) { // Q
                    macroHelper.split();
                    setTimeout(macroHelper.split, macroHelper.speed);
                    setTimeout(macroHelper.split, macroHelper.speed*2);
                    setTimeout(macroHelper.split, macroHelper.speed*3);
                 }
            },
            keyup: function(event) {
                if (event.keyCode == keybinds.eject) {
                    macroHelper.ejecting = false;
                }
            }
        }
    }
    window.addEventListener("keydown", macroHelper.handler.keydown),
    window.addEventListener("keyup", macroHelper.handler.keyup)
}
var keybinds = {
    eject: 87,
    double: 68,
    triple: 84,
    quad: 71,
}
initMacros(keybinds);
function initHtml() {
    if (document.getElementById("instructions")) {
        $("#instructions .text-muted").html($("#instructions .text-muted").html() + "<button id='change-macros' class='btn btn-change-macros'>Change macro keybinds! (Not working yet)</button>");
        $("#instructions[data-v-0733aa78]").css("line-height", "1.00");
        $("#instructions[data-v-0733aa78]").css("top", "33px")
    }
}
//initHtml();
})();