// ==UserScript==
// @name         krunker name tag hacked
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  krunker.io hacks
// @author       kpd hacker
// @match        https://krunker.io/
// @icon         https://i.redd.it/a6g2v0xi0pe41.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428305/krunker%20name%20tag%20hacked.user.js
// @updateURL https://update.greasyfork.org/scripts/428305/krunker%20name%20tag%20hacked.meta.js
// ==/UserScript==
let main = {
    settings: {
        nameTags: true
    }
};

Object.defineProperties(Object.prototype, {
    canvas: {
        set(val) {
            this._canvas = val;
            if (val.id == "game-overlay") {
                main.overlay = this;
                main.ctx = val.getContext('2d');
                Object.defineProperties(this, {
                    render: {
                        set(val) {
                            this._render = new Proxy(val, {
                                apply() {
                                    ["scale", "game", "controls", "renderer", "me"].forEach((name, index) => {
                                        main[name] = arguments[index];
                                    });
                                    Reflect.apply(...arguments);
                                }
                            })
                        },
                        get() {
                            return this._render;
                        }
                    }
                })
            }
        },
        get() {
            return this._canvas;
        }
    },
    cnBSeen: {
        set(val) {
            this.inView = val;
        },
        get() {
            let isEnemy = !main.me || !main.me.team || main.me.team != this.team;
            return this.inView || isEnemy && main.settings.nameTags;
        }
    },
});