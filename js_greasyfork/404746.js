// ==UserScript==
// @name			Satisfactory Map Icon Filter
// @version			2020.06.05
// @description		Filter some icons
// @include			https://satisfactory-calculator.com/ru/interactive-map
// @icon			https://www.google.com/s2/favicons?domain=satisfactory-calculator.com
// @namespace		https://greasyfork.org/users/7568
// @homepage		https://greasyfork.org/ru/users/7568-dr-yukon
// @author			Rainbow-Spike
// @grant			none
// @downloadURL https://update.greasyfork.org/scripts/404746/Satisfactory%20Map%20Icon%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/404746/Satisfactory%20Map%20Icon%20Filter.meta.js
// ==/UserScript==

/*
 For items detection in savegame files
 If you need to leave some items on a map - comment their strings by //, reload site page, reupload savegame file
*/
var db = [
	/* Hard Drives */
//	'HardDrive',
	'Bolt', // Electrolocked only

	/* Ores */
	'iron_new',
	'copper_new',
	'Stone',
	'CoalOre',
//	'CateriumOre',
//	'Sulfur',
//	'QuartzCrystal',
//	'Bauxite',
	'UraniumOre',
//	'SAMOre',

	/* Items */
	'IronScrews',
//	'ReinforcedIronPlates',
//	'Engine',
//	'ModularFrame',
//	'ModularFrameHeavy',
//	'EncasedSteelBeam',
	'Wire',
	'Cables',
//	'CircuitBoard',
//	'AILimiter',
//	'HighSpeedConnector',
//	'Computer',
//	'SuperComputer',
//	'RadioControlUnit',
//	'Heatsink',
//	'Battery',
	'NuclearWaste'
];

function action ( ) {
	document.querySelectorAll ( '.leaflet-data-marker' ).forEach ( function ( e ) {
		var img = e.querySelector ( 'image' ).getAttribute ( 'xlink:href' );
		for ( var i in db ) {
			if ( img.search ( db[i] ) != -1 ) e.style = "display: none"
		}
	} )
}
setInterval ( action, 100 );
