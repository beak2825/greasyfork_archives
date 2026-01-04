// ==UserScript==
// @name         Better Userlist in Webcamdarts-Lobby
// @version      1.01
// @description  Sort and search for players by avg and status
// @description  Add favorites by right mouseclick
// @description  Show latest matches against opponent in chat.
// @author       benebelter1887
// @match        https://www.webcamdarts.com/GameOn/Lobby
// @require      https://code.jquery.com/ui/1.10.4/jquery-ui.js
// @grant        GM.getValue
// @grant        unsafeWindow
// @grant        GM.xmlHttpRequest
// @namespace	 https://wda.hhedl.de/better_userlist.user.js
// @downloadURL https://update.greasyfork.org/scripts/405707/Better%20Userlist%20in%20Webcamdarts-Lobby.user.js
// @updateURL https://update.greasyfork.org/scripts/405707/Better%20Userlist%20in%20Webcamdarts-Lobby.meta.js
// ==/UserScript==

(function() {
 'use strict';
/* globals $ */

function load() {

    GM.xmlHttpRequest({
        method: "GET",
        async: false,
        url: "https://wda.hhedl.de/userlist_generator.php?status=1&sort=1",
         onload : function(response) {

            if (this.readyState == 4 && this.status == 200) {

           setTimeout(() => {$( "#newplayerlist" ).html(response.responseText); }, 1000);
            }
        }
    });

}

$( '<div id="newplayerlist"  style="background-color: white;">Loading playerlist...</div>' ).css({
    position: "absolute",
    width: "100%",
    height: "100%",
    left: 5,
    top: 100,
    zIndex: 1
}).appendTo($("#current-user").css("position", "relative"));

load();
  })();