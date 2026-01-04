// ==UserScript==
// @name         Enhanced Slither.io Leaderboard
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Displays own Data on leaderboard!
// @author       KanjiasDev
// @match        http://slither.io/
// @icon         https://www.google.com/s2/favicons?domain=slither.io
// @grant        none
// @license GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @downloadURL https://update.greasyfork.org/scripts/427588/Enhanced%20Slitherio%20Leaderboard.user.js
// @updateURL https://update.greasyfork.org/scripts/427588/Enhanced%20Slitherio%20Leaderboard.meta.js
// ==/UserScript==

/* global snake */

(function() {
    'use strict';

    function updateLeaderBoard() {
        if (!window.snake) return;

        var nsiElements = document.getElementsByClassName("nsi");

        if (!nsiElements.item(39).firstElementChild) return; // abort when too early

        var length = getLength();
        var rank = getRank();
        var nick = getNick();

        if (rank < 11) return; // abort if already on leaderboard

        if (document.getElementById("usPointsLeaderboard")) {
            document.getElementById("usPointsLeaderboard").innerHTML = "<div id='usPointsLeaderboard'>" + length + "</div>";
            document.getElementById("usNickLeaderboard").innerHTML = "<div id='usNickLeaderboard'>" + nick + "</div>";
            document.getElementById("usRankLeaderboard").innerHTML = "<div id='usRankLeaderboard'>#" + rank + "</div>";
        } else {
            nsiElements.item(36).innerHTML += "<div id='usPointsLeaderboard'>" + length + "</div>";
            nsiElements.item(37).innerHTML += "<div id='usNickLeaderboard'>" + nick + "</div>";
            nsiElements.item(38).innerHTML += "<div id='usRankLeaderboard'>#" + rank + "</div>";
        }
    }

    function getLength() {
        var nsiElements = document.getElementsByClassName("nsi");

        var length = nsiElements.item(39).firstElementChild.innerText.match(/([0-9])+/g);
        return length;
    }

    function getNick() {
        if (!window.my_nick) return;


        return my_nick;
    }

    function getRank() {
        if (!window.rank) return false;

        return rank;
    }

    setInterval(updateLeaderBoard, 100);
})();
