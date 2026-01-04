// ==UserScript==
// @name          Krunker SkidFest
// @namespace     Krunker SkidFest
// @description   A full featured Mod menu for game Krunker.io!
// @version       2.22
// @author        SkidLamer - From The Gaming Gurus
// @supportURL    https://i.imgur.com/krfAACY.png
// @homepage      https://skidlamer.github.io/
// @match         *://krunker.io/*
// @exclude       *://krunker.io/editor*
// @exclude       *://krunker.io/social*
// @run-at        document-start
// @grant         none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/421047/Krunker%20SkidFest.user.js
// @updateURL https://update.greasyfork.org/scripts/421047/Krunker%20SkidFest.meta.js
// ==/UserScript==

/* eslint-env es6 */
/* eslint-disable no-caller, no-undef, no-loop-func */

(function(skidStr, CRC2d, skid) {

    class Skid {
        constructor() {
            skid = this;
            this.downKeys = new Set();
            this.settings = null;
            this.vars = {};
            this.playerMaps = [];
            this.skinCache = {};
            this.inputFrame = 0;
            this.renderFrame = 0;
            this.fps = 0;
            this.lists = {
                renderESP: {
                    off: "Off",
                    walls: "Walls",
                    twoD: "2d",
                    full: "Full"
                },
                renderChams: {
                    off: "Off",
                    white: "White",
                    blue: "Blue",
                    teal: "Teal",
                    purple: "Purple",
                    green: "Green",
                    yellow: "Yellow",
                    red: "Red",
                },
                autoBhop: {
                    off: "Off",
                    autoJump: "Auto Jump",
                    keyJump: "Key Jump",
                    autoSlide: "Auto Slide",
                    keySlide: "Key Slide"
                },
                autoAim: {
                    off: "Off",
                    correction: "Aim Correction",
                    assist: "Legit Aim Assist",
                    easyassist: "Easy Aim Assist",
                    silent: "Silent Aim",
                    trigger: "Trigger Bot",
                    quickScope: "Quick Scope"
                },
                audioStreams: {
                    off: 'Off',
                    _2000s: 'General German/English',
                    _HipHopRNB: 'Hip Hop / RNB',
                    _Oldskool: 'Hip Hop Oldskool',
                    _Country: 'Country',
                    _Pop: 'Pop',
                    _Dance: 'Dance',
                    _Dubstep: 'DubStep',
                    _Lowfi: 'LoFi HipHop',
                    _Jazz: 'Jazz',
                    _Oldies: 'Golden Oldies',
                    _Club: 'Club',
                    _Folk: 'Folk',
                    _ClassicRock: 'Classic Rock',
                    _Metal: 'Heavy Metal',
                    _DeathMetal: 'Death Metal',
                    _Classical: 'Classical',
                    _Alternative: 'Alternative',
                },
            }
            this.consts = {
                twoPI: Math.PI * 2,
                halfPI: Math.PI / 2,
                playerHeight: 11,
                cameraHeight: 1.5,
                headScale: 2,
                armScale: 1.3,
                armInset: 0.1,
                chestWidth: 2.6,
                hitBoxPad: 1,
                crouchDst: 3,
                recoilMlt: 0.3,
                nameOffset: 0.6,
                nameOffsetHat: 0.8,
            };
            this.key = {
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
            };
            this.css = {
                noTextShadows: `*, .button.small, .bigShadowT { text-shadow: none !important; }`,
                hideAdverts: `#aMerger, #endAMerger { display: none !important }`,
                hideSocials: `.headerBarRight > .verticalSeparator, .imageButton { display: none }`,
                cookieButton: `#onetrust-consent-sdk { display: none !important }`,
                newsHolder: `#newsHolder { display: none !important }`,
            };
            this.isProxy = Symbol("isProxy");
            this.spinTimer = 1800;
            try {
                this.onLoad();
            }
            catch(e) {
                console.error(e);
                console.trace(e.stack);
            }
        }
        canStore() {
            return this.isDefined(Storage);
        }

        saveVal(name, val) {
            if (this.canStore()) localStorage.setItem("kro_utilities_"+name, val);
        }

        deleteVal(name) {
            if (this.canStore()) localStorage.removeItem("kro_utilities_"+name);
        }

        getSavedVal(name) {
            if (this.canStore()) return localStorage.getItem("kro_utilities_"+name);
            return null;
        }

        isType(item, type) {
            return typeof item === type;
        }

        isDefined(object) {
            return !this.isType(object, "undefined") && object !== null;
        }

        isNative(fn) {
            return (/^function\s*[a-z0-9_\$]*\s*\([^)]*\)\s*\{\s*\[native code\]\s*\}/i).test('' + fn)
        }

        getStatic(s, d) {
            return this.isDefined(s) ? s : d
        }

        crossDomain(url) {
            return "https://crossorigin.me/" + url;
        }

        async waitFor(test, timeout_ms = 2e4, doWhile = null) {
            let sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
            return new Promise(async (resolve, reject) => {
                if (typeof timeout_ms != "number") reject("Timeout argument not a number in waitFor(selector, timeout_ms)");
                let result, freq = 100;
                while (result === undefined || result === false || result === null || result.length === 0) {
                    if (doWhile && doWhile instanceof Function) doWhile();
                    if (timeout_ms % 1e4 < freq) console.log("waiting for: ", test);
                    if ((timeout_ms -= freq) < 0) {
                        console.log( "Timeout : ", test );
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

        async request(url, type, opt = {}) {
            return fetch(url, opt).then(response => {
                if (!response.ok) {
                    throw new Error("Network response from " + url + " was not ok")
                }
                return response[type]()
            })
        }

        async fetchScript() {
            const data = await this.request("https://krunker.io/social.html", "text");
            const buffer = await this.request("https://krunker.io/pkg/krunker." + /\w.exports="(\w+)"/.exec(data)[1] + ".vries", "arrayBuffer");
            const array = Array.from(new Uint8Array(buffer));
            const xor = array[0] ^ '!'.charCodeAt(0);
            return array.map((code) => String.fromCharCode(code ^ xor)).join('');
        }

        createSettings() {
            this.displayStyle = (el, val) => {
                this.waitFor(_=>window[el], 5e3).then(node => {
                    if (node) node.style.display = val ? "none" : "inherit";
                    else console.error(el, " was not found in the window object");
                })
            }
            this.settings = {
                //Rendering
                showSkidBtn: {
                    pre: "<div class='setHed'>Rendering</div>",
                    name: "Show Skid Button",
                    val: true,
                    html: () => this.generateSetting("checkbox", "showSkidBtn", this),
                    set: (value, init) => {
                        let button = document.getElementById("mainButton");
                        if (!button) {
                            button = this.createButton("5k1D", "https://i.imgur.com/1tWAEJx.gif", this.toggleMenu, value)
                        } else button.style.display = value ? "inherit" : "none";
                    }
                },
                hideAdverts: {
                    name: "Hide Advertisments",
                    val: true,
                    html: () => this.generateSetting("checkbox", "hideAdverts", this),
                    set: (value, init) => {
                        if (value) this.head.appendChild(this.css.hideAdverts)
                        else if (!init) this.css.hideAdverts.remove()
                    }
                },
                hideStreams: {
                    name: "Hide Streams",
                    val: false,
                    html: () => this.generateSetting("checkbox", "hideStreams", this),
                    set: (value) => { this.displayStyle("streamContainer", value) }
                },
                hideMerch: {
                    name: "Hide Merch",
                    val: false,
                    html: () => this.generateSetting("checkbox", "hideMerch", this),
                    set: (value) => { this.displayStyle("merchHolder", value) }
                },
                hideNewsConsole: {
                    name: "Hide News Console",
                    val: false,
                    html: () => this.generateSetting("checkbox", "hideNewsConsole", this),
                    set: (value) => { this.displayStyle("newsHolder", value) }
                },
                hideCookieButton: {
                    name: "Hide Security Manage Button",
                    val: false,
                    html: () => this.generateSetting("checkbox", "hideCookieButton", this),
                    set: (value) => { this.displayStyle("onetrust-consent-sdk", value) }
                },
                noTextShadows: {
                    name: "Remove Text Shadows",
                    val: false,
                    html: () => this.generateSetting("checkbox", "noTextShadows", this),
                    set: (value, init) => {
                        if (value) this.head.appendChild(this.css.noTextShadows)
                        else if (!init) this.css.noTextShadows.remove()
                    }
                },
                customCSS: {
                    name: "Custom CSS",
                    val: "",
                    html: () => this.generateSetting("url", "customCSS", "URL to CSS file"),
                    resources: { css: document.createElement("link") },
                    set: (value, init) => {
                        if (value.startsWith("http")&&value.endsWith(".css")) {
                            //let proxy = 'https://cors-anywhere.herokuapp.com/';
                            this.settings.customCSS.resources.css.href = value
                        }
                        if (init) {
                            this.settings.customCSS.resources.css.rel = "stylesheet"
                            try {
                                this.head.appendChild(this.settings.customCSS.resources.css)
                            } catch(e) {
                                alert(e)
                                this.settings.customCSS.resources.css = null
                            }
                        }
                    }
                },
                renderESP: {
                    name: "Player ESP Type",
                    val: "off",
                    html: () =>
                    this.generateSetting("select", "renderESP", this.lists.renderESP),
                },
                renderTracers: {
                    name: "Player Tracers",
                    val: false,
                    html: () => this.generateSetting("checkbox", "renderTracers"),
                },
                rainbowColor: {
                    name: "Rainbow ESP",
                    val: false,
                    html: () => this.generateSetting("checkbox", "rainbowColor"),
                },
                renderChams: {
                    name: "Player Chams",
                    val: "off",
                    html: () =>
                    this.generateSetting(
                        "select",
                        "renderChams",
                        this.lists.renderChams
                    ),
                },
                renderWireFrame: {
                    name: "Player Wireframe",
                    val: false,
                    html: () => this.generateSetting("checkbox", "renderWireFrame"),
                },
                customBillboard: {
                    name: "Custom Billboard Text",
                    val: "",
                    html: () =>
                    this.generateSetting(
                        "text",
                        "customBillboard",
                        "Custom Billboard Text"
                    ),
                },
                //Weapon
                autoReload: {
                    pre: "<br><div class='setHed'>Weapon</div>",
                    name: "Auto Reload",
                    val: false,
                    html: () => this.generateSetting("checkbox", "autoReload"),
                },
                autoAim: {
                    name: "Auto Aim Type",
                    val: "off",
                    html: () =>
                    this.generateSetting("select", "autoAim", this.lists.autoAim),
                },
                frustrumCheck: {
                    name: "Line of Sight Check",
                    val: false,
                    html: () => this.generateSetting("checkbox", "frustrumCheck"),
                },
                wallPenetrate: {
                    name: "Aim through Penetratables",
                    val: false,
                    html: () => this.generateSetting("checkbox", "wallPenetrate"),
                },
                weaponZoom: {
                    name: "Weapon Zoom",
                    val: 1.0,
                    min: 0,
                    max: 50.0,
                    step: 0.01,
                    html: () => this.generateSetting("slider", "weaponZoom"),
                    set: (value) => { if (this.renderer) this.renderer.adsFovMlt = value;}
                },
                weaponTrails: {
                    name: "Weapon Trails",
                    val: false,
                    html: () => this.generateSetting("checkbox", "weaponTrails"),
                    set: (value) => { if (this.me) this.me.weapon.trail = value;}
                },
                //Player
                autoBhop: {
                    pre: "<br><div class='setHed'>Player</div>",
                    name: "Auto Bhop Type",
                    val: "off",
                    html: () => this.generateSetting("select", "autoBhop", this.lists.autoBhop),
                },
                thirdPerson: {
                    name: "Third Person",
                    val: false,
                    html: () => this.generateSetting("checkbox", "thirdPerson"),
                    set: (value, init) => {
                        if (value) this.thirdPerson = 1;
                        else if (!init) this.thirdPerson = undefined;
                    }
                },
                skinUnlock: {
                    name: "Unlock Skins",
                    val: false,
                    html: () => this.generateSetting("checkbox", "skinUnlock", this),
                },
                //GamePlay
                disableWpnSnd: {
                    pre: "<br><div class='setHed'>GamePlay</div>",
                    name: "Disable Players Weapon Sounds",
                    val: false,
                    html: () => this.generateSetting("checkbox", "disableWpnSnd", this),
                },
                disableHckSnd: {
                    name: "Disable Hacker Fart Sounds",
                    val: false,
                    html: () => this.generateSetting("checkbox", "disableHckSnd", this),
                },
                autoActivateNuke: {
                    name: "Auto Activate Nuke",
                    val: false,
                    html: () => this.generateSetting("checkbox", "autoActivateNuke", this),
                },
                autoFindNew: {
                    name: "New Lobby Finder",
                    val: false,
                    html: () => this.generateSetting("checkbox", "autoFindNew", this),
                },
                autoClick: {
                    name: "Auto Start Game",
                    val: false,
                    html: () => this.generateSetting("checkbox", "autoClick", this),
                },
                inActivity: {
                    name: "No InActivity Kick",
                    val: true,
                    html: () => this.generateSetting("checkbox", "autoClick", this),
                },
                //Radio Stream Player
                playStream: {
                    pre: "<br><div class='setHed'>Radio Stream Player</div>",
                    name: "Stream Select",
                    val: "off",
                    html: () => this.generateSetting("select", "playStream", this.lists.audioStreams),
                    set: (value) => {
                        if (value == "off") {
                            if ( this.settings.playStream.audio ) {
                                this.settings.playStream.audio.pause();
                                this.settings.playStream.audio.currentTime = 0;
                                this.settings.playStream.audio = null;
                            }
                            return;
                        }
                        let url = this.settings.playStream.urls[value];
                        if (!this.settings.playStream.audio) {
                            this.settings.playStream.audio = new Audio(url);
                            this.settings.playStream.audio.volume = this.settings.audioVolume.val||0.5
                        } else {
                            this.settings.playStream.audio.src = url;
                        }
                        this.settings.playStream.audio.load();
                        this.settings.playStream.audio.play();
                    },
                    urls: {
                        _2000s: 'http://0n-2000s.radionetz.de/0n-2000s.aac',
                        _HipHopRNB: 'https://stream-mixtape-geo.ntslive.net/mixtape2',
                        _Country: 'https://live.wostreaming.net/direct/wboc-waaifmmp3-ibc2',
                        _Dance: 'http://streaming.radionomy.com/A-RADIO-TOP-40',
                        _Pop: 'http://bigrradio.cdnstream1.com/5106_128',
                        _Jazz: 'http://strm112.1.fm/ajazz_mobile_mp3',
                        _Oldies: 'http://strm112.1.fm/60s_70s_mobile_mp3',
                        _Club: 'http://strm112.1.fm/club_mobile_mp3',
                        _Folk: 'https://freshgrass.streamguys1.com/irish-128mp3',
                        _ClassicRock: 'http://1a-classicrock.radionetz.de/1a-classicrock.mp3',
                        _Metal: 'http://streams.radiobob.de/metalcore/mp3-192',
                        _DeathMetal: 'http://stream.laut.fm/beatdownx',
                        _Classical: 'http://live-radio01.mediahubaustralia.com/FM2W/aac/',
                        _Alternative: 'http://bigrradio.cdnstream1.com/5187_128',
                        _Dubstep: 'http://streaming.radionomy.com/R1Dubstep?lang=en',
                        _Lowfi: 'http://streams.fluxfm.de/Chillhop/mp3-256',
                        _Oldskool: 'http://streams.90s90s.de/hiphop/mp3-128/',
                    },
                    audio: null,
                },
                audioVolume: {
                    name: "Radio Volume",
                    val: 0.5,
                    min: 0,
                    max: 1,
                    step: 0.01,
                    html: () => this.generateSetting("slider", "audioVolume"),
                    set: (value) => { if (this.settings.playStream.audio) this.settings.playStream.audio.volume = value;}
                },
            };

            // Inject Html
            let waitForWindows = setInterval(_ => {
                if (window.windows) {
                    const menu = window.windows[11];
                    menu.header = "Settings";
                    menu.gen = _ => {
                        var tmpHTML = `<div style='text-align:center'> <a onclick='window.open("https://www.youtube.com/channel/UCKN9qye5ZIGvCvq0fwrRNjg")' class='menuLink'>SkidFest Settings</center></a> <hr> </div>`;
                        for (const key in this.settings) {
                            if (this.settings[key].pre) tmpHTML += this.settings[key].pre;
                            tmpHTML += "<div class='settName' id='" + key + "_div' style='display:" + (this.settings[key].hide ? 'none' : 'block') + "'>" + this.settings[key].name +
                                " " + this.settings[key].html() + "</div>";
                        }
                        tmpHTML += `<br><hr><a onclick='${skidStr}.resetSettings()' class='menuLink'>Reset Settings</a> | <a onclick='${skidStr}.saveScript()' class='menuLink'>Save GameScript</a>`
                        return tmpHTML;
                    };
                    clearInterval(waitForWindows);
                    //this.createButton("5k1D", "https://i.imgur.com/1tWAEJx.gif", this.toggleMenu)
                }
            }, 100);

            // setupSettings
            for (const key in this.settings) {
                this.settings[key].def = this.settings[key].val;
                if (!this.settings[key].disabled) {
                    let tmpVal = this.getSavedVal(key);
                    this.settings[key].val = tmpVal !== null ? tmpVal : this.settings[key].val;
                    if (this.settings[key].val == "false") this.settings[key].val = false;
                    if (this.settings[key].val == "true") this.settings[key].val = true;
                    if (this.settings[key].val == "undefined") this.settings[key].val = this.settings[key].def;
                    if (this.settings[key].set) this.settings[key].set(this.settings[key].val, true);
                }
            }
        }

        generateSetting(type, name, extra) {
            switch (type) {
                case 'checkbox':
                    return `<label class="switch"><input type="checkbox" onclick="${skidStr}.setSetting('${name}', this.checked)" ${this.settings[name].val ? 'checked' : ''}><span class="slider"></span></label>`;
                case 'slider':
                    return `<span class='sliderVal' id='slid_utilities_${name}'>${this.settings[name].val}</span><div class='slidecontainer'><input type='range' min='${this.settings[name].min}' max='${this.settings[name].max}' step='${this.settings[name].step}' value='${this.settings[name].val}' class='sliderM' oninput="${skidStr}.setSetting('${name}', this.value)"></div>`
                    case 'select': {
                        let temp = `<select onchange="${skidStr}.setSetting(\x27${name}\x27, this.value)" class="inputGrey2">`;
                        for (let option in extra) {
                            temp += '<option value="' + option + '" ' + (option == this.settings[name].val ? 'selected' : '') + '>' + extra[option] + '</option>';
                        }
                        temp += '</select>';
                        return temp;
                    }
                default:
                    return `<input type="${type}" name="${type}" id="slid_utilities_${name}"\n${'color' == type ? 'style="float:right;margin-top:5px"' : `class="inputGrey2" placeholder="${extra}"`}\nvalue="${this.settings[name].val}" oninput="${skidStr}.setSetting(\x27${name}\x27, this.value)"/>`;
            }
        }

        resetSettings() {
            if (confirm("Are you sure you want to reset all your settings? This will also refresh the page")) {
                Object.keys(localStorage).filter(x => x.includes("kro_utilities_")).forEach(x => localStorage.removeItem(x));
                location.reload();
            }
        }

        setSetting(t, e) {
            this.settings[t].val = e;
            this.saveVal(t, e);
            if (document.getElementById(`slid_utilities_${t}`)) document.getElementById(`slid_utilities_${t}`).innerHTML = e;
            if (this.settings[t].set) this.settings[t].set(e);
        }

        createObserver(elm, check, callback, onshow = true) {
            return new MutationObserver((mutationsList, observer) => {
                if (check == 'src' || onshow && mutationsList[0].target.style.display == 'block' || !onshow) {
                    callback(mutationsList[0].target);
                }
            }).observe(elm, check == 'childList' ? {childList: true} : {attributes: true, attributeFilter: [check]});
        }

        createListener(elm, type, callback = null) {
            if (!this.isDefined(elm)) {
                alert("Failed creating " + type + "listener");
                return
            }
            elm.addEventListener(type, event => callback(event));
        }

        createElement(element, attribute, inner) {
            if (!this.isDefined(element)) {
                return null;
            }
            if (!this.isDefined(inner)) {
                inner = "";
            }
            let el = document.createElement(element);
            if (this.isType(attribute, 'object')) {
                for (let key in attribute) {
                    el.setAttribute(key, attribute[key]);
                }
            }
            if (!Array.isArray(inner)) {
                inner = [inner];
            }
            for (let i = 0; i < inner.length; i++) {
                if (inner[i].tagName) {
                    el.appendChild(inner[i]);
                } else {
                    el.appendChild(document.createTextNode(inner[i]));
                }
            }
            return el;
        }

        createButton(name, iconURL, fn, visible) {
            visible = visible ? "inherit":"none";
            let menu = document.querySelector("#menuItemContainer");
            let icon = this.createElement("div",{"class":"menuItemIcon", "style":`background-image:url("${iconURL}");display:inherit;`});
            let title= this.createElement("div",{"class":"menuItemTitle", "style":`display:inherit;`}, name);
            let host = this.createElement("div",{"id":"mainButton", "class":"menuItem", "onmouseenter":"playTick()", "onclick":"showWindow(12)", "style":`display:${visible};`},[icon, title]);
            if (menu) menu.append(host)
        }

        objectHas(obj, arr) {
            return arr.some(prop => obj.hasOwnProperty(prop));
        }

        getVersion() {
            const elems = document.getElementsByClassName('terms');
            const version = elems[elems.length - 1].innerText;
            return version;
        }

        saveAs(name, data) {
            let blob = new Blob([data], {type: 'text/plain'});
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

        isKeyDown(key) {
            return this.downKeys.has(key);
        }

        simulateKey(keyCode) {
            var oEvent = document.createEvent('KeyboardEvent');
            // Chromium Hack
            Object.defineProperty(oEvent, 'keyCode', {
                get : function() {
                    return this.keyCodeVal;
                }
            });
            Object.defineProperty(oEvent, 'which', {
                get : function() {
                    return this.keyCodeVal;
                }
            });

            if (oEvent.initKeyboardEvent) {
                oEvent.initKeyboardEvent("keypress", true, true, document.defaultView, keyCode, keyCode, "", "", false, "");
            } else {
                oEvent.initKeyEvent("keypress", true, true, document.defaultView, false, false, false, false, keyCode, 0);
            }

            oEvent.keyCodeVal = keyCode;

            if (oEvent.keyCode !== keyCode) {
                alert("keyCode mismatch " + oEvent.keyCode + "(" + oEvent.which + ")");
            }

            document.body.dispatchEvent(oEvent);
        }

        toggleMenu() {
            let lock = document.pointerLockElement || document.mozPointerLockElement;
            if (lock) document.exitPointerLock();
            window.showWindow(12);
            if (this.isDefined(window.SOUND)) window.SOUND.play(`tick_0`,0.1)
        }

        onLoad() {
            this.createObservers();
            this.waitFor(_=>this.head, 1e4, _=> { this.head = document.head||document.getElementsByTagName('head')[0] }).then(head => {
                if (!head) location.reload();
                Object.entries(this.css).forEach(entry => {
                    this.css[entry[0]] = this.createElement("style", entry[1]);
                })
                this.createSettings();
            })
            this.waitFor(_=>window.Module.token, 5e3).then(token => {
                if (!token) {
                    return window.request("https://krunker.space/token","json",{cache: "no-store"}).then(json => {
                        if (json && json.token) {
                            console.log("krunker.space/token");
                            return json.token;
                        }
                        else {
                            console.error("game token not found");
                            return null;
                        }
                    })
                } else return token;
            }).then(token => {
                if (!token) location.reload();
                const loader = new Function("WP_fetchMMToken", "Module", this.gameJS());
                loader(new Promise(res=>res(token)), { csv: async () => 0 }); //window.Module
            })
            this.waitFor(_=>this.exports, 1e4).then(exports => {
                if (!exports) return alert("This Script needs updating");
                else {
                    //console.dir(exports)
                    let toFind = {
                        overlay: ["render", "canvas"],
                        config: ["accAnnounce", "availableRegions", "assetCat"],
                        three: ["ACESFilmicToneMapping", "TextureLoader", "ObjectLoader"],
                        ws: ["socketReady", "ingressPacketCount", "ingressPacketCount", "egressDataSize"],
                        //utility: ["VectorAdd", "VectorAngleSign"],
                        //colors: ["challLvl", "getChallCol"],
                        //ui: ["showEndScreen", "toggleControlUI", "toggleEndScreen", "updatePlayInstructions"],
                        //events: ["actions", "events"],
                    }
                    for (let rootKey in this.exports) {
                        let exp = this.exports[rootKey].exports;
                        for (let name in toFind) {
                            if (this.objectHas(exp, toFind[name])) {
                                console.log("Found Export ", name);
                                delete toFind[name];
                                this[name] = exp;
                            }
                        }
                    }
                    if (!(Object.keys(toFind).length === 0 && toFind.constructor === Object)) {
                        for (let name in toFind) {
                            alert("Failed To Find Export " + name);
                        }
                    } else {
                        Object.defineProperty(this.config, "nameVisRate", {
                            value: 0,
                            writable: false,
                            configurable: true,
                        })
                        this.ctx = this.overlay.canvas.getContext('2d');
                        this.overlay.render = new Proxy(this.overlay.render, {
                            apply: function(target, that, args) {
                                return [target.apply(that, args), render.apply(that, args)]
                            }
                        })
                        function render(scale, game, controls, renderer, me) {
                            let width = skid.overlay.canvas.width / scale;
                            let height = skid.overlay.canvas.height / scale;
                            const renderArgs = [scale, game, controls, renderer, me];
                            if (renderArgs && void 0 !== skid) {
                                ["scale", "game", "controls", "renderer", "me"].forEach((item, index)=>{
                                    skid[item] = renderArgs[index];
                                });
                                if (me) {
                                    skid.ctx.save();
                                    skid.ctx.scale(scale, scale);
                                    //this.ctx.clearRect(0, 0, width, height);
                                    skid.onRender();
                                    //window.requestAnimationFrame.call(window, renderArgs.callee.caller.bind(this));
                                    skid.ctx.restore();
                                }
                                if(skid.settings && skid.settings.autoClick.val && window.endUI.style.display == "none" && window.windowHolder.style.display == "none") {
                                    controls.toggle(true);
                                }
                            }
                        }

                        // Skins
                        const $skins = Symbol("skins");
                        Object.defineProperty(Object.prototype, "skins", {
                            set: function(fn) {
                                this[$skins] = fn;
                                if (void 0 == this.localSkins || !this.localSkins.length) {
                                    this.localSkins = Array.apply(null, Array(5e3)).map((x, i) => {
                                        return {
                                            ind: i,
                                            cnt: 0x1,
                                        }
                                    })
                                }
                                return fn;
                            },
                            get: function() {
                                return skid.settings.skinUnlock.val && this.stats ? this.localSkins : this[$skins];
                            }
                        })

                        this.waitFor(_=>this.ws.connected === true, 40000).then(_=> {
                            this.ws.__event = this.ws._dispatchEvent.bind(this.ws);
                            this.ws.__send = this.ws.send.bind(this.ws);
                            this.ws.send = new Proxy(this.ws.send, {
                                apply: function(target, that, args) {
                                    if (args[0] == "ah2") return;
                                    try {
                                        var original_fn = Function.prototype.apply.apply(target, [that, args]);
                                    } catch (e) {
                                        e.stack = e.stack = e.stack.replace(/\n.*Object\.apply.*/, '');
                                        throw e;
                                    }

                                    if (args[0] === "en") {
                                        skid.skinCache = {
                                            main: args[1][2][0],
                                            secondary: args[1][2][1],
                                            hat: args[1][3],
                                            body: args[1][4],
                                            knife: args[1][9],
                                            dye: args[1][14],
                                            waist: args[1][17],
                                        }
                                    }

                                    return original_fn;
                                }
                            })

                            this.ws._dispatchEvent = new Proxy(this.ws._dispatchEvent, {
                                apply: function(target, that, [type, event]) {
                                    if (type =="init") {
                                        if(event[10] && event[10].length && event[10].bill && skid.settings.customBillboard.val.length > 1) {
                                            event[10].bill.txt = skid.settings.customBillboard.val;
                                        }
                                    }

                                    if (skid.settings.skinUnlock.val && skid.skinCache && type === "0") {
                                        let skins = skid.skinCache;
                                        let pInfo = event[0];
                                        let pSize = 38;
                                        while (pInfo.length % pSize !== 0) pSize++;
                                        for(let i = 0; i < pInfo.length; i += pSize) {
                                            if (pInfo[i] === skid.ws.socketId||0) {
                                                pInfo[i + 12] = [skins.main, skins.secondary];
                                                pInfo[i + 13] = skins.hat;
                                                pInfo[i + 14] = skins.body;
                                                pInfo[i + 19] = skins.knife;
                                                pInfo[i + 24] = skins.dye;
                                                pInfo[i + 33] = skins.waist;
                                            }
                                        }
                                    }

                                    return target.apply(that, arguments[2]);
                                }
                            })
                        })

                        if (this.isDefined(window.SOUND)) {
                            window.SOUND.play = new Proxy(window.SOUND.play, {
                                apply: function(target, that, [src, vol, loop, rate]) {
                                    if ( src.startsWith("fart_") && skid.settings.disableHckSnd.val ) return;
                                    return target.apply(that, [src, vol, loop, rate]);
                                }
                            })
                        }

                        AudioParam.prototype.setValueAtTime = new Proxy(AudioParam.prototype.setValueAtTime, {
                            apply: function(target, that, [value, startTime]) {
                                return target.apply(that, [value, 0]);
                            }
                        })

                        this.rayC = new this.three.Raycaster();
                        this.vec2 = new this.three.Vector2(0, 0);
                    }
                }
            })
        }

        gameJS() {
            let entries = {
                // Deobfu
                inView: { regex: /(\w+\['(\w+)']\){if\(\(\w+=\w+\['\w+']\['position']\['clone']\(\))/, index: 2 },
                spectating: { regex: /\['team']:window\['(\w+)']/, index: 1 },
                //inView: { regex: /\]\)continue;if\(!\w+\['(.+?)\']\)continue;/, index: 1 },
                //canSee: { regex: /\w+\['(\w+)']\(\w+,\w+\['x'],\w+\['y'],\w+\['z']\)\)&&/, index: 1 },
                //procInputs: { regex: /this\['(\w+)']=function\((\w+),(\w+),\w+,\w+\){(this)\['recon']/, index: 1 },
                aimVal: { regex: /this\['(\w+)']-=0x1\/\(this\['weapon']\['\w+']\/\w+\)/, index: 1 },
                pchObjc: { regex: /0x0,this\['(\w+)']=new \w+\['Object3D']\(\),this/, index: 1 },
                didShoot: { regex: /--,\w+\['(\w+)']=!0x0/, index: 1 },
                nAuto: { regex: /'Single\\x20Fire','varN':'(\w+)'/, index: 1 },
                crouchVal: { regex: /this\['(\w+)']\+=\w\['\w+']\*\w+,0x1<=this\['\w+']/, index: 1 },
                recoilAnimY: { regex: /\+\(-Math\['PI']\/0x4\*\w+\+\w+\['(\w+)']\*\w+\['\w+']\)\+/, index: 1 },
                //recoilAnimY: { regex: /this\['recoilAnim']=0x0,this\[(.*?\(''\))]/, index: 1 },
                ammos: { regex: /\['length'];for\(\w+=0x0;\w+<\w+\['(\w+)']\['length']/, index: 1 },
                weaponIndex: { regex: /\['weaponConfig']\[\w+]\['secondary']&&\(\w+\['(\w+)']==\w+/, index: 1 },
                isYou: { regex: /0x0,this\['(\w+)']=\w+,this\['\w+']=!0x0,this\['inputs']/, index: 1 },
                objInstances: { regex: /\w+\['\w+']\(0x0,0x0,0x0\);if\(\w+\['(\w+)']=\w+\['\w+']/, index: 1 },
                getWorldPosition: { regex: /{\w+=\w+\['camera']\['(\w+)']\(\);/, index: 1 },
                //mouseDownL: { regex: /this\['\w+'\]=function\(\){this\['(\w+)'\]=\w*0,this\['(\w+)'\]=\w*0,this\['\w+'\]={}/, index: 1 },
                mouseDownR: { regex: /this\['(\w+)']=0x0,this\['keys']=/, index: 1 },
                //reloadTimer: { regex:  /this\['(\w+)']&&\(\w+\['\w+']\(this\),\w+\['\w+']\(this\)/, index: 1 },
                maxHealth: { regex: /this\['health']\/this\['(\w+)']\?/, index: 1 },
                xDire: { regex: /this\['(\w+)']=Math\['lerpAngle']\(this\['xDir2']/, index: 1 },
                yDire: { regex: /this\['(\w+)']=Math\['lerpAngle']\(this\['yDir2']/, index: 1 },
                //xVel: { regex: /this\['x']\+=this\['(\w+)']\*\w+\['map']\['config']\['speedX']/, index: 1 },
                yVel: { regex: /this\['y']\+=this\['(\w+)']\*\w+\['map']\['config']\['speedY']/, index: 1 },
                //zVel: { regex: /this\['z']\+=this\['(\w+)']\*\w+\['map']\['config']\['speedZ']/, index: 1 },

                // Patches
                exports: {regex: /(this\['\w+']\['\w+']\(this\);};},function\(\w+,\w+,(\w+)\){)/, patch: `$1 ${skidStr}.exports=$2.c; ${skidStr}.modules=$2.m;`},
                inputs: {regex: /(\w+\['\w+']\[\w+\['\w+']\['\w+']\?'\w+':'push']\()(\w+)\),/, patch: `$1${skidStr}.onInput($2)),`},
                inView: {regex: /&&(\w+\['\w+'])\){(if\(\(\w+=\w+\['\w+']\['\w+']\['\w+'])/, patch: `){if(!$1&&void 0 !== ${skidStr}.nameTags)continue;$2`},
                thirdPerson:{regex: /(\w+)\[\'config\'\]\[\'thirdPerson\'\]/g, patch: `void 0 !== ${skidStr}.thirdPerson`},
                isHacker:{regex: /(window\['\w+']=)!0x0\)/, patch: `$1!0x1)`},
                fixHowler:{regex: /(Howler\['orientation'](.+?)\)\),)/, patch: ``},
                respawnT:{regex: /'\w+':0x3e8\*/g, patch: `'respawnT':0x0*`},
                anticheat1:{regex: /&&\w+\(\),window\['utilities']&&\(\w+\(null,null,null,!0x0\),\w+\(\)\)/, patch: ""},
                anticheat2:{regex: /(\[]instanceof Array;).*?(var)/, patch: "$1 $2"},
                anticheat3:{regex: /windows\['length'\]>\d+.*?0x25/, patch: `0x25`},
                commandline:{regex: /Object\['defineProperty']\(console.*?\),/, patch: ""},
                writeable:{regex: /'writeable':!0x1/g, patch: "writeable:true"},
                configurable:{regex: /'configurable':!0x1/g, patch: "configurable:true"},
                typeError:{regex: /throw new TypeError/g, patch: "console.error"},
                error:{regex: /throw new Error/g, patch: "console.error"},
            };
            let script = window.Module.gameJS;
            for(let name in entries) {
                let object = entries[name];
                let found = object.regex.exec(script);
                if (object.hasOwnProperty('index')) {
                    if (!found) {
                        object.val = null;
                        alert("Failed to Find " + name);
                    } else {
                        object.val = found[object.index];
                        console.log ("Found ", name, ":", object.val);
                    }
                    Object.defineProperty(skid.vars, name, {
                        configurable: false,
                        value: object.val
                    });
                } else if (found) {
                    script = script.replace(object.regex, object.patch);
                    console.log ("Patched ", name);
                } else alert("Failed to Patch " + name);
            }
            return script;
        }

        createObservers() {

            this.createObserver(window.instructionsUpdate, 'style', (target) => {
                if (this.settings.autoFindNew.val) {
                    console.log(target)
                    if (['Kicked', 'Banned', 'Disconnected', 'Error', 'Game is full'].some(text => target && target.innerHTML.includes(text))) {
                        location = document.location.origin;
                    }
                }
            });

            this.createListener(document, "keyup", event => {
                if (this.downKeys.has(event.code)) this.downKeys.delete(event.code)
            })

            this.createListener(document, "keydown", event => {
                if (event.code == "F1") {
                    event.preventDefault();
                    this.toggleMenu();
                }
                if ('INPUT' == document.activeElement.tagName || !window.endUI && window.endUI.style.display) return;
                switch (event.code) {
                    case 'NumpadSubtract':
                        document.exitPointerLock();
                        //console.log(document.exitPointerLock)
                        console.dirxml(this)
                        break;
                    default:
                        if (!this.downKeys.has(event.code)) this.downKeys.add(event.code);
                        break;
                }
            })

            this.createListener(document, "mouseup", event => {
                switch (event.button) {
                    case 1:
                        event.preventDefault();
                        this.toggleMenu();
                        break;
                    default:
                        break;
                }
            })
        }

        onRender() { /* hrt / ttap - https://github.com/hrt */
            this.renderFrame ++;
            if (this.renderFrame >= 100000) this.renderFrame = 0;
            let scaledWidth = this.ctx.canvas.width / this.scale;
            let scaledHeight = this.ctx.canvas.height / this.scale;
            let playerScale = (2 * this.consts.armScale + this.consts.chestWidth + this.consts.armInset) / 2
            let worldPosition = this.renderer.camera[this.vars.getWorldPosition]();
            let espVal = this.settings.renderESP.val;
            if (espVal ==="walls"||espVal ==="twoD") this.nameTags = undefined; else this.nameTags = true;

            if (this.settings.autoActivateNuke.val && this.me && Object.keys(this.me.streaks).length) { /*chonker*/
                this.ws.__send("k", 0);
            }

            if (espVal !== "off") {
                this.overlay.healthColE = this.settings.rainbowColor.val ? this.overlay.rainbow.col : "#eb5656";
            }

            for (let iter = 0, length = this.game.players.list.length; iter < length; iter++) {
                let player = this.game.players.list[iter];
                if (player[this.vars.isYou] || !player.active || !this.isDefined(player[this.vars.objInstances]) || this.getIsFriendly(player)) {
                    continue;
                }

                // the below variables correspond to the 2d box esps corners
                let xmin = Infinity;
                let xmax = -Infinity;
                let ymin = Infinity;
                let ymax = -Infinity;
                let position = null;
                let br = false;
                for (let j = -1; !br && j < 2; j+=2) {
                    for (let k = -1; !br && k < 2; k+=2) {
                        for (let l = 0; !br && l < 2; l++) {
                            if (position = player[this.vars.objInstances].position.clone()) {
                                position.x += j * playerScale;
                                position.z += k * playerScale;
                                position.y += l * (player.height - player[this.vars.crouchVal] * this.consts.crouchDst);
                                if (!this.containsPoint(position)) {
                                    br = true;
                                    break;
                                }
                                position.project(this.renderer.camera);
                                xmin = Math.min(xmin, position.x);
                                xmax = Math.max(xmax, position.x);
                                ymin = Math.min(ymin, position.y);
                                ymax = Math.max(ymax, position.y);
                            }
                        }
                    }
                }

                if (br) {
                    continue;
                }

                xmin = (xmin + 1) / 2;
                ymin = (ymin + 1) / 2;
                xmax = (xmax + 1) / 2;
                ymax = (ymax + 1) / 2;

                // save and restore these variables later so they got nothing on us
                const original_strokeStyle = this.ctx.strokeStyle;
                const original_lineWidth = this.ctx.lineWidth;
                const original_font = this.ctx.font;
                const original_fillStyle = this.ctx.fillStyle;

                //Tracers
                if (this.settings.renderTracers.val) {
                    CRC2d.save.apply(this.ctx, []);
                    let screenPos = this.world2Screen(player[this.vars.objInstances].position);
                    this.ctx.lineWidth = 4.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.ctx.canvas.width/2, this.ctx.canvas.height - (this.ctx.canvas.height - scaledHeight));
                    this.ctx.lineTo(screenPos.x, screenPos.y);
                    this.ctx.strokeStyle = "rgba(0, 0, 0, 0.25)";
                    this.ctx.stroke();
                    this.ctx.lineWidth = 2.5;
                    this.ctx.strokeStyle = this.settings.rainbowColor.val ? this.overlay.rainbow.col : "#eb5656"
                    this.ctx.stroke();
                    CRC2d.restore.apply(this.ctx, []);
                }

                CRC2d.save.apply(this.ctx, []);
                if (espVal == "twoD" || espVal == "full") {
                    // perfect box esp
                    this.ctx.lineWidth = 5;
                    this.ctx.strokeStyle = this.settings.rainbowColor.val ? this.overlay.rainbow.col : "#eb5656"
                    let distanceScale = Math.max(.3, 1 - this.getD3D(worldPosition.x, worldPosition.y, worldPosition.z, player.x, player.y, player.z) / 600);
                    CRC2d.scale.apply(this.ctx, [distanceScale, distanceScale]);
                    let xScale = scaledWidth / distanceScale;
                    let yScale = scaledHeight / distanceScale;
                    CRC2d.beginPath.apply(this.ctx, []);
                    ymin = yScale * (1 - ymin);
                    ymax = yScale * (1 - ymax);
                    xmin = xScale * xmin;
                    xmax = xScale * xmax;
                    CRC2d.moveTo.apply(this.ctx, [xmin, ymin]);
                    CRC2d.lineTo.apply(this.ctx, [xmin, ymax]);
                    CRC2d.lineTo.apply(this.ctx, [xmax, ymax]);
                    CRC2d.lineTo.apply(this.ctx, [xmax, ymin]);
                    CRC2d.lineTo.apply(this.ctx, [xmin, ymin]);
                    CRC2d.stroke.apply(this.ctx, []);

                    if (espVal == "full") {
                        // health bar
                        this.ctx.fillStyle = "#000000";
                        let barMaxHeight = ymax - ymin;
                        CRC2d.fillRect.apply(this.ctx, [xmin - 7, ymin, -10, barMaxHeight]);
                        this.ctx.fillStyle = player.health > 75 ? "green" : player.health > 40 ? "orange" : "red";
                        CRC2d.fillRect.apply(this.ctx, [xmin - 7, ymin, -10, barMaxHeight * (player.health / player[this.vars.maxHealth])]);
                        // info
                        this.ctx.font = "48px Sans-serif";
                        this.ctx.fillStyle = "white";
                        this.ctx.strokeStyle='black';
                        this.ctx.lineWidth = 1;
                        let x = xmax + 7;
                        let y = ymax;
                        CRC2d.fillText.apply(this.ctx, [player.name||player.alias, x, y]);
                        CRC2d.strokeText.apply(this.ctx, [player.name||player.alias, x, y]);
                        this.ctx.font = "30px Sans-serif";
                        y += 35;
                        CRC2d.fillText.apply(this.ctx, [player.weapon.name, x, y]);
                        CRC2d.strokeText.apply(this.ctx, [player.weapon.name, x, y]);
                        y += 35;
                        CRC2d.fillText.apply(this.ctx, [player.health + ' HP', x, y]);
                        CRC2d.strokeText.apply(this.ctx, [player.health + ' HP', x, y]);
                    }
                }

                CRC2d.restore.apply(this.ctx, []);
                this.ctx.strokeStyle = original_strokeStyle;
                this.ctx.lineWidth = original_lineWidth;
                this.ctx.font = original_font;
                this.ctx.fillStyle = original_fillStyle;

                // skelly chams
                if (this.isDefined(player[this.vars.objInstances])) {
                    let obj = player[this.vars.objInstances];
                    if (!obj.visible) {
                        Object.defineProperty(player[this.vars.objInstances], 'visible', {
                            value: true,
                            writable: false
                        });
                    }
                    obj.traverse((child) => {
                        let chamColor = this.settings.renderChams.val;
                        let chamsEnabled = chamColor !== "off";
                        if (child && child.type == "Mesh" && child.material) {
                            child.material.depthTest = chamsEnabled ? false : true;
                            //if (this.isDefined(child.material.fog)) child.material.fog = chamsEnabled ? false : true;
                            if (child.material.emissive) {
                                child.material.emissive.r = chamColor == 'off' || chamColor == 'teal' || chamColor == 'green' || chamColor == 'blue' ? 0 : 0.55;
                                child.material.emissive.g = chamColor == 'off' || chamColor == 'purple' || chamColor == 'blue' || chamColor == 'red' ? 0 : 0.55;
                                child.material.emissive.b = chamColor == 'off' || chamColor == 'yellow' || chamColor == 'green' || chamColor == 'red' ? 0 : 0.55;
                            }
                            child.material.wireframe = this.settings.renderWireFrame.val ? true : false
                        }
                    })
                }
            }
        }

        spinTick(input) {
            //this.game.players.getSpin(this.self);
            //this.game.players.saveSpin(this.self, angle);
            const angle = this.getAngleDst(input[2], this.me[this.vars.xDire]);
            this.spins = this.getStatic(this.spins, new Array());
            this.spinTimer = this.getStatic(this.spinTimer, this.config.spinTimer);
            this.serverTickRate = this.getStatic(this.serverTickRate, this.config.serverTickRate);
            (this.spins.unshift(angle), this.spins.length > this.spinTimer / this.serverTickRate && (this.spins.length = Math.round(this.spinTimer / this.serverTickRate)))
            for (var e = 0, i = 0; i < this.spins.length; ++i) e += this.spins[i];
            return Math.abs(e * (180 / Math.PI));
        }

        raidBot(input) {
            let target = this.game.AI.ais.filter(enemy => {
                return undefined !== enemy.mesh && enemy.mesh && enemy.mesh.children[0] && enemy.canBSeen && enemy.health > 0
            }).sort((p1, p2) => this.getD3D(this.me.x, this.me.z, p1.x, p1.z) - this.getD3D(this.me.x, this.me.z, p2.x, p2.z)).shift();
            if (target) {
                let canSee = this.containsPoint(target.mesh.position)
                let yDire = (this.getDir(this.me.z, this.me.x, target.z, target.x) || 0)
                let xDire = ((this.getXDire(this.me.x, this.me.y, this.me.z, target.x, target.y + target.mesh.children[0].scale.y * 0.85, target.z) || 0) - this.consts.recoilMlt * this.me[this.vars.recoilAnimY])
                if (this.me.weapon[this.vars.nAuto] && this.me[this.vars.didShoot]) { input[this.key.shoot] = 0; input[this.key.scope] = 0; this.me.inspecting = false; this.me.inspectX = 0; }
                else {
                    if (!this.me.aimDir && canSee) {
                        input[this.key.scope] = 1;
                        if (!this.me[this.vars.aimVal]||this.me.weapon.noAim) {
                            input[this.key.shoot] = 1;
                            input[this.key.ydir] = yDire * 1e3
                            input[this.key.xdir] = xDire * 1e3
                            this.lookDir(xDire, yDire);
                        }
                    }
                }
            } else {
                this.resetLookAt();
            }
            return input;
        }

        onInput(input) {
            if (this.isDefined(this.config) && this.config.aimAnimMlt) this.config.aimAnimMlt = 1;
            if (this.isDefined(this.controls) && this.isDefined(this.config) && this.settings.inActivity.val) {
                this.controls.idleTimer = 0;
                this.config.kickTimer = Infinity
            }
            if (this.me) {
                this.inputFrame ++;
                if (this.inputFrame >= 100000) this.inputFrame = 0;
                if (!this.game.playerSound[this.isProxy]) {
                    this.game.playerSound = new Proxy(this.game.playerSound, {
                        apply: function(target, that, args) {
                            if (skid.settings.disableWpnSnd.val && args[0] && typeof args[0] == "string" && args[0].startsWith("weapon_")) return;
                            return target.apply(that, args);
                        },
                        get: function(target, key) {
                            return key === skid.isProxy ? true : Reflect.get(target, key);
                        },
                    })
                }

                let isMelee = this.isDefined(this.me.weapon.melee)&&this.me.weapon.melee||this.isDefined(this.me.weapon.canThrow)&&this.me.weapon.canThrow;
                let ammoLeft = this.me[this.vars.ammos][this.me[this.vars.weaponIndex]];

                // autoReload
                if (this.settings.autoReload.val) {
                    //let capacity = this.me.weapon.ammo;
                    //if (ammoLeft < capacity)
                    if (isMelee) {
                        if (!this.me.canThrow) {
                            //this.me.refillKnife();
                        }
                    } else if (!ammoLeft) {
                        this.game.players.reload(this.me);
                        input[this.key.reload] = 1;
                        // this.me[this.vars.reloadTimer] = 1;
                        //this.me.resetAmmo();
                    }
                }

                //Auto Bhop
                let autoBhop = this.settings.autoBhop.val;
                if (autoBhop !== "off") {
                    if (this.isKeyDown("Space") || autoBhop == "autoJump" || autoBhop == "autoSlide") {
                        this.controls.keys[this.controls.binds.jumpKey.val] ^= 1;
                        if (this.controls.keys[this.controls.binds.jumpKey.val]) {
                            this.controls.didPressed[this.controls.binds.jumpKey.val] = 1;
                        }
                        if (this.isKeyDown("Space") || autoBhop == "autoSlide") {
                            if (this.me[this.vars.yVel] < -0.03 && this.me.canSlide) {
                                setTimeout(() => {
                                    this.controls.keys[this.controls.binds.crouchKey.val] = 0;
                                }, this.me.slideTimer||325);
                                this.controls.keys[this.controls.binds.crouchKey.val] = 1;
                                this.controls.didPressed[this.controls.binds.crouchKey.val] = 1;
                            }
                        }
                    }
                }

                //Autoaim
                if (this.settings.autoAim.val !== "off") {
                    this.playerMaps.length = 0;
                    this.rayC.setFromCamera(this.vec2, this.renderer.fpsCamera);
                    let target = this.game.players.list.filter(enemy => {
                        let hostile = undefined !== enemy[this.vars.objInstances] && enemy[this.vars.objInstances] && !enemy[this.vars.isYou] && !this.getIsFriendly(enemy) && enemy.health > 0 && this.getInView(enemy);
                        if (hostile) this.playerMaps.push( enemy[this.vars.objInstances] );
                        return hostile
                    }).sort((p1, p2) => this.getD3D(this.me.x, this.me.z, p1.x, p1.z) - this.getD3D(this.me.x, this.me.z, p2.x, p2.z)).shift();
                    if (target) {
                        //let count = this.spinTick(input);
                        //if (count < 360) {
                        //    input[2] = this.me[this.vars.xDire] + Math.PI;
                        //} else console.log("spins ", count);
                        //target.jumpBobY * this.config.jumpVel
                        let canSee = this.containsPoint(target[this.vars.objInstances].position);
                        let inCast = this.rayC.intersectObjects(this.playerMaps, true).length;
                        let yDire = (this.getDir(this.me.z, this.me.x, target.z, target.x) || 0);
                        let xDire = ((this.getXDire(this.me.x, this.me.y, this.me.z, target.x, target.y - target[this.vars.crouchVal] * this.consts.crouchDst + this.me[this.vars.crouchVal] * this.consts.crouchDst, target.z) || 0) - this.consts.recoilMlt * this.me[this.vars.recoilAnimY])
                        if (this.me.weapon[this.vars.nAuto] && this.me[this.vars.didShoot]) {
                            input[this.key.shoot] = 0;
                            input[this.key.scope] = 0;
                            this.me.inspecting = false;
                            this.me.inspectX = 0;
                        }
                        else if (!canSee && this.settings.frustrumCheck.val) this.resetLookAt();
                        else if (ammoLeft||isMelee) {
                            input[this.key.scope] = this.settings.autoAim.val === "assist"||this.settings.autoAim.val === "correction"||this.settings.autoAim.val === "trigger" ? this.controls[this.vars.mouseDownR] : 0;
                            switch (this.settings.autoAim.val) {
                                case "quickScope":
                                    input[this.key.scope] = 1;
                                    if (!this.me[this.vars.aimVal]||this.me.weapon.noAim) {
                                        if (!this.me.canThrow||!isMelee) input[this.key.shoot] = 1;
                                        input[this.key.ydir] = yDire * 1e3
                                        input[this.key.xdir] = xDire * 1e3
                                        this.lookDir(xDire, yDire);
                                    }
                                    break;
                                case "assist": case "easyassist":
                                    if (input[this.key.scope] || this.settings.autoAim.val === "easyassist") {
                                        if (!this.me.aimDir && canSee || this.settings.autoAim.val === "easyassist") {
                                            input[this.key.ydir] = yDire * 1e3
                                            input[this.key.xdir] = xDire * 1e3
                                            this.lookDir(xDire, yDire);
                                        }
                                    }
                                    break;
                                case "silent":
                                    if (!this.me[this.vars.aimVal]||this.me.weapon.noAim) {
                                        if (!this.me.canThrow||!isMelee) input[this.key.shoot] = 1;
                                    } else input[this.key.scope] = 1;
                                    input[this.key.ydir] = yDire * 1e3
                                    input[this.key.xdir] = xDire * 1e3
                                    break;
                                case "trigger":
                                    if (input[this.key.scope] && canSee && inCast) {
                                        input[this.key.shoot] = 1;
                                        input[this.key.ydir] = yDire * 1e3
                                        input[this.key.xdir] = xDire * 1e3
                                    }
                                    break;
                                case "correction":
                                    if (input[this.key.shoot] == 1) {
                                        input[this.key.ydir] = yDire * 1e3
                                        input[this.key.xdir] = xDire * 1e3
                                    }
                                    break;
                                default:
                                    this.resetLookAt();
                                    break;
                            }
                        }
                    } else {
                        this.resetLookAt();
                        //input = this.raidBot(input);
                    }
                }
            }

            //else if (this.settings.autoClick.val && !this.ui.hasEndScreen) {
            //this.config.deathDelay = 0;
            //this.controls.toggle(true);
            //}

            //this.game.config.deltaMlt = 1
            return input;
        }

        getD3D(x1, y1, z1, x2, y2, z2) {
            let dx = x1 - x2;
            let dy = y1 - y2;
            let dz = z1 - z2;
            return Math.sqrt(dx * dx + dy * dy + dz * dz);
        }

        getAngleDst(a, b) {
            return Math.atan2(Math.sin(b - a), Math.cos(a - b));
        }

        getXDire(x1, y1, z1, x2, y2, z2) {
            let h = Math.abs(y1 - y2);
            let dst = this.getD3D(x1, y1, z1, x2, y2, z2);
            return (Math.asin(h / dst) * ((y1 > y2)?-1:1));
        }

        getDir(x1, y1, x2, y2) {
            return Math.atan2(y1 - y2, x1 - x2);
        }

        getDistance(x1, y1, x2, y2) {
            return Math.sqrt((x2 -= x1) * x2 + (y2 -= y1) * y2);
        }

        containsPoint(point) {
            let planes = this.renderer.frustum.planes;
            for (let i = 0; i < 6; i ++) {
                if (planes[i].distanceToPoint(point) < 0) {
                    return false;
                }
            }
            return true;
        }

        getCanSee(from, toX, toY, toZ, boxSize) {
            if (!from) return 0;
            boxSize = boxSize||0;
            for (let obj, dist = this.getD3D(from.x, from.y, from.z, toX, toY, toZ), xDr = this.getDir(from.z, from.x, toZ, toX), yDr = this.getDir(this.getDistance(from.x, from.z, toX, toZ), toY, 0, from.y), dx = 1 / (dist * Math.sin(xDr - Math.PI) * Math.cos(yDr)), dz = 1 / (dist * Math.cos(xDr - Math.PI) * Math.cos(yDr)), dy = 1 / (dist * Math.sin(yDr)), yOffset = from.y + (from.height || 0) - this.consts.cameraHeight, aa = 0; aa < this.game.map.manager.objects.length; ++aa) {
                if (!(obj = this.game.map.manager.objects[aa]).noShoot && obj.active && !obj.transparent && (!this.settings.wallPenetrate.val || (!obj.penetrable || !this.me.weapon.pierce))) {
                    let tmpDst = this.lineInRect(from.x, from.z, yOffset, dx, dz, dy, obj.x - Math.max(0, obj.width - boxSize), obj.z - Math.max(0, obj.length - boxSize), obj.y - Math.max(0, obj.height - boxSize), obj.x + Math.max(0, obj.width - boxSize), obj.z + Math.max(0, obj.length - boxSize), obj.y + Math.max(0, obj.height - boxSize));
                    if (tmpDst && 1 > tmpDst) return tmpDst;
                }
            }
            /*
        let terrain = this.game.map.terrain;
        if (terrain) {
            let terrainRaycast = terrain.raycast(from.x, -from.z, yOffset, 1 / dx, -1 / dz, 1 / dy);
            if (terrainRaycast) return utl.getD3D(from.x, from.y, from.z, terrainRaycast.x, terrainRaycast.z, -terrainRaycast.y);
        }
        */
            return null;
        }

        lineInRect(lx1, lz1, ly1, dx, dz, dy, x1, z1, y1, x2, z2, y2) {
            let t1 = (x1 - lx1) * dx;
            let t2 = (x2 - lx1) * dx;
            let t3 = (y1 - ly1) * dy;
            let t4 = (y2 - ly1) * dy;
            let t5 = (z1 - lz1) * dz;
            let t6 = (z2 - lz1) * dz;
            let tmin = Math.max(Math.max(Math.min(t1, t2), Math.min(t3, t4)), Math.min(t5, t6));
            let tmax = Math.min(Math.min(Math.max(t1, t2), Math.max(t3, t4)), Math.max(t5, t6));
            if (tmax < 0) return false;
            if (tmin > tmax) return false;
            return tmin;
        }

        lookDir(xDire, yDire) {
            this.controls.object.rotation.y = yDire
            this.controls[this.vars.pchObjc].rotation.x = xDire;
            this.controls[this.vars.pchObjc].rotation.x = Math.max(-this.consts.halfPI, Math.min(this.consts.halfPI, this.controls[this.vars.pchObjc].rotation.x));
            this.controls.yDr = (this.controls[this.vars.pchObjc].rotation.x % Math.PI).round(3);
            this.controls.xDr = (this.controls.object.rotation.y % Math.PI).round(3);
            this.renderer.camera.updateProjectionMatrix();
            this.renderer.updateFrustum();
        }

        resetLookAt() {
            this.controls.yDr = this.controls[this.vars.pchObjc].rotation.x;
            this.controls.xDr = this.controls.object.rotation.y;
            this.renderer.camera.updateProjectionMatrix();
            this.renderer.updateFrustum();
        }

        world2Screen (position) {
            let pos = position.clone();
            let scaledWidth = this.ctx.canvas.width / this.scale;
            let scaledHeight = this.ctx.canvas.height / this.scale;
            pos.project(this.renderer.camera);
            pos.x = (pos.x + 1) / 2;
            pos.y = (-pos.y + 1) / 2;
            pos.x *= scaledWidth;
            pos.y *= scaledHeight;
            return pos;
        }

        getInView(entity) {
            return null == this.getCanSee(this.me, entity.x, entity.y, entity.z);
        }

        getIsFriendly(entity) {
            return (this.me && this.me.team ? this.me.team : this.me.spectating ? 0x1 : 0x0) == entity.team
        }
    }


    function onPageLoad() {
        window.instructionHolder.style.display = "block";
        window.instructions.innerHTML = `<div id="settHolder"><img src="https://i.imgur.com/krfAACY.png" width="25%"></div><a href='https://www.youtube.com/channel/UCKN9qye5ZIGvCvq0fwrRNjg' target='_blank.'><div class="imageButton <"">YT HERE</div></a>`
        window.request = (url, type, opt = {}) => fetch(url, opt).then(response => response.ok ? response[type]() : null);
        window.Module = {
            onRuntimeInitialized: function() {
                function e(e) {
                    window.instructionHolder.style.display = "block";
                    window.instructions.innerHTML = "<div style='color: rgba(255, 255, 255, 0.6)'>" + e + "</div><div style='margin-top:10px;font-size:20px;color:rgba(255,255,255,0.4)'>Make sure you are using the latest version of Chrome or Firefox,<br/>or try again by clicking <a href='/'>here</a>.</div>";
                    window.instructionHolder.style.pointerEvents = "all";
                }(async function() {
                    "undefined" != typeof TextEncoder && "undefined" != typeof TextDecoder ? await window.Module.initialize(window.Module) : e("Your browser is not supported.")
                })().catch(err => {
                    e("Failed to load game.");
                    throw new Error(err);
                })
            },
            gameJS: "",
            token: null,
        };

        window.UTF8ToString = function(ptr, maxBytesToRead) {
            let UTF8Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf8") : undefined;
            let UTF8ArrayToString = (heap, idx, maxBytesToRead) => {
                var endIdx = idx + maxBytesToRead;
                var endPtr = idx;
                while (heap[endPtr] && !(endPtr >= endIdx)) ++endPtr;
                if (endPtr - idx > 16 && heap.subarray && UTF8Decoder) {
                    return UTF8Decoder.decode(heap.subarray(idx, endPtr))
                } else {
                    var str = "";
                    while (idx < endPtr) {
                        var u0 = heap[idx++];
                        if (!(u0 & 128)) {
                            str += String.fromCharCode(u0);
                            continue
                        }
                        var u1 = heap[idx++] & 63;
                        if ((u0 & 224) == 192) {
                            str += String.fromCharCode((u0 & 31) << 6 | u1);
                            continue
                        }
                        var u2 = heap[idx++] & 63;
                        if ((u0 & 240) == 224) {
                            u0 = (u0 & 15) << 12 | u1 << 6 | u2
                        } else {
                            u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heap[idx++] & 63
                        }
                        if (u0 < 65536) {
                            str += String.f38e5romCharCode(u0)
                        } else {
                            var ch = u0 - 65536;
                            str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023)
                        }
                    }
                }
                return str
            }

            let string = ptr ? UTF8ArrayToString(window.Module.HEAPU8, ptr, maxBytesToRead) : "";
            //console.log(string);
            if (string.startsWith("WP_fetchMMToken")) {
                console.log(string);
               // window.Module.token = string.split(",")[1];
               // console.log("token");
               // return void 0;
            }
            if (string.includes("CLEAN_WINDOW")) string = "";
            if (string.length > 1e6) {
                if (window.Module.gameJS == "") {
                    window.Module.gameJS = string;
                    console.log("1stSTR");
                    return void 0;
                } else {
                    window.Module.gameJS += string;
                    console.log("2ndSTR");
                    return void 0;
                }
            }
            if (string.length == 40) {
                window.Module.token = string;
                console.log(string.length, " Token: ", string);
                return void 0;
            }
            return string;
        }

        window._debugTimeStart = Date.now();
        window.request("/pkg/loader.wasm","arrayBuffer",{cache: "no-store"}).then(body => {
            window.Module.wasmBinary = body;
            window.request("/pkg/loader.js","text",{cache: "no-store"}).then(body => {
                body = body.replace(/function UTF8ToString.*?}function/, "function");
                new Function(body)();
                window.initWASM(window.Module);
            })
        });
    }

    let observer = new MutationObserver(mutations => {
        for (let mutation of mutations) {
            for (let node of mutation.addedNodes) {
                if (node.tagName === 'SCRIPT' && node.type === "text/javascript" && node.innerHTML.startsWith("*!", 1)) {
                    node.innerHTML = onPageLoad.toString() + "\nonPageLoad();";
                    window[skidStr] = new Skid();
                    observer.disconnect();
                }
            }
        }
    });

    observer.observe(document, {
        childList: true,
        subtree: true
    });
})([...Array(8)].map(_ => 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'[~~(Math.random()*52)]).join(''), CanvasRenderingContext2D.prototype);
