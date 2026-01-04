// ==UserScript==
// @name         AWBW capture limit
// @version      1.06
// @description  Calculate the capture limit and show it on player elements
// @author       Truniht
// @match        https://awbw.amarriner.com/game.php?games_id=*
// @icon         https://awbw.amarriner.com/terrain/ani/neutralcity.gif
// @namespace    https://awbw.amarriner.com/
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/511814/AWBW%20capture%20limit.user.js
// @updateURL https://update.greasyfork.org/scripts/511814/AWBW%20capture%20limit.meta.js
// ==/UserScript==

var displayComTowers = true;

(function() {
    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }
    addGlobalStyle(`
    .player-overview-main, .player-overview-co {height: 100%;}
    `);
    'use strict';
    var cities = document.querySelectorAll('.game-building>img:first-child[src*="city.gif"], .game-building>img:first-child[src*="hq.gif"], .game-building>img:first-child[src*="base.gif"], .game-building>img:first-child[src*="port.gif"], .game-building>img:first-child[src*="city"], .game-building>img:first-child[src*="hq_"], .game-building>img:first-child[src*="base_"], .game-building>img:first-child[src*="port_"]');
    var cityIds = [];
    for(var city of cities) cityIds.push(city.parentNode.getAttribute('data-building-id') * 1);
    var comTowers = document.querySelectorAll('.game-building>img:first-child[src*="comtower"]');
    var comTowerIDs = [];
    for(var comTower of comTowers) comTowerIDs.push(comTower.parentNode.getAttribute('data-building-id') * 1);
    if (!comTowerIDs.length) displayComTowers = false;

    var captureLimit = document.querySelectorAll('#showinfo td')[22].innerText * 1;
    if (isNaN(captureLimit)) captureLimit = 0;

    if (captureLimit) {
        var playerOverviews = document.querySelectorAll('.player-overview-container');
        var playerTables = {};
        for(var playerO of playerOverviews) {
            var ul = playerO.querySelector('.player-overview-info ul');
            var li = document.createElement('li');
            li.style.justifyContent = 'end';
            li.style.whiteSpace = 'nowrap';

            if (displayComTowers) {
                let leftDiv = document.createElement('div');
                let leftImg = document.createElement('img');
                let leftSpan = document.createElement('span');
                leftSpan.textContent = '0';
                leftDiv.appendChild(leftSpan);
                leftImg.src = 'https://awbw.amarriner.com/terrain/ani/neutralcomtower.gif';
                leftImg.style.width = '10px';
                leftImg.style.verticalAlign = 'top';
                leftImg.style.marginLeft = '3px';
                leftDiv.appendChild(leftImg);
                leftDiv.style.marginRight = 'auto';
                leftDiv.style.width = '28px';
                leftDiv.style.textAlign = 'right';
                li.appendChild(leftDiv);
            }

            let leftDiv = document.createElement('div');
            leftDiv.textContent = '0/' + captureLimit;
            li.appendChild(leftDiv);
            ul.appendChild(li);
            playerTables[playerO.id.split('player')[1]] = li;
        }

        setInterval(function() {
            var playerProperties = {};
            var playerTowers = {};
            var b = buildingsInfo;
            for(var i in b) {
                for(var z in b[i]) {
                    var building = b[i][z];
                    if (building.buildings_players_id && cityIds.includes(building.buildings_id)) {
                        playerProperties[building.buildings_players_id] = (playerProperties[building.buildings_players_id] || 0) + 1;
                    }
                    if (displayComTowers && building.buildings_players_id && comTowerIDs.includes(building.buildings_id)) {
                        playerTowers[building.buildings_players_id] = (playerTowers[building.buildings_players_id] || 0) + 1;
                    }
                }
            }

            (playerTowers[playerID] ? ' c' + playerTowers[playerID] : '');

            for(var playerID in playerTables) {
                let t = (playerProperties[playerID] || 0) + '/' + captureLimit;
                if (playerTables[playerID].dataProperties != t) {
                    playerTables[playerID].dataProperties = t;
                    playerTables[playerID].lastChild.textContent = t;
                }
                if (displayComTowers) {
                    t = (playerTowers[playerID] || 0);
                    if (playerTables[playerID].dataTowers != t) {
                        playerTables[playerID].dataTowers = t;
                        playerTables[playerID].firstChild.firstChild.textContent = t;
                    }
                }
            }
        }, 1000);
    }
})();