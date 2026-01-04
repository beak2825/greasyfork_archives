// ==UserScript==
// @name         Lichess Analysis Link on Chessbase
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a link to a lichess analysis of the game on chessbase games
// @author       You
// @include      http://www.chessgames.com/perl/chessgame?gid=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389928/Lichess%20Analysis%20Link%20on%20Chessbase.user.js
// @updateURL https://update.greasyfork.org/scripts/389928/Lichess%20Analysis%20Link%20on%20Chessbase.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const LICHESS_ANALYSIS = "https://lichess.org/paste"

    function buildPGNLink() {
        var url = new URL(window.location.href)
        var gid = url.searchParams.get("gid")
        var link = "http://www.chessgames.com/perl/nph-chesspgn?text=1&gid=" + gid
        return link
    }

    function buildLichessLink(callback) {
        var pgnLink = buildPGNLink()
        fetch(pgnLink).then(function(response) {
            response.text().then(function(body){
                var lichessLink = document.createElement("a")
                lichessLink.href = LICHESS_ANALYSIS + "?pgn="+cleanPGN(body)
                lichessLink.target = "_blank"
                lichessLink.text = "LI"
                callback(lichessLink)
            });
        });
    }

    function cleanPGN(pgn) {
        console.log(pgn)
        var newPGN = pgn.split("\n")
        newPGN = newPGN.join(" ")
        console.log(newPGN)
        return newPGN
    }

    function addLichessLink(link) {
        var tds = document.getElementsByTagName("td")
        var pgnTD = tds[15]
        pgnTD.firstChild.appendChild(document.createTextNode(" | "))
        pgnTD.firstChild.appendChild(link)
    }

    buildLichessLink(addLichessLink)

})();