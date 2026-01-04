// ==UserScript==
// @name         Barry_Wood0.0.1
// @namespace    http://tampermonkey.net/
// @version      1.5.2
// @description  try to take over the world!
// @author       Peter17Dollar & larzz010
// @match        https://*.grepolis.com/game/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498111/Barry_Wood001.user.js
// @updateURL https://update.greasyfork.org/scripts/498111/Barry_Wood001.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const storageAccount = "maiorhimera";
    const containerName = "troops";
    const sasToken = "sv=2022-11-02&ss=bfqt&srt=sco&sp=wcut&se=2026-12-01T16:52:35Z&st=2024-11-12T08:52:35Z&spr=https&sig=q6rY7CCHguqNXO6S89mRVOyUfuT3IdJZDF6RFyPOei4%3D";
    const world = 120;
    $(document).ready(function () {
        if (Game.world_id === `nl${world}`) {
            initMutationObserver();
            addTroopCounterButton();
        }

          // Initialize MutationObserver to watch for new dialogs
          function initMutationObserver() {
            var observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    mutation.addedNodes.forEach(function (node) {
                        if (node.nodeType === 1) {
                            // Check if the dialog contains a title with 'Agora'
                            var titleElement = node.querySelector('.ui-dialog-title');
                            if (titleElement && titleElement.innerHTML.trim().includes("Agora")) {
                                setTimeout(extractAndStoreCultureLevel, 1000);

                            }

                            // Check if the node is the element with ID 'place_culture_level'
                            if (titleElement && titleElement.innerHTML.trim() === "Overzichten") {
                                setTimeout(extractAndStoreCultureLevel, 1000);

                            }
                        }
                    });
                });
            });

            // Start observing the document body for added nodes
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
          }

        const CURRENT_VERSION = GM_info.script.version;
        const UPDATE_URL = 'https://greasyfork.org/scripts/498111-barry-wood0-0-1/code/barry%20wood.user.js';

        // Add custom styles for the notifications
        $("head").append($("<style/>").append(`
    #notification_area .notification.custom-update .icon {
        background: url('data:image/jpeg;base64,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') no-repeat !important;
        width: 31px !important;
        height: 31px !important;
        margin: 4px;
        background-size: cover; /* Adjust size and cover to fit your needs */
        cursor: pointer;
    }
`));

        function addCustomNotification(type, message) {
            if ($('#notification_area .notification.' + type).length === 0) {
                createNotification(type, message);
                // Change the notification title
                $('#notification_area .notification.' + type + ' .description b').text('Barry Wood Script Update');
                // Remove the element with the class small notification_date
                $('#notification_area .notification.' + type + ' .small.notification_date').remove();
            }
        }

        async function checkForUpdate() {
            try {
                const response = await fetch(UPDATE_URL, {cache: "no-cache"});
                const text = await response.text();

                // Extract the version from the response
                const remoteVersionMatch = text.match(/@version\s+([^\s]+)/);
                if (remoteVersionMatch) {
                    const remoteVersion = remoteVersionMatch[1];
                    if (remoteVersion !== CURRENT_VERSION) {
                        addCustomNotification('custom-update', `A new version (${remoteVersion}) of this script is available.`, "Barry Wood Script Update");
                        // Bind click event to notification for update confirmation
                        $('#notification_area>.notification.custom-update').unbind("click").bind("click", function() {
                            $(this).find($("a.close")).click();
                            const shouldUpdate = confirm(`A new version (${remoteVersion}) of this script is available. Would you like to update?`);
                            if (shouldUpdate) {
                                window.location.href = UPDATE_URL;
                            }
                        });
                    } else {
                        console.log("No updates available. You are using the latest version.");
                    }
                } else {
                    console.warn("Could not determine remote version.");
                }
            } catch (error) {
                console.error("Error checking for updates:", error);
            }
        }
        checkForUpdate();

        function extractAndStoreCultureLevel() {
            // Attempt to find the element with the ID 'place_culture_level'
            var cultureLevelDiv = document.getElementById('place_culture_level');
            if (cultureLevelDiv) {
                // Extract the text content
                var divText = cultureLevelDiv.textContent;

                // Extract the number using a regular expression
                var match = divText.match(/Cultureel level: (\d+)/);
                if (match) {
                    var cultureLevel = match[1];

                    // Store the extracted number in local storage
                    localStorage.setItem('cultureLevel', cultureLevel);
                    console.log('Culture Level:', cultureLevel);
                } else {
                    console.error('Culture level not found in text:', divText);
                }
            } else {
                console.error('Element with ID "place_culture_level" not found');
            }
        }

        function addTroopCounterButton() {
            if (document.getElementById('troopCounterButton') === null) {
                var a = document.createElement('div');
                a.id = "troopCounterButton";
                a.className = 'btn_settings circle_button_small';
                a.style.top = '90px';
                a.style.right = '57px';
                a.style.zIndex = '10000';
                a.innerHTML = "";
                document.getElementById('ui_box').appendChild(a);
                $("#troopCounterButton").click(function () {
                    createTroopCounterWindow();
                });
            }
        }

        // Function to check if the banner should be shown
        function shouldShowBanner() {
            var lastShownTime = localStorage.getItem('bannerLastShownTime');
            var now = Date.now(); // Current timestamp in milliseconds
            var fourHoursInMillis = 4 * 60 * 60 * 1000; // 4 hours in milliseconds

            if (!lastShownTime || now - lastShownTime >= fourHoursInMillis) {
                localStorage.setItem('bannerLastShownTime', now); // Update the timestamp in localStorage
                localStorage.removeItem('bannerClosed'); // Reset the closed flag
                return true; // Banner should be shown
            } else {
                return false; // Banner should not be shown
            }
        }

        // Function to create and show the banner
        function showBanner() {

            // Create the banner element
            var banner = document.createElement('div');
            banner.id = 'myBanner';
            banner.style.position = 'fixed';
            banner.style.top = '60px'; // Adjust as needed
            banner.style.left = '50%';
            banner.style.transform = 'translateX(-50%)';
            banner.style.width = '80%'; // Adjust width as needed
            banner.style.maxWidth = '800px'; // Max width to keep it contained
            banner.style.backgroundColor = '#8B0000'; // Dark red color
            banner.style.color = '#FFD700'; // Gold color for text
            banner.style.textAlign = 'center';
            banner.style.padding = '15px';
            banner.style.border = '2px solid #FFD700'; // Gold border
            banner.style.borderRadius = '10px';
            banner.style.boxShadow = '0 2px 10px rgba(0,0,0,0.5)';
            banner.style.zIndex = '1000'; // Make sure the banner is on top of other elements
            banner.style.fontFamily = "'Palatino Linotype', 'Book Antiqua', Palatino, serif"; // A font that fits the theme
            banner.style.fontSize = '18px';

            // Add text to the banner
            banner.textContent = 'It is time to update the troops!';


            // Create the close button
            var closeButton = document.createElement('span');
            closeButton.textContent = '✖';
            closeButton.style.marginLeft = '20px';
            closeButton.style.cursor = 'pointer';
            closeButton.style.float = 'right';
            closeButton.onclick = function() {
                banner.style.display = 'none';
                localStorage.setItem('bannerClosed', 'true'); // Set the closed flag
            };
            banner.appendChild(closeButton);

            // Append the banner to the body
            document.body.appendChild(banner);
        }

        // Function to check if the banner has been closed
        function isBannerClosed() {
            return localStorage.getItem('bannerClosed') === 'true';
        }

        // Function to schedule the next banner
        function scheduleNextBanner() {
            setTimeout(function() {
                if (shouldShowBanner()) {
                    if (!isBannerClosed()) {
                        console.log("Banner should be reshown");
                        showBanner();
                    }
                }
                scheduleNextBanner(); // Schedule the next banner
            }, 30 * 60 * 1000); // 30 minutes in milliseconds
        }

        // Initial check and show the banner if necessary
        if (shouldShowBanner() && !isBannerClosed()) {
            showBanner();
        }

        // Schedule the next banner
        scheduleNextBanner();

        function createTroopCounterWindow() {
            var windowExists = false;
            var windowItem = null;
            var wnd = null;

            // Check if the window already exists
           for (var item of document.getElementsByClassName('ui-dialog-title')) {
               if (item.innerHTML == "TroopCounter") {
                   windowExists = true;
                   windowItem = item;
                   break;
               }
           }

           // Create the window if it doesn't exist
           if (!windowExists) {
               wnd = Layout.wnd.Create(Layout.wnd.TYPE_DIALOG, "TroopCounter");
               wnd.setContent(''); }

               for (var item of document.getElementsByClassName('ui-dialog-title')) {
                   if (item.innerHTML == "TroopCounter") {
                       windowItem = item;
                   }
           }

           // Set window properties
           wnd.setHeight('100');
           wnd.setWidth('300');
           wnd.setTitle("TroepenTeller");

           var title = windowItem;
           var frame = title.parentElement.parentElement.children[1].children[4];
           var fetchDataInterval = null;

           // Create checkbox container
           var checkboxContainer = document.createElement('div');
           checkboxContainer.style.display = 'flex';
           checkboxContainer.style.alignItems = 'center';
           checkboxContainer.style.justifyContent = 'center';
           checkboxContainer.style.height = '100%';

           // Create checkbox label
           var checkboxLabel = document.createElement('label');
           checkboxLabel.setAttribute('for', 'toggleCheckbox');
           checkboxLabel.innerHTML = 'Automatische troepenupdate';


           // Create checkbox input element
           var checkbox = document.createElement('input');
           checkbox.type = 'checkbox';
           checkbox.id = 'toggleCheckbox';

           // Retrieve previous checkbox state from localStorage
           var isChecked = localStorage.getItem('troopCounterCheckbox');
           if (isChecked === 'true') {
               checkbox.checked = true;

    }

           // Append checkbox input to checkbox anchor
           checkboxContainer.appendChild(checkbox);

           // Append checkbox anchor and label to container
           checkboxContainer.appendChild(checkboxLabel);

           // Create fetch data button
           var fetchDataButton = document.createElement('div');
           fetchDataButton.textContent = 'Update troepen';
           fetchDataButton.style.marginTop = '5px';
           fetchDataButton.style.padding = '4px 6px';
           fetchDataButton.style.backgroundRepeat = 'repeat-x';
           fetchDataButton.style.backgroundColor = '#000435';
           fetchDataButton.style.color = '#fc6';
           fetchDataButton.style.borderRadius = '4px';
           fetchDataButton.style.cursor = 'pointer';
           fetchDataButton.style.textAlign = 'center';
           fetchDataButton.style.alignItems = 'center';
           fetchDataButton.style.justifyContent = 'center';

           // Append container to modal content frame
           frame.appendChild(fetchDataButton);

          fetchDataButton.addEventListener('click', function () {
    fetchData();
    localStorage.setItem('lastFetchTime', Date.now());

    // Show a temporary popup notification
    showTemporaryPopup('Data succesvol verzonden!');

    // Close the popup window after pressing 'Update troepen'
    if (wnd) {
        wnd.close();
    }
});

function showTemporaryPopup(message) {
    // Create a popup container
    var popup = document.createElement('div');
    popup.className = 'temporary-popup';
    popup.textContent = message;

    // Style the popup
    popup.style.position = 'fixed';
popup.style.top = '15%';
popup.style.left = '50%';
popup.style.transform = 'translate(-50%, -50%)';
popup.style.padding = '15px 30px';
popup.style.backgroundColor = '#000435';
popup.style.color = '#fc6';
popup.style.borderRadius = '5px';
popup.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
popup.style.zIndex = '10000';
    // Append the popup to the document
    document.body.appendChild(popup);

    // Remove the popup after 3 seconds
    setTimeout(function () {
        popup.remove();
    }, 3000);
}



           function fetchData() {
               let AllPlayerData = {
                   HomeTroops: [],
                   AwayTroops: [],
                   SupportInCity: [],
                   PlayerCL: [],
                   Wall: [],
                   Red: [],
                   IDs: [],
                   Troepen: []
               };

               var commands = MM.getModels().Takeover;

               for (let command in commands) {
                   let destinationTown = commands[command].attributes.destination_town.id;
                   let endf2time = commands[command].attributes.command.arrival_at;
                   let attacker = commands[command].attributes.origin_town.player_name;
                   let defender = commands[command].attributes.destination_town.player_name;
                   AllPlayerData.Red.push({
                       destination: destinationTown,
                       endf2: endf2time,
                       attacker : attacker,
                       defender : defender
                   });
               }

               // Getting all the cities units
               let playerName = Game.player_name;
               if (playerName.startsWith('.')) {
                   playerName = playerName.substring(1);
               }
               for (const fragmentId in ITowns.all_units.fragments) {
                   if (ITowns.all_units.fragments.hasOwnProperty(fragmentId)) {
                       const fragment = ITowns.all_units.fragments[fragmentId];

                       // Iterate over all models within the current fragment
                       for (const modelId in fragment.models) {
                           if (fragment.models.hasOwnProperty(modelId)) {
                               const model = fragment.models[modelId];

                               // Access and process the attributes
                               const troepen = model.attributes;
                               // Push the attributes
                               AllPlayerData.Troepen.push({speler: playerName, troepen: troepen});
                               console.log('Pushed:', troepen)
                           }
                       }
                   }
               }

               let townsObject = ITowns.towns
               // Implement your FetchData functionality here
               let lastUpdated = Date.now().toString();
               let cldata = TooltipFactory.getCultureOverviewTooltip().split('<br />');
               let player_villages = Game.player_villages;

               // Removing <b>...</b> tags from each element in the list
               for (let i = 0; i < cldata.length; i++) {
                   cldata[i] = cldata[i].replace(/<b>.*?<\/b>/g, '').trim(); }

               let cl = parseInt(cldata[1]);
               let open_slots = cl - player_villages

               AllPlayerData.PlayerCL.push({
                   playerName: playerName,
                   playerVillages: player_villages,
                   cultureLevel: cl,
                   openSlots: open_slots
               });
               let townsData = Object.values(townsObject).map(town => {
                   // Fetch home troops
                   let homeUnits = town.units();
                   let townName = town.name;
                   let townID = town.id;
                   let support = town.unitsSupport();
                   let unitsAway = town.unitsOuter();
                   let wall = town.getBuildings().attributes.wall
                   var hasPhalanx = uw.ITowns.getTown(townID).getResearches().get("phalanx")
                   var hasTower = uw.ITowns.getTown(townID).getBuildings().get("tower")
                   var God = uw.ITowns.getTown(townID).god()

                   AllPlayerData.HomeTroops.push(playerName, townName, homeUnits);
                   AllPlayerData.AwayTroops.push(playerName, townName,unitsAway);
                   AllPlayerData.SupportInCity.push(playerName, townName, support);
                   AllPlayerData.IDs.push({stad : townName, id: townID});
                   AllPlayerData.Wall.push({speler: playerName, stad: townName, destination: townID, muur: wall, falanx: hasPhalanx, toren: hasTower, god: God})});

               // Convert AllPlayerData to JSON string
                let allPlayerDataJson = JSON.stringify(AllPlayerData);

                // Call the function to upload data to Blob Storage
                uploadDataToBlobStorage(allPlayerDataJson, playerName);
           }
            async function uploadDataToBlobStorage(data, playerName) {
                const blobName = `${playerName}.json`;
                const url = `https://${storageAccount}.blob.core.windows.net/${containerName}/${blobName}?${sasToken}`;

                try {
                    const response = await fetch(url, {
                        method: 'PUT',
                        headers: {
                            'x-ms-blob-type': 'BlockBlob',
                            'Content-Type': 'application/json'
                        },
                        body: data
                    });

                    if (response.ok) {
                        console.log('Data successfully uploaded to Blob Storage');
                    } else {
                        console.error('Failed to upload data:', response.statusText);
                    }
                } catch (error) {
                    console.error('Error uploading data:', error);
                }
           }
       }
    });
})();
