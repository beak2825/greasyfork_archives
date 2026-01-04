// ==UserScript==
// @name         Transformania Time Hotkeys
// @namespace    http://steamcommunity.com/id/siggo/
// @description  Hotkeys for Transformania Time multiplayer edition webgame
// @version      0.5.9
// @author       Prios
// @exclude      https://www.transformaniatime.com/chat/rooms/*
// @match        https://www.transformaniatime.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472515/Transformania%20Time%20Hotkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/472515/Transformania%20Time%20Hotkeys.meta.js
// ==/UserScript==

function keyboardShortcutListener(extraKeys) { // handles keyboard shortcuts
    
    if (event.key === "x") { // kludge
        showHidePlayers();
        return;
    }
    
	var shortcutKeys = {'l':'/PvP/Search',
						'p':'/pvp/myskills',
						'q':'/PvP/Search',
						'r':'/PvP/Meditate',
						'm':'/pvp/worldmap?showEnchant=false',
						'n':'/pvp/worldmap?showEnchant=true',
						'c':'/PvP/Cleanse',
						'h':'/PvP/Cleanse',
						'i':'/item/myinventory',
						'b':'/item/myinventory',
						'e':'/PvP/EnchantLocation',
						't':'/pvp/shout',
						'z':'/PvP/ShowOffline',
						'f':'/pvp/playerlookup',
					    '?':'/Info/GearTool'};
	jQuery.extend(shortcutKeys, extraKeys); // merges the two objects together
	var keyTarget = shortcutKeys[event.key];
	var InputFocus = $(":input").is(":focus");
	if ((keyTarget !== undefined) && !InputFocus) {
			document.removeEventListener('keypress', keyboardShortcutListener);
			window.location.href = keyTarget;
	}
}

(function() {
    'use strict';
	
	var extraKeyBinds = {};
	
	var cardinalDirCells = {1:'w', 3:'a', 5:'d', 7:'s'};
	var $movementCells = $('.tableLines').find('td');
	for (var cellOffset in cardinalDirCells) {
		var cellHref = $movementCells.eq(cellOffset).find('a').attr('href'); // putting attr() on the same line here is a teeny tiny bit wasteful for when there's no anchor found
		if (cellHref !== undefined) {
			var cellHotkey = cardinalDirCells[cellOffset];
			extraKeyBinds[cellHotkey] = cellHref;
		}
	}
	
	// keyboard shortcuts listener is attached to the document, so the page itself, or one of its components, must be in focus; the address bar, debug panel, extensions etc. are not part of the page
	document.addEventListener('keypress', function() { keyboardShortcutListener(extraKeyBinds); } );
    
})();