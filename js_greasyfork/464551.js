// ==UserScript==
// @name         ylPlayersViewerPlus
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  displays player skills on player page (if monitored)
// @author       kostrzak16
// @match        https://www.managerzone.com/?p=players&pid=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=managerzone.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464551/ylPlayersViewerPlus.user.js
// @updateURL https://update.greasyfork.org/scripts/464551/ylPlayersViewerPlus.meta.js
// ==/UserScript==

(function () {
    'use strict';
    if ($(".player_icon_image[style*='monitor_remove.png'], .monitor_remove_link").length >= 1) {
        loadPlayer();
    }
    else {
        $(".player_icon_image[style*='monitor.png'], .monitor_add_link").click(function () {
            setTimeout(function () { loadPlayer(); }, 500);
        });
    };

})();

function loadPlayer() {
    if ($('.special_player').length == 0)
        return;

    var TcSpan = $('span[style*="icon_trainingcamp"]').closest(".player_icon_placeholder");
    var InjurySpan = $('[style*="injury_icon.png"]').closest(".player_icon_placeholder");

    var shortlist = "https://www.managerzone.com/?p=shortlist";
    var pid = extractPlayerId();

    if (pid == "")
        return;

    $.ajax({
        url: shortlist,
        type: 'GET',
        success: function (data) {
            var playerDiv = jQuery(data).find('span[id$="id_' + pid + '"]').closest(".playerContainer");
            var playerDiv$ = playerDiv.clone();
            playerDiv$.find("p").remove();
            playerDiv$.find('.p_links:first').append(TcSpan).append(InjurySpan);
            $(".playerContainer").html(playerDiv$.html());

            if ($("#gw_run").length > 0) //chinease extension
                $("#gw_run").click();
        },
        error: function () {
            console.log('Error loading ' + shortlist);
        }
    });
}
function extractPlayerId() {
    var pid = "";
    var urlParams = new URLSearchParams(new URL(window.location.href).search)
    if (urlParams.has('pid')) {
        pid = urlParams.get('pid');
    }
    return pid;
}

function sortPlayersTable(){
 $('#playerAltViewTable tbody tr').sort(function(a, b) {
    return +$('td:eq(2)', b).text().replace("EUR","").replace(' ','').replace(/\s/g, '').localeCompare(+$('td:eq(2)', a).text().replace("EUR","").replace(/\s/g, ''),undefined, {'numeric': true} );
  }).appendTo('#playerAltViewTable');
}