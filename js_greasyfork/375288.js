// ==UserScript==
// @name LA_tracking
// @homepage        https://greasyfork.org/ru/scripts/375288-la-tracking
// @namespace       https://greasyfork.org/ru/scripts/375288-la-tracking
// @description     Lord_Antichrist battle tracking
// @author          Kleshnerukiy
// @version         1.0
// @include         *//gray-coven.clan.su*
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/375288/LA_tracking.user.js
// @updateURL https://update.greasyfork.org/scripts/375288/LA_tracking.meta.js
// ==/UserScript==

(function () {
    var id_battle = false;
    var LA_alert = document.createElement('a');
    var div_LA_alert = document.createElement('div');
    div_LA_alert.style.position = 'absolute';
    div_LA_alert.style.top = '0px';
    div_LA_alert.style.right = '0px';

    function reloadStatus() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'http://hwmfamily.ru/coven/la_tracking.txt',
            overrideMimeType: 'text/html; charset=windows-1251',
            onload: function(resp) {

                if (resp.responseText != 'false') {
                    LA_alert.innerHTML = '<a href="https://www.heroeswm.ru/war.php?warid='+resp.responseText+'"><span style="color: #00ff00;">LA в бою!</span></a>&nbsp;';
                } else {
                    LA_alert.innerHTML = '<a href="#"><span style="color: #ff0000;">LA не в бою!</span></a>&nbsp';
                }

                document.body.appendChild(div_LA_alert);
                div_LA_alert.appendChild(LA_alert);
            }
        });
    }

    reloadStatus();
    setInterval(function() {reloadStatus();}, 30000);
})();