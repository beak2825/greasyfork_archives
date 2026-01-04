// ==UserScript==
// @name         AWBW Live league ELO
// @namespace    https://awbw.amarriner.com/
// @version      1.12
// @description  Display ELO in live league next to player name (updated every 10 minutes)
// @author       Truniht
// @match        https://awbw.amarriner.com/game.php?games_id=*
// @icon         https://awbw.amarriner.com/favicon.ico
// @grant        GM.xmlHttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/485589/AWBW%20Live%20league%20ELO.user.js
// @updateURL https://update.greasyfork.org/scripts/485589/AWBW%20Live%20league%20ELO.meta.js
// ==/UserScript==

(function() {
    var gameName = document.querySelector(".game-header-header a").textContent;
    if (!gameName.startsWith('Live League')) return; //Not a live league game

    var mode = gameName.substring(gameName.length - 4, gameName.length - 1);
    if (mode == ' hf') mode = 'hf';
    if (mode != 'std' && mode != 'fog' && mode != 'hf') return;

    var playerEloData = GM_getValue('AWBWeloCache');

    function sortObject(o, sortFunction) {
        var keys = Object.keys(o).sort(sortFunction);
        var newO = {};
        for(var key of keys) newO[key] = o[key];
        return newO;
    }

    function updateAllRanks() {
        updateRanks('std');
        updateRanks('fog');
        updateRanks('hf');
    }

    function updateRanks(modeName) {
        var sorted = sortObject(playerEloData.data, function(a, b) {
            return b[modeName] - a[modeName];
        });

        var i = 0;
        for(var name in sorted) {
            i++;
            playerEloData.data[name][modeName+'rank'] = i;
        }
    }

    function addRanks(modeName, players) {
        players.sort(function(a, b) {
            return b[modeName] - a[modeName];
        });
        var i = 0;
        for(var player of players) {
            i++;
            playerEloData.data[player.name][modeName+'rank'] = i;
        }
    }

    function updateEloCache() {
        GM.xmlHttpRequest({
            method: "POST",
            data: '{"method":"leaderboard","filter":"all"}',
            url: 'https://awbw.amarriner.com/api/live/standings.php',
            responseType: 'json',
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            onload: function(response) {
                var players = response.response.players;
                playerEloData = {data: {}};
                for(var player of players) playerEloData.data[player.name] = player;
                addRanks('std', players);
                addRanks('fog', players);
                addRanks('hf', players);
                playerEloData.lastUpdate = Date.now();
                playerEloData.version = 1.11;
                updatePlayerEle(true);
                GM_setValue('AWBWeloCache', playerEloData);
            }
        });
    }

    if (!playerEloData || playerEloData.version != 1.11 || Date.now() - playerEloData.lastUpdate > 600000) updateEloCache();

    var playerList = document.querySelectorAll(".player-username a");
    function updatePlayerEle(force) {
        if (!playerEloData) return;
        for(var player of playerList) {
            var name = (player.dataName || (player.dataName = player.title)).trim();
            var targetName = name + (playerEloData.data[name] && playerEloData.data[name][mode] ?
                                     ' <span style="white-space: nowrap;">(' + playerEloData.data[name][mode] + ' #' + playerEloData.data[name][mode+'rank'] + ')</span>' :
                                     ' (-)');
            if (targetName === player.innerHTML) continue;
            player.innerHTML = targetName;
        }
    }

    var observer = new MutationObserver(function() {updatePlayerEle();});

    var config = {
        childList: true,
        subtree: true
    };

    playerList.forEach(e => observer.observe(e, config));
    updatePlayerEle(true);
})();