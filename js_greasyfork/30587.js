// ==UserScript==//
// @name           DestinyRPG - Shortcuts
// @descript       Enable shotchuts actions for DestinyRPG
// @version        0.0.7
// @author         @lucasmonteverde
// @license        MIT
// @namespace      https://gist.githubusercontent.com/lucasmonteverde/21e4c594d1e24df065985bd842574cfa/raw/shortcuts.js
// @include        https://game.destinyrpg.com/*
// @description Enable shotchuts actions for DestinyRPG
// @downloadURL https://update.greasyfork.org/scripts/30587/DestinyRPG%20-%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/30587/DestinyRPG%20-%20Shortcuts.meta.js
// ==/UserScript==

let MAP_ACTION = {
	49: '.attacklink', //1
	50: '.speciallink', //2
	51: '.heavylink', //3
	52: '.superlink', //4
	32: '.runlink'
};

let holder = '.view-main .page:last';

let attack = '.item-link.initBattle:last',
	cover = '.item-link.coverlink',
	patrol = '.item-link.patrollink',
	nothing = '.item-link.nothinglink';
	
function action(e) {
	e.preventDefault();
	
	let key = '.item-link' + MAP_ACTION[e.charCode];
	
	if( $(holder).find(cover).length && +$(holder).find('.playerInfo .progress-bar:first').attr('aria-valuenow') < 90 ) { //try with 90% less of heath
		key = cover;
	} else if( $(holder).find(patrol).length ) { //if patrol active, do it!
		key = patrol;
	} else if( $(holder).find(attack).length && e.charCode !== 32 ) { //if has enimies & not space, attack!
		key = attack;
	}
	
	if( ! $(holder).find(key).length ) { //if no action found, do nothing
		key = nothing;
	}
	
	$$( $(holder).find(key) ).click();
}

$(document).off('keypress', action).on('keypress', action);