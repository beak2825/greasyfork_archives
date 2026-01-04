// ==UserScript==
// @name         Attacker stalking helper
// @namespace    Cocaine
// @version      1.1
// @description  Stalk attackers with more efficiency than ever before!
// @author       CatOnCatnip [3139762]
// @connect      api.torn.com
// @match        https://www.torn.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @run-at       document-end

// @downloadURL https://update.greasyfork.org/scripts/495950/Attacker%20stalking%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/495950/Attacker%20stalking%20helper.meta.js
// ==/UserScript==
'use strict';

function createApiKeyInputBox() {
    const inputBox = document.createElement('input');
    inputBox.type = 'text';
    inputBox.id = 'api-key-input';
    inputBox.placeholder = 'Enter your API key here';
    inputBox.style.margin = '5px';
    inputBox.style.height = '20px';

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save API Key';
    saveButton.style.margin = '5px';
    saveButton.style.height = '50px';
    saveButton.style.padding = '0 10px';

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete Data About Members';
    deleteButton.style.margin = '5px';
    deleteButton.style.height = '50px';
    deleteButton.style.padding = '0 10px';

    const container = document.createElement('div');
    container.style.padding = '5px';
    container.style.backgroundColor = '#f4f4f4';
    container.style.border = '1px solid #ccc';
    container.style.margin = '5px';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.width = 'fit-content';

    container.appendChild(inputBox);
    container.appendChild(saveButton);
    container.append(deleteButton);

    const observer = new MutationObserver((mutations, obs) => {
        //const factionInfoWrap = document.querySelector('.faction-info-wrap');
        const HomeFactionWrap = document.getElementById('item17273646');
        if (HomeFactionWrap) {
            HomeFactionWrap.insertBefore(container, HomeFactionWrap.firstChild);

            const savedApiKey = GM_getValue('apiKey', '');
            inputBox.value = savedApiKey;

            saveButton.addEventListener('click', () => {
                const apiKey = inputBox.value.trim();
                GM_setValue('apiKey', apiKey);
                fetchUsersName(apiKey);
                saveButton.style.boxShadow = '0 0 10px 2px green';
                setTimeout(() => {
                    saveButton.style.boxShadow = '';
                }, 500);
            });
            deleteButton.addEventListener('click', () => {
                GM_setValue('allPlayers', {});
                GM_setValue('factionPlayers', {});
                deleteButton.style.boxShadow = '0 0 10px 2px green';
                setTimeout(() => {
                        deleteButton.style.boxShadow = '';
                    }, 500);
            });

            obs.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

function fetchFactionAndMembers() {
    const fetchButton = document.createElement('button');
    fetchButton.textContent = 'Fetch Members';
    fetchButton.style.margin = '5px';
    fetchButton.style.height = '30px';
    fetchButton.style.padding = '0 10px';

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete Data About Members';
    deleteButton.style.margin = '5px';
    deleteButton.style.height = '30px';
    deleteButton.style.padding = '0 10px';

    const container = document.createElement('div');
    container.style.padding = '5px';
    container.style.backgroundColor = '#f4f4f4';
    container.style.border = '1px solid #ccc';
    container.style.margin = '5px';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.width = 'fit-content';

    container.append(fetchButton);
    container.append(deleteButton);

    const observer = new MutationObserver((mutations, obs) => {
        const factionInfoWrap = document.querySelector('.faction-info-wrap');
        if (factionInfoWrap) {
            factionInfoWrap.insertBefore(container, factionInfoWrap.firstChild);

            fetchButton.addEventListener('click', () => {
                const apiKey = GM_getValue('apiKey', '');
                if (apiKey) {
                    fetchFactionData(apiKey);
                    fetchButton.style.boxShadow = '0 0 10px 2px green';
                    setTimeout(() => {
                        fetchButton.style.boxShadow = '';
                    }, 500);
                } else {
                    fetchButton.style.boxShadow = '0 0 10px 2px red';
                    setTimeout(() => {
                        fetchButton.style.boxShadow = '';
                    }, 500);
                    GM_notification('API Key is not set. Please set it first.');
                }
            });
            deleteButton.addEventListener('click', () => {
                deleteFactionData();
                deleteButton.style.boxShadow = '0 0 10px 2px green';
                setTimeout(() => {
                        deleteButton.style.boxShadow = '';
                    }, 500);
            });

            obs.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

function fetchUsersName(apiKey) {
    GM_xmlhttpRequest({
        method: 'GET',
        url: `https://api.torn.com/user/?key=${apiKey}&comment=TornAPI&selections=basic`,
        onload: function(response) {
            const data = JSON.parse(response.responseText);
            const stalkerName = data.name;
            console.log("User's name:", stalkerName);
            GM_setValue('stalkerName', stalkerName);

            // const stalkerNameTesting = GM_getValue('stalkerName', 'Someone');
            // console.log("Testing user's name:", stalkerNameTesting);
        },
        onerror: function(error) {
            console.error("Error fetching user's name:", error);
        }
    });
}

function fetchFactionData(apiKey) {
    const url = window.location.href;
    const idMatch = url.match(/ID=(\d+).*?(?:referredFrom=(\d+))?(?=#\/|$)/);
    let id = null;
    if (idMatch) {
        id = idMatch[1];
    } else {
        console.log('ID not found in the URL');
        return;
    }
    if (id in GM_getValue('factionPlayers')) {
        console.log("Deleting current list of members");
        deleteFactionData();
    }

    fetchEnemyFactionMembers(apiKey, id);
}

function fetchEnemyFactionMembers(apiKey, factionID) {
    GM_xmlhttpRequest({
        method: 'GET',
        url: `https://api.torn.com/faction/${factionID}?selections=basic&key=${apiKey}`,
        onload: function(response) {
            const data = JSON.parse(response.responseText);
            console.log('Enemy Faction Data:', data);
            const members = data.members;
            const factionPlayers = GM_getValue('allPlayers', {});
            let factionPlayersDictionary = GM_getValue('factionPlayers', {});
            let playerNamesList = [];

            for (const memberID in members) {
                if (members.hasOwnProperty(memberID)) {
                    const member = members[memberID];
                    factionPlayers[member.name] = memberID;
                    playerNamesList.push(member.name);
                }
            }

            factionPlayersDictionary[factionID] = playerNamesList;
            GM_setValue('allPlayers', factionPlayers);
            GM_setValue('factionPlayers', factionPlayersDictionary);
            console.log('All players stored:', factionPlayers);
            console.log('Faction data stored:', factionPlayersDictionary);
        },
        onerror: function(error) {
            console.error('Error fetching faction members:', error);
        }
    });
}

function deleteFactionData() {
    const url = window.location.href;
    const idMatch = url.match(/ID=(\d+).*?(?:referredFrom=(\d+))?(?=#\/|$)/);
    let factionId = null;
    if (idMatch) {
        factionId = idMatch[1];
    } else {
        console.log('ID not found in the URL');
        return;
    }
    let allFactions = GM_getValue('factionPlayers', {});
    if(!factionId in allFactions)
    {
        return;
    }

    // target faction from which members will be pulled
    const curFaction = allFactions[factionId];
    let allPlayers = GM_getValue('allPlayers', {});

    for (let name of curFaction) {
        if (name in allPlayers) {
            delete allPlayers[name];
        }
    }
    delete allFactions[factionId];

    GM_setValue('allPlayers', allPlayers);
    GM_setValue('factionPlayers', allFactions);
    console.log('All players stored:', allPlayers);
    console.log('Faction data stored:', allFactions);
}

function fetchAttackers(){
    const attackers = [];
    const playerElements = document.querySelectorAll('.playername___oeaye');

    console.log("Attackers have been fetched.");
    console.log(playerElements);
    if (playerElements.length === 0) {
        return attackers;
    }

    playerElements.forEach(playerElement => {
        const playerName = playerElement.textContent.trim();
        attackers.push(playerName);
    });

    console.log('Attackers:', attackers);
    return attackers;
}

function processAttackers(){
    const attackers = fetchAttackers();

    if (attackers.length === 0) {
        return;
    }

    const allPlayers = GM_getValue('allPlayers', {});
    const attackLinks = [];
    let playerName = '';

    const playerNameElements = document.querySelectorAll('.userName___loAWK');
    const stalkerName = GM_getValue('stalkerName', 'Someone');

    if (stalkerName != 'Someone' && playerNameElements) {
        playerNameElements.forEach(playerNameElement => {
            if (playerNameElement.textContent.trim() != stalkerName) {
                playerName = playerNameElement.textContent.trim();
            }
        });
    }

    if (playerName == '') {
        playerName = 'Someone';
    }

    attackers.forEach(attacker => {
        if (attacker in allPlayers) {
            const attackerID = allPlayers[attacker];
            attackLinks.push(`${attacker}: https://www.torn.com/loader.php?sid=attack&user2ID=${attackerID}`);
        }
        else {
            attackLinks.push(`${attacker}: https://www.torn.com/profiles.php?NID=${attacker}`);
        }
    });

    if (attackLinks.length > 0) {
        const result = `${playerName} is getting attacked:\n${attackLinks.join('\n')}`;
        GM_setClipboard(result);
        console.log(result);
        return 0;
    } else {
        return 1;
    }

}

function addProcessAttackersButton() {
    const button = document.createElement('button');
    button.textContent = 'Process Attackers';
    button.style.margin = '5px';
    button.style.height = '30px';
    button.style.padding = '0 10px';
    button.style.backgroundColor = 'white';
    button.style.border = '1px solid #ccc';
    button.style.borderRadius = '5px';

    button.addEventListener('click', () => {
        const succ = processAttackers();
        if (succ == 0) {
            button.style.transform = 'scale(0.95)';
            button.style.backgroundColor = '#e0e0e0';

            setTimeout(() => {
                button.style.transform = 'scale(1)';
                button.style.backgroundColor = 'white';
        }, 100);
        } else {
            button.style.boxShadow = '0 0 10px 5px red';
                setTimeout(() => {
                    button.style.boxShadow = '';
                }, 500);
        }

    });
    const observer = new MutationObserver((mutations, obs) => {
        const targetContainer = document.querySelector('.title___JRFo9');

        if (targetContainer) {

            // if this breaks, my heart will break as well...
            targetContainer.insertBefore(button, targetContainer.children[1]);

            // targetContainer.appendChild(button);
            obs.disconnect();

        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

}



function checkAndCreateApiKeyInputBox() {
    const done = 0;
    if (window.location.href.includes('tab=info')) {
        if (done === 0){
            createApiKeyInputBox();
            done = 1;
        }
    } else {
        done = 0;
    }
}
//if (window.location.href.includes('factions.php?step=profile')) {
//if (window.location.href.includes('factions.php?step=your')) {
if (window.location.href.includes('index.php')) {
    //setInterval(checkAndCreateApiKeyInputBox, 500);
    createApiKeyInputBox();
}
else if (window.location.href.includes('factions.php?step=profile')) {
    fetchFactionAndMembers();
}
else if (window.location.href.includes('sid=attack')){
    addProcessAttackersButton();
}