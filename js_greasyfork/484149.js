// ==UserScript==
// @name         Skin, wearable changer, multi for flarex
// @version      2.0
// @description  hello eagle
// @author       agarpolice
// @match        https://flarex.fun/
// @icon         none
// @run-at       document-start
// @grant        unsafeWindow
// @namespace https://greasyfork.org/users/1238627
// @downloadURL https://update.greasyfork.org/scripts/484149/Skin%2C%20wearable%20changer%2C%20multi%20for%20flarex.user.js
// @updateURL https://update.greasyfork.org/scripts/484149/Skin%2C%20wearable%20changer%2C%20multi%20for%20flarex.meta.js
// ==/UserScript==
//to trigger skin changer, press P
	let combo = {
		shield: 'a',//shield anti freeze
		vir: 'q',//virus anti rec
		pellet: '`',//loop pellet press one for enable and press again to turn off
		brshield: '1',//click to trigger, break shield then use virus on opponent
		freezevir: 'd',//shoot frozen virus and anti rec
		portal: 'l',// spam portal and virus
		recsplit: '0'//spam split and recombine
	}
let send, enabled = false,
	interval, interval1, e = false,
	count = 0,
	e1 = false,
	e2 = false,
	e3 = false,
	interval2, interval3, interval4, interval5, mouseInt, spawnInt, x, y, a, b, xds = [x, y],
	skinarr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
	weararr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
	id = {
		portal: 109,
		anti: 110,
		antifreeze: 11,
		freezevir: 114,
		pellet: 100,
		virus: 27,
		shield: 120,
		push: 24,
		rec: 26,
	};

unsafeWindow.sendz = function(e) {
	e = new Uint8Array(e.buffer);
	send(e);
}
unsafeWindow.cht = function(msg) {
	chat(msg)
	post(messages.chat, msg)
}

function idk(e) {
	if (document.getElementById("overlays").style.display != 'block' && document.getElementById("death-screen").style.display != 'block') {
		var t = new DataView(new ArrayBuffer(1));
		t.setUint8(0, e);
		sendz(t);
	}
}

function skin(e) {
	var t = new DataView(new ArrayBuffer(1 + 2 * `${e}`.length));
	t.setUint8(0, 3);
	for (var n = 0; n < `${e}`.length; ++n) {
		t.setUint16(1 + 2 * n, `${e}`.charCodeAt(n), true);
	}
	sendz(t);
}

function wear() {
	let wear = new DataView(new ArrayBuffer(2));
	wear.setUint8(0, 113);
	wear.setUint8(1, e);
	sendz(wear);
}

function spawn(nick) {
	if (!$("#overlays").is(":visible")) {
		$("#prompt").fadeOut(0);
		$("#ds-Dialog").hide();
		$("#grid-bg").hide();
		$("#overlays").fadeIn(0);
	}
	$("#play-btn").click();
}

function sendMouse(x, y) {
	var e = new DataView(new ArrayBuffer(21))
	e.setUint8(0, 16);
	e.setFloat64(1, x, true);
	e.setFloat64(9, y, true);
	e.setUint32(17, 0, true);
	sendz(e);
}

function colorchanger(id) {
	let n = new DataView(new ArrayBuffer(3));
	n.setUint8(0, 112, true);
	n.setUint8(1, id, true);
	sendz(n);
}

function chat(msg) {
	var t = new DataView(new ArrayBuffer(2 + 2 * msg.length));
	var n = 0;
	t.setUint8(n++, 99);
	t.setUint8(n++, 0);
	for (var s = 0; s < msg.length; ++s) {
		t.setUint16(n, msg.charCodeAt(s), true);
		n += 2;
	}
	sendz(t);
}
const delay = (t) => new Promise((resolve) => setTimeout(resolve, t));
const change = () => {
	e1 = !e1;
	if (e1) {
		interval2 = setInterval(() => {
			skin(skinarr[count]);
			count += 1;
			count == skinarr.length ? count = 0 : undefined;
		}, 100)
	} else {
		clearInterval(interval2)
	};
}
const onefs = async (ms1, ms2) => {
	idk(17)
	await delay(0);
	idk(25);
	await delay(60);
	idk(25);
}
const doublefs = async (ms1, ms2) => {
	idk(17);
	await delay(40);
	onefs()
}
const breakshield = () => {
	idk(id.portal);
	setTimeout(() => {
		idk(id.anti);
		idk(id.virus)
	}, 150)
}
const shield = () => {
	idk(id.shield)
	idk(id.antifreeze)
}
const vir = () => {
	idk(id.virus);
	idk(id.anti);
}
const freezevir = () => {
	idk(id.freezevir);
	idk(id.anti);
}
const portal = () => {
	e = !e;
	if (e) {
		interval1 = setInterval(() => {
			idk(id.portal)
		}, 90)
		interval5 = setInterval(() => {
			//idk(id.virus)
		}, 135)
	} else {
		clearInterval(interval1);
		clearInterval(interval5)
	}
}
const push = () => {
	e2 = !e2;
	e2 ? interval3 = setInterval(() => {
		idk(id.push);
	}, 90) : clearInterval(interval3)
}
const pellet = () => {
	enabled = !enabled;
	enabled ? (interval = setInterval(() => {
		idk(id.pellet)
	})) : clearInterval(interval)
}
const recsplit = () => {
	e3 = !e3
	e3 ? interval4 = setInterval(() => {
		idk(id.rec)
		idk(17);
	}, 140) : clearInterval(interval4)
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
window.addEventListener('DOMContentLoaded', function() {
	$("#AccInfo").append(`<input type="checkbox" id="cBlinker">
<label for="cBlinker" style="color: white;">Name color</label>
<input type="number" id="delayInput" placeholder="0" min="0" style="width: 60px; text-align: center;"><br>`);
	let Multibox = document.getElementById('cMultiBox')
	let checkbox = document.getElementById('cBlinker')
	let delayInput = document.getElementById('delayInput')
	let savedDelay = localStorage.getItem("savedDelay");
	savedDelay ? delayInput.value = savedDelay : undefined;
	checkbox.addEventListener("change", function() {
		if (this.checked) {
			const delay = parseInt(document.getElementById("delayInput").value) || 100;
			let flag = false;
			interval = setInterval(async () => {
				flag = !flag;
				await colorchanger(flag ? 1 : 0);
			}, delay);
		} else {
			clearInterval(interval);
		}
	});
	delayInput.addEventListener("input", function() {
		if (checkbox.checked && interval) {
			clearInterval(interval);
			const newDelay = parseInt(this.value) || 100;
			let flag = false;
			interval = setInterval(async () => {
				flag = !flag;
				await colorchanger(flag ? 1 : 0);
			}, newDelay);
			localStorage.setItem("savedDelay", newDelay);
		}
	});
});
window.addEventListener("keydown", e => {
	if (document.activeElement != document.getElementById('chat_textbox')) {
		e.key == combo.shield && shield();
		e.key == combo.vir && vir();
		e.key == combo.pellet && pellet()
		e.key == combo.freezevir && freezevir()
		e.key == combo.portal && portal()
		e.key == combo.recsplit && recsplit()
		e.key == 'u' && push()
		e.key == 'r' && onefs()
		e.key == 'p' && change();
		e.key == 'm' && spawn();
	}
})
window.addEventListener("click", e => {
	if (e.which == 1) {
		breakshield();
	};
})
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
WebSocket.prototype.send = new Proxy(WebSocket.prototype.send, {
	apply(target, thisArg, argArray) {
		send = (...args) => target.call(thisArg, ...args);
		target.apply(thisArg, argArray);
	}
});