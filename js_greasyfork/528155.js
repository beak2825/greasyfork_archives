// ==UserScript==
// @name         Cartel Empire: Fetch Hospital Times on Friends Page
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a button to check hospital release times
// @include      https://cartelempire.online/Connections*
// @icon         https://i.imgur.com/PR2kala.png
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528155/Cartel%20Empire%3A%20Fetch%20Hospital%20Times%20on%20Friends%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/528155/Cartel%20Empire%3A%20Fetch%20Hospital%20Times%20on%20Friends%20Page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the button
    let statusDiv = [...document.querySelectorAll("div.col-4.col-xl-2")]
        .find(div => div.innerText.trim() === "Status");

    if (!statusDiv) {
        alert('no button found')
        return;
    }


    let button = document.createElement("button");
    button.innerText = "Hosp Times";
    button.style.marginLeft = "10px";
    button.class = "btn btn-sm btn-info";
    button.classList.add("btn", "btn-sm", "btn-danger");
    button.onclick = checkHospitalStatus;

    //statusDiv.parentNode.insertBefore(button, statusDiv.nextSibling);
    statusDiv.appendChild(button);

    //alert('checkpoint')

    function checkHospitalStatus() {
        document.querySelectorAll("div.col-4.col-xl-2").forEach(div => {
            if (div.innerText.trim().startsWith("In Hospital")) {
                let userLink = div.previousElementSibling.querySelector("a.fw-bold");
                if (!userLink) return;

                let userId = userLink.href.match(/\/user\/(\d+)/);
                if (!userId) return;
                userId = userId[1];

                let apiUrl = `https://cartelempire.online/api/user?id=${userId}&type=advanced&key=81342244-8D05-40BC-B76`;
                fetch(apiUrl)
                    .then(response => response.json())
                    .then(data => {
                        if (!data.hospitalRelease) return;

                        let now = Math.floor(Date.now() / 1000);
                        let remaining = data.hospitalRelease - now;


                        if (remaining > 0) {
                            let hours = Math.floor(remaining / 3600);
                            let minutes = Math.floor((remaining % 3600) / 60);
                            let seconds = remaining % 60;
                            let timeString = "";

                            if (hours > 0) {
                                timeString = `${hours}h ${minutes}m ${seconds}s`
                            } else if (minutes > 0) {
                                timeString = `${minutes}m ${seconds}s`
                            } else {
                                timeString = `${seconds}s`
                            }

                            let timeSpan = document.createElement("span");
                            timeSpan.innerText = ` [${timeString}]`;
                            // div.appendChild(timeSpan);

                            div.innerText = `In Hospital [${timeString}]`
                            div.style.color = remaining <= 60*5 ? "green" : "";
                        }
                    });
            }
        });
    }
})();
