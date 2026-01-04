// ==UserScript==
// @name         Torrent Galaxy - lobby chat AJAX fix
// @namespace    NotNeo
// @version      0.1
// @description  Fixes a problem where posting a new message would cause the chat page to load to the current tab, instead of the message just being sent via AJAX like it should be
// @author       NotNeo
// @match        https://torrentgalaxy.to/lobby.php
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418371/Torrent%20Galaxy%20-%20lobby%20chat%20AJAX%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/418371/Torrent%20Galaxy%20-%20lobby%20chat%20AJAX%20fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(function() {
        $("#chatform").submit(function(e){
            e.preventDefault();
            e.stopPropagation();
            $.post('/galaxychat.php', {'bbinput': $("#bbinput").val()});
            $("#bbinput").val("").focus();
            setTimeout(function () {
                $( "#inner" ).load( "/galaxychat.php" );
            }, 500);
        });
    });
})();