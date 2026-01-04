// ==UserScript==
// @name         AWBW Change army direction
// @namespace    https://awbw.amarriner.com/
// @version      1.11
// @description  Swap the direction of a player's army by clicking the arrow icon in the army selector.
// @author       Truniht
// @match        https://awbw.amarriner.com/*?games_id=*
// @match        https://awbw.amarriner.com/*?replays_id=*
// @icon         https://awbw.amarriner.com/favicon.ico
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517608/AWBW%20Change%20army%20direction.user.js
// @updateURL https://update.greasyfork.org/scripts/517608/AWBW%20Change%20army%20direction.meta.js
// ==/UserScript==

(function() {
    //Fetch settings
    var gameID = window.location.href.match(/_id=([0-9]+)/)[1];
    var settings = GM_getValue('AWBWMirrorSettings' + gameID) || {};

    //Have to use a function to get the local variable as it can't be accessed directly
    unsafeWindow.AWBWMirrorReturnPlayers = function () {return playersUnits;}

    function saveSettings() {
        GM_setValue('AWBWMirrorSettings' + gameID, settings);
    }

    var swapInProgress = false;
    function swapColours(force, removeID) {
        if (swapInProgress && !force) return;
        swapInProgress = true;
        try {
            var playersUnits = unsafeWindow.AWBWMirrorReturnPlayers();
            for(var playerID in playersUnits) {
                if (settings[playerID] || removeID) {
                    for(var unitID in playersUnits[playerID]) {
                        var unitImage = document.querySelector('span[data-unit-id="' + unitID + '"] .sprite');
                        if (!unitImage) continue;

                        var isAnimating = unitImage.src.indexOf('/movement/') !== -1;
                        if (!isAnimating) unitImage.style.transform = settings[playerID] ? 'scaleX(-1) translateZ(0px)' : ''; //When not animating, apply the mirrored style (use translateZ to detect if the game changed it)
                        else if (unitImage.style.transform.indexOf('translateZ') !== -1) unitImage.style.transform = ''; //When animating, remove the mirrored style if it is still applied
                    }
                }
            }
        } catch (e) {}
        swapInProgress = false;
    }


    const observer = new MutationObserver(function() {swapColours();});
    observer.observe(document, { childList: true, subtree: true, attributes: true });

    window.addEventListener('load', function() {
        swapColours(true);
        var swapEle = document.createElement('a');
        swapEle.textContent = '↔';
        swapEle.style.color = "#FFF";
        swapEle.style.cursor = "pointer";
        swapEle.onclick = function() {
            var playerID = unsafeWindow.newClickLogo.children[0].id;
            if (settings[playerID]) delete settings[playerID];
            else settings[playerID] = 1;
            saveSettings();
            swapColours(true, playerID);
        }
        document.getElementById('country-color-menu').firstElementChild.insertBefore(swapEle, document.getElementById('country-color-menu').firstElementChild.lastElementChild);
    });
})();