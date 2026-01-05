// ==UserScript==
// @author      Zachary Seeley
// @name        Polygon Review Mode
// @namespace   https://greasyfork.org/users/2291
// @description Sets filter to only show problems.
// @require     http://code.jquery.com/jquery-latest.min.js
// @match       https://work4.factual.com/*
// @copyright   © 2014, J&E Data Solutions
// @version     0.2
// @downloadURL https://update.greasyfork.org/scripts/3607/Polygon%20Review%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/3607/Polygon%20Review%20Mode.meta.js
// ==/UserScript==

/*global $:false*/
"use strict";

/* Global Variables */
var modSettingsDiv,
    autoReviewInput,
    urlCheck,
    tasksCheck;

/* Main Logic */
$( document ).ready( function() {
    if ( localStorage.getItem( "autoReviewInputSetting" ) == 'true' ) {
        factualInit();
    } else {
        showModSettings();
    }
} );

function factualInit() {
    /* Determine if we're on task page or task list page */
    urlCheck = location.pathname;
    tasksCheck = urlCheck.indexOf( 'tasks' );

    if ( $( 'p:contains(You are working on)' ).text() ) {
        taskListPageInit();
    } else if ( $( 'a:contains(Report problem)' ).text() ) {
        showModSettings();
        $( 'a:contains(Report problem)' )[ 0 ].click();
        $( 'div.modal-dialog' ).css( 'top', '20px' );
    }
}

function showModSettings() {
    /* User Setting Checkboxes */
    modSettingsDiv = document.createElement( "DIV" );
    autoReviewInput = document.createElement( "INPUT" );

    modSettingsDiv.setAttribute( 'class', 'modSettingsDiv' );
    modSettingsDiv.setAttribute( 'style', 'position: absolute; top: 0px; right: 0px; z-index: 1010; width: 120px; height: 50px; background-color: #f8f8f8' );

    autoReviewInput.setAttribute( 'id', 'autoReviewInput' );
    autoReviewInput.type = "checkbox";
    autoReviewInput.setAttribute( 'style', 'position: relative; z-index: 2011;' );

    if ( localStorage.getItem( "autoReviewInputSetting" ) == 'true' ) {
        autoReviewInput.checked = true;
    } else {
        autoReviewInput.checked = false;
    }

    $( 'body' ).append( modSettingsDiv );
    $( '.modSettingsDiv' ).append( autoReviewInput );
    $( '.modSettingsDiv' ).append( document.createTextNode( ' - Review Mode ' ) );

    $( "#autoReviewInput" ).change( function() {
        var reviewSettingsCheck = localStorage.getItem( "autoReviewInputSetting" );
        if ( reviewSettingsCheck == 'true' ) {
            localStorage.setItem( "autoReviewInputSetting", "false" );
        } else {
            localStorage.setItem( "autoReviewInputSetting", "true" );
            location.reload();
        }
    } );

}

function taskListPageInit() {
    if ( localStorage.getItem( "autoReviewInputSetting" ) == 'true' ) {
        initReviewGrind();
    }
    showModSettings();
}

function initReviewGrind() {
    var totalNumToReview,
        problemArray = $( document ).find( 'tr td:contains("Problem")' ),
        id = $( 'h6 p' ).text(),
        numToReview = localStorage.getItem( id ),
        currentLink;
    if ( localStorage.getItem( id ) ) {
        problemArray = $( document ).find( 'tr td:contains("Problem")' );
        numToReview = localStorage.getItem( id );
        numToReview--;
        currentLink = problemArray.eq( numToReview ).parent().find( 'a:contains("update!")' );
        localStorage.setItem( id, numToReview );
        if ( numToReview >= 0 ) {
            currentLink[ 0 ].click();
        } else {
            totalNumToReview = localStorage.getItem( id + 'Total' );
            $( 'h1' ).children().text( 'Finished all ' + totalNumToReview + ' problem records!' );
            $( 'h1' ).children().css( 'color', 'red' ); //alert('Finished all '+totalNumToReview+' problem records!');
            localStorage.removeItem( id );
            localStorage.removeItem( id + 'Total' );
        }
    } else {
        problemArray = $( document ).find( 'tr td:contains("Problem")' );
        numToReview = $( document ).find( 'tr td:contains("Problem")' ).length;
        localStorage.setItem( id + 'Total', numToReview );
        numToReview--;
        currentLink = problemArray.eq( numToReview ).parent().find( 'a:contains("update!")' );
        localStorage.setItem( id, numToReview );
        if ( numToReview >= 0 ) {
            currentLink[ 0 ].click();
        } else {
            localStorage.removeItem( id );
        }
    }
}