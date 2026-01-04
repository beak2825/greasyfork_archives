// ==UserScript==
// @name        Warlight Tournament Mass Invite
// @namespace   http://warlight.net
// @include     https://www.warzone.com/MultiPlayer/Tournaments/Forward?ID=*
// @version     0.11
// @description Invite all players with given id at once
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/36485/Warlight%20Tournament%20Mass%20Invite.user.js
// @updateURL https://update.greasyfork.org/scripts/36485/Warlight%20Tournament%20Mass%20Invite.meta.js
// ==/UserScript==

if (document.location.href.indexOf("Tournaments") > 0 && document.location.href.indexOf('MassInvitePlayers') > 0) {
    massInvitePlayers();
}
/*
http://www.warzone.com/MultiPlayer/Tournaments/Forward?ID=24523&MassInvitePlayers=6732974192;6253580632;6253580632;3
*/
function massInvitePlayers() {
    var url = document.location.href;
    var playerServerKeys = url.substring(url.indexOf('MassInvitePlayers=') + 18, url.length);
    var idsTable = playerServerKeys.split(';');
    window.onerror = null;
    window.addEventListener('error', function(obj) {
        alert(obj.message);
    });

    for (var i = 0; i < idsTable.length - 1; i++) {
        var serverKey = idsTable[i].substring(2, idsTable[i].length -2);
        window.WL_TournamentForward.InvitePlayer(serverKey, function() { });
    }
}




