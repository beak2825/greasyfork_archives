// ==UserScript==
// @name         YNO game popout
// @namespace    https://kutt.it/meqa
// @version      0.8
// @description  adds a pop out button to any yno game
// @author       meqativ
// @match        https://ynoproject.net/*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ynoproject.net
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/486385/YNO%20game%20popout.user.js
// @updateURL https://update.greasyfork.org/scripts/486385/YNO%20game%20popout.meta.js
// ==/UserScript==
function getElsFromString(html) {
    const temp = document.createElement("div");
    temp.innerHTML = html;
    const out = temp.children;
    delete temp;
    return out
}
const [filler, btn] = getElsFromString(`<div id="_filler">
                                            <p style="color: #fff; height: min-content;">Popped out<br/>(press this or close the window to pop back in)</p>
                                        </div>
                                        <button id="popoutButton" class="iconButton">
                                            <svg fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 18 18">
                                                <path d="M-4,2.5 v13 h18 v-13 h-18 z M1,7 l3.5,3.5 m-3.5,0 l3.5,0 m0,-3.5 l0,3.5"></path>
                                                <path style="fill:var(--svg-base-gradient);" d="M6.5,12.5 v5.2 h9 v-5.2 h-9 z"></path>
                                            </svg>
                                        </button>`)
filler.style = `background-color: rgba(0, 0, 0, 0.15);
                display: flex;
                aspect-ratio: 320/240;
                width: 100%;
                backdrop-filter: blur(4px);
                justify-content: center;
                align-items: center;
                border: 2px solid black;`;
function exec(rerun) {
    console.log("hiii!!!!!")
    const controlsFullscreen = document.getElementById("controls-fullscreen");
    if (!controlsFullscreen) throw `Not a game idk`
    const rightControls = controlsFullscreen.parentNode;
    if (!document.getElementById('popoutButton')) {
        rightControls.insertBefore(btn, controlsFullscreen)
    } else {
        let btn_old = document.getElementById('popoutButton');
        btn_old.parentNode.replaceChild(btn, btn_old);
    }
    btn.addEventListener("click", run);

    let tooltipped = false; // stupid because addTooltip isn't defined yet
    function tool_tip() {
        if (tooltipped) {
            btn.removeEventListener("focus", tool_tip);
            btn.removeEventListener("mouseover", tool_tip);
            return;
        }
        tooltipped = true;
        addTooltip(btn, "Pop out", true, true)

    }
    btn.addEventListener("focus", tool_tip);
    btn.addEventListener("mouseover", tool_tip);
    function run() {
        const player = document.querySelector("#canvas");
        let _filler = document.querySelector("#canvasContainer #_filler");
        if (!player && _filler) return _filler.click();
        btn.removeEventListener("click", run);
        btn.style.setProperty("display", "none");
        let current = player;
        const originalGetElementById = document.getElementById;

        document.getElementById = function() {
            if (arguments[0] === "canvas") return current;
            return originalGetElementById.call(document, ...arguments);
        };


        const pos = player.getBoundingClientRect();
        const ctx = open("", window.location.href, `popup,innerHeight=${pos.height},innerWidth=${pos.width},screenX=${pos.x+window.screenX},screenY=${pos.y+window.screenY}`);
        if (ctx) {
            ctx.document.head.innerHTML = `<style> * {
    margin: 0;
    padding: 0;
}
:root {
    background-color: #000;
}

#canvas {
  display: block;
  object-fit: contain;
  min-width: 0px;
  min-height: 0px;
  aspect-ratio: 320 / 240;
  height: 100%;
  width: 100%;
  image-rendering: pixelated;
} </style>`;
            const title = document.createElement("title");
            title.innerHTML = `Loading... - ${window.location.pathname}`;
            ctx.document.head.appendChild(title);

            const connStatusText = document.querySelector("#connStatusText")
            const locationDisplayLabel = document.querySelector("#locationDisplayLabel");
            const currentTitle = {
                game: window.location.pathname.split("/")[1],
                location: locationDisplayLabel.innerHTML,
                connectionStatus: connStatusText.innerHTML,
            }
            function updateTitle() {
                const { location, game, connectionStatus } = currentTitle;
                title.innerText = [
                    (connectionStatus === "Connected") ? undefined : connectionStatus,
                    location,
                    game
                ].filter(Boolean).join(" | ");
            }

            updateTitle();
            const observer = new MutationObserver((mutations, observer) => {
                for (const mutation of mutations) {
                    if (mutation.target === connStatusText) currentTitle.connectionStatus = mutation.addedNodes?.[0]?.data;
                    else if (mutation.target === locationDisplayLabel) currentTitle.location = mutation.addedNodes?.[0]?.data;
                    updateTitle();
                }
            });
            observer.observe(locationDisplayLabel, { childList: true });
            observer.observe(connStatusText, { childList: true });

            const parent = player.parentNode;
            parent.removeChild(player);
            parent.appendChild(filler);

            current = filler;
            let poppedin = false;
            function popin(closing) {
                if (closing) {
                    window.removeEventListener("beforeunload", popin)
                    btn.addEventListener("click", run);
                    btn.style.setProperty("display", "");
                }
                if (!poppedin){
                    clearInterval(currentTitle.intervalId)
                    filler.removeEventListener("click", popin);
                    parent.removeChild(filler);
                    player.parentNode.removeChild(player);
                    parent.appendChild(player);
                    current = player;
                    poppedin = true
                    return ctx.close();
                }
            }
            filler.addEventListener("click", popin);
            window.addEventListener("beforeunload", popin)
            ctx.addEventListener("beforeunload", () => popin(true))
            ctx.document.body.appendChild(player);
        } else { alert("Allow popups!!"); }
    }
    if (rerun === true) console.info("reloaded")
}
GM_registerMenuCommand('reload', () => exec(true))
exec()
