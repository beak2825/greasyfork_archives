// ==UserScript==
// @name        Random Script
// @author      ABC
// @namespace   Test Script
// @description Test
// @match       https://diep.io/*
// @version     1.0.0
// @run-at      document-load
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/428936/Random%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/428936/Random%20Script.meta.js
// ==/UserScript==
 
class DroneHealthModule {
    constructor(ABC="MEMORY_KING") {
        this.initiated = false;
    }
 
    async init() {
        await this.inject();
        this.initiated = true;
    }
 
    async inject() {
      if (!unsafeWindow.ABCBase) return alert("Make sure you have ABC Base Script enabled!")
 
      while (typeof unsafeWindow.ABCBase.memory === 'undefined' || typeof unsafeWindow.ABCBase.Module === 'undefined') {
        await new Promise(r=>setTimeout(r, 300))
      }
      try {
        this.Module = unsafeWindow.ABCBase.Module;
        this.brain = unsafeWindow.ABCBase.memory;
        for (let {name, address} of this.brain) {
          if (name === 'entityPtr' || name === 'healthbarOffset') this[name] = address;
        }
      } catch (err) {
        console.warn(err)
        alert("Make sure you have ABC Base Script enabled!")
      }
 
      let that = this;
 
      ABCBase.addEventListener('animate', () => {
        this.update()
      });
    }
 
    update() {
        if (!this.Module) return
        if (this.Module.HEAP32[this.entityPtr >> 2] === this.Module.HEAP32[(this.entityPtr + 4) >> 2]) return;
 
        let out = []
        let at = this.entityPtr;
        let end = this.Module.HEAP32[(at + 4) >> 2];
        at = this.Module.HEAP32[at >> 2];
        while (at < end) {
            out.push(this.Module.HEAP32[this.Module.HEAP32[at >> 2] >> 2])
            at += 4
        }
 
        let updateAddr = out.map(ptr => this.Module.HEAP32[(ptr + 88) >> 2]).filter(ptr => ptr).map(ptr => (ptr + this.healthbarOffset) >> 2)
 
        for (let ptr of updateAddr) this.Module.HEAP32[ptr] = 0
    }
}
 
const DroneHealth = new DroneHealthModule()
DroneHealth.init()