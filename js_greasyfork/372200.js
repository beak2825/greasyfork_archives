// ==UserScript==
// @name         Get GOAT Stats
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.torn.com/competition.php*
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.listValues
// @downloadURL https://update.greasyfork.org/scripts/372200/Get%20GOAT%20Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/372200/Get%20GOAT%20Stats.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_KEY = "8nVVZNRGEtAw8ZpX";
    const URL = "https://api.torn.com/user/";
    const SELECTIONS = "?selections=icons,basic,personalstats&key=" + API_KEY;

	const get_uid = (anchor) => {
		const match = anchor.href.match(/XID=(\d+)$/)
		return match ? match[1] : ''
	}

    async function getStats(player_id) {
        if (await isAlreadyParsed(parseInt(player_id))) {
            console.log("Already parsed");
            return;
        }

        var player_stats = {};
        console.log("Fetching data for player: " + player_id.toString());
        var REQUEST_URL = URL + player_id.toString() + SELECTIONS;

        $.ajax({
            url: REQUEST_URL,
            type: 'GET',
            success: function (response) {
                var player_stats = parsePlayerStats(response);
                player_stats.unshift(parseInt(player_id));
                saveData(player_stats);
            }
        });

        
    }

    function parsePlayerStats(json) {
        var output = [];
        if (json.hasOwnProperty("personalstats")) {
            var personal_stats = json.personalstats;

            var xanax_taken = json.personalstats.xantaken;
            var statenhancersused = json.personalstats.statenhancersused;
            var refills = json.personalstats.refills;
            var daysbeendonator = json.personalstats.daysbeendonator;
            output.push(xanax_taken === undefined ? 0 : xanax_taken);
            output.push(statenhancersused === undefined ? 0 : statenhancersused);
            output.push(refills === undefined ? 0 : refills);
            output.push(daysbeendonator === undefined ? 0 : daysbeendonator);
        }

        return output;
    }

    function saveData(player_stats) {
        // save using GM.setValue
        if (player_stats.length == 5) {
            GM.setValue(player_stats[0], JSON.stringify(player_stats));
        } else {
            console.log("Save data error. Not enough stats");
        }
    }

    async function isAlreadyParsed(player_id){
        // check GM. storage here
        // either using GM.getValue or GM.listValues (whichever is better)
        let player_stats = await GM.getValue(player_id, null);
        return player_stats;
    }


    function getPlayers(list) {
        var players = []
        for (const node of list.children) {
            const id = get_uid(node.querySelector('.user.name'))
            players.push(id);
        }

        var time_delay = 600;
        for (var i = 0; i < players.length; i++) {
            (function (i) {
                setTimeout(function () {
                    getStats(players[i]);
                }, time_delay * i);
            })(i);
        }
    }

    /* Enable this to start fecthing player stats and storing into GM storage */
    /*
    const wrapper = document.getElementById('competition-wrap')
    // Your code here...
        const observer = new MutationObserver(function (mutations) {
            const loaded = mutations.some((mutation) => {
                for (const node of mutation.addedNodes) {
                    if (node.classList && node.classList.contains('team-list-wrap')) {
                        return true
                    }
                }
            })

            if (loaded) {
                const list = wrapper.querySelector('.competition-list')
                getPlayers(list)
            }
        });

	observer.observe(wrapper, { childList: true });
    */

    /* Enable this after fecthing all player stats to print out a full array of stats */
    async function getValues() {
        let values = await GM.listValues();

        var output = [];
        for (var i = 0; i < values.length; i++) {
            var player_stats = await GM.getValue(values[i]);
            output.push(JSON.parse(player_stats));
        }

        console.log(output);
    }

    getValues();
})();