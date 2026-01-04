// ==UserScript==
// @name         Macro Mod V-1.0
// @namespace    -
// @version      1.0
// @description  Macro Place , Macro Hat , And More!!!!
// @author       2k09__
// @match        https://sploop.io/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487835/Macro%20Mod%20V-10.user.js
// @updateURL https://update.greasyfork.org/scripts/487835/Macro%20Mod%20V-10.meta.js
// ==/UserScript==
let weaponKey;

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

    const KEYBINDS = {
        [HATS.BUSH_HAT]: "",
        [HATS.BERSERKER]: "KeyB",
        [HATS.JUNGLE_GEAR]: "",
        [HATS.CRYSTAL_GEAR]: "KeyC",
        [HATS.SPIKE_GEAR]: "KeyJ",
        [HATS.IMMUNITY_GEAR]: "Semicolon",
        [HATS.BOOST_HAT]: "ShiftLeft",
        [HATS.APPLE_HAT]: "",
        [HATS.SCUBA_GEAR]: "KeyK",
        [HATS.HOOD]: "KeyO",
        [HATS.DEMOLIST]: "KeyZ"
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

            const grids = document.querySelector("#grid-toggle");
setInterval(() => {
            if (grids.checked){grids.click();}
}, 0);

        const PLACE = {
            SPIKE: 0,
            SPIKE_HARD: 1,
            WINDMILL: 2,
            POWERMILL: 3,
            TRAP: 4,
            BOOST: 5,
            COSY_BED: 6,
            PLATFORM: 7,
            APPLE: 8,
            COOKIE: 9,
            WALL: 10,
        };
        
        const KEYBINDSPLACE = {
            [PLACE.SPIKE]: "KeyV",
            [PLACE.SPIKE_HARD]: "KeyV",
            [PLACE.WINDMILL]: "KeyN",
            [PLACE.POWERMILL]: "KeyN",
            [PLACE.TRAP]: "KeyF",
            [PLACE.BOOST]: "KeyF",
            [PLACE.COSY_BED]: "KeyL",
            [PLACE.PLATFORM]: "KeyH",
            [PLACE.APPLE]: "KeyQ",
            [PLACE.COOKIE]: "KeyQ",
            [PLACE.WALL]: "KeyT",
        };

            //HEAL.PLACE
            this.key.press({code: "KeyQ"});
            this.key.press({code: "Space"});
            this.key.press({key: weaponKey});

            //SPIKE.PLACE
            this.key.press({code: "KeyV"});
            this.key.press({code: "Space"});
            this.key.press({key: weaponKey});
            
            //WINDMILL'S.PLACE
            this.key.press({code: "KeyN"});
            this.key.press({code: "Space"});
            this.key.press({key: weaponKey});
            
            //TRAP/BOOST.PLACE'S
            this.key.press({code: "KeyF"});
            this.key.press({code: "Space"});
            this.key.press({key: weaponKey});
            
            //COSYBED/SPAWN.PLACE
            this.key.press({code: "KeyL"});
            this.key.press({code: "Space"});
            this.key.press({key: weaponKey});
            
            //PLATFORM.PLACE
            this.key.press({code: "KeyH"});
            this.key.press({code: "Space"});
            this.key.press({key: weaponKey});
            
            //WALL.PLACE
            this.key.press({code: "KeyT"});
            this.key.press({code: "Space"});
            this.key.press({key: weaponKey});