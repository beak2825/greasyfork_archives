// ==UserScript==
// @name         Show Virtual Munzee Name
// @namespace    none
// @version      2020.06.26.1022
// @description  Show the virtual munzee names
// @author       technical13
// @match        https://www.munzee.com/m/*/*
// @match        https://www.munzee.com/map/*
// @match        https://www.munzee.com/specials/*
// @downloadURL https://update.greasyfork.org/scripts/393378/Show%20Virtual%20Munzee%20Name.user.js
// @updateURL https://update.greasyfork.org/scripts/393378/Show%20Virtual%20Munzee%20Name.meta.js
// ==/UserScript==
// jshint esversion: 6
// @basedon  CzPeet's https://greasyfork.org/en/scripts/373533-showvirtualmunzeename

const ver = '2020.06.26.1022';
const scriptName = 'Show Virtual Munzee Name v' + ver;
var isDebug = false;
var intVerbosity = 0;

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
var objParams = { unknownParams: [] };
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

var objMunzees = {
    airmystery: 'Air Mystery',
    canoe: 'Submarine Evolution (Stage 1)',
    carnationseed: 'Carnation Evolution (Stage 1)',
    carrot: 'Carrot Evolution (Stage 3)',
    carrotseed: 'Carrot Evolution (Stage 1)',
    carrotplant: 'Carrot Evolution (Stage 2)',
    championshiphorse: 'Horse Evolution (Stage 3)',
    chick: 'Eggs Evolution (Stage 1)',
    coldflatrob: 'Cold Flat Rob',
    colt: 'Horse Evolution (Stage 1)',
    czechrepubliciconiclocation: 'Iconic Location (Czech Republic)',
    dwarfleprechaun: 'Leprechaun (Dwarf)',
    electricmystery: 'Electric Mystery',
    ephyralarva: 'Jellyfish Evolution (Stage 4)',
    farmer: 'Family Evolution (Stage 1)',
    firstwheel: 'Car Evolution (Stage 1)',
    flathammock: 'Flat Hammock',
    flatlou: 'Flat Lou',
    flatmatt: 'Flat Matt',
    flatrob: 'Flat Rob',
    icemystery: 'Ice Mystery',
    joystickvirtual: 'Virtual Joystick',
    limebutterfly: 'Lime Butterfly',
    motorboat: 'Submarine Evolution (Stage 2)',
    munzee: 'Greenie',
    nightvisiongoggles: 'Night Vision Goggles',
    peas: 'Peas Evolution (Stage 3)',
    peasplant: 'Peas Evolution (Stage 2)',
    peasseed: 'Peas Evolution (Stage 1)',
    poiairport: 'Airport POI',
    poibank: 'Bank POI',
    poibeach: 'Beach POI',
    poicampground: 'Campground POI',
    poicemetery: 'Cemetery POI',
    poicinema: 'Cinema POI',
    poifaithplace: 'Faith Place POI',
    poifirstresponders: 'First Responder POI',
    poigolf: 'Golf POI',
    poihistoricalplace: 'Historical Place POI',
    poihospital: 'Hospital POI',
    poilibrary: 'Library POI',
    poimuseum: 'Museum POI',
    poiplaypark: 'Play Park POI',
    poipostoffice: 'Post Office POI',
    poitransportation: 'Transportation POI',
    poisports: 'Sports POI',
    poiuniqueattraction: 'Unique Attraction POI',
    poiuniversity: 'University POI',
    poiwildlife: 'Wildlife POI',
    poivirtualgarden: 'Virtual Garden POI',
    pottedplant: 'Field Evolution (Stage 1)',
    reptoidyeti: 'Yeti (Reptoid variant)',
    rosegrowth: 'Rose Evolution (Stage 3)',
    safaritruck: 'Safari Bus Evolution (Stage 1)',
    skyland: 'Skyland (empty)',
    skyland1: 'Skyland (1 guest)',
    skyland2: 'Skyland (2 guests)',
    skyland3: 'Skyland (3 guests)',
    skyland4: 'Skyland (4 guests)',
    skyland5: 'Skyland (5 guests)',
    skyland6: 'Skyland (6 guests)',
    skyland7: 'Skyland (glitch!)',
    sirprizewheel: 'Sir Prizewheel',
    temporaryvirtual: 'Temporary Virtual',
    theunicorn: 'Unicorn',
    timeshareroom: 'Timeshare Room',
    travelernomad: 'Traveler Nomad',
    treehouse: 'Treehouse (empty)',
    treehouse1: 'Treehouse (1 guest)',
    treehouse2: 'Treehouse (2 guests)',
    treehouse3: 'Treehouse (3 guests)',
    treehouse4: 'Treehouse (4 guests)',
    treehouse5: 'Treehouse (5 guests)',
    treehouse6: 'Treehouse (6 guests)',
    treehouse7: 'Treehouse (glitch!)',
    trojanunicorn: 'Trojan Unicorn',
    tuxflatrob: 'Tux Flat Rob',
    virtual: 'Virtual White',
    vacationcondo: 'Vacation Condo',
    vacationcondoroom: 'Vacation Condo Room',
    virtualcitrine: 'Virtual Citrine',
    virtualonyx: 'Virtual Onyx',
    virtualsapphire: 'Virtual Sapphire'
};

function getMunzeeType( srcUrl ) {
    var strRawColorName = srcUrl.slice( ( srcUrl.lastIndexOf( '/' ) + 1 ), srcUrl.lastIndexOf( '.' ) ).replace( /_/g, ' ' );
    var strColorName = ( objMunzees[ strRawColorName ] || strRawColorName );
    if ( strColorName === strRawColorName ) {
        var arrColorName = strRawColorName.split( ' ' );
        arrColorName.forEach( ( thisWord, word ) => {
            arrColorName[ word ] = thisWord[ 0 ].toUpperCase() + thisWord.substr( 1 );
        } );
        strColorName = arrColorName.join( ' ' );
    }
    return strColorName;
}
function specialsFilter() {
    $( 'div#filterimgs > img' ).each( ( ndx, imgFilterPin ) => {
        var strColorNameFilter = getMunzeeType( $( imgFilterPin ).attr( 'src' ) );
        $( imgFilterPin ).attr( 'title', strColorNameFilter );
    } );
}

( function() {
    'use strict';
    log( 0, 'info', 'Script loaded.' );

    var arrPins = [];
    $( 'img.qd-img' ).each( ( ndxQdImg, imgPinQdImg ) => { arrPins.push( imgPinQdImg ); } );
    $( 'img.pin' ).each( ( ndxPin, imgPinPin ) => { arrPins.push( imgPinPin ); } );
    arrPins.forEach( ( domPin, ndx ) => {
        var pinSection = $( domPin ).parents( 'section' );
        var strColorName = getMunzeeType( $( domPin ).attr( 'src' ) );

        $( 'div.unicorn > img' ).each( ( ndxUnicorn, domPinUnicorn ) => {
            var strColorNameUnicorn = getMunzeeType( $( domPinUnicorn ).attr( 'src' ) );
            $( domPinUnicorn ).attr( 'title', strColorNameUnicorn );
        } );
        if ( pinSection.length > 0 ) {
            $( pinSection ).attr( 'title', strColorName );
        } else {
            $( domPin ).attr( 'title', strColorName );
        }
    } );

    specialsFilter();

    $( document ).on( 'mouseup', '#map_span', function( e ) { specialsFilter(); } );
    $( document ).on( 'click', '#map-box-specials-zoom-in', function( e ) { specialsFilter(); } );
    $( document ).on( 'click', '#map-box-specials-zoom-out', function( e ) { specialsFilter(); } );
} )();