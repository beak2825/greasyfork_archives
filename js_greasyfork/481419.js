// ==UserScript==
// @name         Gats.io - Epsilon-Delta client
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  none
// @author       nitrogem35
// @run-at       document-end
// @match        https://gats.io/*
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/481419/Gatsio%20-%20Epsilon-Delta%20client.user.js
// @updateURL https://update.greasyfork.org/scripts/481419/Gatsio%20-%20Epsilon-Delta%20client.meta.js
// ==/UserScript==

(async function main() {

    if (typeof a9 !== "function") return setTimeout(main, 33);

    const CAPTCHA_URL = "ws://localhost:3500",
          SETTINGS_URL = "http://localhost:3502";

    class CaptchaGenerator {
        static #opcodes = {
            fromClient: {
                tokenCreated: "t",
            },
            fromServer: {
                r: "requestToken"
            }
        };
        static grecaptchaStates = {
            0: "Not connected to captcha relay server",
            1: "Connected to captcha relay server",
            2: "Connecting to captcha relay server..."
        };
        static tokensGenerated = 0;
        constructor(url) {
            this.#spawnSocket(url);
        }
        #spawnSocket(url) {
            let socket = new WebSocket(url);
            this.socket = socket;
            socket.binaryType = 'arraybuffer';
            socket.onopen = function() {
                CGState = 1;
            }
            socket.onmessage = async function(msg) {
                let decoded = CaptchaGenerator.decodeMsg(msg.data);
                if (!decoded) return;
                switch(CaptchaGenerator.#opcodes.fromServer[decoded.type]) {
                    case "requestToken":
                        let rawToken = await CaptchaGenerator.getToken();
                        let createdAt = Date.now();
                        let token = `q,${rawToken},${createdAt}`;
                        CaptchaGenerator.sendEncoded("tokenCreated", token, socket);
                        CaptchaGenerator.tokensGenerated++;
                        break;
                }
            }
            socket.onclose = function() {
                CGState = 0;
            }
        }
        static sendEncoded(type, data, socket) {
            var encoded = CaptchaGenerator.encodeMsg(CaptchaGenerator.#opcodes.fromClient[type], data);
            socket.send(encoded);
        }
        static encodeMsg(opcode, data) {
            return opcode + "|" + JSON.stringify(data);
        }
        static decodeMsg(data) {
            var parts = data.split("|");
            if (parts.length != 2) return;
            return {
                type: parts[0],
                data: JSON.parse(parts[1])
            };
        }
        static async getToken() {
            return new Promise (async resolve => {
                grecaptcha.ready(function () {
                    grecaptcha.execute('6LenZt4ZAAAAAF-2nPKzH9111gkjBlaJCEp8UsQV', {
                        action: "connect"
                    }).then(function (token) {
                        resolve(token);
                    });
                })
            });
        }
    }

    function hudHook() {
        let state = CGState;
        j58.font = "14px Arial";
        if (state == 1) {
            j58.fillStyle = "#167c12";
        }
        else {
            j58.fillStyle = "#666";
        }
        j58.globalAlpha = 1;
        j58.fillText(`${CaptchaGenerator.grecaptchaStates[state]}  (${CaptchaGenerator.tokensGenerated} tokens created)`, 200, 15);
    }

    let oldA9 = a9;
    a9 = function() {
        oldA9(...arguments);
        hudHook(...arguments);
    }

    document.addEventListener('keydown', (event) => {
        if (j46) return;
        switch (event.key) {
            case '1':
                if (CGState == 0) {
                    captchaGenerator = new CaptchaGenerator(CAPTCHA_URL);
                }
                else if (CGState == 1) {
                    captchaGenerator.socket.close();
                }
                break;
            case '2':
                divs.menu.hidden ? divs.menu.hidden = 0 : divs.menu.hidden = 1;
                break;
            case '3':
                getSettings();
                break;
        }
    });

    document.addEventListener('mousemove', mouseEvent => {
        cursor.x = mouseEvent.clientX;
        cursor.y = mouseEvent.clientY;
        for (let movableWindow of windows) {
            if (movableWindow.enable) {
                applyStyle(movableWindow.element, {
                    "left": (cursor.x - movableWindow.offsetX) + 'px',
                    "top": (cursor.y - movableWindow.offsetY) + 'px'
                });
            }
        } 
        fixWindowPositions();
    });

    document.onmousedown = () => {};
    canvas.onmousedown = mouseEvent => {
        if ($('#loginModal'    ).is(':visible') ||
            $('#registerModal' ).is(':visible') ||
            $('#aboutModal'    ).is(':visible') ||
            $('#privacyModal'  ).is(':visible')) return;

        j18 = {x: mouseEvent.clientX, y: mouseEvent.clientY};

        if (!j17 && c3 && mouseEvent.which == 1) RF.list[0].send(a59("key-press", {inputId: 6, state: 1}));
    };

    canvas.onwheel = function(e) {
        let dir = Math.sign(e.deltaY);
        if (dir == 1 && !viewbox.zoomed) {
            viewbox.x = j7;
            viewbox.y = j8;
            viewbox.zoomed = true;
            j7 *= 1.2;
            j8 *= 1.2;
            a1();
        }
        if (dir == -1 && viewbox.zoomed) {
            j7 = viewbox.x;
            j8 = viewbox.y;
            viewbox.zoomed = false;
            a1();
        }
    }

    //Stabilize view
    setInterval(() => {
        if (!c2) return;
        c2.update = function () {
            var player = RD.pool[c2.trackingId];
            if (c2.trackingId) {
                c2.x = player.x - j40.x;
                c2.y = player.y - j40.y;
            }
        }
    }, 100);

    //Auto gas
    setInterval(() => {
        if (o3[2] == "gasGrenade" && cheats.autoGas) {
            RF.list[0].socket.send("k,5,1");
            setTimeout(() => { RF.list[0].socket.send("k,5,0") }, 100);
        }
    }, 1000);

    function createMenu(width, height) {
        let movableWindow = {},
            title, content, backbutton
        let menu = make('div', {
            "width": width + "px",
            "height": height + "px",
            "color": "#FFFFFF",
            "zIndex": zIndex++,
            "position": "absolute",
            "fontSize": "20px",
            "fontFamily": "system-ui",
            "userSelect": "none"
        }, { hidden: 1 }, [
            title = make('div', {
                "width": "100%",
                "height": "43px",
                "border": "2px solid #000f",
                "padding": "5px",
                "display": "flex",
                "whiteSpace": "pre-wrap",
                "justifyContent": "space-between",
                "background": "rgb(2,0,36)",
                "background": "linear-gradient(210deg, rgba(2,0,36,1) 0%, rgba(43,104,214,1) 25%, rgba(0,255,201,1) 100%)"
            }, {
                innerText: menuLabels[0],
                onmousedown: e => {
                    let style = menu.style;
                    style.zIndex = zIndex++;
                    if (style.right) {
                        style.left = (window.innerWidth - (parseInt(style.right) + parseInt(style.width))) + 'px';
                        style.right = '';
                    }
                    movableWindow.offsetX = e.clientX - parseInt(style.left);
                    //mmm NaN
                    movableWindow.offsetY = e.clientY - (parseInt(style.top) || 0);
                    movableWindow.enable = 1;
                },
                onmouseup: () => movableWindow.enable = 0
            }, [
                make('div', {
                    "color": "#000f",
                    "width": "28px",
                    "height": "28px",
                    "border": "3.5px solid #000f",
                    "display": "flex",
                    "fontWeight": "bold",
                    "alignItems": "center",
                    "paddingTop": "-5px",
                    "borderRadius": "10px",
                    "justifyContent": "center",
                    "cursor": "pointer"
                }, {
                    title: menuLabels[2],
                    innerText: "×",
                    onclick: () => divs.menu.hidden = 1
                })
            ]),
            content = make('div', {
                "width": "100%",
                "height": height + "px",
                "border": "2px solid #000f",
                "borderTop": "2px solid #000f",
                "borderLeft": "2px solid #000f",
                "backgroundColor": "#000c"
            })
        ])
        backbutton = make('div', {
            "color": "#000f",
            "width": "28px",
            "height": "28px",
            "border": "3.5px solid #000f",
            "display": "flex",
            "alignItems": "center",
            "justifyContent": "center",
            "backgroundColor": "#fff8",
            "borderRadius": "10px",
            "cursor": "pointer"
        }, {
            title: menuLabels[1],
            innerText: '<',
            onclick: () => refreshMenu(0)
        });
        title.prepend(backbutton);

        movableWindow.element = menu;
        windows.push(movableWindow);
        menu.hidden = 0;
        divs.menu = menu;
        divs.title = title;
        divs.content = content;
        document.body.append(divs.menu);
        refreshMenu(0);
        applyStyle(divs.menu, { "left": "5px" });
        setTimeout(applyStyle(divs.menu, { top: Math.floor(window.innerHeight - parseInt(divs.content.style.height)) / 2 + 'px' }));
    }

    function createControlToggle(label, toggle, render) {
        let controlButtonDiv = make('div', {
            "width": "60px",
            "height": "30px",
            "border": "4px solid #ffff",
            "display": "flex",
            "position": "relative",
            "alignItems": "center",
            "borderRadius": "7px",
            "justifyContent": "center",
            "cursor": "pointer"
        }, {
            onclick: () => {
                toggle();
                controlButtonDiv.update();
            },
            update: () => {
                let bool = render();
                controlButtonDiv.innerText = bool ? 'On' : 'Off';
                applyStyle(controlButtonDiv, {
                    "backgroundColor": bool ? "#0f0c" : "#f00c"
                });
            }
        });
        controlButtonDiv.update();
        renderFunctions.push(controlButtonDiv.update);
        return createControlBase(label, controlButtonDiv);
    }

    function createControlValue(label, update, render) {
        let style = {
            "width": "30px",
            "height": "30px",
            "border": "3px solid #ffff",
            "display": "flex",
            "position": "relative",
            "fontWeight": "bold",
            "alignItems": "center",
            "borderRadius": "5px",
            "justifyContent": "center",
            "backgroundColor": "#ff0c",
            "cursor": "pointer"
        },
        controlIndicatorDiv = make('div', {
            "color": "#000f",
            "width": "60px",
            "height": "34px",
            "border": "4px solid #ffff",
            "display": "flex",
            "position": "relative",
            "alignItems": "center",
            "marginLeft": "5px",
            "marginRight": "5px",
            "borderRadius": "5px",
            "justifyContent": "center",
            "backgroundColor": "#fffc"
        }, {
            onwheel: E => {
                E.preventDefault();
                update(Math.sign(-E.deltaY));
                controlIndicatorDiv.update();
            },
            update: () => {
                controlIndicatorDiv.innerText = render();
            }
        }),
        controlButtonLeftDiv = make('div', style, {
            innerText: '-',
            onclick: () => {
                update(-1);
                controlIndicatorDiv.update();
            }
        }),
        controlButtonRightDiv = make('div', style, {
            innerText: '+',
            onclick: () => {
                update(1);
                controlIndicatorDiv.update();
            }
        });
        controlIndicatorDiv.update();
        renderFunctions.push(controlIndicatorDiv.update);
        return createControlBase(label, make('div', {
            "display": "flex",
            "alignItems": "center",
            "flexDirection": "row"
        }, {}, [controlButtonLeftDiv, controlIndicatorDiv, controlButtonRightDiv]));
    }

    function createControlBase(label, controlSetting) {
        return make('div', {
            "width": "100%",
            "height": "40px",
            "display": "flex",
            "alignItems": "center",
            "paddingLeft": "5px",
            "paddingRight": "5px",
            "borderBottom": "2px solid #000f",
            "paddingBottom": "0px",
            "justifyContent": "space-between"
        }, {
            title: label[1]
        }, [
            make('div', {}, {
                innerText: label[0]
            }),
            controlSetting
        ]);
    }

    function refreshMenuSelect(append) {
        for (let i = 1; i < menus.length; i++) {
            let menuDiv = make('div', {
                "width": "100%",
                "padding": "5px",
                "alignItems": "center",
                "borderBottom": "2px solid #000f",
                "justifyContent": "center",
                "backgroundColor": "#8888",
                "height": menus.length - 1 == i ? "38px" : "40px"
            }, {
                innerText: menus[i][0],
                onmouseover: () => menuDiv.style.backgroundColor = "#888c",
                onmouseout: () => menuDiv.style.backgroundColor = "#8888",
                onclick: () => {
                    refreshMenu(parseInt(i));
                    currentMenu = parseInt(i);
                }
            });
            append(menuDiv);
        }
    }

    function refreshMenuSpawning(append) {
        let toggles = {
            allowRespawning: ["Allow respawning"],
            pauseSpawnLoop: ["Pause spawn loop"]
        };
        for (let toggle in toggles) {
            let control = createControlToggle(toggles[toggle], () => {
                internalSettings[toggle] = !internalSettings[toggle];
                updateIfNeeded(toggle);
            }, () => internalSettings[toggle]);
            append(control);
        }
        let values = {
            maxPop: ["Max server population"],
            maxBots: ["Max bots to spawn"],
            armorLevel: ["Bot armor level"]
        };
        for (let value in values) {
            let control = createControlValue(values[value], (i) => {
                internalSettings[value] = value == "armorLevel" ? clamp(0, internalSettings[value] + i, 3) : clamp(0,  internalSettings[value] + i, 81);
                updateIfNeeded(value);
            }, () => internalSettings[value]);
            append(control);
        }
    }

    function refreshMenuBots(append) {
        let toggles = {
            aimbotOverride: ["Always use aimbot"]
        };
        for (let toggle in toggles) {
            let control = createControlToggle(toggles[toggle], () => {
                internalSettings[toggle] = !internalSettings[toggle];
                updateIfNeeded(toggle);
            }, () => internalSettings[toggle]);
            append(control);
        }
    }

    function refreshMenuAFKTools(append) {
        let toggles = {
            autoGas: ["Auto Gas Grenade"],
        };
        for (let toggle in toggles) {
            let control = createControlToggle(toggles[toggle], () => cheats[toggle] = 1 - cheats[toggle], () => cheats[toggle]);
            append(control);
        }
    }

    function refreshMenu(menuID) {
        removeChildren(divs.content);
        renderFunctions = [];
        menus[menuID][1](x => divs.content.append(x));
    }

    function removeChildren(element) {
        while (element.hasChildNodes()) element.removeChild(element.lastChild);
    }

    function fixWindowPositions() {
        for (let movableWindow of windows) {
            let element = movableWindow.element,
                rect = element.getBoundingClientRect(),
                style = element.style;
            if (!style.right) {
                applyStyle(element, {
                    "left": Math.max(0, Math.min(window.innerWidth - rect.width, parseInt(style.left))) + 'px',
                    "top": Math.max(0, Math.min(window.innerHeight - rect.height, parseInt(style.top))) + 'px'
                });
            }
        }
    }

    function make(type, style = {}, attributes = {}, children = []) {
        let element = document.createElement(type);
        applyStyle(element, style);
        applyAttrbutes(element, attributes);
        for (let child of children) element.append(child);
        return element;
    }

   function applyAttrbutes(object, attributes) {
        for (let key in attributes) object[key] = attributes[key];
        return object;
    }
    
    function applyStyle(element, style) {
        applyAttrbutes(element.style, style);
    }

    async function getSettings() {
        let res = await fetch(SETTINGS_URL + "/settings");
        let settingsJSON = await res.json();
        remoteSettings = settingsJSON;
        for (let prop in internalSettings) {
            internalSettings[prop] = remoteSettings[prop];
        }
        refreshMenu(currentMenu);
        return;
    }

    async function updateSetting(settingName, value) {
        await fetch(SETTINGS_URL + "/updateSetting", {
            method: "POST",
            body: JSON.stringify({ setting: { name: settingName, value: value } }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        getSettings();
    }

    function updateIfNeeded(settingName) {
        if (internalSettings[settingName] != remoteSettings[settingName]) {
            updateSetting(settingName, internalSettings[settingName]);
        }
    }

    function clamp(minVal, val, maxVal) {
        return isNaN(val) ? minVal : Math.min(maxVal, Math.max(minVal, val));
    }

    //Make gui
    let captchaGenerator = new CaptchaGenerator(CAPTCHA_URL),
        CGState = 0,
        zIndex = 3,
        viewbox = {},
        cursor = {x: 0, y: 0, isPressed: 0, isShooting: 0},
        divs = {
            menu: 0,
            title: 0,
            content: 0,
            backbutton: 0
        },
        windows = [],
        menuLabels = [
            "ε-δ Client",
            "Return to previous menu",
            "Minimize"
        ],
        menuNames = [
            "",
            "Spawn Loop",
            "Bot Settings",
            "AFK Tools"
        ]
        menus = [
            [menuNames[0], refreshMenuSelect],
            [menuNames[1], refreshMenuSpawning],
            [menuNames[2], refreshMenuBots],
            [menuNames[3], refreshMenuAFKTools]
        ],
        currentMenu = 0,
        renderFunctions = [],
        cheats = {
            autoGas: 0
        },
        internalSettings = {
            "mode": "navigate",
            "aimbotOverride": true,
            "blacklist": [],
            "whitelist": ["nitrogem35", "nitrous"],
            "gunPercentages": {
                "Pistol": 100,
                "SMG": 0,
                "Shotgun": 0,
                "Assault": 0,
                "Sniper": 0,
                "LMG": 0
            },
            "color": "green",
            "armorLevel": 0,
            "server": {
                "type": "FFA",
                "city": "Dallas"
            },
            "goal": {
                "x": 35000,
                "y": 35000
            },
            "rangeBuffer": 300,
            "minDist": 1000,
            "nodeSpacing": 250,
            "spawnIntervalMS": 2500,
            "dashboardIntervalMS": 1000,
            "pauseSpawnLoop": false,
            "allowRespawning": true,
            "maxPop": 81,
            "maxBots": 1,
            "maximumPingsInMemory": 8
        },
        remoteSettings = {};

    createMenu(350, 525);
    getSettings();
})();