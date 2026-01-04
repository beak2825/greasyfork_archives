// ==UserScript==
// @name         Bonk kitten
// @namespace    https://bonk.io/
// @version      0.4
// @description  Adds an cat which wanders around your screen and sometimes tries to make you die
// @author       You
// @match        https://bonk.io/*
// @run-at       document-start
// @grant        none
// @noframes
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bonk.io
// @downloadURL https://update.greasyfork.org/scripts/459494/Bonk%20kitten.user.js
// @updateURL https://update.greasyfork.org/scripts/459494/Bonk%20kitten.meta.js
// ==/UserScript==

function keyEvent (keyCode, type, modifiers) {
    let gdocument = document.getElementById("maingameframe").contentDocument;
	var evtName = (typeof(type) === "string") ? "key" + type : "keydown";
	var modifier = (typeof(modifiers) === "object") ? modifier : {};

	var event = document.createEvent("HTMLEvents");
	event.initEvent(evtName, true, false);
	event.keyCode = keyCode;

	for (var i in modifiers) {
		event[i] = modifiers[i];
	}

	gdocument.dispatchEvent(event);
}

//let SKIN = new Image();
//let CAT = new Image();
//SKIN.src = 'https://bonkclans.itsdawildshadow.repl.co/file/keyboard.png';
//CAT.src = 'https://bonkclans.itsdawildshadow.repl.co/file/cat.png';
//console.log(SKIN);
// TEMPORARY SOLUTION!
let mouse = {
 x: 0,
 y: 0,
 lx: 0,
 ly: 0,
 vx: 0,
 vy: 0,
 drag: false
}
let canvas = document.createElement("canvas");

canvas.style.width = window.innerWidth+"px";
canvas.style.position = 'fixed';
canvas.style.height = window.innerHeight+"px";
canvas.style.left = "0px";
canvas.style.top = "0px";
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.zIndex = 10;
canvas.style.pointerEvents = "none";
setTimeout(() => {
document.body.appendChild(canvas);
},4000);
let cvt = canvas.getContext("2d");

let assistent = {
    x: 0,
    y: 0,
    vy: 0,
    vx: 0,
    mode: "idle",
    right: false,
    left: false,
    jump: false
}

let lastCall = Date.now();
let decision = 1;
let randomInput = 0;
let lastInput = [0,0,0,0];
let lasterInput = [0,0,0,0];
let wander = 1;

let lastScroll = 0;

window.onscroll = function (e)
{
    assistent.y += lastScroll-(document.documentElement.scrollTop || document.body.scrollTop);
    if (assistent.y > canvas.height-50){
        assistent.vy = ((document.documentElement.scrollTop || document.body.scrollTop)-lastScroll)*3;
        assistent.y = canvas.height-50;
    }
        if (assistent.y < 50){
        assistent.vy = (lastScroll-(document.documentElement.scrollTop || document.body.scrollTop))*3;
        assistent.y = 50;
    }
    lastScroll = document.documentElement.scrollTop || document.body.scrollTop
}

window.addEventListener("resize", (event) => {
canvas.style.width = window.innerWidth+"px";
canvas.style.position = 'fixed';
canvas.style.height = window.innerHeight+"px";
canvas.style.left = "0px";
canvas.style.top = "0px";
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
});

setInterval(() => {
    let dt = (Date.now()-lastCall)/1000;
    mouse.vx = (mouse.x-mouse.lx)/dt;
    mouse.vy = (mouse.y-mouse.ly)/dt;
    if (mouse.drag){
     assistent.x = mouse.x;
     assistent.y = mouse.y;
     assistent.vx = mouse.vx/3;
     assistent.vy = mouse.vy/3;
    }
    lastCall = Date.now();
    decision -= dt;
    if (decision <= 0){
     decision = Math.random()*6;
         let mode = Math.floor(Math.random()*5);
    if (mode <= 3){
    assistent.mode = 'type';
    }
        if (mode == 4){
    assistent.mode = 'wander';
    }
        if (mode == 5){
    assistent.mode = 'idle';
    }
    }
    if (assistent.mode == "wander"){
          decision += dt/2;
          wander -= dt;
    if (wander <= 0){
     wander = (Math.random()*3);
     if (Math.random()*3 <= 1){
         assistent.left = true;
         assistent.right = false;
     }else if (Math.random()*3 <= 1){
         assistent.right = true;
         assistent.left = false;
     }else{
         assistent.right = false;
          assistent.left = false;
     }
    }
    }
    cvt.clearRect(0,0,canvas.width,canvas.height);
    cvt.fillStyle = 'white';
    cvt.beginPath();
    cvt.arc(assistent.x,assistent.y,25,0,Math.PI*2);
    cvt.fill();
    cvt.closePath();
    //if (CAT.complete){
     //cvt.drawImage(CAT,assistent.x-25,assistent.y-25,50,50);
    //}
    if (assistent.mode == 'type'){
        decision -= dt*1.5
        //cvt.drawImage(SKIN,assistent.x-60,assistent.y-20,120,60)
        if (randomInput <= 0){
            randomInput = Math.random()*2;
            lastInput = [Math.floor(Math.random()*3)-1,Math.floor(Math.random()*3)-1,Math.floor(Math.random()*3)-1,Math.floor(Math.random()*3)-1]
        }
        randomInput -= dt;
        if (lasterInput !== lastInput){
        if (lastInput[1] > 0){
         keyEvent(68);
         keyEvent(65,'up');
        }else if (lastInput[1] < 0){
         keyEvent(68,'up');
         keyEvent(65);
        }else{
         keyEvent(68,'up');
         keyEvent(65,'up');
        }
                if (lastInput[1] > 0){
         keyEvent(87);
         keyEvent(83,'up');
        }else if (lastInput[1] < 0){
         keyEvent(87,'up');
         keyEvent(83);
        }else{
         keyEvent(83,'up');
         keyEvent(87,'up');
        }
       if (lastInput[2] > 0){
         keyEvent(32);
        }else{
         keyEvent(32,'up');
        }
               if (lastInput[3] > 0){
         keyEvent(90);
        }else{
         keyEvent(90,'up');
        }
         lasterInput = lastInput;
        }
    }

    assistent.vy += 200*dt;
    assistent.y += assistent.vy*dt;
    if (assistent.right){
     assistent.vx += 30*dt;
    }else if (assistent.left){
     assistent.vx -= 30*dt;
    }else{
     assistent.vx *= 0.99;
    }
    assistent.x += assistent.vx*dt;
    if (assistent.x < 25){
     assistent.x = 25;
     assistent.vx *= -0.9;
    }
    if (assistent.x > canvas.width-25){
     assistent.x = canvas.width-25;
     assistent.vx *= -0.9;
    }
    if (assistent.y > canvas.height-30){
    assistent.y = canvas.height-30;
    assistent.vy *= -0.6
    }
        if (assistent.y < 50){
    assistent.y = 50;
    assistent.vy *= -0.6
    }
},0);