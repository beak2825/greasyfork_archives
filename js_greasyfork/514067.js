// ==UserScript==
// @name         Delete Empty Groups From GGn Search Page
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Delete all empty groups in a given search result page. Only does one page at a time.
// @author       tesnonwan
// @match        https://gazellegames.net/torrents.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gazellegames.net
// @downloadURL https://update.greasyfork.org/scripts/514067/Delete%20Empty%20Groups%20From%20GGn%20Search%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/514067/Delete%20Empty%20Groups%20From%20GGn%20Search%20Page.meta.js
// ==/UserScript==

function init() {
    if (!document.getElementById('torrentbrowse')) {
        // Ignore non-search page.
        return;
    }

    const torrentTable = document.getElementById('torrent_table');
    const groupRows = torrentTable.querySelectorAll('.group');
    const emptyGroups = [];
    for (const groupRow of groupRows) {
        const groupId = /_([0-9]+)/.exec(groupRow.className)[1];
        const torrentCount = torrentTable.querySelectorAll(`.groupid_${groupId} td[colspan="4"]`).length;
        if (torrentCount === 0) {
            const groupLink = groupRow.querySelector('#groupname a');
            emptyGroups.push({
                groupId,
                groupLink
            });
        }
    }

    const submitDiv = document.querySelector('.submit');
    const deleteButton = document.createElement('input');
    deleteButton.type = 'button';
    deleteButton.value = 'Delete Empty';
    deleteButton.style.color = 'red';
    deleteButton.onclick = async () => {
        if (!confirm(`Delete all ${emptyGroups.count} empty groups on this page?`)) {
            return;
        }
        submitDiv.removeChild(deleteButton);
        for (const group of emptyGroups) {
            const deleteUrl = `https://gazellegames.net/torrents.php?action=deletegroup&groupid=${group.groupId}`;
            console.log(`Fetching ${deleteUrl}`);
            const success = await fetch(deleteUrl, {
                method: 'get',
                includeCredentials: true,
            }).then(r => {
                if (!(r.ok && r.redirected)) {
                    return false;
                }
                return true;
            }).catch(e => {
                console.log(`Got error when deleting ${group.groupId}: ${e.message}`);
                return false;
            });
            if (!success) {
                alert('An error occurred while trying to delete groups.');
                break;
            }
            group.groupLink.style.color = 'red';
            await new Promise((resolve) => {
                window.setTimeout(resolve, 500);
            });
        }
    };
    submitDiv.appendChild(deleteButton);
}

init();
