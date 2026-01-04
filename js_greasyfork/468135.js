// ==UserScript==
// @name Plemiona - BBCode generator w notatkach dla wojsk plemienia
// @namespace http://tampermonkey.net/
// @version 0.1
// @description BBCode generator w notatkach dla wojsk plemienia
// @author Ten Zly
// @match https://*.plemiona.pl/game.php?*screen=memo*
// @icon https://www.google.com/s2/favicons?sz=64&domain=plemiona.pl
// @license GNU GPLv3
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/468135/Plemiona%20-%20BBCode%20generator%20w%20notatkach%20dla%20wojsk%20plemienia.user.js
// @updateURL https://update.greasyfork.org/scripts/468135/Plemiona%20-%20BBCode%20generator%20w%20notatkach%20dla%20wojsk%20plemienia.meta.js
// ==/UserScript==

(async function () {
    const gameId = window.location.href.match(/pl(\d+)/)[1];
    const baseUrl = `https://pl${gameId}.plemiona.pl`;

    const [playersData, villagesData] = await Promise.all([
        fetchData(`${baseUrl}/map/player.txt`),
        fetchData(`${baseUrl}/map/village.txt`),
    ]);

    const players = parseGameData(playersData, 2);
    const villages = parseGameData(villagesData, 5);

    const PopCost = {
        spear:1,
        sword:1,
        axe:1,
        archer:1,
        spy:2,
        light:4,
        marcher:5,
        heavy:6,
        ram:5,
        catapult:8,
        knight:10,
        snob:100,
        militia:0
    }

    function generateBBCodeReport(input, includeArchersAndMarchers) {
        const lines = input.split("\n");
        let report = "";

        lines.forEach((line) => {
            if (line.trim() === "") return;

            const data = line.split(",");
            const coords = data[0];
            const units = data.slice(1, 13);
            const activeCommands = data[13];
            const incomingAttacks = data[14];

            const unitCodes = [
                "spear",
                "sword",
                "axe",
                includeArchersAndMarchers ? "archer" : "",
                "spy",
                "light",
                includeArchersAndMarchers ? "marcher" : "",
                "heavy",
                "ram",
                "catapult",
                "knight",
                "snob",
                "militia",
            ].filter(unit => unit !== "");

            var coordsSplit = coords.split('|');
            report += `[player]${decodeURIComponent(getPlayerNameByVillageCoords(coordsSplit[0],coordsSplit[1]).replace(/\+/g, ' '))}[/player] - `
            report += `[b][coord]${coords}[/coord][/b]\n`;
            units.forEach((unitCount, index) => {
                if (unitCodes[index]) {
                    report += `${unitCount}[unit]${unitCodes[index]}[/unit] `;
                }
            });

            report += `Aktywne komendy: ${activeCommands} `;
            report += `Nadchodzące ataki: ${incomingAttacks}\n\n`;
        });

        return report;
    }

    function generateBBCodeTable(input, includeArchersAndMarchers) {
        const lines = input.trim().split('\n');
        const headerUnits = [
            "spear",
            "sword",
            "axe",
            includeArchersAndMarchers ? "archer" : "",
            "spy",
            "light",
            includeArchersAndMarchers ? "marcher" : "",
            "heavy",
            "ram",
            "catapult",
            "knight",
            "snob",
            "militia",
        ].filter(unit => unit !== "");
        const header = headerUnits.map(unit => `[unit]${unit}[/unit]`).join("[||]");
        let bbcode = `[table]\n[**][b]Gracz[/b][||][b]WIOSKA[/b][||]${header}[||]Aktywne komendy[||]Przybywające ataki[||][img]https://dspl.innogamescdn.com/asset/c1748d3c/graphic/face.png[/img][/**]\n`;

        for (const line of lines) {
            const [coords, ...units] = line.split(',');
            var coordsSplit = coords.split('|');
            bbcode += `[*][player]${decodeURIComponent(getPlayerNameByVillageCoords(coordsSplit[0],coordsSplit[1]).replace(/\+/g, ' '))}[/player]`;
            bbcode += `[|][coord]${coords}[/coord]`;

            for (let i = 0; i < headerUnits.length; i++) {
                bbcode += `[|]${units[i] || ''}`;
            }
            bbcode += `[|]${units[headerUnits.length] || ''}[|]${units[headerUnits.length + 1] || ''}[|]${getPopCosts(units,headerUnits)}\n`;
        }

        bbcode += "[/table]";
        return bbcode;
    }

    function getPopCosts(units,headerUnits){
        let popCostSum = 0;
        for (let i = 0; i < headerUnits.length; i++) {
            const unitCount = units[i] || 0;
            popCostSum += unitCount * (PopCost[headerUnits[i]] || 0);
        }
        return popCostSum;
    }

    function emojiToggle(event) {
        const inputDialog = document.getElementById('input_dialog');
        inputDialog.style.display = inputDialog.style.display === 'none' ? 'block' : 'none';
    }
    function generateReport() {
        const inputText = document.getElementById('input_text').value;
        var memoTabSelectedIndex = 0;
        $('.memo-tab').each(function(index) {
            if ($(this).hasClass('memo-tab-selected')) {
                memoTabSelectedIndex = index;
                return false; // Przerywa pętlę .each()
            }
        });
        const textArea = $('[name="memo"]')[memoTabSelectedIndex];
        const isForumChecked = document.getElementById('forum_checkbox').checked;
        const includeArchersAndMarchers = document.getElementById('archers_marchers_checkbox').checked;
        textArea.value += isForumChecked
            ? generateBBCodeTable(inputText, includeArchersAndMarchers)
        : generateBBCodeReport(inputText, includeArchersAndMarchers);
    }

    function addButtonAndDialog() {
        const bbBar = document.getElementById('bb_bar');
        if (!bbBar) return;

        const existingButton = document.getElementById('bb_button_emoji');
        if (!existingButton) return;

        const button = existingButton.cloneNode(true);
        button.id = 'bb_button_bbcode';
        button.onclick = emojiToggle;

        const inputDialog = document.createElement('div');
        inputDialog.id = 'input_dialog';
        inputDialog.style.display = 'none';
        inputDialog.innerHTML = `
  <h3>Wprowadź dane wejściowe:</h3>
  <label for="forum_checkbox">Czy generować do forum:</label>
  <input type="checkbox" id="forum_checkbox">
  <label for="archers_marchers_checkbox">Uwzględnij jednostki archer i marcher:</label>
  <input type="checkbox" id="archers_marchers_checkbox">
  <textarea id="input_text" rows="10" cols="50"></textarea>
`;
        const generateButton = document.createElement('a');
        generateButton.setAttribute('href','#');
        generateButton.innerHTML = "Generuj"
        generateButton.onclick = generateReport;

        inputDialog.appendChild(generateButton);

        bbBar.insertBefore(button, existingButton.nextSibling);
        bbBar.appendChild(inputDialog);
    }

    function getPlayerNameByVillageCoords(x, y) {
        let playerId;

        for (const village of villages) {
            if (village[2] == x && village[3] == y) {
                playerId = village[4];
                break;
            }
        }

        if (!playerId) {
            return undefined;
        }

        for (const player of players) {
            if (player[0] == playerId) {
                return player[1];
            }
        }

        return undefined;
    }

    function fetchData(url) {
        return fetch(url).then(response => response.text());
    }

    function parseGameData(data, fieldsCount) {
        return data.split('\n').map(line => line.split(',').slice(0, fieldsCount));
    }

    addButtonAndDialog();
})();