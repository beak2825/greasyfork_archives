// ==UserScript==
// @name         Auto-Collapse Big GGn Groups
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  Auto-collapse big torrent groups in GGn search. Also adds a count of how many torrents are in each group to the rows.
// @author       tesnonwan
// @match        https://gazellegames.net/torrents.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gazellegames.net
// @downloadURL https://update.greasyfork.org/scripts/504874/Auto-Collapse%20Big%20GGn%20Groups.user.js
// @updateURL https://update.greasyfork.org/scripts/504874/Auto-Collapse%20Big%20GGn%20Groups.meta.js
// ==/UserScript==
/* globals toggle_group */

const COUNT_THRESHOLD = 5;

function collapseGroups() {
    if (!document.getElementById('torrentbrowse')) {
        // Ignore non-search page.
        return;
    }
    const torrentTable = document.getElementById('torrent_table');
    const groupRows = torrentTable.querySelectorAll('.group');
    for (const groupRow of groupRows) {
        const groupId = /_([0-9]+)/.exec(groupRow.className)[1];
        const torrentCount = torrentTable.querySelectorAll(`.groupid_${groupId} td[colspan="4"]`).length;
        if (torrentCount > COUNT_THRESHOLD && !groupRow.title?.startsWith('Group stickied')) {
            toggle_group(groupId, groupRow, /* event= */ {});
        }
        const countSpan = document.createElement('span');
        countSpan.style.marginLeft = countSpan.style.marginRight = '4px';
        countSpan.style.fontSize = 'larger';
        countSpan.style.fontWeight = 'bold';
        const torrentCountFormatted = new Intl.NumberFormat().format(torrentCount);
        countSpan.appendChild(
            document.createTextNode(`(${torrentCountFormatted} torrent${torrentCount === 1 ? '' : 's'})`));
        const groupNameSpan = groupRow.querySelector('#groupname');
        groupNameSpan.parentElement.insertBefore(countSpan, groupNameSpan.nextElementSibling);
    }
}

collapseGroups();
