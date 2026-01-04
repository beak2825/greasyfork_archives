// ==UserScript==
// @name            Sona Systems available studies
// @description     Hide studies with no available timeslots on sona-systems websites
// @version         1.0
// @namespace       https://www.github.com/sh0oki/sona-hider
// @source          https://www.github.com/sh0oki/sona-hider
// @include         https://*.sona-systems.com/all_exp_participant.aspx
// @copyright       2018, sh0oki
// @downloadURL https://update.greasyfork.org/scripts/374113/Sona%20Systems%20available%20studies.user.js
// @updateURL https://update.greasyfork.org/scripts/374113/Sona%20Systems%20available%20studies.meta.js
// ==/UserScript==

function mainWrapper() {
    function toggleDisplay() {
        tr_selector = $('table tbody tr:not(:has(a.btn))');
        tr_selector.toggle();
    }

    function main() {
        toggleDisplay();
        $(".m-bot15").after("<div class=\"input-group input-large m-bot15\">" + 
                            "<a href=\"#\" class=\"btn btn-primary btn-xs\" " + 
                            "onclick=\"$('table tbody tr:not(:has(a.btn))').toggle(); return false\">" + 
                            "Toggle Hidden rows</a>" + 
                            "</div>");
    }

    main();
};

$(document).ready(function() {
    mainWrapper()
});