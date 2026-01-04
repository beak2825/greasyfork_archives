// ==UserScript==
// @name         takepoint.io auto play
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  this is stupid lol
// @author       Marliskilla
// @match        https://takepoint.io/
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/414551/takepointio%20auto%20play.user.js
// @updateURL https://update.greasyfork.org/scripts/414551/takepointio%20auto%20play.meta.js
// ==/UserScript==
(function() {
    'use strict';
    setTimeout(function(){Module.enterGame();}, 3000);
/*
    for(var i = 0; i < 100; i++){
        setTimeout(function(){$("#canvas").trigger($.Event("keyup", { keyCode: 83})); $("#canvas").trigger($.Event("keydown", { keyCode: 87}));}, i*20000);
        setTimeout(function(){$("#canvas").trigger($.Event("keyup", { keyCode: 87})); $("#canvas").trigger($.Event("keydown", { keyCode: 83}));}, i*20000 + 10000);
    }

*/
function move(deg){
   // alert(window.getMapStartX());
    switch(deg){
        case 0:
            $("#canvas").trigger($.Event("keydown", {keyCode: 87})); //87 = w
            break;
        case 90:
            $("#canvas").trigger($.Event("keydown", {keyCode: 68})); //68 = d
            break;
        case 180:
            $("#canvas").trigger($.Event("keydown", {keyCode: 83}));//83 = s
            break;
        case 270:
            $("#canvas").trigger($.Event("keydown", {keyCode: 65}));//65 = a
            break;
        case 45:
            $("#canvas").trigger($.Event("keydown", {keyCode: 87}));// w and d
            $("#canvas").trigger($.Event("keydown", {keyCode: 68}));
            break;
        case 135:
            $("#canvas").trigger($.Event("keydown", {keyCode: 68}));// d and s
            $("#canvas").trigger($.Event("keydown", {keyCode: 83}));
            break;
        case 225:
            $("#canvas").trigger($.Event("keydown", {keyCode: 83}));// s and a
            $("#canvas").trigger($.Event("keydown", {keyCode: 65}));
            break;
        case 315:
            $("#canvas").trigger($.Event("keydown", {keyCode: 65}));// a and w
            $("#canvas").trigger($.Event("keydown", {keyCode: 87}));
            break;
        default:
            $("#canvas").trigger($.Event("keyup", {keyCode: 87}));
            $("#canvas").trigger($.Event("keyup", {keyCode: 68}));
            $("#canvas").trigger($.Event("keyup", {keyCode: 83}));
            $("#canvas").trigger($.Event("keyup", {keyCode: 65}));
            $("#canvas").trigger($.Event("keydown", {keyCode: 49}));
            $("#canvas").trigger($.Event("keyup", {keyCode: 49}));
    }
}
    circle(1000, 5000, 100);
    circle2(1000, 5000, 100);
/*
function keydown(event){
    if(event.keyCode == 73){ //i
    circle();
    }
    if(event.keyCode == 84){//t
        setInterval(circle2, 1000);
    }
}
function keyup(){}
*/
function circle(delay, offset, repetitions){
    for(var i = 0; i < repetitions; i++){
        setTimeout(function(){move(); move(0)}, 8*i*delay + offset + 0*delay);
        setTimeout(function(){move(); move(45)}, 8*i*delay + offset + 1*delay);
        setTimeout(function(){move(); move(90)}, 8*i*delay + offset + 2*delay);
        setTimeout(function(){move(); move(135)}, 8*i*delay + offset + 3*delay);
        setTimeout(function(){move(); move(180)}, 8*i*delay + offset + 4*delay);
        setTimeout(function(){move(); move(225)}, 8*i*delay + offset + 5*delay);
        setTimeout(function(){move(); move(270)}, 8*i*delay + offset + 6*delay);
        setTimeout(function(){move(); move(315)}, 8*i*delay + offset + 7*delay);
    }
}

function circle2(delay, offset, repetitions){
    for(var i = 0; i < repetitions; i++){
        setTimeout(function(){shoot(0)}, 8*i*delay + offset + 0*delay);
        setTimeout(function(){shoot(45)}, 8*i*delay + offset + 1*delay);
        setTimeout(function(){shoot(90)}, 8*i*delay + offset + 2*delay);
        setTimeout(function(){shoot(135)}, 8*i*delay + offset + 3*delay);
        setTimeout(function(){shoot(180)}, 8*i*delay + offset + 4*delay);
        setTimeout(function(){shoot(225)}, 8*i*delay + offset + 5*delay);
        setTimeout(function(){shoot(270)}, 8*i*delay + offset + 6*delay);
        setTimeout(function(){shoot(315)}, 8*i*delay + offset + 7*delay);
    }
}


function shoot(deg){
    var xpos;
    var ypos;
    var width = window.innerWidth;
    var height = window.innerHeight;
    $("#canvas").trigger($.Event("mouseup", {clientX: 0, clientY: 0, which: 1}));
    switch(deg){
        case 315:
            xpos = 0;
            ypos = 0;
            break;
        case 0:
            xpos = width / 2;
            ypos = 0;
            break;
        case 45:
            xpos = width;
            ypos = 0;
            break;
        case 90:
            xpos = width;
            ypos = height / 2;
            break;
        case 135:
            xpos = width;
            ypos = height;
            break;
        case 180:
            xpos = width / 2;
            ypos = height;
            break;
        case 225:
            xpos = 0;
            ypos = height;
            break;
        case 270:
            xpos = 0;
            ypos = height / 2;
            break;
        default:
            break;
    }
    $("#canvas").trigger($.Event("mousemove", {clientX: xpos, clientY: ypos}));
    $("#canvas").trigger($.Event("mousedown", {clientX: xpos, clientY: ypos, which: 1}));
    /*
    $("#canvas").trigger($.Event("mousemove", {clientX: xpos, clientY: ypos}));
    '*/
}
})();

