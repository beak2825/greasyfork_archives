// ==UserScript==
// @name         RW Show Stats
// @namespace    heartflower.torn
// @version      1.3
// @description  Adds YATA estimates or TornStats spies on the RW battle war page and chain page [PDA Compatible]
// @author       Heartflower [2626587]
// @match        https://www.torn.com/factions.php?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/527465/RW%20Show%20Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/527465/RW%20Show%20Stats.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let pda = ('xmlhttpRequest' in GM);
    let httpRequest = pda ? 'xmlhttpRequest' : 'xmlHttpRequest';

    let allowYATA = false;
    let allowTS = false;

    let storedAllowYATA = localStorage.getItem('hf-show-stats-allow-yata');
    if (storedAllowYATA) {
        allowYATA = storedAllowYATA;
    }

    let storedAllowTS = localStorage.getItem('hf-show-stats-allow-ts');
    if (storedAllowTS) {
        allowTS = storedAllowTS;
    }

    console.log(`[HF] RW Show Stats - Allow YATA ${allowYATA}`);
    console.log(`[HF] RW Show Stats - Allow TS ${allowTS}`);


    if (allowYATA === 'false' || allowYATA === false) {
        AllowYATATornStats('YATA');
    }

    if (allowTS === 'false' || allowTS === false) {
        AllowYATATornStats('TornStats');
    }

    let apiKey = '';
    let storedApiKey = localStorage.getItem('hf-tornstats-apiKey');

    if (storedApiKey) {
        apiKey = storedApiKey;
        findElement(document.body, '.faction-war');
        findElement(document.body, '.recent-attacks');
        findElement(document.body, '.current-attacks');
    } else {
        setApiKey();
    }

    let currentPage = window.location.href;
    let tornStatsSpies = {};

    console.log('[HF] RW Show Stats running');

    function setApiKey(force) {
        if (apiKey === '' || force === true) {
            let enterApiKey = prompt('Please enter your TornStats API key');
            if (enterApiKey !== null && enterApiKey.trim() !== '') {
                localStorage.setItem('hf-tornstats-apiKey', enterApiKey);
                alert('API key set succesfully');

                apiKey = enterApiKey;

                findElement(document.body, '.opponentFactionName___vhESM');
                findElement(document.body, '.currentFactionName___eq7n8');
                findElement(document.body, '.members-list');

                localStorage.setItem('hf-show-stats-allow-ts', false);
                allowTS = false;
                localStorage.setItem('hf-show-stats-allow-yata', false);
                allowYATA = false;

                AllowYATATornStats('YATA');
                AllowYATATornStats('TornStats');
            } else {
                alert('No valid API key entered!');
            }
        }
    }

    function clearOldCache() {
        let today = new Date().toDateString(); // Get today's date in string format

        // Iterate through all keys in localStorage
        for (let key in localStorage) {
            // Check if the key starts with either 'hf-yata-last-fetch' or 'hf-tornstats-last-fetch'
            if (key.startsWith('hf-yata-last-fetch') || key.startsWith('hf-tornstats-last-fetch')) {
                let lastFetchDate = localStorage.getItem(key);
                let lastFetchDateObj = new Date(lastFetchDate);

                // If the last fetch date is not today, remove the corresponding stats and timestamp
                if (lastFetchDateObj.toDateString() !== today) {
                    console.log('[HF] Removing old YATA/TornStats Spies');

                    let prefix = key.startsWith('hf-yata-last-fetch') ? 'hf-yata' : 'hf-tornstats';
                    let id = key.replace(`${prefix}-last-fetch-`, '');

                    // For yata, userId is used, for tornstats, factionId is used
                    let idType = prefix === 'hf-yata' ? 'user' : 'faction';

                    localStorage.removeItem(`${prefix}-last-fetch-${id}`);
                    localStorage.removeItem(`${prefix}-stats-${id}`);
                }
            }
        }
    }

    function findFactions(container) {
        let factions = container.querySelectorAll('.tab-menu-cont');
        if (!factions || factions.length < 2) {
            setTimeout(() => findFactions(container), 100);
            return;
        }

        factions.forEach(faction => {
            findElement(faction, '.white-grad');
            findElement(document.body, '.opponentFactionName___vhESM');
            findElement(document.body, '.currentFactionName___eq7n8');
            findElement(faction, '.members-list');
        });
    }

    function addStatsTitle(headers) {
        let membersList = headers.parentNode.querySelector('.members-list');
        let attackDiv = membersList.querySelector('.attack___wBWp2');
        if (currentPage.includes('your') && attackDiv.parentNode.classList.contains('enemy')) return;

        let existingSpan = headers.querySelector('.hf-stats-title');
        if (existingSpan) return;

        let points = headers.querySelector('.points___TQbnu');
        points.style.setProperty('width', '43px', 'important');

        let level = headers.querySelector('.level___g3CWR.tab___UztMc');
        level.textContent = '';
        level.style.setProperty('width', '28px', 'important');

        let stats = level.cloneNode(true);
        stats.classList.add('hf-stats-title');
        stats.classList.remove('level___g3CWR');
        stats.style.setProperty('width', '47px', 'important');

        let levelSpan = document.createElement('span');
        levelSpan.textContent = 'Level';
        levelSpan.style.marginLeft = '7px';

        let statsSpan = document.createElement('span');
        statsSpan.textContent = 'Stats';
        statsSpan.style.marginLeft = '6px';

        level.insertBefore(levelSpan, level.firstChild);
        stats.insertBefore(statsSpan, stats.firstChild);

        headers.insertBefore(stats, level);
    }

    function findMembers(memberList) {
        let members = memberList.querySelectorAll('li');
        if (!members || members.length < 2) {
            setTimeout(() => findMembers(memberList), 100);
            return;
        }

        members.forEach(member => {
            let honorWrap = member.querySelector('.honorWrap___BHau4');
            let link = honorWrap.querySelector('a');
            let href = link.getAttribute('href');
            href = href.replace('/profiles.php?XID=', '');
            member.setAttribute('data-hf-userid', href);
            member.classList.add('hf-spy-member');

            fetchYataEstimate(href, member);
            fetchTornStatsSpy(href, member);

            setInterval(() => {
                findDescAsc();
            }, 1000);
        });
    }

    function fetchYataEstimate(userId, member, chainMember, mobile, isAttacker) {
        if (allowYATA === 'false' || allowYATA === false) {
            AllowYATATornStats('YATA');
            return;
        }

        let url = `https://yata.yt/api/v1/bs/${userId}?key=${apiKey}`;
        let lastFetch = localStorage.getItem(`hf-yata-last-fetch-${userId}`);
        let cachedStats = localStorage.getItem(`hf-yata-stats-${userId}`);
        let lastFetchDate = lastFetch ? new Date(lastFetch) : null;
        let today = new Date();

        // If the data was fetched today, no need to fetch again
        if (lastFetchDate && lastFetchDate.toDateString() === today.toDateString()) {
            console.log('[HF] YATA data already fetched today, using cached stats...');

            if (member) {
                addStatsCell(JSON.parse(cachedStats), member, userId);
            } else {
                if (mobile) {
                    if (isAttacker) {
                        chainMember.textContent = formatStats(JSON.parse(cachedStats)) + '>>';
                    } else {
                        chainMember.textContent = ' ' + formatStats(JSON.parse(cachedStats))
                    }
                } else {
                    chainMember.textContent = formatStats(JSON.parse(cachedStats));
                }
            }

            return; // Skip fetch
        }

        GM[httpRequest]({
            method: 'GET',
            url: url,
            responseType: 'json',
            onload: function(response) {
                /*if (response.status && response.status >= 400) {
                    return this.onerror({ message: 'YATA Down', response });
                }*/

                try {
                    response.response ??= JSON.parse(response.responseText); // In order for it to work with Torn PDA
                } catch (error) {
                    console.warn("YATA Server down:", error);

                    if (member) {
                        addStatsCell('N/A', member, userId);
                    }

                    chainMember.textContent = 'N/A';
                    return;
                }

                let stats = response.response[userId].total;

                localStorage.setItem(`hf-yata-last-fetch-${userId}`, today.toISOString());
                localStorage.setItem(`hf-yata-stats-${userId}`, JSON.stringify(stats));

                if (member) {
                    addStatsCell(stats, member, userId);
                } else {
                    if (mobile) {
                        if (isAttacker) {
                            chainMember.textContent = formatStats(stats) + '>> ';
                        } else {
                            chainMember.textContent = ' ' + formatStats(stats)
                        }
                    } else {
                        chainMember.textContent = formatStats(stats);
                    }
                }
            },
            onerror: function(response) {
                console.error('Error fetching data:', response);

                if (member) {
                    addStatsCell('N/A', member, userId);
                }
            }
        });
    }

    function fetchTornStatsSpies(factionId) {
        if (allowTS === 'false' || allowTS === false) {
            AllowYATATornStats('TornStats');
            return;
        }

        let url = `https://www.tornstats.com/api/v2/${apiKey}/spy/faction/${factionId}`;

        let lastFetch = localStorage.getItem(`hf-tornstats-last-fetch-${factionId}`);
        let cachedStats = JSON.parse(localStorage.getItem(`hf-tornstats-stats-${factionId}`));
        let lastFetchDate = lastFetch ? new Date(lastFetch) : null;
        let today = new Date();

        // If the data was fetched today, no need to fetch again
        if (lastFetchDate && lastFetchDate.toDateString() === today.toDateString()) {
            console.log('[HF] TornStats data already fetched today, using cached stats...');
            tornStatsSpies = cachedStats;
            return;
        }

        GM[httpRequest]({
            method: 'GET',
            url: url,
            responseType: 'json',
            onload: function(response) {
                response.response ??= JSON.parse(response.responseText); // In order for it to work with Torn PDA

                let data = response.response;

                if (data.message && data.message.includes('User not found')) {
                    console.error('TornStats: wrong key');
                    alert(`TornStats couldn't find your key. Be sure to enter your TornStats key!`);
                    setApiKey(true);
                }

                let members = data.faction.members;

                Object.entries(members).forEach(([id, member]) => {
                    let lastWeek = Date.now() - 10 * 24 * 60 * 60 * 1000; // Current time minus 10 days in milliseconds
                    if (!member.spy || member.spy.timestamp * 1000 < lastWeek) return;
                    tornStatsSpies[id] = member.spy.total;
                });

                localStorage.setItem(`hf-tornstats-last-fetch-${factionId}`, today.toISOString());
                localStorage.setItem(`hf-tornstats-stats-${factionId}`, JSON.stringify(tornStatsSpies));
            },
            onerror: function(response) {
                console.error('Error fetching data:', response);
            }
        });
    }

    function fetchTornStatsSpy(userId, member) {
        if (allowTS === 'false' || allowTS === false) {
            AllowYATATornStats('TornStats');
            return;
        }

        if (Object.keys(tornStatsSpies).length === 0) {
            setTimeout(() => fetchTornStatsSpy(userId, member), 100);
            return;
        }

        let tornStatsSpy = tornStatsSpies[userId];
        if (!tornStatsSpy) return;

        editStats(tornStatsSpy, member);
    }

    function editStats(stats, member) {
        let statsCell = member.querySelector('.HF-spy-cell');
        if (!statsCell) {
            setTimeout(() => editStats(stats, member), 100);
            return;
        }

        let formattedStats = formatStats(stats);
        statsCell.textContent = formattedStats;
        statsCell.title = '[TS] ' + stats.toLocaleString('en-US');

        member.setAttribute('data-hf-spy', stats);
    }

    function editAttackCell(stats, member, userId) {
        let formattedStats = formatStats(stats);

        let attackDiv = member.querySelector('.attack___wBWp2');
        let anchor = attackDiv.querySelector('a') || attackDiv.querySelector('span');

        if (anchor && anchor.tagName.toLowerCase() === 'span') {
            anchor.style.color = 'var(--faction-war-default-blue-color)';
            anchor.style.cursor = 'pointer';

            anchor.onclick = function() {
                window.open(`https://www.torn.com/loader.php?sid=attack&user2ID=${userId}`, '_blank');
            };
        }

        anchor.classList.add('HF-spy-cell');
        anchor.textContent = formattedStats;
        anchor.title = '[Y] ' + stats.toLocaleString('en-US');

        member.setAttribute('data-hf-spy', stats);

        createObserver(attackDiv);
    }

    function addStatsCell(stats, member, userId) {
        let attackDiv = member.querySelector('.attack___wBWp2');
        if (currentPage.includes('your') && attackDiv && member.classList.contains('enemy')) {
            editAttackCell(stats, member, userId);
            return;
        }

        let existingSpan = member.querySelector('.hf-stats-cell');
        if (existingSpan) return;

        let formattedStats = formatStats(stats);

        let pointsCell = member.querySelector('.points___TQbnu');
        pointsCell.style.setProperty('width', '43px', 'important');

        let levelCell = member.querySelector('.level___g3CWR');
        let level = levelCell.textContent.trim();
        levelCell.textContent = '';
        levelCell.style.setProperty('width', '26px', 'important');

        let statsCell = levelCell.cloneNode(true);
        statsCell.classList.add('hf-stats-cell');
        statsCell.style.setProperty('width', '45px', 'important');

        let levelSpan = document.createElement('span');
        levelSpan.textContent = level;
        levelSpan.style.marginLeft = '5px';

        let statsSpan = document.createElement('span');
        statsSpan.classList.add('HF-spy-cell');
        statsSpan.textContent = formattedStats;
        statsSpan.title = '[Y] ' + stats.toLocaleString('en-US');
        statsSpan.style.marginLeft = '7px';

        levelCell.appendChild(levelSpan);
        statsCell.appendChild(statsSpan);

        member.insertBefore(statsCell, levelCell);

        member.setAttribute('data-hf-spy', stats);
    }

    function formatStats(stats) {
        if (!stats || stats === 'N/A' || stats < 0) {
            return 'N/A';
        } else if (stats >= 1000000000) {
            return (stats / 1000000000).toFixed(1) + 'B';
        } else if (stats >= 1000000) {
            return (stats / 1000000).toFixed(1) + 'M';
        } else if (stats < 1000000) {
            return Math.round(stats / 1000) + 'K';
        }

        return stats.toString();
    }

    // Find an element based on className
    function findElement(parent, className, retries = 0) {
        let element = parent.querySelector(className);
        if (!element) {
            if (retries < 10) {
                setTimeout(() => findElement(parent, className, retries + 1), 100);
                return;
            } else {
                return;
            }
        }

        if (className === '.faction-war') {
            findFactions(element);
        } else if (className === '.white-grad') {
            addStatsTitle(element);
            createSortIcon(); // COME BACK HERE
        } else if (className === '.members-list') {
            findMembers(element);
        } else if (className === '.opponentFactionName___vhESM') {
            let opponentFaction = element.href.replace('https://www.torn.com/factions.php?step=profile&ID=','');
            fetchTornStatsSpies(opponentFaction);
        } else if (className === '.currentFactionName___eq7n8') {
            let currentFaction = element.href.replace('https://www.torn.com/factions.php?step=profile&ID=','');
            fetchTornStatsSpies(currentFaction);
        } else if (className === '.recent-attacks' || className === '.current-attacks') {
            addToChainPage(element);
        }
    }

    // Keep checkin for new rows! Also mid attack?

    let existingDiv = null;

    function addToChainPage(ul) {
        let attacks = ul.querySelectorAll('li');
        if (!attacks || attacks.length < 1) {
            setTimeout(() => addToChainPage(ul), 100);
            return;
        }

        let factionWarList = document.getElementById('faction_war_list_id');
        createObserver(factionWarList);

        attacks.forEach(attack => {
            processAtack(attack);
        });
    }

    function processAtack(attack) {
        if (attack.querySelector('.hf-attacker-stats')) return;

        if (attack.nextElementSibling && attack.nextElementSibling.classList.contains('hf-mobile-chain-stats')) return;

        let attackNumber = attack.querySelector('.attack-number');
        attackNumber.style.minWidth = '30px';

        let respect = attack.querySelector('.respect');
        respect.style.display = 'flex';
        respect.style.justifyContent = 'space-between';

        let respectText = respect.textContent;
        if (respectText.includes('other attackers')) {
            respect.style.fontSize = 'smaller';
        }

        processPlayer(attack.querySelector('.left-player'), attack, attackNumber, true);
        processPlayer(attack.querySelector('.right-player'), respect, null, false);
    }

    function processPlayer(playerEl, container, insertBeforeEl, isAttacker) {
        let mobile = false;
        let barStatsFlex = document.body.querySelector('.bar-stats-flex___zntBu');
        if (barStatsFlex) mobile = true;

        let statsDiv = document.createElement('div');
        statsDiv.classList.add(isAttacker ? 'hf-attacker-stats' : 'hf-defender-stats');
        statsDiv.style.fontSize = 'smaller';
        statsDiv.style.color = 'var(--default-gray-9-color)';
        statsDiv.textContent = 'N/A';

        if (isAttacker) statsDiv.style.textAlign = 'end';

        if (mobile === false) {
            statsDiv.style.width = '29px';

            if (insertBeforeEl) {
                container.insertBefore(statsDiv, insertBeforeEl.nextSibling);
            } else {
                container.appendChild(statsDiv);
            }
        } else {
            let li;
            if (container.tagName == 'LI') {
                li = container;
            } else {
                li = container.parentNode;
            }

            let newContainer = document.createElement('div');
            newContainer.classList.add('hf-mobile-chain-stats');
            newContainer.style.display = 'flex';
            newContainer.style.justifyContent = 'center';
            newContainer.style.paddingBottom = '3px';

            if (existingDiv) {
                newContainer = existingDiv;
            } else {
                li.parentNode.insertBefore(newContainer, li.nextElementSibling);
            }

            if (isAttacker) {
                statsDiv.textContent = 'N/A     >>';
                statsDiv.style.paddingRight = '3px';
            } else {
                statsDiv.textContent = ' N/A';
            }

            newContainer.appendChild(statsDiv);

            if (isAttacker) {
                existingDiv = newContainer;
            } else {
                existingDiv = null;
            }
        }

        if (playerEl.textContent === 'Someone') return;

        let honorLink = playerEl.querySelector('.honorWrap___BHau4 a');
        let userHref = honorLink?.getAttribute('href');
        let userId = userHref?.replace('/profiles.php?XID=', '');

        let factionLink = playerEl.querySelector('.factionWrap___GhZMa a');
        let factionHref = factionLink?.getAttribute('href');
        let factionId = factionHref?.replace('/factions.php?step=profile&ID=', '') || 0;

        if (!userId) return;

        let spies = JSON.parse(localStorage.getItem(`hf-tornstats-stats-${factionId}`));
        if (spies && spies[userId]) {
            if (mobile) {
                if (isAttacker) {
                    statsDiv.textContent = formatStats(spies[userId]) + '     >>';
                } else {
                    statsDiv.textContent = ' ' + formatStats(spies[userId]);
                }
            } else {
                let newTextContent = formatStats(spies[userId]);
                statsDiv.textContent = newTextContent
            }
        } else {
            let cachedEstimates = localStorage.getItem(`hf-yata-stats-${userId}`);
            if (!cachedEstimates) {
                let newTextContent = isAttacker
                ? formatStats(fetchYataEstimate(userId, null, statsDiv, mobile, isAttacker))
                : fetchYataEstimate(userId, null, statsDiv, mobile, isAttacker);

                statsDiv.textContent = newTextContent;
            } else {
                if (mobile) {
                    if (isAttacker) {
                        statsDiv.textContent = formatStats(cachedEstimates) + '     >>';
                    } else {
                        statsDiv.textContent = ' ' + formatStats(cachedEstimates);
                    }
                } else {
                    let newTextContent = formatStats(cachedEstimates);

                    statsDiv.textContent = newTextContent
                }
            }
        }
    }

    // Attach click event listener
    document.body.addEventListener('click', handleButtonClick);

    // If anything on the page is clicked, check if script already there
    function handleButtonClick(event) {
        let spyCell = document.body.querySelector('.HF-spy-cell');
        if (spyCell) return;

        let attackerStats = document.body.querySelector('.hf-attacker-stats');
        if (attackerStats) return;

        setTimeout(() => {
            findElement(document.body, '.faction-war');
            findElement(document.body, '.recent-attacks');
            findElement(document.body, '.current-attacks');
        }, 50);
    }

    clearOldCache();

    function createSortIcon() {
        let elements = [
            { element: document.body.querySelector('.attack___wBWp2'), sortPosition: 'left' },
            { element: document.body.querySelector('.hf-stats-title'), sortPosition: 'right' }
        ];

        // Check if elements exist
        if (elements.some(el => !el.element)) {
            setTimeout(createSortIcon, 100);
            return;
        }

        let otherSortIcons = document.body.querySelectorAll('.sortIcon___SmuX8');

        // Loop through elements and create sort icons
        elements.forEach(({ element }) => {
            let currentSortIcon = element.querySelector('.sortIcon___SmuX8');
            if (currentSortIcon) return; // Skip if already exists

            let sortIcon = document.createElement('div');
            sortIcon.className = 'sortIcon___SmuX8 desc___S5bx1';
            element.appendChild(sortIcon);

            element.style.cursor = 'pointer';
            element.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent default behavior
                sortByStats(elements);
            });

            otherSortIcons.forEach(icon => {
                let header = icon.parentNode;

                header.addEventListener('click', function() {
                    let active = element.querySelector('.activeIcon___pGiua');
                    if (active) {
                        sortIcon.classList.remove('activeIcon___pGiua');
                    }
                });
            });
        });
    }

    function sortByStats(elements, force = false) {
        if (force === false) {
            // Remove active state from all other icons
            document.body.querySelectorAll('.activeIcon___pGiua').forEach(tab => {
                tab.classList.remove('activeIcon___pGiua');
            });
        }

        elements.forEach(({ element }) => {
            let membersDiv = element.parentNode.parentNode;
            let memberList = membersDiv.querySelector('.members-list');

            let sortIcon = element.querySelector('.sortIcon___SmuX8');

            if (!sortIcon) return;
            let isDesc = sortIcon.classList.contains('desc___S5bx1');
            let isAsc = sortIcon.classList.contains('asc___e08kZ');

            // Toggle sorting state
            if (isDesc) {
                sortIcon.classList.remove('desc___S5bx1');
                sortIcon.classList.add('asc___e08kZ');
                sortStats(memberList, 'desc')

            } else if (isAsc) {
                sortIcon.classList.remove('asc___e08kZ');
                sortIcon.classList.add('desc___S5bx1');
                sortStats(memberList, 'asc')
            }

            // Add active class to the clicked icon
            sortIcon.classList.add('activeIcon___pGiua');
        });
    }

    function sortStats(memberList, type) {
        let members = memberList.querySelectorAll('.hf-spy-member');
        if (!members || members.length < 1) {
            setTimeout(() => sortStats(memberList, type), 100);
            return;
        }

        // Convert NodeList to an array to use .sort()
        members = Array.from(members);

        // Sort the members by 'data-hf-spy'
        members.sort((a, b) => {
            let enemy = false;
            if (a.classList.contains('enemy')) {
                enemy = true;
            }

            let spyA = a.getAttribute('data-hf-spy');
            let spyB = b.getAttribute('data-hf-spy');

            if (type === 'asc') {
                return spyA - spyB; // Ascending order
            } else if (type === 'desc') {
                return spyB - spyA; // Descending order
            }
        });

        // Re-append the sorted members to the container
        members.forEach(member => {
            memberList.appendChild(member); // Re-append each member in the sorted order
        });
    }

    function addRemoveLink() {
        let links = document.getElementById('top-page-links-list');
        if (!links) {
            setTimeout(() => addRemoveLink(), 100);
            return;
        }

        let existingSpan = document.body.querySelector('.hf-delete-key-link');

        let span;
        if (!existingSpan) {
            span = document.createElement('div');
            span.className = 'hf-delete-key-link';
            span.textContent = '[HF] Delete API Key';
            span.style.lineHeight = '25px';
            span.style.float = 'right';
            span.style.cursor = 'pointer';
            span.style.color = 'var(--default-blue-color)';
            span.style.marginRight = '20px';

            links.appendChild(span);
        } else {
            span = existingSpan;
        }

        span.addEventListener('click', function() {
            removeAPIKey();
        });
    }

    function removeAPIKey() {
        let areYouSure = confirm('[HF - RW Show Stats] Are you sure you want to remove your TornStats API key?');
        if (areYouSure) {
            localStorage.removeItem('hf-tornstats-apiKey');
            localStorage.setItem('hf-show-stats-allow-ts', false);
            allowTS = false;
            localStorage.setItem('hf-show-stats-allow-yata', false);
            allowYATA = false;
            alert('API key and YATA/TS settings removed!');
        } else {
            alert('API key not removed!');
        }
    }

    function createObserver(element) {
        let target;
        target = element;

        if (!target) {
            console.error(`Target not found.`);
            return;
        }

        let observer = new MutationObserver(function(mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        let textContent = node.textContent;
                        if (textContent.trim() == 'Attack') {
                            let member = node.parentNode.parentNode;
                            let userId = member.getAttribute('data-hf-user-id');
                            let stats = member.getAttribute('data-hf-spy');
                            let formattedStats = formatStats(stats);
                            node.textContent = formattedStats;

                            if (node.tagName.toLowerCase() === 'span') {
                                node.style.color = 'var(--default-blue-color)';

                                node.onclick = function() {
                                    window.open(`https://www.torn.com/loader.php?sid=attack&user2ID=${userId}`, '_blank');
                                };
                            }
                        } else if (node.tagName == 'LI') {
                            processAtack(node);
                        } else if (node.querySelector && node.querySelector('.chain-attacks-title')) {
                            let ul = node.querySelector('.chain-attacks-list');
                            addToChainPage(ul);
                        }
                    });
                } else if (mutation.type === 'characterData') {
                    if (mutation.target.textContent.trim() == 'Attack') {
                        let member = target.parentNode.parentNode;
                        let userId = member.getAttribute('data-hf-user-id');
                        let stats = member.getAttribute('data-hf-spy');
                        let formattedStats = formatStats(stats);
                        target.textContent = formattedStats;

                        if (target.tagName.toLowerCase() === 'span') {
                            target.style.color = 'var(--default-blue-color)';

                            target.onclick = function() {
                                window.open(`https://www.torn.com/loader.php?sid=attack&user2ID=${userId}`, '_blank');
                            };
                        }

                    }
                }
            }
        });

        let config = { attributes: true, childList: true, subtree: true, characterData: true };
        observer.observe(target, config);
    }

    function findDescAsc() {
        let tabMenus = document.body.querySelectorAll('.tabMenuCont___v65Yc');

        let enemy = document.body.querySelector('.enemy-faction');
        let yours = document.body.querySelector('.your-faction');

        tabMenus.forEach(tabMenu => {
            let memberList = tabMenu.querySelector('.members-list');
            let header = tabMenu.querySelector('.white-grad');
            let attack = header.querySelector('.attack___wBWp2');

            let desc = attack.querySelector('.desc___S5bx1');
            let asc = attack.querySelector('.asc___e08kZ');

            let activeIcon = attack.querySelector('.activeIcon___pGiua');

            if (activeIcon && desc) {
                sortStats(memberList, 'desc');
            } else if (activeIcon && asc) {
                sortStats(memberList, 'asc');
            }
        });
    }

    function AllowYATATornStats(type) {
        let existingDiv = document.querySelector('.itemsMessageDiv-' + type);
        if (existingDiv) existingDiv.remove();

        // Create the main container div
        let infoMsgDiv = document.createElement('div');
        infoMsgDiv.className = 'info-msg-cont border-round m-top10 itemsMessageDiv-' + type;
        infoMsgDiv.style.background = 'var(--default-base-pink-color)';
        infoMsgDiv.style.marginBottom = '10px';

        // Create the inner div for the message content
        let innerDiv = document.createElement('div');
        innerDiv.className = 'info-msg border-round';

        // Create the icon element
        let iconElement = document.createElement('i');
        iconElement.className = 'heartflower-info-icon';
        iconElement.style.margin = '9px 11px 0 10px';
        iconElement.style.display = 'inline-block';
        iconElement.style.height = '18px';
        iconElement.style.width = '10px';

        // Encode the SVG data
        let svgData = encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#FFF" d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg>`);

        // Set the background property using backgroundImage
        iconElement.style.backgroundImage = `url('data:image/svg+xml;utf8,${svgData}')`;
        iconElement.style.backgroundPosition = '0px 4px';
        iconElement.style.backgroundRepeat = 'no-repeat';

        // Create the message container div
        let msgContainer = document.createElement('div');
        msgContainer.className = 'delimiter';

        // Create the message element
        let messageElement = document.createElement('div');
        messageElement.id = 'itemsMessageElement';
        messageElement.className = 'msg right-round itemsMessageElement';
        messageElement.setAttribute('role', 'alert');
        messageElement.setAttribute('aria-live', 'assertive');
        messageElement.style.background = 'var(--faction-war-notification-red-background)';

        let textElement = document.createElement('div');
        textElement.id = 'textElement';
        textElement.className = 'itemsTextElement';
        textElement.textContent = `Click here to allow your API key to connect with ${type}`;
        textElement.style.color = 'var(--default-blue-color)';
        textElement.style.cursor = 'pointer';

        messageElement.appendChild(textElement);

        textElement.onclick = function() {
            if (type === 'YATA') {
                allowYATA = true;
                localStorage.setItem('hf-show-stats-allow-yata', true);
                infoMsgDiv.remove();
            } else if (type === 'TornStats') {
                allowTS = true;
                localStorage.setItem('hf-show-stats-allow-ts', true);
                infoMsgDiv.remove();
            }
        };

        // Append elements to construct the message structure
        msgContainer.appendChild(messageElement);
        innerDiv.appendChild(iconElement);
        innerDiv.appendChild(msgContainer);
        infoMsgDiv.appendChild(innerDiv);

        // Get the reference element after which the new div should be inserted
        let referenceElement = document.querySelector('.content-title.m-bottom10');

        // Insert the new div after the reference element
        referenceElement.parentNode.insertBefore(infoMsgDiv, referenceElement.nextSibling);
    }

    addRemoveLink();
})();