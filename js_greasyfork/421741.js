// ==UserScript==
// @name         Bubble.am macro
// @namespace    https://discord.gg/p56aQHNU9U
// @version      1.1
// @description  shift - autosplit | 1,2,3,4,5 - splits | qasd - movement
// @author       enderror
// @match        *://bubble.am/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421741/Bubbleam%20macro.user.js
// @updateURL https://update.greasyfork.org/scripts/421741/Bubbleam%20macro.meta.js
// ==/UserScript==

let splitInterval = null;
let splitSwitch = false;
const keys = {
    q: false,
    a: false,
    s: false,
    d: false
}

function split(times) {
	for(let i = 0; i < times; i++) {
		setTimeout(function() {
			$("body").trigger($.Event("keydown", { keyCode: 32 }));
			$("body").trigger($.Event("keyup", { keyCode: 32 }));
		}, 50 * i);
	}
}

function goTo(x, y) {
	x = window.innerWidth / x; y = window.innerHeight / y;
	$("canvas").trigger($.Event("mousemove", {clientX: x, clientY: y}));
}

function keydown(e) {
    const chat = document.querySelector("#chat_textbox");
    if(chat === document.activeElement) return;

    const key = e.key.toString().toLowerCase();

	if(keys.hasOwnProperty(key)) {
		keys[key] = true;
	}
    
    switch(key) {
        case "shift":
            if(splitSwitch) break;

            splitSwitch = true;
            splitInterval = setInterval(() => {
                $("body").trigger($.Event("keydown", { keyCode: 32 }));
                $("body").trigger($.Event("keyup", { keyCode: 32 }));
            }, 4);
            break;
        
        case "1":
            split(1);
            break;

        case "2":
            split(2);
            break;

        case "3":
            split(3);
            break;

        case "4":
            split(4);
            break;

        case "5":
            split(5);
            break;

        case "q":
            goTo(3, -0);
            break;
        
        case "a":
            goTo(-0, 8);
            break;
            
        case "s":
            goTo(2, 0.6);
            break;

        case "d":
            goTo(0, 5);
            break;
    }

    switch(true) {
        case keys["a"] && keys["q"]:
            goTo(-0, -0);
            break;

        case keys["a"] && keys["s"]:
            goTo(-0, 0);
            break;

        case keys["q"] && keys["d"]:
            goTo(0, -0);
            break;

        case keys["s"] && keys["d"]:
            goTo(0, 0);
            break;
    }
}

function keyup(e) {
    const chat = document.querySelector("#chat_textbox");
    if(chat === document.activeElement) return;

    const key = e.key.toString().toLowerCase();

	if(keys.hasOwnProperty(key)) {
		keys[key] = false;
	}

    switch(key) {
        case "shift":
            clearInterval(splitInterval);
            splitSwitch = false;
            break;
    }
}

document.addEventListener("keydown", keydown);
document.addEventListener("keyup", keyup);

console.log("Created by DD7");