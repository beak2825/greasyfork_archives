// ==UserScript==
// @name         Elimination Team Members Colector
// @namespace    ElimintaionTeamMemebersColector
// @version      0.1
// @description  Collect elimination team members
// @author       Jox [1714547]
// @match        *://*.torn.com/competition.php*
// @grant        GM_xmlhttpRequest
// @connect      nukefamily.org
// @downloadURL https://update.greasyfork.org/scripts/432230/Elimination%20Team%20Members%20Colector.user.js
// @updateURL https://update.greasyfork.org/scripts/432230/Elimination%20Team%20Members%20Colector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function isListOfPlayers(node) {
        return node.classList !== undefined &&
            (node.classList.contains('team-list-wrap') /*||
             node.classList.contains('revenge-wrap')*/);
    }

    function applyFilter() {
        let playerList = document.querySelector('.competition-list');

        let PlayerList = [];
        let team = document.querySelector('#competition-wrap .competition-msg .text strong').innerHTML.replaceAll("'", "");

        for (let player of playerList.children) {
            /*
            if (shouldHide(filterOptions, player)) {
                hide(player);
            } else {
                show(player);
            }
            */
            let spanName = player.querySelector('.t-show .user.name span');
            let fullName = spanName.title;
            var re = /(\S+) ?\[(\d+)\]/gm;
            var nameParsed = fullName.split(re);

            PlayerList.push({
                id: nameParsed[2],
                name: nameParsed[1],
                team: team
            })
        }

        //console.log(PlayerList);
        SendData(PlayerList);
    }

    function SendData(data){
        //var data = {uid: PlayerID, Player: PlayerName, Faction: faction, Country: Country.title, Premium: premium};

        GM_xmlhttpRequest ( {
            method:     'POST',
            url:        'https://www.nukefamily.org/dev/elimination2021.php',
            data:       JSON.stringify(data),
            onload:     function (responseDetails) {
                // DO ALL RESPONSE PROCESSING HERE...
                console.log(responseDetails, responseDetails.responseText);
                //alert(responseDetails.responseText);
            }
        });
    }

    function watchForPlayerListUpdates() {
        let target = document.getElementById('competition-wrap');
        let observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                let doApplyFilter = false;
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    if (isListOfPlayers(mutation.addedNodes.item(i))) {
                        doApplyFilter = true;
                        break;
                    }
                }
                if (doApplyFilter) {
                    applyFilter();
                }
            });
        });
        // configuration of the observer:
        let config = { attributes: true, childList: true, characterData: true };
        // pass in the target node, as well as the observer options
        observer.observe(target, config);
    }
    watchForPlayerListUpdates();
})();