// ==UserScript==
// @name Nexus Clash Improved Pet Status (B4)
// @description Adds color to pet status pane based on remaining AP
// @namespace https://roadha.us
// @author haliphax
// @version 1.5
// @include https://www.nexusclash.com/modules.php?name=Game*
// @include https://nexusclash.com/modules.php?name=Game*
// @grant GM_getValue
// @grant GM.getValue
// @grant GM_setValue
// @grant GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/398641/Nexus%20Clash%20Improved%20Pet%20Status%20%28B4%29.user.js
// @updateURL https://update.greasyfork.org/scripts/398641/Nexus%20Clash%20Improved%20Pet%20Status%20%28B4%29.meta.js
// ==/UserScript==

(function(){
	'use strict';

    // GreaseMonkey fix
	if (window.hasOwnProperty('GM')) {
		window.GM_getValue = GM.getValue;
		window.GM_setValue = GM.setValue;
	}

	// constants
	const LOW_MP = 20;

    // settings
    let SORT = GM_getValue('sort', false);

	const petTable = document.querySelector('#pets');

	// no pets; bail
	if (petTable === null) return;

    // settings UI
    const sortCheckbox = document.createElement('caption');

    sortCheckbox.innerHTML = `     
		<label for="imppets_sort">
			<input id="imppets_sort" type="checkbox" ${SORT ? 'checked' : ''} />
			Sort pets by decay time
		</label>`;
    sortCheckbox.querySelector('input').addEventListener('change', function () {
        GM_setValue('sort', this.checked);
        document.querySelector('#sidebarmenu form[name="sidebar"] input[value="Pets"]').parentNode.submit();
    });
    document.querySelector('#petbox').appendChild(sortCheckbox);

	// add Decay column header
	const petHeader = document.createElement('td');

	petHeader.innerText = 'Decay';
	petTable.querySelector('tr:nth-child(2)').appendChild(petHeader);

	// loop through pets and handle any status events
	const now = new Date(),
		lastTick = new Date(now - Math.round(now % (60 * 15 * 1000))),
		petRows = Array.from(petTable.querySelectorAll('tr:nth-child(n+3)'));

	for (let i = 0; i < petRows.length; i++) {
		const el = petRows[i],
			cols = Array.prototype.slice.call(el.querySelectorAll('td:nth-child(n+3)'), 0, 3);

		// not a pet row ("Set all pets..."); skip
		if (cols.length !== 3) continue;

		var p = {
			ap: Math.round(cols[0].innerText),
			mp: Math.round(cols[1].innerText),
			hp: Math.round(cols[2].innerText)
		};

		// AP check
		if (p.ap <= p.mp /* when AP is less than or equal to MP, pet will expire if it uses all of its attacks */
			|| p.mp < LOW_MP /* low MP is a red flag */)
		{
			el.style = 'color:white;background-color:red';
		}
		else if (p.ap <= p.mp * 2) {
			// when AP is less than or equal to double pet MP, pet will not be able to travel far and still attack */
			el.style = 'background-color:yellow';
		}

		// show decay time
		const decay = document.createElement('td'),
			decayTime = new Date(lastTick);

        decayTime.setMinutes(lastTick.getMinutes() + (p.ap * 15));

       	const decayTimeStr = decayTime.toUTCString(),
			remaining = Math.floor(new Date(decayTime - now).getTime() / 1000 / 60),
			rh = Math.floor(remaining / 60),
			rm = remaining - (rh * 60);

		decay.innerText = `${rh > 0 ? rh + 'h' : ''}${rm > 0 ? rm + 'm' : ''}`;
		decay.setAttribute('title', '0 AP at ' + decayTimeStr);
		el.appendChild(decay);
        el.dataset.decay = remaining;
	}

    if (! SORT) { return; }

    petRows.sort((a, b) => parseInt(a.dataset.decay) - parseInt(b.dataset.decay));

    for (let i = 0; i < petRows.length; petTable.appendChild(petRows[i++]));
}());