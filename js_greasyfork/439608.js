// ==UserScript==
// @name         Jstris Keyboard Display Script
// @namespace    http://tampermonkey.net/
// @version      0.0.0
// @description  shows keyboard inputs on screen
// @author       mat1jaczyyy (based on Oki and meppydc's works)
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439608/Jstris%20Keyboard%20Display%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/439608/Jstris%20Keyboard%20Display%20Script.meta.js
// ==/UserScript==

/* eslint-disable no-undef */

(function() {
    window.addEventListener('load', function() {
        const isGame = typeof Game != "undefined";
        const isReplayer = typeof Replayer != "undefined";

        if (!isGame && !isReplayer) return;

        const pos = {x: -300, y: 100};

        const keyConfig = [
            [
                'new',
                null,
                {k: 'reset', l: 'F4'},
            ],
            [
                null
            ],
            [
                '180',
                'ccw',
                'cw',
                null,
                null,
                'hd',
            ],
            [
                null,
                null,
                {k: 'hold', l: 'HLD'},
                null,
                {k: 'left', l: 'L'},
                'sd',
                {k: 'right', l: 'R'}
            ]
        ];

        var kbhold = document.createElement("div");
        kbhold.id = "keyboardHolder";
        kbhold.style.position = "absolute"
        kbhold.style.left = (myCanvas.getBoundingClientRect().left + pos.x) + "px";
        kbhold.style.top = (myCanvas.getBoundingClientRect().top + pos.y) + "px";
        document.body.appendChild(kbhold);

        let keyTable = `
            <style>
                #kbo {text-align:center;position: absolute;font-size:15px;}
                #kbo .tg {border-collapse:collapse;border-spacing:0;color:red;}
                #kbo .tg td{padding:10px 5px;border-style:solid;border-width:2px;}
                #kbo .tg th{padding:10px 5px;border-style:solid;border-width:2px;}
                #kbo .tg .kbnone{border-color:#000000;border:inherit;}
                #kbo .tg .kbkey{border-color:#34ff34;background-color:black;}
            </style>

            <div id="kbo">
                <div id="kps"></div>
                <table class="tg">
        `;

        for (const row of keyConfig) {
            keyTable += `<tr>`;

            for (const key of row) {
                let isKey = key != null;
                let label = "";
                let cssClass = "kbnone";

                if (isKey) {
                    label = typeof key == 'string'? key.toUpperCase() : key.l;
                    cssClass = "kbkey kbd-" + (typeof key == 'string'? key.toLowerCase() : key.k);
                }

                keyTable += `<td class="${cssClass}">${label}</td>`;
            }

            keyTable += `</tr>`;
        }

        keyTable += `
                </table>
            </div>
        `;

        keyboardHolder.innerHTML = keyTable;

        let inject = function(o, f, c) {
            let text = o.prototype[f].toString();

            let params = text.slice(text.indexOf("(") + 1, text.indexOf(")"))
                .trim().split(",")
                .map(i => i.trim())
                .filter(i => i);

            let body = text.slice(text.indexOf("{") + 1, -1);

            o.prototype[f] = new Function(...params, c(params, body));
        };

        let setKey = function(key, type) {
            for (const td of document.getElementsByClassName(`kbd-${key}`)) {
                td.style.backgroundColor = ["", "lightgoldenrodyellow"][type];
            }
        }

        if (isGame) {
            inject(Game, 'readyGo', (p, i) => "Game['set2ings'] = this.Settings.controls;" + i);
            inject(Game, 'updateTextBar', (p, i) => i + "; kps.innerHTML = 'KPS: ' + (this.getKPP() * this.placedBlocks / this.clock).toFixed(2);");

            let press = function (e) {
                if (typeof Game.set2ings == 'undefined') return;

                let i = Game.set2ings.indexOf(e.keyCode);
                if (i == -1) return;

                let key = ['left', 'right', 'sd', 'hd', 'ccw', 'cw', 'hold', '180', 'reset', 'new'][i];
                setKey(key, +(e.type == "keydown"))
            }

            document.addEventListener('keydown', press);
            document.addEventListener('keyup', press);

        } else if (isReplayer) {
            var url = window.location.href.split("/")

            if (!url[2].endsWith("jstris.jezevec10.com")) return;
            if (url[3] != "replay") return;

            fetch(`https://${url[2]}/replay/data?id=${url.length == 6? (url[5] + "&live=1") : url[4]}&type=0`)
                .then(res => res.json())
                .then(json => {
                    let das = json.c.das;

                    Replayer.setKey = setKey;

                    inject(Replayer, 'playUntilTime', (p, i) => {
                        let before = `;
                            kps.innerHTML = 'KPS: ' + (this.getKPP() * this.placedBlocks / this.clock * 1000).toFixed(2);

                            if (this.ptr == 0) Replayer.lastPtr = -1;

                            this.kbdActions = [];

                            for (let i = 0; i < this.actions.length; i++) {
                                let o = {a: this.actions[i].a, t: this.actions[i].t};

                                if (o.a == 2 || o.a == 3) {
			                        o.a -= 2;
                                    for (let j = i - 1; j >= 0; j--) {
                                        if (this.kbdActions[j].a < 2) {
                                            this.kbdActions[j].a += 2;
                                            break;
                                        }
                                    }
			                    }

                                this.kbdActions.push(o);
                            }

                            let pressKey = function(key, type) {
                                Replayer.setKey(key, Math.min(type, 1));

                                if (type == 2) {
                                    setTimeout(x => Replayer.setKey(key, 0), ${das} * 3 / 5)
                                }
                            };
                        `;

                        let after = `;
                            if (this.ptr != Replayer.lastPtr && this.ptr - 1 < this.kbdActions.length) {
                                var highlight = [
                                    ["left", 2],
                                    ["right", 2],
                                    ["left", 1],
                                    ["right", 1],
                                    ["ccw", 2],
                                    ["cw", 2],
                                    ["180", 2],
                                    ["hd", 2],
                                    ["sd", 2],
                                    null,
                                    ["hold", 2]
                                ][this.kbdActions[this.ptr - 1].a];

			                    if (highlight) {
			                        pressKey(...highlight)
			                    }
                            }

                            Replayer.lastPtr = this.ptr;
                        `;

                        return before + i + after;
                    });
                });
        }
    });
})();