// ==UserScript==
// @name         Sploop.io Advanced Keystrokes.
// @version      3
// @description  Customize key/mouse bindings, track CPS, view mini map, and manage X-buttons for better gameplay.
// @author       DETIX
// @match        *://sploop.io/*
// @icon         https://sploop.io/img/ui/favicon.png
// @license      MIT
// @namespace https://greasyfork.org/users/1311498
// @downloadURL https://update.greasyfork.org/scripts/499313/Sploopio%20Advanced%20Keystrokes.user.js
// @updateURL https://update.greasyfork.org/scripts/499313/Sploopio%20Advanced%20Keystrokes.meta.js
// ==/UserScript==

const DATA = {
    CPS: 0,
    MAXCPS: 0,
    //if you don't have XButtons, make this false.
    ShowXBUTTONS: true //<---------- this.
};

let SHOP, FOOD, SPIKE, TRAP;

const OBJECT = {
    KEYS: {
        PRIMARY: { KEY: "Digit1", KEY2: "Numpad1", PRESSED: false },
        SECONDARY: { KEY: "Digit2", KEY2: "Numpad2", PRESSED: false },
        FOOD: { KEY: "KeyQ", KEY2: "Digit3", PRESSED: false },
        SPIKE: { KEY: "KeyR", KEY2: "Digit5", PRESSED: false },
        TRAP: { KEY: "KeyF", KEY2: "Digit7", PRESSED: false },
        SPACE: { KEY: "Space", PRESSED: false },
        LOCK: { KEY: "KeyX", PRESSED: false },
        AUTOHIT: { KEY: "KeyE", PRESSED: false },
        SHOP: { KEY: "KeyN", PRESSED: false }
    },
    BUTTONS: {
        LEFT: { BUTTON: 0, PRESSED: false },
        MIDDLE: { BUTTON: 1, PRESSED: false },
        RIGHT: { BUTTON: 2, PRESSED: false },
        XBUTTON1: { BUTTON: 3, PRESSED: false },
        XBUTTON2: { BUTTON: 4, PRESSED: false }
    },
    CURSOR: {
        x: 0,
        y: 0
    }
};

const isInGame = () => {
    const homepage = document.getElementById("homepage");
    return homepage && homepage.style.display !== "flex";
};

const isAVAILABLE = () => {
    if (!isInGame()) return false;
    const chatWrapper = document.getElementById("chat-wrapper");
    const clanMenu = document.getElementById("clan-menu");
    return chatWrapper && clanMenu && chatWrapper.style.display !== "block" && clanMenu.style.display !== "block";
};

const UPDATE = {
    KEYS: {
        DOWN(e) {
            if (e.code === OBJECT.KEYS.PRIMARY.KEY || e.code === OBJECT.KEYS.PRIMARY.KEY2) OBJECT.KEYS.PRIMARY.PRESSED = true;
            if (e.code === OBJECT.KEYS.SECONDARY.KEY || e.code === OBJECT.KEYS.SECONDARY.KEY2) OBJECT.KEYS.SECONDARY.PRESSED = true;
            if (e.code === OBJECT.KEYS.FOOD.KEY || e.code === OBJECT.KEYS.FOOD.KEY2) OBJECT.KEYS.FOOD.PRESSED = true;
            if (e.code === OBJECT.KEYS.SPIKE.KEY || e.code === OBJECT.KEYS.SPIKE.KEY2) OBJECT.KEYS.SPIKE.PRESSED = true;
            if (e.code === OBJECT.KEYS.TRAP.KEY || e.code === OBJECT.KEYS.TRAP.KEY2) OBJECT.KEYS.TRAP.PRESSED = true;
            if (e.code === OBJECT.KEYS.SPACE.KEY && !e.repeat) {
                OBJECT.KEYS.SPACE.PRESSED = true;
                UPDATE.CPS();
            }

            if (e.code === OBJECT.KEYS.SHOP.KEY && isAVAILABLE()) OBJECT.KEYS.SHOP.PRESSED = true;

            if (e.code === OBJECT.KEYS.LOCK.KEY && isAVAILABLE() && !e.repeat) OBJECT.KEYS.LOCK.PRESSED = !OBJECT.KEYS.LOCK.PRESSED;

            if (e.code === OBJECT.KEYS.AUTOHIT.KEY && isAVAILABLE() && !e.repeat) OBJECT.KEYS.AUTOHIT.PRESSED = !OBJECT.KEYS.AUTOHIT.PRESSED;

            const play = document.getElementById("play");
            play.onclick = () =>{
                OBJECT.KEYS.AUTOHIT.PRESSED = false;
            }
        },
        UP(e) {
            if (e.code === OBJECT.KEYS.PRIMARY.KEY || e.code === OBJECT.KEYS.PRIMARY.KEY2) OBJECT.KEYS.PRIMARY.PRESSED = false;
            if (e.code === OBJECT.KEYS.SECONDARY.KEY || e.code === OBJECT.KEYS.SECONDARY.KEY2) OBJECT.KEYS.SECONDARY.PRESSED = false;
            if (e.code === OBJECT.KEYS.FOOD.KEY || e.code === OBJECT.KEYS.FOOD.KEY2) OBJECT.KEYS.FOOD.PRESSED = false;
            if (e.code === OBJECT.KEYS.SPIKE.KEY || e.code === OBJECT.KEYS.SPIKE.KEY2) OBJECT.KEYS.SPIKE.PRESSED = false;
            if (e.code === OBJECT.KEYS.TRAP.KEY || e.code === OBJECT.KEYS.TRAP.KEY2) OBJECT.KEYS.TRAP.PRESSED = false;
            if (e.code === OBJECT.KEYS.SPACE.KEY) OBJECT.KEYS.SPACE.PRESSED = false;
            if (e.code === OBJECT.KEYS.SHOP.KEY) OBJECT.KEYS.SHOP.PRESSED = false;
        }
    },
    BUTTONS: {
        DOWN(e) {
            if (e.button === OBJECT.BUTTONS.LEFT.BUTTON) OBJECT.BUTTONS.LEFT.PRESSED = true;
            if (e.button === OBJECT.BUTTONS.MIDDLE.BUTTON) OBJECT.BUTTONS.MIDDLE.PRESSED = true;
            if (e.button === OBJECT.BUTTONS.RIGHT.BUTTON) OBJECT.BUTTONS.RIGHT.PRESSED = true;
            if (e.button === OBJECT.BUTTONS.XBUTTON1.BUTTON) OBJECT.BUTTONS.XBUTTON1.PRESSED = true;
            if (e.button === OBJECT.BUTTONS.XBUTTON2.BUTTON) OBJECT.BUTTONS.XBUTTON2.PRESSED = true;
            UPDATE.CPS();
        },
        UP(e) {
            if (e.button === OBJECT.BUTTONS.LEFT.BUTTON) OBJECT.BUTTONS.LEFT.PRESSED = false;
            if (e.button === OBJECT.BUTTONS.MIDDLE.BUTTON) OBJECT.BUTTONS.MIDDLE.PRESSED = false;
            if (e.button === OBJECT.BUTTONS.RIGHT.BUTTON) OBJECT.BUTTONS.RIGHT.PRESSED = false;
            if (e.button === OBJECT.BUTTONS.XBUTTON1.BUTTON) OBJECT.BUTTONS.XBUTTON1.PRESSED = false;
            if (e.button === OBJECT.BUTTONS.XBUTTON2.BUTTON) OBJECT.BUTTONS.XBUTTON2.PRESSED = false;
        }
    },
    CPS() {
        DATA.CPS++;
        if (DATA.CPS > DATA.MAXCPS) DATA.MAXCPS = DATA.CPS;
        setTimeout(() => DATA.CPS--, 1000);
    },
    VISUALS() {
        const COLOR = "#D0D0D0";
        document.getElementById("primary").style.backgroundColor = OBJECT.KEYS.PRIMARY.PRESSED ? COLOR : "";
        document.getElementById("secondary").style.backgroundColor = OBJECT.KEYS.SECONDARY.PRESSED ? COLOR : "";
        document.getElementById("food").style.backgroundColor = OBJECT.KEYS.FOOD.PRESSED ? COLOR : "";
        document.getElementById("spike").style.backgroundColor = OBJECT.KEYS.SPIKE.PRESSED ? COLOR : "";
        document.getElementById("trap").style.backgroundColor = OBJECT.KEYS.TRAP.PRESSED ? COLOR : "";
        document.getElementById("autohit").style.backgroundColor = OBJECT.KEYS.AUTOHIT.PRESSED ? COLOR : "";
        document.getElementById("lockdir").style.backgroundColor = OBJECT.KEYS.LOCK.PRESSED ? COLOR : "";
        document.getElementById("shop_").style.backgroundColor = OBJECT.KEYS.SHOP.PRESSED ? COLOR : "";
        document.getElementById("spacebar").style.backgroundColor = OBJECT.KEYS.SPACE.PRESSED ? COLOR : "";
        document.getElementById("left-click").style.backgroundColor = OBJECT.BUTTONS.LEFT.PRESSED ? COLOR : "";
        document.getElementById("right-click").style.backgroundColor = OBJECT.BUTTONS.RIGHT.PRESSED ? COLOR : "";
        if (DATA.ShowXBUTTONS) {
            document.getElementById("xbutton1").style.backgroundColor = OBJECT.BUTTONS.XBUTTON1.PRESSED ? COLOR : "";
            document.getElementById("xbutton2").style.backgroundColor = OBJECT.BUTTONS.XBUTTON2.PRESSED ? COLOR : "";
        } else {
            const X1 = document.getElementById("xbutton1");
            const X2 = document.getElementById("xbutton2");
            if (X1) X1.style.display = "none";
            if (X2) X2.style.display = "none";
        }

        document.getElementById("cps").textContent = `CPS: ${DATA.CPS}`;
        document.getElementById("maxcps").textContent = `MCPS: ${DATA.MAXCPS}`;
        requestAnimationFrame(UPDATE.VISUALS);
    },
    CURSOR(e) {
        const canvas = document.querySelector("canvas");
        const map = document.getElementById("cursormap");
        const cursorDot = document.getElementById("cursorDot");
        const hatMenu = document.getElementById("hat-menu");

        if (!canvas || !map || !cursorDot) return;

        const { clientX, clientY } = e;
        const canvasRect = canvas.getBoundingClientRect();
        const MAP_WIDTH = map.clientWidth;
        const MAP_HEIGHT = map.clientHeight;

        const InCANVAS = (
            clientX >= canvasRect.left &&
            clientX <= canvasRect.right &&
            clientY >= canvasRect.top &&
            clientY <= canvasRect.bottom
        );

        if (InCANVAS) {
            const CURSOR_X = (clientX - canvasRect.left) / canvasRect.width;
            const CURSOR_Y = (clientY - canvasRect.top) / canvasRect.height;

            OBJECT.CURSOR.x = CURSOR_X;
            OBJECT.CURSOR.y = CURSOR_Y;

            cursorDot.style.left = `${CURSOR_X * MAP_WIDTH - 3}px`;
            cursorDot.style.top = `${CURSOR_Y * MAP_HEIGHT - 3}px`;
            cursorDot.style.display = "block";
        } else {
            cursorDot.style.display = "none";
        }

        if (hatMenu) {
            const hatRect = hatMenu.getBoundingClientRect();
            const overHatMenu = (
                clientX >= hatRect.left &&
                clientX <= hatRect.right &&
                clientY >= hatRect.top &&
                clientY <= hatRect.bottom
            );

            cursorDot.style.backgroundColor = overHatMenu ? "red" : "lime";
        }

    },
    KEYBINDS() {
        SHOP = document.getElementById('for-shop')?.textContent || "KeyN";
        FOOD = document.getElementById('for-food')?.textContent || "KeyQ";
        SPIKE = document.getElementById('for-spike')?.textContent || "KeyR";
        TRAP = document.getElementById('for-trap')?.textContent || "KeyF";
        OBJECT.KEYS.SHOP.KEY = SHOP;
        OBJECT.KEYS.FOOD.KEY = FOOD;
        OBJECT.KEYS.SPIKE.KEY = SPIKE;
        OBJECT.KEYS.TRAP.KEY = TRAP;
    },
    SUBMIT() {
        UPDATE.KEYBINDS();
        setInterval(UPDATE.KEYBINDS, 100);
    }
};

const MENU = () => {
    const menuHTML = `
    <div id="menu">
    <div class="menurow">
    <div class="menuitem" id="primary">Primary</div>
    <div class="menuitem" id="secondary">Secondary</div>
    </div>
    <div class="menurow">
    <div class="menuitem" id="food">Food</div>
    <div class="menuitem" id="spike">Spike</div>
    <div class="menuitem" id="trap">Trap</div>
    </div>
    <div class="menurow">
    <div class="menuitem" id="autohit">Auto Hit</div>
    <div class="menuitem" id="shop_">Shop</div>
    <div class="menuitem" id="lockdir">Lock Dir</div>
    </div>
    <div class="menurow">
    <div class="menuitem mouse-button" id="left-click">LEFT</div>
    <div class="menuitem mouse-button" id="right-click">RIGHT</div>
    </div>
    <div class="menurow">
    <div class="menuitem mouse-button" id="xbutton1">XBUTTON 1</div>
    <div class="menuitem mouse-button" id="xbutton2">XBUTTON 2</div>
    </div>
    <div class="menurow">
    <div class="menuitem spacebar" id="spacebar">Spacebar</div>
    </div>
    <div class="menurow">
    <div class="menuitem cps" id="cps">CPS: 0</div>
    <div class="menuitem maxcps" id="maxcps">MCPS: 0</div>
    </div>
    <div id="cursormap">
    <div id="cursorDot"></div>
    </div>
    </div>
    `;

    const menuStyle =`
    #menu {
    position: fixed;
    top: 20px;
    left: 20px;
    color: #fff;
    padding: 10px 15px;
    border-radius: 8px;
    z-index: 1000;
    font-family: Arial, sans-serif;
    font-size: 14px;
    pointer-events: none;
    width: 220px;
    }
    .menurow {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    }
    .menuitem {
    flex: 1;
    text-align: center;
    padding: 8px;
    background-color: rgba(255, 255, 255, 0.05); /* lighter transparent background */
    border-radius: 5px;
    margin: 0 4px;
    }
    .spacebar {
    width: 100%;
    background-color: rgba(255, 255, 255, 0.05);
    }
    .cps, .maxcps {
    width: 50%;
    margin: 0 4px;
    }
    .mouse-button {
    width: 48%;
    margin: 0 4px;
    }
    #cursormap {
    margin: 10px auto 0 auto;
    width: 180px;
    height: 180px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    background-color: rgba(255, 255, 255, 0.03);
    border-radius: 8px;
    position: relative;
    pointer-events: none;
    }
    #cursorDot {
    position: absolute;
    width: 8px;
    height: 8px;
    background-color: lime;
    border-radius: 50%;
    display: none;
    pointer-events: none;
    transform: translate(-50%, -50%);
    }`;

    document.body.insertAdjacentHTML('beforeend', menuHTML);
    const style = document.createElement('style');
    style.textContent = menuStyle;
    document.head.appendChild(style);
    UPDATE.VISUALS();
    UPDATE.SUBMIT();
};

document.addEventListener("keydown", UPDATE.KEYS.DOWN);
document.addEventListener("keyup", UPDATE.KEYS.UP);
document.addEventListener("mousedown", UPDATE.BUTTONS.DOWN);
document.addEventListener("mouseup", UPDATE.BUTTONS.UP);
document.addEventListener("mousemove", UPDATE.CURSOR);

MENU();
