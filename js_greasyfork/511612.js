// ==UserScript==
// @name        [PS] Team Dex
// @namespace   https://greasyfork.org/en/users/1357767-indigeau
// @version     0.0
// @description Click Pokémon icons during battles to open their Smogon StrategyDex page.
// @match       https://play.pokemonshowdown.com/*
// @exclude     https://play.pokemonshowdown.com/sprites/*
// @author      indigeau
// @license     GNU GPLv3
// @icon        https://www.google.com/s2/favicons?sz=64&domain=pokemonshowdown.com
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/511612/%5BPS%5D%20Team%20Dex.user.js
// @updateURL https://update.greasyfork.org/scripts/511612/%5BPS%5D%20Team%20Dex.meta.js
// ==/UserScript==

const linkGetter = window.TeambuilderRoom.prototype.smogdexLink;

document.body.addEventListener('click', ({target}) => {
	if (!target.matches('.teamicons > .picon[data-tooltip]')) {
		return;
	}
	
	const room = window.app.rooms[location.pathname.slice(1)];
	
	if (!room) {
		return;
	}
	
	const thisArg = {
		curTeam: {
			dex: room.battle.dex,
			format: room.id.split('-')[1],
		},
	};
	const [,, index] = target.getAttribute('data-tooltip').split('|');
	const isNearSide = target.parentElement.parentElement.classList.contains('trainer-near');
	const species = room.battle[`${isNearSide ? 'near' : 'far'}Side`].pokemon[index].speciesForme;
	
	window.open(linkGetter.call(thisArg, species));
});
