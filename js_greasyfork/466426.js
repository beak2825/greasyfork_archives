// ==UserScript==
// @name         Qi/GI History
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Various scripts
// @author       You
// @match        https://footballmanagerproject.com/Team*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466426/QiGI%20History.user.js
// @updateURL https://update.greasyfork.org/scripts/466426/QiGI%20History.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(location.href.indexOf('players') === -1) {
        return;
    }

    const APPLICATION_CONST = {
        HISTORY_LENGTH: 7, // QI history length, GI history is shorter by 1
        QI_UPDATE_TIME: 5,
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
     * Displays the QI and GI history for a player
     * @param {number[]} QIHistory
     * @param {string} position
     */
    function showHistoryTable(QIHistory, GIHistory, position) {
        let containerElement = document.querySelector('.column3_a .box_body');
        let header = buildHeader();
        let box = buildBox(QIHistory,GIHistory);
        containerElement.insertBefore(header, containerElement.querySelector('h3'));
        containerElement.insertBefore(box, containerElement.querySelector('h3').nextSibling);

        function buildBox(QIHistory, GIHistory) {
            let weeksRow = document.createElement('tr');
            weeksRow.innerHTML += '<td style="min-width: 35px; max-width: 35px;"></td>';
            for(let i = 0; i < APPLICATION_CONST.HISTORY_LENGTH - 1; ++i) {
                weeksRow.innerHTML += `<td style="min-width: 62px;" class='align_center'>Week ${i + 1}</td>`;
            }

            let QIRow = document.createElement('tr');
            QIRow.classList.add('odd');
            QIRow.innerHTML += '<td>QI</td>';
            for(let i = 0; i < APPLICATION_CONST.HISTORY_LENGTH - 1; ++i) {
                QIRow.innerHTML += `<td class='align_center'>${(i < asiHistory.length ? QIHistory[i] : '-')}</td>`;
            }

            let tiRow = document.createElement('tr');
            tiRow.innerHTML += '<td>GI</td>';
            for(let i = 0; i < APPLICATION_CONST.HISTORY_LENGTH - 1; ++i) {
                GIRow.innerHTML += `<td class='align_center'>${(i < GIHistory.length ? GIHistory[i].toFixed(0) : '-')}</td>`;
            }

            let table = document.createElement('table');
            // Append rows
            table.appendChild(weeksRow);
            table.appendChild(QIRow);
            table.appendChild(GIRow);
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
            header.innerHTML = 'QI\GI History';
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
     * @returns {number} time in milliseconds representing noon on the next wednesday
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
         * @returns {number[]} QI history as array of 7 integers representing
         *    QI for last 7 weeks including current week
         */
        getHistory(playerID) {
            return JSON.parse(localStorage.getItem(this.clubID + '_' + playerID + '_QI_history')) || [];
        }

        /**
         * @returns {number} current ASIQI
         */
        getCurrent(playerID) {
            return JSON.parse(localStorage.getItem(this.clubID + '_' + playerID + '_QI_history'))[0] || null;
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
                let lastTime = Number(localStorage.getItem(this.clubID + '_next_QI_update'));
                localStorage.setItem(this.clubID + '_next_QI_update', new Date(lastTime).setUTCHours(time));
            } else {
                let lastTime = Number(localStorage.getItem(this.clubID + '_next_QI_update'));
                localStorage.setItem(this.clubID + '_next_QI_update', new Date(lastTime).setUTCHours(APPLICATION_CONST.ASI_UPDATE_TIME));
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
                history.unshift(playersData[playerID].asiQI);
                if(history.length > APPLICATION_CONST.HISTORY_LENGTH) {
                    history.pop();
                }
                // Update history
                localStorage.setItem(this.clubID + '_' + playerID + '_QI_history', JSON.stringify(history));
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
            localStorage.setItem(this.clubID + '_next_QI_update', getNextwednesdayTime() + hoursToMilliseconds(APPLICATION_CONST.ASI_UPDATE_TIME));
        }

        /**
         * Requests current statistics of all players
         * @returns {Promise<{playerID: {position: string, asi: number}}>}
         */
        getAllPlayersData() {
            return new Promise((resolve, reject) => {
                $.post("https://footballmanagerproject.com/ajax/players_get_select.ajax.php", {type: "change", club_id: this.clubID})
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
                            QI: playerData.QI,
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
         * @param {number[]} QIHistory
         * @param {string} position
         * @returns {number[]}
         */
        calculateHistory: function(QIHistory, position) {
            let history = [];
            for(let i = 0; i < QIHistory.length - 1; ++i) {
                history.push(GI.compute(asiHistory[i], QIHistory[i + 1], position));
            }
            return history;
        },

        /**
         * @param {number} QINew
         * @param {number}QIOld
         * @param {string} position
         * @returns {number} calculated GI
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
        letQIHistory = playersManager.getHistory(playerID);
        showHistoryTable(QIHistory, GI.calculateHistory(QIHistory, playersManager.getPlayerPosition(playerID)));
        showTraining(playersData[playerID].training);
    }).catch((error) => {
        console.log(error);
    });

})();