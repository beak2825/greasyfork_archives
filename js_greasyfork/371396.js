// ==UserScript==
// @name         Neoboard Post Remover
// @namespace    https://greasyfork.org/en/users/200321-realisticerror
// @version      1.71
// @description  Remove a players posts from your screen.
// @author       RealisticError
// @match        http://www.neopets.com/neoboards/*
// @exclude      http://www.neopets.com/neoboards/preferences.phtml*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371396/Neoboard%20Post%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/371396/Neoboard%20Post%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var playerToMute = ["user", "name"]; // Type the username of the players to mute here. eg. ["user", "name"] will mute the players named user and name
    var removePC = false;
    var removeBoards = false;

    for(var i=0; i < playerToMute.length; i++) {

        if(window.location.pathname === "/neoboards/topic.phtml") {
            var userInformationArea = $( "a:contains(" + playerToMute[i] + ")" ).parent().parent();

            var userMessageArea = $( "a:contains(" + playerToMute[i] + ")" ).parent().parent().next();

            userInformationArea.hide();
            userMessageArea.hide();

        }

        if(window.location.pathname === "/neoboards/boardlist.phtml" && removeBoards) {

            $("b:contains(" + playerToMute[i] + ")").parent().parent().parent().parent().hide()

        }

    };

    if(window.location.href === 'http://www.neopets.com/neoboards/index.phtml' && removePC) {

        $('#content > table > tbody > tr > td.content > div:nth-child(11) > table > tbody > tr:nth-child(18)').hide();
    }
})();

