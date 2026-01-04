// ==UserScript==
// @name         SUPERFAST SPLIT Atom
// @version      0.1
// @description  FAST SPLIT = D Macro Feed = W
// @author       ๖ۣۜƓ€₮ʳᵉᵏᵗ༻♕
// @match        http://germs.io/*
// @grant        none
// @namespace https://greasyfork.org/users/155277
// @downloadURL https://update.greasyfork.org/scripts/36857/SUPERFAST%20SPLIT%20Atom.user.js
// @updateURL https://update.greasyfork.org/scripts/36857/SUPERFAST%20SPLIT%20Atom.meta.js
// ==/UserScript==
var SplitInterval;
var MacroInterval;
var SplitDebounce = false;
var MacroDebounce = false;
$(document).on('keydown', function(input) {
    console.log("got keydown")
    if (input.keyCode == 68) {
        if (SplitDebounce) {
            return;
        }
        SplitDebounce = true;
        SplitInterval = setInterval(function() {
            $("body").trigger($.Event("keydown", {
                keyCode: 32
            }));
            $("body").trigger($.Event("keyup", {
                keyCode: 32
            }));
        }, 0);
    } else if (input.keyCode == 74) {
  if (MacroDebounce) {
            return;
        }
        MacroDebounce = true;
        MacroInterval = setInterval(function() {
            $("body").trigger($.Event("keydown", {
                keyCode: 80
            }));
            $("body").trigger($.Event("keyup", {
                keyCode: 80
            }));
        }, 0);
 }
})

$(document).on('keyup', function(input) {
    if (input.keyCode == 68) {
        SplitDebounce = false;
        clearInterval(SplitInterval);
        return;
    } else if (input.keyCode == 87) {
        MacroDebounce = false;
        clearInterval(MacroInterval);
        return;
    }
})