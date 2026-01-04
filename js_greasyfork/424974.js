// ==UserScript==
// @name         PowerBI Full Screen Mode (On Prem Only)
// @version      1.0
// @description  Create a Menu Item Link to Trigger Full Screen Mode
// @author       Aerocream@Gmail.com
// @match        https://<YourServer>
// @grant        none
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @require      https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012

// @namespace https://greasyfork.org/users/694988
// @downloadURL https://update.greasyfork.org/scripts/424974/PowerBI%20Full%20Screen%20Mode%20%28On%20Prem%20Only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/424974/PowerBI%20Full%20Screen%20Mode%20%28On%20Prem%20Only%29.meta.js
// ==/UserScript==
waitForKeyElements ("#main > div > div > nav > div > pbix-toolbar > ul", actionFunction);

function actionFunction (jNode) {
    var url = window.location.href;
    var embedurl = url + "?rs:embed=true";
    $('#main > div > div > nav > div > pbix-toolbar > ul').append('<li class="nav-pbi-refresh"><a id="embedveiw"><span>↕️ Enable Full Browser Mode</span></a></li>');
    $("#embedveiw").click(function() {
        location.href = embedurl;
    });
};