// ==UserScript==
// @name         Zásilkovna "Označení všech rozpracovaných"
// @namespace    mailto:azuzula.cz@gmail.com
// @version      1.0
// @description  Označí rozpracované a ze seznamu hromadných akcí vybere možnost podat vybrané
// @author       Zuzana Nyiri
// @match        https://client.packeta.com/cs/packet-drafts/list*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432040/Z%C3%A1silkovna%20%22Ozna%C4%8Den%C3%AD%20v%C5%A1ech%20rozpracovan%C3%BDch%22.user.js
// @updateURL https://update.greasyfork.org/scripts/432040/Z%C3%A1silkovna%20%22Ozna%C4%8Den%C3%AD%20v%C5%A1ech%20rozpracovan%C3%BDch%22.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var element4 = document.getElementsByClassName('happy-checkbox primary gray-border');
    if(typeof(element4[0]) != 'undefined' && element4[0] != null){
        element4[0].click();
        document.getElementById('frm-packetDraftsList-list-filter-group_action-group_action').selectedIndex = "1";
        document.getElementById('listgroup_action_submit').style.display = "initial";
        document.getElementById('listgroup_action_submit').focus();
    }
})();