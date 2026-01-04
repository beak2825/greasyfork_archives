// ==UserScript==
// @name Yuh
// @description funny
// @version 3.0.4
// @author IFOUNDBARNEY
// @homepage twitter.com
// @match *.krunker.io/*
// @exclude *krunker.io/social*
// @run-at document-start
// @grant none
// @noframes
// @namespace https://greasyfork.org/en/users/706176
// @downloadURL https://update.greasyfork.org/scripts/418424/Yuh.user.js
// @updateURL https://update.greasyfork.org/scripts/418424/Yuh.meta.js
// ==/UserScript==

const isProxy = Symbol("isProxy");
const original_Proxy = window.Proxy;
const original_Reflect= window.Reflect;
const original_fetch = window.fetch;
const original_Object = window.Object;
const original_Promise = window.Promise;
const original_Function = window.Function;
const original_MutationObserver = window.MutationObserver;
const original_decode = window.TextDecoder.prototype.decode;
const original_clearRect = window.CanvasRenderingContext2D.prototype.clearRect;
const original_save = window.CanvasRenderingContext2D.prototype.save;
const original_scale = window.CanvasRenderingContext2D.prototype.scale;
const original_beginPath = window.CanvasRenderingContext2D.prototype.beginPath;
const original_moveTo = window.CanvasRenderingContext2D.prototype.moveTo;
const original_lineTo = window.CanvasRenderingContext2D.prototype.lineTo;
const original_stroke = window.CanvasRenderingContext2D.prototype.stroke;
const original_fillRect = window.CanvasRenderingContext2D.prototype.fillRect;
const original_fillText = window.CanvasRenderingContext2D.prototype.fillText;
const original_strokeText = window.CanvasRenderingContext2D.prototype.strokeText;
const original_restore = window.CanvasRenderingContext2D.prototype.restore;

//original_Object.assign(console, { log:_=>{}, dir:_=>{}, groupCollapsed:_=>{}, groupEnd:_=>{} });
/* eslint-disable no-caller, no-undef */

class Utilities {
    constructor(script) {
        this.script = script;
        this.downKeys = new Set();
        this.settings = null;
        this.vars = {};
        this.inputFrame = 0;
        this.renderFrame = 0;
        this.fps = 0;
        this.lists = {
            renderESP: {
                off: "Off (means its off duh)",
                walls: "Walls (see though walls)",
                twoD: "2d (Idk its ok)",
                full: "Full (u get the full experience :D)"
            },
            renderChams: {
                off: "Off",
                white: "White (the best in my opinion)",
                blue: "Blue (Its darker not lighter blue)",
                teal: "Teal(I love teal)",
                purple: "Purple (girly i guess... not really I use it :/)",
                green: "Green(meh)",
                yellow: "Yellow(Its meant for a flash light, like light mode on discord)",
                red: "Red (Lit I guess)",
            },
            autoBhop: {
                off: "Off",
                autoJump: "Only Auto Jump",
                keyJump: "Key Jump",
                autoSlide: "Auto Bunny Hop",
                keySlide: "Key Slide"
            },
            autoAim: {
                off: "Off",
                correction: "Aim Correction",
                assist: "Legit Aim Assist",
                easyassist: "Easy Aim Assist",
                silent: "Silent Aim (shhh)",
                trigger: "Trigger Bot",
                quickScope: "Auto Shoot + Auto Aim (NEVER MISS ANOTHER SHOT)"
            },
            audioStreams: {
                off: 'nune lol',
                _2000s: 'General German/English (germany? bruhh....)',
                _HipHopRNB: 'Hip Hop / RNB (this one is basically rap)',
                _Oldskool: 'Hip Hop Oldskool (LESS GET THAT OLD CRAP)',
                _Country: 'Country',
                _Pop: 'Pop (my fave)',
                _Dance: 'Dance(im dancin already!)',
                _Dubstep: 'DubStep(BUM BUM BUM BUM BUM BUM BUM buuu)',
                _Lowfi: 'LoFi HipHop (idk really what to say..)',
                _Jazz: 'Jazz(Soothing...)',
                _Oldies: 'Golden Oldies(for the elders)',
                _Club: 'Club (NIGHT CLUB MOTHA FUKA)',
                _Folk: 'Folk(bruh)',
                _ClassicRock: 'Classic Rock (WE GOT DAT 60s ROCK)',
                _Metal: 'Heavy Metal (ear kill)',
                _DeathMetal: 'Death Metal (bloody ears)',
                _Classical: 'Classical (living in harmony)',
                _Alternative: 'Alternative (idk)',
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
            recoilMlt: 0.27,//0.3,
            nameOffset: 0.6,
            nameOffsetHat: 0.8,
        };
        this.css = {
            noTextShadows: `*, .button.small, .bigShadowT { text-shadow: none !important; }`,
            hideAdverts: `#aMerger, #endAMerger { display: none !important }`,
            hideSocials: `.headerBarRight > .verticalSeparator, .imageButton { display: none }`,
            cookieButton: `#onetrust-consent-sdk { display: none !important }`,
            newsHolder: `#newsHolder { display: none !important }`,
        };
        this.spinTimer = 1800;
        this.skinConfig = {};
        let wait = setInterval(_ => {
            this.head = document.head||document.getElementsByTagName('head')[0]
            if (this.head) {
                clearInterval(wait);
                original_Object.entries(this.css).forEach(entry => {
                    this.css[entry[0]] = this.createElement("style", entry[1])
                })
                this.onLoad();
            }
        }, 100);
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

    async waitFor(test, timeout_ms = 20000, doWhile = null) {
        let sleep = (ms) => new original_Promise((resolve) => setTimeout(resolve, ms));
        return new original_Promise(async (resolve, reject) => {
            if (typeof timeout_ms != "number") reject("Timeout argument not a number in waitFor(selector, timeout_ms)");
            let result, freq = 100;
            while (result === undefined || result === false || result === null || result.length === 0) {
                if (doWhile && doWhile instanceof original_Function) doWhile();
                if (timeout_ms % 1000 < freq) console.log("waiting for: ", test);
                if ((timeout_ms -= freq) < 0) {
                    console.log( "Timeout : ", test );
                    resolve(false);
                    return;
                }
                await sleep(freq);
                result = typeof test === "string" ? original_Function(test)() : test();
            }
            console.log("Passed : ", test);
            resolve(result);
        });
    };

    createSettings() {
        this.settings = {
            hideAdverts: {
                pre: "<div class='setHed'>Rendering</div>",
                name: "Hide Advertisments (YASSS)",
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
                set: (value) => { window.streamContainer.style.display = value ? "none" : "inherit" }
            },
            hideMerch: {
                name: "Hide Merch",
                val: false,
                html: () => this.generateSetting("checkbox", "hideMerch", this),
                set: value => { window.merchHolder.style.display = value ? "none" : "inherit" }
            },
            hideNewsConsole: {
                name: "Hide News Console",
                val: false,
                html: () => this.generateSetting("checkbox", "hideNewsConsole", this),
                set: value => { window.newsHolder.style.display = value ? "none" : "inherit" }
            },
            hideCookieButton: {
                name: "Hide Security Manage Button",
                val: false,
                html: () => this.generateSetting("checkbox", "hideCookieButton", this),
                set: value => { window['onetrust-consent-sdk'].style.display = value ? "none" : "inherit" }
            },
            noTextShadows: {
                name: "Remove Text Shadows(it looks better ngl)",
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
                name: "Rainbow ESP (its literally rainbow)",
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
                name: "Custom Billboard Text (anything u want :D)",
                val: "",
                html: () =>
                this.generateSetting(
                    "text",
                    "customBillboard",
                    "Custom Billboard Text"
                ),
            },
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
                name: "Unlock Skins (sadly it only shwos in ur locker not ingame D:)",
                val: false,
                html: () => this.generateSetting("checkbox", "skinUnlock", this),
            },
            disableWpnSnd: {
                pre: "<br><div class='setHed'>GamePlay</div>",
                name: "Disable Players Weapon Sounds",
                val: false,
                html: () => this.generateSetting("checkbox", "disableWpnSnd", this),
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
                name: "Auto Start Game (kinda gets annoting)",
                val: false,
                html: () => this.generateSetting("checkbox", "autoClick", this),
            },
            inActivity: {
                name: "No InActivity Kick (very useful actually)",
                val: true,
                html: () => this.generateSetting("checkbox", "autoClick", this),
            },
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

            /*
            Alternate Howler Sound
            playSound: {
                name: "Sound Player",
                val: "",
                html: () => `<hr><audio controls><source src='window.utilities.settings.playSound.sound.src'/></audio>` + this.generateSetting("url", "playSound", "URL to Sound file"),
                sound: null,
                set: (value, init) => {
                    //if ( value && value.startsWith("http") && (value.endsWith(".webm") || value.endsWith(".mp3") || value.endsWith(".wav")) ) {
                        //this.settings.playSound.sound = new window.Howl({src: value, autoplay: true, loop: true, volume: 1.0, rate: 1.0})
                   //
                   // if (init) {
                    //    if ( value.startsWith("http") && (value.endsWith(".webm") || value.endsWith(".mp3") || value.endsWith(".wav")) ) {
                      //       let proxy = 'https://cors-anywhere.herokuapp.com/';
                       //      let url = proxy + value;
                       //     try {
                        //        this.settings.playSound.sound = new window.Howl({src: value, autoplay: true, loop: true, volume: 1.0, rate: 1.0})
                         //   } catch(e) {
                          //      console.error(e)
                          //      this.settings.playSound.sound = null
                          //  }
                        } else if (value) {
                            alert("Sound file MUST be a .MP3, .webm or .wav !!")
                            value = "";
                        }
                   // }
                }
            },*/
        };

        // Inject Html
        let waitForWindows = setInterval(_ => {
            if (window.windows) {
                const menu = window.windows[11];
                menu.header = "Settings";
                menu.gen = _ => {
                    var tmpHTML = `<div style='text-align:center'> <a onclick='window.open("https://greasyfork.org/en/users/706176")' class='menuLink'>KrunkerKiller Stuff (scroll down for everything :D)</center></a> <hr> </div>`;
                    for (const key in this.settings) {
                        if (this.settings[key].pre) tmpHTML += this.settings[key].pre;
                        tmpHTML += "<div class='settName' id='" + key + "_div' style='display:" + (this.settings[key].hide ? 'none' : 'block') + "'>" + this.settings[key].name +
                            " " + this.settings[key].html() + "</div>";
                    }
                    tmpHTML += `<br><hr><a onclick='window.utilities.resetSettings()' class='menuLink'>Reset Settings</a> | <a onclick='window.utilities.saveScript()' class='menuLink'>Save GameScript</a>`
                   /// tmpHTML += `<audio controls><source src='window.utilities.settings.playSound.sound.src'/></audio>`
                    return tmpHTML;
                };
                clearInterval(waitForWindows);
            }
        }, 100);

        // setupSettings
        for (const key in this.settings) {
            this.settings[key].def = this.settings[key].val;
            if (!this.settings[key].disabled) {
                let tmpVal = this.getSavedVal(`kro_utilities_${key}`);
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
                return `<label class="switch"><input type="checkbox" onclick="window.utilities.setSetting('${name}', this.checked)" ${this.settings[name].val ? 'checked' : ''}><span class="slider"></span></label>`;
            case 'slider':
                return `<span class='sliderVal' id='slid_utilities_${name}'>${this.settings[name].val}</span><div class='slidecontainer'><input type='range' min='${this.settings[name].min}' max='${this.settings[name].max}' step='${this.settings[name].step}' value='${this.settings[name].val}' class='sliderM' oninput="window.utilities.setSetting('${name}', this.value)"></div>`
                case 'select': {
                    let temp = `<select onchange="window.utilities.setSetting(\x27${name}\x27, this.value)" class="inputGrey2">`;
                    for (let option in extra) {
                        temp += '<option value="' + option + '" ' + (option == this.settings[name].val ? 'selected' : '') + '>' + extra[option] + '</option>';
                    }
                    temp += '</select>';
                    return temp;
                }
            default:
                return `<input type="${type}" name="${type}" id="slid_utilities_${name}"\n${'color' == type ? 'style="float:right;margin-top:5px"' : `class="inputGrey2" placeholder="${extra}"`}\nvalue="${this.settings[name].val}" oninput="window.utilities.setSetting(\x27${name}\x27, this.value)"/>`;
        }
    }

    resetSettings() {
        if (confirm("BRO it will refresh the page AND restart ur settings! Are you sure sure sure???")) {
            original_Object.keys(localStorage).filter(x => x.includes("kro_utilities_")).forEach(x => localStorage.removeItem(x));
            location.reload();
        }
    }

    setSetting(t, e) {
        this.settings[t].val = e;
        this.saveVal(`kro_utilities_${t}`, e);
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

    createElement(type, html, id) {
        let newElement = document.createElement(type)
        if (id) newElement.id = id
        newElement.innerHTML = html
        return newElement
    }

    objectEntries(object, callback) {
        let descriptors = original_Object.getOwnPropertyDescriptors(object);
        original_Object.entries(descriptors).forEach(([key, { value, get, set, configurable, enumerable, writable }]) => callback([object, key, value, get, set, configurable, enumerable, writable]));
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
        this.saveAs("game_" + this.getVersion() + ".js", this.script)
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
        this.createSettings();
        this.deObfuscate();
        this.createObserver(window.instructionsUpdate, 'style', (target) => {
            if (this.settings.autoFindNew.val) {
                console.log(target)
                if (['Kicked', 'Banned', 'Disconnected', 'Error', 'Yeet Game is full'].some(text => target && target.innerHTML.includes(text))) {
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

        this.waitFor(_=>this.exports).then(exports => {
            if (!exports) return alert("Exports not Found");
            const found = new Set();
            const array = new Map([
                ["utility", ["createCanvasAD", "limitRectVal"]],
                ["config", ["gameConfig", "gameObjectReferenceProps", "leaderQueries"]],
                ["overlay", ["render", "canvas"]],
                ["three", ["ACESFilmicToneMapping", "TextureLoader", "ObjectLoader"]],
                //["colors", ["challLvl", "getChallCol"]],
                //["ui", ["showEndScreen", "toggleControlUI", "toggleEndScreen", "updatePlayInstructions"]],
                ["ws", ["socketReady", "ingressPacketCount", "ingressPacketCount", "egressDataSize"]],
                //["events", ["actions", "events"]],
            ])
            return this.waitFor(_ => found.size === array.size, 20000, () => {
                array.forEach((arr, name, map) => {
                    this.objectEntries(exports, ([rootObject, rootKey, rootValue, rootGet, rootSet, rootConfigurable, rootEnumerable, rootWritable]) => {
                        this.objectEntries(rootValue.exports, ([object, key, value, get, set, configurable, enumerable, writable]) => {
                            if (!found.has(name) && arr.includes(key)) {
                                found.add(name);
                                console.log("Found Export ", name);
                                this[name] = rootValue.exports;
                            }
                        })
                    })
                })
            })
        })

        this.waitFor(_=>this.ws.connected === true, 40000).then(_=> {
            this.ws.__event = this.ws._dispatchEvent.bind(this.ws);
            this.ws.__send = this.ws.send.bind(this.ws);
            this.ws.send = new original_Proxy(this.ws.send, {
                apply(target, that, args) {
                    try {
                        var original_fn = Function.prototype.apply.apply(target, [that, args]);
                    } catch (e) {
                        e.stack = e.stack = e.stack.replace(/\n.*Object\.apply.*/, '');
                        throw e;
                    }

                    if (args[0] === "ah1") {
                        args[0] = "p";
                        args[1] = null;
                    }

                    if (args[0] === "ent") {
                        window.utilities.skinConfig = {
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
                   // return target.apply(that, msg);
                }
            })

            this.ws._dispatchEvent = new original_Proxy(this.ws._dispatchEvent, {
                apply(target, that, [type, msg]) {
                    //console.log(type, msg)
                    if (type =="init") {
                        if(msg[9].bill && window.utilities.settings.customBillboard.val.length > 1) {
                            msg[9].bill.txt = window.utilities.settings.customBillboard.val;
                        }
                    }
                    if (window.utilities.settings.skinUnlock.val && window.utilities.skinConfig && type === "0") {
                        let playersInfo = msg[0];
                        let perPlayerSize = 38;
                        while (playersInfo.length % perPlayerSize !== 0) perPlayerSize++;
                        for(let i = 0; i < playersInfo.length; i += perPlayerSize) {
                            if (playersInfo[i] === window.utilities.ws.socketId||0) {
                                playersInfo[i + 12] = [window.utilities.skinConfig.main, window.utilities.skinConfig.secondary];
                                playersInfo[i + 13] = window.utilities.skinConfig.hat;
                                playersInfo[i + 14] = window.utilities.skinConfig.body;
                                playersInfo[i + 19] = window.utilities.skinConfig.knife;
                                playersInfo[i + 25] = window.utilities.skinConfig.dye;
                                playersInfo[i + 33] = window.utilities.skinConfig.waist;
                            }
                        }
                    }
                    return target.apply(that, arguments[2]);
                }
            })

            const skins = Symbol("SkinUnlock") /*chonker*/
            original_Object.defineProperty(original_Object.prototype, "skins", {
                enumerable: false,
                get() {
                    if (window.utilities.settings.skinUnlock.val && this.stats) {
                        let skins = [];
                        for(let i = 0; i < 5000; i++) skins.push({ind: i, cnt: i});
                        return skins;
                    }
                    return this[skins];
                },
                set(v) { this[skins] = v; }
            });
        })

        if (this.isDefined(window.SOUND)) {
            window.SOUND.play = new original_Proxy(window.SOUND.play, {
                apply: function(target, that, [src, vol, loop, rate]) {
                    if ( src.startsWith("fart_") ) return;
                    return target.apply(that, [src, vol, loop, rate]);
                }
            })
        }

         //tmpSound = this.sounds[tmpIndx];
           // if (!tmpSound) {
             //   tmpSound = new Howl({
               //     src: ".././sound/" + (window.activeHacker?
               //         "fart_0":id) + ".mp3"
              //  });
              //  this.sounds[tmpIndx] = tmpSound;
           // }

        //if (this.isDefined(SOUND)) {
        //    const play = SOUND.play;
        //    SOUND.play = function() {
        //       if (arguments[0].startsWith("weapon_")) return;
        //        return play.apply(this, arguments)
        //    }
            //console.dir(window)
           // chrome.runtime.onMessage.addListener((message, MessageSender, sendResponse)=>{
          //      console.log(message)
            //})
        //}

        // create audio context
        //var AudioContext = window.AudioContext || window.webkitAudioContext;
        //var audioCtx = new AudioContext();

        //AudioParam.prototype.setTargetAtTime = new original_Proxy(AudioParam.prototype.setTargetAtTime, {
        //    apply: function(target, that, [audioTarget, startTime, timeConstant]) {
        //        let flt = target.apply(that, [audioTarget, startTime, timeConstant]);
        //        return isFinite(flt) ? flt : 0.0;
       //     }
       // })

      //  AudioParam.prototype.setValueAtTime = new original_Proxy(AudioParam.prototype.setValueAtTime, {
       //     apply: function(target, that, [value, startTime]) {
       //         return target.apply(that, [value / 100, startTime+1]);
        //    }
        // })

        AudioParam.prototype.setValueAtTime = new Proxy(AudioParam.prototype.setValueAtTime, {
            apply: function(target, that, [value, startTime]) {
                return target.apply(that, [value, 0]);
            }
        })

    }

    patchScript() {
        const patches = new Map()
        .set("exports", [/(function\(\w,\w,(\w)\){)'use strict';(\(function\((\w)\){)\//, `$1$3 window.utilities.exports=$2.c; window.utilities.modules=$2.m;/`])
        //.set("exports", [/(function\(\w+,\w+,(\w+)\){\(function\(\w+\){)(\w+\['exports'])/,`$1window.utilities.exports=$2.c; window.utilities.modules=$2.m;$3`])
        //.set("inView", [/if\((!\w+\['\w+'])\)continue;/, "if($1&&void 0 !== window.utilities.nameTags)continue;"])
        //.set("inView", [/(\w+\['\w+']\){if\(\(\w+=\w+\['\w+']\['position']\['clone']\(\))/, "(void 0 == window.utilities.nameTags)||$1"])
        .set("inView", [/&&(\w+\['\w+'])\){(if\(\(\w+=\w+\['\w+']\['\w+']\['\w+'])/, "){if(!$1&&void 0 !== window.utilities.nameTags)continue;$2"])
        .set("inputs", [/(\w+\['\w+']\[\w+\['\w+']\['\w+']\?'\w+':'push']\()(\w+)\),/, `$1window.utilities.onInput($2)),`])
        //.set("procInputs", [/(this\['\w+']\()(this\['inputs']\[\w+])(,\w+,!0x1,!\w+|\|\w+\['moveLock']\))/, `$1window.utilities.onInput($2)$3`])

        //.set("procInputs", [/this\['meleeAnim']\['armS']=0x0;},this\['\w+']=function\((\w+),\w+,\w+,\w+\){/, `$&window.cheat.onInput($1);`])
        //.set("wallBangs", [/!(\w+)\['transparent']/, "$&& (!cheat.settings.wallbangs || !$1.penetrable )"])
        .set("thirdPerson", [/(\w+)\[\'config\'\]\[\'thirdPerson\'\]/g, `void 0 !== window.utilities.thirdPerson`])
        //.set("onRender", [/\w+\['render']=function\((\w+,\w+,\w+,\w+,\w+,\w+,\w+,\w+)\){/, `$&window.cheat.onRender($1);`])
        .set("isHacker", [/(window\['\w+']=)!0x0\)/, `$1!0x1)`])
        .set("Damage", [/\['send']\('vtw',(\w+)\)/, `['send']('kpd',$1)`])
        .set("fixHowler", [/(Howler\['orientation'](.+?)\)\),)/, ``])
        .set("respawnT", [/'\w+':0x3e8\*/g, `'respawnT':0x0*`])
        .set("anticheat", [/windows\['length'\]>\d+.*?0x25/, `0x25`])
        //.set("FPS", [/(window\['mozRequestAnimationFrame']\|\|function\(\w+\){window\['setTimeout'])\(\w+,0x3e8\/0x3c\);/, "$1()"])
        //.set("Update", [/(\w+=window\['setTimeout']\(function\(\){\w+)\((\w+)\+(\w+)\)/, "$1($2=$3=0)"])
       // .set("weaponZoom", [/(,'zoom':)(\d.+?),/g, "$1window.utilities.settings.weaponZoom.val||$2"])

        console.groupCollapsed("PATCHING");
        let string = this.script;
        for (let [name, arr] of patches) {
            let found = arr[0].exec(string);
            if (found) {
                console.groupCollapsed(name);
                for (let i = 0; i < found.length; ++i) {
                    if (i == 0) {
                        console.log("Regex ", arr[0]);
                        console.log("Found ", found[i]);
                        console.log("Index ", found.index);
                    } else console.log("$", i, " ", found[i]);
                }
                console.log("Replace " + arr[1]);
                const patched = string.substr(0, found.index) + String.prototype.replace.call( string.substr(found.index, string.length), arr[0], arr[1] );
                if (string === patched) {
                    alert(`Failed to patch ${name}`);
                    continue;
                } else {
                    string = patched;
                    console.log("patched");
                }
                console.groupEnd();
            } else {
                alert("Failed to find " + name);
            }
        }
        console.groupEnd();
        /*Lemons1337*/string = string.replace(/\[(0x[a-zA-Z0-9]+,?)+]\['map']\(\w+=>String\['fromCharCode']\(\w+\)\)\['join']\(''\)/g, a => "'" + w.eval(a) + "'");
        const spoonter = `console.log("Destroy This Shit Game LOL",'💩');`
        return spoonter + string;
    }

    deObfuscate() {
        const obfu = {
            //\]\)continue;if\(!\w+\['(.+?)\']\)continue;
            inView: { regex: /(\w+\['(\w+)']\){if\(\(\w+=\w+\['\w+']\['position']\['clone']\(\))/, pos: 2 },

            //inView: { regex: /\]\)continue;if\(!\w+\['(.+?)\']\)continue;/, pos: 1 },
            //canSee: { regex: /\w+\['(\w+)']\(\w+,\w+\['x'],\w+\['y'],\w+\['z']\)\)&&/, pos: 1 },
            //procInputs: { regex: /this\['(\w+)']=function\((\w+),(\w+),\w+,\w+\){(this)\['recon']/, pos: 1 },
            aimVal: { regex: /this\['(\w+)']-=0x1\/\(this\['weapon']\['\w+']\/\w+\)/, pos: 1 },
            pchObjc: { regex: /0x0,this\['(\w+)']=new \w+\['Object3D']\(\),this/, pos: 1 },
            didShoot: { regex: /--,\w+\['(\w+)']=!0x0/, pos: 1 },
            nAuto: { regex: /'Single\\x20Fire','varN':'(\w+)'/, pos: 1 },
            crouchVal: { regex: /this\['(\w+)']\+=\w\['\w+']\*\w+,0x1<=this\['\w+']/, pos: 1 },
            recoilAnimY: { regex: /\+\(-Math\['PI']\/0x4\*\w+\+\w+\['(\w+)']\*\w+\['\w+']\)\+/, pos: 1 },
            //recoilAnimY: { regex: /this\['recoilAnim']=0x0,this\[(.*?\(''\))]/, pos: 1 },
            ammos: { regex: /\['length'];for\(\w+=0x0;\w+<\w+\['(\w+)']\['length']/, pos: 1 },
            weaponIndex: { regex: /\['weaponConfig']\[\w+]\['secondary']&&\(\w+\['(\w+)']==\w+/, pos: 1 },
            isYou: { regex: /0x0,this\['(\w+)']=\w+,this\['\w+']=!0x0,this\['inputs']/, pos: 1 },
            objInstances: { regex: /\w+\['\w+']\(0x0,0x0,0x0\);if\(\w+\['(\w+)']=\w+\['\w+']/, pos: 1 },
            getWorldPosition: { regex: /{\w+=\w+\['camera']\['(\w+)']\(\);/, pos: 1 },
            //mouseDownL: { regex: /this\['\w+'\]=function\(\){this\['(\w+)'\]=\w*0,this\['(\w+)'\]=\w*0,this\['\w+'\]={}/, pos: 1 },
            mouseDownR: { regex: /this\['(\w+)']=0x0,this\['keys']=/, pos: 1 },
            //reloadTimer: { regex:  /this\['(\w+)']-=\w+,\w+\['reloadUIAnim']/, pos: 1 },///this\['(\w+)']&&\(this\['noMovTimer']=0x0/, pos: 1 },
            maxHealth: { regex: /this\['health']\/this\['(\w+)']\?/, pos: 1 },
            xDire: { regex: /this\['(\w+)']=Math\['lerpAngle']\(this\['xDir2']/, pos: 1 },
            yDire: { regex: /this\['(\w+)']=Math\['lerpAngle']\(this\['yDir2']/, pos: 1 },
            //xVel: { regex: /this\['x']\+=this\['(\w+)']\*\w+\['map']\['config']\['speedX']/, pos: 1 },
            yVel: { regex: /this\['y']\+=this\['(\w+)']\*\w+\['map']\['config']\['speedY']/, pos: 1 },
            //zVel: { regex: /this\['z']\+=this\['(\w+)']\*\w+\['map']\['config']\['speedZ']/, pos: 1 },
        };
        console.groupCollapsed("DEOBFUSCATE");
        for (let key in obfu) {
            let result = obfu[key].regex.exec(this.script);
            if (result) {
                window.utilities.vars[key] = result[obfu[key].pos];
                console.log("found: ", key, " at ", result.index, " value: ", window.utilities.vars[key]);
            } else {
                const str = "Failed to find " + key;
                console.error(str);
                alert(str);
                window.utilities.vars[key] = null;
            }
        }
        console.groupEnd();
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

        if (this.isNative(this.renderer.frustum.containsPoint)) {
            this.renderer.frustum.containsPoint = function (point) {
                let planes = this.planes;
                for (let i = 0; i < 6; i ++) {
                    if (planes[i].distanceToPoint(point) < 0) {
                        return false;
                    }
                }
                return true;
            }
        }

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

            //if (espVal === "full") this.nameTags = true;

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
                            if (!this.renderer.frustum.containsPoint(position)) {
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
                original_save.apply(this.ctx, []);
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
                original_restore.apply(this.ctx, []);
            }

            original_save.apply(this.ctx, []);
            if (espVal == "twoD" || espVal == "full") {
                // perfect box esp
                this.ctx.lineWidth = 5;
                this.ctx.strokeStyle = this.settings.rainbowColor.val ? this.overlay.rainbow.col : "#eb5656"
                let distanceScale = Math.max(.3, 1 - this.getD3D(worldPosition.x, worldPosition.y, worldPosition.z, player.x, player.y, player.z) / 600);
                original_scale.apply(this.ctx, [distanceScale, distanceScale]);
                let xScale = scaledWidth / distanceScale;
                let yScale = scaledHeight / distanceScale;
                original_beginPath.apply(this.ctx, []);
                ymin = yScale * (1 - ymin);
                ymax = yScale * (1 - ymax);
                xmin = xScale * xmin;
                xmax = xScale * xmax;
                original_moveTo.apply(this.ctx, [xmin, ymin]);
                original_lineTo.apply(this.ctx, [xmin, ymax]);
                original_lineTo.apply(this.ctx, [xmax, ymax]);
                original_lineTo.apply(this.ctx, [xmax, ymin]);
                original_lineTo.apply(this.ctx, [xmin, ymin]);
                original_stroke.apply(this.ctx, []);

                if (espVal == "full") {
                    // health bar
                    this.ctx.fillStyle = "#000000";
                    let barMaxHeight = ymax - ymin;
                    original_fillRect.apply(this.ctx, [xmin - 7, ymin, -10, barMaxHeight]);
                    this.ctx.fillStyle = player.health > 75 ? "green" : player.health > 40 ? "orange" : "red";
                    original_fillRect.apply(this.ctx, [xmin - 7, ymin, -10, barMaxHeight * (player.health / player[this.vars.maxHealth])]);
                    // info
                    this.ctx.font = "48px Sans-serif";
                    this.ctx.fillStyle = "white";
                    this.ctx.strokeStyle='black';
                    this.ctx.lineWidth = 1;
                    let x = xmax + 7;
                    let y = ymax;
                    original_fillText.apply(this.ctx, [player.name||player.alias, x, y]);
                    original_strokeText.apply(this.ctx, [player.name||player.alias, x, y]);
                    this.ctx.font = "30px Sans-serif";
                    y += 35;
                    original_fillText.apply(this.ctx, [player.weapon.name, x, y]);
                    original_strokeText.apply(this.ctx, [player.weapon.name, x, y]);
                    y += 35;
                    original_fillText.apply(this.ctx, [player.health + ' HP', x, y]);
                    original_strokeText.apply(this.ctx, [player.health + ' HP', x, y]);
                }
            }

            original_restore.apply(this.ctx, []);
            this.ctx.strokeStyle = original_strokeStyle;
            this.ctx.lineWidth = original_lineWidth;
            this.ctx.font = original_font;
            this.ctx.fillStyle = original_fillStyle;

            // skelly chams
            if (this.isDefined(player[this.vars.objInstances])) {
                let obj = player[this.vars.objInstances];
                if (!obj.visible) {
                    original_Object.defineProperty(player[this.vars.objInstances], 'visible', {
                        value: true,
                        writable: false
                    });
                }
                obj.traverse((child) => {
                    let chamColor = this.settings.renderChams.val;
                    let chamsEnabled = chamColor !== "off";
                    if (child && child.type == "Mesh" && child.material) {
                        child.material.depthTest = chamsEnabled ? false : true;
                      if (this.isDefined(child.material.fog)) child.material.fog = chamsEnabled ? false : true;
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

        // weapon Trails
        //this.renderer.weaponADSOffY = 10;
        //for(let i=0;i<this.me.trails.length;++i)if(!this.me.trails[i].mesh.visible) original_Object.defineProperty(this.me.trails[i].mesh, 'visible', {value: true, writable: false});
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
        const key = { frame: 0, delta:1,ydir:2,xdir:3,moveDir:4,shoot:5,scope:6,jump:7,crouch:8,reload:9,weaponScroll:10,weaponSwap:11, moveLock:12}
        let target = this.game.AI.ais.filter(enemy => {
           return undefined !== enemy.mesh && enemy.mesh && enemy.mesh.children[0] && enemy.canBSeen && enemy.health > 0
        }).sort((p1, p2) => this.getD3D(this.me.x, this.me.z, p1.x, p1.z) - this.getD3D(this.me.x, this.me.z, p2.x, p2.z)).shift();
        if (target) {
            let canSee = this.renderer.frustum.containsPoint(target.mesh.position)
            let yDire = (this.getDir(this.me.z, this.me.x, target.z, target.x) || 0)
            let xDire = ((this.getXDire(this.me.x, this.me.y, this.me.z, target.x, target.y + target.mesh.children[0].scale.y * 0.85, target.z) || 0) - this.consts.recoilMlt * this.me[this.vars.recoilAnimY])
            if (this.me.weapon[this.vars.nAuto] && this.me[this.vars.didShoot]) { input[key.shoot] = 0; input[key.scope] = 0; this.me.inspecting = false; this.me.inspectX = 0; }
            else {
                if (!this.me.aimDir && canSee) {
                    input[key.scope] = 1;
                    if (!this.me[this.vars.aimVal]) {
                        input[key.shoot] = 1;
                        input[key.ydir] = yDire * 1e3
                        input[key.xdir] = xDire * 1e3
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

        const key = { frame: 0, delta:1,ydir:2,xdir:3,moveDir:4,shoot:5,scope:6,jump:7,crouch:8,reload:9,weaponScroll:10,weaponSwap:11, moveLock:12}
        if (this.isDefined(this.config) && this.config.aimAnimMlt) this.config.aimAnimMlt = 1;
        if (this.isDefined(this.controls) && this.isDefined(this.config) && this.settings.inActivity.val) {
            this.controls.idleTimer = 0;
            this.config.kickTimer = Infinity
        }
        if (this.me) {
            this.inputFrame ++;
            if (this.inputFrame >= 100000) this.inputFrame = 0;
            /*
            if (!this.game.decreaseWeapon[isProxy]) {
                this.game.decreaseWeapon = new original_Proxy(this.game.decreaseWeapon, {
                    apply: function(target, that, args) {
                        if (args[0] == this.me) return;
                        return target.apply(that, args);
                    },
                    get: function(target, key) {
                        return key === isProxy ? true : Reflect.get(target, key);
                    },
                })
            }
            if (!this.game.increaseWeapon[isProxy]) {
                this.game.increaseWeapon = new original_Proxy(this.game.increaseWeapon, {
                    apply: function(target, that, args) {
                        if (args[0] !== this.me) return;
                        return target.apply(that, args);
                    },
                    get: function(target, key) {
                        return key === isProxy ? true : Reflect.get(target, key);
                    },
                })
            }*/

            if (!this.game.playerSound[isProxy]) {
                this.game.playerSound = new original_Proxy(this.game.playerSound, {
                    apply: function(target, that, args) {
                        if (window.utilities.settings.disableWpnSnd.val && args[0] && typeof args[0] == "string" && args[0].startsWith("weapon_")) return;
                        return target.apply(that, args);
                    },
                    get: function(target, key) {
                        return key === isProxy ? true : Reflect.get(target, key);
                    },
                })
            }

            let isMelee = this.isDefined(this.me.weapon.melee)&&this.me.weapon.melee||this.isDefined(this.me.weapon.canThrow)&&this.me.weapon.canThrow;

            // autoReload
            if (this.settings.autoReload.val) {
                let ammoLeft = this.me[this.vars.ammos][this.me[this.vars.weaponIndex]];
                let capacity = this.me.weapon.ammo;
                //if (ammoLeft < capacity)
                if (isMelee) {
                    if (!this.me.canThrow) {
                        //this.me.refillKnife();
                    }
                } else if (!ammoLeft) {
                    input[key.reload] = 1;
                     this.me.reload = 0;
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
                let target = this.game.players.list.filter(enemy => {
                    return undefined !== enemy[this.vars.objInstances] && enemy[this.vars.objInstances] && !enemy[this.vars.isYou] && !this.getIsFriendly(enemy) && enemy.health > 0 && this.getInView(enemy)
                }).sort((p1, p2) => this.getD3D(this.me.x, this.me.z, p1.x, p1.z) - this.getD3D(this.me.x, this.me.z, p2.x, p2.z)).shift();
                if (target) {
                    //let count = this.spinTick(input);
                    //if (count < 360) {
                    //    input[2] = this.me[this.vars.xDire] + Math.PI;
                    //} else console.log("spins ", count);
                    let canSee = this.renderer.frustum.containsPoint(target[this.vars.objInstances].position);
                    let yDire = (this.getDir(this.me.z, this.me.x, target.z, target.x) || 0)
                    let xDire = ((this.getXDire(this.me.x, this.me.y, this.me.z, target.x, target.y /*+ target.jumpBobY*this.config.jumpVel*/ - target[this.vars.crouchVal] * this.consts.crouchDst + this.me[this.vars.crouchVal] * this.consts.crouchDst, target.z) || 0) - this.consts.recoilMlt * this.me[this.vars.recoilAnimY])
                    if (this.me.weapon[this.vars.nAuto] && this.me[this.vars.didShoot]) {
                        input[key.shoot] = 0;
                        input[key.scope] = 0;
                        this.me.inspecting = false;
                        this.me.inspectX = 0;
                    }
                    else if (!canSee && this.settings.frustrumCheck.val) this.resetLookAt();
                    else {
                        input[key.scope] = this.settings.autoAim.val === "assist"||this.settings.autoAim.val === "correction" ? this.controls[this.vars.mouseDownR] : this.settings.autoAim.val === "trigger" ? canSee ? 1 : 0 : 1;
                        switch (this.settings.autoAim.val) {
                            case "quickScope":
                                input[key.scope] = 1;
                                if (!this.me[this.vars.aimVal]) {
                                    if (!this.me.canThrow||!isMelee) input[key.shoot] = 1;
                                    input[key.xdir] = yDire * 1e3
                                    input[key.ydir] = xDire * 1e3
                                    this.lookDir(xDire, yDire);
                                }
                                break;
                            case "assist": case "easyassist":
                                if (input[key.scope] || this.settings.autoAim.val === "easyassist") {
                                    if (!this.me.aimDir && canSee || this.settings.autoAim.val === "easyassist") {
                                        input[key.xdir] = yDire * 1e3
                                        input[key.ydir] = xDire * 1e3
                                        this.lookDir(xDire, yDire);
                                    }
                                }
                                break;
                            case "silent":
                                if (!this.me[this.vars.aimVal]) {
                                    if (!this.me.canThrow||!isMelee) input[key.shoot] = 1;
                                } else input[key.scope] = 1;
                                input[key.xdir] = yDire * 1e3
                                input[key.ydir] = xDire * 1e3
                                break;
                            case "trigger":
                                if (!this.me.aimDir) {
                                    if (!this.me[this.vars.aimVal] && this.me.aimTime > 180) {
                                        if (!this.me.canThrow) input[key.shoot] = 1;
                                        input[key.xdir] = yDire * 1e3
                                        input[key.ydir] = xDire * 1e3
                                    }
                                }
                                break;
                            case "correction":
                                if (input[key.shoot] == 1) {
                                    input[key.xdir] = yDire * 1e3
                                    input[key.ydir] = xDire * 1e3
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

    getAngleDst(a, b) {
        return Math.atan2(Math.sin(b - a), Math.cos(a - b));
    };

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
            if (terrainRaycast) return this.getD3D(from.x, from.y, from.z, terrainRaycast.x, terrainRaycast.z, -terrainRaycast.y);
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

(function() {
    //'use strict';
    let initialize = function() {
        window._debugTimeStart = Date.now();
        fetch(location.origin+"/pkg/maindemo.wasm", {
            cache: "no-store"
        }).then(res=>res.arrayBuffer()).then(buff=>{
            window.mod.wasmBinary = buff;
            fetch(location.origin+"/pkg/maindemo.js", {
                cache: "no-store"
            }).then(res=>res.text()).then(body=>{
                body = body.replace(/(function UTF8ToString\((\w+),\w+\)){return \w+\?(.+?)\}/, `$1{let str=$2?$3;if (str.includes("CLEAN_WINDOW") || str.includes("Array.prototype.filter = undefined")) return "";return str;}`);
                body = body.replace(/(_emscripten_run_script\(\w+\){)eval\((\w+\(\w+\))\)}/, `$1 let str=$2; console.log(str);}`);
                //body = body.replace(/return (UTF8Decoder\.decode\(heap.subarray\(idx,endPtr\)\))/, `let outStr = $1; if (outStr.startsWith("var vrtInit"))outStr = window.mod.patchScript(outStr);else console.log(outStr); return outStr`);
                //body = body.replace(/return (stringToUTF8Array\(str,HEAPU8,outPtr,maxBytesToWrite\))/, `if(str.length>4e6)str = window.mod.patchScript(str);else console.log(str); return $1`);
                //body = body.replace(/(function UTF8ToString\((\w+),\w+\)){return \w+\?(.+?)\}/, `$1{let str=$2?$3;if (str.includes("CLEAN_WINDOW") || str.includes("Array.prototype.filter = undefined")) return "";else if (str.startsWith("var vrtInit")) str = window.mod.patchScript(str);return str;}`);
                new Function(body)();
                window.initWASM(window.mod);
                window.mod.onRuntimeInitialized = async function(){
                    "undefined" != typeof TextEncoder && "undefined" != typeof TextDecoder ? await this.initialize(this) : this.errorMsg("Your browser is not supported.")
                }
            })
        });

        window.Function = new Proxy(Function, {
            construct(target, args) {
                const that = new target(...args);
                if (args.length) {
                    let string = args[args.length - 1];

                    if (string.length > 38e5) {
                        window.utilities = new Utilities(string);
                        string = window.utilities.patchScript();
                    }

                    // If changed return with spoofed toString();
                    if (args[args.length - 1] !== string) {
                        args[args.length - 1] = string;
                        let patched = new target(...args);
                        patched.toString = () => that.toString();
                        return patched;
                    }
                }
                return that;
            }
        })

        CanvasRenderingContext2D.prototype.clearRect = function(x, y, width, height) {
            original_clearRect.apply(this, [x, y, width, height]);
            if (void 0 !== window.utilities) window.utilities.ctx = this;
            (function() {
                const caller = arguments.callee.caller.caller;
                if (caller) {
                    const renderArgs = caller.arguments;
                    if (renderArgs && void 0 !== window.utilities && window.utilities) {
                        ["scale", "game", "controls", "renderer", "me"].forEach((item, index)=>{
                            window.utilities[item] = renderArgs[index];
                        });
                        if (renderArgs[4]) {
                            window.utilities.onRender();
                            //window.requestAnimationFrame.call(window, renderArgs.callee.caller.bind(this));
                        }
                        if(window.utilities.settings && window.utilities.settings.autoClick.val && window.endUI.style.display == "none" && window.windowHolder.style.display == "none") {
                            renderArgs[2].toggle(true);
                        }
                    }
                }
            })();
        }
    }
    let observer = new MutationObserver(mutations => {
        for (let mutation of mutations) {
            for (let node of mutation.addedNodes) {
                if (node.tagName === 'SCRIPT' && node.type === "text/javascript" && node.innerHTML.startsWith("*!", 1)) {
                    node.innerHTML = `!function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=0)}([function(e,t){window.mod={errorMsg:function(i){instructionHolder.style.display="block",instructions.innerHTML="<div style='color: rgba(255, 255, 255, 0.6)'>"+i+"</div><div style='margin-top:10px;font-size:20px;color:rgba(255,255,255,0.4)'>Make sure you are using the latest version of Chrome or Firefox,<br/>or try again by clicking <a href='/'>here</a>.</div>",instructionHolder.style.pointerEvents="all"}};}]);`
                    initialize();
                    observer.disconnect();
                }
            }
        }
    });
    observer.observe(document, {
        childList: true,
        subtree: true
    });
})();


