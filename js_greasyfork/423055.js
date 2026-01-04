// ==UserScript==
// @name         Bubleroyal.com macro
// @namespace    https://discord.gg/p56aQHNU9U
// @version      1.0
// @description  shift - autosplit | 1,2,3,4,5 - splits | qasd - movement
// @author       DD7
// @match        *://bubleroyal.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423055/Bubleroyalcom%20macro.user.js
// @updateURL https://update.greasyfork.org/scripts/423055/Bubleroyalcom%20macro.meta.js
// ==/UserScript==
 
let splitInterval = null, splitSwitch = false;

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

		const key = e.key;
		switch(key) {
			case "Shift":
				if(splitSwitch) return;

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
                goTo(2, -0.6);
				break;

			case "a":
				goTo(-0.6, 2);
				break;

			case "s":
                goTo(2, 0.6);
				break;

			case "d":
				goTo(0.6, 2);
				break;
		}
}

function keyup(e) {
    const chat = document.querySelector("#chat_textbox");
    if(chat === document.activeElement) return;

    const key = e.key;
    switch(key) {
        case "Shift":
            clearInterval(splitInterval);
            splitSwitch = false;
            return;
    }
}

document.addEventListener("keydown", keydown);
document.addEventListener("keyup", keyup);

console.log("Created by DD7");