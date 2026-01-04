// ==UserScript==
// @name         Updated! "GTA GUESSER CH33T"
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Cheat for gta geusser
// @include      /^https?\:\/\/gta-geoguesser\..*\/.*$/
// @include      /^https?\:\/\/.*.gta-geoguesser\..*\/.*$/
// @author       ZEFISH
// @license MIT
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/531987/Updated%21%20%22GTA%20GUESSER%20CH33T%22.user.js
// @updateURL https://update.greasyfork.org/scripts/531987/Updated%21%20%22GTA%20GUESSER%20CH33T%22.meta.js
// ==/UserScript==

/* eslint-env es6 */
/* eslint-disable curly, no-undef, no-loop-func, no-return-assign, no-sequences */

console.log("CH33T LOADED")
console.log("DEV BY ZEFISH")

const cheatButton = document.createElement('button');
cheatButton.innerHTML = 'Guess';
cheatButton.style.position = 'fixed';
cheatButton.style.top = '10px';
cheatButton.style.right = '10px';
cheatButton.style.zIndex = '9999';
cheatButton.style.padding = '10px 20px';
cheatButton.style.backgroundColor = '#4CAF50';
cheatButton.style.color = 'white';
cheatButton.style.border = 'none';
cheatButton.style.borderRadius = '5px';
cheatButton.style.cursor = 'pointer';
document.body.appendChild(cheatButton);

cheatButton.addEventListener("click", event => {
    async function cheets() {
        gameDone = true;
        setGuess = true;

        clearInterval(countdownInterval);

        let guessedGtaLocation = convertToGameCoord(_MAP_markerStore[0].position.lat(), _MAP_markerStore[0].position.lng());
        guessedGtaLocation.x = window.startCord[0]
        guessedGtaLocation.y = window.startCord[1]
        let distanceDiff = parseInt(distance(guessedGtaLocation.x, guessedGtaLocation.y, window.startCord[0], window.startCord[1]));

        let score;

        if (!setGuess) {
            score = 0;
        } else {
            score = parseInt((maxScore - ((distanceDiff * distanceDiff)/100)));

            if(distanceDiff <= 50){
                score = maxScore;
            }
            if(score < 0){
                score = 0
            }
        }

        let mapHolder = document.getElementById("map-holder");
        mapHolder.style.width = "100%";
        mapHolder.style.height = "75vh";
        mapHolder.style.top = "0";
        mapHolder.style.right = "0";

        document.getElementById("panorama").style.display = "none";
        document.getElementById("guessBtn").style.display = "none";
        document.getElementById("homeBtn").style.display = "none";

        document.getElementById("gameSection").style.marginBottom = "60rem";

        let scoreCard = document.getElementById("scoreCard");
        scoreCard.style.display = "block";
        document.getElementById("roundCount").innerText = `Round ${currentRound} / ${roundAmount}`;
        if(!setGuess){
            document.getElementById("guessDeviation").innerHTML = "You did not place a Marker..."
        }else{
            document.getElementById("guessDeviation").innerHTML = "Your guess was <b>" + distanceDiff.toString() + "m</b> from the correct location"
        }
        document.getElementById("guessPoints").innerText = "You earned " + score.toString() + " Points";

        document.getElementById("scoreBar").style.width = ((score / maxScore) * 100).toString() + "%";

        setCookie("currentRound", (parseInt(currentRound) + 1).toString(), 7);
        setCookie("round" + currentRound + "Score", (score).toString(), 7);
        setCookie("round" + currentRound + "correctCord", window.startCord.toString(), 7);
        setCookie("round" + currentRound + "guessedCord", guessedGtaLocation.x + ", " + guessedGtaLocation.y, 7);

        clearAllMarkers();
        createMarker(false, false, new MarkerObject("temp", new Coordinates(window.startCord[0], window.startCord[1], 0), MarkerTypes.flag, "", ""), "");
        createMarker(false, false, new MarkerObject("temp", new Coordinates(guessedGtaLocation.x, guessedGtaLocation.y, 0), MarkerTypes.user, "", ""), "");
        drawLine(convertToMapGMAP(guessedGtaLocation.x, guessedGtaLocation.y), convertToMapGMAP(window.startCord[0], window.startCord[1]), "black");
    }
    console.log("INJECTED")
    cheets()
})