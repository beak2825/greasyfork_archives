// ==UserScript==
// @name         Agar io script by HeadshoT V2
// @namespace    HeadshoT
// @version      1
// @description  By HeadshoT
// @author       HeadshoT
// @match        http://agar.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18833/Agar%20io%20script%20by%20HeadshoT%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/18833/Agar%20io%20script%20by%20HeadshoT%20V2.meta.js
// ==/UserScript==
'use strict';

//presets
setShowMass(true); // Show your mass
setDarkTheme(true); // Enable Dark theme by default
$("#nick").val("♥нєαdѕнσт♥"); // SET  yYOUR NAME - / MAIS TON NOM ICI

var SplitInterval;
var MacroInterval;
var SplitDebounce = false;
var MacroDebounce = false;
$(document).on('keydown', function(input) {
    console.log("got keydown")
    if (input.keyCode == 20) {
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
    } else if (input.keyCode == 88) {
  if (MacroDebounce) {
            return;
        }
        MacroDebounce = true;
        MacroInterval = setInterval(function() {
            $("body").trigger($.Event("keydown", {
                keyCode: 87
            }));
            $("body").trigger($.Event("keyup", {
                keyCode: 87
            }));
        }, 0);
 }
})

$(document).on('keyup', function(input) {
    if (input.keyCode == 20) {
        SplitDebounce = false;
        clearInterval(SplitInterval);
        return;
    } else if (input.keyCode == 88) {
        MacroDebounce = false;
        clearInterval(MacroInterval);
        return;
    }
})