// ==UserScript==
// @name         Super Sneaky Market Spy
// @namespace    com.anwinity.dh3
// @version      1.1.2
// @description  Sneak
// @author       Anwinity
// @match        dh3.diamondhunt.co
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418522/Super%20Sneaky%20Market%20Spy.user.js
// @updateURL https://update.greasyfork.org/scripts/418522/Super%20Sneaky%20Market%20Spy.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const playerMap = {};
    $.get("https://anwinity.com/dh3/data/player_ids_a.json.txt", function(resp) {
        resp = JSON.parse(resp);
        Object.keys(resp).forEach((username) => {
            playerMap[resp[username]] = username;
        });

        const oldPopulateMarketTable = window.populateMarketTable;
        window.populateMarketTable = function() {
            oldPopulateMarketTable.apply(this, arguments);
            $("table#market-table > tbody > tr.tr-hover").each(function(rowIndex) {
                let row = $(this);
                let onclick = row.attr("onclick");
                if(onclick) {
                    let playerId = onclick.match(/purchaseFromMarket\("(\d+)/)[1];
                    let nameColumn = row.find("td:first-child");
                    if(playerMap[playerId]) {
                        let username = playerMap[playerId];
                        nameColumn.html(`${nameColumn.text()}<br /><span oncontextmenu="$('.chat-area-input').val('/pm ${username} '); return false;" style="color; gray">${username}</span>`);
                    }
                    else {
                        nameColumn.html(`${nameColumn.text()}<br /><span style="color; gray">(unknown)</span>`);
                    }
                }
            });
        };
    });
})();