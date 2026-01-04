// ==UserScript==
// @name         2k09__ Bot Mode V-0.1
// @namespace    -
// @version      0.1
// @description  -
// @author       2k09__
// @match        https://sploop.io/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487962/2k09__%20Bot%20Mode%20V-01.user.js
// @updateURL https://update.greasyfork.org/scripts/487962/2k09__%20Bot%20Mode%20V-01.meta.js
// ==/UserScript==

(function() {
    'use strict'

 alert('||~~ Commands: ||| !md -ab = AddBot ||| !md -rb ~~||');
!~function(
$ = document.querySelector.bind(document),
 botID = 0,
 bots = [],
 isBot = (window.location !== window.parent.location),
 playerID, playerX, playerY,
 ownerX, ownerY,
 touchStart = {x: 0, y: 0},
 keys = {}, weaponKey = "1"
) {

    class Sploop {
        static newKeyEvent(type) {
            return function (eventObj) {
                const { key, code } = eventObj;
                window.KeyboardEvent = Object;
                window.getEvents(type)[type == "keydown" ? 1 : 0].listener({key: key, code: code, isTrusted: 1, target: document.body, preventDefault: () => null});
                window.KeyboardEvent = KeyBoardEvent;
            };
        }
        static key = {
            down: this.newKeyEvent("keydown"),
            up: this.newKeyEvent("keyup"),
            press(eventObj) {
                Sploop.newKeyEvent("keydown")(eventObj);
                Sploop.newKeyEvent("keyup")(eventObj);
            }
        };
        static foodPlace() {
            //alert("QQQ")
            this.key.press({code: "KeyQ"});
            this.key.press({code: "Space"});
            this.key.press({key: weaponKey});
        }
        static spikePlace() {
            //alert("QQQ")
            this.key.press({code: "KeyR"});
            this.key.press({code: "Space"});
            this.key.press({key: weaponKey});
        }
        static trapPlace() {
            //alert("QQQ")
            this.key.press({code: "KeyF"});
            this.key.press({code: "Space"});
            this.key.press({key: weaponKey});
        }
        static newTouchEvent = function(type) {
            return function (eventObj) {
                const { x, y, id } = eventObj;
                $("#game-canvas").getEvents(type)[0].listener({changedTouches: [{identifier: id, pageX: x, pageY: y}], preventDefault: () => null, stopPropagation: () => null});
            };
        };
        static touch = {
            start: this.newTouchEvent("touchstart"),
            move: this.newTouchEvent("touchmove"),
            end: this.newTouchEvent("touchend")
        }

        static spawn(name) {
            $("#nickname").value = name;
            $("#play").getEvents("click")[0].listener();
            $("#nickname").value = localStorage.getItem("nickname")||"";
        };

        static changeServer(serverID) {
            $("#server-select").options[0].setAttribute("region", serverID)
            $("#server-select").selectedIndex = 0;
            $("#server-select").getEvents("change")[0].listener();
        };
    };
    window.Sploop = Sploop;


    window.addEventListener("load", ()=> (Object.keys(window.getEvents()).length === 0) && (window.onbeforeunload && (window.onbeforeunload = null), window.location.reload()));

    WebSocket.prototype._send = WebSocket.prototype.send;
    WebSocket.prototype.send = function() {
        if(!isBot) {
            for(let bot of bots) {
                /*
				ko: 11, //somethingOnBegin
				Uo: 6, //moveByBitmask
				yo: 13, //changeAIM
				Eo: 2, //selectItemByID
				Bo: 19, //attack
				Co: 18, //stopAttack
				zo: 10, //spawn
				Do: 20, //scytheUpgrade
				xo: 0, //selectItemByType
				Lo: 5,//equipHat
				Fo: 7, //sendChat
				Oo: 14, //upgrade
				jo: 12, //noting
				So: 3, //pingStuff
				Po: 23, //autoHit
				Vo: 1, //moveToDir
				No: 15, //removeMoveDir
				Ho: 9, //touchStart
				Wo: 4, //noting
				Go: 8, //touchEnd
				Qo: 24, //leaveClan
				Yo: 21, //joinInClan
				qo: 17, //acceptDecline
				Zo: 25, //kick
				Xo: 22, //createClan
				*/
                if(![22, 25, 17, 3, 10, 11].includes(arguments[0][0])) (bot.contentWindow.ws || this)._send(...arguments);
            }
        }
        this._send(...arguments);
        if(this.HOOKED) return;
        this.HOOKED = true;
        window.ws = this;
        var botSpwned = false;
        this.addEventListener("message", (msg)=>{
            const d = ("string" != typeof msg.data ? new Uint8Array(msg.data) : JSON.parse(msg.data))
            if(d[0] == 35) {
                if(isBot && !playerID) Sploop.touch.start({id: 1000, x: innerWidth/4, y: innerHeight/2})
                playerID = d[1];
            }
            if(d[0] == 20) {
                for(let i = 1; i < d.byteLength; i += 18) {
                    const id = d[i + 2] | d[i + 3] << 8;
                    const x = d[i + 4] | d[i + 5] << 8;
                    const y = d[i + 6] | d[i + 7] << 8;
                    if(playerID == id) {
                        playerX = x;
                        playerY = y;
                        if(!isBot) {
                            for(let bot of bots) bot.isLoaded && bot.contentWindow.updateOwnerPosition(x, y);
                        }
                    }
                }
                if(isBot) {
                    !botSpwned && (Sploop.spawn( "2k09__Bot", (botSpwned=1)))
                }
            }
        });
        if(!isBot) {
            this.rg = this.url.split("//")[1].split(".sploop")[0].toLocaleUpperCase();
            for(let bot of bots) {
                bot.contentWindow.changeServer(this.rg);
            }
        }
    }

    isBot && (
        window.onload = ()=> initBot(),
        Object.defineProperty(Object.prototype, "region", {
            get: () => window.ownerServer,
            set: () => true,
            configurable: true
        })
    );
    function initBot() {

        window.changeServer = function(serverID) {
            Sploop.changeServer(serverID);
        };

        window.updateOwnerPosition = function(x, y) {
            ownerX = x;
            ownerY = y;
        }

        setInterval(()=>{
            const angle = Math.atan2(ownerY - playerY, ownerX - playerX);
            if (Math.sqrt(Math.pow(((playerX - ownerX)), 2) + Math.pow(((playerY - ownerY)), 2)) > 185) {
                Sploop.touch.start({id: 1000, x: innerWidth/4, y: innerHeight/2})
                Sploop.touch.move({id: 1000, x: innerWidth/4+50*Math.cos(angle), y: innerHeight/2+50*Math.sin(angle)});
            }else{
                Sploop.touch.end({id: 1000, x: innerWidth/4, y: innerHeight/2})
            }
        });

        const onDeathCallback = function(changedList) {
            const display = changedList[0].target.style.display;
            if(display == "flex") Sploop.spawn("2k09__Bot");
        };
        const deathChecker = new MutationObserver(onDeathCallback);
        deathChecker.observe($("#homepage"), {attributes: true, attributeFilter: ["style"]});
    };




    !isBot && (window.onload = ()=> initClient());
    function initClient() {

        function createBot(id) {
            const div = document.createElement("div");
            div.innerHTML = `<iframe id="bot${id}" src="https://sploop.io" width="300" height="600" frameborder="0" scrolling="no" allowfullscreen="true" style="width: 300px; height: 200px; margin: 0; padding: 0; border: 0; position: absolute; top: 0; left: 0"></iframe>`;
            const iframe = div.firstChild;
            document.body.append(iframe);
            iframe.contentWindow.ownerServer = $("#server-select").selectedOptions[0].getAttribute("region");
            iframe.onload = ()=>{iframe.isLoaded = true};
            return iframe;
        };
        let placementkeys = {
            spike: false,
            trap: false
        };
        setInterval(() => {
        if(placementkeys.spike) Sploop.spikePlace()
        if(placementkeys.trap) Sploop.trapPlace()
        }, 20);
        window.addEventListener("keydown", function(e) {
            if(e.code == "KeyV") placementkeys.spike = true;
            if(e.code == "KeyF") placementkeys.trap = true;
            if(!keys[e.keyCode]) {
                keys[e.keyCode] = 1;
                if(e.code == "Enter" && window.chat && window.chat.value != '') {
                    if(window.chat.value == "!md -ab") bots.push(createBot(bots.length))
                    if(window.chat.value == "!md -rb") {
                        for(let bID in bots) $(`#bot${bID}`).remove()
                        bots.length = 0
                    }
                    if(window.chat.value.split(" ")[0] == "/close") {
                        const id = window.chat.value.split(" ")[1] - 1
                        if(!bots[id]) return;
                        $(`#bot${id}`).remove()
                        for(let bID in bots) {
                            if(bID > id && bID != id) $(`#bot${bID}`).id = `bot${bID-1}`
						}
                        bots.splice(id, 1)
                    }
                }
            }
        });
        document.addEventListener("keyup", (e) => {
            if(e.code == "KeyV") placementkeys.spike = false;
            if(e.code == "KeyF") placementkeys.trap = false;
            if(keys[e.keyCode]) {
                keys[e.keyCode] = 0;
            };
        });
    };

    (function autoHeal() {
        let allies = [], hp;
        const { fillRect, clearRect } = CanvasRenderingContext2D.prototype;
        CanvasRenderingContext2D.prototype.clearRect = function () {
            if (this.canvas.id === "game-canvas") allies = [];
            return clearRect.apply(this, arguments);
        };

        CanvasRenderingContext2D.prototype.fillRect = function (x, y, width, height) {
            if(this.fillStyle == "#a4cc4f") {
                allies.push({x: x + 45, y: y - 70, hp: Math.round((width / 95) * 100)});
                if(allies.length == 1) hp = allies[0].hp;
            }
            fillRect.apply(this, arguments);
        };

        window.addEventListener("keydown", function(e) {
            if(["1", "2"].includes(e.key)) weaponKey = e.key;
        });

        function ah() {
            function getDelay(hp) {
                var delay = 200;
                if(hp < 90) delay = 130;
                if(hp < 74) delay = 60;
                if(hp < 36) delay = 45;
                return delay;
            };
            if(hp < 100) Sploop.foodPlace();
            setTimeout(()=>{ah()}, getDelay(hp));
        }
        ah();
    })();

    (function hookEvents() {
        _setTimeout = setTimeout; console._log = console.log; KeyBoardEvent = KeyboardEvent;
        EventTarget.prototype._addEventListener = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function(event, handler, c) {
            if (c==undefined) c=false;
            this._addEventListener(event,handler,c);
            if (!this.eventListenerList) this.eventListenerList = {};
            if (!this.eventListenerList[event]) this.eventListenerList[event] = [];
            this.eventListenerList[event].push({listener:handler,options:c});
        };
        EventTarget.prototype.getEvents = function(event) {
            if (!this.eventListenerList) this.eventListenerList = {};
            if (event==undefined) return this.eventListenerList;
            return this.eventListenerList[event];
        };

        let array = [HTMLElement.prototype, window, document];
        for(let obj of array) {
            for(let prop in obj) {
                if(!prop.startsWith("on")) continue;
                Object.defineProperty(obj, prop, {
                    get() {
                        return this["_" + prop];
                    },
                    set(value) {
                        this["_" + prop] = value;
                        if(prop == "onbeforeunload") return value;
                        this.addEventListener(prop.split("on")[1], value);
                    }
                });
            }
        }
    })();
}()
})();