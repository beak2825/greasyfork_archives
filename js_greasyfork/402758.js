// ==UserScript==
// @name            Assist JIRA
// @description     Search Assist ticket with a click
// @version         0.1
// @author          Hazwan
// @icon            https://www.adaptavist.com/assets/Uploads/adaptavist-icon.png
// @include         *
// @grant           GM_openInTab
// @run-at          context-menu
// @namespace       https://greasyfork.org/users/519040
// @downloadURL https://update.greasyfork.org/scripts/402758/Assist%20JIRA.user.js
// @updateURL https://update.greasyfork.org/scripts/402758/Assist%20JIRA.meta.js
// ==/UserScript==]]]]


(function() {
    //alert("test");
    //'use strict';
    var sel = document.getSelection ();
    console.log(sel);
    GM_openInTab('https://assist.adaptavist.com/issues/?jql=summary~'+sel);
})();