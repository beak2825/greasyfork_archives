// ==UserScript==
// @name          All Items Unlocked
// @namespace     https://greasyfork.org/users/1064285
// @version       0.2
// @description   Unlocks all possible items in the upgrade bar
// @author        Varkyz
// @match         *://moomoo.io/*
// @match         *://*.moomoo.io/*
// @icon          https://moomoo.io/img/favicon.png?v=1
// @require       https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js
// @license       MIT
// @grant         none
// @run-at        document-end
// @downloadURL https://update.greasyfork.org/scripts/540737/All%20Items%20Unlocked.user.js
// @updateURL https://update.greasyfork.org/scripts/540737/All%20Items%20Unlocked.meta.js
// ==/UserScript==

// https://greasyfork.org/en/scripts/448030
/*
    Original Author: Murka
*/
(function() {
    const {
        msgpack
    } = window;
    const PACKETCODE = {
        SEND: {
            sendUpgrade: "H"
        },
        RECEIVE: {
            setupGame: "C",
            killPlayer: "P",
            updateUpgrades: "U",
            updateItems: "V"
        }
    };
    const UTILS = {
        containsPoint: function(element, x, y) {
            var bounds = element.getBoundingClientRect();
            var left = bounds.left + window.scrollX;
            var top = bounds.top + window.scrollY;
            var width = bounds.width;
            var height = bounds.height;
            var insideHorizontal = x > left && x < left + width;
            var insideVertical = y > top && y < top + height;
            return insideHorizontal && insideVertical;
        },
        mousifyTouchEvent: function(event) {
            var touch = event.changedTouches[0];
            event.screenX = touch.screenX;
            event.screenY = touch.screenY;
            event.clientX = touch.clientX;
            event.clientY = touch.clientY;
            event.pageX = touch.pageX;
            event.pageY = touch.pageY;
        },
        hookTouchEvents: function(element, skipPrevent) {
            var preventDefault = !skipPrevent;
            var isHovering = false;
            // var passive = window.Modernizr.passiveeventlisteners ? {passive: true} : false;
            var passive = false;
            element.addEventListener("touchstart", UTILS.checkTrusted(touchStart), passive);
            element.addEventListener("touchmove", UTILS.checkTrusted(touchMove), passive);
            element.addEventListener("touchend", UTILS.checkTrusted(touchEnd), passive);
            element.addEventListener("touchcancel", UTILS.checkTrusted(touchEnd), passive);
            element.addEventListener("touchleave", UTILS.checkTrusted(touchEnd), passive);

            function touchStart(e) {
                UTILS.mousifyTouchEvent(e);
                window.setUsingTouch(true);
                if (preventDefault) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                if (element.onmouseover) element.onmouseover(e);
                isHovering = true;
            }

            function touchMove(e) {
                UTILS.mousifyTouchEvent(e);
                window.setUsingTouch(true);
                if (preventDefault) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                if (UTILS.containsPoint(element, e.pageX, e.pageY)) {
                    if (!isHovering) {
                        if (element.onmouseover) element.onmouseover(e);
                        isHovering = true;
                    }
                } else {
                    if (isHovering) {
                        if (element.onmouseout) element.onmouseout(e);
                        isHovering = false;
                    }
                }
            }

            function touchEnd(e) {
                UTILS.mousifyTouchEvent(e);
                window.setUsingTouch(true);
                if (preventDefault) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                if (isHovering) {
                    if (element.onclick) element.onclick(e);
                    if (element.onmouseout) element.onmouseout(e);
                    isHovering = false;
                }
            }
        },
        removeAllChildren: function(element) {
            while (element.hasChildNodes()) {
                element.removeChild(element.lastChild);
            }
        },
        generateElement: function(config) {
            var element = document.createElement(config.tag || "div");

            function bind(configValue, elementValue) {
                if (config[configValue]) element[elementValue] = config[configValue];
            }
            bind("text", "textContent");
            bind("html", "innerHTML");
            bind("class", "className");
            for (var key in config) {
                switch (key) {
                    case "tag":
                    case "text":
                    case "html":
                    case "class":
                    case "style":
                    case "hookTouch":
                    case "parent":
                    case "children":
                        continue;
                    default:
                        break;
                }
                element[key] = config[key];
            }
            if (element.onclick) element.onclick = UTILS.checkTrusted(element.onclick);
            if (element.onmouseover) element.onmouseover = UTILS.checkTrusted(element.onmouseover);
            if (element.onmouseout) element.onmouseout = UTILS.checkTrusted(element.onmouseout);
            if (config.style) {
                element.style.cssText = config.style;
            }
            if (config.hookTouch) {
                UTILS.hookTouchEvents(element);
            }
            if (config.parent) {
                config.parent.appendChild(element);
            }
            if (config.children) {
                for (var i = 0; i < config.children.length; i++) {
                    element.appendChild(config.children[i]);
                }
            }
            return element;
        },
        eventIsTrusted: function(ev) {
            if (ev && typeof ev.isTrusted == "boolean") {
                return ev.isTrusted;
            } else {
                return true;
            }
        },
        checkTrusted: function(callback) {
            return function(ev) {
                if (ev && ev instanceof Event && UTILS.eventIsTrusted(ev)) {
                    callback(ev);
                } else {
                    //console.error("Event is not trusted.", ev);
                }
            };
        }
    };
    const items = {
        weapons: [{
            type: 0,
            name: "tool hammer",
            desc: "tool for gathering all resources"
        }, {
            type: 0,
            age: 2,
            name: "hand axe",
            desc: "gathers resources at a higher rate"
        }, {
            type: 0,
            age: 8,
            pre: 1,
            name: "great axe",
            desc: "deal more damage and gather more resources"
        }, {
            type: 0,
            age: 2,
            name: "short sword",
            desc: "increased attack power but slower move speed"
        }, {
            type: 0,
            age: 8,
            pre: 3,
            name: "katana",
            desc: "greater range and damage"
        }, {
            type: 0,
            age: 2,
            name: "polearm",
            desc: "long range melee weapon"
        }, {
            type: 0,
            age: 2,
            name: "bat",
            desc: "fast long range melee weapon"
        }, {
            type: 0,
            age: 2,
            name: "daggers",
            desc: "really fast short range weapon"
        }, {
            type: 0,
            age: 2,
            name: "stick",
            desc: "great for gathering but very weak"
        }, {
            type: 1,
            age: 6,
            name: "hunting bow",
            desc: "bow used for ranged combat and hunting",
            req: ["wood", 4]
        }, {
            type: 1,
            age: 6,
            name: "great hammer",
            desc: "hammer used for destroying structures"
        }, {
            type: 1,
            age: 6,
            name: "wooden shield",
            desc: "blocks projectiles and reduces melee damage"
        }, {
            type: 1,
            age: 8,
            pre: 9,
            name: "crossbow",
            desc: "deals more damage and has greater range",
            req: ["wood", 5]
        }, {
            type: 1,
            age: 9,
            pre: 12,
            name: "repeater crossbow",
            desc: "high firerate crossbow with reduced damage",
            req: ["wood", 10]
        }, {
            type: 1,
            age: 6,
            name: "mc grabby",
            desc: "steals resources from enemies"
        }, {
            type: 1,
            age: 9,
            pre: 12,
            name: "musket",
            desc: "slow firerate but high damage and range",
            req: ["stone", 10]
        }],
        list: [{
            group: {
                id: 0
            },
            name: "apple",
            desc: "restores 20 health when consumed",
            req: ["food", 10]
        }, {
            age: 3,
            group: {
                id: 0
            },
            name: "cookie",
            desc: "restores 40 health when consumed",
            req: ["food", 15]
        }, {
            age: 7,
            group: {
                id: 0
            },
            name: "cheese",
            desc: "restores 30 health and another 50 over 5 seconds",
            req: ["food", 25]
        }, {
            group: {
                id: 1,
                limit: 30
            },
            name: "wood wall",
            desc: "provides protection for your village",
            req: ["wood", 10]
        }, {
            age: 3,
            group: {
                id: 1,
                limit: 30
            },
            name: "stone wall",
            desc: "provides improved protection for your village",
            req: ["stone", 25]
        }, {
            age: 7,
            pre: 4,
            group: {
                id: 1,
                limit: 30
            },
            name: "castle wall",
            desc: "provides powerful protection for your village",
            req: ["stone", 35]
        }, {
            group: {
                id: 2,
                limit: 15
            },
            name: "spikes",
            desc: "damages enemies when they touch them",
            req: ["wood", 20, "stone", 5]
        }, {
            age: 5,
            group: {
                id: 2,
                limit: 15
            },
            name: "greater spikes",
            desc: "damages enemies when they touch them",
            req: ["wood", 30, "stone", 10]
        }, {
            age: 9,
            pre: 7,
            group: {
                id: 2,
                limit: 15
            },
            name: "poison spikes",
            desc: "poisons enemies when they touch them",
            req: ["wood", 35, "stone", 15]
        }, {
            age: 9,
            pre: 7,
            group: {
                id: 2,
                limit: 15
            },
            name: "spinning spikes",
            desc: "damages enemies when they touch them",
            req: ["wood", 30, "stone", 20]
        }, {
            group: {
                id: 3,
                limit: 7
            },
            name: "windmill",
            desc: "generates gold over time",
            req: ["wood", 50, "stone", 10]
        }, {
            age: 5,
            pre: 10,
            group: {
                id: 3,
                limit: 7
            },
            name: "faster windmill",
            desc: "generates more gold over time",
            req: ["wood", 60, "stone", 20]
        }, {
            age: 8,
            pre: 11,
            group: {
                id: 3,
                name: "mill",
                limit: 7
            },
            name: "power mill",
            desc: "generates more gold over time",
            req: ["wood", 100, "stone", 50]
        }, {
            age: 5,
            group: {
                id: 4,
                limit: 1
            },
            type: 2,
            name: "mine",
            desc: "allows you to mine stone",
            req: ["wood", 20, "stone", 100]
        }, {
            age: 5,
            group: {
                id: 11,
                limit: 2
            },
            type: 0,
            name: "sapling",
            desc: "allows you to farm wood",
            req: ["wood", 150]
        }, {
            age: 4,
            group: {
                id: 5,
                limit: 6
            },
            name: "pit trap",
            desc: "pit that traps enemies if they walk over it",
            req: ["wood", 30, "stone", 30]
        }, {
            age: 4,
            group: {
                id: 6,
                limit: 12
            },
            name: "boost pad",
            desc: "provides boost when stepped on",
            req: ["stone", 20, "wood", 5]
        }, {
            age: 7,
            group: {
                id: 7,
                limit: 2
            },
            name: "turret",
            desc: "defensive structure that shoots at enemies",
            req: ["wood", 200, "stone", 150]
        }, {
            age: 7,
            group: {
                id: 8,
                limit: 12
            },
            name: "platform",
            desc: "platform to shoot over walls and cross over water",
            req: ["wood", 20]
        }, {
            age: 7,
            group: {
                id: 9,
                limit: 4
            },
            name: "healing pad",
            desc: "standing on it will slowly heal you",
            req: ["wood", 30, "food", 10]
        }, {
            age: 9,
            group: {
                id: 10,
                limit: 1
            },
            name: "spawn pad",
            desc: "you will spawn here when you die but it will dissapear",
            req: ["wood", 100, "stone", 100]
        }, {
            age: 7,
            group: {
                id: 12,
                limit: 3
            },
            name: "blocker",
            desc: "blocks building in radius",
            req: ["wood", 30, "stone", 25]
        }, {
            age: 7,
            group: {
                id: 13,
                name: "teleporter",
                limit: 2
            },
            name: "teleporter",
            desc: "teleports you to a random point on the map",
            req: ["wood", 60, "stone", 60]
        }]
    };
    let myWEAPONS;
    let myITEMS;
    let keys = {};
    var gameUI = document.getElementById("gameUI");
    var upgradeHolder = document.getElementById("upgradeHolder");
    var upgradeCounter = document.getElementById("upgradeCounter");
    if (upgradeHolder) {
        upgradeHolder.remove();
    }
    if (upgradeCounter) {
        upgradeCounter.remove();
    }
    upgradeHolder = document.createElement("div");
    upgradeHolder.id = "upgradeHolder";
    upgradeHolder.style.width = "100%";
    upgradeHolder.style.position = "absolute";
    upgradeHolder.style.textAlign = "center";
    upgradeHolder.style.top = "10px";
    upgradeCounter = document.createElement("div");
    upgradeCounter.id = "upgradeCounter";
    upgradeCounter.style.width = "100%";
    upgradeCounter.style.position = "absolute";
    upgradeCounter.style.top = "95px";
    upgradeCounter.style.textAlign = "center";
    upgradeCounter.style.fontSize = "24px";
    upgradeCounter.style.color = "#fff";
    if (gameUI) {
        gameUI.appendChild(upgradeHolder);
        gameUI.appendChild(upgradeCounter);
    }
    let init = false;
    let ws = null;

    function initWS() {
        return new Promise(resolve => {
            const oldSend = WebSocket.prototype.send;
            WebSocket.prototype.send = function(...x) {
                oldSend.apply(this, x);
                if (!ws) {
                    ws = this;
                    window.ws = ws;
                    this._send = oldSend;
                    if (!this.iosend) {
                        this.iosend = function(...datas) {
                            const [packet, data] = datas;
                            this._send(msgpack.encode([packet, data]));
                        };
                    }
                    if (!init) {
                        init = true;
                        this.addEventListener("message", e => {
                            if (!e.origin.includes("moomoo.io")) return;
                            const [packet, data] = msgpack.decode(new Uint8Array(e.data));
                            switch (packet) {
                                case PACKETCODE.RECEIVE.setupGame:
                                    myITEMS = [0, 3, 6, 10];
                                    myWEAPONS = [0];
                                    break;
                                case PACKETCODE.RECEIVE.updateUpgrades:
                                    var tmpList = [];
                                    var points = data[0];
                                    var age = data[1];
                                    if (points > 0) {
                                        tmpList.length = 0;
                                        UTILS.removeAllChildren(upgradeHolder);
                                        for (let i = 0; i < items.weapons.length; ++i) {
                                            //items.weapons[i].pre = undefined;
                                            if (items.weapons[i].age == age && (items.weapons[i].pre == undefined || myWEAPONS.indexOf(items.weapons[i].pre) >= 0)) {
                                                let showItemInfo = window.showItemInfo;
                                                let e = UTILS.generateElement({
                                                    id: "upgradeItem" + i,
                                                    class: "actionBarItem",
                                                    onmouseout: function() {
                                                        showItemInfo();
                                                    },
                                                    parent: upgradeHolder
                                                });
                                                e.style.backgroundImage = document.getElementById("actionBarItem" + i).style.backgroundImage;
                                                tmpList.push(i);
                                            }
                                        }
                                        for (let i = 0; i < items.list.length; ++i) {
                                            items.list[i].pre = undefined;
                                            if (items.list[i].age == age && (items.list[i].pre == undefined || myITEMS.indexOf(items.list[i].pre) >= 0)) {
                                                var tmpI = items.weapons.length + i;
                                                let showItemInfo = window.showItemInfo;
                                                let e = UTILS.generateElement({
                                                    id: "upgradeItem" + tmpI,
                                                    class: "actionBarItem",
                                                    onmouseout: function() {
                                                        showItemInfo();
                                                    },
                                                    parent: upgradeHolder
                                                });
                                                e.style.backgroundImage = document.getElementById("actionBarItem" + tmpI).style.backgroundImage;
                                                tmpList.push(tmpI);
                                            }
                                        }
                                        for (var i = 0; i < tmpList.length; i++) {
                                            (function (index, socket) {
                                                var tmpItem = document.getElementById("upgradeItem" + index);

                                                tmpItem.onmouseover = function () {
                                                    if (items.weapons[index]) {
                                                        window.showItemInfo(items.weapons[index], true);
                                                    } else {
                                                        window.showItemInfo(items.list[index - items.weapons.length]);
                                                    }
                                                };

                                                tmpItem.onclick = UTILS.checkTrusted(function () {
                                                    socket.iosend(PACKETCODE.SEND.sendUpgrade, [index]);
                                                });

                                                UTILS.hookTouchEvents(tmpItem);
                                            })(tmpList[i], ws);
                                        }

                                        if (tmpList.length) {
                                            upgradeHolder.style.display = "block";
                                            upgradeCounter.style.display = "block";
                                            upgradeCounter.innerHTML = "SELECT ITEMS (" + points + ")";
                                        } else {
                                            upgradeHolder.style.display = "none";
                                            upgradeCounter.style.display = "none";
                                            window.showItemInfo();
                                        }
                                    } else {
                                        upgradeHolder.style.display = "none";
                                        upgradeCounter.style.display = "none";
                                        window.showItemInfo();
                                    }
                                    break;
                                case PACKETCODE.RECEIVE.updateItems:
                                    if (data[0]) {
                                        if (data[1]) myWEAPONS = data[0];
                                        else myITEMS = data[0];
                                    }
                                    break;
                            }
                        });
                    }
                }
                resolve(this);
            };
        });
    }
    initWS();
})();