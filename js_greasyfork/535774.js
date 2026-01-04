// ==UserScript==
// @name         Ausbauer mit Leitstellen
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Es macht dinge
// @license      All Rights Reserved
// @author       Kastenklaus
// @match        https://www.leitstellenspiel.de/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leitstellenspiel.de
// @require      https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.4.4/lz-string.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/535774/Ausbauer%20mit%20Leitstellen.user.js
// @updateURL https://update.greasyfork.org/scripts/535774/Ausbauer%20mit%20Leitstellen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Hilfsfunktion für das Dropdown-Menü
    function createOrAssigneDropdownmenu(entryId, text, functionToRun){
        if(document.getElementById("ownScripts_dropdown_entries") == null){
            let newWindow = document.createElement("li");
            newWindow.setAttribute("class","dropdown");
            newWindow.setAttribute("id","ownScripts_dropdown");

            newWindow.innerHTML = `
                       <a href="#" id="skripte_profile" role="button" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="true">
                         <span>Skripte</span>
                         <span class="visible-xs">
                           Skripte
                         </span>
                         <b class="caret"></b>
                       </a>
                       <ul class="dropdown-menu" role="menu" aria-labelledby="menu_profile" id="ownScripts_dropdown_entries"></ul>`;

            document.getElementById("news_li").before(newWindow);
        }

        let newWindow = document.createElement("li");
        newWindow.setAttribute("role","presentation");

        newWindow.innerHTML = `
        <a href="#" id="` + entryId + `" role="menuitem">` + text + `</a>`;

        document.getElementById("ownScripts_dropdown_entries").append(newWindow);

        document.getElementById(entryId).onclick = function() { functionToRun(); event.preventDefault(); return false;};
    }

    createOrAssigneDropdownmenu("autoBuildExtensionsFromStartScreen", "Ausbauer", showOwnCustomOverlay);

    /**
     * Der Ausbau beschränkt sich auf Wachen die zu diesen Leitstellen gehören, z.B.: [1234567890, 9876543210]
     * @type {number[]}
     */
    const LIMIT_TO_DISPATCH_CENTERS = [23620879];

    var links = [

        {
           buildingID: 11,
            //displayName: "BePo",
          ausbauten:[0,1,3,8]
        },


        //------------ab hier nur bearbeiten, wenn ihr wisst was ihr macht
    ];

    var currentlyRunning = false

    async function autoBuildExtensionsFromStartScreen(){
        messageText.innerText = ""

        if (currentlyRunning){
            document.getElementById(baseID + "WaitMessage").className = "hidden";
            return
        }

        currentlyRunning = true

        try {
            const allBuildings = await $.getJSON('/api/buildings');

            // Filter buildings by dispatch centers if configured
            let filteredBuildings = allBuildings;
            if (LIMIT_TO_DISPATCH_CENTERS.length > 0) {
                filteredBuildings = allBuildings.filter(building => LIMIT_TO_DISPATCH_CENTERS.includes(building.leitstelle_building_id));
            }

            document.getElementById(baseID + "WaitMessage").className = "hidden";

            for(var i = 0; i < links.length; i++){
                let foundBuildings = filteredBuildings.filter(e => e.building_type == links[i].buildingID);

                for(var n = 0; n < foundBuildings.length; n++){
                    // Berechne Gesamtfortschritt
                    const totalProgress = ((i * foundBuildings.length + n) / (links.length * foundBuildings.length)) * 100;
                    document.getElementById(baseID + "Progress").style.width = totalProgress + "%";

                    messageText.innerHTML = `
                        <div>${links.length-i} Gebäudetypen verbleibend</div>
                        <div>${foundBuildings.length-n-1} Gebäude vom aktuellen Typ verbleibend</div>
                        <div>FENSTER NICHT SCHLIEßEN</div>
                    `;

                    // Prüfe alle Ausbauten des Gebäudes
                    const existingExtensions = foundBuildings[n].extensions.map(ext => ext.type_id);
                    const missingExtensions = links[i].ausbauten.filter(ausbau => !existingExtensions.includes(ausbau));

                    // Baue nur die fehlenden Ausbauten
                    for(const ausbau of missingExtensions){
                        try {
                            console.log(`Baue Ausbau ${ausbau} für Gebäude ${foundBuildings[n].id}`);
                            await $.post(
                                "https://www.leitstellenspiel.de/buildings/"+ foundBuildings[n].id + "/extension/credits/" + ausbau,
                                {"_method": "post", "authenticity_token": $("meta[name=csrf-token]").attr("content") }
                            );
                            await delay(500);
                        } catch (buildError) {
                            if (buildError.status !== 409) {
                                console.error(`Fehler beim Ausbau ${ausbau} für Gebäude ${foundBuildings[n].id}: ${buildError.status}`);
                            }
                            await delay(1000);
                        }
                    }
                    await delay(200);
                }
            }

            messageText.innerText = "Bauen abgeschlossen";
        } catch (error) {
            console.error("Fehler beim Ausführen des Skripts:", error);
            messageText.innerText = "Fehler beim Ausführen: " + (error.statusText || error.message || "Unbekannter Fehler");
        } finally {
            currentlyRunning = false;
        }
    }

    function extensionAlreadyBuild(extensionsArray, extensionIDToCheck){
        for (var i = 0; i < extensionsArray.length; i++){
            if (extensionsArray[i].type_id == extensionIDToCheck){
                return true
            }
        }
        return false
    }

    function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    let baseID = "BuildExtensionsFromStartscreen";

    // Create the overlay container
    var overlayContainer = document.createElement('div');
    overlayContainer.id = baseID + '-overlay-container';
    document.body.appendChild(overlayContainer);

    // Create the overlay content
    var overlayContent = document.createElement('div');
    overlayContent.id = baseID + '-overlay-content';
    overlayContent.className = "modal-content";
    overlayContainer.appendChild(overlayContent);

    // Customize the overlay styles
    GM_addStyle(`
        #${baseID}-overlay-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
            background-color: rgba(0, 0, 0, 0.7);
            display: none;
            backdrop-filter: blur(3px);
        }

        #${baseID}-overlay-content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 25px;
            border-radius: 10px;
            min-height: 200px;
            width: 600px;
            background: #fff;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }

        #${baseID}OverlayHeader {
            border-bottom: 2px solid #e74c3c;
            margin-bottom: 20px;
            padding-bottom: 10px;
        }

        #${baseID}WaitMessage {
            color: #e74c3c;
            font-size: 24px;
            text-align: center;
            margin: 10px 0;
        }

        #${baseID}MessagetTxt {
            font-size: 18px;
            font-weight: 600;
            text-align: center;
            color: #2c3e50;
            line-height: 1.6;
            margin-top: 30px;
        }

        #${baseID}MessagetTxt div {
            margin: 10px 0;
        }

        #${baseID}-close-button {
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            font-size: 24px;
            color: #e74c3c;
            cursor: pointer;
            padding: 5px;
            line-height: 1;
        }

        #${baseID}-close-button:hover {
            color: #c0392b;
        }

        .progress-container {
            width: 100%;
            background-color: #f3f3f3;
            border-radius: 5px;
            margin: 20px 0;
            padding: 3px;
        }

        .progress-bar {
            width: 0%;
            height: 20px;
            background-color: #e74c3c;
            border-radius: 5px;
            transition: width 0.3s ease-in-out;
        }

        .overlay-body {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
    `);

    // Function to show the overlay
    async function showOwnCustomOverlay() {
        document.getElementById(baseID + "-overlay-container").style.display = 'block';
        document.getElementById(baseID + "WaitMessage").className = "";
        autoBuildExtensionsFromStartScreen()
    }

    // Function to hide the overlay - make it globally available
    window.hideOwnCustomOverlay = function() {
        document.getElementById(baseID + "-overlay-container").style.display = 'none';
    }

    // Add event listener to toggle the overlay on click
    overlayContainer.addEventListener('click', function(event) {
        if (event.target === overlayContainer) {
            overlayContainer.style.display = 'none';
        }
    });

    // Update the overlay content HTML
    overlayContent.innerHTML = `
        <button id="${baseID}-close-button" onclick="hideOwnCustomOverlay()">&times;</button>
        <div class="overlay-header" id="${baseID}OverlayHeader">
            <h2 style="text-align: center; color: #2c3e50; margin: 0;">Ausbau-Assistent</h2>
            <div id="${baseID}WaitMessage" class="hidden">
                <i class="fas fa-spinner fa-spin" style="margin-right: 10px;"></i>
                BITTE WARTEN, Daten laden
            </div>
        </div>
        <div class="overlay-body" id="${baseID}OverlayBody">
            <div class="progress-container">
                <div class="progress-bar" id="${baseID}Progress"></div>
            </div>
            <div id="${baseID}MessagetTxt"></div>
        </div>
    `;

    // Aktualisiere die messageText-Zuweisung
    let messageText = document.getElementById(baseID+"MessagetTxt");
    if (!messageText) {
        messageText = document.createElement("div");
        messageText.id = baseID+"MessagetTxt";
        document.getElementById(baseID + "OverlayBody").appendChild(messageText);
    }
})();