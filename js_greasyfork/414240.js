// ==UserScript==
// @name         TI/XP Transfer List
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Transfer List: Show Routine (always) and Training Intensity (from Tuesday to Saturday)
// @match        https://trophymanager.com/transfer/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414240/TIXP%20Transfer%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/414240/TIXP%20Transfer%20List.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const APPLICATION_CONST = {
        TRANSFER_LIST_SELECTOR: 'div#transfer_list',
        TI_HEADER_NAME: 'TI',
        XP_HEADER_NAME: 'XP',
        TI_COLUMN_POSITION: 6, // Counted from left, 0-indexed
        XP_COLUMN_POSITION: 11, // Counted from left, 0-indexed
        TI_PRECISION: 0,
        XP_PRECISION: 1
    };

    const PositionNames = {
        GOALKEEPER_STRING: 'GK'
    };

    /**
     * Gets players' IDs from page
     * @returns {string[]}
     */
    function getAllIDs() {
        let rows = document.querySelectorAll(APPLICATION_CONST.TRANSFER_LIST_SELECTOR + ' tr[id^=player_row]');
        let ids = [];
        
        for(let row of rows) {
            ids.push(row.id.split('_')[2]);
        }

        return ids;
    }

    /**
     * @param {string} playerID 
     */
    function getOldASI(playerID) {
        let playerRow = document.querySelector(APPLICATION_CONST.TRANSFER_LIST_SELECTOR + ' tr[id=player_row_' + playerID + ']');
        let asiCell = playerRow.childNodes[5];
        let asi = asiCell.innerHTML.match(/[0-9]+/)[0];
        return Number(asi);
    }

    /**
     * @param {string} playerID 
     * @returns {Promise<number>}
     */
    function requestPlayerASI(playerID) {
        return new Promise((resolve, reject) => {
            $.post("/ajax/tooltip.ajax.php", { "player_id": playerID, minigame: undefined })
            .done((data) => {
                data = JSON.parse(data);
                resolve({
                    id: data.player.player_id,
                    position: data.player.fp,
                    ASI: Number(data.player.skill_index.split(',').join('')),
                    xp: Number(data.player.routine.split(',').join(''))
                });
            }).fail((error) => {
                reject(error);
            });
        });
    }

    /**
     * @param {number} columnPosition 
     * @param {string} headerName 
     */
    function addColumnToTable(columnPosition, headerName) {
        let headerRow = document.querySelector(APPLICATION_CONST.TRANSFER_LIST_SELECTOR + ' tr.header');
        let columns = headerRow.querySelectorAll('th');
        let columnsCount = columns.length;
        let headerCell = document.createElement('th');
        headerCell.style.width = '60px';
        headerCell.innerHTML = headerName;

        if(columnsCount > columnPosition + 1) {
            headerRow.insertBefore(headerCell, columns[columnPosition]);
        } else {
            headerRow.appendChild(headerCell);
        }

        let rows = document.querySelectorAll(APPLICATION_CONST.TRANSFER_LIST_SELECTOR + ' tr[id^=player_row]');
        for(let row of rows) {
            if(row.childElementCount === 0) {
                continue;
            }

            let cell = document.createElement('td');
            cell.classList.add('align_center');
            cell.innerHTML = '-';
            if(columnsCount > columnPosition + 1) {
                row.insertBefore(cell, row.querySelectorAll('td')[columnPosition]);
            } else {
                row.appendChild(cell);
            }
        }
    }

    /**
     * @param {number} rowIndex 
     * @param {number} columnIndex 
     * @param {*} innerHTML Anything printable
     */
    function changeTransferTableCellInnerHTML(rowIndex, columnIndex, innerHTML) {
        let row = document.querySelectorAll(APPLICATION_CONST.TRANSFER_LIST_SELECTOR + ' tr[id]');
        if(row[rowIndex].childElementCount === 0) {
            return;
        }

        row[rowIndex].childNodes[columnIndex].innerHTML = innerHTML;
    }

    let TI = {
        /**
         * @param {number} asiNew
         * @param {number} asiOld
         * @param {string} position
         * @returns {number} calculated TI
         */
        compute: function(asiNew, asiOld, position) {
            let pow = Math.pow;
            if(position === PositionNames.GOALKEEPER_STRING) {
                return (pow(asiNew * pow(2, 9) * pow(5, 4) * pow(7, 7), 1/7) - pow(asiOld * pow(2, 9) * pow(5, 4) * pow(7, 7), 1/7)) / 14 * 11 * 10;
            } else {
                return (pow(asiNew * pow(2, 9) * pow(5, 4) * pow(7, 7), 1/7) - pow(asiOld * pow(2, 9) * pow(5, 4) * pow(7, 7), 1/7)) * 10;
            }
        }
    };

    /**
     * Requests necessary data and displays current ASI
     * @param {MutationRecord[]} mutationRecords
     */
    function init(mutationRecords) {
        if(document.querySelector(APPLICATION_CONST.TRANSFER_LIST_SELECTOR + ' table') === null) {
            return;
        }

        let playersIDs = getAllIDs();

        addColumnToTable(APPLICATION_CONST.TI_COLUMN_POSITION, APPLICATION_CONST.TI_HEADER_NAME);
        addColumnToTable(APPLICATION_CONST.XP_COLUMN_POSITION, APPLICATION_CONST.XP_HEADER_NAME);
        // Request in parallel
        playersIDs.map(requestPlayerASI).map((promise, index) => {
            promise.then((player) => {
                let oldASI = getOldASI(player.id);
                let ti = TI.compute(player.ASI, oldASI, player.position).toFixed(APPLICATION_CONST.TI_PRECISION);
                let xp = player.xp.toFixed(APPLICATION_CONST.XP_PRECISION);
                changeTransferTableCellInnerHTML(index, APPLICATION_CONST.TI_COLUMN_POSITION, ti);
                changeTransferTableCellInnerHTML(index, APPLICATION_CONST.XP_COLUMN_POSITION, xp);
            }).catch((error) => {
                changeTransferTableCellInnerHTML(index, APPLICATION_CONST.TI_COLUMN_POSITION, "Error");
                changeTransferTableCellInnerHTML(index, APPLICATION_CONST.XP_COLUMN_POSITION, "Error");
            });
        });
    }

    let observer = new MutationObserver(init);
    observer.observe(document.querySelector(APPLICATION_CONST.TRANSFER_LIST_SELECTOR), { childList: true });
})();