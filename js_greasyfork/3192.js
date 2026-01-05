// ==UserScript==
// @author      Zachary Seeley
// @name        Polygons Script No Alerts
// @namespace   http://www.jedatasolutions.com/
// @description Provides shortcuts for working in Factual tasks.
// @require     http://code.jquery.com/jquery-latest.min.js
// @match       https://work4.factual.com/*
// @match       http://www.anytimefitness.com/find-gym*
// @match       http://www.snapfitness.com/gyms*
// @match       https://www.caseys.com/locations*
// @match       http://www.nyandcompany.com/nyco/locations/*
// @match       http://www.goldsgym.com/locate-a-gym/*
// @match       http://www.rossstores.com/locator.aspx*
// @match       http://www.acehardware.com/mystore/storeLocator.jsp*
// @match       http://www.foodlion.com/Stores*
// @match       http://www.partycity.com/store-locator/landing.do*
// @match       http://www.officemax.com/storelocator/storeLocatorHome.jsp*
// @match       http://www.officedepot.com/storelocator/findStore.do*
// @match       http://storelocator.staples.com/*
// @match       http://www.gamestop.com/browse/storesearch.aspx*
// @match       http://www.urbanspoon.com/*
// @match       https://work4.factual.com/robots.txt?url=*
// @match       http://www.yelp.com/*
// @match       https://foursquare.com/*
// @match       http://www.citysearch.com/*
// @match       http://www.bing.com/maps/*
// @copyright   © 2014, J&E Data Solutions
// @version     1.8
// @downloadURL https://update.greasyfork.org/scripts/3192/Polygons%20Script%20No%20Alerts.user.js
// @updateURL https://update.greasyfork.org/scripts/3192/Polygons%20Script%20No%20Alerts.meta.js
// ==/UserScript==

/*global $:false, console:false, alert:false*/
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
$( document ).ready( function() {

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

    if ( tasksCheck == -1 && $( 'p:contains(Polygons)' ).text() ) {
        taskListPageInit();
    } else if ( tasksCheck == -1 && $( 'h1:contains("Top Records")' ).text() ) {
        //Do nothing, Top Record list.
        console.log( 'Polygons script deactivated on Top Records list page' );
    } else if ( tasksCheck2 == -1 && $( 'h5:contains(Top Records)' ).text() ) {
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
    } else if ( pageCheck == 'stationfinder.mybpstation.com' ) {
        document.addEventListener( "keydown", elBP, false );
        currentPT2 = ( window.location.href ).split( "=" );
        $( '#zip' ).val( currentPT2[ 1 ] );
    } else if ( pageCheck == 'www.jcpenney.com' ) {
        document.addEventListener( "keydown", elJC, false );
        currentPT2 = ( window.location.href ).split( "=" );
        $( '#searchStore' ).val( currentPT2[ 1 ] );
    } else if ( pageCheck == 'www.familydollar.com' ) {
        currentPT2 = ( window.location.href ).split( "=" );
        $( '#FindStorePostalCode' ).val( currentPT2[ 1 ] );
        $( '#btnFindStorePostalCode' ).click();
    } else if ( pageCheck == 'order.pizzahut.com' ) {
        currentPT2 = ( window.location.href ).split( "=" );
        $( 'input[type="zip"]' ).val( currentPT2[ 1 ] );
        $( 'input[type="zip"]' ).focus();
        document.addEventListener( "keydown", elPH, false );
    } else if ( pageCheck == 'www.napaonline.com' ) {
        //if ( $( document ).find( '#edCloseButton' ) ) $( '#edCloseButton' ).click();
        currentPT2 = ( window.location.href ).split( "=" );
        $( '#ctl00_ContentPlaceHolder1_txtAddress' ).val( currentPT2[ 1 ] );
        $( '#ctl00_ContentPlaceHolder1_btnGo' )[ 0 ].click();
        document.addEventListener( 'keydown', elNAPA, false );
    } else if ( pageCheck == 'www.autozone.com' ) {
        currentPT2 = ( window.location.href ).split( "=" );
        if ( currentPT2[ 1 ].length == 5 ) {
            $( '#zip' ).val( currentPT2[ 1 ] );
            setTimeout( function() {
                $( 'a.actionButton.orange.submit-link' )[ 0 ].click();
            }, 1000 );
        }
        document.addEventListener( 'keydown', elAZ, false );
    } else if ( pageCheck == 'tjmaxx.tjx.com' ) {
        currentPT2 = ( window.location.href ).split( "=" );
        if ( currentPT2[ 1 ].length == 5 ) {
            $( '#store-location-zip' ).val( currentPT2[ 1 ] );
            setTimeout( function() {
                $( 'input[name="submit"]' )[ 0 ].click();
            }, 1000 );
        }
        document.addEventListener( 'keydown', elTJM, false );
    } else if ( pageCheck == 'www.dollargeneral.com' ) {
        currentPT2 = ( window.location.href ).split( "=" );
        var cPT2 = currentPT2[ 1 ].replace( /%20/g, ' ' );
        $( '#store-search-zip' ).val( cPT2 );
        $( '#store-search-submit' )[ 0 ].click();
        document.addEventListener( 'keydown', elTJM, false );
    } else if ( pageCheck == 'www.anytimefitness.com' ) {
        document.addEventListener( 'keydown', elATF, false );
    } else if ( pageCheck == 'www.snapfitness.com' ) {
        currentPT2 = ( window.location.href ).split( "=" );
        var cPT2 = currentPT2[ 1 ];
        $( '#search' ).focus();
        $( '#search' ).val( cPT2 ).change();
        $( '#search' ).properties( cPT2 );
        $( '#submit' )[ 0 ].click();
        document.addEventListener( 'keydown', elSF, false );
    } else if ( pageCheck == 'www.nyandcompany.com' ) {
        currentPT2 = ( window.location.href ).split( "=" );
        var cPT2 = currentPT2[ 1 ].replace( /%20/g, ' ' );
        $( '#storeLocatorField' ).val( cPT2 );
        /*$(function() {
            $('#distance_from').filter(function() { 
                return ($(this).text() == '10 Miles');
            }).prop('selected', true);
        })*/
        $("#distance_from").val('35');
        $( '#findStore' )[ 0 ].click();
        document.addEventListener( 'keydown', elNYCO, false );
    } else if ( pageCheck == 'www.goldsgym.com' ) {
        currentPT2 = ( window.location.href ).split( "=" );
        var cPT2 = currentPT2[ 1 ].replace( /%20/g, ' ' );
        $( '#zip-input' ).val( cPT2 );
        $( 'input.search' )[ 0 ].click();
        document.addEventListener( 'keydown', elGG, false );
    } else if ( pageCheck == 'www.rossstores.com' ) {
        currentPT2 = ( window.location.href ).split( "=" );
        var cPT2 = currentPT2[ 1 ].replace( /%20/g, ' ' );
        $( '#inputaddress' ).attr( 'value', cPT2 );
        //$( '#locator_submit' )[ 0 ].click();
        document.addEventListener( 'keydown', elRS, false );
    } else if ( pageCheck == 'www.caseys.com' ) {
        currentPT2 = ( window.location.href ).split( "=" );
        var cPT2 = currentPT2[ 1 ].replace( /%20/g, ' ' );
        $( '#locator' ).val( cPT2 );
        $( '#locator' ).focus();
        $( '#submitter' ).submit();
        document.addEventListener( 'keydown', elCaseys, false );
    } else if ( pageCheck == 'www.acehardware.com' ) {
        currentPT2 = ( window.location.href ).split( "=" );
        var cPT2 = currentPT2[ 1 ].replace( /%20/g, ' ' );
        $( '#fldAddress' ).val( cPT2 );
        $( '#searchBtn' ).submit();
        document.addEventListener( 'keydown', elAce, false );
    } else if ( pageCheck == 'www.partycity.com' ) {
        currentPT2 = ( window.location.href ).split( "=" );
        var cPT2 = currentPT2[ 1 ].replace( /%20/g, ' ' );
        $( '#eslSearchInput1' ).val( cPT2 );
        setTimeout( function() {
            $( '#eslSearchButton1' ).click();
        }, 1000 );
        document.addEventListener( 'keydown', elPC, false );
    } else if ( pageCheck == 'www.foodlion.com' ) {
        currentPT2 = ( window.location.href ).split( "=" );
        var cPT2 = currentPT2[ 1 ].replace( /%20/g, ' ' );
        $( '#Zip' ).val( cPT2 );
        setTimeout( function() {
            console.log('click');
            $( '#searchStores' ).click();
        }, 2000 );
        document.addEventListener( 'keydown', elFL, false );
    } else if ( pageCheck == 'storelocator.staples.com' ) {
        currentPT2 = ( window.location.href ).split( "=" );
        var cPT2 = currentPT2[ 1 ].replace( /%20/g, ' ' );
        $( '#addressInput' ).val( cPT2 );
        //setTimeout( function() {
            //console.log('click');
            $( '#searchButton' ).click();
        //}, 2000 );
        document.addEventListener( 'keydown', elStaples, false );
    } else if ( pageCheck == 'www.officedepot.com' ) {
        setTimeout( function() {
            currentPT2 = ( window.location.href ).split( "=" );
            var cPT2 = currentPT2[ 1 ].replace( /%20/g, ' ' );
            $( '#inputaddress' ).val( cPT2 );
            //
               console.log('click');
            $( '#locator_submit2' ).click();
        }, 2000 );
        document.addEventListener( 'keydown', elOfficeDepot, false );
    } else if ( pageCheck == 'www.officemax.com' ) {
        currentPT2 = ( window.location.href ).split( "=" );
        var cPT2 = currentPT2[ 1 ].replace( /%20/g, ' ' );
        $( '#search-store-zipcode' ).val( cPT2 );
        /*setTimeout( function() {
        //    console.log('click');
            $( 'input[name="/officemax/uep/storelocator/StoreLocatorFormHandler.getBestStores"]' ).click();
        }, 2000 );*/
        document.addEventListener( 'keydown', elOfficeMax, false );
    } else if ( pageCheck == 'www.gamestop.com' ) {
        currentPT2 = ( window.location.href ).split( "=" );
        var cPT2 = currentPT2[ 1 ].replace( /%20/g, ' ' );
        $( '#ctl00_ctl00_BaseContentPlaceHolder_mainContentPlaceHolder_StoreSearchControl_EnterZipTextBox' ).val( cPT2 );
        
        //setTimeout( function() {
            unsafeWindow.WebForm_DoPostBackWithOptions(new WebForm_PostBackOptions("ctl00$ctl00$BaseContentPlaceHolder$mainContentPlaceHolder$StoreSearchControl$FindZipButton", "", true, "StoreSearch", "", false, true));
            //$( 'a.zip_find' ).click();
        //}, 2000 );
        document.addEventListener( 'keydown', elGameStop, false );
    } else if ( pageCheck == 'www.deltaco.com' ) {
        var currentPT3 = location.search;
        var currentPT4 = currentPT3.slice( 1, 7 );
        console.log( currentPT4 );
        if ( currentPT4 == "origin" ) {
            currentPT2 = ( window.location.href ).split( "=" );
            console.log( 'test' );
            console.log( currentPT2 );
            $( 'input.location_input_text' ).val( currentPT2[ 1 ] );
            $( 'input.location_submit_go' )[ 0 ].click();
        } else {

            document.addEventListener( "keydown", elDT, false );
        }
    } else if ( pageCheck == 'www.urbanspoon.com' || pageCheck == 'foursquare.com' || pageCheck == 'www.yelp.com' || pageCheck == 'www.citysearch.com' ) {
        document.addEventListener( "keydown", elUS, false );
    }
}

function elBing( i ) {
    if ( i.keyCode == 52 ) { //4: Send Bing Variable
        window.open( 'https://work4.factual.com/robots.txt?src=Bing&url=' + window.location, '_blank' );
    }
}

function elNYCO( i ) {
    if ( i.keyCode == 53 ) { //5: Send errorr variable
        window.open( 'https://work4.factual.com/robots.txt?src=Locator&url=' + window.location, '_blank' );
    }
}

function elGG( i ) {
    if ( i.keyCode == 53 ) { //5: Send errorr variable
        window.open( 'https://work4.factual.com/robots.txt?src=Locator&url=' + window.location, '_blank' );
    }
}

function elRS( i ) {
    if ( i.keyCode == 53 ) { //5: Send errorr variable
        window.open( 'https://work4.factual.com/robots.txt?src=Locator&url=' + window.location, '_blank' );
    }
}

function elCaseys( i ) {
    if ( i.keyCode == 53 ) { //5: Send errorr variable
        window.open( 'https://work4.factual.com/robots.txt?src=Locator&url=' + window.location, '_blank' );
    }
}

function elAce( i ) {
    if ( i.keyCode == 53 ) { //5: Send errorr variable
        window.open( 'https://work4.factual.com/robots.txt?src=Locator&url=' + window.location, '_blank' );
    }
}

function elPC( i ) {
    if ( i.keyCode == 53 ) { //5: Send errorr variable
        window.open( 'https://work4.factual.com/robots.txt?src=Locator&url=' + window.location, '_blank' );
    }
}

function elFL( i ) {
    if ( i.keyCode == 53 ) { //5: Send errorr variable
        window.open( 'https://work4.factual.com/robots.txt?src=Locator&url=' + window.location, '_blank' );
    }
}

function elStaples( i ) {
    if ( i.keyCode == 53 ) { //5: Send errorr variable
        window.open( 'https://work4.factual.com/robots.txt?src=Locator&url=' + window.location, '_blank' );
    }
}

function elOfficeDepot( i ) {
    if ( i.keyCode == 53 ) { //5: Send errorr variable
        window.open( 'https://work4.factual.com/robots.txt?src=Locator&url=' + window.location, '_blank' );
    }
}

function elOfficeMax( i ) {
    if ( i.keyCode == 53 ) { //5: Send errorr variable
        window.open( 'https://work4.factual.com/robots.txt?src=Locator&url=' + window.location, '_blank' );
    }
}

function elGameStop( i ) {
    if ( i.keyCode == 53 ) { //5: Send errorr variable
        window.open( 'https://work4.factual.com/robots.txt?src=Locator&url=' + window.location, '_blank' );
    }
}

function elTJM( i ) {
    if ( i.keyCode == 53 ) { //5: Send errorr variable
        window.open( 'https://work4.factual.com/robots.txt?src=Locator&url=' + window.location, '_blank' );
    }
}

function elAZ( i ) {
    if ( i.keyCode == 53 ) { //5: Send errorr variable
        window.open( 'https://work4.factual.com/robots.txt?src=Locator&url=' + window.location, '_blank' );
    }
}

function elDG( i ) {
    if ( i.keyCode == 53 ) { //5: Send errorr variable
        window.open( 'https://work4.factual.com/robots.txt?src=Locator&url=' + window.location, '_blank' );
    }
}

function elBP( i ) {
    if ( i.keyCode == 13 ) { //Enter: Submit ZIP
        $( '#zip' ).focus();
    }
}

function elJC( i ) {
    if ( i.keyCode == 13 ) { //Enter: Submit ZIP
        //$( '#searchStore' ).focus();
    }
}

function elATF( i ) {
    if ( i.keyCode == 53 ) { //5: Send errorr variable
        window.open( 'https://work4.factual.com/robots.txt?src=Locator&url=' + window.location, '_blank' );
    }
}

function elSF( i ) {
    if ( i.keyCode == 53 ) { //5: Send errorr variable
        window.open( 'https://work4.factual.com/robots.txt?src=Locator&url=' + window.location, '_blank' );
    }
}

function elPH( i ) {
    if ( i.keyCode == 32 ) { //Space: Submit ZIP
        setTimeout( function() {
            $( 'input[type="submit"]' ).click();
        }, 100 );
    }
    if ( i.keyCode == 53 ) { //5: Send errorr variable
        window.open( 'https://work4.factual.com/robots.txt?src=Locator&url=' + window.location, '_blank' );
    }
}

function elNAPA( i ) {
    if ( i.keyCode == 53 ) { //5: Send errorr variable
        window.open( 'https://work4.factual.com/robots.txt?src=Locator&url=' + window.location, '_blank' );
    }
}

function elDT( i ) {
    if ( i.keyCode == 53 ) { //5: Send errorr variable
        window.open( 'https://work4.factual.com/robots.txt?src=Locator&url=' + window.location, '_blank' );
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

    /*var store1 = new Option();
    store1.value = 'Arbys';
    store1.text = 'Arbys';
    currentStoreSelect.options.add( store1 );
    var store2 = new Option();
    store2.value = 'FD';
    store2.text = 'Family Dollar';
    currentStoreSelect.options.add( store2 );
    var store3 = new Option();
    store3.value = 'JC';
    store3.text = 'JC Penney';
    currentStoreSelect.options.add( store3 );
    var store4 = new Option();
    store4.value = 'BP';
    store4.text = 'BP';
    currentStoreSelect.options.add( store4 );
    var store5 = new Option();
    store5.value = 'PH';
    store5.text = 'Pizza Hut';
    currentStoreSelect.options.add( store5 );
    var store6 = new Option();
    store6.value = 'NAPA';
    store6.text = 'NAPA';
    currentStoreSelect.options.add( store6 );
    var store7 = new Option();
    store7.value = 'DT';
    store7.text = 'Del Taco';
    currentStoreSelect.options.add( store7 );
    var store8 = new Option();
    store8.value = 'DG';
    store8.text = 'Dollar General';
    currentStoreSelect.options.add( store8 );
    var store9 = new Option();
    store9.value = 'AZ';
    store9.text = 'AutoZone';
    currentStoreSelect.options.add( store9 );
    var store10 = new Option();
    store10.value = 'TJM';
    store10.text = 'TJMaxx';
    currentStoreSelect.options.add( store10 );*/
    var store11 = new Option();
    store11.value = 'ATF';
    store11.text = 'Anytime Fitness';
    currentStoreSelect.options.add( store11 );
    var store12 = new Option();
    store12.value = 'SF';
    store12.text = 'Snap Fitness';
    currentStoreSelect.options.add( store12 );
    var store13 = new Option();
    store13.value = 'NYCO';
    store13.text = 'NY and Company';
    currentStoreSelect.options.add( store13 );
    var store14 = new Option();
    store14.value = 'GG';
    store14.text = 'Golds Gym';
    currentStoreSelect.options.add( store14 );
    var store15 = new Option();
    store15.value = 'RS';
    store15.text = 'Ross Stores';
    currentStoreSelect.options.add( store15 );
    var store16 = new Option();
    store16.value = 'Caseys';
    store16.text = 'Caseys';
    currentStoreSelect.options.add( store16 );
    var store17 = new Option();
    store17.value = 'AH';
    store17.text = 'Ace Hardware';
    currentStoreSelect.options.add( store17 );
    var store18 = new Option();
    store18.value = 'PC';
    store18.text = 'Party City';
    currentStoreSelect.options.add( store18 );
    var store19 = new Option();
    store19.value = 'FL';
    store19.text = 'Food Lion';
    currentStoreSelect.options.add( store19 );
    var store20 = new Option();
    store20.value = 'Staples';
    store20.text = 'Staples';
    currentStoreSelect.options.add( store20 );
    var store21 = new Option();
    store21.value = 'OM';
    store21.text = 'Office Max';
    currentStoreSelect.options.add( store21 );
    var store22 = new Option();
    store22.value = 'OD';
    store22.text = 'Office Depot';
    currentStoreSelect.options.add( store22 );
    var store23 = new Option();
    store23.value = 'GS';
    store23.text = 'GameStop';
    currentStoreSelect.options.add( store23 );

    userSettingsDiv.setAttribute( 'class', 'userSettingsDiv' );
    userSettingsDiv.setAttribute( 'style', 'position: absolute; top: 0px; left: 20px; z-index: 1010; width: 400px; height: 50px; background-color: #f8f8f8' );

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

    $( 'body' ).append( userSettingsDiv );
    $( '.userSettingsDiv' ).append( autoAcceptInput );
    $( '.userSettingsDiv' ).append( document.createTextNode( ' - Grind Mode ' ) );
    $( '.userSettingsDiv' ).append( autoGoogleInput );
    $( '.userSettingsDiv' ).append( document.createTextNode( ' - Auto Google Search ' ) );
    $( '.userSettingsDiv' ).append( currentStoreSelect );
    $( '.userSettingsDiv' ).append( document.createElement( 'br' ) );
    $( '.userSettingsDiv' ).append( autoZoomInput );
    $( '.userSettingsDiv' ).append( document.createTextNode( ' - Auto Zoom ' ) );
    $( 'div.userSettingsDiv' ).append( autoLocatorInput );
    $( '.userSettingsDiv' ).append( document.createTextNode( ' - Auto Locator Search ' ) );
    $( '#currentStoreSelect' ).val( localStorage.getItem( 'currentStoreSelectSetting' ) );
}

function taskListPageInit() {
    showUserSettings();

    $( "#autoAcceptInput" ).change( function() {
        var settingsCheck = localStorage.getItem( "autoAcceptInputSetting" );
        if ( settingsCheck == 'true' ) {
            localStorage.setItem( "autoAcceptInputSetting", "false" );
        } else {
            localStorage.setItem( "autoAcceptInputSetting", "true" );
        }
    } );
    $( "#autoZoomInput" ).change( function() {
        var settingsCheck = localStorage.getItem( "autoZoomInputSetting" );
        if ( settingsCheck == 'true' ) {
            localStorage.setItem( "autoZoomInputSetting", "false" );
        } else {
            localStorage.setItem( "autoZoomInputSetting", "true" );
        }
    } );
    $( "#autoGoogleInput" ).change( function() {
        var settingsCheck = localStorage.getItem( "autoGoogleInputSetting" );
        if ( settingsCheck == 'true' ) {
            localStorage.setItem( "autoGoogleInputSetting", "false" );
        } else {
            localStorage.setItem( "autoGoogleInputSetting", "true" );
        }
    } );
    $( "#autoLocatorInput" ).change( function() {
        var settingsCheck = localStorage.getItem( "autoLocatorInputSetting" );
        if ( settingsCheck == 'true' ) {
            localStorage.setItem( "autoLocatorInputSetting", "false" );
        } else {
            localStorage.setItem( "autoLocatorInputSetting", "true" );
        }
    } );
    $( "#currentStoreSelect" ).change( function() {
        $( "#currentStoreSelect option:selected" ).each( function() {
            localStorage.setItem( "currentStoreSelectSetting", $( this ).val() );
        } );
    } );

    if ( localStorage.getItem( 'autoReviewInputSetting' ) == 'true' ) {
        //Do nothing, review mode is on.
    } else if ( localStorage.getItem( "autoAcceptInputSetting" ) == 'true' ) {
        if ( $( 'a:contains(work!)' ).text() ) {
            $( 'a:contains(work!)' )[ 0 ].click();
        }
    }
}

function taskPageInit() {
        
    $( 'span:contains("Cannot find the correct place")' ).click( function() {
        var problemCheck = $( '.label-info:contains("Cannot find the correct place")' ).text().trim();
        if ( $( this ).text() == "Cannot find the correct place" && problemCheck ) {
            $( '.btn.btn-primary:contains("Report")' ).css( 'background-color', '#B13232' );
            $( '.btn.btn-primary:contains("Report")' ).css( 'border-color', '#BD3535' );
            $( '.btn.btn-primary:contains("Report")' ).text( 'COMMENT REQUIRED' );//.attr( 'style', 'display: none;' );
            $( 'textarea[placeholder="Additional Comments:"]' ).attr( 'placeholder', 'Comment Required!' );
        } else if ( $( this ).text() == "Cannot find the correct place" && !problemCheck ) {
            $( '.btn.btn-primary:contains("COMMENT REQUIRED")' ).css( 'background-color', '#428bca' );
            $( '.btn.btn-primary:contains("COMMENT REQUIRED")' ).css( 'border-color', '#357ebd' );
            $( '.btn.btn-primary:contains("COMMENT REQUIRED")' ).text( 'Report' );//.attr( 'style', 'display: visible;' );
            $( 'textarea[placeholder="Comment Required!"]' ).attr( 'placeholder', 'Additional Comments:' );
        }
    } );
    
    $( 'span:contains("Place has closed")' ).click( function() {
        var problemCheck = $( '.label-info:contains("Place has closed")' ).text().trim();
        if ( $( this ).text() == "Place has closed" && problemCheck ) {
            $( '.btn.btn-primary:contains("Report")' ).css( 'background-color', '#B13232' );
            $( '.btn.btn-primary:contains("Report")' ).css( 'border-color', '#BD3535' );
            $( '.btn.btn-primary:contains("Report")' ).text( 'COMMENT REQUIRED' );//.attr( 'style', 'display: none;' );
            $( 'textarea[placeholder="Additional Comments:"]' ).attr( 'placeholder', 'Comment Required!' );
        } else if ( $( this ).text() == "Place has closed" && !problemCheck ) {
            $( '.btn.btn-primary:contains("COMMENT REQUIRED")' ).css( 'background-color', '#428bca' );
            $( '.btn.btn-primary:contains("COMMENT REQUIRED")' ).css( 'border-color', '#357ebd' );
            $( '.btn.btn-primary:contains("COMMENT REQUIRED")' ).text( 'Report' );//.attr( 'style', 'display: visible;' );
            $( 'textarea[placeholder="Comment Required!"]' ).attr( 'placeholder', 'Additional Comments:' );
        }
    } );
    
    $( 'span:contains("Name has changed")' ).click( function() {
        var problemCheck = $( '.label-info:contains("Name has changed")' ).text().trim();
        if ( $( this ).text() == "Name has changed" && problemCheck ) {
            $( '.btn.btn-primary:contains("Report")' ).css( 'background-color', '#B13232' );
            $( '.btn.btn-primary:contains("Report")' ).css( 'border-color', '#BD3535' );
            $( '.btn.btn-primary:contains("Report")' ).text( 'COMMENT REQUIRED' );//.attr( 'style', 'display: none;' );
            $( 'textarea[placeholder="Additional Comments:"]' ).attr( 'placeholder', 'Comment Required!' );
        } else if ( $( this ).text() == "Name has changed" && !problemCheck ) {
            $( '.btn.btn-primary:contains("COMMENT REQUIRED")' ).css( 'background-color', '#428bca' );
            $( '.btn.btn-primary:contains("COMMENT REQUIRED")' ).css( 'border-color', '#357ebd' );
            $( '.btn.btn-primary:contains("COMMENT REQUIRED")' ).text( 'Report' );//.attr( 'style', 'display: visible;' );
            $( 'textarea[placeholder="Comment Required!"]' ).attr( 'placeholder', 'Additional Comments:' );
        }
    } );
    
    checkForUpdateMessage();

    document.title = 'work4 record';
    localStorage.removeItem( "ClosedURL" );
    localStorage.removeItem( 'BingURL' );
    localStorage.removeItem( "NotOnLocator" );

    companyName = $( 'div.address-vals' ).children().eq( 0 ).text();
    companyAddress = $( 'div.address-vals' ).children().eq( 3 ).text();
    companyLocality = $( 'div.address-vals' ).children().eq( 4 ).text();
    companyRegion = $( 'div.address-vals' ).children().eq( 5 ).text();
    companyPostcode = $( 'div.address-vals' ).children().eq( 6 ).text();

    $( 'html' ).css( 'height', '100%' );
    $( 'body' ).css( 'height', '100%' );

    /* Setup Workspace */
    $( 'div.googlemap.metadata' ).attr( 'class', 'googlemap' );
    $( 'div.toggler.metadata' ).css( 'height', '0px' );
    $( 'div.googlemap.googlemap' ).css( 'height', '0px' );
    $( 'div.panel.googlemap' ).css( 'height', '100%' ).css( 'margin-top', '-30px' );
    $( '#sidebar' ).attr( 'style', 'display: block; width: 50%;' );
    $( 'div.toggler.metadata' )[ 0 ].click();
    $( 'div.toggler.metadata' )[ 0 ].click();

    showUserSettings();

    $( "#autoAcceptInput" ).change( function() {
        var settingsCheck = localStorage.getItem( "autoAcceptInputSetting" );
        if ( settingsCheck == 'true' ) {
            localStorage.setItem( "autoAcceptInputSetting", "false" );
        } else {
            localStorage.setItem( "autoAcceptInputSetting", "true" );
        }
    } );
    $( "#autoZoomInput" ).change( function() {
        var settingsCheck = localStorage.getItem( "autoZoomInputSetting" );
        if ( settingsCheck == 'true' ) {
            localStorage.setItem( "autoZoomInputSetting", "false" );
        } else {
            localStorage.setItem( "autoZoomInputSetting", "true" );
        }
    } );
    $( "#autoGoogleInput" ).change( function() {
        var settingsCheck = localStorage.getItem( "autoGoogleInputSetting" );
        if ( settingsCheck == 'true' ) {
            localStorage.setItem( "autoGoogleInputSetting", "false" );
        } else {
            localStorage.setItem( "autoGoogleInputSetting", "true" );
        }
    } );
    $( "#autoLocatorInput" ).change( function() {
        var settingsCheck = localStorage.getItem( "autoLocatorInputSetting" );
        if ( settingsCheck == 'true' ) {
            localStorage.setItem( "autoLocatorInputSetting", "false" );
        } else {
            localStorage.setItem( "autoLocatorInputSetting", "true" );
        }
    } );
    $( "#currentStoreSelect" ).change( function() {
        $( "#currentStoreSelect option:selected" ).each( function() {
            localStorage.setItem( "currentStoreSelectSetting", $( this ).val() );
        } );
    } );

    /* Details Container */
    detailsDiv = $( "<div>" )
        .css( 'position', "relative" )
        .css( 'z-index', '1000' )
        .css( 'width', '80%' )
        .css( 'margin', '0 auto' )
        .css( 'left', '150px' )
        .css( 'top', "-60px" )
        .css( 'padding', "3px" )
        .css( 'background-color', "#f8f8f8" )
        .append(
            $( "<table>" )
            .html( "<tr><td><b>Name: </b></td><td style=' padding-left:10px;'>" + companyName + "</td>" +
                "<td style=' padding-left:20px;'><b>Address: </b></td><td style=' padding-left:10px;'>" + companyAddress + "</td>" +
                "<td style=' padding-left:20px;'><b>Locality: </b></td><td style=' padding-left:10px;'>" + companyLocality + "</td>" +
                "<td style=' padding-left:20px;'><b>Region: </b></td><td style=' padding-left:10px;'>" + companyRegion + "</td>" +
                "<td style=' padding-left:20px;'><b>Postcode: </b></td><td style=' padding-left:10px;'>" + companyPostcode + "</td></tr>" )
            .css( 'margin', '0 auto' )
            .css( 'text-align', 'center' )
    );

    $( "body" ).append( detailsDiv );

    /* Help Container */
    helpDiv = $( "<div>" )
        .css( 'position', "relative" )
        .css( 'z-index', '1000' )
        .css( 'width', '500px' )
        .css( 'margin', '0 auto' )
        .css( 'bottom', "0" )
        .css( 'padding', "20px" )
        .css( 'background-color', "#f8f8f8" )
        .css( 'display', 'block' )
        .append(
            $( "<table>" )
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

    $( "body" ).append( helpDiv );
    helpDiv.toggle();

    /* Load Crosshairs */
    /*
    crossHairs = $( '<img src="http://i.imgur.com/Vdyrvbg.png">' );
    crossHairs.css( 'position', "relative" );
    crossHairs.css( 'top', ($( window ).height()/2) -82);
    crossHairs.css( 'left', ($( window ).width()*3/4)-9);
    crossHairs.css( 'z-index', '2000' );
    $( crossHairs ).appendTo( 'body' );*/

    /* Load Cursor Mirror */
    cursorImage = $( '<img src="http://i.imgur.com/ROsM1D4.png">' );
    cursorImage.css( 'position', "relative" );
    cursorImage.css( 'top', '-100px' );
    cursorImage.css( 'left', '0px' );
    cursorImage.css( 'z-index', '2000' );
    $( cursorImage ).appendTo( 'body' );
    cursorImage.toggle();

    /* Move the cursor mirror */
    $( "body" ).mousemove( function( event ) {
        currentMouseXPos = event.pageX;
        currentMouseYPos = event.pageY;
        if ( mirrorFlag && event.pageX <= ( $( window ).width() - $( '#sidebar' ).width() - 20 ) ) {
            xOffset = $( window ).width() / 2;
            cursorImage.css( 'left', event.pageX - 8 + xOffset + xOffsetManual );
            cursorImage.css( 'top', event.pageY - 108 + yOffsetManual );
        }
    } );

    buildingButton = $( 'a:contains("building")' ).eq( 0 );
    areaButton = $( 'a:contains("area")' ).eq( 0 );
    polygonButton = $( 'a.leaflet-draw-draw-polygon' ).eq( 0 );
    cancelButton = $( 'a[title="Cancel drawing"]' ).eq( 0 );
    deleteButton = $( 'a[title="Delete last point drawn"]' ).eq( 0 );

    if ( localStorage.getItem( "autoZoomInputSetting" ) == 'true' ) {
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
        if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'BP' ) {
            window.open( 'http://stationfinder.mybpstation.com/?zip=' + companyPostcode, 'locator' );
        } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'JC' ) {
            window.open( 'http://www.jcpenney.com/dotcom/jsp/storelocator/storeResults.jsp?zip=' + companyPostcode, 'locator' );
        } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'Arbys' ) {
            window.open( 'http://arbys.com/locations/?origin=' + companyAddress + ' ' + companyPostcode, 'locator' );
        } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'FD' ) {
            window.open( 'http://www.familydollar.com/pages/store-locator.aspx/?origin=' + companyPostcode, 'locator' );
        } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'PH' ) {
            window.open( 'https://order.pizzahut.com/site/locator?origin=' + companyPostcode, 'locator' );
        } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'NAPA' ) {
            window.open( 'http://www.napaonline.com/FindLocation/find-a-location.aspx?origin=' + companyPostcode, 'locator' );
        } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'DT' ) {
            window.open( 'http://www.deltaco.com/index.html?origin=' + companyPostcode, 'locator' );
        } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'AZ' ) {
            window.open( 'http://www.autozone.com/autozone/storelocator/storeLocatorMain.jsp??origin=' + companyPostcode, 'locator' );
        } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'TJM' ) {
            window.open( 'http://tjmaxx.tjx.com/store/stores/storeLocator.jsp?origin=' + companyPostcode, 'locator' );
        } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'DG' ) {
            window.open( 'http://www.dollargeneral.com/storeLocator/?origin=' + companyAddress + ' ' + companyPostcode, 'locator' );
        } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'ATF' ) {
            window.open( 'http://www.anytimefitness.com/find-gym?origin=' + companyPostcode, 'locator' );
        } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'SF' ) {
            window.open( 'http://www.snapfitness.com/gyms?origin=' + companyPostcode, 'locator' );
        } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'NYCO' ) {
            window.open( 'http://www.nyandcompany.com/nyco/locations/?origin=' + companyPostcode, 'locator' );
        } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'GG' ) {
            window.open( 'http://www.goldsgym.com/locate-a-gym/?origin=' + companyPostcode, 'locator' );
        } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'RS' ) {
            window.open( 'http://www.rossstores.com/locator.aspx?origin=' + companyPostcode, 'locator' );
        } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'Caseys' ) {
            window.open( 'https://www.caseys.com/locations?origin=' + companyPostcode, 'locator' );
        } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'AH' ) {
            window.open( 'http://www.acehardware.com/mystore/storeLocator.jsp?origin=' + companyPostcode, 'locator' );
        } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'PC' ) {
            window.open( 'http://www.partycity.com/store-locator/landing.do?origin=' + companyPostcode, 'locator' );
        } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'FL' ) {
            window.open( 'http://www.foodlion.com/Stores?origin=' + companyPostcode, 'locator' );
        } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'Staples' ) {
            window.open( 'http://storelocator.staples.com/?origin=' + companyPostcode, 'locator' );
        } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'OM' ) {
            window.open( 'http://storelocator.officedepot.com/consumer.html?form=locator_search&redirection=no&addressline=' + companyPostcode, 'locator' );
        } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'OD' ) {
            window.open( 'http://storelocator.officedepot.com/consumer.html?form=locator_search&redirection=no&addressline=' + companyPostcode, 'locator' );
        } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'GS' ) {
            window.open( 'http://www.gamestop.com/browse/storesearch.aspx?origin=' + companyPostcode, 'locator' );
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
            $( 'a:contains(work!)' )[ 0 ].click();
        }
    } else {
        /* Disable hotkeys if map search input is in focus */
        if ( $( "#pac-input" ).is( ":focus" ) ) {
            /* Disable hotkeys if submit or problem text areas are in focus */
        } else if ( $( 'textarea.form-control.comments' ).is( ':focus' ) ) {
            /* Hotkey Logic */
        } else {
            /* Variable to check if street view has been activated */
            var tempDivs = $( 'div.panel.googlemap' ).children();
            if ( i.keyCode == 191 && i.shiftKey === false ) { // /: Help
                helpDiv.toggle();
            }
            if ( i.keyCode == 49 ) { //1: Testing

            }
            if ( i.keyCode == 50 ) { //2: Select Building Polygon
                buildingButton[ 0 ].click();
                polygonButton = $( 'a.leaflet-draw-draw-polygon' ).eq( 0 );
                polygonButton[ 0 ].click();
            }
            if ( i.keyCode == 51 ) { //3: Select Area Polygon
                areaButton[ 0 ].click();
                polygonButton = $( 'a.leaflet-draw-draw-polygon' ).eq( 0 );
                polygonButton[ 0 ].click();
            }
            if ( i.keyCode == 52 ) { //4: Finish Task
                /* Check to see if the Finish button is visible */
                checkForComplete = $( 'a:contains("Finish")' ).css( 'display' );
                if ( checkForComplete == 'block' ) {
                    $( 'a:contains(Finish)' )[ 0 ].click();
                    checkForCompleteMessage();
                }
            }
            if ( i.keyCode == 53 ) { //5: Open Problem Window
                $( 'a:contains(Report problem)' )[ 0 ].click();
                checkForProblem();
            }
            if ( i.keyCode == 81 && i.shiftKey === false ) { //Q: Map Zoom Out
                currentWindowDivider = $( window ).width() - $( '#sidebar' ).width();
                if ( currentMouseXPos <= currentWindowDivider ) {
                    $( 'a.leaflet-control-zoom-out' )[ 0 ].click();
                } else if ( tempDivs.length == 1 ) {
                    $( 'div[title="Zoom out"]' )[ 0 ].click();
                } else if ( tempDivs.eq( 1 ).css( 'display' ) == 'none' ) {
                    $( 'div[title="Zoom out"]' )[ 0 ].click();
                } else {
                    $( 'div[title="Zoom out"]' )[ 1 ].click();
                }
            }
            if ( i.keyCode == 87 && i.shiftKey === false ) { //W: Map Zoom In
                currentWindowDivider = $( window ).width() - $( '#sidebar' ).width();
                if ( currentMouseXPos <= currentWindowDivider ) {
                    $( 'a.leaflet-control-zoom-in' )[ 0 ].click();
                } else if ( tempDivs.length == 1 ) {
                    $( 'div[title="Zoom in"]' )[ 0 ].click();
                } else if ( tempDivs.eq( 1 ).css( 'display' ) == 'none' ) {
                    $( 'div[title="Zoom in"]' )[ 0 ].click();
                } else {
                    $( 'div[title="Zoom in"]' )[ 1 ].click();
                }
            }
            if ( i.keyCode == 192 && i.shiftKey === false ) { //~: Toggle Map Proportions
                if ( mapToggle == 1 ) {
                    $( '#sidebar' ).attr( 'style', 'display: block; width: 50%;' );
                    $( 'div.toggler.metadata' )[ 0 ].click();
                    $( 'div.toggler.metadata' )[ 0 ].click();
                    mapToggle = 2;
                } else if ( mapToggle == 2 ) {
                    $( '#sidebar' ).attr( 'style', 'display: block; width: 30%;' );
                    $( 'div.toggler.metadata' )[ 0 ].click();
                    $( 'div.toggler.metadata' )[ 0 ].click();
                    mapToggle = 3;
                } else if ( mapToggle == 3 ) {
                    $( '#sidebar' ).attr( 'style', 'display: block; width: 70%;' );
                    $( 'div.toggler.metadata' )[ 0 ].click();
                    $( 'div.toggler.metadata' )[ 0 ].click();
                    mapToggle = 1;
                }
            }
            if ( i.keyCode == 82 ) { //R: Delete Last Point
                deleteButton = $( 'a[title="Delete last point drawn"]' ).eq( 0 );
                deleteButton[ 0 ].click();
            }
            if ( i.keyCode == 27 ) { //Esc: Cancel Current Polygon
                cancelButton = $( 'a[title="Cancel drawing"]' ).eq( 0 );
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
                    xOffset = $( window ).width() / 2;
                    cursorImage.attr( "src", "http://i.imgur.com/nhi1D7M.png" );
                } else {
                    mirrorColorFlag = 1;
                    xOffset = $( window ).width() / 2;
                    cursorImage.attr( "src", "http://i.imgur.com/ROsM1D4.png" );
                }
            }
            if ( i.keyCode == 70 ) { //F: Store Search

                if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'BP' ) {
                    window.open( 'http://stationfinder.mybpstation.com/?zip=' + companyPostcode, 'locator' );
                } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == "JC" ) {
                    window.open( 'http://www.jcpenney.com/dotcom/jsp/storelocator/storeResults.jsp?zip=' + companyPostcode, 'locator' );
                } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'Arbys' ) {
                    window.open( 'http://arbys.com/locations/?origin=' + companyAddress + ' ' + companyPostcode, 'locator' );
                } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'FD' ) {
                    window.open( 'http://www.familydollar.com/pages/store-locator.aspx/?origin=' + companyPostcode, 'locator' );
                } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'PH' ) {
                    window.open( 'https://order.pizzahut.com/site/locator?origin=' + companyPostcode, 'locator' );
                } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'NAPA' ) {
                    window.open( 'http://www.napaonline.com/FindLocation/find-a-location.aspx?origin=' + companyPostcode, 'locator' );
                } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'DT' ) {
                    window.open( 'http://www.deltaco.com/index.html?origin=' + companyPostcode, 'locator' );
                } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'AZ' ) {
                    window.open( 'http://www.autozone.com/autozone/storelocator/storeLocatorMain.jsp??origin=' + companyPostcode, 'locator' );
                } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'TJM' ) {
                    window.open( 'http://tjmaxx.tjx.com/store/stores/storeLocator.jsp?origin=' + companyPostcode, 'locator' );
                } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'DG' ) {
                    window.open( 'http://www.dollargeneral.com/storeLocator/?origin=' + companyAddress + ' ' + companyPostcode, 'locator' );
                } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'ATF' ) {
                    window.open( 'http://www.anytimefitness.com/find-gym?origin=' + companyPostcode, 'locator' );
                } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'SF' ) {
                    window.open( 'http://www.snapfitness.com/gyms?origin=' + companyPostcode, 'locator' );
                } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'NYCO' ) {
                    window.open( 'http://www.nyandcompany.com/nyco/locations/?origin=' + companyPostcode, 'locator' );
                } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'GG' ) {
                    window.open( 'http://www.goldsgym.com/locate-a-gym/?origin=' + companyPostcode, 'locator' );
                } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'RS' ) {
                    window.open( 'http://www.rossstores.com/locator.aspx?origin=' + companyPostcode, 'locator' );
                } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'Caseys' ) {
                    window.open( 'https://www.caseys.com/locations?origin=' + companyPostcode, 'locator' );
                } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'AH' ) {
                    window.open( 'http://www.acehardware.com/mystore/storeLocator.jsp?origin=' + companyPostcode, 'locator' );
                } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'PC' ) {
                    window.open( 'http://www.partycity.com/store-locator/landing.do?origin=' + companyPostcode, 'locator' );
                } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'FL' ) {
                    window.open( 'http://www.foodlion.com/Stores?origin=' + companyPostcode, 'locator' );
                } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'Staples' ) {
                    window.open( 'http://storelocator.staples.com/?origin=' + companyPostcode, 'locator' );
                } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'OM' ) {
                    window.open( 'http://storelocator.officedepot.com/consumer.html?form=locator_search&redirection=no&addressline=' + companyPostcode, 'locator' );
                } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'OD' ) {
                    window.open( 'http://storelocator.officedepot.com/consumer.html?form=locator_search&redirection=no&addressline=' + companyPostcode, 'locator' );
                } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'GS' ) {
                    window.open( 'http://www.gamestop.com/browse/storesearch.aspx?origin=' + companyPostcode, 'locator' );
                }
            }
            if ( i.keyCode == 71 ) { //G: Google Search
                window.open( 'https://www.google.com/search?q=' + companyName + '+' + companyAddress + '+' + companyLocality, 'gsearch' );
            }
            if ( i.keyCode == 66 ) { //G: Bing Search
                window.open( 'http://www.bing.com/maps/default.aspx?q=' + companyAddress + '+' + companyLocality + '+' + companyRegion, 'bsearch' );
            }
            if ( i.keyCode == 32 ) { //Space: Map Search
                $( 'input.controls' ).val( companyName ); // + ' ' + companyAddress + ' ' + companyPostcode ); // + ' ' + companyAddress + ' ' + companyLocality);
                $( 'input.controls' ).focus();
                setTimeout( function() {
                    $( 'input.controls' ).blur();
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
        $( 'div[title="Zoom in"]' )[ 0 ].click();
        myTimerCount++;
    }
}

function myTimer2() {
    if ( myTimer2Count > 2 ) {
        clearInterval( myVar2 );
    } else {
        $( 'a.leaflet-control-zoom-in' )[ 0 ].click();
        myTimer2Count++;
    }
}

function checkForProblem() {

    if ( localStorage.getItem( 'ClosedURL' ) ) {
        $( 'span.clickable.label.label-default.problem.label-info' ).click();
        $( 'span[data-raw="Place has closed"]' ).click();
        $( 'textarea[placeholder="Additional Comments:"]' ).text( localStorage.getItem( 'ClosedURL' ) );
        setTimeout( function() {
            $( 'button:contains(Report)' )[ 0 ].click();
        }, 500 );
        localStorage.removeItem( "ClosedURL" );
    } else if ( localStorage.getItem( 'NotOnLocator' ) ) {
        $( 'span.clickable.label.label-default.problem.label-info' ).click();
        $( 'span[data-raw="Not on official locator"]' ).click();
        setTimeout( function() {
            $( 'button:contains(Report)' )[ 0 ].click();
        }, 500 );
        localStorage.removeItem( "NotOnLocator" );
    }
}

function checkForCompleteMessage() {
    if ( localStorage.getItem( 'BingURL' ) ) {
        $( 'textarea[placeholder="Enter your comments in here <Optional>"]' ).text( 'Confirmed on Bing maps: ' + localStorage.getItem( 'BingURL' ) );
        localStorage.removeItem( 'BingURL' );
    } else {

    }

    /*if ( mirrorFlag ) {
        $( 'textarea[placeholder="Enter your comments in here <Optional>"]' ).text( 'Estimated using Google map' );
    }*/
    setTimeout( function() {
        /* Check to see if the Confirm button is visible */
        var checkForConfirm = $( '#polygon-work-finish-modal' ).css( 'display' );
        if ( checkForConfirm == 'block' ) {
            $( 'button:contains(Confirm)' )[ 0 ].click();
        }
    }, 500 );
}

function checkForUpdateMessage() {
}