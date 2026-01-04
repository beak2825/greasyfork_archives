// ==UserScript==
// @name          Nexus Clash Mini-Map (B4)
// @namespace     https://roadha.us
// @author        haliphax
// @version       1.1
// @description   Adds a mini-map below the standard map view which can be clicked to toggle a full-sized plane map
// @include       https://www.nexusclash.com/modules.php?name=Game*
// @downloadURL https://update.greasyfork.org/scripts/410241/Nexus%20Clash%20Mini-Map%20%28B4%29.user.js
// @updateURL https://update.greasyfork.org/scripts/410241/Nexus%20Clash%20Mini-Map%20%28B4%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const mapheading = document.getElementById('mapheading');

    if (mapheading === null) return;

    const txt = document.querySelector('.tile_description b u').innerText.trim().replace(/\s+/g, ' '),
        coords = /\(([0-9]+), ([0-9]+) ([^,]+),(?:.+\bNeighborhood: ([^)]+))?/i.exec(txt);

    if (!coords) return;

    let mapName = coords[3].toLowerCase(),
        x = parseInt(coords[1]),
        y = parseInt(coords[2]);

    if (mapName == 'laurentia') {
        mapName = 'valhalla';
    }
    else if (coords[4] == 'Amaravati') {
        mapName = 'amaravati';
        x -= 19;
    }

    const offsetX = (x * 24 - 144) * -1,
        offsetY = (y * 24 - 144) * -1,
        offsetBigX = 24 * (x - 1),
        offsetBigY = 24 * (y - 1),
        row = document.createElement('tr'),
        hypermap = document.createElement('div'),
        styles = document.createElement('style');

    styles.innerHTML = `
		#minimap {
			background-repeat: no-repeat;
			height: 312px;
			margin: 0 auto;
			position: relative;
			width: 312px;
		}

		#hypermap {
			background-position: top left !important;
			bottom: 0;
			left: 0;
			overflow: auto;
			position: absolute;
			right: 0;
			top: 0;
			z-index: 98;
		}

        .hidden {
            display: none;
        }

		.position {
			background: url(https://plscks.github.io/testHYPERMAP/icons/you.png);
			height: 72px;
			left: 120px;
			position: absolute;
			top: 120px;
			width: 72px;
	        z-index: 99;
        }`;
    document.head.appendChild(styles);
    hypermap.classList.add('hidden');
    hypermap.id = 'hypermap';
    hypermap.innerHTML = `
        <div class="position" style="left: ${offsetBigX}px; top: ${offsetBigY}px;"></div>
        <img src="https://plscks.github.io/testHYPERMAP/${mapName}.png" />
        `;
    document.body.appendChild(hypermap);
    row.innerHTML = `
		<td>
			<div id="minimap" style="
				background-image: url(https://plscks.github.io/testHYPERMAP/${mapName}.png);
				background-position: ${offsetX}px ${offsetY}px;">
				<div class="position"></div>
			</div>
		</td>
		`;
    mapheading.parentNode.parentNode.appendChild(row);

    const minimap = document.getElementById('minimap'),
        maps = [minimap, hypermap];

    maps.forEach(
        v => v.addEventListener('click',
            () => maps.forEach(
                m => m.classList.toggle('hidden'))));
}());