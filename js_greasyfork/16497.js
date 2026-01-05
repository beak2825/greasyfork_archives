// ==UserScript==
// @name        Vimeo Download
// @namespace   schwarztee
// @description Adds a download button to the video player.
// @include     https://vimeo.com/*
// @copyright   2015, schwarztee
// @license     MIT
// @version     0.2.4
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/16497/Vimeo%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/16497/Vimeo%20Download.meta.js
// ==/UserScript==

(function(){

    'use strict';

    // helper: find DOM element
    function find( selector ) { return document.querySelector( selector ); }

    // wait for player to be ready and set up periodic video check
    function setup()
    {
        // controller object in DOM and video element available?
        if ( window && 'vimeo' in window && find( '.player .video video' ) )
        {
            // try to get video metadata
            // (this can easily break if Vimeo updates their object tree)
            try
            {
                // get video ID
                var videoId = vimeo['clip_page_config']['clip']['id'];

                // retrieve active player properties
                var videoInfo = vimeo['clips'][videoId];

                // save title
                var title  = videoInfo['video']['title'];

                // get streams
                var streams = videoInfo['request']['files']['progressive'];

                // sort streams descending by video resolution
                streams.sort( function compare( streamA, streamB )
                {
                    // compare width property
                    return streamB.width - streamA.width;
                });

                // get video file info
                // - just take the first one with the highest quality
                // - this will be replaced when I got more time
                var file = streams[0];

                // log gathered information
                console.log( "[Vimeo Download] Found media for \""+title+"\" ("+file.quality+")" );

                // make download button
                var button = makeButton( file.url, title, file.quality );

                // regularly check that button is in control bar
                // yes, that's dirty, but Vimeo replaces the player UI somewhen after loading
                setInterval( function()
                {
                    // find control bar
                    var playBar = find( '.player .play-bar' )

                    // remove any old button if existing
                    var oldButton = find( '.button.dwnld' );
                    oldButton && oldButton.remove();

                    // add new button
                    playBar.appendChild( button );

                }, 500 );
            }
            catch ( error )
            {
                // log the error
                console.error( "[Vimeo Download] Error retrieving video meta data:", error );
            }
        }
        else
        {
            // try again later
            setTimeout( setup, 500 );
        }
    }

    // create download button
    function makeButton( url, title, quality )
    {
        // make valid filename from title
        var filename = title.replace( /[<>:"\/\\|?*]/g, '' ) + '.mp4';

        // create new button
        var button = document.createElement( 'a' );
        button.href = url;
        button.target = '_blank';
        button.download = filename;
        button.innerHTML = "⥥";
        button.title = "Download " + quality;
        button.setAttribute( 'class', "button dwnld" );
        button.setAttribute( 'style', 'display: inline-block; font-size: 1.75em; margin: -0.25em 0 0 0.3em; color: #fff' );

        // apply mouseover effect
        button.onmouseenter = function() { button.style.color = 'rgb(68,187,255)'; };
        button.onmouseleave = function() { button.style.color = '#fff'; };

        // return DOM object
        return button;
    }

    // start looking for video player
    setup();

})();
