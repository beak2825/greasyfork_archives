// ==UserScript==
// @name          SHEGGY MACRO SPLİT ! Press Shift !
// @namespace    SHEGGY MACRO SPLİT
// @version      1
// @description  Shift Macro Split, Q Macro Feed !
// @author       Gökhan Kıraç !
// @match        http://bubble.am/*
// @match        http://agarz.com/*
// @match        http://alis.io/*
// @match        http://rata.io/*
// @match        http://www.agarw.com/*
// @match        http://agar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32839/SHEGGY%20MACRO%20SPL%C4%B0T%20%21%20Press%20Shift%20%21.user.js
// @updateURL https://update.greasyfork.org/scripts/32839/SHEGGY%20MACRO%20SPL%C4%B0T%20%21%20Press%20Shift%20%21.meta.js
// ==/UserScript==
/ jshint -W097 /
'use strict';

var SplitInterval;
var MacroInterval;
var SplitDebounce = false;
var MacroDebounce = false;
$(document).on('keydown', function(input) {
    console.log("got keydown")
    if (input.keyCode == 16) {
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
    } else if (input.keyCode == 81) {
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
    if (input.keyCode == 16) {
        SplitDebounce = false;
        clearInterval(SplitInterval);
        return;
    } else if (input.keyCode == 81) {
        MacroDebounce = false;
        clearInterval(MacroInterval);
        return;
    }
})