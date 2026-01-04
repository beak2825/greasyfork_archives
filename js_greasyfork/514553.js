// ==UserScript==
// @name        IV/DV Guard
// @namespace   https://greasyfork.org/en/users/1357767-indigeau
// @version     0.0
// @description Prevents code from overwriting IVs & DVs.
// @match       https://calc.pokemonshowdown.com/*
// @author      indigeau
// @license     GNU GPLv3
// @icon        https://www.google.com/s2/favicons?sz=64&domain=pokemonshowdown.com
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/514553/IVDV%20Guard.user.js
// @updateURL https://update.greasyfork.org/scripts/514553/IVDV%20Guard.meta.js
// ==/UserScript==

// https://github.com/smogon/damage-calc/blob/83d3831d19a60c01baa8e6bfa82653593e40661d/src/js/shared_controls.js#L507
(() => {
	const HP = {};
	
	// Recreate the window.HP object with stat ids that match those used in sets
	// Also make implied stat values explicit
	for (const type of window.HP_TYPES) {
		const typedHP = window.HP[type];
		const ivs = {};
		const dvs = {};
		
		for (const stat of window.STATS) {
			const setStat = window.statToLegacyStat(stat);
			
			ivs[setStat] = typedHP[stat] ?? 31;
			dvs[setStat] = typedHP[stat] ?? 15;
		}
		
		HP[type] = {ivs, dvs};
	}
	
	// Returns dex entry from input element
	const getSet = (selector) => {
		const name = $(selector).val();
		const mon = name.substring(0, name.indexOf(' ('));
		const set = name.substring(name.indexOf('(') + 1, name.lastIndexOf(')'));
		
		return window.setdex[mon][set];
	};
	
	// Returns DVs & IVs from set
	const getValues = (set) => {
		if (set.ivs) {
			return set;
		}
		
		for (const move of set.moves) {
			const hp = window.HIDDEN_POWER_REGEX.exec(move);
			
			if (hp) {
				return HP[hp[1]];
			}
		}
		
		return {};
	};
	
	// Listen for overwrites
	$('input.set-selector').change(function () {
		// Ignore gens that don't have hidden power
		if (window.gen < 2 || window.gen > 7) {
			return;
		}
		
		const set = getSet(this);
		
		if (!set) {
			return;
		}
		
		const root = $(this.parentElement);
		const {ivs, dvs} = getValues(set);
		
		for (const stat of window.LEGACY_STATS[window.gen]) {
			if (!ivs || !(stat in ivs)) {
				root.find(`.${stat}.ivs`).val(31).change();
				root.find(`.${stat}.dvs`).val(15).change();
				
				continue;
			}
			
			const iv = ivs?.[stat] ?? 31;
			
			root.find(`.${stat}.ivs`).val(iv).change();
			root.find(`.${stat}.dvs`).val(dvs?.[stat] ?? window.calc.Stats.IVToDV(iv)).change();
		}
		
		root.find('.hp .dvs').val(window.calc.Stats.getHPDV({
			atk: ivs?.at ?? 31,
			def: ivs?.df ?? 31,
			spe: ivs?.sp ?? 31,
			spc: ivs?.sa ?? 31,
		})).change();
	});
})();

// https://github.com/smogon/damage-calc/blob/83d3831d19a60c01baa8e6bfa82653593e40661d/src/js/shared_controls.js#L976
(() => {
	// Freeze the IVs & DVs for the given sets
	const freezeValues = (sets) => {
		for (const [species, subSets] of Object.entries(sets)) {
			for (const setId in subSets) {
				const set = window.setdex[species][setId];
				
				// Damage calc code will correctly infer IVs and DVs
				if (!set.ivs) {
					continue;
				}
				
				for (const stat of ['hp', 'at', 'df', 'sa', 'sp']) {
					const iv = set.ivs[stat] ?? 31;
					
					Object.defineProperty(set.ivs, stat, {get: () => iv});
				}
				
				const sl = set.ivs.sa;
				const sd = set.ivs.sd ?? 31;
				
				Object.defineProperty(set.ivs, 'sd', {get: () => window.gen > 2 ? sd : sl});
			}
		}
	};
	
	// Act on newly imported sets
	window.updateDex = (() => {
		const update = window.updateDex;
		
		return (sets) => {
			update(sets);
			
			freezeValues(sets);
		};
	})();
	
	// Act on sets that are already imported
	if (localStorage.customsets) {
		freezeValues(JSON.parse(localStorage.customsets));
	}
})();

/* global $ */
