// ==UserScript==
// @name         Surviv.io Respawm 
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  press "p" to respawm the match
// @author       notKaiAnderson
// @match        *://surviv.io/*
// @match        *://surviv2.io/*
// @match        *://2dbattleroyale.com/*
// @match        *://2dbattleroyale.org/*
// @match        *://piearesquared.info/*
// @match        *://thecircleisclosing.com/*
// @match        *://archimedesofsyracuse.info/*
// @match        *://secantsecant.com/*
// @match        *://parmainitiative.com/*
// @match        *://nevelskoygroup.com/*
// @match        *://kugahi.com/*
// @match        *://chandlertallowmd.com/*
// @match        *://ot38.club/*
// @match        *://kugaheavyindustry.com/*
// @match        *://drchandlertallow.com/*
// @match        *://rarepotato.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448744/Survivio%20Respawm.user.js
// @updateURL https://update.greasyfork.org/scripts/448744/Survivio%20Respawm.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let cycle = (x) => (x == false) ? undefined : x == undefined;
    let cycle2 = (x, y, z) => x == y ? z : y;
    const keys = ["p"];
    const disableKey = key => keys.push(key);
    ["keypress", "keydown", "keyup"].forEach(type => {
        document.addEventListener(type, e => {
            if (keys.indexOf(e.key) !== -1) {
                if (e.type == "keydown") {
                    if (e.key == "p") {
document.getElementById('btn-game-quit').click()
setTimeout(document.getElementById('btn-start-battle').click(), 50)
                }
                }
                return e.preventDefault();
            }
        });
    });
})();