// ==UserScript==
// @name         Elite
// @namespace    Macro!
// @version      6.0
// @description  Very fast macro to enhance gameplay!
// @author       Unknown
// @match        http://agario.link/
// @match        http://agarz.com
//@match         http://agario.global
// @match        http://agario.sx/*
//@match         http://agarioplay.org/*
//@match         http://en.agar.bio/
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/16251/Elite.user.js
// @updateURL https://update.greasyfork.org/scripts/16251/Elite.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_d'> ---------------------------------</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_e'> Press <b>E</b> to fast feed</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_d'> ---------------------------------</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_d'> Quickchat Commands</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_d'> <b>1</b> - Your current location</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_d'> <b>2</b> - 'Where are you!?'</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_d'> <b>3</b> - 'Virus Him'</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_d'> <b>4</b> - 'Split into me!'</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_d'> <b>5</b> - 'Split him!'</span></span></center>";


var interval;
var switchy = false;
$(document).on('keydown',function(e){

    if(e.keyCode == 69){

        if(switchy){
            return;
        }
        switchy = true;
        interval = setInterval(function() {

            $("body").trigger($.Event("keydown", { keyCode: 87}));
            $("body").trigger($.Event("keyup", { keyCode: 87}));
        }, 3);//increase this number to make it fire them out slower
    }
});

$(document).on('keyup',function(e){

    if(e.keyCode == 69){

        switchy = false;
        clearInterval(interval);
        return;
    }
});

var f5 = setInterval(chat,100);

function chat(){
    //var w = window.mini_map_tokens[0];
    document.getElementById("chat_textbox").onkeyup = function() {
        if (this.value == "3") {
            this.value = "Virus Him!";
        }
        if (this.value == "4") {
            this.value = "Split into me!";
        }
        if (this.value == "5") {
            this.value = "Split him!";
        }
        if (this.value == "2") {
            this.value = "Where are you!?";
        }
        if (this.value == "1") {

            for (var id in window.mini_map_tokens) {
                var token = window.mini_map_tokens[id];
                var x = token.x;
                var y = token.y;
                this.value = "I'm at " + String.fromCharCode(Math.floor(y*6)+65) + Math.floor((x*6)+1);
            }
        }
        
        var mouseX = event.clientX;     // Get the horizontal coordinate
        var mouseY = event.clientY;     // Get the vertical coordinate
        if (this.value == "6") {
            this.value = mouseX;
        }
        
    }
}