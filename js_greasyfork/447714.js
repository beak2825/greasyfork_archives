// ==UserScript==
// @name Moomoo.io New cyan color
// @author Murka
// @description Adds a new cyan color to the color selection panel
// @icon https://moomoo.io/img/favicon.png?v=1
// @version 0.3
// @match *://moomoo.io/*
// @match *://*.moomoo.io/*
// @run-at document-start
// @grant none
// @license MIT
// @namespace https://greasyfork.org/users/919633
// @downloadURL https://update.greasyfork.org/scripts/447714/Moomooio%20New%20cyan%20color.user.js
// @updateURL https://update.greasyfork.org/scripts/447714/Moomooio%20New%20cyan%20color.meta.js
// ==/UserScript==
/* jshint esversion:6 */

/*
    Author: Murka
    Github: https://github.com/Murka007
    Discord: https://discord.gg/cPRFdcZkeD
    Greasyfork: https://greasyfork.org/en/users/919633
    MooMooForge: https://github.com/MooMooForge
*/

(function() {
    "use strict";

    const log = console.log;
    const storage = {
        get(key) {
            const value = localStorage.getItem(key);
            return value === null ? null : value;
        },
        set(key, value) {
            localStorage.setItem(key, typeof value !== "string" ? JSON.stringify(value) : value);
        }
    };

    // Unlock 100 resource bonus
    storage.set("moofoll", 1);

    function createHook(target, prop, setter) {
        const symbol = Symbol(prop);
        Object.defineProperty(target, prop, {
            get() {
                return this[symbol];
            },
            set(value) {
                setter(this, symbol, value);
            },
            configurable: true
        })
    }

    // Add cyan color to the skinColor array
    createHook(Object.prototype, "skinColors", function(that, symbol, value) {
        delete Object.prototype.skinColors;
        that.skinColors = [...value, "#91B2DB"];
    })

    // When choosing a color, replace index with "toString", so server will cause some error that will make your color cyan
    createHook(window, "selectSkinColor", function(that, symbol, value) {
        delete window.selectSkinColor;
        window.selectSkinColor = new Proxy(value, {
            apply(target, _this, args) {
                const [ skin ] = args;
                target.call(_this, skin === 10 ? "toString" : skin);

                storage.set("skinColor", skin);
                if (skin === 10) {
                    const skins = document.querySelectorAll("#skinColorHolder > *");
                    const last = skins[skins.length-1];
                    last.classList.add("activeSkin");
                }
            }
        })
    })

    // Select saved color on the load
    window.addEventListener("load", function() {
        const observer = new MutationObserver(mutations => {
            observer.disconnect();
            for (const mutation of mutations) {
                const index = storage.get("skinColor") || 0;
                mutation.addedNodes[index].click();
            }
        })
        observer.observe(document.querySelector("#skinColorHolder"), { childList: true, subtree: true });
    })

})();