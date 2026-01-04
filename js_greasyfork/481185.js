// ==UserScript==
// @name         SpawnPoint Entry
// @author       Saiful Islam
// @version      0.3
// @description  Help users in review
// @namespace    https://github.com/AN0NIM07
// @match        https://www.google.com/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/481185/SpawnPoint%20Entry.user.js
// @updateURL https://update.greasyfork.org/scripts/481185/SpawnPoint%20Entry.meta.js
// ==/UserScript==

/* eslint-env es6 */
/* eslint no-var: "error" */
/* eslint indent: ['error', 2] */
(function() {

	fetchminute();

	/*
    let duplicateSerial = prompt("----Location Coordinate----\n\nEnter Spawn Coordinate:\n\n");
    if(duplicateSerial.toString().search("22.") !== -1 || duplicateSerial.toString().search("23.") !== -1 || duplicateSerial.toString().search("24.") !== -1)
    {
        var today = new Date();
        var time = today.getHours() + ":" + today.getMinutes();

         var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "Location":duplicateSerial.toString(),
            "Encounter_Time":time.toString(),
            "Duration": '',
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            mode: 'no-cors',
            redirect: 'follow'
        };

        fetch("https://script.google.com/macros/s/AKfycbwAd5bkdtS_d1USA3MoDDY_tXjsUxy3OIascdfdY5XcOcBRztFWf4QBsNMvHGrKMILkUA/exec?action=addUser", requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));

        window.location.reload();
    }
    else
    {
        window.location.reload();
    }
	*/

   return;

    async function fetchminute()
    {
        await sleep(10000);
        var today = new Date();
        if (localStorage.getItem("timenow") === null)
        {
            localStorage.setItem("timenow", today.getMinutes());
        }

        if(localStorage.getItem("timenow").toString() != today.getMinutes().toString())
        {
            GM_setClipboard(today.getMinutes().toString());
            console.log(today.getMinutes().toString());
            localStorage.setItem("timenow", today.getMinutes());
        }
        fetchminute();
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

})();