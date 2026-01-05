// ==UserScript==
// @name         Set the Ottawa Traveller's upcoming games team to Broadhead Brewsers
// @namespace    http://timpartridge.ca
// @version      0.3
// @description  Sets the default team for Ottawa Travellers upcoming games table to "Broadhead Brewsers" instead of showing all teams by default.
// @author       You
// @match        https://ottawatravellers.ca/*/upcoming-games/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30027/Set%20the%20Ottawa%20Traveller%27s%20upcoming%20games%20team%20to%20Broadhead%20Brewsers.user.js
// @updateURL https://update.greasyfork.org/scripts/30027/Set%20the%20Ottawa%20Traveller%27s%20upcoming%20games%20team%20to%20Broadhead%20Brewsers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Set the team name here

    var teamName = 'Broadhead Brewsers';

    // Do not change anything below this line

    selectTeam(teamName);

    function selectTeam(team) {
        var teamFilter = $('#filterByTeam');
        if (teamFilter) {
            teamFilter.val(team).change();
        }
    }
})();