// ==UserScript==
// @name         Indo Battle Manager
// @namespace    Indo MOD
// @version      20250105
// @description  try to take manage Indonesia
// @author       You
// @match        https://www.erepublik.com/en
// @icon         https://www.google.com/s2/favicons?sz=64&domain=erepublik.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498151/Indo%20Battle%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/498151/Indo%20Battle%20Manager.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define the list
    const _token = csrfToken;
    const dateTime = SERVER_DATA.serverTime.dateTime;
    let message = `*Indonesia Training War* \n`;
    var list = [{
            war_id: 201278,
            id: 669931,
            country_id: 35, //Poland
            region: 423, //Mazuria
            region_name: "Mazuria"
        }, {
            war_id: 205930,
            id: 669719,
            country_id: 10, //italy
            region: 272, //Piedmont
            region_name: "Piedmont"
        }, {
            war_id: 218085, //206100
            id: 735298,
            country_id: 68, //Singapore
            region: 648, //Singapore City
            region_name: "Singapore City"
        }, {
            war_id: 206942,
            id: 669321,
            country_id: 48, //India
            region: 459, //North Eastern India
            region_name: "North Eastern India"
        }, {
            war_id: 212945,
            id: 734720,
            country_id: 81, //Taiwan
            region: 462, //Kalimantan
            region_name: "Kalimantan"
        }, {
            war_id: 214928,
            id: 669679,
            country_id: 67, //Philippines
            region: 646, //Mindanao
            region_name: "Mindanao"
        }, {
            war_id: 215249,
            id: 669968,
            country_id: 72, //Lithuania
            region: 664, //Samogitia
            region_name: "Samogitia"
        }, {
            war_id: 215758,
            id: 669680,
            country_id: 166, //UAE
            region: 666, //Dainava
            region_name: "Dainava"
        }, {
            war_id: 215769,
            id: 669681,
            country_id: 24, //USA
            region: 50, //Hawaii
            region_name: "Hawaii"
        }, {
            war_id: 217808,
            id: 734931,
            country_id: 27, //Argentina
            region: 156, //Patagonia
            region_name: "Patagonia"
        }, {
            war_id: 218197,
            id: 735075,
            country_id: 31, //Netherland
            region: 464, //Sulawesi
            region_name: "Sulawesi"
        }, {
            war_id: 218415,
            id: 734992,
            country_id: 30, //Switzerland
            region: 337, //Romandie
            region_name: "Romandie"
        }];

    async function mainFunction() {
        createDivElement('separator', 'sidebar', '====================');
        createDivElement('list', 'sidebar', '');
        const fetchTime = getCurrentUnixTimestamp();
        const fetchlist = await fetchData(`https://www.erepublik.com/en/military/campaignsJson/list?${fetchTime}`);
        const cotd = fetchlist.countries["49"].cotd;
        let counter = 0;

        for (let item of list) {
            let country = fetchlist.countries[item.country_id].name;

            // Call the function to check if war ID exists
            let result = await isWarIdExist(fetchlist, item.war_id); // Ensure to await the result
            let exists = result.exists;
            let battleData = result.battle;
            console.log(result);
            if (exists) {
                const idBattle = battleData.id;
                let isCotd =``;
                if (idBattle === cotd){
                    isCotd = ` - COTD`;
                }
                const region = battleData.region.name;
                const defC = fetchlist.countries[battleData.def.id].name;
                const defP = battleData.def.points;
                const invC = fetchlist.countries[battleData.inv.id].name;
                const invP = battleData.inv.points;
                console.log(region);
                message += `\n*${region}${isCotd}*\n🛡: ${defC} : ${defP} Points \n🗡: ${invC} : ${invP} Points\n`;
            } else {
                const battleId = item.id;
                const payload = payloadList(battleId, _token);
                const url = `https://www.erepublik.com/en/military/battle-console`
                const list = await PostRequest(payload, url);
                console.log(list.list[0].result);
                const result = list.list[0].result;
                const outcome = result.outcome;
                const winner = result.winner;

                if (outcome === "defense" && winner === "Indonesia") {
                    const ready = await checkRegionExistence(fetchlist, item.region);
                    let rta =  `*not ready to attack*`;
                    if(ready){
                        rta = `*ready to attack*`;
                    }
                    const endTime = result.end;
                    var times = compareTime(dateTime, endTime);
                    console.log("Difference between dateTime and resultEnd:", times);
                    message += `\nAttack *${country}* - auto in ${times}\n [${item.war_id}](https://www.erepublik.com/en/wars/show/${item.war_id}) ${rta} ${item.region_name}\n`;
                    if(ready){
                        const linkText = `Ready to Attack ${country} - ${item.region_name} - auto in ${times}`;
                        const linkUrl = `https://www.erepublik.com/en/wars/show/${item.war_id}`;
                        displayLinkInHtml('list', linkText, linkUrl);
                        counter++;
                    } else {
                        const linkText = `QUEUE battle ${country} - ${item.region_name} - auto in ${times}`;
                        const linkUrl = `https://www.erepublik.com/en/wars/show/${item.war_id}`;
                        displayLinkInHtml('list', linkText, linkUrl);
                    }


                } else {
                    message += `\nWaiting attack from *${country}*\n`;

                }
                await delay(3000);
                console.log("War ID", item.war_id, "does not exist in battles.");
            }

            console.log("------------------------");
        }
        sendMessage(message);
        createDivElement('send', 'sidebar', 'DATA SENT TO CHANNEL');
        if(counter == 0){
            createDivElement('nobattle', 'sidebar', 'NO BATTLE READY TO ATTACK');
        }
    }

    // Wait for the DOM to be fully loaded
    window.addEventListener('load', function() {
        console.log('DOM fully loaded and parsed');

        // Main function to add button to the sidebar
        function addButtonToSidebar() {
            // Select the sidebar element using querySelector
            const sidebar = document.querySelector('.sidebar');

            createDivElement('scan', 'sidebar', 'BATTLE MANAGER - JANUARI 2025');

            // Check if the sidebar element exists
            if (sidebar) {
                console.log('Sidebar element found');

                // Create a new button element
                const button = document.createElement('button');
                button.textContent = 'SCAN BATTLE';
                button.style.margin = '10px'; // Optional: add some styling

                // Add click event listener to the button
                button.addEventListener('click', mainFunction);

                // Append the button to the sidebar
                sidebar.appendChild(button);
                console.log('Button appended to sidebar');
            } else {
                console.error('Sidebar element not found.');
            }
        }


        // Use MutationObserver to wait for the sidebar to appear if it's loaded dynamically
        const observer = new MutationObserver((mutations, obs) => {
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) {
                addButtonToSidebar();
                obs.disconnect();
            }
        });

        observer.observe(document, { childList: true, subtree: true });

    }, false);



    // Function to check if a war_id exists in fetchlist.battles
    function isWarIdExist(fetchlist, warId) {
        for (let battleId in fetchlist.battles) {
            if (fetchlist.battles.hasOwnProperty(battleId)) {
                if (fetchlist.battles[battleId].war_id === warId) {
                    return {
                        exists: true,
                        battle: fetchlist.battles[battleId]
                    };
                }
            }
        }
        return {
            exists: false,
            battle: null
        };
    }

    function checkRegionExistence(object, regionId) {
        // Iterate over battles object
        for (const battleId in object.battles) {
            const battle = object.battles[battleId];
            // Check if region id matches
            if (battle.region && battle.region.id === regionId) {
                // If region id exists, return false
                return false;
            }
        }
        // If region id doesn't exist, return true
        return true;
    }

    // Function to get current UNIX timestamp
    function getCurrentUnixTimestamp() {
        const currentTime = new Date();
        const unixTimestamp = Math.floor(currentTime.getTime() / 1000); // Convert milliseconds to seconds
        return unixTimestamp;
    }

    // Function to introduce a delay
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function createDivElement(divId, parentId, textContent) {
        const parentElement = document.querySelector(`.${parentId}`);
        if (parentElement) {
            const newDiv = document.createElement('div');
            newDiv.id = divId;
            newDiv.textContent = textContent;
            parentElement.appendChild(newDiv);
        } else {
            console.error(`Parent element with class '${parentId}' not found.`);
        }
    }

    // Function to display any value in HTML
    function displayValueInHtml(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = `${element.textContent} ${value}`;
        } else {
            console.error(`Element with ID '${elementId}' not found.`);
        }
    }

    function displayLinkInHtml(containerId, linkText, linkUrl) {
        const containerElement = document.getElementById(containerId);
        if (containerElement) {
            const linkElement = document.createElement('a');
            linkElement.href = linkUrl;
            linkElement.target = '_blank';
            linkElement.textContent = linkText;
            containerElement.appendChild(linkElement);
            containerElement.appendChild(document.createElement('br'));
        } else {
            console.error(`Container element with ID '${containerId}' not found.`);
        }
    }

    // Function to fetch data from a URL
    async function fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            throw new Error(`Failed to fetch data from ${url}: ${error.message}`);
        }
    }


    async function PostRequest(payload, url) {
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: Object.keys(payload)
                    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(payload[key])}`)
                    .join('&')
            });

            const responseData = await response.json();
            return responseData;
        } catch (error) {
            console.error("Error:", error);
            return null;
        }
    }

    // Function to construct the payload from variables
    function payloadList(battleId, _token) {
        const action = "warList";
        const Page = 1;


        return {
            battleId,
            action,
            Page,
            _token
        };
    }


    function compareTime(dateTime, resultEnd) {
        // Convert dateTime and resultEnd to Unix timestamps
        var dateTimeUnix = (new Date(dateTime)).getTime() / 1000;
        var resultEndUnix = (new Date(resultEnd)).getTime() / 1000;

        // If resultEnd is earlier than dateTime, add 24 hours to resultEnd
        if (resultEndUnix < dateTimeUnix) {
            resultEndUnix += 24 * 3600; // 24 hours in seconds
        }

        // Calculate the difference in seconds
        var differenceInSeconds = Math.abs(dateTimeUnix - resultEndUnix);

        // Convert difference to HH:MM:SS format
        var hours = Math.floor(differenceInSeconds / 3600);
        var minutes = Math.floor((differenceInSeconds % 3600) / 60);
        var seconds = Math.floor(differenceInSeconds % 60);

        // Format the difference as HH:MM:SS
        var formattedDifference = hours.toString().padStart(2, '0') + ":" +
            minutes.toString().padStart(2, '0') + ":" +
            seconds.toString().padStart(2, '0');

        return formattedDifference;
    }

    function sendMessage(message) {
        var botToken = '6423448975:AAGmYbAXaC0rTuIDH-2SoNXhjPLdjayX35c';
        var chatId = '-1002200452301';

        var apiUrl = 'https://api.telegram.org/bot' + botToken + '/sendMessage?chat_id=' + chatId + '&text=' + encodeURIComponent(message) + '&parse_mode=markdown&disable_web_page_preview=true';

        // Make the HTTP request
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error('Error:', error));
    }
})();