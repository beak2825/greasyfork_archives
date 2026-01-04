// ==UserScript==
// @name         MVGP++ß
// @namespace    none
// @version      2022.06.07.1148
// @description  Add fine tuned garden rotation, custom garden sizes, type count/"swap" buttons, and show/hide buttons for toolboxes!
// @author       technical13
// @supportURL   https://discord.me/MagentaRV
// @match        http://gardenpainter.ide.sk/paint.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398942/MVGP%2B%2B%C3%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/398942/MVGP%2B%2B%C3%9F.meta.js
// ==/UserScript==
// jshint esversion: 6

var isDebug = false;
var intVerbosity = 0;
const ver = '2022.06.07.1148ß';
const scriptName = 'MVGP++ v' + ver;

const intAlertWidth = 760;

function toBoolean( val ) {
	const arrTrue = [ undefined, null, '', true, 'true', 1, '1', 'on', 'yes' ];
	val = ( typeof( val ) === 'string' ? val.toLowerCase() : val );

	log( 4, 'log', 'toBoolean() is returning: %o', ( arrTrue.indexOf( val ) !== -1 ? true : false ) );
	return ( arrTrue.indexOf( val ) !== -1 ? true : false );
}

function log( intV, strConsole, strLog, ...arrArgs ) {
	if ( strConsole === undefined ) { strConsole = 'log'; }
	if ( strLog === undefined ) { strLog = '%o'; }
	if ( intVerbosity >= intV && ( strConsole === 'groupEnd' ) ) { console[ strConsole ](); }
	if ( intV === 0 || ( isDebug && intVerbosity >= intV ) ) { console[ strConsole ]( '[%i]: %s: ' + strLog, intV, scriptName, ...arrArgs ); }
}

const intParamsStart = ( document.URL.indexOf( '?' ) + 1 );
const strParams = document.URL.substr( intParamsStart );
const arrParamSets = strParams.split( '&' );
var objParams = {};
arrParamSets.forEach( function( strParam ) {
	let arrParam = strParam.split( '=' );
	let strParamName = ( arrParam[ 0 ].toLowerCase() || '' );
	if ( strParamName === 'verbosity' ) {
		isDebug = true;
		intVerbosity = ( arrParam[ 1 ] ? ( parseInt( arrParam[ 1 ] ) < 0 ? 0 : ( parseInt( arrParam[ 1 ] ) > 9 ? 9 : parseInt( arrParam[ 1 ] ) ) ) : 9 );
	} else if ( strParamName === 'debug' ) {
		isDebug = toBoolean( arrParam[ 1 ] );
		intVerbosity = 1;
	}
} );

log( 1, 'warn', 'Debug mode is on with verbosity level: %o', intVerbosity );
log( 1, 'groupCollapsed', 'Verbosity options: (click to expand)' );
log( 1, 'log', '1) Summary\n2) Parameters retrieved from URL\n3) Variables set to objParams\n4) Function returns\n9) ALL debugging info and this notice.' );
log( 1, 'groupEnd' );

function getCounts( objTypes = { TOTAL: 0 } ) {
	for ( var row in window.pins ) {
		for ( var cell in window.pins[ row ] ) {
			var strType = window.pins[ row ][ cell ].munzeeName;
			if ( strType !== undefined ) {
				objTypes.TOTAL++;
				strType = strType.replace( / /g, '_' );
				if ( !objTypes[ strType ] ) { objTypes[ strType ] = 1; log( 5, 'info', 'getCounts() added type to objTypes: %o', strType ); }
				else { objTypes[ strType ]++; }
			}
		}
	}
	log( 4, 'info', 'getCounts() returning objTypes: %o', objTypes );
	return objTypes;
}

( function() {
	'use strict';
	log( 0, 'info', 'Script loaded.' );

  function setToolboxSize() {
    var arrTypeCats = Array.from( document.getElementById( 'catalogList' ).childNodes ).filter( n => n.localName === 'a' );
//  console.log( 'arrTypeCats: %o', arrTypeCats );
    for ( var i = 0; i < arrTypeCats.length; i++ ) {
      arrTypeCats[ i ].addEventListener( 'click', function( event ) {
        var element = event.target;
        var forCat = parseInt( element.attributes.onclick.value.match( /\d+/ )[ 0 ] );
//      console.log( 'forCat: %s( %o )', ( typeof forCat ), forCat );
        var munzeeTypes = document.getElementById( 'munzee-types' );
        switch ( forCat ) {
          case 0:
          munzeeTypes.style.width = "870px";
          munzeeTypes.style.height = "145px";
//        console.log( 'Set %s to 870px × 145px', element.innerText );
          break;
          case 3:
          case 52:
          case 99:
          munzeeTypes.style.width = "620px";
          munzeeTypes.style.height = "95px";
//        console.log( 'Set %s to 620px × 95px', element.innerText );
          break;
          case 101:
          case 199:
          munzeeTypes.style.width = "620px";
          munzeeTypes.style.height = "138px";
//        console.log( 'Set %s to 620px × 138px', element.innerText );
          break;
        }
        setToolboxSize();
      } );
    }
	}

	//*
	// Add missing type(s)
	window.categories[ window.categories.length - 1 ][ 1 ] = 'Big Deploy Radius';
	window.categories.splice( 3, 0, [ 101, "Temporary Types" ] );
	window.categories.splice( 2, 0, [ 52, "Zodiacs" ] );
	window.munzees.splice( 78, 0,
							[ "Void Mystery", "https://munzee.global.ssl.fastly.net/images/pins/voidmystery", "voidmystery", 1, 99, 32, [ -1, -1, -1 ], "" ],
							[ "Shamrock", "https://munzee.global.ssl.fastly.net/images/pins/virtualshamrock", "shamrock", 1, 99, 32, [ -1, -1, -1 ], "" ],
							[ "Maple Chess Set", "https://munzee.global.ssl.fastly.net/images/pins/maplechessset", "maplechessset", 1, 99, 32, [ -1, -1, -1 ], "" ] );
	window.munzees.splice( 81, 0,
                            [ "Nile Zodiac", "https://munzee.global.ssl.fastly.net/images/pins/nile", "nile", 1, 52, 32, [ -1, -1, -1 ], "" ],
                            [ "Amon-Ra Zodiac", "https://munzee.global.ssl.fastly.net/images/pins/amon-ra", "amonra", 1, 52, 32, [ -1, -1, -1 ], "" ],
                            [ "Osiris Zodiac", "https://munzee.global.ssl.fastly.net/images/pins/osiris", "osiris", 1, 52, 32, [ -1, -1, -1 ], "" ],
                            [ "Thoth Zodiac", "https://munzee.global.ssl.fastly.net/images/pins/thoth", "thoth", 1, 52, 32, [ -1, -1, -1 ], "" ],
                            [ "Horus Zodiac", "https://munzee.global.ssl.fastly.net/images/pins/horus", "horus", 1, 52, 32, [ -1, -1, -1 ], "" ],
                            [ "Seth Zodiac", "https://munzee.global.ssl.fastly.net/images/pins/seth", "seth", 1, 52, 32, [ -1, -1, -1 ], "" ],
                            [ "Anubis Zodiac", "https://munzee.global.ssl.fastly.net/images/pins/anubis", "anubis", 1, 52, 32, [ -1, -1, -1 ], "" ],
                            [ "Sekhmet Zodiac", "https://munzee.global.ssl.fastly.net/images/pins/sekhmet", "sekhmet", 1, 52, 32, [ -1, -1, -1 ], "" ],
                            [ "Mut Zodiac", "https://munzee.global.ssl.fastly.net/images/pins/mut", "mut", 1, 52, 32, [ -1, -1, -1 ], "" ],
                            [ "Bastet Zodiac", "https://munzee.global.ssl.fastly.net/images/pins/bastet", "bastet", 1, 5299, 32, [ -1, -1, -1 ], "" ],
                            [ "Geb Zodiac", "https://munzee.global.ssl.fastly.net/images/pins/geb", "geb", 1, 52, 32, [ -1, -1, -1 ], "" ],
                            [ "Isis Zodiac", "https://munzee.global.ssl.fastly.net/images/pins/isis", "isis", 1, 52, 32, [ -1, -1, -1 ], "" ] );
	window.munzees.splice( 100, 0,
							[ "Shield", "https://munzee.global.ssl.fastly.net/images/pins/shield", "shield", 1, 101, 32, [ -1, -1, -1 ], " (archived after 6th capture)" ],
							[ "Temporary Virtual", "https://munzee.global.ssl.fastly.net/images/pins/temporaryvirtual", "temporaryvirtual", 1, 101, 32, [ -1, -1, -1 ], " (archived 30 days from deploy)" ],
							[ "Envelope", "https://munzee.global.ssl.fastly.net/images/pins/envelope", "envelope", 1, 101, 32, [ -1, -1, -1 ], " (archived 7 days from deploy)" ],
							[ "Birthday Card", "https://munzee.global.ssl.fastly.net/images/pins/birthday_card", "birthday_card", 1, 101, 32, [ -1, -1, -1 ], " (archived 7 days from deploy)" ],
							[ "Get Well Card", "https://munzee.global.ssl.fastly.net/images/pins/get_well_card", "get_well_card", 1, 101, 32, [ -1, -1, -1 ], " (archived 7 days from deploy)" ],
							[ "Earth Day Card #1", "https://munzee.global.ssl.fastly.net/images/pins/earth_day_card_1", "earth_day_card_1", 1, 101, 32, [ -1, -1, -1 ], " (archived 7 days from deploy)" ],
							[ "Earth Day Card #2", "https://munzee.global.ssl.fastly.net/images/pins/earth_day_card_2", "earth_day_card_2", 1, 101, 32, [ -1, -1, -1 ], " (archived 7 days from deploy)" ],
							[ "Earth Day Card #3", "https://munzee.global.ssl.fastly.net/images/pins/earth_day_card_3", "earth_day_card_3", 1, 101, 32, [ -1, -1, -1 ], " (archived 7 days from deploy)" ],
							[ "Stay Home Card", "https://munzee.global.ssl.fastly.net/images/pins/stay_home_card", "stay_home_card", 1, 101, 32, [ -1, -1, -1 ], " (archived 7 days from deploy)" ],
							[ "Thank You Card", "https://munzee.global.ssl.fastly.net/images/pins/thank_you_card", "thank_you_card", 1, 101, 32, [ -1, -1, -1 ], " (archived 7 days from deploy)" ],
							[ "World Laughter Day Card", "https://munzee.global.ssl.fastly.net/images/pins/world_laughter_day_card", "world_laughter_day_card", 1, 101, 32, [ -1, -1, -1 ], " (archived 7 days from deploy)" ],
							[ "Clan War Card", "https://munzee.global.ssl.fastly.net/images/pins/clan_war_card", "clan_war_card", 1, 101, 32, [ -1, -1, -1 ], " (archived 7 days from deploy)" ],
							[ "Hammercorn Card", "https://munzee.global.ssl.fastly.net/images/pins/hammercorn_card", "hammercorn_card", 1, 101, 32, [ -1, -1, -1 ], " (archived 7 days from deploy)" ],
							[ "Safe Travels Card", "https://munzee.global.ssl.fastly.net/images/pins/safe_travels_card", "safe_travels_card", 1, 101, 32, [ -1, -1, -1 ], " (archived 7 days from deploy)" ],
							[ "Congrats Card", "https://munzee.global.ssl.fastly.net/images/pins/congrats_card", "congrats_card", 1, 101, 32, [ -1, -1, -1 ], " (archived 7 days from deploy)" ],
							[ "Sorry Card", "https://munzee.global.ssl.fastly.net/images/pins/sorry_card", "sorry_card", 1, 101, 32, [ -1, -1, -1 ], " (archived 7 days from deploy)" ],
							[ "Sorry Card 1", "https://munzee.global.ssl.fastly.net/images/pins/sorry_card_1", "sorry_card_1", 1, 101, 32, [ -1, -1, -1 ], " (archived 7 days from deploy)" ],
							[ "Sorry Card 2", "https://munzee.global.ssl.fastly.net/images/pins/sorry_card_2", "sorry_card_2", 1, 101, 32, [ -1, -1, -1 ], " (archived 7 days from deploy)" ],
							[ "Sorry Card 3", "https://munzee.global.ssl.fastly.net/images/pins/sorry_card_3", "sorry_card_3", 1, 101, 32, [ -1, -1, -1 ], " (archived 7 days from deploy)" ],
							[ "May Flowers Card", "https://munzee.global.ssl.fastly.net/images/pins/may_flowers_card", "may_flowers_card", 1, 101, 32, [ -1, -1, -1 ], " (archived 7 days from deploy)" ] );
    window.mt[ 'Nile Zodiac' ] = [ "https://munzee.global.ssl.fastly.net/images/pins/nile.png", "nile", 52, 0, 32 ];
    window.mt[ 'Amon-Ra Zodiac' ] = [ "https://munzee.global.ssl.fastly.net/images/pins/amon-ra.png", "amonra", 52, 0, 32 ];
    window.mt[ 'Osiris Zodiac' ] = [ "https://munzee.global.ssl.fastly.net/images/pins/osiris.png", "osiris", 52, 0, 32 ];
    window.mt[ 'Thoth Zodiac' ] = [ "https://munzee.global.ssl.fastly.net/images/pins/thoth.png", "thoth", 52, 0, 32 ];
    window.mt[ 'Horus Zodiac' ] = [ "https://munzee.global.ssl.fastly.net/images/pins/horus.png", "horus", 52, 0, 32 ];
    window.mt[ 'Seth Zodiac' ] = [ "https://munzee.global.ssl.fastly.net/images/pins/seth.png", "seth", 52, 0, 32 ];
    window.mt[ 'Anubis Zodiac' ] = [ "https://munzee.global.ssl.fastly.net/images/pins/anubis.png", "anubis", 52, 0, 32 ];
    window.mt[ 'Sekhmet Zodiac' ] = [ "https://munzee.global.ssl.fastly.net/images/pins/sekhmet.png", "sekhmet", 52, 0, 32 ];
    window.mt[ 'Mut Zodiac' ] = [ "https://munzee.global.ssl.fastly.net/images/pins/mut.png", "mut", 52, 0, 32 ];
    window.mt[ 'Bastet Zodiac' ] = [ "https://munzee.global.ssl.fastly.net/images/pins/bastet.png", "bastet", 52, 0, 32 ];
    window.mt[ 'Geb Zodiac' ] = [ "https://munzee.global.ssl.fastly.net/images/pins/geb.png", "geb", 52, 0, 32 ];
    window.mt[ 'Isis Zodiac' ] = [ "https://munzee.global.ssl.fastly.net/images/pins/isis.png", "isis", 52, 0, 32 ];
	window.mt[ 'Void Mystery' ] = [ "https://munzee.global.ssl.fastly.net/images/pins/voidmystery.png", "voidmystery", 99, 0, 32 ];
    window.mt[ 'Shamrock' ] = [ "https://munzee.global.ssl.fastly.net/images/pins/virtualshamrock.png", "shamrock", 99, 0, 32 ];
	window.mt[ 'Maple Chess Set' ] = [ "https://munzee.global.ssl.fastly.net/images/pins/maplechessset.png", "maplechessset", 99, 0, 32 ];
	window.mt[ 'Shield' ] = [ "https://munzee.global.ssl.fastly.net/images/pins/shield.png", "shield", 101, 0, 32 ];
	window.mt[ 'Temporary Virtual' ] = [ "https://munzee.global.ssl.fastly.net/images/pins/temporaryvirtual.png", "temporaryvirtual", 101, 0, 32 ];
	window.mt[ 'Envelope' ] = [ "https://munzee.global.ssl.fastly.net/images/pins/birthday_card", "birthday_card", 101, 0, 32 ];
	window.mt[ 'Birthday Card' ] = [ "https://munzee.global.ssl.fastly.net/images/pins/birthday_card", "birthday_card", 101, 0, 32 ];
	window.mt[ 'Get Well Card' ] = [ "https://munzee.global.ssl.fastly.net/images/pins/get_well_card", "get_well_card", 101, 0, 32 ];
	window.mt[ 'Earth Day Card #1' ] = [ "https://munzee.global.ssl.fastly.net/images/pins/earth_day_card_1", "earth_day_card_1", 101, 0, 32 ];
	window.mt[ 'Earth Day Card #2' ] = [ "https://munzee.global.ssl.fastly.net/images/pins/earth_day_card_2", "earth_day_card_2", 101, 0, 32 ];
	window.mt[ 'Earth Day Card #3' ] = [ "https://munzee.global.ssl.fastly.net/images/pins/earth_day_card_3", "earth_day_card_3", 101, 0, 32 ];
	window.mt[ 'Stay Home Card' ] = [ "https://munzee.global.ssl.fastly.net/images/pins/stay_home_card", "stay_home_card", 101, 0, 32 ];
	window.mt[ 'Thank You Card' ] = [ "https://munzee.global.ssl.fastly.net/images/pins/thank_you_card", "thank_you_card", 101, 0, 32 ];
	window.mt[ 'World Laughter Day Card' ] = [ "https://munzee.global.ssl.fastly.net/images/pins/world_laughter_day_card", "world_laughter_day_card", 101, 0, 32 ];
	window.mt[ 'Clan War Card' ] = [ "https://munzee.global.ssl.fastly.net/images/pins/clan_war_card", "clan_war_card", 101, 0, 32 ];
	window.mt[ 'Hammercorn Card' ] = [ "https://munzee.global.ssl.fastly.net/images/pins/hammercorn_card", "hammercorn_card", 101, 0, 32 ];
	window.mt[ 'Safe Travels Card' ] = [ "https://munzee.global.ssl.fastly.net/images/pins/safe_travels_card", "safe_travels_card", 101, 0, 32 ];
	window.mt[ 'Congrats Card' ] = [ "https://munzee.global.ssl.fastly.net/images/pins/congrats_card", "congrats_card", 101, 0, 32 ];
	window.mt[ 'Sorry Card' ] = [ "https://munzee.global.ssl.fastly.net/images/pins/sorry_card", "sorry_card", 101, 0, 32 ];
	window.mt[ 'Sorry Card 1' ] = [ "https://munzee.global.ssl.fastly.net/images/pins/sorry_card_1", "sorry_card_1", 101, 0, 32 ];
	window.mt[ 'Sorry Card 2' ] = [ "https://munzee.global.ssl.fastly.net/images/pins/sorry_card_2", "sorry_card_2", 101, 0, 32 ];
	window.mt[ 'Sorry Card 3' ] = [ "https://munzee.global.ssl.fastly.net/images/pins/sorry_card_3", "sorry_card_3", 101, 0, 32 ];
	window.mt[ 'May Flowers Card' ] = [ "https://munzee.global.ssl.fastly.net/images/pins/may_flowers_card", "may_flowers_card", 101, 0, 32 ];
	for ( var zee in window.munzees ) { window.mt[ window.munzees[ zee ][ 0 ] ][ 3 ] = parseInt( zee ); }
	window.initMunzeeTypes( 101 );
	window.initMunzeeTypes( 52 );
	window.initMunzeeTypes( 0 );
  setToolboxSize();

	window.oldNames[ 'POI Garden' ] = 'POI Virtual Garden';
	window.oldNames[ 'prize wheel' ] = 'Sir Prize Wheel';

	document.getElementById( 'permalinktext' ).align = 'right';

  window.setTimeout( function() {
    var toggleToolbox = document.createElement( 'input' );
    toggleToolbox.id = 'toggleToolbox';
    toggleToolbox.type = 'button';
    toggleToolbox.setAttribute( 'class', 'btnToggle' );
    toggleToolbox.title = 'Toggle display of types box.';
    toggleToolbox.value = 'Hide Toolbox';
    toggleToolbox.style = 'float: left;';

    var toggleTypes = document.createElement( 'input' );
    toggleTypes.id = 'toggleTypes';
    toggleTypes.type = 'button';
    toggleTypes.setAttribute( 'class', 'btnToggle' );
    toggleTypes.title = 'Toggle display of types box.';
    toggleTypes.value = 'Hide Types';
    toggleTypes.style = 'float: right;';

    var toggleButtons = document.createElement( 'div' );
    toggleButtons.id = 'toggleButtons';
    toggleButtons.append( toggleToolbox );
    toggleButtons.append( toggleTypes );

    document.getElementById( 'maptiles' ).append( toggleButtons );

    var arrToggleBtns = document.getElementsByClassName( 'btnToggle' );
    for ( var i = 0; i < arrToggleBtns.length; i++ ) {
      arrToggleBtns[ i ].addEventListener( 'click', function ( event ) {
        var isHideShow = event.target.value.split( ' ' )[ 0 ];
        var forBtn = event.target.value.split( ' ' )[ 1 ];
        try {
          var doHideShow = ( isHideShow === 'Hide' ? 'Show' : 'Hide' );
          event.target.value = doHideShow + ' ' + forBtn;
          if ( forBtn === 'Toolbox' ) {
            document.getElementById( 'toolbox' ).style.display = ( isHideShow === 'Hide' ? 'none' : 'inline-block' );
          } else if ( forBtn === 'Types' ) {
            document.getElementById( 'munzee-types' ).style.display = ( isHideShow === 'Hide' ? 'none' : 'inherit' );
          }
        } catch ( errToggle ) {
          log( 0, 'error', 'Failed while attempting to %s %o\n\t: %o', isHideShow, forBtn, errToggle );
        }
        log( 0, 'info', 'objTypes: %o', getCounts() );
      } );
    }
    
  }, 3000);

	var customGrid = document.createElement( 'img' );
	customGrid.id = 'customGrid';
	customGrid.setAttribute( 'class', 'btn' );
	customGrid.width = '50'; customGrid.height = '50';
	customGrid.title = 'Grid size ? × ?';
	customGrid.src = 'https://cdn.discordapp.com/attachments/662752932151820308/662772347174125568/MVGP_Custom_Size.png';
	document.querySelectorAll( 'div#toolbox img.btn' )[ 8 ].after( customGrid );

	document.getElementById( 'customGrid' ).addEventListener( 'click', function ( event ) {
		window.hideGrid();
		var intCurrentGridSize = window.n;
		var askSize = prompt( 'Grids must have matching widths and heights.\nGrids larger than 120×120 may not load well.\n\n\tWhat size would you like your grid?', intCurrentGridSize );
		if ( !askSize ) {
      console.log( 'Aborted custom grid size input.' );
    } else if ( isNaN( parseInt( askSize ) ) ) {
			alert( '"' + askSize + '" is not a number. Please try again and enter a single number.' );
		} else if ( parseInt( askSize ) > 120 ) {
			var intNewGridSize = parseInt( askSize );
		var amSure = confirm( '"' + intNewGridSize + '×' + intNewGridSize + '" is greater than 120×120.\nGrids larger than 120×120 are more likely to crash your browser.\n\n\tARE YOU SURE YOU WANT TO TRY?' );
			if ( amSure ) {
				window.n = intNewGridSize;
				window.setupCrosses();
				window.setupPins();
				window.setGridSize( window.n );
			}
		} else if ( intNewGridSize > 60 ) {
			window.n = intNewGridSize;
			window.setupCrosses();
			window.setupPins();
			window.setGridSize( window.n );
		} else {
			window.setupCrosses();
			window.setupPins();
			window.setGridSize( window.n );
		}
	} );

	var rotateRightOne = document.createElement( 'img' );
	rotateRightOne.id = 'rotateRightOne';
	rotateRightOne.setAttribute( 'class', 'btn' );
	rotateRightOne.title = 'Rotate the grid right by 1 degree.';
	rotateRightOne.src = 'https://cdn.discordapp.com/attachments/662752932151820308/662753267276841035/grid_rotate4.png';
	rotateRightOne.setAttribute( 'onclick', 'rotateGridRight(1)' );
	document.querySelectorAll( 'div#toolbox img.btn' )[ 5 ].after( rotateRightOne );

	var rotateLeftOne = document.createElement( 'img' );
	rotateLeftOne.id = 'rotateLeftOne';
	rotateLeftOne.setAttribute( 'class', 'btn' );
	rotateLeftOne.title = 'Rotate the grid left by 1 degree.';
	rotateLeftOne.src = 'https://cdn.discordapp.com/attachments/662752932151820308/662753258221076490/grid_rotate3.png';
	rotateLeftOne.setAttribute( 'onclick', 'rotateGridLeft(1)' );
	document.querySelectorAll( 'div#toolbox img.btn' )[ 4 ].before( rotateLeftOne );

	var pinCounts = document.createElement( 'div' );

} )();