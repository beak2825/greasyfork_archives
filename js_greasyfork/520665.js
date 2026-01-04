// ==UserScript==
// @name         Tri-Flank Diep.io
// @version      1.0
// @description  Tri-Flank press Q to enable/disable. Timings may be slower but idc
// @author       Comma
// @match        https://diep.io/*
// @namespace https://greasyfork.org/users/1362941
// @downloadURL https://update.greasyfork.org/scripts/520665/Tri-Flank%20Diepio.user.js
// @updateURL https://update.greasyfork.org/scripts/520665/Tri-Flank%20Diepio.meta.js
// ==/UserScript==

let _window = typeof unsafeWindow === 'undefined' ? window : unsafeWindow;
const RAW_MAPPING = ["KeyA", "KeyB", "KeyC", "KeyD", "KeyE", "KeyF", "KeyG", "KeyH", "KeyI", "KeyJ", "KeyK", "KeyL", "KeyM", "KeyN", "KeyO", "KeyP", "KeyQ", "KeyR", "KeyS", "KeyT", "KeyU", "KeyV", "KeyW", "KeyX", "KeyY", "KeyZ", "ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight", "Tab", "Enter", "NumpadEnter", "ShiftLeft", "ShiftRight", "Space", "Numpad0", "Numpad1", "Numpad2", "Numpad3", "Numpad4", "Numpad5", "Numpad6", "Numpad7", "Numpad8", "Numpad9", "Digit0", "Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7", "Digit8", "Digit9", "F2", "End", "Home", "Semicolon", "Comma", "NumpadComma", "Period", "Backslash"];

function key_down(keyString) {
    const index = RAW_MAPPING.indexOf(keyString);
    if (index === -1) return console.error(`Invalid key string: ${keyString}`);
    input.onKeyDown(index + 1);
}

function key_up(keyString) {
    const index = RAW_MAPPING.indexOf(keyString);
    if (index === -1) return console.error(`Invalid key string: ${keyString}`);
    input.onKeyUp(index + 1);
}

let isRunning = false;
const spawnButton = document.getElementById('spawn-button');
spawnButton.onclick = function() {
};

if (!CanvasRenderingContext2D.prototype._isProxied) {
    CanvasRenderingContext2D.prototype.fillText = new Proxy(CanvasRenderingContext2D.prototype.fillText, {
        apply(fillText, ctx, [text, x, y, ...rest]) {
            if (isRunning) {
                if (text.startsWith("Lvl 45 Flank Guard")) {

                    setTimeout(() => {
                        _window.extern.onTouchStart(0, 55, 67, 0);

                        _window.extern.onTouchEnd(0, 55, 67, 0);
                        console.log("Tri Clicked");
}, 340); //Change timings here
                }
                if (text.startsWith("Lvl 45 Tri-Angle")) {

                    setTimeout(() => {
                        key_down("Backslash");
                        key_up("Backslash");
                        console.log(`/`);
                    }, 450);//Change timings here
                }
            }

            return fillText.call(ctx, text, x, y, ...rest);
        }
    });
    CanvasRenderingContext2D.prototype._isProxied = true;
}

document.addEventListener("keydown", (event) => {
    if (event.key === "q" || event.key === "Q") {
        isRunning = !isRunning;
        console.log(`Timings are now ${isRunning ? "ON" : "OFF"}`);
    }
});
