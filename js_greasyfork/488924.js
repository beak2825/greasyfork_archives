// ==UserScript==
// @name         Clan Info Display
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Get Guild players info
// @author       Mafupa
// @match        https://hordes.io/clans*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hordes.io
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488924/Clan%20Info%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/488924/Clan%20Info%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';

    async function displayPrestige(guildPlayers, guildTag) {
        let totalFame = 0;
        let totalGS = 0;
        let numberOf10gs = 0;
        let totalToPay = 0;
        let nextTotalPrestige = 0;
        const faction = document.querySelector('body > div.fadeIn.slot.svelte-9014cj > div.fold.fadeIn > div > div.hero.svelte-6t8hqd > div > p').innerText == 'Bloodlust Clan' ? 1 : 0;
        const factionBracket = await getFactionPercentiles();
        const clanText = document.querySelector('body > div.fadeIn.slot.svelte-9014cj > div.fold.fadeIn > div > div.hero.svelte-6t8hqd > div > p');
        const clanOriginalText = clanText.innerText;
        const dots = ['.', '..', '...'];
        let dotsIdx = 0;
        let individualsFetched = 0;

        const tableSelector = 'body > div.fadeIn.slot.svelte-9014cj > div.row.slim.fadeIn > table';
        const originalTable = document.querySelector(tableSelector);
        const newTable = originalTable.cloneNode(true);
        let displayMode = 0;
        const tableContainer = document.querySelector('body > div.fadeIn.slot.svelte-9014cj > div.row.slim.fadeIn');
        const buttonsPanel = document.querySelector('body > div.fadeIn.slot.svelte-9014cj > div.row.slim.fadeIn > div.subnav.marg-top')
        const applicationButton = buttonsPanel.querySelector('div:nth-child(2)');
        const membersButton = buttonsPanel.querySelector('div:nth-child(1)');
        const extendedInfoButton = document.createElement('div');
        extendedInfoButton.textContent = 'Extended Information';
        extendedInfoButton.classList.add('btn', 'navbtn', 'grey');
        buttonsPanel.appendChild(extendedInfoButton);

        const titles = newTable.querySelector('thead > tr');
        titles.appendChild(document.createElement('th')).textContent = 'Prestige';
        titles.appendChild(document.createElement('th')).textContent = 'Fame';
        titles.appendChild(document.createElement('th')).textContent = 'Next Prestige';
        titles.appendChild(document.createElement('th')).textContent = 'Gear Score';
        titles.appendChild(document.createElement('th')).textContent = 'Pay';

        const tdMaxW = newTable.querySelectorAll('td, th');
        tdMaxW.forEach(td => {
            td.style.minWidth = '90px';
        });
        removeOfflineClass(newTable);

        const playerElements = newTable.querySelectorAll('tbody > tr');
        for(const playerElement of playerElements){
            clanText.innerText = 'Fetching players informations' + dots[dotsIdx%3];
            dotsIdx += 1;
            const playerName = playerElement.querySelector('td:nth-child(1) > span.name').innerText;
            let playerInfo = getPlayerInfoFromBatch(playerName, guildPlayers);
            if (playerInfo === null){
                if (individualsFetched > 20){
                    console.log('Fetched 10 individuals');
                    await sleep(500);
                    individualsFetched = 0;
                }
                const infoList = await getIndividualPlayerInfo(playerName);
                individualsFetched += 1;
                if (infoList === null || infoList.length === 0){
                    console.error(`Can't get ${playerName}'s informations`);
                    playerInfo = {
                        "prestige": 0,
                        "fame": 0,
                        "gs": 0
                    }
                }
                else{
                    playerInfo = infoList[0];
                }
            }
            const prestigeValue = playerInfo.prestige;
            const prestigeTitle = get_title(prestigeValue);
            var prestigeSlot = document.createElement('td');
            if (prestigeTitle > 0){
                prestigeSlot.innerHTML = '<img class="svgicon" src="/data/ui/rank/rank'+prestigeTitle+'.svg?v=85891049"> '+ prestigeValue;
            }else{
                prestigeSlot.textContent = prestigeValue;
            }
            playerElement.appendChild(prestigeSlot);

            const fameValue = playerInfo.fame;
            const payValue = Math.floor(fameValue/500000) * 10;
            totalFame += fameValue;
            totalGS += playerInfo.gs;
            var fameSlot = document.createElement('td');
            if (fameValue < 500000){
                fameSlot.classList.add('textfame');
            }else{
                fameSlot.classList.add('textsub');
                numberOf10gs += 1;
                totalToPay += payValue;
            }
            fameSlot.textContent = fameValue.toLocaleString();
            playerElement.appendChild(fameSlot);

            const nextPrestigeValue = getNextPrestige(faction, factionBracket, prestigeValue, fameValue);
            nextTotalPrestige += nextPrestigeValue;
            const nextPrestigeTitle = get_title(nextPrestigeValue);
            var nextPrestigeSlot = document.createElement('td');
            if (nextPrestigeTitle > 0){
                nextPrestigeSlot.innerHTML = '<img class="svgicon" src="/data/ui/rank/rank'+nextPrestigeTitle+'.svg?v=85891049"> '+ nextPrestigeValue;
            }else{
                nextPrestigeSlot.textContent = prestigeValue;
            }
            playerElement.appendChild(nextPrestigeSlot);

            const gsValue = playerInfo.gs;
            var gsSlot = document.createElement('td');
            gsSlot.textContent = gsValue;
            playerElement.appendChild(gsSlot);

            var paySlot = document.createElement('td');
            paySlot.innerHTML = payValue+' <img class="texticon" src="/data/ui/currency/gold.webp?v=85891049">';
            playerElement.appendChild(paySlot);

            var numSlot = document.createElement('td');
            numSlot.textContent = dotsIdx;
            playerElement.appendChild(numSlot);

        }
        if( document.querySelector('body > div.fadeIn.slot.svelte-9014cj > div.fold.fadeIn > div > div.hero.svelte-6t8hqd > div > div > h1').innerText != guildTag){
            return;
        }
        clanText.innerText = clanOriginalText;

        addClanStat(1, 'Total To Pay', totalToPay + ' <img class="texticon" src="/data/ui/currency/gold.webp?v=85891049">');
        addClanStat(1, 'Players in Top 1000', guildPlayers.length);
        addClanStat(1, 'Next Week Prestige', '<img class="svgicon" src="/data/ui/currency/prestige.svg?v=8681684"> '+ nextTotalPrestige.toLocaleString(), 'textprestige');
        addClanStat(2, 'Average Fame this week', '<img class="svgicon" src="/data/ui/currency/fame.svg?v=8681684"> '+parseInt(totalFame/playerElements.length).toLocaleString(), 'textfame');
        addClanStat(2, 'Average GearScore', (totalGS/playerElements.length).toLocaleString());
        totalFame = 0;
        numberOf10gs = 0;
        totalToPay = 0;
        nextTotalPrestige = 0;

        const spansToRemove = newTable.querySelectorAll('span.textgreen');
        spansToRemove.forEach(span => span.remove());
        removeElement('body > footer');
        removeElement('body > div.fadeIn.slot.svelte-9014cj > div.fold.fadeIn > div > div:nth-child(5)');
        removeElement('body > div.fadeIn.slot.svelte-9014cj > div.fold.fadeIn > div > div:nth-child(4)');

        membersButton.addEventListener("click", function() {
            if (displayMode === 2){
                newTable.style.display = "none";
                originalTable.style.display = "table";
            }
            displayMode = 0;
            extendedInfoButton.style.opacity = "1";
        });
        if(applicationButton){
            applicationButton.addEventListener("click", function() {
                if (displayMode == 2){
                    newTable.style.display = "none";
                }
                displayMode = 1;
                extendedInfoButton.style.opacity = "0.5";
            });
        }
        extendedInfoButton.addEventListener("click", function() {
            if (displayMode === 0){
                newTable.style.display = "table";
                originalTable.style.display = "none";
            }
            displayMode = 2;
        });

        originalTable.parentNode.appendChild(newTable);
        newTable.style.display = "none";

        addHeaderCellListeners(newTable);
    }

    function getNextPrestige(faction, factionBrackets, prestige, fame){
        const brackets = factionBrackets[faction];
        for(let i = brackets.length -1; i >= 0; i--){
            if(fame >= brackets[i]){
                return parseInt(prestige * 0.8 + (i + 2) * 1000);
            }
        }
        return parseInt(prestige * 0.8);
    }

    async function getFactionPercentiles(){
        const response = await fetch("https://hordes.io/api/pvp/getfactionpercentiles", {
            method: "GET",
            headers: {'Content-Type': 'application/json'},
            body: null,
        });
        if (response.ok) {
            return await response.json();
        } else {
            console.error(`Error: ${response.status}`);
            return null;
        }
    }

    function addClanStat(panelId, statName, statValue, optStyle=null){
        const guildInfoPanel = document.querySelector('body > div.fadeIn.slot.svelte-9014cj > div.fold.fadeIn > div > div.marg-top.grid.two');
        let panel = guildInfoPanel.querySelector('div:nth-child('+panelId+') > div');
        panel.appendChild(document.createElement('span')).textContent = statName;
        panel.lastChild.classList.add('textprimary');
        panel.appendChild(document.createElement('span')).innerHTML = statValue;
        if (optStyle){
            panel.lastChild.classList.add(optStyle);
        }
    }

    async function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function sortTable(table, index) {
        var rows, switching, i, x, y, shouldSwitch;
        switching = true;

        while (switching) {

            switching = false;
            rows = table.rows;

            for (i = 1; i < (rows.length - 1); i++) {
                shouldSwitch = false;

                x = getNumericalValueFromCell(rows[i].getElementsByTagName("td")[index].innerHTML, index);
                y = getNumericalValueFromCell(rows[i + 1].getElementsByTagName("td")[index].innerHTML, index);

                if (x < y) {
                    shouldSwitch = true;
                    break;
                }
            }
            if (shouldSwitch) {
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                var temp = rows[i].querySelectorAll('td')[7].innerHTML;
                rows[i].querySelectorAll('td')[7].innerHTML = rows[i+1].querySelectorAll('td')[7].innerHTML;
                rows[i+1].querySelectorAll('td')[7].innerHTML = temp;
                switching = true;
            }
        }
    }



    function addHeaderCellListeners(table) {
        var headerCells = table.querySelectorAll('thead th');

        headerCells.forEach((cell, index) => {
            cell.addEventListener('click', () => {
                sortTable(table, index);
            });
        });
    }

    function getNumericalValueFromCell(cellContent, column) {
        if (column === 1){
            var roles = {
                'Member': 0,
                'Assistant': 1,
                'Officer': 2,
                'Owner': 3
            }
            return roles[cellContent];
        }
        if (column === 2 || column === 5 || column === 4) {
            return parseInt(cellContent.replace(/<[^>]*>/g, ''));
        }
        if (column === 3){
            return parseInt(cellContent.replace(/,/g, ''));
        }
        if (column === 5){
            return parseInt(cellContent);
        }
    }

    function removeOfflineClass(table){
        var rows = table.querySelectorAll('tr');
        for (var i = 0; i < rows.length; i++) {
            rows[i].classList.remove('offline');
        }
    }

    function removeElement (selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.remove();
            return true;
        }
        return false;
    };

    function get_title(prestige) {
        const bounds = Array.from({ length: 12 }, (_, index) => 48000 - 4000 * index);
        const tiers = [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

        for (let i = 0; i < tiers.length; i++) {
            if (prestige > bounds[i]) {
                return tiers[i];
            }
        }
        return 0;
    }

    async function getIndividualPlayerInfo(playerName){
        const url = 'https://hordes.io/api/playerinfo/search';
        const headers = {
            'Content-Type': 'application/json',
        };
        const requestBody = {
            "name": playerName,
            "order": "name",
            "limit": 1,
            "offset": 0
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestBody),
        });

        if (response.ok) {
            return await response.json();
        } else {
            console.error(`Error: ${response.status}`);
            return null;
        }
    }

    function getPlayerInfoFromBatch(playerName, playerList){
        for (let i = 0; i < playerList.length; i++){
            if (playerList[i].name == playerName){
                return playerList[i];
            }
        }
        return null;
    }

    async function getPlayersBatch(batchSize, offset) {
        const url = 'https://hordes.io/api/playerinfo/search';
        const headers = {
            'Content-Type': 'application/json',
        };

        const requestBody = {
            "name": "",
            "order": "prestige",
            "limit": batchSize,
            "offset": offset
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestBody),
        });

        if (response.ok) {
            return await response.json();
        } else {
            console.error(`Error: ${response.status}`);
            return null;
        }
    }

    function removeNonGuildPlayers(guildTag, batch) {
        let guildPlayersList = [];
        batch.forEach(player => {
            if (player.clan == guildTag){
                guildPlayersList.push(player);
            }
        });
        return guildPlayersList;
    }


    async function getGuildPlayers(guildTag, membersCount) {
        let offset = 0;
        const batchSize = 100;
        let guildMembersNotFound = membersCount;
        let guildPlayers = [];
        while (guildMembersNotFound > 0 && offset + batchSize <= 1000) {
            const batch = await getPlayersBatch(batchSize, offset);
            let newFoundGuildPlayers = removeNonGuildPlayers(guildTag, batch);
            guildMembersNotFound -= newFoundGuildPlayers.length;
            guildPlayers.push(...newFoundGuildPlayers);
            offset += batchSize;
        }
        return guildPlayers;
    }

    let checkToggle = true;
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            //dumb
            if(checkToggle && document.querySelector('body > div.fadeIn.slot.svelte-9014cj > div.row.slim.fadeIn')){
                checkToggle = false;
                const guildTag = document.querySelector('body > div.fadeIn.slot.svelte-9014cj > div.fold.fadeIn > div > div.hero.svelte-6t8hqd > div > div > h1').innerText;
                const guildMemberCount = parseInt(document.querySelector('body > div.fadeIn.slot.svelte-9014cj > div.fold.fadeIn > div > div.marg-top.grid.two > div:nth-child(2) > div > span:nth-child(2)').innerText);
                getGuildPlayers(guildTag, guildMemberCount).then(guildPlayers => {
                    displayPrestige(guildPlayers, guildTag);
                });
            }
            //dumber
            else if(!checkToggle && document.querySelector('body > div.fadeIn.slot.svelte-9014cj > div.fold > div > h1')){
                checkToggle = true;
            }
        });
    });

    var config = { childList: true, subtree: true };
    observer.observe(document.body, config);



})();