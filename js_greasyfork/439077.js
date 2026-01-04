// ==UserScript==
// @name        Melvor Idle Change Game Mode
// @description Adds a button to the settings page to allow the user to change their game mode at will
// @version     1.0
// @namespace   Silber
// @match       https://melvoridle.com/*
// @match       https://www.melvoridle.com/*
// @match       https://test.melvoridle.com/*
// @noframes
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439077/Melvor%20Idle%20Change%20Game%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/439077/Melvor%20Idle%20Change%20Game%20Mode.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

((main) => {
    var script = document.createElement('script');
    script.textContent = `try { (${main})(); } catch (e) { console.log(e); }`;
    document.body.appendChild(script).parentNode.removeChild(script);
})(() => {
    'use strict';

    function injectSettingsChangeMode() {
        // function for dropdown to use
        window.changeGameMode = function (modeId) {
            modeId = parseInt(modeId);
            if (currentGamemode != modeId) {
                currentGamemode = modeId;
                saveData();
                location.href='index.php';
            }
        }

        // injecting button into the settings UI
        if ($("#settings-container")){
            var settingsContainer = $("#settings-container");
            var values = ["Standard", "Hardcore", "Adventure", "Chaos (Not Supported)", "Hardcore Adventure (Not Supported)", "Internal Suffering Speedrun"];
 
            settingsContainer.find(".block-content")
                .append($(document.createElement('h2'))
                    .html('Script Settings'))
                .append($(document.createElement('div'))
                    .append(
                        $(document.createElement('label')).prop({
                            for: 'gameMode'
                        }).html('Choose your game mode: ')
                    )
                    .append(
                        $(document.createElement('select')).prop({
                            id: 'gameMode',
                            name: 'gameMode'
                        })
                    )
                )
            
            var index = 0;
            for (const val of values) {
                $('#gameMode').append($(document.createElement('option')).prop({
                    value: index,
                    text: val.charAt(0).toUpperCase() + val.slice(1)
                }))
                index++;
            }

            $("#gameMode").change(function () {
                changeGameMode($(this).val());
            })
        }
    }

    function loadScript() {
        if (typeof confirmedLoaded !== 'undefined' && confirmedLoaded) {
            clearInterval(interval);
            console.log('Loading Melvor Idle Change Game Mode script');
            injectSettingsChangeMode();
        }
    }

    const interval = setInterval(loadScript, 500);
});
