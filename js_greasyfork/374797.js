// ==UserScript==
// @name            WME InfoU (Beta)
// @version         1.0
// @description     Gives interesting information about the server and is able to warn when you have been banned and none of your edits will be counted.
// @author          santyg2001
// @match           https://www.waze.com/*editor*
// @exclude         https://www.waze.com/*user/*editor/*
// @license         GNU GPLv3
// @icon            https://raw.githubusercontent.com/santy2001/Check-User-Status/master/JIKOE6W.png
// @require         https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @namespace https://greasyfork.org/users/228369
// @downloadURL https://update.greasyfork.org/scripts/374797/WME%20InfoU%20%28Beta%29.user.js
// @updateURL https://update.greasyfork.org/scripts/374797/WME%20InfoU%20%28Beta%29.meta.js
// ==/UserScript==

/* global W        */
/* global $        */
/* global WazeWrap */
(function() {
    'use strict';
    var LUname = 0

function cargarDatos(){
var principal = W.loginManager.user.mapEditingBanned;

console.log('InfoU: El valor arrojado al consultar es ' + principal)
        if (!principal) {
            console.log('InfoU: Paso 1 Listo - Checkar. Todo está bien no posee bloqueo el usuario.');
        } else {
            alert(blocked);
            console.log('InfoU: Paso 2 Listo - Checkar. Aviso enviado al usuario.');
        };
}
/*
ESPACIO PARA STRINGS LOCALIZABLES CON SWITCH


var LUname = "User Name"
var LRank = "Editor Level"
var LStateId = "State ID"
var LAm = "Area Manager"
var LUId = "User ID"
var LGlobalE = "Global Editor"
var LChatBanned = "Chat Banned"
var LSegmentDel = "Limited Segment Deletions"
var LStreetChanges = "Street Changes"

//Fin LOC

*/



//Falta definir Blocked

function init() //Thanks to WazeDev
    {
        var $section = $("<div>");
        $section.html([
            //Enter all your HTML code you want below
            //S = String, U = User
            '<div>',
            '<h3>User Info</h3></br>',
            `${LUname}: <span id="SUName"></span></br>`,
            `${LRank}: <span id="SRank"></span></br>`,
            `${LStateId}: <span id="SStateId"></span></br>`,
            `${LAm}: <span id="SArea_Manager"></span></br>`,
            `${LUId}: <span id="SUId"></span></br>`,
            `${LGlobalE}: <span id="SGlobalE"></span></br>`,
            `${LChatBanned}: <span id="SChatBanned"></span>`,
            `${LSegmentDel}: <span id="SSegmentDel"></span>`,
            `${LStreetChanges}: <span id="SStreetChanges"></span>`,
            '</div>'

            /* 
            U Name
            U Rank
            State ID:
            Are Manager 
            Id Usuario
            Global Editor 
            Chat Banned
            MaxAllowedSegmentDeletions
            MaxAllowedStreetNamesChanges
            */

        ].join(' '));

        new WazeWrap.Interface.Tab('InfoU', $section.html(), initializeSettings);
    }

    function initializeSettings()
    {
        $('#SUName').text(W.loginManager.user.userName);
        $('#SRank').text(W.loginManager.user.normalizedLevel);
        $('#SStateId').text(W.loginManager.user.state);
        $('#SArea_Manager').text(W.loginManager.user.isAreaManager);
        $('#SUId').text(W.loginManager.user.id);
        $('#SGlobalE').text(W.loginManager.user.globalEditor);
        $('#SChatBanned').text(W.loginManager.user.chatBanned);
        $('#SSegmentDel').text(W.serverConfig.maxAllowedSegmentDeletions);
        $('#SStreetChanges').text(W.serverConfig.maxAllowedStreetNamesChanges);
    }
    function bootstrap() {
        if (W && W.loginManager && W.loginManager.isLoggedIn()) {
            init();
            cargarDatos();
            const scriptname = GM_info.script.name
            console.log(scriptname, 'Initialized');
        } else {
            console.log(scriptname, 'Bootstrap failed.  Trying again...');
            window.setTimeout(() => bootstrap(), 500);
        };
    };
    setTimeout(bootstrap, 5000);
    // - - - //
})();

