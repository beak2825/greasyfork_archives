// ==UserScript==
// @name Sploop.io Hat Hotkeys
// @author Murka
// @description Allows to equip hats by pressing keys!
// @icon https://sploop.io/img/ui/favicon.png
// @version 0.2
// @match *://sploop.io/*
// @run-at document-start
// @grant none
// @license MIT
// @namespace https://greasyfork.org/users/919633
// @downloadURL https://update.greasyfork.org/scripts/486356/Sploopio%20Hat%20Hotkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/486356/Sploopio%20Hat%20Hotkeys.meta.js
// ==/UserScript==
/* jshint esversion:8 */
 
/*
    Author: Murka
    Github: https://github.com/Murka007
    Discord: https://discord.gg/sG9cyfGPj5
    Greasyfork: https://greasyfork.org/en/users/919633
*/
 
(function() {
    "use strict";
 
    const HATS = {
        BUSH_HAT: 0,
        BERSERKER: 1,
        JUNGLE_GEAR: 2,
        CRYSTAL_GEAR: 3,
        SPIKE_GEAR: 4,
        IMMUNITY_GEAR: 5,
        BOOST_HAT: 6,
        APPLE_HAT: 7,
        SCUBA_GEAR: 8,
        HOOD: 9,
        DEMOLIST: 10
    };
 
    // Change your keybinds if you need to, get list of the key codes here: https://keycode.info
    // Please use `event.code` to change keybind
    // If you don't need a keybind, leave the field empty ""
 
    const KEYBINDS = {
        [HATS.BUSH_HAT]: "",
        [HATS.BERSERKER]: "Key1",
        [HATS.JUNGLE_GEAR]: "",
        [HATS.CRYSTAL_GEAR]: "KeyF",
        [HATS.SPIKE_GEAR]: "KeyC",
        [HATS.IMMUNITY_GEAR]: "KeyV",
        [HATS.BOOST_HAT]: "KeyR",
        [HATS.APPLE_HAT]: "",
        [HATS.SCUBA_GEAR]: "",
        [HATS.HOOD]: "KeyO",
        [HATS.DEMOLIST]: "Key2"
    };
 
    // HAT EQUIP LOGIC GOES BELOW
 
 
 
    const log = console.log;
    const storage = {
        get(key) {
            const value = localStorage.getItem(key);
            return value === null ? null : JSON.parse(value);
        },
        set(key, value) {
            localStorage.setItem(key, JSON.stringify(value));
        }
    };
 
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
 
    function isInput() {
        return document.activeElement.tagName === "INPUT";
    }
 
    function inGame() {
        const homepage = document.querySelector("#homepage");
        return homepage && homepage.style.display !== "flex";
    }
 
    function canEquip() {
        return !isInput() && inGame();
    }
 
    function createKeyboardEvent(type, code) {
        return new Proxy(new KeyboardEvent(type), {
            get(target, prop) {
                if (prop === "isTrusted") return true;
                if (prop === "target") return document.body;
                if (prop === "code") return code;
                return target[prop];
            }
        })
    }
 
    function keypress(code) {
        const keydown = createKeyboardEvent("keydown", code);
        const keyup = createKeyboardEvent("keyup", code);
        window.onkeydown(keydown);
        window.onkeyup(keyup);
    }
 
    function mouseup(target) {
        target.onmouseup(new Proxy(new MouseEvent("mouseup"), {
            get(target, prop) {
                if (prop === "isTrusted") return true;
                if (prop === "target") return target;
                return target[prop];
            }
        }));
    }
 
    let equipToggle = false;
    async function equipHat(index) {
        if (!canEquip() || equipToggle) return;
        equipToggle = true;
 
        const hatActionButton = document.querySelectorAll(".hat_action_button")[index];
        if (!hatActionButton) throw new Error("Failed to find hat with index: " + index);
 
        const keybinds = storage.get("keybinds");
        const OpenShopKey = keybinds && keybinds[18] || "KeyN";
 
        keypress(OpenShopKey);
        await sleep(150);
        if (hatActionButton.textContent === "BUY") {
            mouseup(hatActionButton);
        }
        mouseup(hatActionButton);
        await sleep(150);
        keypress(OpenShopKey);
 
        await sleep(1500);
        equipToggle = false;
    }
 
    window.addEventListener("keydown", function(event) {
        if (event.repeat) return;
 
        for (const key in KEYBINDS) {
            if (event.code === KEYBINDS[key]) {
                equipHat(key);
                break;
            }
        }
    })
 
})();