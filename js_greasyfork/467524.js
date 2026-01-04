// ==UserScript==
// @name         RR Taken
// @namespace    zero.takenrr.torn
// @version      2.0
// @description  Game filter + additional information
// @author       v1 -zero [2669774] v2 Whiskey_Jack [1994581]
// @match        https://www.torn.com/page.php?sid=russianRoulette*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467524/RR%20Taken.user.js
// @updateURL https://update.greasyfork.org/scripts/467524/RR%20Taken.meta.js
// ==/UserScript==

var gamesData = {};
var audio = new Audio('https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3');

function filterAdd() {
    if ($('div[class^="titleContainer"]').length > 0) {
        var filter = `<input type="text" id="filterValue">`;
        $('div[class^="titleContainer"]').append(filter);
    } else {
        setTimeout(filterAdd, 300);
    }
}

function insert() {
    $('div[class^="rowsWrap"] > div').each(function () {
        var filterValue = $('#filterValue').val();
        if (!filterValue) {
            filterValue = 0;
        }
        filterValue = parseInt(filterValue);

        var gameDiv = $(this);
        //var starterAnchor = gameDiv.find('a.linkWrap___ZS6r9');
        var starterAnchor = gameDiv.find('.honorWrap___BHau4 a[rel="noopener noreferrer"]');
        if (starterAnchor.length > 0) {
            var startedLink = starterAnchor.attr('href');
            var userIdMatch = startedLink.match(/XID=(\d+)/);
            var userId = userIdMatch ? userIdMatch[1] : null;

            var gameId = gameDiv.attr('id');
            var gameAmount = parseInt(gameDiv.find('div[class^="betBlock"]').attr('aria-label').split(':')[1]);

            if (!Object.keys(gamesData).includes(gameId)) {
                gamesData[gameId] = [starterAnchor.text(), startedLink];
            }

            if (gameAmount < filterValue) {
                if (Object.keys(gamesData).includes(gameId)) {
                    gameDiv.hide();
                    delete gamesData[gameId];
                }
            } else {
                gameDiv.show();
            }
        } else {
            console.log("Anchor element not found for game:", gameDiv.attr('id'));
        }
    });
}

function insertData(id, resultG) {
    if (Object.keys(gamesData).includes(String(id))) {
        var userId = gamesData[id][1].split('XID=')[1];
        if (resultG == "Cancelled") {
            audio.play();
        }
        var insertD = `<a href="${gamesData[id][1]}" target="_blank">${gamesData[id][0]}</a>: ${resultG} <a href="https://www.torn.com/loader.php?sid=attack&user2ID=${userId}" target="_blank">Attack</a>`;
        console.log("Starter's profile URL:", gamesData[id][1]);
        console.log("User ID for attack:", userId);
        $($('.title-black')[1]).html(insertD);
        delete(gamesData[id]);
    }
}

(function () {
    'use strict';

    // Connect to the WebSocket
    const webSocketData = JSON.parse($('#websocketConnectionData').text());
    const socket = new WebSocket('wss://ws-centrifugo.torn.com/connection/websocket');

    // Define the event listeners for the WebSocket
    socket.onopen = function () {
        console.log('WebSocket connected');
        const data = `{"params":{"token":"${webSocketData.token}"},"id":1}`;
        socket.send(data);
        const ndata = `{"method":1,"params":{"channel":"rrLobby"},"id":2}`;
        socket.send(ndata);
    };

    socket.onmessage = function (event) {
        if (event.data) {
            var rdata = JSON.parse(event.data);
            var result = rdata.result.data.data.message.action;
            var gameResult = '';
            if (result) {
                var expiredGame = rdata.result.data.data.message.data.expiredGame;
                if (result == 'gameRemovedFromList') {
                    gameResult = 'Taken';
                    insertData(expiredGame, gameResult);
                }
                if (result == 'gameRemoved') {
                    gameResult = 'Cancelled';
                    insertData(expiredGame, gameResult);
                }
            }
        }
    };

    socket.onclose = function () {
        console.log('WebSocket closed');
    };
    filterAdd();
    setInterval(insert, 300);
})();