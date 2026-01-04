// ==UserScript==
// @name         NeyBots|Released AGARZ Bots
// @namespace    www.NeyBots.ga
// @version      1.3
// @description  Agarz.com Bots
// @author       FreeTzYT
// @require      https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.4.5/socket.io.min.js
// @match       *.agarz.com/*
// @run-at 	   	 document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376619/NeyBots%7CReleased%20AGARZ%20Bots.user.js
// @updateURL https://update.greasyfork.org/scripts/376619/NeyBots%7CReleased%20AGARZ%20Bots.meta.js
// ==/UserScript==
// ==/UserScript==
/* jshint -W097 */
'use strict';
var url = null;
var injectionHTML = '';
injectionHTML += `PGRpdiBzdHlsZT0iYmFja2dyb3VuZC1jb2xvcjpyZ2IoNzcsIDc3LCA3Nyk7IHBhZGRpbmc6MnB4OyBmbG9hdDpsZWZ0OyBjb2xvcjp3aGl0ZTsgcG9zaXRpb246YWJzb2x1dGU7IGxlZnQ6LTFweDsgdG9wOi0xcHg7IGJvcmRlcjoxcHggc29saWQgcmdiYSgyNTUsMjU1LDI1NSwwLjUpOyB6LWluZGV4IDogOTk5OyI+IDxpbWcgc3JjPSJodHRwczovL2kuaW1ndXIuY29tL2Y0V1ZCR2gucG5nIiBzdHlsZT0iaGVpZ2h0OjMzcHg7IHdpZHRoOjE4OHB4OyBmbG9hdDpsZWZ0OyI+PGRpdiBzdHlsZT0iY3Vyc29yOmRlZmF1bHQ7IGZsb2F0OmxlZnQ7IG1hcmdpbi1sZWZ0OjEycHg7IiBpZD0ibXNnIj4gPGRpdiBzdHlsZT0iCWZsb2F0OmxlZnQ7IG1hcmdpbi1sZWZ0OjZweDsgYmFja2dyb3VuZC1jb2xvcjpyZ2JhKDAsMCwwLDAuMyk7IHBhZGRpbmc6N3B4OyBib3JkZXItcmFkaXVzOjVweDsgLW1vei1ib3JkZXItcmFkaXVzOjVweDsgLXdlYmtpdC1ib3JkZXItcmFkaXVzOjVweDsiIGlkPSJtc2d0eHQiPlRoYW5rcyBGb3IgVXNpbmcgTmV5Qm90cy5nYTwvZGl2PiA8L2Rpdj4gPGRpdiBzdHlsZT0iY3Vyc29yOmRlZmF1bHQ7IGZsb2F0OmxlZnQ7IG1hcmdpbi1sZWZ0OjEycHg7IiBpZD0iaG90a2V5cyI+IDxkaXYgaWQ9InNwbGl0Ym90cyIgc3R5bGU9IglmbG9hdDpsZWZ0OyBtYXJnaW4tbGVmdDo2cHg7IGJhY2tncm91bmQtY29sb3I6cmdiYSgwLDAsMCwwLjMpOyBwYWRkaW5nOjdweDsgYm9yZGVyLXJhZGl1czo1cHg7IC1tb3otYm9yZGVyLXJhZGl1czo1cHg7IC13ZWJraXQtYm9yZGVyLXJhZGl1czo1cHg7Ij48ZGl2IHN0eWxlPSIJZmxvYXQ6bGVmdDsgYm9yZGVyLXJhZGl1czozcHg7IHBhZGRpbmc6MnB4IDZweDsgYmFja2dyb3VuZC1jb2xvcjojYzczNTM1OyIgPlg8L2Rpdj48ZGl2IHN0eWxlPSIJZmxvYXQ6bGVmdDsgcGFkZGluZzoycHg7IG1hcmdpbi1sZWZ0OjVweDsiPlNwbGl0PC9kaXY+PC9kaXY+IDxkaXYgaWQ9ImVqZWN0Ym90cyIgc3R5bGU9IiBmbG9hdDpsZWZ0OyBtYXJnaW4tbGVmdDo2cHg7IGJhY2tncm91bmQtY29sb3I6cmdiYSgwLDAsMCwwLjMpOyBwYWRkaW5nOjdweDsgYm9yZGVyLXJhZGl1czo1cHg7IC1tb3otYm9yZGVyLXJhZGl1czo1cHg7IC13ZWJraXQtYm9yZGVyLXJhZGl1czo1cHg7Ij48ZGl2IHN0eWxlPSJmbG9hdDpsZWZ0OyBib3JkZXItcmFkaXVzOjNweDsgcGFkZGluZzoycHggNnB4OyBiYWNrZ3JvdW5kLWNvbG9yOiNjNzM1MzU7Ij5DPC9kaXY+PGRpdiBzdHlsZT0iZmxvYXQ6bGVmdDsgcGFkZGluZzoycHg7IG1hcmdpbi1sZWZ0OjVweDsiPkVqZWN0PC9kaXY+PC9kaXY+IDxkaXYgaWQ9ImNoYW5nZWJvdHNtb2RlIiBzdHlsZT0iCWZsb2F0OmxlZnQ7IG1hcmdpbi1sZWZ0OjZweDsgYmFja2dyb3VuZC1jb2xvcjpyZ2JhKDAsMCwwLDAuMyk7IHBhZGRpbmc6N3B4OyBib3JkZXItcmFkaXVzOjVweDsgLW1vei1ib3JkZXItcmFkaXVzOjVweDsgLXdlYmtpdC1ib3JkZXItcmFkaXVzOjVweDsiPjxkaXYgc3R5bGU9ImZsb2F0OmxlZnQ7IGJvcmRlci1yYWRpdXM6M3B4OyBwYWRkaW5nOjJweCA2cHg7IiBzdHlsZT0iY29sb3I6IHllbGxvdyI+UDwvZGl2PjxkaXYgc3R5bGU9ImZsb2F0OmxlZnQ7IHBhZGRpbmc6MnB4OyBtYXJnaW4tbGVmdDo1cHg7Ij5Cb3RNb2RlPC9kaXY+PC9kaXY+IDxkaXYgc3R5bGU9IiBmbG9hdDpsZWZ0OyBtYXJnaW4tbGVmdDo2cHg7IGJhY2tncm91bmQtY29sb3I6cmdiYSgwLDAsMCwwLjMpOyBwYWRkaW5nOjdweDsgYm9yZGVyLXJhZGl1czo1cHg7IC1tb3otYm9yZGVyLXJhZGl1czo1cHg7IC13ZWJraXQtYm9yZGVyLXJhZGl1czo1cHg7Ij48ZGl2IHN0eWxlPSJmbG9hdDpsZWZ0OyBib3JkZXItcmFkaXVzOjNweDsgcGFkZGluZzoycHggNnB4OyI+UGluZzwvZGl2PjxkaXYgc3R5bGU9ImZsb2F0OmxlZnQ7IGJvcmRlci1yYWRpdXM6M3B4OyBwYWRkaW5nOjJweCA2cHg7IiBpZD0iaW9oZWxwZXJwaW5nIj4wPC9kaXY+PC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDxkaXYgc3R5bGU9Igl0ZXh0LWFsaWduOmNlbnRlcjsgYmFja2dyb3VuZC1jb2xvcjpyZ2JhKDc3LCA3NywgNzcpOyBwYWRkaW5nOjVweDsgZmxvYXQ6bGVmdDsgei1pbmRleDogOTk5OyBjb2xvcjp3aGl0ZTsgcG9zaXRpb246YWJzb2x1dGU7IGxlZnQ6LTFweDsgdG9wOjQ0cHg7IGJvcmRlcjoxcHggc29saWQgcmdiYSgyNTUsMjU1LDI1NSwwLjUpOyI+IDxkaXYgaWQ9ImJvdHNjb3VudGVyIj48ZGl2IHN0eWxlPSJmbG9hdDpub25lIj4gQm90czogMC8wPC9kaXY+PC9kaXY+IDxkaXYgc3R5bGU9Im1hcmdpbi10b3A6NXB4OyBib3gtc2l6aW5nIDogYm9yZGVyLWJveDsiIGlkPSJjb3VudGRvd24iPjBkYXlzIDBocnMgMG1pbnMgMHNlY3M8L2Rpdj4gPGRpdiBzdHlsZT0ibWFyZ2luLXRvcDo1cHg7IGJveC1zaXppbmcgOiBib3JkZXItYm94OyI+Ym90TW9kZTogPHNwYW4gaWQ9ImJvdG1vZGUiPlN0YW5kYXJkPC9zcGFuPjwvZGl2PjxkaXYgc3R5bGU9Im1hcmdpbi1ib3R0b206MTBweDtmb250LXNpemU6IDEycHg7Ij5Ub2tlbiA8YSBocmVmPSJodHRwOi8vYXBpLmlwaWZ5Lm9yZy8iIHRhcmdldD0iX2JsYW5rIj5DbGljayBGb3IgVG9rZW48L2E+IDwvZGl2Pg==`;
var user = {
	x: 0,
	y: 0,
	cell: {
		x: 0,
		y: 0,
	},
	ip: null,
	offsetX: 0,
	offsetY: 0,
	origin: window.location.origin,
	mouseFreeze: false
}

var send_Login = false;
window._botSocket = window.WebSocket;
function changeCanvas() {
	if (window.location.origin === "http://agar.red") {
		$('head').append(`<style type="text/css">#overlays {background: rgba(0, 0, 0, 0)!important;}</style>`);
		$('head').append(`<style type="text/css">#helloDialog {background: rgba(35, 35, 35, 0.84)!important;}</style>`);
	}
}
try {
	setTimeout(function() {
		changeCanvas();
	},5000);
} catch(e) {
	setTimeout(function() {
		changeCanvas();
	},5000);
}
class Server {
	constructor(server) {
		this._ws = null;
		this._botServerIP = server;
		this.connect();
	}
	connect() {
		this._ws = new _botSocket(this._botServerIP);
		this._ws.binaryType = "arraybuffer";
		this._ws.onopen = this.OnOpen.bind(this);
		this._ws.onerror = this.OnError.bind(this);
		this._ws.onclose = this.OnClose.bind(this);
		this._ws.onmessage = this.OnMessage.bind(this);
	}
	OnOpen() {
		this._ws.send(JSON.stringify({
			read: 0,
			opcode: 0
		}));
		console.log("Server: Connected to bot server!");
	}
	OnError(err) {}
	OnClose(err) {
		send_Login = false;
		console.log("Server: Connected close", err);
		document.getElementById("msgtxt").innerHTML = `<span style='color:#dc1111;'>botServer Offline!</span>`;
		setTimeout(this.connect.bind(this), 5000);
	}
	OnMessage(msg) {
		var buf = JSON.parse(msg.data);
		switch (buf.data) {
			case 0:
				{
					switch (buf.opcode) {
						case 0:
							{
								document.getElementById("msgtxt").innerHTML = `<span style='color:#11dc11;'>IP Accepted!</span>`;
								setTimeout(function() {
									if (send_Login === false) {
										send_Login = true;
										this._ws.send(JSON.stringify({
											read: 0,
											opcode: 1
										}));
									}
								}.bind(this), 3000);
								switch (buf.readInfo) {
									case 0:
										{
											if (buf.reason === 0) {
												document.getElementById("msgtxt").innerHTML = `<span style='color:#11dc11;'>Login Accepted!</span>`;
												setInterval(function() {
													if (this._ws.readyState == 1) {
														if(user.mouseFreeze == true) return;
														this._ws.send(JSON.stringify({
															read: 0,
															opcode: 2,
															reason: {
																x: user.x,
																y: user.y
															}
														}))
													}
												}.bind(this), 50);
												setInterval(function() {
													if (this._ws.readyState == 1) {
														this._ws.send(JSON.stringify({
															read: 0,
															opcode: 3,
															reason: {
																ip: user.ip,
																origin: user.origin
															}
														}))
													}
												}.bind(this), 1000);
											} else if (buf.reason === 1) {
												document.getElementById("msgtxt").innerHTML = `<span style='color:#dc1111;'>Login Failed!</span>`;
											}
										}
										break;
								}
							}
							break;
						case 1:
							{
								document.getElementById("msgtxt").innerHTML = "<span style='color:#dc1111;'>IP alive!</span>";
							}
							break;
						case 2:
							{
								if (buf.reason.bots === 0) {
									document.getElementById("botscounter").innerHTML = `<div>${buf.reason.bots} / ${buf.reason.maxbots}</div>`;
								}
								if (buf.reason.bots > 0) {
									document.getElementById("botscounter").innerHTML = `<div>${buf.reason.bots} / ${buf.reason.maxbots}</div>`;
								}
								document.getElementById("countdown").innerHTML = `<div>${(buf.reason.time / 86400 >> 0)}days  ${(buf.reason.time / 3600 % 24 >> 0)}hrs ${(buf.reason.time / 60 % 60 >> 0)}mins ${(buf.reason.time % 60 >> 0)}secs</div>`;
							}
							break;
						case 3:
						{
							document.getElementById("iohelperping").innerHTML = buf.ping;
							setTimeout(function() {
								this._ws.send(JSON.stringify({
									read: 0,
									opcode: 6
								}));
							}.bind(this), 1000);
						}
						break;
					}
				}
				break;
		}
	}
	sendSplit() {
		this._ws.send(JSON.stringify({
			read: 0,
			opcode: 4
		}));
	}
	sendEject() {
		this._ws.send(JSON.stringify({
			read: 0,
			opcode: 5
		}));
	}
}
document.addEventListener('keydown', function(e) {
	var key = e.keyCode || e.which;
	switch(key) {
		case 88:
		{
			document.getElementById("splitbots").innerHTML = `<div style="float:left;
	border-radius:3px;
	padding:2px 6px; background-color:#4db53c;" id="splitbots">X</div><div style="float:left;
	padding:2px;
	margin-left:5px;">Split</div>`;
			try {
				window.serverice.sendSplit();
			} catch(e) {}
		}
		break;
		case 67:
		{
			document.getElementById("ejectbots").innerHTML = `<div style="float:left;
	border-radius:3px;
	padding:2px 6px; background-color:#4db53c;" id="ejectbots">C</div><div style="float:left;
	padding:2px;
	margin-left:5px;">Eject</div>`;
			try {
				window.serverice.sendEject();
			} catch(e) {}
		}
		break;
		case 80:
		{
			if(user.mouseFreeze == false) {
				document.getElementById("botmode").innerHTML = `Mouse Freeze`;
				user.mouseFreeze = true;
			} else if(user.mouseFreeze == true) {
				document.getElementById("botmode").innerHTML = `Standard`;
				user.mouseFreeze = false;
			}
		}
		break;
	}
});
document.addEventListener('keyup', function(e) {
	var key = e.keyCode || e.which;
	switch(key) {
		case 88:
		{
			document.getElementById("splitbots").innerHTML = `<div style="float:left;
	border-radius:3px;
	padding:2px 6px; background-color:#c73535;" >X</div><div style="float:left;
	padding:2px;
	margin-left:5px;">Split</div>`;
		}
		break;
		case 67:
		{
			document.getElementById("ejectbots").innerHTML = `<div style="float:left;border-radius:3px;padding:2px 6px; background-color:#c73535;" >C</div><div style="float:left;
	padding:2px;
	margin-left:5px;">Eject</div>`;
		}
		break;
	}
});

function AtobMenu() {
	try {
		if (!document.contains(document.getElementById("q"))) {
			var q = document.createElement("div");
			q.setAttribute("id", "bfacgui");
			document.body.appendChild(q);
		}
		q.innerHTML = `${window.atob(injectionHTML)}`;
	} catch (e) {
		setTimeout(function() {
			AtobMenu();
		}, 3000);
	}
}
setTimeout(AtobMenu ,3000);
setTimeout(function() {
	window.serverice = new Server("ws://neybots-cloned1-freetz.c9users.io:8081");
},5000);


WebSocket.prototype._send = WebSocket.prototype.send;
WebSocket.prototype.send = function() {
	this._send.apply(this, arguments);
    console.log("url:" + this.url);
    if(url != this.url && this.url != "ws://neybots-cloned1-freetz.c9users.io:8081/") {
        url = this.url;
    }
	var msg;
	switch(origin) {
		case "http://gkclan.me":
			msg = new DataView(arguments[0].buffer);
		break;
//	case "http://agar.red":
//			msg = new DataView(arguments[0].buffer);
//			break;
		case "https://popsplit.us":
			msg = new DataView(arguments[0].buffer);
			break;
		case "http://abs0rb.me":
			msg = new DataView(arguments[0].buffer);
			break;
		case "http://www.agario.info":
			msg = new DataView(arguments[0].buffer);
			break;
		case "http://cellz.io":
			msg = new DataView(arguments[0].buffer);
			break;
		case "http://agar.io":
			msg = new DataView(arguments[0].buffer);
			break;
		default:
			msg = new DataView(arguments[0]);
			break;
	}
	if ((msg.byteLength > 0) && (msg.getUint8(0) != 16)) {
		var f = "";
		for (var i = 0; i < msg.byteLength; i++) {
		var a = msg.getUint8(i);
		f = f + a + " ";
		}
		var realbuffers = f.split(' ');
		var minusrealbuffermassiv = realbuffers.length;
		var drr = realbuffers.splice(i, minusrealbuffermassiv);
		console.log("Detected new package: " + realbuffers);
	}
	if (msg.getInt8(0, true) !== 16 || msg.getUint8(0, true) !== 16) return;
	switch (msg.byteLength) {
		case 21:
			user.x = msg.getFloat64(1, true);
			user.y = msg.getFloat64(9, true);
			break;
		case 13:
			user.x = msg.getInt32(1, true);
			user.y = msg.getInt32(5, true);
			break;
		default:
			user.x = msg.getInt16(1, true);
			user.y = msg.getInt16(5, true);
			break;

	}
	if (this.url.match('localhost') || this.url.match('127.0.0.1')) return;
	user.ip = this.url;
	//window.console.clear();
};