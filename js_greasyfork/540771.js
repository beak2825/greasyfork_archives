// ==UserScript==
// @name         MZ - Página de partidos
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Colorea partidos, agrega escudos y mejora la barra de torneos en ManagerZone
// @license      oz
// @match        https://www.managerzone.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540771/MZ%20-%20P%C3%A1gina%20de%20partidos.user.js
// @updateURL https://update.greasyfork.org/scripts/540771/MZ%20-%20P%C3%A1gina%20de%20partidos.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Colores según el tipo de partido
    const colors = {
        "Copa Oficial": "#fff67d",
        "Liga": "#94c24f",
        "Liga Sub18": "#94c24f",
        "Liga Sub21": "#94c24f",
        "Liga Sub23": "#94c24f",
        "Liga Mundial": "#79d2ed",
        "Liga Mundial U18": "#79d2ed",
        "Liga Mundial U21": "#79d2ed",
        "Liga Mundial U23": "#79d2ed",
        "Liga Amistosa": "#f296a6",
        "Amistoso": "#dedddc",
        "Copa Amistosa/de Socios": "#faa770",
        "Desafío": "#b087c9",
    };

    function addTeamBadges() {
        document.querySelectorAll(".teams-wrapper dl").forEach(teamContainer => {
            let homeTeam = teamContainer.querySelector(".home-team-column a");
            let awayTeam = teamContainer.querySelector(".away-team-column a");

            function addBadge(teamElement, position) {
                if (!teamElement) return;

                let teamID = new URLSearchParams(teamElement.href).get("tid");

                // Si el equipo es el tuyo y no tiene un ID válido, forzar el correcto
                if (!teamID && teamElement.innerHTML.includes("<strong>")) {
                    teamID = "1056966"; // ID de tu equipo
                }

                if (teamID && !teamElement.closest("dd").querySelector("img.badge")) {
                    let badge = document.createElement("img");
                    badge.src = `https://www.managerzone.com/dynimg/badge.php?team_id=${teamID}&sport=soccer&location=team_main`;
                    badge.width = 20;
                    badge.height = 25;
                    badge.classList.add("badge");

                    let flag = teamElement.closest("dd").querySelector("img[src*='flag']");

                    if (flag) {
                        if (position === "home") {
                            flag.insertAdjacentElement("afterend", badge);
                        } else {
                            flag.insertAdjacentElement("beforebegin", badge);
                        }
                    } else {
                        teamElement.closest("dd").prepend(badge);
                    }
                }
            }

            addBadge(homeTeam, "home");
            addBadge(awayTeam, "away");
        });
    }

    function highlightMatches() {
        document.querySelectorAll(".match-reference-text-wrapper").forEach(match => {
            let matchType = match.querySelector("span")?.textContent.trim();
            if (matchType && colors[matchType]) {
                match.style.backgroundColor = colors[matchType];
                match.style.padding = "5px";
            }
        });
    }

    function replaceTournamentProgressBar() {
        document.querySelectorAll('.mzProgressbar.mini').forEach(progressBar => {
            let title = progressBar.getAttribute('title');
            let currentRound = title ? parseInt(title.replace(/\D/g, '')) : null;

            let roundWrapper = progressBar.querySelector('.round_wrapper');
            let playoffWrapper = progressBar.querySelector('.playoff_wrapper');

            if (!roundWrapper) return;

            let totalLeagueRounds = roundWrapper.querySelectorAll('.round').length;
            let leagueLastRound = roundWrapper.querySelector('.round.last');
            let inPlayoffs = playoffWrapper && leagueLastRound && currentRound > totalLeagueRounds;

            let text;
            if (inPlayoffs) {
                let playoffStages = ["Final", "Semifinales", "Cuartos de final", "Octavos de final", "Dieciseisavos", "32avos", "64avos", "128avos"];
                let allRounds = Array.from(playoffWrapper.querySelectorAll('.round'));
                let finalRound = playoffWrapper.querySelector('.round.last');

                if (finalRound) {
                    let finalIndex = allRounds.indexOf(finalRound);
                    let totalPlayoffRounds = allRounds.length;
                    let currentPlayoffRound = currentRound - totalLeagueRounds;
                    let stageIndex = totalPlayoffRounds - currentPlayoffRound;
                    text = `${playoffStages[stageIndex] || `Ronda ${currentPlayoffRound}`}`;
                } else {
                    text = "Playoffs - Sin Final detectada";
                }
            } else {
                text = `Ronda ${currentRound} de ${totalLeagueRounds}`;
            }

            let container = progressBar.closest('.progress-container');
            if (container) {
                container.innerHTML = `<strong>${text}</strong>`;
            }
        });
    }

    function processPage() {
        highlightMatches();
        addTeamBadges();
        replaceTournamentProgressBar();
    }

    // Ejecución inicial
    processPage();

    // Detectar cambios dinámicos en la página
    const observer = new MutationObserver(() => processPage());
    observer.observe(document.body, { childList: true, subtree: true });

})();
