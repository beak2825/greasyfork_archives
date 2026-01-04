// ==UserScript==
// @name        MooMoo.io - Key Rebinds
// @author      Kooky Warrior
// @description V = Spike, F = Trap, N = Mill.
// @version     1
// @match       *://*.moomoo.io/*
// @namespace   https://greasyfork.org/users/999838
// @icon        https://cdn.glitch.com/82ae8945-dcc6-4276-98a9-665381b4cd2b/cursor12.png
// @require     https://cdnjs.cloudflare.com/ajax/libs/msgpack-lite/0.1.26/msgpack.min.js
// @run-at      document-start
// @grant       unsafeWindow
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/476983/MooMooio%20-%20Key%20Rebinds.user.js
// @updateURL https://update.greasyfork.org/scripts/476983/MooMooio%20-%20Key%20Rebinds.meta.js
// ==/UserScript==

function iso() {
    return document.activeElement.id.toLowerCase() === 'chatbox';
}

function iaia() {
    return document.activeElement.id.toLowerCase() === 'allianceinput';
}

function shhk() {
    return !iso() && !iaia();
}

(async () => {
	unsafeWindow.keyRebinder = true

	let items = [],
		weapons = [],
		inGame = false,
		keys = {},
		ws = await new Promise(async (resolve) => {
			let { send } = WebSocket.prototype

			WebSocket.prototype.send = function (...x) {
				send.apply(this, x)
				this.send = send
				this.iosend = function (...datas) {
					const [packet, data] = datas
					this.send(msgpack.encode([packet, data]))
				}
				this.addEventListener("message", (e) => {
					if (!e.origin.includes("moomoo.io") && unsafeWindow.privateServer) return
					const [packet, data] = msgpack.decode(new Uint8Array(e.data))
					switch (packet) {
						case OLDPACKETCODE.RECEIVE["1"]:
							inGame = true
							items = [0, 3, 6, 10]
							weapons = [0]
							break
						case OLDPACKETCODE.RECEIVE["11"]:
							inGame = false
							break
						case OLDPACKETCODE.RECEIVE["17"]:
							if (data[0]) {
								if (data[1]) weapons = data[0]
								else items = data[0]
							}
							break
					}
				})
				resolve(this)
			}
		})

	var observer = new MutationObserver((mutations) => {
        mutations.forEach((mutationRecord) => {
            if (!shhk()) {
                keys = {};
            }
        });
    });
    observer.observe(document.getElementById("allianceMenu"), {
        attributes: true,
        attributeFilter: ["style"],
    });
    observer.observe(document.getElementById("chatHolder"), {
        attributes: true,
        attributeFilter: ["style"],
    });

    unsafeWindow.addEventListener("keydown", (event) => {
        if (inGame && !keys[event.code] && shhk()) {
            keys[event.code] = true;
            if (event.code == "KeyF" && items[4]) {
                ws.iosend(OLDPACKETCODE.SEND["5"], [items[4], null]);
            } else if (event.code == "KeyV") {
                ws.iosend(OLDPACKETCODE.SEND["5"], [items[2], null]);
            } else if (event.code == "KeyN") {
                ws.iosend(OLDPACKETCODE.SEND["5"], [items[3], null]);
            }
        }
    });

    unsafeWindow.addEventListener("keyup", (event) => {
        if (inGame && keys[event.code] && shhk()) {
            keys[event.code] = false;
        }
    });
})();