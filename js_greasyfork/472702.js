// ==UserScript==
// @name Bonk.io Anti Freeze
// @version      0.1
// @description  Prevents bonk.io from freezing
// @author       UrsoTriangular
// @match        https://bonk.io/gameframe-release.html
// @run-at       document-start
// @grant        none
// @namespace https://greasyfork.org/users/984927
// @downloadURL https://update.greasyfork.org/scripts/472702/Bonkio%20Anti%20Freeze.user.js
// @updateURL https://update.greasyfork.org/scripts/472702/Bonkio%20Anti%20Freeze.meta.js
// ==/UserScript==

const maximumTimeInsideLoop = 40;

function inject(code) {
    // Variable name followed by [index]
    const VAR = '[$A-Za-z][\\w$_]{1,5}\\[\\d+\\]';

    let replaced = false;

    // The loop we need to match is luckily the first one in the code, this migth change in a future update
    code = code.replace(new RegExp(`(${VAR});${VAR}=30;while\\(${VAR} > 1000 \/ ${VAR}\\)\\{`), function(whole, lastTime) {
        replaced = true;
        return `${whole}if (Date.now() - ${lastTime} > ${maximumTimeInsideLoop}) break;`;
    });

    if (!replaced) {
        throw new Error("Repĺace failed");
    }

    return code;
}



if (!window.bonkCodeInjectors) window.bonkCodeInjectors = [];

window.bonkCodeInjectors.push(function AntiFreeze(code) {
    try {
        code = inject(code);
        console.log("[Anti Freeze] Injector run");
    }
    catch (e) {
        console.error("[Anti Freeze] Injector error:", e);
    }

    return code;
});