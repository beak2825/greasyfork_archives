// ==UserScript==
// @name         Ogame Send Explorers Automatically
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Will click on galaxy's open exploration button instead of you automatically every 2seconds until there are none left or you can't send more fleet.
// @author       You
// @match        https://*.ogame.gameforge.com/game/index.php?page=ingame&component=galaxy*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464076/Ogame%20Send%20Explorers%20Automatically.user.js
// @updateURL https://update.greasyfork.org/scripts/464076/Ogame%20Send%20Explorers%20Automatically.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var url = window.location.href;
    if (url.indexOf('ogame.gameforge.com/game/index.php?page=ingame&component=galaxy') != -1) {
        var count = document.querySelectorAll('.planetDiscover').length;
        var counting = 0;
        var sendExplorers;

        var clickYes = function () {
            if (jQuery('#errorBoxDecisionYes:visible').length) {
                jQuery('#errorBoxDecisionYes').click();
            } else {
                clearInterval(sendExplorers);
                console.log('Cleared interval inside clickYes');
            }
        }
        var clickPlanet = function () {
            counting++;
            console.log("Clicked " + counting + " times");
            jQuery('.planetDiscover').click();
            setTimeout(clickYes, 1000);
            if (counting == count) {
                clearInterval(sendExplorers);
                console.log('Cleared interval inside clickPlanet');
            }
        }
        var startExploring = function () {
            console.log('Starting exploration');
            sendExplorers = setInterval(clickPlanet, 2000);
        }

        jQuery(document).on('click', '#startExploringButton', function() {
            startExploring();
        });

        jQuery('#menuTable').append(`<li><a id="startExploringButton" class="menubutton premiumHighligt" href="#"><span class="textlabel">Exploration</span></a></li>`);
    }
})();