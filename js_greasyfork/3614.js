// ==UserScript==
// @author      Zachary Seeley
// @name        Polygons Script
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
// @match       http://hosted.where2getit.com/dennys/*
// @match       http://www.childrensplace.com/webapp/wcs/stores/servlet/*
// @match       https://www.riteaid.com/store-locator*
// @match       https://www.victoriassecret.com/store-locator*
// @match       http://www.footlocker.com/content/locator/*
// @match       http://www.radioshack.com/storeLocator3/*
// @match       http://www.greatclips.com/salon-locator?*
// @match       http://www.urbanspoon.com/*
// @match       https://work4.factual.com/robots.txt?url=*
// @match       http://www.yelp.com/*
// @match       https://foursquare.com/*
// @match       http://www.citysearch.com/*
// @match       http://www.bing.com/maps/*
// @copyright   © 2014, J&E Data Solutions
// @version     2.5
// @downloadURL https://update.greasyfork.org/scripts/3614/Polygons%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/3614/Polygons%20Script.meta.js
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
    } else if ( pageCheck == 'stationfinder.mybpstation.com' ) {
        document.addEventListener( "keydown", elBP, false );
        currentPT2 = ( window.location.href ).split( "=" );
        jQueryLatest( '#zip' ).val( currentPT2[ 1 ] );
    } else if ( pageCheck == 'www.jcpenney.com' ) {
        document.addEventListener( "keydown", elJC, false );
        currentPT2 = ( window.location.href ).split( "=" );
        jQueryLatest( '#searchStore' ).val( currentPT2[ 1 ] );
    } else if ( pageCheck == 'www.familydollar.com' ) {
        currentPT2 = ( window.location.href ).split( "=" );
        jQueryLatest( '#FindStorePostalCode' ).val( currentPT2[ 1 ] );
        jQueryLatest( '#btnFindStorePostalCode' ).click();
    } else if ( pageCheck == 'order.pizzahut.com' ) {
        currentPT2 = ( window.location.href ).split( "=" );
        jQueryLatest( 'input[type="zip"]' ).val( currentPT2[ 1 ] );
        jQueryLatest( 'input[type="zip"]' ).focus();
        document.addEventListener( "keydown", elPH, false );
    } else if ( pageCheck == 'www.napaonline.com' ) {
        //if ( jQueryLatest( document ).find( '#edCloseButton' ) ) jQueryLatest( '#edCloseButton' ).click();
        currentPT2 = ( window.location.href ).split( "=" );
        jQueryLatest( '#ctl00_ContentPlaceHolder1_txtAddress' ).val( currentPT2[ 1 ] );
        jQueryLatest( '#ctl00_ContentPlaceHolder1_btnGo' )[ 0 ].click();
        document.addEventListener( 'keydown', elNAPA, false );
    } else if ( pageCheck == 'www.autozone.com' ) {
        currentPT2 = ( window.location.href ).split( "=" );
        if ( currentPT2[ 1 ].length == 5 ) {
            jQueryLatest( '#zip' ).val( currentPT2[ 1 ] );
            setTimeout( function() {
                jQueryLatest( 'a.actionButton.orange.submit-link' )[ 0 ].click();
            }, 1000 );
        }
        document.addEventListener( 'keydown', elAZ, false );
    } else if ( pageCheck == 'tjmaxx.tjx.com' ) {
        currentPT2 = ( window.location.href ).split( "=" );
        if ( currentPT2[ 1 ].length == 5 ) {
            jQueryLatest( '#store-location-zip' ).val( currentPT2[ 1 ] );
            setTimeout( function() {
                jQueryLatest( 'input[name="submit"]' )[ 0 ].click();
            }, 1000 );
        }
        document.addEventListener( 'keydown', elTJM, false );
    } else if ( pageCheck == 'www.dollargeneral.com' ) {
        currentPT2 = ( window.location.href ).split( "=" );
        var cPT2 = currentPT2[ 1 ].replace( /%20/g, ' ' );
        jQueryLatest( '#store-search-zip' ).val( cPT2 );
        jQueryLatest( '#store-search-submit' )[ 0 ].click();
        document.addEventListener( 'keydown', elTJM, false );
    } else if ( pageCheck == 'www.anytimefitness.com' ) {
        document.addEventListener( 'keydown', elATF, false );
    } else if ( pageCheck == 'www.snapfitness.com' ) {
        currentPT2 = ( window.location.href ).split( "=" );
        var cPT2 = currentPT2[ 1 ];
        jQueryLatest( '#search' ).focus();
        jQueryLatest( '#search' ).val( cPT2 ).change();
        jQueryLatest( '#search' ).properties( cPT2 );
        jQueryLatest( '#submit' )[ 0 ].click();
        document.addEventListener( 'keydown', elSF, false );
    } else if ( pageCheck == 'www.nyandcompany.com' ) {
        currentPT2 = ( window.location.href ).split( "=" );
        var cPT2 = currentPT2[ 1 ].replace( /%20/g, ' ' );
        jQueryLatest( '#storeLocatorField' ).val( cPT2 );
        /*jQueryLatest(function() {
            jQueryLatest('#distance_from').filter(function() { 
                return (jQueryLatest(this).text() == '10 Miles');
            }).prop('selected', true);
        })*/
        jQueryLatest("#distance_from").val('35');
        jQueryLatest( '#findStore' )[ 0 ].click();
        document.addEventListener( 'keydown', elNYCO, false );
    } else if ( pageCheck == 'www.goldsgym.com' ) {
        currentPT2 = ( window.location.href ).split( "=" );
        var cPT2 = currentPT2[ 1 ].replace( /%20/g, ' ' );
        jQueryLatest( '#zip-input' ).val( cPT2 );
        jQueryLatest( 'input.search' )[ 0 ].click();
        document.addEventListener( 'keydown', elGG, false );
    } else if ( pageCheck == 'www.rossstores.com' ) {
        currentPT2 = ( window.location.href ).split( "=" );
        var cPT2 = currentPT2[ 1 ].replace( /%20/g, ' ' );
        jQueryLatest( '#inputaddress' ).attr( 'value', cPT2 );
        //jQueryLatest( '#locator_submit' )[ 0 ].click();
        document.addEventListener( 'keydown', elRS, false );
    } else if ( pageCheck == 'www.caseys.com' ) {
        currentPT2 = ( window.location.href ).split( "=" );
        var cPT2 = currentPT2[ 1 ].replace( /%20/g, ' ' );
        jQueryLatest( '#locator' ).val( cPT2 );
        jQueryLatest( '#locator' ).focus();
        jQueryLatest( '#submitter' ).submit();
        document.addEventListener( 'keydown', elCaseys, false );
    } else if ( pageCheck == 'www.acehardware.com' ) {
        currentPT2 = ( window.location.href ).split( "=" );
        var cPT2 = currentPT2[ 1 ].replace( /%20/g, ' ' );
        jQueryLatest( '#fldAddress' ).val( cPT2 );
        jQueryLatest( '#searchBtn' ).submit();
        document.addEventListener( 'keydown', elAce, false );
    } else if ( pageCheck == 'www.partycity.com' ) {
        currentPT2 = ( window.location.href ).split( "=" );
        var cPT2 = currentPT2[ 1 ].replace( /%20/g, ' ' );
        jQueryLatest( '#eslSearchInput1' ).val( cPT2 );
        setTimeout( function() {
            jQueryLatest( '#eslSearchButton1' ).click();
        }, 1000 );
        document.addEventListener( 'keydown', elPC, false );
    } else if ( pageCheck == 'www.foodlion.com' ) {
        currentPT2 = ( window.location.href ).split( "=" );
        var cPT2 = currentPT2[ 1 ].replace( /%20/g, ' ' );
        jQueryLatest( '#Zip' ).val( cPT2 );
        setTimeout( function() {
            console.log('click');
            jQueryLatest( '#searchStores' ).click();
        }, 2000 );
        document.addEventListener( 'keydown', elFL, false );
    } else if ( pageCheck == 'storelocator.staples.com' ) {
        currentPT2 = ( window.location.href ).split( "=" );
        var cPT2 = currentPT2[ 1 ].replace( /%20/g, ' ' );
        jQueryLatest( '#addressInput' ).val( cPT2 );
        //setTimeout( function() {
            //console.log('click');
            jQueryLatest( '#searchButton' ).click();
        //}, 2000 );
        document.addEventListener( 'keydown', elStaples, false );
    } else if ( pageCheck == 'www.officedepot.com' ) {
        setTimeout( function() {
            currentPT2 = ( window.location.href ).split( "=" );
            var cPT2 = currentPT2[ 1 ].replace( /%20/g, ' ' );
            jQueryLatest( '#inputaddress' ).val( cPT2 );
            //
               console.log('click');
            jQueryLatest( '#locator_submit2' ).click();
        }, 2000 );
        document.addEventListener( 'keydown', elOfficeDepot, false );
    } else if ( pageCheck == 'www.officemax.com' ) {
        currentPT2 = ( window.location.href ).split( "=" );
        var cPT2 = currentPT2[ 1 ].replace( /%20/g, ' ' );
        jQueryLatest( '#search-store-zipcode' ).val( cPT2 );
        /*setTimeout( function() {
        //    console.log('click');
            jQueryLatest( 'input[name="/officemax/uep/storelocator/StoreLocatorFormHandler.getBestStores"]' ).click();
        }, 2000 );*/
        document.addEventListener( 'keydown', elOfficeMax, false );
    } else if ( pageCheck == 'www.gamestop.com' ) {
        currentPT2 = ( window.location.href ).split( "=" );
        var cPT2 = currentPT2[ 1 ].replace( /%20/g, ' ' );
        jQueryLatest( '#ctl00_ctl00_BaseContentPlaceHolder_mainContentPlaceHolder_StoreSearchControl_EnterZipTextBox' ).val( cPT2 );
        
        //setTimeout( function() {
            unsafeWindow.WebForm_DoPostBackWithOptions(new WebForm_PostBackOptions("ctl00jQueryLatestctl00jQueryLatestBaseContentPlaceHolderjQueryLatestmainContentPlaceHolderjQueryLatestStoreSearchControljQueryLatestFindZipButton", "", true, "StoreSearch", "", false, true));
            //jQueryLatest( 'a.zip_find' ).click();
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
            jQueryLatest( 'input.location_input_text' ).val( currentPT2[ 1 ] );
            jQueryLatest( 'input.location_submit_go' )[ 0 ].click();
        } else {

            document.addEventListener( "keydown", elDT, false );
        }
    } else if ( pageCheck == 'hosted.where2getit.com' ) {
        setTimeout( function() {
            currentPT2 = ( window.location.href ).split( "addressline=" );
            var cPT3 = currentPT2[1].slice(0,5);
            jQueryLatest( '#inputaddress' ).val( cPT3 );
            jQueryLatest( '#locator_submit' ).click();
        }, 2000 );
        document.addEventListener( 'keydown', elDennys, false );
    } else if ( pageCheck == 'www.childrensplace.com' ) {
        currentPT2 = ( window.location.href ).split( "origin=" );
        jQueryLatest( '#input_by_add' ).val( currentPT2[1] );
        jQueryLatest( '#search-by-address-submit' )[0].click();
        document.addEventListener( 'keydown', elChildrensPlace, false );
    } else if ( pageCheck == 'www.riteaid.com' ) {
        /*currentPT2 = ( window.location.href ).split( "origin=" );
        if ( currentPT2[ 1 ].length == 5 ) {
            jQueryLatest( '#searchString' ).val( currentPT2[1] );
            unsafeWindow.searchStore('https://www.riteaid.com/store-locator?p_p_id=riteaidstorelocator_WAR_riteaidstorelocatorportlet&amp;p_p_lifecycle=1&amp;p_p_state=normal&amp;p_p_mode=view&amp;p_p_col_id=column-1&amp;p_p_col_pos=1&amp;p_p_col_count=2&amp;_riteaidstorelocator_WAR_riteaidstorelocatorportlet_action=makeStoreSearchURL&amp;_riteaidstorelocator_WAR_riteaidstorelocatorportlet_defaultParameter=defaultParameter');
            //jQueryLatest( '#search-by-address-submit' )[0].click();
        }*/
        document.addEventListener( 'keydown', elRiteAid, false );
    } else if ( pageCheck == 'www.victoriassecret.com' ) {
        currentPT2 = ( window.location.href ).split( "origin=" );
        //if ( currentPT2[ 1 ].length == 5 ) {
            jQueryLatest( '#sl-search' ).val( currentPT2[1] );
            //unsafeWindow.searchStore('https://www.riteaid.com/store-locator?p_p_id=riteaidstorelocator_WAR_riteaidstorelocatorportlet&amp;p_p_lifecycle=1&amp;p_p_state=normal&amp;p_p_mode=view&amp;p_p_col_id=column-1&amp;p_p_col_pos=1&amp;p_p_col_count=2&amp;_riteaidstorelocator_WAR_riteaidstorelocatorportlet_action=makeStoreSearchURL&amp;_riteaidstorelocator_WAR_riteaidstorelocatorportlet_defaultParameter=defaultParameter');
            jQueryLatest( '#locate-button' )[0].click();
        //}
        document.addEventListener( 'keydown', elVictoriasSecret, false );
    } else if ( pageCheck == 'www.footlocker.com' ) {
        document.addEventListener( 'keydown', elFootLocker, false );
    } else if ( pageCheck == 'www.radioshack.com' ) {
        currentPT2 = ( window.location.href ).split( "origin=" );
        jQueryLatest( '#store-search-zip' ).val( currentPT2[1] );
        jQueryLatest( '#store-search-submit' )[0].click();
        document.addEventListener( 'keydown', elRadioShack, false );
    } else if ( pageCheck == 'www.greatclips.com' ) {
        document.addEventListener( 'keydown', elRadioShack, false );
    } else if ( pageCheck == 'www.urbanspoon.com' || pageCheck == 'foursquare.com' || pageCheck == 'www.yelp.com' || pageCheck == 'www.citysearch.com' ) {
        document.addEventListener( "keydown", elUS, false );
    }
}
http://www.greatclips.com/salon-locator?
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

function elDennys( i ) {
    if ( i.keyCode == 53 ) { //5: Send errorr variable
        window.open( 'https://work4.factual.com/robots.txt?src=Locator&url=' + window.location, '_blank' );
    }
}

function elChildrensPlace( i ) {
    if ( i.keyCode == 53 ) { //5: Send errorr variable
        window.open( 'https://work4.factual.com/robots.txt?src=Locator&url=' + window.location, '_blank' );
    }
}


function elRadioShack( i ) {
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

function elRiteAid( i ) {
    if ( i.keyCode == 53 ) { //5: Send errorr variable
        window.open( 'https://work4.factual.com/robots.txt?src=Locator&url=' + window.location, '_blank' );
    }
}

function elVictoriasSecret( i ) {
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
        jQueryLatest( '#zip' ).focus();
    }
}

function elJC( i ) {
    if ( i.keyCode == 13 ) { //Enter: Submit ZIP
        //jQueryLatest( '#searchStore' ).focus();
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
            jQueryLatest( 'input[type="submit"]' ).click();
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
    currentStoreSelect.options.add( store10 );
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
    var store24 = new Option();
    store24.value = 'Dennys';
    store24.text = 'Dennys';
    currentStoreSelect.options.add( store24 );
    var store25 = new Option();
    store25.value = 'ChildrensPlace';
    store25.text = 'Childrens Place';
    currentStoreSelect.options.add( store25 );
    var store26 = new Option();
    store26.value = 'RiteAid';
    store26.text = 'Rite Aid';
    currentStoreSelect.options.add( store26 );*/
    var store27 = new Option();
    store27.value = 'VictoriasSecret';
    store27.text = 'Victorias Secret';
    currentStoreSelect.options.add( store27 );
    var store28 = new Option();
    store28.value = 'FootLocker';
    store28.text = 'Foot Locker';
    currentStoreSelect.options.add( store28 );
    var store29 = new Option();
    store29.value = 'GreatClips';
    store29.text = 'Great Clips';
    currentStoreSelect.options.add( store29 );
    var store30 = new Option();
    store30.value = 'RadioShack';
    store30.text = 'RadioShack';
    currentStoreSelect.options.add( store30 );

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

    jQueryLatest( 'body' ).append( userSettingsDiv );
    jQueryLatest( '.userSettingsDiv' ).append( autoAcceptInput );
    jQueryLatest( '.userSettingsDiv' ).append( document.createTextNode( ' - Grind Mode ' ) );
    jQueryLatest( '.userSettingsDiv' ).append( autoGoogleInput );
    jQueryLatest( '.userSettingsDiv' ).append( document.createTextNode( ' - Auto Google Search ' ) );
    jQueryLatest( '.userSettingsDiv' ).append( currentStoreSelect );
    jQueryLatest( '.userSettingsDiv' ).append( document.createElement( 'br' ) );
    jQueryLatest( '.userSettingsDiv' ).append( autoZoomInput );
    jQueryLatest( '.userSettingsDiv' ).append( document.createTextNode( ' - Auto Zoom ' ) );
    jQueryLatest( 'div.userSettingsDiv' ).append( autoLocatorInput );
    jQueryLatest( '.userSettingsDiv' ).append( document.createTextNode( ' - Auto Locator Search ' ) );
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

    jQueryLatest( '.map-notes' ).attr( 'style', 'position:relative; margin-left: 200px; z-index:3000; width: 200px;' );
    
    jQueryLatest( 'span:contains("Cannot find the correct place")' ).click( function() {
        var problemCheck = jQueryLatest( '.label-info:contains("Cannot find the correct place")' ).text().trim();
        if ( jQueryLatest( this ).text() == "Cannot find the correct place" && problemCheck ) {
            jQueryLatest( '.btn.btn-primary:contains("Report")' ).css( 'background-color', '#B13232' );
            jQueryLatest( '.btn.btn-primary:contains("Report")' ).css( 'border-color', '#BD3535' );
            jQueryLatest( '.btn.btn-primary:contains("Report")' ).text( 'COMMENT REQUIRED' );//.attr( 'style', 'display: none;' );
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
        } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'Dennys' ) {
            window.open( 'http://hosted.where2getit.com/dennys/2014/?form=locator_search&addressline=' + companyPostcode + '&searchradius=25&search=&geoip=1', 'locator' );
        } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'ChildrensPlace' ) {
            window.open( 'http://www.childrensplace.com/webapp/wcs/stores/servlet/AjaxStoreLocatorDisplayView?catalogId=10552&langId=-1&storeId=10152&origin=' + companyPostcode, 'locator' );
        } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'RiteAid' ) {
            window.open( 'https://www.riteaid.com/store-locator?searchByStoreNumberOnly=N&searchString=' + companyPostcode + '&searchRadius=25&', 'locator' );
        } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'VictoriasSecret' ) {
            window.open( 'https://www.victoriassecret.com/store-locator?origin=' + companyPostcode, 'locator' );
        } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'FootLocker' ) {
            window.open( 'http://www.footlocker.com/content/locator/#d=' + companyPostcode, 'locator' );
        } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'RadioShack' ) {
            window.open( 'http://www.radioshack.com/storeLocator3/?origin=' + companyPostcode, 'locator' );
        } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'GreatClips' ) {
            window.open( 'http://www.greatclips.com/salon-locator?&q=' + companyPostcode, 'locator' );
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
                } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'Dennys' ) {
                    window.open( 'http://hosted.where2getit.com/dennys/2014/?form=locator_search&addressline=' + companyPostcode + '&searchradius=25&search=&geoip=1', 'locator' );
                } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'ChildrensPlace' ) {
                    window.open( 'http://www.childrensplace.com/webapp/wcs/stores/servlet/AjaxStoreLocatorDisplayView?catalogId=10552&langId=-1&storeId=10152&origin=' + companyPostcode, 'locator' );
                } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'RiteAid' ) {
                    window.open( 'https://www.riteaid.com/store-locator?searchByStoreNumberOnly=N&searchString=' + companyPostcode + '&searchRadius=25&', 'locator' );
                } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'VictoriasSecret' ) {
                    window.open( 'https://www.victoriassecret.com/store-locator?origin=' + companyPostcode, 'locator' );
                } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'FootLocker' ) {
                    window.open( 'http://www.footlocker.com/content/locator/#d=' + companyPostcode, 'locator' );
                } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'RadioShack' ) {
                    window.open( 'http://www.radioshack.com/storeLocator3/?origin=' + companyPostcode, 'locator' );
                } else if ( localStorage.getItem( "currentStoreSelectSetting" ) == 'GreatClips' ) {
                    window.open( 'http://www.greatclips.com/salon-locator?&q=' + companyPostcode, 'locator' );
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
    if ( localStorage.getItem( 'Polygons-v25' ) === null ) {
        alert( 'The Polygons Script has been updated to version 2.5\n\n Added Great Clips. \n\n' +
            'Great Clips searches automatically. \n\n' +
             'This message should only display once. Contact Zachary if it continues to show.');
        localStorage.setItem( 'Polygons-v25', true );
    }
    if ( localStorage.getItem( 'Polygons-v24' ) === null ) {
        alert( 'The Polygons Script has been updated to version 2.4\n\n Added Radio Shack and new search features. \n\n' +
            'Radio Shack searches automatically. \n\n' +
            'G now searches for lease plans on ShowCase, CityFeet, and LoopNet. \n\n' +
            'Highlight the name of a mall/shopping center in the locator, press G, and it will search for a leasing plan. \n\n' +
             'This message should only display once. Contact Zachary if it continues to show.');
        localStorage.setItem( 'Polygons-v24', true );
    }
    if ( localStorage.getItem( 'Polygons-v23' ) === null ) {
        alert( 'The Polygons Script has been updated to version 2.3\n\n Added Victoria\'s Secret and Foot Locker \n\n' +
            'Victoria\'s Secret searches automatically. \n\n' +
            'Foot Locker searches automatically. \n\n' +
             'This message should only display once. Contact Zachary if it continues to show.');
        localStorage.setItem( 'Polygons-v23', true );
    }
    if ( localStorage.getItem( 'Polygons-v21' ) === null ) {
        alert( 'The Polygons Script has been updated to version 2.1\n\n Added The Children\'n Place and RiteAid \n\n' +
            'The Children\'s Place searches automatically. \n\n' +
            'RiteAid searches automatically. \n\n' +
             'This message should only display once. Contact Zachary if it continues to show.');
        localStorage.setItem( 'Polygons-v21', true );
    }
    if ( localStorage.getItem( 'Polygons-v20' ) === null ) {
        alert( 'The Polygons Script has been updated to version 2.0\n\n Added Dennys and fixed address bar \n\n' +
            'Dennys searches automatically. \n\n' +
             'This message should only display once. Contact Zachary if it continues to show.');
        localStorage.setItem( 'Polygons-v20', true );
    }
    if ( localStorage.getItem( 'Polygons-v17a' ) === null ) {
        alert( 'The Polygons Script has been updated to version 1.7\n\n Added Staples, Office Depot, Office Max \n\n' +
            'Staples searches automatically, store details page has picture of storefront. \n\n' +
             'Office Depot and Office Max run off the same locator. Store details page has picture of storefront. \n\n' +
             'This message should only display once. Contact Zachary if it continues to show.');
        localStorage.setItem( 'Polygons-v17a', true );
    }
    if ( localStorage.getItem( 'Polygons-v18' ) === null ) {
        alert( 'The Polygons Script has been updated to version 1.8\n\n Added GameStop \n\n' +
            'GameStop searches automatically(WOOT!) \n\n' +
             'This message should only display once. Contact Zachary if it continues to show.');
        localStorage.setItem( 'Polygons-v18', true );
    }
    if ( localStorage.getItem( 'Polygons-v16' ) === null ) {
        alert( 'The Polygons Script has been updated to version 1.5\n\n Removed locators for old stores. Added locators for new stores. \n\n' +
            'Ace Hardware searches automatically. \n\n' +
             'Party City searches automatically \n\n' +
             'Food Lion requires you to click "Search". \n\n' +
             'This message should only display once. Contact Zachary if it continues to show.');
        localStorage.setItem( 'Polygons-v16', true );
    }
    if ( localStorage.getItem( 'Polygons-v14' ) === null ) {
        alert( 'The Polygons Script has been updated to version 1.4\n\n Added locators for new stores. \n\n' +
            'For Caseys, you need to hit enter to submit the search. \n\n' +
             'NY and Co submits automatically. \n\n' +
             'Golds Gym submits automatically. \n\n' +
             'Ross needs the ZIP input manually, you can grab it from the URL. \n\n' +
             'This message should only display once. Contact Zachary if it continues to show.');
        localStorage.setItem( 'Polygons-v14', true );
    }
    if ( localStorage.getItem( 'Polygons-v13' ) === null ) {
        alert( 'The Polygons Script has been updated to version 1.3\n\n Fixed a bug with the address bar, expect it to break again soon when factual fixes their code. :P\n\n' +
            'This message should only display once. Contact Zachary if it continues to show.' );
        localStorage.setItem( 'Polygons-v13', true );
    }
    if ( localStorage.getItem( 'Polygons-v12a' ) === null ) {
        alert( 'The Polygons Script has been updated to version 1.2\n\n New to this version is the addition of an automatic comment when the mirror cursor is active.\n Also added Snap Fitness and Anytime Fitness.\n Snap fitness searches automatically.\n Anytime Fitness doesn\'t, grab the ZIP from the URL.\n\n' +
            'This message should only display once. Contact Zachary if it continues to show.' );
        localStorage.setItem( 'Polygons-v12a', true );
    }
    if ( localStorage.getItem( 'Polygons-v11' ) === null ) {
        alert( 'The Polygons Script has been updated to version 1.1\n\n New to this version is the addition of Dollar General, AutoZone, and TJ Maxx\n\n' +
            'This message should only display once. Contact Zachary if it continues to show.' );
        localStorage.setItem( 'Polygons-v11', true );
    }
    if ( localStorage.getItem( 'Polygons-v10' ) === null ) {
        alert( 'The Polygons Script has been updated to version 1.0\n\n New to this version is the addition of the \'B\' hotkey, which searches Bing Maps for the location.\n\n You can now triple-click on the address fields to select just that field.\n\n' +
            'This message should only display once. Contact Zachary if it continues to show.' );
        localStorage.setItem( 'Polygons-v10', true );
    }
    if ( localStorage.getItem( 'Polygons-v09c' ) === null ) {
        alert( 'The Polygons Script has been updated to version 0.9\n\n New to this version is the addition of NAPA and Del Taco locator searches. These searches submit automatically.\n\n Also added is a shortcut to report "Not on official locator". See the instructions for more information on how to use this feature.\n\n' +
            'This message should only display once. Contact Zachary if it continues to show.' );
        localStorage.setItem( 'Polygons-v09c', true );
    }
}