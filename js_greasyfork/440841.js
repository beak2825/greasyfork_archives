// ==UserScript==
// @name                MooMoo.io Legit (AutoScroll + Safe heal) + fake keystrokes (for macros)
// @namespace           legit mod for bad people
// @version             1
// @description         none
// @author              Nuro#9999
// @match               *://*.moomoo.io/*
// @grant               none
// @require             https://greasyfork.org/scripts/440839-moomoo-items/code/MooMoo%20Items.js?version=1023778
// @require             https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js?version=1005014
// @downloadURL https://update.greasyfork.org/scripts/440841/MooMooio%20Legit%20%28AutoScroll%20%2B%20Safe%20heal%29%20%2B%20fake%20keystrokes%20%28for%20macros%29.user.js
// @updateURL https://update.greasyfork.org/scripts/440841/MooMooio%20Legit%20%28AutoScroll%20%2B%20Safe%20heal%29%20%2B%20fake%20keystrokes%20%28for%20macros%29.meta.js
// ==/UserScript==

alert("join our discord! discord.gg/NMS3YR9Q5R")

/*
        ==Credits==
 * anti invis = idk but not me
 * keystrokes = meowmeow (mmrb)
 * anything else = me

       ==Guide==
 * if you scroll down a bit, you'll see a configuration Object. Guides should be there.
 * for the hat macros, do not change the ID.
 * bugs and anything else can be reported to me.

     ==Contact==
 * Discord = Nuro#9999
 * Website = nuro.wtf
 * GitHub = https://github.com/NuroC
 * email  = business@nuro.wtf

*/

class MooMoo {
    static get hotkeys () {
        return {
            hat_hotkeys: {
                bull_hat: {
                    id: 7,
                    key: "c", // bull hat key
                    scroll: {
                        toggle: true,
                        time: 0, // time in ms how long the scroll should take, leave it at 0 if it should go instant
                        top: 1450
                    },
                },
                soldier_helmet: {
                    id: 6,
                    key: "shift", // soldier helmet key
                    scroll: {
                        toggle: true,
                        time: 0,
                        top: 1200
                    },
                },
                tank_gear: {
                    id: 40,
                    key: "z", // tank gear key
                    scroll: {
                        toggle: true,
                        time: 0,
                        top: 2050
                    },
                },
                turret_hat: {
                    id: 53,
                    key: "r", // turret hat key
                    scroll: {
                        toggle: true,
                        time: 0,
                        top: 1850
                    },
                },
            },
            macro_keys: {
                spike: " ",
                mill: "n",
                trap: "f",
                food: 'q'
            },
            algs: {
                insta_kill: "g" // not added yet
            },
            settings:{
                heal: {
                    speed: 140, // time in ms from hitdata to prevent clown hat
                    hp: 100, // if under that up heal up
                    multiplier: 2 // multiplies the healing, means 2 would heal 2 times. (basically doubleheal)
                }
            }

        }
    }
    static set forcedisablecps(arg) {
        this.forcedisable = arg
    }
    static fixweaponswap() {
        let keys = ['1', '2']
        let local = this;
        let items = window.items
        let spammers = this.spammers
        for(let i in keys) {
            document.addEventListener('keydown', e => {
                if(document.activeElement.type == "text") return;
                if(e.key == keys[i]) {
                    switch(keys[i]) {
                        case '1':
                            for(let i = 0; i < 10; i++) {
                                setTimeout(() => {
                                    local.sendws(["5", [items.primary, true]])
                                }, i*2)
                            }
                            break;
                        case '2':
                            for(let i = 0; i < 10; i++) {
                                setTimeout(() => {
                                    local.sendws(["5", [items.secondary, true]])
                                }, i*2)
                            }
                    }
                }
            })
        }
    }
    static init(arg) {
        this.fixweaponswap()
        this.hathotkeys()
        this.antiinvis();
        this.canvas = document.getElementById("gameCanvas");
        this.initplayer();
        this.getkeys();
        this.setmouse()
        this.initspammer();
        this.spammers = {};
        this.result = "";
        this.initcps();
        this.cps = 0;
        this.doc = document;
        this.initlisteners;
        this.id = `#${arg.match(/d="?g(.*)?I/g)[0].match(/(?=g).*(?=)/)[0]}`
        window.addEventListener("load", function(event) {
            MooMoo.initHTML;
        })
    }
    static get getalpha() {
        this.alpha = Array.from(Array(26)).map((e, i) => i + 65).map((x) => String.fromCharCode(x));
        for(let i in this.alpha) {
            this.result += this.alpha[i]
        }
        return this.result.toLocaleLowerCase();
    }
    static getkeys() {
        this.lts = new Array();
        this.lts.push(this.getalpha.match(/v([\s\S]*)w/g)[0].split("v")[1])
        this.lts.push(this.getalpha.match(/(.+(?=[b])|(?<=str).+)/g)[0].split('d')[2].split('a')[0])
        this.lts.push(this.getalpha.match(/\m(.*?)\o/))[0]
        this.lts.push(this.getalpha.match(/(?=d).*(?=e)/g)[0].split("c")[1].split('')[0])
    }
    static get initlisteners() {
        this.doc.onkeydown = function(e) {
            if(document.activeElement.type == "text") return;
            MooMoo.handleKeyDown(e)
        };
        this.doc.onkeyup = function(e) {
            if(document.activeElement.type == "text") return;
            MooMoo.handleKeyUp(e)
        }
    }
    static antiinvis() {
        CanvasRenderingContext2D.prototype.rotatef = CanvasRenderingContext2D.prototype.rotate
        CanvasRenderingContext2D.prototype.rotate = function(e){
            if(Math.abs(e) > 1e300){
                e = Math.atan2(Math.cos(e), Math.sin(e));
                this.globalAlpha = 0.5;
                this.rotatef(e);
            }else{
                this.rotatef(e);
            }
        };
    }
    static equipHat(a) {
        window.storeEquip(a)
    }
    static get() {
        return new Promise(resolve => {
            fetch(arguments[0]).then(res => res.text()).then(res => {
                return resolve(res);
            });
        });
    }
    static ioinit() {
        this.width = this.canvas.clientWidth;
        this.height = this.canvas.clientHeight;
        this.canvas.addEventListener("mousemove", e => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }
    static setws (args) {
        this.ws = args
    }
    static get initHTML() {
        this.appendMenu();
    }
    static initplayer() {
        this.player = {
            id: null,
            weapon: null
        }
    }
    static setmouse() {
        this.mouse = {
            x: null,
            y: null
        }
    }
    static checkelement(e) {
        return (e.offsetParent !== null);
    }
    static handleHit(arg) {
        switch(this.decode(arg)[1][0]) {
            case 1:
                this.handleCPS()
        }
    }
    static handleCPS() {
        this.initcps();
        this.cps++
        setTimeout(() => {
            this.initcps();
            this.cps--
        }, 1000)
    }
    static sendws(sender) {
        this.ws.send(new Uint8Array(Array.from(msgpack.encode(sender))));
    }
    static getnormalangle() {
        return Math.atan2(this.mouse.y - this.height / 2, this.mouse.x - this.width / 2)
    }
    static hit(angle) {
        this.sendws(["c", [1, angle]]);
        this.sendws(["c", [0, angle]]);
    }
    static placeitem(id, angle = this.getnormalangle()) {
        this.sendws(["5", [id, null]]);
        this.hit(angle)
        this.createfakeclick()
        this.sendws(["5", [this.player.weapon, true]]);

    }
    static placefood(id) {
        this.sendws(["5", [id, null]]);
        this.hit(this.getnormalangle())
        this.createfoodpress();
        this.sendws(["5", [this.player.weapon, true]]);
    }
    static item1 (data) {
        if(!this.player.id) {
            this.player.id = data[1];
            console.log(this.player)
        }
    }
    static updateplayer(data) {
        this.rndata = data
        for (let i = 0; i < this.rndata[1].length / 13; i++) {
            this.playerInfo = this.rndata[1].slice(13 * i, 13 * i + 13);
            if (this.playerInfo[0] == this.player.id) {
                this.player.weapon = this.playerInfo[5];
            }
        }
    }
    static doautoheal(data) {
        let items = window.items
        data[2] < this.hotkeys.settings.heal.hp && setTimeout(() => {
            for(let i = 0; i < this.hotkeys.settings.heal.multiplier; i++) {
                this.placefood(items.food);
            }
        }, this.hotkeys.settings.heal.speed);
    }
    static getwsmessage(message) {
        let temp = this.decode(new Uint8Array(message.data));
        let data;
        if (temp.length > 1) {
            data = [temp[0], ...temp[1]];
            if (data[1] instanceof Array) {
                data = data;
            }
        } else {
            data = temp;
        }
        let item = data[0];
        if (!data) {
            return
        };
        if (item === "io-init") {
            this.ioinit()
        }
        if (item == "1") {
            this.item1(data)
        }
        if (item == "33") {
            this.updateplayer(data)
        }
        switch(item) {
            case 't':
                console.log(data);
        }
        if (item == "h" && data[1] == this.player.id) {
            this.doautoheal(data)
        }
    }
    static decode(arg) {
        return msgpack.decode(arg)
    }
    static initspammer() {
        this.spammers = {}
        this.spammers.spiker = this.spammer(this.hotkeys.macro_keys.spike, () => {this.placeitem(window.items.spike)}, 0);
        this.spammers.trap = this.spammer("f", () => {this.placeitem(window.items.trap)}, 0);
        this.spammers.mill = this.spammer("n", () => {this.placeitem(window.items.mill)}, 0);
        this.spammers.food = this.spammer("q", () => {this.placeitem(window.items.food)}, 0);
        let spammers = this.spammers;

        document.addEventListener('keydown', (e) => {
            if (document.activeElement.id.toLocaleLowerCase() !== 'chatbox' && document.activeElement.id.toLocaleLowerCase() !== 'mainMenu') {
                spammers.spiker.start(e.key);
                spammers.trap.start(e.key);
                spammers.mill.start(e.key);
                spammers.food.start(e.key);
            }
        });

        document.addEventListener('keyup', (e) => {
            if(document.activeElement.type == "text") return;
            spammers.spiker.stop(e.key);
            spammers.trap.stop(e.key);
            spammers.mill.stop(e.key);
            spammers.food.stop(e.key);
        });
    }
    static append() {
        $(this.id).append(arguments[0])
    }
    static getelement() {
        return document.getElementById(arguments[0])
    }
    static initcps() {
        if(!this.getelement("cpsdisplay")) return;
        this.getelement("cpsdisplay").textContent = "CPS: " + this.cps
    }
    static createfakeclick() {
        setTimeout(() => {
            MooMoo.addAttribute("kdisp-RButton")
            setTimeout(() => {
                MooMoo.deleteAttribute("kdisp-RButton")
            }, 50)
        }, 50)
    }
    static createfakeclick() {
        setTimeout(() => {
            MooMoo.addAttribute("kdisp-RButton")
            setTimeout(() => {
                MooMoo.deleteAttribute("kdisp-RButton")
            }, 50)
        }, 50)
    }
    static handleKeyUp(e) {
        switch(e.key.toLowerCase()) {
            case "w":
                this.deleteAttribute("kdisp-moveUp")
                break;
            case "a":
                this.deleteAttribute("kdisp-moveLeft")
                break;
            case "s":
                this.deleteAttribute("kdisp-moveDown")
                break;
            case "d":
                this.deleteAttribute("kdisp-moveRight")
                break;
        }
    }
    static handleKeyDown(e) {
        switch (e.key.toLowerCase()) {
            case "w":
                this.addAttribute("kdisp-moveUp");
                break;
            case "a":
                this.addAttribute("kdisp-moveLeft");
                break;
            case "s":
                this.addAttribute("kdisp-moveDown");
                break;
            case "d":
                this.addAttribute("kdisp-moveRight");
        }
    }
    static smoothscroll(scrolltop, time) {
        $('#storeHolder').animate({
            scrollTop: scrolltop
        }, time);
    }
    static hathotkeys() {
        let hotkeys = this.hotkeys.hat_hotkeys
        let locale = this;
        for(let i in this.hotkeys.hat_hotkeys) {
            document.addEventListener('keydown', e => {
                if(document.activeElement.type == "text") return;
                if(e.key.toLowerCase() == hotkeys[i].key) {
                    window.storeEquip(hotkeys[i].id)
                    if(!hotkeys[i].scroll.toggle) return;
                    locale.smoothscroll(hotkeys[i].scroll.top, hotkeys[i].scroll.time)
                }
            })
        }
    }
    static spammer(pc, value, duration) {
        var is = function prop_by_type(type, def) {
            return type == def;
        };
        var get4Parity = function doSplay(t, e) {
            return t === e;
        };
        var NED = "chatbox";
        var a = false;
        var i = void 0;
        return {
            start : function init(orig) {
                var wrap = function canUserAccessObject(cb, user) {
                    return cb(user);
                };
                if (is(orig, pc) && NED !== document.activeElement.id.toLowerCase()) {
                    a = true;
                    if (get4Parity(i, void 0)) {
                        i = setInterval(function() {
                            value();
                            if (!a) {
                                wrap(clearInterval, i);
                                i = void 0;
                            }
                        }, duration);
                    }
                }
            },
            stop : function indexOfIdentical(key) {
                if (is(key, pc) && document.activeElement.id.toLowerCase() !== NED) {
                    a = false;
                }
            }
        };
    }
    ;
    static createfoodpress() {
        setTimeout(() => {
            this.addAttribute("kdisp-food")
            setTimeout(() => {
                this.deleteAttribute("kdisp-food")
            }, 50)
        }, 50)
        setTimeout(() => {
            this.addAttribute("kdisp-RButton")
            setTimeout(() => {
                this.deleteAttribute("kdisp-RButton")
            }, 50)
        }, 50)
    }
    static addAttribute() {
        this.getelement(arguments[0]).style['background-color'] = "rgba(0,0,0,.9)"
    }
    static deleteAttribute() {
        this.getelement(arguments[0]).style['background-color'] = "rgba(0,0,0,.5)"
    }
    static appendMenu() {
        this.append(`<div id="keyDisplay" style=""> <div id="keyDisplayGrid"> <div class="key" id="kdisp-food">Q</div><div class="key" id="kdisp-moveUp">W</div><div class="key" id="kdisp-food2">3</div><div class="key" id="kdisp-moveLeft">A</div><div class="key" id="kdisp-moveDown">S</div><div class="key" id="kdisp-moveRight">D</div><div class="key big" id="kdisp-hit"> </div><div class="key mouse" id="kdisp-LButton"></div><div class="key mouse" id="kdisp-RButton"></div><div class="key mouse mega" id="kdisp-0"></div></div><div id="cpsdisplay" class="disptext">CPS: 0</div></div>`)
        this.append(`<style>#keyDisplay{position:absolute;top:1rem;left:1rem}#keyDisplay #keyDisplayGrid{display:grid;grid-template-columns:4rem 4rem 4rem;grid-template-rows:4rem 4rem 4rem;gap:.3rem .3rem;grid-template-areas:"q w e lb rb" "a s d ms ms" "sp sp sp ms ms"}#keyDisplay #keyDisplayGrid div.key{width:4rem;height:4rem;box-sizing:border-box;background-color:rgba(0,0,0,.5);color:#fff;border-radius:6px;font-size:3rem;text-align:center;display:block;padding-top:.3rem}#keyDisplay #keyDisplayGrid div.key.big{width:calc((4rem * 3) + (.3rem * 2))}#keyDisplay #keyDisplayGrid div.key.mega{width:calc((4rem * 2) + .3rem);height:calc((4rem * 2) + .3rem)}#keyDisplay #keyDisplayGrid div.key.clicked{background-color:rgba(0,0,0,.9)}#keyDisplay .disptext{color:var(--main);font-size:2rem;width:calc((4rem * 3) + (.3rem * 2))}#kdisp-food{grid-area:q}#kdisp-moveUp{grid-area:w}#kdisp-autoAttack{grid-area:e}#kdisp-moveLeft{grid-area:a}#kdisp-moveDown{grid-area:s}#kdisp-moveRight{grid-area:d}#kdisp-hit{grid-area:sp}#kdisp-LButton{grid-area:lb}#kdisp-RButton{grid-area:rb}#kdisp-0{grid-area:ms}</style>`)

    }
}

(async() => {
    const game = await MooMoo.get(document.location.href)
    MooMoo.init(game)
    var ws;
    WebSocket.prototype._send = WebSocket.prototype.send;
    WebSocket.prototype.send = function(m) {
        if(MooMoo.decode(m)[0] == "c") { MooMoo.handleHit(m)}
        if (!ws) {
            document.ws = this;
            ws = this;
            this.addEventListener('message', function(message) {
                MooMoo.setws(this)
                MooMoo.getwsmessage(message)
            });
        }
        this._send(m);
    };

})()



