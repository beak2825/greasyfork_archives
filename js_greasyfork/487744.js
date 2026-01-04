// ==UserScript==
// @name            RED artist releases sorter
// @namespace       Red
// @description     Sort artist releases by snatch or seeders count
// @author          unksr00t
// @include         https://*redacted.ch/artist.php*
// @grant           GM_xmlhttpRequest
// @grant           GM_registerMenuCommand
// @grant           GM_getResourceText
// @version         1.4
// @date            2024-02-18
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487744/RED%20artist%20releases%20sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/487744/RED%20artist%20releases%20sorter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Constants  ---------------------------------------------------------------------------------------------------------
    const selectors = {
        types: ".box.center > a", // release type urls hash
        type: (typeKey) => `${typeKey}`, // release type table
        group: ".group", // the release table row containing cover art, year, title and tags
        edition: ".edition",
        format: ".torrent_row"
    };

    const SORT_BY = 'snatches' // 'snatches' || 'seeders' || 'year' (standard sorting)
    const STYLE_TYPES = true;
    const STYLE_COLOR = '#456478';

     // Classes  ---------------------------------------------------------------------------------------------------------
     class Group {
        constructor(type, index = 0, info) {
            this.index = index;
            this.type = type
            this.info = info;
            this.editions = []
            this.total = {
                snatches: 0,
                seeders: 0
            }
        }

        addEdition(edition) {
            if (SORT_BY === 'snatches') {
                this.editions.push(this.sortEditionFormatsBySnatchCount(edition));
                this.sortEditionsBySnatchCount();
            } else {
                this.editions.push(this.sortEditionFormatsBySeedCount(edition));
                this.sortEditionsBySeedCount();
            }

            this.updateTotals();
        }

        updateTotals() {
          this.total = this.getTotal();
        }

        getTotal() {
            return this.editions.reduce((total, edition) => {
                return {
                    snatches: edition.snatches + total.snatches,
                    seeders: edition.seeders + total.seeders
                }
            }, {snatches: 0, seeders: 0})
        }

        getGroup() {
            return {
                index: this.index,
                type: this.type,
                info: this.info,
                editions: this.editions,
                totalSnatches: this.total.snatches,
                totalSeeders: this.total.seeders,
            }
        }

        getIndex() {
            return this.index;
        }

        sortEditionsBySnatchCount() {
            this.editions = [...this.editions].sort((b, a) => {
                return a.snatches - b.snatches
            })
        }

        sortEditionsBySeedCount() {
            this.editions = [...this.editions].sort((b, a) => {
                return a.seeders - b.seeders
            })
        }

        sortEditionFormatsBySnatchCount(edition) {
            return {
                ...edition,
                formats: [...edition.formats].sort((b, a) => {
                    return a.snatches - b.snatches
                }),
            }
        }

        sortEditionFormatsBySeedCount(edition) {
            return {
                ...edition,
                formats: [...edition.formats].sort((b, a) => {
                    return a.seeders - b.seeders
                }),
            }
        }
    }

    class Type {
        constructor(key, nodeIndex = 0, index = 0, element) {
           this.index = index;
           this.groups = new Array();
           this.table = document.getElementById(key)
           this.node = element.node;
           this.nodeIndex = element.index; // in respect to all the <tr> in the table
           this.key = key;
        }

        addGroup(group) {
            this.groups.push(group)
        }

        getTypeKey() {
            return this.key
        }

        getGroupsbySnatches() {
            return [...this.groups].sort((b, a) => {
                let prevTotalSnatches = a.getTotal().snatches;
                let nextTotalSnatches = b.getTotal().snatches;
                return prevTotalSnatches - nextTotalSnatches
            })
        }

        getGroupsbySeeders() {
            return [...this.groups].sort((b, a) => {
                let prevTotalSeeders = a.getTotal().seeders;
                let nextTotalSeeders = b.getTotal().seeders;
                return prevTotalSeeders - nextTotalSeeders
            })
        }
    }

    // Main ---------------------------------------------------------------------------------------------------------
    if (SORT_BY === 'year') {
        console.log('RED Release Sorter is disabled');
        return;
    }

    console.log('Sorting Artist Releases by', SORT_BY);

    const releaseTypeKeys = getReleaseTypeKeys();
    const types = parseTypes(releaseTypeKeys);
    const typeKeys = Object.keys(types);

    // Sort all release type sections torrent_album ...
    for (let typeKeyIndex = 0; typeKeyIndex < typeKeys.length; typeKeyIndex++) {
        const type = types[typeKeys[typeKeyIndex]];
        sortTypes(type, typeKeyIndex)
    }

    // Helpers ---------------------------------------------------------------------------------------------------------
    function sortTypes(type, typeIndex) {
        const rows = type.table.querySelectorAll('tr');

        // add margin-top and a top border to separate types sections
        STYLE_TYPES && styleTypes(type.table, typeIndex);

        // hide all rows
        for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
            const row = rows[rowIndex];
            if(isHeadRow(row)) {
                continue;
            }
            row.setAttribute('hidden', true);
        }

        let by;
        if (SORT_BY === 'snatches') {
            by = type.getGroupsbySnatches();
        } else {
            by = type.getGroupsbySeeders();
        }

        let prevElement;
        // Insert ordered groups for this type
        for (let groupIndex = 0; groupIndex < by.length; groupIndex++) {
            const group = by[groupIndex];

            // Insert release info row
            const infoClone = group.info.node.cloneNode(true)
            infoClone.removeAttribute('hidden');

            group.info.node.removeAttribute('id');

            if (prevElement) {
                prevElement.parentNode.insertBefore(infoClone, prevElement.nextSibling)
            } else {
                group.info.node.parentNode.insertBefore(infoClone, group.info.node.nextSibling)
            }
            prevElement = infoClone;

            // Insert editions
            for (let editionIndex = 0; editionIndex < group.editions.length; editionIndex++) {
                const edition = group.editions[editionIndex];
                let editionClone = edition.node.cloneNode(true)
                editionClone.removeAttribute('hidden');
                edition.node.removeAttribute('id');
                prevElement.parentNode.insertBefore(editionClone, prevElement.nextSibling);
                prevElement = editionClone;

                // Insert edition formats
                for (let formatIndex = 0; formatIndex < edition.formats.length; formatIndex++) {
                    const format = edition.formats[formatIndex];
                    const formatClone = format.node.cloneNode(true)
                    formatClone.removeAttribute('hidden');
                    format.node.removeAttribute('id');
                    prevElement.parentNode.insertBefore(formatClone, prevElement.nextSibling)
                    prevElement = formatClone
                }
            }
        }
    }

    /**
      Get the available release type for the given artist
    **/
    function getReleaseTypeKeys() {
        const releaseTypeKeys = new Array();
        for (const node of document.querySelectorAll(selectors.types)) {
           releaseTypeKeys.push(new URL(node.href).hash.replace("#", ""));
        }
        return releaseTypeKeys;
    }

    function isHeadRow(row) {
        return Array.from(row.classList).some((c) => c.startsWith('colhead')); // TODO: add to selectors
    }

    /**
      Parse each release type section splitting release groups and calculating snatched and seeders totals
    **/
    function parseTypes() {
        const types = {};
        let group, type;

         // loop over all the release type tables
        for (const index in releaseTypeKeys) { // TODO: simply looping .colhead
            const releaseTypeKey = releaseTypeKeys[index];
            if (['artistcomments', 'requests', 'collages'].includes(releaseTypeKey)) continue;

            const releaseTypeNodes = new Array();

            const releaseTypeTable = document.getElementById(selectors.type(releaseTypeKey)); // table#torrent_album

            // 1. get all the <tr> elements of the table
            let rows = releaseTypeTable.querySelectorAll('tr');

            // loop through every <tr> on each type table
            for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
                let row = rows[rowIndex];
                let nextRow = rows[rowIndex + 1];

                const isGroupInfoRow = row.classList.contains('group');
                const isEditionRow = row.classList.contains('edition');
                const isFormatRow = row.classList.contains('torrent_row');
                const isNextGroupInfoRow = nextRow && nextRow.classList.contains('group'); // TODO: add to selectors
                const isLastRow = row === rows.length;

                switch (true) {
                        // albums, singles, etc..
                    case isHeadRow(row): {
                        type = new Type(releaseTypeKey, rowIndex, Object.keys(types).length + 1, {node: row, index});
                        types[releaseTypeKey] = type;
                        break;
                    }

                    case isGroupInfoRow: {
                        const groupInfo = {
                            node: row,
                            id: row.querySelector('.hide_torrents').id.replace('showimg_', ''),
                            title: row.querySelector('.group_info > strong').textContent,
                        }

                        if (!group) {
                            group = new Group(type.key, 0, groupInfo);
                            // add last parsed group to type table

                        } else {
                            // add last parsed group to type table
                            const nextGroupIndex = group.getIndex() + 1;
                            group = new Group(type.key, nextGroupIndex, groupInfo);
                        }

                        type.addGroup(group);

                        break;
                    }

                    case isEditionRow: {
                        // sub loop until the next head
                        let doneParsingFormats = false;
                        let formatIndex = 1;
                        let editionSnatches = 0;
                        let editionSeeders = 0;
                        let formats = new Array();

                        do {
                            let maybeFormatNode = rows[rowIndex + formatIndex];

                            if (!maybeFormatNode) {
                                doneParsingFormats = true;
                                continue;
                            }

                            const isFormatRow = maybeFormatNode.classList.contains('torrent_row');

                            if (!isFormatRow) {
                                doneParsingFormats = true;
                                continue;
                            }

                            let formatSnatches = 0;
                            let formatSeeders = 0;

                            let formatCols = maybeFormatNode.querySelectorAll('.number_column');

                            for (let col = 0; col < formatCols.length; col++) {
                                if (col < 1 || col > 2) {
                                    continue;
                                }

                                let colNode = formatCols[col];

                                if (col == 1) {
                                    formatSnatches = parseCount(colNode.innerHTML)
                                    editionSnatches = editionSnatches + formatSnatches;
                                } else {
                                    formatSeeders = parseCount(colNode.innerHTML);
                                    editionSeeders = editionSeeders + formatSeeders; // edition-level sum
                                }
                            }

                            formats.push({
                                node: maybeFormatNode,
                                snatches: formatSnatches,
                                seeders: formatSeeders,
                                title: maybeFormatNode.querySelector('td').textContent,
                            });

                            formatIndex++;
                        } while (!doneParsingFormats)

                        const edition = {
                            node: row,
                            formats,
                            snatches: editionSnatches,
                            seeders: editionSeeders,
                            title: row.querySelector('.edition_info > strong').textContent,
                        };

                        group.addEdition(edition);
                        break;
                    }

                    case isFormatRow: {
                        // skip format rows as they get parsed in the subloop of edition rows
                        break;
                    }

                    default:
                        console.log('Unsupported tr node', row)
                        break;
                }
            }
        }

        return types
    }

    function styleTypes(row, index) {
        if (index > 0) {
           row.style.marginTop = '4rem';
        }

        row.style.borderTop = `20px solid ${STYLE_COLOR}`;
    }

    function parseCount(count) {
        return parseInt(count.replace(',', ''));
    }
})()