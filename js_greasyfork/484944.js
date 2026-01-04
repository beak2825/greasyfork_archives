// ==UserScript==
// @name        Bypass acortalink.me
// @namespace   Violentmonkey Scripts
// @match       *://acortalink.me/*
// @grant       none
// @version     2.1
// @author      Rust1667
// @description Bypass acortalink.me link shortener
// @run-at     document-start
// @downloadURL https://update.greasyfork.org/scripts/484944/Bypass%20acortalinkme.user.js
// @updateURL https://update.greasyfork.org/scripts/484944/Bypass%20acortalinkme.meta.js
// ==/UserScript==

function bypassAcortaLink() {
    let acorta = setInterval(() => {
        let script = document.querySelector('body > script');
        if (script) {
            let text = script.text.trim();
            let lines = text.split('\n');
            let i = lines.findIndex(x => x.includes('acortalink.me'));
            let link = lines[i + 2]?.trim().split(',')[6]?.trim();

            if (link && window[link]) {
                clearInterval(acorta);

                // Redirect to the link
                window.location.href = window[link];

                //Open alert if it is a magnet link
                if (window[link].startsWith("magnet:?")) {
                  alert(window[link]);
                }
            }
        }
    }, 100);
}

bypassAcortaLink();
