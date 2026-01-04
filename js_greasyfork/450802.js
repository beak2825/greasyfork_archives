// ==UserScript==
// @name         Shadam's unlag FIXED
// @version      0.0
// @description  THIS IS NOT MY SCRIPT THIS IS JUST A FIXED VERSION OF SHADAM'S (SHADMAN CONTACT ME IF YOU WANT THIS TAKEN DOWN) ORIGINAL: https://greasyfork.org/en/scripts/420008-unlag
// @author       Shädam
// @match        https://diep.io/*
// @grant        none
// @namespace    https://greasyfork.org/users/719520
// @run-at		document-start
// ==/UserScript==
var int = unsafeWindow.setInterval(function() {
	if(unsafeWindow.input != null) {
		unsafeWindow.clearInterval(int);
		onready();
	}
}, 100);
function onready() {
	let ping = false;
	let t;
	let samples = new Array(500);
	let m;
	let h = 0;
	function getMax() {
		let max = 0;
		for(let i = 0; i < 500; ++i) {
			if(samples[i] != null) {
				if(samples[i] > max) {
					max = samples[i];
				}
			} else {
				break;
			}
		}
		m = max;
	}
	function sleep(time) {
		return new Promise(function(resolve) {
			setTimeout(resolve, time);
		});
	}
	unsafeWindow.WebSocket = class extends WebSocket {
		constructor(ip) {
			super(ip);
			if(ip.match(/\.hiss\.io/) != null) {
				samples = new Array(500);
				h = 0;
				ping = false;
				this.send = new Proxy(this.send, {
					apply: function(to, what, args) {
					if(args[0].length == 1) {
						ping = true;
						t = new Date().getTime();
					}
					return to.apply(what, args);
				}
			});
			let a = unsafeWindow.setInterval(function() {
				if(this.onmessage != null) {
					unsafeWindow.clearInterval(a);
					this.onmessage = new Proxy(this.onmessage, {
						apply: function(to, what, args) {
							if(new Uint8Array(args[0].data).length == 1 && ping == true) {
								ping = false;
								samples[h] = new Date().getTime() - t;
								h = (h + 1) % 501;
								getMax();
							}
							return to.apply(what, args);
						}
					});
				}
			}.bind(this), 120);
			}
		}
	}
	unsafeWindow.powSolver = new Proxy(unsafeWindow.powSolver, {
		apply: function(to, what, args) {
			const time = new Date().getTime();
			const f = args[2];
			return to.apply(what, [args[0], args[1], async function(...g) {
				if(args[1] == 17 && 10000 - m * 3 - new Date().getTime() + time > 0) {
					await sleep(10000 - m * 3 - new Date().getTime() + time);
				}
			return f(...g);
			}]);
		}
	});
}