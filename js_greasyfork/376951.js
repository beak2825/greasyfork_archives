// ==UserScript==
// @name     Auto-Loads notifications
// @match        https://*.auto-loads.com/loads*
// @match        https://*.auto-loads.com/kroviniai*
// @match        https://*.auto-loads.com/*adunki*
// @match        https://*.auto-loads.com/load/loads*
// @version  1.1
// @grant    none
// @description Sends desktop notifications when new load is uploaded to a page that is open.
// @namespace https://greasyfork.org/users/241046
// @downloadURL https://update.greasyfork.org/scripts/376951/Auto-Loads%20notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/376951/Auto-Loads%20notifications.meta.js
// ==/UserScript==
(function () {
    'use strict';

    //Get loads id's from local storage
    var localStorageLoads = new Array();

    if (JSON.parse(localStorage.getItem("localStorageLoads")) != null) {
        localStorageLoads = JSON.parse(localStorage.getItem("localStorageLoads"));
    }

    //Checks if the user has given permision to send notifications
    if (Notification.permission == "default") {
        Notification.requestPermission().then(function () {
        });
    }
    //Gets loads id's from last refresh
    var lastRefreshLoads = new Array();

    var loadElement = document.querySelectorAll(".expanded-load-preview-content");
    loadElement.forEach((value) => {
        lastRefreshLoads.push(value.getAttribute("id").replace("load-preview-", "").toString());
    });

    //Checks if there are any new load id's
    lastRefreshLoads.forEach(element => {
        if (!localStorageLoads.includes(element) && window.location.href != "https://lt.auto-loads.com/kroviniai?loadId=" + element) {

            //Push the new id to local storage variable
            console.log(element);
            localStorageLoads.push(element);
            //Select the row
            var loadRow = document.querySelector('[onclick="collapseLoadPreview(event, ' + element + ');"]').parentNode.parentNode;

            //Loading location
            var loadingLocation = loadRow.querySelector(".load-city-collumn-content div").textContent.trim();

            //Unloading location
            var unloadingLocation = loadRow.querySelector(".unload-city-collumn-content div").textContent.trim();

            //Description
            var description = loadRow.querySelector(".L-T-24").textContent.replace("Dalinis krovinys, ", "").replace("Pilnas krovinys, ", "");

            //Link
            var link = "https://lt.auto-loads.com/kroviniai?loadId=" + element;

            //Sends notification
            var notificationOptions = {
                body: description,
                requireInteraction: true
            }

            var notification = new Notification(loadingLocation + " ➟ " + unloadingLocation, notificationOptions);

            notification.onclick = function () {
                console.log(link)
                window.open(link);
                notification.close();
            }
        }
    });

    //Update local storage
    localStorage.setItem("localStorageLoads", JSON.stringify(localStorageLoads));

    //Check if 60 seconds has passed
    var secondsPassed = 0;
    var refreshInterval = setInterval(function () {
        secondsPassed++;

        if (!document.hasFocus()) {

            if (secondsPassed > 60) {
                clearInterval(refreshInterval);
                location.reload();
            }
            console.log(secondsPassed);
        }
    }, 1000);


})();