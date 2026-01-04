// ==UserScript==
// @name         PPConf Updated
// @description  Pixel Place Config
// @version      1.6.7
// @author       0vC4
// @namespace    https://greasyfork.org/users/670183
// @match        https://pixelplace.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixelplace.io
// @license      MIT
// @grant        none
// @run-at       document-start
// ==/UserScript==
(() => {
    const PPClient = window.PPClient || {modules:{}};
    window.PPClient = PPClient;
    if ('Config' in PPClient.modules) return;
 
    const module = {};
    module.zero = 0xCCCCCC;
    module.colors = new Uint32Array([0xFFFFFF,0xC4C4C4,0x888888,0x555555,0x222222,0x000000,0x006600,0x22B14C,0x02BE01,0x51E119,0x94E044,0xFBFF5B,0xE5D900,0xE6BE0C,0xE59500,0xA06A42,0x99530D,0x633C1F,0x6B0000,0x9F0000,0xE50000,0xFF3904,0xBB4F00,0xFF755F,0xFFC49F,0xFFDFCC,0xFFA7D1,0xCF6EE4,0xEC08EC,0x820080,0x5100FF,0x020763,0x0000EA,0x044BFF,0x6583CF,0x36BAFF,0x0083C7,0x00D3DD,0x45FFC8,0x005BA1,0x003638,0x477050,0xB5E8EE,0xFF416A,0x330077,0x7D26CD,0xFF7000,0x98FB98,0x1B7400,0xCE2939]);
    module.exclude = new Uint32Array([]);
    module.packetSpeed = 45;
    module.packetCount = null;
    module.silent = true;
    module.tickSpeed = 100;
    module.timer = window;
    module.order = 'fromCenter';
    module.callbacks = [];
    module.subscribe = (...funcs) => {
        module.callbacks.push(...funcs.flat());
        funcs.flat().map(f => f(module));
    };
 
    PPClient.config = new Proxy(module, {
        set(target, key, value) {
            target[key] = value;
            target.callbacks.map(c => c(target));
            return true;
        }
    });
 
    PPClient.modules.Config = module;
})();