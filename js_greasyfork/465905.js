// ==UserScript==
// @name         tournamentsoftware extended
// @namespace    http://tampermonkey.net/
// @version      1.5.0
// @description  Shows players comparison not having direct games history through common competitors, display ranking and year in tournament category player list
// @author       all41.dev
// @match        *://*.tournamentsoftware.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=swiss-badminton.ch
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465905/tournamentsoftware%20extended.user.js
// @updateURL https://update.greasyfork.org/scripts/465905/tournamentsoftware%20extended.meta.js
// ==/UserScript==

//window.addEventListener('load', function() {
(function() {
    'use strict';
     const classements = [];


    const getFetchResp = async (url) => {
        const resp = await fetch(url);
        if (!resp.ok) throw new Error(`fetch failed: ${await resp.text()}`);
        const txt = await resp.text();
        try {
            return JSON.parse(txt);
        } catch (err) {
            return txt;
        }
    }

    const getOptions = async (playerNumber) => {
        const resp = await getFetchResp(`${location.protocol}//${location.host}/head-2-head/GetPlayerOptions?OrganizationCode=A819E89F-58F3-49B9-9C1F-C865A135F19A&t1p1memberid=${playerNumber}&t1p2memberid=&t2p1memberid=&t2p2memberid=&_=1683628580024`);
        const options = resp.T2P1Options;
        //console.debug(options);
        return options;
    }

    const calcExtH2h = async () => {
        const mainUserId = new URLSearchParams(window.location.search).get('T1P1MemberID');
        const player1Options = await getOptions(mainUserId);
        //console.debug(player1Options);
        const player2Id = document.querySelector('#player2Id').value;
        //console.debug(player2Id);
        const player2Options = await getOptions(player2Id);
        //console.debug(player2Options);

        const commonOpponents = player1Options.filter((op1) => player2Options.some((op2) => op2.Value === op1.Value));
        console.debug(commonOpponents);
        const container = document.querySelector('#h2h-loading_content');
        container.innerHTML = '';
        const tableContainer = document.createElement('table');
        tableContainer.style.width = '100%';
        tableContainer.innerHTML = '<thead><th></th><th></th></thead><tbody></tbody>';
        container.insertBefore(tableContainer, null);
        const tbodyContainetbodyContainer = tableContainer.querySelector('tbody');
        tbodyContainetbodyContainer.innerHTML = '';

        for(const commonOpp of commonOpponents) {
            console.debug(commonOpp);
            const result = await getMiddlePlayerResults(mainUserId, commonOpp.Value, player2Id);
            const row = document.createElement('tr');
            const left = document.createElement('td');
            left.style.verticalAlign = 'top';
            left.innerHTML = result[0];
            row.insertBefore(left, null);
            const right = document.createElement('td');
            right.style.verticalAlign = 'top';
            right.innerHTML = result[1];
            row.insertBefore(right, null);

            tbodyContainetbodyContainer.insertBefore(row, null);
        }
    }
    const getMiddlePlayerResults = async (mainPlayer, middlePlayer, comparedPlayer) => {
        const location =  window.location;
        //                                      https://.*tournamentsoftware.com/head-2-head/Head2HeadContent?OrganizationCode=A819E89F-58F3-49B9-9C1F-C865A135F19A&t1p1memberid=401124&t1p2memberid=&t2p1memberid=403483&t2p2memberid=&_=1683628580027
        const leftResults = await getFetchResp(`${location.protocol}//${location.host}/head-2-head/Head2HeadContent?OrganizationCode=A819E89F-58F3-49B9-9C1F-C865A135F19A&t1p1memberid=${mainPlayer}&t1p2memberid=&t2p1memberid=${middlePlayer}&t2p2memberid=&_=1683628580027`);
        const rightResults = await getFetchResp(`${location.protocol}//${location.host}/head-2-head/Head2HeadContent?OrganizationCode=A819E89F-58F3-49B9-9C1F-C865A135F19A&t1p1memberid=${middlePlayer}&t1p2memberid=&t2p1memberid=${comparedPlayer}&t2p2memberid=&_=1683628580027`);

        //console.debug(leftResults);
        //console.debug(rightResults);
        return [leftResults, rightResults];
    }
    const displayPlayerDetails = (playerNum, tr) => {
        const cellYear = Array.from(tr.querySelectorAll('td'))[3];
        const year = localStorage.getItem(`birthyear—${playerNum}`);
        if (year) cellYear.innerText = year;

        const cellRegion = Array.from(tr.querySelectorAll('td'))[4];
        const region = localStorage.getItem(`region—${playerNum}`);
        if (region) cellRegion.innerText = region;

        const cellClub = Array.from(tr.querySelectorAll('td'))[5];
        const club = localStorage.getItem(`club—${playerNum}`);
        if (club) cellClub.innerText = club;
    }
    const displayPlayerDetails2 = (tr) => {
        const tables = document.querySelectorAll('table');
        const table = tables[tables.length-1];
        const trhead = table.querySelector('.ruler thead tr');
        const trs = table.querySelectorAll('.ruler tbody tr');

        const a = tr.querySelector('a');
        fetch(a.href).then((res) => res.text()).then((text) => {
            const parser = new DOMParser();
            const playerDocument = parser.parseFromString(text, "text/html").documentElement;

            //const a = playerDocument.querySelector('a.button');
            const playerId = a.href.split('/').pop();
            //let playerNum = localStorage.getItem(`playerNum—${playerId}`);
            //if (playerNum) {
            //    displayPlayerDetails(playerNum, tr);
            //}

            const tables2 = Array.from(playerDocument.querySelectorAll('table'));
            const classementsPlayer = tables2.find((t) => t.innerText.trim().startsWith('Classements'));
            // console.debug(classementsPlayer);
            if (!classementsPlayer) return;

            Array.from(classementsPlayer.querySelectorAll('td')).forEach((el) => {
                const classementName = el.innerText;
                if(classements.indexOf(classementName) === -1) {
                    classements.push(classementName);
                    const newCat = trhead.insertCell();
                    newCat.onclick = sortTableNumber;
                    newCat.style.cursor = 'pointer';
                    trs.forEach((_tr) => _tr.insertCell());
                    newCat.innerText = classementName;
                }
                const link = el.querySelector('a');
                //if (!playerNum){
                const playerNum = link.href.split('?')[1].split('&').find((p) => p.startsWith('player')).split('=')[1];
                localStorage.setItem(`playerNum—${playerId}`, playerNum);
                if (playerNum) {
                    displayPlayerDetails(playerNum, tr);
                }
                //}

                fetch(link.href).then((res) => res.text()).then((text) => {
                    const rankingDocument = parser.parseFromString(text, "text/html").documentElement;
                    const categories = rankingDocument.querySelector('tbody').querySelectorAll('tr:not(:nth-child(1))');
                    const singles = categories[0];
                    const classement = singles.querySelector('td:nth-child(2)');
                    const classementCell = tr.querySelectorAll('td')[classements.indexOf(classementName)+6];
                    classementCell.innerText = classement.innerText;
                });
            });
        });
    }
    const displayRanks = async (ev) => {
        const tables = document.querySelectorAll('table');
        const table = tables[tables.length-1];
        const trhead = table.querySelector('.ruler thead tr');
        const trs = table.querySelectorAll('.ruler tbody tr');

        // ajout colonne année
        let newCat = trhead.insertCell();
        newCat.onclick = sortTableNumber;
        newCat.style.cursor = 'pointer';
        trs.forEach((_tr) => _tr.insertCell());
        newCat.innerText = 'Année';

        newCat = trhead.insertCell();
        newCat.onclick = sortTableNumber;
        newCat.style.cursor = 'pointer';
        trs.forEach((_tr) => _tr.insertCell());
        newCat.innerText = 'Region';

        newCat = trhead.insertCell();
        newCat.onclick = sortTableNumber;
        newCat.style.cursor = 'pointer';
        trs.forEach((_tr) => _tr.insertCell());
        newCat.innerText = 'Club';

        //console.debug(trs);
        trs.forEach((tr) => {
            tr.addEventListener('dblclick', (ev) => {
                displayPlayerDetails2(ev.target.parentElement);
                ev.stopPropagation();
            })
            displayPlayerDetails2(tr);
        });
    }

    const getTypedVal = (rawVal) => {
        //console.debug(rawVal);
        const numVal = parseFloat(rawVal);
        //console.debug(isNaN(numVal));
        const parts = rawVal.split('.');
        const dateVal = new Date(parts[2], (parts[1] || 0)-1, parts[0]);
        //console.debug(isNaN(dateVal));
        const val = !isNaN(dateVal) ? dateVal.getTime() : !isNaN(numVal) ? numVal : rawVal;
        //console.debug(val);
        return val;
    };
    const sortTableNumber = (event) => {
        const target = event.target;
        const targetTable = target.parentElement.parentElement.parentElement;
        const tbody = targetTable.querySelector('tbody');
        const rowArr = Array.from(tbody.querySelectorAll('tr'));
        // identify colspan
        const headerCells = Array.from(target.parentElement.querySelectorAll('th, td'));
        console.debug(headerCells);
        const colSpans = headerCells.map((hc) => (hc.colSpan || 1) - 1).reduce((l, r) => l + r);
        const index = Array.from(target.parentNode.children).indexOf(target) + colSpans;

        const sortedRows = rowArr.sort((l, r) => {
            const leftRawVal = l.querySelector(`td:nth-child(${index+1})`).innerText;
            const leftVal = getTypedVal(leftRawVal);
            const rightRawVal = r.querySelector(`td:nth-child(${index+1})`).innerText;
            const rightVal = getTypedVal(rightRawVal);
            return leftVal < rightVal ? -1 : 1;
        });

        sortedRows.forEach((r) => tbody.insertBefore(r, null));
    }
    const filterFollowedPlayers = () => {
        const trs = document.querySelectorAll('table.matches>tbody>tr');
        const rows = Array.from(trs);
        rows.forEach((row) => {
            const matchHasFollowedPlayer = Array.from(row.querySelectorAll('a')).some((a) => {
                if (a.href.match('https://.*tournamentsoftware.com/match-info')) { return false;}
                const key = a.href.split('?id=')[1].split('=').join('-').split('&').join('-');
                const isFollowed = localStorage.getItem(key) === 't';
                if (isFollowed) {
                    a.style.color = 'darkGreen';
                }
                return isFollowed;
            });
            if (!matchHasFollowedPlayer) {
                row.style.display = 'none';
            }
        });
    }

    if(window.location.href.startsWith('https://.*tournamentsoftware.com/head-2-head')) {
        // head2head
       const titleElem = document.querySelector('h2');
       const extH2HLink = document.createElement('div');
       extH2HLink.style.margins = 'auto';
       extH2HLink.innerHTML = '<input id="player2Id" style="color: black; margins: auto" class="text--xsmall text--center" type="text" value="" placeholder="player #"><button id="extH2hBtn">extended head to head</button><table id="extH2HResult" style="width: 100%"><thead><th>left</th><th>right</th></thead><tbody></tbody></table>';
       titleElem.parentNode.insertBefore(extH2HLink, titleElem.nextSibling);

       document.querySelector('#extH2hBtn').onclick = calcExtH2h;
    }
    if (window.location.href.match('https://.*tournamentsoftware.com/sport/event.aspx')) {
        // event page
        setTimeout(() => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.innerText = 'détails';
            btn.onclick = displayRanks;
            document.querySelectorAll('caption')[0].insertBefore(btn, null);

            const tables = document.querySelectorAll('table');
            const table = tables[tables.length-1];
            const trs = table.querySelectorAll('.ruler tbody tr');
            trs.forEach((tr) => {
                const playerCell = tr.querySelector('td:nth-child(2)');
                const chk = document.createElement('input');
                const key = tr.querySelector('a').href.split('?id=')[1].split('=').join('-').split('&').join('-');
                console.debug(key);
                chk.checked = localStorage.getItem(key) === 't';
                chk.type = 'checkbox';
                chk.style.marginRight = '.5em';
                chk.onclick = (event) => {
                    const chk = event.target;
                    //console.debug(chk);
                    const key = chk.parentElement.querySelector('a').href.split('?id=')[1].split('=').join('-').split('&').join('-');
                    console.debug(key);
                    if (chk.checked) {
                        localStorage.setItem(key, 't');
                    } else {
                        localStorage.setItem(key, 'f');
                    }
                }
                playerCell.insertBefore(chk, tr.querySelector('a'));
            });
        }, 500);
    }
    if (window.location.href.match('https://.*tournamentsoftware.com/sport/entrylist.aspx')) {
        const cols = document.querySelectorAll('th');
        cols.forEach((col) => col.onclick = sortTableNumber);
    }
    if (window.location.href.match('https://.*tournamentsoftware.com/ranking/category.aspx')) {
        // capture year of birth
        const cols = document.querySelectorAll('th');
        const yearCol = Array.from(cols).find((c) => c.innerText === 'Année de naissance');
        const regionCol = Array.from(cols).find((c) => c.innerText === 'Région');
        const clubCol = Array.from(cols).find((c) => c.innerText === 'Club');
        const playersRows = Array.from(document.querySelectorAll('tr'));
        playersRows.shift(); playersRows.shift();// two firsts are not player data
        playersRows.pop();// last row is pagination

        const yearIndex = yearCol ? Array.from(cols).indexOf(yearCol) +1 : undefined;// first col has colspan 2
        const regionIndex = Array.from(cols).indexOf(regionCol) +1;// first col has colspan 2
        const clubIndex = Array.from(cols).indexOf(clubCol) +1;// first col has colspan 2

        const urlParams = new URLSearchParams(window.location.search);
        const page = +(urlParams.get('p') || '1');
        const pageSize = +urlParams.get('ps');

        playersRows.forEach((pr, idx) => {
            // add filtered position numbers
            const cells = Array.from(pr.querySelectorAll('td'));
            const rankCell = cells[0].querySelector('div');
            rankCell.innerText = `${(page - 1) * pageSize + idx + 1} — ${rankCell.innerText}`;

            const playerCell = cells[3];
            // console.debug(playerCell);
            if (!playerCell) return;
            const url = playerCell.querySelector('a').href;
            const qParams = url.split('?')[1].split('&');// id & player, id being the classment
            const playerParam = qParams.find((p) => p.startsWith('player'));
            const playerNumber = playerParam.split('=')[1];

            if (yearIndex) {
                const year = cells[yearIndex].innerText;
                const yearKey = `birthyear—${playerNumber}`;
                localStorage.setItem(yearKey, year);
            }

            const region = cells[regionIndex].innerText;
            const regionKey = `region—${playerNumber}`;
            localStorage.setItem(regionKey, region);

            const club = cells[clubIndex].innerText;
            const clubKey = `club—${playerNumber}`;
            localStorage.setItem(clubKey, club);
        });
    }
    if (window.location.href.match('https://.*tournamentsoftware.com/sport/tournament/matches')) {
        setTimeout(() => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.innerText = 'joueurs suivis seulement';
            btn.onclick = filterFollowedPlayers;
            document.querySelector('caption').insertBefore(btn, null);
        }, 500);
    }
})();
//}, false);

