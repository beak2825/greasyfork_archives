// ==UserScript==
// @name         Classement Futur ITTF
// @match        https://www.ittf.com/wp-content/uploads/*
// @icon         https://www.ittf.com/wp-content/uploads/2016/06/favicon_0.png
// @description  Ajoute un sélecteur de date au rankings ITTF pour projeter le classement selon la date
// @version      1.0
// @namespace    docl.dev
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494868/Classement%20Futur%20ITTF.user.js
// @updateURL https://update.greasyfork.org/scripts/494868/Classement%20Futur%20ITTF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const getNextDayOfTheWeek = function (dayName, excludeToday = true, refDate = new Date()) {
        const dayOfWeek = ["sun","mon","tue","wed","thu","fri","sat"]
        .indexOf(dayName.slice(0,3).toLowerCase());
        if (dayOfWeek < 0) return;
        refDate.setHours(0,0,0,0);
        refDate.setDate(refDate.getDate() + +!!excludeToday +
                        (dayOfWeek + 7 - refDate.getDay() - +!!excludeToday) % 7);
        return refDate;
    }

    const filterTournaments = function (players, rankingsDate) {
        for (let i = 0; i < players.length; i++) {
            let player = players[i];
            let tournaments = player.tournaments;
            let activeTournaments = 0;

            // Handle zpp & expired
            for (let j = 0; j < tournaments.length; j++) {
                const tournament = tournaments[j];
                const tournamentExpiresDate = new Date(tournament.expires);

                if (tournamentExpiresDate <= rankingsDate) {
                    tournament.status = 'expired';
                } else if (tournament.position === 'ZPP') {
                    tournament.status = 'zpp';
                    activeTournaments++;
                }
            }

            // Handle active, unnecessary & unusedContinental
            tournaments.sort((a, b) => b.points - a.points);
            let continentalTournament = false;
            for (let j = 0; j < tournaments.length && activeTournaments < 8; j++) {
                const tournament = tournaments[j];
                if (tournament.status === 'expired' || tournament.status === 'zpp') {
                    continue;
                }
                const cat = tournament.category[1].substr(3)
                if (cat === 'cg' || cat === 'ccup' || cat === 'cc' || cat === 'msg' || cat === 're') {
                    if (!continentalTournament) {
                        continentalTournament = true;
                        tournament.status = 'active';
                        activeTournaments++;
                    } else {
                        tournament.status = 'unusedContinental';
                    }
                } else {
                    tournament.status = 'active';
                    activeTournaments++;
                }
            }
        }
    }

    const extractTournaments = function (table) {
        let result = [];

        const tournaments = table.getElementsByTagName('tr');

        for (let i = 0; i < tournaments.length; i++) {
            const tournamentInfo = tournaments[i];
            const data = tournamentInfo.getElementsByTagName('td');
            result.push({
                tournament: data[0].innerText,
                category: data[1].getElementsByTagName('p')[0].classList,
                expires: data[2].innerText,
                position: data[3].innerText,
                points: data[4].innerText,
                status: 'unnecessary'
            });
        }

        return result;
    }

    const showRankings = function (players, date) {
        for (let player of players) {
            for (let tournament of player.tournaments) {
                tournament.status = "unnecessary"
            }
        }

        const getTotalPoints = function (tournaments) {
            let points = 0;
            for (let i = 0; i < tournaments.length; i++) {
                if (tournaments[i].status === 'active') {
                    points += parseInt(tournaments[i].points);
                }
            }
            return points;
        }

        const updateInterface = function (players) {
            let rows = document.getElementsByClassName('rrow');
            for (let i = 0; i < rows.length; i++) {
                let row = rows[i];
                let columns = row.getElementsByTagName('td');
                columns[0].innerHTML = i + 1;
                columns[1].innerHTML = players[i].name;
                columns[2].innerHTML = "<p class='fg fg-" + players[i].country + "'></p>" + players[i].country;
                columns[3].innerHTML = players[i].totalPoints;
            }

            rows = document.getElementsByClassName('drow');
            for (let i = 0; i < rows.length; i++) {
                const tournamentsTable = rows[i].getElementsByTagName('tbody')[0];
                tournamentsTable.innerHTML = '';
                const tournaments = players[i].tournaments;
                for (let j = 0; j < tournaments.length; j++) {
                    const tournament = tournaments[j];

                    let rowElement = document.createElement('tr');
                    rowElement.className = 'details';
                    if (tournament.status === 'zpp') {
                        rowElement.className += ' detailspenalty';
                    } else if (tournament.status === 'active') {
                        rowElement.className += ' detailstop';
                    } else if (tournament.status === 'expired') {
                        rowElement.style.opacity = 0.1;
                    }

                    let tournamentNameElement = document.createElement('td');
                    tournamentNameElement.className = 'details';
                    tournamentNameElement.innerText = tournament.tournament;

                    let tournamentCategoryElement = document.createElement('td');
                    tournamentCategoryElement.className = 'details rcellc';
                    let paragraphElement = document.createElement('p');
                    if (typeof tournament.category[0] === "string") {
                        for (let className of tournament.category) {
                            paragraphElement.classList.add(className)
                        }
                    } else {
                        paragraphElement.classList = tournament.category;
                    }
                    tournamentCategoryElement.append(paragraphElement);

                    let tournamentDateElement = document.createElement('td');
                    tournamentDateElement.className = 'details detailsexpiration rcellc';
                    tournamentDateElement.innerText = tournament.expires;

                    let tournamentPositionElement = document.createElement('td');
                    tournamentPositionElement.className = 'details rcellc';
                    tournamentPositionElement.innerText = tournament.position;

                    let tournamentPointsElement = document.createElement('td');
                    tournamentPointsElement.className = 'details rcellc';
                    tournamentPointsElement.innerText = tournament.points;

                    rowElement.append(tournamentNameElement);
                    rowElement.append(tournamentCategoryElement);
                    rowElement.append(tournamentDateElement);
                    rowElement.append(tournamentPositionElement);
                    rowElement.append(tournamentPointsElement);
                    tournamentsTable.append(rowElement);
                }
            }
        };

        filterTournaments(players, date);

        for (let i = 0; i < players.length; i++) {
            players[i].totalPoints = getTotalPoints(players[i].tournaments);
        }

        players.sort((a, b) => b.totalPoints - a.totalPoints);

        updateInterface(players);
    }

    const extractPlayers = function () {
        const playersRows = document.getElementsByClassName('rrow');
        const pointsRows = document.getElementsByClassName('drow');
        let players = [];

        for (let i = 0; i < playersRows.length; i++) {
            const playerRow = playersRows[i];
            const pointsRow = pointsRows[i];

            players.push({
                name: playerRow.getElementsByTagName('td')[1].innerText,
                tournaments: extractTournaments(pointsRow.getElementsByTagName('tbody')[0]),
                country: playerRow.getElementsByTagName('td')[2].innerText,
            });
        }

        for (let i = 0; i < players.length; i++) {
            const player = players[i]
            for (let j = 0; j < additionalResults.length; j++) {
                const additionalResult = additionalResults[j];
                if (additionalResult.name === player.name) {
                    player.tournaments = player.tournaments.concat(additionalResult.tournaments)
                }
            }
        }

        return players;
    }

    let additionalResults = []

    let players = extractPlayers();

    const td = document.getElementsByClassName('ageselector')[0];
    let select = document.createElement('select');
    let option = document.createElement('option');
    option.innerText = ' ';
    select.append(option);
    const firstDate = getNextDayOfTheWeek("Tuesday");
    for (let j = 0; j < 30; j++) {
        const date = new Date(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate() + (j * 7));
        let option = document.createElement('option');
        option.innerText = date.toLocaleDateString('fr');
        select.append(option);
    }
    td.append(select);

    select.addEventListener('change', function () {
        if (select.value === '') {
            document.location.reload();
            return;
        }
        const date = new Date(select.value.split('/').reverse().join('/'));
        showRankings(players, date);
    });
})();