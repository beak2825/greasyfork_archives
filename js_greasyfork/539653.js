// ==UserScript==
// @name        PeeJJK Scout Page - Tag Buttons
// @include     https://glb.warriorgeneral.com/game/scout_team.pl?team_id=*
// @require     https://greasyfork.org/scripts/12092-jquery-javascript-library-v1-4-2/code/jQuery%20JavaScript%20Library%20v142.js?version=71384
// @description Custom Tagger
// @version     1.1
// @namespace https://greasyfork.org/users/1445018
// @downloadURL https://update.greasyfork.org/scripts/539653/PeeJJK%20Scout%20Page%20-%20Tag%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/539653/PeeJJK%20Scout%20Page%20-%20Tag%20Buttons.meta.js
// ==/UserScript==

var alt1 = $(".alternating_color1, .alternating_color2");

$('.small_head').first().append('<br><input id="clickMe1" type="button" value="Tag All" onclick="tagAll();" />');
var el1 = document.getElementById("clickMe1");
if (el1.addEventListener) {
    el1.addEventListener("click", tagAll, false);
} else if (el1.attachEvent) {
    el1.attachEvent('onclick', tagAll);
}

function tagAll(){
    for (var i = 0; i < alt1.length; i++) {
        var href = alt1[i].getElementsByTagName("a")[0].href.substr(56,7);
        var archetype = alt1[i].getElementsByTagName("img")[0].src.substr(54);
        if ( archetype == 'qb_deep_passer.png' ){ archetype = 'passer'; }
        if ( archetype == 'qb_pocket_passer.png' ){ archetype = 'passer'; }
        if ( archetype == 'qb_scrambler.png' ){ archetype = 'rusher'; }
        if ( archetype == 'hb_elusive_back.png' ){ archetype = 'rusher'; }
        if ( archetype == 'hb_power_back.png' ){ archetype = 'power'; }
        if ( archetype == 'hb_scat_back.png' ){ archetype = 'receiver'; }
        if ( archetype == 'hb_combo_back.png' ){ archetype = 'rusher'; }
        if ( archetype == 'hb_returner.png' ){ archetype = 'rusher'; }
        if ( archetype == 'fb_blocker.png' ){ archetype = 'blocker'; }
        if ( archetype == 'fb_scat_back.png' ){ archetype = 'receiver'; }
        if ( archetype == 'fb_combo_back.png' ){ archetype = 'rusher'; }
        if ( archetype == 'fb_rusher.png' ){ archetype = 'rusher'; }
        if ( archetype == 'fb_special_teamer.png' ){ archetype = 'blocker'; }
        if ( archetype == 'te_blocker.png' ){ archetype = 'blocker'; }
        if ( archetype == 'te_receiver.png' ){ archetype = 'receiver'; }
        if ( archetype == 'te_dual_threat.png' ){ archetype = 'none'; }
        if ( archetype == 'te_power_receiver.png' ){ archetype = 'none'; }
        if ( archetype == 'te_special_teamer.png' ){ archetype = 'blocker'; }
        if ( archetype.substr(0,2) == 'wr' ){ archetype = 'none'; }
        if ( archetype.substr(0,2) == 'c_' ){ archetype = 'blocker'; }
        if ( archetype.substr(0,2) == 'g_' ){ archetype = 'blocker'; }
        if ( archetype.substr(0,2) == 'ot' ){ archetype = 'blocker'; }

        // check for rush QBs
        var passYards = alt1[i].getElementsByTagName("td")[6].innerText;
        var rushYards = alt1[i].getElementsByTagName("td")[13].innerText;
        if ( archetype == 'passer' && rushYards > passYards ) { archetype = 'rusher'; }

        if ( archetype == 'passer') { processPasserTag(href); }
        if ( archetype == 'rusher') { processRusherTag(href); }
        if ( archetype == 'power') { processPowerTag(href); }
        if ( archetype == 'receiver') { processReceiverTag(href); }
        if ( archetype == 'blocker') { processBlockerTag(href); }
        if ( archetype == 'clear') { processClearTag(href); }
        $('.small_head').html('<h1>TAGGING...PLEASE WAIT</h1>');

        setTimeout(location.reload.bind(location), 2500);
    }
}

for (var i = 0; i < alt1.length; i++) {
    var altClass = alt1[i].className;
    var archetype = alt1[i].getElementsByTagName("img")[0].src.substr(54);
    if ( archetype == 'qb_deep_passer.png' ){ archetype = 'passer'; }
    if ( archetype == 'qb_pocket_passer.png' ){ archetype = 'passer'; }
    if ( archetype == 'qb_scrambler.png' ){ archetype = 'rusher'; }
    if ( archetype == 'hb_elusive_back.png' ){ archetype = 'rusher'; }
    if ( archetype == 'hb_power_back.png' ){ archetype = 'power'; }
    if ( archetype == 'hb_scat_back.png' ){ archetype = 'receiver'; }
    if ( archetype == 'hb_combo_back.png' ){ archetype = 'rusher'; }
    if ( archetype == 'hb_returner.png' ){ archetype = 'rusher'; }
    if ( archetype == 'fb_blocker.png' ){ archetype = 'blocker'; }
    if ( archetype == 'fb_scat_back.png' ){ archetype = 'receiver'; }
    if ( archetype == 'fb_combo_back.png' ){ archetype = 'rusher'; }
    if ( archetype == 'fb_rusher.png' ){ archetype = 'rusher'; }
    if ( archetype == 'fb_special_teamer.png' ){ archetype = 'blocker'; }
    if ( archetype == 'te_blocker.png' ){ archetype = 'blocker'; }
    if ( archetype == 'te_receiver.png' ){ archetype = 'receiver'; }
    if ( archetype == 'te_dual_threat.png' ){ archetype = 'none'; }
    if ( archetype == 'te_power_receiver.png' ){ archetype = 'none'; }
    if ( archetype == 'te_special_teamer.png' ){ archetype = 'blocker'; }
    if ( archetype.substr(0,2) == 'wr' ){ archetype = 'none'; }
    if ( archetype.substr(0,2) == 'c_' ){ archetype = 'blocker'; }
    if ( archetype.substr(0,2) == 'g_' ){ archetype = 'blocker'; }
    if ( archetype.substr(0,2) == 'ot' ){ archetype = 'blocker'; }
    var href = alt1[i].getElementsByTagName("a")[0].href.substr(56,7);
    var $tr = $('<tr id='+href+' class="button_row"></tr>');
    var emptyTd = '';
    for (var f = 0; f < alt1[i].childElementCount-2; f++) {
        emptyTd += "<td></td>"; // empty td to fill rest of row, for background color
    }
    var $button = $(
        '<td></td>' +
        '<td class="buttons_container"><input type="button" value="Passer" onclick="processPasserTag('+href+');" />' +
        '<input type="button" value="Rusher" onclick="processRusherTag('+href+');" />' +
        '<input type="button" value="Power" onclick="processPowerTag('+href+');" />' +
        '<input type="button" value="Receiver" onclick="processReceiverTag('+href+');" />' +
        '<input type="button" value="Blocker" onclick="processBlockerTag('+href+');" />' +
        '<input type="button" value="Clear" onclick="processClearTag('+href+');" />' +
        '</td>' + emptyTd
    );
    var $button2 = $(
        '<td></td>' +
        '<td class="buttons_container2"><input type="button" value="Passer" onclick="processPasserTag('+href+');" />' +
        '<input type="button" value="Rusher" onclick="processRusherTag('+href+');" />' +
        '<input type="button" value="Power" onclick="processPowerTag('+href+');" />' +
        '<input type="button" value="Receiver" onclick="processReceiverTag('+href+');" />' +
        '<input type="button" value="Blocker" onclick="processBlockerTag('+href+');" />' +
        '<input type="button" value="Clear" onclick="processClearTag('+href+');" />' +
        '</td>' + emptyTd
    );

    $tr.insertAfter(alt1[i]);
    if(altClass=='alternating_color1'){
        $('#'+href).html($button);
    } else {
        $('#'+href).html($button2);
    }
}

var tag = document.createElement("script");
tag.text =
    "function processPasserTag(id) { generalHTTPSend('/game/scout_team.pl?team_id=' + team_id + '&m=tag&player_id=' + id + '&for_team_id=' + for_team_id + '&tag=passer');}" +
    "function processRusherTag(id) { generalHTTPSend('/game/scout_team.pl?team_id=' + team_id + '&m=tag&player_id=' + id + '&for_team_id=' + for_team_id + '&tag=rusher');}" +
    "function processPowerTag(id) {	generalHTTPSend('/game/scout_team.pl?team_id=' + team_id + '&m=tag&player_id=' + id + '&for_team_id=' + for_team_id + '&tag=power');}" +
    "function processReceiverTag(id) { generalHTTPSend('/game/scout_team.pl?team_id=' + team_id + '&m=tag&player_id=' + id + '&for_team_id=' + for_team_id + '&tag=receiver');}" +
    "function processBlockerTag(id) { generalHTTPSend('/game/scout_team.pl?team_id=' + team_id + '&m=tag&player_id=' + id + '&for_team_id=' + for_team_id + '&tag=blocker');}" +
    "function processClearTag(id) {	generalHTTPSend('/game/scout_team.pl?team_id=' + team_id + '&m=tag&player_id=' + id + '&for_team_id=' + for_team_id + '&tag=none');}";
document.getElementsByTagName("body")[0].appendChild(tag);


$('.buttons_container input').css({"padding":"2px","margin-right":"2px"});
$('.buttons_container2 input').css({"padding":"2px","margin-right":"2px"});
$('.buttons_container').css({"padding-bottom":"5px"});
$('.buttons_container2').css({"padding-bottom":"5px"});
$('.buttons_container').parent().css({"background":"white"});
