// ==UserScript==
// @name         Heroes Leaderboards Reforged
// @namespace    mailto:elitesparkle.gaming@gmail.com
// @version      1.5
// @description  Improve the Grand Master Leaderboards for Heroes of the Storm.
// @author       Elitesparkle
// @license      MIT License
// @match        https://heroesofthestorm.blizzard.com/*/leaderboards/*/*/*/
// @icon         https://blznav.akamaized.net/img/games/logo-heroes-78cae505b7a524fb.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477553/Heroes%20Leaderboards%20Reforged.user.js
// @updateURL https://update.greasyfork.org/scripts/477553/Heroes%20Leaderboards%20Reforged.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener("load", function () {
        let table = document.querySelector("table");
        let season_number = document.URL.split("/")[6];

        let button_class = "RankingTable-button leaderboards-rankings-load btn";
        let disabled_flag = "";

        let previous_number = parseInt(season_number) - 1;

        if (previous_number < 1) {
            previous_number = 0;
            disabled_flag = " RankingTable-button--disabled";
        }

        let previous_url = document.URL.replace(season_number, previous_number);

        if (previous_number <= 11) {
            previous_url = previous_url.replace("/storm/", "/hero/");
        }
        else
        {
            previous_url = previous_url.replace("/hero/", "/storm/").replace("/team/", "/storm/");
        }

        let previous_button = document.createElement("INPUT");
        previous_button.setAttribute("class", button_class + disabled_flag);
        previous_button.setAttribute("type", "button");
        previous_button.setAttribute("value", "←");
        previous_button.style.fontSize = "16px";
        previous_button.setAttribute("onclick", "location.href = '" + previous_url + "'");

        let next_number = parseInt(season_number) + 1;
        let next_url = document.URL.replace(season_number, next_number);

        if (next_number <= 11) {
            next_url = next_url.replace("/storm/", "/hero/");
        }
        else
        {
            next_url = next_url.replace("/hero/", "/storm/").replace("/team/", "/storm/");
        }

        let next_button = document.createElement("INPUT");
        next_button.setAttribute("class", button_class);
        next_button.setAttribute("type", "button");
        next_button.setAttribute("value", "→");
        next_button.style.fontSize = "16px";
        next_button.setAttribute("onclick", "location.href = '" + next_url + "'");

        let div = document.querySelectorAll("div")[12];
        div.appendChild(previous_button);
        div.appendChild (document.createTextNode(" "));
        div.appendChild(next_button);

        if (table) {
            let language = document.URL.split("/")[3];

            let win_rate_locals = {
                "en-us": "Win Rate",
                "es-mx": "Ratio de victorias",
                "pt-br": "Taxa de vitórias",
                "de-de": "Gewinnrate",
                "en-gb": "Win Rate",
                "es-es": "Ratio de victorias",
                "fr-fr": "Taux de réussite",
                "it-it": "Tasso di Vittoria",
                "pl-pl": "Współczynnik wygranych",
                "ru-ru": "Шанс на победу",
                "ko-kr": "승률",
                "zh-tw": "贏率"
            }

            let main_role_locals = {
                "en-us": "Main Role",
                "es-mx": "Rol principal",
                "pt-br": "Papel principal",
                "de-de": "Hauptrolle",
                "en-gb": "Main Role",
                "es-es": "Rol principal",
                "fr-fr": "Rôle principal",
                "it-it": "Ruolo Principale",
                "pl-pl": "Główna rola",
                "ru-ru": "Главная роль",
                "ko-kr": "주요 역할",
                "zh-tw": "主要角色"
            }

            let win_rate_column = 4;
            let role_column = 7;
            let last_column;

            let cell = table.rows[0].insertCell(win_rate_column);

            if (win_rate_locals[language] === undefined) {
                cell.innerText = win_rate_locals["en-us"];
            }
            else {
                cell.innerText = win_rate_locals[language];
            }

            cell.style.textAlign = "center";
            cell.style.fontWeight = "bold";

            let game_mode = document.URL.split("/")[5];
            if (game_mode == "storm") {
                let healer = table.rows[0].cells[10].innerHTML;
                let melee_assassin = table.rows[0].cells[11].innerHTML;
                table.rows[0].cells[10].innerHTML = melee_assassin;
                table.rows[0].cells[11].innerHTML = healer;

                last_column = 12;
            }
            else {
                last_column = 10;
            }

            for (let i = 1; i < table.rows.length; i++) {
                let wins = table.rows[i].cells[5].innerText;
                let games = table.rows[i].cells[4].innerText;
                let win_rate = (wins / games * 100).toFixed();

                let cell = table.rows[i].insertCell(win_rate_column);
                cell.innerHTML = win_rate + "%";
                cell.style.textAlign = "center";

                if (win_rate >= 70) {
                    cell.style.color = "#00FFFF"; // Cyan
                }
                else if (win_rate >= 60) {
                    cell.style.color = "#00FF00"; // Green
                }
                else if (win_rate >= 50) {
                    cell.style.color = "#FFFF00"; // Yellow
                }
                else {
                    cell.style.color = "#FF0000"; // Red
                }

                let max_preference = parseFloat(table.rows[i].cells[last_column].innerText);
                let role_preference = table.rows[0].cells[last_column].innerHTML;

                for (let j = 7; j <= last_column; j++) {
                    let preference = parseFloat(table.rows[i].cells[j].innerText);
                    if (preference > max_preference) {
                        max_preference = preference;
                        role_preference = table.rows[0].cells[j].innerHTML;
                    }
                }

                cell = table.rows[i].insertCell(role_column);
                cell.innerHTML = role_preference;
                cell.setAttribute("align", "center");
                cell.style.verticalAlign = "bottom";
            }

            cell = table.rows[0].insertCell(role_column);

            if (main_role_locals[language] === undefined) {
                cell.innerText = main_role_locals["en-us"];
            }
            else {
                cell.innerText = main_role_locals[language];
            }

            cell.style.textAlign = "center";
            cell.style.fontWeight = "bold";
        }
    }, false)
})();