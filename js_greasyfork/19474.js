// ==UserScript==
// @name         Split and fast feed
// @namespace    agar.io
// @version      1.0
// @description  For ArabCrew Groub made by TenK!.
// @author       TeNk
// @match        http://agar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19474/Split%20and%20fast%20feed.user.js
// @updateURL https://update.greasyfork.org/scripts/19474/Split%20and%20fast%20feed.meta.js
// ==/UserScript==
/ jshint -W097 /
'use strict';

var SplitInterval;
var MacroInterval;
var SplitDebounce = false;
var MacroDebounce = false;
$(document).on('keydown', function(input) {
    console.log("got keydown")
    if (input.keyCode == 84) {
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
    } else if (input.keyCode == 69) {
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
    if (input.keyCode == 84) {
        SplitDebounce = false;
        clearInterval(SplitInterval);
        return;
    } else if (input.keyCode == 69) {
        MacroDebounce = false;
        clearInterval(MacroInterval);
        return;
    }
})