// ==UserScript==
// @name         Surviv.io my custom input replay recorder
// @namespace    https://github.com/notKaiAnderson/
// @version      1.0.5
// @description  Records lightweight game recordings, which can be reviewed with any custom mods applied
// @author       garlic
// @match        *://snake.io/
// @match        *://surviv.io/*
// @match        *://surviv2.io/*
// @match        *://2dbattleroyale.com/*
// @match        *://2dbattleroyale.org/*
// @match        *://piearesquared.info/*
// @match        *://thecircleisclosing.com/*
// @match        *://archimedesofsyracuse.info/*
// @match        *://secantsecant.com/*
// @match        *://parmainitiative.com/*
// @match        *://nevelskoygroup.com/*
// @match        *://kugahi.com/*
// @match        *://chandlertallowmd.com/*
// @match        *://ot38.club/*
// @match        *://kugaheavyindustry.com/*
// @match        *://drchandlertallow.com/*
// @match        *://rarepotato.com/*
// @grant        none
// @icon         https://i.imgur.com/jgHdTYA.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448606/Survivio%20my%20custom%20input%20replay%20recorder.user.js
// @updateURL https://update.greasyfork.org/scripts/448606/Survivio%20my%20custom%20input%20replay%20recorder.meta.js
// ==/UserScript==

/*** contributors
 * garlic
 * samer kizi
 * preacher
 ***/
var left = document.querySelector('#modal-how-to-play');
left.innerHTML = `<div class="frog">
    <div class="modal-header" style="display: none;">>
`;

var survivharplayerconfig = { silly1: false };
var ifsurviv = false;
if (window.zzpseudoalert && window.log) {
	window.zzpseudoalert("already active");
	return;
}
try {
	document.getElementsByClassName("ftue-header")[0].style.display =
		"none";
	document.getElementsByClassName("ftue-body")[0].style.display = "none";
	ifsurviv = true;
} catch (e) {}
window.zzpseudoalert = function (e) {
	var x = document.createElement("div");
	x.style =
		"display:none;zIndex:255;position:fixed;left:50%;width:40%;top:20%;height:fit-content;background-color:rgba(0,0,0,.5);color:#e4d338;text-align:center;border-radius:10px;padding:10px 20px;-webkit-transform: translate(-50%, -50%);transform: translate(-50%, -50%);";
	x.innerHTML = e;
	document.body.append(x);
	x.style.fontSize = "20px";
	x.animate([{ opacity: "1" }, { opacity: "0" }], { duration: 3000 });
	setTimeout(() => document.body.removeChild(x), 3000);
};
window.zzpseudoalert.small = function (e) {
	var x = document.createElement("div");
	x.style =
		"display:none;zIndex:255;position:fixed;left:50%;width:40%;top:20%;height:fit-content;background-color:rgba(0,0,0,.5);color:#e4d338;text-align:center;border-radius:10px;padding:10px 20px;-webkit-transform: translate(-50%, -50%);transform: translate(-50%, -50%);";
	x.innerHTML = e;
	document.body.append(x);
	x.style.fontSize = "20px";
	x.animate([{ opacity: "1" }, { opacity: "0" }], { duration: 3000 });
	setTimeout(() => document.body.removeChild(x), 3000);
};
zzpseudoalert("wsrapper init");

function arrayBufferToBase64(buffer) {
	let binary = "";
	let bytes = new Uint8Array(buffer);
	let len = bytes.byteLength;
	for (let i = 0; i < len; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return window.btoa(binary);
}
window.logentries = [];
window.log = {
	log: {
		version: "1.2",
		creator: {
			name: "wswrapperallium",
			version: "0.0031",
		},
		entries: window.logentries,
	},
};

var lastgameforunlink;

class RecordingWebSocket extends WebSocket {
	constructor(...args) {
		super(...args);
	}

	unlinkfromclient() {
		if (this.readyState != this.OPEN) return false;

		let seq = 0;
		let wso = this.__lientry._webSocketMessages;

		for (let i = wso.length - 1; i >= 0; i--) {
			if (wso[i].type == "send") {
				let msgab = from_base64s_ab(wso[i].data);
				let msgbytes = new Uint8Array(msgab);
				if (msgbytes[0] == 3) {
					seq = msgbytes[1];
					break;
				}
			}
		}

		var oldsend = this.send;
		Object.defineProperty(this, "send", {
			configurable: true,
			get: function () {
				return () => {};
			},
			set: function () {},
		});
		Object.defineProperty(this, "close", {
			configurable: true,
			get: function () {
				return () => {};
			},
			set: function () {},
		});

		var thisArg = this;
		function keepAlive() {
			seq = (seq + 1) & 255;
			let a;

			if (window.spectatepinginsteadofinput) {
				a = new Uint8Array(4);
				("C90bAA==");
				a[0] = 11;
				a[1] = 0;
				a[2] = 0;
				a[3] = 2;
			} else {
				a = new Uint8Array(9);

				a[0] = 3;
				a[1] = seq;
				a[3] = 255;
				a[4] = 3;
				a[5] = 8;
			}
			oldsend.apply(thisArg, [a]);
			console.info("tick", seq);
		}

		var keepAliveIt = setInterval(() => keepAlive(), 1017);
		console.info("unlink toggled", seq);
		this.onerror = () => {};
		this.onclose();
		this.onclose = () => {
			clearInterval(keepAliveIt);
			console.info("unlinked conn closed");
		};
		this.__spy_onmessage = () => {};
		return true;
	}

	send(...args) {
		let thisArg = this;
		let e = args[0];
		if (thisArg.__lientry == undefined) {
			thisArg.__lientry = {
				startedTime: new Date().toISOString(),
				time: 0,
				request: {
					method: "GET",
					url: thisArg.url,
				},
				_webSocketMessages: [],
			};
			if (ifsurviv) {
				thisArg.__lientry.__survivio = {};
				thisArg.onEach = function () {};
				if (thisArg.url.includes("/play?game")) lastgameforunlink = thisArg;
			}

			window.logentries.push(thisArg.__lientry);
			let wsa = thisArg.__lientry._webSocketMessages;
			let tos = /*thisArg.__lientry.time.toString=  */ () => {
				let t1 = 0;
				if (wsa.length > 1) {
					t1 = wsa.slice(-1)[0].time - wsa[0].time;
				}
				return t1 + "";
			};
			thisArg.__lientry.time = {
				toString: tos,
			};
			zzpseudoalert(thisArg.url.replace("wss://", "").replace("/", "<p>"));
			thisArg.__spy_onmessage = thisArg.onmessage;
			let recvHandler = function (...args) {
				let e = args[0];
				{
					let temp = {
						type: "receive",
						time: new Date().getTime() / 1e3,
						opcode: 2,
					};
					this.__lientry._webSocketMessages.push(temp);
					if (typeof e.data !== "string") {
						temp.opcode = 2;
						new Response(e.data)
							.arrayBuffer()
							.then((ifAblob) => (temp.data = arrayBufferToBase64(ifAblob)));
					} else {
						temp.opcode = 1;
						temp.message = e.data;
					}
					return this.__spy_onmessage.apply(this, args);
				}
			};
			thisArg.onmessage = recvHandler;
		}
		let temp = {
			type: "send",
			time: new Date().getTime() / 1e3,
			opcode: 2,
		};
		thisArg.__lientry._webSocketMessages.push(temp);
		if (typeof e !== "string") {
			temp.opcode = 2;
			temp.data = arrayBufferToBase64(e);
		} else {
			temp.opcode = 1;
			temp.message = e;
		}
		return super.send(...args);
	}
}
RecordingWebSocket.unlink = function () {
	let msg = "";
	if (lastgameforunlink) {
		if (lastgameforunlink.unlinkfromclient()) msg = "unlink function activated";
		else msg = "unlink function not activated";
	} else msg = "nothing";
	window.zzpseudoalert(msg);
};

window.WebSocket = RecordingWebSocket;

void "surviv .har repeat script. new103. open up at surviv.io, load .har file. f1f2f3f6 -- change replay speed";
{
	let cconsole = console.log;
	Object.defineProperty(console, "log", {
		configurable: true,
		get: function () {
			return cconsole;
		},
		set: function (e) {},
	});
}
(function () {
	"use strict";
	let cycle = (x) => (x == false ? undefined : x == undefined);
	let cycle2 = (x, y, z) => (x == y ? z : y);
	const keys = ["1", "2", "3", "4", "6", "7", "8", "9", "10"];
	const disableKey = (key) => keys.push(key);
	["keypress", "keydown", "keyup"].forEach((type) => {
		document.addEventListener(type, (e) => {
			if (keys.indexOf(e.key) !== -1) {
				if (e.type == "keydown") {
					if (e.key == "1") window.slowmo = 1;
					if (e.key == "2") window.slowmo = 2;
					if (e.key == "3") window.slowmo = 3;
					if (e.key == "4") window.slowmo = 4;
					if (e.key == "5") window.slowmo = 5;
					if (e.key == "6") window.slowmo = 6;
					if (e.key == "7") window.slowmo = 7;
					if (e.key == "8") window.slowmo = 8;
					if (e.key == "9") window.slowmo = 9;
                    if (e.key == "0") window.slowmo = 0;
					window.slowmor = window.slowmo;
				}
				return e.preventDefault();
			}
		});
	});
})();

window.slowmo = 1;
window.harRead = {
	files: [],
	games: {},
	alert: window.alert.bind(window),
	ui: { window: window },
};
window.foo = function () {
	function unlinkfromUI() {
		RecordingWebSocket.unlink();
	}

	function tabuntab() {
		if (!xpassblock) return;
		if (document.getElementById("missions-name").style.display === "block") {
			document.getElementById("missions-name").style = "display:block";
			document.getElementById("modal-how-to-play").style = "display:none";
		} else {
			document.getElementById("missions-name").style = "display:block";
			document.getElementById("pass-quest-wrapper").style = "display:block";
		}
		if (x.parentElement.id == "modal-how-to-play") {
			window.zzpseudoalert("FUG");
			x.otherwindow = window.open("", "", "height=250,width=300");
			x.otherwindow.document.body.append(x);
			window.harRead.ui.window = x.otherwindow;
		} else {
			xpassblock.insertBefore(x, xpassblock.firstElementChild);
			window.harRead.ui.window = window;
			x.otherwindow.close();
		}
	}

	function saveharlog() {
		0,
			(function (filename, data) {
				try {
					var blob = new Blob([data], { type: "text/plain" });
				} catch (e) {
					alert("whoops, doesnt work");
				}

				if (window.navigator.msSaveOrOpenBlob) {
					window.navigator.msSaveBlob(blob, filename);
				} else {
					var elem = window.document.createElement("a");
					elem.href = window.URL.createObjectURL(blob);
					elem.download = filename;
					document.body.appendChild(elem);
					elem.click();
					document.body.removeChild(elem);
				}
			})(
				document.location.host +
					new Date().toISOString().slice(0, 10) +
					Date.now() +
					".har",
				JSON.stringify(log)
			);
	}

    function disableAutoFill() {
        if(survivharplayerconfig.disableAutoFill) {
            if(survivharplayerconfig.xmlovr) return;
            survivharplayerconfig.xmlovr=true;
            let oldsend=XMLHttpRequest.prototype.send;
            XMLHttpRequest.prototype.send = function (...args){
                if(survivharplayerconfig.disableAutoFill
                   && typeof args[0]=="string"
                   && args[0].startsWith('{"version":') ) {
                    args[0]=args[0].replace('"autoFill":true','"autoFill":false');
                }
                return oldsend.apply(this,args);
            };
        }
    }

	function selmodech(tt, event, ename) {
		if (ename == "change") {
			if (tt.value == "Tab/untab") {
				('prompt("wha")');
			}
			if (tt.selectedIndex == 5) {
				saveharlog();
				tt.selectedIndex = tt.prevselectedIndex;
				return;
			}
			if (tt.selectedIndex == 6) {
				if (
					(survivharplayerconfig.silly1 = !survivharplayerconfig.silly1) ===
					false
				) {
					dosomething_with_send_disable();
					window.zzpseudoalert("silly pseudo 3d is now: DISABLED");
				} else {
					window.zzpseudoalert("silly pseudo 3d is now: ENABLED");
				}
				tt.selectedIndex = tt.prevselectedIndex;
                return;
			}
            if(tt.selectedIndex == 7) {
				if (
					(survivharplayerconfig.disableAutoFill = !survivharplayerconfig.disableAutoFill) ===
					false
				) {
					disableAutoFill();
					window.zzpseudoalert("no autofill override: DISABLED");
				} else {
					disableAutoFill();
					window.zzpseudoalert("no autofill override: ENABLED");
				}
				tt.selectedIndex = tt.prevselectedIndex;
                return;
            }
			tt.prevselectedIndex = tt.selectedIndex;
			if (tt.selectedIndex == 0) {
				if (window.WebSocket.name == "ReplayWebSocket")
					window.WebSocket = RecordingWebSocket;
			} else {
				if (window.WebSocket.name == "RecordingWebSocket")
					window.WebSocket = ReplayWebSocket;
			}
			if (tt.selectedIndex == 1) {
				applyParsedHarFile(log);
			}
			if (tt.value == "Replay from prompt") {
				let pp = window.harRead.ui.window.prompt(
					"input har file, or http/file address"
				);
				let done = false;
				if (
					pp.startsWith("file://") ||
					pp.startsWith("http") ||
					!pp.startsWith('{"log"')
				) {
					window.zzpseudoalert("trying to fetch file");
					fetch(pp)
						.then((r) => r.json())
						.then((e) => applyParsedHarFile(e));
				} else doa(pp);
				function doa(pp) {
					if (pp.startsWith('{"log"')) {
						try {
							let yi = JSON.parse(pp);
							applyParsedHarFile(yi);
						} catch (e) {
							window.zzpseudoalert("could not read/parse... failed");
						}
					}
				}
			}
		}
	}

	var xpassblock = document.getElementById("modal-how-to-play");
	("var ifsurviv=true");
	var xwin, x;
	if (!xpassblock) {
		xwin = window.open("", "");
		x = xwin.document.createElement("div");
		xwin.document.body.append(x);
		("ifsurviv=false");
	} else {
		x = document.createElement("div");
		xpassblock.insertBefore(x, xpassblock.firstElementChild);
	}

	var mn = document.createElement("div");
	mn.style = "display:inline-flex;width:100%";
	x.insertBefore(mn, x.firstElementChild);

	var tt = document.createElement("select");
	tt.id = "modepl";
	tt.style = `
      background: rgb(122, 122, 122);
      box-shadow: rgb(62 62 62) 0px -3px inset;
      color: rgb(255, 255, 255);
      cursor: pointer;
      width: 100%;
      border: none;
      border-radius: 5px;
      font-size: 18px;
      padding: 10px 20px;
      text-align: center;
    `;
	tt.innerHTML =
		"<option>Record</option><option>Replay recent</option><option>Replay from file</option><option>Replay from prompt</option><option>Tab/untab</option><option>save har log</option><option>silly 3d toggle</option><option>disable autofill toggle</option>";
	let captt = tt;
	tt.onchange = (e) => selmodech(captt, e, "change");
	tt.onclick = (e) => selmodech(captt, e, "click");
	x.appendChild(tt);

	var tt = document.createElement("button");
	tt.style = `
      background-image: url(https://surviv.io/img/gui/link.svg);
      background-size: 27px;
      background-repeat: no-repeat;
      background-position: center 42%;
      width: 100%;
      height: 45px;
      background-color: #cd3232;
      box-shadow: #781e0a 0px -4px inset;
      color: #fff;
      cursor: pointer;
      text-shadow: rgb(0 0 0 / 25%) 0px 1px 2px;
      border: none;
      border-radius: 5px;
      font-size: 18px;
      margin: 0 3px 0 0;
    `;
	tt.onclick = tabuntab;
	mn.appendChild(tt);

	var tt = document.createElement("button");
	tt.innerHTML = "unlink & record";
	tt.style = `
      height: 45px;
      background-color: rgb(205, 50, 50);
      box-shadow: rgb(120 30 10) 0px -4px inset;
      color: rgb(255, 255, 255);
      cursor: pointer;
      text-shadow: rgb(0 0 0 / 25%) 0px 1px 2px;
      border: none;
      border-radius: 5px;
      font-size: 18px;
      width:300%;
    `;
	tt.onclick = unlinkfromUI;
	mn.appendChild(tt);

	var tt = document.createElement("select");
	tt.id = "xyz";
	window.harRead.ui.matchSelectorComboBox = tt;
	tt.style =
		"background: rgb(122, 122, 122); box-shadow: rgb(62, 62, 62) 0px -2px inset; color: rgb(255, 255, 255); cursor: pointer; width: 100%; border: none; border-radius: 5px; font-size: 18px; padding: 5px 20px; margin: 5px 0px;";
	tt.style = `
      width: 100%;
      height: 45px;
      background-color: #7a7a7a;
      box-shadow: #3e3e3e 0px -4px inset;
      color: #fff;
      cursor: pointer;
      text-shadow: rgb(0 0 0 / 25%) 0px 1px 2px;
      border: none;
      border-radius: 5px;
      font-size: 18px;
      margin: 3px 0 3px 0;
    `;
	x.appendChild(tt);
	var t = document.createElement("input");
	t.type = "file";
	t.style = `
      position: absolute;
      margin: 62px 0 0 -126px;
      opacity: 0;
      cursor: pointer;
      transform: scale(2);
    `;
	t.multiple = true;
	t.accept = ".har";
	t.id = "ssk";
	x.appendChild(t);
	if (ifsurviv) {
		document.getElementById("missions-name").style = "display:none";
		document.getElementById("pass-quest-wrapper").style = "display:none";
	}
	var skk = document.createElement("button");
	skk.id = "skk";
	skk.onclick = function () {
		document.getElementById("ssk").click();
	};
	skk.innerHTML = "Choose file";
	skk.style =
		"background: rgb(30, 144, 255);box-shadow: rgb(24, 113, 200) 0px -5px inset;color: rgb(255, 255, 255);cursor: pointer;text-shadow: rgba(0, 0, 0, 0.25) 0px 1px 2px;font-weight: 700;width: 100%;border: none;border-radius: 5px;padding: 12px 20px;font-size: 18px;";
	x.appendChild(skk);
	tt.onchange = function () {
		harRead.selected = tt.value;
	};

	let applySVGtext = function (nam, jo) {
		let ii = nam.indexOf("---");
		if (ii >= 0) nam = nam.slice(0, ii);
		let blob1 = new Blob([jo], {
			type: "image/svg+xml",
		});
		let url1 = URL.createObjectURL(blob1);
		nam = nam.replace(".svg", ".img");
		PIXI.utils.TextureCache[nam] = PIXI.Texture.fromImage(
			url1,
			undefined,
			undefined,
			2
		);
	};
	let applyParsedHarFile = function (jo) {
		window.harRead.games = {};

		window.harRead.files.push(jo);
		tt.innerHTML = "";
		if (1) {
			var ectr = 0;
			jo.log.entries.forEach((x) => {
				if (x.request.url.slice(0, 2) == "ws") {
					if (x._webSocketMessages.length < 2) return;
					var time =
						x._webSocketMessages.slice(-1)[0].time -
						x._webSocketMessages[0].time;
					time =
						((time / 60) | 0) +
						":" +
						String((time | 0) % 60).padStart(2, "0") +
						" ";
					console.log(time, x._webSocketMessages.length, x.request.url);
					var ww = x.request.url;
					var w0 = ww.lastIndexOf("=");
					var wi = ww.lastIndexOf("=");

					if (w0 >= 0 || wi >= 0 || ww.includes(".snake.io:9092")) {
						var output = time;
						if (w0 >= 0 || wi >= 0)
							output += " " + ww.slice(6, 6 + 9) + ww.slice(wi);
						var qi = document.createElement("option");
						qi.value = ectr;
						qi.innerHTML = output + "";
						tt.appendChild(qi);
						harRead.games[ectr] = x;
					}
				}
				ectr += 1;
			});
		}
	};
	t.onchange = function handleFileSelect1(evt) {
		var filesreset = false;
		tt.innerHTML = "<option>loading...</option>";
		var files = evt.target.files;
		var output = [];
		for (var i = 0, f; (f = files[i]); i++) {
			if (f.name.slice(-4) == ".har" && !filesreset) {
				window.harRead.files = [];
				window.harRead.games = {};
				filesreset = true;
			}
			var fr = new FileReader();
			harRead.files.push(f);
			if (f.name.slice(-4) == ".har")
				fr.onload = function (evt) {
					if (evt.loaded == evt.total) {
						tt.innerHTML = "<option>parsing...</option>";
						try {
							var jo = JSON.parse(evt.currentTarget.result);
						} catch (e) {
							harRead.alert(
								"This file is not a valid .har file, or gabled/truncated"
							);
						}
						applyParsedHarFile(jo);
					}
				};
			else if (f.name.slice(-4) == ".svg") {
				let fname_temp = f.name;
				fr.onload = function (evt) {
					if (evt.loaded == evt.total) {
						applySVGtext(fname_temp, evt.currentTarget.result);
					}
				};
			} else
				harRead.alert(
					"I do not know what to do with " +
						f.name +
						"\nI expect .har or .svg files"
				);
			fr.readAsText(f);
		}
		console.log(output);
	};
};
if (document.readyState === "complete" || document.readyState === "interactive")
	foo();
else window.addEventListener("DOMContentLoaded", foo);

function dosomething_with_send_disable() {
	cvs.style.transform = "";
}

function dosomething_with_send(e) {
	if (survivharplayerconfig.silly1 != true) return;

	let survivOneEps = 1.0001;
	function delerpOne10(e) {
		return (-1 + 2 * (e / 1023)) * survivOneEps;
	}

	let x = from_base64s(e);
	console.info(x);
	try {
		let i = 3 + 3 * !!(x[2] & 0x80);
		let xdiv, ydiv;
		xdiv = x[i] + (x[i + 1] & 3) * 256;
		ydiv = (x[i + 1] >> 2) + (x[i + 2] & 15) * 64;
		xdiv = delerpOne10(xdiv);
		ydiv = delerpOne10(ydiv);

		let az = Math.atan2(xdiv, ydiv);
		let cs = Math.cos(az);
		let sn = Math.sin(az);
		let pz = 0.9;
		let cz = Math.cos(pz);
		let zn = Math.sin(pz);
		cvs.style.transform = `perspective(800px) matrix3d(${cs}, ${-sn * cz}, ${
			-sn * zn
		}, 0,  ${sn}, ${cs * cz}, ${
			cs * zn
		}, 0, 0, ${-zn}, ${cz}, 0, 0, 0, 0  , 1)`;
	} catch (e) {
		console.error(e);
	}
}

function from_base64s(base64) {
	var raw = atob(base64);
	var rawLength = raw.length;
	var array = new Uint8Array(new ArrayBuffer(rawLength));
	for (let i = 0; i < rawLength; i++) {
		array[i] = raw.charCodeAt(i);
	}
	return array;
}

function from_base64s_ab(base64) {
	var raw = atob(base64);
	var rawLength = raw.length;
	var arrayb = new ArrayBuffer(rawLength);
	var array = new Uint8Array(arrayb);
	for (let i = 0; i < rawLength; i++) {
		array[i] = raw.charCodeAt(i);
	}
	return arrayb;
}
if (1 && "weboverload") {
	("var RecordingWebSocket");
	var oldWebSocket = window.WebSocket;
	var ReplayWebSocket = function (a) {
		console.info("ws creating:", a);
		if (a) a = a.replace("wss://", "ws://");
		this.sndwo = 0;
		if (a.indexOf("-p1.surviv.io") >= 0) {
			this.binaryType = "blob";
			this.stupidsum = this.static_counter + 4;
			this.static_counter = (this.static_counter + 3) % 19;
			this.url = a;
			this.__type = "echo";
			setTimeout(() => this.__onopen(), 100);
		} else if (a.includes("?gameId=") || a.includes(".snake.io:9092")) {
			this.__type = "game";
			this.wsh = harRead.games[window.harRead.ui.matchSelectorComboBox.value];
			this.wso = this.wsh["_webSocketMessages"];
			this.wslen = this.wso.length;
			this.wsi = 0;
			this.binaryType = "blob";
			this.url = a;
			setTimeout(() => this.__onopen(), 100);
		}
	};
	ReplayWebSocket.name = "ReplayWebSocket";
	ReplayWebSocket.prototype = {
		OPEN: 1,
		CLOSED: 3,
		static_counter: 10,
		__onopen: function () {
			this.readyState = this.OPEN;
			this.onopen && this.onopen();
		},
		__onclose: function () {
			this.readyState = this.CLOSED;
			this.onclose && this.onclose();
		},
		__onmessage: function () {
			if (this.readyState != this.OPEN) return;
			this.onmessage &&
				this.onmessage({
					data: new Uint8Array(1),
				});
		},
		__onharmessage: function (e) {
			if (this.readyState != this.OPEN || !this.onmessage) return;
			try {
				this.onmessage(this.wsmsg);
			} catch (e) {
				console.error("onharmessage error");
				console.error(this.wsi);
				console.error(this.wsmsg);
				console.error(e);
			}
			if (this.nextmsg()) {
			} else "todo:close";
		},
		nextmsg: function () {
			while (++this.wsi < this.wslen) {
				if (this.wso[this.wsi].type == "receive") break;
				else if (this.wso[this.wsi].type == "send") {
					dosomething_with_send(this.wso[this.wsi].data);
				}
			}
			if (this.wsi >= this.wslen) return false;
			var a1 = this.wso[this.wsi];
			var datat = a1.data;
			this.wsmsg = {
				data: from_base64s_ab(datat),
			};
			time =
				this.wso[this.wsi].time * 1000 +
				this.__timediff -
				new Date().getTime() * slowmo;
			if (time < -1000 || time > 4000) {
				this.__timediff =
					30 - this.wso[this.wsi].time * 1000 + new Date().getTime() * slowmo;
				time = 30;
			}
			if (time > 1) setTimeout(() => this.__onharmessage(), time);
			else this.__onharmessage();
			return true;
		},
		send: function (a) {
			this.sndwo = 0;
			if (this.__type == "echo")
				setTimeout(() => this.__onmessage(), this.stupidsum);
			if (this.__type == "game")
				if (this.__starttime == undefined) {
					this.__starttime = new Date().getTime() + 100;
					this.__timediff = this.__starttime * slowmo - this.wso[0].time * 1000;
					this.nextmsg();
				}
		},
		close: function () {
			this.readyState = this.CLOSED;
		},
	};
	("window.WebSocket = ReplayWebSocket");
}

let oraf=window.requestAnimationFrame;
let wast=undefined;

window.requestAnimationFrame=function(user) {
	let temp=user;
	function mymethod(x) {
		if(wast==undefined) { wast=x; return user.call(this,x); }
		let tea=(window.slowmo??1);
		if(window.WebSocket.name!="ReplayWebSocket") tea=1;

		return user.call(this,/*(x-wast)*(window.slowmo??1) + wast*/(x-wast)*tea );
	};
	oraf.call(this,mymethod);
};