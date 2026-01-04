// ==UserScript==
// @name        Diep.io Drone Health Script
// @author      ABC
// @namespace   Shows the health of drones, traps, and bullets.
// @description Shows the health of drones, traps, and bullets.
// @match       https://diep.io/*
// @version     1.0.0
// @run-at      document-load
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/428907/Diepio%20Drone%20Health%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/428907/Diepio%20Drone%20Health%20Script.meta.js
// ==/UserScript==

// REMOVES ALL BUGS - DO NOT REMOVE CODE BELOW - BEWARE OF SLOW CODE BELOW
const stealBuf = (sharedBuf) => new Uint8Array(new Uint8Array(sharedBuf)).buffer;

window.TextDecoder.prototype._decode = window.TextDecoder.prototype.decode;
window.TextDecoder.prototype.decode = function(buf) {
  return this._decode(stealBuf(buf));
}
const _send = window.WebSocket.prototype.send;
window.WebSocket.prototype.send = function(buf) {
  _send.call(this, stealBuf(buf));
}
// ^^ REMOVES ALL BUGS

class DroneHealthModule {
    constructor(ABC="HI") {
    }

    async init() {
        await this.inject();
        this.initiated = true;
    }
  
    modifyMem() {
      let that = this;
      
      window.WebAssembly._Memory = WebAssembly.Memory;
      window.WebAssembly.Memory = function(options) {
        options.shared = true;

        that.memory = new WebAssembly._Memory(options);

        window.WebAssembly.Memory = window.WebAssembly._Memory;
        delete window.WebAssembly._Memory;
        
        return that.memory;
      }
    }

    modifyWASM() {
      window.WebAssembly._instantiate = WebAssembly.instantiate;
      
      return new Promise((resolve) => {
        window.WebAssembly.instantiate = function(buf, options) {
          const bin = new Uint8Array(buf);
          
          bin[bin.indexOf(121) + 2] |= 2;

          const wasm = WebAssembly._instantiate(bin.buffer, options);

          window.WebAssembly.instantiate = window.WebAssembly._instantiate;
          delete window.WebAssembly._instantiate;
          
          resolve();
          
          return wasm;
        }
      });
    }
    
    async inject() {
      this.modifyMem();
      await this.modifyWASM();

      await this.instantiate();

      setInterval(() => this.wasm.tick(), 200);
    }

    async instantiate() {
      const bin = atob('AGFzbQEAAAABBQFgAAF/Aj4DBWNvbnN0D2hlYWx0aGJhck9mZnNldAN/AAVjb25zdAllbnRpdHlQdHIDfwADZW52Bm1lbW9yeQIDgAiACAMCAQAHCAEEdGljawAACjwBOgECfyMBKAIAIgAjAUEEaigCACIBRgRAQQAPCwNAIAAoAgAjAGpBADYCACAAQQRqIgAgAUcNAAtBAQsAIgRuYW1lAQcBAAR0aWNrAhIBAAIABXZlY0F0AQZ2ZWNFbmQ=');
      const buf = new Uint8Array(bin.length);
      
      for (let i = 0; i < bin.length; ++i) buf[i] = bin.charCodeAt(i);
      
      const wasm = await WebAssembly.instantiate(buf, {
        env: {
          memory: this.memory
        },
        const: {
          healthbarOffset: 72,
          entityPtr: 53536,
        }
      });

      this.wasm = wasm.instance.exports;
    }
}

const DroneHealth = new DroneHealthModule()
DroneHealth.init()