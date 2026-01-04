// ==UserScript==
// @name         Sokker Transfer DB
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds links from the players page to Gastons Transfer DB
// @author       BlueZero
// @match        https://sokker.org/player/PID/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sokker.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481083/Sokker%20Transfer%20DB.user.js
// @updateURL https://update.greasyfork.org/scripts/481083/Sokker%20Transfer%20DB.meta.js
// ==/UserScript==

function os_parsePlayerData( data )
{
    if ( data === null ) data = doc;
    var player = {};

    player.pid = parseInt( $('a[href^="player\/PID"]', data).attr('href').split('/')[2] );
    player.age = parseInt( $('a[href^="player\/PID"]', data).parent().find('strong').html() );
    var panel = $('a[href^="player\/PID"]', data).parents('.panel');
    player.playername = $('.h5 a:eq(1)', panel).text();

    var info = $('.media ul');

    player.tid = $('li:eq(0) a[href^="app/team"]', info).attr('href').split('/')[2];
    player.country = $('li:eq(0) a[href^="country"]', info).attr('href').split('/')[2];
    player.teamname = $('li:eq(0) a[href^="app/team"]', info).text();
    player.height = $('li:eq(5) strong:eq(0)', info).text();
    player.weight = $('li:eq(5) strong:eq(1)', info).text();
    player.form = $('li:eq(3) span span', info).text().replace( /\[(.*)\]/, '$1');
    player.tactical = $('li:eq(4) span span', info).text().replace( /\[(.*)\]/, '$1');
    player.salary = $('li:eq(2) span', info).text();
    player.value = $('li:eq(1) span', info).text();
    console.log(player);
    if ( $('table strong:eq(0)', panel).length > 0 )
    {
        var srchStr = '';
        player.stamina = $('table strong:eq(0) span', panel).text().replace( /\[(.*)\]/, '$1');
        player.keeper = $('table strong:eq(1) span', panel).text().replace( /\[(.*)\]/, '$1');
        player.pace = $('table strong:eq(2) span', panel).text().replace( /\[(.*)\]/, '$1');
        player.defender = $('table strong:eq(3) span', panel).text().replace( /\[(.*)\]/, '$1');
        player.technique = $('table strong:eq(4) span', panel).text().replace( /\[(.*)\]/, '$1');
        player.playmaker = $('table strong:eq(5) span', panel).text().replace( /\[(.*)\]/, '$1');
        player.passing = $('table strong:eq(6) span', panel).text().replace( /\[(.*)\]/, '$1');
        player.striker = $('table strong:eq(7) span', panel).text().replace( /\[(.*)\]/, '$1');
    }
    return player;
}
function os_addPlayerTransfersButton()
{
    if ( $('.os_tnBTN').length == 0  )
    {
        var p = os_parsePlayerData();
        var panel = $('a[href^="player\/PID"]').parents('.panel');
        var sURL = 'https://geston.smallhost.pl/sokker/transfers_db.php?agemin='+p.age+'&agemax='+p.age+'&pacmin='+p.pace+'&pacmax='+p.pace+'&tecmin='+p.technique+'&tecmax='+p.technique+'&pasmin='+p.passing+'&pasmax='+p.passing;
        sURL += '&keemin='+p.keeper+'&keemax='+p.keeper+'&defmin='+p.defender+'&defmax='+p.defender+'&midmin='+p.playmaker+'&midmax='+p.playmaker+'&attmin='+p.striker+'&attmax='+p.striker+'&page=1';

        var sURLGK = 'https://geston.smallhost.pl/sokker/transfers_db.php?agemin='+p.age+'&agemax='+p.age+'&pacmin='+p.pace+'&pacmax='+p.pace+'&pasmin='+p.passing+'&pasmax='+p.passing;
        sURLGK += '&keemin='+p.keeper+'&keemax='+p.keeper+'&page=1';

        var sURLDEF = 'https://geston.smallhost.pl/sokker/transfers_db.php?agemin='+p.age+'&agemax='+p.age+'&pacmin='+p.pace+'&pacmax='+p.pace+'&pasmin='+p.passing+'&pasmax='+p.passing;
        sURLDEF += '&defmin='+p.defender+'&defmax='+p.defender+'&page=1';

        var sURLMID = 'https://geston.smallhost.pl/sokker/transfers_db.php?agemin='+p.age+'&agemax='+p.age+'&pacmin='+p.pace+'&pacmax='+p.pace+'&tecmin='+p.technique+'&tecmax='+p.technique+'&pasmin='+p.passing+'&pasmax='+p.passing;
        sURLMID += '&midmin='+p.playmaker+'&midmax='+p.playmaker+'&page=1';

        var sURLATT = 'https://geston.smallhost.pl/sokker/transfers_db.php?agemin='+p.age+'&agemax='+p.age+'&pacmin='+p.pace+'&pacmax='+p.pace+'&tecmin='+p.technique+'&tecmax='+p.technique;
        sURLATT += '&attmin='+p.striker+'&attmax='+p.striker+'&page=1';

        $('.h5', panel).after( '<span style="" class="os_tnBTN">TN DB: <a href="'+sURL+'" target="_blank">FULL</a> <a href="'+sURLGK+'" target="_blank">GK</a> <a href="'+sURLDEF+'" target="_blank">DEF</a> <a href="'+sURLMID+'" target="_blank">MID</a> <a href="'+sURLATT+'" target="_blank">ATT</a></span>' );
    }
}
(function() {
    'use strict';

    os_addPlayerTransfersButton()
})();