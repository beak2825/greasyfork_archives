// ==UserScript==
// @name Sploop.io All Skins Unlocked
// @author Murka
// @description Unlocks ALL skins in the game! Select any skins you want!
// @icon https://sploop.io/img/ui/favicon.png
// @version 0.3
// @match *://sploop.io/*
// @run-at document-start
// @grant none
// @noframes
// @license MIT
// @namespace https://greasyfork.org/users/919633
// @downloadURL https://update.greasyfork.org/scripts/447322/Sploopio%20All%20Skins%20Unlocked.user.js
// @updateURL https://update.greasyfork.org/scripts/447322/Sploopio%20All%20Skins%20Unlocked.meta.js
// ==/UserScript==
/* jshint esversion:8 */

/*
    Author: Murka
    Github: https://github.com/Murka007
    Discord: https://discord.gg/cPRFdcZkeD
    Greasyfork: https://greasyfork.org/en/users/919633

    Description:
    - Your not purchased skins will not be shown in the `SKINS` tab
    - You can select any skins you want by using `SHOP` tab
    - It is impossible to make selected skins to show everyone
    - Script can stop working after update, if you will have any issues, report about it in my DISCORD
*/

(function() {
    "use strict";

    const log = console.log;

    function createHook(target, prop, setter) {
        if (!window.hooks) {
            window.hooks = {
                setter: [],
                getter: []
            };
        }
        window.hooks.setter.push(setter);

        const symbol = Symbol(prop);
        Object.defineProperty(target, prop, {
            get() {
                return this[symbol];
            },
            set(value) {
                for (const setter of window.hooks.setter) {
                    setter(this, symbol, value);
                }
            },
            configurable: true
        })
    }

    function inGame() {
        const homepage = document.querySelector("#homepage");
        return homepage && homepage.style.display !== "flex";
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const storage = {
        get(key) {
            const value = localStorage.getItem(key);
            return value === null ? null : JSON.parse(value);
        },
        set(key, value) {
            localStorage.setItem(key, JSON.stringify(value));
        }
    };

    // it might change in the next update
    // jn - skin
    // jo - accessory
    // jq - back

    const INDEX = {
        SKIN: 16,
        ACCESSORY: 17,
        BACK: 19
    };

    const KEY = {
        SKIN: null,
        ACCESSORY: null,
        BACK: null
    };

    function defineProperty(target, prop, value) {
        Object.defineProperty(target, prop, {
            get() {
                return value;
            },
            set() {
                return true;
            },
            configurable: true,
            writeable: false
        })
    }

    // Dragon skin, Mask accessory and Dragon Wings by Default, why not?
    const settings = (function() {
        function createSettings() {
            const settings = {};
            settings.skin = 27;
            settings.accessory = 30;
            settings.back = 2;
            return settings;
        }

        const defaultSettings = createSettings();
        const settings = Object.assign({}, defaultSettings, storage.get("selectedSkins"));
        for (const key in settings) {
            if (!defaultSettings.hasOwnProperty(key)) {
                delete settings[key];
            }
        }

        storage.set("selectedSkins", settings);
        return settings;
    })();

    const myPlayer = {
        id: null,
        data: null
    };

    window.WebSocket = new Proxy(WebSocket, {
        construct(target, args) {
            const socket = new target(...args);
            socket.addEventListener("message", function(event) {
                try {
                    const data = JSON.parse(event.data);
                    if (data[0] === 35) {
                        myPlayer.id = data[1];
                    }
                } catch(err) {}
            })
            return socket;
        }
    })

    function getDefault() {
        return {
            skin: storage.get("skin") || 0,
            accessory: storage.get("accessory") || 0,
            back: storage.get("back") || 0
        };
    }

    createHook(Object.prototype, "i", async function(that, symbol, value) {
        that[symbol] = value;
        if (myPlayer.id === value) {
            myPlayer.data = that;
            await sleep(0);

            const skinData = storage.get("selectedSkins");
            const Default = getDefault();

            const keys = Object.keys(that);
            if (!KEY.SKIN) KEY.SKIN = keys[INDEX.SKIN];
            if (!KEY.ACCESSORY) KEY.ACCESSORY = keys[INDEX.ACCESSORY];
            if (!KEY.BACK) KEY.BACK = keys[INDEX.BACK];

            const current = {
                skin: that[KEY.SKIN] || 0,
                accessory: that[KEY.ACCESSORY] || 0,
                back: that[KEY.BACK] || 0
            };

            // Skin will not change if you are not logged into your account
            // And also you can't even select any skins without account, except default one
            defineProperty(that, KEY.SKIN, skinData.skin || Default.skin);
            defineProperty(that, KEY.ACCESSORY, skinData.accessory || Default.accessory);
            defineProperty(that, KEY.BACK, skinData.back || Default.back);
        }
    });

    // We need to reset our skins on death/change server
    function resetSkins() {
        if (myPlayer.data === null) return;
        const { skin, accessory, back } = getDefault();
        defineProperty(myPlayer.data, KEY.SKIN, skin);
        defineProperty(myPlayer.data, KEY.ACCESSORY, accessory);
        defineProperty(myPlayer.data, KEY.BACK, back);
    }

    window.addEventListener("load", function() {

        const changeServer = document.querySelector("#change-server");
        const mainContent = document.querySelector("#main-content");
        const homepage = document.querySelector("#homepage");

        // Attach click event handler to make users select their skins
        new MutationObserver(mutations => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    try {
                        if (node.classList.contains("skins-line")) {
                            for (const button of node.children) {
                                button.addEventListener("click", function() {
                                    const [ match, type, id ] = button.src.match(/(skin|accessory|back)(\d+)/);
                                    settings[type] = Number(id);
                                    storage.set("selectedSkins", settings);
                                })
                            }
                        }
                    } catch(err){}
                }
            }
        }).observe(mainContent, { childList: true, subtree: true });

        // Reset myPlayer if user has changed server
        changeServer.addEventListener("click", resetSkins);

        // Also reset if player died
        new MutationObserver(mutations => {
            for (const mutation of mutations) {
                if (mutation.target.style.display === "flex") {
                    resetSkins();
                }
            }
        }).observe(homepage, { attributes: true, attributeFilter: ["style"] });
    })

})();