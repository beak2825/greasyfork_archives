// ==UserScript==
// @name         Descarga Primer Equipo Clash de Federaciones
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Extrae datos del Primer Equipo y de StatsXente y los descarga en un solo archivo Excel.
// @author       Titor Ojea manager de Oflador FC 2003
// @match        https://www.managerzone.com/?p=federations*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=managerzone.com
// @grant        GM_xmlhttpRequest
// @connect      statsxente.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.3/xlsx.full.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504551/Descarga%20Primer%20Equipo%20Clash%20de%20Federaciones.user.js
// @updateURL https://update.greasyfork.org/scripts/504551/Descarga%20Primer%20Equipo%20Clash%20de%20Federaciones.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Crear e insertar el botón de descarga
    const button = document.createElement('button');
    button.textContent = '↓Miembros↓';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.padding = '10px';
    button.style.backgroundColor = '#0063a8';
    button.style.color = '#FFFFFF';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.boxShadow = '0 4px #00325A';  // Sombra para el efecto 3D

    // Efecto de presionar el botón
    button.addEventListener('mousedown', () => {
        button.style.transform = 'translateY(4px)';  // Movimiento hacia abajo
        button.style.boxShadow = '0 2px #00325A';    // Reducción de la sombra
    });

    button.addEventListener('mouseup', () => {
        button.style.transform = 'translateY(0)';    // Restablecer posición
        button.style.boxShadow = '0 4px #00325A';    // Restablecer sombra
    });

    document.body.appendChild(button);

    button.addEventListener('click', () => {
        function getParameterByName(name, url = window.location.href) {
            name = name.replace(/[\[\]]/g, '\\$&');
            const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
            const results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, ' '));
        }


        // Función para descargar el archivo Excel
        function downloadExcel(workbook, filename) {
            const wbout = XLSX.write(workbook, {bookType: 'xlsx', type: 'binary'});
            function s2ab(s) {
                const buf = new ArrayBuffer(s.length);
                const view = new Uint8Array(buf);
                for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
                return buf;
            }
            const blob = new Blob([s2ab(wbout)], {type: "application/octet-stream"});
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
        }

        // Función para convertir código de país a nombre
        function countryCodeToName(code) {
            const countries = {
            "BR": "Brasil", "AR": "Argentina", "SE": "Suecia", "CN": "China", "PL": "Polonia",
            "TR": "Turquía", "RO": "Rumania", "ES": "España", "IT": "Italia", "BE": "Bélgica",
            "PT": "Portugal", "GR": "Grecia", "CL": "Chile", "EC": "Ecuador", "DE": "Alemania",
            "EN": "Inglaterra", "BG": "Bulgaria", "MX": "México", "NL": "Holanda", "HU": "Hungría",
            "EE": "Estonia", "DK": "Dinamarca", "CO": "Colombia", "FR": "Francia", "US": "Estados Unidos",
            "UY": "Uruguay", "PE": "Perú", "NO": "Noruega", "ID": "Indonesia", "VE": "Venezuela",
            "CZ": "República Checa", "CA": "Canadá", "AU": "Australia", "CH": "Suiza", "SK": "Eslovaquia",
            "AL": "Albania", "LT": "Lituania", "AT": "Austria", "FI": "Finlandia", "RU": "Rusia",
            "SG": "Singapur", "BO": "Bolivia", "MT": "Malta", "DC": "País MZ", "CY": "Chipre",
            "CR": "Costa Rica", "DO": "República Dominicana", "KR": "Corea del Sur", "YX": "Serbia",
            "PY": "Paraguay", "HR": "Croacia", "IE": "Irlanda", "SX": "Escocia", "NG": "Nigeria",
            "PA": "Panamá", "SV": "El Salvador", "GE": "Georgia", "LV": "Letonia", "BA": "Bosnia Herzegovina",
            "AZ": "Azerbaiján", "IX": "Irlanda del Norte", "ZA": "Sudáfrica", "SN": "Senegal",
            "SI": "Eslovenia", "MD": "Moldavia", "AE": "Emiratos Árabes Unidos", "WA": "Gales",
            "LU": "Luxemburgo", "UA": "Ucrania", "VN": "Vietnam", "PH": "Filipinas", "HN": "Honduras",
            "AO": "Angola", "GT": "Guatemala", "IR": "Irán", "IL": "Israel", "MK": "Macedonia",
            "BY": "Belarus", "MY": "Malasia", "EG": "Egipto", "IS": "Islandia", "IN": "India",
            "KZ": "Kazajstán", "MA": "Marruecos", "DZ": "Algeria", "PK": "Pakistán", "TH": "Tailandia",
            "SA": "Arabia Saudita", "YU": "Montenegro", "TT": "Trinidad y Tobago", "TN": "Túnez",
            "KE": "Kenia", "AD": "Andorra", "BD": "Bangladesh", "LB": "Líbano", "JO": "Jordán",
            "KW": "Kuwait", "LI": "Liechtenstein", "KG": "Kirguistán", "FO": "Islas Feroe"
            };
            return countries[code] || code;
        }

        // Tabla de conversión de monedas a USD
        const currencyToUSD = {
            "SEK": 7.4234, "EUR": 0.80887, "USD": 1, "GBP": 0.555957, "DKK": 6.00978,
            "NOK": 6.921908, "CHF": 1.265201, "CAD": 1.3003, "AUD": 1.309244, "R$": 2.827003,
            "ILS": 4.378812, "MXN": 10.82507, "ARS": 2.807162, "BOB": 7.905644, "PYG": 5671.047,
            "UYU": 28.88898, "RUB": 28.21191, "PLN": 3.801452, "ISK": 71.15307, "BGN": 1.576971,
            "ZAR": 5.999531, "THB": 43.46507, "SIT": 190.539, "SKK": 29.75788, "JPY": 123.7233,
            "INR": 43.66706, "MZ": 7.4234, "MM": 7.4234, "?": 7.4234
        };

        // Función para convertir valores a USD
        function convertToUSD(value, currency) {
            const rate = currencyToUSD[currency] || 1;
            return value / rate;
        }

        // Obtener el título de la página y limpiarlo
        const title = document.title.replace(/[^a-zA-Z0-9\s\(\)\[\]\-]/g, '').trim();

        // Crear el nombre del archivo y de la hoja
        const fileName = `${title}.xlsx`;

        // Crear el libro de Excel
        const wb = XLSX.utils.book_new();
        const ws_data = [["País", "Valuación", "Equipo", "Usuario", "Rank", "", "Liga Local", "Posición Local", "Liga Mundial", "Posición Mundial", "", "Promedio Edad"]];

        // Función para obtener datos de StatsXente
        function fetchStatsXenteData(username) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `https://statsxente.com/MZ1/Lecturas/getUserInfoLeagues.php?deporte=soccer&usuario=${username}`,
                    onload: async function(response) {
                    if (response.status === 200) {
                        const data = JSON.parse(response.responseText);
                        console.log(`Datos obtenidos para ${username}:`, data);

                        const leaguePosition = await fetchLeaguePosition(data.idLigaWorld, data.idEquipo);
                         let divisionNumberWorld;

                            if (data.nombreLigaWorld) {
                                if (data.nombreLigaWorld.startsWith('Top Series')) {
                                    divisionNumberWorld = 0;
                                } else {
                                    const match = data.nombreLigaWorld.match(/Div (\d+)/i);
                                    divisionNumberWorld = match ? parseInt(match[1], 10) : 'N/A';
                                }
                            } else {
                                divisionNumberWorld = 'N/A';
                            }

                        const positionWorld = leaguePosition || 'N/A';
                        resolve({
                            usuario: data.usuario,
                            divisionNumberWorld: divisionNumberWorld,
                            positionWorld: positionWorld
                        });
                    } else {
                        console.error(`Error al obtener datos para ${username}`);
                        reject(new Error(`Error fetching data for ${username}`));
                    }
                }
            });
        });
    }


           // Función para obtener la posición en la Liga Mundial
    function fetchLeaguePosition(league_id, team_id) {
        return new Promise((resolve, reject) => {
            if (!league_id) {
                resolve('N/A');
                return;
            }
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://www.statsxente.com/MZ1/API/world_leagues.php?sport=soccer&league_id=${league_id}&format=json`,
                onload: function(response) {
                    if (response.status === 200) {
                        const data = JSON.parse(response.responseText);
                        console.log(`Datos de posición mundial para ID Liga ${league_id} y ID Equipo ${team_id}:`, data);

                        // Convertir ambos valores a cadenas para asegurarse de que la comparación sea correcta
                        const teamIdString = String(team_id);
                        const positionData = data.find(entry => String(entry.teamID) === teamIdString);

                        if (positionData) {
                            resolve(positionData.pos);
                        } else {
                            console.warn(`No se encontró la posición para el equipo ${teamIdString}`);
                            resolve('N/A');
                        }
                    } else {
                        console.error(`Error al obtener la posición de la liga mundial para el equipo ${team_id}`);
                        resolve('N/A');
                    }
                }
            });
        });
    }


                // Función para extraer la información de un usuario y completar la tabla
        async function fetchUserData(username) {
            const url = `https://www.managerzone.com/xml/manager_data.php?sport_id=1&username=${username}`;
            const userData = await fetch(url).then(response => response.text())
                .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
                .then(data => data.querySelector('UserData'));

            const country = countryCodeToName(userData.getAttribute('countryShortname'));
            const team = userData.querySelector('Team[sport="soccer"]');
            const teamName = team.getAttribute('teamName');
            const rank = parseInt(team.getAttribute('rankPos'), 10) || 0;
            const seriesName = team.getAttribute('seriesName');
            const leagueId = team.getAttribute('seriesId');
            const teamId = team.getAttribute('teamId');

            // Obtener el número de división local
            let divisionNumber = 0;
            if (seriesName.match(/div(\d+)/)) {
                divisionNumber = parseInt(seriesName.match(/div(\d+)/)[1], 10);
            }

            // Obtener la posición local en la liga
            const leagueUrl = `https://www.managerzone.com/xml/team_league.php?sport_id=1&league_id=${leagueId}`;
            const localPosition = await fetch(leagueUrl).then(response => response.text())
                .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
                .then(leagueData => {
                    const teamNode = leagueData.querySelector(`Team[teamId="${teamId}"]`);
                    return teamNode ? parseInt(teamNode.getAttribute('pos'), 10) : 0;
                });

            // Obtener la valuación del equipo y el promedio de edad
            const valuationUrl = `https://www.managerzone.com/xml/team_playerlist.php?sport_id=1&team_id=${teamId}`;
            const topPlayers = await fetch(valuationUrl).then(response => response.text())
                .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
                .then(playerData => {
                    const players = Array.from(playerData.querySelectorAll('Player'));
                    const teamCurrency = playerData.querySelector('TeamPlayers').getAttribute('teamCurrency') || 'USD';
                    const topPlayers = players
                        .map(player => ({
                            value: parseInt(player.getAttribute('value') || 0, 10),
                            age: parseInt(player.getAttribute('age') || 0, 10)
                        }))
                        .sort((a, b) => b.value - a.value)
                        .slice(0, 11);
                    return {
                        totalValue: topPlayers.reduce((sum, player) => sum + convertToUSD(player.value, teamCurrency), 0),
                        avgAge: Number((topPlayers.reduce((sum, player) => sum + player.age, 0) / topPlayers.length).toFixed(1)) // Convertir a número

                    };
                });

            // Obtener los datos de StatsXente
            const statsXenteData = await fetchStatsXenteData(username);

            return { country, teamName, username, rank, localPosition, divisionNumber, valuation: topPlayers.totalValue, avgAge: topPlayers.avgAge, worldLeagueDivision: statsXenteData.divisionNumberWorld, worldLeaguePosition: statsXenteData.positionWorld };
        }


                // Obtener la lista de usuarios desde la tabla de miembros
        const users = Array.from(document.querySelectorAll('#federation_clash_members_list a[href*="uid="]')).map(a => a.textContent.trim());

        // Procesar los datos de cada usuario y llenar la hoja de Excel
        Promise.all(users.map(username => fetchUserData(username))).then(results => {
            results.forEach(({ country, valuation, teamName, username, rank, divisionNumber, localPosition, worldLeagueDivision, worldLeaguePosition, avgAge }) => {
                ws_data.push([country, Math.round(valuation), teamName, username, rank, "", divisionNumber, localPosition, worldLeagueDivision, worldLeaguePosition, "", avgAge]);
            });

            // Crear y descargar el archivo Excel
            const ws = XLSX.utils.aoa_to_sheet(ws_data);
            XLSX.utils.book_append_sheet(wb, ws, "Datos");
            downloadExcel(wb, fileName);
        }).catch(error => {
            console.error("Error en la obtención o procesamiento de datos:", error);
        });
    });

})();
