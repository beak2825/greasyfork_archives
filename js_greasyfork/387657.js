// ==UserScript==
// @name         MunzeeMap Filter
// @namespace    none
// @version      2020.08.12.1806
// @author       technical13
// @supportURL   https://Discord.me/TheShoeStore
// @include      https://www.munzee.com/*map*
// @include      https://www.munzee.com/specials*
// @grant        GM_getResourceText
// @resource     physicals  https://raw.githubusercontent.com/Technical-13/MunzeeMap-Filter/master/physicals.json
// @resource     rovers     https://raw.githubusercontent.com/Technical-13/MunzeeMap-Filter/master/rovers.json
// @resource     POIs       https://raw.githubusercontent.com/Technical-13/MunzeeMap-Filter/master/POIs.json
// @resource     noblast    https://raw.githubusercontent.com/Technical-13/MunzeeMap-Filter/master/nonblastable.json
// @resource     blastable  https://raw.githubusercontent.com/Technical-13/MunzeeMap-Filter/master/blastable.json
// @resource     special    https://raw.githubusercontent.com/Technical-13/MunzeeMap-Filter/master/specials.json
// @resource     PRBs       https://raw.githubusercontent.com/Technical-13/MunzeeMap-Filter/master/PRBs.json
// @resource     SOBs       https://raw.githubusercontent.com/Technical-13/MunzeeMap-Filter/master/SOBs.json
// @resource     MOSs       https://raw.githubusercontent.com/Technical-13/MunzeeMap-Filter/master/MOSs.json
// @description  filter for munzee map
// @downloadURL https://update.greasyfork.org/scripts/387657/MunzeeMap%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/387657/MunzeeMap%20Filter.meta.js
// ==/UserScript==
// jshint esversion: 6
// basedon: MunzeeMapFilterV3 by Czimbalmos Péter AKA CzPeet
// basedon: https://greasyfork.org/en/scripts/373493-munzeemapfilterv3
// basedon: MunzeeMapV2 by rynee
// basedon: https://greasyfork.org/en/scripts/11662-munzeemapv2
// basedon: MyMunzeeMap by pkoopmanpk
// basedon: https://greasyfork.org/en/scripts/7062-mymunzeemap
// basedon: MunzeeMap by Nerjuz
// basedon: https://greasyfork.org/en/scripts/4750-munzeemap

var isDebug = false;
var intVerbosity = 0;
const ver = '2020.08.12.1806';
const scriptName = 'MunzeeMap Filter v' + ver;
console.info( scriptName + ' loaded' );
var lastNominatimRequest = ( new Date() ).valueOf();

function log( intV, strConsole, strLog, ...arrArgs ) {
    if ( intV === undefined ) { intV = 0; }
    if ( strConsole === undefined ) { strConsole = 'log'; }
    if ( strLog === undefined ) { strLog = '%o'; }
    if ( intVerbosity >= intV && ( strConsole === 'groupEnd' ) ) { console[ strConsole ](); }
    if ( intV === 0 || ( isDebug && intVerbosity >= intV ) ) { console[ strConsole ]( '[%i]: %s: ' + strLog, intV, scriptName, ...arrArgs ); }
}

function toBoolean( val ) {
    const arrTrue = [ undefined, null, '', true, 'true', 1, '1', 'on', 'yes' ];
    val = ( typeof( val ) === 'string' ? val.toLowerCase() : val );

    log( 4, 'log', 'toBoolean() is returning: %o', ( arrTrue.indexOf( val ) !== -1 ? true : false ) );
    return ( arrTrue.indexOf( val ) !== -1 ? true : false );
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
log( 1, 'log', '\n\t1) Summary\n\t2) Parameters retrieved from URL\n\t3) Variables set\n\t4) Function returns\n\t9) ALL debugging info and this notice.' );
log( 1, 'groupEnd' );

function convertToHex( str ) { var hex = ''; for ( var i = 0; i < str.length; i++ ) { hex += '' + str.charCodeAt( i ).toString( 16 ); } return hex; }
const key = 'pk.8e' + convertToHex( '¸3þÿ¯}¤ê' ).replace( '43', '403' ).toString();

const arrPhysicals = JSON.parse( GM_getResourceText( 'physicals' ) ).arrPhysicals;
const arrBlastables = JSON.parse( GM_getResourceText( 'blastable' ) ).arrBlastables;
const arrNonBlastables = JSON.parse( GM_getResourceText( 'noblast' ) ).arrNonBlastables;
const arrPOI = JSON.parse( GM_getResourceText( 'POIs' ) ).arrPOI;
const arrPRB = JSON.parse( GM_getResourceText( 'PRBs' ) ).arrPRBs;
const arrSOB = JSON.parse( GM_getResourceText( 'SOBs' ) ).arrSOBs;
const arrMOS = JSON.parse( GM_getResourceText( 'MOSs' ) ).arrMOSs;
const arrSpecial = JSON.parse( GM_getResourceText( 'special' ) ).arrSpecials;
const arrSpecials = arrSpecial.concat( arrPRB, arrSOB, arrMOS );
const arrRovers = JSON.parse( GM_getResourceText( 'rovers' ) ).arrRovers;
const arrDestination = [ 'https://munzee.global.ssl.fastly.net/images/pins/hotel.png', 'https://munzee.global.ssl.fastly.net/images/pins/motel.png',
                        'https://munzee.global.ssl.fastly.net/images/pins/timesharemunzee.png', 'https://munzee.global.ssl.fastly.net/images/pins/virtual_resort.png',
                        'https://munzee.global.ssl.fastly.net/images/pins/treehouse.png', 'https://munzee.global.ssl.fastly.net/images/pins/treehouse1.png' ,
                        'https://munzee.global.ssl.fastly.net/images/pins/treehouse2.png', 'https://munzee.global.ssl.fastly.net/images/pins/treehouse3.png' ,
                        'https://munzee.global.ssl.fastly.net/images/pins/treehouse4.png', 'https://munzee.global.ssl.fastly.net/images/pins/treehouse5.png' ,
                        'https://munzee.global.ssl.fastly.net/images/pins/treehouse6.png', 'https://munzee.global.ssl.fastly.net/images/pins/skyland.png',
                        'https://munzee.global.ssl.fastly.net/images/pins/skyland1.png', 'https://munzee.global.ssl.fastly.net/images/pins/skyland2.png',
                        'https://munzee.global.ssl.fastly.net/images/pins/skyland3.png', 'https://munzee.global.ssl.fastly.net/images/pins/skyland4.png',
                        'https://munzee.global.ssl.fastly.net/images/pins/skyland5.png', 'https://munzee.global.ssl.fastly.net/images/pins/skyland6.png' ];
const arrTrail = [ 'https://munzee.global.ssl.fastly.net/images/pins/trail.png', 'https://munzee.global.ssl.fastly.net/images/pins/virtual_trail.png' ];
var arrReported = ( !localStorage.getItem( 'MMF' ) ? [] : JSON.parse( localStorage.getItem( 'MMF' ) ).arrReported );

var isReporter = ( !localStorage.getItem( 'MMF' ) ? null : JSON.parse( localStorage.getItem( 'MMF' ) ).isReporter );
if ( isReporter === null ) {
    localStorage.setItem( 'MMF', JSON.stringify( { isReporter: false, arrReported: [] } ) );
    isReporter = false;
}

function showAddress() {
    var lat = map.getCenter().lat, lon = map.getCenter().lng, zoom = map.getZoom();
    var intZoom = Math.round( zoom < 3 ? 3 : ( zoom > 18 ? 18 : zoom ) );
    var geoHash = geohash.encode( lat, lon, 9 );
    $( 'span#address-coords' ).text( '( ' + lat + ', ' + lon + ' )' );
    $( 'a#address-google' ).attr( 'href', 'https://www.google.com/maps/place/@' + lat + ',' + lon + ',' + zoom + 'z' );
    $( 'a#address-permalink' ).attr( 'href', 'https://www.munzee.com/map/' + geoHash + '/' + zoom );
    var intRequestNow = ( new Date() ).valueOf();
    log( 2, 'log', 'Attempting to get address %oms from last request:\n\t%s >= %s', ( intRequestNow - lastNominatimRequest ), intRequestNow, lastNominatimRequest );
    if ( intRequestNow >= lastNominatimRequest ) {
        log( 2, 'log', 'Attempting to get address %oms from last request.', ( intRequestNow - lastNominatimRequest ) );
        lastNominatimRequest = ( intRequestNow + 1500 );
        $.get( 'https://us1.locationiq.com/v1/reverse.php?key=' + key + '&format=json&namedetails=1&extratags=1&lat=' + lat + '&lon=' + lon + '&zoom=' + ( intZoom > 18 ? 18 : ( intZoom < 3 ? 3 : intZoom ) ) ).done( function ( data ) {
            log( 2, 'log', 'https://us1.locationiq.com/v1/reverse.php?key=%s&format=json&namedetails=1&extratags=1&lat=%s&lon=%s&zoom=%s result:\n\t%o', key, lat, lon, intZoom, data );
            if ( $( 'span#address-section' ).is( ':hidden' ) ) { $( 'span#address-section' ).show() }
            $( 'span#address-text' ).text( data.display_name );
        } ).fail( function ( errGet ) {
            $( 'span#address-text' ).hide();
            if ( errGet.status != 0 ) {
                log( 0, 'error', 'Failed to get:\nhttps://us1.locationiq.com/v1/reverse.php?key=%s&format=json&namedetails=1&extratags=1&lat=%s&lon=%s&zoom=%s:\n\t%o', key, lat, lon, intZoom, errGet );
            } else {
                log( 0, 'error', 'https://us1.locationiq.com/v1/reverse.php?key=%s&format=json&namedetails=1&extratags=1&lat=%s&lon=%s&zoom=%s blocked by rate limiting.', key, lat, lon, intZoom );
                lastNominatimRequest = ( intRequestNow + 300000 );
            }
        } );
    }
}

var lat = map.getCenter().lat, lon = map.getCenter().lng, zoom = map.getZoom();
var geoHash = geohash.encode( lat, lon, 9 );
var mapLocationSection = document.createElement( 'div' );
mapLocationSection.id = 'address';
mapLocationSection.style = 'text-align: center;';
var mapAddress = document.createElement( 'span' );
mapAddress.id = 'address-section';
var mapAddressText = document.createElement( 'span' );
mapAddressText.id = 'address-text';
var mapAddressAttributionLink = document.createElement( 'a' );
mapAddressAttributionLink.id = 'address-text-attribution-link';
mapAddressAttributionLink.innerText = 'LocationIQ';
mapAddressAttributionLink.href = 'https://locationiq.com/attribution';
var mapAddressAttribution = document.createElement( 'small' );
mapAddressAttribution.id = 'address-text-attribution';
mapAddressAttribution.append( document.createTextNode( ' (address provided by: ' ), mapAddressAttributionLink, document.createTextNode( ')' ) );
mapAddress.append( mapAddressText, mapAddressAttribution );
var mapCoords = document.createElement( 'span' );
mapCoords.id = 'address-coords';
mapCoords.innerText = '( ' + lat + ', ' + lon + ' )';
var mapGoogle = document.createElement( 'a' );
mapGoogle.id = 'address-google';
mapGoogle.innerText = 'Google Maps';
mapGoogle.href = 'https://www.google.com/maps/place/@' + lat + ',' + lon + ',' + zoom + 'z';
var mapLink = document.createElement( 'a' );
mapLink.id = 'address-permalink';
mapLink.innerText = 'Munzee Permalink';
mapLink.href = 'https://www.munzee.com/map/' + geoHash + '/' + zoom;
/*var mapMVGP = document.createElement( 'a' );
mapMVGP.id = 'address-mvgp';
mapMVGP.href = 'https://www.munzee.com/map/' + geoHash + '/' + zoom;
var mapMVGPAbbr = document.createElement( 'abbr' );
mapMVGPAbbr.title = 'Munzee Virtual Garden Painter';
mapMVGPAbbr.innerText = 'MVGP';
mapMVGP.append( mapMVGPAbbr );//*/

mapLocationSection.append( mapAddress, document.createElement( 'br' ),
                          mapCoords, document.createTextNode( ' -> ' ),
                          mapGoogle, document.createTextNode( ' - ' ),
                          mapLink );
//mapLocationSection.append( document.createTextNode( ' ' ) );
//mapLocationSection.append( mapMVGP );

showAddress();

// $( '#footer' ).remove();
$( 'head' ).append(
    $( '<style>' +
      '.v_blast { border: 2px inset #00FF00; }' +// green
      '.v_non { border: 2px inset #FF0000; }' +// red
      '.v_poi { border: 2px inset #EA6426; }' +// POI orange
      '.physical { border: 2px inset #330000; }' +// maroon
      '.rover { border: 2px double #006600; }' +// dark green
      '.v_special { border: 2px inset #FF00FF; }' +// Purple
      '.ico_show { background-color: #88FF88; }' +
      '.ico_hide { opacity: 0.4; background-color: #FF8888; border-style: outset; }' +
      '.reported { border-width: 3px; border-style: dashed dotted; border-color: #FFFF00; }' +// yellow
      '.unknown_type { border-width: 3px; border-style: dashed dotted; border-color: #FF0000; }' +// red
      '.filter_icon { padding: 0px 1px 0px 0px; }' +
      '.filter_icon > div { text-align: center; }' +
      '.filter_icon > img { height: 30px; cursor: pointer; border-radius: 5px; }' +
      '.filter_icon > img.img_hide { opacity: 0.4; }' +
      '#filterIcons { padding: 5px; background-color: #FFFFFF; }' +
      '#inputbar { background-color: #FFFFFF; top: 30px; border-top: 1px solid #FFFFFF; }' +
      '</style>'
     )
);
$( '.panel.panel-default' ).css( 'margin-bottom', '0px' );
$( '.row' ).css( 'margin', '0px' );
$( '.panel-body' ).css( 'padding-left', '0px' ).css( 'padding-right', '0px' );

var inputbar = $( '#inputbar' );
var filterButtons = $( '<br style="line-height: 3em;"><div id="filterButtons" class="btn-group" data-toggle="buttons">' +
                      '<label class="btn btn-success"><input id="check_blastable" type="checkbox">hide blastable</label>' +
                      '<br class="visible-xs">' +
                      '<label class="btn btn-success"><input id="check_non_blastable" type="checkbox">hide non-blastable</label>' +
                      '<br class="visible-xs">' +
                      '<label class="btn btn-success"><input id="check_poi" type="checkbox">hide POI</label>' +
                      '<br class="visible-xs">' +
                      '<label class="btn btn-info"><input id="be_reporter" type="checkbox">show reporting</label>' +
                      '</div>' );
inputbar.prepend( filterButtons );
var filterIcons = $( '<div id="filterIcons"></div>' );
inputbar.prepend( filterIcons );
if ( isReporter ) {
    toggleAction( $( '#be_reporter' ) );
    $( '#be_reporter' ).parent().addClass( 'active' );
}

var objAllMunzees = {};
var iconCounter = {};
var objAllIcons = {};
var disabledIcons = [];
var imgSRC = '';

function updateMapIcons() {
    showAddress();
    for ( var mID in mapMarkers ) {
        var curr = mapMarkers[ mID ]._element.style.backgroundImage.replace( 'url("', '' ).replace( '")', '' );
        if ( $.inArray( curr, disabledIcons ) == -1 ) { $( "[data-index='" + mID + "']" ).css( 'display', 'block' ); }
        else { $( "[data-index='" + mID + "']" ).css( 'display', 'none' ); }
    }
}
function submitNewTypes() {
    var arrAllIconTypes = Object.keys( objAllIcons );
    var intAIT = arrAllIconTypes.length;
    if ( intAIT > 0 ) {
        if ( isReporter ) {
            let doReport = confirm( '[ "' + arrAllIconTypes.join( '", "' ) + '" ] ' + ( intAIT === 1 ? 'is an' : 'are' ) + ' unknown Munzee type' + ( intAIT === 1 ? '' : 's' ) + ' to ' + scriptName + '.\n\n\t\t\tWould you like to let the script writter know about ' + ( intAIT === 1 ? 'it' : 'them' ) + '?' );
            if ( doReport ) {
                var arrReporting = [];
                var strTitle = '?title=' + encodeURIComponent( 'Unknown type' + ( arrAllIconTypes.length === 1 ? '' : 's' ) + ': ' );
                var strBody = '&body=' + encodeURIComponent( 'Found unknown mapMarker types:' );
                for ( let intTypeIndex in arrAllIconTypes ) {
                    let strType = arrAllIconTypes[ intTypeIndex ];
                    let arrList = objAllIcons[ strType ];
                    let strPinURL = objAllMunzees[ arrList[ 0 ] ].type_id;
                    arrReporting.push( strPinURL );
                    let strPinType = ( objAllMunzees[ arrList[ 0 ] ].is_virtual == 1 ? 'virtual' : 'physical' );
                    if ( intTypeIndex >= 1 ) { strTitle += ', '; }
                    strTitle += encodeURIComponent( '[ "' + strPinType + '", "' + strType + '" ]' );
                    strBody += '%0A%0A' + encodeURIComponent( strPinURL + ' is a ' + strPinType + ': ![' + strType + '](' + strPinURL + ')' );
                    var arrReports = [];
                    for ( var intMunzeeID in arrList ) {
                        let munzeeID = arrList[ intMunzeeID ];
                        //                        console.info( 'Created link for: %o', objAllMunzees[ munzeeID ] );
                        if ( arrReports.indexOf( munzeeID ) === -1 ) {
                            arrReports.push( munzeeID );
                            let strMunzeeOwnerLink = '[' + objAllMunzees[ munzeeID ].user + '](https://www.munzee.com/m/' + objAllMunzees[ munzeeID ].user + ')';
                            //                            console.log( 'strMunzeeOwnerLink: %o', strMunzeeOwnerLink );
                            let strMunzeeLink = '[' + objAllMunzees[ munzeeID ].name + '](https://www.munzee.com/m/' + objAllMunzees[ munzeeID ].user + '/' + objAllMunzees[ munzeeID ].number + ')';
                            //                            console.log( 'strMunzeeLink: %o', strMunzeeLink );
                            let strGeoHash = geohash.encode( objAllMunzees[ munzeeID ].lat, objAllMunzees[ munzeeID ].lon, 9 );
                            //                            console.log( 'strGeoHash: %o', strGeoHash );
                            let strMapLink = '[' + objAllMunzees[ munzeeID ].lat + ', ' + objAllMunzees[ munzeeID ].lon + '](https://www.munzee.com/map/' + strGeoHash + '/20.0)';
                            //                            console.log( 'strMapLink: %o', strMapLink );
                            strBody += '%0A' + encodeURIComponent( '* ' + strMunzeeLink + ' at ' + strMapLink + ' by ' + strMunzeeOwnerLink );
                            //                            console.log( '+strBody: %o', '%0A' + encodeURIComponent( '* ' + strMunzeeLink + ' at ' + strMapLink + ' by ' + strMunzeeOwnerLink ) );
                        }
                    }
                }
                window.open( 'https://github.com/Technical-13/MunzeeMap-Filter/issues/new' + strTitle + strBody, '_blank', 'menubar=no,toolbar=no,location=no,status=no,width=1000' );
                arrReported = arrReported.concat( arrReporting );
                localStorage.setItem( 'MMF', JSON.stringify( { isReporter: isReporter, arrReported: arrReported } ) );
            } else {
                log( 2, 'info', 'List of unknown types detected: %o', arrAllIconTypes );
            }
        } else {
            log( 2, 'info', 'List of unknown types detected:\n\t%o', arrAllIconTypes );
        }
    }
}// Submit GitHub issue for unknown types
function toggleAction( target, isInverted = false ) {
    let isChecked = target.checked;
    if ( isInverted ) { isChecked = !isChecked; }
    let strOldAction = ( isChecked ? 'hide' : 'show' );
    let strNewAction = ( isChecked ? 'show' : 'hide' );
    $( target ).parent().html( $( target ).parent().html().replace( strOldAction, strNewAction ) );
}
function createfilter4Map( event, xhr, settings ) {
    var munzeeData = xhr.responseJSON;
    $.each( mapMarkers, function ( key, marker ) {
        $.each( munzeeData, function( box_key, element ) {
            if ( element.munzee_id == key ) {
                objAllMunzees[ key ] = element;
            }
        } );
    } );

    iconCounter = {};
    filterIcons.empty();

    //Collection
    for ( var munzeeID in mapMarkers ) {
        //img src
        imgSRC = mapMarkers[ munzeeID ]._element.style.backgroundImage.replace( 'url("', '' ).replace( '")', '' );
        let strType = imgSRC.split( '/' )[ imgSRC.split( '/' ).length - 1 ].split( '.' )[ 0 ];

        if ( typeof iconCounter[ imgSRC ] == 'undefined' ) { iconCounter[ imgSRC ] = 1; }
        else { iconCounter[ imgSRC ]++; }

        if ( objAllIcons[ strType ] === undefined ) { objAllIcons[ strType ] = []; }
        if ( objAllIcons[ strType ].indexOf( munzeeID ) === -1 ) { objAllIcons[ strType ].push( munzeeID ); }
    }

    //Creation
    for ( imgSRC in iconCounter ) {
        let strType = imgSRC.split( '/' )[ imgSRC.split( '/' ).length - 1 ].split( '.' )[ 0 ];
        let isPhysical = ( arrPhysicals.indexOf( imgSRC ) >= 0 ? true : false );
        let isBlastable = ( arrBlastables.indexOf( imgSRC ) >= 0 ? true : false );
        let isNonBlastable = ( arrNonBlastables.indexOf( imgSRC ) >= 0 ? true : false );
        let isPOI = ( arrPOI.indexOf( imgSRC ) >= 0 ? true : false );
        let isSpecial = ( arrSpecials.indexOf( imgSRC ) >= 0 ? true : false );
        let isVirtual = ( isNonBlastable || isBlastable || isPOI || isSpecial ? true : false );
        let isRover = ( arrRovers.indexOf( imgSRC ) >= 0 ? true : false );
        let isReported = ( arrReported.indexOf( imgSRC ) >= 0 ? true : false );

        let arrDebug = arrDestination.concat( arrTrail );
        if ( arrDebug.indexOf( imgSRC ) >= 0 ) {
            log( 1, 'log', 'Debugging: %o', objAllMunzees[ objAllIcons[ strType ][ 0 ] ] );
        }

        if ( isPhysical || isVirtual || isRover || isReported ) {
            delete objAllIcons[ strType ];
            if ( isReported && ( isPhysical || isVirtual || isRover ) ) {
                arrReported = arrReported.splice( arrReported.indexOf( imgSRC ), 1 );
                localStorage.setItem( 'MMF', JSON.stringify( { isReporter: isReporter, arrReported: arrReported } ) );
            }
        }

        /*        console.log(
            'Virtual: %s\tBlastable: %s\tPOI: %s\tSpecial: %s\tDisabled: %s\tType: %s',
            ( isVirtual ? 'yes' : ' no' ), ( isBlastable ? 'yes' : ' no' ),
            ( isPOI ? 'yes' : ' no' ), ( isSpecial ? 'yes' : ' no' ),
            ( disabledIcons.indexOf( imgSRC ) >= 0 ? 'yes' : ' no' ), strType );//*/

        //new element
        filterIcons.append (
            '<div class="pull-left filter_icon">' +
            '<div>' + iconCounter[ imgSRC ] + '</div>' +
            '<img class="haideris ' + ( isRover ? 'rover ' : ( isVirtual ? ( isBlastable ? 'v_blast ' : 'v_non ' ) + ( isPOI ? 'v_poi ' : '' ) + ( isSpecial ? 'v_special ' : '' ) : ( isPhysical ? 'physical v_non ' : ( isReported ? 'reported ' : 'unknown_type ' ) ) ) ) + ( disabledIcons.indexOf( imgSRC ) >= 0 ? 'ico_hide' : 'ico_show' ) + '" src="' + imgSRC + '" title="' + strType + '" />' +
            '</div>'
        );
    }

    filterIcons.append( '<div style="clear: both; height: 1px; overflow: hidden;"></div>' );

    updateMapIcons();

    submitNewTypes();
}

if ( ( new RegExp( 'specials' ) ).test( window.location.pathname ) ) {
    log( 1, 'log', 'Detected page: specials' );
    $( document ).on( 'mouseup', '#map_span', function( e ) { showAddress(); } );
    $( document ).on( 'click', '#map-box-specials-zoom-in', function( e ) { showAddress(); } );
    $( document ).on( 'click', '#map-box-specials-zoom-out', function( e ) { showAddress(); } );
    $( 'div#map_span' ).after( mapLocationSection );
}
else if ( window.location.pathname.split( '/' )[ 1 ] === 'map' ) {
    log( 1, 'log', 'Detected page: map' );
    $( 'div#inputbar' ).before( mapLocationSection );
    $( document ).on( 'click', '.ico_show.haideris', function ( e ) {
        var curr = $( this ).attr( 'src' );

        if ( e.ctrlKey ) {
            var icons = document.querySelectorAll( '.haideris' );
            //        console.log( 'icons: %o', icons );
            disabledIcons = [];
            for ( var ic in iconCounter ) {
                if ( ic != curr ) { disabledIcons.push( ic ); }
            }
            //        console.log( 'disabledIcons: %o', disabledIcons );

            for ( var i in icons ) {
                //            console.log( 'icons[ i ] is a: %o', typeof( icons[ i ] ) );
                if ( typeof( icons[ i ] ) === 'object' ) {
                    let intIcoShowHide = -1;
                    let strNewClass = Array.from( icons[ i ].classList );
                    //              console.log( 'Testing if `%o` != `%o`: %s', icons[ i ].src, curr, ( icons[ i ].src != curr ? 'NOT ' : '') + 'equal' );
                    if ( icons[ i ].src != curr ) {
                        intIcoShowHide = strNewClass.indexOf( 'ico_show' );
                        strNewClass[ intIcoShowHide ] = 'ico_hide';
                    } else {
                        intIcoShowHide = strNewClass.indexOf( 'ico_hide' );
                        strNewClass[ intIcoShowHide ] = 'ico_show';
                    }
                    strNewClass = strNewClass.join( ' ' );
                    //              console.log( 'Replacing classList %o with string `%s`', icons[ i ].classList, strNewClass );
                    icons[ i ].className = strNewClass;
                }
            }
        }
        else {
            $( this ).removeClass( 'ico_show' ).addClass( 'ico_hide' );
            if ( disabledIcons.indexOf( curr ) == -1 ) { disabledIcons.push( curr ); }
        }
        updateMapIcons();
    } );// hide
    $( document ).on( 'click', '.ico_hide.haideris', function ( e ) {
        var curr = $( this ).attr( 'src' );

        if ( e.ctrlKey ) {
            var icons = document.querySelectorAll( '.haideris' );
            //        console.log( 'icons: %o', icons );
            disabledIcons = [];
            for ( var ic in iconCounter ) {
                if ( ic == curr ) { disabledIcons.push( ic ); }
            }
            //        console.log( 'disabledIcons: %o', disabledIcons );

            for ( var i in icons ) {
                //            console.log( 'icons[ i ] is a: %o', typeof( icons[ i ] ) );
                if ( typeof( icons[ i ] ) === 'object' ) {
                    let intIcoShowHide = -1;
                    let strNewClass = Array.from( icons[ i ].classList );
                    //              console.log( 'Testing if `%o` != `%o`: %s', icons[ i ].src, curr, ( icons[ i ].src != curr ? 'NOT ' : '') + 'equal' );
                    if ( icons[ i ].src != curr ) {
                        intIcoShowHide = strNewClass.indexOf( 'ico_hide' );
                        strNewClass[ intIcoShowHide ] = 'ico_show';
                    } else {
                        intIcoShowHide = strNewClass.indexOf( 'ico_show' );
                        strNewClass[ intIcoShowHide ] = 'ico_hide';
                    }
                    strNewClass = strNewClass.join( ' ' );
                    //              console.log( 'Replacing classList %o with string `%s`', icons[ i ].classList, strNewClass );
                    icons[ i ].className = strNewClass;
                }
            }
        }
        else {
            $( this ).removeClass( 'ico_hide' ).addClass( 'ico_show' );
            var index = disabledIcons.indexOf( curr );
            if ( index !== -1 ) { disabledIcons.splice( index, 1 ); }
        }
        updateMapIcons();
    } );// show
    $( document ).on( 'change', '#check_blastable', function( e ) {
        toggleAction( e.target );
        for ( var intCurr in arrBlastables ) {
            var curr = arrBlastables[ intCurr ];
            //        console.log( '%d:%s: %o', intCurr, curr, arrBlastables );

            if ( e.target.checked ) {
                //            console.log( 'Hiding: %o', curr );
                $( '.v_blast.ico_show.haideris' ).removeClass( 'ico_show' ).addClass( 'ico_hide' );
                if ( disabledIcons.indexOf( curr ) == -1 ) { disabledIcons.push( curr ); }
            } else {
                //            console.log( 'Showing: %o', curr );
                $( '.v_blast.ico_hide.haideris' ).removeClass( 'ico_hide' ).addClass( 'ico_show' );
                var index = disabledIcons.indexOf( curr );
                if ( index !== -1 ) { disabledIcons.splice( index, 1 ); }
            }
        }
        updateMapIcons();
    } );// blastable
    $( document ).on( 'change', '#check_non_blastable', function( e ) {
        toggleAction( e.target );
        if ( $( '#check_poi' )[ 0 ].parentNode.innerText.indexOf( 'show' ) !== -1 ) {
            if ( !e.target.checked ) {
                $( '#check_poi' ).click();
            }
        } else if ( e.target.checked ) {
            $( '#check_poi' ).click();
        }
        var arrAllNonBlastables = arrNonBlastables.concat( arrPOI, arrPhysicals, arrRovers );
        for ( var intCurr in arrAllNonBlastables ) {
            var curr = arrAllNonBlastables[ intCurr ];
            //        console.log( '%d:%s: %o', intCurr, curr, arrBlastables );

            if ( e.target.checked ) {
                //            console.log( 'Hiding: %o', curr );
                $( '.v_non.ico_show.haideris' ).removeClass( 'ico_show' ).addClass( 'ico_hide' );
                if ( disabledIcons.indexOf( curr ) == -1 ) { disabledIcons.push( curr ); }
            } else {
                //            console.log( 'Showing: %o', curr );
                $( '.v_non.ico_hide.haideris' ).removeClass( 'ico_hide' ).addClass( 'ico_show' );
                var index = disabledIcons.indexOf( curr );
                if ( index !== -1 ) { disabledIcons.splice( index, 1 ); }
            }
        }
        updateMapIcons();
    } );// non-blastable
    $( document ).on( 'change', '#check_poi', function( e ) {
        toggleAction( e.target );
        for ( var intCurr in arrPOI ) {
            var curr = arrPOI[ intCurr ];
            //        console.log( '%d:%s: %o', intCurr, curr, arrBlastables );

            if ( e.target.checked ) {
                //            console.log( 'Hiding: %o', curr );
                $( '.v_poi.ico_show.haideris' ).removeClass( 'ico_show' ).addClass( 'ico_hide' );
                if ( disabledIcons.indexOf( curr ) == -1 ) { disabledIcons.push( curr ); }
            } else {
                //            console.log( 'Showing: %o', curr );
                $( '.v_poi.ico_hide.haideris' ).removeClass( 'ico_hide' ).addClass( 'ico_show' );
                var index = disabledIcons.indexOf( curr );
                if ( index !== -1 ) { disabledIcons.splice( index, 1 ); }
            }
        }
        updateMapIcons();
    } );// POIs
    $( document ).on( 'change', '#be_reporter', function( e ) {
        isReporter = !isReporter;
        toggleAction( e.target, true );
        localStorage.setItem( 'MMF', JSON.stringify( { isReporter: isReporter, arrReported: arrReported } ) );
    } );// Be Reporter
    $( document ).ajaxSuccess( createfilter4Map );
}
else {
    log( 1, 'log', 'Detected page: %s', window.location.pathname );
    $( document ).on( 'mouseup', '#map_canvas', function( e ) { showAddress(); } );
    $( document ).on( 'click', '#map-box-specials-zoom-in', function( e ) { showAddress(); } );
    $( document ).on( 'click', '#map-box-specials-zoom-out', function( e ) { showAddress(); } );
    $( 'div#map_canvas' ).after( mapLocationSection );
}