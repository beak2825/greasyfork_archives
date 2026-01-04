// ==UserScript==
// @name         zeeSpecialTypes
// @namespace    none
// @version      2020.06.28.0222
// @description  Show if physical or virtual for all special types.
// @author       technical13
// @supportURL   https://discord.me/TheShoeStore
// @match        https://www.munzee.com/specials*
// @match        https://www.munzee.com/map*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382763/zeeSpecialTypes.user.js
// @updateURL https://update.greasyfork.org/scripts/382763/zeeSpecialTypes.meta.js
// ==/UserScript==
// jshint esversion: 6

var isDebug = false;
var intVerbosity = 0;
const ver = '2020.06.28.0222';
const scriptName = 'zeeSpecialTypes v' + ver;

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
        isDebug = toBoolean( arrParam[ 1 ] );
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
function toBoolean( val ) {
    const arrTrue = [ undefined, null, '', true, 'true', 1, '1', 'on', 'yes' ];
    val = ( typeof( val ) === 'string' ? val.toLowerCase() : val );

    log( 4, 'log', 'toBoolean() is returning: %o', ( arrTrue.indexOf( val ) !== -1 ? true : false ) );
    return ( arrTrue.indexOf( val ) !== -1 ? true : false );
}

const objTypes = {// laupereseller
    0: 'physical',// munzee - greenie
    4: 'physical',// premium
    40: 'physical',// diamond
    52: 'physical',// mace
    53: 'physical',// longsword
    131: 'physical',// ruby
    140: 'physical',// battleaxe
    218: 'physical',// aquamarine
    242: 'physical',// topaz
    280: 'physical',// mystery
    290: 'virtual',// virtual_amethyst
    306: 'physical',// thehammer
    353: 'virtual',// flatrob
    441: 'physical',// shamrock
    510: 'physical',// munzeemadnessreseller
    511: 'physical',// geostuffreseller
    512: 'physical',// geohobbiesreseller
    513: 'physical',// ddcardsreseller
    514: 'physical',// negsreseller
    515: 'physical',// geologgersreseller
    516: 'physical',// mmcocoabeachreseller
    532: 'physical',// firemystery
    550: 'physical',// rujareseller
    584: 'physical',// pinkdiamond
    651: 'physical',// icemystery
    681: 'virtual',// virtual_sapphire
    696: 'physical',// scgsreseller
    851: 'physical',// earthmystery
    998: 'virtual',// crossbow
    1015: 'virtual',// flatmatt
    1020: 'physical',// watermystery
    1057: 'physical',// treasurechest
    1086: 'virtual',// airmystery
    1248: 'virtual',// catapult
    1271: 'physical',// dogchinesezodiac
    1272: 'physical',// pigchinesezodiac
    1273: 'physical',// ratchinesezodiac
    1274: 'physical',// oxchinesezodiac
    1275: 'physical',// tigerchinesezodiac
    1276: 'physical',// rabbitchinesezodiac
    1277: 'physical',// dragonchinesezodiac
    1278: 'physical',// snakechinesezodiac
    1279: 'physical',// horsechinesezodiac
    1280: 'physical',// goatchinesezodiac
    1281: 'physical',// monkeychinesezodiac
    1282: 'physical',// roosterchinesezodiac
    1338: 'virtual',// flatlou
    1409: 'virtual',// virtual
    1410: 'virtual',// virtual_rainbow
    1411: 'virtual',// virtual_timberwolf
    1412: 'virtual',// virtual_silver
    1413: 'virtual',// virtual_gray
    1414: 'virtual',// virtual_black
    1415: 'virtual',// virtual_orchid
    1416: 'virtual',// virtual_wisteria
    1417: 'virtual',// virtual_purple_mountains_majesty
    1418: 'virtual',// virtual_violet
    1419: 'virtual',// virtual_plum
    1420: 'virtual',// virtual_blue_violet
    1421: 'virtual',// virtual_blue
    1423: 'virtual',// virtual_cadet_blue
    1424: 'virtual',// virtual_periwinkle
    1425: 'virtual',// virtual_cornflower
    1426: 'virtual',// virtual_blue_green
    1427: 'virtual',// virtual_pacific_blue
    1428: 'virtual',// virtual_cerulean
    1429: 'virtual',// virtual_robin_egg_blue
    1430: 'virtual',// virtual_indigo
    1431: 'virtual',// virtual_turquoise_blue
    1432: 'virtual',// virtual_sea_green
    1433: 'virtual',// virtual_granny_smith_apple
    1434: 'virtual',// virtual_green
    1435: 'virtual',// virtual_forest_green
    1436: 'virtual',// virtual_asparagus
    1437: 'virtual',// virtual_olive_green
    1438: 'virtual',// virtual_yellow_green
    1439: 'virtual',// virtual_green_yellow
    1440: 'virtual',// virtual_spring_green
    1441: 'virtual',// virtual_gold
    1442: 'virtual',// virtual_yellow
    1443: 'virtual',// virtual_goldenrod
    1444: 'virtual',// virtual_dandelion
    1445: 'virtual',// virtual_orange
    1446: 'virtual',// virtual_burnt_orange
    1448: 'virtual',// virtual_melon
    1449: 'virtual',// virtual_pink
    1450: 'virtual',// virtual_carnation_pink
    1451: 'virtual',// virtual_mauvelous
    1452: 'virtual',// virtual_salmon
    1453: 'virtual',// virtual_tickle_me_pink
    1454: 'virtual',// virtual_magenta
    1455: 'virtual',// virtual_wild_strawberry
    1456: 'virtual',// virtual_violet_red
    1457: 'virtual',// virtual_red_violet
    1458: 'virtual',// virtual_apricot
    1459: 'virtual',// virtual_peach
    1460: 'virtual',// virtual_macaroni_and_cheese
    1461: 'virtual',// virtual_tan
    1462: 'virtual',// virtual_burnt_sienna
    1463: 'virtual',// virtual_bittersweet
    1464: 'virtual',// virtual_red_orange
    1465: 'virtual',// virtual_scarlet
    1466: 'virtual',// virtual_red
    1467: 'virtual',// virtual_brick_red
    1468: 'virtual',// virtual_mahogany
    1469: 'virtual',// virtual_chestnut
    1470: 'virtual',// virtual_tumbleweed
    1471: 'virtual',// virtual_raw_sienna
    1473: 'virtual',// virtual_brown
    1581: 'virtual',// flathammock
    2361: 'virtual',// virtual_citrine
    2362: 'virtual',// virtual_onyx
    2391: 'virtual'// electricmystery
};
const arrUndefinedTypes = [
    'akvamariin', 'ametust', 'oniks', 'smaragd', 'teemant',// Funfinity Stones
    'banshee', 'harpybanshee', 'gorgon', 'retiredbanshee', 'witchbanshee',// Banshee
    'limebutterfly', 'monarchbutterfly', 'morphobutterfly',// Butterly
    'cyclops', 'balorcyclops', 'minotaurcyclops', 'ogre', 'retiredcyclops',// Cyclops
    'cherub',// Cherub
    'chinesedragon', 'wyverndragon',// Dragon
    'dryadfairy', 'fairy', 'fairygodmother', 'retiredfairy', 'wildfirefairy',// Fairy
    'centaurfaun', 'krampusfaun',// Faun
    'poisondartfrog', 'tomatofrog', 'treefrog',// Frog
    //    'face-offflatmatt', 'footyflatmatt', 'matt\'erupflatmatt',// haven't found the icon variants on the website yet.// Flat Matt
    //    'beachflatrob', 'coldflatrob', 'tuxflatrob',// haven't found the icon variants on the website yet.// Flat Rob
    'hadavale',// Hadaval
    'hedgehog',// Hedgehog
    'chimera', 'cthulhuhydra',// Hydra
    'dwarfleprechaun', 'goblinleprechaun',// Leprechaun
    'magnetus',// Magnetus
    'melusinemermaid',// Mermaid
    'motherearth',// Mother Earth
    'elfnymph', 'nymph', 'vampirenymph',// Nymph
    'owlet',// Owlet
    'alicornpegasus', 'firepegasus', 'griffinpegasus',// Pegasus
    'pimedus',// Pimedus
    'polarbear',// Polar Bear
    'poseidon',// Poseidon
    'trojanunicorn'// Temp types
];
const objFlats = {
    'beachflatrob_physical': 'https://munzee.zendesk.com/hc/article_attachments/360025329491/BeachRob_Physical_720.png',
    'beachflatrob_virtual': 'https://munzee.global.ssl.fastly.net/images/pins/beachflatrob.png',
    'coldflatrob_physical': 'https://munzee.zendesk.com/hc/article_attachments/360025308412/ColdRob_Physical_720.png',
    'coldflatrob_virtual': 'https://munzee.global.ssl.fastly.net/images/pins/coldflatrob.png',
    'tuxflatRob_physical': 'https://munzee.zendesk.com/hc/article_attachments/360025308612/TuxRob_Physical_720.png',
    'tuxflatRob_virtual': 'https://munzee.global.ssl.fastly.net/images/pins/tuxflatrob.png',
    'face-offflatmatt_physical': 'https://munzee.zendesk.com/hc/article_attachments/360031394411/HockeyMatt_Physical_512.png',
    'face-offflatmatt_virtual': 'https://munzee.zendesk.com/hc/article_attachments/360031394431/HockeyMatt_Virtual_512.png',
    'matt\'erupflatmatt_physical': 'https://munzee.zendesk.com/hc/article_attachments/360031394711/BaseballMatt_Physical_512.png',
    'matt\'erupflatmatt_virtual': 'https://munzee.zendesk.com/hc/article_attachments/360031424192/BaseballMatt_virtual_512.png',
    'footyflatmatt_physical': 'https://munzee.zendesk.com/hc/article_attachments/360031394811/SoccerMatt_Physical_512.png',
    'footyflatmatt_virtual': 'https://munzee.zendesk.com/hc/article_attachments/360031424212/SoccerMatt_virtual_512.png'
};

( function() {
    'use strict';

    setTimeout( () => {
        for ( var ndxMarker in mapMarkers ) {
            var intBaseType = parseInt( mapMarkers[ ndxMarker ].capture_type_id );
            if ( objTypes[ intBaseType ] !== undefined ) {
                var findFlat = mapMarkers[ ndxMarker ]._element.attributes.style.nodeValue.match( /"https:\/\/munzee\.global\.ssl\.fastly\.net\/images\/pins\/[\w]*(flat[\w]*)\.[\a-z0-9]{3,4}\"/i );
                var isFlat = ( findFlat ? ( ( new RegExp( 'flat(hammock|lou|matt|rob)' ) ).test( findFlat[ 1 ] ) ? true : false ) : false );
                if ( isFlat ) {
                    var arrFlatURL = mapMarkers[ ndxMarker ]._element.attributes.style.nodeValue.match( /"(https:\/\/munzee\.global\.ssl\.fastly\.net\/images\/pins\/([\w]*flat[\w]*)\.[\a-z0-9]{3,4})\"/i );
                    console.log( 'arrFlatURL: %o', arrFlatURL );
                    var strFlatURL = arrFlatURL[ 1 ];console.log( 'strFlatURL: %o', strFlatURL );
                    var strFlatType = arrFlatURL[ 2 ];console.log( 'strFlatType: %o', strFlatType );
                    console.log( '.replace( %s, objFlats[ %s + \'_\' + objTypes[ %s ] ] ): %o: %o', strFlatURL, strFlatType, intBaseType, objTypes[ intBaseType ], objFlats[ strFlatType + '_' + objTypes[ intBaseType ] ] );
                    mapMarkers[ ndxMarker ]._element.attributes.style.nodeValue = mapMarkers[ ndxMarker ]._element.attributes.style.nodeValue.replace( strFlatURL, objFlats[ strFlatType + '_' + objTypes[ intBaseType ] ] );
                }
                else {
                    var arrMarkerType = mapMarkers[ ndxMarker ]._element.attributes.style.nodeValue.match( /"https:\/\/((.*)?\/([\w]*)\.([\a-z0-9]{3,4}))\"/i );
                    var strMarkerType = ( arrMarkerType ? arrMarkerType[ 3 ] : null );
                    if ( arrUndefinedTypes.indexOf( strMarkerType ) !== -1 ) {
                        let strDefinedType = '';
                        switch ( objTypes[ intBaseType ] ) {
                            case 'physical':
                            case 'virtual':
                                strDefinedType = strMarkerType + '_' + objTypes[ intBaseType ];
                                break;
                            case 'utl':
                                strDefinedType = 'maintenance';
                                log( 0, 'info', 'base: %i;Marker: %s', intBaseType, strMarkerType );
                                break;
                            default:
                                strDefinedType = 'owned';
                                log( 0, 'error', 'base: %i;Marker: %s', intBaseType, strMarkerType );
                        }

                        mapMarkers[ ndxMarker ]._element.attributes.style.nodeValue = mapMarkers[ ndxMarker ]._element.attributes.style.nodeValue.replace( strMarkerType, strDefinedType );
                    }
                }
            } else { console.info( 'base type %i is undefined.  Please check ', intBaseType ); }
        }
    }, 3000 );
    map.on( 'move', mapChanged => {
        log( 2, 'log', 'map.changed: %o', mapChanged );
        setTimeout( () => {
            for ( var ndxMarker in mapMarkers ) {
                var intBaseType = mapMarkers[ ndxMarker ].capture_type_id;
                var findFlat = mapMarkers[ ndxMarker ]._element.attributes.style.nodeValue.match( /"https:\/\/munzee\.global\.ssl\.fastly\.net\/images\/pins\/[\w]*(flat[\w]*)\.[\a-z0-9]{3,4}\"/i );
                var isFlat = ( findFlat ? ( ( new RegExp( 'flat(hammock|lou|matt|rob)' ) ).test( findFlat[ 1 ] ) ? true : false ) : false );
                if ( isFlat ) {
                    var arrFlatURL = mapMarkers[ ndxMarker ]._element.attributes.style.nodeValue.match( /"(https:\/\/munzee\.global\.ssl\.fastly\.net\/images\/pins\/([\w]*flat[\w]*)\.[\a-z0-9]{3,4})\"/i );
                    console.log( 'arrFlatURL: %o', arrFlatURL );
                    var strFlatURL = arrFlatURL[ 1 ];console.log( 'strFlatURL: %o', strFlatURL );
                    var strFlatType = arrFlatURL[ 2 ];console.log( 'strFlatType: %o', strFlatType );
                    console.log( '.replace( %s, objFlats[ %s + \'_\' + objTypes[ %s ] ] ): %o: %o', strFlatURL, strFlatType, intBaseType, objTypes[ intBaseType ], objFlats[ strFlatType + '_' + objTypes[ intBaseType ] ] );
                    mapMarkers[ ndxMarker ]._element.attributes.style.nodeValue = mapMarkers[ ndxMarker ]._element.attributes.style.nodeValue.replace( strFlatURL, objFlats[ strFlatType + '_' + objTypes[ intBaseType ] ] );
                }
                else {
                    var arrMarkerType = mapMarkers[ ndxMarker ]._element.attributes.style.nodeValue.match( /"https:\/\/((.*)?\/([\w]*)\.([\a-z0-9]{3,4}))\"/i );
                    var strMarkerType = ( arrMarkerType ? arrMarkerType[ 3 ] : null );
                    if ( arrUndefinedTypes.indexOf( strMarkerType ) !== -1 ) {
                        let strDefinedType = '';
                        switch ( objTypes[ intBaseType ] ) {
                            case 'physical':
                            case 'virtual':
                                strDefinedType = strMarkerType + '_' + objTypes[ intBaseType ];
                                break;
                            case 'utl':
                                strDefinedType = 'maintenance';
                                log( 0, 'info', 'base: %i;Marker: %s', intBaseType, strMarkerType );
                                break;
                            default:
                                strDefinedType = 'owned';
                                log( 0, 'error', 'base: %i;Marker: %s', intBaseType, strMarkerType );
                        }

                        mapMarkers[ ndxMarker ]._element.attributes.style.nodeValue = mapMarkers[ ndxMarker ]._element.attributes.style.nodeValue.replace( strMarkerType, strDefinedType );
                    }
                }
            }
        }, 2250 );
    } );
    map.on( 'zoom', mapChanged => {
        log( 2, 'log', 'map.changed: %o', mapChanged );
        setTimeout( () => {
            for ( var ndxMarker in mapMarkers ) {
                var intBaseType = mapMarkers[ ndxMarker ].capture_type_id;
                var findFlat = mapMarkers[ ndxMarker ]._element.attributes.style.nodeValue.match( /"https:\/\/munzee\.global\.ssl\.fastly\.net\/images\/pins\/[\w]*(flat[\w]*)\.[\a-z0-9]{3,4}\"/i );
                var isFlat = ( findFlat ? ( ( new RegExp( 'flat(hammock|lou|matt|rob)' ) ).test( findFlat[ 1 ] ) ? true : false ) : false );
                if ( isFlat ) {
                    var arrFlatURL = mapMarkers[ ndxMarker ]._element.attributes.style.nodeValue.match( /"(https:\/\/munzee\.global\.ssl\.fastly\.net\/images\/pins\/([\w]*flat[\w]*)\.[\a-z0-9]{3,4})\"/i );
                    console.log( 'arrFlatURL: %o', arrFlatURL );
                    var strFlatURL = arrFlatURL[ 1 ];console.log( 'strFlatURL: %o', strFlatURL );
                    var strFlatType = arrFlatURL[ 2 ];console.log( 'strFlatType: %o', strFlatType );
                    console.log( '.replace( %s, objFlats[ %s + \'_\' + objTypes[ %s ] ] ): %o: %o', strFlatURL, strFlatType, intBaseType, objTypes[ intBaseType ], objFlats[ strFlatType + '_' + objTypes[ intBaseType ] ] );
                    mapMarkers[ ndxMarker ]._element.attributes.style.nodeValue = mapMarkers[ ndxMarker ]._element.attributes.style.nodeValue.replace( strFlatURL, objFlats[ strFlatType + '_' + objTypes[ intBaseType ] ] );
                }
                else {
                    var arrMarkerType = mapMarkers[ ndxMarker ]._element.attributes.style.nodeValue.match( /"https:\/\/((.*)?\/([\w]*)\.([\a-z0-9]{3,4}))\"/i );
                    var strMarkerType = ( arrMarkerType ? arrMarkerType[ 3 ] : null );
                    if ( arrUndefinedTypes.indexOf( strMarkerType ) !== -1 ) {
                        let strDefinedType = '';
                        switch ( objTypes[ intBaseType ] ) {
                            case 'physical':
                            case 'virtual':
                                strDefinedType = strMarkerType + '_' + objTypes[ intBaseType ];
                                break;
                            case 'utl':
                                strDefinedType = 'maintenance';
                                log( 0, 'info', 'base: %i;Marker: %s', intBaseType, strMarkerType );
                                break;
                            default:
                                strDefinedType = 'owned';
                                log( 0, 'error', 'base: %i;Marker: %s', intBaseType, strMarkerType );
                        }

                        mapMarkers[ ndxMarker ]._element.attributes.style.nodeValue = mapMarkers[ ndxMarker ]._element.attributes.style.nodeValue.replace( strMarkerType, strDefinedType );
                    }
                }
            }
        }, 1300 );
    } );
} )();