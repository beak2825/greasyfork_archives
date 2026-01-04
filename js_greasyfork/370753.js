// ==UserScript==
// @name            Joe's SpeedCalling for Popmundo v2
// @namespace       http://popmundo-diaries.com/
// @Author	    Joe Isaacs CharId #3248185 <joe.isaacs.pm@gmail.com>
// @description     Calls everyone in Popmundo character contact list. Any problems, please contact Joe Isaacs (http://www.popmundo.com/World/Popmundo.aspx/Character/3248185)
// @version         1.0
// @include         https://*.popmundo.com/World/Popmundo.aspx/Character/AddressBook
// @include         https://*.popmundo.com/World/Popmundo.aspx/Interact/Phone/*
// @require         https://greasyfork.org/scripts/10151-spfunctions/code/spFunctions.js
// @require         https://greasyfork.org/scripts/370725-sptranslations2/code/SPTranslations2.js
// @require         https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @grant           GM_info
// @downloadURL https://update.greasyfork.org/scripts/370753/Joe%27s%20SpeedCalling%20for%20Popmundo%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/370753/Joe%27s%20SpeedCalling%20for%20Popmundo%20v2.meta.js
// ==/UserScript==


//jQuery
var jisQuery = jQuery.noConflict();

// Append files array
var _appendJsFiles = [
    "https://greasyfork.org/scripts/10151-spfunctions/code/spFunctions.js",
    "https://greasyfork.org/scripts/370725-sptranslations2/code/SPTranslations2.js"
];
// Translation labels object
var _labels = null;

// Id of the char logged in
var _idMainChar = 0;

// Id of the char currently being interacted with
var _idCurrentChar = 0;

// Id to be used to store values on local storage
var _idStorage = '_GEX_MAIN_ID_';

// Current URL
var _urlCurrent = window.location.href;

// Url to make the calls
var _urlToCall = '/World/Popmundo.aspx/Interact/Phone/';

// Url to mark the page as usable by this script
var _urlToCall_Token = '#toCall';

// Character ID keys
var _keys = [];

// Array with runtimes values
var _valuesRunTime = { };

// Array with stored values
var _valuesStorage = { };

// Default value for callings
var _valueDefault = 24;

// All possible values for calling
var _valueCalls = Array( 9999, 121, 24, 61, 58, 26, 25, 73, 74, 165 );

// ########## AREA: MAIN RUNTIME

// Includes the necessary libraries
appendJsFiles();
getIdMain();
getLabels();

// Handles the code necessary for the addressbook page
if( _urlCurrent.match( /\/World\/Popmundo.aspx\/Character\/AddressBook/g ) ){
    addCallButton();
    loadValues();
    addCallSelects();
}

if( _urlCurrent.match( /.*#toCall[0-9]+/g ) ){
    executeOnPage_Contact();
}


// ########## AREA: FUNCTIONS

// Links an external JS Script to the Popmundo page
function appendJsFiles( urlJavascript )
{
    for( i = 0; i < _appendJsFiles.length; i++ ){
        var script = document.createElement( "script" );
        script.type = "text/javascript";
        script.src = _appendJsFiles[i];
        jisQuery( "head" ).append( script );
    }
}

// Loads the correct labels according to the language in use
function getLabels()
{
    var tmpValue = jisQuery( '#ctl00_ctl05_ucMenu_lnkStart' ).text().toLowerCase();
    _labels = spGetTranslations( tmpValue );
}

// Gets the ID of the logged char and sets the storage ID
function getIdMain()
{
    _idMainChar = jisQuery( '.idHolder' ).first().html();
    _idStorage += _idMainChar;
}

// Returns the character ID based on the link URI
function getIdFromUrl( urlValue )
{
    var urlItems = urlValue.split( '/' );
    return urlItems[urlItems.length - 1];
}

// Adds the button to make the calls
function addCallButton()
{
    var objTr = document.createElement( "tr" );

    var objTd = document.createElement( "td" );
    objTd.setAttribute( "colspan", 8 );
    objTr.appendChild( objTd );

    var objButton = document.createElement( "input" );
    objButton.type = "button";
    objButton.value = _labels.call_everyone;
    objButton.setAttribute( "onclick", "spCallEveryone('" + _idStorage + "')" );
    objTd.appendChild( objButton );

    var objLabel = document.createElement( "label" );
    objLabel.style = "cursor:pointer";
    objLabel.setAttribute( "onclick", "spContactAuthor()" );
    objLabel.innerHTML = "<b>&nbsp;&nbsp;&nbsp;Joe's SpeedCalling for Popmundo</b>";
    objTd.appendChild( objLabel );
    jisQuery( objTr ).insertAfter( 'thead' );
}

// Finds all character IDs
function getKeys()
{
    //Loads all current contacts (existant in the links)
    jisQuery( "a[id^='ctl00_cphLeftColumn_ctl00_repAddressBook_ctl'][id$=_lnkCharacter]" )
        .each( function()
        {
            var tmpValue = getIdFromUrl( jisQuery( this ).attr( 'href' ) );
            _keys.push( tmpValue );
        } );
}

//Loads all contact entries values into memory and updates localStorage
function loadValues()
{
    
    getKeys();
    
    //Loads all current contacts (existant in the links)
    for( i = 0; i < _keys.length; i++ ){
        _valuesRunTime[ _keys[ i ] ] = _valueDefault;
    }

    //Updates the localStorage if not present
    if( window.localStorage.getItem( _idStorage ) === null ){
        window.localStorage.setItem( _idStorage, JSON.stringify( _valuesRunTime ) );
        _valuesStorage = _valuesRunTime;
    } else{
        _valuesStorage = JSON.parse( window.localStorage.getItem( _idStorage ) );
    }

    //Loads stored values into runtime values
    for( i = 0; i < _keys.length; i++ ){
        if( typeof ( _valuesStorage[ _keys[ i ] ] ) !== 'undefined' ){
            _valuesRunTime[ _keys[ i ] ] = _valuesStorage[ _keys[ i ] ];
        }
    }

    //Saves the localStorage
    window.localStorage.setItem( _idStorage, JSON.stringify( _valuesRunTime ) );

}

// Returns the combobox ID based on contact ID
function getCallSelect( )
{
    var objSelect = document.createElement( "select" );
    objSelect.id = 'gex_CharId_' + _idMainChar + '_ContId_' + _idCurrentChar;
    objSelect.name = objSelect.id;
    objSelect.setAttribute( "onchange", "spStoreValue( '" + _idStorage + "', '" + _idCurrentChar + "', '" + objSelect.id + "' )" );
    objSelect.style = "display:block";
    
    // Goes trough all possible values and creates the options
    for( var i = 0; i < _valueCalls.length; i++ ){
        var objOption = document.createElement( "option" );
        objOption.value = _valueCalls[i];
        objOption.text = _labels[ _valueCalls[i] ];

        if( _valuesRunTime[_idCurrentChar] == _valueCalls[i] ){
            objOption.setAttribute( "selected", "selected" );
        }

        objSelect.appendChild( objOption );
    }

    return objSelect;
}

//Creates the selects to be used with the contacts
function addCallSelects()
{
    jisQuery( "a[id^='ctl00_cphLeftColumn_ctl00_repAddressBook_ctl'][id$=_lnkCharacter]" )
        .each( function()
        {

            var objId = jisQuery( this ).attr( 'id' );
            _idCurrentChar = getIdFromUrl( jisQuery( this ).attr( 'href' ) );
            jisQuery( this ).attr( 'href', _urlToCall + _idCurrentChar + _urlToCall_Token + _idMainChar );
            jisQuery( this ).attr( 'target', '_BLANK' );
            var objSelect = getCallSelect();
            jisQuery( objSelect ).insertAfter( "a[id^='" + objId + "']" );

        } );
}

// Makes the call
function executeOnPage_Contact()
{
    //Exits if not to be used by this script
    var tmpLocation = window.location.href;

    //Gets current char Id
    tmpIdCurrentChar = jisQuery( '.idHolder' ).eq( 1 ).html();

    //Calls current char if activated
    var tmpAction = 9999;
    jisQuery( "select[id='ctl00_cphTopColumn_ctl00_ddlInteractionTypes']" )
        .each( function()
        {
            _valuesStorage = JSON.parse( window.localStorage.getItem( _idStorage ) );
            tmpAction = _valuesStorage[tmpIdCurrentChar];
        } );

    //Don't call if set to not to call
    if( tmpAction === 9999 )
        return;

    //Changes the select to the right value
    jisQuery( "select option:selected" ).attr( "selected", false );
    jisQuery( "select option[value='" + tmpAction + "']" ).attr( "selected", true );
    jisQuery( "#ctl00_cphTopColumn_ctl00_btnInteract" ).click();
}
