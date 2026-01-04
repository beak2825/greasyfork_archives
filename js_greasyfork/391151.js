// ==UserScript==
// @name         Netflix Playback
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.netflix.com/watch/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391151/Netflix%20Playback.user.js
// @updateURL https://update.greasyfork.org/scripts/391151/Netflix%20Playback.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define our global variable(s).
    var ourVideo,
        showDiv,
        timer = 0;


    function ourPlaybackRate() {

        console.info('ourPlaybackRate called');

        ourVideo = document.querySelectorAll( 'video' );


            ourVideo[0].playbackRate = 1.2;
            ourVideo[0].focus;
            showPlayback( ourVideo[0] );

    }


    function mutationCallback( mutations ) {

        let vids = document.querySelectorAll( 'video' );

        if ( vids.length > 0 ) {
            // Prevent further observations from executing
            observer.disconnect();

            // Call ourPlaybackRate() to set playbackRate
            ourPlaybackRate();
        }

    } // end mutationCallback()

    function showPlayback( ourVideo ) {

        let video = document.querySelectorAll( 'video' );

        if ( !showDiv ) {

            // Create div to show our video's playbackRate
            showDiv = document.createElement( 'div' );
            var content = document.createTextNode( ' Playback Rate: ' + video[0].playbackRate );
            showDiv.appendChild( content );
            showDiv.classList.add( 'showDiv' );
            document.body.appendChild( showDiv );

        }
        else {
            showDiv.innerHTML = 'Playback Rate: ' + video[0].playbackRate;
            showDiv.classList.remove( 'hideDiv' );
            showDiv.classList.add( 'showDiv' );
        }



        if ( timer ) {
            clearTimeout( timer );;
        }

        timer = setTimeout( function() {
            showDiv.classList.remove( 'showDiv' );
            showDiv.classList.add( 'hideDiv' );
        }, 1000 );


    }


    // Create our own styleSheet
    var sheet = (function() {
        // Create the <style> tag
        var style = document.createElement("style");

        // Add a media (and/or media query) here if you'd like!
        // style.setAttribute("media", "screen")
        // style.setAttribute("media", "only screen and (max-width : 1024px)")

        // WebKit hack :(
        style.appendChild(document.createTextNode(""));

        // Add the <style> element to the page
        document.head.appendChild(style);

        return style.sheet;
    })();

    // Add our style rules.
    sheet.insertRule( '.showDiv { background-color: black }' );
    sheet.insertRule( '.showDiv { width: 300px }' );
    sheet.insertRule( '.showDiv { height: 100px }' );
    sheet.insertRule( '.showDiv { z-index: 10000 }' );
    sheet.insertRule( '.showDiv { position: fixed }' );
    sheet.insertRule( '.showDiv { top: 100px }' );
    sheet.insertRule( '.showDiv { color: white }' );
    sheet.insertRule( '.showDiv { text-align: center }' );
    sheet.insertRule( '.showDiv { line-height: 100px }' );
    sheet.insertRule( '.showDiv { white-space: nowrap }' );
    sheet.insertRule( '.showDiv { font-size: 18px }' );
    sheet.insertRule( '.showDiv { border-radius: 25px }' );
    sheet.insertRule( '.showDiv { opacity: .5 }' );
    sheet.insertRule( '.showDiv { margin-left: 50px }' );
    sheet.insertRule( '.showDiv { margin-right: auto }' );
    sheet.insertRule( '.hideDiv { opacity: 0 }' );



    // Listen for the "+" and "-" keypresses to speed up and slow down video playback.
    document.addEventListener("keypress", function(event) {

        let Video = document.querySelectorAll( 'video'),
            ourVideo = Video[0];
        //console.info( 'vid playback: ' + vid.playbackRate );

        if( event.which == 43 || event.which == 61 ) {
            ourVideo.playbackRate = ( ( ourVideo.playbackRate * 10 ) + 1 ) / 10;
            showPlayback();
            console.log( ourVideo.playbackRate );
        }
        else if( event.which == 45 || event.which == 95 ) {
            ourVideo.playbackRate = ( ( ourVideo.playbackRate * 10 ) - 1 ) / 10;
            showPlayback();
            console.log( ourVideo.playbackRate );
        }

    });



//////////////////////////////////////////////////////////////////////////////
/////////////////////  MutationObserver init   ///////////////////////////////


    var mList = document.body,
    options = {
        childList: true,
        subtree: true
    },
    observer = new MutationObserver( mutationCallback );

    observer.observe(mList, options);


//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

})();