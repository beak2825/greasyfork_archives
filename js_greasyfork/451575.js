// ==UserScript==
// @name         Auto Spawn V2
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  diep.io
// @author       Tariteur
// @match        https://diep.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=diep.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451575/Auto%20Spawn%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/451575/Auto%20Spawn%20V2.meta.js
// ==/UserScript==

function Spawn(name) {
		input.execute('game_spawn ' + name);
	}

    let AR = false;
    function autoRespawn() {
        if (AR) {
        Spawn(localStorage.name)
        }
    }
    setInterval(autoRespawn, 0);
document.addEventListener("keydown", (yes) => {
        if (yes.keyCode === 84) {
            AR = !AR;
            Hook.recv(new Uint8Array([3, ...new TextEncoder().encode(`Auto Spawn: ${AR ? 'Activated' : 'Deactivated'}`), 0, ...new Uint8Array(new Uint32Array([0x0500ff]).buffer), ...new Uint8Array(new Float32Array([2000]).buffer), 0]))
    }
});