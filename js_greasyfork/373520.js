// ==UserScript==
// @name         Munzee Garden Pin Checker
// @namespace    none
// @version      2020.04.13.1012ß
// @description  Verify Munzee Garden Pins!
// @supportURL   https://Discord.me/TheShoeStore
// @require      https://greasyfork.org/scripts/376307-zandboxee/code/Zandboxee.user.js
// @author       technical13
// @match        https://www.munzee.com/m/*/map/*
// @match        https://www.munzee.com/map*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373520/Munzee%20Garden%20Pin%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/373520/Munzee%20Garden%20Pin%20Checker.meta.js
// ==/UserScript==
// jshint esversion: 6

var MGPC = {};
MGPC.ver = '2020.04.13.1012ß';
MGPC.scriptName = 'Munzee Garden Quick Pin Checker v' + MGPC.ver;

function logMGPC( intV, strConsole, strLog, ...arrArgs ) {
    if ( intV === undefined ) { intV = 0; }
    if ( strConsole === undefined ) { strConsole = 'log'; }
    if ( strLog === undefined ) { strLog = '%o'; }
    if ( intVerbosity >= intV && ( strConsole === 'groupEnd' ) ) { console[ strConsole ](); }
    if ( intV === 0 || ( isDebug && intVerbosity >= intV ) ) { console[ strConsole ]( '[%i]: %s: ' + strLog, intV, MGPC.scriptName, ...arrArgs ); }
}

Number.prototype.toRadians = function() { return this * Math.PI / 180; };// define a toRadians() function
Number.prototype.toDegrees = function() { return this * 180 / Math.PI; };// define a toDegrees() function

const arrEvoTypes = [
    'carrotseed', 'carrotplant', 'carrot', 'carrotevolution',
    'peasseed', 'peasplant', 'peas', 'peasevolution',
    'chick', 'chicken', 'eggs', 'eggsevolution',
    'colt', 'racehorse', 'championshipracehorse', 'horseevolution',
    'farmer', 'farmerandwife', 'family', 'familyevolution',
    'pottedplant', 'garden', 'field', 'fieldevolution',
    'canoe', 'motorboat', 'submarine', 'submarineevolution',
    'firstwheel', 'penny-farthingbike', 'musclecar', 'carevolution',
    'safaritruck', 'safarivan', 'safaribus', 'safaribusevolution'
];
const arrFlowerTypes = [
    'carnationseed', 'carnationgermination', 'carnationgrowth', 'carnationbud', 'carnationblossom', 'carnationevolution',
    'tulipseed', 'tulipgermination', 'tulipgrowth', 'tulipbud', 'tulipblossom', 'null'
];

arrParamSets.forEach( function( strParam ) {
    let arrParam = strParam.split( '=' );
    let strParamName = ( arrParam[ 0 ].toLowerCase() || '' );
    switch ( strParamName ) {
        case 'type' :// What type of Munzee is it suppose to be?
            logMGPC( 2, 'log', 'Got &type= as: %s', arrParam[ 1 ] );
            var thisType = decodeURIComponent(
                arrParam[ 1 ]
                .toLowerCase()
                .replace( 'flat', 'flat' )
                .replace( /(%20|white)/g, '' )
                .replace( 'mvm', 'virtual' )
                .replace( 'gardenpoi', 'poivirtualgarden' )
            ), intTypePhase = -1, intType = -1;
            logMGPC( 3, 'log', 'type is: %s', thisType );
            if ( arrEvoTypes.indexOf( thisType ) !== -1 ) {
                intTypePhase = ( arrEvoTypes.indexOf( thisType ) % 4 );
                intType = arrEvoTypes.indexOf( thisType ) - intTypePhase;
                thisType = arrEvoTypes[ intType ];
                logMGPC( 3, 'log', '3 stage type is: %s', thisType );
            }
            if ( arrFlowerTypes.indexOf( thisType ) !== -1 ) {
                intTypePhase = ( arrFlowerTypes.indexOf( thisType ) % 6 );
                intType = arrFlowerTypes.indexOf( thisType ) - intTypePhase;
                thisType = arrFlowerTypes[ intType ];
                logMGPC( 3, 'log', '5 stage type is: %s', thisType );
            }
            objParams.type = thisType;
            logMGPC( 3, 'log', 'Set objParams.type to: %s', objParams.type );
            break;
        default:
    }
} );

function getDistance( dblLatA, dblLonA, dblLatB, dblLonB ) {
    dblLatA = parseFloat( dblLatA ); dblLonA = parseFloat( dblLonA );
    dblLatB = parseFloat( dblLatB ); dblLonB = parseFloat( dblLonB );
    const intEarth = 6371000; // metres
    const radLatA = dblLatA.toRadians();
    const radLatB = dblLatB.toRadians();
    const radLatDiff = ( dblLatB - dblLatA ).toRadians();
    const radLonDiff = ( dblLonB - dblLonA ).toRadians();

    var a = Math.sin( radLatDiff / 2 ) * Math.sin( radLatDiff / 2 ) +
        Math.cos( radLatA ) * Math.cos( radLatB ) *
        Math.sin( radLonDiff / 2 ) * Math.sin( radLonDiff / 2 );
    var c = 2 * Math.atan2( Math.sqrt( a ), Math.sqrt( 1 - a ) );

    logMGPC( 4, 'log', 'getDistance( %s, %s, %s, %s ) is returning: %o', dblLatA, dblLonA, dblLatB, dblLonB, ( intEarth * c ) );
    return intEarth * c;
}
function getBearing( dblLatA, dblLonA, dblLatB, dblLonB ) {
    dblLatA = parseFloat( dblLatA ); dblLonA = parseFloat( dblLonA );
    dblLatB = parseFloat( dblLatB ); dblLonB = parseFloat( dblLonB );
    const radLatA = dblLatA.toRadians();
    const radLatB = dblLatB.toRadians();
    const radLonDiff = ( dblLonB - dblLonA ).toRadians();
    var x = Math.cos( radLatA ) * Math.sin( radLatB ) -
        Math.sin( radLatA ) * Math.cos( radLatB ) * Math.cos( radLonDiff );
    var y = Math.sin( radLonDiff ) * Math.cos( radLatB );

    logMGPC( 4, 'log', 'getBearing( %s, %s, %s, %s ) is returning: %o', dblLatA, dblLonA, dblLatB, dblLonB, 360 - ( Math.atan2( y, x ).toDegrees() ) );
    return 360 - ( Math.atan2( y, x ).toDegrees() );
}
function getDirection( dblDegrees ) {
    dblDegrees = parseInt( Math.round( dblDegrees ) - Math.round( dblDegrees ) % 45 ) % 360;
    var strCardinalDirection;
    switch ( dblDegrees ) {
        case 0 : strCardinalDirection = 'North'; break;
        case 45 : strCardinalDirection = 'North East'; break;
        case 90 : strCardinalDirection = 'East'; break;
        case 135 : strCardinalDirection = 'South East'; break;
        case 180 : strCardinalDirection = 'South'; break;
        case 225 : strCardinalDirection = 'South West'; break;
        case 270 : strCardinalDirection = 'West'; break;
        case 315 : strCardinalDirection = 'North West'; break;
        default : console.error( '%s: %o', ( new Date() ).toLocaleDateString(), dblDegrees ); strCardinalDirection = 'ERROR';
    }

    logMGPC( 4, 'log', 'getBearing( %s ) is returning: %o', dblDegrees, strCardinalDirection );
    return strCardinalDirection;
}

( async function() {
    logMGPC( 0, 'info', 'Script loaded.' );

    if ( objParams.lat !== undefined && objParams.lon !== undefined && objParams.type !== undefined ) {
        var objMunzeeInfo = {};
        objMunzeeInfo.correct = 0;
        var strDeployed = /Deployed/;
        objMunzeeInfo.deployed = strDeployed.test( document.getElementsByClassName( 'status-date' )[ 0 ].innerText );// Is it deployed?
        if ( objMunzeeInfo.deployed ) { objMunzeeInfo.correct++; }
        var arrCoordinates = document.getElementsByClassName( 'munzee-main-area col-md-9' )[ 0 ].childNodes[ 4 ].data.trim().split( ' ' );
        objMunzeeInfo.latitude = parseFloat( arrCoordinates[ 0 ] );// What is it's current latitude?
        if ( objParams.lat === objMunzeeInfo.latitude ) { objMunzeeInfo.correct++; }
        objMunzeeInfo.longitude = parseFloat( arrCoordinates[ 1 ] );// What is it's current longitude?
        if ( objParams.lon === objMunzeeInfo.longitude ) { objMunzeeInfo.correct++; }
        var arrType = document.getElementsByClassName( 'pull-left pin' )[ 0 ].attributes.src.value.replace( /https?:\/\//i, '' ).split( '/' );
        arrType = arrType[ ( arrType.length - 1 ) ].split( '.' );
        objMunzeeInfo.type = arrType[ 0 ].replace( /_/g, '' );// What is it's current type?
        if ( objParams.type === objMunzeeInfo.type ) { objMunzeeInfo.correct++; }

        logMGPC( 1, 'log', 'Looking for: %s to be deployed at %s, %s.\nFound: %s is at %s, %s %s %s deployed.', objParams.type, objParams.lat, objParams.lon, objMunzeeInfo.type, objMunzeeInfo.latitude, objMunzeeInfo.longitude, ( objParams.lat !== objMunzeeInfo.latitude || objParams.lon !== objMunzeeInfo.longitude ? 'and' : 'but' ), ( objMunzeeInfo.deployed ? 'is' : 'is not' ) );

        var strTitle = document.getElementsByTagName( 'title' )[ 0 ];
        var arrTitle = strTitle.innerText.split( ' - ' );

        logMGPC( 1, 'log', 'objParams:\t%o\nobjMunzeeInfo:\t%o', objParams, objMunzeeInfo );
        if ( objMunzeeInfo.correct === 4 ) {
            strTitle.innerText = '100% - ' + arrTitle[ 1 ] + ' - ' + arrTitle[ 0 ];
            alert( 'This pin is 100% correct!' );
        } else if ( !objMunzeeInfo.deployed && objMunzeeInfo.correct === 3 ) {
            strTitle.innerText = '99% - UNDEPLOYED - ' + arrTitle[ 1 ] + ' - ' + arrTitle[ 0 ];
            alert( 'This pin just needs to be deployed!' );
        } else if ( objParams.type !== objMunzeeInfo.type && objMunzeeInfo.correct === 3 ) {
            strTitle.innerText = 'TYPE ERROR! - ' + arrTitle[ 1 ] + ' - ' + arrTitle[ 0 ];
            alert( 'This pin is the wrong type!\n\n' +
                  objMunzeeInfo.type + ( objParams.type === objMunzeeInfo.type ? ' === ' : ' != ' ) + objParams.type + '\n'
                 );
        } else if ( ( ( objParams.lat !== objMunzeeInfo.latitude || objParams.lon !== objMunzeeInfo.longitude ) && objMunzeeInfo.correct === 3 ) ||
                   objParams.lat !== objMunzeeInfo.latitude && objParams.lon !== objMunzeeInfo.longitude && objMunzeeInfo.correct === 2 ) {
            let dblDistanceInMeters = await getDistance( objParams.lat, objParams.lon, objMunzeeInfo.latitude, objMunzeeInfo.longitude );
            let dblBearing = await getBearing( objParams.lat, objParams.lon, objMunzeeInfo.latitude, objMunzeeInfo.longitude );
            let strDirection = await getDirection( dblBearing );
            strTitle.innerText = 'COORDINATE ERROR! - ' + arrTitle[ 1 ] + ' - ' + arrTitle[ 0 ];
            alert( 'This pin is ' + ( Math.round( dblDistanceInMeters * 0.000621371 * 52600 ) / 10 ) + '\' ' + strDirection + ' (' + ( Math.floor( dblDistanceInMeters * 10 ) / 10 ) + 'm @ ' + ( Math.round( dblBearing * 10 ) / 10 ) + '°) of where expected!\n\n' +
                  'expected:\t' + objParams.lat + ', ' + objParams.lon + '\n' +
                  'actual:\t\t' + objMunzeeInfo.latitude + ', ' + objMunzeeInfo.longitude
                 );
        } else {
            let dblDistanceInMeters = await getDistance( objParams.lat, objParams.lon, objMunzeeInfo.latitude, objMunzeeInfo.longitude );
            let dblBearing = await getBearing( objParams.lat, objParams.lon, objMunzeeInfo.latitude, objMunzeeInfo.longitude );
            let strDirection = await getDirection( dblBearing ) + ' (' + ( Math.round( dblBearing * 10 ) / 10 ) + '°)';
            strTitle.innerText = 'ERROR! - ' + ( ( objMunzeeInfo.deployed ? 1 : 0 ) + ( ( objMunzeeInfo.correct - ( objMunzeeInfo.deployed ? 1 : 0 ) ) * 33 ) ) + '% correct - ' + arrTitle[ 1 ] + ' - ' + arrTitle[ 0 ];
            alert( 'There multiple things not right!\n\n' +
                  'Munzee is ' + ( objMunzeeInfo.deployed ? '' : 'not ' ) + 'deployed.\n' +
                  objMunzeeInfo.type + ( objParams.type === objMunzeeInfo.type ? ' === ' : ' != ' ) + objParams.type + '\n' +
                  'expected:\t' + objParams.lat + ', ' + objParams.lon + '\n' +
                  'actual:\t\t' + objMunzeeInfo.latitude + ', ' + objMunzeeInfo.longitude + '\n' +
                  '\t(' + ( Math.floor( dblDistanceInMeters * 10 ) / 10 ) + ' meters (' + ( Math.round( dblDistanceInMeters * 0.000621371 * 52600 ) / 10 ) + ' feet) ' + strDirection + ' off)'
                 );
        }
    }
} )();