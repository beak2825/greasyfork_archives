// ==UserScript==
// @name         Super Fast split For f lag
// @version      0.1
// @description  FAST SPLIT = E Macro Feed = W
// @author       ๖ۣۜƓ€₮ʳᵉᵏᵗ༻♕
// @match        http://abs0rb.me/*
// @match        http://bubla.io/*
// @match        http://germs.io/*
// @match        http://popsplit.us/*
// @match        http://gaver.io/web/*
// @match        https://popsplit.us/*
// @grant        none
// @namespace https://greasyfork.org/users/155277
// @downloadURL https://update.greasyfork.org/scripts/38597/Super%20Fast%20split%20For%20f%20lag.user.js
// @updateURL https://update.greasyfork.org/scripts/38597/Super%20Fast%20split%20For%20f%20lag.meta.js
// ==/UserScript==
var SplitInterval;
var MacroInterval;
var SplitDebounce = false;
var MacroDebounce = false;
$(document).on('keydown', function(input) {
    console.log("got keydown")
    if (input.keyCode == 69) {
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
    if (input.keyCode == 69) {
        SplitDebounce = false;
        clearInterval(SplitInterval);
        return;
    } else if (input.keyCode == 87) {
        MacroDebounce = false;
        clearInterval(MacroInterval);
        return;
    }
})