// ==UserScript==
// @author      Zachary Seeley
// @name        Top Records Script 4 Chris
// @namespace   http://www.jedatasolutions.com/
// @description Provides shortcuts and streamlines the workspace.
// @require     http://code.jquery.com/jquery-latest.min.js
// @match       https://work4.factual.com/*
// @copyright   © 2014, J&E Data Solutions
// @version     0.8
// @downloadURL https://update.greasyfork.org/scripts/3258/Top%20Records%20Script%204%20Chris.user.js
// @updateURL https://update.greasyfork.org/scripts/3258/Top%20Records%20Script%204%20Chris.meta.js
// ==/UserScript==

/*global $:false*/
"use strict";

var helpDiv;

/* Main Logic */
$( document ).ready( function() {

    /* Determine if we're on Factual website or Locator website */
    var domainCheck = location.hostname;

    if ( domainCheck == 'work4.factual.com' ) {

        factualInit();

    } else {

        //mirrorInit();

    }
} );

function factualInit() {

    /* Determine if we're on a record page or list page */
    var topRecordsListCheck = $( document ).find( 'h1:contains("You are working on Top Records")' ).text().trim();
    var topRecordsTaskCheck = $( document ).find( 'h5:contains("Top Records")' ).text().trim();

    if ( topRecordsListCheck ) {

        showUserSettings();
        topRecordsListInit();

    } else if ( topRecordsTaskCheck ) {

        /* Adjust the size of text and checkboxes according to saved preference */
        var fontSize = localStorage.getItem( "fontSizeSelectSetting" );
        var inputSize = localStorage.getItem( "inputSizeSelectSetting" );

        $( 'input.mark-canonical-btn' ).css( 'width', inputSize + 'px' );
        $( 'input.dupes-checkbox' ).css( 'width', inputSize + 'px' );
        $( 'input.mark-canonical-btn' ).css( 'height', inputSize + 'px' );
        $( 'input.dupes-checkbox' ).css( 'height', inputSize + 'px' );
        $( 'input[type=text]' ).css( 'font-size', fontSize + 'px' );
        $( 'input[type=text]' ).css( 'font-family', 'Verdana, Tahoma' );
        $( 'div.behemoth table' ).css( 'font-size', fontSize + 'px' );
        $( 'div.behemoth table' ).css( 'font-family', 'Verdana, Tahoma' );

        showUserSettings();
        topRecordsTaskInit();

    } else {

        // Do nothing
        console.log( 'Top Records script deactivated on this page' );

    }
}

function topRecordsListInit() {

    /* Color unfinished task buttons blue to match Polygons tasks */
    $( 'td.status' ).not( ':contains("Done")' ).not( ':contains("Problem")' ).parent().find( 'td.actions a' ).attr( 'style', 'background-color: #428bca; color: #FFFFFF;' );
    $( 'td.status:contains("Problem")' ).parent().find( 'td.actions a' ).attr( 'style', 'background-color: #ca4242; color: #FFFFFF;' );

    /* Check to see if Review mode or Grind mode are turned on */
    if ( localStorage.getItem( 'autoReviewInputSetting' ) == 'true' ) {

        //Do nothing, review mode is on.

    } else if ( localStorage.getItem( "autoAcceptTopRecordsInputSetting" ) == 'true' ) {

        /* See if all 10 records have been completed */
        var checkForDone = $( 'td.status' ).not( ':contains("Done")' );

        if ( checkForDone.length === 0 ) {

            //Do nothing, all records complete

        } else {

            /* Get the next button that isn't next to a 'Done' td */
            var nextRecord = $( 'td.status' ).not( ':contains("Done")' ).not( ':contains("Problem") ' ).eq( 0 ).parent().find( 'td.actions a' );

            /* If it exists, click it */
            if ( nextRecord ) {
                nextRecord[ 0 ].click();

            }
        }

    } else {

        //Do Nothing, not sure how this would happen.

    }

    /* Set Grind mode variable when checkbox is changed */
    $( "#autoAcceptTopRecordsInput" ).change( function() {

        var settingsCheck = localStorage.getItem( "autoAcceptTopRecordsInputSetting" );

        if ( settingsCheck == 'true' ) {

            localStorage.setItem( "autoAcceptTopRecordsInputSetting", "false" );

        } else {

            localStorage.setItem( "autoAcceptTopRecordsInputSetting", "true" );

        }
    } );

    /* Set Dynamic Columns variable when checkbox is changed */
    $( "#dynamicColumnsInput" ).change( function() {

        var settingsCheck = localStorage.getItem( "dynamicColumnsInputSetting" );

        if ( settingsCheck == 'true' ) {

            localStorage.setItem( "dynamicColumnsInputSetting", "false" );

        } else {

            localStorage.setItem( "dynamicColumnsInputSetting", "true" );

        }
    } );
    
    
    
    /* Set ifrm Toggle variable when new option is selected */
    $( "#ifrmToggleInput" ).change( function() {

        var settingsCheck = localStorage.getItem( "ifrmToggleInputSetting" );

        if ( settingsCheck == 'true' ) {

            localStorage.setItem( "ifrmToggleInputSetting", "false" );

        } else {

            localStorage.setItem( "ifrmToggleInputSetting", "true" );

        }
    } );

    /* Set Font Size variable when new option is selected */
    $( "#fontSizeSelect" ).change( function() {

        $( "#fontSizeSelect option:selected" ).each( function() {

            localStorage.setItem( "fontSizeSelectSetting", $( this ).val() );

            /* Update font sizes immediately */
            $( 'input[type=text]' ).css( 'font-size', $( this ).val() + 'px' );
            $( 'div.behemoth table' ).css( 'font-size', $( this ).val() + 'px' );

        } );
    } );

    /* Set Input Size variable when new option is selected */
    $( "#inputSizeSelect" ).change( function() {

        $( "#inputSizeSelect option:selected" ).each( function() {

            localStorage.setItem( "inputSizeSelectSetting", $( this ).val() );
            
            /* Update Input sizes immediately */
            $( 'input.mark-canonical-btn' ).css( 'width', $( this ).val() + 'px' );
            $( 'input.dupes-checkbox' ).css( 'width', $( this ).val() + 'px' );
            $( 'input.mark-canonical-btn' ).css( 'height', $( this ).val() + 'px' );
            $( 'input.dupes-checkbox' ).css( 'height', $( this ).val() + 'px' );
            
        } );
    } );

    /* Set Table Width variable when new option is selected */
    $( "#tableWidthSelect" ).change( function() {

        $( "#tableWidthSelect option:selected" ).each( function() {

            localStorage.setItem( "tableWidthSelectSetting", $( this ).val() );

            /* Reload page to show changes */
            location.reload();

        } );
    } );

    /* Set ifrm Height variable when new option is selected */
    $( "#ifrmHeightSelect" ).change( function() {

        $( "#ifrmHeightSelect option:selected" ).each( function() {

            localStorage.setItem( "ifrmHeightSelectSetting", $( this ).val() );

            /* Reload page to show changes */
            location.reload();

        } );
    } );
    
}

function topRecordsTaskInit() {
    
    
    $("#save-btn").click(function () {
        var categoryCheck = $( 'span.select2-chosen' ).text().trim();
        if ( categoryCheck ) {
            return true;
        } else {
            alert('YOU DIDN\'T SELECT A CATEGORY!!!\n\n SELECT A CATEGORY!!!');
            return false;
        }
        
    });
    
    /* Set columns to custom settings */
    resetColumns();

    /* Get rid of all the tiny scrollbars */
    $( 'td' ).css( 'overflow', 'hidden' );

    /* Setup div and table properties */
    var behemothDiv = $( 'div.behemoth' ),
        behemothDivWidth = behemothDiv.width(),
        behemothTable = $( 'div.behemoth table' ),
        behemothTableWidth = $( 'div table tbody tr' ).eq( 0 ).width();

    var firstLink = $( 'a:contains("Link")' ).attr( 'href' );
    var zoomFactor = ( ( behemothDivWidth + ( localStorage.getItem( 'tableWidthSelectSetting' ) * 30 ) ) / behemothTableWidth );
    var ifrmTop = $( 'tr.candidate[data-index="0"]' ).position();
    var ifrmTop2 = $( 'tr.candidate[data-index="0"]' ).height();
    var ifrmHeight = localStorage.getItem( 'ifrmHeightSelectSetting' );

    $( 'div.behemoth table tbody' ).css( 'background-color', '#FAFAFA' );

    behemothDiv.css( 'overflow', 'visible' );
    behemothDiv.css( 'margin-left', ( localStorage.getItem( 'tableWidthSelectSetting' ) * -15 ) + 'px' );
    behemothDiv.width( behemothTable.width() );
    behemothDiv.height( behemothTable.height() * zoomFactor * 0.9 );

    behemothTable.css( 'transform', 'scale(' + zoomFactor + ',' + zoomFactor + ')' );
    behemothTable.css( 'position', 'relative' );
    behemothTable.css( 'left', '0px' );
    behemothTable.css( 'margin-left', ( behemothTable.position().left * -1 ) );
    behemothTable.css( 'margin-top', ( behemothTable.position().top * -1 ) );

    /* Set Grind mode variable when checkbox is changed */
    $( "#autoAcceptTopRecordsInput" ).change( function() {

        var settingsCheck = localStorage.getItem( "autoAcceptTopRecordsInputSetting" );

        if ( settingsCheck == 'true' ) {

            localStorage.setItem( "autoAcceptTopRecordsInputSetting", "false" );

        } else {

            localStorage.setItem( "autoAcceptTopRecordsInputSetting", "true" );

        }
    } );

    /* Set Dynamic Columns variable when checkbox is changed */
    $( "#dynamicColumnsInput" ).change( function() {

        var settingsCheck = localStorage.getItem( "dynamicColumnsInputSetting" );

        if ( settingsCheck == 'true' ) {

            localStorage.setItem( "dynamicColumnsInputSetting", "false" );

        } else {

            localStorage.setItem( "dynamicColumnsInputSetting", "true" );

        }
    } );

    /* Set Font Size variable when new option is selected */
    $( "#fontSizeSelect" ).change( function() {

        $( "#fontSizeSelect option:selected" ).each( function() {

            localStorage.setItem( "fontSizeSelectSetting", $( this ).val() );

            /* Update font sizes immediately */
            $( 'input[type=text]' ).css( 'font-size', $( this ).val() + 'px' );
            $( 'div.behemoth table' ).css( 'font-size', $( this ).val() + 'px' );

        } );
    } );

    /* Set Input Size variable when new option is selected */
    $( "#inputSizeSelect" ).change( function() {

        $( "#inputSizeSelect option:selected" ).each( function() {

            localStorage.setItem( "inputSizeSelectSetting", $( this ).val() );
            
            /* Update Input sizes immediately */
            $( 'input.mark-canonical-btn' ).css( 'width', $( this ).val() + 'px' );
            $( 'input.dupes-checkbox' ).css( 'width', $( this ).val() + 'px' );
            $( 'input.mark-canonical-btn' ).css( 'height', $( this ).val() + 'px' );
            $( 'input.dupes-checkbox' ).css( 'height', $( this ).val() + 'px' );
            
        } );
    } );

    /* Set Table Width variable when new option is selected */
    $( "#tableWidthSelect" ).change( function() {

        $( "#tableWidthSelect option:selected" ).each( function() {

            localStorage.setItem( "tableWidthSelectSetting", $( this ).val() );

            /* Reload page to show changes */
            location.reload();

        } );
    } );

    /* Set ifrm Height variable when new option is selected */
    $( "#ifrmHeightSelect" ).change( function() {

        $( "#ifrmHeightSelect option:selected" ).each( function() {

            localStorage.setItem( "ifrmHeightSelectSetting", $( this ).val() );

            /* Reload page to show changes */
            location.reload();

        } );
    } );
    
    /* Set ifrm Toggle variable when new option is selected */
    $( "#ifrmToggleInput" ).change( function() {

        var settingsCheck = localStorage.getItem( "ifrmToggleInputSetting" );

        if ( settingsCheck == 'true' ) {

            localStorage.setItem( "ifrmToggleInputSetting", "false" );

        } else {

            localStorage.setItem( "ifrmToggleInputSetting", "true" );

        }
    } );

    /* Setup the link page iframe */
    var ifrm = document.createElement( 'iframe' );
    ifrm.setAttribute( 'src', firstLink );
    ifrm.setAttribute( 'id', 'ifrm' );
    ifrm.setAttribute( 'style', 'background-color:#FAFAFA; position: absolute; z-index:1001; width: ' + $( '#metal' ).width() * zoomFactor + 'px; height: ' + ifrmHeight + 'px; left:' + ifrmTop.left + 'px; top: 120px;' );
    if ( localStorage.getItem( 'ifrmToggleInputSetting' ) == 'true' ) {
        $( behemothDiv ).append( ifrm );
    }

    /* Setup the iframe toggle button */
    var ifrmButton = document.createElement( 'span' );
    ifrmButton.textContent = 'Toggle iframe';
    ifrmButton.setAttribute( 'class', 'ifrmButton' );
    ifrmButton.setAttribute( 'style', 'background-color: #D98F4F; color: #FFFFFF; padding: 6px 10px 7px 10px; font-family: Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 12px; line-height: 18px; border: 1px solid #D98F4F; border-radius: 4px; cursor: pointer; -webkit-user-select: none;' );
    ifrmButton.onclick = function() {
        $( '#ifrm' ).toggle();
    };
    $( 'div.center' ).append( ifrmButton );

    $( ".ifrmButton" ).hover( function() {
        console.log( 'hoveer' );
        ifrmButton.setAttribute( 'style', 'background-color: #BC7437; color: #FFFFFF; padding: 6px 10px 7px 10px; font-family: Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 12px; line-height: 18px; border: 1px solid #8F5523; border-radius: 4px; cursor: pointer; -webkit-user-select: none;' );
    }, function() {
        ifrmButton.setAttribute( 'style', 'background-color: #D98F4F; color: #FFFFFF; padding: 6px 10px 7px 10px; font-family: Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 12px; line-height: 18px; border: 1px solid #D98F4F; border-radius: 4px; cursor: pointer; -webkit-user-select: none;' );
    } );

    /* Shift the page upward to give more space to the table */
    $( '#main' ).css( 'margin-top', '-50px' );

    /* Help Container */
    helpDiv = $( "<div>" )
        .css( 'position', "relative" )
        .css( 'z-index', '9000' )
        .css( 'width', '500px' )
        .css( 'margin', '0 auto' )
        .css( 'bottom', "0" )
        .css( 'padding', "20px" )
        .css( 'background-color', "#f8f8f8" )
        .css( 'display', 'block' )
        .append(
            $( "<table>" )
            .html( "<tr style='background-color: #DDDDDD;'>" + "<td style=' padding-left:20px;'><strong>/</strong> - Toggle Help</td>" + "<td><strong></strong></td>" + "</tr>" +
                "<tr>" + "<td style=' padding-left:20px;'><strong>1</strong> - Save Record</td>" + "<td><strong>2</strong> - Report Problem(AHK Required)</td>" + "</tr>" +
                "<tr style='background-color: #DDDDDD;'>" + "<td style=' padding-left:20px;'><strong>3</strong> - Clear Canonical</td>" + "<td><strong>4</strong> - Toggle iframe</td>" + "</tr>" +
                "</table>" )
            .css( 'width', '100%' )
            .css( 'margin', '0 auto' )
    );

    $( "body" ).append( helpDiv );
    helpDiv.toggle();

    /* Start Dynamic Columns listeners if option is selected */
    if ( localStorage.getItem( 'dynamicColumnsInputSetting' ) == 'true' ) {
        loadDynamicColumns();
    }

    /* Make the page compatible with AHK macro */
    document.title = 'work4 top record';

    /* Listen for keypresses */
    document.addEventListener( "keydown", elTopRecord, false );

}

/* Keypress Handlers */
function elTopRecord( i ) {

    /* Disable hotkeys if textbox is selected */
    if ( $( ".form-control.metal-attr" ).is( ":focus" ) ) {

        // Do nothing

    } else if ( $( 'input.select2-input' ).is( ':focus' ) ) {
     
        // Do nothing
        
    } else {

        if ( i.keyCode == 191 && i.shiftKey === false ) { // /: Help

            helpDiv.toggle();

        }

        if ( i.keyCode == 49 ) { //1: Save

            var saveButton = $( '#save-btn' );

            saveButton.click();

        }

        if ( i.keyCode == 50 ) { //2: Reserved for AHK

            // Do nothing

        }

        if ( i.keyCode == 51 ) { //3: Clear canonical button

            $( '.mark-canonical-btn' ).each( function() {

                $( this ).prop( 'checked', false );

            } );
        }

        if ( i.keyCode == 52 ) { //4: Toggle iframe

            $( '#ifrm' ).toggle();

        }
        
        if ( i.keyCode == 69 ) { //E: Search for email

            var firstLink = $( 'a:contains("Link")' ).attr( 'href' );
            var secondLink = firstLink.split( 'www.' );
            var thirdLink = secondLink[1].split( '/' );
            var finalLink = thirdLink[0];
            
            window.open( 'https://www.google.com/search?q="*@' + finalLink + '"', 'gsearch' );

        }
    }
}

/* Display user settings at top-left */
function showUserSettings() {

    /* User Setting Elements */
    var userSettingsDiv = document.createElement( "DIV" ),
        autoAcceptTopRecordsInput = document.createElement( "INPUT" ),
        dynamicColumnsInput = document.createElement( "INPUT" ),
        fontSizeSelect = document.createElement( "select" ),
        inputSizeSelect = document.createElement( "select" ),
        tableWidthSelect = document.createElement( "select" ),
        ifrmHeightSelect = document.createElement( "select" ),
        ifrmToggleInput = document.createElement( 'input' );

    /* Container div setup */
    userSettingsDiv.setAttribute( 'class', 'userSettingsDiv' );
    userSettingsDiv.setAttribute( 'style', 'position: absolute; top: 0px; left: 20px; z-index: 1010; width: 600px; height: 50px; background-color: #f8f8f8' );

    /* Grind mode setup */
    autoAcceptTopRecordsInput.setAttribute( 'id', 'autoAcceptTopRecordsInput' );
    autoAcceptTopRecordsInput.type = "checkbox";
    autoAcceptTopRecordsInput.setAttribute( 'style', 'position: relative; z-index: 2011;' );

    /* Dynamic Columns setup */
    dynamicColumnsInput.setAttribute( 'id', 'dynamicColumnsInput' );
    dynamicColumnsInput.type = "checkbox";
    dynamicColumnsInput.setAttribute( 'style', 'position: relative; z-index: 2011;' );
    
    ifrmToggleInput.setAttribute( 'id', 'ifrmToggleInput' );
    ifrmToggleInput.type = "checkbox";
    ifrmToggleInput.setAttribute( 'style', 'position: relative; z-index: 2011;' );

    /* Font Size setup */
    fontSizeSelect.setAttribute( 'id', 'fontSizeSelect' );

    var fontSize1 = new Option();
    fontSize1.value = '8';
    fontSize1.text = '8';
    fontSizeSelect.options.add( fontSize1 );
    var fontSize2 = new Option();
    fontSize2.value = '10';
    fontSize2.text = '10';
    fontSizeSelect.options.add( fontSize2 );
    var fontSize3 = new Option();
    fontSize3.value = '12';
    fontSize3.text = '12';
    fontSizeSelect.options.add( fontSize3 );
    var fontSize4 = new Option();
    fontSize4.value = '14';
    fontSize4.text = '14';
    fontSizeSelect.options.add( fontSize4 );
    var fontSize5 = new Option();
    fontSize5.value = '16';
    fontSize5.text = '16';
    fontSizeSelect.options.add( fontSize5 );
    var fontSize6 = new Option();
    fontSize6.value = '18';
    fontSize6.text = '18';
    fontSizeSelect.options.add( fontSize6 );
    var fontSize7 = new Option();
    fontSize7.value = '20';
    fontSize7.text = '20';
    fontSizeSelect.options.add( fontSize7 );

    /* Input Size setup */
    inputSizeSelect.setAttribute( 'id', 'inputSizeSelect' );

    var inputSize1 = new Option();
    inputSize1.value = '10';
    inputSize1.text = '10';
    inputSizeSelect.options.add( inputSize1 );
    var inputSize2 = new Option();
    inputSize2.value = '12';
    inputSize2.text = '12';
    inputSizeSelect.options.add( inputSize2 );
    var inputSize3 = new Option();
    inputSize3.value = '14';
    inputSize3.text = '14';
    inputSizeSelect.options.add( inputSize3 );
    var inputSize4 = new Option();
    inputSize4.value = '16';
    inputSize4.text = '16';
    inputSizeSelect.options.add( inputSize4 );
    var inputSize5 = new Option();
    inputSize5.value = '18';
    inputSize5.text = '18';
    inputSizeSelect.options.add( inputSize5 );

    /* Table width setup */
    tableWidthSelect.setAttribute( 'id', 'tableWidthSelect' );

    var tableWidth1 = new Option();
    tableWidth1.value = '-2';
    tableWidth1.text = '-2';
    tableWidthSelect.options.add( tableWidth1 );
    var tableWidth2 = new Option();
    tableWidth2.value = '-1';
    tableWidth2.text = '-1';
    tableWidthSelect.options.add( tableWidth2 );
    var tableWidth3 = new Option();
    tableWidth3.value = '0';
    tableWidth3.text = '0';
    tableWidthSelect.options.add( tableWidth3 );
    var tableWidth4 = new Option();
    tableWidth4.value = '1';
    tableWidth4.text = '1';
    tableWidthSelect.options.add( tableWidth4 );
    var tableWidth5 = new Option();
    tableWidth5.value = '2';
    tableWidth5.text = '2';
    tableWidthSelect.options.add( tableWidth5 );

    /* ifrm height setup */
    ifrmHeightSelect.setAttribute( 'id', 'ifrmHeightSelect' );

    var ifrmHeight1 = new Option();
    ifrmHeight1.value = '300';
    ifrmHeight1.text = '-2';
    ifrmHeightSelect.options.add( ifrmHeight1 );
    var ifrmHeight2 = new Option();
    ifrmHeight2.value = '400';
    ifrmHeight2.text = '-1';
    ifrmHeightSelect.options.add( ifrmHeight2 );
    var ifrmHeight3 = new Option();
    ifrmHeight3.value = '500';
    ifrmHeight3.text = '0';
    ifrmHeightSelect.options.add( ifrmHeight3 );
    var ifrmHeight4 = new Option();
    ifrmHeight4.value = '600';
    ifrmHeight4.text = '1';
    ifrmHeightSelect.options.add( ifrmHeight4 );
    var ifrmHeight5 = new Option();
    ifrmHeight5.value = '700';
    ifrmHeight5.text = '2';
    ifrmHeightSelect.options.add( ifrmHeight5 );

    /* Set to saved preferences */
    if ( localStorage.getItem( "autoAcceptTopRecordsInputSetting" ) == 'true' ) {
        autoAcceptTopRecordsInput.checked = true;
    } else {
        autoAcceptTopRecordsInput.checked = false;
    }

    /* Set to saved preferences */
    if ( localStorage.getItem( "dynamicColumnsInputSetting" ) == 'true' ) {
        dynamicColumnsInput.checked = true;
    } else {
        dynamicColumnsInput.checked = false;
    }
    
    /* Set to saved preferences */
    if ( localStorage.getItem( "ifrmToggleInputSetting" ) == 'true' ) {
        ifrmToggleInput.checked = true;
    } else {
        ifrmToggleInput.checked = false;
    }

    /* Insert user settings into page */
    $( 'body' ).append( userSettingsDiv );
    $( '.userSettingsDiv' ).append(
        $( "<table>" )
        .html( "<tr><td class='nozoom' id='tr1td1'></td><td class='nozoom' id='tr1td2'></td><td class='nozoom' id='tr1td3'></td><td class='nozoom' id='tr1td4'></td></tr>" +
            "<tr><td class='nozoom' id='tr2td1'></td><td class='nozoom' id='tr2td2'></td><<td class='nozoom' id='tr2td3'></td>/tr>" )
    );
    $( '#tr1td1' ).append( autoAcceptTopRecordsInput );
    $( '#tr1td1' ).append( document.createTextNode( ' - Grind Mode ' ) );
    $( '#tr1td2' ).append( fontSizeSelect );
    $( '#tr1td2' ).append( document.createTextNode( ' - Font Size ' ) );
    $( '#tr1td3' ).append( tableWidthSelect );
    $( '#tr1td3' ).append( document.createTextNode( ' - Table Width ' ) );
    $( '#tr1td4' ).append( ifrmToggleInput );
    $( '#tr1td4' ).append( document.createTextNode( ' - Iframe Toggle ' ) );
    $( '#tr2td1' ).append( dynamicColumnsInput );
    $( '#tr2td1' ).append( document.createTextNode( ' - Dynamic Columns ' ) );
    $( '#tr2td2' ).append( inputSizeSelect );
    $( '#tr2td2' ).append( document.createTextNode( ' - Checkbox Size ' ) );
    $( '#tr2td3' ).append( ifrmHeightSelect );
    $( '#tr2td3' ).append( document.createTextNode( ' - Iframe Height ' ) );

    /* Set to saved preferences */
    $( '#fontSizeSelect' ).val( localStorage.getItem( 'fontSizeSelectSetting' ) );
    $( '#inputSizeSelect' ).val( localStorage.getItem( 'inputSizeSelectSetting' ) );
    $( '#tableWidthSelect' ).val( localStorage.getItem( 'tableWidthSelectSetting' ) );
    $( '#ifrmHeightSelect' ).val( localStorage.getItem( 'ifrmHeightSelectSetting' ) );

}

/* Dynamic Columns listeners and setup */
function loadDynamicColumns() {

    $( 'th:contains("Name"), #assignment_name' ).click( function() {

        if ( $( this ).width() > 390 ) {

            resetColumns();

        } else {

            resetColumns();

            $( "div[data-field='name']" ).css( 'width', '400px' );
            $( "input[data-field='name']" ).css( 'width', '400px' );

        }
    } );

    $( 'th:contains("Address"), #assignment_address' ).click( function() {

        if ( $( this ).width() > 390 ) {

            resetColumns();

        } else {

            resetColumns();

            $( "div[data-field='address']" ).css( 'width', '400px' );
            $( "input[data-field='address']" ).css( 'width', '400px' );

        }
    } );

    $( 'th:contains("Addr Ext"), #assignment_address_extended' ).click( function() {

        if ( $( this ).width() > 190 ) {

            resetColumns();

        } else {

            resetColumns();

            $( "div[data-field='address_extended']" ).css( 'width', '200px' );
            $( "input[data-field='address_extended']" ).css( 'width', '200px' );

        }
    } );

    $( 'th:contains("Tel"), #assignment_tel' ).click( function() {

        if ( $( this ).width() > 190 ) {

            resetColumns();

        } else {

            resetColumns();

            $( "div[data-field='tel']" ).css( 'width', '200px' );
            $( "input[data-field='tel']" ).css( 'width', '200px' );

        }
    } );

    $( 'th:contains("Website"), #assignment_website' ).click( function() {

        if ( $( this ).width() > 390 ) {

            resetColumns();

        } else {

            resetColumns();

            $( "div[data-field='website']" ).css( 'width', '400px' );
            $( "input[data-field='website']" ).css( 'width', '400px' );

        }
    } );

    $( 'th:contains("Locality"), #assignment_locality' ).click( function() {

        if ( $( this ).width() > 190 ) {

            resetColumns();

        } else {

            resetColumns();

            $( "div[data-field='locality']" ).css( 'width', '200px' );
            $( "input[data-field='locality']" ).css( 'width', '200px' );

        }
    } );

    $( 'th:contains("Region"), #assignment_region' ).click( function() {

        if ( $( this ).width() > 190 ) {

            resetColumns();

        } else {

            resetColumns();

            $( "div[data-field='region']" ).css( 'width', '200px' );
            $( "input[data-field='region']" ).css( 'width', '200px' );

        }
    } );

    $( 'th:contains("Postcode"), #assignment_postcode' ).click( function() {

        if ( $( this ).width() > 140 ) {

            resetColumns();

        } else {

            resetColumns();

            $( "div[data-field='postcode']" ).css( 'width', '150px' );
            $( "input[data-field='postcode']" ).css( 'width', '150px' );

        }
    } );

    $( 'th:contains("Fax"), #assignment_fax' ).click( function() {

        if ( $( this ).width() > 190 ) {

            resetColumns();

        } else {

            resetColumns();

            $( "div[data-field='fax']" ).css( 'width', '200px' );
            $( "input[data-field='fax']" ).css( 'width', '200px' );

        }
    } );

    $( 'th:contains("Email"), #assignment_email' ).click( function() {

        if ( $( this ).width() > 290 ) {

            resetColumns();

        } else {

            resetColumns();

            $( "div[data-field='email']" ).css( 'width', '300px' );
            $( "input[data-field='email']" ).css( 'width', '300px' );

        }
    } );

    $( 'th:contains("Category"), #select2-drop-mask' ).click( function() {

        if ( $( this ).width() > 390 ) {

            resetColumns();

        } else {

            resetColumns();

            $( "div[data-field='category']" ).css( 'width', '400px' );
            $( "#s2id_autogen1" ).css( 'width', '400px' );

        }
    } );

    $( 'th:contains("Post Town"), #assignment_post_town' ).click( function() {

        if ( $( this ).width() > 190 ) {

            resetColumns();

        } else {

            resetColumns();

            $( "div[data-field='post_town']" ).css( 'width', '200px' );
            $( "input[data-field='post_town']" ).css( 'width', '200px' );
        }
    } );

    $( 'th:contains("Admin Region"), #assignment_admin_region' ).click( function() {

        if ( $( this ).width() > 190 ) {

            resetColumns();

        } else {

            resetColumns();

            $( "div[data-field='admin_region']" ).css( 'width', '200px' );
            $( "input[data-field='admin_region']" ).css( 'width', '200px' );

        }
    } );
}

/* Custom column widths */
function resetColumns() {

    $( "div[data-field='name']" ).css( 'width', '150px' );
    $( "input[data-field='name']" ).css( 'width', '150px' );

    $( "div[data-field='address']" ).css( 'width', '150px' );
    $( "input[data-field='address']" ).css( 'width', '150px' );

    $( "div[data-field='address_extended']" ).css( 'width', '50px' );
    $( "input[data-field='address_extended']" ).css( 'width', '50px' );

    $( "div[data-field='tel']" ).css( 'width', '150px' );
    $( "input[data-field='tel']" ).css( 'width', '150px' );

    $( "div[data-field='website']" ).css( 'width', '150px' );
    $( "input[data-field='website']" ).css( 'width', '150px' );

    $( "div[data-field='locality']" ).css( 'width', '150px' );
    $( "input[data-field='locality']" ).css( 'width', '150px' );

    $( "div[data-field='region']" ).css( 'width', '150px' );
    $( "input[data-field='region']" ).css( 'width', '150px' );

    $( "div[data-field='postcode']" ).css( 'width', '100px' );
    $( "input[data-field='postcode']" ).css( 'width', '100px' );

    $( "div[data-field='fax']" ).css( 'width', '50px' );
    $( "input[data-field='fax']" ).css( 'width', '50px' );

    $( "div[data-field='email']" ).css( 'width', '50px' );
    $( "input[data-field='email']" ).css( 'width', '50px' );

    $( "div[data-field='category_labels']" ).css( 'width', '150px' );
    $( "#s2id_autogen1" ).css( 'width', '150px' );

    $( "div[data-field='post_town']" ).css( 'width', '50px' );
    $( "input[data-field='post_town']" ).css( 'width', '50px' );

    $( "div[data-field='admin_region']" ).css( 'width', '50px' );
    $( "input[data-field='admin_region']" ).css( 'width', '50px' );

}