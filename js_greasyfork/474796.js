// ==UserScript==
// @name         ASI/TI History
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Various scripts
// @author       You
// @match        https://trophymanager.com/players/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474796/ASITI%20History.user.js
// @updateURL https://update.greasyfork.org/scripts/474796/ASITI%20History.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(location.href.indexOf('players') === -1) {
        return;
    }

    const APPLICATION_CONST = {
        HISTORY_LENGTH: 11, // ASI history length, TI history is shorter by 1
        ASI_UPDATE_TIME: 3,
    };

    const PositionNames = {
        GOALKEEPER_STRING: 'GK'
    };

    /**
     * @returns {string}
     */
    function getClubID() {
        return document.querySelector('table.info_table a').getAttribute('club_link');
    }

    /**
     * @returns {string}
     */
    function getPlayerID() {
        return location.href.match(/\/players\/([0-9]+)\//)[1];
    }

    /**
     * Displays the ASI and TI history for a player
     * @param {number[]} asiHistory
     * @param {string} position
     */
    function showHistoryTable(asiHistory, tiHistory, position) {
        let containerElement = document.querySelector('.column3_a .box_body');
        let header = buildHeader();
        let box = buildBox(asiHistory, tiHistory);
        containerElement.insertBefore(header, containerElement.querySelector('h3'));
        containerElement.insertBefore(box, containerElement.querySelector('h3').nextSibling);

        function buildBox(asiHistory, tiHistory) {
            let weeksRow = document.createElement('tr');
            weeksRow.innerHTML += '<td style="min-width: 35px; max-width: 35px;"></td>';
            for(let i = 0; i < APPLICATION_CONST.HISTORY_LENGTH - 1; ++i) {
                weeksRow.innerHTML += `<td style="min-width: 62px;" class='align_center'>Week ${i + 1}</td>`;
            }

            let asiRow = document.createElement('tr');
            asiRow.classList.add('odd');
            asiRow.innerHTML += '<td>ASI</td>';
            for(let i = 0; i < APPLICATION_CONST.HISTORY_LENGTH - 1; ++i) {
                asiRow.innerHTML += `<td class='align_center'>${(i < asiHistory.length ? asiHistory[i] : '-')}</td>`;
            }

            let tiRow = document.createElement('tr');
            tiRow.innerHTML += '<td>TI</td>';
            for(let i = 0; i < APPLICATION_CONST.HISTORY_LENGTH - 1; ++i) {
                tiRow.innerHTML += `<td class='align_center'>${(i < tiHistory.length ? tiHistory[i].toFixed(0) : '-')}</td>`;
            }

            let table = document.createElement('table');
            // Append rows
            table.appendChild(weeksRow);
            table.appendChild(asiRow);
            table.appendChild(tiRow);
            // Add classes and styles
            table.classList.add('zebra', 'skill_table');

            let div = document.createElement('div');
            div.appendChild(table);
            div.classList.add('std');
            div.style.overflowX = 'scroll';

            return div;
        }

        function buildHeader() {
            let header = document.createElement('h3');
            header.innerHTML = 'ASI/TI History';
            return header;
        }
    }

    /**
     * @param {string} training
     */
  

    /**
     * @param {number} hours
     * @returns {number}
     */
    function hoursToMilliseconds(hours) {
        return hours * 3600000;
    }

    /**
     * @param {number} days
     * @returns {number}
     */
    function daysToMilliseconds(days) {
        return days * 3600000 * 24;
    }

    /**
     * @returns {number} time in milliseconds representing noon on the next Tuesday
     */
    function getNextTuesdayTime() {
        return getDateWithoutTime() + daysToMilliseconds(((2 + 7 - new Date().getDay()) % 7 === 0 ? 7 : (2 + 7 - new Date().getDay()) % 7));
    }

    /**
     * @returns {number} today's date
     */
    function getDateWithoutTime() {
        return new Date().setUTCHours(0, 0, 0, 0);
    }

    /**
     * Manages players in a club
     */
    class PlayersManager {
        constructor(clubID, playerID) {
            this.clubID = clubID;
            this.playerID = playerID;
        }

        /**
         * @returns {number[]} ASI history as array of 7 integers representing
         *    ASI for last 7 weeks including current week
         */
        getHistory(playerID) {
            return JSON.parse(localStorage.getItem(this.clubID + '_' + playerID + '_asi_history')) || [];
        }

        /**
         * @returns {number} current ASI
         */
        getCurrent(playerID) {
            return JSON.parse(localStorage.getItem(this.clubID + '_' + playerID + '_asi_history'))[0] || null;
        }

        /**
         * @returns {number}
         */
        getNextUpdateTime() {
            return JSON.parse(localStorage.getItem(this.clubID + '_next_asi_update')) || 0;
        }

        /**
         * Force update time change
         * @param {number} [time] Next update time. If not supplied, defaults to APPLICATION_CONST.ASI_UPDATE_TIME
         */
        changeNextUpdateTime(time) {
            if(!isNaN(time) && isFinite(time)) {
                // Parameter supplied
                let lastTime = Number(localStorage.getItem(this.clubID + '_next_asi_update'));
                localStorage.setItem(this.clubID + '_next_asi_update', new Date(lastTime).setUTCHours(time));
            } else {
                let lastTime = Number(localStorage.getItem(this.clubID + '_next_asi_update'));
                localStorage.setItem(this.clubID + '_next_asi_update', new Date(lastTime).setUTCHours(APPLICATION_CONST.ASI_UPDATE_TIME));
            }
        }

        /**
         * @param {string} playerID
         * @returns {string}
         */
        getPlayerPosition(playerID) {
            return localStorage.getItem(this.clubID + '_' + playerID + '_player_position') || '';
        }

        /**
         * Updates data for all players and changes the next update time
         * @param {{[playerID: number]: {asi: number, position: string}}} playersData
         * @param {string} [playerID] update only one player
         */
        updateData(playersData, playerID) {
            let updatePlayerData = (playerID) => {
                let history = this.getHistory(playerID);
                history.unshift(playersData[playerID].asi);
                if(history.length > APPLICATION_CONST.HISTORY_LENGTH) {
                    history.pop();
                }
                // Update history
                localStorage.setItem(this.clubID + '_' + playerID + '_asi_history', JSON.stringify(history));
                // Update position
                localStorage.setItem(this.clubID + '_' + playerID + '_player_position', playersData[playerID].position);
            }

            if(playerID) {
                // Update only one player
                updatePlayerData(playerID);
                return;
            }

            let playersIDs = Object.keys(playersData);
            for(let playerID of playersIDs) {
                updatePlayerData(playerID);
            }

            // Update next update time
            localStorage.setItem(this.clubID + '_next_asi_update', getNextTuesdayTime() + hoursToMilliseconds(APPLICATION_CONST.ASI_UPDATE_TIME));
        }

        /**
         * Requests current statistics of all players
         * @returns {Promise<{playerID: {position: string, asi: number}}>}
         */
        getAllPlayersData() {
            return new Promise((resolve, reject) => {
                $.post("https://trophymanager.com/ajax/players_get_select.ajax.php", {type: "change", club_id: this.clubID})
                .done((data) => {
                    data = JSON.parse(data);
                    let playersStatistics = {};
                    let playersIDs = Object.keys(data.post);
                    for(let id of playersIDs) {
                        // data is an object with two keys
                        //    - squad - array of objects
                        //    - post - object of objects
                        let playerData = data.post[id];
                        playersStatistics[id] = {
                            asi: playerData.asi,
                            position: playerData.fp,
                            age: {
                                years: playerData.age,
                                months: Number(playerData.months)
                            },
                            training: playerData.training_custom
                        };
                    }
                    resolve(playersStatistics);
                }).fail((error) => {
                    throw "Failed to retrieve players data: " + JSON.stringify(error);
                });
            });
        }
    }

    let TI = {
        /**
         * @param {number[]} asiHistory
         * @param {string} position
         * @returns {number[]}
         */
        calculateHistory: function(asiHistory, position) {
            let history = [];
            for(let i = 0; i < asiHistory.length - 1; ++i) {
                history.push(TI.compute(asiHistory[i], asiHistory[i + 1], position));
            }
            return history;
        },

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

    const clubID = getClubID();
    const playerID = getPlayerID();
    const playersManager = new PlayersManager(clubID);

    // Auto change update time
    playersManager.changeNextUpdateTime();

    playersManager.getAllPlayersData()
    .then((playersData) => {
        if(playersManager.getNextUpdateTime() > Date.now() && !playersManager.getPlayerPosition(playerID)) {
            playersManager.updateData(playersData, playerID);
        } else if(playersManager.getNextUpdateTime() <= Date.now()) {
            playersManager.updateData(playersData);
        }
        let asiHistory = playersManager.getHistory(playerID);
        showHistoryTable(asiHistory, TI.calculateHistory(asiHistory, playersManager.getPlayerPosition(playerID)));
        showTraining(playersData[playerID].training);
    }).catch((error) => {
        console.log(error);
    });

})();