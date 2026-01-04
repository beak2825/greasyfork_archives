// ==UserScript==
// @name         Melvor Idle Astrology Highlight 5% Rolls
// @namespace    http://tampermonkey.net/
// @version      1.2.2
// @description  If like me you are tired of straining your eyes to find 5% rolls when rerolling all modifiers in Astrology, this script will change the text of your modifier if it rolls a 5%
// @author       Chrono
// @match        https://*.melvoridle.com/*
// @exclude		https://wiki.melvoridle.com*
// @icon         https://www.google.com/s2/favicons?domain=melvoridle.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/435827/Melvor%20Idle%20Astrology%20Highlight%205%25%20Rolls.user.js
// @updateURL https://update.greasyfork.org/scripts/435827/Melvor%20Idle%20Astrology%20Highlight%205%25%20Rolls.meta.js
// ==/UserScript==

function script() {

    var standard_modifiers_collection = document.getElementsByClassName("block block-rounded-double bg-combat-inner-dark p-1 mb-0 border-top border-1x border-info text-left");
    var unique_modifiers_collection = document.getElementsByClassName("block block-rounded-double bg-combat-inner-dark p-1 mb-0 border-top border-1x border-warning text-left");

    function CheckStandardModifiers()
    {
        var i;
        for (i=0; i < 3; i++)
        {
            var standard_modifier = standard_modifiers_collection[i].children[0].children[0];
            if (standard_modifier.innerText.indexOf("5") !== -1)
            {
                standard_modifier.className = "text-warning";
            }
            else
            {
                standard_modifier.className = "text-success";
            }
        }
    }

    function CheckUniqueModifiers()
    {
        var i;
        for (i=0; i < 3; i++)
        {
            var unique_modifier = unique_modifiers_collection[i].children[0].children[0];
            if (unique_modifier.innerText.indexOf("5") !== -1)
            {
                unique_modifier.className = "text-warning";
            }
            else
            {
                unique_modifier.className = "text-success";
            }
        }
    }


    // Store a reference to the game's function
    _rerollAstrologyModifiers = rerollAstrologyModifiers
    // Overwrite the game's function
    rerollAstrologyModifiers = (id, type="standard", confirmed=true, bypass=false) =>{
        _rerollAstrologyModifiers(id, type, confirmed, bypass)

        try {
            CheckStandardModifiers()
            CheckUniqueModifiers()
        } catch (e) {
            console.error(e);
        }
    }


    // Store a reference to the game's function
    _createAstrologySelectedUI = createAstrologySelectedUI
    // Overwrite the game's function
    createAstrologySelectedUI = (id) =>{
        _createAstrologySelectedUI(id)
        try {
            CheckStandardModifiers()
            CheckUniqueModifiers()
        } catch (e) {
            console.error(e);
        }
    }

    // Store a reference to the game's function
    _rerollSpecificAstrologyModifier = rerollSpecificAstrologyModifier
    // Overwrite the game's function
    rerollSpecificAstrologyModifier = (id, i, applySingleCost=false, confirmed=true, bypass=false) =>{
        _rerollSpecificAstrologyModifier(id,i,applySingleCost,confirmed,bypass)
        try {
            CheckStandardModifiers()
            CheckUniqueModifiers()
        } catch (e) {
            console.error(e);
        }
    }
}


(function () {
    function injectScript(main) {
        const scriptElement = document.createElement('script');
        scriptElement.textContent = `try {(${main})();} catch (e) {console.log(e);}`;
        document.body.appendChild(scriptElement).parentNode.removeChild(scriptElement);
    }

    function loadScript() {
        if ((window.isLoaded && !window.currentlyCatchingUp)
            || (typeof unsafeWindow !== 'undefined' && unsafeWindow.isLoaded && !unsafeWindow.currentlyCatchingUp)) {
            // Only load script after game has opened
            clearInterval(scriptLoader);
            injectScript(script);
        }
    }
    const scriptLoader = setInterval(loadScript, 200);
})();