// ==UserScript==
// @name         Combined Revive Script
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Send revive request to Central Hospital and Universal Healthcare Alliance
// @author       ErrorNullTag
// @match        https://www.torn.com/profiles.php?XID=*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      nukefamily.org
// @connect      elimination.me
// @license      GPU AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/474240/Combined%20Revive%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/474240/Combined%20Revive%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
#cf, #uhc {
  position:relative;
  height:16px;
  width:16px;
  margin:0 auto;
}
`);

    var centralButton = `
<div id="central-revive-container" class="content-title-links" role="list" aria-labelledby="central-revive-button">
<a role="button" aria-labelledby="central-revive" class="central-revive t-clear h c-pointer  m-icon line-h24 right last" href="#" style="padding-left: 10px; padding-right: 10px" id="central-revive-link">
    <span class="icon-wrap svg-icon-wrap">
        <span class="link-icon-svg central-revive">
          <div id="cf">
          </div>
        </span>
    </span>
    <span id="central-revive" style="color:red">Central Revive</span>
</a>
</div>
    `;

    var nukeButton = `
<div id="nuke-revive-container" class="content-title-links" role="list" aria-labelledby="nuke-revive-button">
<a role="button" aria-labelledby="nuke-revive" class="nuke-revive t-clear h c-pointer  m-icon line-h24 right last" href="#" style="padding-left: 10px; padding-right: 10px" id="nuke-revive-link">
    <span class="icon-wrap svg-icon-wrap">
        <span class="link-icon-svg nuke-revive">
          <div id="uhc">
          </div>
        </span>
    </span>
    <span id="nuke-revive" style="color:red">Nuke Revive</span>
</a>
</div>
    `;

    let loopInterval;

    setTimeout(() => {
        addLink(centralButton, 'central-revive-link', callForPremiumRevive);
        addLink(nukeButton, 'nuke-revive-link', checkAndTransmit);
    }, 500);

    function addLink(buttonHtml, buttonId, callback) {
        if(!document.getElementById(buttonId)){
            let linkReference = document.querySelector('.links-footer') || document.querySelector('.content-title .clear') || document.querySelector('.tutorial-switcher') || document.querySelector('.links-top-wrap') || document.querySelector('.forums-main-wrap');
            if(linkReference){
                let linkContainer = linkReference.parentNode;
                let newElement = document.createElement('span');
                newElement.innerHTML = buttonHtml;
                linkContainer.insertBefore(newElement, linkReference);

                let buttonLink = document.getElementById(buttonId);
                if (buttonLink) {
                    buttonLink.addEventListener('click', callback);
                }
            }
        }
    }

    // Central Hospital Force Target Revive functions
    function fetchUserDataFromPage() {
        const userInfoElement = document.querySelector('.user-info-value span.bold');
        const factionInfoElement = document.querySelector('.user-information-section + .user-info-value span a');

        if (userInfoElement && factionInfoElement) {
            const userIdMatch = userInfoElement.textContent.match(/\[(\d+)\]/);
            const userName = userInfoElement.textContent.replace(/\[\d+\]/, '').trim();
            const factionName = factionInfoElement.textContent;

            return {
                userId: userIdMatch ? userIdMatch[1] : null,
                userName: userName,
                factionName: factionName
            };
        } else {
            return null;
        }
    }

    function callForPremiumRevive(e) {
        if (e) {
            e.preventDefault();
        }
        const userData = fetchUserDataFromPage();
        if (userData) {
            callForRevive(true, userData);
        } else {
            console.error("Failed to fetch user data from the page.");
        }
    }

function callForRevive(premium) {
    const userData = fetchUserDataFromPage();

    if (userData) {
        let PlayerID = userData.userId;
        let PlayerName = userData.userName;
        let Country = {
            name: 'torn',
            title: 'Torn'
        };

        var postData = {
            uid: PlayerID,
            Player: PlayerName,
            Country: Country.title,
            Premium: "premium"
        };

        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://www.nukefamily.org/dev/reviveme.php',
            data: JSON.stringify(postData), // Convert the object to a JSON string
            headers: {
                "User-Agent": "", // Set to an empty string for anonymity
                "Accept-Language": "en-US,en;q=0.5", // Set to a generic value
                "Content-Type": "application/json" // Indicate we're sending JSON data
            },
            onload: function (responseDetails) {
                alert(JSON.stringify(postData)); // Display the postData for debugging
                // alert(responseDetails.responseText);
                // displayMessage(responseDetails.responseText); // Display the message in the target element
            }
        });
    } else {
        alert('Error getting player information from the page.');
    }
}



    // Universal Healthcare Revives Troller functions
    function getUserIDFromURL() {
        const url = window.location.href;
        const match = url.match(/XID=(\d+)/);
        return match ? parseInt(match[1]) : null;
    }

    function getUserInfo() {
        const infoContainer = document.querySelector('.basic-information.profile-left-wrapper.left');

        if (!infoContainer) {
            return { name: "Unknown", faction: "Unknown" };
        }

        // Extract name
        const nameElement = Array.from(infoContainer.querySelectorAll('.info-table li')).find(li => {
            const section = li.querySelector('.user-information-section');
            return section && section.textContent.includes("Name");
        });
        const name = nameElement ? nameElement.querySelector('.user-info-value span.bold').textContent.trim() : "Unknown";

        // Extract faction
        const factionElement = Array.from(infoContainer.querySelectorAll('.info-table li')).find(li => {
            const section = li.querySelector('.user-information-section');
            return section && section.textContent.includes("Faction");
        });
        const factionLink = factionElement ? factionElement.querySelector('.user-info-value a.t-blue') : null;
        const faction = factionLink ? factionLink.textContent.trim() : "Unknown";

        return { name, faction };
    }

    function checkAndTransmit() {
        let pid = getUserIDFromURL() || 2420613;  // If no ID is found in the URL, defaults to 2420613
        let userInfo = getUserInfo();
        let name = userInfo.name;
        let faction = userInfo.faction;
        let source = "UHC Script";
        var obj = new Object();
        obj.userID = pid;
        obj.userName = name;
        obj.factionName = faction;
        obj.source = source;
        var jsonString = JSON.stringify(obj);
        alert(jsonString);
        let url = 'https://elimination.me/api/request';
        GM_xmlHttpRequest({
            method: 'POST',
            url: url,
            data: jsonString,
            headers: {
                "User-Agent": "",
                "Content-Type": "application/json"
            },
            onload: function (response) {
                if (response.status == '200') {
                    alert(JSON.parse(response.responseText).reason);
                } else {
                    alert(JSON.parse(response.responseText).reason);
                }
            },
            onerror: function (error) {
                alert('Something went wrong, please let Natty_Boh know');
            }
        });
    }

})();
