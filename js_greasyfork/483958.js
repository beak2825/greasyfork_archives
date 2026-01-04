// ==UserScript==
// @name            Fast Expeditions
// @namespace       OgameExpeditions
// @description     Facilitate expeditions
// @version         2.90
// @author          billy2078@gmail.com
// @match           https://s256-fr.ogame.gameforge.com/game/*
// @license         MIT
// @grant           unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/483958/Fast%20Expeditions.user.js
// @updateURL https://update.greasyfork.org/scripts/483958/Fast%20Expeditions.meta.js
// ==/UserScript==

(function () {
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://s256-fr.ogame.gameforge.com/game/*",
        headers: {"Content-Type": "maccro/json"},
        onload: function (response) {
            console.log(response.responseText);
        }
    });

    function start() {
        let url = "https://s256-fr.ogame.gameforge.com/game/index.php?page=ingame&component=fleetdispatch&cp=33686792";
        if (!window.location.href.startsWith("https://s256-fr.ogame.gameforge.com/game/")) {
            window.location.href = url;
        }
        if (url) {
            let find = document.getElementById("planet-33686001");
            if (find) {
                find.click();
            }
        }
    }

    function choose() {
        let numberElements = document.querySelectorAll("#fleet1 .technology input[type='number']");
        let textElements = document.querySelectorAll("#fleet1 .technology input[type='text']");
        for (let numberElement of numberElements) {
            switch (numberElement.id) {
                case 'pt':
                    numberElement.value = 202;
                    break;
                case 'gt':
                    numberElement.value = 203;
                    break;
                case 'probe':
                    numberElement.value = 210;
                    break;
                case 'reaper':
                    numberElement.value = 218;
                    break;
                case 'pathfinder':
                    numberElement.value = 219;
                    break;
            }
        }
        for (let textElement of textElements) {
            switch (textElement.id) {
                case 'pt':
                    textElement.value = 1000;
                    break;
                case 'gt':
                    textElement.value = 2000;
                    break;
                case 'probe':
                    textElement.value = 1;
                    break;
                case 'reaper':
                    textElement.value = 1;
                    break;
                case 'pathfinder':
                    textElement.value = 1000;
                    break;
            }
        }
        let fleetToSend = document.getElementById("fleet2");
        if (fleetToSend) {
            fleetToSend.click();
        }
    }

    function send() {
        let galaxy = document.getElementById("galaxy");
        if (galaxy) galaxy.value = 6;

        let system = document.getElementById("system");
        if (system) system.value = 316;

        let position = document.getElementById("position");
        if (position) position.value = 16;

        let missionButton = document.getElementById("missionButton15");
        if (missionButton) missionButton.click();

        let pbutton = document.getElementById("pbutton");
        if (pbutton) pbutton.click();

        let selected = document.querySelector("#fleet2 #buttonz ul#missions li#button15.on a.selected");
        if (selected) {
            document.getElementById('continueToFleet3').click();
        }
    }

    function loop() {
        let counter = 0;
        let intervalId = setInterval(function () {
            start();
            choose();
            send();

            counter++;
            if (counter >= 13) {
                clearInterval(intervalId);
            }
        }, 3600000);
    }

    function redirect() {
        loop();
        let logoLink = document.querySelector("#pageReloader");
        logoLink.innerHTML = '<img src="https://i.ibb.co/zJC1PYC/Yaaa-LOGO-2.jpg" id="logoLink" class="tooltipBottom ogl_tooltipReady" data-title="<div><ul><li>Economy : 8</li><li>Peaceful fleets : 5</li><li>War fleets : 5</li><li>Holding fleets : 5</li></ul></div>';
    }

    document.querySelector("#pageReloader").addEventListener("click", function () {
        redirect();
    });
})();