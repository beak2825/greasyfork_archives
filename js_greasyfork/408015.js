// ==UserScript==
// @name         Analiza oblegu
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  try to take over the world!
// @author       Varriz
// @match        https://r20.bloodwars.pl/showmsg.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408015/Analiza%20oblegu.user.js
// @updateURL https://update.greasyfork.org/scripts/408015/Analiza%20oblegu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let msgTitle = document.querySelector("body > div:nth-child(4) > div.msgMainContainer > div > div:nth-child(1) > table > tbody > tr:nth-child(1) > td:nth-child(2) > b").innerText;

    if(msgTitle.indexOf('Oblężenie na' !== -1)) {

        let attackerName = document.querySelector("#msgFullText > div > div.amb-bg > table > tbody > tr > td.attacker").innerText;
        let defenderName = document.querySelector("#msgFullText > div > div.amb-bg > table > tbody > tr > td.defender").innerText;

        let attackers = document.getElementsByClassName('amblist rlr fll')[0].getElementsByTagName('li');
        let attackersList = buildTeamData(attackers);
        let defenders = document.getElementsByClassName('amblist rll flr')[0].getElementsByTagName('li');
        let defendersList = buildTeamData(defenders);

        buildSummaryData(attackersList);
        buildSummaryData(defendersList);

        unmodSummary(attackersList);
        unmodSummary(defendersList);

        let sredniSposAtakujacych = (attackersList.map((a) => a.spost).reduce((a,b) => a+b) / attackersList.length).toFixed(2);
        let sredniSposBroniacych = (defendersList.map((a) => a.spost).reduce((a,b) => a+b) / defendersList.length).toFixed(2);

        let sredniaZwinkaA = (attackersList.map((a) => a.zwinnosc).reduce((a,b) => a+b) / attackersList.length).toFixed(2);
        let sredniaZwinkaB = (defendersList.map((a) => a.zwinnosc).reduce((a,b) => a+b) / defendersList.length).toFixed(2);

        let SumaHPA = attackersList.map((a) => a.pz).reduce((a,b) => a+b);
        let SumaHPB = defendersList.map((a) => a.pz).reduce((a,b) => a+b);

        let Zwinka70A = attackersList.map((a) => a.zwinnosc).sort(compareNumbers)[21];
        let Zwinka70B = defendersList.map((a) => a.zwinnosc).sort(compareNumbers)[21];

        let spost70A = attackersList.map((a) => a.spost).sort(compareNumbers)[21];
        let spost70B = defendersList.map((a) => a.spost).sort(compareNumbers)[21];

        let potep70A = 0;
        attackersList.forEach(function(a) { if (a.rasa=='POTĘPIONY') {potep70A++};});
        let potep70B = 0;
        defendersList.map((a) => a.rasa).forEach(function(a) { if (a=='POTĘPIONY') {potep70B++};});

        let sbA = 0;
        attackersList.map((a) => a.arkana).forEach(function(a) { if (a.lenght > 0 && a[0][0]=='Skóra Bestii') {sbA++};});
        let sbB = 0;
        defendersList.map((a) => a.arkana).forEach(function(a) { if (a.lenght > 0 && a[0][0]=='Skóra Bestii') {sbB++};});

        let nlA = 0;
        attackersList.map((a) => a.arkana).forEach(function(a) { a.forEach(function(b) { if (b[0]=='Nocny Łowca') {nlA++};})});
        let nlB = 0;
        defendersList.map((a) => a.arkana).forEach(function(a) { a.forEach(function(b) { if (b[0]=='Nocny Łowca') {nlB++};})});

        let szpony3A = 0;
        attackersList.map((a) => a.talizmany).forEach(function(a) { a.forEach(function(b) { if (b[0]=='Szpony nocy' & b[1]==3 ) {szpony3A++};})});
        let szpony3B = 0;
        defendersList.map((a) => a.talizmany).forEach(function(a) { a.forEach(function(b) { if (b[0]=='Szpony nocy' & b[1]==3 ) {szpony3B++};})});

        let szpony4A = 0;
        attackersList.map((a) => a.talizmany).forEach(function(a) { a.forEach(function(b) { if (b[0]=='Szpony nocy' & b[1]==4 ) {szpony4A++};})});
        let szpony4B = 0;
        defendersList.map((a) => a.talizmany).forEach(function(a) { a.forEach(function(b) { if (b[0]=='Szpony nocy' & b[1]==4 ) {szpony4B++};})});


        let dodRuny4A = 0;
        attackersList.map((a) => a.ewolucje).forEach(function(a) { a.forEach(function(b) { if ( (b[0]=='Piromancja' || b[0]=='Hydromancja' || b[0]=='Forma astralna' || b[0]=='Więź z Gają' ) & b[1]==4 ) {dodRuny4A++};})});
        let dodRuny4B = 0;
        defendersList.map((a) => a.ewolucje).forEach(function(a) { a.forEach(function(b) { if ( (b[0]=='Piromancja' || b[0]=='Hydromancja' || b[0]=='Forma astralna' || b[0]=='Więź z Gają' ) & b[1]==4 ) {dodRuny4B++};})});

        let dodRuny5A = 0;
        attackersList.map((a) => a.ewolucje).forEach(function(a) { a.forEach(function(b) { if ( (b[0]=='Piromancja' || b[0]=='Hydromancja' || b[0]=='Forma astralna' || b[0]=='Więź z Gają' ) & b[1]==5 ) {dodRuny5A++};})});
        let dodRuny5B = 0;
        defendersList.map((a) => a.ewolucje).forEach(function(a) { a.forEach(function(b) { if ( (b[0]=='Piromancja' || b[0]=='Hydromancja' || b[0]=='Forma astralna' || b[0]=='Więź z Gają' ) & b[1]==5 ) {dodRuny5B++};})});

        let totalTeamDmgA = attackersList.map((a) => a.totalDmg).reduce((a,b) => a+b);
        let totalTeamDmgB = defendersList.map((a) => a.totalDmg).reduce((a,b) => a+b);

        let arkanasUsedListA = sumIntegersByUniqueString(attackersList.map((a) => a.arkana));
        let arkanasUsedListB = sumIntegersByUniqueString(defendersList.map((a) => a.arkana));
        let arkanasUsedJoined = outerJoin(arkanasUsedListA, arkanasUsedListB);
        arkanasUsedJoined.unshift(["ARKANA", null, null]);

        let evoUserListA = sumIntegersByUniqueString(attackersList.map((a) => a.ewolucje));
        let evoUserListB = sumIntegersByUniqueString(defendersList.map((a) => a.ewolucje));
        let evoUsedJoined = outerJoin(evoUserListA, evoUserListB);
        evoUsedJoined.unshift(["EWOLUCJE", null, null]);

        let nietrafioneSumA = attackersList.reduce((sum, attacker) => sum + attacker.totalNieTrafilem, 0);
        let nietrafioneSumB = defendersList.reduce((sum, attacker) => sum + attacker.totalNieTrafilem, 0);

        let uniknioneSumA = attackersList.reduce((sum, attacker) => sum + attacker.totalUnikeli, 0);
        let uniknioneSumB = defendersList.reduce((sum, attacker) => sum + attacker.totalUnikeli, 0);

        let bottomPairList = arkanasUsedJoined.concat(evoUsedJoined);

        let results = {
            aName: attackerName,
            bName: defenderName,
            comparision: [
                {name: "Średni spost", valueA: sredniSposAtakujacych, valueB:  sredniSposBroniacych},
                {name: "Średnia zwinka", valueA: sredniaZwinkaA, valueB:  sredniaZwinkaB},
                {name: "Suma hp", valueA: SumaHPA, valueB:  SumaHPB},
                {name: "70% Zwinki", valueA: Zwinka70A, valueB:  Zwinka70B},
                {name: "70% Spost", valueA: spost70A, valueB:  spost70B},
                {name: "Potępieni", valueA: potep70A, valueB:  potep70B},
                {name: "Skóra Bestii", valueA: sbA, valueB:  sbB},
                {name: "Nocny Łowca", valueA: nlA, valueB:  nlB},
                {name: "Szpony 3", valueA: szpony3A, valueB:  szpony3B},
                {name: "Szpony 4", valueA: szpony4A, valueB:  szpony4B},
                {name: "Piromancja/Gaja/Forma/Hydro na 4", valueA: dodRuny4A, valueB:  dodRuny4B},
                {name: "Piromancja/Gaja/Forma/Hydro na 5", valueA: dodRuny5A, valueB:  dodRuny5B},
                {name: "Suma Nietrafionych Ataków [zasięg]", valueA: nietrafioneSumA, valueB:  nietrafioneSumB},
                {name: "Suma Nietrafionych Ataków [unik]", valueA: uniknioneSumA, valueB:  uniknioneSumB},
                {name: "Suma obrażeń", valueA: totalTeamDmgA, valueB: totalTeamDmgB},
            ]
        };

        bottomPairList.forEach(a => {
            let valA = "-";
            let valB = "-"
            if (a[1] !== null) valA = a[1][0] + " | " + a[1][1];
            if (a[2] !== null) valB = a[2][0] + " | " + a[2][1];
            if(a[1] === null && a[2] === null) results.comparision.push({ "name": a[0] , "valueA": " ", "valueB": " " });
            else results.comparision.push({ "name": a[0] + " (Suma|Ilość osób)", "valueA": valA, "valueB": valB });
        });

        buildResultTable(results);
    }
})();

function compareNumbers(a, b) {
    return a - b
}

function sumIntegersByUniqueString(objects) {
    // Create a map to hold the sums for each unique string
    const sumMap = new Map();

    // Iterate over the list of objects
    objects.forEach(obj => {
        // Iterate over each pair in the arkana property
        obj.forEach(([stringValue, intValue]) => {
            // If the string value is already in the map, add the integer to its sum
            if (sumMap.has(stringValue)) {
                sumMap.set(stringValue, [sumMap.get(stringValue)[0] + parseInt(intValue), sumMap.get(stringValue)[1] + 1]);
            } else {
                // Otherwise, add a new entry in the map with the current integer value
                sumMap.set(stringValue, [parseInt(intValue), 1] );
            }
        });
    });

    // Convert the map back to an array of arrays
    const result = Array.from(sumMap, ([stringValue, intValue]) => [stringValue, intValue]);

    return result;
}

function outerJoin(object1, object2) {
    // Create maps to hold the arrays by their keys
    const map1 = new Map(object1.map(arr => [arr[0], arr]));
    const map2 = new Map(object2.map(arr => [arr[0], arr]));

    // Create a set of all keys from both maps
    const allKeys = new Set([...map1.keys(), ...map2.keys()]);

    // Create the result array
    const result = [];

    // Iterate over all keys and merge the arrays
    allKeys.forEach(key => {
        const arr1 = map1.get(key) || [key, null];
        const arr2 = map2.get(key) || [key, null];

        // Combine arrays for the same key
        const combinedArray = [key, arr1[1], arr2[1]];

        result.push(combinedArray);
    });

    return result;
}

function unmodSummary(team) {
    let rlcElements = document.getElementsByClassName('rlc');

    if (rlcElements.length) {
        Array.from(rlcElements).forEach((rlcElement) => {
            const playerStats = {};

            processCombatEvents(rlcElement, 'atkHit', playerStats);
            processCombatEvents(rlcElement, 'defHit', playerStats);

            updateTeamStats(team, playerStats);
        });
    }
}

function processCombatEvents(rlcElement, eventClass, playerStats) {
    let events = rlcElement.getElementsByClassName(eventClass);

    Array.from(events).forEach((event) => {
        let attacker = event.getElementsByTagName('b')[0].innerHTML;
        initializePlayerStats(playerStats, attacker);

        if (event.innerHTML.includes('Żar Krwi')) {
            return;
        }

        playerStats[attacker].totalWyprowadzone++;

        if (event.innerHTML.includes(' zostaje zranion')) {
            let defender = event.getElementsByTagName('b')[event.getElementsByTagName('b').length - 2].innerHTML;
            initializePlayerStats(playerStats, defender);

            playerStats[defender].totalOtrzymane++;
        } else if (event.innerHTML.includes(' nie zostaje trafi') && !event.innerHTML.includes('luzję')) {
            playerStats[attacker].totalNieTrafilem++;

            let defender = event.getElementsByTagName('b')[event.getElementsByTagName('b').length - 1].innerHTML;
            initializePlayerStats(playerStats, defender);

            playerStats[defender].totalNieTrafili++;
        } else if (event.innerHTML.includes(' unika trafie') && !event.innerHTML.includes('luzję')) {
            playerStats[attacker].totalUnikeli++;

            let defender = event.getElementsByTagName('b')[event.getElementsByTagName('b').length - 1].innerHTML;
            initializePlayerStats(playerStats, defender);

            playerStats[defender].totalUniknione++;
        }

        if (event.innerHTML.includes('cios krytyczny')) {
            playerStats[attacker].totalKrytyczne++;
        }
    });
}

function initializePlayerStats(playerStats, playerName) {
    if (!playerStats[playerName]) {
        playerStats[playerName] = {
            totalWyprowadzone: 0,
            totalUnikeli: 0,
            totalOtrzymane: 0,
            totalUniknione: 0,
            totalKrytyczne: 0,
            totalNieTrafilem: 0,
            totalNieTrafili: 0
        };
    }
}

function updateTeamStats(team, playerStats) {
    for (const playerName in playerStats) {
        let player = team.find(p => p.name == playerName);

        if (player !== undefined) {
            player.totalWyprowadzone = playerStats[playerName].totalWyprowadzone;
            player.totalUnikeli = playerStats[playerName].totalUnikeli;
            player.totalOtrzymane = playerStats[playerName].totalOtrzymane;
            player.totalUniknione = playerStats[playerName].totalUniknione;
            player.totalKrytyczne = playerStats[playerName].totalKrytyczne;
            player.totalNieTrafilem = playerStats[playerName].totalNieTrafilem;
            player.totalNieTrafili = playerStats[playerName].totalNieTrafili;
            player.totalTrafione = player.totalWyprowadzone - player.totalUnikeli - player.totalNieTrafilem;
        }
    }
}
    /* function unmodSummary(team) {
    let rlc = document.getElementsByClassName('rlc');
    let rlc2 = document.getElementsByClassName('rlc');
    if (rlc.length) {
        for (let zmiana = 0; zmiana < rlc2.length; zmiana++) {
            var stan = new Array();
            var wyprowadzonych = new Array();
            var kolor = new Array();
            var unik = new Array();
            var kryty = new Array();
            var otrzymane = new Array();
            var uniknione = new Array();
            let s = - 1;
            rlc = rlc2[zmiana];
            let walka = rlc.getElementsByClassName('atkHit');
            for (let i = 0; i < walka.length; i++) {
                let kto = walka[i].getElementsByTagName('B') [0].innerHTML;
                if (s == - 1) {
                    s = 0;
                } else {
                    for (s = 0; s < stan.length; s++) {
                        if (stan[s] == kto) break;
                    }
                }
                stan[s] = kto;
                if (walka[i].innerHTML.search('Żar Krwi') < 1) {
                    if (wyprowadzonych[s] == undefined) wyprowadzonych[s] = 1;
                    else wyprowadzonych[s]++;
                    if (unik[s] == undefined) unik[s] = 0;
                    if (walka[i].innerHTML.search(' zostaje zranion') > 0) {
                        let komu = walka[i].getElementsByTagName('b') [walka[i].getElementsByTagName('b').length - 2].innerHTML;
                        for (var d = 0; d < stan.length; d++) {
                            if (stan[d] == komu) break;
                        }
                        stan[d] = komu;
                        kolor[d] = 'defHit';
                        if (wyprowadzonych[d] == undefined) wyprowadzonych[d] = 0;
                        if (kryty[d] == undefined) kryty[d] = 0;
                        if (unik[d] == undefined) unik[d] = 0;
                        if (otrzymane[d] == undefined) otrzymane[d] = 0;
                        otrzymane[d]++;
                    } else
                        if (walka[i].innerHTML.search(' trafi') > 0 && walka[i].innerHTML.search('luzję') == - 1) {
                            unik[s]++;
                            let komu = walka[i].getElementsByTagName('b') [walka[i].getElementsByTagName('b').length - 1].innerHTML;
                            for (d = 0; d < stan.length; d++) {
                                if (stan[d] == komu) break;
                            }
                            stan[d] = komu;
                            kolor[d] = 'defHit';
                            if (wyprowadzonych[d] == undefined) wyprowadzonych[d] = 0;
                            if (kryty[d] == undefined) kryty[d] = 0;
                            if (unik[d] == undefined) unik[d] = 0;
                            if (uniknione[d] == undefined) uniknione[d] = 0;
                            uniknione[d]++;
                        }
                    if (kryty[s] == undefined) kryty[s] = 0;
                    if (walka[i].innerHTML.search('cios krytyczny') > 0) kryty[s]++;
                }
                kolor[s] = 'atkHit';
            }
            walka = rlc.getElementsByClassName('defHit');
            for (let i = 0; i < walka.length; i++) {
                let kto = walka[i].getElementsByTagName('B') [0].innerHTML;
                if (s == - 1) {
                    s = 0;
                } else {
                    for (s = 0; s < stan.length; s++) {
                        if (stan[s] == kto) break;
                    }
                }
                stan[s] = kto;
                if (walka[i].innerHTML.search('Żar Krwi') < 1) {
                    if (wyprowadzonych[s] == undefined) wyprowadzonych[s] = 1;
                    else wyprowadzonych[s]++;
                    if (unik[s] == undefined) unik[s] = 0;
                    if (walka[i].innerHTML.search(' zostaje zranion') > 0) {
                        let komu = walka[i].getElementsByTagName('b') [walka[i].getElementsByTagName('b').length - 2].innerHTML;
                        for (d = 0; d < stan.length; d++) {
                            if (stan[d] == komu) break;
                        }
                        stan[d] = komu;
                        kolor[d] = 'atkHit';
                        if (wyprowadzonych[d] == undefined) wyprowadzonych[d] = 0;
                        if (kryty[d] == undefined) kryty[d] = 0;
                        if (unik[d] == undefined) unik[d] = 0;
                        if (otrzymane[d] == undefined) otrzymane[d] = 0;
                        otrzymane[d]++;
                    } else
                        if (walka[i].innerHTML.search(' trafi') > 0 && walka[i].innerHTML.search('luzję') == - 1) {
                            unik[s]++;
                            let komu = walka[i].getElementsByTagName('b') [walka[i].getElementsByTagName('b').length - 1].innerHTML;
                            for (d = 0; d < stan.length; d++) {
                                if (stan[d] == komu) break;
                            }
                            stan[d] = komu;
                            kolor[d] = 'atkHit';
                            if (wyprowadzonych[d] == undefined) wyprowadzonych[d] = 0;
                            if (kryty[d] == undefined) kryty[d] = 0;
                            if (unik[d] == undefined) unik[d] = 0;
                            if (uniknione[d] == undefined) uniknione[d] = 0;
                            uniknione[d]++;
                        }
                    if (kryty[s] == undefined) kryty[s] = 0;
                    if (walka[i].innerHTML.search('cios krytyczny') > 0) kryty[s]++;
                }
                kolor[s] = 'defHit';
            }

            for (let i = 0; i < stan.length; i++) {
                let player = team.find(p => p.name == stan[i]);
                if (player !== undefined) {
                    player.totalTrafione = parseInt(wyprowadzonych[i]) - parseInt(unik[i]);
                    player.totalWyprowadzone = parseInt(wyprowadzonych[i]);
                    player.totalUniki = (uniknione[i] == undefined) ? 0 : parseInt(uniknione[i]);
                    player.totalOtrzymane = (otrzymane[i] == undefined) ? 0 : parseInt(otrzymane[i]);
                    player.totalKrytyczne = parseInt(kryty[i]);
                }
            }
        }
    }
} */


    function buildSummaryData(team) {
        let summaryText = document.querySelector("#msgFullText > div > div.amb-bg > div.ambsummary > table.fight > tbody").innerText;
        team.forEach(player => {
            player.totalDmg = parseInt(summaryText.split(player.name + '\t')[1].trim().split(' /')[0]);
        });
    }


    function buildResultTable(data) {
        let table = document.createElement('table');
        table.classList.add('fight');
        table.style.textAlign = 'center';

        generateTableBody(table, data.comparision);
        generateTableHead(table, {dummy: "", aName: data.aName, bName: data.bName});

        function generateTableHead(table, head) {
            let thead = table.createTHead();
            let row = thead.insertRow();
            for (let key in head) {
                if(key !== 'forEach') {
                    let th = document.createElement("th");
                    let text = document.createTextNode(head[key]);
                    th.appendChild(text);
                    row.appendChild(th);
                }
            }
        }

        function generateTableBody(table, data) {
            for (let element of data) {
                let row = table.insertRow();
                for (let key in element) {
                    if(key !== 'forEach') {
                        let cell = row.insertCell();
                        let text = document.createTextNode(element[key]);
                        cell.appendChild(text);
                    }
                }
            }
        }

        let placeholder = document.querySelector("#msgFullText > div > div.amb-bg");
        placeholder.prepend(table);
    }

    function buildTeamData(list) {
        let team = [];
        list.forEach(function (row, i) {
            let player = {
                name: '',
                rasa: '',
                poziom: 0,
                obrona: 0,
                pz: 0,
                pk: 0,
                szczescie: 0,
                ini: 0,
                sila: 0,
                zwinnosc: 0,
                odpornosc: 0,
                wyglad: 0,
                charyzma: 0,
                wplywy: 0,
                spost: 0,
                inteligenncja: 0,
                wiedza: 0,
                item: "",
                arkana: [],
                ewolucje: [],
                talizmany: [],
                id: ""
            };

            let span = row.getElementsByTagName('span')[0];
            let stats = span.getAttribute('onmouseover').replace(/ class="error"/g, '').replace(/ class="incstat"/g, '').replace(/ class=error/g, '').replace(/ class=incstat/g, '').replace(/<span >/g, '<span>');

            player.name = span.innerText;
            player.rasa = stats.split('RASA: <b>')[1].split('</b>')[0];
            player.poziom = parseInt(stats.split('Poziom: <b>')[1].split('</b>')[0]);
            player.obrona = parseInt(stats.split('Obrona: <span><b>')[1].split('</b>')[0]);
            player.pz = parseInt(stats.split('PKT ŻYCIA: <b>')[1].split(' / ')[0]);
            player.pk = parseInt(stats.split('PKT KRWI: <b>')[1].split(' / ')[0]);
            player.szczescie = parseInt(stats.split('SZCZĘŚCIE: <b>')[1].split('</b>')[0]);
            player.ini = parseInt(stats.split('INICJATYWA: <b>')[1].split('</b>')[0]);
            player.sila = parseInt(stats.split('SIŁA: <span><b>')[1].split('</b>')[0]);
            player.zwinnosc = parseInt(stats.split('ZWINNOŚĆ: <span><b>')[1].split('</b>')[0]);
            player.odpornosc = parseInt(stats.split('ODPORNOŚĆ: <span><b>')[1].split('</b>')[0]);
            player.wyglad = parseInt(stats.split('WYGLĄD: <span><b>')[1].split('</b>')[0]);
            player.charyzma = parseInt(stats.split('CHARYZMA: <span><b>')[1].split('</b>')[0]);
            player.wplywy = parseInt(stats.split('WPŁYWY: <span><b>')[1].split('</b>')[0]);
            player.spost = parseInt(stats.split('SPOSTRZEGAWCZOŚĆ: <span><b>')[1].split('</b>')[0]);
            player.inteligenncja = parseInt(stats.split('INTELIGENCJA: <span><b>')[1].split('</b>')[0]);
            player.wiedza = parseInt(stats.split('WIEDZA: <span><b>')[1].split('\n')[0]);
            player.id = "pl_" + span.className.split('pl_')[1];

            let item = stats.split('używa przedmiotu <span>');
            if(item.length > 1) {
                player.item = item[1].split('</span>')[0];
            }

            let arkana = stats.split('Używane arkana: ');
            if(arkana.length > 1) {
                let tab = [];
                tab = arkana[1].split('.</div>')[0].split(', ');
                for (let element of tab)
                {
                    player.arkana.push(element.split(' poz. '));
                }
            }

            let ewolucje = stats.split('Używane ewolucje: <span style="white-space: nowrap;">');
            if(ewolucje.length > 1) {
                // player.ewolucje = ewolucje[1].split('</span>.</div>')[0].split('</span>, <span style="white-space: nowrap;">');
                let tab = [];
                tab = ewolucje[1].split('</span>.</div>')[0].split('</span>, <span style="white-space: nowrap;">');
                for (let element of tab)
                {
                    player.ewolucje.push(element.split(' poz. '));
                }
            }

            let talizmany = stats.split('Talizmany: ');
            if(talizmany.length > 1) {
                // player.talizmany = talizmany[1].split('</div>')[0].split(', ');
                let tab = [];
                tab = talizmany[1].split('</div>')[0].split(', ');
                for (let element of tab)
                {
                    player.talizmany.push(element.split(' poz. '));
                }
            }

            team.push(player);
        });
        return team;
    }