// ==UserScript==
// @author      Zachary Seeley
// @name        Polygon Script Mac Testing
// @namespace   http://www.jedatasolutions.com/
// @description Provides shortcuts for working in Factual tasks.
// @require     http://code.jquery.com/jquery-latest.min.js
// @match       https://work4.factual.com/*
// @match       http://www.radioshack.com/storeLocator3/*
// @match       http://www.verizonwireless.com/b2c/dispatcher?*
// @match       http://www.dollartree.com/custserv/locate_store.cmd*
// @match       http://www.exxonmobilstations.com/*
// @match       http://www.chevronwithtechron.com/findastation.aspx*
// @match       http://www.phillips66gas.com/locations.aspx*
// @match       http://restaurants.quiznos.com/*
// @match       http://www.truevalue.com/store_locator.jsp*
// @match       http://www.circlek.com/store-locator*
// @match       http://www.sherwin-williams.com/store-locator/*
// @match       https://www.wellsfargo.com/locator/*
// @match       https://apps.pnc.com/locator/*
// @match       https://www.usbank.com/locations/*
// @match       http://maps.capitalone.com/locator/*
// @match       http://www.att.com/maps/*
// @match       http://www.jambajuice.com/find-a-store*
// @match       http://www.rue21.com/store/*
// @match       https://www.edwardjones.com/*
// @match       http://www.chrysler.com/en/find-dealer/*
// @match       http://www.gmc.com/gmc-dealers.html*
// @match       http://www.elpolloloco.com/locations/*
// @match       https://www.pandaexpress.com/company/*
// @match       https://www.gosunoco.com/gas-station-locator/*
// @exclude     https://www.gosunoco.com/gas-station-locator/search-results/
// @match       http://www.urbanspoon.com/*
// @match       https://work4.factual.com/robots.txt?url=*
// @match       http://www.yelp.com/*
// @match       https://foursquare.com/*
// @match       http://www.citysearch.com/*
// @match       http://www.bing.com/maps/*
// @copyright   © 2014, J&E Data Solutions
// @version     1.3.1
// @downloadURL https://update.greasyfork.org/scripts/2845/Polygon%20Script%20Mac%20Testing.user.js
// @updateURL https://update.greasyfork.org/scripts/2845/Polygon%20Script%20Mac%20Testing.meta.js
// ==/UserScript==

var jQueryLatest = $.noConflict(true);
/*global jQueryLatest:false, console:false, alert:false*/
"use strict";

/* Delay Variable */
var customDelay = 1;

/* Global Variables */
var urlCheck,
    pageCheck,
    tasksCheck,
    checkForComplete,
    tempURL,
    currentPT2,

    myTimerCount,
    myTimer2Count,
    myVar,
    myVar2,
    autoZoomFlag = true,

    detailsDiv,
    helpDiv,

    cursorImage,
    mirrorFlag = false,
    mirrorColorFlag = 1,
    mirrorZoom = 1,

    xOffset,
    xOffsetManual = 0,
    yOffsetManual = 0,
    currentMouseXPos,
    currentMouseYPos,
    currentWindowDivider,

    mapToggle = 1,

    companyName,
    companyAddress,
    companyLocality,
    companyRegion,
    companyPostcode,

    buildingButton,
    areaButton,
    polygonButton,
    cancelButton,
    deleteButton;

/* Main Logic */
jQueryLatest( document ).ready( function() {

    /* Determine if we're on Factual website or Locator website */
    pageCheck = location.hostname;

    if ( pageCheck == 'work4.factual.com' ) {
        factualInit();
    } else {
        locatorInit();
    }
} );

function factualInit() {
    /* Determine if we're on task page or task list page */
    var urlCheck = location.pathname,
        tasksCheck = urlCheck.indexOf( 'tasks' ),
        tasksCheck2 = urlCheck.indexOf( 'robots' );

    if ( tasksCheck == -1 && jQueryLatest( 'p:contains(Polygons)' ).text() ) {
        taskListPageInit();
    } else if ( tasksCheck == -1 && jQueryLatest( 'h1:contains("Top Records")' ).text() ) {
        //Do nothing, Top Record list.
        console.log( 'Polygons script deactivated on Top Records list page' );
    } else if ( tasksCheck2 == -1 && jQueryLatest( 'h5:contains(Top Records)' ).text() ) {
        //Do nothing, Top Record task.
        console.log( 'Polygons script deactivated on Top Records task page' );
    } else if ( tasksCheck2 == -1 ) {
        setTimeout( function() {
            taskPageInit();      
        }, customDelay );
        
    } else {
        robotPageInit();
    }
}

function robotPageInit() {
    var srcCheck = ( window.location.href ).split( 'src=' )[ 1 ].slice( 0, 4 );
    if ( srcCheck == 'Bing' ) {
        var localURLVariable = ( window.location.href ).split( 'url=' )[ 1 ];
        localStorage.setItem( 'BingURL', localURLVariable );
        window.close();
    } else if ( srcCheck == 'Loca' ) {
        currentPT2 = ( window.location.href ).split( "=" );
        tempURL = currentPT2[ 1 ];
        localStorage.setItem( 'NotOnLocator', tempURL );
        window.close();
    }
}

function locatorInit() {
    console.log( pageCheck );
    if ( pageCheck == 'www.bing.com' ) {
        document.addEventListener( "keydown", elBing, false );
    } else if ( pageCheck == 'www.radioshack.com' ) {
        currentPT2 = ( window.location.href ).split( "origin=" );
        jQueryLatest( '#store-search-zip' ).val( currentPT2[1] );
        jQueryLatest( '#store-search-submit' )[0].click();
        document.addEventListener( 'keydown', elLocator, false );
    } else if ( pageCheck == 'www.verizonwireless.com' ) {
        document.addEventListener( 'keydown', elLocator, false );
    } else if ( pageCheck == 'www.dollartree.com' ) {
        currentPT2 = ( window.location.href ).split( "origin=" );
        if ( currentPT2.length > 1 ) {
            jQueryLatest( 'input.textButtAlign' ).val( currentPT2[1] );
            jQueryLatest( 'input[value="25"]' )[0].click();
            setTimeout( function() {
                jQueryLatest( 'button[type="submit"]' )[1].click();
            }, 1000 );
        }
        document.addEventListener( 'keydown', elLocator, false );
    } else if ( pageCheck == 'www.exxonmobilstations.com' ) {
        currentPT2 = ( window.location.href ).split( "origin=" );
        if ( currentPT2.length > 1 ) {
            jQueryLatest( '#search-input' ).val( currentPT2[1] );
            jQueryLatest( '#parent-id-2093' )[0].click();
        }
        document.addEventListener( 'keydown', elLocator, false );
    } else if ( pageCheck == 'www.chevronwithtechron.com' ) {
        currentPT2 = ( window.location.href ).split( "origin=" );
        if ( currentPT2.length > 1 ) {
            jQueryLatest( '#search' ).val( currentPT2[1] );
            jQueryLatest( '#ctl00_ContentPlaceHolder1_CVXStationSearch' ).click();
        }
        document.addEventListener( 'keydown', elLocator, false );
    } else if ( pageCheck == 'www.phillips66gas.com' ) {
        currentPT2 = ( window.location.href ).split( "origin=" );
        if ( currentPT2.length > 1 ) {
            jQueryLatest( '#station_zipcode' ).val( currentPT2[1] );
            jQueryLatest('#station_distance>option:eq(2)').prop('selected', true);
            jQueryLatest( 'div.input-button.replace-black' ).click();
        }
        document.addEventListener( 'keydown', elLocator, false );
    } else if ( pageCheck == 'restaurants.quiznos.com' ) {
        currentPT2 = ( window.location.href ).split( "origin=" );
        jQueryLatest( '#locator' ).val( currentPT2[1] );
        jQueryLatest( '#locator' ).submit();
        document.addEventListener( 'keydown', elLocator, false );
    } else if ( pageCheck == 'www.truevalue.com' ) {
        document.addEventListener( 'keydown', elLocator, false );
    } else if ( pageCheck == 'www.sherwin-williams.com' ) {
        document.addEventListener( 'keydown', elLocator, false );
    } else if ( pageCheck == 'www.wellsfargo.com' ) {
        document.addEventListener( 'keydown', elLocator, false );
    } else if ( pageCheck == 'www.usbank.com' ) {
        document.addEventListener( 'keydown', elLocator, false );
    } else if ( pageCheck == 'maps.capitalone.com' ) {
        document.addEventListener( 'keydown', elLocator, false );
    } else if ( pageCheck == 'maps.edwardjones.com' ) {
        document.addEventListener( 'keydown', elLocator, false );
    } else if ( pageCheck == 'http://www.gmc.com/' ) {
        document.addEventListener( 'keydown', elLocator, false );
    } else if ( pageCheck == 'www.att.com' ) {
        currentPT2 = ( window.location.href ).split( "origin=" );
        setTimeout( function() {
            jQueryLatest( '#searchTxt' ).val( currentPT2[1] );
            jQueryLatest( '#searchBtn' )[0].click();
        }, 3000 );
        document.addEventListener( 'keydown', elLocator, false );
    } else if ( pageCheck == 'www.jambajuice.com' ) {
        currentPT2 = ( window.location.href ).split( "origin=" );
        setTimeout( function() {
            jQueryLatest( '#location' ).val( currentPT2[1] );
            jQueryLatest( 'input[value="Find Store"]' )[0].click();
        }, 1000 );
        document.addEventListener( 'keydown', elLocator, false );
    } else if ( pageCheck == 'www.rue21.com' ) {
        currentPT2 = ( window.location.href ).split( "origin=" );
        setTimeout( function() {
            jQueryLatest( '#locationZip' ).val( currentPT2[1] );
            jQueryLatest( 'a:contains("GO!")' )[0].click();
        }, 1000 );
        document.addEventListener( 'keydown', elLocator, false );
    } else if ( pageCheck == 'www.chrysler.com' ) {
        currentPT2 = ( window.location.href ).split( "origin=" );
        setTimeout( function() {
            jQueryLatest( 'input[data-lid="search_text"]' ).val( currentPT2[1] );
            jQueryLatest( 'a[data-lid="search_button"]' )[0].click();
        }, 1000 );
        document.addEventListener( 'keydown', elLocator, false );
    } else if ( pageCheck == 'www.elpolloloco.com' ) {
        currentPT2 = ( window.location.href ).split( "origin=" );
        setTimeout( function() {
            jQueryLatest( '#locationSearchBox' ).val( currentPT2[1] );
            jQueryLatest( '#locationSearchBtn' )[0].click();
        }, 1000 );
        document.addEventListener( 'keydown', elLocator, false );
    } else if ( pageCheck == 'www.pandaexpress.com' ) {
        currentPT2 = ( window.location.href ).split( "origin=" );
        setTimeout( function() {
            jQueryLatest( '#search-box' ).val( currentPT2[1] );
            jQueryLatest( '#search-go' )[0].click();
        }, 1000 );
        document.addEventListener( 'keydown', elLocator, false );
    } else if ( pageCheck == 'www.gosunoco.com' ) {
        currentPT2 = ( window.location.href ).split( "origin=" );
        setTimeout( function() {
            jQueryLatest( '#location' ).val( currentPT2[1] );
            jQueryLatest('#distance_max>option:eq(2)').prop('selected', true);
            jQueryLatest( '#search' )[0].click();
        }, 1000 );
        document.addEventListener( 'keydown', elLocator, false );
    } else if ( pageCheck == 'www.circlek.com' ) {
        currentPT2 = ( window.location.href ).split( "state=" );
        var currentPT2a = ( currentPT2[1] ).split( "&origin=" );
        var stateName = jQueryLatest('a[href="'+currentPT2a[0]+'"]').text().trim();
        jQueryLatest('a:contains("Select one...")').text('"'+stateName+'"');
        jQueryLatest( '#zip' ).val( currentPT2a[1] );
        jQueryLatest( '#zip' ).submit();
        document.addEventListener( 'keydown', elLocator, false );
    } else if ( pageCheck == 'www.urbanspoon.com' || pageCheck == 'foursquare.com' || pageCheck == 'www.yelp.com' || pageCheck == 'www.citysearch.com' ) {
        document.addEventListener( "keydown", elUS, false );
    }
}
location
function elBing( i ) {
    if ( i.keyCode == 52 ) { //4: Send Bing Variable
        window.open( 'https://work4.factual.com/robots.txt?src=Bing&url=' + window.location, '_blank' );
    }
}

function elLocator( i ) {
    if ( i.keyCode == 53 ) { //5: Send errorr variable
        window.open( 'https://work4.factual.com/robots.txt?src=Locator&url=' + window.location, '_blank' );
    }
    if ( i.keyCode == 71 ) { //G: Search for lease plan
        var textTemp = "";
        if (window.getSelection) {
            textTemp = window.getSelection().toString();
        }
        window.open( 'https://www.google.com/search?q=' + textTemp + '+ leasing plan', 'gsearch' );
    }
}

function elUS( i ) {
    if ( i.keyCode == 49 ) { //1: Send errorr variable
        window.open( 'https://work4.factual.com/robots.txt?src=Closed&url=' + window.location, '_blank' );
    }
}

function showUserSettings() {
    /* User Setting Checkboxes */
    var userSettingsDiv = document.createElement( "DIV" ),
        autoAcceptInput = document.createElement( "INPUT" ),
        autoZoomInput = document.createElement( "INPUT" ),
        autoGoogleInput = document.createElement( "INPUT" ),
        autoLocatorInput = document.createElement( "INPUT" ),
        currentStoreSelect = document.createElement( "select" );

    var store45 = new Option();
    store45.value = 'JambaJuice';
    store45.text = 'Jamba Juice';
    currentStoreSelect.options.add( store45 );
    var store46 = new Option();
    store46.value = 'EdwardJones';
    store46.text = 'Edward Jones';
    currentStoreSelect.options.add( store46 );
    var store47 = new Option();
    store47.value = 'Rue21';
    store47.text = 'Rue21';
    currentStoreSelect.options.add( store47 );
    var store48 = new Option();
    store48.value = 'Chrysler';
    store48.text = 'Chrysler';
    currentStoreSelect.options.add( store48 );
    var store49 = new Option();
    store49.value = 'GMC';
    store49.text = 'GMC';
    currentStoreSelect.options.add( store49 );
    var store50 = new Option();
    store50.value = 'CiCis';
    store50.text = 'CiCis';
    currentStoreSelect.options.add( store50 );
    var store51 = new Option();
    store51.value = 'CrackerBarrel';
    store51.text = 'Cracker Barrel';
    currentStoreSelect.options.add( store51 );
    var store52 = new Option();
    store52.value = 'ElPolloLoco';
    store52.text = 'El Pollo Loco';
    currentStoreSelect.options.add( store52 );
    var store53 = new Option();
    store53.value = 'PandaExpress';
    store53.text = 'Panda Express';
    currentStoreSelect.options.add( store53 );
    var store54 = new Option();
    store54.value = 'Sunoco';
    store54.text = 'Sunoco';
    currentStoreSelect.options.add( store54 );

    userSettingsDiv.setAttribute( 'class', 'userSettingsDiv' );
    userSettingsDiv.setAttribute( 'style', 'position: absolute; top: 0px; left: 10px; z-index: 1010; width: 300px; height: 50px; background-color: #f8f8f8' );

    autoAcceptInput.setAttribute( 'id', 'autoAcceptInput' );
    autoAcceptInput.type = "checkbox";
    autoAcceptInput.setAttribute( 'style', 'position: relative; z-index: 2011;' );

    autoZoomInput.setAttribute( 'id', 'autoZoomInput' );
    autoZoomInput.type = "checkbox";
    autoZoomInput.setAttribute( 'style', 'z-index: 2011;' );

    autoGoogleInput.setAttribute( 'id', 'autoGoogleInput' );
    autoGoogleInput.type = "checkbox";
    autoGoogleInput.setAttribute( 'style', 'z-index: 2011;' );

    autoLocatorInput.setAttribute( 'id', 'autoLocatorInput' );
    autoLocatorInput.type = "checkbox";
    autoLocatorInput.setAttribute( 'style', 'z-index: 2011;' );

    currentStoreSelect.setAttribute( 'id', 'currentStoreSelect' );



    if ( localStorage.getItem( "autoAcceptInputSetting" ) == 'true' ) {
        autoAcceptInput.checked = true;
    } else {
        autoAcceptInput.checked = false;
    }

    if ( localStorage.getItem( "autoZoomInputSetting" ) == 'true' ) {
        autoZoomInput.checked = true;
    } else {
        autoZoomInput.checked = false;
    }

    if ( localStorage.getItem( "autoGoogleInputSetting" ) == 'true' ) {
        autoGoogleInput.checked = true;
    } else {
        autoGoogleInput.checked = false;
    }

    if ( localStorage.getItem( "autoLocatorInputSetting" ) == 'true' ) {
        autoLocatorInput.checked = true;
    } else {
        autoLocatorInput.checked = false;
    }

    jQueryLatest( 'body' ).append( userSettingsDiv );
    jQueryLatest( '.userSettingsDiv' ).append( autoAcceptInput );
    jQueryLatest( '.userSettingsDiv' ).append( document.createTextNode( ' - Grind ' ) );
    jQueryLatest( '.userSettingsDiv' ).append( autoGoogleInput );
    jQueryLatest( '.userSettingsDiv' ).append( document.createTextNode( ' - Google ' ) );
    jQueryLatest( '.userSettingsDiv' ).append( currentStoreSelect );
    jQueryLatest( '.userSettingsDiv' ).append( document.createElement( 'br' ) );
    jQueryLatest( '.userSettingsDiv' ).append( autoZoomInput );
    jQueryLatest( '.userSettingsDiv' ).append( document.createTextNode( ' - Zoom ' ) );
    jQueryLatest( 'div.userSettingsDiv' ).append( autoLocatorInput );
    jQueryLatest( '.userSettingsDiv' ).append( document.createTextNode( ' - Locator ' ) );
    jQueryLatest( '#currentStoreSelect' ).val( localStorage.getItem( 'currentStoreSelectSetting' ) );
}

function taskListPageInit() {
    
    showUserSettings();
    
    jQueryLatest( "#autoAcceptInput" ).change( function() {
        var settingsCheck = localStorage.getItem( "autoAcceptInputSetting" );
        if ( settingsCheck == 'true' ) {
            localStorage.setItem( "autoAcceptInputSetting", "false" );
        } else {
            localStorage.setItem( "autoAcceptInputSetting", "true" );
        }
    } );
    jQueryLatest( "#autoZoomInput" ).change( function() {
        var settingsCheck = localStorage.getItem( "autoZoomInputSetting" );
        if ( settingsCheck == 'true' ) {
            localStorage.setItem( "autoZoomInputSetting", "false" );
        } else {
            localStorage.setItem( "autoZoomInputSetting", "true" );
        }
    } );
    jQueryLatest( "#autoGoogleInput" ).change( function() {
        var settingsCheck = localStorage.getItem( "autoGoogleInputSetting" );
        if ( settingsCheck == 'true' ) {
            localStorage.setItem( "autoGoogleInputSetting", "false" );
        } else {
            localStorage.setItem( "autoGoogleInputSetting", "true" );
        }
    } );
    jQueryLatest( "#autoLocatorInput" ).change( function() {
        var settingsCheck = localStorage.getItem( "autoLocatorInputSetting" );
        if ( settingsCheck == 'true' ) {
            localStorage.setItem( "autoLocatorInputSetting", "false" );
        } else {
            localStorage.setItem( "autoLocatorInputSetting", "true" );
        }
    } );
    jQueryLatest( "#currentStoreSelect" ).change( function() {
        jQueryLatest( "#currentStoreSelect option:selected" ).each( function() {
            localStorage.setItem( "currentStoreSelectSetting", jQueryLatest( this ).val() );
        } );
    } );

    if ( localStorage.getItem( 'autoReviewInputSetting' ) == 'true' ) {
        //Do nothing, review mode is on.
    } else if ( localStorage.getItem( "autoAcceptInputSetting" ) == 'true' ) {
        if ( jQueryLatest( 'a:contains(work!)' ).text() ) {
            jQueryLatest( 'a:contains(work!)' )[ 0 ].click();
        }
    }
}

function taskPageInit() { 
    
    
    //leaflet-marker-icon//Blue Marker img class
    jQueryLatest( 'img.leaflet-marker-icon' ).css('opacity','0.4');
    var latLongCheck = jQueryLatest( 'input[name="latitude"]' ).attr( 'data-raw' );

    jQueryLatest( '.map-notes' ).attr( 'style', 'position:relative; margin-left: 200px; z-index:3000; width: 200px;' );
    
    jQueryLatest( 'span:contains("Cannot find the correct place")' ).click( function() {
        var problemCheck = jQueryLatest( '.label-info:contains("Cannot find the correct place")' ).text().trim();
        if ( jQueryLatest( this ).text() == "Cannot find the correct place" && problemCheck ) {
            jQueryLatest( '.btn.btn-primary:contains("Report")' ).css( 'background-color', '#B13232' );
            jQueryLatest( '.btn.btn-primary:contains("Report")' ).css( 'border-color', '#BD3535' );
            jQueryLatest( '.btn.btn-primary:contains("Report")' ).text( 'ESCALATE FIRST' );//.attr( 'style', 'display: none;' );
            jQueryLatest( 'textarea[placeholder="Additional Comments:"]' ).attr( 'placeholder', 'Comment Required!' );
        } else if ( jQueryLatest( this ).text() == "Cannot find the correct place" && !problemCheck ) {
            jQueryLatest( '.btn.btn-primary:contains("COMMENT REQUIRED")' ).css( 'background-color', '#428bca' );
            jQueryLatest( '.btn.btn-primary:contains("COMMENT REQUIRED")' ).css( 'border-color', '#357ebd' );
            jQueryLatest( '.btn.btn-primary:contains("COMMENT REQUIRED")' ).text( 'Report' );//.attr( 'style', 'display: visible;' );
            jQueryLatest( 'textarea[placeholder="Comment Required!"]' ).attr( 'placeholder', 'Additional Comments:' );
        }
    } );
    
    jQueryLatest( 'span:contains("Place has closed")' ).click( function() {
        var problemCheck = jQueryLatest( '.label-info:contains("Place has closed")' ).text().trim();
        if ( jQueryLatest( this ).text() == "Place has closed" && problemCheck ) {
            jQueryLatest( '.btn.btn-primary:contains("Report")' ).css( 'background-color', '#B13232' );
            jQueryLatest( '.btn.btn-primary:contains("Report")' ).css( 'border-color', '#BD3535' );
            jQueryLatest( '.btn.btn-primary:contains("Report")' ).text( 'COMMENT REQUIRED' );//.attr( 'style', 'display: none;' );
            jQueryLatest( 'textarea[placeholder="Additional Comments:"]' ).attr( 'placeholder', 'Comment Required!' );
        } else if ( jQueryLatest( this ).text() == "Place has closed" && !problemCheck ) {
            jQueryLatest( '.btn.btn-primary:contains("COMMENT REQUIRED")' ).css( 'background-color', '#428bca' );
            jQueryLatest( '.btn.btn-primary:contains("COMMENT REQUIRED")' ).css( 'border-color', '#357ebd' );
            jQueryLatest( '.btn.btn-primary:contains("COMMENT REQUIRED")' ).text( 'Report' );//.attr( 'style', 'display: visible;' );
            jQueryLatest( 'textarea[placeholder="Comment Required!"]' ).attr( 'placeholder', 'Additional Comments:' );
        }
    } );
    
    jQueryLatest( 'span:contains("Name has changed")' ).click( function() {
        var problemCheck = jQueryLatest( '.label-info:contains("Name has changed")' ).text().trim();
        if ( jQueryLatest( this ).text() == "Name has changed" && problemCheck ) {
            jQueryLatest( '.btn.btn-primary:contains("Report")' ).css( 'background-color', '#B13232' );
            jQueryLatest( '.btn.btn-primary:contains("Report")' ).css( 'border-color', '#BD3535' );
            jQueryLatest( '.btn.btn-primary:contains("Report")' ).text( 'COMMENT REQUIRED' );//.attr( 'style', 'display: none;' );
            jQueryLatest( 'textarea[placeholder="Additional Comments:"]' ).attr( 'placeholder', 'Comment Required!' );
        } else if ( jQueryLatest( this ).text() == "Name has changed" && !problemCheck ) {
            jQueryLatest( '.btn.btn-primary:contains("COMMENT REQUIRED")' ).css( 'background-color', '#428bca' );
            jQueryLatest( '.btn.btn-primary:contains("COMMENT REQUIRED")' ).css( 'border-color', '#357ebd' );
            jQueryLatest( '.btn.btn-primary:contains("COMMENT REQUIRED")' ).text( 'Report' );//.attr( 'style', 'display: visible;' );
            jQueryLatest( 'textarea[placeholder="Comment Required!"]' ).attr( 'placeholder', 'Additional Comments:' );
        }
    } );
    
    checkForUpdateMessage();

    document.title = 'work4 record';
    localStorage.removeItem( "ClosedURL" );
    localStorage.removeItem( 'BingURL' );
    localStorage.removeItem( "NotOnLocator" );

    companyName = jQueryLatest( 'div.address-vals' ).children().eq( 0 ).text();
    companyAddress = jQueryLatest( 'div.address-vals' ).children().eq( 1 ).text();
    companyLocality = jQueryLatest( 'div.address-vals' ).children().eq( 2 ).text();
    companyRegion = jQueryLatest( 'div.address-vals' ).children().eq( 3 ).text();
    companyPostcode = jQueryLatest( 'div.address-vals' ).children().eq( 4 ).text();

    jQueryLatest( 'html' ).css( 'height', '100%' );
    jQueryLatest( 'body' ).css( 'height', '100%' );

    /* Setup Workspace */
    jQueryLatest( 'div.googlemap.metadata' ).attr( 'class', 'googlemap' );
    jQueryLatest( 'div.toggler.metadata' ).css( 'height', '0px' );
    jQueryLatest( 'div.googlemap.googlemap' ).css( 'height', '0px' );
    jQueryLatest( 'div.panel.googlemap' ).css( 'height', '100%' ).css( 'margin-top', '-30px' );
    jQueryLatest( '#sidebar' ).attr( 'style', 'display: block; width: 50%;' );
    jQueryLatest( 'div.toggler.metadata' )[ 0 ].click();
    jQueryLatest( 'div.toggler.metadata' )[ 0 ].click();

    showUserSettings();

    jQueryLatest( "#autoAcceptInput" ).change( function() {
        var settingsCheck = localStorage.getItem( "autoAcceptInputSetting" );
        if ( settingsCheck == 'true' ) {
            localStorage.setItem( "autoAcceptInputSetting", "false" );
        } else {
            localStorage.setItem( "autoAcceptInputSetting", "true" );
        }
    } );
    jQueryLatest( "#autoZoomInput" ).change( function() {
        var settingsCheck = localStorage.getItem( "autoZoomInputSetting" );
        if ( settingsCheck == 'true' ) {
            localStorage.setItem( "autoZoomInputSetting", "false" );
        } else {
            localStorage.setItem( "autoZoomInputSetting", "true" );
        }
    } );
    jQueryLatest( "#autoGoogleInput" ).change( function() {
        var settingsCheck = localStorage.getItem( "autoGoogleInputSetting" );
        if ( settingsCheck == 'true' ) {
            localStorage.setItem( "autoGoogleInputSetting", "false" );
        } else {
            localStorage.setItem( "autoGoogleInputSetting", "true" );
        }
    } );
    jQueryLatest( "#autoLocatorInput" ).change( function() {
        var settingsCheck = localStorage.getItem( "autoLocatorInputSetting" );
        if ( settingsCheck == 'true' ) {
            localStorage.setItem( "autoLocatorInputSetting", "false" );
        } else {
            localStorage.setItem( "autoLocatorInputSetting", "true" );
        }
    } );
    jQueryLatest( "#currentStoreSelect" ).change( function() {
        jQueryLatest( "#currentStoreSelect option:selected" ).each( function() {
            localStorage.setItem( "currentStoreSelectSetting", jQueryLatest( this ).val() );
        } );
    } );

    /* Details Container */
    detailsDiv = jQueryLatest( "<div>" )
        .css( 'position', "relative" )
        .css( 'z-index', '1000' )
        .css( 'width', '80%' )
        .css( 'margin', '0 auto' )
        .css( 'left', '150px' )
        .css( 'top', "-60px" )
        .css( 'padding', "3px" )
        .css( 'background-color', "#f8f8f8" )
        .css( 'font-size', '12px' )
        .append(
            jQueryLatest( "<table>" )
            .html( "<tr><td><b>Name: </b></td><td style=' padding-left:10px;'>" + companyName + "</td>" +
                "<td style=' padding-left:20px;'><b>Address: </b></td><td style=' padding-left:10px;'>" + companyAddress + "</td>" +
                "<td style=' padding-left:20px;'><b>Locality: </b></td><td style=' padding-left:10px;'>" + companyLocality + "</td>" +
                "<td style=' padding-left:20px;'><b>Region: </b></td><td style=' padding-left:10px;'>" + companyRegion + "</td>" +
                "<td style=' padding-left:20px;'><b>Postcode: </b></td><td style=' padding-left:10px;'>" + companyPostcode + "</td></tr>" )
            .css( 'margin', '0 auto' )
            .css( 'text-align', 'center' )
    );

    jQueryLatest( "body" ).append( detailsDiv );

    /* Help Container */
    helpDiv = jQueryLatest( "<div>" )
        .css( 'position', "relative" )
        .css( 'z-index', '1000' )
        .css( 'width', '500px' )
        .css( 'margin', '0 auto' )
        .css( 'bottom', "0" )
        .css( 'padding', "20px" )
        .css( 'background-color', "#f8f8f8" )
        .css( 'display', 'block' )
        .append(
            jQueryLatest( "<table>" )
            .html( "<tr style='background-color: #DDDDDD;'>" + "<td style=' padding-left:20px;'><strong>/</strong> - Toggle Help</td>" + "<td><strong>~</strong> - Toggle Map Divider</td>" + "</tr>" +
                "<tr>" + "<td style=' padding-left:20px;'><strong>2</strong> - Draw Building</td>" + "<td><strong>3</strong> - Draw Area</td>" + "</tr>" +
                "<tr style='background-color: #DDDDDD;'>" + "<td style=' padding-left:20px;'><strong>4</strong> - Submit Record</td>" + "<td><strong>5</strong> - Report Problem</td>" + "</tr>" +
                "<tr>" + "<td style=' padding-left:20px;'><strong>Q</strong> - Zoom Out</td>" + "<td><strong>W</strong> - Zoom In</td>" + "</tr>" +
                "<tr style='background-color: #DDDDDD;'>" + "<td style=' padding-left:20px;'><strong>R</strong> - Delete Last Point</td>" + "<td><strong>Esc</strong> - Cancel Polygon</td>" + "</tr>" +
                "<tr>" + "<td style=' padding-left:20px;'><strong>F</strong> - Search Store Locator</td>" + "<td><strong>G</strong> - Google Search For Closed</td>" + "</tr>" +
                "<tr style='background-color: #DDDDDD;'>" + "<td style=' padding-left:20px;'><strong>B</strong> - Search Bing Maps</td>" + "<td><strong></strong></td>" + "</tr>" +
                "<tr>" + "<td style=' padding-left:20px;'><strong>M</strong> - Toggle Cursor Mirror</td>" + "<td><strong>N</strong> - Toggle Cursor Mirror Color</td>" + "</tr>" +
                "<tr style='background-color: #DDDDDD;'>" + "<td style=' padding-left:20px;'><strong>Shift+W</strong> - Shift Mirror Up</td>" + "<td><strong>Shift+S</strong> - Shift Mirror Down</td>" + "</tr>" +
                "<tr>" + "<td style=' padding-left:20px;'><strong>Shift+A</strong> - Shift Mirror Left</td>" + "<td><strong>Shift+D</strong> - Shift Mirror Right</td>" + "</tr>" +
                "</table>" )
            .css( 'width', '100%' )
            .css( 'margin', '0 auto' )
    );

    jQueryLatest( "body" ).append( helpDiv );
    helpDiv.toggle();

    /* Load Crosshairs */
    /*
    crossHairs = jQueryLatest( '<img src="http://i.imgur.com/Vdyrvbg.png">' );
    crossHairs.css( 'position', "relative" );
    crossHairs.css( 'top', (jQueryLatest( window ).height()/2) -82);
    crossHairs.css( 'left', (jQueryLatest( window ).width()*3/4)-9);
    crossHairs.css( 'z-index', '2000' );
    jQueryLatest( crossHairs ).appendTo( 'body' );*/

    /* Load Cursor Mirror */
    cursorImage = jQueryLatest( '<img src="http://i.imgur.com/ROsM1D4.png">' );
    cursorImage.css( 'position', "relative" );
    cursorImage.css( 'top', '-100px' );
    cursorImage.css( 'left', '0px' );
    cursorImage.css( 'z-index', '2000' );
    jQueryLatest( cursorImage ).appendTo( 'body' );
    cursorImage.toggle();

    /* Move the cursor mirror */
    jQueryLatest( "body" ).mousemove( function( event ) {
        currentMouseXPos = event.pageX;
        currentMouseYPos = event.pageY;
        if ( mirrorFlag && event.pageX <= ( jQueryLatest( window ).width() - jQueryLatest( '#sidebar' ).width() - 20 ) ) {
            xOffset = jQueryLatest( window ).width() / 2;
            cursorImage.css( 'left', event.pageX - 8 + xOffset + xOffsetManual );
            cursorImage.css( 'top', event.pageY - 108 + yOffsetManual );
        }
    } );

    buildingButton = jQueryLatest( 'a:contains("building")' ).eq( 0 );
    areaButton = jQueryLatest( 'a:contains("area")' ).eq( 0 );
    polygonButton = jQueryLatest( 'a.leaflet-draw-draw-polygon' ).eq( 0 );
    cancelButton = jQueryLatest( 'a[title="Cancel drawing"]' ).eq( 0 );
    deleteButton = jQueryLatest( 'a[title="Delete last point drawn"]' ).eq( 0 );
    
    /* Handle lack of Lat/Long */
    if ( latLongCheck == 0 ) {
        
        /* Disable AutoZoom */
        autoZoomFlag = false;
        
        setTimeout( function() {
            jQueryLatest( '#pac-input' ).val( companyAddress + ' ' + companyLocality + ' ' + companyRegion ); // + ' ' + companyAddress + ' ' + companyLocality);
            jQueryLatest( '#pac-input' ).focus();
        }, 2000 );
    }

    if ( localStorage.getItem( "autoZoomInputSetting" ) == 'true' && autoZoomFlag == true ) {
        myTimerCount = 0;
        myTimer2Count = 0;
        myVar = setInterval( function() {
            setTimeout( function() {
                myTimer();
            }, 1000 );
        }, 400 );
        myVar2 = setInterval( function() {
            setTimeout( function() {
                myTimer2();
            }, 1000 );
        }, 400 );
    }

    /* Auto-open store locator in fixed tab */
    if ( localStorage.getItem( "autoLocatorInputSetting" ) == 'true' ) {
        if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'RadioShack' ) {
            window.open( 'http://www.radioshack.com/storeLocator3/?origin=' + companyPostcode, 'locator' );
        } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'DollarTree' ) {
            window.open( 'http://www.dollartree.com/custserv/locate_store.cmd?origin=' + companyPostcode, 'locator' );
        } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'Verizon' ) {
            window.open( 'http://www.verizonwireless.com/b2c/dispatcher?zipCode=' + companyPostcode + '&stateID=&action=DISPLAY&item=_STORE_SEARCH&stateName=&searchType=new&CURRENT_TYPE_LABEL=Verizon+Wireless+Stores&fromPage=searchForm.jsp', 'locator' );
        } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'Exxon' ) {
            window.open( 'http://www.exxonmobilstations.com/?origin=' + companyPostcode, 'locator' );
        } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'Chevron' ) {
            window.open( 'http://www.chevronwithtechron.com/findastation.aspx?origin=' + companyPostcode, 'locator' );
        } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'Phillips66' ) {
            window.open( 'http://www.phillips66gas.com/locations.aspx?origin=' + companyPostcode, 'locator' );
        } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'Quiznos' ) {
            window.open( 'http://restaurants.quiznos.com/?origin=' + companyPostcode, 'locator' );
        } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'TrueValue' ) {
            window.open( 'http://www.truevalue.com/store_locator.jsp?origin=' + companyPostcode, 'locator' );
        } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'CircleK' ) {
            window.open( 'http://www.circlek.com/store-locator?language=en&state=' + companyRegion + '&origin=' + companyPostcode, 'locator' );
        } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'SherwinWilliams' ) {
            window.open( 'http://www.sherwin-williams.com/store-locator/#search/location/' + companyPostcode + '/RETAIL_STORE', 'locator' );
        } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'WellsFargo' ) {
            window.open( 'https://www.wellsfargo.com/locator/search/?searchTxt=' + companyPostcode, 'locator' );
        } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'PNCBank' ) {
            window.open( 'https://apps.pnc.com/locator/#layout=map&location%5Bstreet%5D=&location%5Bcity%5D=&location%5Bstate%5D=&location%5BpostalCode%5D=' + companyPostcode + '&offset=0', 'locator' );
        } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'USBank' ) {
            window.open( 'https://www.usbank.com/locations/locator-results.html?stringquery=' + companyPostcode + '&branch=y&atm=y', 'locator' );
        } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'CapOne' ) {
            window.open( 'http://maps.capitalone.com/locator/BranchSearch.action?&address=&city=&state=&zip=' + companyPostcode + '&searchType=branchSearch&useRadius=5&', 'locator' );
        } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'ATT' ) {
            window.open( 'http://www.att.com/maps/store-locator.html?origin=' + companyPostcode, 'locator' );
        } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'JambaJuice' ) {
            window.open( 'http://www.jambajuice.com/find-a-store?origin=' + companyPostcode, 'locator' );
        } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'Rue21' ) {
            window.open( 'http://www.rue21.com/store/jump/static/STORE-LOCATOR/store-locator?origin=' + companyPostcode, 'locator' );
        } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'EdwardJones' ) {
            window.open( 'https://www.edwardjones.com/cgi/getHTML.cgi?lang=en-US&page=/en_US/find_financial_advisor/results/index.html#l=' + companyPostcode, 'locator' );
        } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'Chrysler' ) {
            window.open( 'http://www.chrysler.com/en/find-dealer/?origin=' + companyPostcode, 'locator' );
        } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'GMC' ) {
            window.open( 'http://www.gmc.com/gmc-dealers.html?zipCode=' + companyPostcode, 'locator' );
        } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'CiCis' ) {
            window.open( 'http://www.cicispizza.com/enjoy-cicis/locations?postalcode=' + companyPostcode + '&radius=50', 'locator' );
        } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'CrackerBarrel' ) {
            window.open( 'http://www.crackerbarrel.com/locations-and-hours/closest-cracker-barrel?form=locator_search&locationAddress=' + companyPostcode, 'locator' );
        } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'ElPolloLoco' ) {
            window.open( 'http://www.elpolloloco.com/locations/?origin=' + companyPostcode, 'locator' );
        } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'PandaExpress' ) {
            window.open( 'https://www.pandaexpress.com/company/?origin=' + companyPostcode, 'locator' );
        } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'Sunoco' ) {
            window.open( 'https://www.gosunoco.com/gas-station-locator/?origin=' + companyPostcode, 'locator' );
        }
    }

    /* Auto-open google search in fixed tab */
    if ( localStorage.getItem( "autoGoogleInputSetting" ) == 'true' ) {
        window.open( 'https://www.google.com/search?q=' + companyName + '+' + companyAddress + '+' + companyLocality, 'gsearch' );
    }

    /* Hotkey Listener */
    document.addEventListener( "keydown", elFactual, false );
}

/* Hotkey Logic */
function elFactual( i ) {

    /* Determine if we're on task page or task list page */
    urlCheck = location.pathname;
    tasksCheck = urlCheck.indexOf( 'tasks' );

    if ( tasksCheck == -1 ) {
        if ( i.keyCode == 81 ) { //Q: Select Next Task
            jQueryLatest( 'a:contains(work!)' )[ 0 ].click();
        }
    } else {
        /* Disable hotkeys if map search input is in focus */
        if ( jQueryLatest( "#pac-input" ).is( ":focus" ) ) {
            /* Disable hotkeys if submit or problem text areas are in focus */
        } else if ( jQueryLatest( 'textarea.form-control.comments' ).is( ':focus' ) ) {
            /* Hotkey Logic */
        } else {
            /* Variable to check if street view has been activated */
            var tempDivs = jQueryLatest( 'div.panel.googlemap' ).children();
            if ( i.keyCode == 191 && i.shiftKey === false ) { // /: Help
                helpDiv.toggle();
            }
            if ( i.keyCode == 49 ) { //1: Testing

            }
            if ( i.keyCode == 50 ) { //2: Select Building Polygon
                buildingButton[ 0 ].click();
                polygonButton = jQueryLatest( 'a.leaflet-draw-draw-polygon' ).eq( 0 );
                polygonButton[ 0 ].click();
            }
            if ( i.keyCode == 51 ) { //3: Select Area Polygon
                areaButton[ 0 ].click();
                polygonButton = jQueryLatest( 'a.leaflet-draw-draw-polygon' ).eq( 0 );
                polygonButton[ 0 ].click();
            }
            if ( i.keyCode == 52 ) { //4: Finish Task
                /* Check to see if the Finish button is visible */
                checkForComplete = jQueryLatest( 'a:contains("Finish")' ).css( 'display' );
                if ( checkForComplete == 'block' ) {
                    jQueryLatest( 'a:contains(Finish)' )[ 0 ].click();
                    checkForCompleteMessage();
                }
            }
            if ( i.keyCode == 53 ) { //5: Open Problem Window
                jQueryLatest( 'a:contains(Report problem)' )[ 0 ].click();
                checkForProblem();
            }
            if ( i.keyCode == 90 ) { //Z: Switch to Sat 1
                jQueryLatest( 'a:contains(Sat 1)' )[ 0 ].click();
            }
            if ( i.keyCode == 88 ) { //X: Switch to Street
                jQueryLatest( 'a:contains(Street)' )[ 0 ].click();
            }
            if ( i.keyCode == 67 && i.ctrlKey === false && i.metaKey === false ) { //C: Switch to Sat 2
                jQueryLatest( 'a:contains(Sat 2)' )[ 0 ].click();
            }
            if ( i.keyCode == 81 && i.shiftKey === false ) { //Q: Map Zoom Out
                currentWindowDivider = jQueryLatest( window ).width() - jQueryLatest( '#sidebar' ).width();
                if ( currentMouseXPos <= currentWindowDivider ) {
                    jQueryLatest( 'a.leaflet-control-zoom-out' )[ 0 ].click();
                } else if ( tempDivs.length == 1 ) {
                    jQueryLatest( 'div[title="Zoom out"]' )[ 0 ].click();
                } else if ( tempDivs.eq( 1 ).css( 'display' ) == 'none' ) {
                    jQueryLatest( 'div[title="Zoom out"]' )[ 0 ].click();
                } else {
                    jQueryLatest( 'div[title="Zoom out"]' )[ 1 ].click();
                }
            }
            if ( i.keyCode == 87 && i.shiftKey === false ) { //W: Map Zoom In
                currentWindowDivider = jQueryLatest( window ).width() - jQueryLatest( '#sidebar' ).width();
                if ( currentMouseXPos <= currentWindowDivider ) {
                    jQueryLatest( 'a.leaflet-control-zoom-in' )[ 0 ].click();
                } else if ( tempDivs.length == 1 ) {
                    jQueryLatest( 'div[title="Zoom in"]' )[ 0 ].click();
                } else if ( tempDivs.eq( 1 ).css( 'display' ) == 'none' ) {
                    jQueryLatest( 'div[title="Zoom in"]' )[ 0 ].click();
                } else {
                    jQueryLatest( 'div[title="Zoom in"]' )[ 1 ].click();
                }
            }
            if ( i.keyCode == 192 && i.shiftKey === false ) { //~: Toggle Map Proportions
                if ( mapToggle == 1 ) {
                    jQueryLatest( '#sidebar' ).attr( 'style', 'display: block; width: 50%;' );
                    jQueryLatest( 'div.toggler.metadata' )[ 0 ].click();
                    jQueryLatest( 'div.toggler.metadata' )[ 0 ].click();
                    mapToggle = 2;
                } else if ( mapToggle == 2 ) {
                    jQueryLatest( '#sidebar' ).attr( 'style', 'display: block; width: 30%;' );
                    jQueryLatest( 'div.toggler.metadata' )[ 0 ].click();
                    jQueryLatest( 'div.toggler.metadata' )[ 0 ].click();
                    mapToggle = 3;
                } else if ( mapToggle == 3 ) {
                    jQueryLatest( '#sidebar' ).attr( 'style', 'display: block; width: 70%;' );
                    jQueryLatest( 'div.toggler.metadata' )[ 0 ].click();
                    jQueryLatest( 'div.toggler.metadata' )[ 0 ].click();
                    mapToggle = 1;
                }
            }
            if ( i.keyCode == 82 ) { //R: Delete Last Point
                deleteButton = jQueryLatest( 'a[title="Delete last point drawn"]' ).eq( 0 );
                deleteButton[ 0 ].click();
            }
            if ( i.keyCode == 27 ) { //Esc: Cancel Current Polygon
                cancelButton = jQueryLatest( 'a[title="Cancel drawing"]' ).eq( 0 );
                cancelButton[ 0 ].click();
            }
            if ( i.keyCode == 77 ) { //M: Mirror Mouse
                cursorImage.toggle();
                mirrorFlag = !mirrorFlag;
                cursorImage.css( 'top', '-100px' );
                cursorImage.css( 'left', '0px' );
            }
            if ( i.keyCode == 78 ) { //N: Toggle Mirror Mouse Color
                if ( mirrorColorFlag == 1 ) {
                    mirrorColorFlag = 2;
                    xOffset = jQueryLatest( window ).width() / 2;
                    cursorImage.attr( "src", "http://i.imgur.com/nhi1D7M.png" );
                } else {
                    mirrorColorFlag = 1;
                    xOffset = jQueryLatest( window ).width() / 2;
                    cursorImage.attr( "src", "http://i.imgur.com/ROsM1D4.png" );
                }
            }
            if ( i.keyCode == 70 ) { //F: Store Search

                if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'RadioShack' ) {
                    window.open( 'http://www.radioshack.com/storeLocator3/?origin=' + companyPostcode, 'locator' );
                } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'DollarTree' ) {
                    window.open( 'http://www.dollartree.com/custserv/locate_store.cmd?origin=' + companyPostcode, 'locator' );
                } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'Verizon' ) {
                    window.open( 'http://www.verizonwireless.com/b2c/dispatcher?zipCode=' + companyPostcode + '&stateID=&action=DISPLAY&item=_STORE_SEARCH&stateName=&searchType=new&CURRENT_TYPE_LABEL=Verizon+Wireless+Stores&fromPage=searchForm.jsp', 'locator' );
                } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'Exxon' ) {
                    window.open( 'http://www.exxonmobilstations.com/?origin=' + companyPostcode, 'locator' );
                } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'Chevron' ) {
                    window.open( 'http://www.chevronwithtechron.com/findastation.aspx?origin=' + companyPostcode, 'locator' );
                } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'Phillips66' ) {
                    window.open( 'http://www.phillips66gas.com/locations.aspx?origin=' + companyPostcode, 'locator' );
                } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'Quiznos' ) {
                    window.open( 'http://restaurants.quiznos.com/?origin=' + companyPostcode, 'locator' );
                } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'TrueValue' ) {
                    window.open( 'http://www.truevalue.com/store_locator.jsp?origin=' + companyPostcode, 'locator' );
                } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'CircleK' ) {
                    window.open( 'http://www.circlek.com/store-locator?language=en&state=' + companyRegion + '&origin=' + companyPostcode, 'locator' );
                } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'SherwinWilliams' ) {
                    window.open( 'http://www.sherwin-williams.com/store-locator/#search/location/' + companyPostcode + '/RETAIL_STORE', 'locator' );
                } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'WellsFargo' ) {
                    window.open( 'https://www.wellsfargo.com/locator/search/?searchTxt=' + companyPostcode, 'locator' );
                } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'PNCBank' ) {
                    window.open( 'https://apps.pnc.com/locator/#layout=map&location%5Bstreet%5D=&location%5Bcity%5D=&location%5Bstate%5D=&location%5BpostalCode%5D=' + companyPostcode + '&offset=0', 'locator' );
                } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'USBank' ) {
                    window.open( 'https://www.usbank.com/locations/locator-results.html?stringquery=' + companyPostcode + '&branch=y&atm=y', 'locator' );
                } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'CapOne' ) {
                    window.open( 'http://maps.capitalone.com/locator/BranchSearch.action?&address=&city=&state=&zip=' + companyPostcode + '&searchType=branchSearch&useRadius=5&', 'locator' );
                } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'ATT' ) {
                    window.open( 'http://www.att.com/maps/store-locator.html?origin=' + companyPostcode, 'locator' );
                } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'JambaJuice' ) {
                    window.open( 'http://www.jambajuice.com/find-a-store?origin=' + companyPostcode, 'locator' );
                } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'Rue21' ) {
                    window.open( 'http://www.rue21.com/store/jump/static/STORE-LOCATOR/store-locator?origin=' + companyPostcode, 'locator' );
                } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'EdwardJones' ) {
                    window.open( 'https://www.edwardjones.com/cgi/getHTML.cgi?lang=en-US&page=/en_US/find_financial_advisor/results/index.html#l=' + companyPostcode, 'locator' );
                } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'Chrysler' ) {
                    window.open( 'http://www.chrysler.com/en/find-dealer/?origin=' + companyPostcode, 'locator' );
                } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'GMC' ) {
                    window.open( 'http://www.gmc.com/gmc-dealers.html?zipCode=' + companyPostcode, 'locator' );
                } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'CiCis' ) {
                    window.open( 'http://www.cicispizza.com/enjoy-cicis/locations?postalcode=' + companyPostcode + '&radius=50', 'locator' );
                } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'CrackerBarrel' ) {
                    window.open( 'http://www.crackerbarrel.com/locations-and-hours/closest-cracker-barrel?form=locator_search&locationAddress=' + companyPostcode, 'locator' );
                } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'ElPolloLoco' ) {
                    window.open( 'http://www.elpolloloco.com/locations/?origin=' + companyPostcode, 'locator' );
                } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'PandaExpress' ) {
                    window.open( 'https://www.pandaexpress.com/company/?origin=' + companyPostcode, 'locator' );
                } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'Sunoco' ) {
                    window.open( 'https://www.gosunoco.com/gas-station-locator/?origin=' + companyPostcode, 'locator' );
                }
            }
            if ( i.keyCode == 71 ) { //G: Google Search
                window.open( 'https://www.google.com/search?q=' + companyAddress + '+' + companyLocality + '+ site:showcase.com OR site:cityfeet.com OR site:loopnet.com', 'gsearch' );
            }
            if ( i.keyCode == 66 ) { //G: Bing Search
                window.open( 'http://www.bing.com/maps/default.aspx?q=' + companyAddress + '+' + companyLocality + '+' + companyRegion, 'bsearch' );
            }
            if ( i.keyCode == 32 ) { //Space: Map Search
                jQueryLatest( 'input.controls' ).val( companyName ); // + ' ' + companyAddress + ' ' + companyPostcode ); // + ' ' + companyAddress + ' ' + companyLocality);
                jQueryLatest( 'input.controls' ).focus();
                setTimeout( function() {
                    jQueryLatest( 'input.controls' ).blur();
                }, 3000 );
            }
            if ( i.keyCode == 65 && i.shiftKey ) { //Shift+W: Move Mirrored Cursor Left
                xOffsetManual -= 2;
                cursorImage.css( 'left', currentMouseXPos - 8 + xOffset + xOffsetManual );
                cursorImage.css( 'top', currentMouseYPos - 108 + yOffsetManual );
            }
            if ( i.keyCode == 68 && i.shiftKey ) { //Shift+D: Move Mirrored Cursor Right
                xOffsetManual += 2;
                cursorImage.css( 'left', currentMouseXPos - 8 + xOffset + xOffsetManual );
                cursorImage.css( 'top', currentMouseYPos - 108 + yOffsetManual );
            }
            if ( i.keyCode == 87 && i.shiftKey ) { //Shift+W: Move Mirrored Cursor Up
                yOffsetManual -= 2;
                cursorImage.css( 'left', currentMouseXPos - 8 + xOffset + xOffsetManual );
                cursorImage.css( 'top', currentMouseYPos - 108 + yOffsetManual );
            }
            if ( i.keyCode == 83 && i.shiftKey ) { //Shift+S: Move Mirrored Cursor Down
                yOffsetManual += 2;
                cursorImage.css( 'left', currentMouseXPos - 8 + xOffset + xOffsetManual );
                cursorImage.css( 'top', currentMouseYPos - 108 + yOffsetManual );
            }
        }
    }
}

function myTimer() {
    if ( myTimerCount > 2 ) {
        clearInterval( myVar );
    } else {
        jQueryLatest( 'div[title="Zoom in"]' )[ 0 ].click();
        myTimerCount++;
    }
}

function myTimer2() {
    if ( myTimer2Count > 2 ) {
        clearInterval( myVar2 );
    } else {
        jQueryLatest( 'a.leaflet-control-zoom-in' )[ 0 ].click();
        myTimer2Count++;
    }
}

function checkForProblem() {

    if ( localStorage.getItem( 'ClosedURL' ) ) {
        jQueryLatest( 'span.clickable.label.label-default.problem.label-info' ).click();
        jQueryLatest( 'span[data-raw="Place has closed"]' ).click();
        jQueryLatest( 'textarea[placeholder="Additional Comments:"]' ).text( localStorage.getItem( 'ClosedURL' ) );
        setTimeout( function() {
            jQueryLatest( 'button:contains(Report)' )[ 0 ].click();
        }, 500 );
        localStorage.removeItem( "ClosedURL" );
    } else if ( localStorage.getItem( 'NotOnLocator' ) ) {
        jQueryLatest( 'span.clickable.label.label-default.problem.label-info' ).click();
        jQueryLatest( 'span[data-raw="Not on official locator"]' ).click();
        setTimeout( function() {
            jQueryLatest( 'button:contains(Report)' )[ 0 ].click();
        }, 500 );
        localStorage.removeItem( "NotOnLocator" );
    }
}

function checkForCompleteMessage() {
    if ( localStorage.getItem( 'BingURL' ) ) {
        jQueryLatest( 'textarea[placeholder="Enter your comments in here <Optional>"]' ).text( 'Confirmed on Bing maps: ' + localStorage.getItem( 'BingURL' ) );
        localStorage.removeItem( 'BingURL' );
    } else {

    }

    /*if ( mirrorFlag ) {
        jQueryLatest( 'textarea[placeholder="Enter your comments in here <Optional>"]' ).text( 'Estimated using Google map' );
    }*/
    setTimeout( function() {
        /* Check to see if the Confirm button is visible */
        var checkForConfirm = jQueryLatest( '#polygon-work-finish-modal' ).css( 'display' );
        if ( checkForConfirm == 'block' ) {
            jQueryLatest( 'button:contains(Confirm)' )[ 0 ].click();
        }
    }, 500 );
}

function checkForUpdateMessage() {
    if ( localStorage.getItem( 'Polygons-v131' ) === null ) {
        alert( 'The Polygon script has been updated to version 1.3.1\n\n Fixed a bug on OSX \n\n' +
             'This message should only display once. Contact Zachary if it continues to show.');
        localStorage.setItem( 'Polygons-v131', true );
    }
}