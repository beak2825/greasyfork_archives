// ==UserScript==
// @name         Torn Russian Roulette
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Loader for the Torn RR Helper script
// @author       ErrorNullTag
// @match        https://www.torn.com/page.php?sid*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue

//=====================================================
//Acceptable Use Policy for All Phantom Scripting Scripts
//Version 1.0
//Last Updated: 9/17/2023
//=====================================================

//Introduction:
//-------------
//This Acceptable Use Policy ("Policy") outlines the acceptable and unacceptable uses
//of All Phantom Scripting Scripts ("Software"). This Policy applies to all users of the
//Software, including but not limited to contributors, developers, and end-users.
//By using the Software, you agree to abide by this Policy, as well as any other terms and
//conditions imposed by Phantom Scripting.

//Acceptable Use:
//---------------
//The Software is intended for usage in-game as it's stated usage on the download page for the software.
//Users are encouraged to use the Software for its intended purposes, and any use beyond this
//should be consistent with the principles of integrity, respect, and legality.

//Unacceptable Use:
//-----------------
//By using the Software, you agree not to:

//1. Use the Software for any illegal or unauthorized purpose, including but not limited to violating
//any local, state, or international laws.
//2. Use the Software for malicious gains, including but not limited to hacking, spreading malware,
//or engaging in activities that harm or exploit others.
//3. Alter, modify, or use the Software in a way that is inconsistent with its intended purpose,
//as described in official documentation, without explicit permission from Phantom Scripting.
//4. Use the Software to infringe upon the copyrights, trademarks, or other intellectual property
//rights of others.
//5. Use the Software to harass, abuse, harm, or discriminate against individuals or groups,
//based on race, religion, gender, sexual orientation, or any other characteristic.
//6. Use the Software to spam or engage in phishing activities.

//Consequences of Unacceptable Use:
//---------------------------------
//Phantom Scripting reserves the right to take any actions deemed appropriate for violations of this
//Policy, which may include:

//1. Temporary or permanent revocation of access to the Software.
//2. Moderative actions against the individual or entity in violation of this Policy.
//3. Public disclosure of the violation, to both Game Staff and the userbase.

//Amendments:
//-----------
//Phantom Scripting reserves the right to modify this Policy at any time.
//Users are encouraged to regularly review this Policy to ensure they are aware of any changes.

//Contact Information:
//---------------------
//For any questions regarding this Policy, please contact ErrorNullTag on Discord.

//=====================================================

// @downloadURL https://update.greasyfork.org/scripts/474101/Torn%20Russian%20Roulette.user.js
// @updateURL https://update.greasyfork.org/scripts/474101/Torn%20Russian%20Roulette.meta.js
// ==/UserScript==
(function() {
    'use strict';

    if (!window.location.href.includes("russianRoulette")) return;

    // Initialize and retrieve the counter
    let counter = GM_getValue("COUNTER", 1);

    // If counter is 1, clear the API key
    if (counter === 1) {
        GM_setValue("API_KEY", "");
    }

    let API_KEY = GM_getValue("API_KEY", ""); // Try to retrieve the API key from storage

    // If API key is not set, ask the user for it
    if (!API_KEY) {
        API_KEY = window.prompt("Please enter your API key:", "");

        // If the user provides a value, save it for future use
        if (API_KEY) {
            GM_setValue("API_KEY", API_KEY);
        } else {
            // If the user cancels the prompt or provides an empty value, reject the promise
            return Promise.reject("API key is required.");
        }
    }
    function setAndBroadcast(key, value) {
        GM_setValue(key, value);
        window.postMessage({
            source: "TornRussianRouletteHelper",
            key: key,
            value: value
        }, '*');
    }

    window.addEventListener('message', function(event) {
    if (event.data.source && event.data.source === "TornRussianRouletteHelper") {
        switch (event.data.key) {
            case "API_KEY":
                API_KEY = event.data.value;
                break;
            case "COUNTER":
                counter = event.data.value;
                break;
        }
    }
});


    // Update the counter after using the API key
    counter++;
    if (counter > 200) {
        counter = 1; // Reset the counter to 1 when it reaches 200
    }
    GM_setValue("COUNTER", counter); // Save the updated counter

    let betAmount = "N/A";

    function attack() {
        let api = API_KEY;
        let url = window.location.href;
        if(url.includes("sid=attack"))
        {
            url = new URL(url);
            let attackId = url.searchParams.get("user2ID");
            console.log(`https://api.torn.com/user/${attackId}?selections=profile,personalstats&key=${api}`);
            fetch(`https://api.torn.com/user/${attackId}?selections=profile,personalstats&key=${api}`)
            .then(function(response) {
                if (response.status !== 200) {
                    console.log(`fetch error ${response.status}`);
                    return;
                }
                response.json().then(function(data) {
                    let joinBtn = $("button:contains(\"Start fight\"), button:contains(\"Join fight\")").closest("button");
                    if($(joinBtn).length) {
                        $(joinBtn).after(`
                            <div id='attackInfo'>
                                <br />Attacks: <font color='green'>[W] ${parseInt(data.personalstats.attackswon) || 0}</font> <font color='red'>[L] ${parseInt(data.personalstats.attackslost) || 0}</font>
                                <br />Defends: <font color='green'>[W] ${parseInt(data.personalstats.defendswon) || 0}</font> <font color='red'>[L] ${parseInt(data.personalstats.defendslost) || 0}</font>
                                <br />Drugs: ${parseInt(data.personalstats.drugsused) || 0} used (${parseInt(data.personalstats.xantaken) || 0} xan)
                                <br />Consumables: ${parseInt(data.personalstats.consumablesused) || 0} used
                                <br />Refills: ${parseInt(data.personalstats.refills) || 0} used
                                <br />Networth: $${data.personalstats.networth.toLocaleString("en")}
                                <br />Last action: ${data.last_action.relative}
                                <br />Faction: <a href='https://www.torn.com/factions.php?step=profile&ID=${data.faction.faction_id}'>${data.faction.faction_name}</a>
                            </div>`);
                    }
                }).catch((err) => { console.log(err); });
            }).catch(function(err) {
                console.log(`fetch error ${err}`);
            });
        }
    }


    attack(); // Call the attack function at the start

    const BLACKLIST_DURATION = 60 * 1000;
    const blacklist = new Map();

    function isBlacklisted(userId) {
        if (blacklist.has(userId)) {
            if (Date.now() - blacklist.get(userId) < BLACKLIST_DURATION) {
                return true;
            } else {
                blacklist.delete(userId); // Remove the user from blacklist after the duration
            }
        }
        return false;
    }

function getBetAmountFromElement(userStatusWrap) {
    const betAmountElement = userStatusWrap.querySelector('.betBlock___wz9ED.columnItem___hnwxL');
    console.log("Bet Amount Element:", betAmountElement);  // Debugging log

    if (betAmountElement) {
        const betText = betAmountElement.textContent;
        console.log("Bet Text:", betText);  // Debugging log

        const betMatches = betText.match(/\$(\d{1,3}(?:,\d{3})*)(?!\d)/g);

        console.log("Bet Matches:", betMatches);  // Debugging log

        if (betMatches && betMatches.length) {
            const mainBet = betMatches[0].replace('$', '');
            return mainBet;
        }
    }

    return "N/A"; // Return "N/A" if nothing matches
}

let targetCashOnHand = 0; // Initialize it with some value
const BASE_MIN_PERCENTAGE = 0.05; // 5%
const BASE_MAX_PERCENTAGE = 0.10; // 10%

function calculateMugRange(betAmount) {
    if (!betAmount) {
        console.error("Bet amount is undefined or not provided!");
        return [0, 0];
    }
    const actualBetAmount = parseInt(betAmount.replace(/[$,]/g, ''));
    const baseMinMugAmount = actualBetAmount * BASE_MIN_PERCENTAGE;
    const baseMaxMugAmount = actualBetAmount * BASE_MAX_PERCENTAGE;

    const minMugAmount = Math.floor(baseMinMugAmount * 2);
    const maxMugAmount = Math.floor(baseMaxMugAmount * 2);

    return [minMugAmount, maxMugAmount];
}


async function fetchUserData(userId) {
    if (isBlacklisted(userId)) {
        return {
            username: idList.get(userId).username, // Added username
            level: idList.get(userId).level,
            healthStatus: 'Blacklisted'
        };
    }

    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://api.torn.com/user/${userId}?selections=profile&key=${API_KEY}`,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.status && data.status.state) {
                        if (data.status.state === 'Hospital') {
                            blacklist.set(userId, Date.now()); // Blacklist the user
                            resolve({
                                username: data.name, // Fetch the username
                                level: data.level,
                                healthStatus: 'Blacklisted',
                                Age: data.age
                            });
                        } else {
                            resolve({
                                ...data,
                                username: data.name, // Fetch the username
                                healthStatus: data.status.state,
                                Age: data.age // Fetch the age
                            });
                        }
                    } else {
                        resolve({
                            ...data,
                            username: data.name, // Fetch the username
                            healthStatus: 'Error: Status unavailable or missing',
                            Age: data.age
                        });
                    }
                } catch (error) {
                    console.error('Error parsing user data:', error);
                    reject(error);
                }
            },
            onerror: function(error) {
                console.error('Error fetching user data:', error);
                reject(error);
            }
        });
    });
}
    function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function initBox() {
    const updateBoxDimensions = () => {
        if (isMobile()) {
            // If on mobile
            box.style.width = '100%';  // Full width
            box.style.height = '60vh';  // 60% of viewport height
        } else {
            // If on desktop
            let width = window.innerWidth * 0.2;  // 20% of window width
            let maxHeight = window.innerHeight * 0.5;  // 50% of window height

            box.style.width = `${width}px`;
            box.style.maxHeight = `${maxHeight}px`;
        }
    }

    box.style.overflowY = 'scroll';
    box.style.background = 'black';
    box.style.color = 'green';
    box.style.marginTop = '10px'; // Provide spacing from the games list
    box.style.padding = '10px';
    box.style.border = '2px solid green';
    box.innerHTML = '<div style="font-size: 20px; color: gold;">Phantom Scripting</div><br>';

    // Finding the main content container
    const contentWrapper = document.querySelector('.content-wrapper[role="main"]');
    if (contentWrapper) {
        contentWrapper.appendChild(box);  // Append the box to the end of the container
    } else {
        // If for some reason the main container isn't found, the box will be added to the body
        document.body.appendChild(box);
    }

    // Call the update function initially
    updateBoxDimensions();

    // Adjust dimensions when window is resized
    window.addEventListener('resize', updateBoxDimensions);
}

    const box = document.createElement('div');
    initBox();

    const idList = new Map();

  function refreshBox() {
    while (box.firstChild && box.childElementCount > 1) {
        box.lastChild.remove();
    }

    if (!idList.size) {
        box.innerHTML += 'No Users Found';
        return;
    }

    idList.forEach((data, userId) => {
        const username = data.username || 'N/A';
        const healthStatus = data.healthStatus || 'Error: Unable to retrieve status';
        const level = data.level !== undefined ? data.level : 'N/A';
        const Age = data.age !== undefined ? data.age : 'N/A';
        const betAmount = data.betAmount !== "N/A" ? data.betAmount : `<span style="color:red;">${data.betAmount}</span>`;
        const entry = document.createElement('div');
        entry.style.marginBottom = '10px';

        if (healthStatus === 'Blacklisted') {
            entry.style.color = 'red';  // Set the color to red if the user is blacklisted
        }

    const [minMug, maxMug] = calculateMugRange(data.betAmount);

    entry.innerHTML = `
        <strong>Username:</strong> ${username}<br>
        <strong>ID:</strong> ${userId}<br>
        <strong>Level:</strong> ${level}<br>
        <strong>Health Status:</strong> ${healthStatus}<br>
        <strong>Bet Amount:</strong> ${betAmount}<br>
        <strong>Age:</strong> ${Age} Days<br>
        <strong>Estimated Mug Amount:</strong> ${formatCurrency(minMug)} - ${formatCurrency(maxMug)}`;

        if (!data.isPresent) {
            const mugBtn = document.createElement('button');
            mugBtn.innerText = 'Mug';
            mugBtn.style.backgroundColor = 'green';
            mugBtn.style.marginLeft = '10px';
            mugBtn.addEventListener('click', () => {
                fetchUserData(userId)
                    .then(userData => {
                        idList.set(userId, {
                            ...userData,
                            isPresent: true,
                            lastSeen: Date.now()
                        });
                        refreshBox();
                        window.open(`https://www.torn.com/loader.php?sid=attack&user2ID=${userId}`, '_blank');

                    })
                    .catch(error => {
                        console.error('Error fetching user data:', error);
                    });
            });
            entry.appendChild(mugBtn);
        }

        box.appendChild(entry);
    });
}
function formatCurrency(amount) {
    return `$${Number(amount).toLocaleString('en-US')}`;
}

function monitorChanges() {
    const userInfoWraps = document.querySelectorAll('.userStatusWrap___ljSJG');
    const currentTime = Date.now();

    if (!userInfoWraps.length) {
        setTimeout(monitorChanges, 2000);
        return;
    }

    const newIDs = new Set();
    userInfoWraps.forEach(userStatusWrap => {
        const userId = userStatusWrap.getAttribute('id').split('_')[0];

        // Extract bet amount from sibling element with aria-label attribute
        let betAmount = "N/A";
        const betElement = userStatusWrap.closest('.row___CHcax').querySelector('.betBlock___wz9ED');
        if (betElement) {
            const betAriaLabel = betElement.getAttribute('aria-label');
            const betMatch = betAriaLabel.match(/Bet amount: (\d+)/);
            if (betMatch && betMatch[1]) {
                betAmount = formatCurrency(betMatch[1]);
            }
        }

        if (userId && !idList.has(userId)) {
            idList.set(userId, { isPresent: true, lastSeen: currentTime, betAmount });
            fetchUserData(userId)
                .then(userData => {
                    idList.set(userId, {
                        isPresent: true,
                        ...userData,
                        lastSeen: currentTime,
                        betAmount
                    });
                    refreshBox();
                })
                .catch(error => {
                    console.error('Error fetching user data:', error);
                });
        } else if (idList.has(userId)) {
            idList.get(userId).lastSeen = currentTime;
            if (betAmount !== "N/A") idList.get(userId).betAmount = betAmount;
        }
        newIDs.add(userId);
    });

    idList.forEach((data, userId) => {
        if (!newIDs.has(userId) && data.isPresent) {
            data.isPresent = false;
            data.leftTime = currentTime;
        }
    });

    removeLeftUsers(currentTime);
    setTimeout(monitorChanges, 2000);
}




    function removeLeftUsers(currentTime) {
        const THIRTY_SECONDS = 30 * 1000;
        const leftUsers = [];

        idList.forEach((data, userId) => {
            if (!data.isPresent && (currentTime - data.leftTime) > THIRTY_SECONDS) {
                leftUsers.push(userId);
            }
        });

        leftUsers.forEach(userId => {
            idList.delete(userId);
        });

        refreshBox();
    }

    monitorChanges();
})();