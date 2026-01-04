// ==UserScript==
// @name         Fetch map maker
// @namespace https://greasyfork.org/en/users/145271-aybecee
// @version      2025-05-02
// @description  Dynamically generates a map
// @author       You
// @match        https://www.grundos.cafe/games/fetch/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535647/Fetch%20map%20maker.user.js
// @updateURL https://update.greasyfork.org/scripts/535647/Fetch%20map%20maker.meta.js
// ==/UserScript==

(function () {
    'use strict';


    $(`#page_content`).append(`<div id="updateMap">
<button id="moveup" class="movebutton">↑ Move Up</button><br>
<button id="moveleft" class="movebutton">← Move Left</button>
<button id="moveright" class="movebutton">→ Move Right</button><br>
<button id="movedown" class="movebutton">↓ Move Down</button></div>
<div id="miniMapContainer"></div>
<style>#updateMap{text-align: center; position: absolute; left: 550px; top: 500px;}#miniMapContainer td { background-size: contain;}#miniMapContainer{ position:absolute;top:0;right:0;}</style>
`);
addControls()
    function addControls() {
        $(`[title="South"]`).click(function(){
            console.log(`South`)
            $(`#movedown`).show()
        })
        $(`[title="North"]`).click(function(){
            console.log(`North`)
            $(`#moveup`).show()
        })
        $(`[title="East"]`).click(function(){
            console.log(`East`)
            $(`#moveright`).show()
        })
        $(`[title="West"]`).click(function(){
            console.log(`West`)
            $(`#moveleft`).show()
        })
        $(`#moveup`).hide()
        $(`#moveleft`).hide()
        $(`#moveright`).hide()
        $(`#movedown`).hide()
    }

    const mapSize = 60;
    const viewSize = 5;
    const viewCenter = 2;
    const offset = Math.floor(mapSize / 2);

    let mazeMap = Array.from({ length: mapSize }, () =>
                             Array.from({ length: mapSize }, () => null)
                            );

    let posX = 0, posY = 0;

    function extractTileType(url) {
        const match = url.match(/path_(.+?)\.gif/);
        return match ? match[1] : null;
    }

    function updateMazeFromDOM() {
        $('#map tr').each((i, row) => {
            $(row).find('td').each((j, cell) => {
                const url = $(cell).attr('background') || '';
                const tile = extractTileType(url);
                const globalRow = offset + posY - viewCenter + i;
                const globalCol = offset + posX - viewCenter + j;
                if (tile && mazeMap[globalRow] && mazeMap[globalRow][globalCol] !== undefined) {
                    mazeMap[globalRow][globalCol] = tile;
                }
            });
        });
    }

    function move(dx, dy) {
        posX += dx;
        posY += dy;
        updateMazeFromDOM();
        renderMiniMap();
    }

    function renderMiniMap() {
        const tileBaseUrl = 'https://grundoscafe.b-cdn.net/games/fetch/path_';
        const viewRange = 15;
        const startRow = offset + posY - viewRange;
        const startCol = offset + posX - viewRange;

        let tableHTML = '<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;">';

        for (let i = 0; i < viewRange * 2 + 1; i++) {
            tableHTML += '<tr>';
            for (let j = 0; j < viewRange * 2 + 1; j++) {
                const r = startRow + i;
                const c = startCol + j;
                const tile = mazeMap[r]?.[c];
                let bg = tile ? `${tileBaseUrl}${tile}.gif` : '';
                let extraStyle = (r === offset + posY && c === offset + posX)
                ? 'outline: 2px solid red;' // Highlight player position
                : '';
                tableHTML += `<td width="20" height="20" style="background-image:url('${bg}');${extraStyle}"></td>`;
            }
            tableHTML += '</tr>';
        }

        tableHTML += '</table>';
        $('#miniMapContainer').html(tableHTML);
    }


    // Bind controls
    $('#moveup').click(function () {
        move(0, -1);
        addControls();
    });
    $('#movedown').click(function () {
        move(0, 1);
        addControls();
    });
    $('#moveleft').click(function () {
        move(-1, 0);
        addControls();
    });
    $('#moveright').click(function () {
        move(1, 0);
        addControls();
    });

    // Initialize
    updateMazeFromDOM();
    renderMiniMap();


})();