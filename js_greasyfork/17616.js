// ==UserScript==
// @name         ScumHelp
// @namespace    https://greasyfork.org/en/users/9694-croned
// @version      1.1
// @description  Allows you to mark posts for scumreading
// @author       Croned
// @match        https://epicmafia.com/game/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/17616/ScumHelp.user.js
// @updateURL https://update.greasyfork.org/scripts/17616/ScumHelp.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';
var shift = false;
var red = false;
var green = false;

$("body").keydown(function(e) {
    if (e.keyCode == 16) {
        shift = true;
    }
    else if (e.keyCode == 82) {
        red = true;
    }
    else if (e.keyCode == 71) {
        green = true;
    }
});
    
$("body").keyup(function(e) {
    if (e.keyCode == 16) {
        shift = false;
    }
    else if (e.keyCode == 82) {
        red = false;
    }
    else if (e.keyCode == 71) {
        green = false;
    }
});

setTimeout(function() {
    $(".msg").click(function() {
        console.log(shift + red + green);
        if (shift) {
            if (red) {
                $(this).css({"background-color": "#ff6666"});
            }
            else if (green) {
                $(this).css({"background-color": "#b3ffb3"});
            }
            else {
                $(this).css({"background-color": "transparent"});
            }
            window.getSelection().removeAllRanges();
        }
    });
}, 1000);


    
var previousHTML = $("html").html();

setInterval(function() {
    var currentHTML = $("html").html();
    if (previousHTML != currentHTML) {
        $(".msg").click(function() {
            console.log(shift + red + green);
            if (shift) {
                if (red) {
                    $(this).css({"background-color": "#ff6666"});
                }
                else if (green) {
                    $(this).css({"background-color": "#b3ffb3"});
                }
                else {
                    $(this).css({"background-color": "transparent"});
                }
                window.getSelection().removeAllRanges();
            }
        });
    }
    previousHTML = currentHTML;
}, 1000);