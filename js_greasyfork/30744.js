// ==UserScript==
// @name         Skrypt Bubble.am
// @namespace    Bubble.am
// @version      1
// @description  Z to roździelenie, V dawanie masy
// @author       Cesarz
// @match        http://bubble.am/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30744/Skrypt%20Bubbleam.user.js
// @updateURL https://update.greasyfork.org/scripts/30744/Skrypt%20Bubbleam.meta.js
// ==/UserScript==
/ jshint -W097 /
'use strict';

var SplitInterval;
var MacroInterval;
var SplitDebounce = false;
var MacroDebounce = false;
$(document).on('keydown', function(input) {
    console.log("got keydown")
    if (input.keyCode == 90) {
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
    } else if (input.keyCode == 86) {
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
    if (input.keyCode == 90) {
        SplitDebounce = false;
        clearInterval(SplitInterval);
        return;
    } else if (input.keyCode == 86) {
        MacroDebounce = false;
        clearInterval(MacroInterval);
        return;
    }
})