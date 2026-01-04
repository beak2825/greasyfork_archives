// ==UserScript==
// @name         Diep.io Replay Beta
// @author       A Happy peepo
// @namespace    peepo
// @version      0.3.0
// @description  Download And Watch Replays
// @match        *://diep.io/
// @run-at       document-start
// @license      Apache License 2.0
// @require      https://cdn.jsdelivr.net/gh/Qwokka/WAIL@41c655434da60f14dfda88813b0cef9000c79ca6/wail.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447400/Diepio%20Replay%20Beta.user.js
// @updateURL https://update.greasyfork.org/scripts/447400/Diepio%20Replay%20Beta.meta.js
// ==/UserScript==
"use strict";
WebAssembly.instantiateStreaming = (r, i) => r.arrayBuffer().then(b => WebAssembly.instantiate(b, i));
class PacketHook extends EventTarget {
	static get CONST() {
		return {
			BUILD: "6ac60ba9d55769e868510c25366547d916b023b3",
			RECV_PACKET_INDEX: 471,
			MALLOC: "sa",
			FREE: "X",
		}
	}

	constructor(hook) {
		super();
		this.HEAPU8 = new Uint8Array(0);
		this.HEAP32 = new Int32Array(0);
		this.wasm = null;
		this._inject(hook);
		this._hijack();
	}
	_modify(bin, imports) {
		console.log('Modifying WASM');

		const wail = this.wail = new WailParser(new Uint8Array(bin));

		const recvPacket = this.recvPacket = wail.getFunctionIndex(PacketHook.CONST.RECV_PACKET_INDEX);
		const mainHook = wail.addImportEntry({
			moduleStr: "hook",
			fieldStr: "mainHook",
			kind: "func",
			type: wail.addTypeEntry({
				form: "func",
				params: ["i32", "i32"],
				returnType: "i32"
			})
		});
		wail.addExportEntry(recvPacket, {
			fieldStr: "recvPacket",
			kind: "func",
		});


		wail.addCodeElementParser(null, function({
			index,
			bytes
		}) {
			if (index === recvPacket.i32()) {
				return new Uint8Array([
					OP_GET_LOCAL, 0,
					OP_GET_LOCAL, 1,
					OP_CALL, ...VarUint32ToArray(mainHook.i32()),
					OP_IF, VALUE_TYPE_BLOCK,
					OP_RETURN,
					OP_END,
					...bytes
				]);
			}

			return false;
		});

		wail.parse();

		return wail.write();
	}

	_inject(mainHook) {
		const _initWasm = WebAssembly.instantiate;
		WebAssembly.instantiate = (bin, imports) => {
			this.imports = {};
			this.imports = Object.assign(this.imports, imports);
			bin = this._modify(bin, imports);

			imports.hook = {
				mainHook
			};

			return _initWasm(bin, imports).then((wasm) => {
				this.wasm = wasm.instance;
                                const memory = Object.values(this.wasm.exports).find(e => e instanceof WebAssembly.Memory);
                                this.HEAPU8 = new Uint8Array(memory.buffer);
		        	this.HEAP32 = new Int32Array(memory.buffer);
				this.malloc = this.wasm.exports[PacketHook.CONST.MALLOC];
				this.free = this.wasm.exports[PacketHook.CONST.FREE];

				console.log('Module exports done!\n\t- Hook.free\n\t- Hook.malloc\n\t- Hook.send\n\t- Hook.recv\n\t- Hook.addEventListener(\'clientbound\', ({data}) => console.log(data));\n\t- Hook.addEventListener(\'serverbound\', ({data}) => console.log(data));');

				return wasm
			}).catch(err => {
				console.error('Error in loading up wasm:');

				throw err;
			})
		};
	}

	_hijack() {
		const that = this;
		window.Object.defineProperty(Object.prototype, "postRun", {
			get() {},
			set(postRun) {
				delete Object.prototype.postRun
				this.postRun = postRun;

				that.Module = this;
				console.log('Module exports done! Hook.Module');
			},
			configurable: true,
		});
	}

	recv(buf) {
		const {
			malloc,
			free,
			HEAP32,
			HEAPU8
		} = this;

		buf = new Uint8Array(buf);

		const ptr = malloc(buf.byteLength);
		HEAPU8.set(buf, ptr);

		this.wasm.exports.recvPacket(ptr, buf.byteLength)
		free(ptr);
	}
}

function ab2str(buf) {
	return String.fromCharCode.apply(null, buf);
}

function str2ab(str) {
	var buf = new ArrayBuffer(str.length);
	var bufView = new Uint8Array(buf);
	for (var i = 0, strLen = str.length; i < strLen; i++) {
		bufView[i] = str.charCodeAt(i);
	}
	return new Uint8Array(buf);
}
Array.prototype.insert = function(index, item) {
	this.splice(index, 0, item);
};
var buffer = [];
var replaylengths = [];
const Hook = window.Hook = new PacketHook(function(ptr, len) {
	console.log(ptr,len);
	if (Hook.HEAPU8[ptr] === 7 && !playback) {
		buffer.insert(0, str2ab(PacketHook.CONST.BUILD));
		replaylengths.insert(0, 0);
	}
	if (Hook.HEAPU8[ptr] === 2 || Hook.HEAPU8[ptr] === 10 || Hook.HEAPU8[ptr] === 11 || Hook.HEAPU8[ptr] === 13) return 0;
	if (Hook.HEAPU8[ptr] >= 127) {
		Hook.HEAPU8[ptr] -= 127;
		return 0;
	}
	if (playback) return 1;
	if (recording) {
		let temp1 = new Uint32Array([len]);
		let temp2 = new Float32Array([mouseX]);
		let temp3 = new Float32Array([mouseY]);
		let temp4 = Hook.HEAPU8.slice(ptr, ptr + len);
		if (Hook.HEAPU8[ptr] === 0) replaylengths[0]++;
		buffer[0] = concatenate(buffer[0], new Uint8Array(temp1.buffer), new Uint8Array(temp2.buffer), new Uint8Array(temp3.buffer), temp4)
	}
});
var originmouseX = window.innerWidth / 2;
var originmouseY = window.innerHeight / 2;
let referenceWidth = window.innerWidth / 1920;
let referenceHeight = window.innerHeight / 1080;
var gamescale = referenceWidth < referenceHeight ? referenceHeight : referenceWidth;

function rezize() {
	originmouseX = window.innerWidth / 2;
	originmouseY = window.innerHeight / 2;
	let referenceWidth = window.innerWidth / 1920;
	let referenceHeight = window.innerHeight / 1080;
	gamescale = referenceWidth < referenceHeight ? referenceHeight : referenceWidth;
}
addEventListener('resize', rezize);
var mouseX = originmouseX;
var mouseY = originmouseY;

function getcurrentpos(p) {
	mouseX = p.pageX / window.innerWidth / gamescale;
	mouseY = p.pageY / window.innerHeight / gamescale;
}
addEventListener('mousemove', getcurrentpos, false);
var recording = true;
var playback = false;
var btn = document.createElement("button");
btn.innerHTML = "Download Replay";
btn.style.zIndex = 1;
btn.style.position = "absolute";
var selection = null;
btn.onclick = function() {
	if (buffer.length === 1) {
		downloadbuffer(buffer[0]);
	} else if (selection === null) {
		var myParent = document.body;
		//Create array of options to be added
		var array = buffer.map((x, index) => "index:" + index + " length:" + (replaylengths[index] * 0.04) + " seconds")

		//Create and append select list
		var selectList = [];
		var y = 50;
		//Create and append the options
		for (var i = 0; i < array.length; i++) {
			var option = document.createElement("button");
			option.value = i;
			option.innerHTML = array[i];
			option.style.zIndex = 1;
			option.style.position = "absolute";
			option.style.top = y + "px";
			option.onclick = function() {
				downloadbuffer(buffer[this.value]);
			}
			myParent.appendChild(option);
			y += option.offsetHeight;
			option.style.top = y + "px";
			selectList.push(option);
		}
		selection = selectList;
		return;
	} else if (selection !== null) {
		selection.forEach(x => x.remove())
		selection = null;
	}
};
var downloadbuffer = function(buffer) {
	if (recording) {
		const blob = new Blob([buffer], {
			type: 'application/octet-stream'
		})

		const url = window.URL.createObjectURL(blob)

		const a = document.createElement('a')
		a.href = url
		a.download = "diep.io replay.bin"
		document.body.appendChild(a)
		a.style.display = 'none'
		a.click()
		a.remove()

		setTimeout(() => window.URL.revokeObjectURL(url), 1000)
		//btn.innerHTML = "Start Recording";
		//buffer = concatenate(new Uint8Array([1, 0, 0, 0]), new Uint8Array([7]));
	} // else {
	//btn.innerHTML = "Stop Recording";
	//}
	//recording = !recording
}
document.body.appendChild(btn);

var input = document.createElement("input");
input.id = "file-input";
input.type = "file";
input.innerHTML = "Load Recording";
input.style.zIndex = 1;
input.style.left = "120px";
input.style.position = "absolute";

document.body.appendChild(input);
document.getElementById('file-input')
	.addEventListener('change', readSingleFile, false);

function readSingleFile(e) {
	var file = e.target.files[0];
	if (!file) {
		return;
	}
	var reader = new FileReader();
	reader.onload = function(e) {
		var contents = e.target.result;
		var temp2 = new Uint8Array(contents);
		playback = true;
		var replay_id = ab2str(temp2.slice(0, 40));
		var build_id = PacketHook.CONST.BUILD + '-' + replay_id;
		var index = 40;
		console.log("packet_id", replay_id);
		WebSocket.prototype.send = function(data) {
			if (playback) {
				this.onclose = undefined;
				this.onmessage = undefined;
				this.onerror = undefined;
				WebSocket.prototype.send = function() {};
				return;
			}
		};
		Object.defineProperty(WebSocket.prototype, 'readyState', {
			get: function() {
				return 1
			}
		});
		var onload = function() {
			window.input.set_convar("net_predict_movement", false);
			document.getElementById('canvas').onmousemove = undefined;
			const myInterval = setInterval(function() {
				let length = (new Uint32Array(temp2.slice(index, index + 4).buffer))[0]
				index += 4;
				let mouseX = (new Float32Array(temp2.slice(index, index + 4).buffer))[0]
				index += 4;
				let mouseY = (new Float32Array(temp2.slice(index, index + 4).buffer))[0]
				index += 4;
				window['input']['mouse'](mouseX * window.innerWidth * gamescale, mouseY * window.innerHeight * gamescale);
				if (temp2[index] === 2 || temp2[index] > 10) {
					index += length;
					return;
				}
				temp2[index] += 127;
				Hook.recv(temp2.slice(index, index + length));
				index += length;
				if (index >= temp2.length) {
					clearInterval(myInterval);
					window.input.set_convar("net_predict_movement", true);
					location.reload();
				}
			}, 40)
		}
		//here was wasm modifier, needs some work
		onload();
	};
	reader.readAsArrayBuffer(file);
}

function concatenate(...arrays) {
	// Calculate byteSize from all arrays
	let size = arrays.reduce((a, b) => a + b.byteLength, 0)
	// Allcolate a new buffer
	let result = new Uint8Array(size)

	// Build the new array
	let offset = 0
	for (let arr of arrays) {
		result.set(arr, offset)
		offset += arr.byteLength
	}

	return result
}