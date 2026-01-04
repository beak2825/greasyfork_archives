// ==UserScript==
// @name         Town Star - Mező Foglaló
// @namespace    http://tampermonkey.net/
// @description  Automatikusan lép be a szerverre, zárja be a MOTD üzenetet, választja ki a mezőt/mezőket (opcionális) és foglalja el a várost a megadott névvel.
// @version      1.03
// @author       -Devvie-#6050
// @match        https://townstar.sandbox-games.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gala.games
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456521/Town%20Star%20-%20Mez%C5%91%20Foglal%C3%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/456521/Town%20Star%20-%20Mez%C5%91%20Foglal%C3%B3.meta.js
// ==/UserScript==



const town_name = "Player Name | KAG"; 	// város neve
const auto_click = 1;					// 1 = automatikusan kattint; 0 = csak kizoomolás és foglalás
const delay = 100;						// érdemes növelni lassab gép esetén
const delay2 = 7000;						// érdemes növelni lassab gép esetén
const test_mode = true                 // false = alapértelmezett; true = nem fogadja el a mezőt kattintás után

// szükséges játék képarány: 16:9 (1.78:1)
// ajánlott játék felbontás: 1256 x 706
const spots = {
	spot_1: {
        coord_X: 141,
        coord_Y: 427
	},
    spot_2: {
        coord_X: 708,
        coord_Y: 652
	},
    spot_3: {
        coord_X: 1128,
        coord_Y: 461
	},
    spot_4: {
        coord_X: 843,
        coord_Y: 596
	}
}



// ====================================================================================

window.canvas;
window.recent_inputs = {};
window.mousemove;
window.popup_timer;

let events = ['mousedown', 'mouseup', 'mousemove', 'mouseover'];
let cd_start = 0;
let cd = 1500;

let timer = setInterval(() => {
	canvas = document.querySelector('#application-canvas');
	console.log(canvas.getContext('2d'));
	if (canvas) {
		console.log('>> CANVAS LOADED');
		clearInterval(timer);
		init();
	} else {
		console.log('>> WAITING FOR CANVAS...');
	}
}, 100);

async function init() {
	setListeners();

	// await waitMouseMove();

	await waitForEl('img#logoImage');

    if (test_mode === true) {
        await waitForEl('button#playButton[style="visibility: visible;"]');
        await sleep(1000);
        document.querySelector('button#playButton[style="visibility: visible;"]').click();
    }

	await waitForGameStart();
	const sTime = new Date();

	window.popup_timer = setInterval(() => {
		const popups = ['div.container.onboarding-confirm-container[style="display: flex;"]', 'div#motd>div>div>div'];
		for (let i = 0; i < popups.length; i++) {
			console.log('>> CHECKING POPUPS...');
			const popup = popups[i];
			let el = document.querySelector(popup);
			if (el) {
				el.querySelector('button.yes').click();
			}
		}
	}, 100);
	
	await sleep(delay);

	for (let i = 0; i < 29; i++) {
		sendScroll(false);
	}
	await sleep(390);
	for (let i = 0; i < 9; i++) {
		sendScroll(true);
	}

	await sleep(delay2);

	if (auto_click) {
		let i = 1
		while (spots['spot_' + i].coord_X) {
			console.log('>>> ' + spots['spot_' + i].coord_X);
			sendClick(spots['spot_' + i].coord_X, spots['spot_' + i].coord_Y);
			console.log('============ ' + spots['spot_' + i].coord_X)
			//await sleep(390)
            await sleep(4000)
			if (document.querySelector('div#confirmLocationTemplate')) {
				break
			}
			i++;
		}
	}
	
	if (test_mode === false) {
		await waitForEl('div#confirmLocationTemplate');
		document.querySelector('div#confirmLocationTemplate').querySelector('button.yes').click();
	}
	
	// alert(`${new Date() - sTime} ms >> ${((new Date() - sTime) / 1000).toFixed(2)} másodperc`);
	
	await waitForEl('div.center.townName');
	document.querySelector('input[placeholder="Enter Name"]').value = town_name;
	
	setTimeout(() => {
		document.querySelector('button[data-callback="townSelection"]').click();
	}, 100);
	
	clearInterval(window.popup_timer)	// temp

}


// ====================================================================================


function setListeners() {
	for (let i = 0; i < events.length; i++) {
		const event_name = events[i];
		canvas.addEventListener(event_name, () => {
			recent_inputs[event_name] = event;
			if (event.type === 'mousemove') {
				if (event.timeStamp - cd_start < cd) { return };
				cd_start = event.timeStamp;
			}
			console.log('>> EVENT: ' + event.type.toUpperCase(), event);

			if (event.type === 'mousedown') {
				console.log(",\nspot_?: {\n\tcoord_X: " + event.clientX + ",\n\tcoord_Y: " + event.clientY + "\n}");
			}
		}); 
	}
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

window.sendClick = (x, y) => {
	const config = {
		bubbles: true,
		button: 0,
		buttons: 1,
		clientX: x,
		clientY: y,
		screenX: x,
		screenY: y + 103
	}

	canvas.dispatchEvent(new MouseEvent("mousedown", config));

	canvas.dispatchEvent(new MouseEvent("mouseup", config));
}

window.sendScroll = (dir) => {
	const evt = new Event('wheel', {bubbles: true});
	evt.deltaY = dir ? -1 : 1;
	
	canvas.dispatchEvent(evt);
}

window.holdClick = (x, y) => {
	const config = {
		bubbles: true,
		button: 0,
		buttons: 1,
		clientX: x,
		clientY: y,
		screenX: x,
		screenY: y + 103,
	}

	canvas.dispatchEvent(new MouseEvent("mousedown", config))
}

function createButton(appendToEl, btnName, onClickFunc) {
	let button = document.createElement("div");
	button.type = "button";
	button.value = btnName;
	button.style.padding = '5px 12px 5px 12px';
	button.style.margin = '10px 10px 10px 10px';
	button.onclick = onClickFunc;
	document.querySelector(appendToEl).appendChild(button);
}

function waitMouseMove() {
	return new Promise(resolve => {
		let timer = setInterval(async () => {
			if (recent_inputs['mousemove']) {
				window.mousemove = recent_inputs['mousemove'];
				clearInterval(timer);
				console.log('>> MOUSEMOVE EVENT SAVED');
				resolve();
			}
		}, 50);
	})
}

function waitForEl(el) {
	return new Promise(resolve => {
		let timer = setInterval(() => {
			if (document.querySelector(el)) {
				clearInterval(timer);
				console.log(`>> ELEMENT WITH SELECTOR "${el.toUpperCase()}" FOUND`);
				resolve();
			}
		}, 50);
	})
}

function waitForGameStart() {
	return new Promise(resolve => {
		let timer = setInterval(() => {
			if (document.querySelector('img#logoImage') === null) {
				clearInterval(timer);
				console.log(`>> GAME STARTED...`);
				resolve();
			}
		}, 50);
	})
}


// ====================================================================================


window.click_test = async () => {
	sendClick(rnd(1400, 1600), rnd(200, 1000));
	await sleep(400);
	sendClick(rnd(1400, 1600), rnd(200, 1000));
	await sleep(400);
	sendClick(rnd(1400, 1600), rnd(200, 1000));
	await sleep(400);
	sendClick(rnd(1400, 1600), rnd(200, 1000));
	await sleep(400);
	sendClick(rnd(1400, 1600), rnd(200, 1000));
	await sleep(400);
}

window.scroll_test = async () => {
	for (let i = 0; i < 6; i++) {
		sendScroll(false);
		await sleep(200);
	}

	await sleep(1200);

	for (let i = 0; i < 10; i++) {
		sendScroll(true);
	}
	
	await sleep(1800);
	
	for (let i = 0; i < 20; i++) {
		sendScroll(false);
	}
	for (let i = 0; i < 3; i++) {
		sendScroll(true);
	}
	
	await sleep(2200);
	for (let i = 0; i < 20; i++) {
		sendScroll(true);
	}
}

window.pan_test = () => {
	canvas.dispatchEvent(new MouseEvent("mousedown", {
		bubbles: true,
		button: 0,
		buttons: 1,
		clientX: 1,
		clientY: 1,
		screenX: 1,
		screenY: 1 + 103
	}))

	canvas.dispatchEvent(mousemove);
}

function rnd(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}
