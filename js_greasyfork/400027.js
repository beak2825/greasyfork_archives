// ==UserScript==
// @name         Melvor Idle AutoSell Fishing Junk
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  Adds a button to the sidebar, toggles a script on/off that will automatically sell junk caught while fishing every 10sec and log to console. Now automatically confirms and closes sale confirmation modal dialog.
// @author       Aldous Watts
// @match        https://*.melvoridle.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400027/Melvor%20Idle%20AutoSell%20Fishing%20Junk.user.js
// @updateURL https://update.greasyfork.org/scripts/400027/Melvor%20Idle%20AutoSell%20Fishing%20Junk.meta.js
// ==/UserScript==

function autoSellFishJunk() {
    var count = 0;
    for(const junk of junkItems) {
        if (getBankId(junk)) {
            count++;
            setTimeout(() => {
                sellItem(getBankId(junk),6969696969696969);
                setTimeout(() => {
                    if (document.getElementsByClassName('swal2-confirm').length == 0) return;
                    document.getElementsByClassName('swal2-confirm')[0].click();
                }, 100);
                console.log('AutoSell Fish Junk just sold '+items[junk].name+'.');
            }, count*150);
        }
    }
}

var autoSellJunkLoop = setInterval( () => { autoSellFishJunk() }, 10000);
