// ==UserScript==
// @name         Windscribe Chrome Extension Region Auto Switcher
// @description  Doesn't actually work as a userscript, paste into console.
// @author       onlypuppy7
// @namespace    https://discord.gg/n6MEg2vfcw/
// @supportURL   http://forum.onlypuppy7.online/
// @license      GPL-3.0
// @icon         https://raw.githubusercontent.com/Hydroflame522/StateFarmClient/main/icons/StateFarmClientLogo384px.png
// @version      1.0
// @match        chrome-extension://hnmpcagpplmpfojmgmnngilcnanddlhb/popup.html
// @downloadURL https://update.greasyfork.org/scripts/502528/Windscribe%20Chrome%20Extension%20Region%20Auto%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/502528/Windscribe%20Chrome%20Extension%20Region%20Auto%20Switcher.meta.js
// ==/UserScript==

function clickLocationsButton() {
    document.querySelector('[aria-label="Locations"]').click();
}

function clickHeartButton() {
    document.querySelector('.css-klg4th-InlineButton-baseStyle-InlineButtonStyle-HeaderMenuItem').click();
}

function clickAtlanta() {
    const datacenters = document.querySelectorAll('.css-dn8yaz-DatacenterListItem');
    
    if (datacenters.length > 0) {
        const randomIndex = Math.floor(Math.random() * datacenters.length);
        
        datacenters[randomIndex].click();
    } else {
        console.log('No datacenter elements found.');
    }
}

function clickAutopilot() {
    var datacenterItems = document.querySelectorAll('.css-1oh5hha-BaseListItem-DatacenterListItem');
    var randomIndex = Math.floor(Math.random() * datacenterItems.length);
    datacenterItems[randomIndex].click();
}

function connect() {
    clickLocationsButton();
    setTimeout(function() {
        clickHeartButton();
        setTimeout(function() {
            clickAtlanta();
            if (REPEAT) setTimeout(function() {
                clickLocationsButton();
                setTimeout(function() {
                    clickAutopilot();
                    if (REPEAT) setTimeout(connect, DELAY);
                }, 750);
            }, DELAY);
        }, 750);
    }, 750);
}

connect();

REPEAT = false;

DELAY = 2 * 60 * 1000;