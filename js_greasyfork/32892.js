// ==UserScript==
// @name         Whatsapp Wall
// @namespace    http://whatsappweb.com/whatsapp-wall
// @version      0.2.2
// @description  Whatsapp web media slide show!
// @author       Tom Van Rossom
// @match        https://web.whatsapp.com/
// @grant        none
// @supportURL   https://github.com/tomvanrossom/Whatsapp-Wall
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/32892/Whatsapp%20Wall.user.js
// @updateURL https://update.greasyfork.org/scripts/32892/Whatsapp%20Wall.meta.js
// ==/UserScript==

( function( $ ) {
    const DEFAULT_INTERVAL = 5000;

    function addGlobalStyle( css ) {
        let head;
        let style;
        head = document.getElementsByTagName( 'head' )[ 0 ];
        if ( !head ) {
            return;
        }
        style = document.createElement( 'style' );
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild( style );
    }

    //Init
    addGlobalStyle( '.media-viewer-thumbs-container { display: none; }' );
    addGlobalStyle( '.menu.menu-horizontal.media-panel-tools { display: none; }' );

    addGlobalStyle( 'div.chat.media-chat { background-color: transparent; color: white; }' );
    addGlobalStyle( 'div.chat-body { background-color: rgba(255,255,255,0.8); flex-grow: 0; padding: 8px; border-radius: 4px; }' );

    addGlobalStyle( 'div.media-panel-header { z-index: 999; background-color: transparent; }' );
    addGlobalStyle('span.media-caption { z-index: 999; background-color: white; padding: 15px; border-radius: 5px; }');

    addGlobalStyle('div.media-content { background-color: black; position: absolute; width: 100%; height: 100%; padding: 0; }');
    addGlobalStyle( '.btn-round { z-index: -1; }' );

    addGlobalStyle( 'div.media > div.object-fit > div { position: absolute; padding: 0; }' );
    addGlobalStyle( '.media-viewer .avatar { height: 120px !important; width: 120px !important; margin-top: 110px;}' );
    addGlobalStyle( '.media-viewer div.chat-body { max-height: 40px; margin-top: 110px; }' );
    addGlobalStyle( '.fadeIn {animation: fadeInOut 10s; transition: transform 5s linear; transform: scale(1.1);}' );    
    addGlobalStyle( '@keyframes fadeInOut {    0% {        opacity: 0;    }    5% {       opacity: 1;    }    45% {       opacity: 1;    }    50% {       opacity: 0;    }  100% {       opacity: 0;    }}' );    
    addGlobalStyle( '.media-viewer .avatar {border: 1px solid white; }' );


    //Init on global context
    $( document ).ready( function() {

        var uniqueImages = new Set();
        var currentImage;
        var imagePointer;
        var newImages=false;

        function getMediaParent() {
            let divMedia = $( 'div.media > div.object-fit > div' );
            if ( divMedia.length > 0 ) {
                return divMedia;
            } else {
                if ( $( 'div.media > audio' ).length > 0 ) {
                    return $( 'div.media' );
                }
            }
        }
        var imageObserver;
        function observeImages() {
            if ( imageObserver ) {
                imageObserver.disconnect();
            }

            // select the target node
            var target = $( '#app > div > span:nth-child(2)' )[ 0 ];
            // create an observer instance
            imageObserver = new MutationObserver( function( mutations ) {
                //console.log('observeImages');
                //console.log(mutations);
                var divParent = getMediaParent();
                if(divParent){
                    var h = divParent.height();
                    var w = divParent.width();
                    var mediaObj = $( divParent.children()[ 0 ] );

                    if ( mediaObj[ 0 ] ) {
                        if ( mediaObj.is( 'img' ) ) {
                            mediaObj.load( function( e ) {
                                startTimeOutNext();
                            } );
                        }

                        mediaObj[ 0 ].addEventListener( 'loadeddata', function( e ) {
                            startTimeOutNext( e.target.duration * 1000 );
                        }, false );

                        if (( mediaObj.is('img') ) || ( mediaObj.is('video') )) {

                            var src = mediaObj.attr('src');
                            currentImage = src;
                            //console.log('currentImage: ' + currentImage);
                            if(src){
                                uniqueImages.add(src);
                            }
                            //console.log('totalImages: ' + uniqueImages.size);
                            //console.log(uniqueImages);


                            if ( mediaObj.is('img') ){
                                mediaObj.addClass('fadeIn');
                            }
                            if ( w / h > 1.78 ) {
                                mediaObj.css( 'width', '100%' ).css( 'height', 'auto' );
                                divParent.css( 'width', '100%' ).css( 'height', 'auto' );
                            } else {
                                mediaObj.css( 'height', '100%' ).css( 'width', 'auto' );
                                divParent.css( 'height', '100%' ).css( 'width', 'auto' );
                            }
                        }
                    }else{
                        console.log('not image or video!? ');
                        startTimeOutNext();
                    }
                }
                // observer.disconnect();
            } );

            // configuration of the observer:
            var config = { childList: true, subtree: true };

            // pass in the target node, as well as the observer options
            imageObserver.observe( target, config );
        }

        var messagesObserver;
        function observeMessages() {
            if ( messagesObserver ) {
                messagesObserver.disconnect();
            }

            var target = $( '#main > div.pane-body.pane-chat-tile-container > div > div > div.message-list' )[ 0 ];
            messagesObserver = new MutationObserver( function( mutations ) {
                console.log('observeMessages');
                //console.log(mutations);

                let newImageMessages = searchNewImageMessages(mutations);
                if (newImageMessages.length > 0) {
                    //console.log(newImageMessages);
                    console.log('New images/videos have arrived');                    
                    newImages = true;
                    nextMedia();
                }
            } );

            // configuration of the observer:
            var config = { childList: true };

            // pass in the target node, as well as the observer options
            messagesObserver.observe( target, config );
        }

        function searchNewImageMessages (mutations) {
            return mutations.map(function (mutation) {
                console.log('map');
                return mutation.addedNodes;
            }).reduce(function (allMutations, mutationNodes) {
                console.log('reduce');
                allMutations.push(mutationNodes[0]);

                return allMutations;
                /* This is important! */
            }, []).filter(function (node) {
                console.log('filter');
                return node && node.className && node.className.indexOf('msg') > -1;
            }).map(function (node) {
                console.log('map 2');
                return node.children[1];
            }).filter(function (node) {
                console.log('filter 2');
                return node && node.className && (node.className.indexOf('message-image') > -1 || node.className.indexOf('message-video') > -1);
            });

        }

        var timeOutNext;
        function startTimeOutNext( transitionInterval ) {
            transitionInterval = transitionInterval || DEFAULT_INTERVAL;

            if ( timeOutNext ) {
                clearTimeout( timeOutNext );
            }

            timeOutNext = setTimeout( function() {
                timeOutNext = undefined;
                nextMedia();
            }, transitionInterval );
        }

        function nextMedia() {
            if ( !timeOutNext ) {
                console.log('nextMedia');
                fadeOut();


                var currImg = currentImageShown();
                if (newImages && !imagePointer) {
                    console.log('new images have arrived: store pointer');
                    imagePointer = currImg;
                }
                var src = goToNext();//normal

                if(!uniqueImages.has(src)){
                    console.log('image never shown before: do nothing: '+uniqueImages.size);                    
                }else{ 
                    if(newImages){
                        console.log('new images have arrived: go to first new image');
                        let prevSrc = null;
                        do {
                            prevSrc = src;
                            src = goToNext();
                            console.log('scroll forward to new');
                        } while (uniqueImages.has(src) && prevSrc !== src);
                        newImages = false;
                    } 
                    if (src === currImg) {
                        if(isItReallyTheEnd(src)){

                            console.log('The end: go back');
                            let prevSrc;
                            let index = uniqueImages.lenght * 2;
                            index = index < 100? 100:index;
                            while (prevSrc !== src || 0 > index--) {
                                console.log('scroll backwards to: '+imagePointer);
                                prevSrc = src;
                                src = goToPrevious();

                                if (imagePointer && imagePointer.localeCompare(src) === 0) {
                                    console.log('Previous location found: ' + imagePointer);
                                    imagePointer = undefined;
                                    goToNext();
                                    break;
                                }
                                if(prevSrc === src){
                                    console.log('The beginning?: maybe the same image is used multiple times');                        
                                    src = goToPrevious();
                                }

                            }
                            if (src === currImg) {
                                console.log('It is still stuck :(');
                                src = goToPrevious();
                                src = goToPrevious();
                            }
                        }
                    }
                }
                uniqueImages.add(src);
            }
        }

        function isItReallyTheEnd(src) {
            console.log('The end?: maybe the same image is used multiple times');                        
            let prevSrc = src;
            let index = 5;
            while (prevSrc === src && 0 < index--) {                
                prevSrc = src;
                console.log('check next');
                src = goToNext();
            }
            return prevSrc === src;
        }

        function goToNext() {
            // Send KeyDown Event
            let event = new Event('keydown');
            event.keyCode = 39; // keyright
            window.dispatchEvent(event);

            return currentImageShown();
        }


        function goToPrevious() {
            // Send KeyDown Event
            let event = new Event('keydown');
            event.keyCode = 37; // keyleft
            window.dispatchEvent(event);

            return currentImageShown();
        }

        function currentImageShown() {
            var divParent = getMediaParent();
            if (divParent && divParent.children) {
                var mediaObj = $(divParent.children()[0]);
                if (( mediaObj.is('img') ) || ( mediaObj.is('video') )) {

                    return mediaObj.attr('src');
                }
            }
            console.log('Something is not right');
            startTimeOutNext();
            return 'not found';
        }

        function fadeOut() {
            var divParent = getMediaParent();
            if (divParent && divParent.children) {
                var mediaObj = $(divParent.children()[0]);
                if (( mediaObj.is('img') ) || ( mediaObj.is('video') )) {

                    mediaObj.removeClass('fadeIn');
                }
            }
        }


        function startObservers() {
            console.log('startObservers');
            observeImages();
            observeMessages();
        }

        $( 'body' ).on( 'click', '#pane-side > div > div > div > div', startObservers );
    } );

} )( jQuery );
