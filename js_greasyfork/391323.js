// ==UserScript==
// @name          DynastyScout Opposition Rankings for MyFantasyLeague.com
// @version       0.1.2
// @namespace     http://www.myfantasyleague.com
// @description   Add DynastyScout.com opposition rankings to the Submit Lineup page on MFL
// @include       http://www*.myfantasyleague.com/*/lineup*
// @include       https://www*.myfantasyleague.com/*/lineup*
// @require       http://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/391323/DynastyScout%20Opposition%20Rankings%20for%20MyFantasyLeaguecom.user.js
// @updateURL https://update.greasyfork.org/scripts/391323/DynastyScout%20Opposition%20Rankings%20for%20MyFantasyLeaguecom.meta.js
// ==/UserScript==
(function() {
    'use strict';
const ids = [];
const rowsMap = {};

$('.report tbody tr:not(.oddtablerow):not(.eventablerow):nth-of-type(1)').append("<th></th>");
$('.report tbody tr:not(.oddtablerow):not(.eventablerow):nth-of-type(2)').append("<th><a href='https://dynastyscout.danabrey.com' target='_parent'>Dynasty Scout</a> Opposition Rank</th>");

$('.report input[type=checkbox]:enabled, .report input[type=hidden]:enabled').each((i, el) => {
    ids.push(el.value);
    let $row = $(el).closest('tr');
    rowsMap[el.value] = $row;
    $row.append("<td class='dynasty-scout-rank' style='text-align: center; font-weight: bold;'></td>");
});

const generateContent = (data) => {
    return `<a style="color: white; text-decoration: none;" href="${data.link}" target="_blank">${data.opposition_rank}</a>`;
};

const rankToColour = (rank) => {
    switch(true) {
        case rank <= 6:
            return '#FF0000';
        case rank <= 12:
            return '#AB9C3A';
        case rank <= 24:
            return '#50682D';
        default:
            return '#2ECC71';
    }
};

$.post( "https://dynastyscout.danabrey.com/api/v1/mfl/opponent-ranks", JSON.stringify({ids: ids}))
    .then(
        data => {
            data.forEach(player => {
                const content = generateContent(player);
                const row = rowsMap[player.id];
                const cell = row.find('.dynasty-scout-rank');
                cell.attr('title', player.description);
                cell.css('background-color', rankToColour(player.opposition_rank));
                cell.html(content);
            });
        }
    );


})();