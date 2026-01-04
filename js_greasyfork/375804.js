// ==UserScript==
// @name        Xmillsa's Youtube Downloader
// @version     0.2.4
// @namespace   https://andys-net.co.uk/
// @homepageURL https://andys-net.co.uk/
// @license     GPL-3.0-or-later; https://spdx.org/licenses/GPL-3.0-or-later.html
// @author      Xmillsa
// @description A simple script to enable in browser downloading of Youtube videos, no external scripts required.
// @icon        https://github.com/xmillsa/ytDownloader/raw/master/ytD-icon.png
// @grant       none
// @match       https://www.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/375804/Xmillsa%27s%20Youtube%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/375804/Xmillsa%27s%20Youtube%20Downloader.meta.js
// ==/UserScript==

(function (){
    "use strict";

    let currURL = window.location.href,
        prevURL = '';

    // Always check the URL for changes.
    setInterval( checkURL, 250 );

    /*
        Keep an eye on the URL for any changes, if it changes, run the main function.
    */
    function checkURL(){
        // Current URL.
        currURL = window.location.href;
        // Has it changed?
        if ( prevURL !== currURL ){
            // Match the previous and current URLs so we don't loop forever and ever!
            prevURL = window.location.href;
            // Lets begin.
            main();
        }
    }

    /*
        The main function, everything is done through this function.
        First we check if we're on the correct page,
        Add some custom CSS styles,
        Create the container for our links,
        Grab the video ID from the URL,
        Fetch the videos details and await its arrival,
        Turn that data into something usable,
        Create the actual links and visile data.
    */
    async function main(){
        try{
            // Check we're on the correct page.
            if ( window.location.href.includes( 'watch?v=' ) ){

                // Add some styling.
                addCss();

                // Create our container/button.
                createContainer();

                // Get the current video ID from the URL.
                const videoID  = /(?:\?v=)(.*?)(?:&|$)/i.exec(window.location.search)[1],
                      response = await fetch( `https://www.youtube.com/get_video_info?video_id=${videoID}&el=detailpage&pl=default`, { method: 'GET' } ),
                      data     = await response.text(),
                      // Parse the data so we can use it.
                      json     = parseData( data );

                // Create the links.
                createLinks( json );
            } else {
                // Must be a page with no video.
            }
        }
        catch( e ){
            /*
                Errors, errors everywhere!
                Not really, but something went wrong...
            */
            console.log( e );
        }
    }

    /*
        Grabs the required sections of data from the fetch response.
        We only require the "player_response" section, once found, turn it into JSON for easy use.
    */
    function parseData( data ){
        const captured = /(?:player_response=)(.*?)(?:&|$)/i.exec( data )[ 1 ],
              adaptive = /(?:adaptive_fmts=)(.*?)(?:&|$)/i.exec( data )[ 1 ],
              fmts     = /(?:rvs=)(.*?)(?:&|$)/i.exec( data )[ 1 ];

        let arr = decodeURIComponent( adaptive ).split(','),
            mainObj = [];
        let i = 0;
        arr.forEach( el => {
          let arr2 = el.split('&');
          let arr3 = {};
          arr2.forEach( el2 => {
            let arr4 = el2.split('=');
            arr3[ arr4[ 0 ] ] = arr4[ 1 ];
          } );
          mainObj[ i ] = arr3;
          i++;
        } );
      
        i = 0;
        let brr = decodeURIComponent( fmts ).split( ',' ),
            fmtArray = [];
        brr.forEach( el => {
          let brr2 = el.split('&');
          let brr3 = {};
          brr2.forEach( el2 => {
            let brr4 = el2.split('=');
            brr3[ brr4[ 0 ] ] = brr4[ 1 ];
          } );
          fmtArray[ i ] = brr3;
          i++;
        } );
        
        let mainArray = [];
        
        mainArray[ 'formats' ] = fmtArray;
        mainArray[ 'adaptiveFormats' ] = mainObj;
        mainArray[ 'videoDetails' ] = JSON.parse( decodeURIComponent( captured ) ).videoDetails;

        const json = mainArray;
      
        return json;
    }

    /*
        This creates a container for basically everything regarding this script.
        First ensure it doesn't already exist, (if it does we simply reset it),
        Create the container element, set some basic attributes,
        Add an event listener on the button to show/hide the links,
        Add the container to the page.
    */
    async function createContainer(){
        // Check it's not already been created.
        if ( document.getElementById( 'yt-container' ) === null ){
            const target  = await findTheTarget( '#primary #player' ),
                  div     = document.createElement( 'div' );

            // Set the div's attributes.
            div.id        = 'yt-container';
            div.className = 'style-scope ytd-watch-flexy';
            div.innerHTML = '<button id="linksButton">Download Links</button><div id="yt-links"><div><div><h3>Video & Audio Combined</h3><div id="combined"></div></div></div><div class="flex"><div><h3>Video Only - No Audio</h3><div id="seperate-video"></div></div><div><h3>Audio Only - No Video</h3><div id="seperate-audio"></div></div></div><div class="center footer flex"><div><s>Left Click = Potentially Quicker Download</s></div><div>Right Click -> Save As = Normal Download</div></div>';

            div.getElementsByTagName( 'button' )[ 0 ].addEventListener( 'click', () => {
                // Do some magic to allow for a variable number of links. (overall container height)
                if ( div.classList.contains( 'open' ) === false ){
                    let currentHeight = div.clientHeight;
                    // Work out required height.
                    // Temporarily disable transitions.
                    div.style.transitionDuration = '0s';
                    // Set height to auto, and store it's height.
                    div.style.height = 'auto';
                    let setHeight = div.clientHeight;
                    // Set height back to it's original height.
                    div.style.height = currentHeight +'px';
                    // Force a redraw otherwise it simply wont work.
                    div.offsetHeight;
                    // Re-enable transitions.
                    div.style.transitionDuration = '';
                    // Tell it the new height we worked out. (the transition takes care of the rest)
                    div.style.height = setHeight +'px';
                } else {
                    // Use CSS styling.
                    div.removeAttribute( 'style' );
                }
                div.classList.toggle( 'open' );
            });

            target.parentNode.insertBefore(div, target.nextSibling);
        } else {
            // It already exists, just reset it.
            // Remove inline styles.
            document.querySelector( '#yt-container' ).removeAttribute( 'style' );
            // Remove all class.
            document.querySelector( '#yt-container' ).removeAttribute( 'class' );
            // Empty the #combined div.
            document.querySelector( '#yt-container #combined' ).innerText = '';
            // Empty the #seperate div.
            document.querySelector( '#yt-container #seperate-audio' ).innerText = '';
            // Empty the #seperate div.
            document.querySelector( '#yt-container #seperate-video' ).innerText = '';
        }
    }

    /*
        This simply finds the requested target, used as a promise to allow async waiting.
        Probably overkill but it just felt right making it this way.
        Will simply wait... forever, until the target is found.
        This hasn't been tested for forced errors / never finding it's target, so oould potentially break, working so far...
    */
    function findTheTarget( target ){
        return new Promise( resolve => {
            // Look for our target.
            const findingInt = setInterval( () => {
                if (document.querySelector( target ) !== null){
                    clearInterval( findingInt );
                    resolve( document.querySelector( target ) );
                } else {
                    // Can't find the target.
                }
            }, 500 );
        });
    }

    /*
        Creates all the information and download links for the parsed JSON data.
        Stores the 2 types of videos, "formats" and "adaptive" into arrays,
        will then sort those into ascending order of "contentLength" (Filesize),
        then simply loops through the arrays, sedns each entry to the "displayInfo" function,
        then adds the returned element to the page.
    */
    async function createLinks( json ){
        // Store video details.
        const details       = json.videoDetails,
              // Store the combined video formats.
              formats       = json.formats,
              // Store the seperate video & audio formats.
              adaptive      = json.adaptiveFormats,
              // Store Video only.
              adaptiveVideo = [],
              // Store Audio only.
              adaptiveAudio = [];

        let row, target, i = 0;
        // Loops through the adaptive array and stores the audio and video links seperately.
        for( ; i < adaptive.length; i++ ){
            if ( adaptive[ i ].audio_channels !== undefined ){
                // Send to Audio only array.
                adaptiveAudio.push( adaptive[ i ] );
            } else {
                // Send to video only array.
                adaptiveVideo.push( adaptive[ i ] );
            }
        }

        // Sorts the "adaptiveAudio" array by content length (filesize)
        adaptiveAudio.sort(( a, b ) => {
            return parseInt( b.clen ) - parseInt( a.clen );
        });
        // Sorts the "adaptiveVideo" array by content length (filesize)
        adaptiveVideo.sort(( a, b ) => {
            return parseInt( b.clen ) - parseInt( a.clen );
        });
        // Sorts the "formats" array by content length (filesize)
        formats.sort(( a, b ) => {
            return parseInt( b.clen ) - parseInt( a.clen );
        });

        /*
            Loop through the previously made, now sorted arrays and display the required infomation.
        */
        i = 0;
        target = await findTheTarget( '#yt-container #combined' );
        for( ; i < formats.length; i++ ){
            if ( row = displayInfo( formats[ i ], details ) ){
                target.appendChild( row );
            }
        }
        openCloseTrick();

        i = 0;
        target = await findTheTarget( '#yt-container #seperate-audio' );
        for( ; i < adaptiveAudio.length; i++ ){
            if ( row = displayInfo( adaptiveAudio[ i ], details ) ){
                target.appendChild( row );
            }
        }
        openCloseTrick();

        i = 0;
        target = await findTheTarget( '#yt-container #seperate-video' );
        for( ; i < adaptiveVideo.length; i++ ){
            if ( row = displayInfo( adaptiveVideo[ i ], details ) ){
                target.appendChild( row );
            }
        }
        openCloseTrick();
    }

    /*
        If the list is opened before being populated, this will trick it into re-opening to show the now added links.
        If the list is closed, it will look like nothing happene.
        Simply uses the click event which fires its open/close action, it works out its required height on open, hence why we do this.
    */
    function openCloseTrick(){
        const target = document.getElementById( 'linksButton' );
        target.click();
        target.click();
    }

    /*
        Turns the individual JSON entry into a div row for displaying on page.
        Get all the vars, quality, mimetype & size.
        Work out "3gp" and "m4a" seperately, all the others can be extracted from the mimetype entry itself,
        Create the div row element with the extracted data.
        return the div.
    */
    function displayInfo( data, details ){
        const row  = document.createElement( 'div' ),
              size = Number(data[ 'clen' ] / 1024 / 1024).toFixed(2);

        let qual = data[ 'quality_label' ];

        /*
            Check if the size is a number!
            If there is no contentLength within the original data from Youtube, the video doesn't seem to work / even exist, even though Youtube seems to think it does.
            For now, just don't display the links, may need to re-check this in the future incase this is just a temporary bug.
        */
        if ( isNaN( size ) ){
            return false;
        }

        // Convert to Kbs for easier reading. (audio only)
        if ( qual === undefined ){
            qual = String( Number(data[ 'bitrate' ] / 1024 ).toFixed( 0 ) ) +' Kbs';
        }

        row.className = 'row';
        row.innerHTML = `<div class="right">${size} MB</div>
                         <div class="center">${qual}</div>
                         <div class="left"><a class="falseLink" href="${ decodeURIComponent(data[ 'url' ]) }">Download</a></div>`;

        // Create "link" for downloading.
        let a = document.createElement( 'a' );
        a.innerText = 'Download';
        a.className = 'falseLink';

        // Listen to clicks, once clicked start the download process.
        /*row.getElementsByTagName( 'a' )[ 0 ].addEventListener( 'click', ( e ) => {
            e.preventDefault();
            // Show an indication that the download has started in the background.
            e.target.className = 'inProgress';
            e.target.innerText = 'Downloading 0%';
            
            asyncDownload( data, details, e.target );
        });*/

        return row;
    }

    /*
        Downloads the requested video in chunks to bypass Youtubes bandwidth limitations and speed up downloads.
        This works by first creating multiple promises requesting a "chunk" of data. (this is how Youtube actually "streams" it's videos, it's why videos never fully load and only load as you're watching it)
        Once the promises are made, run them all at the same time and await a response.
        Once the promises have all returned data, create an <a> link with that data and force a download.
    */
    async function asyncDownload( data, details, calledFrom ){
        // Set request size.
        const requestSize = 1048576 * 2, // 2 MB
              blobArray   = [],
              maxRequests = 16;

        // Get number of chunks required and size of each chunk.
        let numChunks = Math.ceil( data[ 'clen' ] / requestSize ),
            chunkSize  = Math.ceil( data[ 'clen' ] / numChunks ),
            i = 0,
            start, end;

        // Limit the maximum number of requests, we don't want to inadvertently DDOS Youtube.
        if ( numChunks > maxRequests ){
            numChunks = maxRequests;
            // Work out chunkSize again.
            chunkSize = Math.ceil( data[ 'clen' ] / numChunks );
        }

        // Loop through the number of chunks required.
        for( ; i < numChunks; i++ ){
            // Work out the start and end range in bytes for our chunk request.
            start = ( chunkSize + 1 ) * i;
            end   = start + chunkSize;
            // Create an array of promise requests for our Promise.all request.
            blobArray.push( new Promise( async ( resolv ) => {
                // Make our request and return a blob.
                const response       = await fetch( `${data[ 'url' ]}&range=${start}-${end}`, { method: 'GET' } ),
                      aBlob          = await response.blob(),
                      // Progress updates.
                      currentPercent = Number( /[0-9]+(\.[0-9]+)?/.exec( calledFrom.innerText )[ 0 ] ),
                      newPercent     = Number( currentPercent + ( ( 100 / numChunks ) ) ).toFixed( 2 );

                // Display some basic percentage progress.
                calledFrom.innerText = 'Downloading '+ String( newPercent ) +'%';
                resolv( aBlob );
            }));
        }

        try{
        // Run all of our promise requests and await their return.
        Promise.all( blobArray ).then( values => {
            // Makes a blob from all of the other blobs, this is our requested video, also store it's type as a stream.
            const entireBlob = new Blob( values, { type: 'application/octet-stream' } ),
                  // Create a URL object with our returned blob data.
                  urlObject = window.URL.createObjectURL( entireBlob ),
                  // Create a link element and set it's URL to our URL object.
                  a = document.createElement( 'a' );

            // Add our link to the page.
            document.body.appendChild( a );
            a.href = urlObject;
            // Set the filename.
            console.log( data );
            a.download = `${details[ 'title' ].replace(/\+/g,' ')}.${data.type.split( ';' )[ 0 ].split( '/' )[ 1 ]}`;
            // Click the link! Should cause it to download if all has worked well.
            a.click();
            // This element is no longer required.
            a.remove();
            // Our URL object is no longer required.
            window.URL.revokeObjectURL( urlObject );
            // Reset the style of the link that was clicked.
            calledFrom.className = '';
            calledFrom.innerText = 'Download';
        });
        }
        catch(e){
            console.log(e);
        }
    }

    /*
        Some custom CSS for the container, button and links.
        Uses some of Youtubes own CSS vars, ensures it works with youtubes Dark Theme mode.
    */
    function addCss(){
        // Check it's not already been added.
        if (document.getElementById( 'yt-downloader-styles' ) === null ){
            const css = `
                  #yt-container *{box-sizing:border-box}
                  #yt-container{color:var(--ytd-video-primary-info-renderer-title-color,var(--yt-spec-text-primary));font-size:1.3em;height:20px;line-height:1.22em;margin:.3em 0 1px 0;min-height:20px;overflow:hidden;position:relative;transition:height .4s}
                  #yt-container > button{background-color:transparent;border:none;color:var(--yt-spec-text-secondary);cursor:pointer;height:18px;margin:0;padding:0;position:relative;transition:box-shadow .2s;user-select:none;width:100%;z-index:1}
                  #yt-container > button::before{content:'<';left:5px;position:absolute;transform:rotate(-90deg);transition:transform .4s}
                  #yt-container > button::after{content:'>';position:absolute;right:5px;transform:rotate(90deg);transition:transform .4s}
                  #yt-container.open > button::before{transform:rotate(90deg)}
                  #yt-container.open > button::after{transform:rotate(-90deg)}
                  #yt-container > button:active{margin:0;padding:0}
                  #yt-container > button:hover,#yt-container.open > button{box-shadow:0 2px 0 0 var(--yt-spec-10-percent-layer)}
                  #yt-container > #yt-links .flex{display:flex;flex-direction:row;justify-content:space-evenly}
                  #yt-container > #yt-links{display:flex;flex-direction:column;justify-content:space-evenly;position:relative;width:100%}
                  #yt-container > #yt-links div{width:100%}
                  #yt-container > #yt-links > div{border-color:var(--yt-spec-10-percent-layer);border-width:0 0 1px 0;border-style:solid;margin:0;padding:.2em}
                  #yt-container > #yt-links > div > div{padding:.4em}
                  #yt-container > #yt-links a{color:var(--yt-endpoint-color,var(--yt-spec-icon-active-button-link))}
                  #yt-container > #yt-links h3{font-weight:300;margin:0;padding:.1em 0 .2em 0;text-align:center}
                  #yt-container > #yt-links .row{display:flex;justify-content:space-evenly}
                  #yt-container > #yt-links .right{text-align:right}
                  #yt-container > #yt-links .left{text-align:left}
                  #yt-container > #yt-links .center{text-align:center}
                  #yt-container > #yt-links .falseLink{cursor:pointer;text-decoration:underline}
                  #yt-container > #yt-links .inProgress{color:var(--yt-expand-color);font-size:.9em;pointer-events:none;text-decoration:none}
                  #yt-container > #yt-links .footer{background-color:var(--yt-playlist-background-item);font-size:.86em;padding:0}
                  ytd-video-primary-info-renderer{padding-top:10px}
                  `,
                  style = document.createElement( 'style' );

            style.id = 'yt-downloader-styles';
            style.innerText = css;
            document.head.appendChild( style );
        }
    }
}());
