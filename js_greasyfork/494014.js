// ==UserScript==
// @name         ATP Tour Statistics
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Skript vytvářející dvě tabulky se statistikami
// @author       MK
// @match        https://itp-atp-sls.infosys-platforms.com/prod/api/stats-plus/v1/keystats/year/*
// @icon         https://images.crunchbase.com/image/upload/c_pad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/v1415386231/utypaslbyxwfuwhfdzxd.png
// @grant        GM_xmlhttpRequest
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/494014/ATP%20Tour%20Statistics.user.js
// @updateURL https://update.greasyfork.org/scripts/494014/ATP%20Tour%20Statistics.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Section for Keystats
    (function() {
        function loadCryptoJSAndRun() {
            const script = document.createElement('script');
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js";
            script.onload = runScriptKeystats;  // Spustí runScriptKeystats až po načtení CryptoJS
            document.head.appendChild(script);
        }

        function decode(data) {
            var e = formatDate(new Date(data.lastModified)),
                n = CryptoJS.enc.Utf8.parse(e),
                r = CryptoJS.enc.Utf8.parse(e.toUpperCase()),
                decrypted = CryptoJS.AES.decrypt(data.response, n, {
                    iv: r,
                    mode: CryptoJS.mode.CBC,
                    padding: CryptoJS.pad.Pkcs7
                });
            return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
        }

        function formatDate(t) {
        var e = (new Date()).getTimezoneOffset(),
            n = new Date(t.getTime() + 60 * e * 1000).getDate(),
            r = parseInt((n < 10 ? "0" + n : n).toString().split("").reverse().join("")),
            i = t.getFullYear(),
            a = parseInt(i.toString().split("").reverse().join("")),
            o = parseInt(t.getTime().toString(), 16).toString(36) + ((i + a) * (n + r)).toString(24),
            s = o.length;
        if (s < 14) {
            for (var c = 0; c < 14 - s; c++) {
                o += "0";
            }
        } else {
            s > 14 && (o = o.substr(0, 14));
        }
        return "#" + o + "$";
    }

        function runScriptKeystats() {
            const data = JSON.parse(document.querySelector('body > pre').textContent);
            const decodedData = decode(data);
            const set0Stats = decodedData.setStats.set0;
            let style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
            .custom-table {
                position: fixed;
                top: 60px;
                left: 30px;
                border: 3px solid black;
                background-color: white;
                font-size: 20px;
                vertical-align: middle;
                z-index: 999999999;
            }
            .custom-table td {
                border: 1px solid black;
            }
            .custom-table td:first-child {
                width: 200px;
                text-align: right;
                padding-right: 10px;
            }
            .custom-table td:nth-child(n+2) {
                width: 50px;
                text-align: center;
                font-weight: bold;
            }
        `;
        document.head.appendChild(style);

        // Vytvoření tabulky a přidání do stránky
        const table = document.createElement('table');
        table.className = 'custom-table';

        // Pro každou statistiku vytvořit řádek tabulky
        set0Stats.forEach(stat => {
            const row = table.insertRow();
            row.id = stat.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
            const cell1 = row.insertCell(0);
            cell1.textContent = stat.name;  // Název statistiky
            const cell2 = row.insertCell(1);
            cell2.textContent = stat.player1;  // Hodnota pro player1
            const cell3 = row.insertCell(2);
            cell3.textContent = stat.player2;  // Hodnota pro player2
        });

        // Přidání tabulky na stránku
        document.body.appendChild(table);
    }

        loadCryptoJSAndRun();
    })();

    // Section for Hawkeye
    (function() {
        const link = window.location.href;
        const year = link.match(/year\/([0-9]+)/)[1];
        const event = link.match(/eventId\/([0-9]+)/)[1];
        const match = link.match(/matchId\/([A-Z0-9]+)/)[1];

        function fetchData() {
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://www.atptour.com/-/Hawkeye/MatchStats/" + year + "/" + event + "/" + match.toLowerCase(),
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        console.log("Data retrieved successfully!");
                        let hawkeye = JSON.parse(response.responseText);
                        let playerTeam1Sets = hawkeye.Match.PlayerTeam1.Sets[0].Stats;
                        let playerTeam2Sets = hawkeye.Match.PlayerTeam2.Sets[0].Stats;
                        let combinedTableHawkeye = document.createElement('table');
                        generateTableHawkeye(playerTeam1Sets, playerTeam2Sets, combinedTableHawkeye);
                    } else {
                        console.error("Failed to fetch data: ", response.statusText);
                    }
                },
                onerror: function(error) {
                    console.error("Error fetching data: ", error);
                }
            });
        }

        function generateTableHawkeye(team1Data, team2Data, table) {
            table.className = 'hawkeye-table';

        processStats(team1Data.ServiceStats, team2Data.ServiceStats, table, "Service");
        processStats(team1Data.ReturnStats, team2Data.ReturnStats, table, "Return");

        document.body.appendChild(table);
    }

            function processStats(team1Stats, team2Stats, table, keyPrefix = "") {
        Object.keys(team1Stats).forEach(key => {
            let compoundKey = keyPrefix ? `${keyPrefix}${key}` : key; // Creating compound key
            if (typeof team1Stats[key] === 'object' && team1Stats[key] !== null) {
                processStats(team1Stats[key], team2Stats[key], table, compoundKey); // Recursive call with updated key
            } else {
                let row = table.insertRow(-1);
                row.id = compoundKey.replace(/[^a-zA-Z0-9]/g, '-');
                let statName = row.insertCell(0);
                statName.textContent = compoundKey; // Using the compound key
                let team1Value = row.insertCell(1);
                team1Value.textContent = team1Stats[key] || 'N/A';
                let team2Value = row.insertCell(2);
                team2Value.textContent = team2Stats[key] || 'N/A';
            }
        });
    }

    // Adding styling for the table
    let style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
            .hawkeye-table {
                position: absolute;
                top: 20px;
                right: 60px;
                border: 3px solid black;
                background-color: white;
                font-size: 20px;
                vertical-align: middle;
                z-index: 999999999;
            }
            .hawkeye-table td {
                border: 1px solid black;
            }
            .hawkeye-table td:first-child {
                width: 200px;
                text-align: right;
                padding-right: 10px;
            }
            .hawkeye-table td:nth-child(n+2) {
                width: 50px;
                text-align: center;
                font-weight: bold;
            }
    `;
    document.head.appendChild(style);

        fetchData();
    })();

})();