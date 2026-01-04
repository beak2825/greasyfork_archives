// ==UserScript==
// @name         diep.io shape changer script
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  changes the shapes of bullets tanks shapes, the whole lot
// @author       bismuth
// @match        *diep.io
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/445080/diepio%20shape%20changer%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/445080/diepio%20shape%20changer%20script.meta.js
// ==/UserScript==
const map = {
    1: 6, //from -> to
    3: 5,
    4: 8,
    5: 3
}
let mem, active = true;
WebAssembly.instantiateStreaming = new Proxy(WebAssembly.instantiateStreaming, {
    apply(...args) {
        mem = new Int32Array(args[2][1].a.memory.buffer);
        return Reflect.apply(...args);
    }
});
window.requestAnimationFrame = new Proxy(window.requestAnimationFrame, {
    apply(...args) {
        if (mem) change();
        return Reflect.apply(...args);
    }
});
const change = () => {
    const things = mem.slice(mem[0xed44 >> 2] >> 2, mem[0xed48 >> 2] >> 2);
    for (const thing of things) {
        if (!active) {
            mem[thing + 0x68 >> 2] = (mem[thing + 4 >> 2] >> 8) || mem[thing + 0x68 >> 2];
            mem[thing + 4 >> 2] = 0;
            continue;
        }
        if (mem[thing + 4 >> 2]) continue;
        const before = mem[thing + 0x68 >> 2];
        mem[thing + 0x68 >> 2] = map[before] || before;
        mem[thing + 4 >> 2] = before << 8;
    }
}
document.onkeydown = async ({keyCode}) => {
    if (keyCode === 192) active ^= true;
}