// ==UserScript==
// @name         Filter UserLog
// @namespace    https://greasyfork.org
// @license      MIT
// @version      0.2
// @description  Hide lines from user log.
// @author       drlivog
// @match        https://gazellegames.net/user.php?*action=userlog*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gazellegames.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483716/Filter%20UserLog.user.js
// @updateURL https://update.greasyfork.org/scripts/483716/Filter%20UserLog.meta.js
// ==/UserScript==

const patterns = [/Bought (.*) from the store for (\d+) gold\./igm];
const load_next_on_empty = false;
const debug_mode = false;

(function() {
    'use strict';
    filterTable();
    var mutationObserver = new MutationObserver(updateBlocker);
    mutationObserver.observe( document.querySelector('#content'), { childList:true, subtree:true });
})();

let block = false;

function filterTable() {
    let trows = document.querySelectorAll('#content table tr.rowa,tr.rowb');
    let count = 0;
    for (let i=0; i<trows.length; i++) {
        let row = trows[i];
        let span = row.querySelector('td:nth-child(2) span');
        for( let j=0; j<patterns.length; j++) {
            let pattern = patterns[j];
            let match=span.textContent.match(pattern);
            if (match) {
                debug(match);
                row.hidden = true;
                count++;
            }
        }
    }
    trows = document.querySelectorAll('#content table tr.rowa:not([hidden]),tr.rowb:not([hidden])');
    debug(trows.length);
    if (load_next_on_empty && trows.length==0) {
        const linkbox = document.querySelectorAll('div.linkbox a');
        debug(linkbox.length);
        for (let i=0; i<linkbox.length; i++) {
            const link = linkbox[i];
            if (link.innerText.includes("Next")) {
                debug(link.textContent);
                link.click();
            }
        }
    }
    debug(`Hid ${count} rows.`);
}

function updateBlocker() {
    debug("update");
    if (block) {
        return;
    } else {
        block = true;
        filterTable();
        block=false;
    }
}

function debug(s) {
    if (debug_mode) console.log(s);
}