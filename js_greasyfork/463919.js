
// ==UserScript==
// @name         RogueCheats Anti-Anti-Adblock
// @version      1.1
// @license      MIT
// @description  Blocks the annoying popup on RogueCheats asking you to turn off your adblock
// @author       https://github.com/mov-ebx
// @match        https://*.rogue.best/*
// @match        https://*.math-for-the.win/*
// @grant        none
// @namespace    https://greasyfork.org/users/1059581
// @downloadURL https://update.greasyfork.org/scripts/463919/RogueCheats%20Anti-Anti-Adblock.user.js
// @updateURL https://update.greasyfork.org/scripts/463919/RogueCheats%20Anti-Anti-Adblock.meta.js
// ==/UserScript==

const ANTIAB_URLS = ["https://www.cdn4ads.com/waterfall.min.js", "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5077578545800134"];

async function antiantiAb() {
    let isEnabled = false;
    for (const url of ANTIAB_URLS) {
        try {
            await fetch(new Request(url)).catch((_)=>(isEnabled = true));
        } catch {
            isEnabled = true;
        } finally {
            if (isEnabled) {
                Swal.close()
            }
        }
    }
}

window.addEventListener("load", antiantiAb);
