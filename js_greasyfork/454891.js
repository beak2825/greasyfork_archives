// ==UserScript==
// @name         Tools4Torn
// @namespace    namespace
// @version      0.5
// @description  description
// @author       Legaci
// @match        *.torn.com/*
// @grant        GM_xmlhttpRequest
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/454891/Tools4Torn.user.js
// @updateURL https://update.greasyfork.org/scripts/454891/Tools4Torn.meta.js
// ==/UserScript==

GM_xmlhttpRequest ( {
    method:     "POST",
    url:        "https://www.torn.com/sidebarAjaxAction.php?q=getSidebarData",
    onload:     function (response) {
        const data = JSON.parse(response.response);

        const XanaxData = data.statusIcons.icons.drug_cooldown;

        var today = new Date();
        var cooldown = new Date(XanaxData.timerExpiresAt * 1000);
        var diffMs = (cooldown - today); // milliseconds between now
        var diffDays = Math.floor(diffMs / 86400000); // days
        var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
        var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes

        var box = '<div style="height:30px; display:block;">Xanax Cooldown Ends in: '+diffHrs + ' hours, ' + diffMins + ' minutes </div>';

        $( ".content-title" ).prepend( box );
    }
});