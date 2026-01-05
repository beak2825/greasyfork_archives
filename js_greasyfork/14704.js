// ==UserScript==
// @name         Level Upgrade Hider
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Hides level upgrade buttons
// @author       RGiskard [1953860]
// @match        *.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/14704/Level%20Upgrade%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/14704/Level%20Upgrade%20Hider.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

HideLevelPageUpgradeButton();
DisableSidebarUpgradeLink();

// The page periodically updates itself. If the upgrade link shows up or is refreshed, continue to disable it.
AddSidebarObserver();



function HideLevelPageUpgradeButton() {
    var $levelPageUpgradeButton = $('a.level');
    if ($levelPageUpgradeButton.length > 0) {
        console.log('Hiding main level page upgrade button.');
        $levelPageUpgradeButton.hide();
    }
}

function DisableSidebarUpgradeLink() {
    var $sidebarUpgradeDiv = $('div.upgrade-level');
    if ($sidebarUpgradeDiv.length > 0) {
        var $sidebarUpgradeButton = $sidebarUpgradeDiv.find('a');
        if ($sidebarUpgradeButton.length > 0) {
            // Leave the button visible so the player knows it's an option, but disable the link.
            console.log('Disabling sidebar upgrade button.');
            $sidebarUpgradeButton[0].setAttribute('href', 'javascript: ;');
            $sidebarUpgradeButton[0].style.color = 'gray';
        }
    }
}

/**
 * Adds an observer to the sidebar, attempting to disable the upgrade link on refresh.
 */
function AddSidebarObserver() {
    try {
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                // A bit simplistic, and we could attempt to only do this when we know
                // for certain the mutation applies to the sidebar, but it makes no difference.
                DisableSidebarUpgradeLink();
            });
        });

        var $sidebarDiv = $('#player-stats');
        if ($sidebarDiv.length > 0) {
            var observerTarget = $sidebarDiv[0];
            var observerConfig = { attributes: false, childList: true, characterData: false };
            observer.observe(observerTarget, observerConfig);
            console.log('Added upgrade link observer to sidebar.');
        }
    } catch (err) {
        console.log(err);
    }
}
