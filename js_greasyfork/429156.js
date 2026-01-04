// @name         krunker.io.io Skin Hack
// ==UserScript==
// @name         krunker.io skin hack
// @version      1.0
// @author       KPD hacker
// @icon         https://www.google.com/s2/favicons?domain=krunker.io
// @description  unlocks all skins, client side only
// @match        *://krunker.io/*
// @exclude      *://krunker.io/editor*
// @exclude      *://krunker.io/social*
// @run-at       document-start
// @grant        none
// @namespace https://greasyfork.org/users/786036
// @downloadURL https://update.greasyfork.org/scripts/429156/krunkerio%20skin%20hack.user.js
// @updateURL https://update.greasyfork.org/scripts/429156/krunkerio%20skin%20hack.meta.js
// ==/UserScript==

((global, sendEvent, sendMessage)=>{
    /* eslint-disable no-caller, no-undef, no-sequences */

    console.log(this)

    var config = {
        unlock:true
    }

    function init(ws) {
        console.log(ws)
        sendEvent = ws._dispatchEvent.bind(ws);
        sendMessage = ws.send.bind(ws);
        ws.send = new Proxy(ws.send, {
            apply: function(target, that, args) {
                try {
                    var original_fn = Function.prototype.apply.apply(target, [that, args]);
                } catch (e) {
                    e.stack = e.stack = e.stack.replace(/\n.*Object\.apply.*/, '');
                    throw e;
                }

                if (args[0] === "en") {
                    config.skins = {
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

        ws._dispatchEvent = new Proxy(ws._dispatchEvent, {
            apply: function(target, that, [type, event]) {

                if (config.unlock && config.skins && type === "0") {
                    let pInfo = event[0];
                    let pSize = 38;
                    while (pInfo.length % pSize !== 0) pSize++;
                    for(let i = 0; i < pInfo.length; i += pSize) {
                        if (pInfo[i] === ws.socketId||0) {
                            pInfo[i + 12] = [config.skins.main, config.skins.secondary];
                            pInfo[i + 13] = config.skins.hat;
                            pInfo[i + 14] = config.skins.body;
                            pInfo[i + 19] = config.skins.knife;
                            pInfo[i + 24] = config.skins.dye;
                            pInfo[i + 33] = config.skins.waist;
                        }
                    }
                }

                return target.apply(that, arguments[2]);
            }
        })
    }

    const $events = Symbol("events");
    const $skins = Symbol("skins");
    Object.defineProperties(Object.prototype, {
        events: {
            set: function(fn) {
                this.ahNum === 0 && init(this), this[$events] = fn;
            },
            get: function() {
                return this[$events]
            }
        },

        skins: {
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
                return config.unlock && this.stats ? this.localSkins : this[$skins];
            }
        },
    });

})(globalThis||window, null, null);