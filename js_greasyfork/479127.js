// ==UserScript==
// @name         MyBot NewColors
// @description  MyBot New Colors for PixelPlace
// @version      1.0
// @author       SamaelWired
// @namespace    https://greasyfork.org/tr/users/976572
// @match        https://pixelplace.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixelplace.io
// @license      MIT
// @grant        none
// @run-at       document-start
// ==/UserScript==
(() => {
    const MyBot = window.MyBot || {modules: {}};
    window.MyBot = MyBot;
    if ('Config' in MyBot.modules) return;

    const module = {};
    module.zero = 0xCCCCCC;
    module.colors = new Uint32Array([
    0xFFFFFF, 0xC4C4C4, 0x888888, 0x555555, 0x222222, 0x000000, 0x006600, 0x22B14C, 0x02BE01,
    0x51E119, 0x94E044, 0xFBFF5B, 0xE5D900, 0xE6BE0C, 0xE59500, 0xA06A42, 0x99530D, 0x633C1F,
    0x6B0000, 0x9F0000, 0xE50000, 0xFF3904, 0xBB4F00, 0xFF755F, 0xFFC49F, 0xFFDFCC, 0xFFA7D1,
    0xCF6EE4, 0xEC08EC, 0x820080, 0x5100FF, 0x020763, 0x0000EA, 0x044BFF, 0x6583CF, 0x36BAFF,
    0x0083C7, 0x00D3DD, 0x45FFC8, 0x003638, 0x477050, 0x98FB98, 0xFF7000, 0xCE2939, 0xFF416A,
    0x7D26CD, 0x330077, 0x005BA1, 0xB5E8EE, 0x1B7400,
    0x12895428, 0x8947848, 0x5592405, 0x2236962, 0x0, 0x26112, 0x2273612, 0x179713,
    0x5366041, 0x9756740, 0x16514907, 0x15063296, 0x15121932, 0x15045888, 0x10512962,
    0x10048269, 0x6503455, 0x7012352, 0x10420224, 0x15007744, 0x16726276, 0x12275456,
    0x16741727, 0x16762015, 0x16768972, 0x16754641, 0x13594340, 0x15468780, 0x8519808,
    0x5308671, 0x132963, 0x234, 0x281599, 0x6652879, 0x3586815, 0x33735, 0x54237,
    0x4587464, 0x13880, 0x4681808, 0x10025880, 0x16740352, 0x13510969, 0x16728426,
    0x8201933, 0x3342455, 0x23457, 0x11921646, 0x1799168]);
    module.exclude = new Uint32Array([0x666666]);
    module.packetSpeed = 50;
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

    MyBot.config = new Proxy(module, {
        set(target, key, value) {
            target[key] = value;
            target.callbacks.map(c => c(target));
            return true;
        }
    });

    MyBot.modules.Config = module;
})();
