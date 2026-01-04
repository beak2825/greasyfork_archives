// ==UserScript==
// @name         WINDOW_LOCKED_HUD
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  Locks the current browser window with a password-protected overlay. Press Ctrl + . to activate. If no password is set, you’ll be prompted to create one.
// @author       You
// @match        *://*/*
// @grant        none
// @license		 MIT
// @icon		 https://raw.githubusercontent.com/aket0r/window-locked-hud/main/windows-hud-locker-icon.png
// @downloadURL https://update.greasyfork.org/scripts/541961/WINDOW_LOCKED_HUD.user.js
// @updateURL https://update.greasyfork.org/scripts/541961/WINDOW_LOCKED_HUD.meta.js
// ==/UserScript==

let pswd = localStorage.getItem("LOCKED_WINDOW_HUD_PSWD");
let started = false;
let title = document.title;

function resetStorage() {
    localStorage.removeItem("LOCKED_WINDOW_HUD_PSWD");
    location.reload();
}
// resetStorage();


function custom() {
    const elements = document.querySelectorAll("*");
    elements.forEach(el => {
        if(el.style.zIndex != undefined && el.id != "window-locked-hud") {
            el.style.zIndex = "auto";
        }
    })
}

function createWindow() {
    if(started == true) return;
    started = true;
    if(pswd == null) {
		const newPasswd = prompt("Create new password");
        localStorage.setItem('LOCKED_WINDOW_HUD_PSWD', newPasswd || "admin");
    }

    pswd = localStorage.getItem("LOCKED_WINDOW_HUD_PSWD");

    let el = document.createElement("div");
    el.id = "window-locked-hud";
    el.innerHTML =
        `
            <h1 id="locked-window-title">This window is locked by the administrator</h1>
            <div>
                <input id="unlock-window-value" type="password" value="" placeholder="password" autocomplete="off">
            </div>
        `
    let style = document.createElement("style");
    style.innerHTML =
        `
        #window-locked-hud {
                position: fixed;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background: #000000d4;
                backdrop-filter: blur(30px);
                z-index: 2147483647;
                display: none;
                justify-content: center;
                align-items: center;
                flex-direction: column;
        }

        #window-locked-hud h1 {
                font-weight: 100;
                color: #fff;
                margin-bottom: 2rem;
                font-size: 36px;
                user-select: none;
                text-transform: uppercase;
        }

        #window-locked-hud input {
                padding: 10px 15px;
                outline: none;
                color: #fff;
                border: 1px solid #ddd;
                font-size: 24px;
                background: transparent;
        }
        `
    document.body.prepend(el);
    document.body.prepend(style);
    if(localStorage.getItem('LOCKED_WINDOW_HUD_PSWD_STATUS') == null) {
        localStorage.setItem('LOCKED_WINDOW_HUD_PSWD_STATUS', "false");
    }
    const mainInput = document.querySelector("#unlock-window-value");
    const lockedWindowHud = document.querySelector("#window-locked-hud");
    mainInput.addEventListener("keyup", function(e) {
        if(e.key != 'Enter') return;
        if(mainInput.value == pswd) {
            localStorage.setItem('LOCKED_WINDOW_HUD_PSWD_STATUS', "false");
            const video = document.querySelectorAll("video");
            const audio = document.querySelectorAll("audio");
            lockedWindowHud.style.display = "none";
            mainInput.value = "";
            document.title = title;
            if(audio != null) {
                audio.forEach(x => {
                    x.volume = 0;
                })
            }
            if(video != null) {
                video.forEach(x => {
                    x.volume = 0;
                })
            }
        }
    })
}
createWindow();

window.addEventListener("keyup", (e) => {
    const lockedWindowHud = document.querySelector("#window-locked-hud");
    const mainInput = document.querySelector("#unlock-window-value");
    const video = document.querySelectorAll("video");
    const audio = document.querySelectorAll("audio");

    // LOCK
    if(e.ctrlKey == true && e.key == ".") {
        custom();
        document.title = "*********";
        localStorage.setItem('LOCKED_WINDOW_HUD_PSWD_STATUS', "true");
        lockedWindowHud.style.display = "flex";
        if(audio != null) {
            audio.forEach(x => {
                x.volume = 0;
            })
        }
        if(video != null) {
            video.forEach(x => {
                x.volume = 0;
            })
        }
        mainInput.focus();
    }
});

window.addEventListener("load", function() {
    let winStatus = localStorage.getItem('LOCKED_WINDOW_HUD_PSWD_STATUS', "true");
    const mainInput = document.querySelector("#unlock-window-value");
    if(winStatus == "true") {
        const lockedWindowHud = document.querySelector("#window-locked-hud");
        lockedWindowHud.style.display = "flex";
        mainInput.focus();
        document.title = "*********";
        custom();
    }
})
