// ==UserScript==
// @name         florr mob count script
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  shows all mob count
// @author       bismuth
// @match        https://florr.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=florr.io
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/453868/florr%20mob%20count%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/453868/florr%20mob%20count%20script.meta.js
// ==/UserScript==
WebAssembly.instantiateStreaming = (r, i) => (r.arrayBuffer().then(b => WebAssembly.instantiate(b, i)));
const _instantiate = WebAssembly.instantiate;
WebAssembly.instantiate = (bin,imports) => {
    const buf = new Uint8Array(bin);
    const length = buf.length-10;
    for (let n = 0; n < length; n++) {
        if (buf[n] === 67 &&
            buf[n+1] === 0 &&
            buf[n+2] === 0 &&
            buf[n+3] === 32 &&
            buf[n+4] === 65 &&
            buf[n+5] === 146 &&
            buf[n+6] === 33 &&
            buf[n+7] === 7 &&
            buf[n+8] === 11) {
            buf.set([0x41,0,0x2a,0,0],n);
            break;
        }
    }
    return _instantiate(bin, imports).then(wasm => {
        for (const exp of Object.values(wasm.instance.exports)) {
            if (exp.buffer) {
                const buffer = exp.buffer;
                const F32 = new Float32Array(buffer);
                F32[0] = 10;
                document.addEventListener('keydown', ({code}) => { if (code === 'KeyE') F32[0] = 80 - F32[0]; });
                break;
            }
        }
        return wasm;
    });
}