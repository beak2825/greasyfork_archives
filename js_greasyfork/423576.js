// ==UserScript==
// @name Krunker  Dogeware - by The Gaming Gurus
// @description   The most advanced krunker cheat
// @version       3.7.4
// @author        SkidLamer - From The Gaming Gurus
// @supportURL    https://skidlamer.github.io/wp
// @homepage      https://skidlamer.github.io/
// @iconURL       https://i.imgur.com/MqW6Ufx.png
// @namespace     https://greasyfork.org/users/704479
// @match         *://krunker.io/*
// @exclude       *://krunker.io/editor*
// @exclude       *://krunker.io/social*
// @run-at        document-start
// @grant         none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/423576/Krunker%20%20Dogeware%20-%20by%20The%20Gaming%20Gurus.user.js
// @updateURL https://update.greasyfork.org/scripts/423576/Krunker%20%20Dogeware%20-%20by%20The%20Gaming%20Gurus.meta.js
// ==/UserScript==

/* eslint-env es6 */
/* eslint-disable curly, no-undef, no-loop-func, no-return-assign, no-sequences */

(function(dogStr, dog) {

    function Log() {
        this.info = (str, args = []) => this.log('info', str, args);
        this.warn = (str, args = []) => this.log('warn', str, args);
        this.error = (str, args = []) => this.log('error', str, args);
        this.log = (level, str, args) => {
            let colour = [];
            switch(level) {
                case 'info':colour=["#07a1d5", "#6e07d5"];break;
                case 'error':colour=["#d50707", "#d53a07"];break;
                case 'warn':colour=["#d56e07", "#d5d507"];break;
            }
            console.log('%c '.concat('[ ', level.toUpperCase(), ' ] '), [
                `background: linear-gradient(${colour[0]}, ${colour[1]})`
                , 'border: 1px solid #3E0E02'
                , 'color: white'
                , 'display: block'
                , 'text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3)'
                , 'box-shadow: 0 1px 0 rgba(255, 255, 255, 0.4) inset, 0 5px 3px -5px rgba(0, 0, 0, 0.5), 0 -13px 5px -10px rgba(255, 255, 255, 0.4) inset'
                , 'line-height: 12px'
                , 'text-align: center'
                , 'font-weight: bold'
            ].join(';'))
            if (args.length) console.log(str, args);
            else console.log(str);
        }
    } var log = new Log();

    class Dogeware {
        constructor() {
            dog = this;
            this.token = null;
            this.gameJS = null;
            this.generated = false;
            console.dir(this);
            this.settings = Object.assign({}, {
                aimbot: 1,
                superSilent: true,
                AImbot: true,
                frustumCheck: false,
                weaponZoom: 1.0,
                wallbangs: true,
                alwaysAim: false,
                pitchHack: 0,
                thirdPerson: false,
                autoReload: false,
                speedHack: false,
                rangeCheck: false,
                alwaysTrail: false,
                spinAimFrames: 10,
                animatedBillboards: false,
                esp: 1,
                espFontSize: 10,
                tracers: false,
                showGuiButton: true,
                awtv: false,
                uwtv: false,
                forceUnsilent: false,
                bhop: 0,
                spinBot: false,
                markTarget: true,
                skinHack: false,
                aimOffset: 0,
                aimNoise: 0,
                keybinds: true,
                antikick: true,
                fovbox: false,
                drawFovbox: true,
                fovBoxSize: 1,
                guiOnMMB: false,
                hideAdverts: false,
                hideStreams: false,
                hideMerch: false,
                hideNewsConsole: false,
                hideCookieButton: false,
                chams: false,
                chamsCol: 1,
                wireframe: false,
                kpalCSS: true,
                customCSS: "",
                teamChams: false,
                autoNuke: false,
                chamsInterval: 500,
                preventMeleeThrowing: false,
                //autoSwap: false,
                forceNametagsOn: false,
                aimbotRange: 0,
            });
            this.state = Object.assign({}, {
                bindAimbotOn: true,
                quickscopeCanShoot: true,
                spinFrame: 0,
                pressedKeys: new Set(),
                spinCounter: 0,
                activeTab: 0,
                nameTags: false,
                frame: 0
            });
            this.gaybow = 0;
            this.colors = {
                White: "#FFFFFF",
                Black: "#000000",
                Purple: "#9400D3",
                Pink: "#FF1493",
                Blue: "#1E90FF",
                DarkBlue: "#0000FF",
                Aqua: "#00FFFF",
                Green: "#008000",
                Lime: "#7FFF00",
                Orange: "#FF8C00",
                Yellow: "#FFFF00",
                Red: "#FF0000",
            }
            this.vars = {};
            this.GUI = {};
            try {
                this.onLoad();
            } catch (e) {
                console.error(e);
                console.trace(e.stack);
            }
        }

        onLoad() {

            this.waitFor(_=>document.documentElement instanceof window.HTMLElement).then(_=>{
                this.iframe();
            })
            this.createObservers();
            this.defines();
            localStorage.kro_setngss_json ? Object.assign(this.settings, JSON.parse(localStorage.kro_setngss_json)) :
            localStorage.kro_setngss_json = JSON.stringify(this.settings);
            this.createListeners();
            this.waitFor(_=>this.token).then(_ => {
                if (!this.token) location.reload();
                this.version = /\['exports']\['gameVersion']='(\d+\.\d+\.\d+)',/.exec(this.gameJS)[1];
                if ( this.isElectron() || !this.isDefined(GM) ) {
                    const loader = new Function("WP_fetchMMToken", "Module", this.gamePatch());
                    loader(new Promise(res=>res(this.token)), { csv: async () => 0 });
                } else if (GM.info.script.version !== this.version) {
                    alert("This Script Needs Updating by Krunker Extra, visit Krunker Extra On YouTube");
                    return window.location.assign("https://skidlamer.github.io/wp");
                } else {
                    const loader = new Function("WP_fetchMMToken", "Module", this.gamePatch());
                    loader(new Promise(res=>res(this.token)), { csv: async () => 0 });
                }
                return this.hooking();
            })
        }

        isType(item, type) {
            return typeof item === type;
        }

        isDefined(item) {
            return !this.isType(item, "undefined") && item !== null;
        }

        objectHas(obj, arr) {
            return arr.some(prop => obj.hasOwnProperty(prop));
        }

        createElement(type, html, id) {
            let newElement = document.createElement(type)
            if (id) newElement.id = id
            newElement.innerHTML = html
            return newElement
        }

        getVersion() {
            //const elems = document.getElementsByClassName('terms');
            //const version = elems[elems.length - 1].innerText;
            return this.version//version;
        }

        isElectron() {
            // Renderer process
            if (typeof window !== 'undefined' && typeof window.process === 'object' && window.process.type === 'renderer') {
                return true;
            }

            // Main process
            if (typeof process !== 'undefined' && typeof process.versions === 'object' && !!process.versions.electron) {
                return true;
            }

            // Detect the user agent when the `nodeIntegration` option is set to true
            if (typeof navigator === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.indexOf('Electron') >= 0) {
                return true;
            }

            return false;
        }

        saveAs(name, data) {
            let blob = new Blob([data], {
                type: 'text/plain'
            });
            let el = window.document.createElement("a");
            el.href = window.URL.createObjectURL(blob);
            el.download = name;
            window.document.body.appendChild(el);
            el.click();
            window.document.body.removeChild(el);
        }

        saveScript() {
            this.fetchScript().then(script => {
                this.saveAs("game_" + this.getVersion() + ".js", script)
            })
        }

        gamePatch() {
            let entries = {
                inView: {
                    regex: /(\w+\['(\w+)']\){if\(\(\w+=\w+\['\w+']\['position']\['clone']\(\))/,
                    index: 2
                },
                procInputs: {
                    regex: /this\['(\w+)']=function\((\w+),(\w+),\w+,\w+\){(this)\['recon']/,
                    index: 1
                },
                aimVal: {
                    regex: /this\['(\w+)']-=0x1\/\(this\['weapon']\['\w+']\/\w+\)/,
                    index: 1
                },
                didShoot: {
                    regex: /--,\w+\['(\w+)']=!0x0/,
                    index: 1
                },
                nAuto: {
                    regex: /'Single\\x20Fire','varN':'(\w+)'/,
                    index: 1
                },
                crouchVal: {
                    regex: /this\['(\w+)']\+=\w\['\w+']\*\w+,0x1<=this\['\w+']/,
                    index: 1
                },
                ammos: {
                    regex: /\['length'];for\(\w+=0x0;\w+<\w+\['(\w+)']\['length']/,
                    index: 1
                },
                weaponIndex: {
                    regex: /\['weaponConfig']\[\w+]\['secondary']&&\(\w+\['(\w+)']==\w+/,
                    index: 1
                },
                objInstances: {
                    regex: /\w+\['\w+']\(0x0,0x0,0x0\);if\(\w+\['(\w+)']=\w+\['\w+']/,
                    index: 1
                },
                //reloadTimer: {regex: /this\['(\w+)']&&\(\w+\['\w+']\(this\),\w+\['\w+']\(this\)/, index: 1},
                reloadTimer: {
                    regex: /0x0>=this\['(\w+')]&&0x0>=this\['swapTime']/,
                    index: 1
                },
                recoilAnimY: {
                    regex: /this\['(\w+)']\+=this\['\w+']\*\(/,
                    index: 1
                },
                maxHealth: {
                    regex: /this\['health']\/this\['(\w+)']\?/,
                    index: 1
                },
                //xVel: { regex: /this\['x']\+=this\['(\w+)']\*\w+\['map']\['config']\['speedX']/, index: 1 },
                yVel: {
                    regex: /this\['(\w+)']=this\['\w+'],this\['visible']/,
                    index: 1
                },
                //zVel: { regex: /this\['z']\+=this\['(\w+)']\*\w+\['map']\['config']\['speedZ']/, index: 1 },
                // Patches
                socket: {
                    regex: /\['onopen']=\(\)=>{/,
                    patch: `$&${dogStr}.socket=this;`
                },
                //frustum: {regex: /(;const (\w+)=this\['frustum']\['containsPoint'];.*?return)!0x1/, patch: "$1 $2"},
                //videoAds: {regex: /!function\(\){var \w+=document\['createElement']\('script'\);.*?}\(\);/, patch: ""},
                anticheat1:{regex: /&&\w+\(\),window\['utilities']&&\(\w+\(null,null,null,!0x0\),\w+\(\)\)/, patch: ""},
                anticheat2:{regex: /(\[]instanceof Array;).*?(var)/, patch: "$1 $2"},
                anticheat3:{regex: /windows\['length'\]>\d+.*?0x25/, patch: `0x25`},
                //anticheat4:{regex: /(\w+\=)\(!menuItemContainer\['innerHTML']\['includes'].*?\);/, patch: `$1false;`},
                //anticheat4:{regex: /kro_utilities_/g, patch: `K_P_A_L__IS__A__G_A_Y__P_E_D_O`},
                //kpal:{regex: /1tWAEJx/g, patch: `K_P_A_L__IS__A__G_A_Y__P_E_D_O`},
                //kpal2:{regex: /jjkFpnV/g, patch: `K_P_A_L__IS__A__G_A_Y__P_E_D_O`},

                writeable: {
                    regex: /'writeable':!0x1/g,
                    patch: "writeable:true"
                },
                configurable: {
                    regex: /'configurable':!0x1/g,
                    patch: "configurable:true"
                },
                typeError: {
                    regex: /throw new TypeError/g,
                    patch: "console.error"
                },
                error: {
                    regex: /throw new Error/g,
                    patch: "console.error"
                },
                //exports: {regex: /(this\['\w+']\['\w+']\(this\);};},function\(\w+,\w+,(\w+)\){)/, patch: `$1 ${dogStr}.exports=$2.c; ${dogStr}.modules=$2.m;`},
                inputs: {
                    regex: /(\w+\['\w+']\[\w+\['\w+']\['\w+']\?'\w+':'push']\()(\w+)\),/,
                    patch: `$1${dogStr}.inputs($2)),`
                },
                nametags: {
                    regex: /&&(\w+\['\w+'])\){(if\(\(\w+=\w+\['\w+']\['\w+']\['\w+'])/,
                    patch: `){if(!$1&&!${dogStr}.state.nameTags)continue;$2`
                },
                wallbangs: {
                    regex: /!(\w+)\['transparent']/,
                    patch: `${dogStr}.settings.wallbangs?!$1.penetrable : !$1.transparent`
                },
                thirdPerson: {
                    regex: /(\w+)\[\'config\'\]\[\'thirdPerson\'\]/g,
                    patch: `${dogStr}.settings.thirdPerson`
                },
            };
            let script = this.gameJS;
            for (let name in entries) {
                let object = entries[name];
                let found = object.regex.exec(script);
                if (object.hasOwnProperty('index')) {
                    if (!found) {
                        object.val = null;
                        //alert("Failed to Find " + name);
                        console.error("Failed to Find " + name);
                    } else {
                        object.val = found[object.index];
                        console.log("Found ", name, ":", object.val);
                    }
                    Object.defineProperty(dog.vars, name, {
                        configurable: false,
                        value: object.val
                    });
                } else if (found) {
                    script = script.replace(object.regex, object.patch);
                    console.log("Patched ", name);
                } else console.error("Failed to Patch " + name); //alert("Failed to Patch " + name);
            }
            return script;
        }

        async fetchScript() {
            const data = await this.request("https://krunker.io/social.html", "text");
            const buffer = await this.request("https://krunker.io/pkg/krunker." + /\w.exports="(\w+)"/.exec(data)[1] + ".vries", "arrayBuffer");
            const array = Array.from(new Uint8Array(buffer));
            const xor = array[0] ^ '!'.charCodeAt(0);
            return array.map((code) => String.fromCharCode(code ^ xor)).join('');
        }

        async request(url, type, opt = {}) {
            return fetch(url, opt).then(response => {
                if (!response.ok) {
                    throw new Error("Network response from " + url + " was not ok")
                }
                return response[type]()
            })
        }

        async waitFor(test, timeout_ms = 2e4, doWhile = null) {
            let sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
            return new Promise(async (resolve, reject) => {
                if (typeof timeout_ms != "number") reject("Timeout argument not a number in waitFor(selector, timeout_ms)");
                let result, freq = 100;
                while (result === undefined || result === false || result === null || result.length === 0) {
                    if (doWhile && doWhile instanceof Function) doWhile();;
                    if (timeout_ms % 10000 < freq) console.log("waiting for: ", test);
                    if ((timeout_ms -= freq) < 0) {
                        console.log("Timeout : ", test);
                        resolve(false);
                        return;
                    }
                    await sleep(freq);
                    result = typeof test === "string" ? Function(test)() : test();
                }
                console.log("Passed : ", test);
                resolve(result);
            });
        };

        async hooking() {
            await this.waitFor(_ => this.isDefined(this.socket))
            if (!this.isDefined(this.socket)) location.assign(location.origin);
            this.wsEvent = this.socket._dispatchEvent.bind(this.socket);
            this.wsSend = this.socket.send.bind(this.socket);
            this.socket.send = new Proxy(this.socket.send, {
                apply(target, that, args) {
                    if (args[0] === "en") {
                        //args[ args.length - 1 ] = true; // AntiPedo
                        that.skinCache = {
                            main: args[1][2][0],
                            secondary: args[1][2][1],
                            hat: args[1][3],
                            body: args[1][4],
                            knife: args[1][9],
                            dye: args[1][14],
                            waist: args[1][17],
                        }
                    }
                    return Reflect.apply(...arguments);
                }
            })
            this.socket._dispatchEvent = new Proxy(this.socket._dispatchEvent, {
                apply(target, that, args) {
                    if (dog.settings.skinHack && that.skinCache && args[0] === "0") {
                        let pInfo = args[1][0];
                        let pSize = 38;
                        while (pInfo.length % pSize !== 0) pSize++;
                        for (let i = 0; i < pInfo.length; i += pSize) {
                            if (pInfo[i] === that.socketId || 0) {
                                pInfo[i + 12] = [that.skinCache.main, that.skinCache.secondary];
                                pInfo[i + 13] = that.skinCache.hat;
                                pInfo[i + 14] = that.skinCache.body;
                                pInfo[i + 19] = that.skinCache.knife;
                                pInfo[i + 24] = that.skinCache.dye;
                                pInfo[i + 33] = that.skinCache.waist;
                            }
                        }
                    }

                    return target.apply(that, args);
                }
            })

            await this.waitFor(_ => this.isDefined(this.overlay))
            this.ctx = this.overlay.canvas.getContext('2d');
            this.overlay.render = new Proxy(this.overlay.render, {
                apply(target, that, args) {
                    ["scale", "game", "controls", "renderer", "me"].forEach((item, index) => {
                        dog[item] = args[index]
                    });
                    Reflect.apply(...arguments);
                    if (dog.me && dog.ctx) {
                        dog.ctx.save();
                        dog.ctx.scale(dog.scale, dog.scale);
                        dog.render();
                        dog.ctx.restore();
                    }
                }
            })

            this.cleanGUI();
            this.customCSS();
            await this.waitFor(_ => this.isDefined(window.windows));
            this.initGUI();
        }

        defines() {
            const $origSkins = Symbol("origSkins"),
                  $localSkins = Symbol("localSkins");

            Object.defineProperties(Object.prototype, {
                //isFaceIT: {
                //    get() { return true }
                //},
                canvas: {
                    set(val) {
                        this._value = val;
                    },
                    get() {
                        let object = this;
                        if (dog.objectHas(object, ["healthColE", "healthColT", "dmgColor"])) {
                            dog.overlay = this;
                        }
                        return this._value;
                    }
                },
                RENDER: {
                    set(val) {
                        this._value = val;
                        dog.renderer = this._value;

                        Object.defineProperty(this._value, "adsFovMlt", {
                            get() {
                                return dog.settings.weaponZoom
                            }
                        })

                        dog.fxComposer = this;
                    },
                    get() {
                        return this._value;
                    }
                },
                OBJLoader: {
                    set(val) {
                        dog.three = this;
                        this._value = val;
                    },
                    get() {
                        return this._value;
                    }
                },
                skins: {
                    set(fn) {
                        this[$origSkins] = fn;
                        if (void 0 == this.localSkins || !this.localSkins.length) {
                            this[$localSkins] = Array.apply(null, Array(5e3)).map((x, i) => {
                                return {
                                    ind: i,
                                    cnt: 0x1,
                                }
                            })
                        }
                        return fn;
                    },
                    get() {
                        return dog.settings.skinHack && this.stats ? this[$localSkins] : this[$origSkins];
                    }
                },
                useLooseClient: {
                    enumerable: false,
                    get() {
                        return this._ulc
                    },
                    set(v) {
                        //dog.config = this
                        // Increase the rate in which inView is updated to every frame, making aimbot way more responsive
                        Object.defineProperty(this, "nameVisRate", {
                            value: 0,
                            writable: false,
                            configurable: true,
                        })
                        this._ulc = v
                    }
                },
                trail: { // All weapon tracers
                    enumerable: false,
                    get() {
                        return dog.settings.alwaysTrail || this._trail
                    },
                    set(v) {
                        this._trail = v
                    }
                },
                showTracers: {
                    enumerable: false,
                    get() {
                        return dog.settings.alwaysTrail || this._showTracers
                    },
                    set(v) {
                        this._showTracers = v
                    }
                },
                shaderId: { // Animated billboards
                    enumerable: false,
                    get() {
                        if (this.src && this.src.startsWith("pubs/")) return dog.settings.animatedBillboards ? 1 : this.rshaderId;
                        else return this.rshaderId
                    },
                    set(v) {
                        this.rshaderId = v
                    }
                },
                // Clientside prevention of inactivity kick
                idleTimer: {
                    enumerable: false,
                    get() {
                        return dog.settings.antikick ? 0 : this._idleTimer
                    },
                    set(v) {
                        this._idleTimer = v
                    }
                },
                kickTimer: {
                    enumerable: false,
                    get() {
                        return dog.settings.antikick ? Infinity : this._kickTimer
                    },
                    set(v) {
                        this._kickTimer = v
                    }
                },
            })

            // disable audioparam errors
            Object.keys(AudioParam.prototype).forEach(name => {
                if (Object.getOwnPropertyDescriptor(AudioParam.prototype, name).get) return
                const old = AudioParam.prototype[name]
                AudioParam.prototype[name] = function() {
                    try {
                        return old.apply(this, arguments)
                    } catch (e) {
                        console.log("AudioParam error:\n" + e)
                        return false
                    }
                }
            })
        }

        iframe() {
            const iframe = document.createElement('iframe');
            iframe.setAttribute('style', 'display:none');
            iframe.setAttribute("id", dogStr);
            iframe.src = location.origin;
            document.documentElement.appendChild(iframe);

            const ifrWin = iframe.contentWindow;
            const ifrDoc = iframe.contentDocument?iframe.contentDocument:iframe.contentWindow.document;

            let skidneySplizy = 0;

            ifrWin.TextDecoder.prototype.decode = new Proxy(window.TextDecoder.prototype.decode, {
                apply: function(target, that, args) {
                    let string = Reflect.apply(...arguments);
                    if (string.length > 5e4) {
                        log.warn("skidneySplizy = " + skidneySplizy);
                        if (skidneySplizy == 0) {
                            dog.gameJS = string;
                        } else {
                            dog.gameJS += string;
                        } skidneySplizy ++;
                        //console.log(string.length)
                        /*
                        if (!dog.gameJS) {
                            dog.gameJS = string;
                            console.log("1stSTR");
                        } else {
                           dog.gameJS += string;
                            console.log("2ndSTR");
                        }
                        */
                    } //else //console.log(string.length)
                    if (string.includes("generate-token")) dog.generated = true;
                    else if (string.length == 40||dog.generated) {
                        dog.token = string;
                        console.log("Token ", string);
                        document.documentElement.removeChild(iframe);
                    }
                    return string;
                },
            });
        }

        createObservers() {

            let observer = new MutationObserver(mutations => {
                for (let mutation of mutations) {
                    for (let node of mutation.addedNodes) {
                        if (node.tagName === 'SCRIPT') {
                            if (node.type === "text/javascript" && node.innerHTML.startsWith("*!", 1)) {
                                node.innerHTML = "";
                                observer.disconnect();
                            } else if (node.src) {
                                //console.log(node.src);
                            }
                        }
                    }
                }
            });
            observer.observe(document, {
                childList: true,
                subtree: true
            });
        }

        createListeners() {

            window.addEventListener("mouseup", (e) => {
                if (e.which === 2 && dog.settings.guiOnMMB) {
                    e.preventDefault()
                    dog.showGUI()
                }
            })
            window.addEventListener("keyup", event => {
                if (this.state.pressedKeys.has(event.code)) this.state.pressedKeys.delete(event.code)
                if (!(document.activeElement.tagName === "INPUT" || !window.endUI && window.endUI.style.display) && dog.settings.keybinds) {
                    switch (event.code) {
                        case "KeyY":
                            this.state.bindAimbotOn = !this.state.bindAimbotOn
                            this.wsEvent("ch", [null, ("Aimbot " + (this.state.bindAimbotOn ? "on" : "off")), 1])
                            break
                        case "KeyH":
                            this.settings.esp = (this.settings.esp + 1) % 4
                            this.wsEvent("ch", [null, "ESP: " + ["disabled", "nametags", "box", "full"][this.settings.esp], 1])
                            break
                    }
                }
            })
            window.addEventListener("keydown", event => {
                if (event.code == "F1") {
                    event.preventDefault();
                    dog.showGUI();
                }
                if ('INPUT' == document.activeElement.tagName || !window.endUI && window.endUI.style.display) return;
                switch (event.code) {
                    case 'NumpadSubtract':
                        document.exitPointerLock();
                        //console.log(document.exitPointerLock)
                        console.dirxml(this)
                        break;
                    default:
                        if (!this.state.pressedKeys.has(event.code)) this.state.pressedKeys.add(event.code);
                        break;
                }
            })
        }

        inputs(input) {
            const key = {
                frame: 0,
                delta: 1,
                xdir: 2,
                ydir: 3,
                moveDir: 4,
                shoot: 5,
                scope: 6,
                jump: 7,
                reload: 8,
                crouch: 9,
                weaponScroll: 10,
                weaponSwap: 11,
                moveLock: 12
            }

            const moveDir = {
                leftStrafe: 0,
                forward: 1,
                rightStrafe: 2,
                right: 3,
                backwardRightStrafe: 4,
                backward: 5,
                backwardLeftStrafe: 6,
                left: 7
            }

            this.state.frame = input[key.frame];
            this.state.nameTags = [1, 2].some(n => n == this.settings.esp) || this.settings.forceNametagsOn;

            if (this.me) {

                // AUTO NUKE
                if (this.settings.autoNuke && Object.keys(this.me.streaks).length) {
                    this.wsSend("k", 0)
                }

                //AUTO BHOP
                if (this.settings.bhop) {
                    if (this.state.pressedKeys.has("Space") || this.settings.bhop % 2) {
                        this.controls.keys[this.controls.binds.jumpKey.val] ^= 1;
                        if (this.controls.keys[this.controls.binds.jumpKey.val]) {
                            this.controls.didPressed[this.controls.binds.jumpKey.val] = 1;
                        }
                        if (this.state.pressedKeys.has("Space") || this.settings.bhop == 3) {
                            if (this.me[this.vars.yVel] < -0.03 && this.me.canSlide) {
                                setTimeout(() => {
                                    this.controls.keys[this.controls.binds.crouchKey.val] = 0;
                                }, this.me.slideTimer || 325);
                                this.controls.keys[this.controls.binds.crouchKey.val] = 1;
                                this.controls.didPressed[this.controls.binds.crouchKey.val] = 1;
                            }
                        }
                    }
                }

                // Makes nametags show in custom games, where nametags are disabled
                if (this.settings.forceNametagsOn) {
                    try {
                        Object.defineProperty(this.game.config, "nameTags", {
                            get() {
                                return dog.settings.forceNametagsOn ? false : this.game._nametags
                            },
                            set(v) {
                                this.game._nametags = v
                            }
                        })
                    } catch (e) {}
                }


                if (this.settings.spinBot) {
                    const rate = 1
                    input[key.moveDir] !== -1 && (input[key.moveDir] = (input[key.moveDir] + this.state.spinCounter - Math.round(7 * (input[key.ydir] / (Math.PI * 2000)))) % 7)
                    input[key.ydir] = this.state.spinCounter / 7 * (Math.PI * 2000)
                    input[key.frame] % rate === 0 && (this.state.spinCounter = (this.state.spinCounter + 1) % 7)
                }

                // AUTO SWAP (not working idk why)
                // if (this.settings.autoSwap && !this.me.weapon.secondary && this.me[this.vars.ammos][0] === 0 && this.me[this.vars.ammos][1] > 0 && !this.me.swapTime && !this.me[this.vars.reloadTimer]) {
                // 	input[key.weaponSwap] = 1
                //}

                // AUTO RELOAD
                if (this.settings.autoReload && this.me[this.vars.ammos][this.me[this.vars.weaponIndex]] === 0) {
                    input[key.reload] = 1
                }

                // PITCH HACK
                if (this.settings.pitchHack) {
                    switch (this.settings.pitchHack) {
                        case 1:
                            input[key.xdir] = -Math.PI * 500
                            break
                        case 2:
                            input[key.xdir] = Math.PI * 500
                            break
                        case 3:
                            input[key.xdir] = Math.sin(Date.now() / 50) * Math.PI * 500
                            break
                        case 4:
                            input[key.xdir] = Math.sin(Date.now() / 250) * Math.PI * 500
                            break
                        case 5:
                            input[key.xdir] = input[key.frame] % 2 ? Math.PI * 500 : -Math.PI * 500
                            break
                        case 6:
                            input[key.xdir] = (Math.random() * Math.PI - Math.PI / 2) * 1000
                            break
                    }
                }

                // Add the `pos` property to Players and AIs
                const getNoise = () => (Math.random() * 2 - 1) * this.settings.aimNoise
                this.game.players.list.forEach(v => {
                    v.pos = {
                        x: v.x,
                        y: v.y,
                        z: v.z
                    };
                    v.npos = {
                        x: v.x + getNoise(),
                        y: v.y + getNoise(),
                        z: v.z + getNoise()
                    };
                    v.isTarget = false
                })
                if (this.game.AI.ais) {
                    this.game.AI.ais.forEach(v => v.npos = v.pos = {
                        x: v.x,
                        y: v.y,
                        z: v.z
                    })
                }

                // AIMBOT
                if (this.renderer && this.renderer.frustum && this.me.active) {
                    this.controls.target = null

                    // Finds all the visible enemies
                    let targets = this.game.players.list.filter(enemy => !enemy.isYTMP && enemy.hasOwnProperty('npos') && (!this.settings.frustumCheck || this.containsPoint(enemy.npos)) && ((this.me.team === null || enemy.team !== this.me.team) && enemy.health > 0 && enemy[this.vars.inView])).sort((e, e2) => this.getDistance(this.me.x, this.me.z, e.npos.x, e.npos.z) - this.getDistance(this.me.x, this.me.z, e2.npos.x, e2.npos.z));
                    let target = targets[0];

                    // If there's a fov box, pick an enemy inside it instead (if there is)
                    if (this.settings.fovbox) {
                        const scale = this.scale || parseFloat(document.getElementById("uiBase").style.transform.match(/\((.+)\)/)[1])
                        const width = innerWidth / scale,
                              height = innerHeight / scale

                        let foundTarget = false
                        for (let i = 0; i < targets.length; i++) {
                            const t = targets[i]
                            const sp = this.world2Screen(new this.three.Vector3(t.x, t.y, t.z), width, height, t.height / 2)
                            let fovBox = [width / 3, height / 4, width * (1 / 3), height / 2]
                            switch (this.settings.fovBoxSize) {
                                    // medium
                                case 2:
                                    fovBox = [width * 0.4, height / 3, width * 0.2, height / 3]
                                    break
                                    // small
                                case 3:
                                    fovBox = [width * 0.45, height * 0.4, width * 0.1, height * 0.2]
                                    break
                            }
                            if (sp.x >= fovBox[0] && sp.x <= (fovBox[0] + fovBox[2]) && sp.y >= fovBox[1] && sp.y < (fovBox[1] + fovBox[3])) {
                                target = targets[i]
                                foundTarget = true
                                break
                            }
                        }
                        if (!foundTarget) {
                            target = void "kpal"
                        }
                    }

                    let isAiTarget = false
                    if (this.game.AI.ais && this.settings.AImbot) {
                        let aiTarget = this.game.AI.ais.filter(ent => ent.mesh && ent.mesh.visible && ent.health && ent.pos && ent.canBSeen).sort((p1, p2) => this.getDistance(this.me.x, this.me.z, p1.pos.x, p1.pos.z) - this.getDistance(this.me.x, this.me.z, p2.pos.x, p2.pos.z)).shift()
                        if (!target || (aiTarget && this.getDistance(this.me.x, this.me.z, aiTarget.pos.x, aiTarget.pos.z) > this.getDistance(this.me.x, this.me.z, target.pos.x, target.pos.z))) {
                            target = aiTarget
                            isAiTarget = true
                        }
                    }

                    const isShooting = input[key.shoot]
                    if (target && this.settings.aimbot &&
                        this.state.bindAimbotOn &&
                        (!this.settings.aimbotRange || this.getDistance3D(this.me.x, this.me.y, this.me.z, target.x, target.y, target.z) < this.settings.aimbotRange) &&
                        (!this.settings.rangeCheck || this.getDistance3D(this.me.x, this.me.y, this.me.z, target.x, target.y, target.z) <= this.me.weapon.range) &&
                        !this.me[this.vars.reloadTimer]) {

                        if (this.settings.awtv) {
                            input[key.scope] = 1
                        }
                        target.isTarget = this.settings.markTarget

                        const yDire = (this.getDir(this.me.z, this.me.x, target.npos.z, target.npos.x) || 0) * 1000
                        const xDire = isAiTarget ?
                              ((this.getXDir(this.me.x, this.me.y, this.me.z, target.npos.x, target.npos.y - target.dat.mSize / 2, target.npos.z) || 0) - (0.3 * this.me[this.vars.recoilAnimY])) * 1000 :
                        ((this.getXDir(this.me.x, this.me.y, this.me.z, target.npos.x, target.npos.y - target[this.vars.crouchVal] * 3 + this.me[this.vars.crouchVal] * 3 + this.settings.aimOffset, target.npos.z) || 0) - (0.3 * this.me[this.vars.recoilAnimY])) * 1000

                        // aimbot tweak
                        if (this.settings.forceUnsilent) {
                            this.controls.target = {
                                xD: xDire / 1000,
                                yD: yDire / 1000
                            }
                            this.controls.update(400)
                        }

                        // Different aimbot modes can share the same code
                        switch (this.settings.aimbot) {
                                // quickscope, silent, trigger aim, silent on aim, aim correction, unsilent
                            case 1:
                            case 2:
                            case 5:
                            case 6:
                            case 9:
                            case 10: {
                                let onAim = [5, 6, 9].some(n => n == this.settings.aimbot)
                                if ((this.settings.aimbot === 5 && input[key.scope]) || this.settings.aimbot === 10) {
                                    this.controls.target = {
                                        xD: xDire / 1000,
                                        yD: yDire / 1000
                                    }
                                    this.controls.update(400)
                                }
                                if ([2, 10].some(n => n == this.settings.aimbot) || (this.settings.aimbot === 1 && this.me.weapon.id)) {
                                    !this.me.weapon.melee && (input[key.scope] = 1)
                                }
                                if (this.me[this.vars.didShoot]) {
                                    input[key.shoot] = 0
                                    this.state.quickscopeCanShoot = false
                                    setTimeout(() => {
                                        this.state.quickscopeCanShoot = true
                                    }, this.me.weapon.rate * .85)
                                } else if (this.state.quickscopeCanShoot && (!onAim || input[key.scope])) {
                                    if (!this.me.weapon.melee) {
                                        input[key.scope] = 1
                                    }
                                    if (!this.settings.superSilent && this.settings.aimbot !== 9) {
                                        input[key.ydir] = yDire
                                        input[key.xdir] = xDire
                                    }
                                    if ((this.settings.aimbot !== 9 && (!this.me[this.vars.aimVal] || this.me.weapon.noAim || this.me.weapon.melee)) ||
                                        (this.settings.aimbot === 9 && isShooting)) {
                                        input[key.ydir] = yDire
                                        input[key.xdir] = xDire
                                        input[key.shoot] = 1
                                    }
                                }
                            }
                                break
                                // spin aim useless rn
                                // case 3: {
                                //     if (me[dog.vars.didShoot]) {
                                //         input[key.shoot] = 0
                                //         dog.state.quickscopeCanShoot = false
                                //         setTimeout(() => {
                                //             dog.state.quickscopeCanShoot = true
                                //         }, me.weapon.rate)
                                //     } else if (dog.state.quickscopeCanShoot && !dog.state.spinFrame) {
                                //         dog.state.spinFrame = input[key.frame]
                                //     } else {
                                //         const fullSpin = Math.PI * 2000
                                //         const spinFrames = dog.settings.spinAimFrames
                                //         const currentSpinFrame = input[key.frame]-dog.state.spinFrame
                                //         if (currentSpinFrame < 0) {
                                //             dog.state.spinFrame = 0
                                //         }
                                //         if (currentSpinFrame > spinFrames) {
                                //             if (!dog.settings.superSilent) {
                                //                 input[key.ydir] = yDire
                                //                 input[key.xdir] = xDire
                                //             }
                                //             if (!me[dog.vars.aimVal] || me.weapon.noAim || me.weapon.melee) {
                                //                 input[key.ydir] = yDire
                                //                 input[key.xdir] = xDire
                                //                 input[key.shoot] = 1
                                //                 dog.state.spinFrame = 0
                                //             }
                                //         } else {
                                //             input[key.ydir] = currentSpinFrame/spinFrames * fullSpin
                                //             if (!me.weapon.melee)
                                //                 input[key.scope] = 1
                                //         }
                                //     }
                                // } break

                                // aim assist, smooth on aim, smoother, easy aim assist
                            case 4:
                            case 7:
                            case 8:
                            case 11:
                                if (input[key.scope] || this.settings.aimbot === 11) {
                                    this.controls.target = {
                                        xD: xDire / 1000,
                                        yD: yDire / 1000
                                    }
                                    this.controls.update(({
                                        4: 400,
                                        7: 110,
                                        8: 70,
                                        11: 400
                                    })[this.settings.aimbot])
                                    if ([4, 11].some(n => n == this.settings.aimbot)) {
                                        input[key.xdir] = xDire
                                        input[key.ydir] = yDire
                                    }
                                    if (this.me[this.vars.didShoot]) {
                                        input[key.shoot] = 0
                                        this.state.quickscopeCanShoot = false
                                        setTimeout(() => {
                                            this.state.quickscopeCanShoot = true
                                        }, this.me.weapon.rate * 0.85)
                                    } else if (this.state.quickscopeCanShoot) {
                                        input[this.me.weapon.melee ? key.shoot : key.scope] = 1
                                    }
                                } else {
                                    this.controls.target = null
                                }
                                break
                                // trigger bot
                            case 12: {
                                if (!this.three ||
                                    !this.renderer ||
                                    !this.renderer.camera ||
                                    !this.game ||
                                    !this.game.players ||
                                    !this.game.players.list.length ||
                                    !input[key.scope] ||
                                    this.me[this.vars.aimVal]) {
                                    break
                                }
                                // Only create these once for performance
                                if (!this.state.raycaster) {
                                    this.state.raycaster = new this.three.Raycaster()
                                    this.state.mid = new this.three.Vector2(0, 0)
                                }
                                const playerMaps = []
                                for (let i = 0; i < this.game.players.list.length; i++) {
                                    let p = this.game.players.list[i]
                                    if (!p || !p[this.vars.objInstances] || p.isYTMP || !(this.me.team === null || p.team !== this.me.team) || !p[this.vars.inView]) {
                                        continue
                                    }
                                    playerMaps.push(p[this.vars.objInstances])
                                }
                                const raycaster = this.state.raycaster
                                raycaster.setFromCamera(this.state.mid, this.renderer.camera)
                                if (raycaster.intersectObjects(playerMaps, true).length) {
                                    input[key.shoot] = this.me[this.vars.didShoot] ? 0 : 1
                                }
                            }
                                break
                        }
                    } else {
                        if (this.settings.uwtv) {
                            input[key.scope] = 0
                        }
                        this.state.spinFrame = 0
                    }
                }

                if (this.settings.alwaysAim) {
                    input[key.scope] = 1
                }
                if (this.settings.preventMeleeThrowing && this.me.weapon.melee) {
                    input[key.scope] = 0
                }
            }
            return input;
        }

        render() {

            var scale = this.scale || parseFloat(document.getElementById("uiBase").style.transform.match(/\((.+)\)/)[1]);
            let width = innerWidth / scale,
                height = innerHeight / scale

            let world2Screen = (pos, yOffset = 0) => {
                pos.y += yOffset
                pos.project(this.renderer.camera)
                pos.x = (pos.x + 1) / 2
                pos.y = (-pos.y + 1) / 2
                pos.x *= width
                pos.y *= height
                return pos
            }
            let line = (x1, y1, x2, y2, lW, sS) => {
                this.ctx.save()
                this.ctx.lineWidth = lW + 2
                this.ctx.beginPath()
                this.ctx.moveTo(x1, y1)
                this.ctx.lineTo(x2, y2)
                this.ctx.strokeStyle = "rgba(0, 0, 0, 0.25)"
                this.ctx.stroke()
                this.ctx.lineWidth = lW
                this.ctx.strokeStyle = sS
                this.ctx.stroke()
                this.ctx.restore()
            }
            let rect = (x, y, ox, oy, w, h, color, fill) => {
                this.ctx.save()
                this.ctx.translate(~~x, ~~y)
                this.ctx.beginPath()
                fill ? this.ctx.fillStyle = color : this.ctx.strokeStyle = color
                this.ctx.rect(ox, oy, w, h)
                fill ? this.ctx.fill() : this.ctx.stroke()
                this.ctx.closePath()
                this.ctx.restore()
            }
            let getTextMeasurements = (arr) => {
                for (let i = 0; i < arr.length; i++) {
                    arr[i] = ~~this.ctx.measureText(arr[i]).width
                }
                return arr
            }
            let gradient = (x, y, w, h, colors) => {
                const grad = this.ctx.createLinearGradient(x, y, w, h)
                for (let i = 0; i < colors.length; i++) {
                    grad.addColorStop(i, colors[i])
                }
                return grad
            }
            let text = (txt, font, color, x, y) => {
                this.ctx.save()
                this.ctx.translate(~~x, ~~y)
                this.ctx.fillStyle = color
                this.ctx.strokeStyle = "rgba(0, 0, 0, 0.5)"
                this.ctx.font = font
                this.ctx.lineWidth = 1
                this.ctx.strokeText(txt, 0, 0)
                this.ctx.fillText(txt, 0, 0)
                this.ctx.restore()
            }

            const padding = 2

            for (const player of this.game.players.list.filter(v => (!v.isYTMP && v.active && (v.pos = {
                x: v.x,
                y: v.y,
                z: v.z
            })))) {
                const pos = new this.three.Vector3(player.pos.x, player.pos.y, player.pos.z)
                const screenR = world2Screen(pos.clone())
                const screenH = world2Screen(pos.clone(), player.height)
                const hDiff = ~~(screenR.y - screenH.y)
                const bWidth = ~~(hDiff * 0.6)
                const font = this.settings.espFontSize + "px GameFont"
                const enemy = this.me.team === null || player.team !== this.me.team;

                if (!this.containsPoint(player.pos)) {
                    continue
                }

                if (this.settings.tracers) {
                    line(width / 2, (dog.settings.tracers === 2 ? height / 2 : height - 1), screenR.x, screenR.y, 2, player.team === null ? "#FF4444" : player.team === this.me.team ? "#44AAFF" : "#FF4444")
                }

                // Chams
                const obj = player[this.vars.objInstances];
                if (this.isDefined(obj)) {
                    if (!obj.visible) {
                        Object.defineProperty(player[this.vars.objInstances], 'visible', {
                            value: true,
                            writable: false
                        });
                    } else {
                        let chamsEnabled = this.settings.chams;
                        if (dog.gaybow >= 360) dog.gaybow = 0; else dog.gaybow++;
                        obj.traverse(child => {
                            if (child && child.type == "Mesh" && this.isDefined(child.material)) {
                                if (!child.hasOwnProperty(dogStr)) {
                                    child[dogStr] = child.material;
                                } else if (child.hasOwnProperty(dogStr)) {
                                    Object.defineProperty(child, 'material', {
                                        get(){
                                            return !chamsEnabled||(!enemy && !dog.settings.teamChams) ? this[dogStr] : new dog.three.MeshBasicMaterial({
                                                color: new dog.three.Color(dog.settings.chamsCol == 12 ? `hsl(${dog.gaybow},100%, 50%)` : Object.values(dog.colors)[dog.settings.chamsCol]),
                                                depthTest: false,
                                                transparent: true,
                                                fog: false,
                                                wireframe: dog.settings.wireframe
                                            })
                                        }
                                    });
                                }
                            }
                        })
                    }
                }

                if (this.settings.esp > 1) {
                    if (player.isTarget) {
                        this.ctx.save()
                        const meas = getTextMeasurements(["TARGET"])
                        text("TARGET", font, "#FFFFFF", screenH.x - meas[0] / 2, screenH.y - this.settings.espFontSize * 1.5)

                        this.ctx.beginPath()

                        this.ctx.translate(screenH.x, screenH.y + Math.abs(hDiff / 2))
                        this.ctx.arc(0, 0, Math.abs(hDiff / 2) + 10, 0, Math.PI * 2)

                        this.ctx.strokeStyle = "#FFFFFF"
                        this.ctx.stroke()
                        this.ctx.closePath()
                        this.ctx.restore()
                    }

                    if (this.settings.esp === 2) {
                        this.ctx.save()
                        this.ctx.strokeStyle = (this.me.team === null || player.team !== this.me.team) ? "#FF4444" : "#44AAFF"
                        this.ctx.strokeRect(screenH.x - bWidth / 2, screenH.y, bWidth, hDiff)
                        this.ctx.restore()
                        continue
                    }

                    rect((screenH.x - bWidth / 2) - 7, ~~screenH.y - 1, 0, 0, 4, hDiff + 2, "#000000", false)
                    rect((screenH.x - bWidth / 2) - 7, ~~screenH.y - 1, 0, 0, 4, hDiff + 2, "#44FF44", true)
                    rect((screenH.x - bWidth / 2) - 7, ~~screenH.y - 1, 0, 0, 4, ~~((player[this.vars.maxHealth] - player.health) / player[this.vars.maxHealth] * (hDiff + 2)), "#000000", true)
                    this.ctx.save()
                    this.ctx.lineWidth = 4
                    this.ctx.translate(~~(screenH.x - bWidth / 2), ~~screenH.y)
                    this.ctx.beginPath()
                    this.ctx.rect(0, 0, bWidth, hDiff)
                    this.ctx.strokeStyle = "rgba(0, 0, 0, 0.25)"
                    this.ctx.stroke()
                    this.ctx.lineWidth = 2
                    this.ctx.strokeStyle = player.team === null ? '#FF4444' : this.me.team === player.team ? '#44AAFF' : '#FF4444'
                    this.ctx.stroke()
                    this.ctx.closePath()
                    this.ctx.restore()

                    const playerDist = ~~(this.getDistance3D(this.me.x, this.me.y, this.me.z, player.pos.x, player.pos.y, player.pos.z) / 10)
                    this.ctx.save()
                    this.ctx.font = font
                    const meas = getTextMeasurements(["[", playerDist, "m]", player.level, "©", player.name])
                    this.ctx.restore()
                    const grad2 = gradient(0, 0, meas[4] * 5, 0, ["rgba(0, 0, 0, 0.25)", "rgba(0, 0, 0, 0)"])
                    if (player.level) {
                        const grad = gradient(0, 0, (meas[4] * 2) + meas[3] + (padding * 3), 0, ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.25)"])
                        rect(~~(screenH.x - bWidth / 2) - 12 - (meas[4] * 2) - meas[3] - (padding * 3), ~~screenH.y - padding, 0, 0, (meas[4] * 2) + meas[3] + (padding * 3), meas[4] + (padding * 2), grad, true)
                        text("" + player.level, font, '#FFFFFF', ~~(screenH.x - bWidth / 2) - 16 - meas[3], ~~screenH.y + meas[4] * 1)
                    }
                    rect(~~(screenH.x + bWidth / 2) + padding, ~~screenH.y - padding, 0, 0, (meas[4] * 5), (meas[4] * 4) + (padding * 2), grad2, true)
                    text(player.name, font, player.team === null ? '#FFCDB4' : this.me.team === player.team ? '#B4E6FF' : '#FFCDB4', (screenH.x + bWidth / 2) + 4, screenH.y + meas[4] * 1)
                    if (player.clan) text("[" + player.clan + "]", font, "#AAAAAA", (screenH.x + bWidth / 2) + 8 + meas[5], screenH.y + meas[4] * 1)
                    text(player.health + " HP", font, "#33FF33", (screenH.x + bWidth / 2) + 4, screenH.y + meas[4] * 2)
                    text(player.weapon.name, font, "#DDDDDD", (screenH.x + bWidth / 2) + 4, screenH.y + meas[4] * 3)
                    text("[", font, "#AAAAAA", (screenH.x + bWidth / 2) + 4, screenH.y + meas[4] * 4)
                    text("" + playerDist, font, "#DDDDDD", (screenH.x + bWidth / 2) + 4 + meas[0], screenH.y + meas[4] * 4)
                    text("m]", font, "#AAAAAA", (screenH.x + bWidth / 2) + 4 + meas[0] + meas[1], screenH.y + meas[4] * 4)
                }

            }

            if (this.settings.fovbox && this.settings.drawFovbox) {
                let fovBox = [width / 3, height / 4, width * (1 / 3), height / 2]
                switch (this.settings.fovBoxSize) {
                        // medium
                    case 2:
                        fovBox = [width * 0.4, height / 3, width * 0.2, height / 3]
                        break
                        // small
                    case 3:
                        fovBox = [width * 0.45, height * 0.4, width * 0.1, height * 0.2]
                        break
                }
                this.ctx.save()
                this.ctx.strokeStyle = "red"
                this.ctx.strokeRect(...fovBox)
                this.ctx.restore()
            }
        }

        cleanGUI() {
            let head = document.head || document.getElementsByTagName('head')[0] || 0,
                css = this.createElement("style", "#aMerger, #endAMerger { display: none !important }");
            head.appendChild(css);
            window['onetrust-consent-sdk'].style.display = "none";
            window.streamContainer.style.display = "none";
            window.merchHolder.style.display = "none";
            window.newsHolder.style.display = "none";
        }

        customCSS() {
            if (!this.isDefined(this.CSSres) && this.settings.kpalCSS) {
                let head = document.head || document.getElementsByTagName('head')[0] || 0
                this.CSSres = document.createElement("link");
                this.CSSres.rel = "stylesheet";
                this.CSSres.href = "https://skidlamer.github.io/css/kpal.css"
                this.CSSres.disabled = false;
                head.appendChild(this.CSSres);
            }
            if (this.settings.customCSS.startsWith("http") && this.settings.customCSS.endsWith(".css")) {
                //let head = document.head||document.getElementsByTagName('head')[0]||0
                this.CSSres.href = this.settings.customCSS;
                //head.appendChild(this.CSSres);
            } else this.CSSres = undefined;
        }

        initGUI() {
            function createButton(name, iconURL, fn) {
                const menu = document.querySelector("#menuItemContainer"),
                      menuItem = document.createElement("div"),
                      menuItemIcon = document.createElement("div"),
                      menuItemTitle = document.createElement("div")

                menuItem.className = "menuItem"
                menuItemIcon.className = "menuItemIcon"
                menuItemTitle.className = "menuItemTitle"

                menuItemTitle.innerHTML = name
                menuItemIcon.style.backgroundImage = `url("https://i.imgur.com/krfAACY.png")`

                menuItem.append(menuItemIcon, menuItemTitle)
                menu.append(menuItem)

                menuItem.addEventListener("click", fn)
            }

            dog.GUI.setSetting = function(setting, value) {
                switch (setting) {
                    case "customCSS":
                        dog.settings.customCSS = value
                        dog.customCSS();
                        break

                    default:
                        console.log("SET ", setting, " ", value);
                        dog.settings[setting] = value
                }
                localStorage.kro_setngss_json = JSON.stringify(dog.settings);
            }
            dog.GUI.windowIndex = windows.length + 1
            dog.GUI.settings = {
                aimbot: {
                    val: this.settings.aimbot
                }
            }
            dog.GUI.windowObj = {
                header: "CH33T",
                html: "",
                gen() {
                    return dog.getGuiHtml()
                }
            }
            Object.defineProperty(window.windows, windows.length, {
                value: dog.GUI.windowObj
            })

            if (this.settings.showGuiButton) {
                createButton("CH33TS", null, () => {
                    window.showWindow(dog.GUI.windowIndex)
                })
            }
        }

        showGUI() {
            if (document.pointerLockElement || document.mozPointerLockElement) {
                document.exitPointerLock()
            }
            window.showWindow(this.GUI.windowIndex)
        }

        getGuiHtml() {
            const builder = {
                checkbox: (name, settingName, description = "", needsRestart = false) => `<div class="settName" title="${description}">${name} ${needsRestart ? "<span style=\"color: #eb5656\">*</span>" : ""}<label class="switch" style="margin-left:10px"><input type="checkbox" onclick='${dogStr}.GUI.setSetting("${settingName}", this.checked)' ${dog.settings[settingName]?"checked":""}><span class="slider"></span></label></div>`,
                client_setting: (name, settingName, description = "", needsRestart = true) => `<div class="settName" title="${description}">${name} ${needsRestart ? "<span style=\"color: #eb5656\">*</span>" : ""}<label class="switch" style="margin-left:10px"><input type="checkbox" onclick='doge_setsetting("${settingName}", this.checked?"1":"0")' ${dog.settings[settingName]?"checked":""}><span class="slider"></span></label></div>`,
    select: (name, settingName, options, description = "", needsRestart = false) => {
        let built = `<div class="settName" title="${description}">${name} ${needsRestart ? "<span style=\"color: #eb5656\">*</span>" : ""}<select onchange='${dogStr}.GUI.setSetting("${settingName}", parseInt(this.value))' class="inputGrey2">`
        for (const option in options) {
            if (options.hasOwnProperty(option))
                built += `<option value="${options[option]}" ${dog.settings[settingName] == options[option]?"selected":""}>${option}</option>,`
        }
        return built + "</select></div>"
    },
        slider: (name, settingName, min, max, step, description = "") => `<div class="settName" title="${description}">${name} <input type="number" class="sliderVal" id="slid_input_${settingName}" min="${min}" max="${max}" value="${dog.settings[settingName]}" onkeypress="${dogStr}.GUI.setSetting('${settingName}', parseFloat(this.value.replace(',', '.')));document.querySelector('#slid_input_${settingName}').value=this.value" style="margin-right:0;border-width:0"><div class="slidecontainer" style=""><input type="range" id="slid_${settingName}" min="${min}" max="${max}" step="${step}" value="${dog.settings[settingName]}" class="sliderM" oninput="${dogStr}.GUI.setSetting('${settingName}', parseFloat(this.value));document.querySelector('#slid_input_${settingName}').value=this.value"></div></div>`,
            input: (name, settingName, type, description, extra) => `<div class="settName" title="${description}">${name} <input type="${type}" name="${type}" id="slid_utilities_${settingName}"\n${'color' == type ? 'style="float:right;margin-top:5px"' : `class="inputGrey2" placeholder="${extra}"`}\nvalue="${dog.settings[settingName]}" oninput="${dogStr}.GUI.setSetting(\x27${settingName}\x27, this.value)"/></div>`,
                label: (name, description) => "<br><span style='color: black; font-size: 20px; margin: 20px 0'>" + name + "</span> <span style='color: dimgrey; font-size: 15px'>" + (description || "") + "</span><br>",
                    nobrlabel: (name, description) => "<span style='color: black; font-size: 20px; margin: 20px 0'>" + name + "</span> <span style='color: dimgrey; font-size: 15px'>" + (description || "") + "</span><br>",
                        br: () => "<br>",
                            style: content => `<style>${content}</style>`,
};
    let built = `<div id="settHolder">
<img src="https://i.imgur.com/krfAACY.png" width="25%">
<div class="imageButton discordSocial" onmouseenter="playTick()" onclick="openURL('https://www.youtube.com/channel/UCKN9qye5ZIGvCvq0fwrRNjg')"><span style='display:inline'></span></div>`

    // fix fugly looking 'built +=' before every builder call
    Object.keys(builder).forEach(name => {
        const o = builder[name]
        builder[name] = function() {
            return built += o.apply(this, arguments), ""
        }
    })

    // Tabs stuff
    const tabNames = ["Weapon", "Wallhack", "Visual", "Tweaks", "Movement", "Other"]
    if (dog.isClient) {
        tabNames.push("Client")
    }
    builder.style(`.cheatTabButton { color: black; background: #ddd; padding: 2px 7px; font-size: 15px; cursor: pointer; text-align: center; } .cheatTabActive { background: #bbb;}`)
    this.GUI.changeTab = function(tabbtn) {
        const tn = tabbtn.innerText
        document.getElementById("cheat-tabbtn-" + tabNames[dog.state.activeTab]).classList.remove("cheatTabActive")
        document.getElementById("cheat-tab-" + tabNames[dog.state.activeTab]).style.display = "none"
        tabbtn.classList.add("cheatTabActive")
        document.getElementById("cheat-tab-" + tn).style.display = "block"
        dog.state.activeTab = tabNames.indexOf(tn)
    }
    built += `<table style="width: 100%; margin-bottom: 30px"><tr>`
    for (let i = 0; i < tabNames.length; i++) {
        const tab = tabNames[i]
        built += `<td id="cheat-tabbtn-${tab}" onclick="${dogStr}.GUI.changeTab(this)" class="cheatTabButton ${tabNames[dog.state.activeTab] === tab ? 'cheatTabActive' : ''}">`
        built += tab
        built += `</td>`
    }
    built += `</table></tr>`

    function tab(i, cb) {
        built += `<div style="display: ${dog.state.activeTab === i ? 'block' : 'none'}" class="cheat-tab" id="cheat-tab-${tabNames[i]}">`
        cb()
        built += `</div>`
    }

    // build gui
    tab(0, () => {
        builder.select("Aimbot [Y]", "aimbot", {
            "None": 0,
            "Quickscope / Auto pick": 1,
            "Silent aimbot": 2,
            //"Spin aimbot": 3,
            "Aim assist": 4,
            "Easy aim assist": 11,
            "SP Trigger bot": 12,
            "Silent on aim": 6,
            "Smooth": 7,
            "Unsilent": 10,
            "Unsilent on aim": 5,
            "Aim correction": 9,
        })
        builder.select("Spin aimbot speed", "spinAimFrames", {
            "1": 30,
            "2": 20,
            "3": 15,
            "4": 10,
            "5": 5,
        })
        builder.slider("Aim range", "aimbotRange", 0, 1000, 10, "Set above 0 to make the aimbot pick enemies only at the selected range")
        builder.slider("Aim offset", "aimOffset", -4, 1, 0.1, "The lower it is, the lower the aimbot will shoot (0 - head, -4 - body)")
        builder.slider("Aim noise", "aimNoise", 0, 2, 0.005, "The higher it is, the lower is the aimbot accuracy")
        builder.checkbox("Supersilent aim", "superSilent", "Only works with quickscope and silent aim, makes it almost invisible that you're looking at somebody when you're shooting at him")
        builder.checkbox("Aim at AIs", "AImbot", "Makes the aimbot shoot at NPCs")
        builder.checkbox("FOV check", "frustumCheck", "Makes you only shoot at enemies that are in your field of view. Prevents 180 flicks")
        builder.checkbox("FOV box", "fovbox", "Creates a box in which enemies can be targetted, enable with FOV check")
        builder.select("FOV box size", "fovBoxSize", {
            "Big": 1,
            "Medium": 2,
            "Small": 3,
        })
        builder.checkbox("Wallbangs", "wallbangs", "Makes the aimbot shoot enemies behind walls")
        builder.checkbox("Aimbot range check", "rangeCheck", "Checks if the enemy is in range of your weapon before shooting it, disable for rocket launcher")
        builder.checkbox("Auto reload", "autoReload", "Automatically reloads your weapon when it's out of ammo")
        builder.checkbox("Prevent melee throwing", "preventMeleeThrowing", "Prevents you from throwing your knife")
        //builder.checkbox("Auto swap", "autoSwap", "Automatically swaps the weapon when you're out of ammo")
    })

    tab(1, () => {
        builder.select("ESP [H]", "esp", {
            "None": 0,
            "Nametags": 1,
            "Box ESP": 2,
            "Full ESP": 3,
        })
        builder.select("ESP Font Size", "espFontSize", {
            "30px": 30,
            "25px": 25,
            "20px": 20,
            "15px": 15,
            "10px": 10,
            "5px": 5,
        })
        builder.select("Tracers", "tracers", {
            "None": 0,
            "Bottom": 1,
            "Middle": 2,
        }, "Draws lines to players")
        builder.checkbox("Mark aimbot target", "markTarget", "Shows who is the aimbot targetting at the time, useful for aim assist/aim correction")
        builder.checkbox("Draw FOV box", "drawFovbox", "Draws the FOV box from aimbot settings")
        builder.checkbox("Chams", "chams")
        builder.select("Chams colour", "chamsCol", {
            White: 0,
            Black: 1,
            Purple: 2,
            Pink: 3,
            Blue: 4,
            DarkBlue: 5,
            Aqua: 6,
            Green: 7,
            Lime: 8,
            Orange: 9,
            Yellow: 10,
            Red: 11,
            Gaybow: 12,
        })
        builder.checkbox("Friendly chams", "teamChams", "Show Chams for friendly players")
        builder.checkbox("Wireframe", "wireframe")
        builder.slider("RGB interval", "chamsInterval", 50, 1000, 50, "How fast will the RGB chams change colour")
    })

    tab(2, () => {
        builder.checkbox("Third person mode", "thirdPerson")
        builder.checkbox("Skin hack", "skinHack", "Makes you able to use any skin in game, only shows on your side")
        builder.checkbox("Billboard shaders", "animatedBillboards", "Disable if you get fps drops")
        builder.checkbox("Any weapon trail", "alwaysTrail")
        builder.slider("Weapon Zoom", "weaponZoom", 0, 20, .1, "Weapon Zoom Multiplier Adjust")
    })

    tab(3, () => {
        builder.checkbox("Always aim", "alwaysAim", "Makes you slower and jump lower, but the aimbot can start shooting at enemies  faster. Only use if ur good at bhopping")
        builder.checkbox("Aim when target visible", "awtv")
        builder.checkbox("Unaim when no target visible", "uwtv")
        builder.checkbox("Force unsilent", "forceUnsilent")
    })

    tab(4, () => {
        builder.select("Auto bhop", "bhop", {
            "None": 0,
            "Auto Jump": 1,
            "Key Jump": 2,
            "Auto Slide": 3,
            "Key Slide": 4,
        })
        builder.label("Only use with silent aim")
        builder.select("Pitch hax", "pitchHack", {
            "Disabled": 0,
            "Downward": 1,
            "Upward": 2,
            "sin(time)": 3,
            "sin(time/5)": 4,
            "double": 5,
            "random": 6,
        }, "Only use with aimbot on")
        builder.checkbox("Spin bot", "spinBot")
    })

    tab(5, () => {
        builder.checkbox("Show GUI button", "showGuiButton", "Disable if you don't want the dog under settings to be visible")
        builder.checkbox("GUI on middle mouse button", "guiOnMMB", "Makes it possible to open this menu by clicking the mouse wheel")
        builder.checkbox("Keybinds", "keybinds", "Turn keybinds on/off, Aimbot - Y, ESP - H")
        builder.checkbox("No inactivity kick", "antikick", "Disables the 'Kicked for inactivity' message (client side, but works)")
        builder.checkbox("Auto nuke", "autoNuke", "Automatically nukes when you are able to")
        builder.checkbox("Force nametags on", "fgno", "Use in custom games with disabled nametags")
        builder.checkbox("Use Kpal CSS", "kpalCSS", "Use the kpal CSS when no custom CSS is Applied")
        builder.input("Custom CSS", "customCSS", "url", "", "URL to CSS file")
    })

    if (dog.isClient) {
        tab(6, () => {
            builder.nobrlabel("Restart is required after changing any of these settings")
            builder.br()
            builder.client_setting("Uncap FPS", "uncap_fps", "Disables V-Sync")
            builder.client_setting("Adblock", "adblock", "Disables ads")
        })
    }

    built += "</div>"

    return built;
}

 getDistance(x1, y1, x2, y2) {
    return Math.sqrt((x2 -= x1) * x2 + (y2 -= y1) * y2);
}

getDistance3D(x1, y1, z1, x2, y2, z2) {
    let dx = x1 - x2;
    let dy = y1 - y2;
    let dz = z1 - z2;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

getXDir(x1, y1, z1, x2, y2, z2) {
    let h = Math.abs(y1 - y2);
    let dst = this.getDistance3D(x1, y1, z1, x2, y2, z2);
    return (Math.asin(h / dst) * ((y1 > y2) ? -1 : 1));
}

getDir(x1, y1, x2, y2) {
    return Math.atan2(y1 - y2, x1 - x2);
}

getAngleDist(a, b) {
    return Math.atan2(Math.sin(b - a), Math.cos(a - b));
}

containsPoint(point) {
    let planes = this.renderer.frustum.planes;
    for (let i = 0; i < 6; i++) {
        if (planes[i].distanceToPoint(point) < 0) {
            return false;
        }
    }
    return true;
}

world2Screen(pos, width, height, yOffset = 0) {
    pos.y += yOffset
    pos.project(this.renderer.camera)
    pos.x = (pos.x + 1) / 2
    pos.y = (-pos.y + 1) / 2
    pos.x *= width
    pos.y *= height
    return pos
}
};

window[dogStr] = new Dogeware();

})([...Array(8)].map(_ => 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ' [~~(Math.random() * 52)]).join(''));