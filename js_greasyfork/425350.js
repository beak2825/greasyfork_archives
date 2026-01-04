// ==UserScript==
// @name        ICCF - Analyze on Lichess
// @author      Taylor Vance
// @description Exports the game to Lichess and links to the analysis board pre-loaded with the PGN.
// @match       https://www.iccf.com/game?id=*
// @version 0.0.1.20210421173709
// @namespace https://greasyfork.org/users/763132
// @downloadURL https://update.greasyfork.org/scripts/425350/ICCF%20-%20Analyze%20on%20Lichess.user.js
// @updateURL https://update.greasyfork.org/scripts/425350/ICCF%20-%20Analyze%20on%20Lichess.meta.js
// ==/UserScript==

var eNotation = document.getElementById('notation');

var pgn = eNotation.textContent.trim();
pgn = pgn.replace(/\./g, '. '); // add a space after each period
pgn = pgn.replace(/\u00A0/g, ' '); // replace nbsp with regular space

if(pgn.startsWith('1. ')) {
    var eButton = document.createElement('button');
    eButton.type = 'button';
    eButton.innerHTML = 'Lichess Analysis Board';
    eButton.onclick = function() { lichessExport(); };

    eNotation.parentNode.insertBefore(eButton, eNotation);

    function lichessExport() {
        eButton.disabled = true;

        var xhr = new XMLHttpRequest();

        xhr.open("POST", 'https://lichess.org/api/import', true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        xhr.onreadystatechange = function() {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                var result = JSON.parse(this.response);

                eButton.remove();

                var eLink = document.createElement('a');
                eLink.href = result.url;
                eLink.target = '__blank';
                eLink.innerHTML = 'Go to Lichess';
                eNotation.parentNode.insertBefore(eLink, eNotation);
            }
        }

        xhr.send("pgn="+pgn);
    }
}