// ==UserScript==
// @name        Moomoo.io - 1.8.0 AutoScroll
// @author      Seryo
// @description Key-triggered autoscroll. I've removed the ping function with the 'R' key to keep the bull helmet scroll anonymous. You can also ping by clicking the minimap.

// @ - Bull Hat (Key: "R")
// @ - Soldier Helmet (Key: "G")
// @ - Tank Gear (Key: "Z")
// @ - Bearbarian Armor (Key: "M")
// @ - Booster Hat (Key: "B")
// @ - Flipper Hat (Key: "Y")
// @ - EMP Helmet (Key: "J")
// @ - Samurai Armor (Key: "U")
// @ - Turret Hat (Key: "T")
// @ - Fluff Head (Key: "I")
// @ - Spike Gear (Key: "H")
// @ - Monkey Tail (Key: "O")

// @version     0.1
// @match       *://*.moomoo.io/*
// @namespace   https://greasyfork.org/users/1190411
// @icon        https://cdn.glitch.com/82ae8945-dcc6-4276-98a9-665381b4cd2b/cursor12.png
// @license     MIT
// @grant       none
// @require     https://greasyfork.org/scripts/440839-moomoo-items/code/MooMoo%20Items.js?version=1023778
// @require     https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js?version=1005014
// @downloadURL https://update.greasyfork.org/scripts/476895/Moomooio%20-%20180%20AutoScroll.user.js
// @updateURL https://update.greasyfork.org/scripts/476895/Moomooio%20-%20180%20AutoScroll.meta.js
// ==/UserScript==

class MooMoo {
    static get hotkeys() {
        return {
            hat_hotkeys: {
                bull_hat: { id: 7, key: "r", scroll: { toggle: true, time: 0, top: 1450 } },
                soldier_helmet: { id: 6, key: "g", scroll: { toggle: true, time: 0, top: 1200 } },
                tank_gear: { id: 40, key: "z", scroll: { toggle: true, time: 0, top: 2050 } },
                bearbarian_armor: { id: 26, key: "m", scroll: { toggle: true, time: 0, top: 1600 } },
                booster_hat: { id: 12, key: "b", scroll: { toggle: true, time: 0, top: 1550 } },
                flipper_hat: { id: 31, key: "y", scroll: { toggle: true, time: 0, top: 1000 } },
                emp_helmet: { id: 22, key: "j", scroll: { toggle: true, time: 0, top: 1500 } },
                samurai_armor: { id: 20, key: "u", scroll: { toggle: true, time: 0, top: 1900 } },
                turret_hat: { id: 53, key: "t", scroll: { toggle: true, time: 0, top: 1850 } },
                fluff_head: { id: 30, key: "i", scroll: { toggle: true, time: 0, top: 200 } },
                spike_gear: { id: 11, key: "h", scroll: { toggle: true, time: 0, top: 1800 } },
                monkey_tail: { id: 11, key: "o", scroll: { toggle: true, time: 0, top: 250 } }
            }
        };
    }

    static init(arg) {
        this.hathotkeys();
        this.canvas = document.getElementById("gameCanvas");
        this.result = "";
        this.initcps();
        this.doc = document;
        this.initlisteners();
        this.id = `#${arg.match(/d="?g(.*)?I/g)[0].match(/(?=g).*(?=)/)[0]}`;
        window.addEventListener("load", (event) => {
            MooMoo.initHTML();
        });
    }

    static get() {
        return new Promise((resolve) => {
            fetch(arguments[0])
                .then((res) => res.text())
                .then((res) => {
                    return resolve(res);
                });
        });
    }

    static smoothscroll(scrolltop, time) {
        $('#storeHolder').animate({
            scrollTop: scrolltop
        }, time);
    }

    static hathotkeys() {
        let hotkeys = this.hotkeys.hat_hotkeys;
        let locale = this;
        for (let i in this.hotkeys.hat_hotkeys) {
            document.addEventListener('keydown', (e) => {
                if (document.activeElement.type == "text") return;
                if (e.key.toLowerCase() == hotkeys[i].key) {
                    if (!hotkeys[i].scroll.toggle) return;

                    if (document.getElementById("storeMenu").style.display === "block") {
                        locale.smoothscroll(hotkeys[i].scroll.top, hotkeys[i].scroll.time);
                    }

                    e.preventDefault();
                    e.stopPropagation();
                }
            });
        }
    }
}

(async () => {
    const game = await MooMoo.get(document.location.href);
    MooMoo.init(game);
    var ws;
    WebSocket.prototype._send = WebSocket.prototype.send;
    WebSocket.prototype.send = function (m) {
        if (MooMoo.decode(m)[0] == "c") {
            MooMoo.handleHit(m);
        }
        if (!ws) {
            document.ws = this;
            ws = this;
            this.addEventListener('message', function (message) {
                MooMoo.setws(this);
                MooMoo.getwsmessage(message);
            });
        }
        this._send(m);
    };
})();