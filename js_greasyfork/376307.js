// ==UserScript==
// @name         Zandboxee
// @namespace    none
// @version      2020.04.21.0730
// @description  Want better control of your Munzee sandbox?  Here you go!
// @supportURL   https://Discord.me/TheShoeStore
// @author       technical13
// @match        https://www.munzee.com/map/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376307/Zandboxee.user.js
// @updateURL https://update.greasyfork.org/scripts/376307/Zandboxee.meta.js
// ==/UserScript==
// jshint esversion: 6
/* KNOWN ISSUES LIST
// Munzee's "Quick Deploy" feature may round the least significant digit of the latitude - not an issue with the script
//*/
/* TO-DO LIST
// Add a way to import a .csv file into the sandbox
// Add a way to import/export a sandbox as a .json file into/from the sandbox
// Add a button to quick deploy each pin in the table - without using the actual (buggy) quick deploy function
// Drag and drop reordering of pins
//*/

var isDebug = false;
var intVerbosity = 0;
const ver = '2020.04.21.0730';
const scriptName = 'Zandboxee v' + ver;

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
    } else if ( strParamName === 'sandbox' ) {
        objParams.doSandbox = toBoolean( arrParam[ 1 ] );
    } else if ( strParamName === 'lat' ) {
        objParams.lat = parseFloat( arrParam[ 1 ] );
    } else if ( strParamName === 'lon' ) {
        objParams.lon = parseFloat( arrParam[ 1 ] );
    } else if ( strParamName === 'name' ) {
        objParams.name = decodeURIComponent( arrParam[ 1 ] );
    } else if ( strParamName === 'issand' ) {
        objParams.isSandbox = toBoolean( arrParam[ 1 ] );
    }
} );
if ( objParams.doSandbox && objParams.lat && objParams.lon ) {
    objParams.geohash = window.geohash.encode( objParams.lat, objParams.lon, 9 );
    window.location = 'https://www.munzee.com/map/' + objParams.geohash + '/18?isSand=1&lat=' + objParams.lat + '&lon=' + objParams.lon + ( objParams.name ? '&name=' + objParams.name : '' );
}
log( 2, 'info', 'objParams: %o', objParams );

log( 1, 'warn', 'Debug mode is on with verbosity level: %o', intVerbosity );
log( 1, 'groupCollapsed', 'Verbosity options: (click to expand)' );
log( 1, 'log', '\n\t1) Summary\n\t2) Parameters retrieved from URL\n\t3) Variables set\n\t4) Function returns\n\t9) ALL debugging info and this notice.' );
log( 1, 'groupEnd' );

try {
    var munzeesandboxcounter = parseInt( localStorage.munzeesandboxcounter || 0 );
    var munzeesandbox = JSON.parse( localStorage.munzeesandbox || '[]' );
    if ( munzeesandboxcounter !== munzeesandbox.length ) {
        munzeesandboxcounter = munzeesandbox.length;
        localStorage.setItem( 'munzeesandboxcounter', munzeesandboxcounter );
        log( 1, 'error', 'munzeesandboxcounter failed sanity check!\n\tReset value to: %i', munzeesandboxcounter );
    }
    if ( munzeesandboxcounter > 0 ) {
        log( 3, 'log', 'Sandbox has %i pin%s in it.', munzeesandboxcounter, ( munzeesandboxcounter === 1 ? '' : 's' ) );
    } else {
        log( 3, 'error', 'Sandbox is empty.' );
    }

    function mapChanged() {
        log( 4, 'log', 'mapChanged() updating Add new Munzee placeholder coordinates.' );
        document.getElementById( 'NewMunzeeLat' ).placeholder = window.map.getCenter().lat;
        document.getElementById( 'NewMunzeeLng' ).placeholder = window.map.getCenter().lng;
    }
    function pinMoved( objDragged ) {
        var intPin = 0;
        for ( var pinNode in window.mapSandbox.list ) { if ( objDragged.target._element.isSameNode( window.mapSandbox.list[ pinNode ].marker._element ) ) { intPin = parseInt( pinNode ); } }

        var objUpdatedMunzee = {
            lng: objDragged.target._lngLat.lng,
            lat: objDragged.target._lngLat.lat
        };

        log( 4, 'log', 'pinMoved( %i ) updating munzeesandbox with new coordinates: [ %o, %o ]', intPin, objUpdatedMunzee.lat, objUpdatedMunzee.lng );
        munzeesandbox[ intPin ][ 0 ] = objUpdatedMunzee.lat;
        munzeesandbox[ intPin ][ 1 ] = objUpdatedMunzee.lng;

        log( 4, 'log', 'pinMoved( %i ) updating table row %i with new coordinates: [ %o, %o ]', intPin, ( intPin + 1 ), objUpdatedMunzee.lat, objUpdatedMunzee.lng );
        $( 'input#ZandboxRow-' + ( intPin + 1 ) + '-lat' )[ 0 ].value = objUpdatedMunzee.lat;
        $( 'input#ZandboxRow-' + ( intPin + 1 ) + '-lng' )[ 0 ].value = objUpdatedMunzee.lng;

        log( 4, 'log', 'pinMoved() performing:\n\tFunction.saveSandbox()' );
        Function.saveSandbox();
    }
    Function.prototype.saveSandbox = function () {
        localStorage.setItem( 'munzeesandbox', JSON.stringify( munzeesandbox ) );
        localStorage.setItem( 'munzeesandboxcounter', munzeesandboxcounter );
    }
    function createTableHead() {
        var domZandboxTableHead = document.createElement( 'thead' );
        var domZandBoxTableHeadRow = document.createElement( 'tr' );
        var domZandBoxTableHeadColPin = document.createElement( 'th' );
        var domZandBoxTableHeadColLat = document.createElement( 'th' );
        var domZandBoxTableHeadColLon = document.createElement( 'th' );
        var domZandBoxTableHeadColOwn = document.createElement( 'th' );
        var domZandBoxTableHeadColName = document.createElement( 'th' );
        var domZandBoxTableHeadColId = document.createElement( 'th' );
        var domZandBoxTableHeadColSaveAddRem = document.createElement( 'th' );

        domZandBoxTableHeadColId.className = 'hidden-id';

        domZandBoxTableHeadColPin.style = 'text-align: center !important; width: 50px !important;';
        domZandBoxTableHeadColLat.style = 'text-align: center !important;';
        domZandBoxTableHeadColLon.style = 'text-align: center !important;';
        domZandBoxTableHeadColOwn.style = 'text-align: center !important;';
        domZandBoxTableHeadColName.style = 'text-align: center !important;';
        domZandBoxTableHeadColId.style = 'text-align: center !important; display: none;'
        domZandBoxTableHeadColSaveAddRem.style = 'text-align: center !important;';

        domZandBoxTableHeadColPin.innerText = '#';
        domZandBoxTableHeadColLat.innerText = 'Latitude';
        domZandBoxTableHeadColLon.innerText = 'Longitude';
        domZandBoxTableHeadColOwn.innerText = 'Own';
        domZandBoxTableHeadColName.innerText = 'Name';
        domZandBoxTableHeadColId.innerText = 'ID';
        domZandBoxTableHeadColSaveAddRem.innerHTML = 'Save - Add/Remove';

        domZandBoxTableHeadRow.append( domZandBoxTableHeadColPin );
        domZandBoxTableHeadRow.append( domZandBoxTableHeadColLat );
        domZandBoxTableHeadRow.append( domZandBoxTableHeadColLon );
        domZandBoxTableHeadRow.append( domZandBoxTableHeadColOwn );
        domZandBoxTableHeadRow.append( domZandBoxTableHeadColName );
        domZandBoxTableHeadRow.append( domZandBoxTableHeadColId );
        domZandBoxTableHeadRow.append( domZandBoxTableHeadColSaveAddRem );

        domZandboxTableHead.append( domZandBoxTableHeadRow );

        return domZandboxTableHead;
    }
    Function.prototype.removeTableRow = function ( valId ) {
        var intIndex = -1;
        if ( isNaN( valId ) ) {
            valId = valId.trim();
            intIndex = ( valId === 'ZandboxNewRow' ? ( $( 'table#ZandboxTable tr' ).length - 2 ) : parseInt( valId.replace( 'ZandboxRow-', '' ) ) )
        } else {
            intIndex = parseInt( valId );
        }
        log( 5, 'info', 'Function.prototype.removeTableRow() removing row %i-1 (from %o)', intIndex, valId );
        if ( valId !== 'ZandboxNewRow' ) {
            log( 4, 'log', 'Function.prototype.removeTableRow() updating row indices.' );
            $( 'table#ZandboxTable tr' ).each( function( intRow, domTR ) {
                if ( intRow === intIndex ) {
                    log( 4, 'log', 'Function.prototype.removeTableRow() renaming row %i to ZandboxRemoveRow-%i', intRow, intRow );
                    domTR.id = 'ZandboxRemoveRow-' + intRow;
                } else if ( intRow > intIndex && domTR.id !== 'ZandboxNewRow' ) {
                    log( 4, 'log', 'Function.prototype.removeTableRow() calling Function.updateMunzee( %i )', ( intRow - 1 ) );
                    Function.updateMunzee( intRow - 1 );
                    log( 4, 'log', 'Function.prototype.removeTableRow() renumbering row %i to %i.', intRow, ( intRow - 1 ) );
                    domTR.id = 'ZandboxRow-' + ( intRow - 1 );
                    domTR.cells[ 0 ].innerText = ( intRow - 1 );
                    domTR.cells[ 5 ].children[ 0 ].value = ( intRow - 1 );
                } else if ( domTR.id === 'ZandboxNewRow' ) {
                    log( 4, 'log', 'Function.prototype.removeTableRow() renumbering add munzee row to %i.', ( intRow - 1 ) );
                    domTR.cells[ 0 ].innerText = ( intRow - 1 );
                    domTR.cells[ 5 ].children[ 0 ].placeholder = ( intRow - 2 );
                }
            } );
        } else {
            log( 4, 'log', 'Function.prototype.removeTableRow() renaming ZandboxNewRow to ZandboxRemoveRow.' );
            document.getElementById( 'ZandboxNewRow' ).id = 'ZandboxRemoveRow-' + intIndex;
        }
        log( 4, 'log', 'Function.prototype.removeTableRow() removing row %i (%o) from table.', intIndex, valId );
        $( 'tr#ZandboxRemoveRow-' + intIndex ).remove();
    }
    Function.prototype.createNewMunzeeRow = function () {
        log( 4, 'log', 'Function.prototype.createNewMunzeeRow() creating "Add new Munzee" row for table.' );

        var domZandBoxTableRow = document.createElement( 'tr' );
        var domZandBoxTableRowPin = document.createElement( 'td' );
        var domZandBoxTableRowLat = document.createElement( 'td' );
        var domZandBoxTableRowLon = document.createElement( 'td' );
        var domZandBoxTableRowOwn = document.createElement( 'td' );
        var domZandBoxTableRowName = document.createElement( 'td' );
        var domZandBoxTableRowId = document.createElement( 'td' );
        var domZandBoxTableRowAddClear = document.createElement( 'td' );

        domZandBoxTableRow.id = 'ZandboxNewRow';
        domZandBoxTableRowId.style = 'display: none;';
        domZandBoxTableRowId.className = 'hidden-id';

        var domZandBoxTextPin = document.createTextNode( munzeesandbox.length + 1 );
        var domZandBoxInputLat = document.createElement( 'input' );
        var domZandBoxInputLon = document.createElement( 'input' );
        var domZandBoxInputOwn = document.createElement( 'input' );
        var domZandBoxInputName = document.createElement( 'input' );
        var domZandBoxInputId = document.createElement( 'input' );
        var domZandBoxInputAdd = document.createElement( 'input' );
        var domZandBoxInputClear = document.createElement( 'input' );

        domZandBoxInputLat.type = 'text';
        domZandBoxInputLon.type = 'text';
        domZandBoxInputOwn.type = 'checkbox';
        domZandBoxInputName.type = 'text';
        domZandBoxInputId.type = 'number';
        domZandBoxInputAdd.type = 'button';
        domZandBoxInputClear.type = 'button';

        domZandBoxInputLat.id = 'NewMunzeeLat';
        domZandBoxInputLon.id = 'NewMunzeeLng';
        domZandBoxInputOwn.id = 'NewMunzeeOwn';
        domZandBoxInputName.id = 'NewMunzeeName';
        domZandBoxInputId.id = 'NewMunzeeId';
        domZandBoxInputAdd.id = 'NewMunzeeAdd';
        domZandBoxInputClear.id = 'clearSB';

        domZandBoxInputLat.size = '25';
        domZandBoxInputLon.size = '25';
        domZandBoxInputName.maxlength = '33';
        domZandBoxInputName.size = '35';

        domZandBoxInputLat.style = 'text-align: right;';
        domZandBoxInputLon.style = 'text-align: right;';
        domZandBoxInputName.style = 'text-align: right;';
        domZandBoxInputId.style = 'text-align: center;';
        domZandBoxInputClear.style = 'background-color: #FF6666; font-weight: bold;';

        domZandBoxInputLat.placeholder = window.map.getCenter().lat;
        domZandBoxInputLon.placeholder = window.map.getCenter().lng;
        domZandBoxInputOwn.checked = true;
        domZandBoxInputName.placeholder = 'Quick Deploy by ' + window.username;
        domZandBoxInputId.placeholder = munzeesandbox.length.toString();
        domZandBoxInputAdd.value = 'Add';
        domZandBoxInputAdd.setAttribute( 'onClick', 'Function.addMunzee();');
        domZandBoxInputClear.setAttribute( 'onClick', "if(confirm('Click OK if you are sure you want to clear your sandbox:',false)){Function.clearSandbox();}" );
        domZandBoxInputClear.value = 'Clear';

        domZandBoxTableRowPin.append( domZandBoxTextPin );
        domZandBoxTableRowLat.append( domZandBoxInputLat );
        domZandBoxTableRowLon.append( domZandBoxInputLon );
        domZandBoxTableRowOwn.append( domZandBoxInputOwn );
        domZandBoxTableRowName.append( domZandBoxInputName );
        domZandBoxTableRowId.append( domZandBoxInputId );
        domZandBoxTableRowAddClear.append( domZandBoxInputAdd );
        domZandBoxTableRowAddClear.append( domZandBoxInputClear );

        domZandBoxTableRow.append( domZandBoxTableRowPin );
        domZandBoxTableRow.append( domZandBoxTableRowLat );
        domZandBoxTableRow.append( domZandBoxTableRowLon );
        domZandBoxTableRow.append( domZandBoxTableRowOwn );
        domZandBoxTableRow.append( domZandBoxTableRowName );
        domZandBoxTableRow.append( domZandBoxTableRowId );
        domZandBoxTableRow.append( domZandBoxTableRowAddClear );

        log( 4, 'log', 'Function.prototype.createNewMunzeeRow() returning new row DOM:\n\t%o', domZandBoxTableRow );
        return domZandBoxTableRow;
    }
    Function.prototype.addTableRow = function ( arrSandPin, intIndex ) {
        log( 4, 'log', 'Function.prototype.addTableRow() creating row #%i for table with pin:\n\t%o', ( intIndex + 1 ), arrSandPin );

        var domZandBoxTableRow = document.createElement( 'tr' );
        var domZandBoxTableRowPin = document.createElement( 'td' );
        var domZandBoxTableRowLat = document.createElement( 'td' );
        var domZandBoxTableRowLon = document.createElement( 'td' );
        var domZandBoxTableRowOwn = document.createElement( 'td' );
        var domZandBoxTableRowName = document.createElement( 'td' );
        var domZandBoxTableRowId = document.createElement( 'td' );
        var domZandBoxTableRowSaveRemove = document.createElement( 'td' );

        domZandBoxTableRow.id = 'ZandboxRow-' + ( intIndex + 1 );
        domZandBoxTableRowId.style = 'display: none;';
        domZandBoxTableRowId.className = 'hidden-id';

        var domZandBoxTextPin = document.createTextNode( intIndex + 1 );
        var domZandBoxInputLat = document.createElement( 'input' );
        var domZandBoxInputLon = document.createElement( 'input' );
        var domZandBoxInputOwn = document.createElement( 'input' );
        var domZandBoxInputName = document.createElement( 'input' );
        var domZandBoxInputId = document.createElement( 'input' );
        var domZandBoxInputSave = document.createElement( 'input' );
        var domZandBoxInputRemove = document.createElement( 'input' );

        domZandBoxInputLat.type = 'text';
        domZandBoxInputLon.type = 'text';
        domZandBoxInputOwn.type = 'checkbox';
        domZandBoxInputName.type = 'text';
        domZandBoxInputId.type = 'number';
        domZandBoxInputSave.type = 'button';
        domZandBoxInputRemove.type = 'button';

        domZandBoxInputLat.id = 'ZandboxRow-' + ( intIndex + 1 ) + '-lat';
        domZandBoxInputLon.id = 'ZandboxRow-' + ( intIndex + 1 ) + '-lng';
        domZandBoxInputOwn.id = 'ZandboxRow-' + ( intIndex + 1 ) + '-own';
        domZandBoxInputName.id = 'ZandboxRow-' + ( intIndex + 1 ) + '-name';
        domZandBoxInputId.id = 'ZandboxRow-' + ( intIndex + 1 ) + '-id';

        domZandBoxInputLat.size = '25';
        domZandBoxInputLon.size = '25';
        domZandBoxInputName.maxlength = '33';
        domZandBoxInputName.size = '35';

        domZandBoxInputLat.style = 'text-align: right;';
        domZandBoxInputLon.style = 'text-align: right;';
        domZandBoxInputName.style = 'text-align: right;';
        domZandBoxInputId.style = 'text-align: center;';

        domZandBoxInputLat.setAttribute( 'value', ( arrSandPin[ 0 ] || 0 ) );
        domZandBoxInputLon.setAttribute( 'value', ( arrSandPin[ 1 ] || 0 ) );
        domZandBoxInputOwn.checked = ( arrSandPin[ 2 ] === 1 ? true : false );
        domZandBoxInputName.setAttribute( 'value', ( arrSandPin[ 3 ] || '' ) );
        domZandBoxInputId.setAttribute( 'value', ( arrSandPin[ 4 ] || '' ) );
        domZandBoxInputSave.setAttribute( 'value', 'Save' );
        domZandBoxInputSave.setAttribute( 'onClick', "Function.updateMunzee( parseInt( $( this ).parents( 'tr' ).attr( 'id' ).replace( 'ZandboxRow-', '' ) ) );" );
        domZandBoxInputRemove.setAttribute( 'value', 'Remove' );
        domZandBoxInputRemove.setAttribute( 'onClick', "Function.removeMunzee( parseInt( $( this ).parents( 'tr' ).attr( 'id' ).replace( 'ZandboxRow-', '' ) ) );" );

        domZandBoxTableRowPin.append( domZandBoxTextPin );
        domZandBoxTableRowLat.append( domZandBoxInputLat );
        domZandBoxTableRowLon.append( domZandBoxInputLon );
        domZandBoxTableRowOwn.append( domZandBoxInputOwn );
        domZandBoxTableRowName.append( domZandBoxInputName );
        domZandBoxTableRowId.append( domZandBoxInputId );
        domZandBoxTableRowSaveRemove.append( domZandBoxInputSave );
        domZandBoxTableRowSaveRemove.append( domZandBoxInputRemove );

        domZandBoxTableRow.append( domZandBoxTableRowPin );
        domZandBoxTableRow.append( domZandBoxTableRowLat );
        domZandBoxTableRow.append( domZandBoxTableRowLon );
        domZandBoxTableRow.append( domZandBoxTableRowOwn );
        domZandBoxTableRow.append( domZandBoxTableRowName );
        domZandBoxTableRow.append( domZandBoxTableRowId );
        domZandBoxTableRow.append( domZandBoxTableRowSaveRemove );

        log( 4, 'log', 'Function.prototype.addTableRow() returning new row DOM:\n\t%o', domZandBoxTableRow );
        return domZandBoxTableRow;
    }
    Function.prototype.updateMunzee = function( valId ) {
        var intIndex = ( isNaN( valId ) ? parseInt( valId.replace( 'ZandboxRow-', '' ) ) : valId );
        log( 5, 'info', 'Function.prototype.updateMunzee() updating sandbox item %i-1 (from %o)', intIndex, valId );
        log( 4, 'log', 'Function.prototype.updateMunzee() updating munzee %s', munzeesandbox[ intIndex - 1 ][ 3 ] );

        var objUpdatedMunzee = {
            lng: parseFloat( $( 'input#ZandboxRow-' + intIndex + '-lng' ).val() || window.map.getCenter().lng ),
            lat: parseFloat( $( 'input#ZandboxRow-' + intIndex + '-lat' ).val() || window.map.getCenter().lat ),
            name: ( $( 'input#ZandboxRow-' + intIndex + '-name' ).val() || 'Quick Deploy by " + username + "' ),
            id: ( $( 'input#ZandboxRow-' + intIndex + '-id' ).val() || ( intIndex - 1 ).toString() ),
            own: ( document.getElementById( 'ZandboxRow-' + intIndex + '-own' ).checked ? 1 : 0 )
        };

        log( 4, 'log', 'Function.prototype.updateMunzee() updating marker on map from [ %o, %o ] to [ %o, %o ]',
            window.mapSandbox.list[ ( intIndex - 1 ) ].marker._lngLat.lng, window.mapSandbox.list[ ( intIndex - 1 ) ].marker._lngLat.lat, objUpdatedMunzee.lng, objUpdatedMunzee.lat
           );
        window.mapSandbox.list[ ( intIndex - 1 ) ].marker.setLngLat( [ objUpdatedMunzee.lng, objUpdatedMunzee.lat ] );

        log( 4, 'log', 'Function.prototype.updateMunzee() updating mapSandbox.list[ %i ] (%s)', ( intIndex - 1 ), window.mapSandbox.list[ intIndex - 1 ].title );
        window.mapSandbox.list[ intIndex - 1 ].id = objUpdatedMunzee.id;
        window.mapSandbox.list[ intIndex - 1 ].title = objUpdatedMunzee.name;
        window.mapSandbox.list[ intIndex - 1 ].coordinates[ 0 ] = objUpdatedMunzee.lng;
        window.mapSandbox.list[ intIndex - 1 ].coordinates[ 1 ] = objUpdatedMunzee.lat;
        window.mapSandbox.list[ intIndex - 1 ].myOwn = objUpdatedMunzee.own;
        log( 4, 'info', 'Function.prototype.updateMunzee() updated %i in mapSandbox.list to:\n\t%o', ( intIndex - 1 ), window.mapSandbox.list[ intIndex - 1 ] );

        log( 4, 'log', 'Function.prototype.updateMunzee() performing:\n\tmunzeesandbox[ %i ] = %o', ( intIndex - 1 ), [ objUpdatedMunzee.lng, objUpdatedMunzee.lat, objUpdatedMunzee.own, objUpdatedMunzee.name, objUpdatedMunzee.id ] );
        munzeesandbox[ intIndex - 1 ] = [ objUpdatedMunzee.lat, objUpdatedMunzee.lng, objUpdatedMunzee.own, objUpdatedMunzee.name, objUpdatedMunzee.id ];

        log( 4, 'log', 'Function.prototype.updateMunzee() performing:\n\tFunction.saveSandbox()' );
        Function.saveSandbox();
    }
    Function.prototype.removeMunzee = function ( valId ) {
        var intIndex = ( isNaN( valId ) ? parseInt( valId.replace( 'ZandboxRow-', '' ) ) : valId );
        log( 4, 'log', 'Function.prototype.removeMunzee() removing munzee (%o) %i (%s) from sandbox.', valId, ( intIndex - 1 ), munzeesandbox[ intIndex - 1 ][ 3 ] );

        log( 4, 'log', 'Function.prototype.removeMunzee() removing marker from map' );
        window.mapSandbox.list[ ( intIndex - 1 ) ].marker.remove();

        log( 4, 'log', 'Function.prototype.removeMunzee() splicing %i (%s) from mapSandbox.list', ( intIndex - 1 ), window.mapSandbox.list[ intIndex - 1 ].title );
        window.mapSandbox.list.splice( ( intIndex - 1 ), 1 );
        log( 4, 'info', 'Function.prototype.removeMunzee() spliced %i from mapSandbox.list leaving:\n\t%o', ( intIndex - 1 ), window.mapSandbox.list );

        log( 4, 'log', 'Function.prototype.removeMunzee() splicing %i (%s) from munzeesandbox', ( intIndex - 1 ), munzeesandbox[ intIndex - 1 ][ 3 ] );
        munzeesandbox.splice( ( intIndex - 1 ), 1 );
        log( 4, 'info', 'Function.prototype.removeMunzee() spliced %i from munzeesandbox leaving:\n\t%o', ( intIndex - 1 ), munzeesandbox );

        log( 4, 'info', 'Function.prototype.removeMunzee() decrementing munzeesandboxcounter-- to %i', ( munzeesandboxcounter - 1 ) );
        munzeesandboxcounter--;

        log( 4, 'log', 'Function.prototype.removeMunzee() performing:\n\tFunction.saveSandbox()' );
        Function.saveSandbox();

        log( 4, 'log', 'Function.prototype.removeMunzee() performing:\n\tFunction.removeTableRow( %o )', intIndex );
        Function.removeTableRow( intIndex );
    }
    Function.prototype.addMunzee = function() {
        var objNewMunzee = {
            lng: ( $( 'input#NewMunzeeLng' ).val() || window.map.getCenter().lng ),
            lat: ( $( 'input#NewMunzeeLat' ).val() || window.map.getCenter().lat ),
            name: ( $( 'input#NewMunzeeName' ).val() || 'Quick Deploy by ' + window.username ),
            id: ( $( 'input#NewMunzeeId' ).val() || $( 'input#NewMunzeeId' )[ 0 ].placeholder ),
            own: ( document.getElementById( 'NewMunzeeOwn' ).checked ? 1 : 0 )
        };

        log( 4, 'log', 'Function.prototype.addMunzee() performing:\n\tmapSandbox.addItem( %o, %o, %o )', [ objNewMunzee.lng, objNewMunzee.lat ], objNewMunzee.name, objNewMunzee.own );
        window.mapSandbox.addItem( [ objNewMunzee.lng, objNewMunzee.lat ], objNewMunzee.name, objNewMunzee.own );
        window.mapSandbox.list[ window.mapSandbox.length - 1 ].marker.on( 'dragend', objDragged => pinMoved( objDragged ) );
        log( 2, 'log', 'Created move listener for pin #%i', ( window.mapSandbox.length - 1 ) );
        window.initilSB = 1;

        log( 4, 'log', 'Function.prototype.addMunzee() performing:\n\tmunzeesandbox.push( %o )', [ objNewMunzee.lat, objNewMunzee.lng, objNewMunzee.own, objNewMunzee.name, munzeesandboxcounter.toString() ] );
        munzeesandbox.push( [ objNewMunzee.lat, objNewMunzee.lng, objNewMunzee.own, objNewMunzee.name, munzeesandboxcounter.toString() ] );
        munzeesandboxcounter++;
        log( 4, 'info', 'munzeesandbox now contains:\n%o', munzeesandbox );

        log( 4, 'log', 'Function.prototype.addMunzee() performing:\n\tFunction.removeTableRow( \'%s\' )', 'ZandboxNewRow' );
        Function.removeTableRow( 'ZandboxNewRow' );

        log( 4, 'log', 'Function.prototype.addMunzee() performing:\n\tFunction.addTableRow( %o, %i )', munzeesandbox[ munzeesandboxcounter - 1 ], munzeesandboxcounter - 1 );
        $( 'table#ZandboxTable > tbody' ).append( Function.addTableRow( munzeesandbox[ munzeesandboxcounter - 1 ], munzeesandboxcounter - 1 ) );

        log( 4, 'log', 'Function.prototype.addMunzee() performing:\n\tFunction.createNewMunzeeRow()' );
        $( 'table#ZandboxTable > tbody' ).append( Function.createNewMunzeeRow() );

        if ( isDebug ) {
            $( '.hidden-id' ).show();
        }
        log( 4, 'log', 'Function.prototype.addMunzee() performing:\n\tFunction.saveSandbox()' );
        Function.saveSandbox();
    }
    Function.prototype.clearSandbox = function() {
        log( 4, 'log', 'Function.prototype.clearSandbox clearing localStorage items.' );
        localStorage.removeItem( 'munzeesandboxcounter' );
        localStorage.removeItem( 'munzeesandbox' );

        log( 4, 'log', 'Function.prototype.clearSandbox performing:\n\t$( \'tr#ZandboxNewRow\' ).remove()' );
        $( 'tr#ZandboxNewRow' ).remove();

        log( 4, 'log', 'Function.prototype.clearSandbox clearing table rows.' );
        for ( var i = $( 'table#ZandboxTable > tbody > tr' ).length; i > 0; i-- ) {
            log( 4, 'log', 'Function.prototype.clearSandbox performing:\n\t$( \'tr#ZandboxRow-\' + %i ).remove()', i );
            $( 'tr#ZandboxRow-' + i ).remove();
            log( 4, 'log', 'Function.prototype.removeMunzee() removing marker from map' );
            window.mapSandbox.list[ i - 1 ].marker.remove();
        }

        log( 4, 'log', 'Function.prototype.clearSandbox performing Function.createNewMunzeeRow()' );
        $( 'table#ZandboxTable > tbody' ).append( Function.createNewMunzeeRow() );
    }

    function showSandbox() {
        $( 'div#showsandbox' ).empty();// hide button
        window.mapSandbox = window.initSandbox();// initialize sandbox
        var arrSandBoxMunzee = JSON.parse( localStorage.getItem( 'munzeesandbox' ) );

        // Create move listeners for all existing sandbox pins to update coords with move
        for ( var n in arrSandBoxMunzee ) {
            window.mapSandbox.addItem( [ arrSandBoxMunzee[ n ][ 1 ], arrSandBoxMunzee[ n ][ 0 ] ], arrSandBoxMunzee[ n ][ 3 ], arrSandBoxMunzee[ n ][ 2 ] );
            window.mapSandbox.list[ n ].marker.on( 'dragend', objDragged => pinMoved( objDragged ) );
            log( 2, 'log', 'Created move listener for pin #%i', n );
        }
        $( 'div.panel.panel-default' ).append( domZandboxDiv );// Add table with contents of sandbox

        if ( isDebug ) {
            //Show the hidden column for debugging purposes
            $( '.hidden-id' ).show();
        }

        window.scrollByLines( 10 );// Scroll down a little so people can see the table

        //Update currently location to add a new pin if the map is changed at all
        window.map.on( 'resize', mapChanged ).on( 'touchend', mapChanged ).on( 'dragend', mapChanged ).on( 'zoomend', mapChanged ).on( 'moveend', mapChanged );
    }

    var domZandboxDiv = document.createElement( 'div' );
    domZandboxDiv.id = 'zandbox';
    domZandboxDiv.className = 'panel-footer';
    domZandboxDiv.style = 'text-align: center;';

    var domZandboxTable = document.createElement( 'table' );
    domZandboxTable.id = 'ZandboxTable';
    domZandboxTable.style = 'width: 100%;';

    domZandboxTable.append( createTableHead() );

    var domZandboxTableBody = document.createElement( 'tbody' );

    munzeesandbox.forEach( function( arrSandPin, intIndex, arrSandbox ) {
        domZandboxTableBody.append( Function.addTableRow( arrSandPin, intIndex ) );
    } );

    domZandboxTableBody.append( Function.createNewMunzeeRow() );

    domZandboxTable.append( domZandboxTableBody );
    domZandboxDiv.append( domZandboxTable );

    ( function() {
        'use strict';
        log( 0, 'info', 'Script loaded.' );

        $( 'div#filterboxes label' ).eq( 0 )[ 0 ].childNodes[ 2 ].nodeValue = $( 'div#filterboxes label' ).eq( 0 )[ 0 ].childNodes[ 2 ].nodeValue
            .replace( ' munzees', '' ).replace( 'exclude', 'hide' );// Shorten & clarify `exclude own munzees`
        $( 'div#filterboxes label' ).eq( 1 )[ 0 ].childNodes[ 2 ].nodeValue = $( 'div#filterboxes label' ).eq( 1 )[ 0 ].childNodes[ 2 ].nodeValue
            .replace( ' munzees', '' ).replace( 'exclude', 'hide' );// Shorten & clarify `exclude captured munzees`
        $( 'div#filterboxes label' ).eq( 4 )[ 0 ].childNodes[ 2 ].nodeValue = $( 'div#filterboxes label' ).eq( 4 )[ 0 ].childNodes[ 2 ].nodeValue
            .replace( 'only uncaptured', 'FTC opportunities' );// Clarify `only uncaptured`
        $( 'div#sandbox' ).remove();// We're not going to use the default sandbox buttons anymore.

        $( 'input#showSBbuttons' ).click( function( event ) {
            event.preventDefault();
            showSandbox();
        } );

        if ( objParams.isSandbox ) {
            $( 'input#check_circles' ).click();
            showSandbox();
            $( 'input#NewMunzeeLat' ).val( objParams.lat );
            $( 'input#NewMunzeeLng' ).val( objParams.lon );
            $( 'input#NewMunzeeOwn' ).prop( 'checked', false );
            $( 'input#NewMunzeeName' ).val( objParams.name );
            $( 'input#NewMunzeeAdd' ).click();
        }
    } )();
} catch ( errZandbox ) {
    if ( window.location.pathname.split( '/' )[ 1 ] === 'map' ) { console.error( 'errZandbox: %o', errZandbox ); }
}