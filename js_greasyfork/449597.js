// ==UserScript==
// @name         Melvor Idle - Better View My Runes
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  This makes the "View My Runes" in the combat tab prettier to the eyes.
// @author       Jessy#3869
// @match		 https://*.melvoridle.com/*
// @exclude		 https://wiki.melvoridle.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=melvoridle.com
// @noframes
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/449597/Melvor%20Idle%20-%20Better%20View%20My%20Runes.user.js
// @updateURL https://update.greasyfork.org/scripts/449597/Melvor%20Idle%20-%20Better%20View%20My%20Runes.meta.js
// ==/UserScript==



((main) => {
    var script = document.createElement('script');
    script.textContent = `try { (${main})(); } catch (e) { console.log(e); }`;
    document.body.appendChild(script).parentNode.removeChild(script);
})(() => {
    'use strict';

    function betterVMR() {
        let removestyles = `$("#combat-rune-count-container > div:not(.border-success)").removeAttr("style").children().removeAttr("style").find("small").removeAttr("style");`
        let addstyles = `$("#combat-rune-count-container div.border").removeClass("border").attr("style", "padding: 2px 14px").children().attr("style", "background-color:#3e4856 !important; border:solid 2px #7e8999 !important; border-radius: 5px;").find("small").removeClass("text-combat-smoke").attr("style", "color:#30c78d !important;");`
        $("#combat-rune-count-container div.border").removeClass("border").attr("style", "padding: 2px 14px").children().attr("style", "background-color:#3e4856 !important; border:solid 2px #7e8999 !important; border-radius: 5px;").find("small").removeClass("text-combat-smoke").attr("style", "color:#30c78d !important;");
        $("#combat-menu-item-3").attr("onclick", `(() => {${removestyles} ${addstyles} changeCombatMenu(3)})();`);
    }

    function loadScript() {
        if (typeof confirmedLoaded !== 'undefined' && confirmedLoaded) {
            clearInterval(interval);
            console.log('[JessyMods] Loading "Better View My Runes" Script.');
            betterVMR();
        }
    }

    const interval = setInterval(loadScript, 500);
});