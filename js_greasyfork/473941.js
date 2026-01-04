// ==UserScript==
// @name         MooMoo.io Hat Switcher
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Switches Hats if you press B
// @author       Feature
// @match        *://*.moomoo.io/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=moomoo.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473941/MooMooio%20Hat%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/473941/MooMooio%20Hat%20Switcher.meta.js
// ==/UserScript==
/*
Discord: Feature#2080

Youtube: youtube.com/Feature69_?sub_confirmation=1
*/

class forReal {
    constructor() {
        this.time = 100;
        this.hatIndex = [50, 28, 29, 30, 36, 37, 38, 44, 35, 43, 49, 57];
        this.currentIndex = 0;
        this.isActivated = false;
    }

    newTick(callback, delay) {
        setTimeout(callback, delay);
    }

    toggleActivation() {
        this.isActivated = !this.isActivated;
        if (this.isActivated) {
            this.equip();
        }else{
            setTimeout(()=>{
                window.storeEquip(0);
            }, 500);
        }
    }

    equip() {
        if (this.currentIndex < this.hatIndex.length) {
            let equipNumber = this.hatIndex[this.currentIndex];
            window.storeEquip(equipNumber);
            this.currentIndex++;
        } else {
            this.currentIndex = 0;
        }

        if (this.isActivated) {
            setTimeout(() => {
                this.newTick(() => this.equip(), this.time);
            }, 80);
        }
    }

    start() {
        document.body.onkeyup = (e) => {
            if (e.keyCode === 66) {
                this.toggleActivation();
            }
        };
    }
}

const equipManager = new forReal();
equipManager.start();
