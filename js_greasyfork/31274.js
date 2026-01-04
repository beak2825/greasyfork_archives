// ==UserScript==
// @name         Gaver.io Bots
// @namespace    JoseFredoBots
// @version      1.0
// @description  Bots For Gaver.io
// @require      https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.7.3/socket.io.min.js
// @author       JoseFredoHD
// @match        *.gaver.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31274/Gaverio%20Bots.user.js
// @updateURL https://update.greasyfork.org/scripts/31274/Gaverio%20Bots.meta.js
// ==/UserScript==

window.Client = {
	ip: null,
	x: 0,
	y: 0,
	log: false
};

const port = 8085;
const cmd = io("ws://JoseAlfredo-josef128339.codeanyapp.com:" + port.toString());

function KeyOf(letter){
	return letter.charCodeAt(0);
}

window.addEventListener("keydown", (e) => {
	if(e.keyCode == KeyOf("X")){
		cmd.emit("split", true);
	}
	if(e.keyCode == KeyOf("C")){
		cmd.emit("eject", true);
	}
});

_WebSocket = window.WebSocket;

function refer(master, slave, prop) {
	Object.defineProperty(master, prop, {
		get: function(){
			return slave[prop];
		},
		set: function(val) {
			slave[prop] = val;
		},
		enumerable: true,
		configurable: true
	});
}

window.WebSocket = function(url, protocols) {
    if (protocols === undefined) {
        protocols = [];
    }
    var ws = new _WebSocket(url, protocols);
    refer(this, ws, 'binaryType');
    refer(this, ws, 'bufferedAmount');
    refer(this, ws, 'extensions');
    refer(this, ws, 'protocol');
    refer(this, ws, 'readyState');
    refer(this, ws, 'url');
    this.send = function(data) {
		if(Client.log) console.log(new Uint8Array(data));
		let msg = new DataView(arguments[0]);
		if(msg.getUint8(0) == 16 && msg.byteLength == 13){
			Client.x = msg.getInt32(1, true);
			Client.y = msg.getInt32(5, true);
		}
		cmd.emit("clientPosition", {
			x: Client.x,
			y: Client.y
		});
        return ws.send.call(ws, data);
    };
    this.close = function() {
        return ws.close.call(ws);
    };
    this.onopen = function(event) {};
    this.onclose = function(event) {};
    this.onerror = function(event) {};
    this.onmessage = function(event) {};
    ws.onopen = function(event) {
        if(this.url !== null) Client.ip = this.url;
		setInterval(() => {
			cmd.emit("serverIP", {
				ip: Client.ip
			});
		}, 350);
        if (this.onopen) return this.onopen.call(ws, event);
    }.bind(this);
    ws.onmessage = function(event) {
        if (this.onmessage) return this.onmessage.call(ws, event);
    }.bind(this);
    ws.onclose = function(event) {
        if (this.onclose) return this.onclose.call(ws, event);
    }.bind(this);
    ws.onerror = function(event) {
		console.log("[CLIENT]: WebSocker Error");
        if (this.onerror) return this.onerror.call(ws, event);
    }.bind(this);
};
window.WebSocket.prototype = _WebSocket;