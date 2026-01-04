// ==UserScript==
// @name         GGn Additional Filters
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world :)
// @author       BestGrapeLeaves
// @match        https://gazellegames.net/upload.php*
// @match        https://gazellegames.net/torrents.php*
// @icon         https://i.imgur.com/a6TlZtE.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/451499/GGn%20Additional%20Filters.user.js
// @updateURL https://update.greasyfork.org/scripts/451499/GGn%20Additional%20Filters.meta.js
// ==/UserScript==

// yottabyte games when?
const units = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

function humanizedToBytes(str) {
    const [numString, unit] = str.split(' ')
    const size = parseFloat(numString)
    const multiplier = Math.pow(1000, units.indexOf(unit) + 1)
    return size*multiplier
}

function filterTorrents(filterMethod, actionMethod) {
    const groups = {};
    $(`#torrent_table > tbody > tr`).show();
    $(`#torrent_table > tbody > tr`).each(function() {
        const classList = [...$(this).prop("classList")];
        // Find group id
        const groupMatch = classList.map(c => c.match(/^groupid_(\d+)$/)).filter(m => m)[0];
        if (!groupMatch) {
            return;
        }
        const groupId = groupMatch[1];

        // Find edition id (it's just numbers increasing or even empty string)
        const editionMatch = classList.find(c => c.startsWith(`edition_${groupId}_`));
        if(editionMatch === undefined) {
            return;
        }
        const editionId = editionMatch.replace(`edition_${groupId}_`, '');

        // add
        if (!groups[groupId]) {
            groups[groupId] = {};
        }
        if (!groups[groupId][editionId]) {
            groups[groupId][editionId] = []
        }

        groups[groupId][editionId].push(this);
    });

    let totalGroupsHidden = 0;
    let totalEditionsHidden = 0;
    let totalTorrentsHidden = 0;
    Object.entries(groups).forEach(([groupId, editions]) => {
        let editionsHidden = 0;
        Object.entries(editions).forEach(([editionId, torrents]) => {
            let torrentsHidden = 0;
            torrents.forEach(torrent => {
                if (!filterMethod($(torrent))) {
                    torrentsHidden++;
                    actionMethod($(torrent));
                }
            });

            const editionNum = Number(editionId);
            if (torrentsHidden === torrents.length) {
                editionsHidden++;
                if (editionNum > 0) {
                    // Hide edition title as well
                    const edition = $(`#torrent_table > tbody > tr.groupid_${groupId}`).has('td.edition_info').eq(editionNum - 1);
                    actionMethod(edition)
                }
            }

            totalTorrentsHidden += editionsHidden;
        });

        if (editionsHidden === Object.entries(editions).length) {
            totalGroupsHidden++;
            const group = $(`#torrent_table > tbody > tr.group_${groupId}`);
            actionMethod(group)
        }

        totalEditionsHidden += editionsHidden;
    });

    return {totalGroupsHidden, totalEditionsHidden, totalTorrentsHidden};
}

(function() {
    'use strict';

    console.log('targetinsert', $('#torrentbrowse > form[name="filter"] > div.filter_torrents > .box > table:first-child'))
    $('#torrentbrowse > form[name="filter"] > div.filter_torrents').append(
        `<h3>Additional Filters (Updates On Change)<span id="additional_filters_hidden_notice" style="color: hotpink;"></span></h3>
         <div class="box pad">
            <table style="margin-left: 15px;margin-top: 10px;">
                <tbody>
                    <tr>
                        <td style="width: 1%;white-space: nowrap;">Minimum Size:</td>
                        <td style="width: 1%;"><input style="width: 30px;" id="additional_filters_minimum_size_number_input" placeholder="-∞"></td>
                        <td><select id="additional_filters_minimum_size_unit_select" style="width:auto;">
                                    <option value="KB">KB
                                    </option>
                                    <option value="MB">MB
                                    </option>
                                    <option value="GB">GB
                                    </option>
                                    <option value="TB">TB
                                    </option>
                                    <option value="PB">PB
                                    </option>
                        </select></td>
                    </tr>
                    <tr>
                        <td style="width: 1%;white-space: nowrap;">Maximum Size:</td>
                        <td style="width: 1%;"><input style="width: 30px;" id="additional_filters_maximum_size_number_input" placeholder="∞"></td>
                        <td style="position: static;"><select id="additional_filters_maximum_size_unit_select" style="width:auto;">
                                    <option value="KB">KB
                                    </option>
                                    <option value="MB">MB
                                    </option>
                                    <option value="GB">GB
                                    </option>
                                    <option value="TB">TB
                                    </option>
                                    <option value="PB">PB
                                    </option>
                        </select></td>
                    </tr>
                </tbody>
            </table>
         </div>`
    );

    function runFilters () {
        const filters = [];

        // max size
        const minSizeNum = $('#additional_filters_minimum_size_number_input').val();
        const minSizeUnit = $('#additional_filters_minimum_size_unit_select').val();
        // max size
        const maxSizeNum = $('#additional_filters_maximum_size_number_input').val();
        const maxSizeUnit = $('#additional_filters_maximum_size_unit_select').val();
        // size filter
        const minSizeInBytes = minSizeNum ? humanizedToBytes(`${minSizeNum} ${minSizeUnit}`) : -Infinity;
        const maxSizeInBytes = maxSizeNum ? humanizedToBytes(`${maxSizeNum} ${maxSizeUnit}`) : Infinity;
        filters.push(t => {
            const humanizedSize = t.find('td').eq(3).text().replace(/,/g, '')
            if (!humanizedSize) {
                return true;
            }

            const sizeInBytes = humanizedToBytes(humanizedSize);

            return minSizeInBytes <= sizeInBytes && sizeInBytes <= maxSizeInBytes
        })

        const {totalGroupsHidden, totalEditionsHidden, totalTorrentsHidden} =
              filterTorrents(t => filters.every(filter => filter(t)), e => e.hide());
        const notice = ` [${totalGroupsHidden} Groups / ${totalEditionsHidden} Editions / ${totalTorrentsHidden} Torrents] Completly Hidden`;
        $('#additional_filters_hidden_notice').html(notice)
    }
    $('#additional_filters_minimum_size_number_input').change(runFilters);
    $('#additional_filters_minimum_size_unit_select').change(runFilters);
    $('#additional_filters_maximum_size_number_input').change(runFilters);
    $('#additional_filters_maximum_size_unit_select').change(runFilters);
})();