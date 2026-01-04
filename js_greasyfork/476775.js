// ==UserScript==
// @name Script
// @namespace http://tampermonkey.net/
// @version 0.0.1
// @description scripts petridsih.pw zoom
// @author https://discord.gg/sv6EhqxFhb
// @run-at document-start
// @icon https://4ery.ru/gallery/favicon.ico
// @match        https://*/*
// @license MIT
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/476775/Script.user.js
// @updateURL https://update.greasyfork.org/scripts/476775/Script.meta.js
// ==/UserScript==

console.log("observer mutation");
var p = {},
	m = {
		registerObserver: function() {
			void 0 !== window.WebKitMutationObserver && (p.observer = new window.WebKitMutationObserver((function(e) {
				e.forEach((function(e) {
					for(var t = 0; t < e.addedNodes.length; ++t) checkNode(e.addedNodes[t])
				}))
			})), p.observer.observe(window.document, {
				subtree: !0,
				childList: !0,
				attribute: !1
			}))
		}
	};

function checkNode(e) {
	var t = e.parentElement ? e.parentElement.tagName : "";
	"SCRIPT" != t && "SCRIPT" != e.tagName || (e.textContent = e.textContent.replace(/ > zoom/g, " > zoom && false"), e.textContent = e.textContent.replaceAll("if (isFB == 1) { event.preventDefault(); }", "if(0.1 > zoom) { zoom = 0.1; }\nif (isFB == 0.1) { event.preventDefault(); }")), "SCRIPT" != t && "SCRIPT" != e.tagName || (e.textContent = e.textContent.replaceAll(" function drawBorders(ctx) {", "function drawBorders(ctx) { ctx.save();\nctx.beginPath();\nctx.rect(-mapmaxX, -mapmaxY, mapmaxX * 3, mapmaxY);\nctx.rect(mapmaxX, 0, mapmaxX, mapmaxY * 2);\nctx.rect(-mapmaxX, 0, mapmaxX, mapmaxY * 2);\nctx.rect(0, mapmaxY, mapmaxX, mapmaxY);\nctx.fill();\nctx.lineWidth = 1;\nctx.strokeStyle = '#FFFFFF';\nctx.strokeRect(0, 0, mapmaxX, mapmaxY);\nctx.restore();")), "SCRIPT" != t && "SCRIPT" != e.tagName || (e.textContent = e.textContent.replaceAll("if (users[i].name == 'Congratulations') {", "if (users[i].name == 'Game starting in') {")), "SCRIPT" != t && "SCRIPT" != e.tagName || (e.textContent = e.textContent.replace("'black hole':'blackhole2',", "'black hole':'geo1',")), "SCRIPT" != t && "SCRIPT" != e.tagName || (e.textContent = e.textContent.replaceAll("anus", "white hole")), "SCRIPT" != t && "SCRIPT" != e.tagName || (e.textContent = e.textContent.replaceAll('if (srs.code == 22) {\n\tvar online = srs.data;\n//\tconsole.log("User list update");\n\tupdatePvpOnlineRight(online);\n\tsendPvpPing();\n}', "if (srs.code == 22) {\n\tvar online = srs.data;\n\tconsole.log(online);\n\tupdatePvpOnlineRight(online);\n\tsendPvpPing();\n}"))
}

function keyup(e) {
	49 == e.keyCode && $("canvas").trigger($.Event("mousemove", {
		clientX: 295,
		clientY: 0
	})), 50 == e.keyCode && $("canvas").trigger($.Event("mousemove", {
		clientX: 2e4,
		clientY: 2e4
	})), 51 == e.keyCode && $("canvas").trigger($.Event("mousemove", {
		clientX: 2e4,
		clientY: 2e4
	})), 52 == e.keyCode && $("canvas").trigger($.Event("mousemove", {
		clientX: 1439,
		clientY: 424
	}))
}
m.registerObserver(),
	function() {
		"use strict";
		var e, t = !1;
		addEventListener("keyup", (e => {
			"q" === e.key && (t = !t)
		}));
		const n = WebSocket.prototype.send,
			o = Uint8Array.from([21]);
		WebSocket.prototype.send = function(t) {
			return t && t.constructor === ArrayBuffer && (e = this), n.call(this, t)
		}, setInterval((() => {
			t && e.send(o)
		}), 0)
	}(), window.addEventListener("keyup", keyup),
	function() {
		"use strict";
		var e = !1;
		addEventListener("keyup", (t => {
			82 == t.keyCode && (e = !e)
		}));
		const t = WebSocket.prototype.send;
		WebSocket.prototype.send = function(n) {
			if(e && n && n.constructor === ArrayBuffer) {
				const e = new DataView(n);
				if(16 === e.getUint8(0)) {
					const [t, n, o] = function() {
						const e = document.querySelectorAll(".map-header .coords");
						if(e.length) {
							let t = e[0].textContent,
								n = !1;
							for(let e = 0; e < t.length; ++e)
								if("-" === t[e] || t[e] >= 48 || t[e] <= 57) {
									t = t.substr(e), n = 0 !== e;
									break
								}
							const o = t.split(".").map((e => parseInt(e)));
							return o.push(n), o
						}
						return []
					}(), a = e.getFloat64(1, !0), i = e.getFloat64(9, !0);
					if(0 !== t && 0 !== n && !1 === o) {
						const o = Math.atan2(i - n, a - t);
						e.setFloat64(1, t + 15e3 * Math.cos(o), !0), e.setFloat64(9, n + 15e3 * Math.sin(o), !0)
					}
				}
			}
			return t.call(this, n)
		}
	}(), setTimeout((function(e) {
		t || $("#canvas").after('<div style="position: absolute;left: 5px;top: 60px;"><input id="ikometa" class="checkbox" type="checkbox" style="color: white;"><span style="color: white;font-family:SourceSansBold;position: absolute;">Respwan</span></div>');
		var t = !0;
		$("#ikometa").click((function() {
			$("#ikometa").is(":checked") ? interval = setInterval((function() {
				"none" != $("#endgameoverlay")[0].style.display && $("#agbp").trigger("click")
			}), 1e3) : clearInterval(interval)
		}))
	}), 349), setTimeout((function(e) {
		t || $("#canvas").after('<div style="position: absolute;left: 5px;top: 75px;"><input id="ikometa1" class="checkbox" type="checkbox" style="color: white;"><span style="color: white;font-family:SourceSansBold;position: absolute;">Center</span></div>');
		var t = !0;
		$("#ikometa1").click((function() {
			$("#ikometa1").is(":checked") ? interval = setInterval((function() {
				! function() {
					var e = !1;

					function t() {
						var t, n, o = function() {
							var e = document.querySelectorAll(".map-header .coords");
							if(e.length) {
								let t = e[0].textContent,
									n = !1;
								for(let e = 0; e < t.length; ++e)
									if("-" === t[e] || 48 <= t[e] || t[e] <= 57) {
										t = t.substr(e), n = 0 !== e;
										break
									}
								const o = t.split(".").map((e => parseInt(e)));
								return o.push(n), o
							}
							return []
						}();
						o.length && ([n, t, o] = o, 0 !== n && 0 !== t && !1 === o ? !1 === e && (e = !0, o = mapmaxX / 2 + canvas.width / 2 - n, n = mapmaxY / 2 + canvas.height / 2 - t, 1 < Math.hypot(o, n) && (t = canvas, n = function(e, t, n, o, a) {
							var i, c = {
								bubbles: !0,
								cancelable: !1,
								view: window,
								detail: 0,
								screenX: 0,
								screenY: 0,
								clientX: o,
								clientY: a,
								ctrlKey: !1,
								altKey: !1,
								shiftKey: !1,
								metaKey: !1,
								button: 0,
								relatedTarget: void 0
							};
							if("function" == typeof document.createEvent)(i = document.createEvent("MouseEvents")).initMouseEvent(e, c.bubbles, c.cancelable, c.view, c.detail, c.screenX, c.screenY, c.clientX, c.clientY, c.ctrlKey, c.altKey, c.shiftKey, c.metaKey, c.button, document.body.parentNode);
							else if(document.createEventObject) {
								for(var r in i = document.createEventObject(), c) i[r] = c[r];
								i.button = {
									0: 1,
									1: 4,
									2: 2
								}[i.button] || i.button
							}
							return i
						}("mousemove", 0, 0, o, n), t.dispatchEvent ? t.dispatchEvent(n) : t.fireEvent && t.fireEvent("on" + type, n))) : e = !1)
					}
					agbp.addEventListener("click", (() => {
						setTimeout((() => {
							e = !1,
							t()
						}), 1e3)
					})), newplaybutton.addEventListener("click", (() => {
						setTimeout((() => {
							e = !1,
							t()
						}), 1e3)
					})), setInterval(t, 0)
				}()
			}), 0) : clearInterval(interval)
		}))
	}), 349), setTimeout((function(e) {
		t || $("#canvas").after('<div style="position: absolute;left: 5px;top: 90px;"><input id="ikometa" class="checkbox" type="checkbox" style="color: white;"><span style="color: white;font-family:SourceSansBold;position: absolute;">Space</span></div>');
		var t = !0;
		$("#ikometa").click((function() {
			$("#ikometa").is(":checked") ? interval = setInterval((function() {
				setTimeout((function() {
					window.onkeydown({
						keyCode: 32
					})
				}), 50), setTimeout((function() {
					window.onkeyup({
						keyCode: 32
					})
				}), 100)
			}), 110) : clearInterval(interval)
		}))
	}), 349);