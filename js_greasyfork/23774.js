// ==UserScript==
// @name         Whatsapp Web - Image carrosel
// @namespace    http://whatsappweb.com/imagecarrosel
// @version      0.1.2
// @description  Whatsapp web media slide show!
// @author       ViZeke
// @match        https://web.whatsapp.com/
// @grant        none
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/23774/Whatsapp%20Web%20-%20Image%20carrosel.user.js
// @updateURL https://update.greasyfork.org/scripts/23774/Whatsapp%20Web%20-%20Image%20carrosel.meta.js
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

    addGlobalStyle( 'div.media-content { position: absolute; width: 100%; height: 100%; padding: 0; }' );
    addGlobalStyle( 'div.media-content button.btn-media-next { display: none; }' );
    addGlobalStyle( 'div.media-content button.btn-media-prev { display: none; }' );

    addGlobalStyle( 'div.media > div.object-fit > div { position: absolute; padding: 0; }' );

    var target;

    //Init on global context
    $( document ).ready( function() {

        function getMediaParent(baseElement) {
            let divMedia = baseElement.find('[role="button"][class]').siblings(':not([role])').find('div > div');
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
            // create an observer instance
            imageObserver = new MutationObserver( function( mutations ) {
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes.length > 0){
                        var divParent = getMediaParent(target);
                        // var divParent = $(mutation.addedNodes[0]).find('div');
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

                            if ( ( mediaObj.is( 'img' ) ) || ( mediaObj.is( 'video' ) ) )
                                if ( w / h > 1.78 ) {
                                    mediaObj.css( 'width', '100%' ).css( 'height', 'auto' );
                                    divParent.css( 'width', '100%' ).css( 'height', 'auto' );
                                } else {
                                    mediaObj.css( 'height', '100%' ).css( 'width', 'auto' );
                                    divParent.css( 'height', '100%' ).css( 'width', 'auto' );
                                }
                        }

                        // observer.disconnect();
                    }
                });
            });

            // configuration of the observer:
            var config = { childList: true, subtree: true };

            // pass in the target node, as well as the observer options
            imageObserver.observe( target[0], config );
        }

        var messagesObserver;
        function observeMessages() {
            if ( messagesObserver ) {
                messagesObserver.disconnect();
            }

            var targetMessages = $( '#main .copyable-area:first > div > div:last' )[ 0 ];
            messagesObserver = new MutationObserver( function( mutations ) {
                nextMedia();
            } );

            // configuration of the observer:
            var config = { childList: true };

            // pass in the target node, as well as the observer options
            messagesObserver.observe( targetMessages, config );
        }

        var timeOutNext;
        function startTimeOutNext( transitionInterval ) {
            transitionInterval = transitionInterval || DEFAULT_INTERVAL;

            if ( timeOutNext ) {
                clearTimeout( timeOutNext );
            }

            timeOutNext = setTimeout( function() {
                timeOutNext = undefined;
                nextMedia( transitionInterval );
            }, transitionInterval );
        }

        function nextMedia() {
            if ( !timeOutNext ) {
                // Send KeyDown Event
                let event = new Event( 'keydown' );
                event.keyCode = 39; // keyright
                window.dispatchEvent( event );
            }
        }

        function startObservers() {
            target = $( '#app > div > span:nth-child(2)' );
            observeImages();
            observeMessages();
        }

        $( 'body' ).on( 'click', '#pane-side > div > div > div > div', startObservers );
    } );

} )( jQuery );
